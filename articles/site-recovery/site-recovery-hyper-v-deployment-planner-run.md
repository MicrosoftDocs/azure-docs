---
title: Azure Site Recovery deployment planner for Hyper-V-to-Azure| Microsoft Docs
description: This article describes the mode of runnign Azure Site Recovery deployment planner for Hyper-V to Azure scenario.
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
ms.date: 11/29/2017
ms.author: nisoneji

---
# Run Azure Site Recovery deployment planner for Hyper-V to Azure

## Modes of running deployment planner
You can run the command-line tool (ASRDeploymentPlanner.exe) in any of the following four modes: 
1.	[Get VM list](site-recovery-hyper-v-deployment-planner-getvmlist.md).
2.	[Profiling](site-recovery-hyper-v-deployment-planner-profiling.md)
3.	[Report generation](site-recovery-hyper-v-deployment-planner-generate-report.md)
4.	[Get throughput](site-recovery-hyper-v-deployment-planner-get-throughput.md)

First, run the tool to get the list of VMs from a single or multiple Hyper-V hosts.  Then run the tool in profiling mode to gather VM data churn and IOPS. Next, run the tool to generate the report to find the network bandwidth and storage requirements.

## Get VM list for profiling Hyper-V VMs

First, you need a list of the VMs to be profiled. Use GetVMList mode of the deployment planner tool to generate the list of VMs present on multiple Hyper-V hosts in a single command. Once you generate the complete list, you can remove VMs that you don’t want to profile from the output file. Then use the output file for all other operations - profiling, report generation and get throughput.

You can generate the VM list pointing the tool to a Hyper-V cluster or a standalone Hyper-V host or a combination of all.

### Command-line parameters
The following table contains a list of mandatory and optional parameters of the tool to run in GetVMList mode. 
```
ASRDeploymentPlanner.exe -Operation GetVMList /?
```
| Parameter name | Description |
|---|---|
| -Operation | GetVMList |
| -User | User name to connect to the Hyper-V host or Hyper-V cluster. User needs to have administrative access.|
|-ServerListFile | The file with the list of servers containing the VMs to be profiled. The file path can be absolute or relative. This file should contain one of the following in each line:<ul><li>Hyper-V host name or IP address</li><li>Hyper-V cluster name or IP address</li></ul><br>Example: File "ServerList.txt" contains the following servers:<ul><li>Host_1</li><li>10.8.59.27</li><li>Cluster_1</li><li>Host_2</li>|
| -Directory|(Optional) The universal naming convention (UNC) or local directory path to store data generated during this operation. If not given, the directory named 'ProfiledData' under the current path is used as the default directory.|
|-OutputFile| (Optional) The file where the list of VMs fetched from the given Hyper-V servers is saved. If name is not mentioned, the details would be stored in "VMList.txt".  Use the file to start profiling after removing VMs that don't need to be profiled.|
|-Password|(Optional) Password to connect to the Hyper-V host.   If the password isn't specified as a parameter, you will be prompted for it later when the command is executed.|

### How does GetVMList discovery work?
**Hyper-V cluster**: When Hyper-V cluster name is given in the servers list file, the tool finds all the Hyper-V nodes of the cluster and gets the VMs present on each of the Hyper-V hosts.

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

## Profile Hyper-V VMs

In profiling mode, the deployment planner tool connects to each of the Hyper-V hosts to collect performance data about the VMs. 

* Profiling does not affect the performance of the production VMs because no direct connection is made to them. All performance data is collected from the Hyper-V host.
* The tool queries the Hyper-V host once every 15 seconds to ensure profiling accuracy and stores the average of every minute’s performance counter data.

### Get VM list to profile

Refer to [GetVMList](site-recovery-hyper-v-deployment-planner-getvmlist.md) operation to create a list of VMs to profile

After you have the list of VMs to be profiled, you can run the tool in profiling mode. 

### Command-line parameters
The following table contains a list of mandatory and optional parameters of the tool to run in profiling mode. The tool is common for both VMware to Azure and Hyper-V to Azure scenarios. The following parameters are applicable for Hyper-V. 
```
ASRDeploymentPlanner.exe -Operation StartProfiling /?
```
| Parameter name | Description |
|---|---|
| -Operation | StartProfiling |
| -User | User name to connect to the Hyper-V host or Hyper-V cluster. User needs to have administrative access.|
| -VMListFile | The file with the list of VMs to be profiled. The file path can be absolute or relative. For Hyper-V, this file is the output file of the GetVMList operation. If you are preparing manually, the file should contain one server name or IP address followed by VM name separated by a \ per line. VM name specified in the file should be the same as the VM name on the Hyper-V host.<ul>Example: File "VMList.txt" contains the following VMs:<ul><li>Host_1\VM_A</li><li>10.8.59.27\VM_B</li><li>Host_2\VM_C</li><ul>|
|-NoOfMinutesToProfile|The number of minutes for which profiling is to be run. Minimum is 30 minutes.|
|-NoOfHoursToProfile|The number of hours for which profiling is to be run.|
|-NoOfDaysToProfile |The number of days for which profiling is to be run. It is recommended to run profiling for at least 15 to 31 days to ensure that the workload pattern in your environment over the specified period is observed and used to provide an accurate recommendation.|
|-Virtualization|Specify the virtualization type (VMware or Hyper-V).|
|-Directory|(Optional) The universal naming convention (UNC) or local directory path to store profiling data generated during profiling. If not given, the directory named 'ProfiledData' under the current path will be used as the default directory.|
|-Password|(Optional) The password to connect to Hyper-V host. If not specified now, you will be prompted for it later during the execution of the command.|
|-StorageAccountName|(Optional) The storage-account name that's used to find the throughput achievable for replication of data from on-premises to Azure. The tool uploads test data to this storage account to calculate throughput.|
|-StorageAccountKey|(Optional) The storage-account key that's used to access the storage account. Go to the Azure portal > Storage accounts > <Storage account name> > Settings > Access Keys > Key1 (or primary access key for classic storage account).|
|-Environment|(Optional) This is your target Azure Storage account environment. This can be one of three values - AzureCloud,AzureUSGovernment, AzureChinaCloud. Default is AzureCloud. Use the parameter when your target Azure region is either Azure US Government or Azure China clouds.|

We recommend that you profile your VMs for at least 15 to 31 days. During the profiling period, ASRDeploymentPlanner.exe keeps running. The tool takes profiling time input in days. For a quick test of the tool or for proof of concept you can profile for few hours or minutes. The minimum allowed profiling time is 30 minutes. 

During profiling, you can optionally pass a storage-account name and key to find the throughput that Azure Site Recovery can achieve at the time of replication from the Hyper-V server to Azure. If the storage account name and key are not passed during profiling, the tool does not calculate achievable throughput.

You can run multiple instances of the tool for various sets of VMs. Ensure that the VM names are not repeated in any of the profiling sets. For example, if you have profiled 10 VMs (VM1 through VM10) and after few days you want to profile another five VMs (VM11 through VM15), you can run the tool from another command-line console for the second set of VMs (VM11 through VM15). Ensure that the second set of VMs do not have any VM names from the first profiling instance or you use a different output directory for the second run. If two instances of the tool are used for profiling the same VMs and use the same output directory, the generated report will be incorrect. 

VM configurations are captured once at the beginning of the profiling operation and stored in a file called VMDetailList.xml. This information is used when the report is generated. Any change in VM configuration (for example, an increased number of cores, disks, or NICs) from the beginning to the end of profiling is not captured. If a profiled VM configuration has changed during profiling, here is the workaround to get latest VM details when generating the report:

* Back up VMdetailList.xml and delete the file from its current location.
* Pass -User and -Password arguments at the time of report generation

The profiling command generates several files in the profiling directory. Do not delete any of the files, because doing so affects report generation.

### Examples

#### Example 1: Profile VMs for 30 days, and find the throughput from on-premises to Azure
```
ASRDeploymentPlanner.exe -Operation StartProfiling -virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt”  -NoOfDaysToProfile 30 -User Contoso\HyperVUser1 -StorageAccountName  asrspfarm1 -StorageAccountKey Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
```

#### Example 2: Profile VMs for 15 days
```
ASRDeploymentPlanner.exe -Operation StartProfiling -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\vCenter1_ProfiledData\ProfileVMList1.txt”  -NoOfDaysToProfile  15  -User contoso\HypreVUser1
```

#### Example 3: Profile VMs for 60 minutes for a quick test of the tool
```
ASRDeploymentPlanner.exe -Operation StartProfiling -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt”  -NoOfMinutesToProfile 60 -User Contoso\HyperVUser1
```

#### Example 4: Profile VMs for 2 hours for a proof of concept
```
ASRDeploymentPlanner.exe -Operation StartProfiling -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt”  -NoOfHoursToProfile 2 -User Contoso\HyperVUser1
```

>[NOTE!]
>
* If the server that the tool is running on is rebooted or has crashed, or if you close the tool by using Ctrl + C, the profiled data is preserved. However, there is a chance of missing the last 15 minutes of profiled data. In such cases, rerun the tool in profiling mode after the server restarts.
* When the storage-account name and key are passed, the tool measures the throughput at the last step of profiling. If the tool is closed before profiling is completed, the throughput is not calculated. To find the throughput before generating the report, you can run the GetThroughput operation from the command-line console. Otherwise, the generated report will not contain throughput information.
* Azure Site Recovery does not support VMs that have iSCSI and pass-through disks. However, the tool cannot detect, and profile iSCSI and pass-through disks attached to VMs.

## Generate report

The tool generates a macro-enabled Microsoft Excel file (XLSM file) as the report output, which summarizes all the deployment recommendations. The report is named DeploymentPlannerReport_<unique numeric identifier>.xlsm and placed in the specified directory.
After profiling is complete, you can run the tool in report-generation mode. 

### Command-line parameters
The following table contains a list of mandatory and optional tool parameters to run in report-generation mode. The tool is common for both VMware to Azure and Hyper-V to Azure scenarios. The following parameters are applicable for Hyper-V.
```
ASRDeploymentPlanner.exe -Operation GenerateReport /?
```
| Parameter name | Description |
|---|---|
| -Operation | GenerateReport |
|-VMListFile | The file that contains the list of profiled VMs that the report is to be generated for. The file path can be absolute or relative. For Hyper-V, this file is the output file of the GetVMList operation. If you are preparing manually, the file should contain one server name or IP address followed by VM name separated by a \ per line. VM name specified in the file should be the same as the VM name on the Hyper-V host.<ul>Example: File "VMList.txt" contains the following VMs:<ul><li>Host_1\VM_A</li><li>10.8.59.27\VM_B</li><li>Host_2\VM_C</li><ul>|
|-Virtualization|Specify the virtualization type (VMware or Hyper-V).|
|-Directory|(Optional) The universal naming convention (UNC) or local directory path where the profiled data (files generated during profiling) is stored. This data is required for generating the report. If a name isn't specified, the directory named 'ProfiledData' under the current path will be used as the default directory.|
| -User | (Optional) User name to connect to the Hyper-V host or Hyper-V cluster. User needs to have administrative access.<br>User and password are used to fetch the latest configuration information of the VMs like number of disks, number of cores, number of NICs, etc. to use in the report. If not provided, configuration information collected during profiling is used.|
|-Password|(Optional) The password to connect to Hyper-V host. If not specified now, you will be prompted for it later during the execution of the command.|
| -DesiredRPO | (Optional) The desired recovery point objective, in minutes. The default is 15 minutes.|
| -StartDate | (Optional) The start date and time in MM-DD-YYYY:HH:MM (24-hour format). *StartDate* must be specified along with *EndDate*. When StartDate is specified, the report is generated for the profiled data that's collected between StartDate and EndDate. |
| -EndDate | (Optional) The end date and time in MM-DD-YYYY:HH:MM (24-hour format). *EndDate* must be specified along with *StartDate*. When EndDate is specified, the report is generated for the profiled data that's collected between StartDate and EndDate. |
| -GrowthFactor | (Optional) The growth factor, expressed as a percentage. The default is 30 percent. |
| -UseManagedDisks | (Optional) UseManagedDisks - Yes/No. Default is Yes. The number of virtual machines that can be placed into a single storage account is calculated considering whether Failover/Test failover of virtual machines is done on managed disk instead of unmanaged disk. |
|-SubscriptionId |(Optional) The subscription GUID. Use this parameter to generate the cost estimation report with the latest price based on your subscription, the offer that is associated with your subscription and for your specific target Azure region in the specified currency.|
|-TargetRegion|(Optional) The Azure region where replication is targeted. Since Azure has different costs per region, to generate report with specific target Azure region use this parameter.<br>Default is WestUS2 or the last used target region.<br>Refer to https://aka.ms/asr-dp-supported-azure-regions  for the list of supported target regions.|
|-OfferId|(Optional) The offer associated with the give subscription. Default is MS-AZR-0003P (Pay-As-You-Go).|
|-Currency|(Optional) The currency in which cost is shown in the generated report. Default is US Dollar ($) or the last used currency.<br>Refer to https://aka.ms/asr-dp-supported-currencies for the list of supported currencies.|

### Examples

#### Example 1: Generate a report with default values when the profiled data is on the local drive
```
ASRDeploymentPlanner.exe -Operation GenerateReport -virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt”
```

#### Example 2: Generate a report when the profiled data is on a remote server
You should have read/write access on the remote directory.
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V - -Directory “\\PS1-W2K12R2\Hyper-V_ProfiledData” -VMListFile “\\PS1-W2K12R2\vCenter1_ProfiledData\ProfileVMList1.txt”
```

#### Example 3: Generate a report with a specific bandwidth that you will be provision for the replication
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt” -Bandwidth 100
```

#### Example 4: Generate a report with a 5 percent growth factor instead of the default 30 percent 
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt” -GrowthFactor 5
```

#### Example 5: Generate a report with a subset of profiled data
For example, you have 30 days of profiled data and want to generate a report for only 20 days.
```
ASRDeploymentPlanner.exe -Operation GenerateReport -virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt” -StartDate  01-10-2017:12:30 -EndDate 01-19-2017:12:30
```

#### Example 6: Generate a report for 5 minutes RPO
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt”  -DesiredRPO 5
```

#### Example 7: Generate a report for South India Azure region with Indian Rupee and specific offer ID
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt”  -SubscriptionID 4d19f16b-3e00-4b89-a2ba-8645edf42fe5 -OfferID MS-AZR-0148P -TargetRegion southindia -Currency INR
```

## Percentile value used for the calculation
**What default percentile value of the performance metrics collected during profiling does the tool use when it generates a report?**

The tool defaults to the 95th percentile values of read/write IOPS, write IOPS, and data churn that are collected during profiling of all the VMs. This metric ensures that the 100th percentile spike your VMs might see because of temporary events is not used to determine your target storage account and source bandwidth requirements. For example, a temporary event might be a backup job running once a day, a periodic database indexing or analytics report generation activity, or other similar short-lived, point-in-time events.

Using 95th percentile values gives a true picture of real workload characteristics, and it gives you the best performance when the workloads are running on Azure. We do not anticipate that you would need to change this number. If you do change the value (to 90th percentile, for example), you can update the configuration file ASRDeploymentPlanner.exe.config in the default folder and save it to generate a new report on the existing profiled data.
```
<add key="WriteIOPSPercentile" value="95" />      
<add key="ReadWriteIOPSPercentile" value="95" />      
<add key="DataChurnPercentile" value="95" />
```

## Growth factor considerations
**Why should I consider growth factor when I plan deployments?**
It is critical to account for growth in your workload characteristics, assuming a potential increase in usage over time. After protection is in place if your workload characteristics change, you cannot switch to a different storage account for protection without disabling and re-enabling the protection.

For example, let's say that today your VM fits in a standard storage replication account. Over the next three months, several changes are likely to occur:

* The number of users of the application that runs on the VM will increase.
* The resulting increased churn on the VM will require the VM to go to premium storage so that Azure Site Recovery replication can keep pace.
* Consequently, you will have to disable and re-enable protection to a premium storage account.

We strongly recommend that you plan for growth during deployment planning and while the default value is 30 percent, you are the expert on your application usage pattern and growth projections, and you can change this number accordingly while generating a report. Moreover, you can generate multiple reports with various growth factors with the same profiled data and determine what target storage and source bandwidth recommendations work best for you. 

The generated Microsoft Excel report contains the following information:

* [On-premises Summary](site-recovery-hyper-v-deployment-planner-on-premises-summary.md)
* [Recommendations](site-recovery-hyper-v-deployment-planner-recommendations.md)
* [VM<->Storage Placement](site-recovery-hyper-v-deployment-planner-vm-storage-placement.md)
* [Compatible VMs](site-recovery-hyper-v-deployment-planner-compatible-vms.md)
* [Incompatible VMs](site-recovery-hyper-v-deployment-planner-incompatible-vms.md)
* [On-premises Storage Requirement](site-recovery-hyper-v-deployment-planner-on-premises-storage-requirement.md)
* [IR Batching ](site-recovery-hyper-v-deployment-planner-ir-batchting.md)
* [Cost Estimation](site-recovery-hyper-v-deployment-planner-cost-estimation.md)


 ## Get throughput

To estimate the throughput that Azure Site Recovery can achieve from on-premises to Azure during replication, run the tool in GetThroughput mode. The tool calculates the throughput from the server that the tool is running on. Ideally, this server is the Hyper-V server whose VMs are to be protected. 

### Command-line parameters 
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
    
### Example
```
ASRDeploymentPlanner.exe -Operation GetThroughput -Virtualization Hyper-V -Directory E:\Hyp-erV_ProfiledData -VMListFile E:\Hyper-V_ProfiledData\ProfileVMList1.txt  -StorageAccountName  asrspfarm1 -StorageAccountKey by8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
```

[NOTE!]
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
* [Analyze the generated report](site-recovery-hyper-v-deployment-planner-analyze-report.md).