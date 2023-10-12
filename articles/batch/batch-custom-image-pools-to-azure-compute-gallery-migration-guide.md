---
title: Migrate Azure Batch custom image pools to Azure Compute Gallery
description: Learn how to migrate Azure Batch custom image pools to Azure compute gallery and plan for feature end of support.
ms.service: batch
ms.topic: how-to
ms.date: 03/07/2023
---

# Migrate Azure Batch custom image pools to Azure Compute Gallery

To improve reliability, scale, and align with modern Azure offerings, Azure Batch will retire custom image Batch pools specified
from virtual hard disk (VHD) blobs in Azure Storage and Azure Managed Images on *March 31, 2026*. Learn how to migrate your Azure
Batch custom image pools using Azure Compute Gallery.

## Feature end of support

When you create an Azure Batch pool using the Virtual Machine Configuration, you specify an image reference that provides the
operating system for each compute node in the pool. You can create a pool of virtual machines either with a supported Azure
Marketplace image or with a custom image. Custom images from VHD blobs and managed Images are either legacy offerings or
non-scalable solutions for Azure Batch. To ensure reliable infrastructure provisioning at scale, all custom image sources other
than Azure Compute Gallery will be retired on *March 31, 2026*.

## Alternative: Use Azure Compute Gallery references for Batch custom image pools

When you use the Azure Compute Gallery (formerly known as Shared Image Gallery) for your custom image, you have control over
the operating system type and configuration, and the type of data disks. Your shared image can include applications and reference
data that become available on all the Batch pool nodes as soon as they're provisioned. You can also have multiple versions of an
image as needed for your environment. When you use an image version to create a VM, the image version is used to create new
disks for the VM.

Using a shared image saves time in preparing your pool's compute nodes to run your Batch workload. It's possible to use an
Azure Marketplace image and install software on each compute node after allocation. However, using a shared image can lead
to more efficiencies in faster compute node to ready state and reproducible workloads. Additionally, you can specify multiple
replicas for the shared image so when you create pools with many compute nodes, provisioning latencies can be lower.

## Migrate your eligible pools

To migrate your Batch custom image pools from managed image to shared image, review the Azure Batch guide on using
[Azure Compute Gallery to create a custom image pool](batch-sig-images.md).

If you have either a VHD blob or a managed image, you can convert them directly to a Compute Gallery image that can be used
with Azure Batch custom image pools. When you're creating a VM image definition for a Compute Gallery, on the Version tab,
you can select a source option to migrate from, including types being retired for Batch custom image pools:

| Source | Other fields |
|---|---|
| Managed image | Select the **Source image** from the drop-down. The managed image must be in the same region that you chose in **Instance details.** |
| VHD in a storage account | Select **Browse** to choose the storage account for the VHD. |

For more information about this process, see
[creating an image definition and version for Compute Gallery](../virtual-machines/image-version.md#create-an-image).

## FAQs

- How can I create an Azure Compute Gallery?

  See the [guide](../virtual-machines/create-gallery.md#create-a-private-gallery) for Compute Gallery creation.

- How do I create a Pool with a Compute Gallery image?

  See the [guide](batch-sig-images.md) for creating a Pool with a Compute Gallery image.

- What considerations are there for Compute Gallery image based Pools?

  See the [considerations for large pools](batch-sig-images.md#considerations-for-large-pools).

- Can I use Azure Compute Gallery images in different subscriptions or in different Microsoft Entra tenants?

  If the Shared Image isn't in the same subscription as the Batch account, you must register the `Microsoft.Batch` resource provider for that subscription. The two subscriptions must be in the same Microsoft Entra tenant. The image can be in a different region as long as it has replicas in the same region as your Batch account.

## Next steps

For more information, see [Azure Compute Gallery](../virtual-machines/azure-compute-gallery.md).
