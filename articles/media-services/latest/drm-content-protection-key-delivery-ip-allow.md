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

When securing media with the [content protection](./drm-content-protection-concept.md) and DRM features of Media Services, you could encounter scenarios where you need to limit the delivery of licenses or key requests to to a specific IP range of client devices on your network. To restrict content playback and delivery of keys, you can use the IP allowlist for Key Delivery.

In addition, you can also use the allowlist to completely block all public internet access to Key Delivery traffic and only allow traffic from your private network endpoints.

The IP allowlist for Key Delivery restricts the delivery of both DRM licenses and AES-128 keys to clients within the supplied IP allowlist range.

## Setting the allowlist for key delivery

The settings for the Key Delivery IP allowlist are on the Media Services account resource. When creating a new Media Services account, you can restrict the allowed IP ranges through the **KeyDelivery** property on the [Media Services account resource.](/rest/api/media/mediaservices/create-or-update)

The **defaultAction** property can be set to "Allow" or "Deny" to control delivery of licenses and keys to clients in the allowlist range.

The **ipAllowList** property is an array of single IPv4 address and/or IPv4 ranges using [CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation).

## Setting the allowlist in the portal

The Azure portal provides a method for configuring and updating the IP allowlist for key delivery.  Navigate to your Media Services account and access the **Key delivery** menu under **Settings**.

## Next steps

- [Create an account](./account-create-how-to.md)
- [DRM and content protection overview](./drm-content-protection-concept.md)
