---
author: fuyan
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/24/2024
ms.author: fuyan
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

The media access feature allows organizer or presenters to prevent attendees from unmuting or turn on video themselves during a Microsoft Teams meeting.
You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:

```js
const mediaAccessFeature = call.feature(Features.MediaAccess);
```

### Forbid or permit audio and video for Teams meeting attendees:
To change the Media access state for an attendee, you can use the `forbidAudio()`, `permitAudio()`,  `forbidVideo()`, and `permitVideo()` methods.
This is async methods, to verify results can be used `mediaAccessChanged` listeners.
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

### Forbid orpermit media access for other participants
This feature allows users with the Organizer and Presenter roles to forbid media access for other participants on Teams calls. In Azure Communication calls, changing the state of other participants is not allowed unless roles have been added.

To use this feature, you can use the following code:
```js
const mediaAccessFeature = call.feature(Features.MediaAccess);
//forbid all attendees audio
mediaAccessFeature.forbidRemoteParticipantsAudio();
//or we can provide array of CommunicationIdentifier to specify list of participants
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>)
CommunicationIdentifier participants[] = new CommunicationIdentifier[]{ acsUser, teamsUser };
mediaAccessFeature.forbidAudio(participants);
```

### Handle changed states
With the Raise Hand API, you can subscribe to the `mediaAccessChanged` events to handle changes in the state of participants on a call. These events are triggered by a call instance and provide information about the participant whose state has changed.

To subscribe to these events, you can use the following code:
```js
const mediaAccessFeature = call.feature(Features.MediaAccess);

// event : {mediaAccesses: MediaAccess[]}
const mediaAccessChangedHandler = (event) => {
    console.log(`Latest media access states ${event.mediaAccesses}`);
};
mediaAccessFeature.on('mediaAccessChanged', mediaAccessChangedHandler):
```
The `mediaAccessChanged` event contains an object with the `mediaAccesses` property, which represents the participant's media accesses. In the example above, we log a message to the console indicating the latest media accesses for all participants.

To unsubscribe from the events, you can use the `off` method.

### List of all remote participants media access state
To get information about all remote participants media access state on current call, you can use the `getRemoteParticipantsMediaAccess` api.
Here's an example of how to use the `getRemoteParticipantsMediaAccess` API:
```js
const mediaAccessHandFeature = call.feature(Features.MediaAccess);
let remoteParticipantsMediaAccess = mediaAccessHandFeature.getRemoteParticipantsMediaAccess();
```

