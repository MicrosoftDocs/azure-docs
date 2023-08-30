---
ms.author: enricohuang
title: Quickstart - Set video constraints in your web calling app
titleSuffix: An Azure Communication Services document
description: In this quickstart, you'll learn how to set video constraints in your existing web calling app using Azure Communication Services.
author: sloanster
services: azure-communication-services
ms.date: 07/13/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

The Video Constraints API enables developers to control the video quality from within their video calls. In this quickstart guide, we'll illustrate how to use the API to set the constraints.


[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

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
To evaluate and compare the video quality after applying the video constraints, you can access [MediaStats API](../../../../concepts/voice-video-calling/media-quality-sdk.md) to get video resolution and bitrate information of the sending stream. The media stats also include other granular stats related to the streams, such as jitter, packet loss, round trip time, etc.

```javascript
const mediaStatsFeature = call.feature(Features.MediaStats);
const mediaStatsCollector = mediaStatsFeature.createCollector();

mediaStatsCollector.on('sampleReported', (sample: SDK.MediaStatsReportSample) => {
    // process the stats for the call.
    console.log(sample);
});
```