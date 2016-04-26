<properties
 pageTitle="About the A8 - A11 instances and Linux | Microsoft Azure"
 description="Get background information and considerations for using the Azure A8, A9, A10, and A11 compute-intensive sizes for Linux VMs"
 services="virtual-machines-linux"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""
 tags="azure-resource-manager,azure-service-management"/>
<tags
ms.service="virtual-machines-linux"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-linux"
 ms.workload="infrastructure-services"
 ms.date="04/25/2016"
 ms.author="danlep"/>

# About the A8, A9, A10, and A11 compute-intensive instances 

Here is background information and some considerations for using the Azure A8, A9, A10, and A11 instances, also known as *compute-intensive* instances. This article focuses on using these instances for Linux VMs. This article is also available for [Windows VMs](virtual-machines-windows-a8-a9-a10-a11-specs.md).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

[AZURE.INCLUDE [virtual-machines-common-a8-a9-a10-a11-specs](../../includes/virtual-machines-common-a8-a9-a10-a11-specs.md)]

## Access to the RDMA network

Within a single cloud service or an availability set, the A8 and A9 instances can access the RDMA network in Azure to run Linux MPI applications. At this time, Azure Linux RDMA is only supported with [Intel MPI Library 5](https://software.intel.com/en-us/intel-mpi-library/).


The following table lists the Linux VM images in the Azure Marketplace you can use for Linux RDMA network access. See [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md) for deployment options and sample configuration steps.

Description | Image name | Notes
------------ | ------------- | ----------------
SUSE Linux Enterprise Server 12 for HPC | b4590d9e3ed742e4a1d46e5424aa335e__suse-sles-12-hpc-v20150708|
SUSE Linux Enterprise Server 12 for HPC (Premium) | b4590d9e3ed742e4a1d46e5424aa335e__suse-sles-12-hpc-priority-v20150708 | includes SUSE priority support (additional charges apply)
CentOS-based 6.5 HPC | 5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-65-HPC-20160408 | installs Intel MPI
CentOS-based 7.1 HPC | 5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-71-HPC-20160408 | installs Intel MPI


>[AZURE.NOTE] Currently, Azure Linux RDMA drivers are only installed when you deploy RDMA-enabled SUSE Linux Enterprise Server and CentOS HPC images from the Azure Marketplace. You can't install the drivers on other Linux VMs you deploy.

## Linux RDMA driver updates for SLES 12
After you create a Linux VM based on a SUSE Linux Enterprise Server (SLES) 12 HPC image, you might need to update the RDMA drivers on the VMs for RDMA network connectivity.

>[AZURE.IMPORTANT]Currently this step is **required** for SLES 12 HPC VM deployments in most Azure regions. **The only SLES 12 HPC VMs you should not update are those created in the following Azure regions: US West, West Europe, and Japan East.**

Before you update the drivers, stop all **zypper** processes or any processes that lock the SUSE repo databases on the VM. Otherwise the drivers might not update properly.  


Update the Linux RDMA drivers on each VM by running one of the following sets of Azure CLI commands on your client computer.

**For a VM provisioned in the classic deployment model**

```
azure config mode asm

azure vm extension set <vm-name> RDMAUpdateForLinux Microsoft.OSTCExtensions 0.1
```

**For a VM provisioned in the Resource Manager deployment model**

```
azure config mode arm

azure vm extension set <resource-group> <vm-name> RDMAUpdateForLinux Microsoft.OSTCExtensions 0.1
```

>[AZURE.NOTE]It might take some time to install the drivers, and the command will return without output. After the update, your VM will restart and should be ready for use in several minutes.

If you have a cluster of SLES 12 HPC VMs, you can script the driver update across all the nodes in your cluster. For example, the following script updates the drivers in an 8-node cluster.

```

#!/bin/bash -x

# Define a prefix naming scheme for compute nodes, e.g., cluster11, cluster12, etc.

vmname=cluster

# Plug in appropriate numbers in the for loop below.

for (( i=11; i<19; i++ )); do

# For VMs in the classic deployment model use the following command in your script.

azure vm extension set $vmname$i RDMAUpdateForLinux Microsoft.OSTCExtensions 0.1

# For VMs created in the Resource Manager deployment model, use the following command in your script.

# azure vm extension set <resource-group> $vmname$i RDMAUpdateForLinux Microsoft.OSTCExtensions 0.1

done

```


## Considerations for HPC Pack and Linux

[HPC Pack](https://technet.microsoft.com/library/jj899572.aspx) is Microsoft’s free HPC cluster and job management solution for Windows. The latest releases of HPC Pack 2012 R2 support several Linux distributions to run on compute nodes deployed in Azure VMs, managed by a Windows Server head node. Linux compute nodes deployed on A8 or A9 VMs and running a supported MPI implementation can run MPI applications that access the RDMA network. To get started, see the [Get started with Linux compute nodes in an HPC Pack cluster in Azure](virtual-machines-linux-classic-hpcpack-cluster.md).



## Next steps

* For details about availability and pricing of the A8, A9, A10, and A11 instances, see [Virtual Machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/#Linux).

* For storage capacities and disk details, see [Sizes for virtual machines](virtual-machines-linux-sizes.md).

* To get started deploying and using A8 and A9 instances with RDMA on Linux, see [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md).


