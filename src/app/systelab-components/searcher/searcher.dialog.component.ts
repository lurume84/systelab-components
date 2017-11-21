import { Component, ViewChild } from '@angular/core';
import { ModalComponent, DialogRef } from 'angular2-modal';
import { SearcherTableComponent } from './searcher.table.component';
import { I18nService } from 'systelab-translate/lib/i18n.service';
import { AbstractSearcher } from './abstract-searcher';
import { DefaultModalActions } from '../modal/message-popup/message-popup-view.component';
import { ModulabModalContext } from '../modal/plugin/modulab/modal-context';

export class SearcherDialogParameters<T> extends ModulabModalContext {
	public valueToSearch: string;
	public searcher: AbstractSearcher<T>;
}

@Component({
	selector:    'searcher.dialog',
	templateUrl: 'searcher.dialog.component.html'
})
export class SearcherDialog<T> extends DefaultModalActions implements ModalComponent<SearcherDialogParameters<T>> {

	@ViewChild(SearcherTableComponent)
	public tableComponent: SearcherTableComponent<T>;
	public dialogParameters: SearcherDialogParameters<T>;
	public searchingValue: string;
	public comboElements: Array<Object>;
	public selectedComboItem: any;
	public searchLabel: string;
	public titleForDialog: string;
	public multipleSelection: boolean = false;

	constructor(public dialog: DialogRef<SearcherDialogParameters<T>>, protected i18nService: I18nService) {
		super(dialog);
		this.dialogParameters = dialog.context;
		this.searchingValue = this.dialogParameters.valueToSearch;

		this.selectedComboItem = {};
		this.setSelectedComboItem(1, this.i18nService.instant('COMMON_STARTS_WITH'));

		this.comboElements = [
			{ description: this.i18nService.instant('COMMON_STARTS_WITH'), id: 1 },
			{ description: this.i18nService.instant('COMMON_CONTAINS'), id: 2 }
		];

		this.searchLabel = this.dialogParameters.searcher.getTextForSearcherLabel();
		this.titleForDialog = this.dialogParameters.searcher.getTitleForDialog();
		this.multipleSelection = this.dialogParameters.searcher.multipleSelection;

	}

	public submit(): void {

		this.dialog.close(this.tableComponent.getSelectedElements());
	}

	public refreshSearch(event: any): void {
		if (event && event.id) {
			this.setSelectedComboItem(event.id, event.description);
		}
		this.tableComponent.refreshTable();
	}

	public selectOnClick(data: T) {
		if (!this.multipleSelection) {
			if (data) {
				let arr: Array<T> = new Array<T>();
				arr.push(data);
				this.dialog.close(arr);
			}
		}
	}

	private setSelectedComboItem(id: number, description: string) {
		this.selectedComboItem.id = id;
		this.selectedComboItem.description = description;
	}

}

