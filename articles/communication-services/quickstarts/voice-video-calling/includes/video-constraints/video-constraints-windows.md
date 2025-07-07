---
ms.author: chengyuanlai
title: Set video constraints in a Windows calling app
titleSuffix: An Azure Communication Services document
description: This article describes how to set video constraints in your existing Windows calling app using Azure Communication Services.
author: sloanster
services: azure-communication-services
ms.date: 06/26/2025
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

## Overview

The Video Constraints API enables developers to control the video quality from within their video calls. In this quickstart guide, we illustrate how to use the API to set the constraints.

### Prerequisites

Refer to the [Voice Calling Quickstart](../../getting-started-with-calling.md?pivots=platform-windows) to set up a sample app with voice calling.

### Classes

| Name | Description |
| --- | --- | 
| VideoConstraints | Used to hold both incoming video constraints and outgoing video constraints. |
| OutgoingVideoConstraints | Used to specify constraints (`MaxWidth \| MaxHeight \| MaxFrameRate`) for outgoing video streams. | 
| IncomingVideoConstraints | Used to specify constraints (`MaxWidth \| MaxHeight`) for incoming video streams. | 

### Using video constraints

The following sections explain how the video constraints can be set for incoming and/or outgoing video streams at different times of a call.

#### Set video constraints before starting a call

For *incoming* video streams, an `IncomingVideoConstraints` needs to be added to the `IncomingVideoOptions`.
```csharp
    var IncomingVideoOptions = new IncomingVideoOptions()
    {
        Constraints = new IncomingVideoConstraints() 
        { 
            MaxWidth = /*value*/, 
            MaxHeight = /*value*/ 
        },
        // other options
        // ...
    }
```

For *outgoing* video streams, an `OutgoingVideoConstraints` needs to be added to the `OutgoingVideoOptions`.

```csharp
    var OutgoingVideoOptions = new OutgoingVideoOptions()
    {
        Constraints = new OutgoingVideoConstraints() 
        { 
            MaxWidth = /*value*/, 
            MaxHeight = /*value*/, 
            MaxFrameRate = /*value*/ 
        },
        // other options
        // ...
    }
```

Since the options are used to start/join a call, the constraints can then be applied to the streams automatically. For example:

```csharp
    var joinCallOptions = new JoinCallOptions()
    {
        IncomingVideoOptions = new IncomingVideoOptions()
        {
            Constraints = new IncomingVideoConstraints() 
            { 
                MaxWidth = /*value*/, 
                MaxHeight = /*value*/ 
            },
            // other options
            // ...
        },

        OutgoingVideoOptions = new OutgoingVideoOptions()
        {
            Constraints = new OutgoingVideoConstraints() 
            { 
                MaxWidth = /*value*/, 
                MaxHeight = /*value*/, 
                MaxFrameRate = /*value*/ 
            },
            // other options
            // ...
        }
    };
    await callAgent.JoinAsync(locator, joinCallOptions);
```

#### Set video constraints during a call
Instead of setting the video constraints before starting a call, you can also dynamically adjust the video constraints during a call. You need to call `SetVideoConstraints` on your `Call` type class and provide the constraints.
```csharp

    OutgoingVideoConstraints outgoingVideoConstraints = new OutgoingVideoConstraints()
    {
        outgoingVideoConstraints.MaxWidth = /*value*/ ;
        outgoingVideoConstraints.MaxHeight = /*value*/ ;
        outgoingVideoConstraints.MaxFrameRate = /*value*/ ;
    };
    
    IncomingVideoConstraints incomingVideoConstraints = new IncomingVideoConstraints()
    {
        incomingVideoConstraints.MaxWidth = /*value*/ ;
        incomingVideoConstraints.MaxHeight = /*value*/ ;
    };
  
    VideoConstraints constraints = new VideoConstraints();
    constraints.OutgoingVideoConstraints = outgoingVideoConstraints;
    constraints.IncomingVideoConstraints = incomingVideoConstraints;
    
    call.SetVideoConstraints(constraints);
```

To reset/remove the video constraints you previously set, you have to follow the preceding pattern and provide `0` as a constraint value. Providing `null` values for either `IncomingVideoConstraints` or `OutgoingVideoConstraints` doesn't reset/remove the constraints and the constraints with a `null` value are ignored. 


### Limitations

> [!NOTE]
> Be aware of these limitations when using the Video Constraints API. Some of the limitations should be resolved in future releases.

There are some known limitations to the current Video Constraints API. 

* The constraint is a **max** constraint, which means the possible constraint value can be the specified value or smaller. There's no guarantee that the actual value remains the same as user-specified.

* When the user sets a constraint value that is too small, the SDK uses the smallest available value that is supported.

* For setting `OutgoingVideoConstraints` during a call, the current ongoing video stream doesn't automatically pick up the constraints specified. In order to make the constraints take effect, you need to stop and restart the outgoing video.

* `IncomingVideoConstraints` currently is a user-preferred constraint instead of a hard constraint, which means that depending on your network and hardware, the actual value received might still exceed the constraint set.

### Media stats
To evaluate and compare the video quality after applying the video constraints, you can access [MediaStats API](../../../../concepts/voice-video-calling/media-quality-sdk.md) to get video resolution and bitrate information of the stream. The media stats also include other granular stats related to the streams, such as jitter, packet loss, round trip time, etc.