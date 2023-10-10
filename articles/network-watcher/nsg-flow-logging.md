---
title: Manage NSG flow logs - Azure portal
titleSuffix: Azure Network Watcher
description: Learn how to create, change, disable, or delete Azure Network Watcher NSG flow logs using the Azure portal.
author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 05/31/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23
---

# Manage NSG flow logs using the Azure portal

> [!div class="op_single_selector"]
> - [Azure portal](nsg-flow-logging.md)
> - [PowerShell](network-watcher-nsg-flow-logging-powershell.md)
> - [Azure CLI](network-watcher-nsg-flow-logging-cli.md)
> - [REST API](network-watcher-nsg-flow-logging-rest.md)
> - [ARM template](network-watcher-nsg-flow-logging-azure-resource-manager.md)

Network security group flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through a network security group. For more information about network security group flow logging, see [NSG flow logs overview](network-watcher-nsg-flow-logging-overview.md).

In this article, you learn how to create, change, disable, or delete an NSG flow log using the Azure portal. You can learn how to manage an NSG flow log using [PowerShell](network-watcher-nsg-flow-logging-powershell.md), [Azure CLI](network-watcher-nsg-flow-logging-cli.md), [REST API](network-watcher-nsg-flow-logging-rest.md), or [ARM template](network-watcher-nsg-flow-logging-azure-resource-manager.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A network security group. If you need to create a network security group, see [Create, change, or delete a network security group](../virtual-network/manage-network-security-group.md?tabs=network-security-group-portal).

- An Azure storage account. If you need to create a storage account, see [Create a storage account using PowerShell](../storage/common/storage-account-create.md?tabs=azure-portal).

## Register Insights provider

*Microsoft.Insights* provider must be registered to successfully log traffic flowing through a network security group. If you aren't sure if the *Microsoft.Insights* provider is registered, check its status:

1. In the search box at the top of the portal, enter *subscriptions*. Select **Subscriptions** in the search results.

1. Select the Azure subscription that you want to enable the provider for in **Subscriptions**.

1. Under **Settings**, select **Resource providers**.

1. Enter *insight* in the filter box.

1. Confirm the status of the provider displayed is **Registered**. If the status is **NotRegistered**, select the **Microsoft.Insights** provider then select **Register**.

    :::image type="content" source="./media/nsg-flow-logging/register-microsoft-insights.png" alt-text="Screenshot of registering Microsoft Insights provider in the Azure portal.":::

## Create a flow log

Create a flow log for your network security group. This NSG flow log is saved in an Azure storage account.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select **+ Create** or **Create flow log** blue button.

    :::image type="content" source="./media/nsg-flow-logging/flow-logs.png" alt-text="Screenshot of Flow logs page in the Azure portal." lightbox="./media/nsg-flow-logging/flow-logs.png":::

1. Enter or select the following values in **Create a flow log**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select the Azure subscription of your network security group that you want to log. |
    | Network security group | Select **+ Select resource**. <br> In **Select network security group**, select **myNSG**. Then, select **Confirm selection**. |
    | Flow Log Name | Enter a name for the flow log or leave the default name. **myNSG-myResourceGroup-flowlog** is the default name for this example. |
    | **Instance details** |   |
    | Subscription | Select the Azure subscription of your storage account. |
    | Storage Accounts | Select the storage account that you want to save the flow logs to. If you want to create a new storage account, select **Create a new storage account**. |
    | Retention (days) | Enter a retention time for the logs. Enter *0* if you want to retain the flow logs data in the storage account forever (until you delete it from the storage account). For information about pricing, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/). |

    :::image type="content" source="./media/nsg-flow-logging/create-nsg-flow-log.png" alt-text="Screenshot of creating an NSG flow log in the Azure portal.":::

    > [!NOTE]
    > If the storage account is in a different subscription, the network security group and storage account must be associated with the same Microsoft Entra tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

## Create a flow log and traffic analytics workspace

Create a flow log for your network security group and enable traffic analytics. The NSG flow log is saved in an Azure storage account.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select **+ Create** or **Create flow log** blue button.

    :::image type="content" source="./media/nsg-flow-logging/flow-logs.png" alt-text="Screenshot of Flow logs page in the Azure portal." lightbox="./media/nsg-flow-logging/flow-logs.png":::

1. Enter or select the following values in **Create a flow log**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select the Azure subscription of your network security group that you want to log. |
    | Network security group | Select **+ Select resource**. <br> In **Select network security group**, select **myNSG**. Then, select **Confirm selection**. |
    | Flow Log Name | Enter a name for the flow log or leave the default name. By default, Azure portal creates *{network-security-group}-{resource-group}-flowlog* flow log in **NetworkWatcherRG** resource group. |
    | **Instance details** |   |
    | Subscription | Select the Azure subscription of your storage account. |
    | Storage Accounts | Select the storage account that you want to save the flow logs to. If you want to create a new storage account, select **Create a new storage account**. |
    | Retention (days) | Enter a retention time for the logs. Enter *0* if you want to retain the flow logs data in the storage account forever (until you delete it from the storage account). For information about pricing, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/). |

    :::image type="content" source="./media/nsg-flow-logging/create-nsg-flow-log-basics.png" alt-text="Screenshot of the Basics tab of Create a flow log in the Azure portal.":::

    > [!NOTE]
    > If the storage account is in a different subscription, the network security group and storage account must be associated with the same Microsoft Entra tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).

1. Select **Next: Analytics** button, or select **Analytics** tab. Then enter or select the following values:

    | Setting | Value |
    | ------- | ----- |
    | Flow Logs Version | Select the flow log version. Version 2 is selected by default when you create a flow log using the Azure portal. For more information about flow logs versions, see [Log format of NSG flow logs](network-watcher-nsg-flow-logging-overview.md#log-format). |
    | **Traffic Analytics** |   |
    | Enable Traffic Analytics | Select the checkbox to enable traffic analytics for your flow log. |
    | Traffic Analytics processing interval  | Select the processing interval that you prefer, available options are: **Every 1 hour** and **Every 10 mins**. The default processing interval is every one hour. For more information, see [Traffic Analytics](traffic-analytics.md). |
    | Subscription | Select the Azure subscription of your Log Analytics workspace. |
    | Log Analytics Workspace | Select your Log Analytics workspace. By default, Azure portal creates and selects *DefaultWorkspace-{subscription-id}-{region}* Log Analytics workspace in *defaultresourcegroup-{Region}* resource group. |

    :::image type="content" source="./media/nsg-flow-logging/enable-traffic-analytics.png" alt-text="Screenshot of enabling traffic analytics for a flow log in the Azure portal.":::

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

## Change a flow log

You can change the properties of a flow log after you create it. For example, you can change the flow log version or disable traffic analytics.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the flow log that you want to change.

1. In **Flow logs settings**, you can change any of the following settings:

    - **Flow Logs Version**: Change the flow log version. Available versions are: version 1 and version 2. Version 2 is selected by default when you create a flow log using the Azure portal. For more information about flow logs versions, see [Log format of NSG flow logs](network-watcher-nsg-flow-logging-overview.md#log-format).
    - **Storage Account**: Change the storage account that you want to save the flow logs to. If you want to create a new storage account, select **Create a new storage account**.
    - **Retention (days)**: Change the retention time in the storage account. Enter *0* if you want to retain the flow logs data in the storage account forever (until you manually delete the data from the storage account).
    - **Traffic Analytics**: Enable or disable traffic analytics for your flow log. For more information, see [Traffic Analytics](traffic-analytics.md).
    - **Traffic Analytics processing interval**: Change the processing interval of traffic analytics (if traffic analytics is enabled). Available options are: one hour and 10 minutes. The default processing interval is every one hour. For more information, see [Traffic Analytics](traffic-analytics.md).
    - **Log Analytics workspace**: Change the Log Analytics workspace that you want to save the flow logs to (if traffic analytics is enabled). 

    :::image type="content" source="./media/nsg-flow-logging/change-flow-log.png" alt-text="Screenshot of Flow logs settings page in the Azure portal where you can change some settings." lightbox="./media/nsg-flow-logging/change-flow-log.png":::

## List all flow logs

You can list all flow logs in a subscription or a group of subscriptions. You can also list all flow logs in a region.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. Select **Subscription equals** filter to choose one or more of your subscriptions. You can apply other filters like **Location equals** to list all the flow logs in a region.

    :::image type="content" source="./media/nsg-flow-logging/list-flow-logs.png" alt-text="Screenshot shows how to use filters to list all existing flow logs in a subscription using the Azure portal." lightbox="./media/nsg-flow-logging/list-flow-logs.png":::

## View details of a flow log resource

You can view the details of a flow log in a subscription or a group of subscriptions. You can also list all flow logs in a region.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the flow log that you want to see.

1. In **Flow logs settings**, you can view the settings of the flow log resource.

    :::image type="content" source="./media/nsg-flow-logging/flow-log-settings.png" alt-text="Screenshot of Flow logs settings page in the Azure portal." lightbox="./media/nsg-flow-logging/flow-log-settings.png":::

## Download a flow log

The storage location of a flow log is defined at creation. To access and download flow logs from your storage account, you can use Azure Storage Explorer. Fore more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

NSG flow log files saved to a storage account follow this path:

```
https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/resourceId=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{NetworkSecurityGroupName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
```

For information about the structure of a flow log, see [Log format of NSG flow logs](network-watcher-nsg-flow-logging-overview.md#log-format).

## Disable a flow log

You can temporarily disable an NSG flow log without deleting it. Disabling a flow log stops flow logging for the associated network security group. However, the flow log resource remains with all its settings and associations. You can re-enable it at any time to resume flow logging for the configured network security group.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the checkbox of the flow log that you want to disable.

1. Select **Disable**.

    :::image type="content" source="./media/nsg-flow-logging/disable-flow-log.png" alt-text="Screenshot shows how to disable a flow log in the Azure portal." lightbox="./media/nsg-flow-logging/disable-flow-log.png":::

> [!NOTE]
> If traffic analytics is enabled for a flow log, it must disabled before you can disable the flow log. To disable traffic analytics, see [Change a flow log](#change-a-flow-log).

## Delete a flow log

You can permanently delete an NSG flow log. Deleting a flow log deletes all its settings and associations. To begin flow logging again for the same network security group, you must create a new flow log for it.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the checkbox of the flow log that you want to delete.

1. Select **Delete**.

    :::image type="content" source="./media/nsg-flow-logging/delete-flow-log.png" alt-text="Screenshot shows how to delete a flow log in the Azure portal." lightbox="./media/nsg-flow-logging/delete-flow-log.png":::

> [!NOTE]
> Deleting a flow log does not delete the flow log data from the storage account. Flow logs data stored in the storage account follows the configured retention policy or stays stored in the storage account until manually deleted (in case no retention policy is configured).

## Next steps

- To learn how to use Azure built-in policies to audit or deploy NSG flow logs, see [Manage NSG flow logs using Azure Policy](nsg-flow-logs-policy-portal.md).
- To learn about traffic analytics, see [Traffic analytics](traffic-analytics.md).
