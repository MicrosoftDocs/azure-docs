---
title: Azure Site Recovery deployment planner for VMware-to-Azure| Microsoft Docs
description: This is the Azure Site Recovery deployment planner user guide.
services: site-recovery
documentationcenter: ''
author: nsoneji
manager: garavd
editor:

ms.assetid:
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 2/21/2017
ms.author: nisoneji

---
# Azure Site Recovery deployment planner
This article is the Azure Site Recovery user guide for VMware-to-Azure production deployments.

## Overview

Before you begin protecting any VMware virtual machines (VMs) by using Site Recovery, allocate sufficient bandwidth, based on your daily data-change rate, to meet your desired recovery point objective (RPO). Be sure to deploy the right number of configuration servers and process servers on-premises.

You also need to create the right type and number of target Azure Storage accounts. You create either standard or premium accounts, factoring in growth on your source production servers because of increased usage over time. You'll also choose the storage type per VM based on workload characteristics (for example, read/write I/O operations per second [IOPS], or data churn) and Site Recovery limits.

The Azure Site Recovery deployment planner public preview is a command-line tool that's currently available only for the VMware-to-Azure scenario. You can remotely profile your VMware VMs by using this tool (with no production impact whatsoever) to understand the bandwidth and Azure storage requirements for successful replication and test failover. You can run the tool without installing any Site Recovery components on-premises. However, to get accurate achieved throughput results, we recommend that you run the planner on a Windows Server that meets the minimum requirements of the Site Recovery configuration server that you would eventually need to deploy as one of the first steps in production deployment.

The tool provides the following details:

**Compatibility assessment**

* A VM eligibility assessment, based on number of disks, disk size, IOPS, and churn
* The estimated network bandwidth that's required for delta replication

**Network bandwidth need vs. RPO assessment**

* The estimated network bandwidth that's required for delta replication
* The throughput that Site Recovery can get from on-premises to Azure
* The number of VMs to batch, based on the estimated bandwidth to complete initial replication in a given amount of time

**Azure infrastructure requirements**
* The storage type (standard or premium storage) requirement for each VM
* The total number of standard and premium storage accounts to be set up for replication
* Storage-account naming suggestions, based on Azure Storage guidance
* The storage-account placement for all VMs
* The number of Azure cores to be set up before test failover or failover on the subscription
* The Azure VM-recommended size for each on-premises VM

**On-premises infrastructure requirements**
* The required number of configuration servers and process servers to be deployed on-premises

>[!IMPORTANT]
>
>Because of possible increased usage over time, all the preceding tool calculations are performed assuming a 30 percent growth factor in your workload characteristics, and taking 95th percentile of all the profiling metrics (read/write IOPS, churn, and so forth). Both of these parameters (growth factor and percentile calculation) are configurable. Learn more about [growth factor](site-recovery-deployment-planner.md#growth-factor) and [percentile value used for the calculation](site-recovery-deployment-planner.md#percentile-value-used-for-the-calculation).
>

## Requirements
The tool has two main phases: profiling and report generation. There is also a third option to calculate throughput only. The requirements for the server from which the profiling and throughput measurement is initiated are presented in the following table:

| Server requirement | Description|
|---|---|
|Profiling and throughput measurement| <ul><li>Operating system: Microsoft Windows Server 2012 R2<br>(ideally matching at least the following [size recommendations for the configuration server](https://aka.ms/asr-v2a-on-prem-components))</li><li>Machine configuration: 8 vCPus, 16 GB RAM, 300 GB HDD</li><li>[Microsoft .NET Framework 4.5](https://aka.ms/dotnet-framework-45)</li><li>[VMware vSphere PowerCLI 6.0 R3](https://developercenter.vmware.com/tool/vsphere_powercli/6.0)</li><li>[Microsoft Visual C++ Redistributable for Visual Studio 2012](https://aka.ms/vcplusplus-redistributable)</li><li>Internet access to Azure from this server</li><li>Azure Storage account</li><li>Administrator access on the server</li><li>Minimum 100 GB of free disk space (assuming 1000 VMs with average of three disks each, profiled for 30 days)</li></ul>|
| Report generation| A Windows PC or Windows Server with Microsoft Excel 2013 or later |
| User permissions | Read-only permission for the user account that's used to access the VMware vCenter server/VMware vSphere ESXi host during profiling|

> [!NOTE]
>
> The tool can profile only VMs with VMDK and RDM disks. It cannot profile VMs with iSCSI or NFS disks. Although Site Recovery supports iSCSI and NFS disks for VMware servers, and because the deployment planner is not sitting inside the guest and profiling only by using vCenter performance counters, the tool does not have visibility into these disk types.
>

## Download and extract the public preview
1. [Download the latest version of the Site Recovery deployment planner public preview](https://aka.ms/asr-deployment-planner).  
The tool is packaged in a .zip folder. The current version of the tool supports only the VMware-to-Azure scenario.

2. Copy the .zip folder to the Windows Server from which you want to run the tool.  
You can run the tool from any Windows Server 2012 R2 that has network access to connect to the vCenter server/vSphere ESXi host that holds the VMs to be profiled. However, we recommend that you run the tool on a server whose hardware configuration meets the [configuration server sizing guideline](https://aka.ms/asr-v2a-on-prem-components). If you have already deployed Site Recovery components on-premises, run the tool from the configuration server.

 We recommend that you have the same hardware configuration as the configuration server (which has an in-built process server) on the server where you run the tool. Such a configuration ensures that the achieved throughput that the tool reports matches the actual throughput that Site Recovery can achieve during replication. The throughput calculation depends on available network bandwidth on the server and hardware configuration (CPU, storage, and so forth) of the server. If you run the tool from any other server, the throughput is calculated from that server to Microsoft Azure. Also, because the hardware configuration of the server might differ from that of the configuration server, the achieved throughput that the tool reports might be inaccurate.

3. Extract the .zip folder.  
You can see multiple files and subfolders. The executable file is ASRDeploymentPlanner.exe in the parent folder.

	Example:
	Copy the .zip file to E:\ drive and extract it.
	E:\ASR Deployment Planner-Preview_v1.0.zip

	E:\ASR Deployment Planner-Preview_v1.0\ ASR Deployment Planner-Preview_v1.0\ ASRDeploymentPlanner.exe

## Capabilities
You can run the command-line tool (ASRDeploymentPlanner.exe) in any of the following three modes:

1. Profiling  
2. Report generation
3. Get throughput

First, run the tool in profiling mode to gather VM data churn and IOPS. Next, run the tool to generate the report to find the network bandwidth and storage requirements.

## Profiling
In profiling mode, the deployment planner tool connects to the vCenter server/vSphere ESXi host to collect performance data about the VM.

* Profiling does not affect the performance of the production VMs, because no direct connection is made to them. All performance data is collected from the vCenter server/vSphere ESXi host.
* To ensure that there is a negligible impact on the server because of profiling, the tool queries the vCenter server/vSphere ESXi host once every 15 minutes. This query interval does not compromise profiling accuracy, because the tool stores every minute’s performance counter data.

### Create a list of VMs to profile
First, you need a list of the VMs to be profiled. You can get all the names of VMs on a vCenter server/vSphere ESXi host by using the VMware vSphere PowerCLI commands in the following procedure. Alternatively, you can list in a file the friendly names or IP addresses of the VMs that you want to profile manually.

1. Sign in to the VM that VMware vSphere PowerCLI is installed in.
2. Open the VMware vSphere PowerCLI console.
3. Ensure that the execution policy is enabled for the script. If it is disabled, launch the VMware vSphere PowerCLI console in administrator mode, and then enable it by running the following command:

			Set-ExecutionPolicy –ExecutionPolicy AllSigned

4. To get all the names of VMs on a vCenter server/vSphere ESXi host and store the list in a .txt file, run the two commands listed here.
Replace &lsaquo;server name&rsaquo;, &lsaquo;user name&rsaquo;, &lsaquo;password&rsaquo;, &lsaquo;outputfile.txt&rsaquo;; with your inputs.

			Connect-VIServer -Server <server name> -User <user name> -Password <password>

			Get-VM |  Select Name | Sort-Object -Property Name >  <outputfile.txt>

5. Open the output file in Notepad, and then copy the names of all VMs that you want to profile to another file (for example, ProfileVMList.txt), one VM name per line. This file will be used as input to the -VMListFile parameter of the command-line tool

	![VM name list in the deployment planner](./media/site-recovery-deployment-planner/profile-vm-list.png)

### Start profiling
After you have the list of VMs to be profiled, you can now run the tool in profiling mode. Here is the list of mandatory and optional parameters of the tool to run in profiling mode. Parameters in [] are optional.

ASRDeploymentPlanner.exe -Operation StartProfiling /?

| Parameter name | Description |
|---|---|
| -Operation | StartProfiling |
| -Server | Fully qualified domain name or IP address of the vCenter server/vSphere ESXi host whose VMs are to be profiled.|
| -User | User name to connect to the vCenter server/vSphere ESXi host. User needs to have read-only access, at minimum.|
| -VMListFile |	The file with the list of VMs to be profiled. The file path can be absolute or relative. This file should contain one VM name/IP address per line. Virtual machine name specified in the file should be the same as the VM name on the vCenter server/vSphere ESXi host. <br> For example, the file VMList.txt contains the following VMs:<ul><li>virtual_machine_A</li><li>10.150.29.110</li><li>virtual_machine_B</li><ul> |
| -NoOfDaysToProfile | Number of days for which profiling is to be run. We recommend that you run profiling for more than 15 days to ensure that the workload pattern in your environment over the specified period is observed and used to provide an accurate recommendation |
| [-Directory] | UNC or local directory path to store profiling data generated during profiling. If not given, the directory named ‘ProfiledData’ under the current path will be used as the default directory. |
| [-Password ] | Password to connect to the vCenter server/vSphere ESXi host. If you do not specify one now, you will be prompted for it when the command is executed.|
| [-StorageAccountName] | Azure Storage account name to find the throughput achievable for replication of data from on-premises to Azure. The tool uploads test data to this storage account to calculate throughput.|
| [-StorageAccountKey] | Azure Storage account key used to access the storage account. Go to the Azure portal > Storage accounts > [Storage account name] > Settings > Access Keys > Key1 (or Primary access key for classic storage account). |

We recommend that you profile your VMs for at least 15 to 30 days. During the profiling period, ASRDeploymentPlanner.exe keeps running. The tool takes profiling time input in days. If you want to profile for few hours or minutes for a quick test of the tool, in the public preview, you will need to convert the time into the equivalent measure of days. For example, to profile for 30 minutes, the input must be 30/(60*24) = 0.021 days. The minimum allowed profiling time is 30 minutes.

During profiling, you can optionally pass a storage-account name and key to find the throughput that Site Recovery can achieve at the time of replication from the configuration server or process server to Azure. If the storage-account name and key are not passed during profiling, the tool does not calculate achievable throughput.

#### Example 1: Profile VMs for 30 days, and find the throughput from on-premises to Azure
ASRDeploymentPlanner.exe **-Operation** StartProfiling -Directory “E:\vCenter1_ProfiledData” **-Server** vCenter1.contoso.com **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt”  **-NoOfDaysToProfile**  30  **-User** vCenterUser1 **-StorageAccountName**  asrspfarm1 **-StorageAccountKey** Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==

#### Example 2: Profile VMs for 15 days
You can run multiple instances of the tool for various sets of VMs. Ensure that the VM names are not repeated in any of the profiling sets. For example, if you have profiled ten VMs (VM1 through VM10) and after few days you want to profile another five VMs (VM11 through VM15), you can run the tool from another command-line console for the second set of VMs (VM11 through VM15). Ensure that the second set of VMs do not have any VM names from the first profiling instance or you use a different output directory for the second run. If two instances of the tool are used for profiling the same VMs and use the same output directory, the generated report will be incorrect.

VM configurations are captured once at the beginning of the profiling operation and stored in a file called VMDetailList.xml. This information is used when the report is generated. Any change in VM configuration (for example, an increased number of cores, disks, or NICs) from the beginning to the end of profiling is not captured. If a profiled VM configuration has changed during the course of profiling, in the public preview, here is the workaround to get latest VM details when generating the report:

* Back up VMdetailList.xml, and delete the file from its current location.
* Pass -User and -Password arguments at the time of report generation.

The profiling command generates several files in the profiling directory. Do not delete any of the files, because doing so affects report generation.

ASRDeploymentPlanner.exe **-Operation** StartProfiling **-Directory** “E:\vCenter1_ProfiledData” **-Server** vCenter1.contoso.com **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt”  **-NoOfDaysToProfile**  15  -User vCenterUser1

#### Example 3: Profile VMs for 1 hour for a quick test of the tool
ASRDeploymentPlanner.exe **-Operation** StartProfiling **-Directory** “E:\vCenter1_ProfiledData” **-Server** vCenter1.contoso.com **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt”  **-NoOfDaysToProfile**  0.04  **-User** vCenterUser1

>[!NOTE]
>
>* If the server that the tool is running on is rebooted or has crashed, or if you close the tool by using Ctrl + C, the profiled data is preserved. However, there is a chance of missing the last 15 minutes of profiled data. In such an instance, rerun the tool in profiling mode after the server restarts.
>* When the storage account name and key are passed, the tool measures the throughput at the last step of profiling. If the tool is closed before profiling is completed, the throughput is not calculated. To find the throughput before generating the report, you can run the GetThroughput operation from the command-line console. Otherwise, the generated report will not contain the throughput information.
>* You can run multiple instances of the tool for various sets of VMs. Ensure that the VM names are not repeated in any of the profiling sets. For example, you have profiled ten VMs (VM1 through VM10) and after few days you want to profile another five VMs (VM11 through VM15), you can run the tool from another command-line console for the second set of VMs (VM11 through VM15). But ensure that the second set of VMs does not contain any VM names from the first profiling instance or that you use a different output directory for the second run. If two instances of the tool are used for profiling the same VMs and use the same output directory, the generated report will be incorrect.
>* The VM configuration is captured once at the beginning of the profiling operation and stored in a file called VMDetailList.xml. This information is used when the report is generated. Any change in VM configuration (for example, an increased number of cores, disks, or NICs) from the beginning to the end of profiling is captured. If any profiled VM configuration has changed in the public preview, get the latest VM details by performing the following workaround:  
>  * Back up VMdetailList.xml, and delete the file from its current location.  
>  * Pass -User and -Password arguments at the time of report generation.  
>  
>* The profiling command generates several files in the profiling directory. Do not delete any of the files, because doing so affects report generation.

## Generate a report
The tool generates a macro-enabled Microsoft Excel file (XLSM file) as the report output, which summarizes all the deployment recommendations. The report is named DeploymentPlannerReport_<*unique numeric identifier*>.xlsm and placed in the specified directory.

After profiling is complete, you can run the tool in report-generation mode. The following table contains a list of mandatory and optional tool parameters to run in report-generation mode.

ASRDeploymentPlanner.exe -Operation GenerateReport /?

|Parameter name | Description |
|-|-|
| -Operation | GenerateReport |
| -Server |  The vCenter/vSphere server fully qualified domain name or IP address (use the same name or IP address that you used at the time of profiling) where the profiled VMs whose report is to be generated are located. Note that if you used a vCenter server at the time of profiling, you cannot use a vSphere server for report generation, and vice-versa.|
| -VMListFile | The file that contains the list of profiled VMs that the report is to be generated for. The file path can be absolute or relative. The file should contain one VM name or IP address per line. The VM names that are specified in the file should be the same as the VM names on the vCenter server/vSphere ESXi host, and match what was used during profiling.|
| -Directory | (Optional) The universal naming convention (UNC) or local directory path where the profiled data (files generated during profiling) is stored. This data is required for generating the report. If a name isn't specified, ‘ProfiledData’ directory will be used. |
| -GoalToCompleteIR | (Optional) The number of hours in which the initial replication of the profiled VMs needs to be completed. The generated report provides the number of VMs for which initial replication can be completed in the specified time. The default is 72 hours. |
| -User | (Optional) The user name to use to connect to the vCenter/vSphere server. The name is used to fetch the latest configuration information of the VMs, such as the number of disks, number of cores, and number of NICs, to use in the report. If the name isn't provided, the configuration information collected at the beginning of the profiling kickoff is used. |
| -Password | (Optional) The password to use to connect to the vCenter server/vSphere ESXi host. If the password isn't specified as a parameter, you will be prompted for it later when the command is executed. |
| -DesiredRPO | (Optional) The desired recovery point objective, in minutes. The default is 15 minutes.|
| -Bandwidth | Bandwidth in Mbps. The parameter to use to calculate the RPO that can be achieved for the specified bandwidth. |
| -StartDate | (Optional) The start date and time in MM-DD-YYYY:HH:MM (24-hour format). *StartDate* must be specified along with *EndDate*. When StartDate is specified, the report is generated for the profiled data that's collected between StartDate and EndDate. |
| -EndDate | (Optional) The end date and time in MM-DD-YYYY:HH:MM (24-hour format). *EndDate* must be specified along with *StartDate*. When EndDate is specified, the report is generated for the profiled data that's collected between StartDate and EndDate. |
| -GrowthFactor | (Optional) The growth factor, expressed as a percentage. The default is 30 percent. |

### Example 1: Generate a report with default values when the profiled data is on the local drive
ASRDeploymentPlanner.exe **-Operation** GenerateReport **-Server** vCenter1.contoso.com **-Directory** “E:\vCenter1_ProfiledData” **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt”

### Example 2: Generate a report when the profiled data is on a remote server.
Users should have read/write access on the remote directory.

ASRDeploymentPlanner.exe **-Operation** GenerateReport **-Server** vCenter1.contoso.com **-Directory** “\\PS1-W2K12R2\vCenter1_ProfiledData” **-VMListFile** “\\PS1-W2K12R2\vCenter1_ProfiledData\ProfileVMList1.txt”

### Example 3: Generate a report with a specific bandwidth and goal to complete IR within specified time
ASRDeploymentPlanner.exe **-Operation** GenerateReport **-Server** vCenter1.contoso.com **-Directory** “E:\vCenter1_ProfiledData” **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt” **-Bandwidth** 100 **-GoalToCompleteIR** 24

### Example 4: Generate a report with a 5 percent growth factor instead of the default 30 percent
ASRDeploymentPlanner.exe **-Operation** GenerateReport **-Server** vCenter1.contoso.com **-Directory** “E:\vCenter1_ProfiledData” **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt” **-GrowthFactor** 5

### Example 5: Generate a report with a subset of profiled data
For example, you have 30 days of profiled data and want to generate a report for only 20 days.

ASRDeploymentPlanner.exe **-Operation** GenerateReport **-Server** vCenter1.contoso.com **-Directory** “E:\vCenter1_ProfiledData” **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt” **-StartDate**  01-10-2017:12:30 -**EndDate** 01-19-2017:12:30

### Example 6: Generate a report for 5-minute RPO.
ASRDeploymentPlanner.exe **-Operation** GenerateReport **-Server** vCenter1.contoso.com **-Directory** “E:\vCenter1_ProfiledData” **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt”  **-DesiredRPO** 5

## The percentile value used for the calculation
**What default percentile value of the performance metrics collected during profiling is used when a report is generated?**

The tool defaults to the 95th percentile values of read/write IOPS, write IOPS, and data churn that are collected during profiling of all the VMs. This metric ensures that the 100th percentile spike your VMs might see because of temporary events is not used to determine your target Azure storage and source bandwidth requirements. For example, a temporary event might be a backup job running once a day, a periodic database indexing or analytics report generation activity, or other similar short-lived, point-in-time events.

Using 95th percentile values gives a true picture of real workload characteristics, and it gives you the best performance when the workloads are running on Microsoft Azure. We do not anticipate that you would need to change this number. If you do change it (to the 90th percentile, for example), you can update the configuration file *ASRDeploymentPlanner.exe.config* in the default folder and save it to generate a new report on the existing profiled data.

		&lsaquo;add key="WriteIOPSPercentile" value="95" /&rsaquo;>      
		&lsaquo;add key="ReadWriteIOPSPercentile" value="95" /&rsaquo;>      
		&lsaquo;add key="DataChurnPercentile" value="95" /&rsaquo;

## Growth-factor considerations
**Why should I consider growth factor when I plan deployments?**

It is critical to account for growth in your workload characteristics, assuming a potential increase in usage over time. This is because once protected if your workload characteristics change, there is currently no means to switch to a different Azure Storage account for protection without disabling and re-enabling protection. For example, if today a VM fits in a standard storage replication account, in say three months’ time, because of an increase in number of users of the application running on the VM, if say the churn on the VM increases and requires it to go to premium storage so that Site Recovery replication can keep up with the new higher churn, you will have to disable and re-enable protection to a premium storage account. So, it is strongly advised to plan for growth while deployment planning and the default value is 30 percent. You know your applications usage pattern and growth projections the best and can change this number accordingly while generating a report. You can in fact generate multiple reports with different growth factors with the same profiled data and see what target Azure Storage and source bandwidth recommendations work best for you.

The generated Microsoft Excel report contains the following information:

* [Input](site-recovery-deployment-planner.md#input)
* [Recommedations](site-recovery-deployment-planner.md#recommendations-with-desired-rpo-as-input)
* [Recommedations-Bandwidth Input](site-recovery-deployment-planner.md#recommendations-with-available-bandwidth-as-input)
* [VM<->Storage Placement](site-recovery-deployment-planner.md#vm-storage-placement)
* [Compatible VMs](site-recovery-deployment-planner.md#compatible-vms)
* [Incompatible VMs](site-recovery-deployment-planner.md#incompatible-vms)

![Deployment planner](./media/site-recovery-deployment-planner/dp-report.png)

## Get throughput

To estimate the throughput that Site Recovery can achieve from on-premises to Azure during replication, run the tool in GetThroughput mode. The tool calculates the throughput from the server where the tool is running (ideally a server based on the configuration server sizing guide). If you have already deployed Site Recovery infrastructure components on-premises, run the tool on the configuration server.

Open a command-line console and go to ASR deployment planning tool folder. Run ASRDeploymentPlanner.exe with following parameters.

ASRDeploymentPlanner.exe -Operation GetThroughput /?

|Parameter name | Description |
|-|-|
| -operation | GetThroughput |
| -Directory | (Optional) UNC or local directory path where the profiled data (files generated during profiling) is stored. This data is required for generating the report. If not specified, ‘ProfiledData’ directory will be used. |
| -StorageAccountName | Azure Storage account name to find the bandwidth consumed for replication of data from on-premises to Azure. The tool uploads test data to this storage account to find the bandwidth consumed. |
| -StorageAccountKey | Azure Storage Account Key used to access the storage account. Go to the Azure portal > Storage accounts > [Storage account name] > Settings > Access Keys > Key1(or Primary access key for classic storage account). |
| -VMListFile | The file with the list of VMs to be profiled for calculating the bandwidth consumed. The file path can be absolute or relative. This file should contain one VM name/IP address per line. The VM names specified in the file should be the same as the VM names on the vCenter server/vSphere ESXi host.<br>For example, the file VMList.txt contains the following VMs:<ul><li>VM_A</li><li>10.150.29.110</li><li>VM_B</li></ul>|

The tool creates several 64 MB asrvhdfile<#>.vhd files (where "#" is the number of files)  on the specified directory. The tool uploads the files to the Azure Storage account to find the throughput. After the throughput is measured, the tool deletes all the files from the Azure Storage account and from the local server. If the tool is terminated for any reason mid-way while calculating throughput, it will not delete the files from Azure Storage or from the local server and you will have to delete them manually.

The throughput is measured at a given point of time and it is the maximum throughput that Site Recovery can achieve during replication provided all other factors remain the same. For example, if any application starts consuming more bandwidth on the same network, then actual throughput varies during replication. If you are running GetThroughput command from a configuration server, the tool is not aware of any protected VMs and on-going replication. Result of measured throughput will be different if the GetThroughput operation is run at the time when protected VMs have high data churn vs. when they have low data churn. We recommend that you run the tool at different points of time during profiling to understand what throughput can be achieved at various times. In the report, the tool shows the last measured throughput.

##### Example
ASRDeploymentPlanner.exe **-Operation** GetThroughput **-Directory**  E:\vCenter1_ProfiledData **-VMListFile** E:\vCenter1_ProfiledData\ProfileVMList1.txt  **-StorageAccountName**  asrspfarm1 **-StorageAccountKey** by8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==

>[!NOTE]
>
> * Run the tool on a server which has the same storage and CPU characteristics as the configuration server
>
> * For replication, set the recommended bandwidth to meet the RPO 100 percent of the time. Even after you set the right bandwidth, if you don’t see any increase in the achieved throughput reported by the tool, check the following:
>
> a. Check if there is any network Quality of Service (QoS) that is limiting Site Recovery throughput
>
> b. Check if your Site Recovery vault is in the nearest physical supported Microsoft Azure region to minimize network latency
>
> c. Check your local storage characteristics and look to improve the hardware (for example, HDD to SSD).
>
> d. Change the Site Recovery settings in the process server to [increase the amount of network bandwdith used for replication](./site-recovery-plan-capacity-vmware.md#control-network-bandwidth).

## Recommendations with desired RPO as input

### Profiled data

![Profiling overview in the deployment planner](./media/site-recovery-deployment-planner/profiled-data-period.png)

**Profiled data period** is the duration for which profiling was run. By default, the tool takes all the profiled data for the calculation unless the report is generated for a specific period by using StartDate and EndDate options during report generation.

**Server Name** is the name or IP address of the VMware vCenter or ESXi host whose VMs’ report is generated.

**Desired RPO** is the recovery point objective for your deployment. By default, the required network bandwidth is calculated for RPO values of 15, 30 and 60 minutes. Based on the selection, the impacted values are updated on the sheet. If you have used the DesiredRPOinMin parameter while generating the report, that value is shown in this Desired RPO dropdown.

### Profiling Overview

![Profiled data in the deployment planner](./media/site-recovery-deployment-planner/profiling-overview.png)

**Total Profiled Virtual Machines** is the total number of VMs whose profiled data is available. If the VMListFile has names of any VMs which were not profiled, those VMs are not considered in the report generation and excluded from the total profiled VMs count.

**Compatible Virtual Machines** is the number of VMs that can be protected to Azure by using Site Recovery. It is the total number of compatible VMs for which required network bandwidth, number of Azure Storage accounts, number of Microsoft Azure cores and number of configuration servers and additional process servers are calculated. The details of every compatible VM is available in the Compatible VMs sheet of the report.

**Incompatible Virtual Machines** is the number of profiled VMs which are incompatible for protection with Site Recovery. The reasons for incompatibility are noted in the Incompatible VMs section below. If the VMListFile has names of any VMs which were not profiled, those VMs are excluded from the incompatible VMs count. These VMs are listed as ‘Data not found’ at the end of the Incompatible VMs sheet.

**Desired RPO** is your desired recovery point objective, in minutes. The report is generated for three RPO values – 15, 30 and 60 minutes, with 15 minutes being the default. The bandwidth recommendation in the report will be changed based on your selection in the Desired RPO dropdown on the top right of the sheet. If you have generated the report by using the “-DesiredRPO” parameter with a custom value, this custom value will show as the default in the Desired RPO dropdown.

### Required network bandwidth (Mbps)

![Required network bandwidth in the deployment planner](./media/site-recovery-deployment-planner/required-network-bandwidth.png)

**To meet RPO 100 percent of the time:** It is the recommended bandwidth in Mbps to be allocated to meet your desired RPO 100 percent of the time. This amount of bandwidth must be dedicated for steady state delta replication of all your compatible VMs to avoid any RPO violations.

**To meet RPO 90 percent of the time**: Because of broadband pricing or for any other reason, if you cannot set the bandwidth needed to meet your desired RPO 100 percent of the time, you can choose to go with setting a lower bandwidth amount that can meet your desired RPO 90 percent of the time. To understand the implications of setting this lower bandwidth, the report provides a what-if analysis on the number and duration of RPO violations to expect.

**Achieved Throughput:** It is the throughput from the server where you have run the GetThroughput command to the Microsoft Azure region where the Azure Storage account is located. It indicates the ballpark throughput that can be achieved when you protect the compatible VMs by using Site Recovery, provided your configuration server or process server storage and network characteristics remain the same as that of the server from where you have run the tool. Achieved Throughput is the throughput from the server where you have run the GetThroughput command to the Microsoft Azure region where the Azure Storage account is located. It indicates the ballpark throughput that can be achieved when you protect the compatible VMs by using Site Recovery, provided your configuration server or process server storage and network characteristics remain the same as that of the server from where you have run the tool.

For replication, you should set the recommended bandwidth to meet the RPO 100 percent of the time. Even after you set the right bandwidth, if you don’t see any increase in the achieved throughput reported by the tool, check the following:

a.	Check if there is any network Quality of Service (QoS) that is limiting Site Recovery throughput.

b.	Check if your Site Recovery vault is in the nearest physical supported Microsoft Azure region to minimize network latency.

c.	Check your local storage characteristics and look to improve the hardware (for example, HDD to SSD).

d. Change the Site Recovery settings in the process server to [increase the amount network bandwdith used for replication](./site-recovery-plan-capacity-vmware.md#control-network-bandwidth).

In cases where you are running the tool on a configuration server or process server that already has protected VMs, run the tool a few times because the achieved throughput number will change depending on the amount of churn being processed at that particular point of time.

For all enterprise Site Recovery deployments, we recommend that you use [ExpressRoute](https://aka.ms/expressroute).

### Required Azure Storage Accounts
This chart shows the total number of Azure Storage accounts (standard and premium) required to protect all the compatible VMs. Click on [Recommended VM placement plan](site-recovery-deployment-planner.md#vm-storage-placement) to know which storage account should be used for each VM.

![Required Azure Storage accounts in the deployment planner](./media/site-recovery-deployment-planner/required-azure-storage-accounts.png)

### Required Number of Azure Cores
This is the total number of cores to be set up before failover or test failover of all the compatible VMs. If sufficient cores are not available in the subscription, Site Recovery fails to create VMs at the time of test failover or failover.

![Required number of Azure cores in the deployment planner](./media/site-recovery-deployment-planner/required-number-of-azure-cores.png)

### Required on-premises infrastructure
It is the total number of configuration servers and additional process servers to be configured to protect all the compatible VMs. Based on the supported [limits](https://aka.ms/asr-v2a-on-prem-components) on the largest configuration - either the per day churn or the maximum number of protected VMs (assuming average of three disks per VM), whichever is hit first on the configuration server or the additional process server, the tool recommends additional servers. The details of total churn per day and total number of protected disks are found in the [Input](site-recovery-deployment-planner.md#input) sheet.

![Required on-premises infrastructure in the deployment planner](./media/site-recovery-deployment-planner/required-on-premises-infrastructure.png)

### What-if analysis
This analysis outlines how many violations could occur during the profiling period when you set a lower bandwidth for the desired RPO to be met only 90 percent of the time. One or more RPO violations can occur on any given day. The graph shows the peak RPO of the day.
Based on this analysis, you can decide if the number of RPO violations across all days and peak RPO hit per day is acceptable with the specified lower bandwidth. If it is acceptable, you can allocate the lower bandwidth for replication, else allocate the higher bandwidth as suggested to meet the desired RPO 100 percent of the time.

![What-if analysis in the deployment planner](./media/site-recovery-deployment-planner/what-if-analysis.png)

### Recommended VM batch size for initial replication
In this section, we recommend the number of VMs that can be protected in parallel to complete initial replication within 72 hours (configurable value – use the GoalToCompleteIR parameter at report generation time to change this) with the suggested bandwidth to meet desired RPO 100 percent of the time being set. The graph shows a range of bandwidth values and calculated VM batch size count to complete initial replication in 72 hours based on the average detected VM size across all the compatible VMs.

In the public preview, the report does not specify which VMs should be included in a batch. You can use the disk size shown in the Compatible VMs sheet to find each VM’s size and select your VMs for a batch or select based on known workload characteristics. Initial replication completion time proportionately changes based on the actual VM disk size, used space disk space and available network throughput.

![Recommended VM batch size](./media/site-recovery-deployment-planner/recommended-vm-batch-size.png)

### Growth factor and percentile values used
This section at the bottom of the sheet shows the percentile value used for all the performance counters of the profiled VMs (default 95th percentile), and the growth factor (expressed as a percentage) that's used in all the calculations (default 30 percent).

![Growth factor and percentile values used](./media/site-recovery-deployment-planner/max-iops-and-data-churn-setting.png)

## Recommendations with available bandwidth as input

![Recommendations with available bandwidth as input](./media/site-recovery-deployment-planner/profiling-overview-bandwidth-input.png)

You might have a situation where you know that you cannot set a bandwidth of more than x Mbps for Site Recovery replication. The tool allows you to input available bandwidth (using the -Bandwidth parameter during report generation) and get the achievable RPO in minutes. With this achievable RPO value, you can decide whether you need to set up additional bandwidth or you are OK with having a disaster recovery solution with this RPO.

![Achievable RPO for 500 Mbps bandwidth](./media/site-recovery-deployment-planner/achievable-rpos.png)

## Input
The Input page provides an overview of the profiled VMware environment.

![Overview of the profiled VMware environment](./media/site-recovery-deployment-planner/Input.png)

**Start Date and End Date** are the start and end dates of the profiling data considered for report generation. By default, the start date is the date when profiling started and end date is the date when profiling stops. This can be the ‘StartDate’ and ‘EndDate’ values if the report is generated with these parameters. Start Date and End Date: These are the start and end dates of the profiling data considered for report generation. By default, the start date is the date when profiling started and end date is the date when profiling stops. This can be the ‘StartDate’ and ‘EndDate’ values if the report is generated with these parameters.

**Total number of profiling days** is the total number of days of profiling between the start and end dates for which the report is generated. Total number of profiling days is the total number of days of profiling between the start and end dates for which report is generated.

**Number of compatible VMs** is the total number of compatible VMs for which the required network bandwidth, required number of Azure Storage accounts, Microsoft Azure cores, configuration servers and additional process servers are calculated.
Total number of disks across all compatible VMs is the total number of disks across all compatible VMs. This number is used as one of the inputs to decide the number of configuration servers and additional process servers to be used in the deployment.

**Average number of disks per compatible VM** is the average number of disks calculated across all compatible VMs.

**Average disk size (GB)** is the average disk size calculated across all compatible VMs.

**Desired RPO (minutes)** is either the default recovery point objective or the value passed for the ‘DesiredRPO’ parameter at the time of report generation to estimate required bandwidth.

**Desired bandwidth (Mbps)** is the value that you have passed for the ‘Bandwidth’ parameter at the time of report generation to estimate achievable RPO.

**Observed typical data churn per day (GB)** is the average data churn observed across all profiling days. This number is used as one of the inputs to decide the number of configuration servers and additional process servers to be used in the deployment.


## VM-Storage placement

![VM-storage placement](./media/site-recovery-deployment-planner/vm-storage-placement.png)

**Disk Storage Type** is either a standard or premium Azure Storage account used to replicate all the corresponding VMs mentioned in the ‘VMs to Place’ column.

**Suggested Prefix** is the suggested three-character prefix that can be used for naming the Azure storage account. You can always use your own prefix, but what the tool suggests is following the [partition naming convention of Azure Storage accounts](https://aka.ms/storage-performance-checklist).

**Suggested Account Name** indicates how your Azure Storage account name should look like after including the suggested prefix. Replace the name within the angle brackets (<) and (>) with your custom input.

**Log Storage Account:** All the replication logs are stored in a standard Azure Storage account. For the VMs replicating to a premium Azure Storage account, an additional standard Azure Storage account needs to be set up for log storage. A single standard log storage account can be used by multiple premium replication storage accounts. Virtual machines replicated to standard storage accounts use the same storage account for logs.

**Suggested Log Account Name** indicates how your log Azure Storage account name should look like after including the suggested prefix. Replace name in < > with your custom input.

**Placement Summary** provides a summary of the total VMs load on the Azure Storage account at the time of replication and test failover or failover. It includes the total number of VMs mapped to the Azure Storage account, total read/write IOPS across all VMs being placed in this Azure Storage account, total write (replication) IOPS, total setup size across all disks, and total number of disks.

**Virtual Machines to Place** lists all the VMs that should be placed on the given Azure Storage account for optimal performance and utilization.

## Compatible VMs
![Compatible VMs](./media/site-recovery-deployment-planner/compatible-vms.png)

**VM Name** is the VM name or IP address as used in the VMListFile at the time of report generation. This column also lists the disks (VMDKs) attached to the VMs.

**VM Compatibility** has two values: **Yes** and **Yes\***. **Yes\*** is for those cases where the VM is a fit for [premium Azure Storage](https://aka.ms/premium-storage-workload) with the profiled high churn or IOPS disk fitting in the P20 or P30 category, but the size of the disk causes it to be mapped down to a P10 or P20. Azure Storage decides which premium storage disk type to map a disk to based on its size – i.e. < 128 GB is a P10, 128 to 512 GB is a P20, and 512 GB to 1023 GB is a P30. So if the workload characteristics of a disk put it in a P20 or P30, but the size maps it down to a lower premium storage disk type, the tool marks that VM as a Yes* and recommends that you either change the source disk size to fit into the right recommended premium storage disk type, or change the target disk type post failover.
Storage Type is standard or premium.

**Suggested Prefix** is the three-character Azure Storage account prefix

**Storage Account** is the name that uses the suggested prefix

**R/W IOPS (with Growth Factor)** is the peak workload IOPS on the disk (default 95th percentile) including the future growth factor (default 30 percent). Note that the total read/write IOPS of the VM is not always going to be the sum of the VM’s individual disks’ read/write IOPS, because the peak read/write IOPS of the VM is the peak of the sum of its individual disks read/write IOPS across every minute of the profiling period.

**Data Churn in Mbps (with Growth Factor)** is the peak churn rate on the disk (default 95th percentile) including the future growth factor (default 30 percent). Note that the total data churn of the VM is not always going to be the sum of the VM’s individual disks’ data churn, because the peak data churn of the VM is the peak of the sum of its individual disks churn across every minute of the profiling period.

**Azure VM Size** is the ideal mapped Azure Compute VM size for this on-premises VM. The mapping is done based on the on-premises VM’s memory, number of disks/cores/NICs, and read/write IOPS. The recommendation is always the lowest Azure VM size that matches all of the on-premises VM characteristics.

**Number of Disks** is the total number of disks (VMDKs) on the VM

**Disk size (GB)** is the total setup size of all disks of the VM. The tool also shows the disk size for the individual disks in the VM.

**Cores** is the number of CPU cores on the VM.

**Memory (MB)** is the RAM on the VM.

**NICs** is the number of NICs on the VM.

## Incompatible VMs

![Incompatible VMs](./media/site-recovery-deployment-planner/incompatible-vms.png)

**VM Name** is the VM name or IP address as used in the VMListFile at the time of report generation. This column also lists the disks (VMDKs) attached to the VMs.

**VM Compatibility** indicates why the given VM is incompatible for use with Azure Site recovery. The reasons are outlined per incompatible disk of the VM and can be one of the following based on published Azure Storage [limits](https://aka.ms/azure-storage-scalbility-performance).

* Disk size > 1023 GB – Azure Storage currently does not support > 1 TB disk sizes
* Total VM size (replication + TFO) exceeds supported Azure Storage account size limit (35 TB) – This usually happens when there is a single disk in the VM that has some performance characteristics that exceeds the maximum supported Microsoft Azure or Site Recovery limits for standard storage which pushes the VM into premium storage zone. However, the maximum supported size of a premium Azure Storage account is 35 TB, and a single protected VM cannot be protected across multiple storage accounts. Also note that when a TFO (test failover) is executed on a protected VM, it runs in the same storage account where replication is progressing – so we need to set up 2x the size of the disk for replication to progress and test failover to succeed in parallel.
* Source IOPS exceeds supported Azure Storage IOPS limit of 5000 per disk
* Source IOPS exceeds supported Azure Storage IOPS limit of 80,000 per VM
* Average data churn exceeds supported Site Recovery data churn limit of 10 MBps for average IO size for disk
* Total data churn across all disks on the VM exceeds the maximum supported Site Recovery data churn limit of 54 MBps per VM
* Average effective write IOPS exceeds supported Site Recovery IOPS limit of 840 for disk
* Calculated snapshot storage exceeding the supported snapshot storage limit of 10 TB

**R/W IOPS (with Growth Factor)** is the peak workload IOPS on the disk (default 95th percentile) including the future growth factor (default 30 percent). Note that the total read/write IOPS of the VM is not always going to be the sum of the VM’s individual disks’ read/write IOPS, because the peak read/write IOPS of the VM is the peak of the sum of its individual disks read/write IOPS across every minute of the profiling period.

**Data Churn in Mbps (with Growth Factor)** is the peak churn rate on the disk (default 95th percentile) including the future growth factor (default 30 percent). Note that the total data churn of the VM is not always going to be the sum of the VM’s individual disks’ data churn, because the peak data churn of the VM is the peak of the sum of its individual disks churn across every minute of the profiling period.

**Number of Disks** is the total number of disks (VMDKs) on the VM

**Disk size (GB)** is the total setup size of all disks of the VM. The tool also shows the disk size for the individual disks in the VM.

**Cores** is the number of CPU cores on the VM.

**Memory (MB)** is the RAM on the VM.

**NICs** is the number of NICs on the VM.


## Azure Site Recovery limits

**Replication Storage Target** | **Average Source Disk I/O Size** |**Average Source Disk Data Churn** | **Total Source Disk Data Churn Per Day**
---|---|---|---
Standard storage | 8 KB	| 2 MB/s | 168 GB per disk
Premium P10 disk | 8 KB	| 2 MB/s | 168 GB per disk
Premium P10 disk | 16 KB | 4 MB/s |	336 GB per disk
Premium P10 disk | 32 KB or higher | 8 MB/s | 672 GB per disk
Premium P20/P30 disk | 8 KB	| 5 MB/s | 421 GB per disk
Premium P20/P30 disk | 16 KB or higher |10 MB/s	| 842 GB per disk


These are average numbers assuming a 30 percent IO overlap. Site Recovery is capable of handling higher throughput based on overlap ratio, larger write sizes and actual workload I/O behavior. The above numbers assume a typical backlog of ~5 minutes, i.e. data once uploaded will be processed and a recovery point created within 5 minutes.

The above published limits are based on our tests but cannot cover all possible application I/O combinations. Actual results will vary based on your application I/O mix. For best results, even after deployment planning, we always recommend that you perform extensive application testing by using test failover to get the true performance picture.

## Release notes
The Azure Site Recovery deployment planner public preview 1.0 has the following known issues that will be addressed in upcoming updates.

* The tool works only for the VMware-to-Azure scenario, not for Hyper-V to Azure deployments. For Hyper-V to Azure scenario use [Hyper-V capacity planner tool](./site-recovery-capacity-planning-for-hyper-v-replication.md).
* The GetThroughput operation is not supported in US Government and China Microsoft Azure regions.
* The tool cannot profile VMs if the vCenter has two or more VMs with the same name/IP address across different ESXi hosts. In this version, the tool skips profiling for duplicate VM names/IP addresses in the VMListFile. Workaround is to profile VMs with ESXi host instead of vCenter server. You need to run one instance for each ESXi host.
