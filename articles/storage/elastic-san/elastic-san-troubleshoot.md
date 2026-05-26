---
title: Troubleshoot Azure Elastic SAN
description: Troubleshoot issues with Azure Elastic SAN
author: adarshv98
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 01/08/2026
ms.author: rogarana
# Customer intent: As a system administrator managing Azure Elastic SAN, I want to troubleshoot common connectivity and performance issues, so that I can ensure optimal functionality and address any disruptions in service for my workloads.
---

# Troubleshoot Elastic SAN

This article lists common issues related to Azure Elastic SAN. It also provides possible causes and resolutions for these issues.

## Encountered get_iqns timeout error with Linux documentation script - Exception: Command took longer than 10 s

- Install the latest Azure CLI, and follow the instructions that work for your Virtual Machine (VM) SKU.
- Once you install the latest version, run `az extension add -n elastic-san` to install the extension for Elastic SAN. 
- Run the `az login` command and follow the steps that command generates to sign in through your browser.
- Rerun the Linux documentation script and check if the issue persists.

## Encountered login rejected error - iscsiadm: Cannot modify node.conn[0].iscsi.DataDigest. Invalid param name

- Ensure the private endpoint or service endpoint is configured correctly 
- Check if your volumes are connecting to Azure VMware Solution (AVS), as Cyclic Redundancy Check (CRC) isn't supported yet for AVS.
- If not, check if your VM is running Fedora or its downstream Linux distributions like Red Hat Enterprise Linux, CentOS, or Rocky Linux that don't support data digests. 
- If either of the previous scenarios are true, disable the CRC protection flag. Uncheck the box on the portal and change the parameter for `EnforceDataIntegrityCheckForIscsi` (PowerShell) or `data-integrity-check` (CLI) to false


## Elastic SAN volume performance or latency isn't as expected

- Check your SAN size and configuration via portal (SAN homepage -> Configuration blade) and ensure that the I/O per second (IOPS) and throughput numbers can handle the requirements of the workload
- Check your VM throughput and IOPS limits and ensure that the VM can handle the workload requirements
- Ensure that you're following the best practices outlined in [Optimize the performance of your Elastic SAN](elastic-san-best-practices.md). 


## Unable to establish connectivity from new nodes in a cluster

- Identify which VMs are part of the cluster.
- Check the number of sessions per node by using `iscsicli sessionList` or `mpclaim -s -d` (for Windows) or `sudo multipath -ll` (for Linux) on each VM in the cluster. Add up the total number of sessions.
- After doing so, if the number of sessions reaches 128, disconnect the volumes through the portal or by using the script linked [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/disconnect.ps1) for Windows or [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/CLI%20(Linux)%20Multi-Session%20Connect%20Scripts/disconnect_for_documentation.py) for Linux.  
- Next, modify the `NumSession` parameter (Windows) or the `num_of_sessions` parameter (Linux) of the connect script from either the portal or the [Windows](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/connect.ps1) or [Linux](https://github.com/Azure-Samples/azure-elastic-san/blob/main/CLI%20(Linux)%20Multi-Session%20Connect%20Scripts/connect_for_documentation.py) scripts. Ensure that the total number of sessions across volumes is less than 128. 
- Run the script on your VM. You can also enter these values during runtime of the script.

## Unable to connect to more than eight volumes to a Windows VM

- To see the number of sessions on your Windows VM, run `iscsicli sessionList` or `mpclaim -s -d`. The maximum session limit is 255 for Windows VMs.
- If you're at the session limit, disconnect the volumes either through the portal or by using the script linked [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/disconnect.ps1). 
- Next, modify the `$NumSession` parameter of the connect script from either the portal or by using the [Windows](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/connect.ps1) script. Ensure that the total number of sessions per volume attached to the VM is less than 255 sessions. 
- Run the script on your VM. You can also enter these values during runtime of the script.

## Troubleshoot CRC protection on host clients

> [!NOTE]
> CRC protection feature isn't currently available in North Europe and South Central US.

The multi-session connection scripts in the [Windows](elastic-san-connect-windows.md) or [Linux](elastic-san-connect-Linux.md) Elastic SAN connection articles automatically set CRC-32C on header and data digests for your connections. But, you can set it manually if you need to. On Windows, set header or data digests to 1 during authentication to the Elastic SAN volumes (`LoginTarget` and `PersistentLoginTarget`). On Linux, update the global iSCSI configuration file (iscsid.conf, generally found in the /etc/iscsi directory). When you connect a volume, you create a node along with a configuration file specific to that node. For example, on Ubuntu it can be found in `/etc/iscsi/nodes/$volume_iqn/portal_hostname,$port` directory. This configuration file inherits the settings from the global configuration file. If you already connected volumes to your client before updating your global configuration file, update the node specific configuration file for each volume directly, or use the following command:

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