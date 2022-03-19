import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  /* documentChangedEvent = new EventEmitter<Document[]>(); */

  maxDocumentId: number;

  documents : Document [] = [];

  constructor( private http: HttpClient ) {
    /* this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId(); */
  }

  getDocuments(): Document[] {
    this.http.get('http://localhost:3000/documents')
      .subscribe(
        // success method
        (documents: Document[]) => {
          this.documents = documents
          this.maxDocumentId = this.getMaxId();
          this.documents.sort();
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
    let maxId: number = 0;
    for (let document of this.documents){
      let currentId = +document.id;
      if (currentId > maxId){
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.documents.sort();
          this.documentListChangedEvent.next(this.documents.slice())
        }
      );
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.documents.sort();
          this.documentListChangedEvent.next(this.documents.slice())
        }
      );
  }

  
deleteDocument(document: Document) {

  if (!document) {
    return;
  }

  const pos = this.documents.findIndex(d => d.id === document.id);

  if (pos < 0) {
    return;
  }

  // delete from database
  this.http.delete('http://localhost:3000/documents/' + document.id)
    .subscribe(
      (response: Response) => {
        this.documents.splice(pos, 1);
        this.documents.sort();
        this.documentListChangedEvent.next(this.documents.slice())
      }
    );
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
