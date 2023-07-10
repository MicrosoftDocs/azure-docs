---
title: Manage VNet flow logs - Azure portal
titleSuffix: Azure Network Watcher
description: Learn how to create, change, enable, disable, or delete Azure Network Watcher VNet flow logs using the Azure portal.
author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 06/08/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23
---

# Create, change, enable, disable, or delete VNet flow logs using the Azure portal

> [!div class="op_single_selector"]
> - [Azure portal](vnet-flow-logs-portal.md)
> - [PowerShell](vnet-flow-logs-powershell.md)
> - [Azure CLI](vnet-flow-logs-cli.md)

> [!IMPORTANT]
> VNet flow logs is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Virtual network flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through an Azure virtual network. For more information about virtual network flow logging, see [VNet flow logs overview](vnet-flow-logs-overview.md).

In this article, you learn how to create, change, enable, disable, or delete a VNet flow log using the Azure portal.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A virtual network. If you need to create a virtual network, see [Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

- An Azure storage account. If you need to create a storage account, see [Create a storage account using the Azure portal](../storage/common/storage-account-create.md?tabs=azure-portal).

## Register Insights provider

*Microsoft.Insights* provider must be registered to successfully log traffic flowing through a virtual network. If you aren't sure if the *Microsoft.Insights* provider is registered, check its status:

1. In the search box at the top of the portal, enter *subscriptions*. Select **Subscriptions** in the search results.

1. Select the Azure subscription that you want to enable the provider for in **Subscriptions**.

1. Under **Settings**, select **Resource providers**.

1. Enter *insight* in the filter box.

1. Confirm the status of the provider displayed is **Registered**. If the status is **NotRegistered**, select the **Microsoft.Insights** provider then select **Register**.

    :::image type="content" source="./media/vnet-flow-logs-portal/register-microsoft-insights.png" alt-text="Screenshot of registering Microsoft Insights provider in the Azure portal.":::

## Enable VNet flow logs

Enable VNet flow logs by creating a flow log for your virtual network.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select **+ Create** or **Create flow log** blue button.

    :::image type="content" source="./media/vnet-flow-logs-portal/flow-logs.png" alt-text="Screenshot of Flow logs page in the Azure portal." lightbox="./media/vnet-flow-logs-portal/flow-logs.png":::

1. Enter or select the following values in **Create a flow log**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select the Azure subscription of your virtual network that you want to log. |
    | Resource type | Select **Virtual Network**, then select **+ Select resource**. <br> In **Select virtual network**, select the virtual network(s) that you want to flow log. Then, select **Confirm selection**. |
    | Flow Log Name | Enter a name for the flow log or leave the default name. Azure portal uses ***{VirtualNetworkName}-{ResourceGroupName}-flowlog*** as a default name for the VNet flow log. |
    | **Instance details** |   |
    | Subscription | Select the Azure subscription of the storage account. |
    | Storage Accounts | Select the storage account that you want to save the flow logs to. If you want to create a new storage account, select **Create a new storage account**. |
    | Retention (days) | Enter a retention time for the logs (this option is only available with [Standard general-purpose v2](../storage/common/storage-account-overview.md#types-of-storage-accounts) storage accounts). Enter *0* if you want to retain the flow logs data in the storage account forever (until you manually delete it from the storage account). For information about pricing, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/). |

    :::image type="content" source="./media/vnet-flow-logs-portal/create-vnet-flow-log.png" alt-text="Screenshot of creating a VNet flow log in the Azure portal.":::

    > [!NOTE]
    > If the storage account is in a different subscription, the virtual network and storage account must be associated with the same Azure Active Directory tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

## Enable VNet flow logs and traffic analytics

Enable VNet flow logs and traffic analytics by creating a flow log for your virtual network and enabling traffic analytics for it.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select **+ Create** or **Create flow log** blue button.

    :::image type="content" source="./media/vnet-flow-logs-portal/flow-logs.png" alt-text="Screenshot of Flow logs page in the Azure portal." lightbox="./media/vnet-flow-logs-portal/flow-logs.png":::

1. Enter or select the following values in **Create a flow log**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select the Azure subscription of your virtual network that you want to log. |
    | Resource type | Select **Virtual Network**, then select **+ Select resource**. <br> In **Select virtual network**, select the virtual network(s) that you want to flow log. Then, select **Confirm selection**. |
    | Flow Log Name | Enter a name for the flow log or leave the default name. Azure portal uses ***{VirtualNetworkName}-{ResourceGroupName}-flowlog*** as a default name for the VNet flow log. |
    | **Instance details** |   |
    | Subscription | Select the Azure subscription of the storage account. |
    | Storage Accounts | Select the storage account that you want to save the flow logs to. If you want to create a new storage account, select **Create a new storage account**. |
    | Retention (days) | Enter a retention time for the logs (this option is only available with [Standard general-purpose v2](../storage/common/storage-account-overview.md#types-of-storage-accounts) storage accounts). Enter *0* if you want to retain the flow logs data in the storage account forever (until you manually delete it from the storage account). For information about pricing, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/). |

    :::image type="content" source="./media/vnet-flow-logs-portal/create-vnet-flow-log-basics.png" alt-text="Screenshot of the Basics tab of Create a flow log in the Azure portal.":::

    > [!NOTE]
    > If the storage account is in a different subscription, the virtual network and storage account must be associated with the same Azure Active Directory tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).

1. Select **Next: Analytics** button, or select **Analytics** tab. Then enter or select the following values:

    | Setting | Value |
    | ------- | ----- |
    | Enable Traffic Analytics | Select the checkbox to enable traffic analytics for your flow log. |
    | Traffic Analytics processing interval  | Select the processing interval that you prefer, available options are: **Every 1 hour** and **Every 10 mins**. The default processing interval is every one hour. For more information, see [Traffic analytics](traffic-analytics.md). |
    | Subscription | Select the Azure subscription of your Log Analytics workspace. |
    | Log Analytics Workspace | Select your Log Analytics workspace. By default, Azure portal creates ***DefaultWorkspace-{SubscriptionID}-{Region}*** Log Analytics workspace in ***defaultresourcegroup-{Region}*** resource group. |

    :::image type="content" source="./media/vnet-flow-logs-portal/enable-traffic-analytics.png" alt-text="Screenshot of enabling traffic analytics for a flow log in the Azure portal.":::

    > [!NOTE]
    > To create and select a Log Analytics workspace other than the default one, see [Create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md)

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

## Change a flow log

You can change the properties of a flow log after you create it. For example, you can enable or disable traffic analytics.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the flow log that you want to change.

1. In **Flow logs settings**, you can change any of the following settings:

    - **Storage Account**: Change the storage account that you want to save the flow logs to. If you want to create a new storage account, select **Create a new storage account**.
    - **Retention (days)**: Change the retention time in the storage account (this option is only available with [Standard general-purpose v2](../storage/common/storage-account-overview.md#types-of-storage-accounts) storage accounts). Enter *0* if you want to retain the flow logs data in the storage account forever (until you manually delete the data from the storage account).
    - **Traffic Analytics**: Enable or disable traffic analytics for your flow log. For more information, see [Traffic analytics](traffic-analytics.md).
    - **Traffic Analytics processing interval**: Change the processing interval of traffic analytics (if traffic analytics is enabled). Available options are: one hour and 10 minutes. The default processing interval is every one hour. For more information, see [Traffic analytics](traffic-analytics.md).
    - **Log Analytics workspace**: Change the Log Analytics workspace that you want to save the flow logs to (if traffic analytics is enabled). For more information, see [Log Analytics workspace overview](../azure-monitor/logs/log-analytics-workspace-overview.md).

    :::image type="content" source="./media/vnet-flow-logs-portal/change-flow-log.png" alt-text="Screenshot of Flow logs settings page in the Azure portal where you can change some VNet flow log settings." lightbox="./media/vnet-flow-logs-portal/change-flow-log.png":::

1. Select **Save** to apply the changes.

## List all flow logs

You can list all flow logs in a subscription or a group of subscriptions. You can also list all flow logs in a region.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. Select **Subscription equals** filter to choose one or more of your subscriptions. You can apply other filters like **Location equals** to list all the flow logs in a region.

    :::image type="content" source="./media/vnet-flow-logs-portal/list-flow-logs.png" alt-text="Screenshot shows how to use filters to list all existing flow logs in a subscription using the Azure portal." lightbox="./media/vnet-flow-logs-portal/list-flow-logs.png":::

## View details of a flow log resource

You can view the details of a flow log in a subscription or a group of subscriptions. You can also list all flow logs in a region.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the flow log that you want to see.

1. In **Flow logs settings**, you can view the settings of the flow log resource.

    :::image type="content" source="./media/vnet-flow-logs-portal/flow-log-settings.png" alt-text="Screenshot of Flow logs settings page in the Azure portal." lightbox="./media/vnet-flow-logs-portal/flow-log-settings.png":::

## Download a flow log

You can download the flow logs data from the storage account that you saved the flow log to.

1. In the search box at the top of the portal, enter *storage accounts*. Select **Storage accounts** in the search results.

1. Select the storage account you used to store the logs.

1. Under **Data storage**, select **Containers**.

1. Select the **insights-logs-flowlogflowevent** container.

1. In **insights-logs-flowlogflowevent**, navigate the folder hierarchy until you get to the `PT1H.json` file. VNet flow log files follow the following path:

    ```
    https://{storageAccountName}.blob.core.windows.net/insights-logs-flowlogflowevent/flowLogResourceID=/{subscriptionID}_NETWORKWATCHERRG/NETWORKWATCHER_{Region}_{VirtualNetworkName}-{ResourceGroupName}-FLOWLOGS/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
    ```

1. Select the ellipsis **...** to the right of the `PT1H.json` file, then select **Download**.

   :::image type="content" source="./media/vnet-flow-logs-portal/flow-log-file-download.png" alt-text="Screenshot shows how to download a VNet flow log data file from the storage account container in the Azure portal." lightbox="./media/vnet-flow-logs-portal/flow-log-file-download.png":::


> [!NOTE]
> As an alternative way to access and download flow logs from your storage account, you can use Azure Storage Explorer. Fore more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

For information about the structure of a flow log, see [Log format of VNet flow logs](vnet-flow-logs-overview.md#log-format).

## Disable a flow log

You can temporarily disable a VNet flow log without deleting it. Disabling a flow log stops flow logging for the associated virtual network. However, the flow log resource remains with all its settings and associations. You can re-enable it at any time to resume flow logging for the configured virtual network.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the checkbox of the flow log that you want to disable.

1. Select **Disable**.

    :::image type="content" source="./media/vnet-flow-logs-portal/disable-flow-log.png" alt-text="Screenshot shows how to disable a flow log in the Azure portal." lightbox="./media/vnet-flow-logs-portal/disable-flow-log.png":::

> [!NOTE]
> If traffic analytics is enabled for a flow log, it must disabled before you can disable the flow log. To disable traffic analytics, see [Change a flow log](#change-a-flow-log).

## Enable a flow log

You can enable a VNet flow log that you previously disabled to resume flow logging with the same settings you previously selected. 

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the checkbox of the flow log that you want to enable.

1. Select **Enable**.

    :::image type="content" source="./media/vnet-flow-logs-portal/enable-flow-log.png" alt-text="Screenshot shows how to enable a flow log in the Azure portal." lightbox="./media/vnet-flow-logs-portal/enable-flow-log.png":::

## Delete a flow log

You can permanently delete a VNet flow log. Deleting a flow log deletes all its settings and associations. To begin flow logging again for the same virtual network, you must create a new flow log for it.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the checkbox of the flow log that you want to delete.

1. Select **Delete**.

    :::image type="content" source="./media/vnet-flow-logs-portal/delete-flow-log.png" alt-text="Screenshot shows how to delete a flow log in the Azure portal." lightbox="./media/vnet-flow-logs-portal/delete-flow-log.png":::

> [!NOTE]
> Deleting a flow log does not delete the flow log data from the storage account. Flow logs data stored in the storage account follows the configured retention policy or stays stored in the storage account until manually deleted.

## Next Steps

- To learn about traffic analytics, see [Traffic analytics](traffic-analytics.md).
- To learn how to use Azure built-in policies to audit or enable traffic analytics, see [Manage traffic analytics using Azure Policy](traffic-analytics-policy-portal.md).
