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

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- A deployed Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- A [User Access Token](../../access-tokens.md). Be sure to set the scope to "chat", and note the token string as well as the userId string.


## Setting up

### Create a new Java application

Open your terminal or command window and navigate to the directory where you would like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

You'll notice that the 'generate' goal created a directory with the same name as the artifactId. Under this directory, the `src/main/java directory` contains the project source code, the `src/test/java` directory contains the test source, and the pom.xml file is the project's Project Object Model, or [POM](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html).

Update your application's POM file to use Java 8 or higher:

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

### Add the package references for the chat client library

In your POM file, reference the `azure-communication-chat` package with the Chat APIs:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-chat</artifactId>
    <version>1.0.0-beta.4</version> 
</dependency>
```

For authentication, your client needs to reference the `azure-communication-common` package:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-common</artifactId>
    <version>1.0.0</version> 
</dependency>
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Chat client library for Java.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| ChatClient | This class is needed for the Chat functionality. You instantiate it with your subscription information, and use it to create, get and delete threads. |
| ChatAsyncClient | This class is needed for the asynchronous Chat functionality. You instantiate it with your subscription information, and use it to create, get and delete threads. |
| ChatThreadClient | This class is needed for the Chat Thread functionality. You obtain an instance via the ChatClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts. |
| ChatThreadAsyncClient | This class is needed for the asynchronous Chat Thread functionality. You obtain an instance via the ChatAsyncClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts. |

## Create a chat client
To create a chat client, you'll use the Communications Service endpoint and the access token that was generated as part of pre-requisite steps. User access tokens enable you to build client applications that directly authenticate to Azure Communication Services. Once you generate these tokens on your server, pass them back to a client device. You need to use the CommunicationTokenCredential class from the Common client library to pass the token to your chat client. 

Learn more about [Chat Architecture](../../../concepts/chat/concepts.md)

When adding the import statements, be sure to only add imports from the com.azure.communication.chat and com.azure.communication.chat.models namespaces, and not from the com.azure.communication.chat.implementation namespace. In the App.java file that was generated via Maven, you can use the following code to begin with:

```Java
import com.azure.communication.chat.*;
import com.azure.communication.chat.models.*;
import com.azure.communication.common.*;
import com.azure.core.http.HttpClient;

import java.io.*;

public class App
{
    public static void main( String[] args ) throws IOException
    {
        System.out.println("Azure Communication Services - Chat Quickstart");
        
        // Your unique Azure Communication service endpoint
        String endpoint = "https://<RESOURCE_NAME>.communication.azure.com";

        // Create an HttpClient builder of your choice and customize it
        // Use com.azure.core.http.netty.NettyAsyncHttpClientBuilder if that suits your needs
        NettyAsyncHttpClientBuilder yourHttpClientBuilder = new NettyAsyncHttpClientBuilder();
        HttpClient httpClient = yourHttpClientBuilder.build();

        // User access token fetched from your trusted service
        String userAccessToken = "<USER_ACCESS_TOKEN>";

        // Create a CommunicationTokenCredential with the given access token, which is only valid until the token is valid
        CommunicationTokenCredential userCredential = new CommunicationTokenCredential(userAccessToken);

        // Initialize the chat client
        final ChatClientBuilder builder = new ChatClientBuilder();
        builder.endpoint(endpoint)
            .credential(userCredential)
            .httpClient(httpClient);
        ChatClient chatClient = builder.buildClient();
    }
}
```


## Start a chat thread

Use the `createChatThread` method to create a chat thread.
`createChatThreadOptions` is used to describe the thread request.

- Use `topic` to give a topic to this chat; Topic can be updated after the chat thread is created using the `UpdateThread` function.
- Use `participants` to list the thread participants to be added to the thread. `ChatParticipant` takes the user you created in the [User Access Token](../../access-tokens.md) quickstart.

The response `chatThreadClient` is used to perform operations on the created chat thread: adding participants to the chat thread, sending a message, deleting a message, etc.
It contains a `chatThreadId` property which is the unique ID of the chat thread. The property is accessible by the public method .getChatThreadId().

```Java
List<ChatParticipant> participants = new ArrayList<ChatParticipant>();

ChatParticipant firstThreadParticipant = new ChatParticipant()
    .setCommunicationIdentifier(firstUser)
    .setDisplayName("Participant Display Name 1");
    
ChatParticipant secondThreadParticipant = new ChatParticipant()
    .setCommunicationIdentifier(secondUser)
    .setDisplayName("Participant Display Name 2");

participants.add(firstThreadParticipant);
participants.add(secondThreadParticipant);

CreateChatThreadOptions createChatThreadOptions = new CreateChatThreadOptions()
    .setTopic("Topic")
    .setParticipants(participants);
ChatThreadClient chatThreadClient = chatClient.createChatThread(createChatThreadOptions);
String chatThreadId = chatThreadClient.getChatThreadId();
```

## Send a message to a chat thread

Use the `sendMessage` method to send a message to the thread you just created, identified by chatThreadId.
`sendChatMessageOptions` is used to describe the chat message request.

- Use `content` to provide the chat message content.
- Use `type` to specify the chat message content type, TEXT or HTML.
- Use `senderDisplayName` to specify the display name of the sender.

The response `sendChatMessageResult` contains an `id`, which is the unique ID of the message.

```Java
SendChatMessageOptions sendChatMessageOptions = new SendChatMessageOptions()
    .setContent("Message content")
    .setType(ChatMessageType.TEXT)
    .setSenderDisplayName("Sender Display Name");

SendChatMessageResult sendChatMessageResult = chatThreadClient.sendMessage(sendChatMessageOptions);
String chatMessageId = sendChatMessageResult.getId();
```


## Get a chat thread client

The `getChatThreadClient` method returns a thread client for a thread that already exists. It can be used for performing operations on the created thread: add participants, send message, etc.
`chatThreadId` is the unique ID of the existing chat thread.

```Java
String chatThreadId = "Id";
ChatThread chatThread = chatClient.getChatThread(chatThreadId);
```

## Receive chat messages from a chat thread

You can retrieve chat messages by polling the `listMessages` method on the chat thread client at specified intervals.

```Java
chatThreadClient.listMessages().iterableByPage().forEach(resp -> {
    System.out.printf("Response headers are %s. Url %s  and status code %d %n", resp.getHeaders(),
        resp.getRequest().getUrl(), resp.getStatusCode());
    resp.getItems().forEach(message -> {
        System.out.printf("Message id is %s.", message.getId());
    });
});
```

`listMessages` returns the latest version of the message, including any edits or deletes that happened to the message using .editMessage() and .deleteMessage(). For deleted messages, `chatMessage.getDeletedOn()` returns a datetime value indicating when that message was deleted. For edited messages, `chatMessage.getEditedOn()` returns a datetime indicating when the message was edited. The original time of message creation can be accessed using `chatMessage.getCreatedOn()`, and it can be used for ordering the messages.

`listMessages` returns different types of messages which can be identified by `chatMessage.getType()`. These types are:

- `text`: Regular chat message sent by a thread participant.

- `html`: HTML chat message sent by a thread participant.

- `topicUpdated`: System message that indicates the topic has been updated.

- `participantAdded`: System message that indicates one or more participants have been added to the chat thread.

- `participantRemoved`: System message that indicates a participant has been removed from the chat thread.

For more details, see [Message Types](../../../concepts/chat/concepts.md#message-types).

## Add a user as participant to the chat thread

Once a chat thread is created, you can then add and remove users from it. By adding users, you give them access to send messages to the chat thread, and add/remove other participants. You'll need to start by getting a new access token and identity for that user. Before calling addParticipants method, ensure that you have acquired a new access token and identity for that user. The user will need that access token in order to initialize their chat client.

Use `addParticipants` method to add participants to the thread identified by threadId.

- Use `listParticipants` to list the participants to be added to the chat thread.
- `communicationIdentifier`, required, is the CommunicationIdentifier you've created by the CommunicationIdentityClient in the [User Access Token](../../access-tokens.md) quickstart.
- `display_name`, optional, is the display name for the thread participant.
- `share_history_time`, optional, is the time from which the chat history is shared with the participant. To share history since the inception of the chat thread, set this property to any date equal to, or less than the thread creation time. To share no history previous to when the participant was added, set it to the current date. To share partial history, set it to the required date.

```Java
List<ChatParticipant> participants = new ArrayList<ChatParticipant>();

ChatParticipant firstThreadParticipant = new ChatParticipant()
    .setCommunicationIdentifier(identity1)
    .setDisplayName("Display Name 1");

ChatParticipant secondThreadParticipant = new ChatParticipant()
    .setCommunicationIdentifier(identity2)
    .setDisplayName("Display Name 2");

participants.add(firstThreadParticipant);
participants.add(secondThreadParticipant);

AddChatParticipantsOptions addChatParticipantsOptions = new AddChatParticipantsOptions()
    .setParticipants(participants);
chatThreadClient.addParticipants(addChatParticipantsOptions);
```

## Remove participant from a chat thread

Similar to adding a participant to a thread, you can remove participants from a chat thread. To do that, you need to track the identities of the participants you have added.

Use `removeParticipant`, where `identifier` is the CommunicationIdentifier you've created.

```Java
chatThreadClient.removeParticipant(identity);
```

## Run the code

Navigate to the directory containing the *pom.xml* file and compile the project by using the following `mvn` command.

```console
mvn compile
```

Then, build the package.

```console
mvn package
```

Run the following `mvn` command to execute the app.

```console
mvn exec:java -Dexec.mainClass="com.communication.quickstart.App" -Dexec.cleanupDaemonThreads=false
```