---
title: Connect to an Azure Elastic SAN volume - Linux.
description: Learn how to connect to an Azure Elastic SAN volume from an individual Linux client using iSCSI and ensure optimal performance.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 06/18/2025
ms.author: rogarana
ms.custom: references_regions, linux-related-content
# Customer intent: As a Linux user, I want to connect to an Azure Elastic SAN volume using iSCSI, so that I can ensure optimal performance with multiple sessions for my application.
---

# Connect to Elastic SAN volumes - Linux

This article explains how to connect to an Elastic SAN volume from an individual Linux client. For details on connecting from a Windows client, see [Connect to Elastic SAN volumes - Windows](elastic-san-connect-windows.md).

In this article, you'll configure your volume group to allow connections from your subnet and then you'll configure your client environment to connect to an Elastic SAN volume and establish a connection.

You must use a cluster manager when connecting an individual elastic SAN volume to multiple clients. For details, see [Use clustered applications on Azure Elastic SAN](elastic-san-shared-volumes.md).

## Prerequisites

- Use either the [latest Azure CLI](/cli/azure/install-azure-cli) or install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell)
- [Deploy an Elastic SAN](elastic-san-create.md)
- Either [configure private endpoints](elastic-san-configure-private-endpoints.md) or [configure service endpoints](elastic-san-configure-service-endpoints.md)

## Enable iSCSI Initiator

To create iSCSI connections from a Linux client, install the iSCSI initiator package. The exact command might vary depending on your distribution, and you should consult their documentation if necessary.

As an example, with Ubuntu you'd use `sudo apt install open-iscsi`, with SUSE Linux Enterprise Server (SLES) you'd use `sudo zypper install open-iscsi` and with Red Hat Enterprise Linux (RHEL) you'd use `sudo yum install iscsi-initiator-utils`.

## Install Multipath I/O

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
    no_path_retry 3			# To disable I/O queueing after retrying once when all paths are down
    polling_interval 5         # Set path check polling interval to 5 seconds
    find multipaths yes        # To allow multipath to take control of only those devices that have multiple paths 
}
devices {
  device {
    vendor "MSFT"
    product "Virtual HD"
  }
}
```

After creating or modifying the file, restart Multipath I/O. On Ubuntu, the command is `sudo systemctl restart multipath-tools.service` and on RHEL and SLES the command is `sudo systemctl restart multipathd`.


## Attach Volumes to the client

You can use the following script to create your connections. To execute it, collect or determine the following parameters: 
- subscription: Subscription ID
- g: Resource Group Name
- e: Elastic SAN Name
- v: Volume Group Name
- n <vol1, vol2, ...>: Names of volumes 1 and 2 and other volume names that you might require, comma separated
- s: Number of sessions to each volume (set to 32 by default)

Copy the script from [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/CLI%20(Linux)%20Multi-Session%20Connect%20Scripts/connect_for_documentation.py) and save it as a .py file, for example, connect.py. Then execute it with the required parameters. The following is an example of how you'd run the script:

```bash
./connect.py --subscription <subid> -g <rgname> -e <esanname> -v <vgname> -n <vol1, vol2> -s 32
```

You can verify the number of sessions using `sudo multipath -ll`

### Set session number

Use 32 sessions to each target volume to achieve its maximum IOPS and/or throughput limits.

You can change the session count by running the script using the following instructions:  

> [!NOTE]
> Use `-n` to set the number of sessions. The parameter accepts values from 1 to 32, and has a default value of 32.

```bash
python3 connect_for_documentation.py \ 

--subscription <your-subscription-id>\ 

-g <resource-group>\ 

-e <elastic-san-name>\ 

-v <volume-group-name>\ 

-n volume1 volume2 \ 

-s <value>
```

## Next steps

[Configure Elastic SAN networking](elastic-san-networking.md)
