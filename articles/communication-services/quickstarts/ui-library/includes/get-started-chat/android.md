---
author: dhiraj
ms.author: dhiraj
ms.date: 11/29/2022
ms.topic: include
ms.service: azure-communication-services
---

[!INCLUDE [Public Preview Notice](../../../../includes/public-preview-include.md)]

Get the sample Android application for this [quickstart](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-chat) in the open source Azure Communication Services [UI Library for Android](https://github.com/Azure/communication-ui-library-android).

## Prerequisites

- An Azure account and an active Azure subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An OS running [Android Studio](https://developer.android.com/studio).
- A deployed [Azure Communication Services resource](../../../create-communication-resource.md), note the endpoint URL.
- An Azure Communication Services [access token](../../../identity/quick-create-identity.md) and user identifier.
- An Azure Communication Services [chat thread](../../../chat/get-started.md) with above user added to it.


## Set up the project

Complete the following sections to set up the quickstart project.

### Create a new Android project

In Android Studio, create a new project:

1. In the **File** menu, select **New** > **New Project**.

1. In **New Project**, select the **Empty Activity** project template.

   :::image type="content" source="../../media/composite-android-new-project.png" alt-text="Screenshot that shows the New Project dialog in Android Studio with Empty Activity selected.":::

1. Select **Next**.

1. In **Empty Activity**, name the project **UILibraryQuickStart**. For language, select **Java/Kotlin**. For the minimum SDK, select **API 23: Android 6.0 (Marshmallow)** or later.

1. Select **Finish**.

   :::image type="content" source="../../media/chat-android-new-project.png" alt-text="Screenshot that shows new project options and the Finish button selected.":::

## Install the packages

Complete the following sections to install the required application packages.

### Add a dependency

In your app-level *UILibraryQuickStart/app/build.gradle* file (in the app folder), add the following dependency:

```groovy
dependencies {
    ...
    implementation 'com.azure.android:azure-communication-ui-chat:+'
    ...
}
```

### Add Maven repositories

The Azure package repository is required to integrate the library:

To add the repository:

1. In your project Gradle scripts, ensure that the following repositories are added. For Android Studio (2020.\*), `repositories` is in `settings.gradle`, under `dependencyResolutionManagement(Gradle version 6.8 or greater)`.  For earlier versions of Android Studio (4.\*), `repositories` is in the project-level `build.gradle`, under `allprojects{}`.

    ```groovy
    // dependencyResolutionManagement
    repositories {
        ...
        maven {
            url "https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1"
        }
        ...
    }
    ```

1. Sync your project with the Gradle files. To sync the project, on the **File** menu, select **Sync Project With Gradle Files**.

## Add a button to activity_main.xml

In the *app/src/main/res/layout/activity_main.xml* layout file, add the following code to create a button to start the composite:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <Button
        android:id="@+id/startButton"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Launch"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

## Initialize the composite

To initialize the composite:

1. Go to `MainActivity`.

1. Add the following code to initialize your composite components for calling. Replace the string values for properties (kotlin) or functions (java) for `endpoint`, `acsIdentity`, `displayName`, `accessToken` and `ThreadId`. Replace `endpoint` with the URL for your resource as provided by Azure Communication Services. Replace `acsIdentity` and `accessToken` with the values provided by Azure Communication Services when you created the access token and use a relevant displayName. Replace `ThreadId` with the value returned when you created the thread. Remember to add the user to the thread via REST API call, or the az command line interface client before you try to run the quick start sample or the client will be denied access to join the thread.

#### [Kotlin](#tab/kotlin)

```kotlin
package com.example.uilibraryquickstart

import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.azure.android.communication.common.CommunicationTokenCredential
import com.azure.android.communication.common.CommunicationTokenRefreshOptions
import com.azure.android.communication.common.CommunicationUserIdentifier
import com.azure.android.communication.ui.chat.ChatAdapter
import com.azure.android.communication.ui.chat.ChatAdapterBuilder
import com.azure.android.communication.ui.chat.presentation.ChatThreadView

class MainActivity : AppCompatActivity() {
    private lateinit var chatAdapter: ChatAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val startButton = findViewById<Button>(R.id.startButton)
        startButton.setOnClickListener { l: View? ->
            val communicationTokenRefreshOptions =
                CommunicationTokenRefreshOptions(
                    { accessToken }, true
                )
            val communicationTokenCredential =
                CommunicationTokenCredential(communicationTokenRefreshOptions)
            chatAdapter = ChatAdapterBuilder()
                .endpoint(endpoint)
                .credential(communicationTokenCredential)
                .identity(CommunicationUserIdentifier(acsIdentity))
                .displayName(displayName)
                .threadId(threadId)
                .build()
            try {
                chatAdapter.connect(this@MainActivity).get()
                val chatView: View = ChatThreadView(this@MainActivity, chatAdapter)
                addContentView(
                    chatView,
                    ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                )
            } catch (e: Exception) {
                var messageCause: String? = "Unknown error"
                if (e.cause != null && e.cause!!.message != null) {
                    messageCause = e.cause!!.message
                }
                showAlert(messageCause)
            }
        }
    }

    /**
     *
     * @return String endpoint URL from Azure Communication Services Admin UI, "https://example.domain.com/"
     */
    private val endpoint: String?
        get() = "https://example.domain.com/"

    /**
     *
     * @return String identity of the user joining the chat
     * Looks like "8:acs:a6aada1f-0b1e-47ac-866a-91aae00a1c01_00000015-45ee-bad7-0ea8-923e0d008a89"
     */
    private val acsIdentity: String?
        get() = ""

    /**
     *
     * @return String display name of the user joining the chat
     */
    private val displayName: String?
        get() = ""

    /**
     *
     * @return String secure Azure Communication Services access token for the current user
     */
    private val accessToken: String?
        get() = ""

    /**
     *
     * @return String id of Azure Communication Services chat thread to join
     * Looks like "19:AVNnEll25N4KoNtKolnUAhAMu8ntI_Ra03saj0Za0r01@thread.v2"
     */
    private val threadId: String?
        get() = ""

    fun showAlert(message: String?) {
        runOnUiThread {
            AlertDialog.Builder(this@MainActivity)
                .setMessage(message)
                .setTitle("Alert")
                .setPositiveButton(
                    "OK"
                ) { _, i -> }
                .show()
        }
    }
}
```

#### [Java](#tab/java)

```java
package com.example.uilibraryquickstart;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import com.azure.android.communication.common.CommunicationTokenCredential;
import com.azure.android.communication.common.CommunicationTokenRefreshOptions;
import com.azure.android.communication.common.CommunicationUserIdentifier;
import com.azure.android.communication.ui.chat.ChatAdapter;
import com.azure.android.communication.ui.chat.ChatAdapterBuilder;
import com.azure.android.communication.ui.chat.presentation.ChatThreadView;

public class MainActivity extends AppCompatActivity {
    private ChatAdapter chatAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button startButton = findViewById(R.id.startButton);
        startButton.setOnClickListener(l -> {
            CommunicationTokenRefreshOptions communicationTokenRefreshOptions =
                    new CommunicationTokenRefreshOptions(this::accessToken, true);
            CommunicationTokenCredential communicationTokenCredential =
                    new CommunicationTokenCredential(communicationTokenRefreshOptions);
            chatAdapter = new ChatAdapterBuilder()
                    .endpoint(endpoint())
                    .credential(communicationTokenCredential)
                    .identity(new CommunicationUserIdentifier(acsIdentity()))
                    .displayName(displayName())
                    .threadId(threadId())
                    .build();
            try {
                chatAdapter.connect(MainActivity.this).get();
                View chatView = new ChatThreadView(MainActivity.this, chatAdapter);
                addContentView(chatView, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT));
            }
            catch (Exception e){
                String messageCause = "Unknown error";
                if (e.getCause() != null && e.getCause().getMessage() != null){
                    messageCause = e.getCause().getMessage();
                }
                showAlert(messageCause);
            }
        });
    }
    /**
     *
     * @return String endpoint URL from Azure Communication Services Admin UI, "https://example.domain.com/"
     */
    private String endpoint(){
        return "https://example.domain.com/";
    }
    /**
     *
     * @return String identity of the user joining the chat
     * Looks like "8:acs:a6aada1f-0b1e-47ac-866a-91aae00a1c01_00000015-45ee-bad7-0ea8-923e0d008a89"
     */
    private String acsIdentity(){
        return "";
    }
    /**
     *
     * @return String display name of the user joining the chat
     */
    private String displayName(){
        return "";
    }
    /**
     *
     * @return String secure Azure Communication Services access token for the current user
     */
    private String accessToken(){
        return "";
    }
    /**
     *
     * @return String id of Azure Communication Services chat thread to join
     * Looks like "19:AVNnEll25N4KoNtKolnUAhAMu8ntI_Ra03saj0Za0r01@thread.v2"
     */
    private String threadId(){
        return "";
    }
    void showAlert(String message){
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                new AlertDialog.Builder(MainActivity.this)
                        .setMessage(message)
                        .setTitle("Alert")
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                            }
                        })
                        .show();
            }
        });
    }
}
```

---

## Run the code

In Android Studio, build and start the application:

1. Select **Start Experience**.
1. The chat client will join the chat thread and you can start typing and sending messages
1. If the client is not able to join the thread, and you see chatJoin failed errors, verify that your user's access token is valid and that the user has been added to the chat thread by REST API call, or by using the `az` command line interface.

:::image type="content" source="../../media/quickstart-chat.gif" alt-text="GIF animation that shows an example of how the project runs on an Android device.":::