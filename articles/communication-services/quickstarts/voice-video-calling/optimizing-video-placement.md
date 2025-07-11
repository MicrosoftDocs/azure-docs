---
ms.author: micahvivion
title: Place video on a web page based on resolution size
titleSuffix: An Azure Communication Services quickstart
description: This document describes how to place video on a web page based on resolution size to optimize video placement and enhance overall page performance.
author: sloanster
services: azure-communication-services
ms.date: 06/06/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other, devx-track-js
---

# Best practices for subscribing to video feeds

A crucial element to consider when building web apps is how to best integrate video into the page layout. The placement and number of videos can impact page performance, user quality experience, and overall aesthetic. This article includes guidelines to help developers determine how many videos to place on a web page and the best video resolution size to optimize the end user experience.

## Understanding video resolution

Developers need to know important details about video resolution. Resolution refers to the number of pixels displayed on a video output, typically measured in `width x height` format. Higher resolution means more pixels, leading to sharper and clearer images. Incoming video resolutions available in Azure Communication Services video calling include:

- 1080p (Full HD): 1920 x 1080 pixels
- 720p (HD): 1280 x 720 pixels
- 540p (qHD): 960 x 540 pixels
- 360p (SD): 640 x 360 pixels
- 240p: 426 x 240 pixels
- 180p: 320 x 180 pixels

## Factors influencing video quality

Several factors influence how many videos you can effectively place on a web page. These factors include device type, resolution, bandwidth available, and user experience considerations.

### Local device abilities

The type of device used to display the web page plays a significant role. For example, desktops and laptops with larger screens can accommodate more videos than mobile devices. We recommend using [responsive design techniques](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) to adjust the number and sizes of videos based on screen dimensions.

In addition, the local machine must process, encode, and display these videos properly. The size of the local monitor screen and browser abilities also determine the number of active videos that can be displayed simultaneously on a web page.

### Resolution and video screen size

The display resolution of the end user device directly affects the number of videos you can display per page. The higher the resolution of the monitor and screen, the more videos you can display.

Remember that for each video you place on a page, the more internet bandwidth the videos require. In addition, the local machine must have sufficient performance capabilities to encode and display the video properly.

We recommend balancing the video quality and performance. Don't fill every pixel on the screen with video output, which can overwhelm the user. Consider the incoming and outgoing bandwidth as you add more videos to a page.

### Internet bandwidth considerations

To improve the end user experience, we need to understand how internet speeds are measured and what factors can influence them. Internet speeds are typically measured in megabits per second (Mbps), which indicates the rate at which data is downloaded or uploaded. Several factors can affect these speeds, including the type of internet connection (fiber, cable, wifi, cellular), the quality of the networking equipment (modem, router), and the number of devices connected to the network.

When placing multiple videos on a web page, consider the user's network bandwidth. Higher resolution videos require more data to stream. The more overall videos placed on a page, the more bandwidth each one consumes. If someone connects to the internet via a connection with lower overall bandwidth throughput, their ability to stream higher resolution videos or multiple videos on a page are limited. Conversely, if someone has higher internet bandwidth for both inbound and outbound traffic, they have a greater ability to deliver and consume high-resolution videos and accommodate more videos on the page.

## Methods to best optimize how you handle incoming video streams

### Use the Web UI Library

The Azure Communication Services [Web UI Library](../../concepts/ui-library/ui-library-overview.md) is a powerful tool for developers looking to create seamless and visually appealing web applications. The Web UI Library offers a comprehensive set of prebuilt UI components that are easy to integrate and highly customizable. This solution enables developers to focus on building functionality rather than designing from scratch.

The Web UI Library ensures consistent design standards across different projects and platforms, enhancing user experience and reducing development time. Its extensive documentation and active community support make it an excellent choice for both beginners and experienced developers. By applying the Web UI Library, you can streamline your workflow, create professional-quality interfaces, and deliver engaging web applications more efficiently. Also, using the Web UI Library removes the guesswork of determining how many videos you can optimally subscribe to at one time.

### Use optimal video count API

The Azure Communication Services WebJS SDK introduced the [Optimal Video Count (OVC)](../../how-tos/calling-sdk/manage-video.md?pivots=platform-web) that informs applications how many incoming videos from different participants can be optimally rendered during a group call. The `optimalVideoCount` property adjusts dynamically based on **network bandwidth** and **hardware capabilities**. The optimal video count returns an integer defining the ideal number of videos that can be displayed on a web page. Applications should update the number of videos rendered according to the output from OVC. Developers should ensure that their application subscribes to changes in the `Optimal Video Count` in group calls and adjust the number of videos being rendered on a web page dynamically based on the OVC count. The value from optimal video count (OVC) is updated every 10 seconds.

You need to reference the feature `OptimalVideoCount` via the feature method of the Call object. You can then set a listener via the on method of the `OptimalVideoCountCallFeature` to be notified when the `optimalVideoCount` changes. To unsubscribe from the changes, you can call the off method. The current maximum number of incoming videos that can be rendered on a web page is **16**. To properly support 16 incoming videos, the computer should have a minimum of 16-GB RAM and a 4-core or greater CPU that is no older than three years old.

```javascript
const optimalVideoCountFeature = call.feature(Features.OptimalVideoCount);
optimalVideoCountFeature.on('optimalVideoCountChanged', () =\> {
    const localOptimalVideoCountVariable = optimalVideoCountFeature.optimalVideoCount;
})
```

When there's a change in the optimal video count value, if the result indicates increased capacity on the local computer for more incoming videos, you can create a new incoming video using the [`createView`](/javascript/api/azure-communication-services/@azure/communication-calling/videostreamrenderer?view=azure-communication-services-js&preserve-view=true#@azure-communication-calling-videostreamrenderer-createview) method to display more incoming video streams to be displayed on the page.

Conversely, if the optimal count decreases and is [less than the current number of videos on the page](../../resources/troubleshooting/voice-video-calling/video-issues/reaching-max-number-of-active-video-subscriptions.md), consider disposing of a video using the dispose method and updating the application layout accordingly.

### Things to consider when adding a 1080p or 720p video to a page.

- You can place one 1080p incoming video with the rest smaller than 720p.
- You can place two 720p incoming videos with the rest smaller than 720p.

The WebJS calling SDK supports 1080p video streaming. To send a 1080p from a web desktop browser, you must use version 134.1 or higher of the [GA](https://www.npmjs.com/package/@azure/communication-calling) or [public preview](https://www.npmjs.com/package/@azure/communication-calling?activeTab=beta) caling SDK.

For instance, in a group call where seven participants have their video cameras on, on each client page you can select two participants' videos are displayed at higher resolutions. These two participants set to show their video at 720p by setting their views on the web page to be 720 pixels in height by 1280 pixels in width (or greater). The remaining five participant videos should be set to a lower resolution, such as 360p or lower.

- Please ensure that the total number of rendered videos does not exceed the OVC [Optimal Video Count (OVC)](../../how-tos/calling-sdk/manage-video.md?pivots=platform-web) value.
- Each client can choose the video feed from specific users and adjust the resolution size on their individual devices.
- Each participant's ability to send a specific video resolution can vary. Some computers are equipped with higher quality cameras, enabling them to transmit a 1080p video. Conversely, some mobile browsers have lower video transmission capabilities, such as only 540p. If you embedded the video resolution to be 1080p or 720p in a page, the incoming video might not match that resolution. In this case, the system upscales the video stream to fill the video renderer size.
- Currently, a maximum of two 720p video streams can be rendered on a web page. If more than two 720p streams are enabled, all 720p video renditions are streamed at 540p.
- The maximum number of incoming remote streams that can be subscribed to is 16 video streams plus 1 screen sharing on desktop browsers, and 4 video streams plus 1 screen sharing on web mobile browsers.
- Azure Communication Services video [Simulcast](../../concepts/voice-video-calling/simulcast.md) ability enhances video streaming by enabling a single video delivered by an end client at multiple resolutions and bitrates simultaneously.

   This function enables viewers with varying network conditions to select which video rendition to select to receive for the best possible video quality without buffering or interruptions. By optimizing bandwidth usage, simulcast sends higher resolution streams only to users who can support them. This behavior minimizes unnecessary data transmission. Simulcast improves the overall user experience by providing stable and consistent video quality and enables adaptive streaming.

   Simulcast isn't supported on all browsers, specifically mobile browsers and macOS Safari. If a participant using iOS Safari, Android Chrome, or macOS Safari renders a 720p video and another participant tries to render the same video at a lower resolution, both will receive the lower resolution. This happens because these devices prioritize smaller resolutions when simulcast sending is unsupported.

## How to configure to send a 1080p stream

When using the WebJS SDK to send video at a 1080p resolution, you must use the [Video Constraints API](../voice-video-calling/get-started-video-constraints.md?pivots=platform-web) and specify that you want to use 1080p. If the Video Constraints API isn't used and 1080p isn't specified, the default video stream resolution is 720p.

```javascript
    const callOptions = {
        videoOptions: {
            localVideoStreams: [...],
            constraints: {
                send: {
                    height: {
                        max: 1080
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
```

### Items to note when sending a 1080p video stream
* The camera in use should be capable of sending a 1080p video. To check what resolutions your camera supports, you can use the following JavaScript example to determine the available resolutions.

```javascript
async function getSupportedResolutions() {
  const constraints = {
    video: {
      width: { ideal: 4096 }, // Try to get the maximum width
      height: { ideal: 2160 } // Try to get the maximum height
    }
  };
 
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    
    console.log(`Supported resolution: ${settings.width}x${settings.height}`);
    
    // Stop the video track to release the camera
    videoTrack.stop();
  } catch (error) {
    console.error('Error accessing media devices.', error);
  }
}
 
getSupportedResolutions();
```

* The machine sending a 1080p must have a powerful enough machine to support sending a 1080p. 
* The client that is on the  receiver side (people accepting of a 1080p video) must have a video render HTML5 element capable of 1080p to accept 1080p. If any participants on the call don't have a 1080p element enabled to receive the video, the call will adjust and negotiate down to a smaller resolution.
* All the people on the call that are sending and receiving a 1080p video stream must have the bandwidth to support a 1080p stream.

| **Resolution** | **Min framerate** | **Max framerate** |  **Max bitrate**  |
|--|--|--|--|
| 1080p | 30 | 30 | 4 M |
| 720p | 30 | 30 | 2.5 M |
| 540p | 30 | 30 | 2 M |
| 360p | 30 | 30 | 1 M |
| 240p | 15 | 15 | 650 K |
| 180p | 7.5 | 15 | 250 K(350 K if 15 FPS)|

You can use the media quality statistics API within the WebJS SDK to determine the real time video send and receive resolution. See [here](../../concepts/voice-video-calling/media-quality-sdk.md?pivots=platform-web) for more details.

## Conclusion

To determine how many videos to place on a web page, you need to carefully consider resolution, device type, bandwidth, and user experience. Follow these guidelines and best practices to create web apps that not only look appealing but also function seamlessly, providing an optimal viewing experience for users across various devices and connection speeds.
