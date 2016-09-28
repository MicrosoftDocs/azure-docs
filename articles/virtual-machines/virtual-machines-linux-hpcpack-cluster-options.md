<properties
 pageTitle="Linux HPC Pack cluster options in the cloud | Microsoft Azure"
 description="Learn about options with Microsoft HPC Pack to create and manage a Linux high performance computing (HPC) cluster in the Azure cloud"
 services="virtual-machines-linux,cloud-services"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""
 tags="azure-resource-manager,azure-service-management,hpc-pack"/>
<tags
ms.service="virtual-machines-linux"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-linux"
 ms.workload="big-compute"
 ms.date="09/26/2016"
 ms.author="danlep"/>

# Options with HPC Pack to create and manage an HPC cluster in Azure for Linux workloads

[AZURE.INCLUDE [virtual-machines-common-hpcpack-cluster-options](../../includes/virtual-machines-common-hpcpack-cluster-options.md)]

This article focuses on options to use HPC Pack to run Linux workloads. There are also options for running [Windows HPC workloads with HPC Pack](virtual-machines-windows-hpcpack-cluster-options.md).

## Run an HPC Pack cluster in Azure VMs

### Azure templates


* (Marketplace) [HPC Pack cluster for Linux workloads](https://azure.microsoft.com/marketplace/partners/microsofthpc/newclusterlinuxcn/)

* (Quickstart) [Create an HPC cluster with Linux compute nodes](https://github.com/Azure/azure-quickstart-templates/tree/master/create-hpc-cluster-linux-cn)


### PowerShell deployment script

* [Create a Linux HPC cluster with the HPC Pack IaaS deployment script](virtual-machines-linux-classic-hpcpack-cluster-powershell-script.md)

### Tutorials

* [Tutorial: Get started with Linux compute nodes in an HPC Pack cluster in Azure](virtual-machines-linux-classic-hpcpack-cluster.md)

* [Tutorial: Run NAMD with Microsoft HPC Pack on Linux compute nodes in Azure](virtual-machines-linux-classic-hpcpack-cluster-namd.md)

* [Tutorial: Run OpenFOAM with Microsoft HPC Pack on a Linux RDMA cluster in Azure](virtual-machines-linux-classic-hpcpack-cluster-openfoam.md)

* [Tutorial: Run STAR-CCM+ with Microsoft HPC Pack on a Linux RDMA cluster in Azure](virtual-machines-linux-classic-hpcpack-cluster-starccm.md)

### Cluster management

* [Submit jobs to an HPC Pack cluster in Azure](virtual-machines-windows-hpcpack-cluster-submit-jobs.md)

* [Job management in HPC Pack](https://technet.microsoft.com/library/jj899585.aspx)


## Create RDMA clusters for MPI workloads

* [Tutorial: Run OpenFOAM with Microsoft HPC Pack on a Linux RDMA cluster in Azure](virtual-machines-linux-classic-hpcpack-cluster-openfoam.md)

* [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md)

