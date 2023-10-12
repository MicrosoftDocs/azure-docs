---
title: Best practices for configuring an Elastic SAN Preview
description: Elastic SAN best practices
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 10/12/2022
ms.author: rogarana
ms.custom: ignite-2022, devx-track-azurepowershell
---

# Elastic SAN Preview best practices

Azure Elastic SAN delivers a massively scalable, cost-effective, high-performance, and reliable block storage solution, which can connect to a variety of Azure compute services over iSCSI protocol, enabling customers to seamlessly transition their SAN storage estate to the cloud without having to refactor their application architectures. This solution can achieve massive scale, up to millions of IOPS, double-digit GB/s of throughput, and low single-digit millisecond latencies with built-in resiliency to minimize downtime.

This article provides some general guidance on client and storage side configuration for best performance.

## Client-side configuration (Virtual Machines):

### General Recommendations (Windows & Linux):
-	For best performance, deploy your VMs and Elastic SAN in the same zone and the same region.
-	VM storage I/O to Elastic SAN volumes uses VM network bandwidth, so traditional disk throughput limits on a VM don't apply to Elastic SAN volumes. Choose a VM that can provide sufficient bandwidth for production/VM-to-VM I/O and iSCSI I/O to attached Elastic SAN volumes. Generally, you should use Gen 5 (D / E / M series) VMs for the best performance.
-	Enable “Accelerated Networking” on the VM, during VM creation. To do it via Azure PowerShell or Azure CLI or to enable accelerate networking on existing VMs, refer to [Use PowerShell to create a VM with Accelerated Networking | Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-network/create-vm-accelerated-networking-powershell?toc=%2Fazure%2Fvirtual-machines%2Ftoc.json)

    :::image type="content" source="media/elastic-san-best-practices/enable-accelerated-networking.png" alt-text="Enable Accelerated Networking during VM creation" lightbox="media/elastic-san-best-practices/enable-accelerated-networking.png":::

-	Multi-session connectivity to an Elastic SAN volume: Generally, you should use 32 sessions to each target volume to achieve its maximum IOPS and/or throughput limits. You need to use Multipath I/O (MPIO) on the client to manage these multiple sessions to each volume for load balancing. Scripts provided in documentation for [Windows](elastic-san-connect-windows.md#connect-to-a-volume) or [Linux](elastic-san-connect-linux.md#connect-to-a-volume) or in the portal, which uses 32 sessions by default. Windows software iSCSI initiator has a limit of maximum 256 sessions. If you need to connect more than 8 volumes to a Windows VM, reduce the number of sessions to each volume as needed. 


### MPIO

#### Windows: 
Change the below settings to recommended values 

```powershell
# Enable multipath support for iSCSI devices
Enable-MSDSMAutomaticClaim -BusType iSCSI

# Set the default load balancing policy based on your requirements. In this example, we set it to round robin which should be optimal for most workloads.
Set-MSDSMGlobalDefaultLoadBalancePolicy -Policy RR
# You can also use mpclaim.exe to set the policy to round robin
mpclaim -L -M 2

# Set disk time out to 30 seconds
Set-MPIOSetting -NewDiskTimeout 30
```

For more information regarding MPIO cmdlets, see [https://learn.microsoft.com/en-us/powershell/module/mpio/?view=windowsserver2022-ps](/powershell/module/mpio/?view=windowsserver2022-ps)

#### Linux: 
Update /etc/multipath.conf file with below recommended values. 

```config
defaults {
    user_friendly_names yes		# To create ‘mpathn’ names for multipath devices
    path_grouping_policy multibus	# To place all the paths in one priority group
    path_selector "round-robin 0"	# To use round robin algorithm to determine path for next I/O operation
    failback immediate			# For immediate failback to highest priority path group with active paths
    no_path_retry 1			# To disable I/O queueing after retrying once when all paths are down
}
devices {
  device {
    vendor "MSFT"
    product "Virtual HD"
  }
}
```

### iSCSI

#### Windows: 

Update the below registry settings for iSCSI initiator on Windows.

1.	Open Registry Editor:
1. Select Start, type regedit in the search box and press enter.
1.	Navigate to the following location:
    [\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Class\{4d36e97b-e325-11ce-bfc1-08002be10318}\0004 (Microsoft iSCSI Initiator)\Parameters]
1.	Update the settings below. To do this, right-click on each setting and select on Modify. Change **Base** to **Decimal**, update the value and select **OK**.
a.	# Set maximum data the initiator will send in an iSCSI PDU to the target to 256KB
MaxTransferLength=262144
b.	# Set maximum SCSI payload that the initiator will negotiate with the target to 256KB
MaxBurstLength=262144
c.	# Set maximum unsolicited data the initiator can send in an iSCSI PDU to a target to 256KB
FirstBurstLength=262144
d.	# Set maximum data the initiator can receive in an iSCSI PDU from the target to 256KB
MaxRecvDataSegmentLength=262144
e.	# Disable R2T flow control
InitialR2T=0
f.	# Enable immediate data
ImmediateData=1
g.	# Set timeout value for WMI requests to 15 seconds
WMIRequestTimeout = 15 seconds

In cluster configurations, ensure iSCSI initiator names are unique across all nodes that are sharing volumes. In Windows, you can update it via iSCSI Initiator app.
a.	Click on Start, type iSCSI Initiator in the search box and press enter. This will open iSCSI Initiator app.
b.	Click on Configuration tab to see current initiator name.
:::image type="content" source="media/elastic-san-best-practices/iscsi-initiator-config-widnows.png" alt-text="iSCSI Initiator Configuration on Windows." lightbox="media/elastic-san-best-practices/iscsi-initiator-config-widnows.png"::: 
c.	To modify it, click on Change, enter new initiator name and press OK.
:::image type="content" source="media/elastic-san-best-practices/update-iscsi-initiator-name-windows.png" alt-text="Update iSCSI Initiator Name on Windows." lightbox="media/elastic-san-best-practices/update-iscsi-initiator-name-windows.png"::: 


#### Linux:

Update /etc/iscsi/iscsid.conf file with below recommended values:

a.	# Set maximum data the initiator will send in an iSCSI PDU to the target to 256KB
node.conn[0].iscsi.MaxXmitDataSegmentLength = 262144
b.	# Set maximum SCSI payload that the initiator will negotiate with the target to 256KB
node.session.iscsi.MaxBurstLength = 262144
c.	# Set maximum unsolicited data the initiator can send in an iSCSI PDU to a target to 256KB
node.session.iscsi.FirstBurstLength = 262144
d.	# Set maximum data the initiator can receive in an iSCSI PDU from the target to 256KB
node.conn[0].iscsi.MaxRecvDataSegmentLength = 262144
e.	# Disable R2T flow control
node.session.iscsi.InitialR2T = No
f.	# Enable immediate data
node.session.iscsi.ImmediateData = Yes
g.	# Set timeout value for WMI requests to 15 seconds
node.conn[0].timeo.login_timeout = 15
node.conn[0].timeo.logout_timeout = 15
h.	# Enable CRC digest checking for header and data
node.conn[0].iscsi.HeaderDigest = CRC32C
node.conn[0].iscsi.DataDigest = CRC32C

In cluster configurations, ensure iSCSI initiator names are unique across all nodes that are sharing volumes. In Linux, you can modify /etc/iscsi/initiatorname.iscsi to update the initiator name.
:::image type="content" source="media/elastic-san-best-practices/update-iscsi-initiator-name-linux.png" alt-text="Update iSCSI Initiator Name on Linux." lightbox="media/elastic-san-best-practices/update-iscsi-initiator-name-linux.png"::: 


## Storage-side configuration (Elastic SAN)

Size an Elastic SAN appropriately so that all the applications/workloads using that SAN can achieve the necessary performance.
1.	Collect the performance statistics of all the workloads at a minute (recommended, but can be higher) interval, that will share an Elastic SAN for a period (day/week/quarter) that makes sense for your applications.
1.	Over that period, check the combined maximum IOPS and maximum throughput for all the workloads.
1.	Add some buffer a) If the data was collected at a higher granularity than a minute or b) If any of these workloads have some bottlenecks on-premises and have the potential to do more IOPS and/or throughput after moving to Elastic SAN and c) to account for higher performance needs in near-future as appropriate based on your growth projections.
1.	Create an Elastic SAN with appropriate base unit that gives you necessary IOPS and bandwidth identified in steps 2 and 3. 
1.	Use capacity-only unit for rest of the capacity to save on costs.
