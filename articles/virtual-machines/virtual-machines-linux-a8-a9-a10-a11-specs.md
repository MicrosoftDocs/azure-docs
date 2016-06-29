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
 ms.date="05/09/2016"
 ms.author="danlep"/>

# About the A8, A9, A10, and A11 compute-intensive instances 

Here is background information and some considerations for using the Azure A8, A9, A10, and A11 instances, also known as *compute-intensive* instances. This article focuses on using these instances for Linux VMs. This article is also available for [Windows VMs](virtual-machines-windows-a8-a9-a10-a11-specs.md).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

[AZURE.INCLUDE [virtual-machines-common-a8-a9-a10-a11-specs](../../includes/virtual-machines-common-a8-a9-a10-a11-specs.md)]

## Access to the RDMA network

Within a single cloud service or an availability set, clusters of size A8 and A9 Linux VMs that run one of the following supported Linux HPC distributions and a supported MPI implementation can access the RDMA network in Azure to run Linux MPI applications. See [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md) for deployment options and sample configuration steps.

* **Distributions** - SUSE Linux Enterprise Server (SLES) 12 for HPC, SLES 12 for HPC (Premium), CentOS-based 7.1 HPC, or CentOS-based 6.5 HPC, deployed from Azure Marketplace image

* **MPI** - Intel MPI Library 5.x

    >[AZURE.NOTE] Intel MPI 5.1.3.181 is already installed on the CentOS-based HPC images in the Marketplace. To use Intel MPI on SLES 12 HPC VMs, you must separately install it.

Currently, Azure Linux RDMA drivers are only installed when you deploy RDMA-enabled SLES 12 HPC and CentOS HPC images from the Azure Marketplace. You can't install the drivers on other Linux VMs you deploy.

>[AZURE.NOTE]On the CentOS-based HPC images from the Marketplace, kernel updates are disabled in the **yum** configuration file. This is because the Linux RDMA drivers are distributed as an RPM package, and driver updates might not work if the kernel is updated.


## RDMA driver updates for SLES 12
After you create a VM based on a SLES 12 HPC image, you need to update the RDMA drivers on the VMs for RDMA network connectivity. 

>[AZURE.IMPORTANT]This step is **required** for SLES 12 HPC VM deployments in all Azure regions. 
>This step isn't needed if you have deployed a CentOS-based 7.1 HPC or 6.5 HPC VM. 

Before you update the drivers, stop all **zypper** processes or any processes that lock the SUSE repo databases on the VM. Otherwise the drivers might not update properly.  

To update the Linux RDMA drivers on each VM, run one of the following sets of Azure CLI commands from your client computer.

**For a SLES 12 HPC VM provisioned in the classic deployment model**

```
azure config mode asm

azure vm extension set <vm-name> RDMAUpdateForLinux Microsoft.OSTCExtensions 0.1
```

**For a SLES 12 HPC VM provisioned in the Resource Manager deployment model**

```
azure config mode arm

azure vm extension set <resource-group> <vm-name> RDMAUpdateForLinux Microsoft.OSTCExtensions 0.1
```

>[AZURE.NOTE]It might take some time to install the drivers, and the command will return without output. After the update, your VM will restart and should be ready for use in several minutes.

### Sample script for driver updates

If you have a cluster of SLES 12 HPC VMs, you can script the driver update across all the nodes in your cluster. For example, the following script updates the drivers in an 8-node cluster.

```

#!/bin/bash -x

# Define a prefix naming scheme for compute nodes, e.g., cluster11, cluster12, etc.

vmname=cluster

# Plug in appropriate numbers in the for loop below.

for (( i=11; i<19; i++ )); do

# For VMs created in the classic deployment model use the following command in your script.

azure vm extension set $vmname$i RDMAUpdateForLinux Microsoft.OSTCExtensions 0.1

# For VMs created in the Resource Manager deployment model, use the following command in your script.

# azure vm extension set <resource-group> $vmname$i RDMAUpdateForLinux Microsoft.OSTCExtensions 0.1

done

```


## Considerations for HPC Pack and Linux

[HPC Pack](https://technet.microsoft.com/library/jj899572.aspx) is Microsoft’s free HPC cluster and job management solution. The latest releases of HPC Pack 2012 R2 support several Linux distributions to run on compute nodes deployed in Azure VMs, managed by a Windows Server head node. Linux compute nodes deployed on A8 or A9 VMs and running a supported MPI implementation can run MPI applications that access the RDMA network. To get started, see [Get started with Linux compute nodes in an HPC Pack cluster in Azure](virtual-machines-linux-classic-hpcpack-cluster.md).

## Network topology considerations

* On size A8 or A9 Linux VMs in Azure, Eth1 is reserved for RDMA network traffic. Do not change any Eth1 settings or any information in the configuration file referring to this network. Eth0 is reserved for regular Azure network traffic.

* In Azure IP over Infiniband (IB) is not supported. Only RDMA over IB is supported.


## Next steps

* For details about availability and pricing of the A8, A9, A10, and A11 instances, see [Virtual Machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/#Linux).

* For storage capacities and disk details, see [Sizes for virtual machines](virtual-machines-linux-sizes.md).

* To get started deploying and using A8 and A9 instances with RDMA on Linux, see [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md).


