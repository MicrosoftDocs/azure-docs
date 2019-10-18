---
title: Azure Firewall Manager Preview deployment overview
description: Learn the high-level deployment steps required for Azure Firewall Manager Preview
author: vhorne
ms.service: firewall-manager
services: firewall-manager
ms.topic: overview
ms.date: 10/19/2019
ms.author: victorh
---

# Azure Firewall Manager Preview deployment overview

[!INCLUDE [Preview](../../includes/firewall-manager-preview-notice.md)]

There's more than one way to deploy Azure Firewall Manager Preview, but the following general process is recommended.

## General deployment process

1. Create your hub and spoke architecture

   - Create a Secured Virtual Hub using Azure Firewall Manager and add virtual network connections<br>*or*<br>
   - Create a Virtual WAN Hub and add virtual network connections.
2. Select security providers

   - Done while creating a Secured Virtual Hub<br>*or*<br>
   - Convert an existing Virtual WAN Hub to Secure Virtual Hub
3. Create a firewall policy and associate it with your hub

   - Applicable only if using Azure Firewall
   - Third-party Network Security as a Service (NSaaS) policies are configured via partners management experience.
4. Configure route settings to route traffic to your secured hub

   - Easily route traffic to your secured hub for filtering and logging without User Defined Routes (UDR) on spoke Virtual Networks using the Secured Virtual Hub Route Setting page 
   - Use third-party NSaaS providers for Branch to Internet (B2I) traffic filtering, side by side with Azure Firewall for Branch to VNet (B2V), VNet to VNet (V2V) and VNet to Internet (V2I).
   - You can also use third-party NSaaS providers for V2I traffic filtering if Azure Firewall isn't required for B2V or V2V.

## Next steps

- [Tutorial: Secure your cloud network with Azure Firewall Manager Preview using the Azure portal](secure-cloud-network.md)