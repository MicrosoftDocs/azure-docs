---
title: Azure Storage Geo Priority Replication
titleSuffix: Azure Storage
description: Learn how Azure Storage Geo Priority Replication helps maintain high availability and cross-region data integrity.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.topic: concept-article
ms.date: 11/04/2025
ms.author: shaas
ms.subservice: storage-common-concepts
ms.custom: references_regions, engagement
# Customer intent: "As a cloud architect, I want to understand the Azure Object and Geo-Redundant Storage Replication SLA so that I can understand what to expect in terms of data durability and high availability requirements."
---

<!--
Initial: 98 (896/1)
Current: 99 (975/1)
-->

# Azure Storage Geo Priority Replication

Azure Blob Storage Geo Priority Replication is designed to meet the stringent compliance and business continuity requirements of Azure Blob users. The feature prioritizes the replication of blob data for storage accounts with geo-redundant storage (GRS) and geo-zone redundant storage (GZRS) enabled. This prioritization accelerates data replication between the primary and secondary regions of these geo-redundant accounts. 

For supported workloads, a Service Level Agreement (SLA) also backs geo priority replication, and applies to any account that has Geo priority replication enabled. It guarantees that the Last Sync Time (LST) for your account's Block Blob data remains lagged 15 minutes or less for 99.0% of the billing month. In addition to prioritized replication traffic, the feature includes enhanced monitoring and detailed telemetry.

Refer to the official [SLA terms](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1&msockid=0d36bfb9b86d68ee3afdae84b944695f) for a comprehensive list of eligibility requirements.

## Benefits of geo priority replication

While there are many benefits to using geo priority replication, it's especially beneficial, for example, in the following scenarios:

- Meeting compliance regulations that require a strict Recovery Point Objective (RPO) for storage data.
- The guaranteed sync time, provides confidence about data durability and availability, especially if there is an unexpected outage and an [unplanned failover](storage-failover-customer-managed-unplanned.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json) is required in the primary region.

## SLA eligibility and exclusions

While Geo Priority Replication introduces an SLA-backed capability for Azure Blob Storage, it comes with several important exclusions. Users benefit from prioritized replication along with the improved visibility into their Blob Geo Lag while Geo priority replication is enabled. However, there are workloads and time periods where users aren't eligible for the Service Level Agreement for Geo priority replication. These limitations include:

- Other blob types, such as page blobs and append blobs.<br />The SLA applies exclusively to Block Blob data. If these unsupported blob types contribute to geo lag, the affected time window is excluded from SLA eligibility.
- Storage accounts where Append or Page Blob API calls were made within the last 30 days.<br />This might impact users that have features enabled on their account that create append or page blobs. For example, Change Feed, Object Replication or resource logs in Azure Monitor
- Storage accounts with a Last Sync Time greater than 15 minutes lagged during the enablement of Geo priority replication.<br />Data replication prioritization begins immediately after enabling the feature, but the SLA might not apply during this initial sync period. If the account's Last Sync Time exceeds 15 minutes during this time, the SLA doesn't apply until the Last Sync Time is consistently at or below 15 minutes lagged. Customers can [monitor their LST](last-sync-time-get.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json) and replication status through Azure's provided metrics and dashboards.
- Time periods where:
    - Your storage account data transfer rate exceeds 1 gigabit per second (Gbps) and the resulting back log of writes are being replicated, or
    - Your storage account exceeds 100 CopyBlob requests per second and the resulting back log of writes are being replicated
    
These limitations are critical to understanding how and when the SLA applies, and Azure provides detailed telemetry and metrics to help customers monitor their eligibility throughout the billing month. During these intervals, although replication of the data remains prioritized, the account is temporarily excluded from SLA eligibility. Refer to the official [SLA terms](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1&msockid=0d36bfb9b86d68ee3afdae84b944695f) for a comprehensive list of eligibility requirements. 

> [!IMPORTANT]
> Certain operational scenarios can also disrupt SLA coverage. For example, an unplanned failover will automatically disable Geo Priority Replication, requiring you to re-enable the feature manually after geo-redundancy is restored. By comparison, planned failovers and account conversions between GRS and geo zone redundant storage (GZRS) don't affect SLA eligibility, provided the account remains within guardrails.

## Monitor compliance

> [!IMPORTANT]
> Geo Blob Lag metrics are currently in PREVIEW and available in all regions where Geo priority replication is supported.
> To opt in to the preview, see [Set up preview features in Azure subscription](/azure/azure-resource-manager/management/preview-features) and specify AllowGeoPriorityReplicationMetricsInPortal as the feature name. The provider name for this preview feature is Microsoft.Storage.
> 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

To ensure transparency and empower customers to track the performance of Geo priority replication, Azure provides a new monitoring tool integrated directly into Azure Monitor Metrics. After geo priority replication is enabled, you have the ability to view the new **Geo Blob Lag metric (preview)** for Blob data on a per-account basis. You can check your "Geo blob lag" performance throughout the month via the **Redundancy** and **Metrics** panes. The **Geo Blob Lag metric (preview)** allows you to monitor the lag, or the number of seconds since the last full data copy between the primary and secondary regions, of your block blob data. This metric allows you to assess the performance trends and identify potential SLA breaches for your account.

After geo priority replication is enabled and you register for the Geo Blob Lag metric (preview) you have the ability to view the new metric.

> [!IMPORTANT]
> Geo Blob Lag metrics can take up to 24 hours to begin displaying after registering for the feature.

:::image type="content" source="media/storage-redundancy-priority-replication/replication-enabled-sml.png" alt-text="Screenshot showing the geo priority replication enabled status for existing accounts." lightbox="media/storage-redundancy-priority-replication/replication-enabled-lrg.png":::

## Enable and disable Geo-Redundant Storage replication

Enabling and disabling Geo Priority Replication is straightforward and can be completed via the Azure portal, PowerShell, or the Azure CLI. It can be enabled during the process of creating a new account, or enabled or disabled on existing accounts.

### Enable replication during new account creation

To enable Geo Priority Replication when creating a new storage account, complete the following steps:

# [Azure portal](#tab/portal)

1. Navigate to the Azure portal and create a new storage account.
1. In the **Basics** tab, select the checkbox for **Geo priority replication** as shown in the following screenshot.

    :::image type="content" source="media/storage-redundancy-priority-replication/replication-new-accounts-sml.png" alt-text="Screenshot showing the location of the geo priority replication checkbox for a new storage account." lightbox="media/storage-redundancy-priority-replication/replication-new-accounts-lrg.png":::

# [Azure PowerShell](#tab/powershell)

Before running the following commands, ensure you have the latest Azure PowerShell version installed. You can find installation instructions at [Azure PowerShell](/powershell/azure/install-azure-powershell).

You can use the `New-AzStorageAccount` cmdlet to create a new storage account with Geo Priority Replication enabled. Use the example script below, or refer to the [New-AzStorageAccount documentation](/powershell/module/az.storage/new-azstorageaccount?view=azps-14.6.0&preserve-view=true#example-22-create-a-storage-account-with-blob-geo-priority-replication-enabled) for more details.

```powershell

# Login to your Azure account
Connect-AzAccount

# Set variables 
$rgname         = "<resource-group-name">
$newAccountName = "<new-account-name>"
 
# Create storage account with geo priority replication enabled
$account = New-AzStorageAccount -ResourceGroupName $rgname `
    -StorageAccountName $newAccountName -SkuName Standard_GRS `
    -Location centralusEUAP -EnableBlobGeoPriorityReplication $true

```
# [Azure CLI](#tab/cli)

Before running the following commands, ensure you have the latest Azure CLI version installed. You can find installation instructions at [Azure CLI](/cli/azure/install-azure-cli).

You can use the `az storage account create` command to create a new storage account with Geo Priority Replication enabled. Use the example script below, or refer to the [az storage account create](/cli/azure/storage/account?view=azure-cli-latest&preserve-view=true#az-storage-account-create) documentation for more details.

```azurecli-interactive

# Login to your Azure account
Connect-AzAccount

# Set variables
$rgname          = "<resource-group-name>"
$newAccountName  = "<new-account-name>"

# Create storage account with 
# geo priority replication enabled
az storage account create -n $newAccountName /
    -g $rgname --sku Standard_GRS /
    --enable-blob-geo-priority-replication true
```

---

### Enable or disable replication for existing accounts

To enable or disable Geo Priority Replication for an existing storage account, complete the following steps:

# [Azure portal](#tab/portal)

1. Navigate to the Azure portal and select a storage account. 
1. In the **Data Management** group, select **Redundancy** to display the redundancy options for the storage account.
1. To enable the feature, select the **Geo priority replication (Blob only)** checkbox as shown in the following screenshot, and then select **Save**.

    :::image type="content" source="media/storage-redundancy-priority-replication/replication-existing-accounts-sml.png" alt-text="Screenshot showing the location of the geo priority replication checkbox for enabling existing accounts." lightbox="media/storage-redundancy-priority-replication/replication-existing-accounts-lrg.png":::

1. To disable the feature, de-select the **Geo priority replication (Blob only)** checkbox as shown in the following screenshot, and then select **Save**.

    :::image type="content" source="media/storage-redundancy-priority-replication/replication-disabled-existing-accounts-sml.png" alt-text="Screenshot showing the location of the geo priority replication checkbox for disabling existing accounts." lightbox="media/storage-redundancy-priority-replication/replication-disabled-existing-accounts-lrg.png":::

1. Ensure that the setting is saved successfully.

    When you enable the feature, validate that the **Geo priority replication** status is selected, and that the **View metrics** link is available and enabled as shown in the following screenshot.

    :::image type="content" source="media/storage-redundancy-priority-replication/replication-enabled-sml.png" alt-text="Screenshot showing the geo priority replication enabled status for existing accounts." lightbox="media/storage-redundancy-priority-replication/replication-enabled-lrg.png":::

    When you disable the feature, validate that the **Geo priority replication** status is not selected, and that the **View metrics** link is not available as shown in the following screenshot.

    :::image type="content" source="media/storage-redundancy-priority-replication/replication-disabled-sml.png" alt-text="Screenshot showing the location of the geo priority replication checkbox for disabling the feature." lightbox="media/storage-redundancy-priority-replication/replication-disabled-lrg.png":::

# [Azure PowerShell](#tab/powershell)

Before running the following commands, ensure you have the latest Azure PowerShell version installed. You can find installation instructions at [Azure PowerShell](/powershell/azure/install-azure-powershell).

You can use the `Set-AzStorageAccount` cmdlet to enable Geo Priority Replication on an existing storage account. Use the example script below, or refer to the [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount?view=azps-14.6.0&preserve-view=true#-enableblobgeopriorityreplication) documentation for more details.

```powershell
# Login to your Azure account
Connect-AzAccount
 
# Set variables
$rgname              = "<resource-group-name>"
$storageAccountName  = "<storage-account-name>"
 
# Update storage account with Geo Priority Replication enabled
$account = Set-AzStorageAccount -ResourceGroupName $rgname -StorageAccountName $storageAccountName -EnableBlobGeoPriorityReplication $true

# Update storage account with Geo Priority Replication disabled
$account = Set-AzStorageAccount -ResourceGroupName $rgname -StorageAccountName $storageAccountName -EnableBlobGeoPriorityReplication $false
```

# [Azure CLI](#tab/cli)

Before running the following commands, ensure you have the latest Azure CLI installed. You can find installation instructions at [Azure CLI](/cli/azure/install-azure-cli).

You can use the `az storage account update` command to enable or disable Geo Priority Replication on an existing storage account. Use the example script below, or refer to the [az storage account update](/cli/azure/storage/account?view=azure-cli-latest&preserve-view=true#az-storage-account-update) documentation for more details.

```azurecli-interactive

# Login to your Azure account
Connect-AzAccount

# Set variables
$rgname              = "<resource-group-name>"
$storageAccountName  = "<storage-account-name>"

# Update existing storage account to enable geo priority replication
az storage account update -n $storageAccountName -g $rgname --enable-blob-geo-priority-replication true

# Update existing storage account to disable geo priority replication
az storage account update -n $storageAccountName -g $rgname --enable-blob-geo-priority-replication false

```

---

## Feature pricing

Billing for geo priority replication will begin on January 1st, 2026. All existing accounts with geo priority replication enabled and new accounts that enable the feature will be billed as of January 1st, 2026. Enabling geo priority replication comes with a per-GB cost, for detailed pricing information, refer to the [Azure Storage pricing page](https://azure.microsoft.com/pricing/details/storage/).

> [!IMPORTANT]
> When you disable Geo Priority Replication, the account is billed for 30 days beyond the date on which the feature was disabled.

## Next steps
- [Understand Azure Storage redundancy options](storage-redundancy.md)
- [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/)