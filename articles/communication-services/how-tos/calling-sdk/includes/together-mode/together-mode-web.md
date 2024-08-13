---
author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/17/2024
ms.author: cnwankwo
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]



`TogetherMode` is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:

```js
const togetherModeFeature = call.feature(Features.TogetherMode);
```

### Receive events when together mode stream is started or updated
You can subscribe to the event `togetherModeStreamsUpdated` to receive notifications when together mode is started or updated. The event contains information about added video stream that can be rendered. 

```js
// event : { added: TogetherModeVideoStream[]; removed: TogetherModeVideoStream[] }
togetherModeFeature.on('togetherModeStreamsUpdated', (event) => {
    event.added.forEach(async stream => {
        // stream can be rendered as a remote video stream
    });
});
```

### Get together mode stream
You can access together mode streams through the property `togetherModeStream`.

```js
const togetherModeStreams = togetherModeFeature.togetherModeStream;
```

| Together Mode Stream Properties | Description|
|----------------------------------------------|--------|
|id		| Unique number used to identify the stream. |
|mediaStreamType		| Returns the stream type of together mode. The value of `mediaStreamType` is always `video`. |
|isReceiving		| Returns a boolean value indicating if video packets are received.  |
|size		| 	Returns the size of the stream. The value indicates the quality of the stream. |

### Start together mode for all participants
Users with role organizer, co-organizer, or presenter can start together mode for everyone in the meeting. When together mode starts, all subscribers to `togetherModeStreamsUpdated` event receive notification that allows participants to render together mode.

```js
togetherModeFeature.start();
```
### End together mode

Together mode automatically ends for everyone when nobody subscribes to the video for 5 minutes. There's no API to end together mode.
### Get coordinates of participants in together mode
The property `togetherModeSeatingMap` provides coordinates for individual participants in the stream. Developers can use these coordinates to overlay participant info such as display name or visual features like spotlight, hand raised, and reactions on the stream. 

```js
// returns Map<string, TogetherModeSeatingPosition>
// where the  key is the participant ID
// and value of type TogetherModeSeatingPosition is the position relative to the sceneSize
// TogetherModeSeatingPosition {
//   top: number;
//   left: number;
//   width: number;
//   height: number;
// }
const seatingMap = togetherModeFeature.togetherModeSeatingMap;
```

### Manage scene size
The `sceneSize` property specifies the dimensions (width and height) of the HTML container that houses the `togetherMode` video stream. The seating positions of participants are calculated based on the dimensions of the scene size. If scene size isn't provided, the calculation defaults to a width of 1,280 pixels and a height of 720 pixels.

```js
const togetherModeContainerSize = { width: 500, height: 500 };

// To set the scene size
togetherModeFeature.sceneSize = togetherModeContainerSize;

// To get the scene size
console.log(`Current scene has the following size: ${JSON.stringify(togetherModeFeature.sceneSize )}`)
```

### Receive events when scene or seatings is updated
> [!NOTE]
> Only Microsoft 365 users with role organizer, co-organizer and presenter can change scene or assignment of participants in the together mode. These changes can only be done from Teams Client. 

If there's a scene change or seat reassignment, the `togetherModeSceneUpdated` or `togetherModeSeatingUpdated` events are raised respectively, providing an updated calculation of the participants’ seating positions.

```js
const seatUpdate = (participantSeatingMap) => {
    participantSeatingMap.forEach((participantID, seatingCoordinates) => {
        console.log(`User with ID: ${participantID} has new coordinates ${JSON.stringify(seatingCoordinates)} `)
    })
}

togetherModeFeature.on('togetherModeSceneUpdated', seatUpdate);
togetherModeFeature.on('togetherModeSeatingUpdated', seatUpdate);
```

## Troubleshooting
|code| Subcode | Result Category | Reason | Resolution |
|----------------------------------------------|--------|--------|---------|----------|
|403		| 46303	| ExpectedError  | The participant’s role doesn’t have the necessary permissions to invoke the `togetherMode` start API. | Only Microsoft 365 users with role organizer, co-organizer and presenter can start together mode. You can check the role of a user via 'role' property on instance of `Call` class. |
|403	| 46304 | ExpectedError  | Together mode was started in an unsupported calling scenario.  | Ensure together mode is started only in group call or meeting scenarios. |
|403 | 46306	| ExpectedError | Together mode `start` API was called by an Azure Communication Services user.  | Only Microsoft 365 users with role organizer, co-organizer and presenter can start together mode. |
