---
title: 'Configure ExpressRoute Traffic Collector for ExpressRoute Direct using the Azure portal (Preview)'
description: Learn how to create an ExpressRoute Traffic Collector resource to import logs into a Log Analytics workspace.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: tutorial
ms.date: 07/15/2022
ms.author: duau
---

# Configure ExpressRoute Traffic Collector for ExpressRoute Direct using the Azure portal (Preview)

This article will help you deploy an ExpressRoute Traffic Collector using the Azure portal. You'll learn how to add and remove an ExpressRoute Traffic Collector, associate it to an ExpressRoute Direct circuit and Log Analytics workspace. Once the ExpressRoute Traffic Collector is deployed, sampled flow logs will get imported into a Log Analytics workspace. For more information, see [About ExpressRoute Traffic Collector](traffic-collector.md).

> [!IMPORTANT]
> ExpressRoute Traffic Collector is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Limitations

- ExpressRoute Traffic Collector supports a maximum ExpressRoute Direct circuit size of 100 Gbps.
- You can associate up to 20 ExpressRoute Direct circuits with ExpressRoute Traffic Collector as long as the total circuit bandwidth doesn't exceed 100 Gbps.

## Prerequisites

- ExpressRoute Direct circuit with Private or Microsoft peering configured.
- A Log Analytics workspace (Create new or use existing).

> [!NOTE]
> - The ExpressRoute Direct circuit, ExpressRoute Traffic Collector and the Log Analytics workspace must be in the same geo-political region. Cross geo-political resource association is not supported.  
> - The ExpressRoute Direct circuit and ExpressRoute Traffic Collector must be deployed in the same subscription. Cross subscription deployment is currently not available. 
> - Log Analytics and ExpressRoute Traffic Collector can be deployed in cross subscription.
> - When ExpressRoute Traffic Collector gets deployed in an Azure region that supports availability zones, it will have availability zone enabled by default.

## Permissions

- Minimum contributor access is required to deploy ExpressRoute Traffic Collector.
- Minimum contributor access is required to associate ExpressRoute Direct circuit with ExpressRoute Traffic Collector.
- Monitor contributor role is required to associate Log Analytics workspace with ExpressRoute Traffic Collector.

For more information, see [Identity and access management](../active-directory/fundamentals/active-directory-ops-guide-iam.md).

## Deploy ExpressRoute Traffic Collector

1. Sign in to the [Azure portal](https://portal.azure.com/)

1. In the portal, go to the list of ExpressRoute circuits and select **ExpressRoute Traffic Collectors**. Then select **+ Create new**.

    :::image type="content" source="./media/how-to-configure-traffic-collector/circuit-list.png" alt-text="Screenshot of the create new ExpressRoute Traffic Collector button from the ExpressRoute circuit list page.":::

1. On the **Create an ExpressRoute Traffic Collector** page, enter or select the following information then select **Next**.

    :::image type="content" source="./media/how-to-configure-traffic-collector/basics.png" alt-text="Screenshot of the basics page for create an ExpressRoute Traffic Collector.":::

    | Setting | Description |
    | --- | --- |
    | Subscription | Select the subscription to create the ExpressRoute Traffic Collector resource. This resource needs to be in the same subscription as the ExpressRoute Direct circuit. |
    | Resource group | Select the resource group to deploy this resource into. |
    | Name | Enter a name to identify this ExpressRoute Traffic Collector resource. |
    | Region | Select a region to deploy this resource into. This resource needs to be in the same geo-political region as the Log Analytics workspace and the ExpressRoute Direct circuits. |
    | Collector Policy | This value is automatically filled in as **Default**. |

1. On the **Select ExpressRoute circuit** tab, select **+ Add ExpressRoute Circuits**. Select the checkbox next to the circuit you would like to add to the Traffic Collector and then select **Add**. Once you're satisfied with the circuits added, select **Next**.

    :::image type="content" source="./media/how-to-configure-traffic-collector/select-circuits.png" alt-text="Screenshot of the select ExpressRoute circuits tab and add circuits page.":::

1. On the **Forward Logs** tab, select the checkbox for **Send to Log Analytics workspace**. You can create a new Log Analytics workspace or choose an existing. The workspace can be in a different Azure subscription but has to be in the same geo-political region. Select **Next** once a workspace has been chosen.

    :::image type="content" source="./media/how-to-configure-traffic-collector/forward-logs.png" alt-text="Screenshot of the forward logs tab to Logs Analytics workspace.":::

1. On the **Tags** tab, you can add optional tags for tracking purpose. Select **Next** to review your configuration.

1. Select **Create** once validation has passed to deploy your ExpressRoute Traffic Collector.

    :::image type="content" source="./media/how-to-configure-traffic-collector/validation.png" alt-text="Screenshot of the create validation page.":::

1. Once deployed you should start seeing sampled flow logs within the configure Log Analytics workspace.

    :::image type="content" source="./media/how-to-configure-traffic-collector/log-analytics.png" alt-text="Screenshot of logs in Log Analytics workspace." lightbox="./media/how-to-configure-traffic-collector/log-analytics.png":::

## Clean up resources

To delete the ExpressRoute Traffic Collector resource, you first need to remove all ExpressRoute circuit associations. 

> [!IMPORTANT]
> If you delete the ExpressRoute Traffic Collector resource before removing all circuit associations, you'll need to wait about 40 mins for the deletion to timeout before you can try again.
>

Once all circuits have been removed from the ExpressRoute Traffic Collector, select **Delete** from the overview page to remove the resource from your subscription.

:::image type="content" source="./media/how-to-configure-traffic-collector/overview.png" alt-text="Screenshot of delete button on overview page." lightbox="./media/how-to-configure-traffic-collector/overview.png":::

## Next steps

- [ExpressRoute Traffic Collector Metrics](expressroute-monitoring-metrics-alerts.md#expressroute-traffic-collector-metrics)