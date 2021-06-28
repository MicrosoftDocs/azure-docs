---
title: Using the Azure Communication Services Teams Embed for Android
description: In this overview, you will learn how to use the Azure Communication Services Teams Embed library for Android.
author: palatter
ms.author: palatter
ms.date: 24/02/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../access-tokens.md)
- Complete the quickstart for [getting started with adding Teams Embed to your application](../getting-started-with-teams-embed.md)

## Teams Embed Events

Add the following code to your `MainActivity.java`.

```java
import androidx.core.content.ContextCompat;
import com.azure.android.communication.common.CommunicationTokenCredential;
import com.azure.android.communication.common.CommunicationTokenRefreshOptions;
import com.azure.android.communication.ui.meetings.MeetingUIClient;
import com.azure.android.communication.ui.meetings.MeetingUIClientCall;
import com.azure.android.communication.ui.meetings.MeetingUIClientCallState;
import com.azure.android.communication.ui.meetings.MeetingUIClientCallEventListener;
import com.azure.android.communication.ui.meetings.MeetingUIClientCallIdentityProvider;
import com.azure.android.communication.ui.meetings.MeetingUIClientCallIdentityProviderCallback;
import com.azure.android.communication.ui.meetings.MeetingUIClientCallUserEventListener;
import com.azure.android.communication.ui.meetings.MeetingUIClientGroupCallLocator;
import com.azure.android.communication.ui.meetings.MeetingUIClientIconType;
import com.azure.android.communication.ui.meetings.MeetingUIClientJoinOptions;
import com.azure.android.communication.ui.meetings.MeetingUIClientTeamsMeetingLinkLocator;
```

Add the `MeetingUIClientCallEventListener` to your class.

```java
public class MainActivity extends AppCompatActivity implements MeetingUIClientEventListener {
```

Call `setMeetingUIClientCallEventListener` with parameter `this` after joining the call or meeting has started successfully.

```java
private void joinMeeting() {
    getAllPermissions();
    MeetingUIClient meetingUIClient = createMeetingUIClient();

    MeetingUIClientTeamsMeetingLinkLocator meetingUIClientTeamsMeetingLinkLocator = new MeetingUIClientTeamsMeetingLinkLocator(<MEETING_URL>);
    
    MeetingUIClientJoinOptions meetingJoinOptions = new MeetingUIClientJoinOptions(displayName, false);
    
    try {
        MeetingUIClientCall meetingUIClientCall = meetingUIClient.join(meetingUIClientTeamsMeetingLinkLocator, meetingJoinOptions);
        meetingUIClientCall.setMeetingUIClientCallEventListener(this);
    } catch (Exception ex) {
        Toast.makeText(getApplicationContext(), "Failed to join meeting: " + ex.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
```

Implement `MeetingUIClientCallEventListener` methods that your app needs and add stubs for ones that are not needed.

```java
@Override
public void onCallStateChanged(MeetingUIClientCallState callState) {
    switch(callState) {
        case CONNECTING:
            System.out.println("Call state changed to Connecting");
            break;
        case CONNECTED:
            System.out.println("Call state changed to Connected");
            break;
        case WAITING_IN_LOBBY:
            System.out.println("Call state changed to Waiting in Lobby");
            break;
        case ENDED:
            System.out.println("Call state changed to Ended");
            break;
    }
}

@Override
public void onRemoteParticipantCountChanged(int newCount) {
    System.out.println("Remote participant count changed: " + newCount);
}

@Override
public void onIsMutedChanged() {
}

@Override
public void onIsSendingVideoChanged() {
}

@Override
public void onIsHandRaisedChanged(List<String> participantIds) {
}
```

## Bring your own identity from the app to the participants in the SDK call.

The app can assign its users identity values to the participants in the call or meeting and override the default values. The values include avatar, name, subtitle, and role.  

### Assigning avatars for call participants

Add the `MeetingUIClientCallIdentityProvider` to your class.

```java
public class MainActivity extends AppCompatActivity implements MeetingUIClientCallIdentityProvider {
```

Call  `setMeetingUIClientCallIdentityProvider` with parameter `this`.

```java
private void joinMeeting() {
    getAllPermissions();
    MeetingUIClient meetingUIClient = createMeetingUIClient();

    MeetingUIClientTeamsMeetingLinkLocator meetingUIClientTeamsMeetingLinkLocator = new MeetingUIClientTeamsMeetingLinkLocator(<MEETING_URL>);

    MeetingUIClientJoinOptions meetingJoinOptions = new MeetingUIClientJoinOptions(displayName, false);

    try {
        MeetingUIClientCall meetingUIClientCall = meetingUIClient.join(meetingUIClientTeamsMeetingLinkLocator, meetingJoinOptions);
        meetingUIClientCall.setMeetingUIClientCallIdentityProvider(this);
    } catch (Exception ex) {
        Toast.makeText(getApplicationContext(), "Failed to join meeting: " + ex.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
```

Implement `provideAvatarFor` method and map each `userIdentifier` to the corresponding avatar.

```java
@Override
public void provideAvatarFor(CommunicationIdentifier communicationIdentifier, MeetingUIClientAvatarSize avatarSize, MeetingUIClientCallIdentityProviderCallback callback) {
    if(communicationIdentifier instanceof CommunicationUserIdentifier) {
        CommunicationUserIdentifier userIdentifier = (CommunicationUserIdentifier) communicationIdentifier;
        System.out.println("MeetingUIClientIdentityProvider.provideAvatarFor called for userIdentifier: " + userIdentifier.getId());
        if (userIdentifier.getId().startsWith("8:teamsvisitor:")) {
            callback.onAvatarAvailable(ContextCompat.getDrawable(this, R.drawable.nodpi_avatar_placeholder_large_pink));
        } else if (userIdentifier.getId().startsWith("8:orgid:")) {
            callback.onAvatarAvailable(ContextCompat.getDrawable(this, R.drawable.nodpi_doctor_avatar));
        } else if (userIdentifier.getId().startsWith("8:acs:")) {
            callback.onAvatarAvailable(ContextCompat.getDrawable(this, R.drawable.nodpi_avatar_placeholder_large_green));
        }
    }
}
```


Add other mandatory MeetingUIClientCallIdentityProvider interface methods to the class and they may be left with empty implementations.

```java
@Override
public void provideDisplayNameFor(CommunicationIdentifier communicationIdentifier, MeetingUIClientCallIdentityProviderCallback callback) {
}

@Override
public void provideSubTitleFor(CommunicationIdentifier communicationIdentifier, MeetingUIClientCallIdentityProviderCallback callback) {
}

@Override
public void provideRoleFor(CommunicationIdentifier communicationIdentifier, MeetingUIClientCallIdentityProviderCallback callback) {
}
```
## Receive information about user actions in the UI and add your own custom functionalities.

The `MeetingUIClientCallUserEventListener` interface methods are called upon user actions in remote participant's profile.

Add the `MeetingUIClientCallUserEventListener` to your class.

```java
public class MainActivity extends AppCompatActivity implements MeetingUIClientCallUserEventListener {
```

Call `setMeetingUIClientCallUserEventListener` with parameter `this`.

```java
private void joinMeeting() {
    getAllPermissions();
    MeetingUIClient meetingUIClient = createMeetingUIClient();

    MeetingUIClientTeamsMeetingLinkLocator meetingUIClientTeamsMeetingLinkLocator = new MeetingUIClientTeamsMeetingLinkLocator(<MEETING_URL>);

    MeetingUIClientJoinOptions meetingJoinOptions = new MeetingUIClientJoinOptions(displayName, false);

    try {
        MeetingUIClientCall meetingUIClientCall = meetingUIClient.join(meetingUIClientTeamsMeetingLinkLocator, meetingJoinOptions);
        meetingUIClientCall.setMeetingUIClientCallUserEventListener(this);
    } catch (Exception ex) {
        Toast.makeText(getApplicationContext(), "Failed to join meeting: " + ex.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
```
Add and implement `onNamePlateOptionsClicked` method and map each `userIdentifier` to the corresponding call participant user.
This method is called on single tap of user title text from call main screen.

```java
@Override
public void onNamePlateOptionsClicked(@NonNull Activity activity, @NonNull CommunicationIdentifier communicationIdentifier) {
    if(communicationIdentifier instanceof CommunicationUserIdentifier) {
        CommunicationUserIdentifier userIdentifier = (CommunicationUserIdentifier) communicationIdentifier;
        if (userIdentifier.getId().startsWith("8:acs:")) {
            // Custom behavior based on the user here.
            System.out.println("Acs user tile clicked");
        }
    }
}
```

Add and implement `onParticipantViewLongPressed` method and map each `userIdentifier` to the corresponding call participant user.
This method is called on long press of user tile from call main screen. Return true for custom handling or false for default handling of the long press.

```java
@Override
public boolean onParticipantViewLongPressed(@NonNull Activity activity, @NonNull CommunicationIdentifier communicationIdentifier) {
    if(communicationIdentifier instanceof CommunicationUserIdentifier) {
        CommunicationUserIdentifier userIdentifier = (CommunicationUserIdentifier) communicationIdentifier;
        if (userIdentifier.getId().startsWith("8:acs:")) {
            // Custom behavior based on the user here.
            System.out.println("Acs user tile clicked");
            return true;
        }
        return false;
    }
}
```
## User experience customization

The user experience in the SDK can be customized by providing app-specific icons or replacing call controls bars. 

### Customize UI icons in a call or meeting
The icons shown in the call or meeting could be customized through method `public void setIconConfig(Map<MeetingUIClientIconType, Integer> iconConfig)` exposed in `MeetingUIClient`.

After creating the meetingUIClient, set the icon configuration `meetingUIClient.setIconConfig(getIconConfig())`   for the call icons supported in `MeetingUIClientIconType`.

```java
private MeetingUIClient createMeetingUIClient() {
    MeetingUIClient meetingUIClient = new MeetingUIClient(credential);
    meetingUIClient.setIconConfig(getIconConfig());
}

private Map<IconType, Integer> getIconConfig() {
    Map<IconType, Integer> iconConfig = new HashMap<>();
    iconConfig.put(MeetingUIClientIconType.VIDEO_OFF, R.drawable.video_camera_off);
    iconConfig.put(MeetingUIClientIconType.VIDEO_ON, R.drawable.video_camera);
    iconConfig.put(MeetingUIClientIconType.MIC_ON, R.drawable.microphone_fill);
    iconConfig.put(MeetingUIClientIconType.MIC_OFF, R.drawable.microphone_off);
    iconConfig.put(MeetingUIClientIconType.MIC_PROHIBITED, R.drawable.mic_none);
    iconConfig.put(MeetingUIClientIconType.DEVICE_AUDIO, R.drawable.device_filled);
    iconConfig.put(MeetingUIClientIconType.SPEAKER, R.drawable.volume_high);
    iconConfig.put(MeetingUIClientIconType.SPEAKER_OFF, R.drawable.speaker_off);
    iconConfig.put(MeetingUIClientIconType.HEADSET, R.drawable.headset);
    iconConfig.put(MeetingUIClientIconType.BLUETOOTH, R.drawable.bluetooth_audio);
    iconConfig.put(MeetingUIClientIconType.HANGUP, R.drawable.close_app_bar);
    return iconConfig;
}
```

### Customize main call screen

The `MeetingUIClient` provides support to customize the main call screen UI. Currently it supports customizing the UI using `MeetingUIClientInCallScreenProvider` interface methods.
Call screen control actions are exposed through the methods present in `MeetingUIClientCall`.

Add the `MeetingUIClientInCallScreenProvider` to your class.

```java
public class MainActivity extends AppCompatActivity implements MeetingUIClientInCallScreenProvider {
```

Call `setMeetingUIClientInCallScreenProvider` with parameter `this`.

```java
private void joinGroupCall() {
    getAllPermissions();
    MeetingUIClient meetingUIClient = createMeetingUIClient();

    UUID groupUUID = UUID.fromString("<GROUP_ID>");
    MeetingUIClientGroupCallLocator meetingUIClientGroupCallLocator = new MeetingUIClientGroupCallLocator(groupUUID);

    MeetingUIClientJoinOptions meetingJoinOptions = new MeetingUIClientJoinOptions(displayName, false);
    meetingUIClient.setMeetingUIClientInCallScreenProvider(this);
    
    try {
        MeetingUIClientCall meetingUIClientCall = meetingUIClient.join(meetingUIClientGroupCallLocator, meetingJoinOptions);
    } catch (Exception ex) {
        Toast.makeText(getApplicationContext(), "Failed to join group call: " + ex.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
```

Add and implement `provideInCallControlTopBar` method to provide the main call screen top information bar.

```java
@Override
public View provideInCallControlTopBar() {
    View topView;
    // set topView to your custom view here
    return topView;
}
```

Add other mandatory `MeetingUIClientInCallScreenProvider` methods to the class and they may be left with empty implementations to return null.
```java
@Override
public View provideInCallControlBottomBar() {
    return null;
}
```
### Customize staging call screen

The `MeetingUIClient` provides support to customize the staging call screen UI. Currently it supports customizing the UI using `MeetingUIClientStagingScreenProvider` interface methods.

Add the `MeetingUIClientStagingScreenProvider` to your class.

```java
public class MainActivity extends AppCompatActivity implements MeetingUIClientStagingScreenProvider {
```

Call `setMeetingUIClientStagingScreenProvider` with parameter `this` before joining the call or meeting.

```java
private void joinGroupCall() {
    getAllPermissions();
    MeetingUIClient meetingUIClient = createMeetingUIClient();

    UUID groupUUID = UUID.fromString("<GROUP_ID>");
    MeetingUIClientGroupCallLocator meetingUIClientGroupCallLocator = new MeetingUIClientGroupCallLocator(groupUUID);

    MeetingUIClientJoinOptions meetingJoinOptions = new MeetingUIClientJoinOptions(displayName, false);
    meetingUIClient.setMeetingUIClientStagingScreenProvider(this);

    try {
        MeetingUIClientCall meetingUIClientCall = meetingUIClient.join(meetingUIClientGroupCallLocator, meetingJoinOptions);
    } catch (Exception ex) {
        Toast.makeText(getApplicationContext(), "Failed to join group call: " + ex.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
```

Add and implement  `MeetingUIClientInCallScreenProvider` methods to the class and return your custom implementation or 0 for default.

```java
@Override
public int onProvideJoinButtonBackground() {
    return R.drawable.join_button_background;
}

@Override
public int onProvideStagingScreenBackgroundColor() {
    return 0;
}
```

### Customize on connecting call screen

The `MeetingUIClient` provides support to customize the connecting call screen UI. Currently it supports customizing the UI using `MeetingUIClientConnectingScreenProvider` interface methods.

Add the `MeetingUIClientConnectingScreenProvider` to your class.

```java
public class MainActivity extends AppCompatActivity implements MeetingUIClientConnectingScreenProvider {
```

Call `setMeetingUIClientConnectingScreenProvider` with parameter `this` before joining the call or meeting.

```java
private void joinGroupCall() {
    getAllPermissions();
    MeetingUIClient meetingUIClient = createMeetingUIClient();

    UUID groupUUID = UUID.fromString("<GROUP_ID>");
    MeetingUIClientGroupCallLocator meetingUIClientGroupCallLocator = new MeetingUIClientGroupCallLocator(groupUUID);

    MeetingUIClientJoinOptions meetingJoinOptions = new MeetingUIClientJoinOptions(displayName, false);

    meetingUIClient.setMeetingUIClientConnectingScreenProvider(this);
    try {
        MeetingUIClientCall meetingUIClientCall = meetingUIClient.join(meetingUIClientGroupCallLocator, meetingJoinOptions);
    } catch (Exception ex) {
        Toast.makeText(getApplicationContext(), "Failed to join group call: " + ex.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
```

Add and implement  `onProvideConnectingScreenBackgroundColor` method to modify the background color of the connecting screen.

```java
@Override
public int onProvideConnectingScreenBackgroundColor() {
    return ContextCompat.getColor(mContext, android.R.color.black);
}
```

## Perform operations with the call

Call control actions are exposed through the methods present in `MeetingUIClientCall`.
These methods are useful in controlling the call actions if the UI had been customized using the `MeetingUIClient` customization delegates.

Add variable for meetingUIClientCall

```java
public class MainActivity extends AppCompatActivity {
    private MeetingUIClientCall meetingUIClientCall;
```
Assign meetingUIClientCall variable from join method return value

```java
private void joinGroupCall() {
    getAllPermissions();
    MeetingUIClient meetingUIClient = createMeetingUIClient();

    UUID groupUUID = UUID.fromString("<GROUP_ID>");
    MeetingUIClientGroupCallLocator meetingUIClientGroupCallLocator = new MeetingUIClientGroupCallLocator(groupUUID);

    MeetingUIClientJoinOptions meetingJoinOptions = new MeetingUIClientJoinOptions(displayName, false);

    try {
        meetingUIClientCall = meetingUIClient.join(meetingUIClientGroupCallLocator, meetingJoinOptions);
        meetingUIClientCall.setMeetingUIClientCallEventListener(this);
    } catch (Exception ex) {
        Toast.makeText(getApplicationContext(), "Failed to join meeting: " + ex.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
```
### Mute and unmute

Invoke the `mute` method to mute the microphone for an active call if one exists.
Microphone status changes in notified in the `onIsMutedChanged` method of `MeetingUIClientCallEventListener`

```java
// Mute the microphone for an active call.
public void mute() {
    try {
        meetingUIClientCall.mute();
    } catch (Exception ex) {
        Toast.makeText(getApplicationContext(), "Mute call failed: " + ex.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
```

Invoke the `unmute` method to unmute the microphone for an active call if one exists.

```java
// Unmute the microphone for an active call.
public void unmute() {
    try {
        meetingUIClientCall.unmute();
    } catch (Exception ex) {
        Toast.makeText(getApplicationContext(), "Unmute call failed: " + ex.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
```
### Other operations available in from the  `MeetingUIClientCall` class.

```java
// Start the video for an active call.
public void startVideo()

// Stop the video for an active call.
public void stopVideo()

// Set the preferred audio route in the call for self user.
public void setAudioRoute(MeetingUIClientAudioRoute audioRoute)

// Raise the hand of current user for an active call.
public void raiseHand()

// Lower the hand of user provided in the userIdentifier for an active call.
public void lowerHand(CommunicationIdentifier userIdentifier)

// Show the call roster for an active call.
public void showCallRoster() 

// Change the layout in the call for self user.
public List<MicrosoftTeamsSDKLayoutMode> getSupportedLayoutModes()
public void changeLayout(MeetingUIClientLayoutMode microsoftTeamsSDKLayoutMode)

// Hang up the call or leave the meeting.
public void hangup()

// Set the user role for an active call.
public void setRoleFor(CommunicationIdentifier userIdentifier, MeetingUIClientUserRole userRole)
```

## Use Teams Embed SDK and Azure Communication Calling SDK in the same app

Teams Embed SDK provides also Azure Communication Calling SDK (ACS) within it, which allows to use both of the SDK features in the same app. 
Only one SDK can be initialized and used at the time. Having both SDKs initialized and used at the same time will result in unexpected behavior. 

Add the following imports to your class
```java
import com.azure.android.communication.calling.Call;
import com.azure.android.communication.calling.CallAgent;
import com.azure.android.communication.calling.CallClient;
import com.azure.android.communication.calling.CallState;
import com.azure.android.communication.calling.GroupCallLocator;
import com.azure.android.communication.calling.JoinCallOptions;
import com.azure.android.communication.common.CommunicationTokenCredential;
```

Declare variables for ACS usage
```java
public class MainActivity extends AppCompatActivity {
    private CallAgent agent;
    private CallClient mCallClient;
    private Call mCall;
```

Initialization is done by creating new `CallClient`. Add the creation to a `joinAcsCall` or to any other method.

```java
private void joinAcsCall() {
    if (mCallClient == null) {
        mCallClient = new CallClient();
    }
}
```
Use all ACS APIs like they are described in its documentation. The API usage is not discussed in this documentation. 

Dispose the ACS SDK and set `null` to its variables after the usage is not needed anymore or the app needs to use Teams Embed SDK.
```java
private void stopAcs() {
    mCall = null;
    agent.dispose();
    agent = null;
    mCallClient.dispose();
    mCallClient = null;
}
```

Teams Embed SDK initialization is also done during creating `MeetingUIClient`. Add the creation to a `createMeetingUIClient` or to any other method.
```java
private MeetingUIClient createMeetingUIClient() { 
    try {
        CommunicationTokenRefreshOptions refreshOptions = new CommunicationTokenRefreshOptions(tokenRefresher, true, "<USER_ACCESS_TOKEN>");
        CommunicationTokenCredential credential = new CommunicationTokenCredential(refreshOptions);
        return new MeetingUIClient(credential);
    } catch (Exception ex) {
        Toast.makeText(getApplicationContext(), "Failed to create meeting ui client: " + ex.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
```
Use the Teams Embed SDK APIs like they are described in its documentation. The API usage is not discussed in this documentation. 

Dispose the Teams Embed SDK and set `null` to its variables after the usage is not needed anymore or the app needs to use ACS SDK.
```java
private void disposeTeamsSdk() {
    try {
        meetingUIClient.dispose();
        meetingUIClientCall = null;
        meetingUIClient = null;
    } catch (Exception ex) {
        Toast.makeText(getContext(), "Failed to teardown Teams Sdk: " + ex.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
```

Disposing Teams Embed SDK is only possible if there are no active calls. The `meetingUIClient.dispose()` will return throw an exception if there's an active call. 
Hang up the active call and then call `disposeTeamsSdk()`.

```java
private void endMeeting() {
    try {
        meetingUIClientCall.hangUp();
        disposeTeamsSdk();
    } catch (Exception ex) {
        Toast.makeText(getContext(), "Failed to end meeting: " + ex.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
```

Implement `MeetingUIClientCallEventListener` interface method `onCallStateChanged(MeetingUIClientCallState callState)` to get status update about active call being ended and dispose the Teams Embed SDK after it.
```java
@Override
public void onCallStateChanged(MeetingUIClientCallState callState) {
    switch(callState) {
        case ENDED:
            disposeTeamsSdk();
            break;
        default:
        System.out.println("Call state changed to: " + callState.toString());
    }
}
```

Add other mandatory `MeetingUIClientCallEventListener` interface methods to the class

```java
@Override
public void onRemoteParticipantCountChanged(int newCount) {
    System.out.println("Remote participant count has changed to: " + newCount);
}

@Override
public void onIsMutedChanged() {
    System.out.println("Mute state changed to: " + meetingUIClientCall.isMuted());
}

@Override
public void onIsSendingVideoChanged() {
    System.out.println("Sending video state changed to: " + meetingUIClientCall.isSendingVideo());
}

@Override
public void onIsHandRaisedChanged(List<String> participantIds) {
    System.out.println("Self participant raise hand status changed to: " + meetingUIClientCall.isHandRaised());
}
```
