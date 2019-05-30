---
title: Rendering capabilities - Azure Batch
description: Specific rendering capabilities in Azure Batch
services: batch
ms.service: batch
author: mscurrell
ms.author: markscu
ms.date: 08/02/2018
ms.topic: conceptual
---

# Azure Batch rendering capabilities

Standard Azure Batch capabilities are used to run rendering workloads and applications. Batch also includes specific features to support rendering workloads.

For an overview of Batch concepts, including pools, jobs, and tasks, see [this article](https://docs.microsoft.com/azure/batch/batch-api-basics).

## Batch Pools

### Rendering application installation

An Azure Marketplace rendering VM image can be specified in the pool configuration if only the pre-installed applications need to be used.

There is a Windows 2016 image and a CentOS image.  In the [Azure Marketplace](https://azuremarketplace.microsoft.com), the VM images can be found by searching for 'batch rendering'.

For an example pool configuration, see the [Azure CLI rendering tutorial](https://docs.microsoft.com/azure/batch/tutorial-rendering-cli).  The Azure portal and Batch Explorer provide GUI tools to select a rendering VM image when you create a pool.  If using a Batch API, then specify the following property values for [ImageReference](https://docs.microsoft.com/rest/api/batchservice/pool/add#imagereference) when creating a pool:

| Publisher | Offer | Sku | Version |
|---------|---------|---------|--------|
| batch | rendering-centos73 | rendering | latest |
| batch | rendering-windows2016 | rendering | latest |

Other options are available if additional applications are required on the pool VMs:

* A custom image based on a standard Marketplace image:
  * Using this option, you can configure your VM with the exact applications and specific versions that you require. For more information, see [Use a custom image to create a pool of virtual machines](https://docs.microsoft.com/azure/batch/batch-custom-images). Autodesk and Chaos Group have modified Arnold and V-Ray, respectively, to validate against an Azure Batch licensing service. Make sure you have the versions of these applications with this support, otherwise the pay-per-use licensing won't work. Current versions of Maya or 3ds Max don't require a license server when running headless (in batch/command-line mode). Contact Azure support if you're not sure how to proceed with this option.
* [Application packages](https://docs.microsoft.com/azure/batch/batch-application-packages):
  * Package the application files using one or more ZIP files, upload via the Azure portal, and specify the package in pool configuration. When pool VMs are created, the ZIP files are downloaded and the files extracted.
* Resource files:
  * Application files are uploaded to Azure blob storage, and you specify file references in the [pool start task](https://docs.microsoft.com/rest/api/batchservice/pool/add#starttask). When pool VMs are created, the resource files are downloaded onto each VM.

### Pay-for-use licensing for pre-installed applications

The applications that will be used and have a licensing fee need to be specified in the pool configuration.

* Specify the `applicationLicenses` property when [creating a pool](https://docs.microsoft.com/rest/api/batchservice/pool/add#request-body).  The following values can be specified in the array of strings - "vray", "arnold", "3dsmax", "maya".
* When you specify one or more applications, then the cost of those applications is added to the cost of the VMs.  Application prices are listed on the [Azure Batch pricing page](https://azure.microsoft.com/pricing/details/batch/#graphic-rendering).

> [!NOTE]
> If instead you connect to a license server to use the rendering applications, do not specify the `applicationLicenses` property.

You can use the Azure portal or Batch Explorer to select applications and show the application prices.

If an attempt is made to use an application, but the application hasn’t been specified in the `applicationLicenses` property of the pool configuration or does not reach a license server, then the application execution fails with a licensing error and non-zero exit code.

### Environment variables for pre-installed applications

To be able to create the command line for rendering tasks, the installation location of the rendering application executables must be specified.  System environment variables have been created on the Azure Marketplace VM images, which can be used instead of having to specify actual paths.  These environment variables are in addition to the [standard Batch environment variables](https://docs.microsoft.com/azure/batch/batch-compute-node-environment-variables) created for each task.

|Application|Application Executable|Environment Variable|
|---------|---------|---------|
|Autodesk 3ds Max 2018|3dsmaxcmdio.exe|3DSMAX_2018_EXEC|
|Autodesk 3ds Max 2019|3dsmaxcmdio.exe|3DSMAX_2019_EXEC|
|Autodesk Maya 2017|render.exe|MAYA_2017_EXEC|
|Autodesk Maya 2018|render.exe|MAYA_2018_EXEC|
|Chaos Group V-Ray Standalone|vray.exe|VRAY_3.60.4_EXEC|
Arnold 2017 command line|kick.exe|ARNOLD_2017_EXEC|
|Arnold 2018 command line|kick.exe|ARNOLD_2018_EXEC|
|Blender|blender.exe|BLENDER_2018_EXEC|

### Azure VM families

As with other workloads, rendering application system requirements vary, and performance requirements vary for jobs and projects.  A large variety of VM families are available in Azure depending on your requirements – lowest cost, best price/performance, best performance, and so on.
Some rendering applications, such as Arnold, are CPU-based; others such as V-Ray and Blender Cycles can use CPUs and/or GPUs.
For a description of available VM families and VM sizes, [see VM types and sizes](https://docs.microsoft.com/azure/virtual-machines/windows/sizes).

### Low-priority VMs

As with other workloads, low-priority VMs can be utilized in Batch pools for rendering.  Low-priority VMs perform the same as regular dedicated VMs but utilize surplus Azure capacity and are available for a large discount.  The tradeoff for using low-priority VMs is that those VMs may not be available to be allocated or may be preempted at any time, depending on available capacity. For this reason, low-priority VMs aren't going to be suitable for all rendering jobs. For example, if images take many hours to render then it's likely that having the rendering of those images interrupted and restarted due to VMs being preempted wouldn't be acceptable.

For more information about the characteristics of low-priority VMs and the various ways to configure them using Batch, see [Use low-priority VMs with Batch](https://docs.microsoft.com/azure/batch/batch-low-pri-vms).

## Jobs and tasks

No rendering-specific support is required for jobs and tasks.  The main configuration item is the task command line, which needs to reference the required application.
When the Azure Marketplace VM images are used, then the best practice is to use the environment variables to specify the path and application executable.

## Next steps

For examples of Batch rendering try out the two tutorials:

* [Rendering using the Azure CLI](https://docs.microsoft.com/azure/batch/tutorial-rendering-cli)
* [Rendering using Batch Explorer](https://docs.microsoft.com/azure/batch/tutorial-rendering-batchexplorer-blender)
