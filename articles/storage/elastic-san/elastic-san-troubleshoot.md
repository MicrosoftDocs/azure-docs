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

## Common Azure Elastic SAN errors

***Encountered get_iqns timeout error with Linux documentation script - Exception: Command took longer than 10 s***

- Install the latest Azure CLI, and follow the instructions that work for your Virtual Machine (VM) SKU.
- Once you install the latest version, run az extension add -n elastic-san to install the extension for Elastic SAN. 
- Run the az login command and follow the steps that command generates to log in through your browser.
- Rerun the Linux documentation script and check if the issue persists.

***Encountered login rejected error - iscsiadm: Cannot modify node.conn[0].iscsi.DataDigest. Invalid param name.***

- Ensure the private endpoint or service endpoint is configured correctly 
- Check if your volumes are connecting to Azure VMware Solution (AVS), as Cyclic Redundancy Check (CRC) isn't supported yet for AVS.
- If not, check if your VM is running Fedora or its downstream Linux distributions like Red Hat Enterprise Linux, CentOS, or Rocky Linux that don't support data digests. 
- If either of the above scenarios is true, disable the CRC protection flag. You have to uncheck the box on portal and change the parameter for EnforceDataIntegrityCheckForIscsi (PowerShell)) or data-integrity-check (CLI) to false.

***Unable to connect to your Elastic SAN via service endpoints***

- [Enable](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-networking?tabs=azure-powershell#configure-public-network-access) Public Network Access on the SAN 
```powershell
# Set the variable values.
$RgName       = "<ResourceGroupName>"
$EsanName     = "<ElasticSanName>"
# Update the Elastic San.
Update-AzElasticSan -Name $EsanName -ResourceGroupName $RgName -PublicNetworkAccess Enabled
```
- [Configure](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-networking?tabs=azure-powershell#configure-an-azure-storage-service-endpoint) service endpoints on the volume group 
```powershell
# Define some variables
$RgName = "<ResourceGroupName>" 
$VnetName = "<VnetName>" 
$SubnetName = "<SubnetName>" 
# Get the virtual network and subnet 
$Vnet = Get-AzVirtualNetwork -ResourceGroupName $RgName -Name $VnetName $Subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $Vnet -Name $SubnetName 
# Enable the storage service endpoint 
$Vnet | Set-AzVirtualNetworkSubnetConfig -Name $SubnetName -AddressPrefix $Subnet.AddressPrefix -ServiceEndpoint "Microsoft.Storage.Global" | Set-AzVirtualNetwork
```

***Elastic SAN volume performance or latency isn't as expected***

- Check your SAN size and configuration via portal (SAN homepage -> Configuration blade) and ensure that the I/O per second (IOPS) and throughput numbers can handle the requirements of the workload
-  Check your VM throughput and IOPS limits and ensure that the VM can handle the workload requirements
- Ensure that you're following the best practices outlined in this [document](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-best-practices). 


***Unable to establish connectivity from new nodes in a cluster***

- Identify which VMs are part of the cluster.
- Check the number of sessions per node using `iscsicli sessionList` or `mpclaim -s -d` (for Windows) or sudo multipath -ll (for Linux) on each VM in the cluster and add up the total number of sessions
- After doing so, if the # of sessions are 128 then you can disconnect the volumes via portal or using the script linked [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/disconnect.ps1) for Windows or [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/CLI%20(Linux)%20Multi-Session%20Connect%20Scripts/disconnect_for_documentation.py) for Linux. 
- Next, modify the NumSession parameter (Windows) or the num_of_sessions parameter (Linux) of the connect script from either from the portal or the [Windows](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/connect.ps1) or [Linux](https://github.com/Azure-Samples/azure-elastic-san/blob/main/CLI%20(Linux)%20Multi-Session%20Connect%20Scripts/connect_for_documentation.py) scripts. You need to ensure that the total number of sessions across volumes is less than 128. 
- Run the script on your VM. These values can also be entered during runtime of the script.

***Unable to connect to more than eight volumes to a Windows VM***

- To see the number of sessions on your Windows VM, run `iscsicli sessionList` or `mpclaim -s -d`. The maximum session limit is 255 for Windows VMs.
- If you are at the session limit, then you can disconnect the volumes either via portal or using the script linked [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/disconnect.ps1). 
- Next, modify the $NumSession parameter of the connect script from either the portal or using the [Windows](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/connect.ps1) script. You need to ensure that the total number of sessions per volume attached to the VM is less than 255 sessions. 
- Run the script on your VM. These values can also be entered during runtime of the script.

## Next steps
- [Deploy an Elastic SAN](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-create)
- [Connect to Windows](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-connect-windows)
- [Connect to Linux](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-connect-linux)
- [Connect to Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/configure-azure-elastic-san?toc=/azure/storage/elastic-san/toc.json)

