---
title: Azure Site Recovery deployment planner get throughtput details for  Hyper-V-to-Azure| Microsoft Docs
description: This article describes get throughput operation using Azure Site Recovery deployment planner for Hyper-V to Azure scenario.
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
ms.date: 11/27/2017
ms.author: nisoneji

---
# Ge throughput using Azure Site Recovery deployment planner

To estimate the throughput that Azure Site Recovery can achieve from on-premises to Azure during replication, run the tool in GetThroughput mode. The tool calculates the throughput from the server that the tool is running on. Ideally, this server is the Hyper-V server whose VMs are to be protected. 

## Command-line parameters 
Open a command-line console and go to the Azure Site Recovery deployment planning tool folder. Run ASRDeploymentPlanner.exe with the following parameters
```
ASRDeploymentPlanner.exe -Operation GetThroughput /?
```
 Parameter name | Description |
|---|---|
| -Operation | GetThroughtput |
|-Virtualization|Specify the virtualization type (VMware or Hyper-V).|
|-Directory|(Optional) The universal naming convention (UNC) or local directory path where the profiled data (files generated during profiling) is stored. This data is required for generating the report. If a name isn't specified, the directory named 'ProfiledData' under the current path will be used as the default directory.|
| -StorageAccountName | The storage-account name that's used to find the bandwidth consumed for replication of data from on-premises to Azure. The tool uploads test data to this storage account to find the bandwidth consumed. |
| -StorageAccountKey | The storage-account key that's used to access the storage account. Go to the Azure portal > Storage accounts > <*Storage account name*> > Settings > Access Keys > Key1.|
| -VMListFile | The file that contains the list of VMs to be profiled for calculating the bandwidth consumed. The file path can be absolute or relative. For Hyper-V, this file is the output file of the GetVMList operation. If you are preparing manually, the file should contain one server name or IP address followed by VM name separated by a \ per line. VM name specified in the file should be the same as the VM name on the Hyper-V host.<ul>Example: File "VMList.txt" contains the following VMs:<ul><li>Host_1\VM_A</li><li>10.8.59.27\VM_B</li><li>Host_2\VM_C</li><ul>|
|-Environment|(Optional) This is your target Azure Storage account environment. This can be one of three values - AzureCloud, AzureUSGovernment, AzureChinaCloud. Default is AzureCloud. Use the parameter when your target Azure region is either Azure US Government or Azure China clouds|


The tool creates several 64 MB asrvhdfile<#>.vhd files (where "#" is the number of files) on the specified directory. The tool uploads the files to the storage account to find the throughput. After the throughput is measured, the tool deletes all the files from the storage account and from the local server. If the tool is terminated for any reason while it is calculating throughput, it doesn't delete the files from the storage or from the local server. You will have to delete them manually.

The throughput is measured at a specified point in time, and it is the maximum throughput that Azure Site Recovery can achieve during replication, provided that all other factors remain the same. For example, if any application starts consuming more bandwidth on the same network, the actual throughput varies during replication. The result of the measured throughput is different if the GetThroughput operation is run when the protected VMs have high data churn. We recommend that you run the tool at various points in time during profiling to understand what throughput levels can be achieved at various times. In the report, the tool shows the last measured throughput.
    
## Example
```
ASRDeploymentPlanner.exe -Operation GetThroughput -Virtualization Hyper-V -Directory E:\Hyp-erV_ProfiledData -VMListFile E:\Hyper-V_ProfiledData\ProfileVMList1.txt  -StorageAccountName  asrspfarm1 -StorageAccountKey by8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
```

[!NOTE]
>
> Run the tool on a server that has the same storage and CPU characteristics as that of a Hyper-V server.
>
> For replication, set the recommended bandwidth to meet the RPO 100 percent of the time. After you set the right bandwidth, if you don’t see an increase in the achieved throughput reported by the tool, do the following:
>
>  1. Check to determine whether there is any network Quality of Service (QoS) that is limiting Azure Site Recovery throughput.
>
>  2. Check to determine whether your Azure Site Recovery vault is in the nearest physically supported Microsoft Azure region to minimize network latency.
>
>  3. Check your local storage characteristics to determine whether you can improve the hardware (for example, HDD to SSD).
>

## Next steps
[Learn more](site-recovery-hyper-v-deployment-planner-recommendations.md) about recommendations provided by the generated Microsoft Excel report.