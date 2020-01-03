---
title: Peering Service partner walkthrough
description: Peering Service partner walkthrough
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Peering Service partner walkthrough

This section explains the steps a provider needs to follow to enable a Direct Peering for Peering Service.

## Create Direct Peering connection for Peering Service
Service Providers can expand their geographical reach by creating new Direct Peering that support Peering Service. To accomplish this,
1. Become a Peering Service partner if not already
1. Follow the instructions to [Create or modify a Direct Peering using portal](howto-direct-peering-portal.md). Ensure it meets high-availability requirement.
1. Then, follow steps to [Enable Peering Service on a Direct Peering using portal](howto-peering-service-portal.md).

## Use legacy Direct Peering conection for Peering Service
If you have legacy Direct Peering that you want to use to support Peering Service,
1. Become a Peering Service partner if not already.
1. Follow the instructions to [Convert a legacy Direct Peering to Azure resource using portal](howto-legacy-direct-portal.md). If required, order additional circuits to meet high-availability requirement.
1. Then, follow steps to [Enable Peering Service on a Direct Peering using portal](howto-peering-service-portal.md).

## Next steps

* Learn about [Peering policy](https://peering.azurewebsites.net/peering).
* To learn about steps to set up Direct Peering with Microsoft, follow [Direct Peering walkthrough](workflows-direct.md).
* To learn about steps to set up Exchange Peering with Microsoft, follow [Exchange Peering walkthrough](workflows-exchange.md).