import get from 'lodash/get';

export default class PciTrainingJobsSubmitController {
  /* @ngInject */
  constructor($translate, PciProjectTrainingJobService, atInternet) {
    this.$translate = $translate;
    this.PciProjectTrainingJobService = PciProjectTrainingJobService;
    this.atInternet = atInternet;
  }

  $onInit() {
    // Form payload
    this.job = {
      region: null,
      image: {
        id: null,
      },
      command: null,
      user: null,
      data: [],
      resources: {
        gpu: 1,
      },
    };

    // Load available regions
    this.allRegionsLoaded = false;
    this.regions()
      .then((regions) => {
        this.regions = regions;
      })
      .finally(() => {
        this.allRegionsLoaded = true;
      });

    // Load users
    this.allUsersLoaded = false;
    this.allUsers()
      .then((users) => {
        this.users = users.map((user) => {
          return {
            name: user.username,
            description: `${user.username} (${user.description})`,
          };
        });
      })
      .finally(() => {
        this.allUsersLoaded = true;
        if (this.users.length === 1) {
          // eslint-disable-next-line prefer-destructuring
          this.job.user = this.users[0];
        }
      });

    this.showAdvancedImage = false;
  }

  setData() {
    this.dataSource = this.data
      .filter(
        ({ region, user }) =>
          region === this.job.region.name && user === this.job.user.name,
      )
      .map(({ name, id }) => {
        return {
          name: `${id}:/workspace/${name}`,
          display: `${name} (/workspace/${name})`,
        };
      });
    this.job.data = [];
    this.emptyData = this.dataSource.length === 0;
  }

  cliCommand() {
    const baseCmdArray = [
      'job',
      'submit',
      '\\\n\t',
      '--profile',
      this.job.region.name,
      '\\\n\t',
      '--image',
      this.job.image.id,
      '\\\n\t',
      '--gpu',
      this.job.resources.gpu,
    ];

    if (this.job.data && this.job.data.length > 0) {
      baseCmdArray.push('\\\n\t');
      baseCmdArray.push(
        this.job.data.map(({ name }) => `--data ${name} `).join('\\\n\t'),
      );
    }

    if (this.job.command) {
      baseCmdArray.push('\\\n\t');
      baseCmdArray.push(`-- ${this.job.command}`);
    }

    return baseCmdArray.join(' ');
  }

  splitStringCommandIntoArray() {
    if (this.job.command) {
      return this.job.command.match(/(\w|-)+|"[^"]+"/g).map((elt) => {
        if (elt.startsWith('"') && elt.endsWith('"')) {
          return elt.substring(1, elt.length - 1);
        }
        return elt;
      });
    }
    return [];
  }

  computeJobSpec() {
    const payload = {
      image: this.job.image.id,
      region: this.job.region.name,
      user: this.job.user.name,
      data: this.job.data.map(({ name }) => name),
      resources: {
        cpu: this.job.resources.cpu,
        gpu: this.job.resources.gpu,
        mem: this.job.resources.mem,
      },
    };
    if (this.job.command) {
      payload.command = this.splitStringCommandIntoArray();
    }
    return payload;
  }

  onStepperFinish() {
    this.submitJob();
  }

  onClickAdvancedImage() {
    this.showAdvancedImage = !this.showAdvancedImage;
  }

  submitJob() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::jobs::submit::confirm',
      type: 'action',
    });

    this.isSubmit = true;
    this.PciProjectTrainingJobService.submit(
      this.projectId,
      this.computeJobSpec(),
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_jobs_list_submit_success',
          ),
        ),
      )
      .catch((error) => {
        this.error = get(error, 'data.message');
      })
      .finally(() => {
        this.isSubmit = false;
      });
  }
}