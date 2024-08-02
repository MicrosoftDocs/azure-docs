---
author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/17/2024
ms.author: cnwankwo
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

TogetherMode is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:

```js
const togetherModeFeature = call.feature(Features.TogetherMode);
```

### Together Mode Stream Updated Event
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
To obtain the Together Mode stream, invoke the specified API. Presently, Together Mode accommodates only a single stream. However, this limitation is expected to evolve in the future.

```js
const togetherModeStreams = togetherModeFeature.togetherModeStream; 
```

### Start together mode for all participants
Successful invocation of the start API is restricted to participants holding roles such as organizer, coorganizer, or presenter. Upon calling the start API, the `togetherModeStreamsUpdated` event is raised, resulting in a new video stream with all participants video sharing one background.

```js
togetherModeFeature.start();
```

### Get Participants Seating Positions
The specified API facilitates the retrieval of seating coordinates for participants. Given that the video of all participants is combined into a single video frame in Together Mode, these coordinates serve as essential positioning information.

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