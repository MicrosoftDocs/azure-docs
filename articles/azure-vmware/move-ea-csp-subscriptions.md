---
title: Move Azure VMware Solution subscription to another subscription
description: This article describes how to move Azure VMware Solution subscription to another subscription. You might move your resources for various reasons, such as billing.  
ms.custom: "subject-moving-resources, engagement-fy23"
ms.topic: how-to
ms.service: azure-vmware
ms.date: 12/22/2022

# Customer intent: As an Azure service administrator, I want to move my Azure VMware Solution subscription to another subscription.
---

# Move Azure VMware Solution subscription to another subscription

This article describes how to move an Azure VMware Solution subscription to another subscription. You might move your subscription for various reasons, like billing.

## Prerequisites

You should have at least contributor rights on both **source** and **target** subscriptions.

>[!IMPORTANT]
>VNet and VNet gateway can't be moved from one subscription to another. Additionally, moving your subscriptions has no impact on the management and workloads, like the vCenter Server, NSX-T Data Center, vSAN, and workload virtual machines.

## Prepare and move

1. In the Azure portal, select the private cloud you want to move.

   :::image type="content" source="media/move-subscriptions/source-subscription-id.png" alt-text="Screenshot that shows the overview details of the selected private cloud."lightbox="media/move-subscriptions/source-subscription-id.png":::

1. From a command prompt, ping the components and workloads to verify that they are pinging from the same subscription.  

   :::image type="content" source="media/move-subscriptions/verify-components-workloads.png" alt-text="Screenshot that shows the ping command and the results of the ping.":::

1. Select the **Subscription (change)** link.

   :::image type="content" source="media/move-subscriptions/private-cloud-overview-subscription-id.png" alt-text="Screenshot showing the private cloud details."lightbox="media/move-subscriptions/private-cloud-overview-subscription-id.png":::

1. Provide the subscription details for **Target** and select **Next**.

   :::image type="content" source="media/move-subscriptions/move-resources-subscription-target.png" alt-text="Screenshot of the target resource."lightbox="media/move-subscriptions/move-resources-subscription-target.png":::

1. Confirm the validation of the resources you selected to move. During the validation, you’ll see *Pending validation* under **Validation status**.

   :::image type="content" source="media/move-subscriptions/pending-move-resources-subscription-target.png" alt-text="Screenshot showing the resource being moved."lightbox="media/move-subscriptions/pending-move-resources-subscription-target.png":::

1. Once the validation is successful, select **Next** to start the migration of your private cloud.

   :::image type="content" source="media/move-subscriptions/move-resources-succeeded.png" alt-text=" Screenshot showing the validation status of Succeeded."lightbox="media/move-subscriptions/move-resources-succeeded.png":::

1. Select the check box indicating you understand that the tools and scripts associated won't work until you update them to use the new resource IDs. Then select **Move**.

   :::image type="content" source="media/move-subscriptions/review-move-resources-subscription-target.png" alt-text="Screenshot showing the summary of the selected resource being moved."lightbox="media/move-subscriptions/review-move-resources-subscription-target.png":::

## Verify the move

A notification appears once the resource move is complete.

:::image type="content" source="media/move-subscriptions/notification-move-resources-subscription-target.png" alt-text="Screenshot of the notification after the resources move is complete."lightbox="media/move-subscriptions/notification-move-resources-subscription-target.png":::

The new subscription appears in the private cloud Overview.

:::image type="content" source="media/move-subscriptions/moved-subscription-target.png" alt-text="Screenshot showing a new subscription."lightbox="media/move-subscriptions/moved-subscription-target.png":::

## Next steps

Learn more about:

- [Move Azure VMware Solution across regions](move-azure-vmware-solution-across-regions.md)
- [Move guidance for networking resources](../azure-resource-manager/management/move-limitations/networking-move-limitations.md)
- [Move guidance for virtual machines](../azure-resource-manager/management/move-limitations/virtual-machines-move-limitations.md)
- [Move guidance for App Service resources](../azure-resource-manager/management/move-limitations/app-service-move-limitations.md)
