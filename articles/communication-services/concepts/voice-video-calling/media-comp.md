---
title: Media Streaming and Composition
titleSuffix: An Azure Communication Services concept document
description: Introduces the Media Streaming and Composition
author: tophpalmer
manager: tophpalmer
services: azure-communication-services

ms.author: chpalm
ms.date: 11/01/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---
# Media Streaming and Composition
[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

Azure Communication Services Media Streaming and Composition enables you to build dynamic voice and video calling experiences at large scales, suitable for interactive streaming, virtual events, and broadcast scenarios. In a common video calling scenario, each participant is uploading several media streams captured from:

- Cameras
- Microphones
- Applications (screen sharing)

These media streams are typically arrayed in a grid and broadcast to call participants. Media Streaming and Composition allows you to extend and enhance this experience:

- Connect devices and services using streaming protocols such as [RTMP](https://datatracker.ietf.org/doc/html/rfc7016) or [SRT](https://datatracker.ietf.org/doc/html/draft-sharabayko-srt)
- Compose media streams into complex scenes

RTMP & SRT connectivity can be used for both input and output. Using RTMP/SRT input, a videography studio that emits RTMP/SRT can join an Azure Communication Services call. RTMP/SRT output allows you to stream media from Azure Communication Services into [Azure Media Services](/azure/media-services/latest/concepts-overview), YouTube Live, and many other broadcasting channels. The ability to attach industry standard RTMP/SRT emitters and to output content to RTMP/SRT subscribers for broadcasting transforms a small group call into a virtual event that reaches millions of people in real time.

Media Composition REST APIs (and open-source SDKs) allow you to command the Azure service to cloud compose these media streams. For example, a **presenter layout** can be used to compose a speaker and a translator together in a classic picture-in-picture style. Media Composition allows for all clients and services connected to the media data plane to enjoy a particular dynamic layout without local processing or application complexity.

 In the diagram below, three endpoints are participating actively in a group call and uploading media. Two users, one of which is using Microsoft Teams, are composed using a *presenter layout.*  The third endpoint is a television studio that emits RTMP into the call. The Azure Calling client and Teams client will receive the composed media stream instead of a typical grid. Additionally, Azure Media Services is shown here subscribing to the call's RTMP channel and broadcasting content externally.

:::image type="content" source="../media/media-comp.svg" alt-text="Diagram showing how media input is processed by the Azure Communication Services Media Composition services":::

This functionality is activated through REST APIs and open-source SDKs. Below is an example of the JSON encoded configuration of a presenter layout for the above scenario:

```json
{
   "layout": {
    "presenter": {
      "presenterId": "presenter",
      "supportId": "translatorSupport",
      "supportPosition": "topLeft",
      "supportAspectRatio": 3/2
    }
  }
}
```

The presenter layout is one of several layouts available through the media composition capability:

- **Grid** - The grid layout shows the specified media sources in a standard grid format. You can specify the number of rows and columns in the grid as well as which media source should be placed in each slot of the grid.
:::image type="content" source="../media/two-by-two-grid-layout.png" alt-text="A diagram showing an example of the grid layout.":::
- **Auto-Grid** - This layout automatically displays all the media sources in the scene in an optimized way. Unlike the grid layout, it does not allow for customizations on the number of rows and columns.
:::image type="content" source="../media/five-cell-auto-grid.png" alt-text="A diagram showing an example of the auto grid layout.":::
- **Presentation** - The presentation layout features a fixed media source, the presenter, covering the majority of the scene. The other media sources are arranged in either a row or column in the remaining space of the scene.
:::image type="content" source="../media/top-presentation.png" alt-text="A diagram showing an example of the presentation layout.":::
- **Presenter** - This is a picture-in-picture layout composed of two sources. One source is the background of the scene. This commonly represents the content being presented or the main presenter. The secondary source is cropped and positioned at a corner of the scene.
:::image type="content" source="../media/top-left-presenter.png" alt-text="A diagram showing an example of the presenter layout.":::
- **Custom** - You can customize the layout to fit your specific scenario. Media sources can have different sizes and be placed at any position on the scene.
:::image type="content" source="../media/custom-grid-with-single-cell-overlayed.png" alt-text="A diagram showing an example of the custom layout.":::
<!----To try out media composition, check out following content:----->

<!---- [Quick Start - Applying Media Composition to a video call](../../quickstarts/media-composition/get-started-media-composition.md) ----->
<!---- [Tutorial - Media Composition Layouts](../../quickstarts/media-composition/media-composition-layouts.md) ----->
