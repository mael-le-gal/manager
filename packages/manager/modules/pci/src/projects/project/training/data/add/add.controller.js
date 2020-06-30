export default class PciTrainingDataAddController {
  /* @ngInject */
  constructor(PciProjectStorageContainersService, CucCloudMessage, CucRegionService) {
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
  }

  $onInit() {
    // Load available regions
    this.allRegionsLoaded = false;
    this.allRegions()
      .then((regions) => {
        this.regions = regions;
      })
      .finally(() => {
        this.allRegionsLoaded = true;
      });

    // Load avaliable users
    this.allUsersLoaded = false;
    this.allUsers()
      .then((users) => {
        this.users = users.map((user) => {
          return {
            name: user.username,
            description: user.username + ' (' + user.description + ')',
          }
        });
      })
      .finally(() => {
        this.allUsersLoaded = true;
      });

    // Data payload
    this.data = {
      region: null,
      container: null,
      user: null,
    }

    this.loadMessages();

    // Load available object storage containers
    this.allContainers = [];
    this.allContainersLoaded = false;
    this.loadAllContainers();

    this.filteredContainers = [];
  }

  onRegionSubmit() {
    console.log('onRegionSubmit...' + JSON.stringify(this.data));
    this.data.container = null;
    this.filteredContainers = this.filterContainers();
    console.log('Filtered ' +  JSON.stringify(this.filteredContainers))
  }

  onContainerSubmit() {
    console.log('onContainerSubmit...' + JSON.stringify(this.data))
  }

  computeDataSpec() {
    return {
      name: this.data.container.name,
      region: this.data.region.name,
      user: this.data.user.name
    }
  }

  onStepperFinish() {
    const dataSpec = this.computeDataSpec();
    console.log('onStepperFinish...' + JSON.stringify(dataSpec));
    this.attachData(dataSpec);
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training.data.add',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  loadAllContainers() {
    this.PciProjectStorageContainersService.getAll(this.projectId)
      .then((containers) => {
        this.allContainers = containers;
      })
      .finally(() => {
        this.allContainersLoaded = true;
      });
  }

  filterContainers() {
    return this.allContainers.filter(
      ({ region, archive }) =>
        region === this.data.region.name && !archive,
    )
    .map(({ name }) => {
      return {
        name,
        description: `${name} - ${this.data.region.name}`,
      };
    });
  }
  
}
