import controller from './dashboard.controller';
import template from './dashboard.html';

export default {
  controller,
  template,
  bindings: {
    trainingFeatures: '<',
    registry: '<',
    goToJobSubmit: '<',
    goToDataCreate: '<',
    goToDashboard: '<',
    dashboardLink: '<',
    goToRegistryAttach: '<',
    registryAttachLink: '<',
    goToRegistryDetach: '<',
    registryDetachLink: '<',
    installLink: '<',
    jobList: '<',
    refreshState: '<',
    submitJobLink: '<',
    saveRegistry: '<',
    deleteRegistry: '<',
  },
};
