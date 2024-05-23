---
title: Manage virtual network flow logs - Azure portal
titleSuffix: Azure Network Watcher
description: Learn how to create, change, enable, disable, or delete Azure Network Watcher virtual network flow logs using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 04/24/2024

#CustomerIntent: As an Azure administrator, I want to log my virtual network IP traffic using Network Watcher VNet flow logs so that I can analyze it later.
---

# Create, change, enable, disable, or delete virtual network flow logs using the Azure portal

Virtual network flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through an Azure virtual network. For more information about virtual network flow logging, see [Virtual network flow logs overview](vnet-flow-logs-overview.md).

In this article, you learn how to create, change, enable, disable, or delete a virtual network flow log using the Azure portal. You can also learn how to manage a virtual network flow log using [PowerShell](vnet-flow-logs-powershell.md) or [Azure CLI](vnet-flow-logs-cli.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A virtual network. If you need to create a virtual network, see [Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md?toc=/azure/network-watcher/toc.json).

- An Azure storage account. If you need to create a storage account, see [Create a storage account using the Azure portal](../storage/common/storage-account-create.md?tabs=azure-portal&toc=/azure/network-watcher/toc.json).

## Register Insights provider

*Microsoft.Insights* provider must be registered to successfully log traffic flowing through a virtual network. If you aren't sure if the *Microsoft.Insights* provider is registered, check its status in the Azure portal by following these steps:

1. In the search box at the top of the portal, enter *subscriptions*. Select **Subscriptions** from the search results.

    :::image type="content" source="./media/vnet-flow-logs-portal/subscriptions.png" alt-text="Screenshot that shows how to search for Subscriptions in the Azure portal." lightbox="./media/vnet-flow-logs-portal/subscriptions.png":::

1. Select the Azure subscription that you want to enable the provider for in **Subscriptions**.

1. Under **Settings**, select **Resource providers**.

1. Enter *insight* in the filter box.

1. Confirm the status of the provider displayed is **Registered**. If the status is **NotRegistered**, select the **Microsoft.Insights** provider then select **Register**.

    :::image type="content" source="./media/vnet-flow-logs-portal/register-microsoft-insights.png" alt-text="Screenshot that shows how to register Microsoft Insights provider in the Azure portal.":::

## Create a flow log

Create a flow log for your virtual network, subnet, or network interface. This flow log is saved in an Azure storage account.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select **+ Create** or **Create flow log** blue button.

    :::image type="content" source="./media/vnet-flow-logs-portal/flow-logs.png" alt-text="Screenshot of Network Watcher flow logs in the Azure portal." lightbox="./media/vnet-flow-logs-portal/flow-logs.png":::

1. On the **Basics** tab of **Create a flow log**, enter or select the following values:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select the Azure subscription of your virtual network that you want to log. |
    | Flow log type | Select **Virtual Network** then select **+ Select target resource** (available options are: **Virtual network**, **Subnet**, and **Network interface**). <br> Select the resources that you want to flow log, then select **Confirm selection**. |
    | Flow Log Name | Enter a name for the flow log or leave the default name. Azure portal uses ***{ResourceName}-{ResourceGroupName}-flowlog*** as a default name for the flow log. |
    | **Instance details** |   |
    | Subscription | Select the Azure subscription of the storage account. |
    | Storage Accounts | Select the storage account that you want to save the flow logs to. If you want to create a new storage account, select **Create a new storage account**. |
    | Retention (days) | Enter a retention time for the logs (this option is only available with [Standard general-purpose v2](../storage/common/storage-account-overview.md?toc=/azure/network-watcher/toc.json#types-of-storage-accounts) storage accounts). Enter *0* if you want to retain the flow logs data in the storage account forever (until you manually delete it from the storage account). For information about pricing, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/). |

    :::image type="content" source="./media/vnet-flow-logs-portal/create-vnet-flow-log-basics.png" alt-text="Screenshot that shows the Basics tab of creating a virtual network flow log in the Azure portal." lightbox="./media/vnet-flow-logs-portal/create-vnet-flow-log-basics.png":::

    > [!NOTE]
    > If the storage account is in a different subscription, the resource that you're logging (virtual network, subnet, or network interface) and the storage account must be associated with the same Microsoft Entra tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).

1. To enable traffic analytics, select **Next: Analytics** button, or select the **Analytics** tab. Enter or select the following values:

    | Setting | Value |
    | ------- | ----- |
    | Enable traffic analytics | Select the checkbox to enable traffic analytics for your flow log. |
    | Traffic analytics processing interval  | Select the processing interval that you prefer, available options are: **Every 1 hour** and **Every 10 mins**. The default processing interval is every one hour. For more information, see [Traffic analytics](traffic-analytics.md). |
    | Subscription | Select the Azure subscription of your Log Analytics workspace. |
    | Log Analytics Workspace | Select your Log Analytics workspace. By default, Azure portal creates ***DefaultWorkspace-{SubscriptionID}-{Region}*** Log Analytics workspace in ***defaultresourcegroup-{Region}*** resource group. |

    :::image type="content" source="./media/vnet-flow-logs-portal/create-vnet-flow-log-analytics.png" alt-text="Screenshot that shows how to enable traffic analytics for a new flow log in the Azure portal.":::

    > [!NOTE]
    > To create and select a Log Analytics workspace other than the default one, see [Create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md?toc=/azure/network-watcher/toc.json)

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

## Enable or disable traffic analytics

Enable traffic analytics for a flow log to analyze the flow log data. Traffic analytics provides insights into the traffic patterns of your virtual network. You can enable or disable traffic analytics for a flow log at any time.

To enable traffic analytics for a flow log, follow these steps:

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the flow log that you want to enable traffic analytics for.

1. In **Flow logs settings**, check the **Enable traffic analytics** checkbox.

    :::image type="content" source="./media/vnet-flow-logs-portal/enable-traffic-analytics.png" alt-text="Screenshot that shows how to enable traffic analytics for an existing flow log in the Azure portal." lightbox="./media/vnet-flow-logs-portal/enable-traffic-analytics.png":::

1. Enter or select the following values:

    | Setting | Value |
    | ------- | ----- |
    | Traffic analytics processing interval  | Select the processing interval that you prefer, available options are: **Every 1 hour** and **Every 10 mins**. The default processing interval is every one hour. For more information, see [Traffic analytics](traffic-analytics.md). |
    | Subscription | Select the Azure subscription of your Log Analytics workspace. |
    | Log Analytics Workspace | Select your Log Analytics workspace. By default, Azure portal creates ***DefaultWorkspace-{SubscriptionID}-{Region}*** Log Analytics workspace in ***defaultresourcegroup-{Region}*** resource group. |

    :::image type="content" source="./media/vnet-flow-logs-portal/enable-traffic-analytics-settings.png" alt-text="Screenshot that shows configurations of traffic analytics for an existing flow log in the Azure portal." lightbox="./media/vnet-flow-logs-portal/enable-traffic-analytics-settings.png":::

1. Select **Save** to apply the changes.

To disable traffic analytics for a flow log, take the previous steps 1-3, then uncheck the **Enable traffic analytics** checkbox and select **Save**.

:::image type="content" source="./media/vnet-flow-logs-portal/disable-traffic-analytics.png" alt-text="Screenshot that shows how to disable traffic analytics for an existing flow log in the Azure portal." lightbox="./media/vnet-flow-logs-portal/disable-traffic-analytics.png":::

## Change a flow log

You can configure and change a flow log after you create it. For example, you can change the storage account or Log Analytics workspace.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the flow log that you want to change.

1. In **Flow logs settings**, you can change any of the following settings:

    - **Storage Account**: Change the storage account that you want to save the flow logs to. If you want to create a new storage account, select **Create a new storage account**. You can also choose a storage account from a different subscription. If the storage account is in a different subscription, the resource that you're logging (virtual network, subnet, or network interface) and the storage account must be associated with the same Microsoft Entra tenant.
    - **Retention (days)**: Change the retention time in the storage account (this option is only available with [Standard general-purpose v2](../storage/common/storage-account-overview.md#types-of-storage-accounts) storage accounts). Enter *0* if you want to retain the flow logs data in the storage account forever (until you manually delete the data from the storage account).
    - **Traffic analytics**: Enable or disable traffic analytics for your flow log. For more information, see [Traffic analytics](traffic-analytics.md).
    - **Traffic analytics processing interval**: Change the processing interval of traffic analytics (if traffic analytics is enabled). Available options are: one hour and 10 minutes. The default processing interval is every one hour. For more information, see [Traffic analytics](traffic-analytics.md).
    - **Log Analytics Workspace**: Change the Log Analytics workspace that you want to save the flow logs to (if traffic analytics is enabled). For more information, see [Log Analytics workspace overview](../azure-monitor/logs/log-analytics-workspace-overview.md). You can also choose a Log Analytics Workspace from a different subscription.

    :::image type="content" source="./media/vnet-flow-logs-portal/change-flow-log.png" alt-text="Screenshot that shows how to edit flow log's settings in the Azure portal where you can change some virtual network flow log settings." lightbox="./media/vnet-flow-logs-portal/change-flow-log.png":::

1. Select **Save** to apply the changes.

## List all flow logs

You can list all flow logs in a subscription or a group of subscriptions. You can also list all flow logs in a region.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. Select **Subscription equals** filter to choose one or more of your subscriptions. You can apply other filters like **Location equals** to list all the flow logs in a region.

    :::image type="content" source="./media/vnet-flow-logs-portal/list-flow-logs.png" alt-text="Screenshot that shows how to list existing flow logs in the Azure portal." lightbox="./media/vnet-flow-logs-portal/list-flow-logs.png":::

## View details of a flow log resource

You can view the details of a flow log in a subscription or a group of subscriptions. You can also list all flow logs in a region.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the flow log that you want to see.

1. In **Flow logs settings**, you can view the settings of the flow log resource.

    :::image type="content" source="./media/vnet-flow-logs-portal/flow-log-settings.png" alt-text="Screenshot of Flow logs settings page in the Azure portal." lightbox="./media/vnet-flow-logs-portal/flow-log-settings.png":::

1. Select **Discard** to close the settings page without making changes.

## Download a flow log

You can download the flow logs data from the storage account that you saved the flow log to.

1. In the search box at the top of the portal, enter *storage accounts*. Select **Storage accounts** in the search results.

1. Select the storage account you used to store the logs.

1. Under **Data storage**, select **Containers**.

1. Select the **insights-logs-flowlogflowevent** container.

1. In **insights-logs-flowlogflowevent**, navigate the folder hierarchy until you get to the `PT1H.json` file that you want to download. Virtual network flow log files follow the following path:

    ```
    https://{storageAccountName}.blob.core.windows.net/insights-logs-flowlogflowevent/flowLogResourceID=/{subscriptionID}_NETWORKWATCHERRG/NETWORKWATCHER_{Region}_{ResourceName}-{ResourceGroupName}-FLOWLOGS/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
    ```

1. Select the ellipsis **...** to the right of the `PT1H.json` file, then select **Download**.

   :::image type="content" source="./media/vnet-flow-logs-portal/flow-log-file-download.png" alt-text="Screenshot shows how to download a virtual network flow log data file from the storage account container in the Azure portal." lightbox="./media/vnet-flow-logs-portal/flow-log-file-download.png":::

> [!NOTE]
> As an alternative way to access and download flow logs from your storage account, you can use Azure Storage Explorer. For more information, see [Get started with Storage Explorer](../storage/storage-explorer/vs-azure-tools-storage-manage-with-storage-explorer.md).

For information about the structure of a flow log, see [Log format of virtual network flow logs](vnet-flow-logs-overview.md#log-format).

## Disable a flow log

You can temporarily disable a virtual network flow log without deleting it. Disabling a flow log stops flow logging for the associated virtual network. However, the flow log resource remains with all its settings and associations. You can re-enable it at any time to resume flow logging for the configured virtual network.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the checkbox of the flow log that you want to disable.

1. Select **Disable**.

    :::image type="content" source="./media/vnet-flow-logs-portal/disable-flow-log.png" alt-text="Screenshot shows how to disable a flow log in the Azure portal." lightbox="./media/vnet-flow-logs-portal/disable-flow-log.png":::

> [!NOTE]
> If traffic analytics is enabled for a flow log, you must disable it before you can disable the flow log. To disable traffic analytics, see [Enable or disable traffic analytics](#enable-or-disable-traffic-analytics).

## Enable a flow log

You can enable a virtual network flow log that you previously disabled to resume flow logging with the same settings you previously selected. 

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the checkbox of the flow log that you want to enable.

1. Select **Enable**.

    :::image type="content" source="./media/vnet-flow-logs-portal/enable-flow-log.png" alt-text="Screenshot shows how to enable a flow log in the Azure portal." lightbox="./media/vnet-flow-logs-portal/enable-flow-log.png":::

## Delete a flow log

You can permanently delete a virtual network flow log. Deleting a flow log deletes all its settings and associations. To begin flow logging again for the same virtual network, you must create a new flow log for it.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the checkbox of the flow log that you want to delete.

1. Select **Delete**.

    :::image type="content" source="./media/vnet-flow-logs-portal/delete-flow-log.png" alt-text="Screenshot shows how to delete a flow log in the Azure portal." lightbox="./media/vnet-flow-logs-portal/delete-flow-log.png":::

> [!NOTE]
> Deleting a flow log doesn't delete the flow log data from the storage account. Flow logs data stored in the storage account follows the configured retention policy or stays stored in the storage account until manually deleted.

## Related content

- To learn about traffic analytics, see [Traffic analytics](traffic-analytics.md).
- To learn how to use Azure built-in policies to audit or enable traffic analytics, see [Manage traffic analytics using Azure Policy](traffic-analytics-policy-portal.md).
