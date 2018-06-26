---
title: Use PlayReady and/or Widevine dynamic common encryption | Microsoft Docs
description: You can use Azure Media Services to deliver MPEG-DASH, Smooth Streaming, and HTTP Live Streaming (HLS) streams protected with Microsoft PlayReady DRM. You also can use it to deliver DASH encrypted with Widevine DRM. This topic shows how to dynamically encrypt with PlayReady and Widevine DRM.
services: media-services
documentationcenter: ''
author: juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 12/09/2017
ms.author: juliako

---
# Use PlayReady and/or Widevine dynamic common encryption

You can use Media Services to deliver MPEG-DASH, Smooth Streaming, and HTTP Live Streaming (HLS) streams protected with [PlayReady digital rights management (DRM)](https://www.microsoft.com/playready/overview/). You also can deliver encrypted DASH streams with Widevine DRM licenses. Both PlayReady and Widevine are encrypted per the common encryption (ISO/IEC 23001-7 CENC) specification. You can use the [Media Services .NET SDK](https://www.nuget.org/packages/windowsazure.mediaservices/) (starting with version 3.5.1) or the REST API to configure AssetDeliveryConfiguration to use Widevine.

Media Services provides a service for delivering PlayReady and Widevine DRM licenses. Media Services also provides APIs that you can use to configure the rights and restrictions that you want the PlayReady or Widevine DRM runtime to enforce when a user plays back protected content. When a user requests DRM-protected content, the player application requests a license from the Media Services license service. If the player application is authorized, the Media Services license service issues a license to the player. A PlayReady or Widevine license contains the decryption key that can be used by the client player to decrypt and stream the content.

This article is useful to developers who work on applications that deliver media protected with multiple DRMs, such as PlayReady and Widevine. The article shows you how to configure the PlayReady license delivery service with authorization policies so that only authorized clients can receive PlayReady or Widevine licenses. It also shows how to use dynamic encryption with PlayReady or Widevine DRM over DASH.

## Prerequisites

The following are required to complete the tutorial.

* Review the [Content protection overview](content-protection-overview.md) topic.
* Install Visual Studio Code or Visual Studio
* Create a new Azure Media Services account, as described in [this quickstart](create-account-cli-quickstart.md).
* Get credentials needed to use Media Services APIs by following [Access APIs](access-api-cli-how-to.md)

## Download code

TODO

## Main steps

### Create Content Key Policy

TODO

### Create Asset

TODO

### Upload content or use Asset as JobOutput

TODO

### Create StreamingLocator

TODO

## Next steps

[Content protection overview](content-protection-overview.md)