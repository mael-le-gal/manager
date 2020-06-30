export default /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('pci.projects.project.training.jobs.info', {
      url: '/:jobId',
      views: {
        jobView: 'pciProjectTrainingJobsInfoComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ (jobId) => jobId,
        jobId: /* @ngInject */ ($transition$) => 
          $transition$.params().jobId,
        job: /* @ngInject */ (
          PciProjectTrainingJobsService,
          projectId,
          jobId
        ) => {
          console.log("Getting list of jobs")
          return PciProjectTrainingJobsService.get(projectId, jobId)
        },
      },
    });
  };
