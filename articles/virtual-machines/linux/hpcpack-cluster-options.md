---
title: Linux HPC Pack cluster options in Azure | Microsoft Docs
description: Learn about options with Microsoft HPC Pack to create and manage a Linux high performance computing (HPC) cluster in the Azure cloud
services: virtual-machines-linux,cloud-services
documentationcenter: ''
author: dlepow
manager: jeconnoc
editor: ''
tags: azure-resource-manager,azure-service-management,hpc-pack

ms.assetid: ac60624e-aefa-40c3-8bc1-ef6d5c0ef1a2
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: big-compute
ms.date: 05/14/2018
ms.author: danlep

---
# Options with HPC Pack to create and manage a cluster for Linux HPC workloads in Azure
[!INCLUDE [virtual-machines-common-hpcpack-cluster-options](../../../includes/virtual-machines-common-hpcpack-cluster-options.md)]

This article focuses on Azure options to use HPC Pack to run Linux workloads. There are also options for running [Windows HPC workloads with HPC Pack](../windows/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## HPC Pack cluster in Azure VMs and VM scale sets
### Azure Resource Manager templates
* (GitHub) [HPC Pack 2016 Update 1 cluster templates](https://github.com/MsHpcPack/HPCPack2016)
* (GitHub) [HPC Pack 2012 R2 cluster templates](https://github.com/MsHpcPack/HPCPack2012R2)
* (Quickstart) [Create an HPC Pack 2012 R2 cluster with Linux compute nodes](https://github.com/Azure/azure-quickstart-templates/tree/master/create-hpc-cluster-linux-cn)

### Azure VM images
Browse [HPC Pack images in the Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?page=1&search=%22HPC%20%20Pack%22) if you want to build your own HPC Pack cluster in Azure.

## HPC Pack 2012 R2 cluster in classic deployment model
* [Create a Linux HPC cluster with the HPC Pack IaaS deployment script](../windows/classic/hpcpack-cluster-powershell-script.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json)
* [Tutorial: Get started with Linux compute nodes in an HPC Pack cluster in Azure](classic/hpcpack-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json)
* [Tutorial: Run NAMD with Microsoft HPC Pack on Linux compute nodes in Azure](classic/hpcpack-cluster-namd.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json)
* [Tutorial: Run OpenFOAM with Microsoft HPC Pack on a Linux RDMA cluster in Azure](classic/hpcpack-cluster-openfoam.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json)
* [Tutorial: Run STAR-CCM+ with Microsoft HPC Pack on a Linux RDMA cluster in Azure](classic/hpcpack-cluster-starccm.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json)

## Job submisssion
* [Submit jobs to an HPC Pack cluster in Azure](../windows/hpcpack-cluster-submit-jobs.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)




