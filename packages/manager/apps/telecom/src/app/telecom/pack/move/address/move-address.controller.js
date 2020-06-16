import { UNBUNDLING } from '../pack-move.constant';

export default class MoveAddressCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    this.portLineNumber = false;
    this.keepLineNumber = false;
  }

  /**
   * Check if can keep line number
   * @returns {boolean}
   */
  canKeepLineNumber() {
    const canKeep =
      this.offer.selected.portability &&
      this.offer.selected.portability.eligibility.eligible &&
      this.offer.selected.unbundling !== UNBUNDLING.partial;
    if (!canKeep) {
      this.keepLineNumber = false;
    }
    return canKeep;
  }

  next() {
    const form = {
      currentLandline: {
        lineNumber: this.lineNumber,
        portLineNumber: this.portLineNumber,
      },
      futureLandline: {
        lineNumber: this.futureLineNumber,
        keepLineNumber: this.keepLineNumber,
        rio: this.rio,
      },
    };
    this.$scope.$emit('savedNumber', form);
  }
}
