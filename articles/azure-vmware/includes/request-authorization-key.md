---
title: Request an authorization key for ExpressRoute
description: Steps to request an authorization key for ExpressRoute.
ms.topic: include
ms.service: azure-vmware
ms.date: 01/04/2024
author: suzizuber
ms.author: v-suzuber
ms.custom: engagement-fy23
---

<!-- used in tutorial-expressroute-global-reach-private-cloud.md and create-ipsec-tunnel.md -->

1. In the Azure portal, go to the Azure VMware Solution private cloud.

1. Under **Manage**, select **Connectivity**.

1. Select the **ExpressRoute** tab, and then select **+ Request an authorization key**.

   :::image type="content" source="../media/expressroute-global-reach/start-request-authorization-key.png" alt-text="Screenshot that shows selections for requesting an ExpressRoute authorization key." border="true" lightbox="../media/expressroute-global-reach/start-request-authorization-key.png":::

1. Provide a name for the authorization key, and then select **Create**.

   It can take about 30 seconds to create the key. After the key is created, it appears in the list of authorization keys for the private cloud.

   :::image type="content" source="../media/expressroute-global-reach/show-global-reach-auth-key.png" alt-text="Screenshot that shows the ExpressRoute Global Reach authorization key." lightbox="../media/expressroute-global-reach/show-global-reach-auth-key.png":::

1. Copy the authorization key and the ExpressRoute ID. You need them to complete the peering. The authorization key disappears after some time, so copy it as soon as it appears.
