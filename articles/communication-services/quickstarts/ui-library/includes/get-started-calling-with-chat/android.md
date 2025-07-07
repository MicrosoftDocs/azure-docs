---
author: pavelprystinka
ms.author: pprystinka
ms.date: 10/28/2024
ms.topic: include
ms.service: azure-communication-services
---

## Prerequisites

- An Azure account and an active Azure subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An OS running [Android Studio](https://developer.android.com/studio).
- A deployed [Azure Communication Services resource](../../../create-communication-resource.md).
- An Azure Communication Services [access token](../../../identity/quick-create-identity.md).

## Get a complete sample

You can get a [complete sample project](https://github.com/Azure-Samples/communication-services-calling-ui-with-chat-android) from GitHub.

:::image type="content" source="../../media/call-chat-android-experience.gif" alt-text="Animation to showcase the experience on Android using call and chat in the same app.":::

## Set up the project

In Android Studio, create a new project:

1. On the **File** menu, select **New** > **New Project**.

1. In **New Project**, select the **Empty Activity** project template.

   :::image type="content" source="../../media/composite-android-new-project.png" alt-text="Screenshot that shows the New Project dialog in Android Studio with Empty Activity selected.":::

1. Select **Next**.

1. In **Empty Activity**, name the project **UILibraryQuickStart**. For language, select **Java** or **Kotlin**. For the minimum SDK, select **API 26: Android 8.0 (Oreo)** or later.

1. Select **Finish**.

   :::image type="content" source="../../media/composite-android-new-project-finish.png" alt-text="Screenshot that shows new project options and the Finish button.":::

## Install the packages

Complete the following sections to install the required application packages.

### Add a dependency

In your app-level *UILibraryQuickStart/app/build.gradle* file, add the following dependency:

```groovy
dependencies {
    ...
    implementation("com.azure.android:azure-communication-ui-calling:+")
    implementation("com.azure.android:azure-communication-ui-chat:+")
    ...
}
```

Add a `META-INF` exclusion to the *UILibraryQuickStart/app/build.gradle* `android` section:

```groovy
packaging {
    resources.excludes.add("META-INF/*")
}
```

### Add Maven repositories

You need two Maven repositories to integrate the library:

- The `mavenCentral` repository
- The Azure package repository

    ```groovy
    repositories {
        ...
        mavenCentral()
        maven {
            url = URI("https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1")
        }
        ...
    }
    ```

## Connect to the Teams meeting with calling and chat

You use `CallComposite` to connect to the call. After a user is admitted to the call, `CallComposite` notifies you by changing the status to `connected`. Then the user can be connected to the chat thread.

When the user selects the **Chat** button, a custom button is added to `CallComposite`. `CallComposite` is minimized, and **Chat** appears in Teams.

## Add a button and chat container view to Activity_main.xml

In the *app/src/main/res/layout/activity_main.xml* layout file, add the following code to create a button to start the composite:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">
    <LinearLayout
        android:id="@+id/buttonContainer"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        >
        <Button
            android:id="@+id/startCallButton"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Start Call"
            app:layout_constraintStart_toStartOf="parent"
            android:layout_marginStart="4dp"
            />
    </LinearLayout>
    <androidx.constraintlayout.widget.ConstraintLayout
        android:id="@+id/chatContainer"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        app:layout_constraintTop_toBottomOf="@+id/buttonContainer"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        >
    </androidx.constraintlayout.widget.ConstraintLayout>
</androidx.constraintlayout.widget.ConstraintLayout>
```

## Download a Chat icon

1. Download an icon from the [GitHub repository](https://github.com/microsoft/fluentui-system-icons/blob/master/android/library/src/main/res/drawable/ic_fluent_chat_24_regular.xml).
1. Save the icon to *UILibraryQuickStart/app/src/main/res/drawable*.
1. Open the icon and change `android:fillColor` to `@color/white`.

## Initialize the composite

To initialize the call composite, go to `MainActivity` and update connection settings:

- Replace `TEAM_MEETING_LINK` with the Teams meeting link.
- Replace `ACS_ENDPOINT` with your Azure Communication Services resource's endpoint.
- Replace `DISPLAY_NAME` with your name.
- Replace `USER_ID` with your Azure Communication Services user ID.
- Replace `USER_ACCESS_TOKEN` with your token.

### Get a Teams meeting chat thread for an Azure Communication Services user

You can retrieve Teams meeting details by using Graph APIs, as described in the [Graph documentation](/graph/api/onlinemeeting-createorget). The Azure Communication Services Calling SDK accepts a full Teams meeting link or a meeting ID. They're returned as part of the `onlineMeeting` resource, which is accessible under the [joinWebUrl](/graph/api/resources/onlineMeeting) property.

With the Graph APIs, you can also obtain the `threadID` value. The response has a `chatInfo` object that contains the `threadID` value.

#### [Kotlin](#tab/kotlin)

```kotlin
package com.example.uilibraryquickstart

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.ViewGroup
import android.widget.Button
import androidx.constraintlayout.widget.ConstraintLayout
import com.azure.android.communication.common.CommunicationTokenCredential
import com.azure.android.communication.common.CommunicationTokenRefreshOptions
import com.azure.android.communication.common.CommunicationUserIdentifier
import com.azure.android.communication.ui.calling.CallComposite
import com.azure.android.communication.ui.calling.CallCompositeBuilder
import com.azure.android.communication.ui.calling.models.CallCompositeCallScreenHeaderViewData
import com.azure.android.communication.ui.calling.models.CallCompositeCallScreenOptions
import com.azure.android.communication.ui.calling.models.CallCompositeCallStateCode
import com.azure.android.communication.ui.calling.models.CallCompositeCustomButtonViewData
import com.azure.android.communication.ui.calling.models.CallCompositeLocalOptions
import com.azure.android.communication.ui.calling.models.CallCompositeMultitaskingOptions
import com.azure.android.communication.ui.calling.models.CallCompositeTeamsMeetingLinkLocator
import com.azure.android.communication.ui.chat.ChatAdapter
import com.azure.android.communication.ui.chat.ChatAdapterBuilder
import com.azure.android.communication.ui.chat.presentation.ChatThreadView
import java.util.UUID

class MainActivity : AppCompatActivity() {
    companion object {
        private var callComposite: CallComposite? = null
        private var chatAdapter: ChatAdapter? = null
    }

    private val displayName = "USER_NAME"
    private val endpoint = "ACS_ENDPOINT"
    private val teamsMeetingLink = "TEAM_MEETING_LINK"
    private val threadId = "CHAT_THREAD_ID"
    private val communicationUserId = "USER_ID"
    private val userToken = "USER_ACCESS_TOKEN"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        findViewById<Button>(R.id.startCallButton).setOnClickListener {
            startCallComposite()
        }
    }

    private fun startCallComposite() {
        val communicationTokenRefreshOptions = CommunicationTokenRefreshOptions({ userToken }, true)
        val communicationTokenCredential = CommunicationTokenCredential(communicationTokenRefreshOptions)
        val locator = CallCompositeTeamsMeetingLinkLocator(teamsMeetingLink)

        val localOptions = CallCompositeLocalOptions()
            .setCallScreenOptions(
                CallCompositeCallScreenOptions().setHeaderViewData(
                    CallCompositeCallScreenHeaderViewData().setCustomButtons(
                        listOf(
                            CallCompositeCustomButtonViewData(
                                UUID.randomUUID().toString(),
                                R.drawable.ic_fluent_chat_24_regular,
                                "Open Chat",
                            ) {
                                callComposite?.sendToBackground()
                                showChatUI()
                            }
                        )
                    )
                ))
        val callComposite = CallCompositeBuilder()
            .applicationContext(this.applicationContext)
            .credential(communicationTokenCredential)
            .displayName(displayName)
            .multitasking(CallCompositeMultitaskingOptions(true, true))
            .build()

        callComposite.addOnCallStateChangedEventHandler { callState ->
            // When a user is admitted to the Teams meeting, the call state becomes connected.
            // Only users admitted to the meeting can connect to the meeting's chat thread.
            if (callState.code == CallCompositeCallStateCode.CONNECTED) {
                connectChat()
            }
        }

        callComposite.launch(this, locator, localOptions)
        MainActivity.callComposite = callComposite
    }

    private fun connectChat() {
        if (chatAdapter != null)
            return

        val communicationTokenRefreshOptions =
            CommunicationTokenRefreshOptions( { userToken }, true)
        val communicationTokenCredential =
            CommunicationTokenCredential(communicationTokenRefreshOptions)

        val chatAdapter = ChatAdapterBuilder()
            .endpoint(endpoint)
            .credential(communicationTokenCredential)
            .identity(CommunicationUserIdentifier(communicationUserId))
            .displayName(displayName)
            .threadId(threadId)
            .build()
        chatAdapter.connect(applicationContext)
        MainActivity.chatAdapter = chatAdapter
    }

    private fun showChatUI() {
        chatAdapter?.let {
            // Create Chat Composite View
            val chatView = ChatThreadView(this, chatAdapter)
            val chatContainer = findViewById<ConstraintLayout>(R.id.chatContainer)
            chatContainer.removeAllViews()
            chatContainer.addView(
                chatView,
                ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
            )
        }
    }
}
```

#### [Java](#tab/java)

```java
package com.example.uilibraryquickstart;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;

import android.os.Bundle;
import android.view.ViewGroup;

import com.azure.android.communication.common.CommunicationTokenCredential;
import com.azure.android.communication.common.CommunicationTokenRefreshOptions;
import com.azure.android.communication.common.CommunicationUserIdentifier;
import com.azure.android.communication.ui.calling.CallComposite;
import com.azure.android.communication.ui.calling.CallCompositeBuilder;
import com.azure.android.communication.ui.calling.models.CallCompositeCallScreenHeaderViewData;
import com.azure.android.communication.ui.calling.models.CallCompositeCallScreenOptions;
import com.azure.android.communication.ui.calling.models.CallCompositeCallStateCode;
import com.azure.android.communication.ui.calling.models.CallCompositeCustomButtonViewData;
import com.azure.android.communication.ui.calling.models.CallCompositeLocalOptions;
import com.azure.android.communication.ui.calling.models.CallCompositeMultitaskingOptions;
import com.azure.android.communication.ui.calling.models.CallCompositeTeamsMeetingLinkLocator;
import com.azure.android.communication.ui.chat.ChatAdapter;
import com.azure.android.communication.ui.chat.ChatAdapterBuilder;
import com.azure.android.communication.ui.chat.presentation.ChatThreadView;

import java.util.ArrayList;
import java.util.UUID;

public class MainActivity extends AppCompatActivity {
    static CallComposite callComposite;
    static ChatAdapter chatAdapter;

    private String displayName = "USER_NAME";
    private String endpoint = "ACS_ENDPOINT";
    private String teamsMeetingLink = "TEAM_MEETING_LINK";
    private String threadId = "CHAT_THREAD_ID";
    private String communicationUserId = "USER_ID";
    private String userToken = "USER_ACCESS_TOKEN";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        findViewById(R.id.startCallButton).setOnClickListener(v -> {
            startCallComposite();
        });
    }

    private void startCallComposite() {
        CommunicationTokenRefreshOptions communicationTokenRefreshOptions = new CommunicationTokenRefreshOptions(() -> {
            return userToken;
        }, true);
        CommunicationTokenCredential communicationTokenCredential = new CommunicationTokenCredential(communicationTokenRefreshOptions);
        CallCompositeTeamsMeetingLinkLocator locator = new CallCompositeTeamsMeetingLinkLocator(teamsMeetingLink);

        CallCompositeLocalOptions localOptions = new CallCompositeLocalOptions()
                .setCallScreenOptions(
                        new CallCompositeCallScreenOptions().setHeaderViewData(
                                new CallCompositeCallScreenHeaderViewData().setCustomButtons(new ArrayList<CallCompositeCustomButtonViewData>() {{
                                    add(new CallCompositeCustomButtonViewData(
                                                    UUID.randomUUID().toString(),
                                                    R.drawable.ic_fluent_chat_24_regular,
                                                    "Open Chat",
                                                    eventArgs -> {
                                                        callComposite.sendToBackground();
                                                        showChatUI();
                                                    }
                                            )
                                    );
                                }})
                        )
                );

        CallComposite callComposite = new CallCompositeBuilder()
                .applicationContext(this.getApplicationContext())
                .credential(communicationTokenCredential)
                .displayName(displayName)
                .multitasking(new CallCompositeMultitaskingOptions(true, true))
                .build();

        callComposite.addOnCallStateChangedEventHandler(callState -> {
                    // When a user is admitted to the Teams meeting, the call state becomes connected.
                    // Only users admitted to the meeting can connect to the meeting's chat thread.
                    if (callState.getCode() == CallCompositeCallStateCode.CONNECTED) {
                        connectChat();
                    }
                }
        );

        callComposite.launch(this, locator, localOptions);
        MainActivity.callComposite = callComposite;
    }

    private void connectChat() {
        if (chatAdapter != null)
            return;

        CommunicationTokenRefreshOptions communicationTokenRefreshOptions =
                new CommunicationTokenRefreshOptions(() -> {
                    return userToken;
                }, true);
        CommunicationTokenCredential communicationTokenCredential =
                new CommunicationTokenCredential(communicationTokenRefreshOptions);

        ChatAdapter chatAdapter = new ChatAdapterBuilder()
                .endpoint(endpoint)
                .credential(communicationTokenCredential)
                .identity(new CommunicationUserIdentifier(communicationUserId))
                .displayName(displayName)
                .threadId(threadId)
                .build();
        chatAdapter.connect(getApplicationContext());
        MainActivity.chatAdapter = chatAdapter;
    }

    private void showChatUI() {
        if (chatAdapter == null)
            return;

        // Create Chat Composite View
        ChatThreadView chatView = new ChatThreadView(this, chatAdapter);
        ConstraintLayout chatContainer = (ConstraintLayout) findViewById(R.id.chatContainer);
        chatContainer.removeAllViews();
        chatContainer.addView(
                chatView,
                new ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                )
        );
    }
}
```
