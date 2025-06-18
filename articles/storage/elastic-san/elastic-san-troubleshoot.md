---
title: Troubleshoot Azure Elastic SAN
description: Troubleshoot issues with Azure Elastic SAN
author: adarshv98
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 04/15/2025
ms.author: rogarana
---

# Troubleshoot Elastic SAN

This article lists common issues related to Azure Elastic SAN. It also provides possible causes and resolutions for these issues.

## Encountered get_iqns timeout error with Linux documentation script - Exception: Command took longer than 10 s

- Install the latest Azure CLI, and follow the instructions that work for your Virtual Machine (VM) SKU.
- Once you install the latest version, run az extension add -n elastic-san to install the extension for Elastic SAN. 
- Run the az login command and follow the steps that command generates to log in through your browser.
- Rerun the Linux documentation script and check if the issue persists.

## Encountered login rejected error - iscsiadm: Cannot modify node.conn[0].iscsi.DataDigest. Invalid param name

- Ensure the private endpoint or service endpoint is configured correctly 
- Check if your volumes are connecting to Azure VMware Solution (AVS), as Cyclic Redundancy Check (CRC) isn't supported yet for AVS.
- If not, check if your VM is running Fedora or its downstream Linux distributions like Red Hat Enterprise Linux, CentOS, or Rocky Linux that don't support data digests. 
- If either of the above scenarios is true, disable the CRC protection flag. You have to uncheck the box on portal and change the parameter for EnforceDataIntegrityCheckForIscsi (PowerShell)) or data-integrity-check (CLI) to false.


## Elastic SAN volume performance or latency isn't as expected

- Check your SAN size and configuration via portal (SAN homepage -> Configuration blade) and ensure that the I/O per second (IOPS) and throughput numbers can handle the requirements of the workload
- Check your VM throughput and IOPS limits and ensure that the VM can handle the workload requirements
- Ensure that you're following the best practices outlined in [Optimize the performance of your Elastic SAN](elastic-san-best-practices.md). 


## Unable to establish connectivity from new nodes in a cluster

- Identify which VMs are part of the cluster.
- Check the number of sessions per node using `iscsicli sessionList` or `mpclaim -s -d` (for Windows) or sudo multipath -ll (for Linux) on each VM in the cluster and add up the total number of sessions
- After doing so, if the # of sessions are 128 then you can disconnect the volumes via portal or using the script linked [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/disconnect.ps1) for Windows or [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/CLI%20(Linux)%20Multi-Session%20Connect%20Scripts/disconnect_for_documentation.py) for Linux. 
- Next, modify the NumSession parameter (Windows) or the num_of_sessions parameter (Linux) of the connect script from either from the portal or the [Windows](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/connect.ps1) or [Linux](https://github.com/Azure-Samples/azure-elastic-san/blob/main/CLI%20(Linux)%20Multi-Session%20Connect%20Scripts/connect_for_documentation.py) scripts. You need to ensure that the total number of sessions across volumes is less than 128. 
- Run the script on your VM. These values can also be entered during runtime of the script.

## Unable to connect to more than eight volumes to a Windows VM

- To see the number of sessions on your Windows VM, run `iscsicli sessionList` or `mpclaim -s -d`. The maximum session limit is 255 for Windows VMs.
- If you are at the session limit, then you can disconnect the volumes either via portal or using the script linked [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/disconnect.ps1). 
- Next, modify the $NumSession parameter of the connect script from either the portal or using the [Windows](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/connect.ps1) script. You need to ensure that the total number of sessions per volume attached to the VM is less than 255 sessions. 
- Run the script on your VM. These values can also be entered during runtime of the script.

## Troubleshoot CRC protection on host clients

> [!NOTE]
> CRC protection feature isn't currently available in North Europe and South Central US.

The multi-session connection scripts in the [Windows](elastic-san-connect-windows.md) or [Linux](elastic-san-connect-Linux.md) Elastic SAN connection articles set CRC-32C on header and data digests for your connections automatically. But, you can do it manually if you need to. On Windows, you can do this by setting header or data digests to 1 during login to the Elastic SAN volumes (`LoginTarget` and `PersistentLoginTarget`). On Linux, you can do this by updating the global iSCSI configuration file (iscsid.conf, generally found in /etc/iscsi directory). When a volume is connected, a node is created along with a configuration file specific to that node (for example, on Ubuntu it can be found in /etc/iscsi/nodes/$volume_iqn/portal_hostname,$port directory) inheriting the settings from global configuration file. If you have already connected volumes to your client before updating your global configuration file, update the node specific configuration file for each volume directly, or using the following command:

Variables:
- $volume_iqn: Elastic SAN volume IQN
- $portal_hostname: Elastic SAN volume portal hostname
- $port: 3260
- $iscsi_setting_name: node.conn[0].iscsi.HeaderDigest (or) node.conn[0].iscsi.DataDigest 
- $setting_value: CRC32C


```sudo iscsiadm -m node -T $volume_iqn -p $portal_hostname:$port -o update -n $iscsi_setting_name -v $setting_value```


## Next steps
- [Deploy an Elastic SAN](elastic-san-create.md)
- [Connect to Windows](elastic-san-connect-windows.md)
- [Connect to Linux](elastic-san-connect-linux.md)
- [Use Azure VMware Solution with Azure Elastic SAN](../../azure-vmware/configure-azure-elastic-san.md?toc=/azure/storage/elastic-san/toc.json)