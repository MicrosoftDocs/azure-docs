---
title: Supported resources for Azure Red Hat OpenShift | Microsoft Docs
description: Understand which Azure regions and virtual machine sizes are supported by Microsoft Azure Red Hat OpenShift.
services: container-service
author: jimzim
ms.author: jzim
manager: jeconnoc
ms.service: container-service
ms.topic: article
ms.date: 05/15/2019
---

# Azure Red Hat OpenShift resources

This topic lists the Azure regions and virtual machine sizes supported by the Microsoft Azure Red Hat OpenShift service.

## Azure regions

See [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=openshift&regions=all) for a current list of regions where you can deploy Azure Red Hat OpenShift clusters.

## Virtual machine sizes

Here are the supported virtual machine sizes you can specify for the compute nodes in your Azure Red Hat OpenShift cluster.

> [!Important]
> Each VM has a different number of drives that can be attached. This may not be as immediately clear as memory or CPU size.
> Not all VM sizes are available in all regions. Even if the API supports the size you specify, you might get an error if the size is not available in the region you specify.
> See [Current list of supported VM sizes per region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines) for more information.

## Compute node sizes

The following compute node sizes are supported by the Azure Red Hat OpenShift REST API:

|Size|vCPU|RAM|
|-|-|-|
|Standard D4s v3|4|16 GB|
|Standard D8s v3|8|32 GB|
|Standard D16s v3|16|64 GB|
|Standard D32s v3|32|128 GB|
|-|-|-|
|Standard E4s v3|4|32 GB|
|Standard E8s v3|8|64 GB|
|Standard E16s v3|16|128 GB|
|Standard E32s v3|32|256 GB|
|-|-|-|
|Standard F8s v2|8|16 GB|
|Standard F16s v2|16|32 GB|
|Standard F32s v2|32|64 GB|

## Master node sizes

The following master / infrastructure node sizes are supported by the Azure Red Hat OpenShift REST API:

|Size|vCPU|RAM|
|-|-|-|
|Standard D4s v3|4|16 GB|
|Standard D8s v3|8|32 GB|
|Standard D16s v3|16|64 GB|
|Standard D32s v3|32|128 GB|

## Next steps

Try the [Create a Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.