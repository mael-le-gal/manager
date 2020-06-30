import illustration from './assets/partner.png';

export default class PciServingOnboardingController {
  $onInit() {
    this.labAccepted = false;
    this.illustration = illustration;
  }

  acceptLab(accepted) {
    this.labAccepted = accepted;
  }
}
