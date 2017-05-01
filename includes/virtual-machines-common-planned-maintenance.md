

## Memory-preserving updates
For a class of updates in Microsoft Azure, customers do not see any impact to their running virtual machines. Many of these updates are to components or services that can be updated without interfering with the running instance. Some of these updates are platform infrastructure updates on the host operating system that can be applied without requiring a full reboot of the virtual machines.

These updates are accomplished with technology that enables in-place live migration, also called a “memory-preserving” update. When updating, the virtual machine is placed into a “paused” state, preserving the memory in RAM, while the underlying host operating system receives the necessary updates and patches. The virtual machine is resumed within 30 seconds of being paused. After resuming, the clock of the virtual machine is automatically synchronized.

Not all updates can be deployed by using this mechanism, but given the short pause period, deploying updates in this way greatly reduces impact to virtual machines.

Multi-instance updates (for virtual machines in an availability set) are applied one update domain at a time.  

## Virtual machine configurations
There are two kinds of virtual machine configurations: multi-instance and single-instance. In a multi-instance configuration, similar virtual machines are placed in an availability set.

The multi-instance configuration provides redundancy across physical machines, power, and network, and it is recommended to ensure the availability of your application. All virtual machines in the availability set should serve the same purpose to your application.

For more information about configuring your virtual machines for high availability, see [Manage the availability of your Windows virtual machines](../articles/virtual-machines/windows/manage-availability.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) or [Manage the availability of your Linux virtual machines](../articles/virtual-machines/linux/manage-availability.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

By contrast, a single-instance configuration is used for standalone virtual machines that are not placed in an availability set. These virtual machines do not qualify for the service level agreement (SLA) that requires deploying two or more virtual machines in the same availability set.

For more information about SLAs, see the "Cloud Services and Virtual Machines" sections of [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/).

## Multi-instance configuration updates
During planned maintenance, the Azure platform first updates the set of virtual machines that are hosted in a multi-instance configuration. The update causes a reboot to these virtual machines with approximately 15 minutes of downtime.

A multi-instance configuration update assumes that each virtual machine serves a similar function as the others in the availability set. In this setting, virtual machines are updated in a way that preserves availability throughout the process.

Each virtual machine in an availability set is assigned an update domain and a fault domain by the underlying Azure platform. Each update domain is a group of virtual machines that will be rebooted in the same time window. Each fault domain is a group of virtual machines that share a common power source and network switch.


For more information about update domains and fault domains, see [Configure multiple virtual machines in an availability set for redundancy](../articles/virtual-machines/windows/manage-availability.md#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy).

To maintain availability through an update, Azure performs the maintenance by update domain, updating one domain at a time. The maintenance in an update domain consists of shutting down each virtual machine in the domain, applying the update to the host machines, and then restarting the virtual machines. When the maintenance in the domain completes, Azure repeats the process with the next update domain, and continues with each domain until all are updated.

The order of the update domains that are being rebooted may not proceed sequentially during planned maintenance, but only one update domain is rebooted at a time. Today, Azure offers 1-week advanced notification for planned maintenance of virtual machines in the multi-instance configuration.

After a virtual machine is restored, here is an example of what your Windows Event Viewer might display:

<!--Image reference-->
![][image2]


Use the viewer to report the virtual machines that are configured in a multi-instance configuration using the Azure portal, Azure PowerShell, or Azure CLI. For example, using the Azure portal, you can add the _Availability Set_ to the **virtual machines (classic)** browse dialog. The virtual machines that report the same availability set are part of a multi-instance configuration. In the following example, the multi-instance configuration consists of virtual machines SQLContoso01 and SQLContoso02.

<!--Image reference-->
  ![Virtual machines (classic) view from the Azure portal][image4]

## Single-instance configuration updates
After the multi-instance configuration updates are complete, Azure performs single-instance configuration updates. These updates also cause reboots to your virtual machines that are not running in availability sets.

> [!NOTE]
> If an availability set has only one virtual machine instance running, the Azure platform treats it as a multi-instance configuration update.
>

Maintenance in a single-instance configuration consists of shutting down each virtual machine running on a host machine, updating the host machine, and then restarting the virtual machines. The maintenance requires approximately 15 minutes of downtime. The planned maintenance event runs across all virtual machines in a region in a single maintenance window.


Planned maintenance events impact the availability of your application for single-instance configurations. Azure offers a one-week advanced notification for planned maintenance of virtual machines in single-instance configurations.

## Email notification
For single-instance and multi-instance virtual machine configurations only, Azure sends an email alert of the upcoming planned maintenance (one week in advance). This email is sent to the subscription administrator and co-administrator email accounts. Here is an example of this type of email:

<!--Image reference-->
![][image1]

## Region pairs

When executing maintenance, Azure only updates the Virtual Machine instances in a single region of its pair. For example, when updating the Virtual Machines in North Central US, Azure will not update any Virtual Machines in South Central US at the same time. This will be scheduled at a separate time, enabling failover or load balancing between regions. However, other regions such as North Europe can be under maintenance at the same time as East US.

See the following table for current region pairs:

| Region 1 | Region 2 |
|:--- | ---:|
| East US |West US |
| East US 2 |Central US |
| North Central US |South Central US |
| West Central US |West US 2 |
| Canada East |Canada Central |
| Brazil South |South Central US |
| US Gov Iowa |US Gov Virginia |
| US DoD East |US DoD Central |
| North Europe |West Europe |
| UK West |UK South |
| Germany Central |Germany Northeast |
| South East Asia |East Asia |
| Australia Southeast |Australia East |
| India Central |India South |
| India West |India South |
| Japan East |Japan West |
| Korea Central |Korea South |
| East China |North China |


<!--Anchors-->
[image1]: ./media/virtual-machines-common-planned-maintenance/vmplanned1.png
[image2]: ./media/virtual-machines-common-planned-maintenance/EventViewerPostReboot.png
[image3]: ./media/virtual-machines-planned-maintenance/RegionPairs.PNG
[image4]: ./media/virtual-machines-common-planned-maintenance/availabilitysetexample.png


<!--Link references-->
[Virtual Machines Manage Availability]: ../articles/virtual-machines/virtual-machines-windows-hero-tutorial.md

[Understand planned versus unplanned maintenance]: ../articles/virtual-machines/windows/manage-availability.md#Understand-planned-versus-unplanned-maintenance/
