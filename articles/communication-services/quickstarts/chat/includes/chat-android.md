---
title: include file
description: include file
services: azure-communication-services
author: mikben
manager: mikben
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 2/16/2020
ms.topic: include
ms.custom: include file
ms.author: mikben
---

## Prerequisites
Before you get started, make sure to:

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Install [Android Studio](https://developer.android.com/studio), we will be using Android Studio to create an Android application for the quickstart to install dependencies.
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../create-communication-resource.md). You'll need to **record your resource endpoint** for this quickstart.
- Create **two** Communication Services Users and issue them a user access token [User Access Token](../../access-tokens.md). Be sure to set the scope to **chat**, and **note the token string as well as the userId string**. In this quickstart we will create a thread with an initial participant and then add a second participant to the thread.

## Setting up

### Create a new android application

1. Open Android Studio and select `Create a new project`. 
2. On the next window, select `Empty Activity` as the project template.
3. When choosing options enter `ChatQuickstart` as the project name.
4. Click next and choose the directory where you want the project to be created.

### Install the libraries

We'll use Gradle to install the necessary Communication Services dependencies. From the command line navigate inside the root directory of the `ChatQuickstart` project. Open the app's build.gradle file and add the following dependencies to the `ChatQuickstart` target:

```
implementation 'com.azure.android:azure-communication-common:1.0.0-beta.5'
implementation 'com.azure.android:azure-communication-chat:1.0.0-beta.5'
```

Click 'sync now' in Android Studio.

#### (Alternative) To install libraries through Maven
To import the library into your project using the [Maven](https://maven.apache.org/) build system, add it to the `dependencies` section of your app's `pom.xml` file, specifying its artifact ID and the version you wish to use:

```xml
<dependency>
  <groupId>com.azure.android</groupId>
  <artifactId>azure-communication-chat</artifactId>
  <version>1.0.0-beta.5</version>
</dependency>
```


### Setup the placeholders

Open and edit the file `MainActivity.java`. In this Quickstart, we'll add our code to `MainActivity`, and view the output in the console. This quickstart does not address building a UI. At the top of file, import the `Communication common` and `Communication chat` libraries:

```
import com.azure.android.communication.chat.*;
import com.azure.android.communication.common.*;
```

Copy the following code into the file `MainActivity`:

```
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
        } catch (Exception e){
            System.out.println("Quickstart failed: " + e.getMessage());
        }
    }
```

In following steps, we'll replace the placeholders with sample code using the Azure Communication Services Chat library.


### Create a chat client

Replace the comment `<CREATE A CHAT CLIENT>` with the following code (put the import statements at top of the file):

```java
import com.azure.android.communication.chat.ChatClient;
import com.azure.android.core.http.HttpHeader;

final String endpoint = "https://<resource>.communication.azure.com";
final String userAccessToken = "<user_access_token>";

ChatAsyncClient client = new ChatAsyncClient.Builder()
        .endpoint(endpoint)
        .credentialInterceptor(chain -> chain.proceed(chain.request()
            .newBuilder()
            .header(HttpHeader.AUTHORIZATION, userAccessToken)
            .build()))
        .build();
```

1. Use the `AzureCommunicationChatServiceAsyncClient.Builder` to configure and create an instance of `AzureCommunicationChatClient`.
2. Replace `<resource>` with your Communication Services resource.
3. Replace `<user_access_token>` with a valid Communication Services access token.

## Object model
The following classes and interfaces handle some of the major features of the Azure Communication Services Chat client library for JavaScript.

| Name                                   | Description                                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ChatClient | This class is needed for the Chat functionality. You instantiate it with your subscription information, and use it to create, get and delete threads. |
| ChatThreadClient | This class is needed for the Chat Thread functionality. You obtain an instance via the ChatClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts, subscribe chat events. |

## Start a chat thread

We'll use our `ChatClient` to create a new thread with an initial user.

Replace the comment `<CREATE A CHAT THREAD>` with the following code:

```java
//  The list of ChatParticipant to be added to the thread.
List<ChatParticipant> participants = new ArrayList<>();
// The communication user ID you created before, required.
String id = "<user_id>";
// The display name for the thread participant.
String displayName = "initial participant";
participants.add(new ChatParticipant()
    .setId(new CommunicationUserIdentifier(id))
    .setDisplayName(displayName));

// The topic for the thread.
final String topic = "General";
        // The model to pass to the create method.
        CreateChatThreadRequest thread = new CreateChatThreadRequest()
        .setTopic(topic)
        .setParticipants(participants);

// optional, set a repeat request ID
final String repeatabilityRequestID = "123";

        client.createChatThread(thread, repeatabilityRequestID, new Callback<CreateChatThreadResult>() {
public void onSuccess(CreateChatThreadResult result, okhttp3.Response response) {
        ChatThread chatThread = result.getChatThread();
        String threadId = chatThread.getId();
        // take further action
        }

public void onFailure(Throwable throwable, okhttp3.Response response) {
        // Handle error.
        }
        });
```

Replace `<user_id>` with a valid Communication Services user ID. We'll use the `threadId` from the response returned to the completion handler in later steps.

## Get a chat thread client

Now that we've created a Chat thread we'll obtain a `ChatThreadClient` to perform operations within the thread. Replace the comment `<CREATE A CHAT THREAD CLIENT>` with the following code:

```
ChatThreadAsyncClient threadClient =
        new ChatThreadAsyncClient.Builder()
                .endpoint(endpoint)
                .build();
```

Replace `<endpoint>` with your Communication Services endpoint.

## Send a message to a chat thread

Replace the comment `<SEND A MESSAGE>` with the following code:

```java
// The chat message content, required.
final String content = "Test message 1";
// The display name of the sender, if null (i.e. not specified), an empty name will be set.
final String senderDisplayName = "An important person";
        SendChatMessageRequest message = new SendChatMessageRequest()
        .setType(ChatMessageType.TEXT)
        .setContent(content)
        .setSenderDisplayName(senderDisplayName);

// The unique ID of the thread.
String threadId = "<thread_id>";
threadClient.sendChatMessage(threadId, message, new Callback<String>() {
        @Override
        public void onSuccess(String messageId, okhttp3.Response response) {
                // A string is the response returned from sending a message, it is an id,
                // which is the unique ID of the message.
                final String chatMessageId = messageId;
                // Take further action.
        }

        @Override
        public void onFailure(Throwable throwable, okhttp3.Response response) {
                // Handle error.
        }
});
```

Replace `<thread_id>` with the thread ID that sending message to.

## Add a user as a participant to the chat thread

Replace the comment `<ADD A USER>` with the following code:

```java
//  The list of ChatParticipant to be added to the thread.
participants = new ArrayList<>();
// The CommunicationUser.identifier you created before, required.
id = "<user_id>";
// The display name for the thread participant.
displayName = "a new participant";
participants.add(new ChatParticipant().setId(new CommunicationUserIdentifier(id)).setDisplayName(displayName));
// The model to pass to the add method.
AddChatParticipantsRequest addParticipantsRequest = new AddChatParticipantsRequest()
.setParticipants(participants);

// The unique ID of the thread.
threadId = "<thread_id>";
threadClient.addChatParticipants(threadId, addParticipantsRequest, new Callback<AddChatParticipantsResult>() {
        @Override
        public void onSuccess(AddChatParticipantsResult result, okhttp3.Response response) {
                // Take further action.
                }
        
        @Override
        public void onFailure(Throwable throwable, okhttp3.Response response) {
                // Handle error.
                }
        });
```

1. Replace `<user_id>` with the Communication Services user ID of the user to be added. 
2. Replace `<thread_id>` with the thread ID that user is adding to.

## List users in a thread

Replace the `<LIST USERS>` comment with the following code:

```java
// The unique ID of the thread.
threadId = "<thread_id>";

// The maximum number of participants to be returned per page, optional.
final int maxPageSize = 10;

// Skips participants up to a specified position in response.
final int skip = 0;

threadClient.listChatParticipantsPages(threadId,
    maxPageSize,
    skip,
    new Callback<AsyncPagedDataCollection<ChatParticipant, Page<ChatParticipant>>>() {
        @Override
        public void onSuccess(AsyncPagedDataCollection<ChatParticipant, Page<ChatParticipant>> pageCollection,
            okhttp3.Response response) {
            // pageCollection enables enumerating list of chat participants.
            pageCollection.getFirstPage(new Callback<Page<ChatParticipant>>() {
            @Override
            public void onSuccess(Page<ChatParticipant> firstPage, okhttp3.Response response) {
                    for (ChatParticipant participant : firstPage.getItems()) {
                    // Take further action.
                    }
                pageCollection.getPage(firstPage.getNextPageId(), new Callback<Page<ChatParticipant>>() {
                    @Override
                    public void onSuccess(Page<ChatParticipant> result, Response response) {
                            pageCollection.getPage(result.getPreviousPageId(), new Callback<Page<ChatParticipant>>() {
                        @Override
                        public void onSuccess(Page<ChatParticipant> result, Response response) {
                                // Take further action.
                        }
    
                        @Override
                        public void onFailure(Throwable throwable, Response response) {
                                // Take further action.
                        }
                        });
                    }
    
                    @Override
                    public void onFailure(Throwable throwable, Response response) {
                            // Take further action.
                            }
                });
            }

            @Override
            public void onFailure(Throwable throwable, okhttp3.Response response) {
                    // Handle error.
            }
            });
        }

        @Override
        public void onFailure(Throwable throwable, okhttp3.Response response) {
                // Handle error.
        }
});
```

Replace `<thread_id>` with the thread ID you're listing users for.

## Remove user from a chat thread

Replace the `<REMOVE A USER>` comment with the following code:

```java
// The unique ID of the thread.
threadId = "<thread_id>";
// The unique ID of the participant.
final String participantId = "<participant_id>";
threadClient.removeChatParticipant(threadId, participantId, new Callback<Void>() {
    @Override
    public void onSuccess(Void result, okhttp3.Response response) {
            // Take further action.
    }
    
    @Override
    public void onFailure(Throwable throwable, okhttp3.Response response) {
        // Handle error.
    }
});
```

1. Replace `<thread_id>` with the thread ID that removing user from.
1. Replace `<participant_id>` with the Communication Services user ID of the participant being removed.

## Run the code

In Android Studio hit the Run button to build and run the project. In the console you can view the output from the code and the logger output from the ChatClient.
