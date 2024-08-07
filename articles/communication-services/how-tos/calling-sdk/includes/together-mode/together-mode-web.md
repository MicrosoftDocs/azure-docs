---
author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/17/2024
ms.author: cnwankwo
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

**For meeting and group call scenario the following API can be called only by Microsoft 365 users with the following role**

|APIs| Organizer | Co-Organizer | Presenter | Attendee |
|----------------------------------------------|--------|--------|--------|--------|
| start | ✔️ | ✔️  | ✔️ | |

`TogetherMode` is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:

```js
const togetherModeFeature = call.feature(Features.TogetherMode);
```

### Receive events when together mode stream is started or updated
To access the new video stream of participants in Together Mode, each participant must subscribe to the `togetherModeStreamsUpdated` event. This event provides a new video stream, which can then be rendered.

```js
// event : { added: TogetherModeVideoStream[]; removed: TogetherModeVideoStream[] }
togetherModeFeature.on('togetherModeStreamsUpdated', (event) => {
    event.added.forEach(async stream => {
        renderVideoStream(stream);
    });
});
```

### Get Together Mode Stream
You can access together mode streams through the property `togetherModeStream`.

```js
const togetherModeStreams = togetherModeFeature.togetherModeStream;
```

| Together Mode Stream Properties | Description|
|----------------------------------------------|--------|
|id		| unique number used to identify the stream. |
|mediaStreamType		| Returns the stream type. For together mode the mediaStreamType will be `video`. |
|isReceiving		| Returns a boolean value indicating if video packets are received.  |
|size		| 	The stream size. The higher the stream size, the better the video quality. |

### Start together mode for all participants
Users with role organizer, coorganizer, or presenter can start together mode for everyone in the meeting. When together mode starts, all subscribers to `togetherModeStreamsUpdated` event receives notification, that allows participants to render together mode.

```js
togetherModeFeature.start();
```

### Get Participants Seating Positions
The property `togetherModeSeatingMap` provides coordinates for individual participants in the stream. Developers can use these coordinates to provide an overlay on top of the stream with additional information about participants such as display name or render visual features such as spotlight, hand raised or reactions. 

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

### Set and Get Scene Size
The Scene Size refers to the width and height of the HTML container that holds the Together Mode video stream. The seating positions of participants are calculated based on the dimensions of the scene size. If this information isn't provided, the calculation defaults to a width of 1,280 pixels and a height of 720 pixels.

```js
const togetherModeContainerSize = { width: 500, height: 500 };

// To set the scene size
togetherModeFeature.sceneSize = togetherModeContainerSize;

// To get the scene size
console.log(`Current scene has the following size: ${JSON.stringify(togetherModeFeature.sceneSize )}`)
```

### Together Mode Scene and Seat Updated Events
> [!NOTE]
> Scene Change and Seat reassignment can only be done on Teams Client. 

In the event of a scene change or seat reassignment, the `togetherModeSceneUpdated` or `togetherModeSeatingUpdated` events are raised respectively, providing an updated calculation of the participants’ seating positions.

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
|403		| 46303	| ExpectedError  | Participant's role is not eligible to call the together mode start API | Ensure the participant calling the together mode start API has organizer, coorganizer, or presenter role |
|403	| 46304 | ExpectedError  | Together mode was started in an unsupported calling scenario  | Ensure together mode is started only in group call or meeting scenarios |
|403 | 46306	| ExpectedError | Together mode start API was called by a nonmicrosft M365 user  | Ensure together mode is started by a Microsoft M365 User |
