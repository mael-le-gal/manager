import map from 'lodash/map';

export default class PciProjectTrainingService {
  /* @ngInject */
  constructor(
    $q,
    OvhApiCloudProjectAi,
    OvhApiCloudProjectUser,
    CucPriceHelper,
  ) {
    this.$q = $q;
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
    this.OvhApiCloudProjectUser = OvhApiCloudProjectUser;
    this.CucPriceHelper = CucPriceHelper;
    this.currentRegistry = null;
  }

  // Check if the given projectId has already been authorized on training platform
  isAuthorized(projectId) {
    return this.OvhApiCloudProjectAi.Training()
      .Authorization()
      .v6()
      .get({
        serviceName: projectId,
      })
      .$promise.then((authorization) => authorization.authorized);
  }

  createAuthorization(projectId) {
    return this.OvhApiCloudProjectAi.Training()
      .Authorization()
      .v6()
      .save({
        serviceName: projectId,
      })
      .$promise.then(() => true);
  }

  getAllUsers(projectId) {
    this.OvhApiCloudProjectUser.v6().resetQueryCache();
    return this.OvhApiCloudProjectUser.v6().query({
      serviceName: projectId,
    }).$promise;
  }

  getPresetImages(serviceName) {
    return this.OvhApiCloudProjectAi.Capabilities()
      .Training()
      .PresetImage()
      .v6()
      .query({
        serviceName,
      }).$promise;
  }

  getFeatures(serviceName) {
    /* return this.OvhApiCloudProjectAi.Capabilities()
      .Training()
      .Feature()
      .v6()
      .query({
        serviceName,
      }).$promise; */
    return Promise.resolve({ registry: true, dashboard: true });
  }

  getRegistry(serviceName) {
    /* return this.OvhApiCloudProjectAi.Capabilities()
      .Training()
      .Registry()
      .v6()
      .query({
        serviceName,
      }).$promise; */
    if (this.currentRegistry != null) {
      return Promise.resolve(this.currentRegistry);
    }
    return Promise.resolve({ custom: false });
  }

  saveRegistry(serviceName, url, username, password) {
    const registrySpec = { custom: true, url, username, password };
    /* return this.OvhApiCloudProjectAi.Capabilities()
      .Training()
      .Registry()
      .v6()
      .save({ serviceName }, registrySpec).$promise; */
    this.currentRegistry = registrySpec;
    return Promise.resolve(registrySpec);
  }

  deleteRegistry(serviceName) {
    /* return this.OvhApiCloudProjectAi.Capabilities()
      .Training()
      .Registry()
      .v6()
      .delete({
        serviceName,
      }).$promise; */
    this.currentRegistry = null;
    return Promise.resolve();
  }

  getPricesFromCatalog(serviceName) {
    return this.CucPriceHelper.getPrices(serviceName);
  }

  getRegions(serviceName) {
    return this.OvhApiCloudProjectAi.Capabilities()
      .Training()
      .Region()
      .v6()
      .query({
        serviceName,
      })
      .$promise.then((regions) => {
        const promises = map(regions, (regionName) => ({
          name: regionName,
          hasEnoughQuota: () => true,
        }));
        return this.$q.all(promises);
      });
  }
}
