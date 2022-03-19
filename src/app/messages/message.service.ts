import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
//import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();

  private messages: Message[] = [];
  maxMessageId: number;

  constructor(private http: HttpClient) {
    /* this.messages = MOCKMESSAGES; */
  }

  getMessages(): Message[] {
    this.http.get<Message[]>('http://127.0.0.1:3000/messages')
      .subscribe(
        // success method
        (messages: Message[]) => {
          this.messages = messages
          this.maxMessageId = this.getMaxId();
          messages.sort();
          this.messageChangedEvent.next(messages.slice());
        },
        // error method
        (error: any) => {
          console.log(error.message);
        }
      )
    return this.messages.slice();
  }

  getMessage(id: string){
    for (let message of this.messages) {
      if (message.id == id) {
        return message;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages){
      let currentId = +message.id;
      if (currentId > maxId){
        maxId = currentId;
      }
    }
    return maxId;
  }

  
  addMessage(message: Message) {
    if (!message) {
      return;
    }
  
    // make sure id of the new Document is empty
    message.id = '';
  
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    // add to database
    this.http.post<{ message: string, oMessage: Message }>('http://127.0.0.1:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.messages.push(responseData.oMessage);
          this.messages.sort();
          this.messageChangedEvent.next(this.messages.slice())
        }
      );
  }

  storeMessages() {
    const dbmessages = JSON.stringify(this.messages);
    const header = new HttpHeaders().set('Content-Type', 'application/json');
    this.http
      .put(
        'https://cmsproject-6c76a-default-rtdb.firebaseio.com/messages.json',
        dbmessages, {headers: header}
      )
      .subscribe( () => {
        this.messageChangedEvent.next(this.messages.slice());
      });
  }
}
