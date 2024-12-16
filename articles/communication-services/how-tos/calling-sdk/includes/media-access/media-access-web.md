---
author: fuyan
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/24/2024
ms.author: fuyan
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Implement Media Access

The media access feature allows organizers or presenters to prevent attendees from unmuting or turning on video themselves during Microsoft Teams meetings or group calls.
`MediaAccess` is a `feature` of the class `Call`. You first need to import package `Features` from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:

```js
const mediaAccessFeature = call.feature(Features.MediaAccess);
```

### Forbid or permit audio and video for Teams meeting attendees
To change the Media access state for an attendee, you can use the `forbidAudio()`, `permitAudio()`,  `forbidVideo()`, and `permitVideo()` methods. These methods are async, to verify results can be used to `mediaAccessChanged` listeners.
```js
const mediaAccessFeature = call.feature(Features.MediaAccsss);
//forbid audio
mediaAccessFeature.forbidAudio();
//permit audio
mediaAccessFeature.permitAudio();
//forbid video
mediaAccessFeature.forbidVideo();
//permit video
mediaAccessFeature.permitVideo();
```

### Forbid and permit media access for other participants
This feature allows users with the Organizer and Presenter roles to forbid and permit media access for other participants on Teams calls. In Azure Communication calls, changing the state of other participants isn't allowed unless adding the presenter role.

To use this feature, you can use the following code:
```js
const mediaAccessFeature = call.feature(Features.MediaAccess);
//forbid all attendees audio
mediaAccessFeature.forbidOthersAudio();
//or we can provide array of CommunicationIdentifier to specify list of participants
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>)
CommunicationIdentifier participants[] = new CommunicationIdentifier[]{ acsUser, teamsUser };
mediaAccessFeature.forbidAudio(participants);
```

### Handle changed states
With the 'Media access' API, you can subscribe to the `mediaAccessChanged` events to handle changes in the state of participants on a call. These events are from a call instance and provide information about the participant whose state change and the `meetingMediaAccessChanged` events to handle Teams meeting options setting Disable/Enable mic/camera changes.

To subscribe to these events, you can use the following code:
```js
const mediaAccessFeature = call.feature(Features.MediaAccess);

const mediaAccessChangedHandler = (event) => {
    console.log(`Latest media access states ${event.mediaAccesses}`);
};

const meetingMediaAccessChangedHandler = (event) => {
    console.log(`Latest meeting media access state ${event.mediaAccesses}`);
};

mediaAccessFeature.on('mediaAccessChanged', mediaAccessChangedHandler):

mediaAccessFeature.on('meetingMediaAccessChanged', meetingMediaAccessChangedHandler):
```

The `mediaAccessChanged` event contains an object with the `mediaAccesses` property, which represents the participant's media accesses.
The `meetingMediaAccessChanged` event contains an object with the `mediaAccesses` property, which represents the Teams meeting options setting media accesses.

To unsubscribe from the events, you can use the `off` method.

### List of all remote participants media access state
To get information about all remote participants media access state on current call, you can use the `getAllOthersMediaAccess` API.
Here's an example of how to use the `getAllOthersMediaAccess` API:
```js
const mediaAccessHandFeature = call.feature(Features.MediaAccess);
let remoteParticipantsMediaAccess = mediaAccessHandFeature.getAllOthersMediaAccess();
```
### Troubleshooting

|Error code| Subcode | Result Category | Reason | Resolution |
|----------------------------------------------|--------|--------|---------|----------|
|500		| 46500	| UnexpectedServerError  | Internal error while updating the audio /video access. | Gather browser console logs and contact Azure Communication Services support. |
|500	| 46501 | UnexpectedClientError  | Could not initialize media access feature.  | Gather browser console logs and contact Azure Communication Services support. |
|403 | 46502	| ExpectedError | Change media access failed. User does not have a Organizer, Co-Organizer or Presenter role. | Ensure that the user has the mentioned roles and try again. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|403| 46503 | UnexpectedServerError |Change media access failed. Change media access can only be done in meeting/group call scenarios. | Ensure that the feature is initialized only for meeting / group call scenarios. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|403 | 46504| ExpectedError | Change media access failed. Only able to change media access for attendees. | Ensure that the method is called only for the attendee MRI's.|
|412 | 46505| ExpectedError | Failed to change media access. |  Call must be in connected state. |
|412| 46506 | UnexpectedClientError | Change audio video access failed. Meeting capability attendee restrictions is empty. | Gather browser console logs and contact Azure Communication Services support. |
|412| 46507 | ExpectedError | Azure Communication Services currently disabled this feature.  | Try the APIs in a couple of days. |
