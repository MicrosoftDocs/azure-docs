---
author: fuyan
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/24/2024
ms.author: fuyan
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Implement media access

`MediaAccess` is a `feature` of the class `Call`. You first need to import package `Features` from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the instance of `MediaAccess` API from the `call` instance:

```js
const mediaAccessFeature = call.feature(Features.MediaAccess);
```

### Control access to send audio or video of individual attendees

Use the `permitAudio()` method to enable selected attendees to unmute. Use the `permitVideo()` method to enable selected attendees to turn on video. These actions don't automatically unmute or turn on video. They only enable attendees to perform these actions. 

Use the `forbidAudio()` method to enable organizers to mute selected attendees and deny them the ability to unmute. Use the `forbidVideo()` method to enable organizers to turn off video for selected attendees and deny them the ability to turn on video.

```js
// Define list of attendees
const acsUser = new CommunicationUserIdentifier('<USER_ID>');
const teamsUser = new MicrosoftTeamsUserIdentifier('<USER_ID>');
const participants = [acsUser, teamsUser];

// Allow selected attendees to unmute
mediaAccessFeature.permitAudio(participants);

// Deny selected attendees to unmute
mediaAccessFeature.forbidAudio(participants);

// Allow selected attendees to turn on video
mediaAccessFeature.permitVideo(participants);

// Deny selected attendees to turn on video
mediaAccessFeature.forbidVideo(participants);
```

### List media access state for all remote participants

Use the `getAllOthersMediaAccess` API to get information about all remote participant media access states for current call.
An example of how to use the `getAllOthersMediaAccess` API:
```js
let remoteParticipantsMediaAccess = mediaAccessHandFeature.getAllOthersMediaAccess()

remoteParticipantsMediaAccess.forEach((mediaAccess) => {
       console.log(`Identifier: ${mediaAccess.participant } can unmute: ${mediaAccess.isAudioPermitted } and can turn on video: ${mediaAccess.isVideoPermitted }`);  
})
```

### Get notification that media access changed

Subscribe to the `mediaAccessChanged` events from `MediaAccess` API to receive array of `MediaAccess` instances. Use the array to see the media access state for all remote participants if they're currently enabled or denied the ability to send audio or video. By default, all participants other than the attendee role can send audio and video. The `mediaAccessChanged` events are triggered when a participant with an appropriate role changes media access for selected attendees or all attendees. 

```js
const mediaAccessChangedHandler = (event) => {
    console.log(`Attendees that changed media access states:`);
    event.mediaAccesses.forEach( (mediaAccess) => {
       console.log(`Identifier: ${mediaAccess.participant } can unmute: ${mediaAccess.isAudioPermitted } and can turn on video: ${mediaAccess.isVideoPermitted }`);  
    }
}
mediaAccessFeature.on('mediaAccessChanged', mediaAccessChangedHandler )
```

### Stop receiving media access events
Use the following code to stop receiving media access events.
```js
mediaAccessFeature.off('mediaAccessChanged', mediaAccessChangedHandler)
```

### Media Access properties
Class `MediaAccess` has the following properties:

| Properties | Description |
|--|--|
| participant | Identifier of the participant whose media access changed. |
| isAudioPermitted | Boolean value indicating whether ability to send audio is allowed for this participant. |
| isVideoPermitted | Boolean value indicating whether ability to send video is allowed for this participant. |

### Control access to send audio or video for all attendees
Microsoft Teams meetings support APIs that enable organizers, co-organizers, and presenters to change the meeting options **Allow mic for attendees** or **Allow camera for attendees**. You can use those APIs to change the value of the meeting options, which enable organizers to enable or denying all attendees sending audio or video.

You can use the `permitOthersAudio()` method to set meeting option **Allow mic for attendees** to `true` and enable all attendees to unmute. You can also use the `permitOthersVideo()` method to set meeting option **Allow camera for attendees** to `true` and enable all attendees to turn on video. These actions don't automatically unmute or turn on video. They only enable attendees to perform these actions. 

Use the `forbidOthersAudio()` method to set meeting option **Allow mic for attendees** to `false`, which organizers can use to mute all attendees and deny them the ability to unmute. You can also use the `forbidOthersVideo()` method to set meeting option **Allow mic for attendees** to `false`, which organizers can use to turn of video for all attendees and deny them the ability to turn on video.

Participants with appropriate roles can override methods `permitOthersAudio` ,`permitOthersVideo`, `forbidOthersAudio` ,`forbidOthersVideo` with methods `forbidAudio` and `forbidVideo` or `permitAudio` and `permitVideo`. Change of media access for all attendees triggers `mediaAccessChanged` event for all participants that are impacted. 

```js
// Allow all attendees to unmute
mediaAccessFeature.permitOthersAudio();

// Deny all attendees to unmute
mediaAccessFeature.forbidOthersAudio();

// Allow all attendees to turn on video
mediaAccessFeature.permitOthersVideo();

// Deny all attendees to turn on video
mediaAccessFeature.forbidOthersVideo();
```

### Get Teams meeting media access setting
You can use the `getMeetingMediaAccess` API to get values of `Allow mic for attendees` or `Allow camera for attendees` Teams meeting options. The fact that meeting options are set to `true` or `false` don't guarantee that all attendees have permitted or forbid audio or video, because those calls can be overridden with methods `forbidAudio`, `forbidVideo`, `permitAudio` and `permitVideo`.
Here's an example of how to use the `getMeetingMediaAccess` API:
```js
let meetingMediaAccess = mediaAccessHandFeature.getMeetingMediaAccess()
console.log(`Teams meeting settings - Allow mic for attendees: ${meetingMediaAccess.isAudioPermitted}, Allow camera for attendees: ${meetingMediaAccess.isVideoPermitted}`);  
```

### Get notification that meeting media access changed
You can subscribe to the `meetingMediaAccessChanged` events from `MediaAccess` API to receive a `MeetingMediaAccess` instance when Teams meeting options `Allow mic for attendees` or `Allow camera for attendees` are changed. 
```js
const meetingMediaAccessChangedHandler = (event) => {
    console.log(`Teams meeting settings - Allow mic for attendees: ${event.meetingMediaAccess.isAudioPermitted}, Allow camera for attendees: ${event.meetingMediaAccess.isVideoPermitted}`);  
}
mediaAccessFeature.on('meetingMediaAccessChanged', meetingMediaAccessChangedHandler )
```

### Stop receiving meeting media access events
Use the following code to stop receiving meeting media access events.
```js
mediaAccessFeature.off('meetingMediaAccessChanged', meetingMediaAccessChangedHandler)
```

### Meeting media access properties
Class `MeetingMediaAccess` has the following properties:

| Properties | Description |
|--|--|
| isAudioPermitted | Boolean value of Teams meeting option `Allow mic for attendees`. |
| isVideoPermitted | Boolean value of Teams meeting option `Allow camera for attendees`. |

### Troubleshooting

|Error code| Subcode | Result Category | Reason | Resolution |
|----------------------------------------------|--------|--------|---------|----------|
|500		| 46500	| UnexpectedServerError  | Internal error while updating the audio or video access. | Gather browser console logs and contact Azure Communication Services support. |
|500	| 46501 | UnexpectedClientError  | Couldn't initialize media access feature.  | Gather browser console logs and contact Azure Communication Services support. |
|403 | 46502	| ExpectedError | Change media access failed. User doesn't have an organizer, coorganizer, or presenter role. | Ensure that the user has one of mentioned roles and try again. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|403| 46503 | UnexpectedServerError |Change media access failed. Change media access can only be done in meeting or group call scenarios. | Ensure that the feature is initialized only for Teams meeting or group call scenarios. You can check `Capability` feature to learn about the availability of the feature. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|403 | 46504| ExpectedError | Change media access failed. Only able to change media access for attendees. | Ensure that the method is called only for participants with role attendees. You can check the property `role` of class `remoteParticipant` to understand the role of the participant.|
|412 | 46505| ExpectedError | Failed to change media access. | Use media access APIs only when your instance of `Call` has property `state` set to `connected`. |
|412| 46506 | UnexpectedClientError | Media access change failed as meeting capabilities are empty. | Gather browser console logs and contact Azure Communication Services support. |
|412| 46507 | ExpectedError | Azure Communication Services currently disabled this feature.  | Try the APIs in a couple of days. |

## SDK compatibility

The following table shows the minimum version of SDKs that support individual APIs.

| Operations | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows | 
|-------------|-----|--------|-----|--------|---------|------------|---------|
|Permit audio |1.31.2,<br>1.32.1-beta.1|❌|❌|❌|❌|❌|❌|
|Forbid audio |1.31.2,<br>1.32.1-beta.1|❌|❌|❌|❌|❌|❌|
|Permit others audio|1.31.2,<br>1.32.1-beta.1|❌|❌|❌|❌|❌|❌|
|Forbid others audio|1.31.2,<br>1.32.1-beta.1|❌|❌|❌|❌|❌|❌|
|Permit video |1.31.2,<br>1.32.1-beta.1|❌|❌|❌|❌|❌|❌|
|Forbid video |1.31.2,<br>1.32.1-beta.1|❌|❌|❌|❌|❌|❌|
|Permit others video|1.31.2,<br>1.32.1-beta.1|❌|❌|❌|❌|❌|❌|
|Forbid others video|1.31.2,<br>1.32.1-beta.1|❌|❌|❌|❌|❌|❌|

