---
title: include file
description: include file
services: azure-communication-services
author: mikben
manager: mikben
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 9/1/2020
ms.topic: include
ms.custom: include file
ms.author: mikben
---

## Prerequisites
Before you get started, make sure to:

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Python](https://www.python.org/downloads/)
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../create-communication-resource.md). You'll need to record your resource **endpoint** for this quickstart
- A [User Access Token](../../access-tokens.md). Be sure to set the scope to "chat", and note the token string as well as the userId string.

## Setting up

### Create a new Python application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir chat-quickstart && cd chat-quickstart
```

Use a text editor to create a file called **start-chat.py** in the project root directory and add the structure for the program, including basic exception handling. You'll add all the source code for this quickstart to this file in the following sections.

```python
import os
# Add required client library components from quickstart here

try:
    # Quickstart code goes here
except Exception as ex:
    print('Exception:')
    print(ex)
```

### Install client library

```console

pip install azure-communication-chat

```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Chat client library for Python.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| ChatClient | This class is needed for the Chat functionality. You instantiate it with your subscription information, and use it to create, get and delete threads. |
| ChatThreadClient | This class is needed for the Chat Thread functionality. You obtain an instance via the ChatClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts. |

## Create a chat client

To create a chat client, you'll use Communications Service endpoint and the `Access Token` that was generated as part of pre-requisite steps. Learn more about [User Access Tokens](../../access-tokens.md).

```console
pip install azure-communication-administration
```

```python
from azure.communication.chat import ChatClient, CommunicationUserCredential

endpoint = "https://<RESOURCE_NAME>.communication.azure.com"
chat_client = ChatClient(endpoint, CommunicationUserCredential(<Access Token>))
```

## Start a chat thread

Use the `create_chat_thread` method to create a chat thread.

- Use `topic` to give a thread topic; Topic can be updated after the chat thread is created using the `update_thread` function.
- Use `members` to list the `ChatThreadMember` to be added to the chat thread, the `ChatThreadMember` takes `CommunicationUser` type as `user`, which is what you got after you
created by [Create a user](../../access-tokens.md#create-a-user)

The response `chat_thread_client` is used to perform operations on the newly created chat thread like adding members to the chat thread, send message, delete message, etc. It contains a `thread_id` property which is the unique ID of the chat thread.

```python
from datetime import datetime
from azure.communication.chat import ChatThreadMember

topic="test topic"
thread_members=[ChatThreadMember(
    user=user,
    display_name='name',
    share_history_time=datetime.utcnow()
)]
chat_thread_client = chat_client.create_chat_thread(topic, thread_members)
```

## Get a chat thread client
The get_chat_thread_client method returns a thread client for a thread that already exists. It can be used for performing operations on the created thread: add members, send message, etc. thread_id is the unique ID of the existing chat thread.

```python
thread_id = 'id'
chat_thread_client = chat_client.get_chat_thread_client(thread_id)
```

## Send a message to a chat thread

Use `send_message` method to send a message to a chat thread you just created, identified by threadId.

- Use `content` to provide the chat message content;
- Use `priority` to specify the message priority level, such as 'Normal' or 'High' ; this property can be used to have UI indicator for the recipient user in your app to bring attention to the message or execute custom business logic.
- Use `senderDisplayName` to specify the display name of the sender;

The response `SendChatMessageResult` contains an "id", which is the unique ID of that message.

```python
from azure.communication.chat import ChatMessagePriority

content='hello world'
priority=ChatMessagePriority.NORMAL
sender_display_name='sender name'

send_message_result = chat_thread_client.send_message(content, priority=priority, sender_display_name=sender_display_name)
```

## Receive chat messages from a chat thread

You can retrieve chat messages by polling the `list_messages` method at specified intervals.

```python
chat_messages = chat_thread_client.list_messages()
```
`list_messages` returns the latest version of the message, including any edits or deletes that happened to the message using `update_message` and `delete_message`. For deleted messages `ChatMessage.deleted_on` returns a datetime value indicating when that message was deleted. For edited messages, `ChatMessage.edited_on` returns a datetime indicating when the message was edited. The original time of message creation can be accessed using `ChatMessage.created_on` which can be used for ordering the messages.

`list_messages` returns different types of messages which can be identified by `ChatMessage.type`. These types are:

- `Text`: Regular chat message sent by a thread member.

- `ThreadActivity/TopicUpdate`: System message that indicates the topic has been updated.

- `ThreadActivity/AddMember`: System message that indicates one or more members have been added to the chat thread.

- `ThreadActivity/DeleteMember`: System message that indicates a member has been removed from the chat thread.

For more details, see [Message Types](../../../concepts/chat/concepts.md#message-types).

## Add a user as member to the chat thread

Once a chat thread is created, you can then add and remove users from it. By adding users, you give them access to be able to send messages to the chat thread, and add/remove other members. Before calling `add_members` method, ensure that you have acquired a new access token and identity for that user. The user will need that access token in order to initialize their chat client.

Use `add_members` method to add thread members to the thread identified by threadId.

- Use `members` to list the members to be added to the chat thread;
- `user`, required, is the `CommunicationUser` you created by `CommunicationIdentityClient` at [create a user](../../access-tokens.md#create-a-user)
- `display_name`, optional, is the display name for the thread member.
- `share_history_time`, optional, is the time from which the chat history is shared with the member. To share history since the inception of the chat thread, set this property to any date equal to, or less than the thread creation time. To share no history previous to when the member was added, set it to the current date. To share partial history, set it to an intermediary date.

```python
new_user = identity_client.create_user()

from azure.communication.chat import ChatThreadMember
from datetime import datetime
member = ChatThreadMember(
    user=new_user,
    display_name='name',
    share_history_time=datetime.utcnow())
thread_members = [member]
chat_thread_client.add_members(thread_members)
```

## Remove user from a chat thread

Similar to adding a member, you can also remove members from a thread. In order to remove, you'll need to track the IDs of the members you have added.

Use `remove_member` method to remove thread member from the thread identified by threadId.
- `user` is the CommunicationUser to be removed from the thread.

```python
chat_thread_client.remove_member(user)
```

## Run the code

Run the application from your application directory with the `python` command.

```console
python start-chat.py
```
