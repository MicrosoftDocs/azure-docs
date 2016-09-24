

## Memory-preserving updates

For a class of updates in Microsoft Azure, customers will not see any impact to their running virtual machines. Many of these updates are to components or services that can be updated without interfering with the running instance. Some of these updates are platform infrastructure updates on the host operating system that can be applied without requiring a full reboot of the virtual machines.

These updates are accomplished with technology that enables in-place live migration, also called a “memory-preserving” update. When updating, the virtual machine is placed into a “paused” state, preserving the memory in RAM, while the underlying host operating system receives the necessary updates and patches. The virtual machine is resumed within 30 seconds of being paused. After resuming, the clock of the virtual machine is automatically synchronized.

Not all updates can be deployed by using this mechanism, but given the short pause period, deploying updates in this way greatly reduces impact to virtual machines.

Multi-instance updates (for virtual machines in an availability set) are applied one update domain at a time.  

## Virtual machine configurations

There are two kinds of virtual machine configurations: multi-instance and single-instance. In a multi-instance configuration, similar virtual machines are placed in an availability set.

The multi-instance configuration provides redundancy across physical machines, power, and network, and it is recommended to ensure the availability of your application. All virtual machines in the availability set should serve the same purpose to your application.

For more information about configuring your virtual machines for high availability, refer to [Manage the availability of your Windows virtual machines](../articles/virtual-machines/virtual-machines-windows-manage-availability.md) or [Manage the availability of your Linux virtual machines](../articles/virtual-machines/virtual-machines-linux-manage-availability.md).

By contrast, a single-instance configuration is used for standalone virtual machines that are not placed in an availability set. These virtual machines do not qualify for the service level agreement (SLA), which requires that two or more virtual machines are deployed under the same availability set.

For more information about SLAs, refer to the "Cloud Services, Virtual Machines and Virtual Network" section of [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/).


## Multi-instance configuration updates

During planned maintenance, the Azure platform first updates the set of virtual machines that are hosted in a multi-instance configuration. This causes a reboot to these virtual machines with approximately 15 minutes of downtime.

In a multi-instance configuration update, virtual machines are updated in a way that preserves availability throughout the process, assuming that each virtual machine serves a similar function as the others in the set.

Each virtual machine in your availability set is assigned an update domain and a fault domain by the underlying Azure platform. Each update domain is a group of virtual machines that will be rebooted in the same time window. Each fault domain is a group of virtual machines that share a common power source and network switch.

For more information about update domains and fault domains, see [Configure multiple virtual machines in an availability set for redundancy](../articles/virtual-machines/virtual-machines-windows-manage-availability.md#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy).

To prevent update domains from going offline at the same time, the maintenance is performed by shutting down each virtual machine in an update domain, applying the update to the host machines, restarting the virtual machines, and moving on to the next update domain. The planned maintenance event ends after all update domains have been updated.

The order of the update domains that are being rebooted may not proceed sequentially during planned maintenance, but only one update domain is rebooted at a time. Today, Azure offers 1-week advanced notification for planned maintenance of virtual machines in the multi-instance configuration.

After a virtual machine is restored, here is an example of what your Windows Event Viewer might display:

<!--Image reference-->
![][image2]

Use the viewer to determine which virtual machines are configured in a multi-instance configuration using the Azure portal, Azure PowerShell, or Azure CLI. For example, to determine which virtual machines are in a multi-instance configuration, you can browse the list of virtual machines with the Availability Set column added to the virtual machines browse dialog. In the following example, the Example-VM1 and Example-VM2 virtual machines are in a muilti-instance configuration:

<!--Image reference-->
![][image4]

## Single-instance configuration updates

After the multi-instance configuration updates are complete, Azure will perform single-instance configuration updates. This update also causes a reboot to your virtual machines that are not running in availability sets.

Please note that even if you have only one instance running in an availability set, the Azure platform treats it as a multi-instance configuration update.

For virtual machines in a single-instance configuration, virtual machines are updated by shutting down the virtual machines, applying the update to the host machine, and restarting the virtual machines, approximately 15 minutes of downtime. These updates are run across all virtual machines in a region in a single maintenance window.

This planned maintenance event will impact the availability of your application for this type of virtual machine configuration. Azure offers a 1-week advanced notification for planned maintenance of virtual machines in the single-instance configuration.

## Email notification

For single-instance and multi-instance virtual machine configurations only, Azure sends email communication in advance to alert you of the upcoming planned maintenance (1-week in advance). This email will be sent to the subscription administrator and co-administrator email accounts. Here is an example of this type of email:

<!--Image reference-->
![][image1]

## Region pairs

When executing maintenance, Azure will only update the Virtual Machine instances in a single region of its pair. For example, when updating the Virtual Machines in North Central US, Azure will not update any Virtual Machines in South Central US at the same time. This will be scheduled at a separate time, enabling failover or load balancing between regions. However, other regions such as North Europe can be under maintenance at the same time as East US.

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
India Central | India South
India West | India South
US Gov Iowa | US Gov Virginia

<!--Anchors-->
[image1]: ./media/virtual-machines-common-planned-maintenance/vmplanned1.png
[image2]: ./media/virtual-machines-common-planned-maintenance/EventViewerPostReboot.png
[image3]: ./media/virtual-machines-planned-maintenance/RegionPairs.PNG
[image4]: ./media/virtual-machines-common-planned-maintenance/AvailabilitySetExample.png


<!--Link references-->
[Virtual Machines Manage Availability]: ../articles/virtual-machines/virtual-machines-windows-hero-tutorial.md

[Understand planned versus unplanned maintenance]: ../articles/virtual-machines/virtual-machines-windows-manage-availability.md#Understand-planned-versus-unplanned-maintenance/

