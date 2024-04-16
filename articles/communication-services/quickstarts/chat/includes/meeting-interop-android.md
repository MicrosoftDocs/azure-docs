---
title: Quickstart - Join a Teams meeting
author: agiurg
ms.author: agiurg
ms.date: 07/20/2021
ms.topic: include
ms.service: azure-communication-services
---

In this quickstart, you'll learn how to chat in a Teams meeting using the Azure Communication Services Chat SDK for Android.

## Prerequisites 

- A [Teams deployment](/deployoffice/teams-install). 
- A working [calling app](../../voice-video-calling/get-started-teams-interop.md). 

## Enable Teams interoperability 

A Communication Services user that joins a Teams meeting as a guest user can access the meeting's chat only when they've joined the Teams meeting call. See the [Teams interop](../../voice-video-calling/get-started-teams-interop.md) documentation to learn how to add a Communication Services user to a Teams meeting call.

You must be a member of the owning organization of both entities to use this feature.

## Joining the meeting chat 

Once Teams interoperability is enabled, a Communication Services user can join the Teams call as an external user using the Calling SDK. Joining the call adds them as a participant to the meeting chat as well, where they can send and receive messages with other users on the call. The user will not have access to chat messages that were sent before they joined the call. To join the meeting and start chatting, you can follow the next steps.

## Add Chat to the Teams calling app

In your module level `build.gradle`, add the dependency on the chat sdk.

> [!IMPORTANT]
> Known issue: When using Android Chat and Calling SDK together in the same application, the Chat SDK's real-time notifications feature won't work. You'll get a dependency resolution issue. While we're working on a solution, you can turn off the real-time notifications feature by adding the following exclusions to the Chat SDK dependency in the app's `build.gradle` file:
> 
> ```groovy
> implementation ("com.azure.android:azure-communication-chat:1.0.0") {
>     exclude group: 'com.microsoft', module: 'trouter-client-android'
> }
> ```


## Add the Teams UI layout

Replace the code in activity_main.xml with the following snippet. It adds inputs for the thread ID and for sending messages, a button for sending the typed message and a basic chat layout.

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <EditText
        android:id="@+id/teams_meeting_thread_id"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginHorizontal="20dp"
        android:layout_marginTop="128dp"
        android:ems="10"
        android:hint="Meeting Thread Id"
        android:inputType="textUri"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <EditText
        android:id="@+id/teams_meeting_link"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginHorizontal="20dp"
        android:layout_marginTop="64dp"
        android:ems="10"
        android:hint="Teams meeting link"
        android:inputType="textUri"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <LinearLayout
        android:id="@+id/button_layout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="30dp"
        android:gravity="center"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.0"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/teams_meeting_thread_id">

        <Button
            android:id="@+id/join_meeting_button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Join Meeting" />

        <Button
            android:id="@+id/hangup_button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Hangup" />

    </LinearLayout>

    <TextView
        android:id="@+id/call_status_bar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="40dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent" />

    <TextView
        android:id="@+id/recording_status_bar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="20dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent" />

    <ScrollView
        android:id="@+id/chat_box"
        android:layout_width="374dp"
        android:layout_height="294dp"
        android:layout_marginTop="40dp"
        android:layout_marginBottom="20dp"
        app:layout_constraintBottom_toTopOf="@+id/send_message_button"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/button_layout"
        android:orientation="vertical"
        android:gravity="bottom"
        android:layout_gravity="bottom"
        android:fillViewport="true">

        <LinearLayout
            android:id="@+id/chat_box_layout"
            android:orientation="vertical"
            android:layout_width="fill_parent"
            android:layout_height="fill_parent"
            android:gravity="bottom"
            android:layout_gravity="top"
            android:layout_alignParentBottom="true"/>
    </ScrollView>

    <EditText
        android:id="@+id/message_body"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginHorizontal="20dp"
        android:layout_marginTop="588dp"
        android:ems="10"
        android:inputType="textUri"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        tools:text="Type your message here..."
        tools:visibility="invisible" />

    <Button
        android:id="@+id/send_message_button"
        android:layout_width="138dp"
        android:layout_height="45dp"
        android:layout_marginStart="133dp"
        android:layout_marginTop="48dp"
        android:layout_marginEnd="133dp"
        android:text="Send Message"
        android:visibility="invisible"
        app:layout_constraintBottom_toTopOf="@+id/recording_status_bar"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.428"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/chat_box" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

## Enable the Teams UI controls

### Import packages and define state variables

To the content of `MainActivity.java`, add the following imports:

```
import android.graphics.Typeface;
import android.graphics.Color;
import android.text.Html;
import android.os.Handler;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import java.util.Collections;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import com.azure.android.communication.chat.ChatThreadAsyncClient;
import com.azure.android.communication.chat.ChatThreadClientBuilder;
import com.azure.android.communication.chat.models.ChatMessage;
import com.azure.android.communication.chat.models.ChatMessageType;
import com.azure.android.communication.chat.models.ChatParticipant;
import com.azure.android.communication.chat.models.ListChatMessagesOptions;
import com.azure.android.communication.chat.models.SendChatMessageOptions;
import com.azure.android.communication.common.CommunicationIdentifier;
import com.azure.android.communication.common.CommunicationUserIdentifier;
import com.azure.android.core.rest.util.paging.PagedAsyncStream;
import com.azure.android.core.util.AsyncStreamHandler;
```

To the `MainActivity` class, add the following variables:

```
    // InitiatorId is used to differentiate incoming messages from outgoing messages
    private static final String InitiatorId = "<USER_ID>";
    private static final String ResourceUrl = "<COMMUNICATION_SERVICES_RESOURCE_ENDPOINT>";
    private String threadId;
    private ChatThreadAsyncClient chatThreadAsyncClient;
    
    // The list of ids corresponsding to messages which have already been processed
    ArrayList<String> chatMessages = new ArrayList<>();
```

Replace `<USER_ID>` with the ID of the user initiating the chat.
Replace `<COMMUNICATION_SERVICES_RESOURCE_ENDPOINT>` with the endpoint for your Communication Services resource. 

### Initialize the ChatThreadClient

After joining the meeting, instantiate the `ChatThreadClient` and make the chat components visible.

Update the end of the `MainActivity.joinTeamsMeeting()` method with the code below:

```
    private void joinTeamsMeeting() {
        ...
        EditText threadIdView = findViewById(R.id.teams_meeting_thread_id);
        threadId = threadIdView.getText().toString();
        // Initialize Chat Thread Client
        chatThreadAsyncClient = new ChatThreadClientBuilder()
                .endpoint(ResourceUrl)
                .credential(new CommunicationTokenCredential(UserToken))
                .chatThreadId(threadId)
                .buildAsyncClient();
        Button sendMessageButton = findViewById(R.id.send_message_button);
        EditText messageBody = findViewById(R.id.message_body);
        // Register the method for sending messages and toggle the visibility of chat components
        sendMessageButton.setOnClickListener(l -> sendMessage());
        sendMessageButton.setVisibility(View.VISIBLE);
        messageBody.setVisibility(View.VISIBLE);
        
        // Start the polling for chat messages immediately
        handler.post(runnable);
    }
```

### Enable sending messages

Add the `sendMessage()` method to `MainActivity`. It uses the `ChatThreadClient` to send messages on behalf of the user.

```
    private void sendMessage() {
        // Retrieve the typed message content
        EditText messageBody = findViewById(R.id.message_body);
        // Set request options and send message
        SendChatMessageOptions options = new SendChatMessageOptions();
        options.setContent(messageBody.getText().toString());
        options.setSenderDisplayName("Test User");
        chatThreadAsyncClient.sendMessage(options);
        // Clear the text box
        messageBody.setText("");
    }
```

### Enable polling for messages and rendering them in the application

> [!IMPORTANT]
> Known issue: Since the Chat SDK's real-time notifications feature does not work together with the Calling SDK's, we will have to poll the `GetMessages` API at predefined intervals. In our sample we will use 3-second intervals.

We can obtain the following data from the message list returned by the `GetMessages` API: 
 - The `text` and `html` messages on the thread since joining
 - Changes to the thread roster
 - Updates to the thread topic


To the `MainActivity` class, add a handler and a runnable task that will be run at 3-second intervals:

```
    private Handler handler = new Handler();
    private Runnable runnable = new Runnable() {
        @Override
        public void run() {
            try {
                retrieveMessages();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            // Repeat every 3 seconds
            handler.postDelayed(runnable, 3000);
        }
    };
```

Note that the task has already been started at the end of the `MainActivity.joinTeamsMeeting()` method updated in the initialization step.

Finally, we add the method for querying all accessible messages on the thread, parsing them by message type and displaying the `html` and `text` ones:

```
    private void retrieveMessages() throws InterruptedException {
        // Initialize the list of messages not yet processed
        ArrayList<ChatMessage> newChatMessages = new ArrayList<>();
        
        // Retrieve all messages accessible to the user
        PagedAsyncStream<ChatMessage> messagePagedAsyncStream
                = this.chatThreadAsyncClient.listMessages(new ListChatMessagesOptions(), null);
        // Set up a lock to wait until all returned messages have been inspected
        CountDownLatch latch = new CountDownLatch(1);
        // Traverse the returned messages
        messagePagedAsyncStream.forEach(new AsyncStreamHandler<ChatMessage>() {
            @Override
            public void onNext(ChatMessage message) {
                // Messages that should be displayed in the chat
                if ((message.getType().equals(ChatMessageType.TEXT)
                    || message.getType().equals(ChatMessageType.HTML))
                    && !chatMessages.contains(message.getId())) {
                    newChatMessages.add(message);
                    chatMessages.add(message.getId());
                }
                if (message.getType().equals(ChatMessageType.PARTICIPANT_ADDED)) {
                    // Handle participants added to chat operation
                    List<ChatParticipant> participantsAdded = message.getContent().getParticipants();
                    CommunicationIdentifier participantsAddedBy = message.getContent().getInitiatorCommunicationIdentifier();
                }
                if (message.getType().equals(ChatMessageType.PARTICIPANT_REMOVED)) {
                    // Handle participants removed from chat operation
                    List<ChatParticipant> participantsRemoved = message.getContent().getParticipants();
                    CommunicationIdentifier participantsRemovedBy = message.getContent().getInitiatorCommunicationIdentifier();
                }
                if (message.getType().equals(ChatMessageType.TOPIC_UPDATED)) {
                    // Handle topic updated
                    String newTopic = message.getContent().getTopic();
                    CommunicationIdentifier topicUpdatedBy = message.getContent().getInitiatorCommunicationIdentifier();
                }
            }
            @Override
            public void onError(Throwable throwable) {
                latch.countDown();
            }
            @Override
            public void onComplete() {
                latch.countDown();
            }
        });
        // Wait until the operation completes
        latch.await(1, TimeUnit.MINUTES);
        // Returned messages should be ordered by the createdOn field to be guaranteed a proper chronological order
        // For the purpose of this demo we will just reverse the list of returned messages
        Collections.reverse(newChatMessages);
        for (ChatMessage chatMessage : newChatMessages)
        {
            LinearLayout chatBoxLayout = findViewById(R.id.chat_box_layout);
            // For the purpose of this demo UI, we don't need to use HTML formatting for displaying messages
            // The Teams client always sends html messages in meeting chats 
            String message = Html.fromHtml(chatMessage.getContent().getMessage(), Html.FROM_HTML_MODE_LEGACY).toString().trim();
            TextView messageView = new TextView(this);
            messageView.setText(message);
            // Compare with sender identifier and align LEFT/RIGHT accordingly
            // Azure Communication Services users are of type CommunicationUserIdentifier
            CommunicationIdentifier senderId = chatMessage.getSenderCommunicationIdentifier();
            if (senderId instanceof CommunicationUserIdentifier
                && InitiatorId.equals(((CommunicationUserIdentifier) senderId).getId())) {
                messageView.setTextColor(Color.GREEN);
                messageView.setGravity(Gravity.RIGHT);
            } else {
                messageView.setTextColor(Color.BLUE);
                messageView.setGravity(Gravity.LEFT);
            }
            // Note: messages with the deletedOn property set to a timestamp, should be marked as deleted
            // Note: messages with the editedOn property set to a timestamp, should be marked as edited
            messageView.setTypeface(Typeface.SANS_SERIF, Typeface.BOLD);
            chatBoxLayout.addView(messageView);
        }
    }
```

Display names of the chat thread participants are not set by the Teams client. The names are returned as null in the API for listing participants, in the `participantsAdded` event and in the `participantsRemoved` event. The display names of the chat participants can be retrieved from the `remoteParticipants` field of the `call` object.

## Get a Teams meeting chat thread for a Communication Services user

The Teams meeting details can be retrieved using Graph APIs, detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true). The Communication Services Calling SDK accepts a full Teams meeting link or a meeting ID. They are returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true)

With the [Graph APIs](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true), you can also obtain the `threadID`. The response has a `chatInfo` object that contains the `threadID`.

You can also get the required meeting information and thread ID from the **Join Meeting** URL in the Teams meeting invite itself.
A Teams meeting link looks like this: `https://teams.microsoft.com/l/meetup-join/meeting_chat_thread_id/1606337455313?context=some_context_here`. The `threadId` is where `meeting_chat_thread_id` is in the link. Ensure that the `meeting_chat_thread_id` is unescaped before use. It should be in the following format: `19:meeting_ZWRhZDY4ZGUtYmRlNS00OWZaLTlkZTgtZWRiYjIxOWI2NTQ4@thread.v2`


## Run the code

The app can now be launched using the "Run App" button on the toolbar (Shift+F10).

To join the Teams meeting and chat, enter your Team's meeting link and the thread ID in the UI.

After joining the Team's meeting, you need to admit the user to the meeting in your Team's client. Once the user is admitted and has joined the chat, you are able to send and receive messages.

:::image type="content" source="../join-teams-meeting-chat-quickstart-android.png" alt-text="Screenshot of the completed Android Application.":::

> [!NOTE] 
> Certain features are currently not supported for interoperability scenarios with Teams. Learn more about the supported features, please see [Teams meeting capabilities for Teams external users](../../../concepts/interop/guest/capabilities.md)

