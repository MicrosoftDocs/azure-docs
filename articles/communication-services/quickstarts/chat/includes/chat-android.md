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
- Install [Android Studio](https://developer.android.com/studio), we will be using Android Studio to create an Android application for the quickstart to install dependencies.
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../create-communication-resource.md). You'll need to **record your resource endpoint and connection string** for this quickstart.
- Create **two** Communication Services Users and issue them a [User Access Token](../../identity/access-tokens.md). Be sure to set the scope to **chat**, and **note the token string and the user_id string**. In this quickstart, we will create a thread with an initial participant and then add a second participant to the thread. You can also use the Azure CLI and run the command below with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope chat --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../identity/access-tokens.md?pivots=platform-azcli).

## Setting up

### Create a new android application

1. Open Android Studio and select `Create a new project`. 
2. On the next window, select `Empty Activity` as the project template.
3. When choosing options, enter `ChatQuickstart` as the project name.
4. Click next and choose the directory where you want the project to be created.

### Install the libraries

We'll use Gradle to install the necessary Communication Services dependencies. From the command line, navigate inside the root directory of the `ChatQuickstart` project. Open the app's build.gradle file and add the following dependencies to the `ChatQuickstart` target:

```groovy
implementation 'com.azure.android:azure-communication-common:' + $azureCommunicationCommonVersion
implementation 'com.azure.android:azure-communication-chat:' + $azureCommunicationChatVersion
implementation 'org.slf4j:slf4j-log4j12:1.7.29'
```

Please refer to https://search.maven.org/artifact/com.azure.android/azure-communication-common and https://search.maven.org/artifact/com.azure.android/azure-communication-chat for the latest version numbers.

#### Exclude meta files in packaging options in root build.gradle
```groovy
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
  <version><!-- Please refer to https://search.maven.org/artifact/com.azure.android/azure-communication-chat for the latest version --></version>
</dependency>
```

### Set up Azure Function
Please check out [Azure Function integration](../../../tutorials/integrate-azure-function.md) for details. We highly recommend integrating with Azure Function to avoid hard-coding application parameters.

### Set up application constants:
Create a class `ApplicationConstants` which stores all application constants:
```java
public class ApplicationConstants {
    public static final String SDK_VERSION = "<your_version>";
    public final static String SDK_NAME = "azure-communication-com.azure.android.communication.chat";
    public final static String APPLICATION_ID = "Chat_Test_App";
    public final static String TAG = "[Chat Test App]";
    public static CommunicationTokenCredential COMMUNICATION_TOKEN_CREDENTIAL;
}
```

### Set up the placeholders

Open and edit the file `MainActivity.java`. In this quick-start, we'll add our code to `MainActivity`, and view the output in the console. This quick-start does not address building a UI. At the top of the file, import the `Azure Communication Common`, `Azure 
 Communication Chat`, and other system libraries:

```
import com.azure.android.communication.chat.*;
import com.azure.android.communication.chat.models.*;
import com.azure.android.communication.common.*;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.jakewharton.threetenabp.AndroidThreeTen;

import java.util.ArrayList;
import java.util.List;
```

Copy the following code into class `MainActivity` in file `MainActivity.java`:

```java
    private ChatAsyncClient chatAsyncClient;

    private void log(String msg) {
        Log.i(TAG, msg);
        Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
    }
    
   @Override
    protected void onStart() {
        super.onStart();
        try {
            AndroidThreeTen.init(this);

            // Initialize application parameters if one of the conditions in '### Initialize Application Parameters' are met.

            // <CREATE A CHAT CLIENT>

            // <CREATE A CHAT THREAD>

            // <CREATE A CHAT THREAD CLIENT>

            // <SEND A MESSAGE>
            
            // <RECEIVE CHAT MESSAGES>

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

### Initialize Application Parameters
> [!NOTE]
> Initializing `ApplicationConstants` needs to be added to `MainActivity.java` if EITHER of the following conditions is met: 1. The push notification feature is NOT enabled. 2. The version for the Azure Communication Chat library for Android is < '2.0.0'. Otherwise, please refer to step 11 in [Android push notifications](../../../tutorials/chat-android-push-notification.md). Please refer to the sample APP of the SDK version that you are consuming for reference.

`ACS_ENDPOINT`, `FIRST_USER_ID` and `FIRST_USER_ACCESS_TOKEN` are returned from calling Azure Function. Please check out [Azure Function integration](../../../tutorials/integrate-azure-function.md) for details. We use the response from calling Azure Function to initialize the list of parameters:
* `ACS_ENDPOINT`: the endpoint of your Communication Services resource.
* `FIRST_USER_ID` and `SECOND_USER_ID`: valid Communication Services user IDs generated by your Communication Services resource.
* `FIRST_USER_ACCESS_TOKEN`: the communication Services access token for `<FIRST_USER_ID>`.

Code block for initialing application parameters by calling Azure Function: 
```java
try {
        UserTokenClient userTokenClient = new UserTokenClient(AZURE_FUNCTION_URL);
        //First user context
        userTokenClient.getNewUserContext();
        ACS_ENDPOINT = userTokenClient.getACSEndpoint();
        FIRST_USER_ID = userTokenClient.getUserId();
        FIRST_USER_ACCESS_TOKEN = userTokenClient.getUserToken();
        COMMUNICATION_TOKEN_CREDENTIAL = new CommunicationTokenCredential(FIRST_USER_ACCESS_TOKEN);
        //Second user context
        userTokenClient.getNewUserContext();
        SECOND_USER_ID = userTokenClient.getUserId();
    } catch (Throwable throwable) {
        //Your handling code
        logger.logThrowableAsError(throwable);
    }
```

### Create a chat client

Replace the comment `<CREATE A CHAT CLIENT>` with the following code (put the import statements at top of the file):

```java
import com.azure.android.core.http.policy.UserAgentPolicy;

chatAsyncClient = new ChatClientBuilder()
    .endpoint(endpoint)
    .credential(new CommunicationTokenCredential(firstUserAccessToken))
    .addPolicy(new UserAgentPolicy(APPLICATION_ID, SDK_NAME, sdkVersion))
    .buildAsyncClient();

```

## Object model
The following classes and interfaces handle some of the major features of the Azure Communication Services Chat SDK for JavaScript.

| Name                                   | Description                                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ChatClient/ChatAsyncClient | This class is needed for the Chat functionality. You instantiate it with your subscription information, and use it to create, get, delete threads, and subscribe to chat events. |
| ChatThreadClient/ChatThreadAsyncClient | This class is needed for the Chat Thread functionality. You obtain an instance via the ChatClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts. |

## Start a chat thread

We'll use our `ChatAsyncClient` to create a new thread with an initial user.

Replace the comment `<CREATE A CHAT THREAD>` with the following code:

```java
// A list of ChatParticipant to start the thread with.
List<ChatParticipant> participants = new ArrayList<>();
// The display name for the thread participant.
String displayName = "initial participant";
participants.add(new ChatParticipant()
    .setCommunicationIdentifier(new CommunicationUserIdentifier(firstUserId))
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

## Get a chat thread client

Now that we've created a Chat thread we'll obtain a `ChatThreadAsyncClient` to perform operations within the thread. Replace the comment `<CREATE A CHAT THREAD CLIENT>` with the following code:

```
ChatThreadAsyncClient chatThreadAsyncClient = new ChatThreadClientBuilder()
    .endpoint(endpoint)
    .credential(new CommunicationTokenCredential(firstUserAccessToken))
    .addPolicy(new UserAgentPolicy(APPLICATION_ID, SDK_NAME, sdkVersion))
    .chatThreadId(threadId)
    .buildAsyncClient();

```

## Send a message to a chat thread

We will send message to that thread now.

Replace the comment `<SEND A MESSAGE>` with the following code:

```java
// The chat message content, required.
final String content = "Please take a look at the attachment";

// The display name of the sender, if null (i.e. not specified), an empty name will be set.
final String senderDisplayName = "An important person";

// Use metadata optionally to include any additional data you want to send along with the message.
// This field provides a mechanism for developers to extend chat message functionality and add
// custom information for your use case. For example, when sharing a file link in the message, you
// might want to add 'hasAttachment:true' in metadata so that recipient's application can parse
// that and display accordingly.
final Map<String, String> metadata = new HashMap<String, String>();
metadata.put("hasAttachment", "true");
metadata.put("attachmentUrl", "https://contoso.com/files/attachment.docx");

SendChatMessageOptions chatMessageOptions = new SendChatMessageOptions()
    .setType(ChatMessageType.TEXT)
    .setContent(content)
    .setSenderDisplayName(senderDisplayName)
    .setMetadata(metadata);

// A string is the response returned from sending a message, it is an id, which is the unique ID
// of the message.
chatMessageId = chatThreadAsyncClient.sendMessage(chatMessageOptions).get().getId();

```

## Receive chat messages from a chat thread

### Real-time notifications
With real-time signaling, you can subscribe to new incoming messages and update the current messages in memory accordingly. Azure Communication Services supports a [list of events that you can subscribe to](../../../concepts/chat/concepts.md#real-time-notifications).

Replace the comment `<RECEIVE CHAT MESSAGES>` with the following code (put the import statements at top of the file):

```java

// Start real time notification
chatAsyncClient.startRealtimeNotifications(firstUserAccessToken, getApplicationContext());

// Register a listener for chatMessageReceived event
chatAsyncClient.addEventHandler(ChatEventType.CHAT_MESSAGE_RECEIVED, (ChatEvent payload) -> {
    ChatMessageReceivedEvent chatMessageReceivedEvent = (ChatMessageReceivedEvent) payload;
    // You code to handle chatMessageReceived event
    
});

```

> [!IMPORTANT]
> Known issue: When using Android Chat and Calling SDK together in the same application, Chat SDK's real-time notifications feature does not work. You might get a dependency resolving issue.
> While we are working on a solution, you can turn off real-time notifications feature by adding the following dependency information in app's build.gradle file and instead poll the GetMessages API to display incoming messages to users. 
> 
> ```
> implementation ("com.azure.android:azure-communication-chat:1.0.0") {
>     exclude group: 'com.microsoft', module: 'trouter-client-android'
> }
> implementation 'com.azure.android:azure-communication-calling:1.0.0'
> ```
> 
> Note with above update, if the application tries to touch any of the notification API like `chatAsyncClient.startRealtimeNotifications()` or `chatAsyncClient.addEventHandler()`, there will be a runtime error.

### Push notifications
Please check out [Android push notifications](../../../tutorials/chat-android-push-notification.md) for details.

## Add a user as a participant to the chat thread

Replace the comment `<ADD A USER>` with the following code:

```java
// The display name for the thread participant.
String secondUserDisplayName = "a new participant";
ChatParticipant participant = new ChatParticipant()
    .setCommunicationIdentifier(new CommunicationUserIdentifier(secondUserId))
    .setDisplayName(secondUserDisplayName);
        
chatThreadAsyncClient.addParticipant(participant);

```


## List users in a thread

Replace the `<LIST USERS>` comment with the following code (put the import statements at top of the file):

```java
import com.azure.android.core.rest.util.paging.PagedAsyncStream;
import com.azure.android.core.util.RequestContext;

// The maximum number of participants to be returned per page, optional.
int maxPageSize = 10;

// Skips participants up to a specified position in response.
int skip = 0;

// Options to pass to the list method.
ListParticipantsOptions listParticipantsOptions = new ListParticipantsOptions()
    .setMaxPageSize(maxPageSize)
    .setSkip(skip);

PagedAsyncStream<ChatParticipant> participantsPagedAsyncStream =
      chatThreadAsyncClient.listParticipants(listParticipantsOptions, RequestContext.NONE);

participantsPagedAsyncStream.forEach(chatParticipant -> {
    // You code to handle participant
});

```


## Remove user from a chat thread

We will remove second user from the thread now.

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

We will send read receipt for the message sent above.

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

PagedAsyncStream<ChatMessageReadReceipt> readReceiptsPagedAsyncStream =
      chatThreadAsyncClient.listReadReceipts(listReadReceiptOptions, RequestContext.NONE);

readReceiptsPagedAsyncStream.forEach(readReceipt -> {
    // You code to handle readReceipt
});

```

## Run the code

In Android Studio, hit the Run button to build and run the project. In the console, you can view the output from the code and the logger output from the ChatClient.

## Sample Code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/Add-chat).
