import controller from './list.controller';
import template from './list.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    dataList: '<',
    dataSync: '<',
    data: '<',
    dataInfo: '<',
    addDataLink: '<',
    goToContainer: '<',
  },
};
