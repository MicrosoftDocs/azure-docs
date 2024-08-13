---
title: Migrating from Twilio Conversations Chat to ACS Chat Android
description: Guide describes how to migrate Android apps from Twilio Conversations Chat to Azure Communication Services Chat SDK. 
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

1. **Azure Account:** Make sure that your Azure account is active. New users can create a free account at [Microsoft Azure](https://azure.microsoft.com/free/).
2. **Communication Services Resource:** Set up a [Communication Services Resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp) via your Azure portal and note your connection string.
3. **Azure CLI:** Follow the instructions to [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows?tabs=azure-cli).
4. **User Access Token:** Generate a user access token to instantiate the call client. You can create one using the Azure CLI as follows:

```console
az communication identity token issue --scope voip --connection-string "yourConnectionString"
```

For more information, see [Use Azure CLI to Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md?pivots=platform-azcli).

## Setting up


### Install the libraries

To start the migration from Twilio Conversations chat, the first step is to install the Azure Communication Services Chat SDK for Android to your project. The Azure Communication Services Chat SDK can be integrated as a `gradle` dependency.
1. Add the Chat SDK
```groovy
implementation 'com.azure.android:azure-communication-common:' + $azureCommunicationCommonVersion
implementation 'com.azure.android:azure-communication-chat:' + $azureCommunicationChatVersion
implementation 'org.slf4j:slf4j-log4j12:1.7.29'
```

Please refer to https://search.maven.org/artifact/com.azure.android/azure-communication-common and https://search.maven.org/artifact/com.azure.android/azure-communication-chat for the latest version numbers.

2. Exclude meta files in packaging options in root build.gradle
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
3. Set up Azure Function
Please check out [Azure Function integration](../../../tutorials/integrate-azure-function.md) for details. We highly recommend integrating with Azure Function to avoid hard-coding application parameters.


### Authenticating to the SDK

To use the Azure Communication Services Chat SDK, you need to authenticate using an access token.

#### Twilio

The following code snippets assume the availability of a valid access token for Twilio services.

```java
void retrieveAccessTokenFromServer(final Context context, String identity,
                                       final TokenResponseListener listener) {

        // Set the chat token URL in your strings.xml file
        String chatTokenURL = context.getString(R.string.chat_token_url);

        if ("https://YOUR_DOMAIN_HERE.twil.io/chat-token".equals(chatTokenURL)) {
            listener.receivedTokenResponse(false, new Exception("You need to replace the chat token URL in strings.xml"));
            return;
        }

        tokenURL = chatTokenURL + "?identity=" + identity;

        new Thread(new Runnable() {
            @Override
            public void run() {
                retrieveToken(new AccessTokenListener() {
                    @Override
                    public void receivedAccessToken(@Nullable String token,
                                                    @Nullable Exception exception) {
                        if (token != null) {
                            ConversationsClient.Properties props = ConversationsClient.Properties.newBuilder().createProperties();
                            ConversationsClient.create(context, token, props, mConversationsClientCallback);
                            listener.receivedTokenResponse(true,null);
                        } else {
                            listener.receivedTokenResponse(false, exception);
                        }
                    }
                });
            }
        }).start();
    }
```


#### Azure Communication Services

The following code snippets require a valid access token to initiate a `CallClient`.

You need a valid token. For more information, see [Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md).

> [!NOTE]
> Initializing `ApplicationConstants` needs to be added to `MainActivity.java` if EITHER of the following conditions is met: 1. The push notification feature is NOT enabled. 2. The version for the Azure Communication Chat library for Android is < '2.0.0'. Otherwise, please refer to step 11 in [Android push notifications](../../../tutorials/chat-android-push-notification.md). Please refer to the sample APP of the SDK version that you are consuming for reference.

`ACS_ENDPOINT`, `FIRST_USER_ID` and `FIRST_USER_ACCESS_TOKEN` are returned from calling Azure Function. Please check out [Azure Function integration](../../../tutorials/integrate-azure-function.md) for details. We use the response from calling Azure Function to initialize the list of parameters:
* `ACS_ENDPOINT`: the endpoint of your Communication Services resource.
* `FIRST_USER_ID` and `SECOND_USER_ID`: valid Communication Services user IDs generated by your Communication Services resource.
* `FIRST_USER_ACCESS_TOKEN`: the communication Services access token for `<FIRST_USER_ID>`.

Code block for initializing application parameters by calling Azure Function: 
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

#### Twilio
This is how you can create a chat client in Twilio.
```java
 void initializeWithAccessToken(final Context context, final String token) {

        ConversationsClient.Properties props = ConversationsClient.Properties.newBuilder().createProperties();
        ConversationsClient.create(context, token, props, mConversationsClientCallback);
    }
```

#### Azure Communication Services
Replace the comment `<CREATE A CHAT CLIENT>` with the following code (put the import statements at top of the file):

```java
import com.azure.android.core.http.policy.UserAgentPolicy;

chatAsyncClient = new ChatClientBuilder()
    .endpoint(endpoint)
    .credential(new CommunicationTokenCredential(firstUserAccessToken))
    .addPolicy(new UserAgentPolicy(APPLICATION_ID, SDK_NAME, sdkVersion))
    .buildAsyncClient();

```

### Object model
The following classes and interfaces handle some of the major features of the Azure Communication Services Chat SDK for Java.

| Name                                   | Description                                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ChatClient/ChatAsyncClient | This class is needed for the Chat functionality. You instantiate it with your subscription information, and use it to create, get, delete threads, and subscribe to chat events. |
| ChatThreadClient/ChatThreadAsyncClient | This class is needed for the Chat Thread functionality. You obtain an instance via the ChatClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts. |

### Start a chat thread

#### Twilio
The following code snippet helps to start a chat thread in Twilio.
```java
conversationsClient.createConversation(DEFAULT_CONVERSATION_NAME,
                new CallbackListener<Conversation>() {
                    @Override
                    public void onSuccess(Conversation conversation) {
                        if (conversation != null) {
                            Log.d(MainActivity.TAG, "Joining Conversation: " + DEFAULT_CONVERSATION_NAME);
                            joinConversation(conversation);
                        }
                    }

                    @Override
                    public void onError(ErrorInfo errorInfo) {
                        Log.e(MainActivity.TAG, "Error creating conversation: " + errorInfo.getMessage());
                    }
                });
```

#### Azure Communication Services
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

### Get a chat thread client

#### Twilio
The following code snippet helps to get a chat thread client in Twilio.
```java
conversationsClient.getConversation(DEFAULT_CONVERSATION_NAME, new CallbackListener<Conversation>() {
            @Override
            public void onSuccess(Conversation conversation) {
                if (conversation != null) {
                    if (conversation.getStatus() == Conversation.ConversationStatus.JOINED
                            || conversation.getStatus() == Conversation.ConversationStatus.NOT_PARTICIPATING) {
                        Log.d(MainActivity.TAG, "Already Exists in Conversation: " + DEFAULT_CONVERSATION_NAME);
                        QuickstartConversationsManager.this.conversation = conversation;
                        QuickstartConversationsManager.this.conversation.addListener(mDefaultConversationListener);
                        QuickstartConversationsManager.this.loadPreviousMessages(conversation);
                    } else {
                        Log.d(MainActivity.TAG, "Joining Conversation: " + DEFAULT_CONVERSATION_NAME);
                        joinConversation(conversation);
                    }
                }
            }
```

#### Azure Communication Services
Now that we've created a chat thread, we'll obtain a `ChatThreadAsyncClient` to perform operations within the thread. Replace the comment `<CREATE A CHAT THREAD CLIENT>` with the following code:

```java
ChatThreadAsyncClient chatThreadAsyncClient = new ChatThreadClientBuilder()
    .endpoint(endpoint)
    .credential(new CommunicationTokenCredential(firstUserAccessToken))
    .addPolicy(new UserAgentPolicy(APPLICATION_ID, SDK_NAME, sdkVersion))
    .chatThreadId(threadId)
    .buildAsyncClient();

```

### Send a message to a chat thread
Unlike Twilio, ACS does not have separate functions for sending text messages or media.

#### Twilio
This is how you send a text message in Twilio.
```java
void sendMessage(String messageBody) {
        if (conversation != null) {
            Message.Options options = Message.options().withBody(messageBody);
            Log.d(MainActivity.TAG,"Message created");
            conversation.sendMessage(options, new CallbackListener<Message>() {
                @Override
                public void onSuccess(Message message) {
                    if (conversationsManagerListener != null) {
                        conversationsManagerListener.messageSentCallback();
                    }
                }
            });
        }
    }
```

This is how you send media in Twilio.
```java
// Messages messagesObject;
messagesObject.sendMessage(
    Message.options()
        .withMedia(new FileInputStream("/path/to/Somefile.txt"), "text/plain")
        .withMediaFileName("file.txt")
        .withMediaProgressListener(new ProgressListener() {
            @Override
            public void onStarted() {
                Timber.d("Upload started");
            }

            @Override
            public void onProgress(long bytes) {
                Timber.d("Uploaded " + bytes + " bytes");
            }

            @Override
            public void onCompleted(String mediaSid) {
                Timber.d("Upload completed");
            }
        }),
    new CallbackListener<Message>() {
        @Override
        public void onSuccess(Message msg) {
            Timber.d("Successfully sent MEDIA message");
        }

        @Override
        public void onError(ErrorInfo error) {
            Timber.e("Error sending MEDIA message");
        }
    });
```

#### Azure Communication Services

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

### Receive chat messages from a chat thread
Unlike Twilio, ACS does not have separate functions for receiving text messages or media.

#### Twilio
This is how you receive a text message in Twilio.
```java
public void onMessageAdded(final Message message) {
            Log.d(MainActivity.TAG, "Message added");
            messages.add(message);
            if (conversationsManagerListener != null) {
                conversationsManagerListener.receivedNewMessage();
            }
        }
```
This is how you receive media in Twilio.
```java
if (message.hasMedia()) {
    message.getMediaContentTemporaryUrl(new CallbackListener<String>() {
        @Override
        public void onSuccess(String mediaContentUrl) {
            Log.d("TAG", mediaContentUrl);
        }
    });
}
```

#### Azure Communication Services

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
Similar to Twilio, Azure Communication Services allows to configure push notifications. Please check out [Android push notifications](../../../tutorials/chat-android-push-notification.md) for details.

