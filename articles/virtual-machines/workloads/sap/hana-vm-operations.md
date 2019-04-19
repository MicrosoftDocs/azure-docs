---
title: SAP HANA infrastructure configurations and operations on Azure | Microsoft Docs
description: Operations guide for SAP HANA systems that are deployed on Azure virtual machines.
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: msjuergent
manager: patfilot
editor: ''
tags: azure-resource-manager
keywords: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 12/04/2018
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

# SAP HANA infrastructure configurations and operations on Azure
This article provides guidance on how to configure Azure infrastructure and operate SAP HANA systems that are deployed on Azure native virtual machines (VMs). This article also includes configuration information for SAP HANA scale-out for the M128s VM SKU. This article isn't intended to replace the standard SAP documentation, which includes the following content:

- [SAP administration guide](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.02/330e5550b09d4f0f8b6cceb14a64cd22.html)
- [SAP installation guides](https://service.sap.com/instguides)
- [SAP Notes](https://sservice.sap.com/notes)

## Prerequisites
To use this guide, you need basic knowledge of the following Azure components:

- [Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-manage-vm)
- [Azure networking and virtual networks](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-virtual-network)
- [Azure Storage](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-manage-disks)

To learn more about SAP NetWeaver and other SAP components on Azure, see the [SAP on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/get-started) section of the [Azure documentation](https://docs.microsoft.com/azure/).

## Basic setup considerations
The following sections describe basic setup considerations for deploying SAP HANA systems on Azure VMs.

### Connect to Azure virtual machines
As documented in the [Azure virtual machines planning guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide), two basic methods are used to connect to Azure VMs:

- Connect through the internet and public endpoints on a JumpBox VM or on the VM that's running SAP HANA.
- Connect through a [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal) or Azure [ExpressRoute](https://azure.microsoft.com/services/expressroute/).

Site-to-site connectivity via VPN or ExpressRoute is necessary for production scenarios. This type of connection is also needed for nonproduction scenarios that feed into production scenarios where SAP software is used. The following image shows an example of cross-site connectivity:

![Cross-site connectivity](media/virtual-machines-shared-sap-planning-guide/300-vpn-s2s.png)


### Choose Azure VM types
The Azure VM types to use for production scenarios are listed in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html). For nonproduction scenarios, a wider variety of native Azure VM types is available.

>[!NOTE]
> For nonproduction scenarios, use the VM types that are listed in the [SAP Note #1928533](https://launchpad.support.sap.com/#/notes/1928533). For the use of Azure VMs for production scenarios, check for SAP HANA certified VMs in the SAP published [certified IaaS platforms list](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure).

To deploy the VMs in Azure, use:

- The Azure portal.
- Azure PowerShell cmdlets.
- The Azure CLI.

You also can deploy a complete installed SAP HANA platform on the Azure VM services through the [SAP cloud platform](https://cal.sap.com/). For information on the installation process, see [Deploy SAP S/4HANA or BW/4HANA on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/cal-s4h). For information on the automation released, see [this GitHub article](https://github.com/AzureCAT-GSI/SAP-HANA-ARM).

### Choose an Azure Storage type
Azure provides two types of storage that are suitable for Azure VMs that run SAP HANA:  

- Standard hard disk drives (HDDs)
- Premium solid-state drives (SSDs)

To learn about these disk types, see [Select a disk type](../../windows/disks-types.md).

Azure offers two deployment methods for VHDs on Azure standard storage and premium storage. If the overall scenario permits, take advantage of [Azure managed disk](https://azure.microsoft.com/services/managed-disks/) deployments.

For a list of storage types and their SLAs in IOPS and storage throughput, see [Azure documentation for managed disks](https://azure.microsoft.com/pricing/details/managed-disks/).

### Configure the storage for Azure virtual machines

You probably never cared about I/O subsystems and their capabilities because the appliance vendor made sure that the minimum storage requirements were met for SAP HANA. When you build the Azure infrastructure yourself, you need to be aware of some of those requirements. You also should understand the configuration requirements suggested in the following sections. For cases where you configure the virtual machines you want SAP HANA to run on, you might need to:

- Enable read/write volume on /hana/log at a minimum of 250 MB/sec for 1-MB I/O sizes.
- Enable read activity of at least 400 MB/sec for /hana/data for 16-MB and 64-MB I/O sizes.
- Enable write activity of at least 250 MB/sec for /hana/data with 16-MB and 64-MB I/O sizes.

Low-storage latency is critical for DBMS systems, even though DBMS, like SAP HANA, keeps data in-memory. The critical path in storage is usually around the transaction log writes of the DBMS systems. But operations like writing savepoints or loading data in-memory after crash recovery also can be critical. 

Use of Azure premium disks for /hana/data and /hana/log volumes is mandatory. To achieve the minimum throughput of /hana/log and /hana/data as desired by SAP, build a RAID 0 by using mdadm or a Logical Volume Manager (LVM) over multiple Azure premium storage disks. Also use the RAID volumes as /hana/data and /hana/log volumes. We recommend that you use the following stripe sizes for the RAID 0:

- 64 KB or 128 KB for /hana/data
- 32 KB for /hana/log

> [!NOTE]
> You don't need to configure any redundancy level by using RAID volumes because Azure premium and standard storage keep three images of a VHD. The use of a RAID volume is purely to configure volumes that provide sufficient I/O throughput.

Accumulating a number of Azure VHDs underneath a RAID is accumulative from an IOPS and storage throughput side. If you put a RAID 0 over 3 x P30 Azure premium storage disks, it gives you three times the IOPS and three times the storage throughput of a single Azure premium storage P30 disk.

The following caching recommendations assume the I/O characteristics for SAP HANA:

- There's hardly any read workload against the HANA data files. Exceptions are large-sized I/Os after restart of the HANA instance or when data is loaded into HANA. Another case of larger read I/Os against data files can be HANA database backups. As a result, read caching doesn't make sense because, in most cases, all data file volumes must be read completely.
- Writing against the data files is experienced in bursts based by HANA savepoints and HANA crash recovery. Writing savepoints is asynchronous and doesn't hold up any user transactions. Writing data during crash recovery is performance critical in order to get the system responding fast again. Crash recovery should be rather exceptional situations.
- There are hardly any reads from the HANA redo files. Exceptions are large I/Os when you perform transaction log backups, crash recovery, or the restart phase of a HANA instance.  
- The main load against the SAP HANA redo log file is writes. Depending on the nature of the workload, you can have I/Os as small as 4 KB or, in other cases, I/Os the size of 1 MB or more. Write latency against the SAP HANA redo log is performance critical.
- All writes must be persisted on disk in a reliable fashion.

As a result of these observed I/O patterns by SAP HANA, set the caching for the different volumes that use Azure premium storage to:

- **/hana/data**: No caching.
- **/hana/log**: No caching, with an exception for M-series VMs (see more later in this article).
- **/hana/shared**: Read caching.


Also, keep in mind the overall VM I/O throughput when you size or decide on a VM. Overall VM storage throughput is documented in [Memory optimized virtual machine sizes](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-memory).

#### Linux I/O scheduler mode
Linux has several different I/O scheduling modes. A common recommendation from Linux vendors and SAP is to set the I/O scheduler mode for disk volumes away from the **cfq** mode to the **noop** mode. For more information, see [SAP Note #1984798](https://launchpad.support.sap.com/#/notes/1984787). 


#### Storage solution with Write Accelerator for Azure M-series virtual machines
 Write Accelerator is an Azure feature that's rolling out for Azure M-series VMs exclusively. The purpose of the functionality is to improve the I/O latency of writes against Azure premium storage. For SAP HANA, Write Accelerator is supposed to be used against the /hana/log volume only. For this reason, the configurations shown so far must be changed. The main change is the breakup between /hana/data and /hana/log in order to use Write Accelerator against the /hana/log volume only. 

> [!IMPORTANT]
> SAP HANA certification for Azure M-series virtual machines is exclusive to Write Accelerator for the /hana/log volume. As a result, production-scenario SAP HANA deployments on Azure M-series virtual machines are expected to be configured with Write Accelerator for the /hana/log volume.

> [!NOTE]
> For production scenarios, check whether a certain VM type is supported for SAP HANA by SAP in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html).

The following table shows recommended configurations.

| VM SKU | RAM | Maximum VM I/O<br /> throughput | /hana/data | /hana/log | /hana/shared | /root volume | /usr/sap | hana/backup |
| --- | --- | --- | --- | --- | --- | --- | --- | -- |
| M32ts | 192 GiB | 500 MB/sec | 3 x P20 | 2 x P20 | 1 x P20 | 1 x P6 | 1 x P6 |1 x P20 |
| M32ls | 256 GiB | 500 MB/sec | 3 x P20 | 2 x P20 | 1 x P20 | 1 x P6 | 1 x P6 |1 x P20 |
| M64ls | 512 GiB | 1,000 MB/sec | 3 x P20 | 2 x P20 | 1 x P20 | 1 x P6 | 1 x P6 |1 x P30 |
| M64s | 1,000 GiB | 1,000 MB/sec | 4 x P20 | 2 x P20 | 1 x P30 | 1 x P6 | 1 x P6 |2 x P30 |
| M64ms | 1,750 GiB | 1,000 MB/sec | 3 x P30 | 2 x P20 | 1 x P30 | 1 x P6 | 1 x P6 | 3 x P30 |
| M128s | 2,000 GiB | 2,000 MB/sec |3 x P30 | 2 x P20 | 1 x P30 | 1 x P6 | 1 x P6 | 2 x P40 |
| M128ms | 3,800 GiB | 2,000 MB/sec | 5 x P30 | 2 x P20 | 1 x P30 | 1 x P6 | 1 x P6 | 2 x P50 |

Check whether the storage throughput for the different suggested volumes meets the workload that you want to run. If the workload requires higher volumes for /hana/data and /hana/log, increase the number of Azure premium storage VHDs. Sizing a volume with more VHDs than listed increases the IOPS and I/O throughput within the limits of the Azure virtual machine type.

Write Accelerator only works in conjunction with [Azure managed disks](https://azure.microsoft.com/services/managed-disks/). At the least, the Azure premium storage disks that form the /hana/log volume must be deployed as managed disks.

There are limits for Azure premium storage VHDs per VM that Write Accelerator can support. The current limits are:

- 16 VHDs for an M128xx VM.
- 8 VHDs for an M64xx VM.
- 4 VHDs for an M32xx VM.

For more information on how to enable Write Accelerator, see [Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/linux/how-to-enable-write-accelerator).

For more information on and restrictions for Write Accelerator, see the same documentation.


#### Cost-conscious Azure Storage configuration
The following table shows a configuration of VM types that customers commonly use to host SAP HANA on Azure VMs. There might be some VM types that don't meet all minimum criteria for SAP HANA. There also might be some VM types that aren't officially supported with SAP HANA by SAP. So far, those VMs have performed fine for nonproduction scenarios. 

> [!NOTE]
> For production scenarios, check whether a certain VM type is supported for SAP HANA by SAP in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html).


| VM SKU | RAM | Maximum VM I/O<br /> throughput | /hana/data and /hana/log<br /> striped with LVM or mdadm | /hana/shared | /root volume | /usr/sap | hana/backup |
| --- | --- | --- | --- | --- | --- | --- | -- |
| DS14v2 | 112 GiB | 768 MB/sec | 3 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S15 |
| E16v3 | 128 GiB | 384 MB/sec | 3 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S15 |
| E32v3 | 256 GiB | 768 MB/sec | 3 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S20 |
| E64v3 | 432 GiB | 1,200 MB/sec | 3 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S30 |
| GS5 | 448 GiB | 2,000 MB/sec | 3 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S30 |
| M32ts | 192 GiB | 500 MB/sec | 3 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S20 |
| M32ls | 256 GiB | 500 MB/sec | 3 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S20 |
| M64ls | 512 GiB | 1,000 MB/sec | 3 x P20 | 1 x S20 | 1 x S6 | 1 x S6 |1 x S30 |
| M64s | 1,000 GiB | 1,000 MB/sec | 2 x P30 | 1 x S30 | 1 x S6 | 1 x S6 |2 x S30 |
| M64ms | 1,750 GiB | 1,000 MB/sec | 3 x P30 | 1 x S30 | 1 x S6 | 1 x S6 | 3 x S30 |
| M128s | 2,000 GiB | 2,000 MB/sec |3 x P30 | 1 x S30 | 1 x S6 | 1 x S6 | 2 x S40 |
| M128ms | 3,800 GiB | 2,000 MB/sec | 5 x P30 | 1 x S30 | 1 x S6 | 1 x S6 | 2 x S50 |


The disks that are recommended for the smaller VM types with 3 x P20 oversize the volumes in regard to the space recommendations that are given in the [SAP TDI storage white paper](https://www.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html). The choice displayed in the table was made to provide sufficient disk throughput for SAP HANA. If you need to change the **/hana/backup** volume, which was sized to keep backups that represent twice the memory volume, feel free to make adjustments. 

Check whether the storage throughput for the different suggested volumes meets the workload that you want to run. If the workload requires higher volumes for /hana/data and /hana/log, increase the number of Azure premium storage VHDs. Sizing a volume with more VHDs than listed increases the IOPS and I/O throughput within the limits of the Azure virtual machine type. 

> [!NOTE]
> The previous configurations don't benefit from [Azure virtual machine single VM SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_6/) because it uses a mixture of Azure premium storage and Azure standard storage. The selection was chosen to optimize costs. Choose premium storage for all the disks in the table that are listed as Azure standard storage (Sxx) to make the VM configuration compliant with the Azure single VM SLA.


> [!NOTE]
> The disk configuration recommendations target the minimum requirements that SAP gives its infrastructure providers. In actual customer deployments and workload scenarios, these recommendations didn't provide sufficient capabilities in some situations. For example, a customer needed a faster reload of the data after a HANA restart, or backup configurations required higher bandwidth to the storage. Other cases include /hana/log, where 5,000 IOPS weren't sufficient for the specific workload. Use these recommendations as a starting point, and adapt them based on the requirements of the workload.
>  

### Set up Azure virtual networks
When you have site-to-site connectivity to Azure via VPN or Azure ExpressRoute, you must have at least one Azure virtual network that's connected through a virtual gateway to the VPN or ExpressRoute circuit. In simple deployments, the virtual gateway can be deployed in a subnet of the Azure virtual network that hosts the SAP HANA instances too. 

To install SAP HANA, create two additional subnets within the Azure virtual network. One subnet hosts the VMs to run the SAP HANA instances. The other subnet runs JumpBox or management VMs to host SAP HANA Studio, other management software, or your application software.

> [!IMPORTANT]
> Configuring [Azure network virtual appliances](https://azure.microsoft.com/solutions/network-appliances/) in the communication path between the SAP application and the DBMS layer of a SAP NetWeaver-, Hybris-, or S/4HANA-based SAP system isn't supported. This restriction is for functionality and performance reasons. The communication path between the SAP application layer and the DBMS layer must be a direct one. The restriction doesn't include [application security group (ASG) and network security group (NSG) rules](https://docs.microsoft.com/azure/virtual-network/security-overview) if those ASG and NSG rules allow a direct communication path. 
>
> Other scenarios where network virtual appliances aren't supported are in: 
>
> - Communication paths between Azure VMs that represent Linux Pacemaker cluster nodes and SBD devices as described in [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server for SAP Applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse).
> - Communication paths between Azure VMs and Windows Server Scale-Out File Server set up as described in [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a file share in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-guide-wsfc-file-share). 
>
> Network virtual appliances in communication paths can easily double the network latency between two communication partners. They also can restrict throughput in critical paths between the SAP application layer and the DBMS layer. In some customer scenarios, network virtual appliances can cause Pacemaker Linux clusters to fail. These are cases where communications between the Linux Pacemaker cluster nodes communicate to their SBD device through a network virtual appliance.  
> 

> [!IMPORTANT]
> Another design that's *not* supported is the segregation of the SAP application layer and the DBMS layer into different Azure virtual networks that aren't [peered](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview) with each other. We recommend that you segregate the SAP application layer and DBMS layer by using subnets within an Azure virtual network instead of by using different Azure virtual networks. 
>
>If you decide not to follow the recommendation and instead segregate the two layers into different virtual networks, the two virtual networks must be [peered](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview). 
>
> Be aware that network traffic between two [peered](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview) Azure virtual networks is subject to transfer costs. Huge data volume that consists of many terabytes is exchanged between the SAP application layer and DBMS layer. You can accumulate substantial costs if the SAP application layer and DBMS layer are segregated between two peered Azure virtual networks. 

When you install the VMs to run SAP HANA, the VMs need:

- Two virtual NICs installed. One NIC connects to the management subnet. Another NIC connects from the on-premises network or other networks to the SAP HANA instance in the Azure VM.
- Static private IP addresses that are deployed for both virtual NICs.

> [!NOTE]
> Assigning static IP addresses through Azure means to assign them to individual virtual NICs. Don't assign static IP addresses within the guest OS to a virtual NIC. Some Azure services like Azure Backup rely on the fact that at least the primary virtual NIC is set to DHCP and not to static IP addresses. For more information, see [Troubleshoot Azure virtual machine backup](https://docs.microsoft.com/azure/backup/backup-azure-vms-troubleshoot#networking). To assign multiple static IP addresses to a VM, assign multiple virtual NICs to a VM.
>
>

For deployments that are enduring, create a virtual datacenter network architecture in Azure. This architecture recommends the separation of the Azure virtual network gateway that connects to on-premises into a separate Azure virtual network. This separate virtual network hosts all the traffic that leaves either to on-premises or to the internet. By using this approach, you can deploy software to audit and log traffic that enters the virtual datacenter in Azure in this separate hub virtual network. This way, you have one virtual network that hosts all the software and configurations that relates to ingoing and outgoing traffic to your Azure deployment.


For more information on the virtual datacenter approach and related Azure virtual network design, see: 

- [Azure virtual datacenter: A network perspective](https://docs.microsoft.com/azure/architecture/vdc/networking-virtual-datacenter).
- [Azure virtual datacenter and the enterprise control plane](https://docs.microsoft.com/azure/architecture/vdc/).


>[!NOTE]
>Traffic that flows between a hub virtual network and a spoke virtual network by using [Azure virtual network peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview) is subject to additional [costs](https://azure.microsoft.com/pricing/details/virtual-network/). Based on those costs, you might need to make compromises between running a strict hub-and-spoke network design and running multiple [Azure ExpressRoute gateways](https://docs.microsoft.com/azure/expressroute/expressroute-about-virtual-network-gateways) that you connect to spokes in order to bypass virtual network peering. 
>
> Azure ExpressRoute gateways introduce additional [costs](https://azure.microsoft.com/pricing/details/vpn-gateway/) too. You also might encounter additional costs for third-party software you use to log, audit, and monitor network traffic. Consider the costs for data exchange through virtual network peering versus the costs created by additional ExpressRoute gateways and software licenses. You might decide on micro-segmentation within one virtual network by using subnets as isolation units instead of virtual networks.


For an overview of different methods you can use to assign IP addresses, see [IP address types and allocation methods in Azure](https://docs.microsoft.com/azure/virtual-network/virtual-network-ip-addresses-overview-arm). 

For VMs that run SAP HANA, work with the static IP addresses that are assigned. The reason is that some configuration attributes for HANA reference IP addresses.

[Azure NSGs](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) are used to direct traffic that's routed to the SAP HANA instance or JumpBox. The NSGs and eventually [application security groups](https://docs.microsoft.com/azure/virtual-network/security-overview#application-security-groups) are associated with the SAP HANA subnet and the management subnet.

The following image shows an overview of a rough deployment schema for SAP HANA that follows a hub-and-spoke virtual network architecture:

![Rough deployment schema for SAP HANA](media/hana-vm-operations/hana-simple-networking.PNG)

To deploy SAP HANA in Azure without a site-to-site connection, shield the SAP HANA instance from the public internet and hide it behind a forward proxy. In this basic scenario, the deployment relies on Azure built-in DNS services to resolve host names. In a more complex deployment where public-facing IP addresses are used, Azure built-in DNS services are especially important. Use Azure NSGs and [Azure network virtual appliances](https://azure.microsoft.com/solutions/network-appliances/) to monitor the routing from the internet into your Azure virtual network architecture in Azure. 

The following image shows a rough schema for how to deploy SAP HANA without a site-to-site connection in a hub-and-spoke virtual network architecture:
  
![Rough deployment schema for SAP HANA without a site-to-site connection](media/hana-vm-operations/hana-simple-networking2.PNG)
 

For another description of how to use Azure network virtual appliances to control and monitor access from the internet without the hub-and-spoke virtual network architecture, see [Deploy highly available network virtual appliances](https://docs.microsoft.com/azure/architecture/reference-architectures/dmz/nva-ha).


## Configure Azure infrastructure for SAP HANA scale-out
Microsoft has one M-series VM SKU that's certified for an SAP HANA scale-out configuration. The VM type M128s is certified for a scale-out of up to 16 nodes. For changes in SAP HANA scale-out certifications on Azure VMs, see the [certified IaaS platforms list](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure).

The minimum OS releases used to deploy scale-out configurations in Azure VMs are:

- SUSE Linux 12 SP3.
- Red Hat Linux 7.4.

For the 16-node scale-out certification:

- One node is the master node.
- A maximum of 15 nodes are worker nodes.

>[!NOTE]
>In Azure VM scale-out deployments, it's not possible to use a standby node.
>

There are two reasons why you can't configure a standby node:

- Azure at this point has no native NFS service. As a result, NFS shares must be configured with the help of third-party functionality.
- None of the third-party NFS configurations can fulfill the storage latency criteria for SAP HANA with their solutions deployed on Azure.

As a result, /hana/data and /hana/log volumes can't be shared. Not sharing these volumes of the single nodes prevents the use of an SAP HANA standby node in a scale-out configuration.

The following image shows the basic design for a single node in a scale-out configuration:

![Scale-out basics of a single node](media/hana-vm-operations/scale-out-basics.PNG)

The basic configuration of a VM node for SAP HANA scale-out looks like:

- For /hana/shared, you build out a highly available NFS cluster based on SUSE Linux 12 SP3. This cluster hosts the /hana/shared NFS shares of your scale-out configuration and SAP NetWeaver or BW/4HANA Central Services. For information on how to build such a configuration, see [High availability for NFS on Azure VMs on SUSE Linux Enterprise Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-nfs).
- All other disk volumes aren't shared among the different nodes and aren't based on NFS. Installation configurations and steps for scale-out HANA installations with nonshared /hana/data and /hana/log are provided later in this article.

>[!NOTE]
>The highly available NFS cluster as displayed in the graphics so far is supported with SUSE Linux only. A highly available NFS solution based on Red Hat will be advised later.

Sizing the volumes for the nodes is the same as for scale-up, except for /hana/shared. The following table shows the suggested sizes and types for the M128s VM SKU.

| VM SKU | RAM | Maximum VM I/O<br /> throughput | /hana/data | /hana/log | /root volume | /usr/sap | hana/backup |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M128s | 2,000 GiB | 2,000 MB/s |3 x P30 | 2 x P20 | 1 x P6 | 1 x P6 | 2 x P40 |


Check whether the storage throughput for the different suggested volumes meets the workload that you want to run. If the workload requires higher volumes for /hana/data and /hana/log, increase the number of Azure premium storage VHDs. Sizing a volume with more VHDs than listed increases the IOPS and I/O throughput within the limits of the Azure virtual machine type. Also apply Write Accelerator to the disks that form the /hana/log volume.
 

For a formula that defines the size of the /hana/shared volume for scale-out as the memory size of a single worker node per four worker nodes, see [SAP HANA TDI storage requirements](https://www.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html).

Assuming that you take the SAP HANA scale-out certified M128s Azure VM with roughly 2 TB of memory, the SAP recommendations are summarized as:

- For one master node and up to four worker nodes, the size of the /hana/shared volume is 2 TB.
- For one master node and five and eight worker nodes, the size of the /hana/shared volume is 4 TB.
- For one master node and 9 to 12 worker nodes, the size of the /hana/shared volume is 6 TB.
- For one master node and 12 to 15 worker nodes, the size of the /hana/shared volume is 8 TB.

The other important design that's displayed in the graphics of the single node configuration for a scale-out SAP HANA VM is the virtual network with the subnet configuration. SAP highly recommends a separation of the client- and application-facing traffic from the communications between the HANA nodes. 

To achieve this goal, attach two different virtual NICs to the VM, as shown in the graphics. Both virtual NICs are in different subnets and have two different IP addresses. You then control the flow of traffic with routing rules by using NSGs or user-defined routes.

Particularly in Azure, there are no means and methods to enforce quality of service and quotas on specific virtual NICs. As a result, the separation of client- and application-facing and intra-node communication doesn't open any opportunities to prioritize one traffic stream over the other. Instead, the separation remains a measure of security in shielding the intra-node communications of the scale-out configurations.  

>[!IMPORTANT]
>SAP highly recommends that you separate network traffic to the client and application side and intra-node traffic as described in this article. We recommend that you put an architecture in place as shown in the previous graphics.
>

The following image shows the minimum required network architecture from a networking point of view:

![Scale-out basics of a single node](media/hana-vm-operations/scale-out-networking-overview.PNG)

The limits supported so far are 15 worker nodes in addition to one master node.

The following image shows the storage architecture from a storage point of view:


![Scale-out basics of a single node](media/hana-vm-operations/scale-out-storage-overview.PNG)

The /hana/shared volume is located on the highly available NFS share configuration. All the other drives are locally mounted to the individual VMs. 

### Highly available NFS share
So far, the highly available NFS cluster is working with SUSE Linux only. For setup information, see [High availability for NFS on Azure VMs on SUSE Linux Enterprise Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-nfs). If you don't share the NFS cluster with any other HANA configurations outside the Azure virtual network that runs the SAP HANA instances, install it in the same virtual network. Install it in its own subnet, and make sure that not all arbitrary traffic can access the subnet. Instead, limit the traffic to that subnet to the IP addresses of the VM that execute the traffic to /hana/shared volume.

Related to the virtual NIC of a HANA scale-out VM that routes the /hana/shared traffic, the recommendations are:

- Because traffic to /hana/shared is moderate, route it through the virtual NIC that's assigned to the client network in the minimum configuration.
- Eventually, for the traffic to /hana/shared, deploy a third subnet in the virtual network where you deploy the SAP HANA scale-out configuration. Assign a third virtual NIC that's hosted in that subnet. Use the third virtual NIC and associated IP address for the traffic to the NFS share. You then can apply separate access and routing rules.

>[!IMPORTANT]
>Network traffic between the VMs that have SAP HANA in a scale-out manner deployed and the highly available NFS under no circumstances may be routed through a [network virtual appliance](https://azure.microsoft.com/solutions/network-appliances/) or similar virtual appliances. Azure NSGs are no such devices. Check your routing rules to make sure that network virtual appliances or similar virtual appliances are detoured when they access the highly available NFS share from the VMs that run SAP HANA.
> 

If you want to share the highly available NFS cluster between SAP HANA configurations, move all those HANA configurations into the same virtual network. 
 

### Install an SAP HANA scale-out in Azure
To install a scale-out SAP configuration, follow these general steps:

- Deploy new or adapt new Azure virtual network infrastructure.
- Deploy the new VMs by using Azure-managed premium storage volumes.
- Deploy a new or adapt an existing highly available NFS cluster.
- Adapt network routing to make sure that, for example, intra-node communication between VMs isn't routed through a [network virtual appliance](https://azure.microsoft.com/solutions/network-appliances/). The same is true for traffic between the VMs and the highly available NFS cluster.
- Install the SAP HANA master node.
- Adapt configuration parameters of the SAP HANA master node.
- Continue with the installation of the SAP HANA worker nodes.

#### Install SAP HANA in a scale-out configuration
Your Azure VM infrastructure is deployed, and all other preparations are finished. Now, to install the SAP HANA scale-out configurations, follow these steps:

- Install the SAP HANA master node according to SAP's documentation.
- *After the installation, change the global.ini file and add the parameter 'basepath_shared = no' to the global.ini*. This parameter enables SAP HANA to run in scale-out without shared /hana/data and /hana/log volumes between the nodes. For more information, see [SAP Note #2080991](https://launchpad.support.sap.com/#/notes/2080991).
- After you change the global.ini parameter, restart the SAP HANA instance.
- Add additional worker nodes. For more information, see [SAP HANA administration guide](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.00/en-US/0d9fe701e2214e98ad4f8721f6558c34.html). Specify the internal network for SAP HANA inter-node communication during the installation or afterwards by using, for example, the local hdblcm. For more information, see [SAP Note #2183363](https://launchpad.support.sap.com/#/notes/2183363). 

Following this setup routine, the scale-out configuration you installed uses nonshared disks to run /hana/data and /hana/log. The /hana/shared volume is placed on the highly available NFS share.


## SAP HANA dynamic tiering 2.0 for Azure virtual machines

In addition to the SAP HANA certifications on Azure M-series VMs, SAP HANA dynamic tiering 2.0 (DT 2.0) is also supported on Microsoft Azure. For links to SAP HANA dynamic tiering documentation, see the section "Links to DT 2.0 documentation" later in this article. There's no difference in installing the product or operating it, for example, via SAP HANA Cockpit inside an Azure VM, but a few important items are mandatory for official support on Azure. These key points are described in the following sections. 

SAP HANA DT 2.0 isn't supported by SAP BW or S4HANA. The main use cases right now are native HANA applications.


### Overview

The following image gives an overview of DT 2.0 support on Microsoft Azure. Follow these mandatory requirements to comply with the official certification:

- DT 2.0 must be installed on a dedicated Azure VM. It may not run on the same VM where SAP HANA runs.
- SAP HANA and DT 2.0 VMs must be deployed within the same Azure virtual network.
- The SAP HANA and DT 2.0 VMs must be deployed with Azure Accelerated Networking enabled.
- The storage type for the DT 2.0 VMs must be Azure premium storage.
- Multiple Azure disks must be attached to the DT 2.0 VM.
- Creating a software RAID or striped volume, either via LVM or mdadm, is required by using striping across the Azure disks.

The following sections provide more explanation.

![SAP HANA DT 2.0 architecture overview](media/hana-vm-operations/hana-dt-20.PNG)



### Dedicated Azure VM for SAP HANA DT 2.0

On Azure IaaS, DT 2.0 is supported only on a dedicated VM. DT 2.0 isn't allowed to run on the same Azure VM where the HANA instance is running. Initially, two VM types can be used to run SAP HANA DT 2.0:

- M64-32ms 
- E32sv3 

For VM type descriptions, see [Memory optimized virtual machine sizes](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-memory).

Given the basic idea of DT 2.0, which is about offloading warm data to save costs, it makes sense to use corresponding VM sizes. There's no strict rule for the possible combinations. It depends on the specific customer workload.

The following table shows recommended configurations.

| SAP HANA VM type | DT 2.0 VM type |
| --- | --- | 
| M128ms | M64-32ms |
| M128s | M64-32ms |
| M64ms | E32sv3 |
| M64s | E32sv3 |


All combinations of SAP HANA-certified M-series VMs with supported DT 2.0 VMs, such as M64-32ms and E32sv3, are possible.


### Azure networking and SAP HANA DT 2.0

Installing DT 2.0 on a dedicated VM requires network throughput between the DT 2.0 VM and the SAP HANA VM with a 10-GB minimum. As a result, it's mandatory to place all VMs within the same Azure virtual network and enable Azure Accelerated Networking.

For more information about Azure Accelerated Networking, see [Create a Linux virtual machine with Accelerated Networking](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli).

### VM storage for SAP HANA DT 2.0

According to DT 2.0 best-practice guidance, the disk IO throughput minimum is 50 MB/sec per physical core. Looking at the spec for the two Azure VM types, which are supported for DT 2.0, the maximum disk IO throughput limit for the VM is:

- **E32sv3**:   768 MB/sec, uncached, which means a ratio of 48 MB/sec per physical core
- **M64-32ms**:  1,000 MB/sec, uncached, which means a ratio of 62.5 MB/sec per physical core

Attaching multiple Azure disks to the DT 2.0 VM and creating a software RAID by using striping on the OS level to achieve the maximum limit of disk throughput per VM is required. A single Azure disk can't provide the throughput to reach the maximum VM limit. Azure premium storage is mandatory to run DT 2.0. 

- For more information about available Azure disk types, see [Select a disk type for Azure IaaS Windows VMs](../../windows/disks-types.md).
- For more information about how to create a software RAID via mdadm, see [Configure a software RAID on Linux](https://docs.microsoft.com/azure/virtual-machines/linux/configure-raid).
- For more information about how to configure LVM to create a striped volume for maximum throughput, see [Configure LVM on a Linux VM in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/configure-lvm).

Depending on size requirements, there are different options to reach the maximum throughput of a VM. Here are possible data volume disk configurations for every DT 2.0 VM type to achieve the upper VM throughput limit. The E32sv3 VM is considered an entry level for smaller workloads. If it's not fast enough, it might be necessary to resize the VM to M64-32ms.

Because the M64-32ms VM has a large amount of memory, the IO load might not reach the limit, especially for read-intensive workloads. Fewer disks in the stripe set might be sufficient depending on the customer-specific workload. To be on the safe side, the following disk configurations were chosen to guarantee maximum throughput.


| VM SKU | Disk config 1 | Disk config 2 | Disk config 3 | Disk config 4 | Disk config 5 | 
| ---- | ---- | ---- | ---- | ---- | ---- | 
| M64-32ms | 4 x P50 -> 16 TB | 4 x P40 -> 8 TB | 5 x P30 -> 5 TB | 7 x P20 -> 3.5 TB | 8 x P15 -> 2 TB | 
| E32sv3 | 3 x P50 -> 12 TB | 3 x P40 -> 6 TB | 4 x P30 -> 4 TB | 5 x P20 -> 2.5 TB | 6 x P15 -> 1.5 TB | 


Especially if the workload is read-intensive, turning on the Azure host cache "read-only" setting as recommended for the data volumes of database software might boost IO performance. For the transaction log, the Azure host disk cache must be "none." 

The starting point that we recommend for the size of the log volume is a heuristic of 15 percent of the data size. To create the log volume, use different Azure disk types depending on cost and throughput requirements. For the log volume, high I/O throughput is required. 

If you use the VM type M64-32ms, we recommend that you enable [Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/linux/how-to-enable-write-accelerator). Write Accelerator is an Azure feature that provides optimal disk write latency for the transaction log. It's available only for the M series. There are some items to consider though, such as the maximum number of disks per VM type. For more information on Write Accelerator, see [Enable Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator).


The following table shows a few examples to help you size the log volume.

| Data volume size and disk type | Log volume and disk type config 1 | Log volume and disk type config 2 |
| --- | --- | --- |
| 4 x P50 -> 16 TB | 5 x P20 -> 2.5 TB | 3 x P30 -> 3 TB |
| 6 x P15 -> 1.5 TB | 4 x P6 -> 256 GB | 1 x P15 -> 256 GB |


Similar to SAP HANA scale-out, the /hana/shared directory must be shared between the SAP HANA VM and the DT 2.0 VM. We recommend that you use the same architecture as for SAP HANA scale-out by using dedicated VMs, which act as a highly available NFS server. To provide a shared backup volume, use the identical design. But it's up to you to decide if high availability is necessary or if it's sufficient to use a dedicated VM with enough storage capacity to act as a backup server.



### Links to DT 2.0 documentation 

- [SAP HANA dynamic tiering installation and update guide](https://help.sap.com/viewer/88f82e0d010e4da1bc8963f18346f46e/2.0.03/en-US)
- [SAP HANA dynamic tiering tutorials and resources](https://help.sap.com/viewer/fb9c3779f9d1412b8de6dd0788fa167b/2.0.03/en-US)
- [SAP HANA dynamic tiering proof of concept](https://blogs.sap.com/2017/12/08/sap-hana-dynamic-tiering-delivering-on-low-tco-with-impressive-performance/)
- [SAP HANA 2.0 SPS 02 dynamic tiering enhancements](https://blogs.sap.com/2017/07/31/sap-hana-2.0-sps-02-dynamic-tiering-enhancements/)




## Operations for deploying SAP HANA on Azure VMs
The following sections describe some of the operations related to deploying SAP HANA systems on Azure VMs.

### Back up and restore operations on Azure VMs
The following documents describe how to back up and restore your SAP HANA deployment:

- [SAP HANA backup overview](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-guide)
- [SAP HANA file-level backup](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-file-level)
- [SAP HANA storage snapshot benchmark](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-storage-snapshots)


### Start and restart VMs that contain SAP HANA
A prominent feature of the Azure public cloud is that you're charged only for your computing minutes. For example, when you shut down a VM that's running SAP HANA, you're billed only for the storage costs during that time. Another feature is available when you specify static IP addresses for your VMs in your initial deployment. When you restart a VM that has SAP HANA, the VM restarts with its prior IP addresses. 


### Use SAProuter for SAP remote support
If you have a site-to-site connection between your on-premises locations and Azure and you're running SAP components, you're probably already running SAProuter. In this case, follow these steps for remote support:

- Maintain the private and static IP address of the VM that hosts SAP HANA in the SAProuter configuration.
- Configure the NSG of the subnet that hosts the HANA VM to allow traffic through TCP/IP port 3299.

If you connect to Azure through the internet and you don't have an SAP router for the VM with SAP HANA, install the component. Install SAProuter in a separate VM in the management subnet. 

The following image shows a rough schema for deploying SAP HANA without a site-to-site connection and with SAProuter:

![Rough deployment schema for SAP HANA without a site-to-site connection and SAProuter](media/hana-vm-operations/hana-simple-networking3.PNG)

Be sure to install SAProuter in a separate VM and not in your JumpBox VM. The separate VM must have a static IP address. To connect your SAProuter to the SAProuter that's hosted by SAP, contact SAP for an IP address. The SAProuter that's hosted by SAP is the counterpart of the SAProuter instance that you install on your VM. Use the IP address from SAP to configure your SAProuter instance. In the configuration settings, the only necessary port is TCP port 3299.

For more information on how to set up and maintain remote support connections through SAProuter, see [SAP documentation](https://support.sap.com/en/tools/connectivity-tools/remote-support.html).

### High availability with SAP HANA on Azure native VMs
If you run SUSE Linux Enterprise Server for SAP Applications 12 SP1 or later, you can establish a Pacemaker cluster with STONITH devices. Use the devices to set up an SAP HANA configuration that uses synchronous replication with HANA System Replication and automatic failover. For more information about the setup procedure, see [SAP HANA high-availability guide for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-availability-overview).
