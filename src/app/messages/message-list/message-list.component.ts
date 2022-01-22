import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message(1002, 'Congratulation', 'Is an amazing page, congratulation.', 'Violeta'),
    new Message(1003, 'Error sending message', 'I have an error when I send a message.', 'Isabella'),
    new Message(1004, 'Help with the page', 'You can help me with the page code, please?.', 'Monica')
  ];

  constructor() { }

  ngOnInit() {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
