
## Prerequisites
Before you get started, make sure to:

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../create-a-communication-resource.md). You'll need to record your resource **endpoint** for this quickstart
- Install [JDK 8] or [JDK 11]
    + [OpenJDK 8 (with Hotspot)](https://adoptopenjdk.net/releases.html?variant=openjdk8&jvmVariant=hotspot)
    + [OpenJDK 11 (with Hotspot)](https://adoptopenjdk.net/releases.html?variant=openjdk11&jvmVariant=hotspot)
- Download and install [Maven](http://maven.apache.org/download.cgi)
    + The rest of this guide contains instructions for consuming packages via Maven
- Obtain a `User Access Token` to enable the call client. For details, see [here](../../user-access-tokens.md)


## Setting Up

### Create a new Java application

Open your terminal or command window and navigate to the directory where you would like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

You'll notice that the 'generate' goal created a directory with the same name as the artifactId. Under this directory, the src/main/java directory contains the project source code, the src/test/java directory contains the test source, and the pom.xml file is the project's Project Object Model, or POM.

### Add the package references for the Chat SDK
Add the project [POM file](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html) to your Maven application.

Reference the `azure-communication-chat` package, which contains the Chat APIs:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-chat</artifactId>
    <version>1.0.0-beta.1</version> 
</dependency>
```

For authentication, your client needs to use the 'azure-communication-common-client' package:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-common-client</artifactId>
    <version>1.0.0-beta.1</version> 
</dependency>

```

## Object Model

The following classes and interfaces handle some of the major features of the Azure Communication Services Chat SDK for Java.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| [ChatClient](../../../references/overview.md) | This class is needed for the Chat functionality. You instantiate it with your subscription information, and use it to create, get and delete threads. |
| [ChatAsyncClient](../../../references/overview.md) | This class is needed for the asynchronous Chat functionality. You instantiate it with your subscription information, and use it to create, get and delete threads. |
| [ChatThreadClient](../../../references/overview.md) | This class is needed for the Chat Thread functionality. You obtain an instance via the ChatClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts. |
| [ChatThreadAsyncClient](../../../references/overview.md) | This class is needed for the asynchronous Chat Thread functionality. You obtain an instance via the ChatAsyncClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts. |

## Create a Chat Client
To create a chat client, you'll use the Communications Service endpoint and the access token that was generated as part of pre-requisite steps. User access tokens enable you to build client applications that directly authenticate to Azure Communication Services. Once you generate these tokens on your server, pass them back to a client device. You need to use the CommunicationUserCredential class from the Common SDK to pass the token to your chat client.

```Java
// Your unique Azure Communication service endpoint
String endpoint = "https://<RESOURCE_NAME>.communcationservices.azure.com";

// Create an HttpClient builder of your choice and customize it
// Use com.azure.core.http.netty.NettyAsyncHttpClientBuilder if that suits your needs
CustomHttpClientBuilder yourHttpClientBuilder = new CustomHttpClientBuilder();
HttpClient httpClient = yourHttpClientBuilder.build();

// User access token fetched from your trusted service
String userAccessToken = "SECRET";

// Create a CommunicationUserCredential with the given access token, which is only valid until the token is valid
CommunicationUserCredential userCredential = new CommunicationUserCredential(userAccessToken);

// Initialize the chat client
final ChatClientBuilder builder = new ChatClientBuilder();
builder.endpoint(endpoint)
    .credential(credential)
    .httpClient(httpClient);
ChatClient chatClient = builder.buildClient();
```


## Start a Chat Thread

Use the `createChatThread` method to create a chat thread.
`createChatThreadOptions` is used to describe the thread request.

- Use `topic` to give a topic to this chat; Topic can be updated after the chat thread is created using the `UpdateThread` function.
- Use `members` to list the thread members to be added to the thread.

The response `chatThreadClient` is used to perform operations on the created chat threa: adding members to the chat thread, sending a message, deleting a message, etc.
It contains a `chatThreadId` property which is the unique ID of the chat thread. The property is accessible by the public method .getChatThreadId().

```Java
List<ChatThreadMember> members = new ArrayList<ChatThreadMember>();

ChatThreadMember firstThreadMember = new ChatThreadMember()
    .setUser(user1)
    .setDisplayName("Member Display Name 1");

ChatThreadMember secondThreadMember = new ChatThreadMember()
    .setUser(user2)
    .setDisplayName("Member Display Name 2");

members.add(firstThreadMember);
members.add(secondThreadMember);

CreateChatThreadOptions createChatThreadOptions = new CreateChatThreadOptions()
    .setTopic("Topic")
    .setMembers(members);
ChatThreadClient chatThreadClient = chatClient.createChatThread(createChatThreadOptions);
String chatThreadId = chatThreadClient.getChatThreadId();
```

## Get a Chat Thread Client

The `getChatThreadClient` method returns a thread client for a thread that already exists. It can be used for performing operations on the created thread: add members, send message, etc.
`chatThreadId` is the unique ID of the existing chat thread.

```Java
String chatThreadId = "Id";
ChatThread chatThread = chatClient.getChatThread(chatThreadId);
```

## Send a Message to a Chat Thread

Use the `sendMessage` method to send a message to the thread you just created, identified by chatThreadId.
`sendChatMessageOptions` is used to describe the chat message request.

- Use `content` to provide the chat message content.
- Use `priority` to specify the chat message priority level, such as 'Normal' or 'High'; this property can be used to have a UI indicator for the recipient user in your app, to bring attention to the message or execute custom business logic.
- Use `senderDisplayName` to specify the display name of the sender.

The response `sendChatMessageResult` contains an `id`, which is the unique ID of the message.

```Java
SendChatMessageOptions sendChatMessageOptions = new SendChatMessageOptions()
    .setContent("Message content")
    .setPriority(ChatMessagePriority.NORMAL)
    .setSenderDisplayName("Sender Display Name");

SendChatMessageResult sendChatMessageResult = chatThreadClient.sendMessage(sendChatMessageOptions);
String chatMessageId = sendChatMessageResult.getId();
```

## Receive Chat Messages from a Chat Thread

You can retrieve chat messages by polling the `listMessages` method on the chat thread client at specified intervals.

```Java
PagedIterable<ChatMessage> chatMessagesResponse = chatThreadClient.listMessages();
chatMessagesResponse.iterableByPage().forEach(resp -> {
    System.out.printf("Response headers are %s. Url %s  and status code %d %n", resp.getHeaders(),
        resp.getRequest().getUrl(), resp.getStatusCode());
    resp.getItems().forEach(message -> {
        System.out.printf("Message id is %s.", message.getId());
    });
});
```

`listMessages` returns the latest version of the message, including any edits or deletes that happened to the message using .editMessage() and .deleteMessage(). For deleted messages, `chatMessage.getDeletedOn()` returns a datetime value indicating when that message was deleted. For edited messages, `chatMessage.getEditedOn()` returns a datetime indicating when the message was edited. The original time of message creation can be accessed using `chatMessage.getCreatedOn()`, and it can be used for ordering the messages.

`listMessages` returns different types of messages which can be identified by `chatMessage.getType()`. These types are:

-`Text`: Regular chat message sent by a thread member.

-`ThreadActivity/TopicUpdate`: System message that indicates the topic has been updated.

-`ThreadActivity/AddMember`: System message that indicates one or more members have been added to the chat thread.

-`ThreadActivity/DeleteMember`: System message that indicates a member has been removed from the chat thread.

For more details, see [Message Types](../../../concepts/chat/concepts.md#message-types).

## Add Users as Members to the Chat Thread

Once a chat thread is created, you can then add and remove users from it. By adding users, you give them access to send messages to the chat thread, and add/remove other members. You'll need to start by getting a new access token and identity for that user. Before calling addMembers method, ensure that you have acquired a new access token and identity for that user. The user will need that access token in order to initialize their chat client.

Use `addMembers` method to add thread members to the thread identified by threadId.
`addChatThreadMembersOptions` describes the request object containing the members to be added; Use `.setMembers()` to set the thread members to be added to the thread;

- `user`, required, is the CommunicationUser you've created by the CommunicationIdentityClient at [create a user](https://github.com/mikben/azure-docs-pr/blob/release-project-spool/articles/project-spool/quickstarts/user-access-tokens.md#create-a-user)
- `display_name`, optional, is the display name for the thread member.
- `share_history_time`, optional, is the time from which the chat history is shared with the member. To share history since the inception of the chat thread, set this property to any date equal to, or less than the thread creation time. To share no history previous to when the member was added, set it to the current date. To share partial history, set it to the required date.

```Java
List<ChatThreadMember> members = new ArrayList<ChatThreadMember>();

ChatThreadMember firstThreadMember = new ChatThreadMember()
    .setUser(user1)
    .setDisplayName("Display Name 1");

ChatThreadMember secondThreadMember = new ChatThreadMember()
    .setUser(user2)
    .setDisplayName("Display Name 2");

members.add(firstThreadMember);
members.add(secondThreadMember);

AddChatThreadMembersOptions addChatThreadMembersOptions = new AddChatThreadMembersOptions()
    .setMembers(members);
chatThreadClient.addMembers(addChatThreadMembersOptions);
```

## Remove User from a Chat Thread

Similar to adding a user to a thread, you can remove users from a chat thread. To do that, you need to track the user identities of the members you have added.

Use `removeMember`, where `user` is the CommunicationUser you've created.

```Java
chatThreadClient.removeMember(user);
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
