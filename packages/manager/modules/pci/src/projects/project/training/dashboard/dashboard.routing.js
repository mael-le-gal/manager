export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.dashboard', {
    url: '/dashboard',
    component: 'pciProjectTrainingDashboardComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_dashboard_title'),
      usage: /* @ngInject */ (OvhApiCloudProjectUsageCurrent, projectId) =>
        OvhApiCloudProjectUsageCurrent.v6().get({ serviceName: projectId }),
      currencySymbol: /* @ngInject */ (OvhApiMe) =>
        OvhApiMe.v6()
          .get()
          .$promise.then((me) => {
            return me.currency.symbol;
          }),
    },
  });
};
