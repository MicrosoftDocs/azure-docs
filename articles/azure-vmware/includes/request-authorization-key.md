---
title: Request authorization key for ExpressRoute
description: Steps to request an authorization key for ExpressRoute.
ms.topic: include
ms.service: azure-vmware
ms.date: 03/15/2021
author: suzizuber
ms.author: v-szuber
---

<!-- used in tutorial-expressroute-global-reach-private-cloud.md and create-ipsec-tunnel.md -->

1. In the Azure portal, navigate to the Azure VMware Solution private cloud. Select **Manage** > **Connectivity** > **ExpressRoute** and then select **+ Request an authorization key**.

   :::image type="content" source="../media/expressroute-global-reach/start-request-authorization-key.png" alt-text="Screenshot showing how to request an ExpressRoute authorization key." border="true" lightbox="../media/expressroute-global-reach/start-request-authorization-key.png":::

1. Provide a name for it and select **Create**.

   It may take about 30 seconds to create the key. Once created, the new key appears in the list of authorization keys for the private cloud.

   :::image type="content" source="../media/expressroute-global-reach/show-global-reach-auth-key.png" alt-text="Screenshot showing the ExpressRoute Global Reach authorization key." lightbox="../media/expressroute-global-reach/show-global-reach-auth-key.png":::
  
1. Copy the authorization key and ExpressRoute ID. You'll need them to complete the peering. The authorization key disappears after some time, so copy it as soon as it appears.

