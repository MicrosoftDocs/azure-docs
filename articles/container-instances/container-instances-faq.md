---
title: Frequently asked questions
description: Answers for frequently asked questions related to the Azure Container Instances service 
author: dkkapur
ms.topic: article
ms.date: 06/02/2020
---

# Frequently asked questions about Azure Container Instances

This article addresses frequently asked questions about Azure Container Instances.

## Deployment

### How large can my container image be?

The maximum size for a deployable container image on Azure Container Instances is 15 GB. You might be able to deploy larger images depending on the exact availability at the moment you deploy, but this is not guaranteed.

The size of your container image impacts how long it takes to deploy, so generally you want to keep your container images as small as possible.

### How can I speed up the deployment of my container?

Because one of the main determinants of deployment times is the image size, look for ways to reduce the size. Remove layers you don't need, or reduce the size of layers in the image (by picking a lighter base OS image). For example, if you're running Linux containers, consider using Alpine as your base image rather than a full Ubuntu Server. Similarly, for Windows containers, use a Nano Server base image if possible. 

You should also check the list of pre-cached images in Azure Container Images, available via the [List Cached Images](/rest/api/container-instances/listcachedimages) API. You might be able to switch out an image layer for one of the pre-cached images. 

See more [detailed guidance](container-instances-troubleshooting.md#container-takes-a-long-time-to-start) on reducing container startup time.

### What Windows base OS images are supported?

> [!NOTE]
> Due to issues with backwards compatibility after the Windows updates in 2020, the following image versions include the minimum version number that we recommend you use in your base image. Current deployments using older image versions are not impacted, but new deployments should adhere to the following base images. 

#### Windows Server 2016 base images

* [Nano Server](https://hub.docker.com/_/microsoft-windows-nanoserver): `sac2016`, `10.0.14393.3506` or newer
* [Windows Server Core](https://hub.docker.com/_/microsoft-windows-servercore): `ltsc2016`,  `10.0.14393.3506` or newer

> [!NOTE]
> Windows images based on Semi-Annual Channel release 1709 or 1803 are not supported.

#### Windows Server 2019 and client base images (preview)

* [Nano Server](https://hub.docker.com/_/microsoft-windows-nanoserver): `1809`, `10.0.17763.1040` or newer
* [Windows Server Core](https://hub.docker.com/_/microsoft-windows-servercore): `ltsc2019`, `1809`, `10.0.17763.1040` or newer
* [Windows](https://hub.docker.com/_/microsoft-windows): `1809`, `10.0.17763.1040` or newer

### What .NET or .NET Core image layer should I use in my container? 

Use the smallest image that satisfies your requirements. For Linux, you could use a *runtime-alpine* .NET Core image, which has been supported since the release of .NET Core 2.1. For Windows, if you are using the full .NET Framework, then you need to use a Windows Server Core image (runtime-only image, such as  *4.7.2-windowsservercore-ltsc2016*). Runtime-only images are smaller but do not support workloads that require the .NET SDK.

## Availability and quotas

### How many cores and memory should I allocate for my containers or the container group?

This really depends on your workload. Start small and test performance to see how your containers do. [Monitor CPU and memory resource usage](container-instances-monitor.md), and then add cores or memory based on the kind of processes that you deploy in the container.

Make sure also to check the [resource availability](container-instances-region-availability.md#availability---general) for the region you are deploying in for the upper bounds on CPU cores and memory available per container group. 

> [!NOTE]
> A small amount of a container group's resources is used by the service's underlying infrastructure. Your containers will be able to access most but not all of the resources allocated to the group. For this reason, plan a small resource buffer when requesting resources for containers in the group.

### What underlying infrastructure does ACI run on?

Azure Container Instances aims to be a serverless containers-on-demand service, so we want you to be focused on developing your containers, and not worry about the infrastructure! For those that are curious or wanting to do comparisons on performance, ACI runs on sets of Azure VMs of various SKUs, primarily from the F and the D series. We expect this to change in the future as we continue to develop and optimize the service. 

### I want to deploy thousand of cores on ACI - can I get my quota increased?
 
Yes (sometimes). See the [quotas and limits](container-instances-quotas.md) article for current quotas and which limits can be increased by request.

### Can I deploy with more than 4 cores and 16 GB of RAM?

Not yet. Currently, these are the maximums for a container group. Contact Azure Support with specific requirements or requests. 

### When will ACI be in a specific region?

Current region availability is published [here](container-instances-region-availability.md#availability---general). If you have a requirement for a specific region, contact Azure Support.

## Features and scenarios

### How do I scale a container group?

Currently, scaling is not available for containers or container groups. If you need to run more instances, use our API to automate and create more requests for container group creation to the service. 

### What features are available to instances running in a custom VNet?

You can [deploy container groups in an Azure virtual network](container-instances-vnet.md) of your choice, and delegate private IPs to the container groups to route traffic within the VNet across your Azure resources. Deployment of a container group into a virtual network is currently available for production workloads in a subset of Azure regions.

## Pricing

### When does the meter start running?

Container group duration is calculated from the time that we start to pull your first container's image (for a new deployment) or your container group is restarted (if already deployed), until the container group is stopped. See details at [Container Instances pricing](https://azure.microsoft.com/pricing/details/container-instances/).

### Do I stop being charged when my containers are stopped?

Meters stop running once your entire container group is stopped. As long as a container in your container group is running, we hold the resources in case you want to start the containers up again. 

## Next steps

* [Learn more](container-instances-overview.md) about Azure Container Instances.
* [Troubleshoot common issues](container-instances-troubleshooting.md) in Azure Container Instances.
