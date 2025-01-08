---
author: fuyan
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/24/2024
ms.author: fuyan
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Implement Media Access

`MediaAccess` is a `feature` of the class `Call`. You first need to import package `Features` from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the instance of `MediaAccess` API from the `call` instance:

```js
const mediaAccessFeature = call.feature(Features.MediaAccess);
```

### Control access to send audio or video of individual attendees
You can use method `permitAudio()` to allow selected attendees to unmute or method `permitVideo()` to allow selected attendees to turn on video. These actions don't automatically unmute or turn on video. They only allow attendees to perform these actions. 

Use method `forbidAudio()` to mute selected attendees and deny them to unmute or method `forbidVideo()` to turn of video for selected attendees and deny them to turn video on.

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
You can use the `getAllOthersMediaAccess` API to get information about all remote participants media access state on current call.
Here's an example of how to use the `getAllOthersMediaAccess` API:
```js
let remoteParticipantsMediaAccess = mediaAccessHandFeature.getAllOthersMediaAccess()

remoteParticipantsMediaAccess.forEach((mediaAccess) => {
       console.log(`Identifier: ${mediaAccess.participant } can unmute: ${mediaAccess.isAudioPermitted } and can turn on video: ${mediaAccess.isVideoPermitted }`);  
})
```

### Get notification that media access changed
You can subscribe to the `mediaAccessChanged` events from `MediaAccess` API to receive array of `MediaAccess` instances that allow you to learn all remote participants' media access if they're now allowed or denied sending audio or video. By default all participants with role different than attendees are allowed audio and video. This event is triggered when a participant with an appropriate role changes media access for selected or all attendees. 

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

### Control access to send audio or video of all attendees
Microsoft Teams meetings support API that allows participants with role organizer, co-organizers, or presenters to change meeting options `Allow mic for attendees` or `Allow camera for attendees`. You can use those APIs to change the value of those meeting options, which will result in allowing or denying all attendees to send audio or video. You can use method `permitOthersAudio()` to set meeting option `Allow mic for attendees` to `true` and allow all attendees to unmute. You can also use method `permitOthersVideo()` to set meeting option `Allow camera for attendees` to `true` and allow all attendees to turn on video. These actions don't automatically unmute or turn on video. They only allow attendees to perform these actions. 

Use method `forbidOthersAudio()` to set meeting option `Allow mic for attendees` to `false` that will mute all attendees and deny them to unmute. You can also use method `forbidOthersVideo()` to set meeting option `Allow mic for attendees` to `false` that will turn of video for all attendees and deny them to turn on video.

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
|403 | 46502	| ExpectedError | Change media access failed. User doesn't have an organizer, coorganizer, or presenter role. | Ensure that the user has the mentioned roles and try again. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|403| 46503 | UnexpectedServerError |Change media access failed. Change media access can only be done in meeting/group call scenarios. | Ensure that the feature is initialized only for Teams meeting or group call scenarios. You can check `Capability` feature to learn about the availability of the feature. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|403 | 46504| ExpectedError | Change media access failed. Only able to change media access for attendees. | Ensure that the method is called only for participants with role attendees. You can check the property `role` of class `remoteParticipant` to understand the role of the participant.|
|412 | 46505| ExpectedError | Failed to change media access. | Use media access APIs only when your instance of `Call` has property `state` set to `connected`. |
|412| 46506 | UnexpectedClientError | Media access change failed as meeting capabilities are empty. | Gather browser console logs and contact Azure Communication Services support. |
|412| 46507 | ExpectedError | Azure Communication Services currently disabled this feature.  | Try the APIs in a couple of days. |
