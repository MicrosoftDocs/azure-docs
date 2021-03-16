---
title: include file
description: include file
services: azure-communication-services
author: mikben
manager: mikben
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 03/10/2021
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
    print('Azure Communication Services - Chat Quickstart')
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

This quickstart does not cover creating a service tier to manage tokens for your chat application, although it is recommended. See the following documentation for more detail [Chat Architecture](../../../concepts/chat/concepts.md)

```console
pip install azure-communication-identity
```

```python
from azure.communication.chat import ChatClient
from azure.communication.identity._shared.user_credential import CommunicationTokenCredential
from azure.communication.chat._shared.user_token_refresh_options import CommunicationTokenRefreshOptions

endpoint = "https://<RESOURCE_NAME>.communication.azure.com"
refresh_options = CommunicationTokenRefreshOptions(<Access Token>)
chat_client = ChatClient(endpoint, CommunicationTokenCredential(refresh_options))
```

## Start a chat thread

Use the `create_chat_thread` method to create a chat thread.

- Use `topic` to give a thread topic; Topic can be updated after the chat thread is created using the `update_thread` function.
- Use `thread_participants` to list the `ChatThreadParticipant` to be added to the chat thread, the `ChatThreadParticipant` takes `CommunicationUserIdentifier` type as `user`, which is what you got after you
created by [Create a user](../../access-tokens.md#create-an-identity)
- Use `repeatability_request_id` to direct that the request is repeatable. The client can make the request multiple times with the same Repeatability-Request-ID and get back an appropriate response without the server executing the request multiple times.

`CreateChatThreadResult` is the result returned from creating a thread, you can use it to fetch the `id` of 
the chat thread that got created. This `id` can then be used to fetch a `ChatThreadClient` object using 
the `get_chat_thread_client` method. `ChatThreadClient` can be used to perform other chat operations to this chat thread.

#### Without Repeatability-Request-ID
```python
from datetime import datetime
from azure.communication.chat import ChatThreadParticipant

# from azure.communication.identity import CommunicationIdentityClient
# 
# # create an user
# identity_client = CommunicationIdentityClient.from_connection_string('<connection_string>')
# user = identity_client.create_user()
# 
# ## OR pass existing user
# # from azure.communication.identity import CommunicationUserIdentifier
# # user_id = 'some_user_id'
# # user = CommunicationUserIdentifier(user_id)

topic="test topic"
participants = [ChatThreadParticipant(
    user=user,
    display_name='name',
    share_history_time=datetime.utcnow()
)]

create_chat_thread_result = chat_client.create_chat_thread(topic)
chat_thread_client = chat_client.get_chat_thread_client(create_chat_thread_result.chat_thread.id)
```

#### With Repeatability-Request-ID
```python
from datetime import datetime
from azure.communication.chat import ChatThreadParticipant

# from azure.communication.identity import CommunicationIdentityClient
# 
# # create an user
# identity_client = CommunicationIdentityClient.from_connection_string('<connection_string>')
# user = identity_client.create_user()
# 
# ## OR pass existing user
# # from azure.communication.identity import CommunicationUserIdentifier
# # user_id = 'some_user_id'
# # user = CommunicationUserIdentifier(user_id)

topic="test topic"
participants = [ChatThreadParticipant(
    user=user,
    display_name='name',
    share_history_time=datetime.utcnow()
)]

repeatability_request_id = 'b66d6031-fdcc-41df-8306-e524c9f226b8' # some unique identifier
chat_thread_client = chat_client.create_chat_thread(topic, 
                                                    thread_participants=participants, 
                                                    repeatability_request_id=repeatability_request_id)
```

## Get a chat thread client
The `get_chat_thread_client` method returns a thread client for a thread that already exists. It can be used for performing operations on the created thread: add participants, send message, etc. thread_id is the unique ID of the existing chat thread.

`ChatThreadClient` can be used to perform other chat operations to this chat thread.

```python
thread_id = create_chat_thread_result.chat_thread.id
chat_thread_client = chat_client.get_chat_thread_client(thread_id)
```

## Get a chat thread

Use `get_chat_thread` method retrieves a `ChatThread` from the service; `thread_id` is the unique ID of the thread.
- Use `thread_id`, required, to specify the unique ID of the thread. 
```python
chat_thread = chat_client.get_chat_thread(thread_id=thread_id)
```

## List all chat threads
The `list_chat_threads` method returns a iterator of type `ChatThreadInfo`. It can be used for listing all chat threads.

- Use `start_time` to specify the earliest point in time to get chat threads up to.
- Use `results_per_page` to specify the maximum number of chat threads returned per page.

An iterator of `[ChatThreadInfo]` is the response returned from listing threads

```python
from datetime import datetime, timedelta

start_time = datetime.utcnow() - timedelta(days=2)

chat_thread_infos = chat_client.list_chat_threads(results_per_page=5, start_time=start_time)
for chat_thread_info_page in chat_thread_infos.by_page():
    for chat_thread_info in chat_thread_info_page:
        print(chat_thread_info)
```

## Delete a chat thread
The `delete_chat_thread` is used to delete a chat thread.

- Use `thread_id` to specify the thread_id of an existing chat thread that needs to be deleted

```python
thread_id = create_chat_thread_result.chat_thread.id
chat_client.delete_chat_thread(thread_id=thread_id)
```

## Send a message to a chat thread

Use `send_message` method to send a message to a chat thread you just created, identified by thread_id.

- Use `content` to provide the chat message content;
- Use `chat_message_type` to specify the message content type. Possible values are 'text' and 'html'; if not specified default value of 'text' is assigned.
- Use `sender_display_name` to specify the display name of the sender;

The response is an "id" of type `str`, which is the unique ID of that message.

#### Message type not specified
```python
topic = "test topic"
create_chat_thread_result = chat_client.create_chat_thread(topic)
thread_id = create_chat_thread_result.chat_thread.id
chat_thread_client = chat_client.get_chat_thread_client(create_chat_thread_result.chat_thread.id)

content='hello world'

send_message_result_id = chat_thread_client.send_message(content)
```

#### Message type specified
```python
from azure.communication.chat import ChatMessageType

topic = "test topic"
create_chat_thread_result = chat_client.create_chat_thread(topic)
thread_id = create_chat_thread_result.chat_thread.id
chat_thread_client = chat_client.get_chat_thread_client(create_chat_thread_result.chat_thread.id)


content='hello world'
sender_display_name='sender name'

# specify chat message type with pre-built enumerations
send_message_result_id_w_enum = chat_thread_client.send_message(content=content, sender_display_name=sender_display_name, chat_message_type=ChatMessageType.TEXT)
print("Message sent: id: ", send_message_result_id_w_enum)

# specify chat message type as string
send_message_result_id_w_str = chat_thread_client.send_message(content=content, sender_display_name=sender_display_name, chat_message_type='text')
print("Message sent: id: ", send_message_result_id_w_str)
```

## Get a specific chat message from a chat thread
The `get_message` function can be used to retrieve a specific message, identified by a message_id

- Use `message_id` to specify the message ID.

The response of type `ChatMessage` contains all information related to the single message.

```python
message_id = send_message_result_id
chat_message = chat_thread_client.get_message(message_id)
```

## Receive chat messages from a chat thread

You can retrieve chat messages by polling the `list_messages` method at specified intervals.

- Use `results_per_page` to specify the maximum number of messages to be returned per page.
- Use `start_time` to specify the earliest point in time to get messages up to.

An iterator of `[ChatMessage]` is the response returned from listing messages

```python
from datetime import datetime, timedelta

start_time = datetime.utcnow() - timedelta(days=1)

chat_messages = chat_thread_client.list_messages(results_per_page=1, start_time=start_time)
for chat_message_page in chat_messages.by_page():
    for chat_message in chat_message_page:
        print("ChatMessage: Id=", chat_message.id, "; Content=", chat_message.content.message)
```

`list_messages` returns the latest version of the message, including any edits or deletes that happened to the message using `update_message` and `delete_message`. For deleted messages `ChatMessage.deleted_on` returns a datetime value indicating when that message was deleted. For edited messages, `ChatMessage.edited_on` returns a datetime indicating when the message was edited. The original time of message creation can be accessed using `ChatMessage.created_on` which can be used for ordering the messages.

`list_messages` returns different types of messages which can be identified by `ChatMessage.type`. These types are:

- `ChatMessageType.TEXT`: Regular chat message sent by a thread participant.

- `ChatMessageType.HTML`: HTML chat message sent by a thread participant.

- `ChatMessageType.TOPIC_UPDATED`: System message that indicates the topic has been updated.

- `ChatMessageType.PARTICIPANT_ADDED`: System message that indicates one or more participants have been added to the chat thread.

- `ChatMessageType.PARTICIPANT_REMOVED`: System message that indicates a participant has been removed from the chat thread.

For more details, see [Message Types](../../../concepts/chat/concepts.md#message-types).

## Update topic of a chat thread
You can update the topic of a chat thread using the `update_topic` method

```python
topic = "updated thread topic"
chat_thread_client.update_topic(topic=topic)

chat_thread = chat_client.get_chat_thread(chat_thread_client.thread_id)
updated_topic = chat_thread.topic

print('Updated topic: ', updated_topic)
```

## Update a message
You can update the content of an existing message using the `update_message` method, identified by the message_id

- Use `message_id`,required, is the unique ID of the message.
- Use `content`, optional, is the message content to be updated; if not specified it is assigned to be empty

```python
content = 'Hello world!'
send_message_result_id = chat_thread_client.send_message(content=content, sender_display_name=sender_display_name)

content = 'Hello! I am updated content'
chat_thread_client.update_message(message_id=send_message_result_id, content=content)

chat_message = chat_thread_client.get_message(send_message_result_id)
print('Updated message content: ', chat_message.content.message)
```

## Send read receipt for a message
The `send_read_receipt` method can be used to posts a read receipt event to a thread, on behalf of a user.

- Use `message_id` to specify the ID of the latest message read by current user.

```python
message_id=send_message_result_id
chat_thread_client.send_read_receipt(message_id=message_id)
```

## List read receipts for a chat thread
The `list_read_receipts` method can be used to get read receipts for a thread.

- Use `results_per_page` to specify the maximum number of chat message read receipts to be returned per page.
- Use `skip` to specify skip chat message read receipts up to a specified position in response.

An iterator of `[ChatMessageReadReceipt]` is the response returned from listing read receipts

```python
read_receipts = chat_thread_client.list_read_receipts(results_per_page=5, skip=0)

for read_receipt_page in read_receipts.by_page():
    for read_receipt in read_receipt_page:
        print('ChatMessageReadReceipt: ', read_receipt)
        print('Sender', read_receipt.sender)
        print('Message Id', read_receipt.chat_message_id)
        print('Read On Timestamp', read_receipt.read_on)
```

## Send typing notification
The `send_typing_notification` method can be used to post a typing event to a thread, on behalf of a user.

```python
chat_thread_client.send_typing_notification()
```

## Delete message
The `delete_message` method can be used to delete a message, identified by a message_id

- Use `message_id` to specify the message_id

```python
message_id=send_message_result_id
chat_thread_client.delete_message(message_id=message_id)
```

## Add a user as participant to the chat thread

Once a chat thread is created, you can then add and remove users from it. By adding users, you give them access to be able to send messages to the chat thread, and add/remove other participants. Before calling `add_participant` method, ensure that you have acquired a new access token and identity for that user. The user will need that access token in order to initialize their chat client.

Use `add_participant` method to add thread participants to the thread identified by thread_id.

- Use `thread_participant` to specify the participant to be added to the chat thread;
- `user`, required, is the `CommunicationUserIdentifier` you created by `CommunicationIdentityClient` at [create a user](../../access-tokens.md#create-an-identity)
- `display_name`, optional, is the display name for the thread participant.
- `share_history_time`, optional, is the time from which the chat history is shared with the participant. To share history since the inception of the chat thread, set this property to any date equal to, or less than the thread creation time. To share no history previous to when the participant was added, set it to the current date. To share partial history, set it to an intermediary date.

When participant is successfully added, no error is thrown. In case of an error encountered while adding participant, 
a `RuntimeError` is thrown

```python
from azure.communication.identity import CommunicationIdentityClient
from azure.communication.chat import ChatThreadParticipant
from datetime import datetime

# create an user
identity_client = CommunicationIdentityClient.from_connection_string('<connection_string>')
new_user = identity_client.create_user()

# # conversely, you can also add an existing user to a chat thread; provided the user_id is known
# from azure.communication.identity import CommunicationUserIdentifier
#
# user_id = 'some user id'
# user_display_name = "Wilma Flinstone"
# new_user = CommunicationUserIdentifier(user_id)
# participant = ChatThreadParticipant(
#     user=new_user,
#     display_name=user_display_name,
#     share_history_time=datetime.utcnow())

def decide_to_retry(error, **kwargs):
    """
    Insert some custom logic to decide if retry is applicable based on error
    """
    return True

participant = ChatThreadParticipant(
    user=new_user,
    display_name='Fred Flinstone',
    share_history_time=datetime.utcnow())

try:
    chat_thread_client.add_participant(thread_participant=participant)
except RuntimeError as e:
    if e is not None and decide_to_retry(error=e):
        chat_thread_client.add_participant(thread_participant=participant)
```

Multiple users can also be added to the chat thread using the `add_participants` method, provided new access token and identify is available for all users.

A `list(tuple(ChatThreadParticipant, CommunicationError))` is returned. When participant is successfully added,
an empty list is expected. In case of an error encountered while adding participant, the list is populated
with the failed participants along with the error that was encountered.

```python
from azure.communication.identity import CommunicationIdentityClient
from azure.communication.chat import ChatThreadParticipant
from datetime import datetime

# create 2 users
identity_client = CommunicationIdentityClient.from_connection_string('<connection_string>')
new_users = [identity_client.create_user() for i in range(2)]

# # conversely, you can also add an existing user to a chat thread; provided the user_id is known
# from azure.communication.identity import CommunicationUserIdentifier
#
# user_id = 'some user id'
# user_display_name = "Wilma Flinstone"
# new_user = CommunicationUserIdentifier(user_id)
# participant = ChatThreadParticipant(
#     user=new_user,
#     display_name=user_display_name,
#     share_history_time=datetime.utcnow())

participants = []
for _user in new_users:
  chat_thread_participant = ChatThreadParticipant(
    user=_user,
    display_name='Fred Flinstone',
    share_history_time=datetime.utcnow()
  ) 
  participants.append(chat_thread_participant) 

response = chat_thread_client.add_participants(thread_participants=participants)

def decide_to_retry(error, **kwargs):
    """
    Insert some custom logic to decide if retry is applicable based on error
    """
    return True

# verify if all users has been successfully added or not
# in case of partial failures, you can retry to add all the failed participants 
retry = [p for p, e in response if decide_to_retry(e)]
if len(retry) > 0:
    chat_thread_client.add_participants(retry)
```


## Remove user from a chat thread

Similar to adding a participant, you can also remove participants from a thread. In order to remove, you'll need to track the IDs of the participants you have added.

Use `remove_participant` method to remove thread participant from the thread identified by threadId.
- `user` is the `CommunicationUserIdentifier` to be removed from the thread.

```python
chat_thread_client.remove_participant(user=new_user)

# # converesely you can also do the following; provided the user_id is known
# from azure.communication.identity import CommunicationUserIdentifier
# 
# user_id = 'some user id'
# chat_thread_client.remove_participant(user=CommunincationUserIdentfier(new_user))
```

## Run the code

Run the application from your application directory with the `python` command.

```console
python start-chat.py
```
