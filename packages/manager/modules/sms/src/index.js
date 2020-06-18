import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import ovhManagerCore from '@ovh-ux/manager-core';

import sms from './sms';

import { SMS_AVAILABILITY } from './feature-availability/feature-availability.constants';

const moduleName = 'ovhManagerSmsLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', sms, ovhManagerCore])
  .config(
    /* @ngInject */ ($urlRouterProvider) => {
      $urlRouterProvider.otherwise('/sms');
    },
  )
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider
        .state('sms', {
          url: '/sms',
          abstract: true,
        })
        .state('sms.index.**', {
          url: '',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./sms.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        });
    },
  );

export default moduleName;
export { SMS_AVAILABILITY };
