---
title: Peering Service partner walkthrough
titleSuffix: Internet Peering
description: Get started with Peering Service partner.
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 02/23/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23
---

# Peering Service partner walkthrough

This article explains the steps a provider needs to follow to enable a Direct peering for Peering Service.

## Create Direct peering connection for Peering Service

Service Providers can expand their geographical reach by creating a new Direct peering that support Peering Service as follows:

1. Become a Peering Service partner.
1. Follow the instructions to [Create or modify a Direct peering](howto-direct-portal.md). Ensure it meets high-availability requirement.
1. Follow the steps to [Enable Peering Service on a Direct peering using the portal](howto-peering-service-portal.md).

## Use legacy Direct peering connection for Peering Service

If you have a legacy Direct peering that you want to use to support Peering Service:

1. Become a Peering Service partner.
1. Follow the instructions to [Convert a legacy Direct peering to Azure resource](howto-legacy-direct-portal.md). If necessary, order more circuits to meet high-availability requirement.
1. Follow the steps to [Enable Peering Service on a Direct peering](howto-peering-service-portal.md).

## Next steps

* Learn about Microsoft's [peering policy](policy.md).
* To learn how to set up Direct peering with Microsoft, see [Direct peering walkthrough](walkthrough-direct-all.md).
* To learn how to set up Exchange peering with Microsoft, see [Exchange peering walkthrough](walkthrough-exchange-all.md).