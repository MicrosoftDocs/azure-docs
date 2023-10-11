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

## Connect to Volumes

### Set up your client environment

#### Enable iSCSI Initiator

To create iSCSI connections from a Linux client, install the iSCSI initiator package. The exact command may vary depending on your distribution, and you should consult their documentation if necessary.

As an example, with Ubuntu you'd use `sudo apt install open-iscsi`, with SUSE Linux Enterprise Server (SLES) you'd use `sudo zypper install open-iscsi` and with Red Hat Enterprise Linux (RHEL) you'd use `sudo yum install iscsi-initiator-utils`.

#### Install Multipath I/O

To achieve higher IOPS and throughput to a volume and reach its maximum limits, you need to create multiple-sessions from the iSCSI initiator to the target volume based on your application's multi-threaded capabilities and performance requirements. You need Multipath I/O to aggregate these multiple paths into a single device, and to improve performance by optimally distributing I/O over all available paths based on a load balancing policy.

Install the Multipath I/O package for your Linux distribution. The installation will vary based on your distribution, and you should consult their documentation. As an example, on Ubuntu the command would be `sudo apt install multipath-tools`, for SLES the command would be `sudo zypper install multipath-tools` and for RHEL the command would be `sudo yum install device-mapper-multipath`.

Once you've installed the package, check if **/etc/multipath.conf** exists. If **/etc/multipath.conf** doesn't exist, create an empty file and use the settings in the following example for a general configuration. As an example, `mpathconf --enable` will create **/etc/multipath.conf** on RHEL. 

You'll need to make some modifications to **/etc/multipath.conf**. You'll need to add the devices section in the following example, and the defaults section in the following example sets some defaults are generally applicable. If you need to make any other specific configurations, such as excluding volumes from the multipath topology, see the manual page for multipath.conf.

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


### Attach Volumes to the client

You can use the following script to create your connections. To execute it, you will require the following parameters:
- subscription: Subscription ID
- g: Resource Group Name
- e: Elastic SAN Name
- v: Volume Group Name
- n <vol1, vol2, ...>: Names of volumes 1 and 2 and other volume names that you may require, comma separated
- s: Number of sessions to each volume (set to 32 by default)

Copy the script from [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/CLI%20(Linux)%20Multi-Session%20Connect%20Scripts/connect_for_documentation.py) and save it as a .py file, for example, connect.py. Then execute it with the required parameters. Below is an example of how you would execute the command: 

```bash
./connect.py --subscription <subid> -g <rgname> -e <esanname> -v <vgname> -n <vol1, vol2> -s 32
```

You can verify the number of sessions using `sudo multipath -ll`

#### Number of sessions
Our current recommendation is to use 32 sessions to each target volume to achieve its maximum IOPS and/or throughput limits.

## Next steps

[Configure Elastic SAN networking Preview](elastic-san-networking.md)
