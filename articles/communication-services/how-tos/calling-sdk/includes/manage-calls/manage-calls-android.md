## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../../access-tokens.md)
- Optional: Complete the quickstart for [getting started with adding calling to your application](../../getting-started-with-calling.md)

[!INCLUDE [Install SDK](../install-sdk/install-sdk-android.md)]

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| CallClient| The CallClient is the main entry point to the Calling SDK.|
| CallAgent | The CallAgent is used to start and manage calls. |
| CommunicationTokenCredential | The CommunicationTokenCredential is used as the token credential to instantiate the CallAgent.|
| CommunicationIdentifier | The CommunicationIdentifier is used as different type of participant that would could be part of a call.|

## Place a call

To create and start a call you need to call the `CallAgent.startCall()` method and provide the `Identifier` of the callee(s).
To join a group call you need to call the `CallAgent.join()` method and provide the groupId. Group Ids must be in GUID or UUID format.

Call creation and start are synchronous. The call instance allows you to subscribe to all events on the call.

### Place a 1:1 call to a user
To place a call to another Communication Services user, invoke the `call` method on `callAgent` and pass an object with `communicationUserId` key.
```java
StartCallOptions startCallOptions = new StartCallOptions();
Context appContext = this.getApplicationContext();
CommunicationUserIdentifier acsUserId = new CommunicationUserIdentifier(<USER_ID>);
CommunicationUserIdentifier participants[] = new CommunicationUserIdentifier[]{ acsUserId };
call oneToOneCall = callAgent.startCall(appContext, participants, startCallOptions);
```

### Place a 1:n call with users and PSTN
> [!WARNING]
> Currently PSTN calling is not available

To place a 1:n call to a user and a PSTN number you have to specify the phone number of callee.
Your Communication Services resource must be configured to allow PSTN calling:
```java
CommunicationUserIdentifier acsUser1 = new CommunicationUserIdentifier(<USER_ID>);
PhoneNumberIdentifier acsUser2 = new PhoneNumberIdentifier("<PHONE_NUMBER>");
CommunicationIdentifier participants[] = new CommunicationIdentifier[]{ acsUser1, acsUser2 };
StartCallOptions startCallOptions = new StartCallOptions();
Context appContext = this.getApplicationContext();
Call groupCall = callAgent.startCall(participants, startCallOptions);
```

## Accept a call
To accept a call, call the 'accept' method on a call object.

```java
Context appContext = this.getApplicationContext();
IncomingCall incomingCall = retrieveIncomingCall();
Call call = incomingCall.accept(context).get();
```

To accept a call with video camera on:

```java
Context appContext = this.getApplicationContext();
IncomingCall incomingCall = retrieveIncomingCall();
AcceptCallOptions acceptCallOptions = new AcceptCallOptions();
VideoDeviceInfo desiredCamera = callClient.getDeviceManager().get().getCameraList().get(0);
acceptCallOptions.setVideoOptions(new VideoOptions(new LocalVideoStream(desiredCamera, appContext)));
Call call = incomingCall.accept(context, acceptCallOptions).get();
```

The incoming call can be obtained by subscribing to the `onIncomingCall` event on the `callAgent` object:

```java
// Assuming "callAgent" is an instance property obtained by calling the 'createCallAgent' method on CallClient instance 
public Call retrieveIncomingCall() {
    IncomingCall incomingCall;
    callAgent.addOnIncomingCallListener(new IncomingCallListener() {
        void onIncomingCall(IncomingCall inboundCall) {
            // Look for incoming call
            incomingCall = inboundCall;
        }
    });
    return incomingCall;
}
```

## Join a group call
To start a new group call or join an ongoing group call you have to call the 'join' method and pass an object with a `groupId` property. The value has to be a GUID.
```java
Context appContext = this.getApplicationContext();
GroupCallLocator groupCallLocator = new GroupCallLocator("<GUID>");
JoinCallOptions joinCallOptions = new JoinCallOptions();

call = callAgent.join(context, groupCallLocator, joinCallOptions);
```

## Call properties

Get the unique ID for this Call:

```java
String callId = call.getId();
```

To learn about other participants in the call inspect `remoteParticipant` collection on the `call` instance:

```java
List<RemoteParticipant> remoteParticipants = call.getRemoteParticipants();
```

The identity of caller if the call is incoming:

```java
CommunicationIdentifier callerId = call.getCallerInfo().getIdentifier();
```

Get the state of the Call: 

```java
CallState callState = call.getState();
```

It returns a string representing the current state of a call:
* 'NONE' - initial call state
* 'EARLY_MEDIA' - indicates a state in which an announcement is played before call is connected
* 'CONNECTING' - initial transition state once call is placed or accepted
* 'RINGING' - for an outgoing call - indicates call is ringing for remote participants
* 'CONNECTED' - call is connected
* 'LOCAL_HOLD' - call is put on hold by local participant, no media is flowing between local endpoint and remote participant(s)
* 'REMOTE_HOLD' - call is put on hold by a remote participant, no media is flowing between local endpoint and remote participant(s)
* 'DISCONNECTING' - transition state before call goes to 'Disconnected' state
* 'DISCONNECTED' - final call state
* 'IN_LOBBY' - in lobby for a Teams meeting interoperability

To learn why a call ended, inspect `callEndReason` property. It contains code/subcode: 

```java
CallEndReason callEndReason = call.getCallEndReason();
int code = callEndReason.getCode();
int subCode = callEndReason.getSubCode();
```

To see if the current call is an incoming or an outgoing call, inspect `callDirection` property:

```java
CallDirection callDirection = call.getCallDirection(); 
// callDirection == CallDirection.INCOMING for incoming call
// callDirection == CallDirection.OUTGOING for outgoing call
```

To see if the current microphone is muted, inspect the `muted` property:

```java
boolean muted = call.isMuted();
```

To inspect active video streams, check the `localVideoStreams` collection:

```java
List<LocalVideoStream> localVideoStreams = call.getLocalVideoStreams();
```

## Mute and unmute

To mute or unmute the local endpoint you can use the `mute` and `unmute` asynchronous APIs:

```java
Context appContext = this.getApplicationContext();
call.mute(appContext).get();
call.unmute(appContext).get();
```
## Change the volume of the call

While you are in a call, the hardware volume keys on the phone should allow the user to change the call volume.
This is done by using the method `setVolumeControlStream` with the stream type `AudioManager.STREAM_VOICE_CALL` on the Activity where the call is being placed.
This allows the hardware volume keys to change the volume of the call (denoted by a phone icon or something similar on the volume slider), preventing to change the volume for other sound profiles, like alarms, media or system wide volume. For more information, you can check [Handling changes in audio output
 | Android Developers](https://developer.android.com/guide/topics/media-apps/volume-and-earphones).

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    ...
    setVolumeControlStream(AudioManager.STREAM_VOICE_CALL);
}
```

## Remote participants management

All remote participants are represented by `RemoteParticipant` type and are available through the `remoteParticipants` collection on a call instance.

### List participants in a call
The `remoteParticipants` collection returns a list of remote participants in given call:
```java
List<RemoteParticipant> remoteParticipants = call.getRemoteParticipants(); // [remoteParticipant, remoteParticipant....]
```

### Add a participant to a call

To add a participant to a call (either a user or a phone number) you can invoke `addParticipant`. 
This will synchronously return the remote participant instance.

```java
const acsUser = new CommunicationUserIdentifier("<acs user id>");
const acsPhone = new PhoneNumberIdentifier("<phone number>");
RemoteParticipant remoteParticipant1 = call.addParticipant(acsUser);
AddPhoneNumberOptions addPhoneNumberOptions = new AddPhoneNumberOptions(new PhoneNumberIdentifier("<alternate phone number>"));
RemoteParticipant remoteParticipant2 = call.addParticipant(acsPhone, addPhoneNumberOptions);
```

### Remove participant from a call
To remove a participant from a call (either a user or a phone number) you can invoke `removeParticipant`.
This will resolve asynchronously once the participant is removed from the call.
The participant will also be removed from `remoteParticipants` collection.
```java
RemoteParticipant acsUserRemoteParticipant = call.getParticipants().get(0);
RemoteParticipant acsPhoneRemoteParticipant = call.getParticipants().get(1);
call.removeParticipant(acsUserRemoteParticipant).get();
call.removeParticipant(acsPhoneRemoteParticipant).get();
```

### Remote participant properties
Any given remote participant has a set of properties and collections associated with it:

* Get the identifier for this remote participant.
Identity is one of the 'Identifier' types
```java
CommunicationIdentifier participantIdentifier = remoteParticipant.getIdentifier();
```

* Get state of this remote participant.
```java
ParticipantState state = remoteParticipant.getState();
```
State can be one of
* 'IDLE' - initial state
* 'EARLY_MEDIA' - announcement is played before participant is connected to the call
* 'RINGING' - participant call is ringing
* 'CONNECTING' - transition state while participant is connecting to the call
* 'CONNECTED' - participant is connected to the call
* 'HOLD' - participant is on hold
* 'IN_LOBBY' - participant is waiting in the lobby to be admitted. Currently only used in Teams interop scenario
* 'DISCONNECTED' - final state - participant is disconnected from the call


* To learn why a participant left the call, inspect `callEndReason` property:
```java
CallEndReason callEndReason = remoteParticipant.getCallEndReason();
```

* To check whether this remote participant is muted or not, inspect the `isMuted` property:
```java
boolean isParticipantMuted = remoteParticipant.isMuted();
```

* To check whether this remote participant is speaking or not, inspect the `isSpeaking` property:
```java
boolean isParticipantSpeaking = remoteParticipant.isSpeaking();
```

* To inspect all video streams that a given participant is sending in this call, check the `videoStreams` collection:
```java
List<RemoteVideoStream> videoStreams = remoteParticipant.getVideoStreams(); // [RemoteVideoStream, RemoteVideoStream, ...]
```
