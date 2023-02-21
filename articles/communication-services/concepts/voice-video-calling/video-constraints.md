---
title: Azure Communication Services Video constraints
titleSuffix: An Azure Communication Services concept document
description: Overview of Video Constraints
author: sloanster
ms.author: micahvivion
manager: nmurav

services: azure-communication-services
ms.date: 2/20/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Video Constraints

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include.md)]

Video Constraints API enables developers to set video constraints.
There are some scenarios we don't have to send higher resolution video.
For example, you may only want to provide low resolution video stream in a screen-sharing application.
Also, when video quality isn't a top priority, you may want to limit the video bandwidth usage in the application.

Currently we only support the max video resolution constraint on the sender side in the beginning of a call.
Other constraints, such as max fps or max bandwidth isn't supported at this moment.
We don't support changing constraints dynamically in a call as well.
However, we'll be enabling these capabilities in the future.

> [!NOTE]
> Video Constraints is currently supported only for our JavaScript / Web SDK, and is available starting on the version [1.11.0-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.11.0-beta.1) of the Calling SDK.

## Using Video Constraints

The video constraints setting is implemented on `Call` interface.
To use the Video Constraints, we can specify the constraints in CallOptions when we make a call, accept a call, or join a call.
To make the constraints work, you also have to specify `localVideoStreams` in `videoOptions`. The constraint doesn't work if you join a call with audio only option and turn on the camera later.

```javascript
const callOptions = {
    videoOptions: {
        localVideoStreams: [...],
        constraints: {
            send: {
                height: {
                    max: 240
                }
            }
        }
    },
    audioOptions: {
        muted: false
    }
};
// make a call
this.callAgent.startCall(identitiesToCall, callOptions);
// join a group call
this.callAgent.join({ groupId }, callOptions);
// accept an incoming call
this.incomingCall.accept(callOptions)
```

Video constraints types are described as follows:
```javascript
export declare interface VideoOptions {
    localVideoStreams?: LocalVideoStream[];
    //video constraint when call starts
    constraints?: VideoConstraints;
};
export declare type VideoConstraints = {
    send?: VideoSendConstraints;
};
export declare type VideoSendConstraints = {
    height?: MediaConstraintRange;
};
export declare type MediaConstraintRange = {
    max?: number;
};
```

### Sender Max Video Resolution Constraint

With sender max video resolution constraint, you can limit the max video resolution of the sending stream.
The value you have to provide for this constraint is `height`.

```javascript
{
    localVideoStreams: [...],
    constraints: {
        send: {
            height: {
                max: 240
            }
        }
    }
}
```
In SDK, we choose the nearest resolution that falls within the constraint, so sent height doesn't exceed the constraint value.
There's an exception - when provided constraint value is too small, SDK chooses the smallest available resolution. In this case, the height of chosen resolution can be larger than the constraint value.

> [!NOTE]
> The resolution constraint is a `max` constraint, which means the possible resolutions can be the specified resolution or smaller.
> There is no gurantee that the sent video resolution will remain at the specified resolution.
> This sender max video resolution constraint is supported on Desktop browsers and iOS Safari.

The `height` in `VideoSendConstraints` has a different meaning when the mobile device is in portrait mode. In portrait mode, this value indicates the shorter side of the device. For example, specifying `constraints.send.height.max` value with 240 on a 1080(W) x 1920(H) device in portrait mode, the constraint height is on 1080(W) side. When the same device is in landscape mode (1920(W) x 1080(H)), the constraint is on 1080(H) side.

If you use MediaStats API to track the sent video resolution, you may find out that the sent resolution can change during the call. It can go up and down, but should be equal or smaller than the constraint value you provide. This resolution change is an expected behavior. The browser also has some degradation rule to adjust sent resolution based on cpu or network conditions.

### Media stats
To evaluate and compare the video quality after applying the video constraints, you can access [MediaStats API](./media-quality-sdk.md) to get video resolution and bitrate information of the sending stream. The media stats also include other granular stats related to the streams, such as jitter, packet loss, round trip time, etc.

```javascript
const mediaStatsFeature = call.feature(Features.MediaStats);
const mediaStatsCollector = mediaStatsFeature.createCollector();

mediaStatsCollector.on('sampleReported', (sample: SDK.MediaStatsReportSample) => {
    // process the stats for the call.
    console.log(sample);
});
```

## Next steps
For more information, see the following articles:

- [Enable Media Quality Statistics in your application](./media-quality-sdk.md)
- Learn about [Calling SDK capabilities](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
