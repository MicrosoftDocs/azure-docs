---
title: Media Composition
titleSuffix: An Azure Communication Services concept document
description: Introduces the Media Composition feature
author: tophpalmer
manager: tophpalmer
services: azure-communication-services

ms.author: chpalm
ms.date: 11/01/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---
# Media Composition

Azure Communication Services Media Composition enables you to build more sophisticated voice and video calling experiences. In a common video calling scenario, each participant is uploading several media streams captured from:

1. Cameras
2. Microphones
3. Applications (screen sharing)

These media streams are typically arrayed in a grid. With Media Composition, you can use REST APIs (and open-source SDKs) to command the Azure service to cloud compose more complex media experiences. You can output these composed media experiences to client devices, or connect them to external services such as [Azure Media Services](https://docs.microsoft.com/azure/media-services/latest/concepts-overview) or YouTube Live using standardized real-time media protocol interfaces (RTMP). 

For example, a **presenter layout** can be used to compose a speaker and a translator together in a classic picture-in-picture style. Media Composition allows for all clients and services connected to the media data plane to enjoy a particular dynamic layout without additional local processing or application complexity. In the diagram below, three users are participating actively in a group call. Two users, one of which is using Microsoft Teams, are composed using a *presenter layout:*

:::image type="content" source="../media/media-comp.svg" alt-text="Diagram showing how media input is processed by the Azure Communication Services Media Composition services":::

This functionality is activated through REST APIs and open-source SDKs. Below is an example of the JSON encoded configuration of a presenter layout for the above scenario:

```
{  
  layout: {
    type: ‘presenter’,
    presenter: {
      supportPosition: ‘right’,
      primarySource: ‘1’, // source id
    }
  },
  sources: [
    { id: ‘1’ }, { id: ‘2’ }  
  ]
}

```
The presenter layout is one of several layouts available through the media composition capability:

1. **Grid** - This is the typical video calling layout, where all media sources are shown on a grid with similar sizes. You can use the grid layout to specify grid positions and size.
1. **Presentation.** Similar to the grid layout but media sources can have different sizes, allowing for emphasis.
1. **Presenter** - This layout overlays two sources on top of each other.
1. **Weather Person** - This layout overlays two sources, but in real-time Azure will remove the background behind people.

To try out media composition, check out the quickstart.
