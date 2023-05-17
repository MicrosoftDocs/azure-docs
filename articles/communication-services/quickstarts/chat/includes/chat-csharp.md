---
title: include file
description: include file
services: azure-communication-services
author: probableprime
manager: mikben
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: rifox
---

## Prerequisites
Before you get started, make sure to:
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Install [Visual Studio](https://visualstudio.microsoft.com/downloads/)
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../create-communication-resource.md). You'll need to record your resource **endpoint and connection string** for this quickstart.
- A [User Access Token](../../identity/access-tokens.md). Be sure to set the scope to **chat**, and **note the token string as well as the user_id string**. You can also use the Azure CLI and run the command below with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope chat --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../identity/access-tokens.md?pivots=platform-azcli).

## Setting up

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `ChatQuickstart`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o ChatQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd ChatQuickstart
dotnet build
```

### Install the package

Install the Azure Communication Chat SDK for .NET

```PowerShell
dotnet add package Azure.Communication.Chat
```

## Object model

The following classes handle some of the major features of the Azure Communication Services Chat SDK for C#.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| ChatClient | This class is needed for the Chat functionality. You instantiate it with your subscription information, and use it to create, get and delete threads. |
| ChatThreadClient | This class is needed for the Chat Thread functionality. You obtain an instance via the ChatClient, and use it to send/receive/update/delete messages, add/remove/get participants, send typing notifications and read receipts. |

## Create a chat client

To create a chat client, you'll use your Communication Services endpoint and the access token that was generated as part of the prerequisite steps. You need to use the `CommunicationIdentityClient` class from the Identity SDK to create a user and issue a token to pass to your chat client.

Learn more about [User Access Tokens](../../identity/access-tokens.md).

This quickstart doesn't cover creating a service tier to manage tokens for your chat application, although it's recommended. Learn more about [Chat Architecture](../../../concepts/chat/concepts.md)

Copy the following code snippets and paste into source file: **Program.cs**
```csharp
using Azure;
using Azure.Communication;
using Azure.Communication.Chat;
using System;

namespace ChatQuickstart
{
    class Program
    {
        static async System.Threading.Tasks.Task Main(string[] args)
        {
            // Your unique Azure Communication service endpoint
            Uri endpoint = new Uri("<replace with your resource endpoint>");

            CommunicationTokenCredential communicationTokenCredential = new CommunicationTokenCredential(<Access_Token>);
            ChatClient chatClient = new ChatClient(endpoint, communicationTokenCredential);
        }
    }
}
```

## Start a chat thread

Use the `createChatThread` method on the chatClient to create a chat thread
- Use `topic` to give a topic to this chat; Topic can be updated after the chat thread is created using the `UpdateTopic` function.
- Use `participants` property to pass a  list of `ChatParticipant` objects to be added to the chat thread. The `ChatParticipant` object is initialized with a `CommunicationIdentifier` object. `CommunicationIdentifier` could be of type `CommunicationUserIdentifier`, `MicrosoftTeamsUserIdentifier` or `PhoneNumberIdentifier`. For example, to get a `CommunicationIdentifier` object, you'll need to pass an Access ID which you created by following instruction to [Create a user](../../identity/access-tokens.md#create-an-identity)

The response object from the `createChatThread` method contains the `chatThread` details. To interact with the chat thread operations such as adding participants, sending a message, deleting a message, etc., a `chatThreadClient` client instance needs to instantiated using the `GetChatThreadClient` method on the `ChatClient` client.

```csharp
var chatParticipant = new ChatParticipant(identifier: new CommunicationUserIdentifier(id: "<Access_ID>"))
{
    DisplayName = "UserDisplayName"
};
CreateChatThreadResult createChatThreadResult = await chatClient.CreateChatThreadAsync(topic: "Hello world!", participants: new[] { chatParticipant });
ChatThreadClient chatThreadClient = chatClient.GetChatThreadClient(threadId: createChatThreadResult.ChatThread.Id);
string threadId = chatThreadClient.Id;
```

## Get a chat thread client
The `GetChatThreadClient` method returns a thread client for a thread that already exists. It can be used for performing operations on the created thread: add members, send message, etc. threadId is the unique ID of the existing chat thread.

```csharp
string threadId = "<THREAD_ID>";
ChatThreadClient chatThreadClient = chatClient.GetChatThreadClient(threadId: threadId);
```

## List all chat threads
Use `GetChatThreads` to retrieve all the chat threads that the user is part of.

```csharp
AsyncPageable<ChatThreadItem> chatThreadItems = chatClient.GetChatThreadsAsync();
await foreach (ChatThreadItem chatThreadItem in chatThreadItems)
{
    Console.WriteLine($"{ chatThreadItem.Id}");
}
```

## Send a message to a chat thread

Use `SendMessage` to send a message to a thread.

- Use `content` to provide the content for the message, it's required.
- Use `type` for the content type of the message such as 'Text' or 'Html'. If not specified, 'Text' will be set.
- Use `senderDisplayName` to specify the display name of the sender. If not specified, empty string will be set.
- Use `metadata` optionally to include any additional data you want to send along with the message. This field provides a mechanism for developers to extend chat message functionality and add custom information for your use case. For example, when sharing a file link in the message, you might want to add 'hasAttachment:true' in metadata so that recipient's application can parse that and display accordingly.

```csharp
SendChatMessageOptions sendChatMessageOptions = new SendChatMessageOptions()
{
    Content = "Please take a look at the attachment",
    MessageType = ChatMessageType.Text
};
sendChatMessageOptions.Metadata["hasAttachment"] = "true";
sendChatMessageOptions.Metadata["attachmentUrl"] = "https://contoso.com/files/attachment.docx";

SendChatMessageResult sendChatMessageResult = await chatThreadClient.SendMessageAsync(sendChatMessageOptions);

string messageId = sendChatMessageResult.Id;
```

## Receive chat messages from a chat thread

You can retrieve chat messages by polling the `GetMessages` method on the chat thread client at specified intervals.

```csharp
AsyncPageable<ChatMessage> allMessages = chatThreadClient.GetMessagesAsync();
await foreach (ChatMessage message in allMessages)
{
    Console.WriteLine($"{message.Id}:{message.Content.Message}");
}
```

`GetMessages` takes an optional `DateTimeOffset` parameter. If that offset is specified, you'll receive messages that were received, updated or deleted after it. Note that messages received before the offset time but edited or removed after it will also be returned.

`GetMessages` returns the latest version of the message, including any edits or deletes that happened to the message using `UpdateMessage` and `DeleteMessage`. For deleted messages, `chatMessage.DeletedOn` returns a datetime value indicating when that message was deleted. For edited messages, `chatMessage.EditedOn` returns a datetime indicating when the message was edited. The original time of message creation can be accessed using `chatMessage.CreatedOn`, and it can be used for ordering the messages.

`GetMessages` returns different types of messages which can be identified by `chatMessage.Type`. These types are:

- `Text`: Regular chat message sent by a thread member.

- `Html`:  A formatted text message. Note that Communication Services users currently can't send RichText messages. This message type is supported by messages sent from Teams users to Communication Services users in Teams Interop scenarios.

- `TopicUpdated`: System message that indicates the topic has been updated. (readonly)

- `ParticipantAdded`: System message that indicates one or more participants have been added to the chat thread.(readonly)

- `ParticipantRemoved`: System message that indicates a participant has been removed from the chat thread.

For more details, see [Message Types](../../../concepts/chat/concepts.md#message-types).

## Add a user as a participant to the chat thread

Once a thread is created, you can then add and remove users from it. By adding users, you give them access to be able to send messages to the thread, and add/remove other participant. Before calling `AddParticipants`, ensure that you have acquired a new access token and identity for that user. The user will need that access token in order to initialize their chat client.

Use `AddParticipants` to add one or more participants to the chat thread. The following are the supported attributes for each thread participant(s):
- `communicationUser`, required, is the identity of the thread participant.
- `displayName`, optional, is the display name for the thread participant.
- `shareHistoryTime`, optional, time from which the chat history is shared with the participant.

```csharp
var josh = new CommunicationUserIdentifier(id: "<Access_ID_For_Josh>");
var gloria = new CommunicationUserIdentifier(id: "<Access_ID_For_Gloria>");
var amy = new CommunicationUserIdentifier(id: "<Access_ID_For_Amy>");

var participants = new[]
{
    new ChatParticipant(josh) { DisplayName = "Josh" },
    new ChatParticipant(gloria) { DisplayName = "Gloria" },
    new ChatParticipant(amy) { DisplayName = "Amy" }
};

await chatThreadClient.AddParticipantsAsync(participants: participants);
```

## Get thread participants

Use `GetParticipants` to retrieve the participants of the chat thread.

```csharp
AsyncPageable<ChatParticipant> allParticipants = chatThreadClient.GetParticipantsAsync();
await foreach (ChatParticipant participant in allParticipants)
{
    Console.WriteLine($"{((CommunicationUserIdentifier)participant.User).Id}:{participant.DisplayName}:{participant.ShareHistoryTime}");
}
```

## Send read receipt

Use `SendReadReceipt` to notify other participants that the message is read by the user.

```csharp
await chatThreadClient.SendReadReceiptAsync(messageId: messageId);
```

## Run the code

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```

## Sample Code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/add-chat).
