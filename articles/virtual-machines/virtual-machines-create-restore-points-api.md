---
title: Using Virtual Machine Restore Points
description: Using Virtual Machine Restore Points
author: cynthn
ms.author: cynthn
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: how-to
ms.date: 7/24/2021
ms.custom: template-how-to
---

<!--
How-to article for for virtual machine restore point collection (API)
-->

<!-- 1. H1
Required. Start your H1 with a verb. Pick an H1 that clearly conveys the task the 
user will complete.
-->

# Create VM restore points using REST APIs (Preview)

<!--
    Differentiate the API method of backup
-->

Business continuity and disaster recovery (BCDR) solutions are primarily designed to address site-wide data loss. Solutions that operate at this scale will often manage and execute automated failovers and failbackups across multiple regions. Azure VM restore point APIs are a lightweight option you can use to implement granular backup and retention policies than BCDR solutions.

Azure compute backup and recovery APIs provide programmatic access to virtual machine (VM) backup and restore functions. Independent software vendors (ISVs) can use these APIs to develop BCDR solutions. The APIs are also useful for granular backup and restore operations, and for troubleshooting, debugging, and creating golden images of individual VMs.

## About VM restore points

<!--
    VM restore points in general, and the API method specifically
-->

You can protect your data and guard against extended downtime by creating virtual machine (VM) restore points at regular intervals. There are several backup options available for virtual machines (VMs), depending on your use-case. Individual VM restore point stores the VM configuration and a snapshot for any attached managed disks.

For more information on restore points, see [Backup and restore options for virtual machines in Azure](backup-recovery.md).

The backup and recovery APIs allow you to programmatically create collections of VM restore points. A restore point collection is an Azure Resource Management (ARM) resource that contains the restore points for a specific VM. A VM restore point can then be used to create VMs, and the disk restore point can be used to create individual disks.

:::image type="content" source="media/virtual-machines-create-restore-points-api/restore-point-hierarchy.png" alt-text="A diagram illustrating the relationship between the restore point collection parent and the restore point child objects":::

You can use the APIs to create restore points for your source VM in either the same region, or in other regions. You can also copy existing VM restore points between regions.

VM restore points are incremental. The first restore point stores a full copy of all disks attached to the VM. For each successive restore point for a VM, only the incremental changes to your disks are backed up. To reduce your costs, you can optionally exclude any disk when creating a restore point for your VM.

Keep the following restrictions in mind when you work with VM restore points:

- The restore points APIs work with managed disks only.
- Ultra disks, Ephemeral OS Disks, and Shared Disks aren't supported.
- The restore points APIs require API version 2021-0301 or better.

<!--

## About the preview

To use the restore points APIs, you must register the `RestorePointExcludeDisks` and `IncrementalRestorePoints` features with your subscription. Complete the following steps to register these features.

> [!IMPORTANT]
> The restore points APIs are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Step 1: Register features

To use the restore points APIs, you must register the `RestorePointExcludeDisks` and `IncrementalRestorePoints` features with your subscription.

#### [PowerShell](#tab/powershell)

1. Open a Windows PowerShell command window.

1. Sign in to your Azure subscription with the `Connect-AzAccount` cmdlet and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

1. If your identity is associated with more than one subscription, then set your active subscription.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

1. Register the `RestorePointExcludeDisks` and `IncrementalRestorePoints` features by using the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) cmdlet.

   ```powershell
   Register-AzProviderFeature -ProviderNamespace Microsoft.Compute -FeatureName RestorePointExcludeDisks
   Register-AzProviderFeature -ProviderNamespace Microsoft.Compute -FeatureName IncrementalRestorePoints
   ```

#### [Azure CLI](#tab/azure-cli)

1. Open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

1. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account.

   ```azurecli-interactive
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

1. Register the query acceleration feature by using the [az feature register](/cli/azure/feature#az_feature_register) command.

   ```azurecli
   az feature register --namespace Microsoft.Compute --name RestorePointExcludeDisks
   az feature register --namespace Microsoft.Compute --name IncrementalRestorePoints
   ```

---

### Step 2: Verify feature registration

#### [PowerShell](#tab/powershell)

To verify that the registration is complete, use the [Get-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature) command.

```powershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Compute -FeatureName RestorePointExcludeDisks
Get-AzProviderFeature -ProviderNamespace Microsoft.Compute -FeatureName IncrementalRestorePoints
```

#### [Azure CLI](#tab/azure-cli)

To verify that the registration is complete, use the [az feature](/cli/azure/feature#az_feature_show) command.

```azurecli
az feature show --namespace Microsoft.Compute --name RestorePointExcludeDisks
az feature show --namespace Microsoft.Compute --name IncrementalRestorePoints
```

---

### Step 3: Register the Azure Compute resource provider

After your registration is approved, you must re-register the Azure Storage resource provider.

#### [PowerShell](#tab/powershell)

To register the resource provider, use the [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) command.

```powershell
Register-AzResourceProvider -ProviderNamespace 'Microsoft.Compute'
```

#### [Azure CLI](#tab/azure-cli)

To register the resource provider, use the [az provider register](/cli/azure/provider#az_provider_register) command.

```azurecli
az provider register --namespace 'Microsoft.Compute'
```

---

-->

## Create VM restore points

To protect a VM from data loss, data corruption, or regional outages, you'll use the VM restore points API to create restore points for a specific VMs.

### Step 1: Create a VM restore point collection

Before you can begin creating VM restore points, you'll need to create a restore point collection. A restore point collection object will hold all restore points for a specific VM. Depending on your needs, you can create VM restore points for the source VM in the same Azure region, or in a different region.

To create a restore point collection, call the restore point collection's [Create or Update](/rest/api/compute/restore-point-collections/create-or-update) API. Specify the region of the source VM's region in the `location` property of the request body if you want to create restore points in the same region as your VM.

To create restore points in a different region, create a restore point collection in the target region, but reference your desired VM from the source region. Specify the target region in the `location` property of the request body, as well as the source VM in the request body.

Refer to the [Create or Update](/rest/api/compute/restore-point-collections/create-or-update) API documentation.

### Step 2: Create a VM restore point

After the restore point collection is created, create a VM restore point within the restore point collection. You can refer to the restore point [create](/rest/api/compute/restore-points/create) API documentation for additional guidance.

### Step 3: Track the status of the VM restore point creation

Creation of a cross-region VM restore point is a long running operation. A creation request operation will initially return an HTTP 201 response, and the status will need to be polled. Both the `Location` and `Azure-AsyncOperation` headers are provided for this purpose.

During restore point creation, the `ProvisioningState` will appear as `Creating` in the response. If creation fails, `ProvisioningState` will be set to `Failed`.

## Exclude disks from VM restore points

You can exclude any disk from either local region or cross-region restore points. The exclude a disk, add its identifier to the `excludeDisks` property in the request body.

## Copy a VM restore point between regions

### Step 1: Create a destination VM restore point collection

Before you can copy an existing VM restore point between regions, you'll need to ensure that an available restore point collection exists in the target region. 

If necessary, create a restore point collection in the target region. This is done by by referencing the Restore Point Collection from the source region. Call the restore point collection's [Create or Update](/rest/api/compute/restore-point-collections/create-or-update) API. Specify the target region in the `location` property of the request body, as well as the source VM in the request body.

Refer to the [Create or Update](/rest/api/compute/restore-point-collections/create-or-update) API documentation.

### Step 2: Create the destination VM restore point

After the restore point collection is created, trigger the creation of a restore point in the target restore point collection. Before you do so, ensure that you've referenced the restore point in the source region that you want to copy. Ensure also that you've specified the source restore point's identifier in the request body. The source VM's location will be inferred from the target restore point collection in which the restore point is being created.

Refer to the [API documentation](/rest/api/compute/restore-points/create) to create a `RestorePoint`.

### Step 3: Track copy status

The VM restore point can be used to restore a VM only after the copy operation has successfully been completed for all disk restore points. To track the status of the copy operation, follow the guidance within the [Get copy or replication status](#get-restore-point-copy-or-replication-status) section below. 

## Get restore point copy or replication status

After you initiate a create or copy operation on a VM restore point within a target region, you can track the data copy status. Call the restore point's [GET](/rest/api/compute/restore-points/get) API on the target VM restore point using the `instanceView` parameter. This will return the percentage of data that has been copied at the time of the request.

## Create a disk using disk restore points

### Step 1: Retrieve disk restore point identifiers

Call the [GET](/rest/api/compute/restore-point-collections/get) API on the restore point collection to get access to associated restore points and their IDs. Each VM restore point will in turn contain individual disk restore point identifiers.

### Step 2: Create a disk

After you have the list of disk restore point IDs, you can use the disk's [Create or Update](/rest/api/compute/restore-point-collections/create-or-update) API to create a disk from the disk restore points.

## Restore a VM with a restore point

To restore a full VM from a VM restore point, you'll need to restore individual disks from each of disk restore points as described in the ["Create a disk"](#create-a-disk-using-disk-restore-points) section. After all disks are restored, create a new VM and attach the restored disks to the new VM.

## Get a shared access signature for a disk

To create a shared access signature (SAS) for a disk within a VM restore point, pass the ID of the disk restore points via the `BeginGetAccess` API. If there is no active SAS on the snapshot of the restore point, a new SAS will be created. The new SAS URL will be returned in the response. If an active SAS already exists, the SAS duration will be extended and the pre-existing SAS URL will be returned in the response.

Refer to the [Snapshots - Grant Access](/rest/api/compute/snapshots/grant-access) API documentation for more information.

## Next steps

Do something awesome.