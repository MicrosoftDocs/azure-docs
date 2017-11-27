---
title: Azure Site Recovery deployment planner profiling details for VMware to Azure and Hyper-V-to-Azure| Microsoft Docs
description: This article explains how to profile Hyper-V VMs using Azure Site Recovery deployment planner for Hyper-V to Azure scenario.
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

# Profile Hyper-V VMs using Site Recovery deployment planner

In profiling mode, the deployment planner tool connects to each of the Hyper-V hosts to collect performance data about the VMs. 

* Profiling does not affect the performance of the production VMs because no direct connection is made to them. All performance data is collected from the Hyper-V host.
* The tool queries the Hyper-V host once every 15 seconds to ensure profiling accuracy and stores the average of every minute’s performance counter data.

## Get VM list to profile

Refer to [GetVMList](site-recovery-hyper-v-deployment-planner-getvmlist.md) operation to create a list of VMs to profile

After you have the list of VMs to be profiled, you can run the tool in profiling mode. 

## Command-line parameters for profiling
Here is the list of mandatory and optional parameters of the tool to run in profiling mode. The tool is common for both VMware to Azure and Hyper-V to Azure scenario. The following parameters are applicable for Hyper-V. 

ASRDeploymentPlanner.exe -Operation StartProfiling /?

| Parameter name | Description |
|---|---|
| -Operation | StartProfiling |
| -User | User name to connect to the Hyper-V host or Hyper-V cluster. User needs to have administrative access.|
| -VMListFile | The file with the list of VMs to be profiled. The file path can be absolute or relative. For Hyper-V, this is the output file of the GetVMList operation. If you are preparing manually, the file should contain one server name or IP address followed by VM name separated by a \ per line. VM name specified in the file should be the same as the VM name on the Hyper-V host.<ul><br>Example: File "VMList.txt" contains the following VMs:<ul><li>Host_1\VM_A</li><li>10.8.59.27\VM_B</li><li>Host_2\VM_C\</li><ul>
|-NoOfMinutesToProfile|The number of minutes for which profiling is to be run. Minimum is 30 minutes.|
|-NoOfHoursToProfile|The number of hours for which profiling is to be run.|
|-NoOfDaysToProfile |The number of days for which profiling is to be run. It is recommended to run profiling for more than 31 days to ensure that the workload pattern in your environment over the specified period is observed and used to provide an accurate recommendation.|
|-Virtualization|Specify the virtualization type (VMware or Hyper-V).|
|-Directory|(Optional) The universal naming convention (UNC) or local directory path to store profiling data generated during profiling. If not given, the directory named 'ProfiledData' under the current path will be used as the default directory.|
|-Password|(Optional) The password to connect to Hyper-V host. If not specified now, you will be prompted for it later during the execution of the command.|
|-StorageAccountName|(Optional) The storage-account name that's used to find the throughput achievable for replication of data from on-premises to Azure. The tool uploads test data to this storage account to calculate throughput.|
|-StorageAccountKey|(Optional) The storage-account key that's used to access the storage account. Go to the Azure portal > Storage accounts > <Storage account name> > Settings > Access Keys > Key1 (or primary access key for classic storage account).|
|-Environment|(optional) This is your target Azure Storage account environment. This can be one of three values - AzureCloud,AzureUSGovernment, AzureChinaCloud. Default is AzureCloud. Use the parameter when your target Azure region is either Azure US Government or Azure China clouds.|

We recommend that you profile your VMs for at least 15 to 31 days. During the profiling period, ASRDeploymentPlanner.exe keeps running. The tool takes profiling time input in days. For a quick test of the tool or for proof of concept you can profile for few hours or minutes. The minimum allowed profiling time is 30 minutes. 

During profiling, you can optionally pass a storage-account name and key to find the throughput that Site Recovery can achieve at the time of replication from the Hyper-V server to Azure. If the storage account name and key are not passed during profiling, the tool does not calculate achievable throughput.

You can run multiple instances of the tool for various sets of VMs. Ensure that the VM names are not repeated in any of the profiling sets. For example, if you have profiled 10 VMs (VM1 through VM10) and after few days you want to profile another five VMs (VM11 through VM15), you can run the tool from another command-line console for the second set of VMs (VM11 through VM15). Ensure that the second set of VMs do not have any VM names from the first profiling instance or you use a different output directory for the second run. If two instances of the tool are used for profiling the same VMs and use the same output directory, the generated report will be incorrect. 

VM configurations are captured once at the beginning of the profiling operation and stored in a file called VMDetailList.xml. This information is used when the report is generated. Any change in VM configuration (for example, an increased number of cores, disks, or NICs) from the beginning to the end of profiling is not captured. If a profiled VM configuration has changed during profiling, here is the workaround to get latest VM details when generating the report:

* Back up VMdetailList.xml and delete the file from its current location.
* Pass -User and -Password arguments at the time of report generation

The profiling command generates several files in the profiling directory. Do not delete any of the files, because doing so affects report generation.

## Examples

### Example 1: Profile VMs for 30 days, and find the throughput from on-premises to Azure
```
ASRDeploymentPlanner.exe -Operation StartProfiling -virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt”  -NoOfDaysToProfile 30 -User Contoso\HyperVUser1 -StorageAccountName  asrspfarm1 -StorageAccountKey Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
```

### Example 2: Profile VMs for 15 days
```
ASRDeploymentPlanner.exe -Operation StartProfiling -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\vCenter1_ProfiledData\ProfileVMList1.txt”  -NoOfDaysToProfile  15  -User contoso\HypreVUser1
```

### Example 3: Profile VMs for 60 minutes for a quick test of the tool
```
ASRDeploymentPlanner.exe -Operation StartProfiling -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt”  -NoOfMinutesToProfile 60 -User Contoso\HyperVUser1
```

### Example 4: Profile VMs for 2 hours for a proof of concept
```
ASRDeploymentPlanner.exe -Operation StartProfiling -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt”  -NoOfHoursToProfile 2 -User Contoso\HyperVUser1
```

>[NOTE!]
>
* If the server that the tool is running on is rebooted or has crashed, or if you close the tool by using Ctrl + C, the profiled data is preserved. However, there is a chance of missing the last 15 minutes of profiled data. In such cases, rerun the tool in profiling mode after the server restarts.
* When the storage-account name and key are passed, the tool measures the throughput at the last step of profiling. If the tool is closed before profiling is completed, the throughput is not calculated. To find the throughput before generating the report, you can run the GetThroughput operation from the command-line console. Otherwise, the generated report will not contain throughput information.
* Azure Site Recovery does not support VMs that have iSCSI and pass-through disks. However, the tool cannot detect, and profile iSCSI and pass-through disks attached to VMs.

## Next steps
Learn more about [generate report](site-recovery-hyper-v-deployment-planner-generate-report.md).







 

