<properties
 pageTitle="Windows HPC Pack cluster options in the cloud | Microsoft Azure"
 description="Learn about options with Microsoft HPC Pack to create and manage a Windows high performance computing (HPC) cluster in the Azure cloud"
 services="virtual-machines-windows,cloud-services,batch"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""
 tags="azure-resource-manager,azure-service-management,hpc-pack"/>
<tags
ms.service="virtual-machines-windows"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-windows"
 ms.workload="big-compute"
 ms.date="06/17/2016"
 ms.author="danlep"/>

# Options to create and manage a Windows high performance computing (HPC) cluster in Azure with Microsoft HPC Pack

[AZURE.INCLUDE [virtual-machines-common-hpcpack-cluster-options](../../includes/virtual-machines-common-hpcpack-cluster-options.md)]

This article focuses on options to use HPC Pack to run Windows workloads. There are also options for running [Linux HPC workloads with HPC Pack](virtual-machines-linux-hpcpack-cluster-options.md).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

## Run an HPC Pack cluster in Azure VMs

### Azure templates

* (Marketplace) [HPC Pack cluster for Windows workloads](https://azure.microsoft.com/marketplace/partners/microsofthpc/newclusterwindowscn/)

* (Marketplace) [HPC Pack cluster for Excel workloads](https://azure.microsoft.com/marketplace/partners/microsofthpc/newclusterexcelcn/)

* (Quickstart) [Create an HPC cluster](https://github.com/Azure/azure-quickstart-templates/tree/master/create-hpc-cluster)

* (Quickstart) [Create an HPC cluster with custom compute node image](https://github.com/Azure/azure-quickstart-templates/tree/master/create-hpc-cluster-custom-image)

### Azure VM images

* [HPC Pack on Windows Server 2012 R2](https://azure.microsoft.com/marketplace/partners/microsoft/hpcpack2012r2onwindowsserver2012r2/)

* [HPC Pack compute node on Windows Server 2012 R2](https://azure.microsoft.com/marketplace/partners/microsoft/hpcpack2012r2computenodeonwindowsserver2012r2/)

* [HPC Pack compute node with Excel on Windows Server 2012 R2](https://azure.microsoft.com/marketplace/partners/microsoft/hpcpack2012r2computenodewithexcelonwindowsserver2012r2/)



### PowerShell deployment script

* [Create an HPC cluster with the HPC Pack IaaS deployment script](virtual-machines-windows-classic-hpcpack-cluster-powershell-script.md)

### Tutorials

* [Tutorial: Get started with an HPC Pack cluster in Azure to run Excel and SOA workloads](virtual-machines-windows-excel-cluster-hpcpack.md)



### Manual deployment with the Azure portal

* [Set up the head node of an HPC Pack cluster in an Azure VM](virtual-machines-windows-hpcpack-cluster-headnode.md)

### Cluster management

* [Manage compute nodes in an HPC Pack cluster in Azure](virtual-machines-windows-classic-hpcpack-cluster-node-manage.md)


* [Grow and shrink Azure compute resources in an HPC Pack cluster](virtual-machines-windows-classic-hpcpack-cluster-node-autogrowshrink.md)

* [Submit jobs to an HPC Pack cluster in Azure](virtual-machines-windows-hpcpack-cluster-submit-jobs.md)


## Add worker role nodes to an HPC Pack cluster


* [Burst to Azure worker instances with HPC Pack](https://technet.microsoft.com/library/gg481749.aspx)

* [Tutorial: Set up a hybrid cluster with HPC Pack in Azure](../cloud-services/cloud-services-setup-hybrid-hpcpack-cluster.md)

* [Add Azure "burst" nodes to an HPC Pack head node in Azure](virtual-machines-windows-classic-hpcpack-cluster-node-burst.md)

* [Grow and shrink Azure compute resources in an HPC Pack cluster](virtual-machines-windows-classic-hpcpack-cluster-node-autogrowshrink.md)

## Integrate with Azure Batch 

* [Burst to Azure Batch with HPC Pack](https://technet.microsoft.com/library/mt612877.aspx)

## Create RDMA clusters for MPI workloads

* [Set up a Windows RDMA cluster with HPC Pack to run MPI applications](virtual-machines-windows-classic-hpcpack-rdma-cluster.md)
