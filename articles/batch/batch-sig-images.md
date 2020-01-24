---
title: Use the Shared Image Gallery to create a custom pool - Azure Batch | Microsoft Docs
description: Create a Batch pool with the Shared Image Gallery to provision custom images to compute nodes that contain the software and data that you need for your application. Custom images are an efficient way to configure compute nodes to run your Batch workloads.
services: batch
author: ju-shim
manager: gwallace

ms.service: batch
ms.topic: article
ms.date: 08/28/2019
ms.author: jushiman
---

# Use the Shared Image Gallery to create a custom pool

When you create an Azure Batch pool using the Virtual Machine Configuration, you specify a VM image that provides the operating system for each compute node in the pool. You can create a pool of virtual machines either with a supported Azure Marketplace image or create a custom image with the [Shared Image Gallery](../virtual-machines/windows/shared-image-galleries.md).

## Benefits of the Shared Image Gallery

When you use the Shared Image Gallery for your custom image, you have control over the operating system type and configuration, as well as the type of data disks. Your Shared Image can include applications and reference data that become available on all the Batch pool nodes as soon as they are provisioned.

You can also have multiple versions of an image as needed for your environment. When you use an image version to create a VM, the image version is used to create new disks for the VM.

Using a Shared Image saves time in preparing your pool's compute nodes to run your Batch workload. It's possible to use an Azure Marketplace image and install software on each compute node after provisioning, but using a Shared Image is typically more efficient. Additionally, you can specify multiple replicas for the Shared Image so when you create pools with many VMs (more than 600 VMs), you'll save time on pool creation.

Using a Shared Image configured for your scenario can provide several advantages:

* **Use the same images across the regions.** You can create Shared Image replicas across different regions so all your pools utilize the same image.
* **Configure the operating system (OS).** You can customize the configuration of the image's operating system disk.
* **Pre-install applications.** Pre-installing applications on the OS disk is more efficient and less error-prone than installing applications after provisioning the compute nodes with a start task.
* **Copy large amounts of data once.** Make static data part of the managed Shared Image by copying it to a managed image's data disks. This only needs to be done once and makes data available to each node of the pool.
* **Grow pools to larger sizes.** With the Shared Image Gallery, you can create larger pools with your customized images along with more Shared Image replicas.
* **Better performance than custom image.** Using Shared Images, the time it takes for the pool to reach the steady state is up to 25% faster, and the VM idle latency is up to 30% shorter.
* **Image versioning and grouping for easier management.** The image grouping definition contains information about why the image was created, what OS it is for, and information about using the image. Grouping images allows for easier image management. For more information, see [Image definitions](../virtual-machines/windows/shared-image-galleries.md#image-definitions).

## Prerequisites

* **An Azure Batch account.** To create a Batch account, see the Batch quickstarts using the [Azure portal](quick-create-portal.md) or [Azure CLI](quick-create-cli.md).

* **A Shared Image Gallery image**. To create a Shared Image, you need to have or create a managed image resource. The image should be created from snapshots of the VM's OS disk and optionally its attached data disks. For more information, see [Prepare a managed image](#prepare-a-managed-image).

> [!NOTE]
> Your Shared Image must be in the same subscription as the Batch account. Your Shared Image can be in different regions as long as it has replicas in the same region as your Batch account.

## Prepare a managed image

In Azure, you can prepare a managed image from:

* Snapshots of an Azure VM's OS and data disks
* A generalized Azure VM with managed disks
* A generalized on-premises VHD uploaded to the cloud

To scale Batch pools reliably with a custom image, we recommend creating a managed image using *only* the first method: using snapshots of the VM's disks. See the following steps to prepare a VM, take a snapshot, and create an image from the snapshot.

### Prepare a VM

If you are creating a new VM for the image, use a first party Azure Marketplace image supported by Batch as the base image for your managed image. Only first party images can be used as a base image. To get a full list of Azure Marketplace image references supported by Azure Batch, see the [List node agent SKUs](/java/api/com.microsoft.azure.batch.protocol.accounts.listnodeagentskus) operation.

> [!NOTE]
> You can't use a third-party image that has additional license and purchase terms as your base image. For information about these Marketplace images, see the guidance for [Linux](../virtual-machines/linux/cli-ps-findimage.md#deploy-an-image-with-marketplace-terms
) or [Windows](../virtual-machines/windows/cli-ps-findimage.md#deploy-an-image-with-marketplace-terms
) VMs.

* Ensure the VM is created with a managed disk. This is the default storage setting when you create a VM.
* Do not install Azure extensions, such as the Custom Script extension, on the VM. If the image contains a pre-installed extension, Azure may encounter problems when deploying the Batch pool.
* When using attached data disks, you need to mount and format the disks from within a VM to use them.
* Ensure that the base OS image you provide uses the default temp drive. The Batch node agent currently expects the default temp drive.
* Once the VM is running, connect to it via RDP (for Windows) or SSH (for Linux). Install any necessary software or copy desired data.  

### Create a VM snapshot

A snapshot is a full, read-only copy of a VHD. To create a snapshot of a VM's OS or data disks, you can use the Azure portal or command-line tools. For steps and options to create a snapshot, see the guidance for [Linux](../virtual-machines/linux/snapshot-copy-managed-disk.md) or [Windows](../virtual-machines/windows/snapshot-copy-managed-disk.md) VMs.

### Create an image from one or more snapshots

To create a managed image from a snapshot, use Azure command-line tools such as the [az image create](/cli/azure/image) command. Create an image by specifying an OS disk snapshot and optionally one or more data disk snapshots.

### Create a Shared Image Gallery

Once you have successfully created your managed image, you need to create a Shared Image Gallery to make your custom image available. To learn how to create a Shared Image Gallery for your images, see [Create a Shared Image Gallery with Azure CLI](../virtual-machines/linux/shared-images.md) or [Create a Shared Image Gallery using the Azure portal](../virtual-machines/linux/shared-images-portal.md).

## Create a pool from a Shared Image using the Azure CLI

To create a pool from your Shared Image using the Azure CLI, use the `az batch pool create` command. Specify the Shared Image ID in the `--image` field. Make sure the OS type and SKU matches the versions specified by `--node-agent-sku-id`

```azurecli
az batch pool create \
    --id mypool --vm-size Standard_A1_v2 \
    --target-dedicated-nodes 2 \
    --image "/subscriptions/{sub id}/resourceGroups/{resource group name}/providers/Microsoft.Compute/galleries/{gallery name}/images/{image definition name}/versions/{version id}" \
    --node-agent-sku-id "batch.node.ubuntu 16.04"
```

## Create a pool from a Shared Image using C#

Alternatively, you can create a pool from a Shared Image using the C# SDK.

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
        virtualMachineImageId: "/subscriptions/{sub id}/resourceGroups/{resource group name}/providers/Microsoft.Compute/galleries/{gallery name}/images/{image definition name}/versions/{version id}");
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
    ...
}
```

## Create a pool from a Shared Image using the Azure portal

Use the following steps to create a pool from a Shared Image in the Azure portal.

1. Open the [Azure portal](https://portal.azure.com).
1. Go to **Batch accounts** and select your account.
1. Select **Pools** and then **Add** to create a new pool.
1. In the **Image Type** section, select **Shared Image Gallery**.
1. Complete the remaining sections with information about your managed image.
1. Select **OK**.

![Create a pool with from a Shared image with the portal.](media/batch-sig-images/create-custom-pool.png)

## Considerations for large pools

If you plan to create a pool with hundreds or thousands of VMs or more using a Shared Image, use the following guidance.

* **Shared Image Gallery replica numbers.**  For every pool with up to 600 instances, we recommend you keep at least one replica. For example, if you are creating a pool with 3000 VMs, you should keep at least 5 replicas of your image. We always suggest keeping more replicas than minimum requirements for better performance.

* **Resize timeout.** If your pool contains a fixed number of nodes (if it doesn't autoscale), increase the `resizeTimeout` property of the pool depending on the pool size. For every 1000 VMs, the recommended resize timeout is at least 15 minutes. For example, the recommended resize timeout for a pool with 2000 VMs is at least 30 minutes.

## Next steps

* For an in-depth overview of Batch, see [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).
