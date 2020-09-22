import flatten from 'lodash/flatten';
import map from 'lodash/map';
import filter from 'lodash/filter';
import illustration from '../assets/partner.png';

export default class PciTrainingDashboardController {
  /* @ngInject */
  constructor(CucCloudMessage, CucRegionService, atInternet) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.illustration = illustration;
    [this.currentRegion] = this.regions;

    this.loadMessages();
    this.resourceUsage = flatten(
      map(
        filter(this.usage.resourcesUsage, {
          type: 'ai-training',
        }),
        'totalPrice',
      ),
    ).reduce((a, b) => a + b, 0);

    this.eaiDocsUrl = '';
    this.runningJobs = this.getJobsWithSelector((job) => job.isRunning());
    this.nbRunning = this.runningJobs.length;
    this.nbSuccess = this.getJobsNumberWithSelector((job) => job.isSuccess());
    this.nbFailed = this.getJobsNumberWithSelector((job) => job.isFailed());
    this.nbOther =
      this.jobList.length - this.nbSuccess - this.nbFailed - this.nbRunning;

    // Load users
    this.allUsersLoaded = false;
    this.allUsers()
      .then((users) => {
        this.users = users;
      })
      .finally(() => {
        this.allUsersLoaded = true;
      });
  }

  changeRegion(region) {
    this.currentRegion = region;
  }

  getAllUsersAsStrings() {
    return this.users.map((user) => {
      if (user.description) {
        return `${user.username} (${user.description})`;
      }
      return user.username;
    });
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training.dashboard',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getJobsWithSelector(selectFunction) {
    return this.jobList.filter((job) => selectFunction(job));
  }

  getJobsNumberWithSelector(selectFunction) {
    return this.getJobsWithSelector(selectFunction).length;
  }

  goToJobSubmitTracking() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::dashboard::add-job',
      type: 'action',
    });

    return this.goToJobSubmit();
  }

  attachRegistry() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::dashboard::attach-registry::confirm',
      type: 'action',
    });

    return this.goToRegistryAttach();
  }

  goToRegistryDetachTracking() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::dashboard::detach-registry::confirm',
      type: 'action',
    });

    return this.goToRegistryDetach();
  }
}
