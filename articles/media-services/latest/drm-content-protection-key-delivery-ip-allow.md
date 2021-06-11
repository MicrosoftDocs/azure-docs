---
title: Restrict access to DRM license and AES key delivery using IP allowlists
description: Learn how to restrict access to DRM and AES Keys by using IP allowlists.
services: media-services
documentationcenter: ''
author: johndeu
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/11/2021
ms.author: johndeu
ms.custom: "seodec18, devx-track-csharp"

---
# Restrict access to DRM license and AES key delivery using IP allowlists

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

When securing media with the [content protection](drm-content-protection-concept.md) and DRM features of Media Services, you could encounter scenarios where you need to limit the access and playback of video to a specific IP range of client devices in your network. To restrict content playback and delivery of keys, you can use the IP allowlist for Key Delivery.

The IP allowlist for Key Delivery restricts the delivery of both DRM licenses and AES-128 keys to clients within the supplied IP allowlist range.

## Setting the IP allowlist for Key Delivery

The settings for the Key Delivery IP allowlist are on the Media Services account resource. When creating a new Media Services account, you can restrict the allowed IP ranges through the **KeyDelivery** property on the [Media Services account resource.](https://docs.microsoft.com/rest/api/media/mediaservices/create-or-update)

The **defaultAction** property can be set to either "Allow" or "Deny" access to clients in the allowlist range.

The **ipAllowList** property can be an array of IP addresses, or CIDR ranges.

## Setting the allowlist in the portal

The Azure portal provides a method for configuring and updating the IP allowlist for key delivery.  Simply navigate to your Media Services account and access the **Key delivery** menu under **Settings**.

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.
