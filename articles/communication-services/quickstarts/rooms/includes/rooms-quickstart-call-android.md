---
title: include file
description: include file
services: azure-communication-services
author: mrayyan
manager: alexokun

ms.service: azure-communication-services
ms.date: 07/20/2023
ms.topic: include
ms.custom: include file
ms.author: t-siddiquim
---

## Sample app


To follow along with this quickstart, you can download the Room Call quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/RoomsCallQuickstart).


## Setting up project


## Create an Android app with an empty activity

From Android Studio, create a new project:

:::image type="content" source="..\..\voice-video-calling\media\android\start-new-project.png" alt-text="Screenshot showing the Start of creating a new Android Studio Project":::

Name your project **Room Call Quickstart** and select **Kotlin**.

:::image type="content" source="..\..\voice-video-calling\media\android\android-room-project.png" alt-text="Screenshot showing new project properties in the Project Setup Screen.":::

## Install the package
In your module level `build.gradle`, add the following line to the `dependencies` section.

```groovy
dependencies {
    ...
    //Ability to join a Rooms calls is available in 2.4.0 or above.
    implementation 'com.azure.android:azure-communication-calling:2.4.0'
    ...
}
```


## Add permissions to application manifest

To request permissions required to make a call, you must first declare the permissions in the application manifest (`app/src/main/AndroidManifest.xml`). Copy the following to your manifest file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-feature
        android:name="android.hardware.camera"
        android:required="false" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppTheme">

        <!--Our Calling SDK depends on the Apache HTTP SDK.
    When targeting Android SDK 28+, this library needs to be explicitly referenced.
    See https://developer.android.com/about/versions/pie/android-9.0-changes-28#apache-p-->
        <uses-library android:name="org.apache.http.legacy" android:required="false"/>
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>

```

### Set up the layout for the app

You need a text input for the room ID, a button for placing the call, and extra button for hanging up the call.

Go to `app/src/main/res/layout/activity_main.xml`, and replace the content of file with the following code:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <TextView
        android:id="@+id/text_role"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Role:"
        android:textSize="16sp"
        android:textStyle="bold"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginTop="16dp" />

    <TextView
        android:id="@+id/text_call_status"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Call Status"
        android:textSize="16sp"
        android:textStyle="bold"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginTop="48dp" />

    <EditText
        android:id="@+id/room_id"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:ems="10"
        android:hint="Room ID"
        android:inputType="textPersonName"
        android:layout_marginTop="100dp"
        android:layout_marginHorizontal="20dp"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="260dp"
        android:gravity="center"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent">

        <Button
            android:id="@+id/call_button"
            android:layout_width="wrap_content"
            android:layout_marginEnd="32dp"
            android:layout_height="wrap_content"
            android:text="Start Call" />

        <Button
            android:id="@+id/hangup_button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Hangup" />

    </LinearLayout>

</androidx.constraintlayout.widget.ConstraintLayout>

```

## Create the main activity

With the layout created, you can add the logic to start a Room call. The activity handles requesting runtime permissions, creating the call agent, and placing the call when the button is pressed.

The `onCreate` method invokes `getAllPermissions` and `createAgent`, and adds the bindings for the call button. 

This event occurs only once when the activity is created. For more information about `onCreate`, see the guide [Understand the activity lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle).

Go to *MainActivity.kt* file, and replace the content with the following code:

```java
package com.contoso.roomscallquickstart

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.media.AudioManager
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.azure.android.communication.calling.Call
import com.azure.android.communication.calling.CallAgent
import com.azure.android.communication.calling.CallClient
import com.azure.android.communication.calling.HangUpOptions
import com.azure.android.communication.calling.JoinCallOptions
import com.azure.android.communication.calling.RoomCallLocator
import com.azure.android.communication.common.CommunicationTokenCredential
import java.util.concurrent.ExecutionException

class MainActivity : AppCompatActivity() {
    private val allPermissions = arrayOf(
        Manifest.permission.RECORD_AUDIO,
        Manifest.permission.CAMERA,
        Manifest.permission.READ_PHONE_STATE
    )

    private val userToken = "<ACS_USER_TOKEN>"
    private lateinit var callAgent: CallAgent
    private var call: Call? = null

    private lateinit var roleTextView: TextView
    private lateinit var statusView: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        getAllPermissions()
        createCallAgent()

        val callButton: Button = findViewById(R.id.call_button)
        callButton.setOnClickListener { startCall() }

        val hangupButton: Button = findViewById(R.id.hangup_button)
        hangupButton.setOnClickListener { endCall() }

        roleTextView = findViewById(R.id.text_role)
        statusView = findViewById(R.id.text_call_status)

        volumeControlStream = AudioManager.STREAM_VOICE_CALL
    }

    /**
     * Start a call
     */
    private fun startCall() {
        if (userToken.startsWith("<")) {
            Toast.makeText(this, "Please enter token in source code", Toast.LENGTH_SHORT).show()
            return
        }

        val roomIdView: EditText = findViewById(R.id.room_id)
        val roomId = roomIdView.text.toString()
        if (roomId.isEmpty()) {
            Toast.makeText(this, "Please enter room ID", Toast.LENGTH_SHORT).show()
            return
        }

        val joinCallOptions = JoinCallOptions()

        val roomCallLocator = RoomCallLocator(roomId)
        call = callAgent.join(applicationContext, roomCallLocator, joinCallOptions)
        
        call?.addOnStateChangedListener { setCallStatus(call?.state.toString()) }

        call?.addOnRoleChangedListener { setRoleText(call?.callParticipantRole.toString()) }
    }

    /**
     * Ends the call previously started
     */
    private fun endCall() {
        try {
            call?.hangUp(HangUpOptions())?.get()
        } catch (e: ExecutionException) {
            Toast.makeText(this, "Unable to hang up call", Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * Create the call callAgent
     */
    private fun createCallAgent() {
            try {
                val credential = CommunicationTokenCredential(userToken)
                callAgent = CallClient().createCallAgent(applicationContext, credential).get()
            } catch (ex: Exception) {
                Toast.makeText(
                    applicationContext,
                    "Failed to create call callAgent.",
                    Toast.LENGTH_SHORT
                ).show()
            }
    }

    /**
     * Request each required permission if the app doesn't already have it.
     */
    private fun getAllPermissions() {
        val permissionsToAskFor = mutableListOf<String>()
        for (permission in allPermissions) {
            if (ActivityCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                permissionsToAskFor.add(permission)
            }
        }
        if (permissionsToAskFor.isNotEmpty()) {
            ActivityCompat.requestPermissions(this, permissionsToAskFor.toTypedArray(), 1)
        }
    }

    /**
     * Ensure all permissions were granted, otherwise inform the user permissions are missing.
     */
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        var allPermissionsGranted = true
        for (result in grantResults) {
            allPermissionsGranted = allPermissionsGranted && (result == PackageManager.PERMISSION_GRANTED)
        }
        if (!allPermissionsGranted) {
            Toast.makeText(this, "All permissions are needed to make the call.", Toast.LENGTH_LONG).show()
            finish()
        }
    }

    @SuppressLint("SetTextI18n")
    private fun setCallStatus(status: String?) {
        runOnUiThread {
            statusView.text = "Call Status: $status"
        }
    }
    @SuppressLint("SetTextI18n")
    private fun setRoleText(role: String?) {
        runOnUiThread {
            roleTextView.text = "Role: $role"
        }
    }
}

```

> [!NOTE]
> When you're designing your app, consider when these permissions should be requested. Permissions should be requested as they are needed, not ahead of time. For more information, see, the [Android Permissions Guide](https://developer.android.com/training/permissions/requesting).


## Run your project
Before running your project, replace `<ACS_USER_TOKEN>` in  `MainActivity.kt` with your ACS User Access Token.

```
private val userToken = "<ACS_USER_TOKEN>"
```

Run the project on an emulator or a physical device.

You should see a field to enter your Room ID and a button to start the Room Call. Enter your Room ID and verify the Call status has changed along with your Role.


## Understanding joining a Room call

All the code that you have added in your QuickStart app allowed you to successfully start and join a room call. We need to dive deep into how it all works and what more methods/handlers you can access for Rooms.

Room calls are joined through `CallAgent` which is created with a valid user token:
```kotlin
private fun createCallAgent() {
    try {
        val credential = CommunicationTokenCredential(userToken)
        callAgent = CallClient().createCallAgent(applicationContext, credential).get()
    } catch (ex: Exception) {
        Toast.makeText(
            applicationContext,
            "Failed to create call callAgent.",
            Toast.LENGTH_SHORT
        ).show()
    }
}

```

Using `CallAgent` and `RoomCallLocator`, we can join a room call using the `CallAgent.join` method which returns a `Call` object:

```java
 val joinCallOptions = JoinCallOptions()
 val roomCallLocator = RoomCallLocator(roomId)
 call = callAgent.join(applicationContext, roomCallLocator, joinCallOptions)
        
```

Further customization beyond the `MainActivity.kt`file includes subscribing to `Call` events to get updates:

```Java
call.addOnRemoteParticipantsUpdatedListener { args: ParticipantsUpdatedEvent? ->
    handleRemoteParticipantsUpdate(
        args!!
    )
}

call.addOnStateChangedListener { args: PropertyChangedEvent? ->
    this.handleCallOnStateChanged(
        args!!
    )
}
```

You can extend `MainActivity.kt` further to display the role of the local or remote call participants by using these methods and handlers below.

```java
// Get your role in the call
call.getCallParticipantRole();

// Subscribe to changes for your role in a call
private void isCallRoleChanged(PropertyChangedEvent propertyChangedEvent) {
    // handle self-role change
}

call.addOnRoleChangedListener(isCallRoleChanged);

// Subscribe to role changes for remote participants
private void isRoleChanged(PropertyChangedEvent propertyChangedEvent) {
    // handle remote participant role change
}

remoteParticipant.addOnRoleChangedListener(isRoleChanged);

// Get role of the remote participant
remoteParticipant.getCallParticipantRole();
```

The ability to join a room call and display the roles of call participants is available in the Android Mobile Calling SDK version [2.4.0](https://search.maven.org/artifact/com.azure.android/azure-communication-calling/2.4.0/aar) and above.

You can learn more about roles of room call participants in the [rooms concept documentation](../../../concepts/rooms/room-concept.md#predefined-participant-roles-and-permissions).