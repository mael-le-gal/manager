import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import 'ovh-ui-angular';

import currentAddress from './current';
import futureAddress from './future';

import address from './move-address.component';

const moduleName = 'ovhManagerTelecomPackMoveAddress';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
    currentAddress,
    futureAddress,
  ])
  .component('packMoveAddress', address);

export default moduleName;
