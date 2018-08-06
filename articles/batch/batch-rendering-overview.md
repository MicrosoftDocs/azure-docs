---
title: Batch rendering overview
description: Introduction and overview of Azure Batch rendering capabilities
services: batch
author: mscurrell
ms.author: markscu
ms.date: 08/02/2018
ms.topic: conceptual
---

# Rendering using Azure

Rendering is the process of taking 3D models and converting them into 2D images. 3D scene files are authored in applications such as Autodesk 3ds Max, Autodesk Maya, and Blender.  Rendering applications such as Autodesk Maya, Autodesk Arnold, Chaos Group V-Ray, and Blender Cycles produce 2D images.  Sometimes single images are created from the scene files, but it is common for multiple images to be modeled and rendered, so they can be combined in an animation.

The rendering workload is heavily used for special effects (VFX) in the Media and Entertainment industry but is also used in many other areas such as advertising, retail, oil and gas, and manufacturing.

The process of rendering is computationally intensive; there can be many frames/images to produce and each image can take many hours to render.  Rendering is therefore a perfect batch processing workload that can leverage Azure and Azure Batch to run many renders in parallel.

## Why use Azure for rendering?

For many reasons, rendering is a workload perfectly suited for Azure and Azure Batch:

* Rendering jobs can be split into many pieces that can be run in parallel using multiple VMs:
  * Animations consist of many frames and each frame can be rendered in parallel.  The more VMs available to process each frame, the faster all the frames and the animation can be produced.
  * Some rendering software allows single frames to be broken up into multiple pieces, such as tiles or slices.  Each piece can be rendered separately, then combined into the final image when all pieces have finished.  The more VMs that are available, the faster a frame can be rendered.
* Rendering projects can leverage huge scale:
  * Individual frames can be complex and require many hours to render, even on high-end hardware; animations can consist of hundreds of thousands of frames.  A huge amount of compute is required to render high-quality animations in a reasonable amount of time.  In some cases, over 100,000 cores have been leveraged to render thousands of frames in parallel.
* Rendering projects are project-based and require varying amounts of compute:
  * Being able to allocate compute and storage capacity when required, scale it up or down according to load during a project, and remove it when a project is finished is a huge benefit for rendering workloads.
  * Pay for capacity when allocated, but don’t pay for it when there is no load, such as between projects or when there is low volume.
  * Cater for bursts due to unexpected changes; scale higher if there are unexpected changes late in a project and those changes need to be processed on a tight schedule.
* Leverage a wide selection of hardware according to application, workload, and timeframe:
  * There’s a wide selection of hardware available in Azure that can be allocated and managed with Batch.
  * Depending on the project, the requirement may be for the best price/performance or the best overall performance.  Different scenes and/or rendering applications will have different memory requirements.  Some rendering application can leverage GPUs for the best performance or to use certain features. 
* Low-priority VMs reduce costs:
  * Low-priority VMs are available for a large discount compared to regular on-demand VMs and are suitable for some job types.
  * Low-priority VMs can be allocated by Azure Batch, with Batch providing flexibility on how they are used to cater for a broad set of requirements.  Batch pools can consist of both dedicated and low-priority VMs, with it being possible to change the mix of VM types at any time.
* If only VMs are required, then virtual machine scale set allows low-priority VMs to be configured.

## Options for rendering on Azure

There are a range of Azure capabilities that can be used for rendering workloads.  Which capabilities to use depends on any existing environment and requirements.

### Existing on-premises rendering environment using a render management application

The most common case is for there to be an existing on-premises render farm being managed by a render management application such as PipelineFX Qube, Royal Render, or Thinkbox Deadline.  The requirement is to extend the on-premises render farm capacity using Azure VMs.

The render management software either has Azure support built-in or we make available plug-ins that add Azure support.  See the article on <Azure render manager integration> for more information on the supported render managers and functionality enabled.

### Custom rendering workflow
The requirement may be for VMs to extend an existing render farm with a job scheduling capability.

* Virtual Machine Scale Sets can be used to allocate multiple VMs and optionally leverage low-priority VMs.
* Azure Batch pools can allocate larger numbers of VMs, allow low-priority VMs to be used and dynamically auto-scaled with full-priced on-demand VM, and provides pay-for-use licensing for popular rendering applications.

### No existing render farm

Client workstations may be performing rendering, but the rendering workload is increasing, and it is taking too long to solely use workstation capacity.  Azure Batch can be used to both allocate render farm compute on-demand as well as schedule the render jobs to the Azure render farm.

## Azure Batch rendering capabilities

Azure Batch allows parallel workloads to be run in Azure.  It enables the creation and management of large numbers of VMs on which applications are installed and run.  It also provides comprehensive job scheduling capabilities to run instances of those applications, providing the assignment of tasks to VMs, queuing, application monitoring, and so on.

Azure Batch is used for many workloads, but the following capabilities are available to specifically make it easier and quicker to run rendering workloads.

* VM images with pre-installed graphics and rendering applications:
  * Azure Marketplace VM images are available that contain popular graphics and rendering applications, avoiding the need to install the applications yourself or create your own custom images with the applications installed. 
* Pay-per-use licensing for rendering applications:
  * You can choose to pay for the applications by the minute, in addition to paying for the compute VMs.  This avoids having to buy licenses and potentially configure a license server for the applications.  Paying for use also means that it is possible to cater for varying and unexpected load as there is not a fixed number of licenses.
  * It is also possible to use the pre-installed applications with your own licenses and not use the pay-per-use licensing.
* Plug-in’s for client design and modeling applications:
  * Plug-in’s allow end-users to utilize Azure Batch directly from client application, such as Autodesk Maya, enabling them to create pools, submit jobs and leverage more compute capacity to perform faster renders.
* Render manager integration:
  * Azure Batch is integrated into render management applications or plug-ins are available to provide the Azure Batch integration.

There are several ways to use Azure Batch, all of which also apply to Azure Batch rendering.

* APIs:
  * Write code using the REST, C#, Python, Java, or other supported APIs.  Developers can integrate Azure Batch capabilities into their existing applications or workflow, whether cloud or based on-premises.  For example, the Autodesk Maya plug-in utilizes the Batch Python API to invoke Batch, creating and managing pools, submitting jobs and tasks, and monitoring status.
* Command line tools:
  * The Azure command line or PowerShell can be used to script Batch use.
  * In particular, the Batch CLI template support makes it much easier to create pools and submit jobs.
* UIs:
  * Batch Explorer is a cross-platform client tool that also allows Batch accounts to be managed and monitored, but provides some richer capabilities compared to the Azure portal UI.  A set of pool and job templates are provided that are tailored for each supported application and can be used to easily create pools and to submit jobs.
  * The Azure portal can be used to manage and monitor Azure Batch.
* Client application plug-in’s:
  * Plug-ins are available that allow Batch rendering to be used from directly within the client design and modeling applications.  The plug-ins mainly invoke the Batch Labs application with contextual information about the current 3D model.
  * The following plug-ins are available:
    * [Azure Batch for Maya](https://github.com/Azure/azure-batch-maya)
    * [3ds Max](https://github.com/Azure/azure-batch-rendering/tree/master/plugins/3ds-max)
    * [Blender](https://github.com/Azure/azure-batch-rendering/tree/master/plugins/blender)

## Getting started with Azure Batch rendering

See the following introductory tutorials to try Azure Batch rendering:

* [Use Batch Explorer to render a Blender scene](tutorial-rendering-batchexplorer-blender)
* Use the Batch CLI to render an Autodesk 3ds Max scene
