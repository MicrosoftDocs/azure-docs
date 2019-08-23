---
title: Use the Shared Image Gallery to create a pool - Azure Batch | Microsoft Docs
description: Create a Batch pool with the Shared Image Gallery to provision custom images to compute nodes that contain the software and data that you need for your application. Custom images are an efficient way to configure compute nodes to run your Batch workloads.
services: batch
author: laurenhughes
manager: gwallace

ms.service: batch
ms.topic: article
ms.date: 08/14/2019
ms.author: lahugh
---

# Use the Shared Image Gallery to create a pool

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
* **Better Performance than custom image.** Using Shared Images, the time it takes for the pool to reach the steady state is up to 25% faster, and the VM idle latency is up to 30% shorter.
* **Image versioning and grouping for easier management.** The image grouping definition contains information about why the image was created, what OS it is for, and information about using the image. Grouping images allows for easier image management. For more information, see [Image definitions](../virtual-machines/windows/shared-image-galleries.md#image-definitions).

## Prerequisites

* **An Azure Batch account.** To create a Batch account, see the Batch quickstarts using the [Azure portal](quick-create-portal.md) or [Azure CLI](quick-create-cli.md).

* **A Shared Image Gallery image**. For more information and steps to prepare a Shared Image, see [Create a Shared Image Gallery with Azure CLI](../virtual-machines/linux/shared-images.md) or [Create a Shared Image Gallery using the Azure portal](../virtual-machines/linux/shared-images-portal.md).

> [!NOTE]
> Your Shared Image must be in the same subscription as the Batch account. Your Shared Image can be in different regions as long as it has replicas in the same region as your Batch account.

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

## Considerations for large pools

If you plan to create a pool with hundreds or thousands of VMs or more using a Shared Image, use the following guidance.

* **Shared Image Gallery replica numbers.**  For every pool with up to 600 instances, we recommend you keep at least one replica. For example, if you are creating a pool with 3000 VMs, you should keep at least 5 replicas of your image. We always suggest keeping more replicas than minimum requirements for better performance.

* **Resize timeout** If your pool contains a fixed number of nodes (if it doesn't autoscale), increase the `resizeTimeout` property of the pool depending on the pool size. For every 1000 VMs, the recommended resize timeout is at least 15 minutes. For example, the recommended resize timeout for a pool with 2000 VMs is at least 30 minutes.

## Next steps

* For an in-depth overview of Batch, see [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).
