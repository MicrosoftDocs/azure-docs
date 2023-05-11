---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/10/2021
ms.author: rifox
---

Get started with Azure Communication Services by using the Communication Services calling client library to add video calling to your app. Learn how to include 1:1 video calling, and how to create or join group calls. Additionally, you can start, answer, and join a video call by using the Azure Communication Services Calling SDK for Android.

If you want to get started with sample code, you can [download the sample app](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/videoCallingQuickstart).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Android Studio](https://developer.android.com/studio), for creating your Android application.
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You need to **record your connection string** for this quickstart.
- A [User Access Token](../../../identity/access-tokens.md) for your Azure Communication Service. You can also use the Azure CLI and run the command with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../../identity/access-tokens.md?pivots=platform-azcli).

## Create an Android app with an empty activity

From Android Studio, select **Start a new Android Studio project**.

:::image type="content" source="../../media/android/studio-new-project.png" alt-text="Screenshot showing the Start a new Android Studio Project button selected in Android Studio.":::

Under **Phone and Tablet**, select the **Empty Activity** project template.

:::image type="content" source="../../media/android/studio-blank-activity.png" alt-text="Screenshot showing the Empty Activity option selected in the Project Template Screen.":::

For the **Minimum SDK**, select **API 26: Android 8.0 (Oreo)**, or later. [See SDK support versions](../../../../concepts/voice-video-calling/calling-sdk-features.md?#android-calling-sdk-support).

:::image type="content" source="../../media/android/studio-calling-min-api.png" alt-text="Screenshot showing the API option selected.":::

## Install the package

Locate your project level `build.gradle`, and add `mavenCentral()` to the list of repositories under `buildscript` and `allprojects`

```groovy
buildscript {
    repositories {
    ...
        mavenCentral()
    ...
    }
}
```

```groovy
allprojects {
    repositories {
    ...
        mavenCentral()
    ...
    }
}
```

Then, in your module level `build.gradle`, add the following lines to the `dependencies` and `android` sections:

```groovy
android {
    ...
    packagingOptions {
        pickFirst  'META-INF/*'
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    ...
    implementation 'com.azure.android:azure-communication-calling:2.0.0'
    ...
}
```

## Add permissions to application manifest

To request permissions required to make a call, you must first declare the permissions in the application manifest (`app/src/main/AndroidManifest.xml`). Replace the content of file with the following code:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.contoso.acsquickstart">

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

You need a text input for the callee ID or group call ID, a button for placing the call, and extra button for hanging up the call.

Also need two buttons to turn on and turn off the local video. You need to place two containers for local and remote video streams. You can add these buttons through the designer, or by editing the layout XML.

Go to *app/src/main/res/layout/activity_main.xml*, and replace the content of file with the following code:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">

        <EditText
            android:id="@+id/call_id"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:ems="10"
            android:gravity="center"
            android:hint="Callee ID"
            android:inputType="textPersonName"
            app:layout_constraintBottom_toTopOf="@+id/call_button"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent"
            app:layout_constraintVertical_bias="0.064" />
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content">
            <Button
                android:id="@+id/call_button"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginBottom="16dp"
                android:gravity="center"
                android:text="Call"
                app:layout_constraintBottom_toBottomOf="parent"
                app:layout_constraintEnd_toEndOf="parent"
                app:layout_constraintStart_toStartOf="parent" />
            <Button
                android:id="@+id/show_preview"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginBottom="16dp"
                android:gravity="center"
                android:text="Show Video"
                app:layout_constraintBottom_toBottomOf="parent"
                app:layout_constraintEnd_toEndOf="parent"
                app:layout_constraintStart_toStartOf="parent" />
            <Button
                android:id="@+id/hide_preview"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginBottom="16dp"
                android:gravity="center"
                android:text="Hide Video"
                app:layout_constraintBottom_toBottomOf="parent"
                app:layout_constraintEnd_toEndOf="parent"
                app:layout_constraintStart_toStartOf="parent" />
            <Button
                android:id="@+id/hang_up"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginBottom="16dp"
                android:gravity="center"
                android:text="Hang Up"
                app:layout_constraintBottom_toBottomOf="parent"
                app:layout_constraintEnd_toEndOf="parent"
                app:layout_constraintStart_toStartOf="parent" />
        </LinearLayout>
        <ScrollView
            android:layout_width="match_parent"
            android:layout_height="wrap_content">
            <GridLayout
                android:id="@+id/remotevideocontainer"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:columnCount="2"
                android:rowCount="2"
                android:padding="10dp"></GridLayout>
        </ScrollView>
    </LinearLayout>
    <FrameLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">
        <LinearLayout
            android:id="@+id/localvideocontainer"
            android:layout_width="180dp"
            android:layout_height="300dp"
            android:layout_gravity="right|bottom"
            android:orientation="vertical"
            android:padding="10dp">
            <Button
                android:id="@+id/switch_source"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:gravity="center"
                android:text="Switch Source"
                android:visibility="invisible" />
        </LinearLayout>

    </FrameLayout>
</androidx.constraintlayout.widget.ConstraintLayout>
```

## Create the main activity scaffolding and bindings

With the layout created, you can add the bindings, and the basic scaffolding of the activity. The activity handles requesting runtime permissions, creating the call agent, and placing the call when the button is pressed.

The `onCreate` method is overridden to invoke `getAllPermissions` and `createAgent`, and add the bindings for the call button. This event occurs only once when the activity is created. For more information about `onCreate`, see the guide [Understand the activity lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle).

Go to *MainActivity.java* file, and replace the content with the following code:

```java
package com.example.videocallingquickstart;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.GridLayout;
import android.widget.Toast;
import android.widget.LinearLayout;
import android.content.Context;
import com.azure.android.communication.calling.CallState;
import com.azure.android.communication.calling.CallingCommunicationException;
import com.azure.android.communication.calling.ParticipantsUpdatedListener;
import com.azure.android.communication.calling.PropertyChangedEvent;
import com.azure.android.communication.calling.PropertyChangedListener;
import com.azure.android.communication.calling.StartCallOptions;
import com.azure.android.communication.calling.VideoDeviceInfo;
import com.azure.android.communication.common.CommunicationIdentifier;
import com.azure.android.communication.common.CommunicationTokenCredential;
import com.azure.android.communication.calling.CallAgent;
import com.azure.android.communication.calling.CallClient;
import com.azure.android.communication.calling.DeviceManager;
import com.azure.android.communication.calling.VideoOptions;
import com.azure.android.communication.calling.LocalVideoStream;
import com.azure.android.communication.calling.VideoStreamRenderer;
import com.azure.android.communication.calling.VideoStreamRendererView;
import com.azure.android.communication.calling.CreateViewOptions;
import com.azure.android.communication.calling.ScalingMode;
import com.azure.android.communication.calling.IncomingCall;
import com.azure.android.communication.calling.Call;
import com.azure.android.communication.calling.AcceptCallOptions;
import com.azure.android.communication.calling.ParticipantsUpdatedEvent;
import com.azure.android.communication.calling.RemoteParticipant;
import com.azure.android.communication.calling.RemoteVideoStream;
import com.azure.android.communication.calling.RemoteVideoStreamsEvent;
import com.azure.android.communication.calling.RendererListener;
import com.azure.android.communication.common.CommunicationUserIdentifier;
import com.azure.android.communication.common.MicrosoftTeamsUserIdentifier;
import com.azure.android.communication.common.PhoneNumberIdentifier;
import com.azure.android.communication.common.UnknownIdentifier;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {

    private CallAgent callAgent;
    private VideoDeviceInfo currentCamera;
    private LocalVideoStream currentVideoStream;
    private DeviceManager deviceManager;
    private IncomingCall incomingCall;
    private Call call;
    VideoStreamRenderer previewRenderer;
    VideoStreamRendererView preview;
    final Map<Integer, StreamData> streamData = new HashMap<>();
    private boolean renderRemoteVideo = true;
    private ParticipantsUpdatedListener remoteParticipantUpdatedListener;
    private PropertyChangedListener onStateChangedListener;

    final HashSet<String> joinedParticipants = new HashSet<>();

    Button switchSourceButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        getAllPermissions();
        createAgent();

        handleIncomingCall();

        Button callButton = findViewById(R.id.call_button);
        callButton.setOnClickListener(l -> startCall());
        Button hangupButton = findViewById(R.id.hang_up);
        hangupButton.setOnClickListener(l -> hangUp());
        Button startVideo = findViewById(R.id.show_preview);
        startVideo.setOnClickListener(l -> turnOnLocalVideo());
        Button stopVideo = findViewById(R.id.hide_preview);
        stopVideo.setOnClickListener(l -> turnOffLocalVideo());

        switchSourceButton = findViewById(R.id.switch_source);
        switchSourceButton.setOnClickListener(l -> switchSource());

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
     * Handle incoming calls
     */
    private void handleIncomingCall() {
        // See section on answering incoming call
    }
	
	/**
     * Place a call to the callee id provided in `callee_id` text input.
     */
    private void startCall() {
        // See section on starting the call
    }

    /**
     * End calls
     */
    private void hangUp() {
        // See section on ending the call
    }
	
	/**
     * Mid-call operations
     */
    public void turnOnLocalVideo() {
        // See section
    }
	
    public void turnOffLocalVideo() {
        // See section
    }
	
	/**
     * Change the active camera for the next available
     */
	public void switchSource() {
		// See section
    }
}
```

## Request permissions at runtime

For Android 6.0 and later (API level 23), and `targetSdkVersion` 23 or later, permissions are granted at runtime instead of when the app is installed. In order to support it, `getAllPermissions` can be implemented to call `ActivityCompat.checkSelfPermission` and `ActivityCompat.requestPermissions` for each required permission.

```java
/**
 * Request each required permission if the app doesn't already have it.
 */
private void getAllPermissions() {
    String[] requiredPermissions = new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_PHONE_STATE};
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
> When you're designing your app, consider when these permissions should be requested. Permissions should be requested as they are needed, not ahead of time. For more information, see, the [Android Permissions Guide](https://developer.android.com/training/permissions/requesting).

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `CallClient`| The main entry point to the Calling SDK.|
| `CallAgent` | Used to start and manage calls. |
| `CommunicationTokenCredential` | Used as the token credential to instantiate the `CallAgent`.|
| `CommunicationIdentifier` | Used as a different type of participant that might be part of a call.|

## Create an agent from the user access token

You need a user token to create an authenticated call agent. Generally, this token is generated from a service with authentication specific to the application. For more information on user access tokens, see [User access tokens](../../../identity/access-tokens.md). 

For the quickstart, replace `<User_Access_Token>` with a user access token generated for your Azure Communication Services resource.

```java
/**
 * Create the call agent for placing calls
 */
private void createAgent() {
    Context context = this.getApplicationContext();
    String userToken = "<USER_ACCESS_TOKEN>";
    try {
        CommunicationTokenCredential credential = new CommunicationTokenCredential(userToken);
        CallClient callClient = new CallClient();
        deviceManager = callClient.getDeviceManager(context).get();
        callAgent = callClient.createCallAgent(getApplicationContext(), credential).get(); 
    } catch (Exception ex) {
        Toast.makeText(context, "Failed to create call agent.", Toast.LENGTH_SHORT).show();
    }
}
```

## Start a video call by using the call agent

You can place the call by using the call agent. All you need to do is provide a list of callee IDs and the call options. 

To place a call with video, you have to enumerate local cameras by using the `deviceManager` `getCameras` API. After you select a desired camera, use it to construct a `LocalVideoStream` instance. Then pass it into `videoOptions` as an item in the `localVideoStream` array to a call method. When the call connects, it automatically starts sending a video stream from the selected camera to the other participant.

```java
private void startCall() {
    Context context = this.getApplicationContext();
    EditText callIdView = findViewById(R.id.call_id);
    String callId = callIdView.getText().toString();
    ArrayList<CommunicationIdentifier> participants = new ArrayList<CommunicationIdentifier>();
    List<VideoDeviceInfo> cameras = deviceManager.getCameras();


    StartCallOptions options = new StartCallOptions();
    if(!cameras.isEmpty()) {
        currentCamera = getNextAvailableCamera(null);
        currentVideoStream = new LocalVideoStream(currentCamera, context);
        LocalVideoStream[] videoStreams = new LocalVideoStream[1];
        videoStreams[0] = currentVideoStream;
        VideoOptions videoOptions = new VideoOptions(videoStreams);
        options.setVideoOptions(videoOptions);
        showPreview(currentVideoStream);
    }
    participants.add(new CommunicationUserIdentifier(callId));

    call = callAgent.startCall(
            context,
            participants,
            options);

    //Subscribe to events on updates of call state and remote participants
    remoteParticipantUpdatedListener = this::handleRemoteParticipantsUpdate;
    onStateChangedListener = this::handleCallOnStateChanged;
    call.addOnRemoteParticipantsUpdatedListener(remoteParticipantUpdatedListener);
    call.addOnStateChangedListener(onStateChangedListener);
}
```

In this quickstart, you rely on the function `getNextAvailableCamera` to pick the camera that the call uses. The function takes the enumeration of cameras as input, and iterates through the list to get the next camera available. If the argument is `null`, the function picks the first device on the list. If there are no available cameras when you select **Start Call**, an audio call starts instead. But if the remote participant answered with video, you can still see the remote video stream.

```java
private VideoDeviceInfo getNextAvailableCamera(VideoDeviceInfo camera) {
    List<VideoDeviceInfo> cameras = deviceManager.getCameras();
    int currentIndex = 0;
    if (camera == null) {
        return cameras.isEmpty() ? null : cameras.get(0);
    }

    for (int i = 0; i < cameras.size(); i++) {
        if (camera.getId().equals(cameras.get(i).getId())) {
            currentIndex = i;
            break;
        }
    }
    int newIndex = (currentIndex + 1) % cameras.size();
    return cameras.get(newIndex);
}
```

After you construct a `LocalVideoStream` instance, you can create a renderer to display it on the UI. 

```java
private void showPreview(LocalVideoStream stream) {
        previewRenderer = new VideoStreamRenderer(stream, this);
        LinearLayout layout = findViewById(R.id.localvideocontainer);
        preview = previewRenderer.createView(new CreateViewOptions(ScalingMode.FIT));
        preview.setTag(0);
        runOnUiThread(() -> {
            layout.addView(preview);
            switchSourceButton.setVisibility(View.VISIBLE);
        });
    }
```

To allow the user to toggle the local video source, use `switchSource`. This method picks the next available camera and defines it as the local stream.

```java
public void switchSource() {
    if (currentVideoStream != null) {
        try {
            currentCamera = getNextAvailableCamera(currentCamera);
            currentVideoStream.switchSource(currentCamera).get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```

## Accept an incoming call

You can obtain an incoming call by subscribing to `addOnIncomingCallListener` on `callAgent`. 

```java
private void handleIncomingCall() {
    callAgent.addOnIncomingCallListener((incomingCall) -> {
        this.incomingCall = incomingCall;
        Executors.newCachedThreadPool().submit(this::answerIncomingCall);
    });
}
```

To accept a call with the video camera on, enumerate the local cameras by using the `deviceManager` `getCameras` API. Pick a camera, and construct a `LocalVideoStream` instance. Pass it into `acceptCallOptions` before calling the `accept` method on a `call` object. 

```java
private void answerIncomingCall() {
    Context context = this.getApplicationContext();
    if (incomingCall == null){
        return;
    }
    AcceptCallOptions acceptCallOptions = new AcceptCallOptions();
    List<VideoDeviceInfo> cameras = deviceManager.getCameras();
    if(!cameras.isEmpty()) {
        currentCamera = getNextAvailableCamera(null);
        currentVideoStream = new LocalVideoStream(currentCamera, context);
        LocalVideoStream[] videoStreams = new LocalVideoStream[1];
        videoStreams[0] = currentVideoStream;
        VideoOptions videoOptions = new VideoOptions(videoStreams);
        acceptCallOptions.setVideoOptions(videoOptions);
        showPreview(currentVideoStream);
    }
    try {
        call = incomingCall.accept(context, acceptCallOptions).get();
    } catch (InterruptedException e) {
        e.printStackTrace();
    } catch (ExecutionException e) {
        e.printStackTrace();
    }

    //Subscribe to events on updates of call state and remote participants
    remoteParticipantUpdatedListener = this::handleRemoteParticipantsUpdate;
    onStateChangedListener = this::handleCallOnStateChanged;
    call.addOnRemoteParticipantsUpdatedListener(remoteParticipantUpdatedListener);
    call.addOnStateChangedListener(onStateChangedListener);
}
```

## Remote participant and remote video streams

When you start a call or answer an incoming call, you need to subscribe to the `addOnRemoteParticipantsUpdatedListener` event to handle remote participants. 

```java
remoteParticipantUpdatedListener = this::handleRemoteParticipantsUpdate;
call.addOnRemoteParticipantsUpdatedListener(remoteParticipantUpdatedListener);
```

When you use event listeners that are defined within the same class, bind the listener to a variable. Pass the variable in as an argument to add and remove listener methods.

If you try to pass the listener in directly as an argument, you lose the reference to that listener. Java creates new instances of these listeners, not referencing previously created ones. You can't remove prior instances, because you don’t have a reference to them.

### Remote video stream updates

For 1:1 calling, you need to handle added participants. When you remove the remote participant, the call ends. For added participants, you subscribe to `addOnVideoStreamsUpdatedListener` to handle video stream updates.

```java
public void handleRemoteParticipantsUpdate(ParticipantsUpdatedEvent args) {
    handleAddedParticipants(args.getAddedParticipants());
}

private void handleAddedParticipants(List<RemoteParticipant> participants) {
    for (RemoteParticipant remoteParticipant : participants) {
        if(!joinedParticipants.contains(getId(remoteParticipant))) {
            joinedParticipants.add(getId(remoteParticipant));

            if (renderRemoteVideo) {
                for (RemoteVideoStream stream : remoteParticipant.getVideoStreams()) {
                    StreamData data = new StreamData(stream, null, null);
                    streamData.put(stream.getId(), data);
                    startRenderingVideo(data);
                }
            }
            remoteParticipant.addOnVideoStreamsUpdatedListener(videoStreamsEventArgs -> videoStreamsUpdated(videoStreamsEventArgs));
        }
    }
}

private void videoStreamsUpdated(RemoteVideoStreamsEvent videoStreamsEventArgs) {
    for(RemoteVideoStream stream : videoStreamsEventArgs.getAddedRemoteVideoStreams()) {
        StreamData data = new StreamData(stream, null, null);
        streamData.put(stream.getId(), data);
        if (renderRemoteVideo) {
            startRenderingVideo(data);
        }
    }

    for(RemoteVideoStream stream : videoStreamsEventArgs.getRemovedRemoteVideoStreams()) {
        stopRenderingVideo(stream);
    }
}


public String getId(final RemoteParticipant remoteParticipant) {
    final CommunicationIdentifier identifier = remoteParticipant.getIdentifier();
    if (identifier instanceof PhoneNumberIdentifier) {
        return ((PhoneNumberIdentifier) identifier).getPhoneNumber();
    } else if (identifier instanceof MicrosoftTeamsUserIdentifier) {
        return ((MicrosoftTeamsUserIdentifier) identifier).getUserId();
    } else if (identifier instanceof CommunicationUserIdentifier) {
        return ((CommunicationUserIdentifier) identifier).getId();
    } else {
        return ((UnknownIdentifier) identifier).getId();
    }
}

```

### Render remote videos

Create a renderer of the remote video stream, and attach it to the view to start rendering the remote view. Dispose of the view to stop rendering it. 

```java
void startRenderingVideo(StreamData data){
    if (data.renderer != null) {
        return;
    }
    GridLayout layout = ((GridLayout)findViewById(R.id.remotevideocontainer));
    data.renderer = new VideoStreamRenderer(data.stream, this);
    data.renderer.addRendererListener(new RendererListener() {
        @Override
        public void onFirstFrameRendered() {
            String text = data.renderer.getSize().toString();
            Log.i("MainActivity", "Video rendering at: " + text);
        }

        @Override
        public void onRendererFailedToStart() {
            String text = "Video failed to render";
            Log.i("MainActivity", text);
        }
    });
    data.rendererView = data.renderer.createView(new CreateViewOptions(ScalingMode.FIT));
    data.rendererView.setTag(data.stream.getId());
    runOnUiThread(() -> {
        GridLayout.LayoutParams params = new GridLayout.LayoutParams(layout.getLayoutParams());
        DisplayMetrics displayMetrics = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
        params.height = (int)(displayMetrics.heightPixels / 2.5);
        params.width = displayMetrics.widthPixels / 2;
        layout.addView(data.rendererView, params);
    });
}

void stopRenderingVideo(RemoteVideoStream stream) {
    StreamData data = streamData.get(stream.getId());
    if (data == null || data.renderer == null) {
        return;
    }
    runOnUiThread(() -> {
        GridLayout layout = findViewById(R.id.remotevideocontainer);
        for(int i = 0; i < layout.getChildCount(); ++ i) {
            View childView =  layout.getChildAt(i);
            if ((int)childView.getTag() == data.stream.getId()) {
                layout.removeViewAt(i);
            }
        }
    });
    data.rendererView = null;
    // Dispose renderer
    data.renderer.dispose();
    data.renderer = null;
}

static class StreamData {
    RemoteVideoStream stream;
    VideoStreamRenderer renderer;
    VideoStreamRendererView rendererView;
    StreamData(RemoteVideoStream stream, VideoStreamRenderer renderer, VideoStreamRendererView rendererView) {
        this.stream = stream;
        this.renderer = renderer;
        this.rendererView = rendererView;
    }
}
```

## Call state update

The state of a call can change from connected to disconnected. When the call is connected, you handle the remote participant, and when the call is disconnected, you dispose of `previewRenderer` to stop local video. 

```groovy
private void handleCallOnStateChanged(PropertyChangedEvent args) {
        if (call.getState() == CallState.CONNECTED) {
            runOnUiThread(() -> Toast.makeText(this, "Call is CONNECTED", Toast.LENGTH_SHORT).show());
            handleCallState();
        }
        if (call.getState() == CallState.DISCONNECTED) {
            runOnUiThread(() -> Toast.makeText(this, "Call is DISCONNECTED", Toast.LENGTH_SHORT).show());
            if (previewRenderer != null) {
                previewRenderer.dispose();
            }
            switchSourceButton.setVisibility(View.INVISIBLE);
        }
    }
```

## End a call

End the call by calling the `hangUp()` function on the call instance. Dispose of `previewRenderer` to stop local video. 

```java
private void hangUp() {
    try {
        call.hangUp().get();
        switchSourceButton.setVisibility(View.INVISIBLE);
    } catch (ExecutionException | InterruptedException e) {
        e.printStackTrace();
    }
    if (previewRenderer != null) {
        previewRenderer.dispose();
    }
}
```

## Hide and show local video

When the call has started, you can stop local video rendering and streaming with `turnOffLocalVideo()`, this method removes the view that wraps the local render, and disposes of the current stream. To resume the stream and render the local preview again, use `turnOnLocalVideo()`, this method shows the video preview and starts streaming.

```java
public void turnOnLocalVideo() {
    List<VideoDeviceInfo> cameras = deviceManager.getCameras();
    if(!cameras.isEmpty()) {
        try {
            currentVideoStream = new LocalVideoStream(currentCamera, this);
            showPreview(currentVideoStream);
            call.startVideo(this, currentVideoStream).get();
            switchSourceButton.setVisibility(View.VISIBLE);
        } catch (CallingCommunicationException acsException) {
            acsException.printStackTrace();
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}

public void turnOffLocalVideo() {
    try {
        LinearLayout container = findViewById(R.id.localvideocontainer);
        for (int i = 0; i < container.getChildCount(); ++i) {
            Object tag = container.getChildAt(i).getTag();
            if (tag != null && (int)tag == 0) {
                container.removeViewAt(i);
            }
        }
        switchSourceButton.setVisibility(View.INVISIBLE);
        previewRenderer.dispose();
        previewRenderer = null;
        call.stopVideo(this, currentVideoStream).get();
    } catch (CallingCommunicationException acsException) {
        acsException.printStackTrace();
    } catch (ExecutionException | InterruptedException e) {
        e.printStackTrace();
    }
}
```

## Run the code

You can now launch the app by using the **Run App** button on the toolbar of Android Studio. 

Completed application             |  1:1 call
:-------------------------:|:-------------------------:
:::image type="content" source="../../media/android/video-quickstart-1-1-screen.png" alt-text="Screenshot showing the completed application.":::  |  :::image type="content" source="../../media/android/video-quickstart-1-1-call.png" alt-text="Screenshot showing the application on a call.":::

## Add group call capability

Now you can update your app to let the user choose between 1:1 calls or group calls.

### Update layout

Use radio buttons to select if the SDK creates a 1:1 call or joins a group call. The radio buttons are at the top, so the first section of *app/src/main/res/layout/activity_main.xml* end as follows.

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">

        <RadioGroup
            android:layout_width="match_parent"
            android:layout_height="wrap_content">

            <RadioButton
                android:id="@+id/one_to_one_call"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="One to one call" />

            <RadioButton
                android:id="@+id/group_call"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Group call" />

        </RadioGroup>

        <EditText
            android:id="@+id/call_id"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:ems="10"
            android:gravity="center"
            android:hint="Callee ID"
            android:inputType="textPersonName"
            app:layout_constraintBottom_toTopOf="@+id/call_button"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent"
            app:layout_constraintVertical_bias="0.064" />
.
.
.
</androidx.constraintlayout.widget.ConstraintLayout>
```

### Update MainActivity.Java

You can now update the elements and logic to decide when to create a 1:1 call, and when to join a group call. The first portion of code requires updates to add dependencies, items, and other configurations.

Dependencies:

```java
import android.widget.RadioButton;
import com.azure.android.communication.calling.GroupCallLocator;
import com.azure.android.communication.calling.JoinCallOptions;
import java.util.UUID;
```

Global elements:

```java
RadioButton oneToOneCall, groupCall;
```

Update `onCreate()`:

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    getAllPermissions();
    createAgent();

    handleIncomingCall();

    Button callButton = findViewById(R.id.call_button);
    callButton.setOnClickListener(l -> startCall());
    Button hangupButton = findViewById(R.id.hang_up);
    hangupButton.setOnClickListener(l -> hangUp());
    Button startVideo = findViewById(R.id.show_preview);
    startVideo.setOnClickListener(l -> turnOnLocalVideo());
    Button stopVideo = findViewById(R.id.hide_preview);
    stopVideo.setOnClickListener(l -> turnOffLocalVideo());

    switchSourceButton = findViewById(R.id.switch_source);
    switchSourceButton.setOnClickListener(l -> switchSource());

    setVolumeControlStream(AudioManager.STREAM_VOICE_CALL);

    oneToOneCall = findViewById(R.id.one_to_one_call);
    oneToOneCall.setOnClickListener(this::onCallTypeSelected);
    oneToOneCall.setChecked(true);
    groupCall = findViewById(R.id.group_call);
    groupCall.setOnClickListener(this::onCallTypeSelected);

}
```

Update `startCall()`:

```java
private void startCall() {
        Context context = this.getApplicationContext();
        EditText callIdView = findViewById(R.id.call_id);
        String callId = callIdView.getText().toString();
        ArrayList<CommunicationIdentifier> participants = new ArrayList<CommunicationIdentifier>();
        List<VideoDeviceInfo> cameras = deviceManager.getCameras();


        if(oneToOneCall.isChecked()){
        StartCallOptions options = new StartCallOptions();
        if(!cameras.isEmpty()) {
            currentCamera = getNextAvailableCamera(null);
            currentVideoStream = new LocalVideoStream(currentCamera, context);
            LocalVideoStream[] videoStreams = new LocalVideoStream[1];
            videoStreams[0] = currentVideoStream;
            VideoOptions videoOptions = new VideoOptions(videoStreams);
            options.setVideoOptions(videoOptions);
            showPreview(currentVideoStream);
        }
        participants.add(new CommunicationUserIdentifier(callId));

        call = callAgent.startCall(
                context,
                participants,
                options);
        }
        else{

            JoinCallOptions options = new JoinCallOptions();
            if(!cameras.isEmpty()) {
                currentCamera = getNextAvailableCamera(null);
                currentVideoStream = new LocalVideoStream(currentCamera, context);
                LocalVideoStream[] videoStreams = new LocalVideoStream[1];
                videoStreams[0] = currentVideoStream;
                VideoOptions videoOptions = new VideoOptions(videoStreams);
                options.setVideoOptions(videoOptions);
                showPreview(currentVideoStream);
            }
            GroupCallLocator groupCallLocator = new GroupCallLocator(UUID.fromString(callId));

            call = callAgent.join(
                    context,
                    groupCallLocator,
                    options);
        }



        remoteParticipantUpdatedListener = this::handleRemoteParticipantsUpdate;
        onStateChangedListener = this::handleCallOnStateChanged;
        call.addOnRemoteParticipantsUpdatedListener(remoteParticipantUpdatedListener);
        call.addOnStateChangedListener(onStateChangedListener);
    }
```

Add `onCallTypeSelected()`:

```java
public void onCallTypeSelected(View view) {
    boolean checked = ((RadioButton) view).isChecked();
    EditText callIdView = findViewById(R.id.call_id);

    switch(view.getId()) {
        case R.id.one_to_one_call:
            if (checked){
                callIdView.setHint("Callee id");
            }
            break;
        case R.id.group_call:
            if (checked){
                callIdView.setHint("Group Call GUID");
            }
            break;
    }
}
```

## Run the upgraded app

At this point, you can launch the app by using the **Run App** button on the toolbar of Android Studio. 

Screen update             |  Group call
:-------------------------:|:-------------------------:
:::image type="content" source="../../media/android/video-quickstart-groupcall-screen-update.png" alt-text="Screenshot showing the application updated.":::  |  :::image type="content" source="../../media/android/video-quickstart-groupcall.png" alt-text="Screenshot showing the application on a group call.":::
