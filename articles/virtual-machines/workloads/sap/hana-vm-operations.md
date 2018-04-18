---
title: SAP HANA operations on Azure | Microsoft Docs
description: Operations guide for SAP HANA systems that are deployed on Azure virtual machines.
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: juergent
manager: patfilot
editor: ''
tags: azure-resource-manager
keywords: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/13/2017
ms.author: msjuergent
ms.custom: H1Hack27Feb2017

---

# SAP HANA on Azure operations guide
This document provides guidance for operating SAP HANA systems that are deployed on Azure native virtual machines (VMs). This document is not intended to replace the standard SAP documentation, which includes the following content:

- [SAP administration guide](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.02/en-US/330e5550b09d4f0f8b6cceb14a64cd22.html)
- [SAP installation guides](https://service.sap.com/instguides)
- [SAP notes](https://sservice.sap.com/notes)

## Prerequisites
To use this guide, you need basic knowledge of the following Azure components:

- [Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-manage-vm)
- [Azure networking and virtual networks](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-virtual-network)
- [Azure Storage](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-manage-disks)

To learn more about SAP NetWeaver and other SAP components on Azure, see the [SAP on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/get-started) section of the [Azure documentation](https://docs.microsoft.com/azure/).

## Basic setup considerations
The following sections describe basic setup considerations for deploying SAP HANA systems on Azure VMs.

### Connect into Azure virtual machines
As documented in the [Azure virtual machines planning guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide), there are two basic methods for connecting into Azure VMs:

- Connect through the internet and public endpoints on a Jump VM or on the VM that is running SAP HANA.
- Connect through a [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal) or Azure [ExpressRoute](https://azure.microsoft.com/services/expressroute/).

Site-to-site connectivity via VPN or ExpressRoute is necessary for production scenarios. This type of connection is also needed for non-production scenarios that feed into production scenarios where SAP software is being used. The following image shows an example of cross-site connectivity:

![Cross-site connectivity](media/virtual-machines-shared-sap-planning-guide/300-vpn-s2s.png)


### Choose Azure VM types
The Azure VM types that can be used for production scenarios are listed in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html). For non-production scenarios, a wider variety of native Azure VM types is available.

>[!NOTE]
> For non-production scenarios, use the VM types that are listed in the [SAP note #1928533](https://launchpad.support.sap.com/#/notes/1928533). For the usage of Azure VMs for production scenarios, check for SAP HANA certified VMs in the SAP published [Certified IaaS Platforms list](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html).

Deploy the VMs in Azure by using:

- The Azure portal.
- Azure PowerShell cmdlets.
- The Azure CLI.

You also can deploy a complete installed SAP HANA platform on the Azure VM services through the [SAP Cloud platform](https://cal.sap.com/). The installation process is described in [Deploy SAP S/4HANA or BW/4HANA on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/cal-s4h) or with the automation released [here](https://github.com/AzureCAT-GSI/SAP-HANA-ARM).

### Choose Azure Storage type
Azure provides two types of storage that are suitable for Azure VMs that are running SAP HANA:

- [Azure Standard Storage](https://docs.microsoft.com/azure/virtual-machines/windows/standard-storage)
- [Azure Premium Storage](https://docs.microsoft.com/azure/virtual-machines/windows/premium-storage)

Azure offers two deployment methods for VHDs on Azure Standard and Premium Storage. If the overall scenario permits, take advantage of [Azure managed disk](https://azure.microsoft.com/services/managed-disks/) deployments.

For a list of storage types and their SLAs in IOPS and storage throughput, review the [Azure documentation for managed disks](https://azure.microsoft.com/pricing/details/managed-disks/).

### Configuring the Storage for Azure virtual machines

So far as you bought SAP HANA appliances for on-premise, you never had to care about the I/O subsystems and its capabilities because the appliance vendor needs to make sure that the minimum storage requirements are met for SAP HANA. As you build the Azure infrastructure yourself, you also should be aware of some of those requirements to also understand the configuration requirements we suggest in the following sections. Or for cases where you are configuring the Virtual Machines you want run SAP HANA on. Some of the characteristics that are asked are resulting in the need to:

- Enable read/write volume on /hana/log of a 250MB/sec at minimum with 1MB I/O sizes
- Enable read activity of at least 400MB/sec for /hana/data for 16MB and 64MB I/O sizes
- Enable write activity of at least 250MB/sec for /hana/data with 16MB and 64MB I/O sizes

Given that low storage latency is critical for DBMS systems, even as those, like SAP HANA, keep data in-memory. The critical path in storage is usually around the transaction log writes of the DBMS systems. But also operations like writing savepoints or loading data in-memory after crash recovery can be critical. Therefore, it is mandatory to leverage Azure Premium Disks for /hana/data and /hana/log volumes. In order to achieve the minimum throughput of /hana/log and /hana/data as desired by SAP, you need to build a RAID 0 using MDADM or LVM over multiple Azure Premium Storage disks and use the RAID volumes as /hana/data and /hana/log volumes. As stripe sizes for the RAID 0 the recommendation is to use:

- 64K or 128K for /hana/data
- 32K for /hana/log

> [!NOTE]
> You don't need to configure any redundancy level using RAID volumes since Azure Premium and Standard storage keep three images of a VHD. The usage of a RAID volume is purely to configure volumes that provide sufficient I/O throughput.

Accumulating a number of Azure VHDs underneath a RAID, is accumulative from an IOPS and storage throughput side. So, if you put a RAID 0  over 3 x P30 Azure Premium Storage disks, it should give you three times the IOPS and three times the storage throughput of a single Azure Premium Storage P30 disk.

Don't configure Premium Storage caching on the disks used for /hana/data and /hana/log. All the disks building those volumes should have caching of those disks set to 'None'.

Also keep the overall VM I/O throughput in mind when sizing or deciding for a VM. Overall VM storage throughput is documented in the article [Memory optimized virtual machine sizes](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-memory).

#### Cost conscious Azure Storage configuration
The following table shows a configuration of VM types that customers commonly use to host SAP HANA on Azure VMs. There might be some VM types that might not meet all minimum criteria for SAP HANA. But so far those VMs seemed to perform fine for non-production scenarios. 

> [!NOTE]
> For production scenarios, check whether a certain VM type is supported for SAP HANA by SAP in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html).



| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data and /hana/log<br /> striped with LVM or MDADM | /hana/shared | /root volume | /usr/sap | hana/backup |
| --- | --- | --- | --- | --- | --- | --- | -- |
| DS14v2 | 128 GiB | 768 MB/s | 3 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S15 |
| E16v3 | 128 GiB | 384 MB/s | 3 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S15 |
| E32v3 | 256 GiB | 768 MB/s | 3 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S20 |
| E64v3 | 443 GiB | 1200 MB/s | 3 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S30 |
| GS5 | 448 GiB | 2000 MB/s | 3 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S30 |
| M64s | 1000 GiB | 1000 MB/s | 2 x P30 | 1 x S30 | 1 x S6 | 1 x S6 |2 x S30 |
| M64ms | 1750 GiB | 1000 MB/s | 3 x P30 | 1 x S30 | 1 x S6 | 1 x S6 | 3 x S30 |
| M128s | 2000 GiB | 2000 MB/s |3 x P30 | 1 x S30 | 1 x S6 | 1 x S6 | 2 x S40 |
| M128ms | 3800 GiB | 2000 MB/s | 5 x P30 | 1 x S30 | 1 x S6 | 1 x S6 | 2 x S50 |


The disks recommended for the smaller VM types with 3 x P20 oversize the volumes regarding the space recommendations according to the [SAP TDI Storage Whitepaper](https://www.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html). However the choice as displayed in the table was made to provide sufficient disk throughput for SAP HANA. If you need changes to the /hana/backup volume, which was sized for keeping backups that represent twice the memory volume, feel free to adjust.   
Check whether the storage throughput for the different suggested volumes will meet the workload that you want to run. If the workload requires higher volumes for /hana/data and /hana/log, you need to increase the number of Azure Premium Storage VHDs. Sizing a volume with more VHDs than listed will increase the IOPS and I/O throughput within the limits of the Azure virtual machine type. 

> [!NOTE]
> The configurations above would NOT benefit from [Azure virtual machine single VM SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_6/) since it does use a mixture of Azure Premium Storage and Azure Standard Storage. However, the selection was chosen in order to optimize costs.


#### Azure Storage configuration to benefit for meeting single VM SLA
If you want to benefit from [Azure virtual machine single VM SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_6/), you need to use Azure Premium Storage VHDs exclusively.

> [!NOTE]
> For production scenarios, check whether a certain VM type is supported for SAP HANA by SAP in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html).

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data and /hana/log<br /> striped with LVM or MDADM | /hana/shared | /root volume | /usr/sap | hana/backup |
| --- | --- | --- | --- | --- | --- | --- | -- |
| DS14v2 | 128 GiB | 768 MB/s | 3 x P20 | 1 x P20 | 1 x P6 | 1 x P6 | 1 x P15 |
| E16v3 | 128 GiB | 384 MB/s | 3 x P20 | 1 x P20 | 1 x P6 | 1 x P6 | 1 x P15 |
| E32v3 | 256 GiB | 768 MB/s | 3 x P20 | 1 x P20 | 1 x P6 | 1 x P6 | 1 x P20 |
| E64v3 | 443 GiB | 1200 MB/s | 3 x P20 | 1 x P20 | 1 x P6 | 1 x P6 | 1 x P30 |
| GS5 | 448 GiB | 2000 MB/s | 3 x P20 | 1 x P20 | 1 x P6 | 1 x P6 | 1 x P30 |
| M64s | 1000 GiB | 1000 MB/s | 2 x P30 | 1 x P30 | 1 x P6 | 1 x P6 |2 x P30 |
| M64ms | 1750 GiB | 1000 MB/s | 3 x P30 | 1 x P30 | 1 x P6 | 1 x P6 | 3 x P30 |
| M128s | 2000 GiB | 2000 MB/s |3 x P30 | 1 x P30 | 1 x P6 | 1 x P6 | 2 x P40 |
| M128ms | 3800 GiB | 2000 MB/s | 5 x P30 | 1 x P30 | 1 x P6 | 1 x P6 | 2 x P50 |


The disks recommended for the smaller VM types with 3 x P20 oversize the volumes regarding the space recommendations according to the [SAP TDI Storage Whitepaper](https://www.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html). However the choice as displayed in the table was made to provide sufficient disk throughput for SAP HANA. If you need changes to the /hana/backup volume, which was sized for keeping backups that represent twice the memory volume, feel free to adjust.  
Check whether the storage throughput for the different suggested volumes will meet the workload that you want to run. If the workload requires higher volumes for /hana/data and /hana/log, you need to increase the number of Azure Premium Storage VHDs. Sizing a volume with more VHDs than listed will increase the IOPS and I/O throughput within the limits of the Azure virtual machine type. 



#### Storage solution with Azure Write Accelerator for Azure M-Series virtual machines
Azure Write Accelerator is a functionality that is getting rolled out for M-Series VMs exclusively. As the name states, the purpose of the functionality is to improve I/O latency of Writes against the Azure Premium Storage. For SAP HANA, Write Accelerator is supposed to be used against the /hana/log volume only. Therefore the configurations shown so far need to be changed. The main change is the breakup between the /hana/data and /hana/log in order to use Azure Write Accelerator against the /hana/log volume only. 

> [!IMPORTANT]
> SAP HANA certification for Azure M-Series virtual machines is exclusively with Azure Write Accelerator for the /hana/log volume. As a result, production scenario SAP HANA deployments on Azure M-Series virtual machines are expected to be configured with Azure Write Accelerator for the /hana/log volume.  

> [!NOTE]
> For production scenarios, check whether a certain VM type is supported for SAP HANA by SAP in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html).

The recommended configurations look like:

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data | /hana/log | /hana/shared | /root volume | /usr/sap | hana/backup |
| --- | --- | --- | --- | --- | --- | --- | --- | -- |
| M64s | 1000 GiB | 1000 MB/s | 4 x P20 | 2 x P20 | 1 x P30 | 1 x P6 | 1 x P6 |2 x P30 |
| M64ms | 1750 GiB | 1000 MB/s | 3 x P30 | 2 x P20 | 1 x P30 | 1 x P6 | 1 x P6 | 3 x P30 |
| M128s | 2000 GiB | 2000 MB/s |3 x P30 | 2 x P20 | 1 x P30 | 1 x P6 | 1 x P6 | 2 x P40 |
| M128ms | 3800 GiB | 2000 MB/s | 5 x P30 | 2 x P20 | 1 x P30 | 1 x P6 | 1 x P6 | 2 x P50 |

Check whether the storage throughput for the different suggested volumes will meet the workload that you want to run. If the workload requires higher volumes for /hana/data and /hana/log, you need to increase the number of Azure Premium Storage VHDs. Sizing a volume with more VHDs than listed will increase the IOPS and I/O throughput within the limits of the Azure virtual machine type.

Azure Write Accelerator only works in conjunction with [Azure managed disks](https://azure.microsoft.com/services/managed-disks/). So at least the Azure Premium Storage disks forming the /hana/log volume need to be deployed as managed disks.

There are limits of Azure Premium Storage VHDs per VM that can be supported by Azure Write Accelerator. The current limits are:

- 16 VHDs for an M128xx VM
- 8 VHDs for an M64xx VM

More detailed instructions on how to enable Azure Write Accelerator can be found in the article [Azure Write Accelerator for SAP deployments](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/how-to-enable-write-accelerator).

Details and restrictions for Azure Write Accelerator can be found in the same documentation.


### Set up Azure virtual networks
When you have site-to-site connectivity into Azure via VPN or ExpressRoute, you must have at least one [Azure virtual network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) that is connected through a Virtual Gateway to the VPN or ExpressRoute circuit. The Virtual Gateway lives in a subnet in the Azure virtual network. To install SAP HANA, you create two additional subnets within the virtual network. One subnet hosts the VMs to run the SAP HANA instances. The other subnet runs Jumpbox or Management VMs to host SAP HANA Studio or other management software.

When you install the VMs to run SAP HANA, the VMs need:

- Two virtual NICs installed: one NIC to connect to the management subnet, and one NIC to connect from the on-premises network or other networks, to the SAP HANA instance in the Azure VM.
- Static private IP addresses that are deployed for both virtual NICs.

For an overview of the different methods for assigning IP addresses, see [IP address types and allocation methods in Azure](https://docs.microsoft.com/azure/virtual-network/virtual-network-ip-addresses-overview-arm). 

For VMs running SAP HANA, you should work with static IP addresses assigned. Reason is that some configuration attributes for HANA reference IP addresses.

[Azure Network Security Groups (NSGs)](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) are used to direct traffic that's routed to the SAP HANA instance or the Jumpbox. The NSGs are associated to the SAP HANA subnet and the Management subnet.

The following image shows an overview of a rough deployment schema for SAP HANA:

![Rough deployment schema for SAP HANA](media/hana-vm-operations/hana-simple-networking.PNG)


To deploy SAP HANA in Azure without a site-to-site connection, access the SAP HANA instance though a public IP address. The IP address must be assigned to the Azure VM that's running your Jumpbox VM. In this basic scenario, the deployment relies on Azure built-in DNS services to resolve hostnames. In a more complex deployment where public-facing IP addresses are used, Azure built-in DNS services are especially important. Use Azure NSGs to limit the open ports or IP address ranges that can connect into the Azure subnets with assets that have public-facing IP addresses. The following image shows a rough schema for deploying SAP HANA without a site-to-site connection:
  
![Rough deployment schema for SAP HANA without a site-to-site connection](media/hana-vm-operations/hana-simple-networking2.PNG)
 


## Operations for deploying SAP HANA on Azure VMs
The following sections describe some of the operations related to deploying SAP HANA systems on Azure VMs.

### Back up and restore operations on Azure VMs
The following documents describe how to back up and restore your SAP HANA deployment:

- [SAP HANA backup overview](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-guide)
- [SAP HANA file-level backup](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-file-level)
- [SAP HANA storage snapshot benchmark](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-storage-snapshots)


### Start and restart VMs that contain SAP HANA
A prominent feature of the Azure public cloud is that you're charged only for your computing minutes. For example, when you shut down a VM that is running SAP HANA, you're billed only for the storage costs during that time. Another feature is available when you specify static IP addresses for your VMs in your initial deployment. When you restart a VM that has SAP HANA, the VM restarts with its prior IP addresses. 


### Use SAProuter for SAP remote support
If you have a site-to-site connection between your on-premises locations and Azure, and you're running SAP components, then you're probably already running SAProuter. In this case, complete the following items for remote support:

- Maintain the private and static IP address of the VM that hosts SAP HANA in the SAProuter configuration.
- Configure the NSG of the subnet that hosts the HANA VM to allow traffic through TCP/IP port 3299.

If you're connecting to Azure through the internet, and you don't have an SAP router for the VM with SAP HANA, then you need to install the component. Install SAProuter in a separate VM in the Management subnet. The following image shows a rough schema for deploying SAP HANA without a site-to-site connection and with SAProuter:

![Rough deployment schema for SAP HANA without a site-to-site connection and SAProuter](media/hana-vm-operations/hana-simple-networking3.PNG)

Be sure to install SAProuter in a separate VM and not in your Jumpbox VM. The separate VM must have a static IP address. To connect your SAProuter to the SAProuter that is hosted by SAP, contact SAP for an IP address. (The SAProuter that is hosted by SAP is the counterpart of the SAProuter instance that you install on your VM.) Use the IP address from SAP to configure your SAProuter instance. In the configuration settings, the only necessary port is TCP port 3299.

For more information on how to set up and maintain remote support connections through SAProuter, see the [SAP documentation](https://support.sap.com/en/tools/connectivity-tools/remote-support.html).

### High-availability with SAP HANA on Azure native VMs
If you're running SUSE Linux 12 SP1 or later, you can establish a Pacemaker cluster with STONITH devices. You can use the devices to set up an SAP HANA configuration that uses synchronous replication with HANA System Replication and automatic failover. For more information about the setup procedure, see [SAP HANA High Availability guide for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-availability-overview).
