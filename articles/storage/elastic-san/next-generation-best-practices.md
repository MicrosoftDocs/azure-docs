---
title: Azure Elastic SAN Next Generation configuration best practices
description: Learn best practices for optimizing Azure Elastic SAN Next Generation performance, including reserved performance for Business Critical volume groups and client configuration for General Purpose iSCSI.
author: normesta
ms.service: azure-elastic-san
ms.topic: concept-article
ms.date: 11/06/2026
ms.author: normesta
---

# Optimize the performance of your Azure Elastic SAN Next Generation

This article provides guidance for getting optimal performance from Azure Elastic SAN Next Generation.

Elastic SAN Next Generation offers three QoS tiers. Business Critical and General Purpose – Direct Attach volume groups use Direct Attach connectivity. Microsoft manages the connectivity configuration for these tiers, so there's nothing for you to configure on the client.

General Purpose – iSCSI volume groups use iSCSI connectivity, which requires an iSCSI initiator and Multipath I/O (MPIO) on the client. The [General Purpose – iSCSI](#general-purpose--iscsi) section describes the client settings that provide the best performance.

## Business Critical

Business Critical volume groups can use shared SAN performance above their reservation, so you don't need to reserve a workload's full peak. Reserve the performance the workload must have during contention, typically around its normal IOPS and throughput. Reserve up to peak only for latency-sensitive workloads that can't tolerate slowdowns.

For more information, see [How performance works in Elastic SAN Next Generation](next-generation-performance.md).

## General Purpose – iSCSI

### Virtual machines

- For the best performance, deploy your virtual machines (VMs) and Elastic SAN in the same zone and the same region.

- VM storage I/O to Elastic SAN volumes uses VM network bandwidth, so traditional disk throughput limits on a VM don't apply to Elastic SAN volumes. Choose a VM that can provide sufficient bandwidth for production/VM-to-VM I/O and iSCSI I/O to attached Elastic SAN volumes. Generally, you should use Gen 5 (D, E, or M series) VMs for the best performance.

- Enable **Accelerated Networking** on the VM during creation. To learn how to enable it by using Azure PowerShell or Azure CLI, or to enable Accelerated Networking on existing VMs, see [Use Azure PowerShell to create a VM with Accelerated Networking](../../virtual-network/create-vm-accelerated-networking-powershell.md).

:::image type="content" source="media/elastic-san-best-practices/enable-accelerated-networking.png" alt-text="Screenshot of VM creation flow, enable accelerated networking highlighted." lightbox="media/elastic-san-best-practices/enable-accelerated-networking.png":::

- To achieve maximum IOPS and throughput limits, use 32 sessions per target volume for each volume. Use MPIO on the client to manage these multiple sessions to each volume for load balancing. Scripts are available for [Windows](elastic-san-connect-windows.md), [Linux](elastic-san-connect-linux.md), or on the Connect to volume page for your volumes in the Azure portal, which uses 32 sessions by default. Windows software iSCSI initiator has a limit of maximum 256 sessions. If you need to connect more than eight volumes to a Windows VM, reduce the number of sessions to each volume as needed.

### SQL Server

- Add delayed start for SQL Services to ensure iSCSI connectivity is established before SQL services start.

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

For more information about MPIO cmdlets, see [MPIO reference](/powershell/module/mpio/).

#### Linux

Update the /etc/multipath.conf file by using the following commands:

```config
defaults {
    user_friendly_names yes		# To create ‘mpathn’ names for multipath devices
    path_grouping_policy multibus	# To place all the paths in one priority group
    path_selector "round-robin 0"	# To use round robin algorithm to determine path for next I/O operation
    failback immediate			# For immediate failback to highest priority path group with active paths
    no_path_retry 3			# To disable I/O queueing after retrying once when all paths are down
    polling_interval 5         # Set path check polling interval to 5 seconds
    find_multipaths yes        # To allow multipath to take control of only those devices that have multiple paths
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

Update the registry settings for the iSCSI initiator on Windows.

1. Open Registry Editor:
   1. Select **Start**, enter `regedit` in the search box, and press **Enter**.
   1. Go to the following location:
      `[\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Class\{4d36e97b-e325-11ce-bfc1-08002be10318}\0004 (Microsoft iSCSI Initiator)\Parameters]`
   1. Update the following settings. Right-click each setting and select **Modify**. Change **Base** to **Decimal**, update the value, and select **OK**.

| Description | Parameter and value |
|---------|---------|
|Sets maximum data the initiator sends in an iSCSI PDU to the target to 256 KB|MaxTransferLength=262144|
|Sets maximum SCSI payload that the initiator negotiates with the target to 256 KB|MaxBurstLength=262144|
|Sets maximum unsolicited data the initiator can send in an iSCSI PDU to a target to 256 KB|FirstBurstLength=262144|
|Sets maximum data the initiator can receive in an iSCSI PDU from the target to 256 KB|MaxRecvDataSegmentLength=262144|
|Disables R2T flow control|InitialR2T=0|
|Enables immediate data|ImmediateData=1|
|Sets timeout value for WMI requests to 30 seconds|WMIRequestTimeout = 30 seconds|
|Sets timeout value for link down time to 30 seconds|LinkDownTime = 30 seconds|

> [!NOTE]
> After updating registry settings for optimal performance, restart the VM for the changes to take effect. If you don't restart the VM, you continue to use the default settings.

In cluster configurations, ensure iSCSI initiator names are unique across all nodes that share volumes. In Windows, you can update them through the iSCSI Initiator app.

1. Select **Start**, search for **iSCSI Initiator** in the search box. This action opens the iSCSI Initiator.
1. Select **Configuration** to see the current initiator name.

    :::image type="content" source="media/elastic-san-best-practices/iscsi-initiator-config-widnows.png" alt-text="Screenshot of iSCSI Initiator configuration on Windows." lightbox="media/elastic-san-best-practices/iscsi-initiator-config-widnows.png":::

1. To modify it, select **Change**, enter new initiator name, and select **OK**.

    :::image type="content" source="media/elastic-san-best-practices/update-iscsi-initiator-name-windows.png" alt-text="Screenshot of updating the iSCSI Initiator Name on Windows." lightbox="media/elastic-san-best-practices/update-iscsi-initiator-name-windows.png":::

#### Linux

Update the following settings with recommended values in the global iSCSI configuration file (`iscsid.conf`, generally found in the `/etc/iscsi` directory) on the client before connecting any volumes to it. When you connect a volume, you create a node along with a configuration file specific to that node. For example, on Ubuntu VMs, you can find it in the `/etc/iscsi/nodes/$volume_iqn/portal_hostname,$port` directory. This configuration file inherits the settings from the global configuration file. If you already connected one or more volumes to the client before updating the global configuration file, update the node-specific configuration file for each volume directly or use the following command:

```
# Variable declaration
volume_iqn=<Elastic SAN volume IQN>
portal_hostname=<Elastic SAN volume portal hostname>
port=3260

# Set maximum data the initiator sends in an iSCSI PDU to the target to 256 KB
sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n node.conn[0].iscsi.MaxXmitDataSegmentLength -v 262144

# Set maximum SCSI payload that the initiator negotiates with the target to 256 KB
sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n node.session.iscsi.MaxBurstLength -v 262144

# Set maximum unsolicited data the initiator can send in an iSCSI PDU to a target to 256 KB
sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n node.session.iscsi.FirstBurstLength -v 262144

# Set maximum data the initiator can receive in an iSCSI PDU from the target to 256 KB
sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n node.conn[0].iscsi.MaxRecvDataSegmentLength -v 262144

# Disable R2T flow control
sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n node.session.iscsi.InitialR2T -v No

# Enable immediate data
sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n node.session.iscsi.ImmediateData -v Yes

# Set timeout value for WMI requests
sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n node.conn[0].timeo.login_timeout -v 30
sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n node.conn[0].timeo.logout_timeout -v 15

# Enable CRC digest checking for header and data
sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n node.conn[0].iscsi.HeaderDigest -v CRC32C
sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n node.conn[0].iscsi.DataDigest -v CRC32C

```
> [!NOTE]
> After updating iSCSI configuration files, restart the VM to ensure the new settings are applied.

In cluster configurations, ensure iSCSI initiator names are unique across all nodes that are sharing volumes. In Linux, modify `/etc/iscsi/initiatorname.iscsi` to update the initiator name.
:::image type="content" source="media/elastic-san-best-practices/update-iscsi-initiator-name-linux.png" alt-text="Screenshot updating the iSCSI Initiator Name on Linux." lightbox="media/elastic-san-best-practices/update-iscsi-initiator-name-linux.png":::

## Next steps

- [How performance works in Elastic SAN Next Generation](next-generation-performance.md)
- [Networking for Elastic SAN Next Generation](next-generation-networking.md)
