---
title: Rendering capabilities
description: Standard Azure Batch capabilities are used to run rendering workloads and apps. Batch includes specific features to support rendering workloads.
ms.date: 02/28/2024
ms.topic: how-to
---

# Azure Batch rendering capabilities

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

Standard Azure Batch capabilities are used to run rendering workloads and applications. Batch also includes specific features to support rendering workloads.

For an overview of Batch concepts, including pools, jobs, and tasks, see [this article](./batch-service-workflow-features.md).

## Batch pools using custom VM images and standard application licensing

As with other workloads and types of application, a custom VM image can be created with the required rendering applications and plug-ins. The custom VM image is placed in the [Azure Compute Gallery](../virtual-machines/shared-image-galleries.md) and [can be used to create Batch Pools](batch-sig-images.md).

The task command line strings will need to reference the applications and paths used when creating the custom VM image.

Most rendering applications will require licenses obtained from a license server. If there's an existing on-premises license server, then both the pool and license server need to be on the same [virtual network](../virtual-network/virtual-networks-overview.md). It is also possible to run a license server on an Azure VM, with the Batch pool and license server VM being on the same virtual network.

## Batch pools using custom VM images

* A custom image from the Azure Compute Gallery:
  * Using this option, you can configure your VM with the exact applications and specific versions that you require. For more information, see [Create a pool with the Azure Compute Gallery](batch-sig-images.md). Autodesk and Chaos Group have modified Arnold and V-Ray, respectively, to validate against an Azure Batch licensing service. Make sure you have the versions of these applications with this support, otherwise the pay-per-use licensing won't work. Current versions of Maya or 3ds Max don't require a license server when running headless (in batch/command-line mode). Contact Azure support if you're not sure how to proceed with this option.
* [Application packages](./batch-application-packages.md):
  * Package the application files using one or more ZIP files, upload via the Azure portal, and specify the package in pool configuration. When pool VMs are created, the ZIP files are downloaded and the files extracted.
* Resource files:
  * Application files are uploaded to Azure blob storage, and you specify file references in the [pool start task](/rest/api/batchservice/pool/add#starttask). When pool VMs are created, the resource files are downloaded onto each VM.

## Azure VM families

As with other workloads, rendering application system requirements vary, and performance requirements vary for jobs and projects.  A large variety of VM families are available in Azure depending on your requirements – lowest cost, best price/performance, best performance, and so on.
Some rendering applications, such as Arnold, are CPU-based; others such as V-Ray and Blender Cycles can use CPUs and/or GPUs.
For a description of available VM families and VM sizes, [see VM types and sizes](../virtual-machines/sizes.md).

## Spot VMs

As with other workloads, Azure Spot VMs can be utilized in Batch pools for rendering. Spot VMs perform the same as regular dedicated VMs but utilize surplus Azure capacity and are available for a large discount.  The tradeoff for using Spot VMs is that those VMs may not be available to be allocated or may be preempted at any time, depending on available capacity. For this reason, Spot VMs aren't going to be suitable for all rendering jobs. For example, if images take many hours to render then it's likely that having the rendering of those images interrupted and restarted due to VMs being preempted wouldn't be acceptable.

For more information about the characteristics of Spot VMs and the various ways to configure them using Batch, see [Use Spot VMs with Batch](./batch-spot-vms.md).

## Jobs and tasks

No rendering-specific support is required for jobs and tasks.  The main configuration item is the task command line, which needs to reference the required application.
When the Azure Marketplace VM images are used, then the best practice is to use the environment variables to specify the path and application executable.

## Next steps

* Learn about [Batch rendering services](batch-rendering-service.md).
* Learn about [Storage and data movement options for rendering asset and output files](batch-rendering-storage-data-movement.md).
