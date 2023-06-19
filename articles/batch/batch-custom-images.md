---
title: Use a managed image to create a custom image pool
description: Create a Batch custom image pool from a managed image to provision compute nodes with the software and data for your application.
ms.topic: conceptual
ms.date: 04/06/2023
ms.devlang: csharp
---

# Use a managed image to create a custom image pool

To create a custom image pool for your Batch pool's virtual machines (VMs), you can use a managed image to create an [Azure Compute Gallery image](batch-sig-images.md). Using just a managed image is also supported, but only for API versions up to and including 2019-08-01.

> [!WARNING]
> Support for creating a Batch pool using a managed image is being retired after **31 March 2026**. Please migrate to
> hosting custom images in Azure Compute Gallery to use for creating a [custom image pool in Batch](batch-sig-images.md).
> For more information, see the [migration guide](batch-custom-image-pools-to-azure-compute-gallery-migration-guide.md).

This topic explains how to create a custom image pool using only a managed image.

## Prerequisites

- **A managed image resource**. To create a pool of virtual machines using a custom image, you need to have or create a managed image resource in the same Azure subscription and region as the Batch account. The image should be created from snapshots of the VM's operating system's (OS) disk and optionally its attached data disks.
  - Use a unique custom image for each pool you create.
  - To create a pool with the image using the Batch APIs, specify the **resource ID** of the image, which is of the form `/subscriptions/xxxx-xxxxxx-xxxxx-xxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myImage`.
  - The managed image resource should exist for the lifetime of the pool to allow scale-up and can be removed after the pool is deleted.

- **Azure Active Directory (Azure AD) authentication**. The Batch client API must use Azure AD authentication. Azure Batch support for Azure AD is documented in [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).

## Prepare a managed image

In Azure, you can prepare a managed image from:

- Snapshots of an Azure VM's OS and data disks
- A generalized Azure VM with managed disks
- A generalized on-premises VHD uploaded to the cloud

To scale Batch pools reliably with a managed image, we recommend creating the managed image using *only* the first method: using snapshots of the VM's disks. The following steps show how to prepare a VM, take a snapshot, and create a managed image from the snapshot.

### Prepare a VM

If you're creating a new VM for the image, use a first party Azure Marketplace image supported by Batch as the base image for your managed image. Only first party images can be used as a base image. To get a full list of Azure Marketplace image references supported by Azure Batch, see the [List node agent SKUs](/java/api/com.microsoft.azure.batch.protocol.accounts.listnodeagentskus) operation.

> [!NOTE]
> You can't use a third-party image that has additional license and purchase terms as your base image. For information about these Marketplace images, see the guidance for [Linux](../virtual-machines/linux/cli-ps-findimage.md#check-the-purchase-plan-information) or [Windows](../virtual-machines/windows/cli-ps-findimage.md#view-purchase-plan-properties)VMs.

- Ensure the VM is created with a managed disk. This is the default storage setting when you create a VM.
- Don't install Azure extensions, such as the Custom Script extension, on the VM. If the image contains a preinstalled extension, Azure may encounter problems when deploying the Batch pool.
- When using attached data disks, you need to mount and format the disks from within a VM to use them.
- Ensure that the base OS image you provide uses the default temp drive. The Batch node agent currently expects the default temp drive.
- Ensure that the OS disk isn't encrypted.
- Once the VM is running, connect to it via RDP (for Windows) or SSH (for Linux). Install any necessary software or copy desired data.

### Create a VM snapshot

A snapshot is a full, read-only copy of a VHD. To create a snapshot of a VMs OS or data disks, you can use the Azure portal or command-line tools. For steps and options to create a snapshot, see the guidance for [VMs](../virtual-machines/snapshot-copy-managed-disk.md).

### Create an image from one or more snapshots

To create a managed image from a snapshot, use Azure command-line tools such as the [az image create](/cli/azure/image) command. You can create an image by specifying an OS disk snapshot and optionally one or more data disk snapshots.

## Create a pool from a managed image

Once you have found the resource ID of your managed image, create a custom image pool from that image. The following steps show you how to create a custom image pool using either Batch Service or Batch Management.

> [!NOTE]
> Make sure that the identity you use for Azure AD authentication has permissions to the image resource. See [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).
>
> The resource for the managed image must exist for the lifetime of the pool. If the underlying resource is deleted, the pool cannot be scaled.

### Batch Service .NET SDK

```csharp
private static VirtualMachineConfiguration CreateVirtualMachineConfiguration(ImageReference imageReference)
{
    return new VirtualMachineConfiguration(
        imageReference: imageReference,
        nodeAgentSkuId: "batch.node.windows amd64");
}

private static ImageReference CreateImageReference()
{
    return new ImageReference(
        virtualMachineImageId: "/subscriptions/{sub id}/resourceGroups/{resource group name}/providers/Microsoft.Compute/images/{image definition name}");
}

private static void CreateBatchPool(BatchClient batchClient, VirtualMachineConfiguration vmConfiguration)
{
    try
    {
        CloudPool pool = batchClient.PoolOperations.CreatePool(
            poolId: PoolId,
            targetDedicatedComputeNodes: PoolNodeCount,
            virtualMachineSize: PoolVMSize,
            virtualMachineConfiguration: vmConfiguration);

        pool.Commit();
    }
```

### Batch Management REST API

REST API URI

```http
 PUT https://management.azure.com/subscriptions/{sub id}/resourceGroups/{resource group name}/providers/Microsoft.Batch/batchAccounts/{account name}/pools/{pool name}?api-version=2020-03-01
```

Request Body

```json
 {
   "properties": {
     "vmSize": "{VM size}",
     "deploymentConfiguration": {
       "virtualMachineConfiguration": {
         "imageReference": {
           "id": "/subscriptions/{sub id}/resourceGroups/{resource group name}/providers/Microsoft.Compute/images/{image name}"
         },
         "nodeAgentSkuId": "{Node Agent SKU ID}"
       }
     }
   }
 }
```

## Considerations for large pools

If you plan to create a pool with hundreds of VMs or more using a custom image, it's important to follow the preceding guidance to use an image created from a VM snapshot.

Also note the following considerations:

- **Size limits** - Batch limits the pool size to 2500 dedicated compute nodes, or 1000 [Spot nodes](batch-spot-vms.md), when you use a custom image.

  If you use the same image (or multiple images based on the same underlying snapshot) to create multiple pools, the total compute nodes in the pools can't exceed the preceding limits. We don't recommend using an image or its underlying snapshot for more than a single pool.

  Limits may be reduced if you configure the pool with [inbound NAT pools](pool-endpoint-configuration.md).

- **Resize timeout** - If your pool contains a fixed number of nodes (doesn't autoscale), increase the resizeTimeout property of the pool to a value such as 20-30 minutes. If your pool doesn't reach its target size within the timeout period, perform another [resize operation](/rest/api/batchservice/pool/resize).

  If you plan a pool with more than 300 compute nodes, you might need to resize the pool multiple times to reach the target size.

By using the [Azure Compute Gallery](batch-sig-images.md), you can create larger pools with your customized images along
with more Shared Image replicas along with improved performance benefits such as decreased time for nodes to become ready.

## Considerations for using Packer

Creating a managed image resource directly with Packer can only be done with user subscription mode Batch accounts. For Batch service mode accounts, you need to create a VHD first, then import the VHD to a managed image resource. Depending on your pool allocation mode (user subscription, or Batch service), your steps to create a managed image resource varies.

Ensure that the resource used to create the managed image exists for the lifetimes of any pool referencing the custom image. Failure to do so can result in pool allocation failures and/or resize failures.

If the image or the underlying resource is removed, you may get an error similar to: `There was an error encountered while performing the last resize on the pool. Please try resizing the pool again. Code: AllocationFailed`. If you get this error, ensure that the underlying resource hasn't been removed.

For more information on using Packer to create a VM, see [Build a Linux image with Packer](../virtual-machines/linux/build-image-with-packer.md) or [Build a Windows image with Packer](../virtual-machines/windows/build-image-with-packer.md).

## Next steps

- Learn how to use the [Azure Compute Gallery](batch-sig-images.md) to create a custom pool.
- For an in-depth overview of Batch, see [Batch service workflow and resources](batch-service-workflow-features.md).
