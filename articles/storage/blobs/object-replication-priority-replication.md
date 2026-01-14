---
title: Introducing object replication priority replication for block blobs
titleSuffix: Azure Storage
description: Object replication's priority replication feature allows users to obtain prioritized replication from their source storage account to the destination storage account of their replication policy.
author: stevenmatthew

ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 10/22/2025
ms.author: shaas
ms.custom: references_regions

# Customer intent: As a cloud storage administrator, I want to implement priority object replication for block blobs, so that I can improve data availability, reduce read latency, and optimize cost-efficiency across multiple regions.
---

# Priority replication for Azure Storage object replication

Object replication (OR) currently copies all operations from a source storage account to one or more destination accounts asynchronously, with no guaranteed completion time. However, with the introduction of object replication priority replication, users can now choose to prioritize the replication of the operations in their replication policy.

When a replication's source and destination account are within the same continent, OR priority replication also replicates 99.0% of objects within 15 minutes for supported workloads. For more information, see [SLA terms](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1&msockid=0d36bfb9b86d68ee3afdae84b944695f) for a comprehensive list of eligibility requirements.

[!INCLUDE [object-replication-alert](includes/object-replication-alert.md)]


## Benefits of priority replication

Object Replication (OR) priority replication significantly improves the replication performance and observability for Azure Object Replication. Moreover, priority replication comes with a Service Level Agreement (SLA) that provides users with a performance guarantee provided the source and destination storage accounts are located within the same continent. For supported workloads OR priority replication also replicates 99.0% of objects within 15 minutes. This level of assurance is especially valuable for scenarios involving disaster recovery, business continuity, and high-availability architectures.

In addition to performance guarantees, priority replication automatically enables OR metrics, which enhances visibility into replication progress. These metrics allow users to monitor the number of operations and bytes pending replication, segmented into time buckets such as 0–5 minutes, 5–10 minutes, and beyond. This detailed insight helps teams proactively manage replication health and identify potential delays. To learn more about OR metrics, see the [replication metrics](object-replication-overview.md#replication-metrics) article.

## SLA eligibility and exclusions

When Object Replication Priority Replication is enabled, users benefit from prioritized replication along with the improved visibility into their replication progress from OR metrics. While the replication from the source storage account to destination storage account remains prioritized, there are limitations to which workloads are eligible for the Service Level Agreement for Priority Replication. These limitations include:

- Objects larger than 5 gigabytes (GB).
- Objects that are modified more than 10 times per second.
- Object Replication Policies where the Source Storage Account and Destination Storage Account aren't within the same continent.
- Storage accounts that are:
    - Larger than 5 petabytes (PB), or 
    - Have more than 10 billion blobs, and 
- During time periods where:
    - Your storage account or Replication Policy data transfer rate exceeds 1 gigabit per second (Gbps) and the resulting back log of writes are being replicated.
    - Your storage account or Replication Policy exceeds 1,000 PUT or DELETE operations per second and the resulting back log of writes are being replicated, and 
    - Existing blob replication is pending following a recent Replication Policy creation or update. Existing blob replication is estimated to progress at 100 TB per day on average but might experience reduced velocity when blobs with many versions are present.
  
Refer to the official [SLA terms](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1&msockid=0d36bfb9b86d68ee3afdae84b944695f) for a comprehensive list of eligibility requirements.

> [!IMPORTANT]
> Although a storage account can have up to two object replication policies, priority replication can only be enabled on one object replication policy per source storage account. Users should plan accordingly when deciding to opt out of Priority replication, especially if the feature was enabled for critical workloads.

## Feature pricing

Enabling OR priority replication has a per-GB cost for all new data ingress. For detailed Azure Storage pricing information, refer to the [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/) article. 

Standard costs for read and write transactions, and for network egress still apply for object replication. These charges are consistent with existing OR pricing and should be considered when estimating the total cost of using priority replication. For an overview of Object Replication-specific pricing, see the pricing section within the [object replication overview](object-replication-overview.md#billing) article.

> [!IMPORTANT]
> Customers have the flexibility to disable priority replication at any time. However, it's important to note that billing for the feature will continue for 30 days after being disabled.

## Monitor SLA compliance for OR priority replication

To ensure transparency and empower customers to track the performance of OR priority replication, Azure provides a two monitoring tools integrated directly into Azure portal, PowerShell and Azure CLI. When OR priority replication is enabled, Replication Metrics for Object Replication is automatically enabled as well. These metrics empower users to troubleshoot replication delays and help users monitor their SLA compliance. Metrics now supported are: 

- **Operations pending for replication**: Total number of operations pending replication from source to destination storage account emitted per the time buckets
- **Bytes pending for replication**: Sum of bytes pending replication from source to destination storage accounts emitted per the time buckets

Each of the metrics previously mentioned can be viewed with the dimension of time buckets including 0-5 minutes, 10-15 minutes and > 24 hours. Users with OR priority replication that would like to ensure all their operations are replicating within 15 minutes; can monitor the larger time buckets (ex: 30 mins – 2 hours or 8-24 hours) and ensure they are at zero or near zero throughout the billing month. 

For more information about OR metrics, see [replication metrics](object-replication-overview.md#replication-metrics).

Users also have other options such as checking the replication status of their source blob. Users can check the replication status of a source blob to determine whether replication to the destination is complete. Once the replication status is marked as `Completed`, the user can guarantee the blob is available in the destination account. For more information view, [Check the replication status of a blob](object-replication-configure.md?tabs=portal#check-the-replication-status-of-a-blob).

## Enable and disable object replication priority replication

Users can enable OR priority replication on both new and existing OR policies using Azure portal, PowerShell, or the Azure CLI. It can be enabled for existing OR policies, or during the process of creating new a new OR policy.

### Enable priority replication during new policy creation

To enable OR Priority Replication when creating a new OR policy, complete the following steps:

# [Azure portal](#tab/portal)

[!INCLUDE [object-replication-alert](includes/object-replication-alert.md)]

1. Navigate to the Azure portal and create a new storage account.
1. Select the **Create replication rules** tab to open the **Create replication rules** pane as shown in the following screenshot.

    :::image type="content" source="media/object-replication-priority-replication/replication-new-accounts-sml.png" alt-text="Screenshot showing the location of the priority replication checkbox for a new storage account." lightbox="media/object-replication-priority-replication/replication-new-accounts-lrg.png":::

1. In the **Create replication rules** pane, select your chosen **Destination subscription** and **Destination storage account**. Select the **Enable priority replication** checkbox as shown.

    :::image type="content" source="media/object-replication-priority-replication/create-replication-rules-sml.png" alt-text="Screenshot showing the location of the Enable Priority Replication and Enable Replication Monitoring checkboxes in the replication rules pane." lightbox="media/object-replication-priority-replication/create-replication-rules-lrg.png":::

1. Create your container pair by selecting the **Source container** and **Destination container** values from the dropdown menus. Finally, select **Create** to add the new OR policy with priority replication enabled.

# [Azure PowerShell](#tab/powershell)

Before running the following commands, ensure you have the latest Azure PowerShell version installed. You can find installation instructions at [Azure PowerShell](/powershell/azure/install-azure-powershell).

You can use the `Set-AzStorageObjectReplicationPolicy` cmdlet together with the `New-AzStorageObjectReplicationPolicyRule` cmdlet to enable OR Priority Replication on a new policy. Use the example script below, or refer to the [Set-AzStorageObjectReplicationPolicy](/powershell/module/az.storage/set-azstorageobjectreplicationpolicy?view=azps-14.6.0&preserve-view=true) for more details.

```powershell

# Login to your Azure account
Connect-AzAccount

# Set variables
$rgname               = "<resource-group-name>"
$newAccountName       = "<new-account-name>"
$destAccountName      = "<destination-account-name>"
$srcAccountName       = "<source-account-name>"
$srcAccountResourceID = "<source-account-resourceID"
$srcContainer         = "<source-container-name>"
$destContainer        = "<destination-container-name>"

# Create a new destination policy with priority replication enabled
$rule1 = New-AzStorageObjectReplicationPolicyRule -SourceContainer $srcContainer `
    -DestinationContainer $destContainer 
$destPolicy = Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname `
    -StorageAccountName $destAccountName -PolicyId default `
    -SourceAccount $srcAccountResourceID -Rule $rule1 -EnableMetric $true `
    -Rule $rule1 -EnableMetric $true -EnablePriorityReplication $true
 
# Set OR policy on the source account
$srcPolicy = Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname -StorageAccountName $srcAccountName -InputObject $destPolicy
 
# Confirm OR priority replication is enabled
$srcPolicy.PriorityReplication.Enabled

```

# [Azure CLI](#tab/cli)

Before running the following commands, ensure you have the latest Azure CLI version installed. You can find installation instructions at [Azure CLI](/cli/azure/install-azure-cli).

You can use the `az storage account or-policy create` command to create a new Object Replication policy with priority replication enabled. Use the example script below, or refer to the [az storage account create](/cli/azure/storage/account?view=azure-cli-latest&preserve-view=true#az-storage-account-create) documentation for more details.

```azurecli-interactive

# Login to your Azure account
az login

# Set variables
$rgname          = "<resource-group-name>"
$newAccountName  = "<new-account-name>"
$destAccountName = "<destination-account-name>"
$srcAccountName  = "<source-account-name>"
$srcContainer    = "<source-container-name>"
$destContainer   = "<destination-container-name>"

# Set OR policy on destination account with priority replication enabled

az storage account or-policy create -n $destAccountName -s $srcAccountName /
    --dcont $dstContainer --scont $srcContainer -t "2020-02-19T16:05:00Z" /
    --enable-metrics True --priority-replication true

```

---

### Enable or disable priority replication for existing policies

To enable or disable Priority Replication for an existing OR policy, complete the following steps:

# [Azure portal](#tab/portal)

In the Azure portal, navigate to the storage account you want to modify. In the left navigation pane, expand the **Data Management** group and select **Object replication**. The **Your accounts** tab is selected by default, displaying all existing OR policies for the storage account.

#### Enable priority replication

1. Locate the OR policy to which you want to add priority replication. Select the **Enable** link in the **Priority replication** column as shown in the following screenshot.

    :::image type="content" source="media/object-replication-priority-replication/enable-existing-policy-sml.png" alt-text="Screenshot showing how to locate the Enable Priority Replication option for existing replication rules." lightbox="media/object-replication-priority-replication/enable-existing-policy-lrg.png":::

1. In the **Enable priority replication** dialog box, review the information about enabling priority replication. Select **Enable** to enable priority replication for the selected OR policy as shown in the following screenshot.

    :::image type="content" source="media/object-replication-priority-replication/confirm-enable-replication-sml.png" alt-text="Screenshot showing the Enable Priority Replication dialog box." lightbox="media/object-replication-priority-replication/confirm-enable-replication-lrg.png":::

#### Disable priority replication

1. Locate the OR policy from which you want to remove priority replication, and select the **More options** ellipsis. From the dropdown menu, select **Edit rules** to open the **Edit replication rules** pane as shown.

    :::image type="content" source="media/object-replication-priority-replication/edit-replication-rules-sml.png" alt-text="Screenshot showing how to locate the Edit Rules option for existing replication rules." lightbox="media/object-replication-priority-replication/edit-replication-rules-lrg.png":::

1. To disable priority replication, deselect the **Enable priority replication** checkbox. Select **Save** to save your changes as shown in the following screenshot.

    :::image type="content" source="media/object-replication-priority-replication/disable-existing-policy-sml.png" alt-text="Screenshot showing the location of the deselected Enable Priority Replication checkbox in the Edit Replication Rules pane." lightbox="media/object-replication-priority-replication/disable-existing-policy-lrg.png":::

# [Azure PowerShell](#tab/powershell)

Before running the following commands, ensure you have the latest Azure PowerShell version installed. You can find installation instructions at [Azure PowerShell](/powershell/azure/install-azure-powershell).

You can use the `Set-AzStorageObjectReplicationPolicy` cmdlet to enable or disable OR Priority Replication on an existing policy. Use the example script below, or refer to the [Set-AzStorageObjectReplicationPolicy](/powershell/module/az.storage/set-azstorageobjectreplicationpolicy?view=azps-14.6.0&preserve-view=true) for more details.

```powershell

# First, login to your Azure account
Connect-AzAccount

# Next, set your variables
$rgname               = "<resource-group-name>"
$newAccountName       = "<new-account-name>"
$destAccountName      = "<destination-account-name>"
$srcAccountName       = "<source-account-name>"
$srcAccountResourceID = "<source-account-resourceID"
$srcContainer         = "<source-container-name>"
$destContainer        = "<destination-container-name>"

```

#### Enable Priority Replication on an existing OR Policy

The following example PowerShell script demonstrates how to enable priority replication on an existing OR policy.

```powershell

$destPolicy = Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname -StorageAccountName $destAccountName `
    -PolicyId default -SourceAccount $srcAccountResourceID `
    -Rule $rule1 -EnableMetric $true -EnablePriorityReplication $true
 
$srcPolicy = Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname -StorageAccountName $srcAccountName -InputObject $destPolicy -Debug
 
#Confirm OR Priority Replication is enabled
$srcPolicy.PriorityReplication.Enabled

```
 
#### Disable Priority Replication

The following example PowerShell script demonstrates how to disable priority replication on an existing OR policy.

```powershell
 
$destPolicy = Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname -StorageAccountName $destAccountName `
    -PolicyId default -SourceAccount $srcAccountResourceID `
    -Rule $rule1 -EnableMetric $true -EnablePriorityReplication $false
 
$srcPolicy = Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname -StorageAccountName $srcAccountName -InputObject $destPolicy -Debug
 
#Confirm that OR Priority Replication is disabled
$srcPolicy.PriorityReplication.Enabled

```

# [Azure CLI](#tab/cli)

Before running the following commands, ensure you have the latest Azure CLI version installed. You can find installation instructions at [Azure CLI](/cli/azure/install-azure-cli).

You can use the `az storage account or-policy update` command to enable or disable an existing Object Replication policy. Use the example script below, or refer to the [az storage account update](/cli/azure/storage/account?view=azure-cli-latest&preserve-view=true#az-storage-account-update) documentation for more details.

```azurecli-interactive

# First, login to your Azure account
az login

# Next, set your variables
$rgname          = "<resource-group-name>"
$newAccountName  = "<new-account-name>"
$destAccountName = "<destination-account-name>"
$srcAccountName  = "<source-account-name>"
$srcContainer    = "<source-container-name>"
$destContainer   = "<destination-container-name>"

# Enable an existing OR policy on a destination account with priority replication enabled
az storage account or-policy update -n $destAccountName -s $srcAccountName /
    --dcont $dstContainer --scont $srcContainer -t "2020-02-19T16:05:00Z" /
    --enable-metrics True --priority-replication true

# Disable an existing OR policy on a destination account with priority replication enabled
az storage account or-policy update -n $destAccountName -s $srcAccountName /
    --dcont $dstContainer --scont $srcContainer -t "2020-02-19T16:05:00Z" /
    --enable-metrics True --priority-replication false

```

---
