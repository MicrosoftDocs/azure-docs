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
You can use method `permitAudio()` to allow selected attendees to unmute or method `permitVideo()` to allow selected attendees to turn on video. These actions won't automatically unmute or turn on video, they only allow attendees to perform these actions. 

```js
//Define list of attendees
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>)
CommunicationIdentifier participants = new CommunicationIdentifier[]{ acsUser, teamsUser };

//Allow selected attendees to unmute
mediaAccessFeature.permitAudio(participants);

//Allow selected attendees to turn on video
mediaAccessFeature.permitVideo(participants);
```js
//forbid audio
mediaAccessFeature.forbidAudio([user1, user2]);
//permit audio
mediaAccessFeature.permitAudio([user1, user2]);
//forbid video
mediaAccessFeature.forbidVideo([user1, user2]);
//permit video
mediaAccessFeature.permitVideo([user1, user2]);
```

### Control access to send audio or video of all attendees
Microsoft Teams meetings support API that allows participants with role organizer, co-organizers or presenters to allow or deny all attendees to send audio or video. You can use method `permitOthersAudio()` to allow all attendees to unmute or method `permitOthersVideo()` to allow all attendees to turn on video. These actions won't automatically unmute or turn on video, they only allow attendees to perform these actions. 

```js
//Allow all attendees to unmute
mediaAccessFeature.permitOthersAudio();

//Allow all attendees to turn on video
mediaAccessFeature.permitOthersVideo();

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

### Get notification that media access changed
You can subscribe to the `mediaAccessChanged` events from 'MediaAccess' API to receive array of `MediaAccess` instances, that allow you to learn which attendees are now allowed or denied sending audio or video. This event is triggered when a participant with an appropriate role changes media access for selected or all attendees. 

```js
const mediaAccessChangedHandler = (event) => {
    console.log(`Attendees that changed media access states:`);  
    event.mediaAccesses.forEach( (mediaAccess) => {
       console.log(`Identifier: ${mediaAccess.participant } can unmute: ${mediaAccess.isAudioPermitted } and can turn on video: ${mediaAccess.isVideoPermitted }`);  
    }
}
mediaAccessFeature.on('mediaAccessChanged', mediaAccessChangedHandler )

### Media Access properties
Class `MediaAccess` has the following properties:
| Properties | Description |
| -- | -- |
| participant | Identifier of the participant whose media access has changed. |
| isAudioPermitted | Boolean value indicating whether ability to send audio is allowed for this participant. |
| isVideoPermitted | Boolean value indicating whether ability to send video is allowed for this participant. |

### Meeting media access properties
Class `MeetingMediaAccess` has the following properties:
| Properties | Description |
| -- | -- |
| isAudioPermitted | Boolean value indicating whether ability to send audio is allowed in the Teams meeting for attendees. |
| isVideoPermitted | Boolean value indicating whether ability to send video is allowed in the Teams meeting for attendees. |

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
The `mediaAccessChanged` event contains an object with the `mediaAccesses` property, which represents the participant's media accesses.
```js
mediaAccessFeature.on('mediaAccessChanged', mediaAccessChangedHandler)
```
The `meetingMediaAccessChanged` event is for Teams meeting only not supported in group call, it contains an object with the `mediaAccesses` property, which represents the Teams meeting options setting media accesses.
```js
mediaAccessFeature.on('meetingMediaAccessChanged', meetingMediaAccessChangedHandler)
```

### Stop receiving media access events
Use the following code to stop receiving media access events.
```js
mediaAccessFeature.off('mediaAccessChanged', mediaAccessChangedHandler)

mediaAccessFeature.off('meetingMediaAccessChanged', meetingMediaAccessChangedHandler)
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
|403 | 46502	| ExpectedError | Change media access failed. User does not have an organizer, co-organizer, or presenter role. | Ensure that the user has the mentioned roles and try again. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|403| 46503 | UnexpectedServerError |Change media access failed. Change media access can only be done in meeting/group call scenarios. | Ensure that the feature is initialized only for meeting / group call scenarios. You can check `Capability` feature that would give you additional details. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|403 | 46504| ExpectedError | Change media access failed. Only able to change media access for attendees. | Ensure that the method is called only for the attendee MRI's.|
|412 | 46505| ExpectedError | Failed to change media access. | Use media access APIs only when your instance of `Call` has property `state` set to `connected`. |
|412| 46506 | UnexpectedClientError | Media access change failed as meeting capabilities are empty. | Gather browser console logs and contact Azure Communication Services support. |
|412| 46507 | ExpectedError | Azure Communication Services currently disabled this feature.  | Try the APIs in a couple of days. |
