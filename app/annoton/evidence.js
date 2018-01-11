import _ from 'lodash';
const each = require('lodash/forEach');

import AnnotonError from "./parser/annoton-error.js";

export default class Evidence {
  constructor() {
    this.evidence = {
      "validation": {
        "errors": []
      },
      "control": {
        "placeholder": '',
        "value": ''
      },
      "lookup": {
        "requestParams": null
      }
    };
    this.reference = {
      "validation": {
        "errors": []
      },
      "control": {
        "placeholder": '',
        "value": ''
      }
    };
    this.with = {
      "validation": {
        "errors": []
      },
      "control": {
        "placeholder": '',
        "value": ''
      }
    };

  }

  setEvidenceLookup(value) {
    this.evidence.lookup.requestParams = value;
  }

  setEvidenceOntologyClass(value) {
    this.evidence.ontologyClass = value;
  }

  setEvidence(value) {
    this.evidence.control.value = value;
  }

  setReference(value) {
    this.reference.control.value = value.reference;
  }

  setWith(value) {
    this.with.control.value = value.with;
  }


  clearValues() {
    const self = this;

    self.evidence.control.value = null;
    self.reference.control.value = null;
    self.with.control.value = null;
  }

  copyValues(node) {
    const self = this;

    self.evidence.control.value = node.evidence.control.value;
    self.reference.control.value = node.reference.control.value;
    self.with.control.value = node.with.control.value;
  }

  enableSubmit(errors, node) {
    const self = this;
    let result = true;

    if (!self.evidence.control.value.id) {
      let error = new AnnotonError(1, "No evidence for '" + node.label + "'")
      errors.push(error);
      result = false;
    }


    if (self.evidence.control.value.id && !self.reference.control.value) {
      let error = new AnnotonError(1, "You provided an evidence for '" + node.label + "' but no reference")
      errors.push(error);
      result = false;
    }

    return result;
  }
}