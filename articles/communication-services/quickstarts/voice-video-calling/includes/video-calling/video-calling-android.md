---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/10/2021
ms.author: mikben
---

Get started with Azure Communication Services by using the Communication Services calling client library to add 1 on 1 video calling to your app. You'll learn how to start and answer a video call using the Azure Communication Services Calling SDK for Android.

## Sample Code

If you'd like to skip ahead to the end, you can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/videoCallingQuickstart).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Android Studio](https://developer.android.com/studio), for creating your Android application.
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md).
- A [User Access Token](../../../access-tokens.md) for your Azure Communication Service.

### Create an Android app with an empty activity

From Android Studio, select Start a new Android Studio project.

:::image type="content" source="../../media/android/studio-new-project.png" alt-text="Screenshot showing the 'Start a new Android Studio Project' button selected in Android Studio.":::

Select "Empty Activity" project template under "Phone and Tablet".

:::image type="content" source="../../media/android/studio-blank-activity.png" alt-text="Screenshot showing the 'Empty Activity' option selected in the Project Template Screen.":::

Select Minimum SDK of "API 26: Android 8.0 (Oreo)" or greater.

:::image type="content" source="../../media/android/studio-calling-min-api.png" alt-text="Screenshot showing the 'Empty Activity' option selected in the Project Template Screen 2.":::

### Install the package

Locate your project level `build.gradle` and make sure to add `mavenCentral()` to the list of repositories under `buildscript` and `allprojects`
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
Then, in your module level `build.gradle` add the following lines to the dependencies and android sections:

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
    implementation 'com.azure.android:azure-communication-calling:1.0.0'
    ...
}
```
### Add permissions to application manifest

In order to request permissions required to make a call, they must first be declared in the Application Manifest (`app/src/main/AndroidManifest.xml`). Replace the content of file with the following:

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

We need a text input for the callee ID, a button for placing the call and another for hanging up the call. We also need two buttons to turn on and turn off the local video. We need to place two containers for local and remote video streams. These can be added through the designer or by editing the layout xml. Navigate to `app/src/main/res/layout/activity_main.xml` and replace the content of file with the following:

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
                android:id="@+id/callee_id"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:ems="10"
                android:gravity="center"
                android:hint="Callee Id"
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
            <FrameLayout
                android:layout_width="match_parent"
                android:layout_height="match_parent">
                <LinearLayout
                    android:id="@+id/remotevideocontainer"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:gravity="end"
                    android:orientation="horizontal"
                    android:padding="10dp"></LinearLayout>
                <LinearLayout
                    android:id="@+id/localvideocontainer"
                    android:layout_width="180dp"
                    android:layout_height="320dp"
                    android:layout_gravity="right|bottom"
                    android:orientation="horizontal"
                    android:padding="10dp"></LinearLayout>

            </FrameLayout>
        </LinearLayout>
</androidx.constraintlayout.widget.ConstraintLayout>
```

### Create the main activity scaffolding and bindings

With the layout created the bindings can be added as well as the basic scaffolding of the activity. The activity will handle requesting runtime permissions, creating the call agent, and placing the call when the button is pressed. Each will be covered in its own section. The `onCreate` method will be overridden to invoke `getAllPermissions` and `createAgent` as well as add the bindings for the call button. This will occur only once when the activity is created. For more information on `onCreate`, see the guide [Understand the Activity Lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle).

Navigate to **MainActivity.java** and replace the content with the following code:

```java
package com.example.acsquickstart;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import android.widget.LinearLayout;
import android.content.Context;
import com.azure.android.communication.calling.CallState;
import com.azure.android.communication.calling.CallingCommunicationException;
import com.azure.android.communication.calling.CameraFacing;
import com.azure.android.communication.calling.PropertyChangedEvent;
import com.azure.android.communication.calling.VideoDeviceInfo;
import com.azure.android.communication.common.CommunicationUserIdentifier;
import com.azure.android.communication.common.CommunicationIdentifier;
import com.azure.android.communication.common.CommunicationTokenCredential;
import com.azure.android.communication.calling.CallAgent;
import com.azure.android.communication.calling.CallClient;
import com.azure.android.communication.calling.StartCallOptions;
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

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {

    private CallAgent callAgent;
    private LocalVideoStream currentVideoStream;
    private DeviceManager deviceManager;
    private IncomingCall incomingCall;
    private Call call;
    VideoStreamRenderer previewRenderer;
    VideoStreamRendererView preview;
    final Map<Integer, StreamData> streamData = new HashMap<>();
    private boolean renderRemoteVideo = true;

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

    /**
     * Handle incoming calls
     */
    private void handleIncomingCall() {
        // See section on answering incoming call
    }

    /**
     * Mid-call operations
     */
    public void turnOnLocalVideo() {
        // See setion on 
    }
    public void turnOffLocalVideo() {
        
    }

    /**
     * End calls
     */
    private void hangUp() {
        // See section on ending the call
    }    
}
```

### Request permissions at runtime

For Android 6.0 and higher (API level 23) and `targetSdkVersion` 23 or higher, permissions are granted at runtime instead of when the app is installed. In order to support this, `getAllPermissions` can be implemented to call `ActivityCompat.checkSelfPermission` and `ActivityCompat.requestPermissions` for each required permission.

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
> When designing your app, consider when these permissions should be requested. Permissions should be requested as they are needed, not ahead of time. For more information see the [Android Permissions Guide.](https://developer.android.com/training/permissions/requesting)

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| CallClient| The CallClient is the main entry point to the Calling SDK.|
| CallAgent | The CallAgent is used to start and manage calls. |
| CommunicationTokenCredential | The CommunicationTokenCredential is used as the token credential to instantiate the CallAgent.|
| CommunicationIdentifier | The CommunicationIdentifier is used as different type of participant that would could be part of a call.|

## Create an agent from the user access token

You will need a user token to create an authenticated call agent. Generally this token will be generated from a service with authentication specific to the application. For more information on user access tokens check the [User Access Tokens](../../../access-tokens.md) guide. 

For the quickstart, replace `<User_Access_Token>` with a user access token generated for your Azure Communication Service resource.

```java
/**
 * Create the call agent for placing calls
 */
private void createAgent() {
    Context context = this.getApplicationContext();
    String userToken = "<User_Access_Token>";
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
## Start a video call using the call agent

Placing the call can be done via the call agent, and just requires providing a list of callee IDs and the call options. 

To place a call with video you have to enumerate local cameras using the `deviceManager` `getCameras` API. Once you select a desired camera, use it to construct a `LocalVideoStream` instance and pass it into `videoOptions` as an item in the `localVideoStream` array to a call method. Once the call connects it'll automatically start sending a video stream from the selected camera to the other participant.

```java
private void startCall() {
    Context context = this.getApplicationContext();
    EditText calleeIdView = findViewById(R.id.callee_id);
    String calleeId = calleeIdView.getText().toString();
    ArrayList<CommunicationIdentifier> participants = new ArrayList<CommunicationIdentifier>();
    StartCallOptions options = new StartCallOptions();
    List<VideoDeviceInfo> cameras = deviceManager.getCameras();
    if(!cameras.isEmpty()) {
        VideoDeviceInfo camera = chooseCamera(cameras);
        currentVideoStream = new LocalVideoStream(camera, context);
        LocalVideoStream[] videoStreams = new LocalVideoStream[1];
        videoStreams[0] = currentVideoStream;
        VideoOptions videoOptions = new VideoOptions(videoStreams);
        options.setVideoOptions(videoOptions);
        showPreview(currentVideoStream);
    }
    participants.add(new CommunicationUserIdentifier(calleeId));

    call = callAgent.startCall(
            context,
            participants,
            options);
    
    //Subcribe to events on updates of call state and remote participants
    call.addOnRemoteParticipantsUpdatedListener(this::handleRemoteParticipantsUpdate);
    call.addOnStateChangedListener(this::handleCallOnStateChanged);
}
```

In this quickstart, we prefer using the front camera of the device. The function `chooseCamera` takes the enumeration of cameras as input. If the front camera is not available we will use the first camera available. If there is no available cameras when we tap `Start Call`, it will start an audio call. But if the remote participant answered with video we can still see the remote video stream. 

```java
VideoDeviceInfo chooseCamera(List<VideoDeviceInfo> cameras) {
    for (VideoDeviceInfo camera : cameras) {
        if (camera.getCameraFacing() == CameraFacing.FRONT) {
            return camera;
        }
    }
    return cameras.get(0);
}
```

Once we constructed a `LocalVideoStream` instance we can create a renderer to display it on the UI. 

```java
private void showPreview(LocalVideoStream stream) {
    previewRenderer = new VideoStreamRenderer(stream, this);
    LinearLayout layout = ((LinearLayout)findViewById(R.id.localvideocontainer));
    preview = previewRenderer.createView(new CreateViewOptions(ScalingMode.FIT));
    runOnUiThread(() -> {
        layout.addView(preview);
    });
}
```

## Accept an incoming call

The incoming call can be obtained by subscribe to the `addOnIncomingCallListener` on `callAgent`. 

```java
private void handleIncomingCall() {
    callAgent.addOnIncomingCallListener((incomingCall) -> {
        this.incomingCall = incomingCall;
        Executors.newCachedThreadPool().submit(this::answerIncomingCall);
    });
}
```

To accept a call with video camera on, enumerate local cameras using the deviceManager getCameras API, pick a camera and construct a `LocalVideoStream` instance and pass it into `acceptCallOptions` before calling the 'accept' method on a `call` object. 
```java
private void answerIncomingCall() {
    Context context = this.getApplicationContext();
    if (incomingCall == null){
        return;
    }
    AcceptCallOptions acceptCallOptions = new AcceptCallOptions();
    List<VideoDeviceInfo> cameras = deviceManager.getCameras();
    if(!cameras.isEmpty()) {
        VideoDeviceInfo camera = chooseCamera(cameras);
        currentVideoStream = new LocalVideoStream(camera, context);
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

    //Subcribe to events on updates of call state and remote participants
    call.addOnRemoteParticipantsUpdatedListener(this::handleRemoteParticipantsUpdate);
    call.addOnStateChangedListener(this::handleCallOnStateChanged);
}
```

## Remote participant and remote video streams

When we start a call or answer an incoming call we need to subscribe to `addOnRemoteParticipantsUpdatedListener` event to handle remote participants. 

```java
call.addOnRemoteParticipantsUpdatedListener(this::handleRemoteParticipantsUpdate);
```

### Remote participant and remote video stream update

In this quickstart we only handle added participants because we are implementing 1:1 calling. When the remote participant is removed the call will be ended. For added participant we subscribe to `addOnVideoStreamsUpdatedListener` to handle video stream updates. 

```java
public void handleRemoteParticipantsUpdate(ParticipantsUpdatedEvent args) {
    LinearLayout participantVideoContainer = findViewById(R.id.remotevideocontainer);
    handleAddedParticipants(args.getAddedParticipants(),participantVideoContainer);
}

private void handleAddedParticipants(List<RemoteParticipant> participants, LinearLayout participantVideoContainer) {
    for (RemoteParticipant remoteParticipant : participants) {
        remoteParticipant.addOnVideoStreamsUpdatedListener(videoStreamsEventArgs -> videoStreamsUpdated(videoStreamsEventArgs));
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
```

### Render remote videos

Create a renderer of remote video stream and attach it to the view to start rendering remote view. Dispose the view to stop rendering it. 

```java
void startRenderingVideo(StreamData data){
    if (data.renderer != null) {
        return;
    }
    LinearLayout layout = ((LinearLayout)findViewById(R.id.remotevideocontainer));
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
    runOnUiThread(() -> {
        layout.addView(data.rendererView);
    });
}

void stopRenderingVideo(RemoteVideoStream stream) {
    StreamData data = streamData.get(stream.getId());
    if (data == null || data.renderer == null) {
        return;
    }
    runOnUiThread(() -> {
        ((LinearLayout) findViewById(R.id.remotevideocontainer)).removeAllViews();
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
In this quickstart we will handle the changes of `CallState`. When the call is connected we handle the remote participant and when the call is disconnected we dispose the `previewRenderer` to stop local video. 

```groovy
private void handleCallOnStateChanged(PropertyChangedEvent args) {
    if (call.getState() == CallState.CONNECTED) {
        LinearLayout participantVideoContainer = findViewById(R.id.remotevideocontainer);
        handleAddedParticipants(call.getRemoteParticipants(),participantVideoContainer);
    }
    if (call.getState() == CallState.DISCONNECTED) {
        if (previewRenderer != null) {
            previewRenderer.dispose();
        }
    }
}
```

## End a call
End the call by calling the `hangUp()` function on call instance and dispose the `previewRenderer` to stop local video. 
```java
private void hangUp() {
    try {
        call.hangUp().get();
    } catch (ExecutionException | InterruptedException e) {
        e.printStackTrace();
    }
    if (previewRenderer != null) {
        previewRenderer.dispose();
    }
}
```

## Run the code

The app can now be launched using the `Run 'App'` button on the toolbar of Android Studio. 
