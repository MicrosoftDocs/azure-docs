<properties
 pageTitle="About compute-intensive VMs with Linux | Microsoft Azure"
 description="Get background information and considerations for using the H-series and A8, A9, A10, and A11 compute-intensive sizes for Linux VMs"
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
 ms.date="09/21/2016"
 ms.author="danlep"/>

# About H-series and compute-intensive A-series VMs 

Here is background information and some considerations for using the newer Azure H-series and the earlier A8, A9, A10, and A11 sizes, also known as *compute-intensive* instances. This article focuses on using these sizes for Linux VMs. This article is also available for [Windows VMs](virtual-machines-windows-a8-a9-a10-a11-specs.md).




[AZURE.INCLUDE [virtual-machines-common-a8-a9-a10-a11-specs](../../includes/virtual-machines-common-a8-a9-a10-a11-specs.md)]

## Access to the RDMA network

You can create clusters of RDMA-capable Linux VMs that run one of the following supported Linux HPC distributions and a supported MPI implementation to take advantage of the Azure RDMA network. See [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md) for deployment options and sample configuration steps.

* **Distributions** - You must deploy VMs from RDMA-capable SUSE Linux Enterprise Server (SLES) or OpenLogic CentOS-based HPC images in the Azure Marketplace. Only the following Marketplace images support the necessary Linux RDMA drivers:

    * SLES 12 SP1 for HPC, SLES 12 SP1 for HPC (Premium)
    
    * SLES 12 for HPC, SLES 12 for HPC (Premium)
    
    * CentOS-based 7.1 HPC
    
    * CentOS-based 6.5 HPC
    
    >[AZURE.NOTE]For H-series VMs, we recommend either a SLES 12 SP1 for HPC image or CentOS-based 7.1 HPC image.
    >
    >On the CentOS-based HPC images, kernel updates are disabled in the **yum** configuration file. This is because the Linux RDMA drivers are distributed as an RPM package, and driver updates might not work if the kernel is updated.

* **MPI** - Intel MPI Library 5.x

    Depending on the Marketplace image you choose, separate licensing, installation, or configuration of Intel MPI may be needed, as follows: 
    
    * **SLES 12 SP1 for HPC image** - Install the Intel MPI packages distributed on the VM by running the following command:
    
            sudo rpm -v -i --nodeps /opt/intelMPI/intel_mpi_packages/*.rpm

    * **SLES 12 for HPC image** - You must separately register to download and install Intel MPI. See the [Intel MPI Library installation guide](https://software.intel.com/sites/default/files/managed/7c/2c/intelmpi-2017-installguide-linux.pdf).
    
    * **CentOS-based HPC images**  - Intel MPI 5.1 is already installed.  

    Additional system configuration is needed to run MPI jobs on clustered VMs. For example, on a cluster of VMs, you need to establish trust among the compute nodes. For typical settings, see [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md).


## Considerations for HPC Pack and Linux

[HPC Pack](https://technet.microsoft.com/library/jj899572.aspx), Microsoft’s free HPC cluster and job management solution, provides one option for you to use the compute-intensive instances with Linux. The latest releases of HPC Pack 2012 R2 support several Linux distributions to run on compute nodes deployed in Azure VMs, managed by a Windows Server head node. With RDMA-capable Linux compute nodes running Intel MPI, HPC Pack can schedule and run Linux MPI applications that access the RDMA network. To get started, see [Get started with Linux compute nodes in an HPC Pack cluster in Azure](virtual-machines-linux-classic-hpcpack-cluster.md).

## Network topology considerations

* On RDMA-enabled Linux VMs in Azure, Eth1 is reserved for RDMA network traffic. Do not change any Eth1 settings or any information in the configuration file referring to this network. Eth0 is reserved for regular Azure network traffic.

* In Azure, IP over InfiniBand (IB) is not supported. Only RDMA over IB is supported.

## RDMA driver updates for SLES 12

After you create a VM based on a SLES 12 HPC image, you might need to update the RDMA drivers on the VMs for RDMA network connectivity. 

>[AZURE.IMPORTANT]This step is **required** for SLES 12 for HPC VM deployments in all Azure regions. 
>This step isn't needed if you deploy a SLES 12 SP1 for HPC, CentOS-based 7.1 HPC, or CentOS-based 6.5 HPC VM. 

Before you update the drivers, stop all **zypper** processes or any processes that lock the SUSE repo databases on the VM. Otherwise the drivers might not update properly.  

To update the Linux RDMA drivers on each VM, run one of the following sets of Azure CLI commands from your client computer.

**SLES 12 for HPC VM provisioned in the classic deployment model**

```
azure config mode asm

azure vm extension set <vm-name> RDMAUpdateForLinux Microsoft.OSTCExtensions 0.1
```

**SLES 12 for HPC VM provisioned in the Resource Manager deployment model**

```
azure config mode arm

azure vm extension set <resource-group> <vm-name> RDMAUpdateForLinux Microsoft.OSTCExtensions 0.1
```

>[AZURE.NOTE]It might take some time to install the drivers, and the command returns without output. After the update, your VM will restart and should be ready for use in several minutes.

### Sample script for driver updates

If you have a cluster of SLES 12 for HPC VMs, you can script the driver update across all the nodes in your cluster. For example, the following script updates the drivers in an 8-node cluster.

```

#!/bin/bash -x

# Define a prefix naming scheme for compute nodes, e.g., cluster11, cluster12, etc.

vmname=cluster

# Plug in appropriate numbers in the for loop below.

for (( i=11; i<19; i++ )); do

# For VMs created in the classic deployment model, use the following command in your script.

azure vm extension set $vmname$i RDMAUpdateForLinux Microsoft.OSTCExtensions 0.1

# For VMs created in the Resource Manager deployment model, use the following command in your script.

# azure vm extension set <resource-group> $vmname$i RDMAUpdateForLinux Microsoft.OSTCExtensions 0.1

done

```


## Next steps

* For details about availability and pricing of the compute-intensive sizes, see [Virtual Machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/#Linux).

* For storage capacities and disk details, see [Sizes for virtual machines](virtual-machines-linux-sizes.md).

* To get started deploying and using compute-intensive sizes with RDMA on Linux, see [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md).


