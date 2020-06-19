import angular from 'angular';

import ngAtInternet from '@ovh-ux/ng-at-internet';
import managerCore from '@ovh-ux/manager-core';
import uiRouterAngularJs from '@uirouter/angularjs';
import oclazyload from 'oclazyload';
import 'ovh-api-services';

import { state } from './support.routing';

const moduleName = 'ovhManagerSupportLazyLoading';

angular
  .module(moduleName, [
    managerCore,
    ngAtInternet,
    oclazyload,
    'ovh-api-services',
    uiRouterAngularJs,
  ])
  .config(
    /* @ngInject */ ($urlRouterProvider) => {
      $urlRouterProvider.otherwise('/support/tickets');
    },
  )
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('support.**', {
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./support.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
        url: state.url,
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($transitions, $translate) => {
      $transitions.onBefore({ to: 'support.**' }, () => $translate.refresh());
    },
  );

export default moduleName;
