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

You can set video constraints in your calls to control the video quality based on resolution or frameRate or bitrate in your video calls. In this quickstart guide, we'll illustrate how to set video constraints at the start of a call and how to use our `setConstraints` method on the call object to set video constraints dynamically during the call.


[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

> [!NOTE]
> Currently, we only support setting video send constraints. You cannot set video constraints on incoming videos at this point of time.

## Setting video constraints at the start of a call
The video constraints setting is implemented on the `Call` interface. To use the Video Constraints, you can specify the constraints from within `CallOptions` when you make a call, accept a call, or join a call. You will also have to specify `localVideoStreams` in `videoOptions`. <br/>
Do note that constraints don't work if you join a call with audio only option and turn on the camera later. In this case, you can set video constraints dynamically using the `setConstraints` method on the `Call` interface (guide below).

```javascript
const callOptions = {
    videoOptions: {
        localVideoStreams: [...],
        constraints: {
            send: {
                bitrate: {
                    max: 575000
                },
                frameHeight: {
                    max: 240
                },
                frameRate: {
                    max: 20
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

export type VideoSendConstraints = {
    /**
     * Resolution constraint
     */
    frameHeight?: MediaConstraintRange;

    /**
     * FrameRate constraint
     */
    frameRate?: MediaConstraintRange;

    /**
     * Bitrate constriant
     */
    bitrate?: MediaConstraintRange;
};

export declare type MediaConstraintRange = {
    max?: number;
};
```

When setting video constraints, the SDK will choose the nearest value that falls within the constraint set (to prevent the values for resolution, frameRate and bitrate to not exceed the maximum constraint values set). Also, when the resolution constraint value is too small, the SDK will choose the smallest available resolution. In this case, the height of chosen resolution can be larger than the constraint value.

> [!NOTE]
> For all `bitrate`, `frameHeight` and `frameRate`, the constraint value is a `max` constraint, which means the actual value in the call can be the specified value or smaller.
> There is no gurantee that the sent video resolution will remain at the specified resolution.

The `frameHeight` in `VideoSendConstraints` has a different meaning when a mobile device is in portrait mode. In portrait mode, this value indicates the shorter side of the device. For example, specifying `frameHeight.max` value with 240 on a 1080(W) x 1920(H) device in portrait mode, the constraint height is on the 1080(W) side. When the same device is in landscape mode (1920(W) x 1080(H)), the constraint is on the 1080(H) side.

If you use MediaStats API to track the sent video resolution, you may find out that the sent resolution can change during the call. It can go up and down, but should be equal or smaller than the constraint value you provide. This resolution change is an expected behavior. The browser also has some degradation rule to adjust sent resolution based on cpu or network conditions.

## Setting video constraints during the call
You can set video constraints during the call by using the `setConstraints` method on the `Call` object.
```javascript
// For eg, when you've started a call,
const currentCall = this.callAgent.startCall(identitiesToCall, callOptions);

// To set constraints during the call,
await currentCall.setConstraints({
    video: {
        send: {
            frameHeight: {
                max: 360
            },
            frameRate: {
                max: 15
            }
        }
    }
});

// To set only a particular constraint (the others will stay as what they were set before, if they were set)
await currentCall.setConstraints({
    video: {
        send: {
            bitrate: {
                max: 400000
            }
        }
    }
});

// To unset any constraint,
await currentCall.setConstraints({
    video: {
        send: {
            frameHeight: {
                max: 0
            }
        }
    }
});
```
> [!NOTE]
> Setting constraint value as `0` will unset any previously set constraints. You can use this way to reset or remove constraints.

<br/>

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