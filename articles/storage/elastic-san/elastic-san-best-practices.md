---
title: Best practices for configuring an Elastic SAN
description: Learn about the best practices for getting optimal performance when configuring an Azure Elastic SAN.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 08/13/2024
ms.author: rogarana
---

# Optimize the performance of your Elastic SAN

This article provides some general guidance on getting optimal performance with an environment that uses an Azure Elastic SAN.

## Client-side optimizations

### General recommendations (Windows & Linux Virtual Machines)

- For best performance, deploy your VMs and Elastic SAN in the same zone and the same region.

- VM storage I/O to Elastic SAN volumes uses VM network bandwidth, so traditional disk throughput limits on a VM don't apply to Elastic SAN volumes. Choose a VM that can provide sufficient bandwidth for production/VM-to-VM I/O and iSCSI I/O to attached Elastic SAN volumes. Generally, you should use Gen 5 (D / E / M series) VMs for the best performance.

- Enable “Accelerated Networking” on the VM, during VM creation. To do it via Azure PowerShell or Azure CLI or to enable Accelerated Networking on existing VMs, see [Use Azure PowerShell to create a VM with Accelerated Networking](../../virtual-network/create-vm-accelerated-networking-powershell.md)

:::image type="content" source="media/elastic-san-best-practices/enable-accelerated-networking.png" alt-text="Screenshot of VM creation flow, enable accelerated networking highlighted." lightbox="media/elastic-san-best-practices/enable-accelerated-networking.png":::

- You must use 32 sessions per target volume for each volume to achieve its maximum IOPS and/or throughput limits. Use Multipath I/O (MPIO) on the client to manage these multiple sessions to each volume for load balancing. Scripts are available for [Windows](elastic-san-connect-windows.md#connect-to-volumes), [Linux](elastic-san-connect-linux.md#connect-to-volumes), or on the Connect to volume page for your volumes in the Azure portal, which uses 32 sessions by default. Windows software iSCSI initiator has a limit of maximum 256 sessions. If you need to connect more than eight volumes to a Windows VM, reduce the number of sessions to each volume as needed. 


### MPIO

#### Windows
Use the following commands to update your settings:

```powershell
# Enable multipath support for iSCSI devices
Enable-MSDSMAutomaticClaim -BusType iSCSI

# Set the default load balancing policy based on your requirements. In this example, we set it to round robin which should be optimal for most workloads.
mpclaim -L -M 2

# Set disk time out to 30 seconds
Set-MPIOSetting -NewDiskTimeout 30
```

For more information regarding MPIO cmdlets, see [MPIO reference](/powershell/module/mpio/).

#### Linux

Update /etc/multipath.conf file with the following: 

```config
defaults {
    user_friendly_names yes		# To create ‘mpathn’ names for multipath devices
    path_grouping_policy multibus	# To place all the paths in one priority group
    path_selector "round-robin 0"	# To use round robin algorithm to determine path for next I/O operation
    failback immediate			# For immediate failback to highest priority path group with active paths
    no_path_retry 3			# To disable I/O queueing after retrying once when all paths are down
    polling_interval 5         # Set path check polling interval to 5 seconds
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
    [\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Class\\{4d36e97b-e325-11ce-bfc1-08002be10318}\0004 (Microsoft iSCSI Initiator)\Parameters]
1.	Update the following settings. Right-click on each setting and select **Modify**. Change **Base** to **Decimal**, update the value and select **OK**.

|Description  |Parameter and value  |
|---------|---------|
|Sets maximum data the initiator sends in an iSCSI PDU to the target to 256 KB     |MaxTransferLength=262144         |
|Sets maximum SCSI payload that the initiator negotiates with the target to 256 KB     |MaxBurstLength=262144         |
|Sets maximum unsolicited data the initiator can send in an iSCSI PDU to a target to 256 KB     |FirstBurstLength=262144         |
|Sets maximum data the initiator can receive in an iSCSI PDU from the target to 256 KB     |MaxRecvDataSegmentLength=262144         |
|Disables R2T flow control     |InitialR2T=0         |
|Enables immediate data     |ImmediateData=1         |
|Sets timeout value for WMI requests to 30 seconds     |WMIRequestTimeout = 30 seconds         |
|Sets timeout value for link down time to 30 seconds     |LinkDownTime = 30 seconds         |


In cluster configurations, ensure iSCSI initiator names unique across all nodes that are sharing volumes. In Windows, you can update them via iSCSI Initiator app.

1.	Select **Start**, search for **iSCSI Initiator** in the search box. This opens the iSCSI Initiator.
1.	Select **Configuration** to see current initiator name.
    
    :::image type="content" source="media/elastic-san-best-practices/iscsi-initiator-config-widnows.png" alt-text="Screenshot of iSCSI Initiator configuration on Windows." lightbox="media/elastic-san-best-practices/iscsi-initiator-config-widnows.png"::: 

1.	To modify it, select **Change**, enter new initiator name and select OK.
    
    :::image type="content" source="media/elastic-san-best-practices/update-iscsi-initiator-name-windows.png" alt-text="Screenshot of updating the iSCSI Initiator Name on Windows." lightbox="media/elastic-san-best-practices/update-iscsi-initiator-name-windows.png"::: 


#### Linux

Update the following settings with recommended values in global iSCSI configuration file (iscsid.conf, generally found in /etc/iscsi directory) on the client before connecting any volumes to it. When a volume is connected, a node is created along with a configuration file specific to that node (for example on Ubuntu, it can be found in /etc/iscsi/nodes/$volume_iqn/portal_hostname,$port directory) inheriting the settings from global configuration file. If you have already connected one or more volumes to the client before updating global configuration file, update the node specific configuration file for each volume directly or using the following command:

sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n $iscsi_setting_name -v $setting_value

Where 
- $volume_iqn: Elastic SAN volume IQN
- $portal_hostname: Elastic SAN volume portal hostname
- $port: 3260
- $iscsi_setting_name: parameter for each setting listed below
- $setting_value: value recommended for each setting below

|Description  |Parameter and value  |
|---------|---------|
|# Set maximum data the initiator sends in an iSCSI PDU to the target to 256 KB     |node.conn[0].iscsi.MaxXmitDataSegmentLength = 262144         |
|# Set maximum SCSI payload that the initiator negotiates with the target to 256 KB     |node.session.iscsi.MaxBurstLength = 262144         |
|# Set maximum unsolicited data the initiator can send in an iSCSI PDU to a target to 256 KB     |node.session.iscsi.FirstBurstLength = 262144         |
|# Set maximum data the initiator can receive in an iSCSI PDU from the target to 256 KB     |node.conn[0].iscsi.MaxRecvDataSegmentLength = 262144         |
|# Disable R2T flow control     |node.session.iscsi.InitialR2T = No         |
|# Enable immediate data     |node.session.iscsi.ImmediateData = Yes         |
|# Set timeout value for WMI requests     |node.conn[0].timeo.login_timeout = 30<br></br>node.conn[0].timeo.logout_timeout = 15         |
|# Enable CRC digest checking for header and data     |node.conn[0].iscsi.HeaderDigest = CRC32C<br></br>node.conn[0].iscsi.DataDigest = CRC32C         |


In cluster configurations, ensure iSCSI initiator names are unique across all nodes that are sharing volumes. In Linux, you can modify /etc/iscsi/initiatorname.iscsi to update the initiator name.
:::image type="content" source="media/elastic-san-best-practices/update-iscsi-initiator-name-linux.png" alt-text="Screenshot updating the iSCSI Initiator Name on Linux." lightbox="media/elastic-san-best-practices/update-iscsi-initiator-name-linux.png"::: 


## Elastic SAN optimizations

Before deploying an Elastic SAN, determining the optimal size of the Elastic SAN you deploy is necessary to achieving the right balance of performance for your workloads and cost. Use the following steps to determine the best sizing for you:

With your existing storage solution, select a time interval (day/week/quarter) to track performance. The best time interval is one that is a good snapshot of your applications/workloads. Over that time period, record the combined maximum IOPS and throughput for all workloads. If you use an interval higher than a minute, or if any of your workloads have bottlenecks with your current configuration, consider adding more base capacity to your Elastic SAN deployment. You should leave some headroom when determining your base capacity, to account for growth. The rest of your Elastic SAN's storage should use additional-capacity, to save on cost.

For more information on performance, see [Elastic SAN and virtual machine performance](elastic-san-performance.md).
