import Organization from './organization.class';

export default class PciProjectTrainingService {
  /* @ngInject */
  constructor(OvhApiCloudProjectAi, OvhApiCloudProjectUser) {
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
    this.OvhApiCloudProjectUser = OvhApiCloudProjectUser;
  }

  // Check if the given projectId has already been authorized on training platform
  isAuthorized(projectId) {
    return this.OvhApiCloudProjectAi
      .Training()
      .Authorization()
      .v6()
      .get({
        serviceName: projectId
      })
      .$promise
      .then((authorization) => authorization.authorized);
  }

  createAuthorization(projectId) {
    return this.OvhApiCloudProjectAi
      .Training()
      .Authorization()
      .v6()
      .save({
        serviceName: projectId,
      })
      .$promise
      .then(() => true);
  }

  getAllUsers(projectId) {
    this.OvhApiCloudProjectUser.v6().resetQueryCache();
    return this.OvhApiCloudProjectUser.v6().query({
      serviceName: projectId,
    }).$promise;
  }

  getAllRegions(projectId) {
    return Promise.resolve([{
      name: 'GRA',
      hasEnoughQuota: () => true,
    }]);
  }
}
