---
title: Migrating from Twilio Conversations Chat to Azure Communication Services Chat C#
description: Guide describes how to migrate C# apps from Twilio Conversations Chat to Azure Communication Services Chat SDK. 
services: azure-communication-services
ms.date: 08/28/2024
ms.topic: include
author: RinaRish
ms.author: ektrishi
ms.service: azure-communication-services
ms.subservice: chat
ms.custom: mode-other
---

## Prerequisites

- Create an Azure account with an active subscription. For more information, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Install [Visual Studio](https://visualstudio.microsoft.com/downloads/).
- Create an Azure Communication Services resource. For more information, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md). Record your resource **endpoint and connection string**.
- A [User Access Token](../../quickstarts/identity/access-tokens.md). Be sure to set the scope to **chat**, and **note the token string and user_id string**. You can also use the Azure CLI and run the following command with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope chat --connection-string "yourConnectionString"
  ```

  For more information, see [Use Azure CLI to Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md?pivots=platform-azcli).

## Conceptual Difference

Both Twilio Conversations and Azure Communication Services Chat offer similar functions, but their implementation differs due to the surrounding ecosystems and underlying platform philosophies. Twilio Conversations provide a multi-channel communication API. Azure Communication Services Chat is focused primarily on chat within the Azure ecosystem. This migration guide provides a basic mapping between common operations in Twilio and their equivalents in Azure Communication Services Chat, helping you transition your .NET code.

### Identities

#### Twilio

Twilio Conversations uses identity strings directly.

#### Azure Communication Services 

Azure Communication Services requires creating users through the `CommunicationIdentityClient`.

## Setting up

### Install the package

To start the migration from Twilio Conversations chat, the first step is to install the Azure Communication Services Chat SDK for .NET to your project.

```PowerShell
dotnet add package Azure.Communication.Chat
```

## Object model

The following classes handle some of the major features of the Azure Communication Services Chat SDK for C#.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `ChatClient` | This class is needed for the Chat functionality. You instantiate it with your subscription information, and use it to create, get, and delete threads. |
| `ChatThreadClient` | This class is needed for the Chat Thread functionality. You obtain an instance via the ChatClient, and use it to send/receive/update/delete messages, add/remove/get participants, send typing notifications and read receipts. |

## Create a chat client

#### Twilio 

Twilio requires you to set up the Twilio client using your account credentials:

```csharp
var twilio = new TwilioRestClient(accountSid, authToken);
```

#### Azure Communication Services 

To create a chat client in Azure Communication Services, use your Communication Services endpoint and the access token that was generated as part of the prerequisite steps. You need to use the `CommunicationIdentityClient` class from the Identity SDK to create a user and issue a token to pass to your chat client.

Learn more about [User Access Tokens](../../quickstarts/identity/access-tokens.md).

```csharp
// Your unique Azure Communication service endpoint
Uri endpoint = new Uri("<replace with your resource endpoint>");
CommunicationTokenCredential communicationTokenCredential = new CommunicationTokenCredential(<Access_Token>);
ChatClient chatClient = new ChatClient(endpoint, communicationTokenCredential);
```

### Start a chat thread

#### Twilio Conversations

```csharp
var conversation = ConversationResource.Create(
    friendlyName: "My Conversation",
    messagingServiceSid: "<MessagingServiceSid>"
);
```

#### Azure Communication Services 

In Azure Communication Services, you create a thread, which is equivalent to a conversation in Twilio.

To create a chat thread, use the `createChatThread` method on the chatClient:
- Use `topic` to give a topic to this chat; you can update the `topic` after the chat thread is created using the `UpdateTopic` function.
- Use `participants` property to pass a  list of `ChatParticipant` objects to be added to the chat thread. Initialize the `ChatParticipant` object with a `CommunicationIdentifier` object. `CommunicationIdentifier` could be of type `CommunicationUserIdentifier`, `MicrosoftTeamsUserIdentifier`, or `PhoneNumberIdentifier`. For example, to get a `CommunicationIdentifier` object, you need to pass an Access ID created following the instructions to [Create a user](../../quickstarts/identity/access-tokens.md#create-an-identity).

The response object from the `createChatThread` method contains the `chatThread` details. To interact with the chat thread operations such as adding participants, sending a message, deleting a message, and so on, instantiate a `chatThreadClient` client instance using the `GetChatThreadClient` method on the `ChatClient` client.

```csharp
var chatParticipant = new ChatParticipant(identifier: new CommunicationUserIdentifier(id: "<Access_ID>"))
{
    DisplayName = "UserDisplayName"
};
CreateChatThreadResult createChatThreadResult = await chatClient.CreateChatThreadAsync(topic: "Hello world!", participants: new[] { chatParticipant });
ChatThreadClient chatThreadClient = chatClient.GetChatThreadClient(threadId: createChatThreadResult.ChatThread.Id);
string threadId = chatThreadClient.Id;
```

### Get a chat thread client

##### Twilio

In Twilio Conversations, you interact directly with a conversation using the conversation's SID (unique identifier). Here's how to typically get a conversation and interact with it:

```csharp
var conversationSid = "<CONVERSATION_SID>";
var conversation = ConversationResource.Fetch(pathSid: conversationSid);

// Example: Fetching all messages in the conversation
var messages = MessageResource.Read(pathConversationSid: conversationSid);
foreach (var message in messages)
{
    Console.WriteLine(message.Body);
}
```

#### Azure Communication Services 

The `GetChatThreadClient` method returns a thread client for a thread that already exists. You can use it to perform operations on the created thread: add members, send message, and so on. `threadId` is the unique ID of the existing chat thread.

```csharp
string threadId = "<THREAD_ID>";
ChatThreadClient chatThreadClient = chatClient.GetChatThreadClient(threadId: threadId);
```

### List all chat threads

##### Twilio

In Twilio Conversations, you can retrieve all conversations that a user is a participant in by querying the `UserConversations` resource. This resource provides a list of conversations for a specific user.

```csharp
/ Initialize Twilio Client
string accountSid = "<YOUR_ACCOUNT_SID>";
string authToken = "<YOUR_AUTH_TOKEN>";
TwilioClient.Init(accountSid, authToken);

// The identity of the user you're querying
string userIdentity = "user@example.com";

// Retrieve all conversations the user is part of
var userConversations = UserConversationResource.Read(pathUserSid: userIdentity);

foreach (var userConversation in userConversations)
{
    Console.WriteLine($"Conversation SID: {userConversation.ConversationSid}");
    // You can fetch more details about the conversation if needed
    var conversation = Twilio.Rest.Conversations.V1.ConversationResource.Fetch(pathSid: userConversation.ConversationSid);
    Console.WriteLine($"Conversation Friendly Name: {conversation.FriendlyName}");
}
```

#### Azure Communication Services 

Use `GetChatThreads` to retrieve all the chat threads that the user is part of.

```csharp
AsyncPageable<ChatThreadItem> chatThreadItems = chatClient.GetChatThreadsAsync();
await foreach (ChatThreadItem chatThreadItem in chatThreadItems)
{
    Console.WriteLine($"{ chatThreadItem.Id}");
}
```

### Send a message to a chat thread

##### Twilio

The following code snippet shows how to send a text message.

```csharp
var message = MessageResource.Create(
    body: "Hello, world!",
    from: "user@example.com",
    pathConversationSid: conversation.Sid
);
```

The following code snippet shows how to send a media file.

```csharp
// The SID of the conversation you want to send the media message to
string conversationSid = "<CONVERSATION_SID>";

// The URL of the media file you want to send
var mediaUrl = new List<Uri>
{
    new Uri("https://example.com/path/to/media/file.jpg") // Replace with your actual media URL
};

// Send the media message
var message = MessageResource.Create(
    body: "Here is an image for you!",
    from: "user@example.com", // Sender's identity (optional)
    mediaUrl: mediaUrl,
    pathConversationSid: conversationSid
);
```

#### Azure Communication Services

Unlike Twilio, Azure Communication Services doesn't have a separate function to send text messages or media.

Use `SendMessage` to send a message to a thread.
- Use `content`, required, to provide the content for the message.
- Use `type` for the content type of the message such as `Text` or `Html`. If not specified, `Text` is the default.
- Use `senderDisplayName` to specify the display name of the sender. If not specified, empty string is the default.
- Use `metadata` optionally to include other data you want to send along with the message. This field provides a mechanism for developers to extend chat message function and add custom information for your use case. For example, when sharing a file link in the message, you might want to add `hasAttachment:true` in the metadata so that recipient's application can parse that and display accordingly.

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

### Receive chat messages from a chat thread

##### Twilio

Twilio typically uses webhooks to notify your server of incoming messages:

The following code snippet shows how to receive a text message.

```csharp
public IActionResult ReceiveMessage()
{
    var incomingMessage = Request.Form["Body"];
    // Process the incoming message
    return Ok();
}
```

The following code snippet shows how to receive a media file.
```csharp
 for (var i = 0; i < numMedia; i++)
            {
                var mediaUrl = Request.Form[$"MediaUrl{i}"];
                Trace.WriteLine(mediaUrl);
                var contentType = Request.Form[$"MediaContentType{i}"];

                var filePath = GetMediaFileName(mediaUrl, contentType);
                await DownloadUrlToFileAsync(mediaUrl, filePath);
            }
```

#### Azure Communication Services

Unlike Twilio, Azure Communication Services doesn't have a separate function to receive text messages or media.

Azure Communication Services Chat enables you to subscribe to events directly within the application.

You can retrieve chat messages by polling the `GetMessages` method on the chat thread client at specified intervals.

```csharp
AsyncPageable<ChatMessage> allMessages = chatThreadClient.GetMessagesAsync();
await foreach (ChatMessage message in allMessages)
{
    Console.WriteLine($"{message.Id}:{message.Content.Message}");
}
```

`GetMessages` takes an optional `DateTimeOffset` parameter. If that offset is specified, you receive messages that were received, updated, or deleted after it. Messages received before the offset time but edited or removed after it are also returned.

`GetMessages` returns the latest version of the message, including any edits or deletes that happened to the message using `UpdateMessage` and `DeleteMessage`. For deleted messages, `chatMessage.DeletedOn` returns a datetime value indicating when that message was deleted. For edited messages, `chatMessage.EditedOn` returns a datetime indicating when the message was edited. You can access the original time of message creation using `chatMessage.CreatedOn`, and use it for ordering the messages.

`GetMessages` returns different types of messages, which you can identify by `chatMessage.Type`. These types are:

- `Text`: Regular chat message sent by a thread member.

- `Html`:  A formatted text message. Note that Communication Services users currently can't send `RichText` messages. This message type is supported by messages sent from Teams users to Communication Services users in Teams Interop scenarios.

- `TopicUpdated`: System message that indicates the topic has been updated. (readonly)

- `ParticipantAdded`: System message that indicates one or more participants have been added to the chat thread. (readonly)

- `ParticipantRemoved`: System message that indicates a participant has been removed from the chat thread.

For more information, see [Message Types](../../concepts/chat/concepts.md#message-types).

### Add a user as a participant to the chat thread

#### Twilio 

```csharp
var participant = ParticipantResource.Create(
    pathConversationSid: conversation.Sid,
    identity: "user@example.com"
);
```

#### Azure Communication Services 

In Azure Communication Services, you add participants when creating the chat thread or afterwards:

Once you create a thread, you can add and remove users. Adding users gives them access to send messages to the thread, and add/remove other participants. Before calling `AddParticipants`, ensure that you acquire a new access token and identity for that user. The user needs the access token to initialize their chat client.

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

### Get thread participants

##### Twilio

In Twilio Conversations, you use the `ConversationResource` to retrieve the participants of a specific conversation. You can then list all participants associated with that conversation.

```csharp
// The SID of the conversation you want to retrieve participants from
string conversationSid = "<CONVERSATION_SID>";

// Retrieve all participants in the conversation
var participants = ParticipantResource.Read(pathConversationSid: conversationSid);

// Output details of each participant
foreach (var participant in participants)
{
    Console.WriteLine($"Participant SID: {participant.Sid}");
            
}
```

#### Azure Communication Services 

Use `GetParticipants` to retrieve the participants of the chat thread.

```csharp
AsyncPageable<ChatParticipant> allParticipants = chatThreadClient.GetParticipantsAsync();
await foreach (ChatParticipant participant in allParticipants)
{
    Console.WriteLine($"{((CommunicationUserIdentifier)participant.User).Id}:{participant.DisplayName}:{participant.ShareHistoryTime}");
}
```

### Send read receipt

##### Twilio
```csharp
// Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        TwilioClient.Init(accountSid, authToken);

        var message = await MessageResource.FetchAsync(
            pathConversationSid: "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            pathSid: "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

        Console.WriteLine(message.Delivery);
    }
```

#### Azure Communication Services 
Use `SendReadReceipt` to notify other participants that the user read the message.

```csharp
await chatThreadClient.SendReadReceiptAsync(messageId: messageId);
```
