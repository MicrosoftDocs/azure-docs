Sometimes an Azure virtual machine (VM) may reboot for no apparent reason, with no evidence of a user initiating the reboot operation. This article lists the acitons and events that can cause VMs to reboot and provides insight into how to avoid unexpected reboot issues or reduce the impact of the issue.

## Configure the VMs for high availability
The best way to protect your application running on Azure against any type of VM reboots and downtime is to configure the VMs for high availability.

To provide this level of redundancy to your application, we recommend that you group two or more VMs in an availability set. This configuration ensures that during either a planned or unplanned maintenance event, at least one VM is available and meets the 99.95% [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_5/).

For more informaiton abot availability set, see the following articles:

- [Manage the availability of VMs](../articles/virtual-machines/windows/manage-availability.md)
- [Configure availability of VMs](../articles/virtual-machines/windows/classic/configure-availability.md)

## Resource Health Information 
Azure Resource Health is a service that exposes the health of individual Azure resources and provides actionable guidance for troubleshooting problems. In a cloud environment where it isn’t possible to directly access servers or infrastructure elements, the goal for Resource Health is to reduce the time that customers spend on troubleshooting. Particularly, the time that spent determining if the root of the problem lies in the application or is caused by an event inside the Azure platform. For more information,  see [Understand and use Resource Health](../articles/resource-health/resource-health-overview.md)

## Actions and events that can cause the VM to reboot

### Planned maintenance
Microsoft Azure periodically performs updates across the globe to improve the reliability, performance, and security of the host infrastructure that underlies VMs. Many of these updates, including memory-preserving updates are performed without any impact to your VMs or cloud services.

However, some updates do require a reboot. The VMs are shut down while we patch the infrastructure, and then the VMs are restarted.

To understand what Azure planned maintenance is and how it can affect the availability of your Linux VMs, see the following articles. These articles provide background about the Azure planned maintenance process and how to schedule planned maintenance to further reduce the impact.

- [Planned maintenance for VMs in Azure](../articles/virtual-machines/windows/planned-maintenance.md)
- [How to schedule planned maintenance on Azure VMs](../articles/virtual-machines/windows/planned-maintenance-schedule.md)

### Memory-preserving updates   
For this class of updates in Microsoft Azure, customers do not see any impact to their running VMs. Many of these updates are to components or services that can be updated without interfering with the running instance. Some are platform infrastructure updates on the host operating system that can be applied without a reboot of the VMs.

These memory-preserving updates are accomplished with technology that enables in-place live migration. When updating, the VM is placed into a “paused” state, preserving the memory in RAM, while the underlying host operating system receives the necessary updates and patches. The VM is resumed within 30 seconds of being paused. After resuming, the clock of the VM is automatically synchronized.

Not all updates can be deployed by using this mechanism, but given the short pause period, deploying updates in this way greatly reduces impact to VMs.

Multi-instance updates (for VMs in an availability set) are applied one update domain at a time.

> [!Note]
> Linux machines that have old kernel versions are affected by a kernel panic during this update method. To avoid this issue, update to kernel version 3.10.0-327.10.1 or a later version. For more information, see [An Azure Linux VM on a 3.10-based kernel panics after a host node upgrade](https://support.microsoft.com/help/3212236).     
    
### User-initiated reboot/shutdown actions
 
If a reboot is performed from the Azure portal, Azure PowerShell, Command-Line interface, or Reset API, the event can be found in [Azure Activity Log](../articles/monitoring-and-diagnostics/monitoring-overview-activity-logs.md).

If the action is performed from the VM's operation system, the event can be found in system logs.

Other scenario that ususally causes the VM to reboot include multiple configuration change actions. Typically, the user sees a warning message indicating that executing a particular action will result in a reboot of the VM. Examples include any VM resize operations, changing the password of the administrative account and setting a static IP address.

### Azure Security center and Windows Updates
Azure Security Center monitors daily Windows and Linux VMs for missing operating system updates. Security Center retrieves a list of available security and critical updates from Windows Update or Windows Server Update Services (WSUS), depending on which service is configured on a Windows VM. Security Center also checks for the latest updates for Linux systems. If your VM is missing a system update, Security Center will recommend that you apply system updates. Applicaiton of these system updates is controlled through the Security Center in Azure portal. After applying some updates, VM reboots may be required. For more information, see [Apply system updates in Azure Security Center](../articles/security-center/security-center-apply-system-updates.md).

Like on-premises servers, Azure does not push Windows Updates to Windows Azure VMs since these machines are intended to be managed by the user.  Customers are, however encouraged to leave the automatic Windows Update setting enabled. Automatic installation of Windows Updates can also cause reboots to occur after updates are applied. For more information, see [Windows Update FAQ](https://support.microsoft.com/help/12373/windows-update-faq).

### Other situations affecting the availability of your VM
There are other cases in which Azure might actively suspend the use of a VM. Users receive email notifications before this action is taken, so they have a chance to resolve the underlying issues. Examples include security violations, and expired payment method having expired.

### Host Server Faults 
The VM is hosted on a physical server that is running inside an Azure datacenter. The physical server runs an agent called the Host Agent in addition to a few other Azure components. When these Azure software components on the physical server become unresponsive, the monitoring system triggers a reboot of the host server to attempt recovery. The VM is typically available again within five minutes and continues to live on the same host as previously.

Server faults are typically caused by hardware failure such as failure of a hard disk or solid-state drive. Azure continuously monitors these occurrences, identifies the underlying bugs, and rolls out updates after the mitigation has been implemented and tested.

Since some host server faults can be specific to that server, a repeated VM reboot situation might be improved by manually redeploying it to another host server. This operation  can be triggered by using the “redeploy” option on the details page of the VM, or by stopping and restarting the VM in the Azure portal.

### Auto-recovery
In case the host server cannot reboot for any reason, the Azure platform initiates an auto-recovery action to take the faulty host server out of rotation for further investigation. 
All VMs on that host are automatically relocated to a different, healthy host server. This process is typically complete within 15 minutes. This blog describes the auto-recovery process: [Auto-recovery of VMs](https://azure.microsoft.com/blog/service-healing-auto-recovery-of-virtual-machines).

### Unplanned maintenance
On rare occasions, the Azure operations team may need to perform maintenance activities to ensure the overall health of the Azure platform. This behavior may affect VM availability and typically results in the same auto-recovery action as described earlier.  

Unplanned maintenance s include the following:

- Urgent node defragmentation
- Urgent network switch updates

### VM Crashes
VMs may restart due to issues within the VM itself. The work load or role running on the VM may trigger a bug check within the guest operating system. For help determining the reason for the crash, view system and application logs for Windows VMs, and serial logs for Linux VMs.

### Storage-related forced shutdowns
VMs in Azure rely on virtual disks for operating system and data storage that is hosted on the Azure Storage infrastructure. Whenever the availability or connectivity between the VM and the associated virtual disks is impacted for more than 120 seconds, the Azure platform performs a forced shutdown of the VMs to avoid data corruption. The VMs are automatically powered back on after storage connectivity has been restored. 

The duration of the shutdown can be as short as five minutes but can be significantly longer. The following is one of the specific cases that is associated with storage-related forced shutdowns: 

**Exceeding IO limits**

VMs might be temporarily shut down when I/O requests are consistently throttled due to a volume of input/output operations per second (IOPS) that exceeds the I/O limits for disk (Standard disk storage is limited to 500 IOPS). To mitigate this issue, use disk striping or configure storage space inside the guest VM, depending on the workload. For details, see [Configuring Azure VMs for Optimal Storage Performance](http://blogs.msdn.com/b/mast/archive/2014/10/14/configuring-azure-virtual-machines-for-optimal-storage-performance.aspx).

Higher IOPS limits are available via Azure Premium Storage with up to 80,000 IOPs. For more information, See [High-Performance Premium Storage](../articles/storage/storage-premium-storage.md).

### Other incidents
In rare circumstances, a wide spread issue can impact multiple servers in an Azure data center.  If this occurs, the Azure team sends email notifications to affected subscriptions. You can check the [Azure Service Health Dashboard](https://azure.microsoft.com/status/) and Azure portal for the status of on going outages and past incidents.