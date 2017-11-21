---
title: SAP HANA Operations on Azure | Microsoft Docs
description: Operations of SAP HANA on Azure native VMs
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
ms.date: 11/17/2017
ms.author: msjuergent
ms.custom: H1Hack27Feb2017

---

# SAP HANA on Azure Operations Guide
This guide provides guidance for operating SAP HANA systems that have been deployed on Azure Virtual Machines. This document is not intended to replace any of the standard SAP documentations. SAP guides and notes can be found at the following locations:

- [SAP Administration Guide](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.02/en-US/330e5550b09d4f0f8b6cceb14a64cd22.html)
- [SAP Installation Guides](https://service.sap.com/instguides)
- [SAP Note](https://sservice.sap.com/notes)

Prerequisite is that you have basic knowledge on the different Azure components of:

- [Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-manage-vm)
- [Azure Networking and VNets](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-virtual-network)
- [Azure Storage](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-manage-disks)

Additional documentation on SAP NetWeaver and other SAP components on Azure can be found in the [SAP on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/get-started) section of the [Azure documentation](https://docs.microsoft.com/azure/).

## Basic Setup Considerations
### Connecting into Azure
As documented in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide], there are two basic methods to connect into Azure Virtual Machines. 

- Connecting through Internet and public endpoints on a Jump VM or the VM running SAP HANA
- Connecting through a [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal) or Azure [ExpressRoute](https://azure.microsoft.com/services/expressroute/)

For production scenarios or scenarios where non-production scenarios that feed into production scenarios in conjunction with SAP software, you need to have a site-to-site connectivity via VPN or ExpressRoute as shown in this graphic:

![Cross-site connectivity](media/virtual-machines-shared-sap-planning-guide/300-vpn-s2s.png)


### Choice of Azure VM types
Azure VM types that can be used for production scenarios can be looked up [here](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html). For non-production scenarios, you can choose a wider variety of native Azure VMs. You should however restrict yourself to the VM types that are [SAP Note #1928533](https://launchpad.support.sap.com/#/notes/1928533). Deployment of those VMs in Azure can be accomplished through:

- Azure portal
- Azure Powershell Cmdlets
- Azure CLI

You also can deploy complete installed SAP HANA platform onto the Azure Virtual machine services through [SAP Cloud platform](https://cal.sap.com/) as documented [here](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/cal-s4h).

### Choice of Azure Storage
Azure provides two main storage types suitable for Azure VMs running SAP HANA

- [Azure Standard Storage](https://docs.microsoft.com/azure/virtual-machines/windows/standard-storage)
- [Azure Premium Storage](https://docs.microsoft.com/azure/virtual-machines/windows/premium-storage)

Azure offers two deployment methods for VHDs on Azure Standard and Premium Storage. If the overall scenario permits, it is recommended to leverage [Azure Managed Disk](https://azure.microsoft.com/services/managed-disks/) deployments.

For the exact storage types and SLAs around those storage types, check [this documentation](https://azure.microsoft.com/pricing/details/managed-disks/)

It is recommended to use Azure Premium Disks for /hana/data and /hana/log volumes. It is supported to build an LVM RAID over multiple Premium Storage disks and use those RAID volumes as /hana/data and /hana/log volumes.

A possible configuration for different common VM types that customers so far use for hosting SAP HANA on Azure VMs could look like:

| VM SKU | RAM | /hana/data and /hana/log<br /> striped with LVM or MDADM | /hana/shared | /root volume | /usr/sap | hana/backup |
| --- | --- | --- | --- | --- | --- | -- |
| E16v3 | 128GB | 2 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S10 |
| E32v3 | 256GB | 2 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S20 |
| E64v3 | 443GB | 2 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S30 |
| GS5 | 448 GB | 2 x P20 | 1 x S20 | 1 x S6 | 1 x S6 | 1 x S30 |
| M64s | 1TB | 2 x P30 | 1 x S30 | 1 x S6 | 1 x S6 |2 x S30 |
| M64ms | 1.7TB | 3 x P30 | 1 x S30 | 1 x S6 | 1 x S6 | 3 x S30 |
| M128s | 2TB | 3 x P30 | 1 x S30 | 1 x S6 | 1 x S6 | 3 x S30 |
| M128ms | 3.8TB | 5 x P30 | 1 x S30 | 1 x S6 | 1 x S6 | 5 x S30 |


### Azure Networking
Assuming that you have a VPN or ExpressRoute site-to-site connectivity into Azure, you at minimum would have one [Azure VNet](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) that is connected through a Virtual Gateway to the VPN or ExpressRoute circuit. The Virtual Gateway lives in a subnet in the Azure Vnet. In order to install HANA, you would create another two subnets within the VNet. One subnet that hosts the VM(s) that run the SAP HANA instance(s) and another subnet that runs eventual Jumpbox or Management VM(s) that can host SAP HANA Studio or other management software.
When you install the VMs that should run HANA, the VMs should have:

- Two virtual NICs installed of which one connects to the management subnet and one NIC is used to connect from either on premise or other networks to the SAP HANA instance in the Azure VM.
- Static private IP addresses deployed for both vNICs

An overview of the different possibilities of IP address assignment can be found [here](https://docs.microsoft.com/azure/virtual-network/virtual-network-ip-addresses-overview-arm). 

The traffic routing to either directly to the SAP HANA instance or to the jumpbox is directed by [Azure Network Security Groups](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-nsg) that are associated to the HANA subnet and the Management subnet.

Overall the rough deployment schema would look like:

![Rough deployment schema for SAP HANA](media/hana-vm-operations/hana-simple-networking.PNG)


If you just deploy SAP HANA in Azure without having a site-to-site (VPN or ExpressRoute into Azure), you would access the SAP HANA instance though a public IP address that is assigned to the Azure VM that runs your Jumpbox VM. In the simple case, you also rely on the Azure built-in DNS services in order to resolve hostnames. Especially when using public facing IP addresses, you want to use Azure Network Security Groups to limit the open ports or IP address ranges that are allowed to connect into the Azure subnets running assets with public facing IP addresses. The schema of such a deployment could look like:
  
![Rough deployment schema for SAP HANA without site-to-site connection](media/hana-vm-operations/hana-simple-networking2.PNG)
 


## Operations
### Backup and Restore operations on Azure VMs
The possibilities of SAP HANA Backup and Restore are documented in these documents:

- [SAP HANA Backup overview](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-guide)
- [SAP HANA file level backup](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-file-level)
- [SAP HANA Storage snapshot benchmark](https://docs.microsoft.com/en-us/azure/virtual-machines/workloads/sap/sap-hana-backup-storage-snapshots)



### Start and Restart of VMs containing SAP HANA
One of the strengths of Azure public cloud is the fact that you are only charged for the compute minutes you are spending. That means if you shut down a VM with SAP HANA running in it, only the costs for storage are billed during that time. As you start the VM with SAP HANA in it again, the VM is going to start up again and is going to have the same IP addresses (if you deployed with static IP addresses). 


### SAP Router 
If you have a site-to-site connection between your on-premise location(s) and Azure and you run SAP components already, it is highly likely that you already run SAProuter already. In this case, there is nothing you need to do with SAP HANA instances you deploy in Azure. Except to maintain the private and static IP address of the VM that hosts HANA in the SAPRouter configuration and have the NSG of the subnet hosting the HANA VM adapted (traffic through port TCP/IP port 3299 allowed).

If you are deploying SAP HANA and you connect to Azure through the Internet and you don't have an SAP Router installed in the Vnet that runs a VM with SAP HANA, you should install the SAPRouter in a separate VM in the Management subnet as shown here:


![Rough deployment schema for SAP HANA without site-to-site connection and SAPRouter](media/hana-vm-operations/hana-simple-networking3.PNG)

You should install SAPRouter in a separate VM and not in your Jumpbox VM. The separate VM needs a static IP address. In order to connect SAPRouter to the SAPRouter that SAP hosts (counterpart of the SAPRouter instance you install VM), you need to contact SAP to get an IP address from SAP that you need to configure your SAPRouter instance. The only port necessary is TCP port 3299.
For more information on how to setup and maintain Remote Support connections through SAPRouter, check this [SAP source](https://support.sap.com/en/tools/connectivity-tools/remote-support.html).

### High-Availability with SAP HANA on Azure native VMs
Running SUSE Linux 12 SP1 and more recent you can establish a Pacemaker cluster with STONITH devices to set up an SAP HANA configuration that uses synchronous replication with HANA System Replication and automatic failover. The procedure of setup is described in the article [High Availability of SAP HANA on Azure Virtual Machines](https://docs.microsoft.com/en-us/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

 










