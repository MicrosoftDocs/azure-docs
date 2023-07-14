---
ms.author: chengyuanlai
title: Quickstart - Set video constraints in your Android calling app
titleSuffix: An Azure Communication Services document
description: In this quickstart, you'll learn how to set video constraints in your existing Android calling app using Azure Communication Services.
author: sloanster
services: azure-communication-services
ms.date: 07/10/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

The Video Constraints API enables developers to control the video quality from within their video calls. In this quickstart guide, we'll illustrate how to use the API to set the constraints.


[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

### Prerequisites
Refer to the [Voice Calling Quickstart](../../getting-started-with-calling.md?pivots=platform-android) to set up a sample app with voice calling.

### Classes
| Name | Description |
| - | - | 
| VideoConstraints | Used to hold both incoming video constraints and outgoing video constraints. |
| OutgoingVideoConstraints | Used to specify constraints (`maxWidth | maxHeight | maxFrameRate`) for outgoing video streams. | 
| IncomingVideoConstraints | Used to specify constraints (`maxWidth | maxHeight`) for incoming video streams. | 

### Using video constraints

The follow sections will explain how the video constraints can be set for incoming and/or outgoing video streams at different times of a call.

#### Set video constraints before starting a call

For *incoming* video streams, an `IncomingVideoConstraints` needs to be added to the `IncomingVideoOptions`.
```java
    IncomingVideoConstraints incomingVideoConstraints = new IncomingVideoConstraints();
    incomingVideoConstraints.setMaxWidth(/*value*/);
    incomingVideoConstraints.setMaxHeight(/*value*/);

    // ...

    IncomingVideoOptions incomingVideoOptions = new IncomingVideoOptions();
    incomingVideoOptions.setConstraints(incomingVideoConstraints);
```

For *outgoing* video streams, an `OutgoingVideoConstraints` needs to be added to the `OutgoingVideoOptions`.
```java
    OutgoingVideoConstraints outgoingVideoConstraints = new OutgoingVideoConstraints() 
    outgoingVideoConstraints.setMaxWidth(/*value*/); 
    outgoingVideoConstraints.setMaxHeight(/*value*/); 
    outgoingVideoConstraints.setMaxFrameRate(/*value*/); 
   
    // ...
    
    OutgoingVideoOptions outgoingVideoOptions = new OutgoingVideoOptions();
    outgoingVideoOptions.setConstraints(outgoingVideoConstraints);
```

Since the options will be used to start/join a call, the constraints will then be applied to the streams automatically. For example:
```java
    JoinCallOptions joinCallOptions = new JoinCallOptions();
    joinCallOptions.setIncomingVideoOptions(incomingVideoOptions);
    joinCallOptions.setOutgoingVideoOptions(outgoingVideoOptions);
    callAgent.Join(context, locator, joinCallOptions);
```

#### Apply video constraints during a call
Instead of setting the video constraints before starting a call, you can also dynamically adjust the video constraints during a call. In order to do this, you will need to call `applyVideoConstraints` on your `Call` type class and provide the constraints.
```java

    OutgoingVideoConstraints outgoingVideoConstraints = new OutgoingVideoConstraints();
    outgoingVideoConstraints.setMaxWidth(/*value*/); 
    outgoingVideoConstraints.setMaxHeight(/*value*/); 
    outgoingVideoConstraints.setMaxFrameRate(/*value*/); 
    
    IncomingVideoConstraints incomingVideoConstraints = new IncomingVideoConstraints();
    incomingVideoConstraints.setMaxWidth(/*value*/);
    incomingVideoConstraints.setMaxHeight(/*value*/);
  
    VideoConstraints constraints = new VideoConstraints();
    constraints.setOutgoingVideoConstraints(outgoingVideoConstraints);
    constraints.setIncomingVideoConstraints(incomingVideoConstraints);
    
    call.applyVideoConstraints(constraints);
```

Please note, if you want to reset/remove the video constraints you previously set, you have to follow the above pattern and provide `0` as a constraint value. Providing `null` values for either `IncomingVideoConstraints` or `OutgoingVideoConstraints` will not reset/remove the constraints but simply be ignored. 

### Limitations

> [!NOTE]
> Please make sure you are aware of these limitations when using the Video Constraints API. 
> Some of the limitations will be removed in future releases.

There are some known limitations to the current Video Constraints API. 

1. The constraint is a **max** constraint, which means the possible constraint value can be the specified value or smaller. There is no gurantee that the actual value will remain the same as user-specified.

2. When the user sets a constraint value that is too small, the SDK will choose the smallest available value that is supported.

3. For setting `OutgoingVideoConstraints` during a call, the current ongoing video stream will not automatically pick up the constraints specified. In order to make the constraints take effect, you need to stop and restart the outgoing video.

4. `IncomingVideoConstraints` currently is a user-preferred constraint instead of a hard constraint, which means that depending on your network and hardware, the actual value received may still exceed the constraint set.

### Media stats
To evaluate and compare the video quality after applying the video constraints, you can access [MediaStats API](./media-quality-sdk.md) to get video resolution and bitrate information of the stream. The media stats also include other granular stats related to the streams, such as jitter, packet loss, round trip time, etc.