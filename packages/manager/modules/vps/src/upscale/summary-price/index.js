import angular from 'angular';

import 'angular-translate';
import 'ovh-ui-angular';

import './summary-price.scss';

import component from './summary-price.component';

const moduleName = 'ovhManagerVpsUpscaleSummaryPrice';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vpsUpscaleSummaryPrice', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
