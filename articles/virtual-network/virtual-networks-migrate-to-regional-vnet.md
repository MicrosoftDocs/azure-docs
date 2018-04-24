---
title: Migrate an Azure virtual network (classic) from an affinity group to a region | Microsoft Docs
description: Learn how to migrate a virtual network (classic) from an affinity group to a region.
services: virtual-network
documentationcenter: na
author: genlin
manager: cshepard
editor: ''
tags: azure-service-management

ms.assetid: 84febcb9-bb8b-4e79-ab91-865ad9de41cb
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/15/2016
ms.author: genli

---
# Migrate a virtual network (classic) from an affinity group to a region

> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Resource Manager and classic](../resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json). This article covers using the classic deployment model. Microsoft recommends that most new deployments use the Resource Manager deployment model.

Affinity groups ensure that resources created within the same affinity group are physically hosted by servers that are close together, enabling these resources to communicate quicker. In the past, affinity groups were a requirement for creating virtual networks (classic). At that time, the network manager service that managed virtual networks (classic) could only work within a set of physical servers or scale unit. Architectural improvements have increased the scope of network management to a region.

As a result of these architectural improvements, affinity groups are no longer recommended, or required for virtual networks (classic). The use of affinity groups for virtual networks (classic) is replaced by regions. Virtual networks (classic) that are associated with regions are called regional virtual networks.

We recommend that you don't use affinity groups in general. Aside from the virtual network requirement, affinity groups were also important to use to ensure resources, such as compute (classic) and storage (classic), were placed near each other. However, with the current Azure network architecture, these placement requirements are no longer necessary.

> [!IMPORTANT]
> Although it is still technically possible to create a virtual network that is associated with an affinity group, there is no compelling reason to do so. Many virtual network features, such as network security groups, are only available when using a regional virtual network, and are not available for virtual networks that are associated with affinity groups.
> 
> 

## Edit the network configuration file

1. Export the network configuration file. To learn how to export a network configuration file using PowerShell or the Azure command-line interface (CLI) 1.0, see [Configure a virtual network using a network configuration file](virtual-networks-using-network-configuration-file.md#export).
2. Edit the network configuration file, replacing **AffinityGroup** with **Location**. You specify an Azure [region](https://azure.microsoft.com/regions) for **Location**.
   
   > [!NOTE]
   > The **Location** is the region that you specified for the affinity group that is associated with your virtual network (classic). For example, if your virtual network (classic) is associated with an affinity group that is located in West US, when you migrate, your **Location** must point to West US. 
   > 
   > 
   
    Edit the following lines in your network configuration file, replacing the values with your own: 
   
    **Old value:** \<VirtualNetworkSitename="VNetUSWest" AffinityGroup="VNetDemoAG"\> 
   
    **New value:** \<VirtualNetworkSitename="VNetUSWest" Location="West US"\>
3. Save your changes and [import](virtual-networks-using-network-configuration-file.md#import) the network configuration to Azure.

> [!NOTE]
> This migration does NOT cause any downtime to your services.
> 
> 

## What to do if you have a VM (classic) in an affinity group
VMs (classic) that are currently in an affinity group do not need to be removed from the affinity group. Once a VM is deployed, it is deployed to a single scale unit. Affinity groups can restrict the set of available VM sizes for a new VM deployment, but any existing VM that is deployed is already restricted to the set of VM sizes available in the scale unit in which the VM is deployed. Because the VM is already deployed to a scale unit, removing a VM from an affinity group has no effect on the VM.
