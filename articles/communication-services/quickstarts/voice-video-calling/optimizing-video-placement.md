---
ms.author: micahvivion
title: Place video on a web page based on resolution size
titleSuffix: An Azure Communication Services quickstart
description: This document describes how to place video on a web page based on resolution size to optimize video placement and enhance overall page performance.
author: sloanster
services: azure-communication-services
ms.date: 02/25/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other, devx-track-js
---

# Place video on a web page based on resolution size

A crucial element to consider when building web pages is how to best integrate video into the page layout. The placement and number of videos can impact page performance, user quality experience, and overall aesthetic. This article includes guidelines to help developers determine how many videos to place on a web page and the best video resolution size to optimize the end user experience.

## Understand screen resolution

Developers need to know important details about video resolution. Resolution refers to the number of pixels displayed on a video output, typically measured in `width x height` format. Higher resolution means more pixels, leading to sharper and clearer images. Incoming video resolutions available in Azure Communication Services video calling include:

- 1080p (Full HD): 1920 x 1080 pixels
- 720p (HD): 1280 x 720 pixels
- 540p (qHD): 960 x 540 pixels
- 360p (SD): 640 x 360 pixels
- 240p: 426 x 240 pixels
- 240p: 320 x 240 pixels

## Factors that influence video placement

Several factors influence how many videos you can effectively place on a web page. These factors include resolution, device type, bandwidth, and user experience considerations.

### Local device abilities

The type of device used to display the web page plays a significant role. For example, desktops and laptops with larger screens can accommodate more videos than mobile devices. We recommend using responsive design techniques to adjust the number and sizes of videos based on screen dimensions.

In addition, the local machine must process, encode, and display these videos properly. The size of the local monitor screen and browser abilities also determine the number of active videos that can be displayed simultaneously on a web page.

Consider all these factors when developing the concept of happy pages to embed on a web page.

### Resolution and video size

The display resolution of the end user device directly affects the number of videos you can display per page. The higher the resolution, the more videos you can display.

We recommend balancing the video quality and performance. Don't fill every pixel on the screen with video output, which can overwhelm the user. Consider the incoming and outgoing bandwidth as you add more videos to a page.

### Internet bandwidth considerations

To improve the end user experience, we need to understand how internet speeds are measured and what factors can influence them. Internet speeds are typically measured in megabits per second (Mbps), which indicates the rate at which data is downloaded or uploaded. Several factors can affect these speeds, including the type of internet connection (fiber, cable, wifi, cellular), the quality of the networking equipment (modem, router), and the number of devices connected to the network.

When placing multiple videos on a web page, consider the user's network bandwidth. Higher resolution videos require more data to stream. The more overall videos placed on a page, the more bandwidth each one consumes. If someone connects to the internet via a connection with lower overall bandwidth throughput, their ability to stream higher resolution videos or multiple videos on a page are limited. Conversely, if someone has higher internet bandwidth for both inbound and outbound traffic, they have a greater ability to deliver and consume high-resolution videos and accommodate more videos on the page.

### User experience

Ultimately, the user experience determines how many videos you include on a web page. Too many videos can lead to cluttering and distract from the primary content.

## Best practices for video placement

### Prioritize content

Highlight the most important or engaging videos prominently on the page. Ensure they're purposeful and effectively enhance the narrative or key people the page you intend to have video be viewable.

### Implement lazy loading

Lazy loading delays the loading of videos until they're needed or in the viewport. This method can significantly enhance page performance, especially when multiple videos are present.

### Use optimal video count API

The Azure Communication Services WebJS SDK introduced the [Optimal Video Count (OVC)](../../how-tos/calling-sdk/manage-video.md?pivots=platform-web) feature in version 1.15.1. OVC informs applications how many incoming videos from different participants can be optimally rendered during a group call. The `optimalVideoCount` property adjusts dynamically based on network and hardware capabilities. Applications should update the number of videos rendered according to the output from OVC. The value from optimal video count (OVC) is updated every 10 seconds.

You need to reference the feature `OptimalVideoCount` via the feature method of the Call object. You can then set a listener via the on method of the `OptimalVideoCountCallFeature` to be notified when the `optimalVideoCount` changes. To unsubscribe from the changes, you can call the off method. The current maximum number of incoming videos that can be rendered on a web page is **16**. To properly support 16 incoming videos, the computer should have a minimum of 16-GB RAM and a 4-core or greater CPU that is no older than three years old.

```javascript
const optimalVideoCountFeature = call.feature(Features.OptimalVideoCount);
optimalVideoCountFeature.on('optimalVideoCountChanged', () =\> {
    const localOptimalVideoCountVariable = optimalVideoCountFeature.optimalVideoCount;
})
```

Developers should ensure that their application subscribes to changes in the `Optimal Video Count` in group calls. The optimal video count returns an integer defining the ideal number of videos that can be displayed on a web page.

When there's a change in the optimal video count value, if the result indicates increased capacity on the local computer for more incoming videos, you can create a new incoming video using the [`createView`](/javascript/api/azure-communication-services/@azure/communication-calling/videostreamrenderer?view=azure-communication-services-js&preserve-view=true#@azure-communication-calling-videostreamrenderer-createview) method to display more incoming video streams to be displayed on the page.

Conversely, if the optimal count decreases and is [less than the current number of videos on the page](../../resources/troubleshooting/voice-video-calling/video-issues/reaching-max-number-of-active-video-subscriptions.md), consider disposing of a video using the dispose method and updating the application layout accordingly.

## Determine the maximum video size for a page

In the current version 1.33 of the WebJS SDK:

- You can place one 1080p incoming video with the rest smaller than 1080p.
- You can place two 720p incoming videos with the rest smaller than 720p.

| Version          | 1080p Videos                         | 720p Videos                         |
|------------------|--------------------------------------|-------------------------------------|
| 1.32 and earlier | 1 (with the rest smaller than 1080p) | 1 (with the rest smaller than 720p) |
| 1.33             | 1 (with the rest smaller than 1080p) | 2 (with the rest smaller than 720p) |

For instance, in a group call where seven participants have their video cameras on, on each client page you can select two participants' videos are displayed at higher resolutions. These two participants set to show their video at 720p by setting their views on the web page to be 720 pixels in height by 1280 pixels in width (or greater). The remaining five participant videos should be set to a lower resolution, such as 360p or lower.

### Video size considerations

- To ensure that the total number of rendered videos remains below the OVC value threshold, review and adhere to the [Optimal Video Count (OVC)](../../how-tos/calling-sdk/manage-video.md?pivots=platform-web).
- Each client can specify which user's video they want to receive and set individual resolution sizes on their respective machines.
- Each participant's ability to send a specific video resolution can vary. Some computers are equipped with higher quality cameras, enabling them to transmit a 1080p video. Conversely, some mobile browsers have lower video transmission capabilities, such as only 540p. If you embedded the video resolution to be 1080p or 720p in a page, the incoming video might not match that resolution. In this case, the system upscales the video stream to fill the video renderer size.
- Currently, a maximum of two 720p video streams can be rendered on a web page. If more than two 720p streams are enabled, all 720p video renditions are streamed at 540p.
- Azure Communication Services video [Simulcast](../../concepts/voice-video-calling/simulcast.md) ability enhances video streaming by enabling a single video delivered by an end client at multiple resolutions and bitrates simultaneously.

   This function enables viewers with varying network conditions to select which video rendition to select to receive for the best possible video quality without buffering or interruptions. By optimizing bandwidth usage, simulcast sends higher resolution streams only to users who can support them. This behavior minimizes unnecessary data transmission. Simulcast improves the overall user experience by providing stable and consistent video quality and enables adaptive streaming.

   Simulcast isn't supported on all browser devices. Currently, simulcast is unavailable when sending videos on mobile browsers or macOS Safari. If a participant attempts to render 720p video from a user on iOS Safari, Android Chrome, or macOS Safari and another participant on the call tries to render the same video at a smaller resolution, both receive the smaller resolution. This change happens because the devices prioritize smaller resolutions when simulcast send isn't supported.  

## Conclusion

To determine how many videos to place on a web page, you need to carefully consider resolution, device type, bandwidth, and user experience. Follow these guidelines and best practices to create web pages that not only look appealing but also function seamlessly, providing an optimal viewing experience for users across various devices and connection speeds.
