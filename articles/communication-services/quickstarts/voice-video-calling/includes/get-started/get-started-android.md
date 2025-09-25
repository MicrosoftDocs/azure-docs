---
title: Add VOIP calling to an Android app
description: This article describes how to add VOIP calling to an Android app using Azure Communication Services Calling SDK for Android.
author: tophpalmer
ms.author: rifox
ms.date: 05/10/2025
ms.topic: include
ms.service: azure-communication-services
ms.custom: sfi-ropc-nochange
---

This article describes how to start a call using the Azure Communication Services Calling SDK for Android.

## Sample Code

You can download the sample app from GitHub at [Add voice calling to your Android app](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/Add%20Voice%20Calling).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Android Studio](https://developer.android.com/studio), for creating your Android application.
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You need to **record your connection string** for this article.
- A [User Access Token](../../../identity/access-tokens.md) for your Azure Communication Service. You can also use the Azure CLI and run the command with your connection string to create a user and an access token.


  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../../identity/access-tokens.md?pivots=platform-azcli).
  
## Set up

### Create an Android app with an empty activity

From Android Studio, select **Start a new Android Studio** project.

:::image type="content" source="../../media/android/studio-new-project.png" alt-text="Screenshot showing the 'Start a new Android Studio Project' button selected in Android Studio.":::

Select **Empty Views Activity** project template under **Phone and Tablet**.

:::image type="content" source="../../media/android/studio-blank-activity.png" alt-text="Screenshot showing the 'Empty Activity' option selected in the Project Template Screen.":::

Select Minimum SDK of **API 26: Android 8.0 (Oreo)** or greater.

:::image type="content" source="../../media/android/studio-calling-min-api.png" alt-text="Screenshot showing the 'Empty Activity' option selected in the Project Template Screen 2.":::


### Install the package

<!-- TODO: update with instructions on how to download, install and add package to project -->
Locate your project `settings.gradle.kts` and make sure to see `mavenCentral()` at the list of repositories under `pluginManagement` and `dependencyResolutionManagement`
```groovy
pluginManagement {
    repositories {
    ...
        mavenCentral()
    ...
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
    ...
        mavenCentral()
    }
}
```
Then, in your module level build.gradle add the following lines to the dependencies and android sections:

```groovy
android {
    ...
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    ...
    implementation ("com.azure.android:azure-communication-calling:2.6.0")
    ...
}
```

### Add permissions to application manifest

To request permissions required to make a call, they must be declared in the Application Manifest (`app/src/main/AndroidManifest.xml`). Replace the content of file with the following code:

```xml
    <?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.contoso.acsquickstart">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <!--Our Calling SDK depends on the Apache HTTP SDK.
When targeting Android SDK 28+, this library needs to be explicitly referenced.
See https://developer.android.com/about/versions/pie/android-9.0-changes-28#apache-p-->
        <uses-library android:name="org.apache.http.legacy" android:required="false"/>
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
    
```

### Set up the layout for the app

Two inputs are needed: a text input for the callee ID, and a button for placing the call. These inputs can be added through the designer or by editing the layout xml. Create a button with an ID of `call_button` and a text input of `callee_id`. Navigate to (`app/src/main/res/layout/activity_main.xml`) and replace the content of file with the following code:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <Button
        android:id="@+id/call_button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="16dp"
        android:text="Call"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent" />

    <EditText
        android:id="@+id/callee_id"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:ems="10"
        android:hint="Callee Id"
        android:inputType="textPersonName"
        android:minHeight="48dp"
        app:layout_constraintBottom_toTopOf="@+id/call_button"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
```

### Create the main activity scaffolding and bindings

With the layout complete, you can add the bindings and the basic scaffolding of the activity. The activity handles requesting runtime permissions, creating the call agent, and placing the call when the button is press ed. Each is covered in its own section. The `onCreate` method is overridden to invoke `getAllPermissions` and `createAgent` and to add the bindings for the call button. This event occurs only once when the activity is created. For more information, on `onCreate`, see [Understand the Activity Lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle).

Navigate to **MainActivity.java** and replace the content with the following code:

```java
package com.contoso.acsquickstart;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import android.media.AudioManager;
import android.Manifest;
import android.content.pm.PackageManager;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.azure.android.communication.common.CommunicationUserIdentifier;
import com.azure.android.communication.common.CommunicationTokenCredential;
import com.azure.android.communication.calling.CallAgent;
import com.azure.android.communication.calling.CallClient;
import com.azure.android.communication.calling.StartCallOptions;


import java.util.ArrayList;
import java.util.Arrays;

public class MainActivity extends AppCompatActivity {
    
    private CallAgent callAgent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        getAllPermissions();
        createAgent();
        
        // Bind call button to call `startCall`
        Button callButton = findViewById(R.id.call_button);
        callButton.setOnClickListener(l -> startCall());
        
        setVolumeControlStream(AudioManager.STREAM_VOICE_CALL);
    }

    /**
     * Request each required permission if the app doesn't already have it.
     */
    private void getAllPermissions() {
        // See section on requesting permissions
    }

    /**
      * Create the call agent for placing calls
      */
    private void createAgent() {
        // See section on creating the call agent
    }

    /**
     * Place a call to the callee id provided in `callee_id` text input.
     */
    private void startCall() {
        // See section on starting the call
    }
}

```

### Request permissions at runtime

For Android 6.0 and higher (API level 23) and `targetSdkVersion` 23 or higher, permissions are granted at runtime instead of when the app is installed. In order to support it, `getAllPermissions` can be implemented to call `ActivityCompat.checkSelfPermission` and `ActivityCompat.requestPermissions` for each required permission.

```java
/**
 * Request each required permission if the app doesn't already have it.
 */
private void getAllPermissions() {
    String[] requiredPermissions = new String[]{android.Manifest.permission.RECORD_AUDIO, android.Manifest.permission.CAMERA, android.Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_PHONE_STATE};

    ArrayList<String> permissionsToAskFor = new ArrayList<>();

    for (String permission : requiredPermissions) {
        if (ActivityCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
            permissionsToAskFor.add(permission);
        }
    }

    if (!permissionsToAskFor.isEmpty()) {
        ActivityCompat.requestPermissions(this, permissionsToAskFor.toArray(new String[0]), 1);
    }
}
```

> [!NOTE]
> When designing your app, consider when these permissions should be requested. Permissions should be requested as needed, not ahead of time. For more information, see [Android Permissions](https://developer.android.com/training/permissions/requesting).

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name  | Description |
| --- | --- |
| `allClient`| The `CallClient` is the main entry point to the Calling SDK.|
| `CallAgent` | Use the `CallAgent` to start and manage calls. |
| `CommunicationTokenCredential` | Use the `CommunicationTokenCredential` as the token credential to instantiate the `CallAgent`.|
| `CommunicationIdentifier` | Use `CommunicationIdentifier` for different types of participants that might be part of a call.|

## Create an agent from the user access token

With a user token, an authenticated call agent can be instantiated. This token is generated from a service with authentication specific to the application. For more information, see [User Access Tokens](../../../identity/access-tokens.md).

For this article, replace `<User_Access_Token>` with a user access token generated for your Azure Communication Service resource.

```java

/**
 * Create the call agent for placing calls
 */
private void createAgent() {
    String userToken = "<User_Access_Token>";

    try {
            CommunicationTokenCredential credential = new CommunicationTokenCredential(userToken);
            callAgent = new CallClient().createCallAgent(getApplicationContext(), credential).get();
    } catch (Exception ex) {
        Toast.makeText(getApplicationContext(), "Failed to create call agent.", Toast.LENGTH_SHORT).show();
    }
}

```

## Start a call using the call agent

You can place a call via the call agent, which requires providing a list of callee IDs and the call options. This article uses the default call options without video and a single callee ID from the text input.

```java
/**
 * Place a call to the callee id provided in `callee_id` text input.
 */
private void startCall() {
    EditText calleeIdView = findViewById(R.id.callee_id);
    
    String calleeId = calleeIdView.getText().toString();

    StartCallOptions options = new StartCallOptions();

    callAgent.startCall(
            getApplicationContext(),
            Arrays.asList(new CommunicationUserIdentifier[]{new CommunicationUserIdentifier(calleeId)}),
            options);
}
```


## Launch the app and call the echo bot

You can launch the app using the **Run App** button on the toolbar (Shift+F10). Verify you can place calls by calling `8:echo123`. A prerecorded message plays, then repeats your message back to you.

:::image type="content" source="../../media/android/quickstart-android-call-echobot.png" alt-text="Screenshot showing the completed application.":::
