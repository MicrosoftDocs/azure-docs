---
title: Connect to an Azure Elastic SAN Preview volume - Linux.
description: Learn how to connect to an Azure Elastic SAN Preview volume from a Linux client.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 09/12/2023
ms.author: rogarana
ms.custom: references_regions, ignite-2022, devx-track-linux
---

# Connect to Elastic SAN Preview volumes - Linux

This article explains how to connect to an Elastic storage area network (SAN) volume from a Linux client. For details on connecting from a Windows client, see [Connect to Elastic SAN Preview volumes - Windows](elastic-san-connect-windows.md).

In this article, you'll add the Storage service endpoint to an Azure virtual network's subnet, then you'll configure your volume group to allow connections from your subnet. Finally, you'll configure your client environment to connect to an Elastic SAN volume and establish a connection.

## Prerequisites

- Use either the [latest Azure CLI](/cli/azure/install-azure-cli) or install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell)
- [Deploy an Elastic SAN Preview](elastic-san-create.md)
- [Configure a virtual network endpoint](elastic-san-networking.md#configure-a-virtual-network-endpoint)
- [Configure virtual network rules](elastic-san-networking.md#configure-virtual-network-rules)

## Limitations

[!INCLUDE [elastic-san-regions](../../../includes/elastic-san-regions.md)]

## Connect to a volume

You can either create single sessions or multiple-sessions to every Elastic SAN volume based on your application's multi-threaded capabilities and performance requirements. To achieve higher IOPS and throughput to a volume and reach its maximum limits, use multiple sessions and adjust the queue depth and IO size as needed, if your workload allows.

When using multiple sessions, generally, you should aggregate them with Multipath I/O. It allows you to aggregate multiple sessions from an iSCSI initiator to the target into a single device, and can improve performance by optimally distributing I/O over all available paths based on a load balancing policy.

### Environment setup

To create iSCSI connections from a Linux client, install the iSCSI initiator package. The exact command may vary depending on your distribution, and you should consult their documentation if necessary.

As an example, with Ubuntu you'd use `sudo apt install open-iscsi`, with SUSE Linux Enterprise Server (SLES) you'd use `sudo zypper install open-iscsi` and with Red Hat Enterprise Linux (RHEL) you'd use `sudo yum install iscsi-initiator-utils`.

#### Multipath I/O - for multi-session connectivity

Install the Multipath I/O package for your Linux distribution. The installation will vary based on your distribution, and you should consult their documentation. As an example, on Ubuntu the command would be `sudo apt install multipath-tools`, for SLES the command would be `sudo zypper install multipath-tools` and for RHEL the command would be `sudo yum install device-mapper-multipath`.

Once you've installed the package, check if **/etc/multipath.conf** exists. If **/etc/multipath.conf** doesn't exist, create an empty file and use the settings in the following example for a general configuration. As an example, `mpathconf --enable` will create **/etc/multipath.conf** on RHEL. 

You'll need to make some modifications to **/etc/multipath.conf**. You'll need to add the devices section in the following example, and the defaults section in the following example sets some defaults are generally applicable. If you need to make any other specific configurations, such as excluding volumes from the multipath topology, see the main page for multipath.conf.

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

After creating or modifying the file, restart Multipath I/O. On Ubuntu, the command is `sudo systemctl restart multipath-tools.service` and on RHEL and SLES the command is `sudo systemctl restart multipathd`.

### Gather information

Before you can connect to a volume, you'll need to get **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort** from your Azure resources.

Run the following command to get these values:

```azurecli
# Connect to Azure
az login

# Get volume information
az elastic-san volume show -e yourSanName -g yourResourceGroup -v yourVolumeGroupName -n yourVolumeName
```

You should see a list of output that looks like the following:

:::image type="content" source="media/elastic-san-create/elastic-san-volume.png" alt-text="Screenshot of command output." lightbox="media/elastic-san-create/elastic-san-volume.png":::


Note down the values for **targetIQN**, **targetPortalHostName**, and **targetPortalPort**, you'll need them for the next sections.

## Determine sessions to create

You can either create single sessions or multiple-sessions to every Elastic SAN volume based on your application's multi-threaded capabilities and performance requirements. To achieve higher IOPS and throughput to a volume and reach its maximum limits, use multiple sessions and adjust the queue depth and IO size as needed, if your workload allows.

For multi-session connections, install [Multipath I/O - for multi-session connectivity](#multipath-io---for-multi-session-connectivity).

### Multi-session connections

To establish multiple sessions to a volume, first you'll need to create a single session with particular parameters. 

To establish persistent iSCSI connections, modify **node.startup** in **/etc/iscsi/iscsid.conf** from **manual** to **automatic**.

Replace **yourTargetIQN**, **yourTargetPortalHostName**, and **yourTargetPortalPort** with the values you kept, then run the following commands from your compute client to connect an Elastic SAN volume.

```bash
sudo iscsiadm -m node --targetname yourTargetIQN --portal yourTargetPortalHostName:yourTargetPortalPort -o new

sudo iscsiadm -m node --targetname yourTargetIQN -p yourTargetPortalHostName:yourTargetPortalPort -l
```

Then, get the session ID and create as many sessions as needed with the session ID. To get the session ID, run `iscsiadm -m session` and you should see output similar to the following:

```output
tcp:[15] <name>:port,-1 <iqn>
tcp:[18] <name>:port,-1 <iqn>
```
15 is the session ID we'll use from the previous example.

The following script is a loop that creates as many additional sessions as you specify. Replace **numberOfAdditionalSessions** with your desired number of additional sessions and replace **sessionID** with the session ID you'd like to use, then run the script.

```bash
sudo for i in `seq 1 numberOfAdditionalSessions`; do sudo iscsiadm -m session -r sessionID --op new; done
```

You can verify the number of sessions using `sudo multipath -ll`

When you've finished creating sessions for each of your volumes, run the following command once for each volume you'd like to maintain persistent connections to. This keeps the volume's connections active when your client reboots.

```bash
sudo iscsiadm -m node --targetname yourTargetIQN --portal yourTargetPortalHostName:yourTargetPortalPort --op update -n node.session.nr_sessions -v numberofAdditionalSessions+1
```

### Single-session connections

To establish persistent iSCSI connections, modify **node.startup** in **/etc/iscsi/iscsid.conf** from **manual** to **automatic**.

Replace **yourTargetIQN**, **yourTargetPortalHostName**, and **yourTargetPortalPort** with the values you kept, then run the following commands from your compute client to connect an Elastic SAN volume.

```bash
sudo iscsiadm -m node --targetname yourTargetIQN --portal yourTargetPortalHostName:yourTargetPortalPort -o new

sudo iscsiadm -m node --targetname yourTargetIQN -p yourTargetPortalHostName:yourTargetPortalPort -l
```

## Next steps

[Configure Elastic SAN networking Preview](elastic-san-networking.md)
