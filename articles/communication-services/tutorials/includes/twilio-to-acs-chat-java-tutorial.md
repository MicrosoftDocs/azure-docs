---
title: Migrating from Twilio Conversations Chat to ACS Chat Java
description: Guide describes how to migrate Java apps from Twilio Conversations Chat to Azure Communication Services Chat SDK. 
services: azure-communication-services
ms.date: 07/22/2024
ms.topic: include
author: RinaRish
ms.author: ektrishi
ms.service: azure-communication-services
ms.subservice: chat
ms.custom: mode-other
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](/azure/developer/java/fundamentals/java-jdk-install) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../create-communication-resource.md). You'll need to record your resource **endpoint and connection string** for this quickstart.
- A [User Access Token](../../identity/access-tokens.md). Be sure to set the scope to **chat**, and **note the token string as well as the user_id string**. You can also use the Azure CLI and run the command below with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope chat --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../identity/access-tokens.md?pivots=platform-azcli).

## Setting up

### Add the package references for the Chat SDK

#### Twilio
To use Twilio Conversations Chat APIs in your Java application, add the following dependency in your pom.xml:
```xml
<dependencies>
    <!-- Twilio Java SDK -->
    <dependency>
        <groupId>com.twilio.sdk</groupId>
        <artifactId>twilio</artifactId>
        <version>8.31.1</version>
    </dependency>
</dependencies>
```

#### Azure Communication Services

In your POM file, reference the `azure-communication-chat` package with the Chat APIs:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-chat</artifactId>
    <version><!-- Please refer to https://search.maven.org/artifact/com.azure/azure-communication-chat for the latest version --></version>
</dependency>
```

For authentication, your client needs to reference the `azure-communication-common` package:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-common</artifactId>
    <version><!-- Please refer to https://search.maven.org/artifact/com.azure/azure-communication-common for the latest version --></version>
</dependency>
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Chat SDK for Java.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| ChatClient | This class is needed for the Chat functionality. You instantiate it with your subscription information, and use it to create, get and delete threads. |
| ChatAsyncClient | This class is needed for the asynchronous Chat functionality. You instantiate it with your subscription information, and use it to create, get and delete threads. |
| ChatThreadClient | This class is needed for the Chat Thread functionality. You obtain an instance via the ChatClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts. |
| ChatThreadAsyncClient | This class is needed for the asynchronous Chat Thread functionality. You obtain an instance via the ChatAsyncClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts. |

### Import

#### Twilio
```Java
import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.Conversation;
```

#### Azure Communication Services
```Java
package com.communication.quickstart;

import com.azure.communication.chat.*;
import com.azure.communication.chat.models.*;
import com.azure.communication.common.*;
import com.azure.core.http.rest.PagedIterable;

import java.io.*;
import java.util.*;
```

### Create a chat client

#### Twilio
In Twilio, you initialize the client using the Account SID and Auth Token. Here's how you typically initialize a client.
```Java
String accountSid = "<YOUR_ACCOUNT_SID>";
String authToken = "<YOUR_AUTH_TOKEN>";
        
// Initialize Twilio client
Twilio.init(accountSid, authToken);
```

#### Azure Communication Services

To create a chat client, you'll use the Communications Service endpoint and the access token that was generated as part of pre-requisite steps. User access tokens enable you to build client applications that directly authenticate to Azure Communication Services. Once you generate these tokens on your server, pass them back to a client device. You need to use the CommunicationTokenCredential class from the Common SDK to pass the token to your chat client.

Learn more about [Chat Architecture](../../../concepts/chat/concepts.md)

When adding the import statements, be sure to only add imports from the com.azure.communication.chat and com.azure.communication.chat.models namespaces, and not from the com.azure.communication.chat.implementation namespace. In the App.java file that was generated via Maven, you can use the following code to begin with:

```Java
// Your unique Azure Communication service endpoint
String endpoint = "<replace with your resource endpoint>";

// User access token fetched from your trusted service
String userAccessToken = "<USER_ACCESS_TOKEN>";

// Create a CommunicationTokenCredential with the given access token, which is only valid until the token is valid
CommunicationTokenCredential userCredential = new CommunicationTokenCredential(userAccessToken);

// Initialize the chat client
final ChatClientBuilder builder = new ChatClientBuilder();
    builder.endpoint(endpoint)
        .credential(userCredential);
    ChatClient chatClient = builder.buildClient();

```

### Start a chat thread

#### Twilio
Creating a conversation in Twilio is straightforward using the Conversation.creator() method.
- Use the `setFriendlyName` to give a topic to this chat.
```Java
// Create a new conversation
        Conversation conversation = Conversation.creator().setFriendlyName("New Conversation").create();
        System.out.println(conversation.getSid());
```

#### Azure Communication Services

Use the `createChatThread` method to create a chat thread.
`createChatThreadOptions` is used to describe the thread request.

- Use the `topic` parameter of the constructor to give a topic to this chat; Topic can be updated after the chat thread is created using the `UpdateThread` function.
- Use `participants` to list the thread participants to be added to the thread. `ChatParticipant` takes the user you created in the [User Access Token](../../identity/access-tokens.md) quickstart.

`CreateChatThreadResult` is the response returned from creating a chat thread.
It contains a `getChatThread()` method, which returns the `ChatThread` object that can be used to get the thread client from which you can get the `ChatThreadClient` for performing operations on the created thread: add participants, send message, etc.
The `ChatThread` object also contains the `getId()` method, which retrieves the unique ID of the thread.

```Java
CommunicationUserIdentifier identity1 = new CommunicationUserIdentifier("<USER_1_ID>");
CommunicationUserIdentifier identity2 = new CommunicationUserIdentifier("<USER_2_ID>");

ChatParticipant firstThreadParticipant = new ChatParticipant()
    .setCommunicationIdentifier(identity1)
    .setDisplayName("Participant Display Name 1");

ChatParticipant secondThreadParticipant = new ChatParticipant()
    .setCommunicationIdentifier(identity2)
    .setDisplayName("Participant Display Name 2");

CreateChatThreadOptions createChatThreadOptions = new CreateChatThreadOptions("Topic")
    .addParticipant(firstThreadParticipant)
    .addParticipant(secondThreadParticipant);

CreateChatThreadResult result = chatClient.createChatThread(createChatThreadOptions);
String chatThreadId = result.getChatThread().getId();
```

### List chat threads

#### Twilio
Here is how you list all conversations in Twilio using Java:
```Java
public static void main(String[] args) {
        // List all conversations
        ResourceSet<Conversation> conversations = Conversation.reader().read();

        for (Conversation conversation : conversations) {
            System.out.println("Conversation SID: " + conversation.getSid());
            System.out.println("Friendly Name: " + conversation.getFriendlyName());
            System.out.println("Date Created: " + conversation.getDateCreated());
        }
    }
```

#### Azure Communication Services

Use the `listChatThreads` method to retrieve a list of existing chat threads.

```java
PagedIterable<ChatThreadItem> chatThreads = chatClient.listChatThreads();

chatThreads.forEach(chatThread -> {
    System.out.printf("ChatThread id is %s.\n", chatThread.getId());
});
```

### Get a chat thread client

#### Twilio

Here’s how you can retrieve and interact with a specific conversation in Twilio using Java:
```Java
// Retrieve a specific conversation by its SID
Conversation conversation = Conversation.fetcher(conversationSid).fetch();
System.out.println("Retrieved Conversation SID: " + conversation.getSid());
System.out.println("Friendly Name: " + conversation.getFriendlyName())
```

#### Azure Communication Services

The `getChatThreadClient` method returns a thread client for a thread that already exists. It can be used for performing operations on the created thread: add participants, send message, etc.
`chatThreadId` is the unique ID of the existing chat thread.

```Java
ChatThreadClient chatThreadClient = chatClient.getChatThreadClient(chatThreadId);
```

### Send a message to a chat thread

#### Twilio
Sending a message in Twilio involves using the Message.creator() method.

```Java
import com.twilio.rest.conversations.v1.conversation.Message;

Message message = Message.creator(conversationSid)
    .setBody("Hello, World!")
    .create();
System.out.println("Message SID: " + message.getSid());
```

Twilio allows you to send media files by providing a media URL when sending a message.
```Java
List<URI> mediaUrls = Arrays.asList(URI.create("https://example.com/image.jpg"));
Message message = Message.creator(conversationSid)
    .setBody("Check out this image!")
    .setMediaUrl(mediaUrls)
    .create();
System.out.println("Message SID: " + message.getSid());
```


#### Azure Communication Services
Unlike Twilio, Azure Communication Services does not have separate functions to send media.
Use the `sendMessage` method to send a message to the thread you created, identified by chatThreadId.
`sendChatMessageOptions` is used to describe the chat message request.

- Use `content` to provide the chat message content.
- Use `type` to specify the chat message content type, TEXT or HTML.
- Use `senderDisplayName` to specify the display name of the sender.
- Use `metadata` optionally to include any additional data you want to send along with the message. This field provides a mechanism for developers to extend chat message functionality and add custom information for your use case. For example, when sharing a file link in the message, you might want to add `hasAttachment:true` in metadata so that recipient's application can parse that and display accordingly.

The response `sendChatMessageResult` contains an `id`, which is the unique ID of the message.

```Java
Map<String, String> metadata = new HashMap<String, String>();
metadata.put("hasAttachment", "true");
metadata.put("attachmentUrl", "https://contoso.com/files/attachment.docx");

SendChatMessageOptions sendChatMessageOptions = new SendChatMessageOptions()
    .setContent("Please take a look at the attachment")
    .setType(ChatMessageType.TEXT)
    .setSenderDisplayName("Sender Display Name")
    .setMetadata(metadata);

SendChatMessageResult sendChatMessageResult = chatThreadClient.sendMessage(sendChatMessageOptions);
String chatMessageId = sendChatMessageResult.getId();
```

### Receive chat messages from a chat thread

#### Twilio
Twilio Conversations uses webhooks to receive messages. You typically set up a webhook URL in the Twilio console.
```Java
// This would be handled by a servlet or similar in a Java web application
public void handleIncomingMessage(HttpServletRequest request, HttpServletResponse response) {
    String body = request.getParameter("Body");
    System.out.println("Received message: " + body);
}
```

This is how you can receive media file in Twilio.
```Java
private static final Logger logger = Logger.getLogger(TwilioWebhookServlet.class.getName());

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Get the number of media items attached to the message
        String numMedia = request.getParameter("NumMedia");

        int mediaCount = Integer.parseInt(numMedia);

        if (mediaCount > 0) {
            // Loop through each media file received
            for (int i = 0; i < mediaCount; i++) {
                // Get the media URL from the request
                String mediaUrl = request.getParameter("MediaUrl" + i);
                String mediaContentType = request.getParameter("MediaContentType" + i);

                logger.info("Received media file: " + mediaUrl + " with content type: " + mediaContentType);

                // Process the media file (e.g., download, store, etc.)
                // Example: Download and save the file, or send it to another service
            }
        } else {
            // Handle a message with no media
            String messageBody = request.getParameter("Body");
            logger.info("Received text message: " + messageBody);
        }
```

#### Azure Communication Services

You can retrieve chat messages by polling the `listMessages` method on the chat thread client at specified intervals.

```Java
chatThreadClient.listMessages().forEach(message -> {
    System.out.printf("Message id is %s.\n", message.getId());
});
```

`listMessages` returns the latest version of the message, including any edits or deletes that happened to the message using `.editMessage()` and `.deleteMessage()`. For deleted messages, `chatMessage.getDeletedOn()` returns a datetime value indicating when that message was deleted. For edited messages, `chatMessage.getEditedOn()` returns a datetime indicating when the message was edited. The original time of message creation can be accessed using `chatMessage.getCreatedOn()`, and it can be used for ordering the messages.

Read more about message types here: [Message Types](../../../concepts/chat/concepts.md#message-types).

### Send read receipt

#### Twilio
Twilio Conversations does not have a direct API for sending read receipts. Twilio Conversations manages read receipts automatically.

#### Azure Communication Services

Use the `sendReadReceipt` method to post a read receipt event to a chat thread, on behalf of a user.
`chatMessageId` is the unique ID of the chat message that was read.

```Java
String chatMessageId = message.getId();
chatThreadClient.sendReadReceipt(chatMessageId);
```

### List chat participants

#### Twilio
To retrieve participants in a Twilio conversation:
```Java
ResourceSet<Participant> participants = Participant.reader(conversationSid).read();

for (Participant participant : participants) {
    System.out.println("Participant SID: " + participant.getSid());
}
```

#### Azure Communication Services

Use `listParticipants` to retrieve a paged collection containing the participants of the chat thread identified by chatThreadId.

```Java
PagedIterable<ChatParticipant> chatParticipantsResponse = chatThreadClient.listParticipants();
chatParticipantsResponse.forEach(chatParticipant -> {
    System.out.printf("Participant id is %s.\n", ((CommunicationUserIdentifier) chatParticipant.getCommunicationIdentifier()).getId());
});
```

### Add a user as participant to the chat thread

#### Twilio

You add participants to a conversation using the Participant.creator() method.
```Java
import com.twilio.rest.conversations.v1.conversation.Participant;

Participant participant = Participant.creator(conversationSid)
    .setIdentity("user@example.com")
    .create();
System.out.println("Participant SID: " + participant.getSid());
```

#### Azure Communication Services

Once a chat thread is created, you can then add and remove users from it. By adding users, you give them access to send messages to the chat thread, and add/remove other participants. You'll need to start by getting a new access token and identity for that user. Before calling addParticipants method, ensure that you've acquired a new access token and identity for that user. The user will need that access token in order to initialize their chat client.

Use the `addParticipants` method to add participants to the thread.

- `communicationIdentifier`, required, is the CommunicationIdentifier you've created by the CommunicationIdentityClient in the [User Access Token](../../identity/access-tokens.md) quickstart.
- `displayName`, optional, is the display name for the thread participant.
- `shareHistoryTime`, optional, is the time from which the chat history is shared with the participant. To share history since the inception of the chat thread, set this property to any date equal to, or less than the thread creation time. To share no history previous to when the participant was added, set it to the current date. To share partial history, set it to the required date.

```Java
List<ChatParticipant> participants = new ArrayList<ChatParticipant>();

CommunicationUserIdentifier identity3 = new CommunicationUserIdentifier("<USER_3_ID>");
CommunicationUserIdentifier identity4 = new CommunicationUserIdentifier("<USER_4_ID>");

ChatParticipant thirdThreadParticipant = new ChatParticipant()
    .setCommunicationIdentifier(identity3)
    .setDisplayName("Display Name 3");

ChatParticipant fourthThreadParticipant = new ChatParticipant()
    .setCommunicationIdentifier(identity4)
    .setDisplayName("Display Name 4");

participants.add(thirdThreadParticipant);
participants.add(fourthThreadParticipant);

chatThreadClient.addParticipants(participants);
```
