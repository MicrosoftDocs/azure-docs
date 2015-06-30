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
	ms.date="06/29/2015" 
	ms.author="kenazk"/>


# Planned maintenance for Azure virtual machines

## Why Azure performs planned maintenance
<p> Microsoft Azure periodically performs updates across the globe in order to improve the reliability, performance, and security of the host infrastructure that underlies Virtual Machines. Many of these updates are performed without any impact to Virtual Machines or Cloud Services, including Memory-Preserving Updates. However, some updates do require a reboot to your virtual machine to apply the required updates to the infrastructure.  The virtual machine will be shut down while we patch the infrastructure and then the virtual machines will be restarted. Please note that there are two kinds of maintenance can impact the availability of your virtual machine: planned and unplanned. This page describes how Microsoft Azure performs planned maintenance. For more information about unplanned maintenance, see [Understand planned versus unplanned maintenance].

## Memory-Preserving Updates
For a class of updates in Microsoft Azure, customers will not see any impact to their running Virtual Machines. Many of these updates are to components or services that can be updated without interfering with the running instance. Some of these updates are platform infrastructure updates on the host operating system that can be applied without requiring a full reboot of the Virtual Machine. These updates are accomplished with technology developed in the Azure team enabling Live Migration in place, or a “Memory-Preserving” update. When updating, the Virtual Machine is placed into a “paused” state, preserving the memory in RAM, while the underlying host operating system receives the necessary update and patches. The Virtual Machine is then resumed with a 30 second, or less, period of being paused. After resuming, the clock of the Virtual Machine will automatically be synchronized. 

Not all updates can be deployed using this mechanism but given the short pause period, deploying updates in this way greatly reduces impact to Virtual Machines. For Multi-instance Virtual Machines (in an availability set), these updates are applied one Update Domain (UD) at a time.  

## Virtual Machine Configurations
There are two kinds of Virtual Machine configurations: multi-instance and single-instance.  Multi-instance virtual machines are configured by placing identical virtual machines into an Availability Set. The Multi-Instance configuration provides redundancy and is recommended to ensure the availability of your application. All virtual machines in the Availability Set should be nearly identical and serve the same purpose to your application. For more information on configuring your virtual machines for high availability, refer to “<a href="http://azure.microsoft.com/documentation/articles/virtual-machines-manage-availability/">Manage the Availability of your Virtual Machines</a>”. 

By contrast, single-instance virtual machines are standalone virtual machines that are not placed into an Availability Set. By themselves, single-instance virtual machines do not qualify for the Service Level Agreement (SLA) which requires two or more virtual machines deployed under the same Availability Set. For more information on SLA, refer to the "Cloud Services, Virtual Machines and Virtual Network" section of [Service Level Agreements](http://azure.microsoft.com/support/legal/sla/).


## Multi-Instance Update
During planned maintenance, the Azure platform will first update the set of host machines that are hosting the set of virtual machines in a multi-instance configuration, causing a reboot to these virtual machines. For virtual machines in a multi-instance configuration, virtual machines are updated in way that preserves availability throughout the process, assuming each machine serves a similar function as the others in the set. Each virtual machine in your Availability Set is assigned an Update Domain (UD) and a Fault Domain (FD) by the underlying Azure platform. Each UD is a group of virtual machines that will be rebooted in the same time window. Each FD is a group of virtual machines that share a common power source and network switch. 

For more information on UDs and FDs, see “<a href="http://azure.microsoft.com/documentation/articles/virtual-machines-manage-availability/#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy">Configure multiple virtual machines in an Availability Set for redundancy</a>”.

Microsoft Azure guarantees that no planned maintenance event will cause virtual machines from two different UDs to go offline at the same time. The maintenance is performed by shutting down each virtual machine, applying the update to the host machines, restarting the virtual machine, and moving on to the next UD. The planned maintenance event ends once all UDs have been updated. The order of UDs being rebooted may not proceed sequentially during planned maintenance but only one UD will be rebooted at a time. Today, Azure offers 48-hour advanced notification for planned maintenance of Virtual Machines in the multi-instance configuration.

After the Virtual Machine has been restored, here is an example of what your Windows Event Viewer may display:

<!--Image reference-->
![][image2]

## Single-Instance Update
Once multi-instance updates are completed, Azure will then perform the update on the set of host machines that are hosting Single-Instance virtual machines. This update will also cause a reboot to your virtual machines that are not running in availability sets. Please note, even if you only have one instance running in an availability set, the Azure platform will still treat it as multi-instance. For virtual machines in a single-instance configuration, virtual machines are updated by shutting down the virtual machines, applying the update to the host machine, and restarting the virtual machine. These updates are executed across all virtual machines in a region in a single maintenance window. This planned maintenance event will impact the availability of your application for this type of virtual machine configuration. Azure offers a 1-week advanced notification for planned maintenance of  virtual machines in the single-instance configuration.
 
### Email Notification
For single-instance and multi-instance Virtual Machines only, Azure send email communication in advance in order to alert you of the upcoming planned maintenance (1-week in advance for single-instance and 48-hours in advance for multi-instance). This email will be sent to the primary email account provided by the subscription. An example of this type of email is shown below:

<!--Image reference-->
![][image1]

## Region Pairs
Azure organizes a set of region pairs and guarantees that for single-instance updates,only one region of the pair will undergo planned maintenance. Azure will not rollout an update on paired regions simultaneously during a planned maintenance of single-instance Virtual Machines. Please refer to the table below for information regarding current region pairs:

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

For example, during a planned maintenance rollout, Azure will not rollout an update to West US if East US is under maintenance at the same time. However, other regions such as North Europe can be under maintenance at the same time as East US.

<!--Anchors-->
[image1]: ./media/virtual-machines-planned-maintenance/vmplanned1.png
[image2]: ./media/virtual-machines-planned-maintenance/EventViewerPostReboot.png
[image3]: ./media/virtual-machines-planned-maintenance/RegionPairs.PNG


<!--Link references-->
[Virtual Machines Manage Availability]: virtual-machines-windows-tutorial.md
[Understand planned versus unplanned maintenance]: virtual-machines-manage-availability.md#Understand-planned-versus-unplanned-maintenance/ 
 
