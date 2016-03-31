<properties
   pageTitle="PowerShell script to deploy Windows HPC cluster | Microsoft Azure"
   description="Run a PowerShell script to deploy a Windows HPC Pack cluster in Azure infrastructure services"
   services="virtual-machines-windows"
   documentationCenter=""
   authors="dlepow"
   manager="timlt"
   editor=""
   tags="azure-service-management,hpc-pack"/>
<tags
   ms.service="virtual-machines-windows"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="big-compute"
   ms.date="01/08/2016"
   ms.author="danlep"/>

# Create a high performance computing (HPC) cluster with Windows VMs with the HPC Pack IaaS deployment script

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] Resource Manager model.

[AZURE.INCLUDE [virtual-machines-common-classic-hpcpack-cluster-powershell-script](../../includes/virtual-machines-common-classic-hpcpack-cluster-powershell-script.md)]

## Next steps

* Try running a test workload on the cluster. For an example, see the HPC Pack [getting started guide](https://technet.microsoft.com/library/jj884144).

* For a tutorials that uses the script to create a cluster and run an HPC workload, see [Get started with an HPC Pack cluster in Azure to run Excel and SOA workloads](virtual-machines-windows-excel-cluster-hpcpack.md).

* Try HPC Pack's tools to start, stop, add, and remove compute nodes from a cluster you create. See [Manage compute nodes in an HPC Pack cluster in Azure](virtual-machines-windows-classic-hpcpack-cluster-node-manage.md)
