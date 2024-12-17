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

Then you can get the instance of `MediaAccess` API from the `call` instance:

```js
const mediaAccessFeature = call.feature(Features.MediaAccess);
```

### Forbid or permit audio and video for all attendees
You can use methods `permitAudio()` and `forbidAudio()` to enable or disable audio of all attendees and methods `permitVideo()` and `forbidVideo()` to enable or disable video of all attendees. If presenters or organizer enable audio or video for all attendees, those attendees would be able to unmute or enable video. This action won't for privacy reasons unmute or turn on video of attendees.
```js
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
//forbid all attendees audio
mediaAccessFeature.forbidOthersAudio();
//or we can provide array of CommunicationIdentifier to specify list of participants
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>)
CommunicationIdentifier participants[] = new CommunicationIdentifier[]{ acsUser, teamsUser };
mediaAccessFeature.forbidAudio(participants);
```

### Handle changed states
You can subscribe to the `mediaAccessChanged` events from 'Media access' API to handle changes in the state of participants on a call. These events are from a call instance and provide information about the participant whose state change and the `meetingMediaAccessChanged` events to handle Teams meeting options setting Disable/Enable mic/camera changes.

You can use the following code to subscribe these events:
```js
const mediaAccessChangedHandler = (event) => {
    console.log(`Latest media access states ${event.mediaAccesses}`);
};
```
`mediaAccessChanged` event has an array of media access objects:
```json
{
    "identifier": {
        "kind": "microsoftTeamsUser",
        "rawId": "8:orgid:9190c503-61e1-43e6-a165-daf3bad4cd53",
        "microsoftTeamsUserId": "9190c503-61e1-43e6-a165-daf3bad4cd53",
        "isAnonymous": false,
        "cloud": "public"
    },
    "isAudioPermitted": true,
    "isVideoPermitted": true
},
{
    "identifier": {
        "kind": "communicationUser",
        "communicationUserId": "8:acs:efd3c229-b212-437a-945d-92326f13a1be_00000024-70f3-ae62-4ff7-343a0d002fcb"
    },
    "isAudioPermitted": true,
    "isVideoPermitted": true
},
```
```js
const meetingMediaAccessChangedHandler = (event) => {
    console.log(`Latest meeting media access state ${event.mediaAccesses}`);
};
```
The meeting media access changed event has a media access object
```json
{
    "isAudioPermitted": true,
    "isVideoPermitted": true
}
```

```js
mediaAccessFeature.on('mediaAccessChanged', mediaAccessChangedHandler):

mediaAccessFeature.on('meetingMediaAccessChanged', meetingMediaAccessChangedHandler):
```
The `mediaAccessChanged` event contains an object with the `mediaAccesses` property, which represents the participant's media accesses.
The `meetingMediaAccessChanged` event contains an object with the `mediaAccesses` property, which represents the Teams meeting options setting media accesses.

### Stop receiving media access events
Use the following code to stop receiving media access events.
```js
mediaAccessFeature.off('mediaAccessChanged', mediaAccessChangedHandler):

mediaAccessFeature.off('meetingMediaAccessChanged', meetingMediaAccessChangedHandler):
```

### List media access state for all remote participants
You can use the `getAllOthersMediaAccess` API to get information about all remote participants media access state on current call.
Here's an example of how to use the `getAllOthersMediaAccess` API:
```js
let remoteParticipantsMediaAccess = mediaAccessHandFeature.getAllOthersMediaAccess();
```
Example array of media access objects returned by list all remote participants media access.
```json
{
    "identifier": {
        "kind": "microsoftTeamsUser",
        "rawId": "8:orgid:9190c503-61e1-43e6-a165-daf3bad4cd53",
        "microsoftTeamsUserId": "9190c503-61e1-43e6-a165-daf3bad4cd53",
        "isAnonymous": false,
        "cloud": "public"
    },
    "isAudioPermitted": true,
    "isVideoPermitted": true
},
{
    "identifier": {
        "kind": "communicationUser",
        "communicationUserId": "8:acs:efd3c229-b212-437a-945d-92326f13a1be_00000024-70f3-ae62-4ff7-343a0d002fcb"
    },
    "isAudioPermitted": true,
    "isVideoPermitted": true
},
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
