import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
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
    this.http.get<Message[]>('https://cmsproject-6c76a-default-rtdb.firebaseio.com/messages.json')
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
    this.messages.push(message);
    this.storeMessages();
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
