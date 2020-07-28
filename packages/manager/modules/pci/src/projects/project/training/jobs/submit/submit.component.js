import controller from './submit.controller';
import template from './submit.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    projectId: '<',
    user: '<',
    presetImages: '<',
    pricesCatalog: '<',
    allUsers: '<',
    regions: '<',
    data: '<',
    goToData: '<',
  },
};