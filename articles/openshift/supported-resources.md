---
title: Supported resources for Microsoft Azure Red Hat OpenShift (ARO)
description: Provides answers about which regions and virtual machine sizes are supported by Microsoft Azure Red Hat OpenShift (ARO).
services: container-service
author: tylermsft
ms.author: twhitney
manager: jeconnoc
ms.service: container-service
ms.topic: article
ms.date: 05/06/2019
---

# Microsoft Red Hat OpenShift on Azure resources

This topic lists the Azure regions and virtual machine sizes supported by Microsoft Red Hat OpenShift on Azure (ARO).

## Azure regions

You can deploy ARO clusters to the following Azure regions around the globe:

|Region|CLI code|
|-|-|
|🇦🇺 Australia East|`australiaeast`|
|🇨🇦 Canada Central|`canadacentral`|
|🇨🇦 Canada East|`canadaeast`|
|🇺🇸 East US|`eastus`|
|🇺🇸 West US|`westus`|
|🇪🇺 West Europe|`westeurope`|
|🇪🇺 North Europe|`northeurope`|

## ARO virtual machine sizes

The following is a list of supported virtual machine sizes you can specify for the compute nodes in your ARO cluster.

> [!Important]
> Each VM has a different number of drives that can be attached. This may not be as immediately clear as memory or CPU size.
> Not all VM sizes are available in all regions. If the API support the size you specify, you will get an error if the size is not available in the region you specify.
> See [Current list of supported VM sizes per region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines) for more information.

## Compute node sizes supported by the ARO REST API

|Size|vCPU|RAM|
|-|-|-|
|Standard D4s v3|4|16G|
|Standard D8s v3|8|32G|
|Standard D16s v3|16|64G|
|Standard D32s v3|32|128G|
|-|-|-|
|Standard E4s v3|4|32G|
|Standard E8s v3|8|64G|
|Standard E16s v3|16|128G|
|Standard E32s v3|32|256G|
|-|-|-|
|Standard F8s v2|8|16G|
|Standard F16s v2|16|32G|
|Standard F32s v2|32|64G|

## Valid infra/master nodes supported by the ARO REST API

|Size|vCPU|RAM|
|-|-|-|
|Standard D4s v3|4|16G|
|Standard D8s v3|8|32G|
|Standard D16s v3|16|64G|
|Standard D32s v3|32|128G|

## Next steps

Try the [Create an Azure Red Hat Openshift cluster](tutorial-create-cluster.md) tutorial.