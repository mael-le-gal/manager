import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default class SmsCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($http, $q, $rootScope, $translate, ouiDatagridService) {
    super($q, ouiDatagridService);
    this.$http = $http;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
  }

  $onInit() {
    this.datagridId = 'dg-sms';
    this.defaultFilterColumn = 'name';

    super.$onInit();

    this.$http
      .get('/me')
      .then(({ data }) => data)
      .then((user) => {
        this.user = user;
      });

    this.isSidebarVisible = false;
    this.$rootScope.$on('sidebar::toggle', () => {
      this.isSidebarVisible = !this.isSidebarVisible;
    });

    this.filtersOptions = {
      status: {
        hideOperators: true,
        values: this.smsStatusTypes.reduce(
          (statusTypes, statusType) => ({
            ...statusTypes,
            [statusType]: this.$translate.instant(
              `sms_status_label_${statusType}`,
            ),
          }),
          {},
        ),
      },
    };

    this.columnsConfig = [
      { name: 'name', sortable: this.getSorting('name') },
      { name: 'description', sortable: this.getSorting('description') },
      { name: 'status', sortable: this.getSorting('status') },
    ];
  }
}
