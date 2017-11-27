---
title: Azure Site Recovery deployment planner generate report details for  Hyper-V-to-Azure| Microsoft Docs
description: This article describes how to generate report  using Azure Site Recovery deployment planner for Hyper-V to Azure scenario.
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

# Generate report for Hyper-V to Azure scenario

The tool generates a macro-enabled Microsoft Excel file (XLSM file) as the report output, which summarizes all the deployment recommendations. The report is named DeploymentPlannerReport_<unique numeric identifier>.xlsm and placed in the specified directory.
After profiling is complete, you can run the tool in report-generation mode. 

## Command-line parameters
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
|-OfferId|(Optional) The offer associated with the give subscription.
Default is MS-AZR-0003P (Pay-As-You-Go).|
|-Currency|(Optional) The currency in which cost is shown in the generated report. Default is US Dollar ($) or the last used currency.<br>Refer to https://aka.ms/asr-dp-supported-currencies for the list of supported currencies.|

## Examples

### Example 1: Generate a report with default values when the profiled data is on the local drive
```
ASRDeploymentPlanner.exe -Operation GenerateReport -virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt”
```

### Example 2: Generate a report when the profiled data is on a remote server
You should have read/write access on the remote directory.
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V - -Directory “\\PS1-W2K12R2\Hyper-V_ProfiledData” -VMListFile “\\PS1-W2K12R2\vCenter1_ProfiledData\ProfileVMList1.txt”
```

### Example 3: Generate a report with a specific bandwidth that you will be provision for the replication
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt” -Bandwidth 100
```

### Example 4: Generate a report with a 5 percent growth factor instead of the default 30 percent 
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt” -GrowthFactor 5
```

### Example 5: Generate a report with a subset of profiled data
For example, you have 30 days of profiled data and want to generate a report for only 20 days.
```
ASRDeploymentPlanner.exe -Operation GenerateReport -virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt” -StartDate  01-10-2017:12:30 -EndDate 01-19-2017:12:30
```

### Example 6: Generate a report for 5 minutes RPO
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt”  -DesiredRPO 5
```

### Example 7: Generate a report for North Europe Azure region with British Pound and specific offer ID
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V -Directory “E:\Hyper-V_ProfiledData” -VMListFile “E:\Hyper-V_ProfiledData\ProfileVMList1.txt”  -SubscriptionID 4d19f16b-3e00-4b89-a2ba-8645edf42fe5 -OfferID “MS-ASR-0148P” -TargetRegion NorthEurope -Currency GBP
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
* The resulting increased churn on the VM will require the VM to go to premium storage so that Site Recovery replication can keep pace.
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


## Next steps
* [Learn more](site-recovery-hyper-v-deployment-planner-recommendations.md) about recommendations provided by the generated Microsoft Excel report.
* Learn more about [get throughput](site-recovery-hyper-v-deployment-planner-get-throughput.md)