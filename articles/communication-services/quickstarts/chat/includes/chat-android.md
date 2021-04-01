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

[!INCLUDE [Public Preview Notice](../../../includes/public-preview-include-chat.md)]

## Prerequisites

Before you get started, make sure to:

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Install [Android Studio](https://developer.android.com/studio), we will be using Android Studio to create an Android application for the quickstart to install dependencies.
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../create-communication-resource.md). You'll need to **record your resource endpoint** for this quickstart.
- Create **two** Communication Services Users and issue them a user access token [User Access Token](../../access-tokens.md). Be sure to set the scope to **chat**, and **note the token string and the userId string**. In this quickstart, we will create a thread with an initial participant and then add a second participant to the thread.

## Setting up

### Create a new android application

1. Open Android Studio and select `Create a new project`. 
2. On the next window, select `Empty Activity` as the project template.
3. When choosing options, enter `ChatQuickstart` as the project name.
4. Click next and choose the directory where you want the project to be created.

### Install the libraries

We'll use Gradle to install the necessary Communication Services dependencies. From the command line, navigate inside the root directory of the `ChatQuickstart` project. Open the app's build.gradle file and add the following dependencies to the `ChatQuickstart` target:

```
implementation 'com.azure.android:azure-communication-common:1.0.0-beta.8'
implementation 'com.azure.android:azure-communication-chat:1.0.0-beta.8'
```

#### Exclude meta files in packaging options in root build.gradle
```
android {
   ...
    packagingOptions {
        exclude 'META-INF/DEPENDENCIES'
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/license'
        exclude 'META-INF/NOTICE'
        exclude 'META-INF/notice'
        exclude 'META-INF/ASL2.0'
        exclude("META-INF/*.md")
        exclude("META-INF/*.txt")
        exclude("META-INF/*.kotlin_module")
    }
}
```

#### (Alternative) To install libraries through Maven
To import the library into your project using the [Maven](https://maven.apache.org/) build system, add it to the `dependencies` section of your app's `pom.xml` file, specifying its artifact ID and the version you wish to use:

```xml
<dependency>
  <groupId>com.azure.android</groupId>
  <artifactId>azure-communication-chat</artifactId>
  <version>1.0.0-beta.8</version>
</dependency>
```


### Setup the placeholders

Open and edit the file `MainActivity.java`. In this Quickstart, we'll add our code to `MainActivity`, and view the output in the console. This quickstart does not address building a UI. At the top of file, import the `Communication common` and `Communication chat` libraries:

```
import com.azure.android.communication.chat.*;
import com.azure.android.communication.common.*;
```

Copy the following code into the file `MainActivity`:

```java
    private String secondUserId = "<second_user_id>";
    private String threadId = "<thread_id>";
    private String chatMessageId = "<chat_message_id>";
    private final String sdkVersion = "1.0.0-beta.8";
    private static final String APPLICATION_ID = "Chat Quickstart App";
    private static final String SDK_NAME = "azure-communication-com.azure.android.communication.chat";
    private static final String TAG = "--------------Chat Quickstart App-------------";

    private void log(String msg) {
        Log.i(TAG, msg);
        Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
    }
    
   @Override
    protected void onStart() {
        super.onStart();
        try {
            // <CREATE A CHAT CLIENT>

            // <CREATE A CHAT THREAD>

            // <CREATE A CHAT THREAD CLIENT>

            // <SEND A MESSAGE>

            // <ADD A USER>

            // <LIST USERS>

            // <REMOVE A USER>
            
            // <<SEND A TYPING NOTIFICATION>>
            
            // <<SEND A READ RECEIPT>>
               
            // <<LIST READ RECEIPTS>>
        } catch (Exception e){
            System.out.println("Quickstart failed: " + e.getMessage());
        }
    }
```

In following steps, we'll replace the placeholders with sample code using the Azure Communication Services Chat library.


### Create a chat client

Replace the comment `<CREATE A CHAT CLIENT>` with the following code (put the import statements at top of the file):

```java
import com.azure.android.communication.chat.ChatAsyncClient;
import com.azure.android.communication.chat.ChatClientBuilder;
import com.azure.android.core.credential.AccessToken;
import com.azure.android.core.http.HttpHeader;
import com.azure.android.core.http.okhttp.OkHttpAsyncClientProvider;
import com.azure.android.core.http.policy.BearerTokenAuthenticationPolicy;
import com.azure.android.core.http.policy.UserAgentPolicy;

final String endpoint = "https://<resource>.communication.azure.com";
final String userAccessToken = "<user_access_token>";

ChatAsyncClient chatAsyncClient = new ChatClientBuilder()
    .endpoint(endpoint)
    .credentialPolicy(new BearerTokenAuthenticationPolicy((request, callback) ->
        callback.onSuccess(new AccessToken(userAccessToken, OffsetDateTime.now().plusDays(1)))))
    .addPolicy(new UserAgentPolicy(APPLICATION_ID, SDK_NAME, sdkVersion))
    .httpClient(new OkHttpAsyncClientProvider().createInstance())
    .buildAsyncClient();

```

1. Use the `ChatClientBuilder` to configure and create an instance of `ChatAsyncClient`.
2. Replace `<resource>` with your Communication Services resource.
3. Replace `<user_access_token>` with a valid Communication Services access token.

## Object model
The following classes and interfaces handle some of the major features of the Azure Communication Services Chat SDK for JavaScript.

| Name                                   | Description                                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ChatClient/ChatAsyncClient | This class is needed for the Chat functionality. You instantiate it with your subscription information, and use it to create, get, and delete threads. |
| ChatThreadClient/ChatThreadAsyncClient | This class is needed for the Chat Thread functionality. You obtain an instance via the ChatClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts, subscribe chat events. |

## Start a chat thread

We'll use our `ChatAsyncClient` to create a new thread with an initial user.

Replace the comment `<CREATE A CHAT THREAD>` with the following code:

```java
// A list of ChatParticipant to start the thread with.
List<ChatParticipant> participants = new ArrayList<>();
// The communication user ID you created before, required.
String id = "<user_id>";
// The display name for the thread participant.
String displayName = "initial participant";
participants.add(new ChatParticipant()
    .setCommunicationIdentifier(new CommunicationUserIdentifier(id))
    .setDisplayName(displayName));

// The topic for the thread.
final String topic = "General";
// Optional, set a repeat request ID.
final String repeatabilityRequestID = "";
// Options to pass to the create method.
CreateChatThreadOptions createChatThreadOptions = new CreateChatThreadOptions()
    .setTopic(topic)
    .setParticipants(participants)
    .setIdempotencyToken(repeatabilityRequestID);

CreateChatThreadResult createChatThreadResult =
    chatAsyncClient.createChatThread(createChatThreadOptions).get();
ChatThreadProperties chatThreadProperties = createChatThreadResult.getChatThreadProperties();
threadId = chatThreadProperties.getId();

```

Replace `<user_id>` with a valid Communication Services user ID. We'll use the `threadId` from the response returned to the completion handler in later steps, so replace the `<thread_id>` in the class with the `threadId` we get from this request and re-run the app.

## Get a chat thread client

Now that we've created a Chat thread we'll obtain a `ChatThreadAsyncClient` to perform operations within the thread. Replace the comment `<CREATE A CHAT THREAD CLIENT>` with the following code:

```
ChatThreadAsyncClient chatThreadAsyncClient = new ChatThreadClientBuilder()
    .endpoint(endpoint)
    .credentialPolicy(new BearerTokenAuthenticationPolicy((request, callback) ->
        callback.onSuccess(new AccessToken(userAccessToken, OffsetDateTime.now().plusDays(1)))))
    .addPolicy(new UserAgentPolicy(APPLICATION_ID, SDK_NAME, sdkVersion))
    .httpClient(new OkHttpAsyncClientProvider().createInstance())
    .chatThreadId(threadId)
    .buildAsyncClient();

```

## Send a message to a chat thread

Make sure we have replaced `<thread_id>` with a valid thread ID, we will send message to that thread now.

Replace the comment `<SEND A MESSAGE>` with the following code:

```java
// The chat message content, required.
final String content = "Test message 1";
// The display name of the sender, if null (i.e. not specified), an empty name will be set.
final String senderDisplayName = "An important person";
SendChatMessageOptions chatMessageOptions = new SendChatMessageOptions()
    .setType(ChatMessageType.TEXT)
    .setContent(content)
    .setSenderDisplayName(senderDisplayName);

// A string is the response returned from sending a message, it is an id, which is the unique ID of the message.
chatMessageId = chatThreadAsyncClient.sendMessage(chatMessageOptions).get().getId();

```

After we get `chatMessageId`, we can replace `<chat_message_id>` with `chatMessageId` for later method usage in quickstart and re-run the app.

## Add a user as a participant to the chat thread

Replace the comment `<ADD A USER>` with the following code:

```java
// The display name for the thread participant.
displayName = "a new participant";
ChatParticipant participant = new ChatParticipant()
    .setCommunicationIdentifier(new CommunicationUserIdentifier(secondUserId))
    .setDisplayName(secondUserDisplayName);
        
chatThreadAsyncClient.addParticipant(participant);

```

Replace `<second_user_id>` in the class with the Communication Services user ID of the user to be added. 

## List users in a thread

Replace the `<LIST USERS>` comment with the following code:

```java
// The maximum number of participants to be returned per page, optional.
final int maxPageSize = 10;

// Skips participants up to a specified position in response.
final int skip = 0;

// Options to pass to the list method.
ListParticipantsOptions listParticipantsOptions = new ListParticipantsOptions()
    .setMaxPageSize(maxPageSize)
    .setSkip(skip);

PagedResponse<ChatParticipant> firstPageWithResponse =
    chatThreadAsyncClient.getParticipantsFirstPageWithResponse(listParticipantsOptions, Context.NONE).get();

for (ChatParticipant participant : firstPageWithResponse.getValue()) {
    // You code to handle participant
}

listParticipantsNextPage(firstPageWithResponse.getContinuationToken(), 2);

```

Put the following helper method into the class:

```java
void listParticipantsNextPage(String continuationToken, int pageNumber) {
if (continuationToken != null) {
    PagedResponse<ChatParticipant> nextPageWithResponse =
        chatThreadAsyncClient.getParticipantsNextPageWithResponse(continuationToken, Context.NONE).get();
        for (ChatParticipant participant : nextPageWithResponse.getValue()) {
            // You code to handle participant
        }
            
        listParticipantsNextPage(nextPageWithResponse.getContinuationToken(), ++pageNumber);
    }
}

```


## Remove user from a chat thread

Make sure to replace `<second_user_id>` to a valid user ID, we will remove second user from the thread now.

Replace the `<REMOVE A USER>` comment with the following code:

```java
// Using the unique ID of the participant.
chatThreadAsyncClient.removeParticipant(new CommunicationUserIdentifier(secondUserId)).get();

```

## Send a typing notification

Replace the `<SEND A TYPING NOTIFICATION>` comment with the following code:

```java
chatThreadAsyncClient.sendTypingNotification().get();
```

## Send a read receipt

Make sure to replace `<chat_message_id>` with a valid chat message ID, we will send read receipt for this message now.

Replace the `<SEND A READ RECEIPT>` comment with the following code:

```java
chatThreadAsyncClient.sendReadReceipt(chatMessageId).get();
```

## List read receipts

Replace the `<READ RECEIPTS>` comment with the following code:

```java
// The maximum number of participants to be returned per page, optional.
maxPageSize = 10;
// Skips participants up to a specified position in response.
skip = 0;
// Options to pass to the list method.
ListReadReceiptOptions listReadReceiptOptions = new ListReadReceiptOptions()
    .setMaxPageSize(maxPageSize)
    .setSkip(skip);

PagedResponse<ChatMessageReadReceipt> firstPageWithResponse =
    chatThreadAsyncClient.getReadReceiptsFirstPageWithResponse(listReadReceiptOptions, Context.NONE).get();

for (ChatMessageReadReceipt readReceipt : firstPageWithResponse.getValue()) {
    // You code to handle readReceipt
}

listReadReceiptsNextPage(firstPageWithResponse.getContinuationToken(), 2);

```

Put the following helper method into the class:
```java
void listReadReceiptsNextPage(String continuationToken, int pageNumber) {
    if (continuationToken != null) {
        PagedResponse<ChatMessageReadReceipt> nextPageWithResponse =
            chatThreadAsyncClient.getReadReceiptsNextPageWithResponse(continuationToken, Context.NONE).get();

        for (ChatMessageReadReceipt readReceipt : nextPageWithResponse.getValue()) {
            // You code to handle readReceipt
        }

        listParticipantsNextPage(nextPageWithResponse.getContinuationToken(), ++pageNumber);
    }
}

```


## Run the code

In Android Studio, hit the Run button to build and run the project. In the console, you can view the output from the code and the logger output from the ChatClient.
