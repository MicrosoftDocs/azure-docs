---
title: Initiate a storage account failover
titleSuffix: Azure Storage
description: Learn how to initiate an account failover if the primary endpoint for your storage account becomes unavailable. The failover updates the secondary region to become the primary region for your storage account.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.topic: how-to
ms.date: 09/25/2023
ms.author: shaas
ms.subservice: storage-common-concepts
---

# Initiate a storage account failover

Azure Storage supports customer-initiated account failover for geo-redundant storage accounts. With account failover, you can initiate the failover process for your storage account if the primary storage service endpoints become unavailable, or to perform disaster recovery testing. The failover updates the DNS entries for the storage service endpoints such that the endpoints for the secondary region become the new primary endpoints for your storage account. Once the failover is complete, clients can begin writing to the new primary endpoints.

This article shows how to initiate an account failover for your storage account using the Azure portal, PowerShell, or the Azure CLI.

> [!WARNING]
> An account failover typically results in some data loss. To understand the implications of an account failover and to prepare for data loss, review [Data loss and inconsistencies](storage-disaster-recovery-guidance.md#anticipate-data-loss-and-inconsistencies).

To learn more about account failover, see [Azure storage disaster recovery planning and failover](storage-disaster-recovery-guidance.md).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Prerequisites

Before failing over your storage account, review these important articles covered in the [Plan for storage account failover](storage-disaster-recovery-guidance.md#plan-for-storage-account-failover).

- **Potential data loss**: When you fail over your storage account in response to an unexpected outage in the primary region, some data loss is expected.

> [!WARNING]
> It is very important to understand the expectations for loss of data with certain types of failover, and to plan for it. For details on the implications of an account failover and to how to prepare for data loss, see [Anticipate data loss and inconsistencies](storage-disaster-recovery-guidance.md#anticipate-data-loss-and-inconsistencies).
- **Geo-redundancy**: Before you can perform an account failover on your storage account, make sure it's configured for geo-redundancy and that the initial synchronization from the primary to the secondary region is complete. For more information about Azure storage redundancy options, see [Azure Storage redundancy](storage-redundancy.md). If your account isn't configured for geo-redundancy, you can change it. For more information, see [Change how a storage account is replicated](redundancy-migration.md).
- **Understand the different types of account failover**: There are three types of storage account failover. To learn the use cases for each and how they function differently, see [Plan for storage account failover](storage-disaster-recovery-guidance.md#plan-for-storage-account-failover). This article focuses on how to initiate a *customer-managed failover* to recover from the service endpoints being unavailable in the primary region, or a *customer-managed* ***planned*** *failover* (preview) used primarily to perform disaster recovery testing.
- **Plan for unsupported features and services**: Review [Unsupported features and services](storage-disaster-recovery-guidance.md#unsupported-features-and-services) and take the appropriate action before initiating a failover.
- **Supported storage account types**: Ensure the type of your storage account supports customer-initiated failover. See [Supported storage account types](storage-disaster-recovery-guidance.md#supported-storage-account-types).
- **Set your expectations for timing and cost**: The time it takes to fail over after you initiate it can vary, but it typically takes less than one hour. A customer-managed failover associated with an outage in the primary region loses its geo-redundancy configuration after a failover (and failback). Reconfiguring GRS typically incurs extra time and cost. For more information, see [The time and cost of failing over](storage-disaster-recovery-guidance.md#the-time-and-cost-of-failing-over).

## Initiate the failover

You can initiate either type of customer-managed failover using the Azure portal, PowerShell, or the Azure CLI.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## [Portal](#tab/azure-portal)

To initiate an account failover from the Azure portal, follow these steps:

1. Navigate to your storage account.
1. Under **Data management**, select **Redundancy**. The following image shows the geo-redundancy configuration and failover status of a storage account.

    :::image type="content" source="media/storage-initiate-account-failover/portal-failover-redundancy.png" alt-text="Screenshot showing redundancy and failover status." lightbox="media/storage-initiate-account-failover/portal-failover-redundancy.png":::

    If your storage account is configured with a hierarchical namespace enabled, the following message is displayed:
    :::image type="content" source="media/storage-initiate-account-failover/portal-failover-hns-not-supported.png" alt-text="Screenshot showing that failover isn't supported for hierarchical namespace." lightbox="media/storage-initiate-account-failover/portal-failover-hns-not-supported.png":::

1. Verify that your storage account is configured for geo-redundant storage (GRS, RA-GRS, GZRS or RA-GZRS). If it's not, then select the desired redundancy configuration under **Redundancy** and select **Save** to change it. After changing the geo-redundancy configuration, it will take several minutes for your data to synchronize from the primary to the secondary region. You cannot initiate a failover until the synchronization is complete. You might see the following message on the **Redundancy** page until all of your data is replicated:

    :::image type="content" source="media/storage-initiate-account-failover/portal-failover-repl-in-progress.png" alt-text="Screenshot showing message indicating synchronization is still in progress." lightbox="media/storage-initiate-account-failover/portal-failover-repl-in-progress.png":::

1. Select **Prepare for failover**. You will be presented with a page similar to the image that follows where you can select the type of failover to perform:

    :::image type="content" source="media/storage-initiate-account-failover/portal-failover-prepare.png" lightbox="media/storage-initiate-account-failover/portal-failover-prepare.png" alt-text="Screenshot showing the prepare for failover window.":::

    > [!NOTE]
    > If your storage account is configured with a hierarchical namespace enabled, the `Failover` option will be grayed out.
1. Select the type of failover to prepare for. The confirmation page varies depending on the type of failover you select.

    **If you select `Failover`**:

    You will see a warning about potential data loss and information about needing to manually reconfigure geo-redundancy after the failover:

    :::image type="content" source="media/storage-initiate-account-failover/portal-failover-prepare-failover.png" alt-text="Screenshot showing the failover option selected on the Prepare for failover window." lightbox="media/storage-initiate-account-failover/portal-failover-prepare-failover.png":::

    For more information about potential data loss and what happens to your account redundancy configuration during failover, see:

    > [Anticipate data loss and inconsistencies](storage-disaster-recovery-guidance.md#anticipate-data-loss-and-inconsistencies)
    >
    > [Plan for storage account failover](storage-disaster-recovery-guidance.md#plan-for-storage-account-failover)
    The **Last Sync Time** property indicates the last time the secondary was synchronized with the primary. The difference between **Last Sync Time** and the current time provides an estimate of the extent of data loss that you will experience after the failover is completed. For more information about checking the **Last Sync Time** property, see [Check the Last Sync Time property for a storage account](last-sync-time-get.md).

    **If you select `Planned failover`** (preview):

    You will see the **Last Sync Time** value, but notice in the image that follows that the failover will not occur until after all of the remaining data is synchronized to the secondary region.

    :::image type="content" source="media/storage-initiate-account-failover/portal-failover-prepare-failover-planned.png" alt-text="Screenshot showing the planned failover option selected on the prepare for failover window." lightbox="media/storage-initiate-account-failover/portal-failover-prepare-failover-planned.png":::

    As a result, data loss is not expected during the failover. Since the redundancy configuration within each region does not change during a planned failover or failback, there is no need to manually reconfigure geo-redundancy after a failover.

1. Review the **Prepare for failover** page. When you are ready, type **yes** and select **Failover** to confirm and initiate the failover process.

    You will see a message indicating the failover is in progress:

    :::image type="content" source="media/storage-initiate-account-failover/portal-failover-in-progress.png" alt-text="Screenshot showing the failover in-progress message." lightbox="media/storage-initiate-account-failover/portal-failover-in-progress-redundancy.png":::

## [PowerShell](#tab/azure-powershell)

To get the current redundancy and failover information for your storage account, and then initiate a failover, follow these steps:

> [!div class="checklist"]
> - [Install the Azure Storage preview module for PowerShell](#install-the-azure-storage-preview-module-for-powershell)
> - [Get the current status of the storage account with PowerShell](#get-the-current-status-of-the-storage-account-with-powershell)
> - [Initiate a failover of the storage account with PowerShell](#initiate-a-failover-of-the-storage-account-with-powershell)
### Install the Azure Storage preview module for PowerShell

To use PowerShell to initiate and monitor a **planned** customer-managed account failover (preview) in addition to a customer-initiated failover, install the [Az.Storage 5.2.2-preview module](https://www.powershellgallery.com/packages/Az.Storage/5.2.2-preview). Earlier versions of the module support customer-managed failover (unplanned), but not planned failover. The preview version supports the new `FailoverType` parameter which allows you to specify either `planned` or `unplanned`.

#### Installing and running the preview module on PowerShell 5.1

Microsoft recommends you install and use the latest version of PowerShell, but if you are installing the preview module on Windows PowerShell 5.1, and you get the following error, you will need to [update PowerShellGet to the latest version](/powershell/gallery/powershellget/update-powershell-51) before installing the Az.Storage 5.2.2 preview module:

```Sample
PS C:\Windows\system32> Install-Module -Name Az.Storage -RequiredVersion 5.2.2-preview -AllowPrerelease
Install-Module : Cannot process argument transformation on parameter 'RequiredVersion'. Cannot convert value "5.2.2-preview" to type "System.Version". Error: "Input string was not in a correct format."
At line:1 char:50
+ ... nstall-Module -Name Az.Storage -RequiredVersion 5.2.2-preview -AllowP ...
+                                                     ~~~~~~~~~~~~~
    + CategoryInfo          : InvalidData: (:) [Install-Module], ParameterBindingArgumentTransformationException
    + FullyQualifiedErrorId : ParameterArgumentTransformationError,Install-Module
```

To install the latest version of PowerShellGet and the Az.Storage preview module, perform the following steps:

1. Run the following command to update PowerShellGet:

    ```powershell
    Install-Module PowerShellGet –Repository PSGallery –Force
    ```

1. Close and reopen PowerShell
1. Install the Az.Storage preview module using the following command:

    ```powershell
    Install-Module -Name Az.Storage -RequiredVersion 5.2.2-preview -AllowPrerelease
    ```

1. Determine whether you already have a higher version of the Az.Storage module installed by running the command:

    ```powershell
    Get-InstalledModule Az.Storage -AllVersions
    ```

If a higher version such as 5.3.0 or 5.4.0 is also installed, you will need to explicitly import the preview version before using it.

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

To refine the list of properties in the display to the most relevant set, consider replacing the Get-AzStorageAccount command in the example above with the following command:

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
    -FailoverType <planned|unplanned> # Specify "planned" or "unplanned" failover (without the quotes)

```

## [Azure CLI](#tab/azure-cli)

To get the current redundancy and failover information for your storage account, and then initiate a failover, follow these steps:

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

To check the status of the failover, select the notification icon (bell) on the far right of the Azure portal global page header:

:::image type="content" source="media/storage-initiate-account-failover/portal-failover-in-progress-notification.png" alt-text="Screenshot showing the failover in-progress message in notifications." lightbox="media/storage-initiate-account-failover/portal-failover-in-progress-notification.png":::

### Activity log

To view the detailed status of a failover, select the **More events in the activity log** link in the notification, or go to the **Activity log** page of the storage account:

:::image type="content" source="media/storage-initiate-account-failover/portal-failover-activity-log.png" alt-text="Screenshot showing the failover status in the activity log." lightbox="media/storage-initiate-account-failover/portal-failover-activity-log.png":::

### Redundancy page

Messages on the redundancy page of the storage account will show if the failover is still in progress:

:::image type="content" source="media/storage-initiate-account-failover/portal-failover-in-progress-redundancy.png" alt-text="Screenshot showing the failover in-progress on the redundancy page." lightbox="media/storage-initiate-account-failover/portal-failover-in-progress-redundancy.png":::

If the failover is nearing completion, the redundancy page might show the original secondary region as the new primary, but still display a message indicating the failover is in progress:

:::image type="content" source="media/storage-initiate-account-failover/portal-failover-in-progress-redundancy-incomplete.png" alt-text="Screenshot showing the failover in-progress but incomplete on the redundancy page." lightbox="media/storage-initiate-account-failover/portal-failover-in-progress-redundancy-incomplete.png":::

When the failover is complete, the redundancy page will show the last failover time and the location of the new primary region. If a planned failover was done, the new secondary region will also be displayed. The following image shows the new storage account status after a failover resulting from an outage of the endpoints for the original primary (unplanned):

:::image type="content" source="media/storage-initiate-account-failover/portal-failover-complete.png" alt-text="Screenshot showing the failover complete on the redundancy page." lightbox="media/storage-initiate-account-failover/portal-failover-complete.png":::

## [PowerShell](#tab/azure-powershell)

You can use Azure PowerShell to get the current redundancy and failover information for your storage account. To check the status of the storage account failover see [Get the current status of the storage account with PowerShell](#get-the-current-status-of-the-storage-account-with-powershell).

## [Azure CLI](#tab/azure-cli)

You can use Azure PowerShell to get the current redundancy and failover information for your storage account. To check the status of the storage account failover see [Get the current status of the storage account with Azure CLI](#get-the-current-status-of-the-storage-account-with-azure-cli).

---

## See also

- [Disaster recovery and storage account failover](storage-disaster-recovery-guidance.md)
- [Check the Last Sync Time property for a storage account](last-sync-time-get.md)
- [Use geo-redundancy to design highly available applications](geo-redundant-design.md)
- [Tutorial: Build a highly available application with Blob storage](../blobs/storage-create-geo-redundant-storage.md)
