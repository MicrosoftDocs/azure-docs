---
title: Quickstart - Add live stream to your app
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to add live stream calling capabilities to your app using Azure Communication Services.
author: sharifrahaman
services: azure-communication-services

ms.author: srahaman
ms.date: 06/30/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

# Live Stream quickstart

Live streaming will empower Contoso to engage thousands of online attendees by adding interactive live audio and video streaming functionality into their web and 
mobile applications that their audiences will love, no matter where they are. Interactive Live Streaming is the ability to broadcast media content to thousands of online 
attendees while enabling some attendees to share their live audio and video, interact via chat, and engage with metadata content such as reactions, polls, quizzes, ads, etc.

## Prerequisites
[!INCLUDE [Public Preview](../../includes/private-preview-include-section.md)]

-[Rooms](../rooms/get-started-rooms.md)

>[!IMPORTANT]
> The quick start examples here are available with the private preview version [1.*.*-alpha.*](https://www.npmjs.com/package/@azure/communication-calling/v/1.*.*-alpha.*) of the calling Web SDK. Make sure to use that version when trying this quickstart.

## Live Streaming with Rooms
Rooms prticipants will have four roles: 
1. Organizer 
2. Presenter
3. Attendee 
4. Consumer 

Participant with `Consumer` roles will be receving only the live stream. We can use open or closed Rooms to start live streaming. In Open Rooms the default role is `Consumer`.


### Place a Rooms call (start live streaming)
Live streaming will start when the Rooms call started.

```js
const context = { roomId: '<RoomId>' }

const call = callAgent.join(context);
```

### Receive Live Stream
Contoso can use the `Features.LiveStream` to get the live stream and play it.

```typescript
call.feature(Features.LiveStream).on('liveStreamsUpdated', e => {
    // Subscribe to new live video streams that were added.
    e.added.forEach(liveVideoStream => {
        subscribeToLiveVideoStream(liveVideoStream)
    });
    // Unsubscribe from live video streams that were removed.
    e.removed.forEach(liveVideoStream => {
        console.log('Live video stream was removed.');
    }
);

const subscribeToLiveVideoStream = async (liveVideoStream) => {
    // Create a video stream renderer for the live video stream.
    let videoStreamRenderer = new VideoStreamRenderer(liveVideoStream);
    let view;
    const renderVideo = async () => {
        try {
            // Create a renderer view for the live video stream.
            view = await videoStreamRenderer.createView();
            // Attach the renderer view to the UI.
            liveVideoContainer.hidden = false;
            liveVideoContainer.appendChild(view.target);
        } catch (e) {
            console.warn(`Failed to createView, reason=${e.message}, code=${e.code}`);
        }	
    }

    // Live video stream is available during initialization.
    await renderVideo();
};

```

### Count Participants in both Real-time and Streaming Media Lane
Web SDK already exposed `Call.totalParticipantCount` (available in beta release) which includes all participants count (Organizer, Presenter, Attendee, Consumer, Participants in the lobby etc.). We are added new API `Call.feature(Features.LiveStream).participantCount` under the `LiveStream` feature to have the count of streaming participants.

```typescript
call.feature(Features.LiveStream).on('participantCountChanged', e => {
    // Get current streaming participant count.
    Call.feature(Features.LiveStream).participantCount;
);
```

`call.feature(Features.LiveStream).participantCount` represents the total count of participants in streaming media lane. Contoso can find out the count of participants in real-time media lane by subtracting from the total participants. So, number of real-time media participants = `call.totalParticipantCount` - `call.feature(Features.LiveStream).participantCount`.

## Next steps
For more information, see the following articles:

- Check out our [calling hero sample](../../samples/calling-hero-sample.md)
- Get started with the [UI Library](https://aka.ms/acsstorybook)
- Learn about [Calling SDK capabilities](./getting-started-with-calling.md?pivots=platform-web)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)
