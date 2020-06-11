import filter from 'lodash/filter';
import find from 'lodash/find';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import uniq from 'lodash/uniq';

const MAX_SERVICES_TO_DISPLAY = 200;

angular
  .module('managerApp')
  .controller(
    'voipServiceChoicePopoverCtrl',
    function voipServiceChoicePopoverCtrl(
      $scope,
      $q,
      $translate,
      $translatePartialLoader,
      $filter,
      TelephonyMediator,
    ) {
      const self = this;

      self.loading = {
        init: false,
      };

      self.status = {
        move: false,
        toShow: null,
      };

      self.popoverStatus = {
        move: false,
        rightPage: null,
      };

      self.search = '';
      self.groupList = [];
      self.selectedService = null;

      self.filteredList = [];
      self.filteredListCount = 0;
      self.filteredListMaxSize = MAX_SERVICES_TO_DISPLAY;

      self.getServiceType = function getServiceType(service) {
        if (service.serviceType === 'alias') {
          return 'number';
        }
        if (service.isFax) {
          return 'fax';
        }
        if (service.isTrunk && service.isTrunk()) {
          return 'trunk';
        }
        return service.isPlugNFax ? 'plugAndFax' : 'sip';
      };

      self.excludeFilter = function excludeFilter(service) {
        if (angular.isArray(self.excludeServices)) {
          return self.excludeServices.indexOf(service.serviceName) < 0;
        }
        return true;
      };

      self.availableFilter = (service) => {
        if (self.availableTypes) {
          return (
            indexOf(self.availableTypes, self.getServiceType(service)) >= 0
          );
        }
        return true;
      };

      self.onValidate = function onValidate() {
        // close popover
        self.popoverOptions.popoverIsOpen = false;

        // call callback function
        if (self.onChoiceValidated()) {
          self.onChoiceValidated()(self.selectedService, self.choiceArgs);
        }
        delete self.selectedService;
        self.search = '';
      };

      self.onCancel = function onCancel() {
        // close popover
        self.popoverOptions.popoverIsOpen = false;

        // call callback function
        if (self.onChoiceCancel()) {
          self.onChoiceCancel()(self.choiceArgs);
        }
        delete self.selectedService;
        self.search = '';
      };

      self.$onInit = () => {
        self.loading.init = true;

        $scope.$watch('$ctrl.search', (newSearch, oldSearch) => {
          if (oldSearch !== newSearch) {
            // reset selected service
            self.selectedService = null;
            self.refreshFilteredList(newSearch);
          }
        });

        return $q
          .all({
            translations: $translate.refresh(),
            services: TelephonyMediator.getAll(),
          })
          .then((result) => {
            self.groupList = map(
              filter(
                uniq(map(result.services, 'billingAccount')),
                (id) => indexOf(self.hiddenGroups, id) < 0,
              ),
              (id) => find(TelephonyMediator.groups, { billingAccount: id }),
            );
            self.refreshFilteredList();
          })
          .finally(() => {
            self.loading.init = false;
          });
      };

      self.refreshFilteredList = (search) => {
        self.filteredList = [];
        self.filteredListCount = 0;

        self.groupList.forEach((group) => {
          const filteredServices = [];
          group.getAllServices().forEach((service) => {
            if (self.excludeFilter(service) && self.availableFilter(service)) {
              let found = search
                ? service.serviceName
                    .toString()
                    .toLowerCase()
                    .indexOf(search) >= 0
                : true;
              if (!found && service.description) {
                found =
                  service.description
                    .toString()
                    .toLowerCase()
                    .indexOf(search) >= 0;
              }
              if (found) {
                filteredServices.push(service);
                self.filteredListCount += 1;
              }
            }
          });
          if (filteredServices.length) {
            self.filteredList.push({
              group,
              filteredServices,
            });
          }
        });
      };
    },
  );
