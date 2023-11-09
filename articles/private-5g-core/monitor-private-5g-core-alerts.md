---
title: Monitor Azure Private 5G Core with alerts
description: Guide to creating alerts for packet cores
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 09/14/2023

---
# Create alerts to track performance of packet cores

Alerts help track important events in your network by sending a notification containing diagnostic information when certain, user-defined conditions are met. Alerts can be customized to represent the severity of incidents on your network and can be viewed in the [Monitor service under Azure Services](https://portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/~/overview). In this how-to guide, you will create a custom alert for a packet core control plane or data plane resource.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the build-in Contributor or Owner role at the subscription scope.
- You must have [deployed your private mobile network](how-to-guide-deploy-a-private-mobile-network-azure-portal.md).

## Create an alert rule for your packet core control plane or data plane resources

1. Navigate to the packet core control/data plane you want to create an alert for.
 
    - You can do this by searching for it under **All resources** or from the **Overview** page of the site that contains the packet core you want to add alerts for.

1. Select **Alerts** from the **Monitoring** tab on the resource menu.

      :::image type="content" source="media/packet-core-resource-menu-alerts-highlighted.png" alt-text="Screenshot of Azure portal showing packet core control/data plane resource menu.":::

1. Select **Alert Rule** from the **Create** dropdown at the top of the page.

      :::image type="content" source="media/alerts-create-dropdown.png" alt-text="Screenshot of Azure portal showing alerts menu with the create dropdown menu open.":::

1. Select **See all signals** just under the dropdown menu or from inside the dropdown menu.

      :::image type="content" source="media/packet-core-alerts-signal-list.png" alt-text="Screenshot of Azure portal showing alert signal selection menu." lightbox="media/packet-core-alerts-signal-list.png":::

1. Select the signal you want the alert to be based on and follow the rest of the create instructions. For more information on alert options and setting actions groups used for notification, please refer to [the Azure Monitor alerts create and edit documentation](../azure-monitor/alerts/alerts-create-new-alert-rule.md?tabs=metric).
1. Once you've reached the end of the create instructions, select **Review + create** to create your alert.
1. Verify that your alert rule was created by navigating to the alerts page for your packet core (see steps 1 and 2) and finding it in the list of alert rules on the page.

## Next steps
- [Learn more about Azure Monitor alerts](../azure-monitor/alerts/alerts-overview.md).
