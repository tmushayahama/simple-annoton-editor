//
// App Controller
//  Primary controller driving the table-mode
//

/* global angular */

export default class AppController {
  constructor(saeConstants, $scope, $rootScope, $http, $timeout, $mdDialog, $mdToast, uiGridTreeViewConstants, graph, lookup, formGrid, summaryGrid) {
    var tvc = this;
    this.saeConstants = saeConstants;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.uiGridTreeViewConstants = uiGridTreeViewConstants;
    tvc.$timeout = $timeout;
    tvc.lookup = lookup;
    tvc.graph = graph;
    tvc.formGrid = formGrid;
    tvc.summaryGrid = summaryGrid;

    var userNameInfo = document.getElementById('user_name_info');
    if (userNameInfo) {
      userNameInfo.innerHTML = '';
    }

    tvc.summaryView = {
      options: {
        grid: 0,
        list: 1
      },
    };
    tvc.summaryView.selected = 0;

    /* Init the form grid */
    //tvc.formGrid.registerApi();
    tvc.formGrid.initalizeForm();
    // tvc.formGrid.expandAll();
    /* Init the summary grid */
    //tvc.summaryGrid.registerApi();

    /* Attach the tvc to the gridScope */
    // tvc.formGrid.gridOptions.appScopeProvider = tvc;





    $rootScope.$on('rebuilt', function (event, data) {
      const gridData = data.gridData;

      tvc.summaryGrid.summaryData = gridData;
      //tvc.summaryGrid.gridOptions.data = gridData;
      //tvc.summaryGrid.gridOptions.appScopeProvider = tvc;
      // tvc.summaryGrid.gridOptions.expandableRowScope = tvc;
      // tvc.summaryGrid.setSubGrid(gridData)
      //tvc.summaryGrid.registerApi();


    });

    graph.initialize();
  }

  setView(view) {
    this.viewMode.selected = view;
  }

  getTerm(field) {
    let result = null;
    if (field && field.control.value && field.control.value.length >= 3) {
      //let oldValue = this.editingModel[field];
      // console.log('getTerm', field, oldValue, term);
      result = this.lookup.golrLookup(field); // delete?, this.fieldToRoot[field]);
      console.log('result', result);
    }
    return result;
  }

  openGeneListnDialogDialog(ev, row) {
    this.$mdDialog.show({
        controller: 'GeneListnDialogController as annotonCtrl',
        templateUrl: './dialogs/gene-list/gene-list-dialog.html',
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: {
          row: row
        }
      })
      .then(function (answer) {}, function () {});
  }

  openViewSummaryDialogDialog(ev, summaryRow) {
    this.$mdDialog.show({
        controller: 'ViewSummaryDialogController as annotonCtrl',
        templateUrl: './dialogs/view-summary/view-summary-dialog.html',
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: {
          summaryRow: summaryRow
        }
      })
      .then(function (answer) {}, function () {});
  }

  openEditAnnotonDialogDialog(ev, row) {
    this.$mdDialog.show({
        controller: 'EditAnnotonDialogController as annotonCtrl',
        templateUrl: './dialogs/edit-annoton/edit-annoton-dialog.html',
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: {
          row: row
        }
      })
      .then(function (answer) {}, function () {});
  }

  openAddEvidenceDialogDialog(ev, entity) {
    this.$mdDialog.show({
        controller: 'AddEvidenceDialogController as annotonCtrl',
        templateUrl: './dialogs/add-evidence/add-evidence-dialog.html',
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: {
          entity: entity
        }
      })
      .then(function (answer) {}, function () {});
  }

  openAnnotonErrorsDialogDialog(ev, annoton, errors) {
    this.$mdDialog.show({
        controller: 'AnnotonErrorsDialogController as errorsCtrl',
        templateUrl: './dialogs/annoton-errors/annoton-errors-dialog.html',
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: {
          annoton: annoton,
          errors: errors
        }
      })
      .then(function (answer) {}, function () {});
  }

  saveRowEnabled(patternForm) {
    let reasons = [];

    if (this.editingModel) {
      if (!this.editingModel.GP) {
        reasons.push('Select a Gene Product (GP)');
      }

      let hasAtLeastOneElement = false;

      if (reasons.length === 0 && this.editingModel.MF) {
        if (!this.editingModel.MFe) {
          reasons.push('Select Evidence for the MF.');
        } else {
          hasAtLeastOneElement = true;
        }
      }

      if (reasons.length === 0 && this.editingModel.BP) {
        if (!this.editingModel.BPe) {
          reasons.push('Select Evidence for the BP');
        } else {
          hasAtLeastOneElement = true;
        }
      }

      if (reasons.length === 0 && this.editingModel.CC) {
        if (!this.editingModel.CCe) {
          reasons.push('Select Evidence for the CC');
        } else {
          hasAtLeastOneElement = true;
        }
      }

      if (reasons.length === 0 && !hasAtLeastOneElement) {
        reasons.push('At least one Aspect required.');
      }

      if (reasons.length === 0 && patternForm.referenceMF.$error.pattern) {
        reasons.push('Please use CURIE format for MF Reference.');
      }
      if (reasons.length === 0 && patternForm.referenceBP.$error.pattern) {
        reasons.push('Please use CURIE format for BP Reference.');
      }
      if (reasons.length === 0 && patternForm.referenceCC.$error.pattern) {
        reasons.push('Please use CURIE format for CC Reference.');
      }
      if (reasons.length === 0 && patternForm.withMF.$error.pattern) {
        reasons.push('Please use CURIE format for MF With.');
      }
      if (reasons.length === 0 && patternForm.withBP.$error.pattern) {
        reasons.push('Please use CURIE format for BP With.');
      }
      if (reasons.length === 0 && patternForm.withCC.$error.pattern) {
        reasons.push('Please use CURIE format for CC With.');
      }
    }

    // console.log('saveRowEnabled', this.editingModel, reasons);
    return reasons;
  }


  saveAnnoton() {
    const self = this;

    if (this.graph.saveAnnoton(this.formGrid.annoton)) {
      self.$mdToast.show(
        self.$mdToast.simple()
        .textContent('Annoton Saved Successfully')
        .position('top right')
        .action('OK')
        .theme("success-toast")
        .hideDelay(0)
      );


    }

  }

  editRow(row) {
    const self = this;

    self.formGrid.clearForm();
    // self.summaryGrid.setSubGridEdit(row);

    self.formGrid.gridOptions.data = row.annoton.nodes;
    console.log(JSON.stringify(row.annoton.print()))
  }

  deleteRow(row) {
    if (window.confirm('Are you sure you wish to delete this row?')) {
      this.graph.deleteAnnoton(row.Annoton);
    }
  }
}
AppController.$inject = ['saeConstants', '$scope', '$rootScope', '$http', '$timeout', '$mdDialog', '$mdToast', 'uiGridTreeViewConstants', 'graph', 'lookup', 'formGrid', 'summaryGrid'];