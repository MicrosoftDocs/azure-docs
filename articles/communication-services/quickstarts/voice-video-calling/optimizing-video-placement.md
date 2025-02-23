---
ms.author: micahvivion
title: Guidelines for Placing Videos on a Web Page Based on Resolution Size
titleSuffix: An Azure Communication Services quickstart
description: This document provides comprehensive guidelines for placing videos on a web page based on resolution size to optimize video placement and enhance overall page performance.
author: sloanster
services: azure-communication-services
ms.date: 02/23/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other, devx-track-js
---

# Guidelines for Placing Videos on a Web Page Based on Resolution Size
A crucial element to consider when building web pages understanding is how videos can be integrated into the webpage layout. The placement and number of videos can significantly impact the page's performance, user quality experience, and overall aesthetic. We explore guidelines for determining how many videos developers can place on a web page and the optimal video resolution size so that end users can have an optimized quality experience.

## Understanding Screen Resolution
It's essential to understand what video resolution entails. Resolution refers to the number of pixels displayed on a video output, typically measured in width x height format. Higher resolution means more pixels, leading to sharper and clearer images. Incoming video resolutions available in Azure Communication Services video calling include:

- 1080p (Full HD): 1920 x 1080 pixels
- 720p (HD): 1280 x 720 pixels
- 540 (qHD): 960 x 540 pixels
- 360 (SD): 640 x 360 pixels
- 240: 426 x 240 pixels
- 240: 320 x 240 pixels

## Factors Influencing Video Placement
Several factors influence how many videos you can effectively place on a web page, including resolution, device type, bandwidth, and user experience considerations.

### Local device abilities
The type of device used to display the web page plays a significant role. For instance, desktops and laptops with larger screens can accommodate more videos than mobile devices. It's advisable to use responsive design techniques to adjust the number and sizes of videos based on screen dimensions. Additionally, the local machine must process, encode, and display these videos properly. The size of the local monitor screen and browser abilities also determine the number of active videos that can be displayed simultaneously on a web page. Therefore, all these factors must be considered when developing the concept of happy pages to embed on a web page.

### Resolution and Video size
The higher the resolution of the end users display means the more videos you can display in their current web view. However, this doesn't mean filling every pixel with videos. The goal is to balance quality and performance. As you place more videos to be displayed on a page, you must consider more incoming and outgoing bandwidth that are used.

### Internet Bandwidth Considerations
To best understand an end user's internet speed capabilities, It's essential to grasp the basics of how internet speeds are measured and what factors can influence them. Internet speeds are typically measured in megabits per second (Mbps), which indicates the rate at which data is downloaded or uploaded. Several factors can affect these speeds, including the type of internet connection (fiber, cable, wifi, cellular), the quality of the networking equipment (modem, router), and the number of devices connected to the network.

When placing multiple videos on a web page, it's important to consider the user's internet bandwidth. Higher resolution videos require more data to stream. The more overall videos placed on a page, the more bandwidth each one consumes. If someone connects to the internet via a connection with lower overall bandwidth throughput, their ability to stream higher resolution videos or multiple videos on a page are limited. Conversely, if someone has higher internet bandwidth for both inbound and outbound traffic, they have a greater ability to deliver and consume high-resolution videos and accommodate more videos on the page.

### User Experience
Ultimately, the user experience should dictate how many videos are placed on a web page. Too many videos can lead to cluttering and distract from the primary content.

## Best Practices for Video Placement

### Prioritize Content
Highlight the most important or engaging videos prominently on the page. Ensure they're purposeful and effectively enhance the narrative or key people the page you intend to have video be viewable.

### Implement Lazy Loading

Lazy loading delays the loading of videos until they're needed or in the viewport. This method can significantly enhance page performance, especially when multiple videos are present.

### Utilize Optimal Video Count API

The Azure Communication Services WebJS SDK introduced the [Optimal Video Count (OVC)](../../how-tos/calling-sdk/manage-video.md?pivots=platform-web) feature in version 1.15.1. OVC informs applications how many incoming videos from different participants can be optimally rendered during a group call. The optimalVideoCount property adjusts dynamically based on network and hardware capabilities. Applications should update the number of videos rendered according to the output from OVC. The value from optimal video count (OVC) is updated every 10 seconds.

The optimalVideoCount feature is a call feature. You need to reference the feature OptimalVideoCount via the feature method of the Call object. You can then set a listener via the on method of the OptimalVideoCountCallFeature to be notified when the optimalVideoCount changes. To unsubscribe from the changes, you can call the off method. The current maximum number of incoming videos that can be rendered on a web page is 16. To properly support 16 incoming videos, the computer should have a minimum of 16GB RAM and a 4-core or greater CPU that is no older than 3 years old.

```javascript
const optimalVideoCountFeature = call.feature(Features.OptimalVideoCount);
optimalVideoCountFeature.on('optimalVideoCountChanged', () =\> {
    const localOptimalVideoCountVariable = optimalVideoCountFeature.optimalVideoCount;
})
```

Developers should ensure that their application subscribes to changes in the Optimal Video Count in group calls. The optimal video count returns an integer defining the ideal number of videos that can be displayed on a web page. When there's a change in the optimal video count, if the result indicates increased capacity on the local computer for more incoming videos, you can create a new renderer using the [createView method](javascript/api/azure-communication-services/@azure/communication-calling/videostreamrenderer?view=azure-communication-services-js&preserve-view=true#@azure-communication-calling-videostreamrenderer-createview) to display more incoming video streams on the page. Conversely, if the optimal count decreases and is [less than the current number of videos on the page](../../resources/troubleshooting/voice-video-calling/video-issues/reaching-max-number-of-active-video-subscriptions.md), you should consider disposing of a video using the dispose method and updating the application layout accordingly.

## Guidelines for the Maximum Video Size on a Page

In the current version 1.33 of the WebJS SDK:

- You can place one 1080P incoming video with the rest smaller than 1080P.
- You can place two 720P incoming videos with the rest smaller than 720P.

| Version          | 1080P Videos                         | 720P Videos                         |
|------------------|--------------------------------------|-------------------------------------|
| 1.32 and earlier | 1 (with the rest smaller than 1080P) | 1 (with the rest smaller than 720P) |
| 1.33             | 1 (with the rest smaller than 1080P) | 2 (with the rest smaller than 720P) |

For instance, in a group call where seven participants have their video cameras on, on each client page you can select two participants' videos are displayed at higher resolutions. These two participants set to show their video at 720P by setting their views on the web page to be 720 pixels in height by 1280 pixels in width (or greater). The remaining five participants' videos should be set to a lower resolution, such as 360P or lower.

Items to Note:

- It's crucial to review and adhere to the [Optimal Video Count (OVC)](../../how-tos/calling-sdk/manage-video.md?pivots=platform-web) to ensure that the total number of rendered videos remains below the OVC threshold.
- Each client can specify which user's video they want to receive and set individual resolution sizes on their respective machines.
- It's important to note that each participant's ability to send a specific video resolution can vary. Some computers are equipped with higher quality cameras, enabling them to transmit a 1080p video. Conversely, some mobile browsers may have lower video transmission capabilities, such as only 540p. If you embedded the video resolution to be 1080p or 720p in a page, the incoming video may not match that resolution. In this case, a video stream is upscaled. to fill the video renderer size.
- Azure Communication Services video [Simulcast](../../concepts/voice-video-calling/simulcast.md) ability enhances video streaming by enabling a single video to delivered by an end client at multiple resolutions and bitrates simultaneously. This functionality allows viewers with varying network conditions to select which video rendition to select to receive for the best possible video quality without buffering or interruptions. By optimizing bandwidth usage, simulcast sends higher resolution streams only to users who can support them, thereby minimizing unnecessary data transmission. This improves the overall user experience by providing stable and consistent video quality and enables adaptive streaming. However, It's important to note that simulcast isn't supported on all browser devices. Currently, simulcast is unavailable when sending videos on mobile browsers or macOS Safari. If a participant attempts to render 720p video from a user on iOS Safari, Android Chrome, or macOS Safari, but another participant on the call tries to render the same video at a smaller resolution, both receive the smaller resolution. This is because those devices prioritize smaller resolutions when simulcast send are unsupported.  

## Conclusion
Determining how many videos to place on a web page requires careful consideration of resolution, device type, bandwidth, and user experience. By following these guidelines and best practices, developers can create web pages that not only look appealing but also function seamlessly, providing an optimal viewing experience for users across various devices and connection speeds.
