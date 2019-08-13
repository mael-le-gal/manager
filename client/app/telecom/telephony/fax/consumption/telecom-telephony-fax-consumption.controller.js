angular.module('managerApp').controller('TelecomTelephonyFaxConsumptionCtrl', function ($q, $stateParams, $translate, TelephonyMediator, TucToast) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.fax = null;
  self.actions = null;

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  function initActions() {
    const actions = [{
      name: 'fax_information',
      main: true,
      picto: 'ovh-font-faxReceiving',
      sref: 'telecom.telephony.fax.consumption.incomingFax',
      text: $translate.instant('telephony_group_fax_consumption_action_incoming_fax'),
    }, {
      name: 'fax_information',
      main: true,
      picto: 'ovh-font-faxEmitting',
      sref: 'telecom.telephony.fax.consumption.outgoingFax',
      text: $translate.instant('telephony_group_fax_consumption_action_outgoing_fax'),
    }];

    self.actions = actions;
  }

  self.$onInit = function () {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount).then((group) => {
      self.fax = group.getFax($stateParams.serviceName);
      initActions();
    }).catch((error) => {
      TucToast.error([$translate.instant('telephony_fax_loading_error'), _.get(error, 'data.message', '')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.init = false;
    });
  };

  /* -----  End of INITIALIZATION  ------ */
});
