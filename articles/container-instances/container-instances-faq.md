---
title: Azure Container Instances - frequently asked questions
description: Answers for frequently asked questions related to the Azure Container Instances service 
services: container-instances
author: dkkapur
manager: jeconnoc

ms.service: container-instances
ms.topic: article
ms.date: 4/23/2019
ms.author: dekapur
---

# Frequently asked questions about Azure Container Instances

This article addresses frequently asked questions about Azure Container Instances.

## Deployment

### How large can my container image be?

The size of your container image impacts how long it takes to deploy, so generally you want to keep your container images as small as possible. You should pick only the layers that you need, and start with the leanest base OS image.

For example, if you're running Linux containers, consider using Alpine as your base image rather than a full Ubuntu Server. Similarly, for Windows containers, use a Nano Server base image if possible. 

The maximum size for a deployable container image on Azure Container Instances is 15 GB. You might be able to deploy larger images depending on the exact availability at the moment you deploy, but this is not guaranteed.

### How can I speed up the deployment of my container?

One of the main determinants of deployment times is the size of the image. Look for ways to reduce the size of your container image, by either removing layers you don't need or reducing the size of layers in the image (picking a lighter base OS image). You should also check the list of pre-cached images in Azure Container Images, available via the [List Caches Images](https://docs.microsoft.com/rest/api/container-instances/listcachedimages) API. You might be able to switch out an image layer for one of the pre-cached images. 

See more [detailed steps](container-instances-troubleshooting.md#container-takes-a-long-time-to-start)  on reducing image size.

### What Windows-base OS images are supported?

Currently, images based on Windows Server 2016 LTSC (Server Core) and Nano Server 1607 (related SAC release) are supported. We are adding support for Windows Server 2019 LTSC Server Core and Nano Server (1809) images in the near future. Please contact us if you need more information.

### What .NET or .NET Core image layer should I use in my container? 

Use the smallest image that satisfies your requirements. For Linux, you could use a *runtime-alpine* image, which has been supported since the release of .NET Core 2.1. For Windows, if you are using the full .NET Framework, then you'll need to use a Windows Server Core image (runtime only image, such as  *4.7.2-windowsservercore-ltsc2016*). 



## Availability and quotas

### How many cores and memory should I allocate for my containers or the container group?

This really depends on your workload. Start small and test performance to see how your containers do. [Monitor CPU and memory resource usage](container-instances-monitor.md), and then add cores or memory based on the kind of processes that you are deploying in the container. 

Make sure also to check the [resource availability](container-instances-region-availability.md#availability---general) for the region you are deploying in for the upper bounds on CPU cores and memory available per container group. 

### What underlying infrastructure does ACI run on?

ACI aims to be a serverless containers-on-demand service, so we want you to be focused on developing your containers, and not worry about the infrastructure! For those that are curious or wanting to do comparisons on performance, ACI runs on sets of Azure VMs of various SKUs, primarily from the F and the D series. We expect this to change in the future as we continue to develop and optimize the service. 

### I want to deploy thousand of cores on ACI - can I get my quota increased?
 
Yes (sometimes). Please contact us via an [Azure support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) (select "Quota" for **Issue type**). We plan to add significant capacity after June 2019.

### Can I deploy with more than 4 cores and 16 GB of RAM?

Not yet. We are working to increase the range of resource options for your deployments, but for now, these are the maximums for a container group. Please contact us with specific requirements or requests. 

### When will ACI be in a specific region?

You can see the latest region availability [here](https://docs.microsoft.com/azure/container-instances/container-instances-region-availability#availability---general). We're working on reaching a wide set of regions in the latter half of 2019. If you have a requirement for a specific region, contact Azure Support.

## Features and scenarios

### How do I scale a container group?
 
Currently, scaling is not available for containers or container groups. If you need to run more instances, use our API to automate and create more requests for container group creation to the service. 

### What features are available to instances running in a custom VNet?

You can deploy container groups in an Azure virtual network of your choice, and delegate private IPs to the container groups to route traffic within the VNet across your Azure resources. We're working to add various networking-related capabilities. See [Preview limitations]container-instances-vnet.md#preview-limitations) for updated information.

## Pricing

### When does the meter start running?

Container group duration is calculated from the time that we start to pull your first container's image (for a new deployment) or your container group is restarted (if already deployed), until the container group is stopped. See details at [Container Instances pricing](https://azure.microsoft.com/pricing/details/container-instances/).

### Do I stop being charged when my containers are stopped?

No. As long as your container group is running, we hold the resources in case you want to start the containers up again. Meters stop running once your entire container group is stopped. 

## Next steps

* [Learn more](container-instances-overview.md) about Azure Container Instances.
* [Troubleshoot common issues](container-instances-troubleshoot.md) in Azure Container Instances.