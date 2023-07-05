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

# Video constraints

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include.md)]

The Video Constraints API is a powerful tool that enables developers to control the video quality from within their video calls. With this API, developers can set constraints on the video resolution to ensure that the video call is optimized for the user's device and network conditions. The ACS video engine is optimized to allow the video quality to change dynamically based on devices ability and network quality. But there might be certain scenarios where you would want to have tighter control of the video quality that end users will experience. For example, there might be cases when pushing the highest video quality isn't a top priority or you may want to limit the video bandwidth usage in the application. To support this, you can use the Video Constraints API to have tighter control video quality.

Another benefit of the Video Constraints API is that it enables developers to optimize the video call for different devices. For example, if a user is using an older device with limited processing power, developers can set constraints on the video resolution to ensure that the video call runs smoothly on that device

Currently ACS supports setting the maximum video resolution that a client will send. The maximum resolution is set at the start of the call and is static throughout the entire call. The sender max video resolution constraint is supported on Desktop browsers (Chrome, Edge, Firefox) and when using iOS Safari mobile browser.

> [!NOTE]
> Video Constraints is currently supported only for our JavaScript / Web SDK, and is available starting in version [1.11.0-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.11.0-beta.1) of the Calling SDK.

> [!NOTE]
> Future versions of the Video Contraint API will allow enhanced ability by giving control to set the maximum FPS and bitrate, as well as the ability to enforce the video constraint at different points of a call (and not just at the start of a video call).

## Using video constraints
The video constraints setting is implemented on the `Call` interface. To use the Video Constraints, you can specify the constraints from within CallOptions when you make a call, accept a call, or join a call. You will also have to specify `localVideoStreams` in `videoOptions`. Do note that constraints don't work if you join a call with audio only option and turn on the camera later.

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

### Sender max video resolution constraint

With sender max video resolution constraint, you can limit the max video resolution of the sending stream. The value you have to provide for this constraint is `height`.

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
When setting the maximum resolution video constraints, the SDK will choose the nearest resolution that falls within the constraint set (to prevent the resolution height doesn't exceed the maximum constraint value allowed). Also, when the resolution constraint value is too small, the SDK will choose the smallest available resolution. In this case, the height of chosen resolution can be larger than the constraint value.

> [!NOTE]
> The resolution constraint is a `max` constraint, which means the possible resolutions can be the specified resolution or smaller.
> There is no gurantee that the sent video resolution will remain at the specified resolution.

The `height` in `VideoSendConstraints` has a different meaning when a mobile device is in portrait mode. In portrait mode, this value indicates the shorter side of the device. For example, specifying `constraints.send.height.max` value with 240 on a 1080(W) x 1920(H) device in portrait mode, the constraint height is on the 1080(W) side. When the same device is in landscape mode (1920(W) x 1080(H)), the constraint is on the 1080(H) side.

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
