---
author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/17/2024
ms.author: cnwankwo
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]



Together Mode is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:

```js
const togetherModeFeature = call.feature(Features.TogetherMode);
```

### Receive events when Together Mode stream starts or updates
You can subscribe to the event `togetherModeStreamsUpdated` to receive notifications when Together Mode starts or updates. The event contains information about rendering the added video stream. 

```js
// event : { added: TogetherModeVideoStream[]; removed: TogetherModeVideoStream[] }
togetherModeFeature.on('togetherModeStreamsUpdated', (event) => {
    event.added.forEach(async stream => {
        // stream can be rendered as a remote video stream
    });
});
```

### Get Together Mode stream
You can access Together Mode streams through the property `togetherModeStream`.

```js
const togetherModeStreams = togetherModeFeature.togetherModeStream;
```

| Together Mode Stream Properties | Description|
|----------------------------------------------|--------|
|`id`		| Unique number used to identify the stream. |
|`mediaStreamType`		| Returns the Together Mode stream type. The value of `mediaStreamType` is always `video`. |
|`isReceiving`		| Returns a Boolean value indicating if video packets are received.  |
|`size`		| 	Returns the Together Mode stream size with information about the width and height of the stream in pixels. |

### Start Together Mode for all participants
Microsoft 365 users with role organizer, co-organizer, or presenter can start Together Mode for everyone in the meeting. When Together Mode starts, all subscribers to the `togetherModeStreamsUpdated` event receive notification that enables participants to render together mode.

```js
togetherModeFeature.start();
```
### End Together Mode
Together Mode will automatically terminate for all participants if no video stream is detected from any participant for a duration of one minute. There's no API to end Together Mode.

### Get coordinates of participants in Together Mode
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

### Receive events when scene or seatings updates
> [!NOTE]
> Only Microsoft 365 users with role organizer, co-organizer and presenter can change scene or assignment of participants in Together Mode. These changes can only be made from the Teams Client. 

If there's a scene change or seating, the `togetherModeSceneUpdated` or `togetherModeSeatingUpdated` events are raised respectively, providing an updated calculation of the participants’ seating positions.

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
|403		| 46303	| ExpectedError  | The participant’s role doesn’t have the necessary permissions to call the `togetherMode` start API. | Only Microsoft 365 users with role organizer, co-organizer and presenter can start Together Mode. You can check the role of a user via 'role' property on instance of `Call` class. |
|403	| 46304 | ExpectedError  | Together Mode started in an unsupported calling scenario.  | Ensure Together Mode is started only in group call or meeting scenarios. |
|403 | 46306	| ExpectedError | Together Mode `start` API called by an Azure Communication Services user.  | Only Microsoft 365 users with role organizer, co-organizer and presenter can start together mode. |
