import { GUIDE_URL } from '../training.constants';

export default class PciTrainingInstallController {
  /* @ngInject */
  constructor(CucCloudMessage, CucRegionService) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
  }

  $onInit() {
    this.loadMessages();
    this.guideUrl = GUIDE_URL;
    this.osInstall = {
      Linux: 'curl https://console.$partner.com/cli/install | sh',
      'Mac OS': 'curl https://console.$partner.com/cli/install | sh',
    };
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training.install',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
