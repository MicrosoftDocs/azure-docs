---
title: Run the Azure Site Recovery Deployment Planner for Hyper-V disaster recovery to Azure| Microsoft Docs
description: This article describes how to run the Azure Site Recovery Deployment Planner for Hyper-V disaster recovery to Azure.
author: mayurigupta13
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 4/9/2019
ms.author: mayg
---



# Run the Azure Site Recovery deployment planner for Hyper-V disaster recovery to Azure

You can run the Site Recovery deployment planner command-line tool (ASRDeploymentPlanner.exe) in any of these four modes: 
-	Get the virtual machine (VM) list
-	[Profile](#profile-hyper-v-vms)
-	Generate a report
-	[Get throughput](#get-throughput)

First, run the tool to get the list of VMs from a single or multiple Hyper-V hosts. Then run the tool in profiling mode to gather VM data churn and IOPS. Next, run the tool to generate the report to find the network bandwidth and storage requirements.

## Get the VM list for profiling Hyper-V VMs
First, you need a list of the VMs to be profiled. Use the GetVMList mode of the deployment planner tool to generate the list of VMs present on multiple Hyper-V hosts in a single command. After you generate the complete list, you can remove VMs that you don’t want to profile from the output file. Then use the output file for all other operations: profiling, report generation, and getting throughput.

You can generate the VM list by pointing the tool to a Hyper-V cluster or a standalone Hyper-V host, or a combination of both.

### Command-line parameters
The following table contains a list of mandatory and optional parameters of the tool to run in GetVMList mode. 
```
ASRDeploymentPlanner.exe -Operation GetVMList /?
```

| Parameter name | Description |
|---|---|
| -Operation | GetVMList |
| -User | The username to connect to the Hyper-V host or Hyper-V cluster. The user needs to have administrative access.|
| -ServerListFile | The file with the list of servers that contain the VMs to be profiled. The file path can be absolute or relative. This file should contain one of the following in each line:<ul><li>Hyper-V host name or IP address</li><li>Hyper-V cluster name or IP address</li></ul><br>**Example:** ServerList.txt contains the following servers:<ul><li>Host_1</li><li>10.8.59.27</li><li>Cluster_1</li><li>Host_2</li>|
| -Directory|(Optional) The universal naming convention (UNC) or local directory path to store data generated during this operation. If a name is not specified, the directory named ProfiledData under the current path is used as the default directory.|
|-OutputFile| (Optional) The file with the list of VMs fetched from the Hyper-V servers is saved. If a name is not mentioned, the details are stored in VMList.txt.  Use the file to start profiling after removing VMs that don't need to be profiled.|
|-Password|(Optional) The password to connect to the Hyper-V host. If you don't specify it as a parameter, you will be prompted for it when you run the command.|

### GetVMList discovery

- **Hyper-V cluster**: When the Hyper-V cluster name is given in the server's list file, the tool finds all the Hyper-V nodes of the cluster and gets the VMs present on each of the Hyper-V hosts.
**Hyper-V host**: When the Hyper-V host name is given, the tool first checks if it belongs to a cluster. If yes, the tool fetches nodes that belong to the cluster. It then gets the VMs from each Hyper-V host. 

You can also choose to list in a file the friendly names or IP addresses of the VMs that you want to profile manually.

Open the output file in Notepad, and then copy the names of all VMs that you want to profile to another file (for example, ProfileVMList.txt). Use one VM name per line. This file is used as input to the -VMListFile parameter of the tool for all other operations: profiling, report generation, and getting throughput.

### Examples

#### Store the list of VMs in a file
```
ASRDeploymentPlanner.exe -Operation GetVMlist -ServerListFile "E:\Hyper-V_ProfiledData\ServerList.txt" -User Hyper-VUser1 -OutputFile "E:\Hyper-V_ProfiledData\VMListFile.txt"
```

#### Store the list of VMs at the default location (-Directory path)
```
ASRDeploymentPlanner.exe -Operation GetVMList -Directory "E:\Hyper-V_ProfiledData" -ServerListFile "E:\Hyper-V_ProfiledData\ServerList.txt" -User Hyper-VUser1
```

## Profile Hyper-V VMs
In profiling mode, the deployment planner tool connects to each of the Hyper-V hosts to collect performance data about the VMs. 

Profiling does not affect the performance of the production VMs because no direct connection is made to them. All performance data is collected from the Hyper-V host.

The tool queries the Hyper-V host once every 15 seconds to ensure profiling accuracy. It stores the average of every minute’s performance counter data.

The tool seamlessly handles VM migration from one node to another node in the cluster and storage migration within a host.

### Getting the VM list to profile
To create a list of VMs to profile, refer to the GetVMList operation.

After you have the list of VMs to be profiled, you can run the tool in profiling mode. 

### Command-line parameters
The following table lists mandatory and optional parameters of the tool to run in profiling mode. The tool is common for scenarios of moving from VMware to Azure and moving from Hyper-V to Azure. These parameters are applicable for Hyper-V. 
```
ASRDeploymentPlanner.exe -Operation StartProfiling /?
```

| Parameter name | Description |
|---|---|
| -Operation | StartProfiling |
| -User | The username to connect to the Hyper-V host or Hyper-V cluster. The user needs to have administrative access.|
| -VMListFile | The file with the list of VMs to be profiled. The file path can be absolute or relative. For Hyper-V, this file is the output file of the GetVMList operation. If you are preparing manually, the file should contain one server name or IP address, followed by the VM name (separated by a \ per line). The VM name specified in the file should be the same as the VM name on the Hyper-V host.<br><br>**Example:** VMList.txt contains the following VMs:<ul><li>Host_1\VM_A</li><li>10.8.59.27\VM_B</li><li>Host_2\VM_C</li><ul>|
|-NoOfMinutesToProfile|The number of minutes for which profiling will run. The minimum is 30 minutes.|
|-NoOfHoursToProfile|The number of hours for which profiling will run.|
|-NoOfDaysToProfile |The number of days for which profiling will run. We recommend that you run profiling for more than 7 days. That duration helps ensure that the workload pattern in your environment over the specified period is observed and is used to provide an accurate recommendation.|
|-Virtualization|The virtualization type (VMware or Hyper-V).|
|-Directory|(Optional) The UNC or local directory path to store profiling data generated during profiling. If a name is not specified, the directory named ProfiledData under the current path will be used as the default directory.|
|-Password|(Optional) The password to connect to the Hyper-V host. If you don't specify it as a parameter, you will be prompted for it when you run the command.|
|-StorageAccountName|(Optional) The storage-account name that's used to find the throughput achievable for replication of data from on-premises to Azure. The tool uploads test data to this storage account to calculate throughput. The storage account must be General-purpose v1 (GPv1) type.|
|-StorageAccountKey|(Optional) The key that's used to access the storage account. Go to the Azure portal > **Storage accounts** > *storage-account name* > **Settings** > **Access Keys** > **Key1** (or the primary access key for a classic storage account).|
|-Environment|(Optional) Your target environment for the Azure storage account. It can be one of three values: AzureCloud, AzureUSGovernment, or AzureChinaCloud. The default is AzureCloud. Use the parameter when your target region is either Azure US Government or Azure China 21Vianet.|

We recommend that you profile your VMs for more than 7 days. If churn pattern varies in a month, we recommend that you profile during the week when you see the maximum churn. The best way is to profile for 31 days, to get a better recommendation. 

During the profiling period, ASRDeploymentPlanner.exe keeps running. The tool takes profiling time input in days. For a quick test of the tool or for proof of concept, you can profile for a few hours or minutes. The minimum allowed profiling time is 30 minutes. 

During profiling, you can optionally pass a storage-account name and key to find the throughput that Azure Site Recovery can achieve at the time of replication from the Hyper-V server to Azure. If the storage-account name and key are not passed during profiling, the tool does not calculate achievable throughput.

You can run multiple instances of the tool for various sets of VMs. Ensure that the VM names are not repeated in any of the profiling sets. For example, let's say that you have profiled 10 VMs (VM1 through VM10). After a few days, you want to profile another 5 VMs (VM11 through VM15). You can run the tool from another command-line console for the second set of VMs (VM11 through VM15). 

Ensure that the second set of VMs does not have any VM names from the first profiling instance, or that you use a different output directory for the second run. If two instances of the tool are used for profiling the same VMs and use the same output directory, the generated report will be incorrect. 

By default, the tool is configured to profile and generate reports for up to 1,000 VMs. You can change the limit by changing the MaxVMsSupported key value in the ASRDeploymentPlanner.exe.config file.
```
<!-- Maximum number of VMs supported-->
<add key="MaxVmsSupported" value="1000"/>
```
With the default settings, to profile (for example) 1,500 VMs, create two VMList.txt files. One has 1,000 VMs, and other has 500 VMs. Run the two instances of Azure Site Recovery deployment planner: one with VMList1.txt, and other with VMList2.txt. You can use the same directory path to store the profiled data of both the VMList VMs. 

Based on the hardware configuration (especially RAM size) of the server from where the tool is run to generate the report, the operation might fail with insufficient memory. If you have good hardware, you can change MaxVMsSupported to any higher value.  

VM configurations are captured once at the beginning of the profiling operation and stored in a file called VMDetailList.xml. This information is used when the report is generated. Any change in VM configuration (for example, an increased number of cores, disks, or NICs) from the beginning to the end of profiling is not captured. If a profiled VM configuration has changed during profiling, here is the workaround to get the latest VM details when you're generating the report:

* Back up VMdetailList.xml, and delete the file from its current location.
* Pass -User and -Password arguments at the time of report generation.

The profiling command generates several files in the profiling directory. Do not delete any of the files, because doing so affects report generation.

### Examples

#### Profile VMs for 30 days, and find the throughput from on-premises to Azure
```
ASRDeploymentPlanner.exe -Operation StartProfiling -virtualization Hyper-V -Directory "E:\Hyper-V_ProfiledData" -VMListFile "E:\Hyper-V_ProfiledData\ProfileVMList1.txt"  -NoOfDaysToProfile 30 -User Contoso\HyperVUser1 -StorageAccountName  asrspfarm1 -StorageAccountKey Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
```

#### Profile VMs for 15 days
```
ASRDeploymentPlanner.exe -Operation StartProfiling -Virtualization Hyper-V -Directory "E:\Hyper-V_ProfiledData" -VMListFile "E:\vCenter1_ProfiledData\ProfileVMList1.txt"  -NoOfDaysToProfile  15  -User contoso\HypreVUser1
```

#### Profile VMs for 60 minutes for a quick test of the tool
```
ASRDeploymentPlanner.exe -Operation StartProfiling -Virtualization Hyper-V -Directory "E:\Hyper-V_ProfiledData" -VMListFile "E:\Hyper-V_ProfiledData\ProfileVMList1.txt"  -NoOfMinutesToProfile 60 -User Contoso\HyperVUser1
```

#### Profile VMs for 2 hours for a proof of concept
```
ASRDeploymentPlanner.exe -Operation StartProfiling -Virtualization Hyper-V -Directory "E:\Hyper-V_ProfiledData" -VMListFile "E:\Hyper-V_ProfiledData\ProfileVMList1.txt"  -NoOfHoursToProfile 2 -User Contoso\HyperVUser1
```

### Considerations for profiling

If the server that the tool is running on is rebooted or has crashed, or if you close the tool by using Ctrl+C, the profiled data is preserved. However, there is a chance of missing the last 15 minutes of profiled data. In such cases, rerun the tool in profiling mode after the server restarts.

When the storage-account name and key are passed, the tool measures the throughput at the last step of profiling. If the tool is closed before profiling is completed, the throughput is not calculated. To find the throughput before generating the report, you can run the GetThroughput operation from the command-line console. Otherwise, the generated report will not contain throughput information.

Azure Site Recovery doesn't support VMs that have iSCSI and pass-through disks. The tool can't detect and profile iSCSI and pass-through disks that are attached to VMs.

## Generate a report
The tool generates a macro-enabled Microsoft Excel file (XLSM file) as the report output. It summarizes all the deployment recommendations. The report is named DeploymentPlannerReport_*unique numeric identifier*.xlsm and placed in the specified directory.

After profiling is complete, you can run the tool in report-generation mode. 

### Command-line parameters
The following table contains a list of mandatory and optional tool parameters to run in report-generation mode. The tool is common for moving from VMware to Azure and for moving from Hyper-V to Azure. The following parameters are applicable for Hyper-V.
```
ASRDeploymentPlanner.exe -Operation GenerateReport /?
```

| Parameter name | Description |
|---|---|
| -Operation | GenerateReport |
|-VMListFile | The file that contains the list of profiled VMs that the report will be generated for. The file path can be absolute or relative. For Hyper-V, this file is the output file of the GetVMList operation. If you are preparing manually, the file should contain one server name or IP address, followed by the VM name (separated by a \ per line). The VM name specified in the file should be the same as the VM name on the Hyper-V host.<br><br>**Example:** VMList.txt contains the following VMs:<ul><li>Host_1\VM_A</li><li>10.8.59.27\VM_B</li><li>Host_2\VM_C</li><ul>|
|-Virtualization|The virtualization type (VMware or Hyper-V).|
|-Directory|(Optional) The UNC or local directory path where the profiled data (files generated during profiling) is stored. This data is required for generating the report. If a name is not specified, the directory named ProfiledData under the current path will be used as the default directory.|
| -User | (Optional) The username to connect to the Hyper-V host or Hyper-V cluster. The user needs to have administrative access. The user and password are used to fetch the latest configuration information of the VMs (like the number of disks, number of cores, and number of NICs) to use in the report. If this value is not provided, configuration information collected during profiling is used.|
|-Password|(Optional) The password to connect to the Hyper-V host. If you don't specify it as a parameter, you will be prompted for it when you run the command.|
| -DesiredRPO | (Optional) The desired recovery point objective (RPO), in minutes. The default is 15 minutes.|
| -Bandwidth | (Optional) The bandwidth in megabits per second. Use this parameter to calculate the RPO that can be achieved for the specified bandwidth. |
| -StartDate | (Optional) The start date and time in MM-DD-YYYY:HH:MM (24-hour) format. StartDate must be specified along with EndDate. When StartDate is specified, the report is generated for the profiled data that's collected between StartDate and EndDate. |
| -EndDate | (Optional) The end date and time in MM-DD-YYYY:HH:MM (24-hour) format. EndDate must be specified along with StartDate. When EndDate is specified, the report is generated for the profiled data that's collected between StartDate and EndDate. |
| -GrowthFactor | (Optional) The growth factor, expressed as a percentage. The default is 30 percent. |
| -UseManagedDisks | (Optional) UseManagedDisks: Yes/No. The default is Yes. The number of virtual machines that can be placed in a single storage account is calculated based on whether failover/test failover of virtual machines is done on a managed disk instead of an unmanaged disk. |
|-SubscriptionId |(Optional) The subscription GUID. Use this parameter to generate the cost estimation report with the latest price based on your subscription, the offer that is associated with your subscription, and your target Azure region in the specified currency.|
|-TargetRegion|(Optional) The Azure region where replication is targeted. Because Azure has different costs per region, to generate a report with a specific target Azure region, use this parameter. The default is WestUS2 or the last-used target region. Refer to the list of [supported target regions](hyper-v-deployment-planner-cost-estimation.md#supported-target-regions).|
|-OfferId|(Optional) The offer associated with the subscription. The default is MS-AZR-0003P (Pay-As-You-Go).|
|-Currency|(Optional) The currency in which cost is shown in the generated report. The default is US Dollar ($) or the last-used currency. Refer to the list of [supported currencies](hyper-v-deployment-planner-cost-estimation.md#supported-currencies).|

By default, the tool is configured to profile and generate reports for up to 1,000 VMs. You can change the limit by changing the MaxVMsSupported key value in the ASRDeploymentPlanner.exe.config file.
```
<!-- Maximum number of VMs supported-->
<add key="MaxVmsSupported" value="1000"/>
```

### Examples
#### Generate a report with default values when the profiled data is on the local drive
```
ASRDeploymentPlanner.exe -Operation GenerateReport -virtualization Hyper-V -Directory "E:\Hyper-V_ProfiledData" -VMListFile "E:\Hyper-V_ProfiledData\ProfileVMList1.txt"
```

#### Generate a report when the profiled data is on a remote server
You should have read/write access on the remote directory.
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V -Directory "\\PS1-W2K12R2\Hyper-V_ProfiledData" -VMListFile "\\PS1-W2K12R2\vCenter1_ProfiledData\ProfileVMList1.txt"
```

#### Generate a report with a specific bandwidth that you will provision for the replication
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V -Directory "E:\Hyper-V_ProfiledData" -VMListFile "E:\Hyper-V_ProfiledData\ProfileVMList1.txt" -Bandwidth 100
```

#### Generate a report with a 5 percent growth factor instead of the default 30 percent 
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V -Directory "E:\Hyper-V_ProfiledData" -VMListFile "E:\Hyper-V_ProfiledData\ProfileVMList1.txt" -GrowthFactor 5
```

#### Generate a report with a subset of profiled data
For example, you have 30 days of profiled data and want to generate a report for only 20 days.
```
ASRDeploymentPlanner.exe -Operation GenerateReport -virtualization Hyper-V -Directory "E:\Hyper-V_ProfiledData" -VMListFile "E:\Hyper-V_ProfiledData\ProfileVMList1.txt" -StartDate  01-10-2017:12:30 -EndDate 01-19-2017:12:30
```

#### Generate a report for a 5-minute RPO
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V -Directory "E:\Hyper-V_ProfiledData" -VMListFile "E:\Hyper-V_ProfiledData\ProfileVMList1.txt"  -DesiredRPO 5
```

#### Generate a report for the South India Azure region with Indian Rupee and a specific offer ID
```
ASRDeploymentPlanner.exe -Operation GenerateReport -Virtualization Hyper-V -Directory "E:\Hyper-V_ProfiledData" -VMListFile "E:\Hyper-V_ProfiledData\ProfileVMList1.txt"  -SubscriptionID 4d19f16b-3e00-4b89-a2ba-8645edf42fe5 -OfferID MS-AZR-0148P -TargetRegion southindia -Currency INR
```


### Percentile value used for the calculation
When the tool generates a report, it defaults to the percentile value of 95 for read/write IOPS, write IOPS, and data churn. These values are collected during profiling of all the VMs. This metric ensures that the percentile spike of 100 that your VMs might see because of temporary events is not used to determine your target storage account and source bandwidth requirements. For example, a temporary event might be a backup job running once a day, a periodic database indexing or analytics report generation activity, or another short-lived, point-in-time event.

Using a percentile value of 95 gives a true picture of real workload characteristics, and it gives you the best performance when the workloads are running on Azure. We do not anticipate that you'll need to change this number. If you do change the value (to a percentile of 90, for example), you can update the configuration file ASRDeploymentPlanner.exe.config in the default folder and save it to generate a new report on the existing profiled data.
```
<add key="WriteIOPSPercentile" value="95" />      
<add key="ReadWriteIOPSPercentile" value="95" />      
<add key="DataChurnPercentile" value="95" />
```

### Considerations for growth factor
It's critical to account for growth in your workload characteristics, assuming a potential increase in usage over time. After protection is in place, if your workload characteristics change, you cannot switch to a different storage account for protection without disabling and re-enabling the protection.

For example, let's say that today your VM fits in a standard storage replication account. Over the next three months, these changes are likely to occur:

1. The number of users of the application that runs on the VM will increase.
2. The increased churn on the VM will require the VM to go to premium storage so that Azure Site Recovery replication can keep pace.
3. You will have to disable and re-enable protection to a premium storage account.

We strongly recommend that you plan for growth during deployment planning. Although the default value is 30 percent, you are the expert on your application usage pattern and growth projections. You can change this number accordingly while you're generating a report. Moreover, you can generate multiple reports with various growth factors with the same profiled data. You can then determine what target storage and source bandwidth recommendations work best for you. 

The generated Microsoft Excel report contains the following information:

* [On-premises summary](hyper-v-deployment-planner-analyze-report.md#on-premises-summary)
* [Recommendations](hyper-v-deployment-planner-analyze-report.md#recommendations)
* [VM-storage placement](hyper-v-deployment-planner-analyze-report.md#vm-storage-placement-recommendation)
* [Compatible VMs](hyper-v-deployment-planner-analyze-report.md#compatible-vms)
* [Incompatible VMs](hyper-v-deployment-planner-analyze-report.md#incompatible-vms)
* [On-premises storage requirement](hyper-v-deployment-planner-analyze-report.md#on-premises-storage-requirement)
* [IR batching](hyper-v-deployment-planner-analyze-report.md#initial-replication-batching)
* [Cost estimation](hyper-v-deployment-planner-cost-estimation.md)

![Deployment planner report](media/hyper-v-deployment-planner-run/deployment-planner-report-h2a.png)


## Get throughput
To estimate the throughput that Azure Site Recovery can achieve from on-premises to Azure during replication, run the tool in GetThroughput mode. The tool calculates the throughput from the server that the tool is running on. Ideally, this server is the Hyper-V server whose VMs will be protected. 

### Command-line parameters 
Open a command-line console and go to the folder for the Azure Site Recovery deployment planning tool. Run ASRDeploymentPlanner.exe with the following parameters.
```
ASRDeploymentPlanner.exe -Operation GetThroughput /?
```

 Parameter name | Description |
|---|---|
| -Operation | GetThroughput |
|-Virtualization|The virtualization type (VMware or Hyper-V).|
|-Directory|(Optional) The UNC or local directory path where the profiled data (files generated during profiling) is stored. This data is required for generating the report. If a name is not specified, the directory named ProfiledData under the current path will be used as the default directory.|
| -StorageAccountName | The storage-account name that's used to find the bandwidth consumed for replication of data from on-premises to Azure. The tool uploads test data to this storage account to find the bandwidth consumed. The storage account must be General-purpose v1 (GPv1) type.|
| -StorageAccountKey | The storage-account key that's used to access the storage account. Go to the Azure portal > **Storage accounts** > *storage-account name* > **Settings** > **Access Keys** > **Key1**.|
| -VMListFile | The file that contains the list of VMs to be profiled for calculating the bandwidth consumed. The file path can be absolute or relative. For Hyper-V, this file is the output file of the GetVMList operation. If you are preparing manually, the file should contain one server name or IP address, followed by the VM name (separated by a \ per line). The VM name specified in the file should be the same as the VM name on the Hyper-V host.<br><br>**Example:** VMList.txt contains the following VMs:<ul><li>Host_1\VM_A</li><li>10.8.59.27\VM_B</li><li>Host_2\VM_C</li><ul>|
|-Environment|(Optional) Your target environment for the Azure storage account. It can be one of three values: AzureCloud, AzureUSGovernment, or AzureChinaCloud. The default is AzureCloud. Use the parameter when your target Azure region is either Azure US Government or Azure China 21Vianet.|

### Example
```
ASRDeploymentPlanner.exe -Operation GetThroughput -Virtualization Hyper-V -Directory "E:\Hyper-V_ProfiledData" -VMListFile "E:\Hyper-V_ProfiledData\ProfileVMList1.txt"  -StorageAccountName  asrspfarm1 -StorageAccountKey by8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
```

### Throughput considerations

The tool creates several 64-MB asrvhdfile*number*.vhd files (where *number* is the number of files) on the specified directory. The tool uploads the files to the storage account to find the throughput. After the throughput is measured, the tool deletes all the files from the storage account and from the local server. If the tool is terminated for any reason while it is calculating throughput, it doesn't delete the files from the storage account or from the local server. You have to delete them manually.

The throughput is measured at a specified point in time. It's the maximum throughput that Azure Site Recovery can achieve during replication, if all other factors remain the same. For example, if any application starts consuming more bandwidth on the same network, the actual throughput varies during replication. The result of the measured throughput is different if the GetThroughput operation is run when the protected VMs have high data churn. 

To understand what throughput levels can be achieved at various times, we recommend that you run the tool at various points in time during profiling. In the report, the tool shows the last measured throughput.

> [!NOTE]
> Run the tool on a server that has the same storage and CPU characteristics as a Hyper-V server.

For replication, set the recommended bandwidth to meet the RPO 100 percent of the time. After you set the right bandwidth, if you don’t see an increase in the achieved throughput reported by the tool, do the following:

1. Check to determine whether a network Quality of Service (QoS) problem is limiting Azure Site Recovery throughput.
2. Check to determine whether your Azure Site Recovery vault is in the nearest physically supported Microsoft Azure region to minimize network latency.
3. Check your local storage characteristics to determine whether you can improve the hardware (for example, HDD to SSD).

    
## Next steps
* [Analyze the generated report](hyper-v-deployment-planner-analyze-report.md)
