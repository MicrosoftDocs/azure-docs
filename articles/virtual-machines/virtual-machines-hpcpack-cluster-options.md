<properties
 pageTitle="HPC Pack cluster options in the cloud | Microsoft Azure"
 description="Learn about options with Microsoft HPC Pack to create and manage a high performance computing (HPC) cluster in the Azure cloud."
 services="virtual-machines,cloud-services"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""
 tags="azure-resource-manager,azure-service-management"/>
<tags
ms.service="virtual-machines"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-multiple"
 ms.workload="big-compute"
 ms.date="09/28/2015"
 ms.author="danlep"/>

# Options to create and manage a high peformance computing (HPC) cluster in Azure with Microsoft HPC Pack

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]


Take advantage of Microsoft HPC Pack and Azure compute and infrastructure services to create and manage a cloud-based high performance computing (HPC) cluster. [HPC Pack](https://technet.microsoft.com/library/jj899572.aspx) is Microsoft's free HPC solution built on Microsoft Azure and Windows Server technologies and supports both Windows and Linux HPC workloads. A cloud-based HPC Pack cluster provides a cluster administrator or independent software vendor (ISV) a flexible, scalable platform to run compute-intensive applications while reducing investment in an on-premises compute cluster infrastructure.

<!-- Take advantage of automated tools for HPC Pack cluster deployment in Azure VMs, including an HPC Pack image that can be used with either Azure quickstart templates or Azure PowerShell scripts, or deploy your cluster manually in the Azure portal.-->


## Run an HPC Pack cluster in Azure VMs


### Azure VM images

* [HPC Pack on Windows Server 2012 R2](http://azure.microsoft.com/marketplace/partners/microsoft/hpcpack2012r2onwindowsserver2012r2/)

* [HPC Pack compute node on Windows Server 2012 R2](http://azure.microsoft.com/marketplace/partners/microsoft/hpcpack2012r2computenodeonwindowsserver2012r2/)

* [HPC Pack compute node with Excel on Windows Server 2012 R2](http://azure.microsoft.com/marketplace/partners/microsoft/hpcpack2012r2computenodewithexcelonwindowsserver2012r2/)

### Azure quickstart templates

* [Create an HPC cluster](https://azure.microsoft.com/documentation/templates/create-hpc-cluster/)

* [Create an HPC cluster with Linux compute nodes](https://azure.microsoft.com/documentation/templates/create-hpc-cluster-linux-cn/)

* [Create an HPC cluster with custom compute node image](https://azure.microsoft.com/documentation/templates/create-hpc-cluster-custom-image/)

### PowerShell deployment script

* [Create an HPC cluster with the HPC Pack IaaS deployment script](virtual-machines-hpcpackcluster-powershell-script.md)

### Tutorials

* [Tutorial: Get started with Linux compute nodes in an HPC Pack cluster in Azure](../virtual-machines/virtual-machines-linux-cluster-hpcpack.md)

* [Tutorial: Run NAMD with Microsoft HPC Pack on Linux compute nodes in Azure](../virtual-machines/virtual-machines-linux-cluster-hpcpack-namd.md)

* [Tutorial: Get started with an HPC Pack cluster in Azure to run Excel and SOA workloads](../virtual-machines/virtual-machines-excel-cluster-hpcpack.md)



### Manual deployment with the Azure portal



* [Set up the head node of an HPC Pack cluster in an Azure VM](virtual-machines-hpcpack-cluster-headnode.md)

### Cluster management

* [Manage compute nodes in an HPC Pack cluster in Azure](virtual-machines-hpcpack-cluster-node-manage.md)

* [Add Azure "burst" nodes to an HPC Pack head node in Azure](virtual-machines-hpcpack-cluster-node-burst.md)

* [Grow and shrink Azure compute resources in an HPC Pack cluster](virtual-machines-hpcpack-cluster-node-autogrowshrink.md)

* [Submit jobs to an HPC Pack cluster in Azure](virtual-machines-hpcpack-cluster-submit-jobs.md)



## Add worker role nodes to an HPC Pack cluster


* [Burst to Azure with HPC Pack](https://technet.microsoft.com/library/gg481749.aspx)

* [Tutorial: Set up a hybrid cluster with HPC Pack in Azure](../cloud-services/cloud-services-setup-hybrid-hpcpack-cluster.md)

* [Add Azure "burst" nodes to an HPC Pack head node in Azure](virtual-machines-hpcpack-cluster-node-burst.md)

* [Grow and shrink Azure compute resources in an HPC Pack cluster](virtual-machines-hpcpack-cluster-node-autogrowshrink.md)


## Create RDMA clusters for MPI workloads

* [Set up a Windows RDMA cluster with HPC Pack to run MPI applications](virtual-machines-windows-hpcpack-cluster-rdma.md)

<!-- * [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-hpcpack-cluster-rdma.md) -->
