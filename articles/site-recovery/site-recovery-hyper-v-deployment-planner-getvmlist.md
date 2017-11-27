---
title: Azure Site Recovery deployment planner capabilites for VMware to Azure and Hyper-V-to-Azure| Microsoft Docs
description: This article explains how to get list of Hyper-V VMs for profiling using Azure Site Recovery deployment planner for Hyper-V to Azure scenario.
services: site-recovery
documentationcenter: ''
author: nsoneji
manager: garavd
editor:

ms.assetid:
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 11/26/2017
ms.author: nisoneji

---

# Get VM list

First, you need a list of the VMs to be profiled. Use GetVMList mode of the deployment planner tool to generate the list of VMs present on multiple Hyper-V hosts in a single command. Once you generate the complete list, you can remove VMs that you don’t want to profile from the output file. Then use the output file for all other operations - profiling, report generation and get throughput.

You can generate the VM list pointing the tool to a Hyper-V cluster or a standalone Hyper-V host or a combination of all.

Here is the list of mandatory and optional parameters of the tool to run in GetVMList mode. 

ASRDeploymentPlanner.exe -Operation GetVMList /?

| Parameter name | Description |
|---|---|
| -Operation | GetVMList |
| -User | User name to connect to the Hyper-V host or Hyper-V cluster. User needs to have administrative access.|
|-ServerListFile | The file with the list of servers containing the VMs to be profiled. The file path can be absolute or relative. This file should contain one of the following in each line:<ul><li>Hyper-V host name or IP address</li><li>Hyper-V cluster name or IP address</li><br>Example: File "ServerList.txt" contains the following servers:<ul><li>Host_1</li><li>10.8.59.27</li><li>Cluster_1</li><li>Host_2</li>|
|-Virtualization |(Optional) Specify the virtualization type. Currently only 'Hyper-V' is supported for this operation.|
| -Directory|Optional) The universal naming convention (UNC) or local directory path to store data generated during this operation. If not given, the directory named 'ProfiledData' under the current path is used as the default directory.|
|-OutputFile| (Optional) The file where the list of VMs fetched from the given Hyper-V servers is saved. If name is not mentioned, the details would be stored in "VMList.txt".  Use the file to start profiling after removing VMs that don't need to be profiled.|
|-Password|Optional) Password to connect to the Hyper-V host.   If the password isn't specified as a parameter, you will be prompted for it later when the command is executed.|


## How does GetVMList discovery work?
**Hyper-V cluster**: When Hyper-V cluster name is given, the tool finds all the Hyper-V nodes of the cluster and gets the VMs present on each of the Hyper-V hosts.

**Hyper-V host**: When Hyper-V host name is given, the tool first checks if it belongs to a cluster. If yes, it fetches all the Hyper-V nodes name. It then gets the VMs from each Hyper-V host. 

You can also choose to list in a file the friendly names or IP addresses of the VMs that you want to profile manually.

Open the output file in Notepad, and then copy the names of all VMs that you want to profile to another file (for example, ProfileVMList.txt), one VM name per line. This file is used as input to the -VMListFile parameter of the tool for all other operations: profiling, report generation and get throughput.

### Example 1: To store the list of VMs in a file
```
ASRDeploymentPlanner.exe -Operation GetVMlist -ServerListFile “E:\Hyper-V_ProfiledData\ServerList.txt" -User Hyper-VUser1 -OutputFile "E:\Hyper-V_ProfiledData\VMListFile.txt"
```

### Example 2: To store the list of VMs at the default location i.e. -Directory path
```
ASRDeploymentPlanner.exe -Operation GetVMList -Directory "E:\Hyper-V_ProfiledData" -ServerListFile "E:\Hyper-V_ProfiledData\ServerList.txt" -User Hyper-VUser1
```

## Next steps
Learn more about how to [profile Hyper-V VMs](site-recovery-hyper-v-deployment-planner-profiling.md).