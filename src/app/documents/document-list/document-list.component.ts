import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(0o1, "Test File 01", "This is a test file", "http://test01.txt", []),
    new Document(0o2, "Test File 02", "This is another test file", "http://test02.txt", []),
    new Document(0o3, "Test File 03", "This is a third test file", "http://test03.txt", []),
    new Document(0o4, "Test File 04", "This is a fourth test file", "http://test04.txt", []),
  ];

  constructor() { }

  ngOnInit() {
  }

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document);
  }

}
