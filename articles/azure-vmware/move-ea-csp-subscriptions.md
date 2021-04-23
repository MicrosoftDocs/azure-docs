---
title: Move EA and CSP Azure VMware Solution subscriptions
description: Learn how to move the private cloud from one subscription to another. The movement can be made for various reasons such as billing. 
ms.topic: how-to
ms.date: 03/15/2021
---

# Move EA and CSP Azure VMware Solution subscriptions

In this article, you'll learn how to move the private cloud from one subscription to another. The movement can be made for various reasons such as billing. 

>[!IMPORTANT]
>You should have at least contributor rights on both source and target subscriptions. VNet and VNet gateway cannot be moved from one subscription to another. Additionally, moving your subscriptions has no impact on the management and workloads, like the vCenter, NSX, and workload virtual machines.

1. Sign into the Azure portal and select the private cloud you want to move.

1. Select the **Subscription (change)** link.

   :::image type="content" source="media/private-cloud-overview-subscription-id.png" alt-text="Screenshot showing the private cloud details.":::

1. Provide the subscription details for **Target** and select **Next**.

   :::image type="content" source="media/move-resources-subscription-target.png" alt-text="Screenshot of the target resource." lightbox="media/move-resources-subscription-target.png":::

1. Confirm the validation of the resources you selected to move and select **Next**. 

   :::image type="content" source="media/confirm-move-resources-subscription-target.png" alt-text="Screenshot showing the resource being moved." lightbox="media/confirm-move-resources-subscription-target.png":::

1. Select the check box indicating you understand that the tools and scripts associated will not work until you update them to use the new resource IDs. Then select **Move**.

   :::image type="content" source="media/review-move-resources-subscription-target.png" alt-text="Screenshot showing the summary of the selected resource being moved. " lightbox="media/review-move-resources-subscription-target.png":::

   A notification appears once the resource move is complete. The new subscription appears in the private cloud Overview.

   :::image type="content" source="media/moved-subscription-target.png" alt-text="Screenshot showing a new subscription." lightbox="media/moved-subscription-target.png":::

