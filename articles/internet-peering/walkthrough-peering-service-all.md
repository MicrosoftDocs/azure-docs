---
title: Peering Service partner walkthrough
titleSuffix: Azure
description: Peering Service partner walkthrough
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: how-to
ms.date: 11/27/2019
ms.author: prmitiki
---

# Peering Service partner walkthrough

This section explains the steps a provider needs to follow to enable a Direct peering for Peering Service.

## Create Direct peering connection for Peering Service
Service Providers can expand their geographical reach by creating new Direct peering that support Peering Service. To accomplish this,
1. Become a Peering Service partner if not already
1. Follow the instructions to [Create or modify a Direct peering using the portal](howto-direct-portal.md). Ensure it meets high-availability requirement.
1. Then, follow steps to [Enable Peering Service on a Direct peering using the portal](howto-peering-service-portal.md).

## Use legacy Direct peering connection for Peering Service
If you have legacy Direct peering that you want to use to support Peering Service,
1. Become a Peering Service partner if not already.
1. Follow the instructions to [Convert a legacy Direct peering to Azure resource using the portal](howto-legacy-direct-portal.md). If required, order additional circuits to meet high-availability requirement.
1. Then, follow steps to [Enable Peering Service on a Direct peering using the portal](howto-peering-service-portal.md).

## Next steps

* Learn about [peering policy](https://peering.azurewebsites.net/peering).
* To learn about steps to set up Direct peering with Microsoft, follow [Direct peering walkthrough](walkthrough-direct-all.md).
* To learn about steps to set up Exchange peering with Microsoft, follow [Exchange peering walkthrough](walkthrough-exchange-all.md).