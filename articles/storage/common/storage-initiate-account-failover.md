---
title: Initiate a storage account failover
titleSuffix: Azure Storage
description: Learn how to initiate the failover process for your storage account. Failover can be initiated if the primary storage service endpoints become unavailable, or to perform disaster recovery testing. The failover process updates the secondary region to become the primary region for your storage account.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.topic: how-to
ms.date: 06/13/2024
ms.author: shaas
ms.subservice: storage-common-concepts
---

# Initiate a storage account failover

Microsoft strives to ensure that Azure services are always available. However, unplanned service outages might occasionally occur. To help minimize downtime, Azure Storage supports customer-managed failover to keep your data available during both partial and complete outages.

This article shows how to initiate an account failover for your storage account using the Azure portal, PowerShell, or the Azure CLI. To learn more about account failover, see [Azure storage disaster recovery planning and failover](storage-disaster-recovery-guidance.md).

[!INCLUDE [updated-for-az](../../../includes/storage-failover-unplanned-hns-preview-include.md)]

## Prerequisites

Review these important topics detailed in the [disaster recovery guidance](storage-disaster-recovery-guidance.md#plan-for-failover) article before initiating a customer-managed failover.

- **Potential data loss**: Data loss should be expected during an unplanned storage account failover. For details on the implications of an unplanned account failover and how to prepare for data loss, see the [Anticipate data loss and inconsistencies](storage-disaster-recovery-guidance.md#anticipate-data-loss-and-inconsistencies) section.
- **Geo-redundancy**: Before you can perform a failover, your storage account must be configured for geo-redundancy. Initial synchronization from the primary to the secondary region must complete before the failover process can begin. If your account isn't configured for geo-redundancy, you can change it by following the steps described within the [Change how a storage account is replicated](redundancy-migration.md) article. For more information about Azure storage redundancy options, see the [Azure Storage redundancy](storage-redundancy.md) article. 
- **Understand the different types of account failover**: There are two types of customer-managed failover. See the [Plan for failover](storage-disaster-recovery-guidance.md#plan-for-failover) article to learn about potential use cases for each type, and how they differ.
- **Plan for unsupported features and services**: Review the [Unsupported features and services](storage-disaster-recovery-guidance.md#unsupported-features-and-services) article and take appropriate action before initiating a failover.
- **Supported storage account types**: Ensure that your storage account type can be used to initiate a failover. See [Supported storage account types](storage-disaster-recovery-guidance.md#supported-storage-account-types).
- **Set your expectations for timing and cost**: The time it takes the customer-managed failover process to complete can vary, but typically takes less than one hour. An unplanned failover results in the loss of geo-redundancy configuration. Reconfiguring geo-redundant storage (GRS) typically incurs extra time and cost. For more information, see the [time and cost of failing over](storage-disaster-recovery-guidance.md#the-time-and-cost-of-failing-over) section.

## Initiate the failover

You can initiate either a planned or unplanned customer-managed failover using the Azure portal, PowerShell, or the Azure CLI.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## [Portal](#tab/azure-portal)

Complete the following steps to initiate an account failover using the Azure portal:

1. Navigate to your storage account.

1. Select **Redundancy** from within the **Data management** group. The following image shows the geo-redundancy configuration and failover status of a storage account.

    :::image type="content" source="media/storage-initiate-account-failover/portal-failover-redundancy.png" alt-text="Screenshot showing redundancy and failover status." lightbox="media/storage-initiate-account-failover/portal-failover-redundancy.png":::

1. Verify that your storage account is configured for geo-redundant storage (GRS, RA-GRS, GZRS, or RA-GZRS). If it's not, select the desired redundancy configuration from the **Redundancy** drop-down and select **Save** to commit your change. After the geo-redundancy configuration is changed, your data is synchronized from the primary to the secondary region. This synchronization takes several minutes, and failover can't be initiated until all data is replicated. The following message appears until the synchronization is complete:

    :::image type="content" source="media/storage-initiate-account-failover/portal-failover-repl-in-progress.png" alt-text="Screenshot showing the location of the message indicating that synchronization is still in progress." lightbox="media/storage-initiate-account-failover/portal-failover-repl-in-progress.png":::

1. Select **Prepare for Customer-Managed failover** as shown in the following image:

    :::image type="content" source="media/storage-initiate-account-failover/portal-failover-redundancy.png" alt-text="Screenshot showing redundancy and failover status." lightbox="media/storage-initiate-account-failover/portal-failover-redundancy.png":::

1. Select the type of failover for which you're preparing. The confirmation page varies depending on the type of failover you select.
    **If you select `Unplanned Failover`**:

    A warning is displayed to alert you to the potential data loss, and to information you about the need to manually reconfigure geo-redundancy after the failover:

    :::image type="content" source="media/storage-initiate-account-failover/portal-failover-prepare-failover-unplanned-sml.png" alt-text="Screenshot showing the failover option selected on the Prepare for failover window." lightbox="media/storage-initiate-account-failover/portal-failover-prepare-failover-unplanned-lrg.png":::

    **If you select `Planned failover`** (preview):

    The **Last Sync Time** value is displayed. Failover doesn't occur until after all data is synchronized to the secondary region, preventing data from being lost.

    :::image type="content" source="media/storage-initiate-account-failover/portal-failover-prepare-failover-planned-sml.png" alt-text="Screenshot showing the planned failover option selected on the Prepare for failover window." lightbox="media/storage-initiate-account-failover/portal-failover-prepare-failover-planned-lrg.png":::

    Since the redundancy configuration within each region doesn't change during a planned failover or failback, there's no need to manually reconfigure geo-redundancy after a failover.

1. Review the **Prepare for failover** page. When you're ready, type **yes** and select **Failover** to confirm and initiate the failover process.

    A message is displayed to indicate that the failover is in progress:

    :::image type="content" source="media/storage-initiate-account-failover/portal-failover-in-progress.png" alt-text="Screenshot showing the failover in-progress message." lightbox="media/storage-initiate-account-failover/portal-failover-in-progress-redundancy.png":::

## [PowerShell](#tab/azure-powershell)

To get the current redundancy and failover information for your storage account, and then initiate a failover, follow these steps:

> [!div class="checklist"]
> - [Install the Azure Storage preview module for PowerShell](#install-the-azure-storage-preview-module-for-powershell)
> - [Get the current status of the storage account with PowerShell](#get-the-current-status-of-the-storage-account-with-powershell)
> - [Initiate a failover of the storage account with PowerShell](#initiate-a-failover-of-the-storage-account-with-powershell)

### Install the Azure Storage preview module for PowerShell

To use PowerShell to initiate and monitor a **planned** customer-managed account failover (preview) in addition to a customer-initiated failover, install the [Az.Storage 5.2.2-preview module](https://www.powershellgallery.com/packages/Az.Storage/5.2.2-preview). Earlier versions of the module support customer-managed failover (unplanned), but not planned failover. The preview version supports the new `FailoverType` parameter. Valid values include either `planned` or `unplanned`.

#### Installing and running the preview module on PowerShell 5.1

Recommended best practices include the installation and use of the latest version of PowerShell. If you're having trouble installing the preview module using older PowerShell versions, you might need to [update PowerShellGet to the latest version](/powershell/gallery/powershellget/update-powershell-51) before installing the Az.Storage 5.2.2 preview module.

To install the latest version of PowerShellGet and the Az.Storage preview module, perform the following steps:

1. Use the following cmdlet to update PowerShellGet:

    ```powershell
    Install-Module PowerShellGet –Repository PSGallery –Force
    ```

1. Close and reopen PowerShell
1. Install the Az.Storage preview module using the following cmdlet:

    ```powershell
    Install-Module -Name Az.Storage -RequiredVersion 5.2.2-preview -AllowPrerelease
    ```

1. Determine whether you already have a higher version of the Az.Storage module installed by running the command:

    ```powershell
    Get-InstalledModule Az.Storage -AllVersions
    ```

If a higher version such as 5.3.0 or 5.4.0 is also installed, you need to explicitly import the preview version before using it.

1. Close and reopen PowerShell again
1. Before running any other commands, import the preview version of the module using the following command:

    ```powershell
    Import-Module Az.Storage -RequiredVersion 5.2.2
    ```

1. Verify that the `FailoverType` parameter is supported by running the following command:

    ```powershell
    Get-Help Invoke-AzStorageAccountFailover -Parameter FailoverType
    ```

For more information about installing Azure PowerShell, see [Install the Azure Az PowerShell module](/powershell/azure/install-az-ps).

### Get the current status of the storage account with PowerShell

Check the status of the storage account before failing over. Examine properties that can affect failing over such as:

- The primary and secondary regions and their status
- The storage kind and access tier
- The current failover status
- The last sync time
- The storage account SKU conversion status

```powershell
   # Log in first with Connect-AzAccount
   Connect-AzAccount

   # Specify the resource group name and storage account name
   $rgName = "<your resource group name>"
   $saName = "<your storage account name>"

   # Get the storage account information
   Get-AzStorageAccount `
       -Name $saName `
       -ResourceGroupName $rgName `
       -IncludeGeoReplicationStats
```

To refine the list of properties in the display to the most relevant set, consider replacing the `Get-AzStorageAccount` command in the previous example with the following command:

```powershell
Get-AzStorageAccount `
    -Name $saName `
    -ResourceGroupName $rgName `
    -IncludeGeoReplicationStats `
        | Select-Object Location,PrimaryLocation,SecondaryLocation,StatusOfPrimary,StatusOfSecondary,@{E={$_.Kind};L="AccountType"},AccessTier,LastGeoFailoverTime,FailoverInProgress,StorageAccountSkuConversionStatus,GeoReplicationStats `
    -ExpandProperty Sku `
        | Select-Object Location,PrimaryLocation,SecondaryLocation,StatusOfPrimary,StatusOfSecondary,AccountType,AccessTier,@{E={$_.Name};L="RedundancyType"},LastGeoFailoverTime,FailoverInProgress,StorageAccountSkuConversionStatus `
        -ExpandProperty GeoReplicationStats `
        | fl
```

### Initiate a failover of the storage account with PowerShell

```powershell
Invoke-AzStorageAccountFailover `
    -ResourceGroupName $rgName `
    -Name $saName `
    -FailoverType <planned|unplanned> # Specify either planned or unplanned failover
```

## [Azure CLI](#tab/azure-cli)

Complete the following steps to get the current redundancy and failover information for your storage account, and then initiate a failover:

> [!div class="checklist"]
> - [Install the Azure Storage preview extension for Azure CLI](#install-the-azure-storage-preview-extension-for-azure-cli)
> - [Get the current status of the storage account with Azure CLI](#get-the-current-status-of-the-storage-account-with-azure-cli)
> - [Initiate a failover of the storage account with Azure CLI](#initiate-a-failover-of-the-storage-account-with-azure-cli)

### Install the Azure Storage preview extension for Azure CLI

1. Install the latest version of the Azure CLI. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).
1. Install the Azure CLI storage preview extension using the following command:

    ```azurecli
    az extension add -n storage-preview
    ```

    > [!IMPORTANT]
    > The Azure CLI storage preview extension adds support for features or arguments that are currently in PREVIEW.
    >
    > See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Get the current status of the storage account with Azure CLI

Run the following command to get the current geo-replication information for the storage account. Replace the placeholder values in angle brackets (**\<\>**) with your own values:

```azurecli
az storage account show \
    --resource-group <resource-group-name> \
    --name <storage-account-name> \
    --expand geoReplicationStats
```

For more information about the `storage account show` command, run:

```azurecli
az storage account show --help
```

### Initiate a failover of the storage account with Azure CLI

Run the following command to initiate a failover of the storage account. Replace the placeholder values in angle brackets (**\<\>**) with your own values:

```azurecli
az storage account failover \
    --resource-group <resource-group-name> \
    --name <storage-account-name> \
    --failover-type <planned|unplanned>
```

For more information about the `storage account failover` command, run:

```azurecli
az storage account failover --help
```

---

## Monitor the failover

You can monitor the status of the failover using the Azure portal, PowerShell, or the Azure CLI.

## [Portal](#tab/azure-portal)

The status of the failover is shown in the Azure portal in **Notifications**, in the activity log, and on the **Redundancy** page of the storage account.

### Notifications

To check the status of the failover, select the bell-shaped notification icon on the far right of the Azure portal global page header:

:::image type="content" source="media/storage-initiate-account-failover/portal-failover-in-progress-notification.png" alt-text="Screenshot showing the failover in-progress message in notifications." lightbox="media/storage-initiate-account-failover/portal-failover-in-progress-notification.png":::

### Activity log

To view the detailed status of a failover, select the **More events in the activity log** link in the notification, or go to the **Activity log** page of the storage account:

:::image type="content" source="media/storage-initiate-account-failover/portal-failover-activity-log.png" alt-text="Screenshot showing the failover status in the activity log." lightbox="media/storage-initiate-account-failover/portal-failover-activity-log.png":::

### Redundancy page

Messages on the redundancy page of the storage account are displayed to provide failover status updates:

:::image type="content" source="media/storage-initiate-account-failover/portal-failover-in-progress-redundancy.png" alt-text="Screenshot showing the in-progress failover on the redundancy page." lightbox="media/storage-initiate-account-failover/portal-failover-in-progress-redundancy.png":::

If the failover is nearing completion, the redundancy page might show the original secondary region as the new primary, but still display a message indicating the failover is in progress:

:::image type="content" source="media/storage-initiate-account-failover/portal-failover-in-progress-redundancy-incomplete.png" alt-text="Screenshot showing the failover in-progress but incomplete on the redundancy page." lightbox="media/storage-initiate-account-failover/portal-failover-in-progress-redundancy-incomplete.png":::

When the failover is complete, the redundancy page displays the last failover time and the new primary region's location. In the case of a planned failover, the new secondary region is also displayed. The following image shows the new storage account status after an unplanned failover:

:::image type="content" source="media/storage-initiate-account-failover/portal-failover-complete.png" alt-text="Screenshot showing the failover complete on the redundancy page." lightbox="media/storage-initiate-account-failover/portal-failover-complete.png":::

## [PowerShell](#tab/azure-powershell)

You can use Azure PowerShell to get the current redundancy and failover information for your storage account. To check the status of the storage account failover see [Get the current status of the storage account with PowerShell](#get-the-current-status-of-the-storage-account-with-powershell).

## [Azure CLI](#tab/azure-cli)

You can use Azure PowerShell to get the current redundancy and failover information for your storage account. To check the status of the storage account failover see [Get the current status of the storage account with Azure CLI](#get-the-current-status-of-the-storage-account-with-azure-cli).

---

## Important implications of unplanned failover

When you initiate an unplanned failover of your storage account, the DNS records for the secondary endpoint are updated so that the secondary endpoint becomes the primary endpoint. Make sure that you understand the potential impact to your storage account before you initiate a failover.

To estimate the extent of likely data loss before you initiate a failover, check the **Last Sync Time** property. For more information about checking the **Last Sync Time** property, see [Check the Last Sync Time property for a storage account](last-sync-time-get.md).

The time it takes to failover after initiation can vary though typically less than one hour.

After the failover, your storage account type is automatically converted to locally redundant storage (LRS) in the new primary region. You can re-enable geo-redundant storage (GRS) or read-access geo-redundant storage (RA-GRS) for the account. Note that converting from LRS to GRS or RA-GRS incurs an additional cost. The cost is due to the network egress charges to re-replicate the data to the new secondary region. For additional information, see [Bandwidth Pricing Details](https://azure.microsoft.com/pricing/details/bandwidth/).

After you re-enable GRS for your storage account, Microsoft begins replicating the data in your account to the new secondary region. Replication time depends on many factors, which include:

- The number and size of the objects in the storage account. Many small objects can take longer than fewer and larger objects.
- The available resources for background replication, such as CPU, memory, disk, and WAN capacity. Live traffic takes priority over geo replication.
- If using Blob storage, the number of snapshots per blob.
- If using Table storage, the [data partitioning strategy](/rest/api/storageservices/designing-a-scalable-partitioning-strategy-for-azure-table-storage). The replication process can't scale beyond the number of partition keys that you use.

When an unplanned failover occurs, all data in the primary region is lost as the secondary region becomes the new primary. All write operations made to the primary region's storage account need to be repeated after geo-redundancy is re-enabled. For more details, refer to  [Azure storage disaster recovery planning and failover](storage-disaster-recovery-guidance.md#anticipate-data-loss-and-inconsistencies).

The Azure Storage resource provider does not fail over during the failover process. As a result, the Azure Storage REST API's [Location](/dotnet/api/microsoft.azure.management.storage.models.trackedresource.location) property continues to return the original location after the failover is complete.

Storage account failover is a temporary solution to a service outage and shouldn't be used as part of your data migration strategy. For information about how to  migrate your storage accounts, see [Azure Storage migration overview](storage-migration-overview.md).

## See also

- [Disaster recovery and storage account failover](storage-disaster-recovery-guidance.md)
- [Check the Last Sync Time property for a storage account](last-sync-time-get.md)
- [Use geo-redundancy to design highly available applications](geo-redundant-design.md)
- [Tutorial: Build a highly available application with Blob storage](../blobs/storage-create-geo-redundant-storage.md)