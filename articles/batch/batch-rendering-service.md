---
title: Rendering overview
description: Introduction of using Azure for rendering and an overview of Azure Batch rendering capabilities
ms.date: 12/13/2021
ms.topic: how-to
---

# Rendering using Azure

Rendering is the process of taking 3D models and converting them into 2D images. 3D scene files are authored in applications such as Autodesk 3ds Max, Autodesk Maya, and Blender.  Rendering applications such as Autodesk Maya, Autodesk Arnold, Chaos Group V-Ray, and Blender Cycles produce 2D images.  Sometimes single images are created from the scene files. However, it's common to model and render multiple images, and then combine them in an animation.

The rendering workload is heavily used for special effects (VFX) in the Media and Entertainment industry. Rendering is also used in many other industries such as advertising, retail, oil and gas, and manufacturing.

The process of rendering is computationally intensive; there can be many frames/images to produce and each image can take many hours to render.  Rendering is therefore a perfect batch processing workload that can leverage Azure to run many renders in parallel and utilize a wide range of hardware, including GPUs.

## Why use Azure for rendering?

For many reasons, rendering is a workload perfectly suited for Azure:

* Rendering jobs can be split into many pieces that can be run in parallel using multiple VMs:
  * Animations consist of many frames and each frame can be rendered in parallel.  The more VMs available to process each frame, the faster all the frames and the animation can be produced.
  * Some rendering software allows single frames to be broken up into multiple pieces, such as tiles or slices.  Each piece can be rendered separately, then combined into the final image when all pieces have finished.  The more VMs that are available, the faster a frame can be rendered.
* Rendering projects can require huge scale:
  * Individual frames can be complex and require many hours to render, even on high-end hardware; animations can consist of hundreds of thousands of frames.  A huge amount of compute is required to render high-quality animations in a reasonable amount of time.  In some cases, over 100,000 cores have been used to render thousands of frames in parallel.
* Rendering projects are project-based and require varying amounts of compute:
  * Allocate compute and storage capacity when required, scale it up or down according to load during a project, and remove it when a project is finished.
  * Pay for capacity when allocated, but don’t pay for it when there is no load, such as between projects.
  * Cater for bursts due to unexpected changes; scale higher if there are unexpected changes late in a project and those changes need to be processed on a tight schedule.
* Choose from a wide selection of hardware according to application, workload, and timeframe:
  * There’s a wide selection of hardware available in Azure that can be allocated and managed with Batch.
  * Depending on the project, the requirement may be for the best price/performance or the best overall performance.  Different scenes and/or rendering applications will have different memory requirements.  Some rendering application can leverage GPUs for the best performance or certain features. 
* Low-priority or [Azure Spot VMs](https://azure.microsoft.com/pricing/spot/) reduce cost:
  * Low-priority and Spot VMs are available for a large discount compared to standard VMs and are suitable for some job types.
  
## Existing on-premises rendering environment

The most common case is for there to be an existing on-premises render farm being managed by a render management application such as PipelineFX Qube, Royal Render, Thinkbox Deadline, or a custom application.  The requirement is to extend the on-premises render farm capacity using Azure VMs.

Azure infrastructure and services are used to create a hybrid environment where Azure is used to supplement the on-premises capacity. For example:

* Use a [Virtual Network](../virtual-network/virtual-networks-overview.md) to place the Azure resources on the same network as the on-premises render farm.
* Use [Avere vFXT for Azure](../avere-vfxt/avere-vfxt-overview.md) or [Azure HPC Cache](../hpc-cache/hpc-cache-overview.md) to cache source files in Azure to reduce bandwidth use and latency, maximizing performance.
* Ensure the existing license server is on the virtual network and purchase the additional licenses required to cater for the extra Azure-based capacity.

## No existing render farm

Client workstations may be performing rendering, but the rendering load is increasing and it is taking too long to solely use workstation capacity.

There are two main options available:

* Deploy an on-premises render manager, such as Royal Render, and configure a hybrid environment to use Azure when further capacity or performance is required. A render manager is specifically tailored for rendering workloads and will include plug-ins for the popular client applications, enabling easy submission of rendering jobs.

* A custom solution using Azure Batch to allocate and manage the compute capacity as well as providing the job scheduling to run the render jobs.

## Next steps

 Learn how to [use Azure infrastructure and services to extend an existing on-premises render farm](https://azure.microsoft.com/solutions/high-performance-computing/rendering/).

Learn more about [Azure Batch rendering capabilities](batch-rendering-functionality.md).
