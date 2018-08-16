---
title: Windows HPC Pack cluster options in Azure | Microsoft Docs
description: Learn about options with Microsoft HPC Pack to create and manage a Windows high performance computing (HPC) cluster in the Azure cloud
services: virtual-machines-windows,cloud-services,batch
documentationcenter: ''
author: dlepow
manager: jeconnoc
editor: ''
tags: azure-resource-manager,azure-service-management,hpc-pack

ms.assetid: 02c5566d-2129-483c-9ecf-0d61030442d7
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: big-compute
ms.date: 05/14/2018
ms.author: danlep

---
# Options with HPC Pack to create and manage a cluster for Windows HPC workloads in Azure
[!INCLUDE [virtual-machines-common-hpcpack-cluster-options](../../../includes/virtual-machines-common-hpcpack-cluster-options.md)]

This article focuses on Azure options to create HPC Pack clusters to run Windows workloads. There are also options for creating HPC Pack clusters to run [Linux HPC workloads](../linux/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).


## HPC Pack cluster in Azure VMs and VM scale sets
### Azure Resource Manager templates
* (GitHub) [HPC Pack 2016 Update 1 cluster templates](https://github.com/MsHpcPack/HPCPack2016)
* (GitHub) [HPC Pack 2012 R2 cluster templates](https://github.com/MsHpcPack/HPCPack2012R2)
* (Quickstart) [Create an HPC Pack 2012 R2 cluster](https://github.com/Azure/azure-quickstart-templates/tree/master/create-hpc-cluster)
* (Quickstart) [Create an HPC Pack 2012 R2 cluster with custom compute node image](https://github.com/Azure/azure-quickstart-templates/tree/master/create-hpc-cluster-custom-image)

### Azure VM images
Browse [HPC Pack images in the Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?page=1&search=%22HPC%20%20Pack%22) if you want to build your own HPC Pack cluster in Azure.


### Tutorials
* [Tutorial: Deploy an HPC Pack 2016 cluster in Azure](hpcpack-2016-cluster.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* [Manage an HPC Pack 2016 cluster in Azure with Azure Active Directory](hpcpack-cluster-active-directory.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)


## HPC Pack 2012 R2 cluster deployment in the classic deployment model
* [Create an HPC cluster with the HPC Pack IaaS deployment script](classic/hpcpack-cluster-powershell-script.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
* [Tutorial: Get started with an HPC Pack cluster in Azure to run Excel and SOA workloads](excel-cluster-hpcpack.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* [Manage compute nodes in an HPC Pack cluster in Azure](classic/hpcpack-cluster-node-manage.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
* [Grow and shrink Azure compute resources in an HPC Pack cluster](classic/hpcpack-cluster-node-autogrowshrink.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
* [Set up a Windows RDMA cluster with HPC Pack to run MPI applications](classic/hpcpack-rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)


## Burst to Azure from HPC Pack 2012 R2
* [Burst to Azure Worker Instances with Microsoft HPC Pack](https://technet.microsoft.com/library/gg481749.aspx)
* [Burst to Azure Batch with HPC Pack](https://technet.microsoft.com/library/mt612877.aspx)
* [Tutorial: Set up a hybrid cluster with HPC Pack in Azure](../../cloud-services/cloud-services-setup-hybrid-hpcpack-cluster.md)

## Job submission

* [Submit jobs to an HPC Pack cluster in Azure](hpcpack-cluster-submit-jobs.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)






