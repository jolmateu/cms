import { Injectable, EventEmitter } from '@angular/core';
import { MaxValidator } from '@angular/forms';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  /* documentChangedEvent = new EventEmitter<Document[]>(); */

  maxDocumentId: number;

  private documents : Document [] = [];

  constructor( private http: HttpClient ) {
    /* this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId(); */
  }

  getDocuments(): Document[] {
    this.http.get<Document[]>('https://cmsproject-6c76a-default-rtdb.firebaseio.com/documents.json')
      .subscribe(
        // success method
        (documents: Document[]) => {
          this.documents = documents
          this.maxDocumentId = this.getMaxId();
          documents.sort();
          this.documentListChangedEvent.next(documents.slice());
        },
        // error method
        (error: any) => {
          console.log(error.message);
        }
      )
    return this.documents.slice();
  }

  getDocument(id: string): Document {
    for (let document of this.documents){
      if (document.id == id) {
        return document;
      }
    }
    return null;
  }

  /* deleteDocument(document: Document) {
    if (!document){
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.documentChangedEvent.emit(this.documents.slice());
  } */

  getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents){
      let currentId = +document.id;
      if (currentId > maxId){
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if(!newDocument){
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    let documentsListClone = this.documents.slice();
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if(!originalDocument || !newDocument) {
      return;
    }

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }
    
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    let documentsListClone = this.documents.slice();
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    let pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos,1);
    let documentsListClone = this.documents.slice();
    this.storeDocuments();
  }

  storeDocuments() {
    const dbdocuments = JSON.stringify(this.documents);
    const header = new HttpHeaders().set('Content-Type', 'application/json');
    this.http
      .put(
        'https://cmsproject-6c76a-default-rtdb.firebaseio.com/documents.json',
        dbdocuments, {headers: header}
      )
      .subscribe( () => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }
}
