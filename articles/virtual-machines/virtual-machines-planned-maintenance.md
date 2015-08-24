<properties
	pageTitle="Planned maintenance for Azure virtual machines"
	description="Understand what Azure planned maintenance is and how it affects your virtual machines running in Azure."
	services="virtual-machines"
	documentationCenter=""
	authors="kenazk"
	manager="timlt"
	editor=""/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/23/2015"
	ms.author="kenazk"/>


# Planned maintenance for Azure virtual machines

## Why Azure performs planned maintenance
<p> Microsoft Azure periodically performs updates across the globe to improve the reliability, performance, and security of the host infrastructure that underlies virtual machines. Many of these updates are performed without any impact to your virtual machines or Cloud Services, including memory-preserving updates.

However, some updates do require a reboot to your virtual machines to apply the required updates to the infrastructure. The virtual machines are shut down while we patch the infrastructure, and then the virtual machines are restarted.

Please note that there are two types of maintenance that can impact the availability of your virtual machines: planned and unplanned. This page describes how Microsoft Azure performs planned maintenance. For more information about unplanned maintenance, see [Understand planned versus unplanned maintenance](virtual-machines-manage-availability.md).

## Memory-preserving updates
For a class of updates in Microsoft Azure, customers will not see any impact to their running virtual machines. Many of these updates are to components or services that can be updated without interfering with the running instance. Some of these updates are platform infrastructure updates on the host operating system that can be applied without requiring a full reboot of the virtual machines.

These updates are accomplished with technology that enables live migration (a “memory-preserving” update). When updating, the virtual machine is placed into a “paused” state, preserving the memory in RAM, while the underlying host operating system receives the necessary updates and patches. The virtual machine is resumed within 30 seconds of being paused. After resuming, the clock of the virtual machine is automatically synchronized.

Not all updates can be deployed by using this mechanism, but given the short pause period, deploying updates in this way greatly reduces impact to virtual machines.

Multi-instance updates (for virtual machines in an availability set) are applied one update domain at a time.  

## Virtual machine configurations
There are two kinds of virtual machine configurations: multi-instance and single-instance. In a multi-instance configuration, similar virtual machines are placed in an availability set.

The multi-instance configuration provides redundancy, and it is recommended to ensure the availability of your application. All virtual machines in the availability set should be nearly identical and serve the same purpose to your application.

For more information about configuring your virtual machines for high availability, refer to [Manage the Availability of your Virtual Machines](virtual-machines-manage-availability.md).

By contrast, a single-instance configuration is used for standalone virtual machines that are not placed in an availability set. These virtual machines do not qualify for the service level agreement (SLA), which requires that two or more virtual machines are deployed under the same availability set.

For more information about SLAs, refer to the "Cloud Services, Virtual Machines and Virtual Network" section of [Service Level Agreements](http://azure.microsoft.com/support/legal/sla/).


## Multi-instance configuration updates
During planned maintenance, the Azure platform first updates the set of virtual machines that are hosted in a multi-instance configuration. This causes a reboot to these virtual machines.

In a multi-instance configuration update, virtual machines are updated in way that preserves availability throughout the process, assuming that each virtual machine serves a similar function as the others in the set.

Each virtual machine in your availability set is assigned an update domain and a fault domain by the underlying Azure platform. Each update domain is a group of virtual machines that will be rebooted in the same time window. Each fault domain is a group of virtual machines that share a common power source and network switch.

For more information about update domains and fault domains, see [Configure multiple virtual machines in an availability set for redundancy](virtual-machines-manage-availability.md#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy).

To prevent update domains from going offline at the same time, the maintenance is performed by shutting down each virtual machine in an update domain, applying the update to the host machines, restarting the virtual machines, and moving on to the next update domain. The planned maintenance event ends after all update domains have been updated.

The order of the update domains that are being rebooted may not proceed sequentially during planned maintenance, but only one update domain is rebooted at a time. Today, Azure offers 48-hour advanced notification for planned maintenance of virtual machines in the multi-instance configuration.

After a virtual machine is restored, here is an example of what your Windows Event Viewer might display:

<!--Image reference-->
![][image2]

## Single-instance configuration updates
After the multi-instance configuration updates are complete, Azure will perform single-instance configuration updates. This update also causes a reboot to your virtual machines that are not running in availability sets.

Please note that even if you have only one instance running in an availability set, the Azure platform treats it as a multi-instance configuration update.

For virtual machines in a single-instance configuration, virtual machines are updated by shutting down the virtual machines, applying the update to the host machine, and restarting the virtual machines. These updates are run across all virtual machines in a region in a single maintenance window.

This planned maintenance event will impact the availability of your application for this type of virtual machine configuration. Azure offers a 1-week advanced notification for planned maintenance of  virtual machines in the single-instance configuration.

### Email notification
For single-instance and multi-instance virtual machine configurations only, Azure sends email communication in advance to alert you of the upcoming planned maintenance (1-week in advance for single-instance and 48-hours in advance for multi-instance). This email will be sent to the primary email account provided by the subscription. Here is an example of this type of email:

<!--Image reference-->
![][image1]

## Region pairs
Azure organizes a set of region pairs. Azure will not roll out an update on paired regions simultaneously during a planned maintenance of virtual machines with single-instance configurations.

Please refer to the following table for information regarding current region pairs:

Region 1 | Region 2
:----- | ------:
North Central US | South Central US
East US | West US
US East 2 | Central US
North Europe | West Europe
South East Asia | East Asia
East China | North China
Japan East | Japan West
Brazil South | South Central US
Australia Southeast | Australia East
US Gov Iowa | US Gov Virginia

For example, during a planned maintenance, Azure will not roll out an update to West US if East US is under maintenance at the same time. However, other regions such as North Europe can be under maintenance at the same time as East US.

<!--Anchors-->
[image1]: ./media/virtual-machines-planned-maintenance/vmplanned1.png
[image2]: ./media/virtual-machines-planned-maintenance/EventViewerPostReboot.png
[image3]: ./media/virtual-machines-planned-maintenance/RegionPairs.PNG


<!--Link references-->
[Virtual Machines Manage Availability]: virtual-machines-windows-tutorial.md
[Understand planned versus unplanned maintenance]: virtual-machines-manage-availability.md#Understand-planned-versus-unplanned-maintenance/
