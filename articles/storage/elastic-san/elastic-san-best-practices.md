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

This article provides some general guidance on getting optimal performance with an environment that uses an Azure Elastic SAN.

## Client-side optimizations

### General Recommendations (Windows & Linux Virtual Machines)

- For best performance, deploy your VMs and Elastic SAN in the same zone and the same region.

- VM storage I/O to Elastic SAN volumes uses VM network bandwidth, so traditional disk throughput limits on a VM don't apply to Elastic SAN volumes. Choose a VM that can provide sufficient bandwidth for production/VM-to-VM I/O and iSCSI I/O to attached Elastic SAN volumes. Generally, you should use Gen 5 (D / E / M series) VMs for the best performance.

- Enable “Accelerated Networking” on the VM, during VM creation. To do it via Azure PowerShell or Azure CLI or to enable Accelerated Networking on existing VMs, see [Use Azure PowerShell to create a VM with Accelerated Networking](../../virtual-network/create-vm-accelerated-networking-powershell.md)

:::image type="content" source="media/elastic-san-best-practices/enable-accelerated-networking.png" alt-text="Enable Accelerated Networking during VM creation." lightbox="media/elastic-san-best-practices/enable-accelerated-networking.png":::

- You must use 32 sessions to each target volume to achieve its maximum IOPS and/or throughput limits. Use Multipath I/O (MPIO) on the client to manage these multiple sessions to each volume for load balancing. Scripts are available for [Windows](elastic-san-connect-windows.md#connect-to-a-volume), [Linux](elastic-san-connect-linux.md#connect-to-a-volume), or on the Connect to volume page for your volumes in the Azure portal, which uses 32 sessions by default. Windows software iSCSI initiator has a limit of maximum 256 sessions. If you need to connect more than eight volumes to a Windows VM, reduce the number of sessions to each volume as needed. 


### MPIO

#### Windows
Use the following commands to update your settings:

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

#### Linux

Update /etc/multipath.conf file with the following: 

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

#### Windows

Update the below registry settings for iSCSI initiator on Windows.

1.	Open Registry Editor:
1. Select Start, type regedit in the search box and press enter.
1.	Navigate to the following location:
    [\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Class\{4d36e97b-e325-11ce-bfc1-08002be10318}\0004 (Microsoft iSCSI Initiator)\Parameters]
1.	Update the following settings. Right-click on each setting and select **Modify**. Change **Base** to **Decimal**, update the value and select **OK**.

|Description  |Parameter and value  |
|---------|---------|
|Sets maximum data the initiator sends in an iSCSI PDU to the target to 256 KB     |MaxTransferLength=262144         |
|Sets maximum SCSI payload that the initiator negotiates with the target to 256 KB     |MaxBurstLength=262144         |
|Sets maximum unsolicited data the initiator can send in an iSCSI PDU to a target to 256 KB     |FirstBurstLength=262144         |
|Sets maximum data the initiator can receive in an iSCSI PDU from the target to 256 KB     |MaxRecvDataSegmentLength=262144         |
|Disables R2T flow control     |InitialR2T=0         |
|Enables immediate data     |ImmediateData=1         |
|Sets timeout value for WMI requests to 15 seconds     |WMIRequestTimeout = 15 seconds         |


In cluster configurations, make iSCSI initiator names unique across all nodes that are sharing volumes. In Windows, you can update them via iSCSI Initiator app.

1.	Select **Start**, search for **iSCSI Initiator** in the search box. This opens the iSCSI Initiator.
1.	Select **Configuration** to see current initiator name.
    
    :::image type="content" source="media/elastic-san-best-practices/iscsi-initiator-config-widnows.png" alt-text="iSCSI Initiator Configuration on Windows." lightbox="media/elastic-san-best-practices/iscsi-initiator-config-widnows.png"::: 

1.	To modify it, select **Change**, enter new initiator name and select OK.
    
    :::image type="content" source="media/elastic-san-best-practices/update-iscsi-initiator-name-windows.png" alt-text="Update iSCSI Initiator Name on Windows." lightbox="media/elastic-san-best-practices/update-iscsi-initiator-name-windows.png"::: 


#### Linux

Update /etc/iscsi/iscsid.conf file with the following values:

```
# Set maximum data the initiator sends in an iSCSI PDU to the target to 256 KB
node.conn[0].iscsi.MaxXmitDataSegmentLength = 262144

# Set maximum SCSI payload that the initiator negotiates with the target to 256 KB
node.session.iscsi.MaxBurstLength = 262144

# Set maximum unsolicited data the initiator can send in an iSCSI PDU to a target to 256 KB
node.session.iscsi.FirstBurstLength = 262144

# Set maximum data the initiator can receive in an iSCSI PDU from the target to 256 KB
node.conn[0].iscsi.MaxRecvDataSegmentLength = 262144

# Disable R2T flow control
node.session.iscsi.InitialR2T = No

# Enable immediate data
node.session.iscsi.ImmediateData = Yes

# Set timeout value for WMI requests to 15 seconds
node.conn[0].timeo.login_timeout = 15
node.conn[0].timeo.logout_timeout = 15

# Enable CRC digest checking for header and data
node.conn[0].iscsi.HeaderDigest = CRC32C
node.conn[0].iscsi.DataDigest = CRC32C
```


|Description  |Value  |
|---------|---------|
|# Set maximum data the initiator sends in an iSCSI PDU to the target to 256 KB     |node.conn[0].iscsi.MaxXmitDataSegmentLength = 262144         |
|# Set maximum SCSI payload that the initiator negotiates with the target to 256 KB     |node.session.iscsi.MaxBurstLength = 262144         |
|# Set maximum unsolicited data the initiator can send in an iSCSI PDU to a target to 256 KB     |node.session.iscsi.FirstBurstLength = 262144         |
|# Set maximum data the initiator can receive in an iSCSI PDU from the target to 256 KB     |node.conn[0].iscsi.MaxRecvDataSegmentLength = 262144         |
|# Disable R2T flow control     |node.session.iscsi.InitialR2T = No         |
|# Enable immediate data     |node.session.iscsi.ImmediateData = Yes         |
|# Set timeout value for WMI requests to 15 seconds     |node.conn[0].timeo.login_timeout = 15<br></br>node.conn[0].timeo.logout_timeout = 15         |
|# Enable CRC digest checking for header and data     |node.conn[0].iscsi.HeaderDigest = CRC32C<br></br>node.conn[0].iscsi.DataDigest = CRC32C         |


In cluster configurations, ensure iSCSI initiator names are unique across all nodes that are sharing volumes. In Linux, you can modify /etc/iscsi/initiatorname.iscsi to update the initiator name.
:::image type="content" source="media/elastic-san-best-practices/update-iscsi-initiator-name-linux.png" alt-text="Update iSCSI Initiator Name on Linux." lightbox="media/elastic-san-best-practices/update-iscsi-initiator-name-linux.png"::: 


## Elastic SAN optimizations

Before deploying an Elastic SAN, determining the optimal size of what Elastic SAN you should deploy is necessary to achieving the right balance of performance for your workloads and cost. Use the following steps to determine the best sizing for you:

With your existing storage solution, select a time interval (day/week/quarter) to track performance. The best time interval is one that is a good snapshot of your applications/workloads. Over that time period, record the combined maximum IOPS and throughput for all workloads. If you use an interval higher than a minute, or if any of your workloads have bottlenecks with your current configuration, consider more capacity with an Elastic SAN. 

Once the time interval has passed, you should be able to determine how much base capacity your Elastic SAN requires, and how much overhead you might want to have when higher performance is required. The rest of your storage should use additional-capacity to save on costs.

For more information on performance, see [Elastic SAN Preview and virtual machine performance](elastic-san-performance.md).