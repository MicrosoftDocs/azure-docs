---
title: Azure Site Recovery Deployment Planner for VMware to Azure| Microsoft Docs
description: This is the Azure Site Recovery Deployment Planner user guide.
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
#Azure Site Recovery Deployment Planner
This is the Azure Site Recovery Deployment Planner user guide for VMware to Azure production deployments.


##Overview

Before protecting any VMware virtual machines using Azure Site Recovery, you need to allocate sufficient bandwidth based on your daily data change rate to meet the desired RPO. You need to deploy the right number of Configuration Servers and Process Servers on-premises. You also need to create the right type and number of target Azure Storage accounts - either standard or premium, factoring in growth on your source productiont servers due to increased usage over time. Storage type is decided per virtual machine based on workload characteristics (R/W IOPS, data churn) and Azure Site Recovery limits.  

Azure Site Recovery Deployment Planner Public Preview is a command line tool currently available only for the VMware to Azure scenario. You can remotely profile your VMware virtual machines using this tool (with no production impact whatsoever) to understand the bandwidth and Azure storage requirements for successful replication and Test Failover.  You can run the tool without installing any Azure Site Recovery components on-premises, although to get accurate achieved throughput results, it is recommended to run the Planner on a Windows Server that meets the minimum requirements of the Azure Site Recovery Configuration Server that you would eventually need to deploy as one of the first steps of the production deployment.

The tool provides the following details:

1. Virtual machine eligibility assessment based on number of disks, disk size, IOPS and churn
2. Estimated network bandwidth required for delta replication
3. Throughput that Azure Site Recovery can get from on-premises to Azure
4.	Number of virtual machines to batch based on estimated bandwidth to complete initial replication in a given amount of time
5.	Storage type (standard or premium storage) requirement for each virtual machine 
6.	Total number of standard and premium storage accounts to be provisioned for replication
7.	Storage accounts naming suggestions based on Azure Storage guidance
8.	Every virtual machine's storage account placement
9.	Number of Microsoft Azure cores to be provisioned before test failover/failover on the subscription 
10.	Recommended Microsoft Azure virtual machine size for each on-premises virtual machine
11.	Required number of Configuration Servers and Process Servers to be deployed on-premises

All these calculations in the tool are done assuming a 30% growth factor in your workload characteristics, due to possible increased usage over time, and taking 95th percentile of all the profiling metrics (R/W IOPS, churn, etc.) Both these parameters – growth factor and percentile calculation are configurable.



## Requirements
The tool has two main phases – profiling and report generation. There is also a third option to only calculate throughput. Below are the requirements for the server from where profiling / throughput measurement is initiated.

| Requirement | Description|
|---|---|
|Profiling & throughput measurement| <br>Operating System : Microsoft Windows Server 2012 R2 <br>Ideally matching at least the following Configuration Server [size](https://aka.ms/asr-v2a-on-prem-components)<br>Machine Configuration : 8 vCPus, 16 GB RAM, 300 GB HDD<br [Microsoft .NET Framework 4.5](https://aka.ms/dotnet-framework-45)<br>[VMware vSphere PowerCLI 6.0 R3](https://developercenter.vmware.com/tool/vsphere_powercli/6.0)<br>[Microsoft Visual C++ Redistributable for Visual Studio 2012](https://aka.ms/vcplusplus-redistributable)<br> Internet access to Microsoft Azure from this server<br> Microsoft Azure storage account<Br>Administrator access on the server<br>Minimum free disk space of 100 GB (assuming 1000 virtual machines with average 3 disks each profiled for 30 days)|
| Report Generation| Any Windows PC/Windows Server with Microsoft Excel 2013 and above |
| User Permissions | Read-only permission for the user account used to access the VMware vCenter/vSphere server during profiling|


> [!NOTE]
> 
> The tool can only profile virtual machines with VMDK and RDM disks. It cannot profile virtual machines with iSCSI or NFS disks. While Azure Site Recovery supports iSCSI and NFS disks for VMware servers, given the deployment planner is not sitting inside the guest and profiling only using vCenter performance counters, the tool does not have visibility into these disk types.
> 


##Download
[Download](https://aka.ms/asr-deployment-planner) the latest version of the Azure Site Recovery Deployment Planner Public Preview.  The tool is packaged in the zip format.  The current version of the tool supports only the VMware to Azure scenario. 

Copy the zip file to the Windows Server from where you want to run the tool. Though you can run the tool from any Windows Server 2012 R2 which has network access to connect to the VMware vCenter server or the VMware vSphere ESXi host which holds the virtual machines to be profiled, it is recommended to run the tool on a server whose hardware configuration is as per the [Configuration Server sizing guideline](https://aka.ms/asr-v2a-on-prem-components).  If you have already deployed Azure Site Recovery components on-premises, you should run the tool from the Configuration Server. Having the same hardware configuration as the Configuration Server (which has an in-built Process Server) on the server where you run the tool is recommended so that the achieved throughput that the tool reports will match the actual throughput that Azure Site Recovery can achieve during replication – the throughput calculation depends on available network bandwidth on the server and hardware configuration (CPU, storage, etc.) of the server. If you run the tool from any other server, throughput will be calculated from that server to Microsoft Azure, plus the hardware configuration of the server may be different than the Configuration Server, and so the achieved throughput that the tool reports will not be accurate.

Extract the zip folder. You can see multiple files and subfolders. The executable is ASRDeploymentPlanner.exe in the parent folder.

Example: 
Copy the .zip file to E:\ drive and extract it. 
E:\ASR Deployment Planner-Preview_v1.0.zip

E:\ASR Deployment Planner-Preview_v1.0\ ASR Deployment Planner-Preview_v1.0\ ASRDeploymentPlanner.exe

##Capabilities
The command line tool (ASRDeploymentPlanner.exe) can be run in any of the following three modes:

1.	Profiling  
2.	Report generation
3.	Get throughput

You first need to run the tool in profiling mode to gather the virtual machines data churn and IOPS.  Then run the tool to generate the report to find the network bandwidth, storage requirements.

##Profiling
In profiling mode, the Deployment Planner tool connects to the vCenter Server or vSphere ESXi hosts to collect performance data about the virtual machine.

* Profiling does not impact the performance of the production virtual machines as no direct connection is made to the production virtual machine. All performance data is collected from the vCenter Server/ vSphere ESXi host.
* The vCenter server / vSphere EXSi host is queried once every 15 minutes, to ensure that there is negligible impact on the server due to profiling. However, this does not compromise profiling accuracy because the tool is storing every minute’s performance counter data.

####Create a list of virtual machines to profile
First, you need to have the list of virtual machines that you are looking to profile. You can get all the names of virtual machines on a VMware vCenter or VMware vSphere ESXi host by using the following VMware vSphere PowerCLI commands. Alternatively, you can just list down friendly names / IP addresses of the virtual machines you are looking to profile manually in a file.

1.	Logon to the virtual machine where VMware vSphere PowerCLI is installed
2.	Open VMware vSphere PowerCLI console
3.	Ensure that execution policy is not disabled for the script. If disabled launch the VMware vSphere PowerCLI console in administrator mode and run the following command to enable it:

			Set-ExecutionPolicy –ExecutionPolicy AllSigned

4.	Run the following two commands to get all the names of virtual machines on a VMware vCenter or VMware vSphere ESXi and store in a .txt file.
Replace &lsaquo;server name&rsaquo;, &lsaquo;user name&rsaquo;, &lsaquo;password&rsaquo;, &lsaquo;outputfile.txt&rsaquo;; with your inputs.
 
			Connect-VIServer -Server <server name> -User <user name> -Password <password>

			Get-VM |  Select Name | Sort-Object -Property Name >  <outputfile.txt>


5.	Open the output file in Notepad. Copy the names of all virtual machines that you want to profile to another file (say ProfileVMList.txt), one virtual machine name per line. This file will be used as input to the -VMListFile parameter of the command line tool

	![Deployment Planner](./media/site-recovery-deployment-planner/profile-vm-list.png)
	

####Start profiling
After you have the list of VMs to be profiled, you can now run the tool in profiling mode. Here is the list of mandatory and optional parameters of the tool to run in profiling mode. Parameters in [] are optional.

ASRDeploymentPlanner.exe -Operation StartProfiling /?

| Parmeter Name | Description |
|---|---|
| -Operation |  	StartProfiling |
| -Server | Fully qualified domain name or IP address of the vCenter server/ESXi host whose virtual machines are to be profiled.|
| -User | User name to connect to the vCenter server/ESXi host. User needs to have atleast a read only access.|
| -VMListFile |	The file with the list of virtual machines to be profiled. The file path can be absolute or relative. This file should contain one virtual machine name/IP address per line. Virtual machine name specified in the file should be the same as the VM name on the vCenter server or the ESXi host. <br> E.g.: File “VMList.txt” contains the following virtual machines:<br>virtual_machine_A <br>10.150.29.110<br>virtual_machine_B |
| -NoOfDaysToProfile | Number of days for which profiling is to be run. It is recommended to run profiling for more than 15 days to ensure that the workload pattern in your environment over the specified period is observed and used to provide an accurate recommendation |
| [-Directory] |	UNC or local directory path to store profiling data generated during profiling. If not given, the directory named ‘ProfiledData’ under the current path will be used as the default directory. |
| [-Password ] | Password to connect to the vCenter server/ESXi host. If not specified now, you will be prompted for it when the command is executed.|
|  [-StorageAccountName]  | Azure Storage account name to find the throughput achievable for replication of data from on-premises to Azure. The tool uploads test data to this storage account to calculate throughput.|
| [-StorageAccountKey] | Azure Storage account Key used to access the storage account. Go to the Azure portal > Storage accounts > [Storage account name] > Settings > Access Keys > Key1 (or Primary access key for classic storage account). |

It is recommended to profile your virtual machines for at least 15 to 30 days. During the profiling period ASRDeploymentPlanner.exe keeps running. The tool takes profiling time input in days. If you want to profile for few hours or minutes for a quick test of the tool, in the Public Preview, you will need to convert the time into the equivalent measure of days.  For example, to profile for 30 minutes, the input will need to be 30 / (60*24) = 0.021 days.  Minimum allowed profiling time is 30 minutes. 

During profiling, you can optionally pass an Azure Storage account name and key to find the throughput that Azure Site Recovery can achieve at the time of replication from the Configuration Server / Process Server to Azure. If Azure Storage account name and key are not passed during profiling, the tool does not calculate achievable throughput. 


#####Example 1: To profile virtual machines for 30 days and find the throughput from on-premises to Azure
ASRDeploymentPlanner.exe **-Operation** StartProfiling -Directory “E:\vCenter1_ProfiledData” **-Server** vCenter1.contoso.com **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt”  **-NoOfDaysToProfile**  30  **-User** vCenterUser1 **-StorageAccountName**  asrspfarm1 **-StorageAccountKey** Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==

#####Example 2: To profile virtual machines for 15 days
ASRDeploymentPlanner.exe **-Operation** StartProfiling **-Directory** “E:\vCenter1_ProfiledData” **-Server** vCenter1.contoso.com **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt”  **-NoOfDaysToProfile**  15  -User vCenterUser1 

#####Example 3: To profile virtual machines for 1 hour for a quick test of the tool
ASRDeploymentPlanner.exe **-Operation** StartProfiling **-Directory** “E:\vCenter1_ProfiledData” **-Server** vCenter1.contoso.com **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt”  **-NoOfDaysToProfile**  0.04  **-User** vCenterUser1


>[!NOTE]
>
> * If the server from where the tool is running is rebooted or has crashed, or if you exit the tool using Ctrl + C, profiled data will be preserved. There is a chance of missing the last 15 minutes of profiled data due to this. You need to re-run the tool in profiling mode after the server starts back up.
> * When Azure Storage account name and key is passed, the tool measures the throughput at the last step of profiling. If the tool is terminated before profiling gracefully completes, throughput is not calculated. You can always run the GetThroughput  operation from the command line console to find the throughput before generating the report, otherwise the generated report will not have the achieved throughput information. 
> * You can run multiple instances of the tool for different sets of virtual machines. Ensure virtual machine names are not repeated in any of the profiling sets. For example, you have profiled ten virtual machines (VM1 - VM10) and after few days you want to profile another five virtual machines (VM11 - VM15), you can run the tool from another command line console for the second set of virtual machines (VM11 - VM15). But ensure that the second set of virtual machines do not have any virtual machine names from the first profiling instance or you use a different output directory for the second run. If two instances of the tool are used for profiling the same virtual machines and use the same output directory, the generated report will be incorrect.
> * Virtual machine configuration 
>  are captured once at the beginning of the profiling operation and stored in a file called VMDetailList.xml. This information will be used at the time of report generation. Any change in VM configuration (e.g. increased number of cores, disks, NICs, etc.) from the time profiling started to when profiling ended will not be captured. If you have a situation where any profiled virtual machine configuration has changed during the course of profiling, in the Public Preview, here is the workaround to get latest virtual machine details when generating the report.   
>  
>      Back-up 'VMdetailList.xml' and delete the file from its current location.
>      
>      Pass -User and -Password arguments at the time of report generation.
> 
> * The profiling command generates several files in the profiling directory – please do not delete any of them, else report generation will be impacted.


##Generate report
The tool generates a XLSM (macro-enabled Microsoft Excel file) as the report output which summarizes all the deployment recommendations – the report is named DeploymentPlannerReport_<Unique Numeric Identifier>.xlsm and placed in the specified directory.

After profiling is complete, you can run the tool in report generation mode. Here is the list of mandatory and optional parameters of the tool to run in report generation mode. Parameters in [] are optional.

ASRDeploymentPlanner.exe -Operation GenerateReport /?

|Parmeter Name | Description |
|-|-|	
| -Operation | GenerateReport |
| -Server |  vCenter/vSphere Server fully qualified domain name or IP address (use the exact same name or IP address as you used at the time of profiling) where the profiled virtual machines whose report is to be generated are located. Note that if you used a vCenter Server at the time of profiling, you cannot use a vSphere Server for report generation, and vice-versa.|
| -VMListFile | The file with the list of profiled virtual machines for which the report is to be generated. The file path can be absolute or relative. This file should contain one virtual machine name/IP address per line. Virtual machine names specified in the file should be the same as the virtual machine names on the vCenter server or the ESXi host, and match what was used at profiling time.|
| [-Directory] | UNC or local directory path where the profiled data (files generated during profiling) is stored. This data is required for generating the report. If not specified, ‘ProfiledData’ directory will be used. |
| [-GoalToCompleteIR] |	Number of hours in which the initial replication of the profiled virtual machines needs to be completed. The generated report will provide the number of virtual machines for which initial replication can be completed in the specified time. Default is 72 hours. |
| [-User] | User name to connect to the vCenter/vSphere server. This is used to fetch the latest configuration information of the virtual machines like number of disks, number of cores, number of NICs, etc. to use in the report. If not provided, configuration information collected at the beginning of profiling kick-off is used. |
| [-Password] | Password to connect to the vCenter server/ESXi host. If not specified as a parameter, you will be prompted for it later when the command is executed. |
| [-DesiredRPO] | Desired Recovery Point Objective (RPO) in minutes. Default is 15 minutes.| 
| [-Bandwidth] | Bandwidth in Mbps. This is used to calculate the RPO that can be achieved for the specified bandwidth. |
| [-StartDate]  | Start date and time in MM-DD-YYYY:HH:MM (in 24 hours format). ‘StartDate’ needs to be specified along with ‘EndDate’. When specified, the report will be generated for the profiled data collected between StartDate and EndDate. |
| [-EndDate] | End date and time in MM-DD-YYYY:HH:MM (in 24 hours format). ‘EndDate’ needs to be specified along with ‘StartDate’. When specified, the report will be generated for the profiled data collected between StartDate and EndDate. |
| [-GrowthFactor] |Growth factor in percentage. Default is 30%.  |


##### Example 1: To generate report with default values when profiled data is on the local drive
ASRDeploymentPlanner.exe **-Operation** GenerateReport **-Server** vCenter1.contoso.com **-Directory** “E:\vCenter1_ProfiledData” **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt” 


##### Example 2: To generate report when profiled data is on a remote server. User should have read/write access on the remote directory.
ASRDeploymentPlanner.exe **-Operation** GenerateReport **-Server** vCenter1.contoso.com **-Directory** “\\PS1-W2K12R2\vCenter1_ProfiledData” **-VMListFile** “\\PS1-W2K12R2\vCenter1_ProfiledData\ProfileVMList1.txt” 

##### Example 3: Generate report with specific bandwidth and goal to complete IR within specified time 
ASRDeploymentPlanner.exe **-Operation** GenerateReport **-Server** vCenter1.contoso.com **-Directory** “E:\vCenter1_ProfiledData” **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt” **-Bandwidth** 100 **-GoalToCompleteIR** 24

##### Example 4: Generate report with 5% growth factor instead of the default 30%
ASRDeploymentPlanner.exe **-Operation** GenerateReport **-Server** vCenter1.contoso.com **-Directory** “E:\vCenter1_ProfiledData” **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt” **-GrowthFactor** 5

##### Example 5: Generate report with a subset of profiled data. Say you have 30 days of profiled data and want to generate the report for only 20 days.
ASRDeploymentPlanner.exe **-Operation** GenerateReport **-Server** vCenter1.contoso.com **-Directory** “E:\vCenter1_ProfiledData” **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt” **-StartDate**  01-10-2017:12:30 -EndDate 01-19-2017:12:30

##### Example 6: Generate report for 5 minutes RPO.
ASRDeploymentPlanner.exe **-Operation** GenerateReport **-Server** vCenter1.contoso.com **-Directory** “E:\vCenter1_ProfiledData” **-VMListFile** “E:\vCenter1_ProfiledData\ProfileVMList1.txt”  **-DesiredRPO** 5

>[!IMPORTANT]
> * **What default percentile value of the performance metrics collected during profiling is used at the time of report generation?**
> The tool defaults to 95th percentile values of R/W IOPS, write IOPS, and data churn collected during profiling of all the VMs. This ensures that the 100th percentile spike your VMs may see due to temporary events like say a backup job running once a day, a periodic database indexing or analytics report generation activity, or any other similar point in time short-lived event that happens during the profiling period is not used to determine your target Azure Storage and source bandwidth requirements. Using 95th percentile values gives a true picture of real workload characteristics and gives you the best performance when these workloads are running on Microsoft Azure. We do not expect you to change this number often, but if you choose to go even lower, e.g. 90th percentile, you can update this configuration file ‘ASRDeploymentPlanner.exe.config’ in the default folder and save it to generate a new report on the existing profiled data.
>
>      &lsaquo;add key="WriteIOPSPercentile" value="95" /&rsaquo;>      
>      &lsaquo;add key="ReadWriteIOPSPercentile" value="95" /&rsaquo;>      
>      &lsaquo;add key="DataChurnPercentile" value="95" /&rsaquo;
>  
> * **Why should one consider growth factor while deployment planning?** 
> It is critical to account for growth in your workload characteristics assuming potential increase in usage over time. This is because once protected if your workload characteristics change, there is currently no means to switch to a different Azure Storage account for protection without disabling and re-enabling protection. E.g. if today a virtual machine fits in a standard storage replication account, in say three months’ time, due to an increase in number of users of the application running on the virtual machine, if say the churn on the VM increases and requires it to go to premium storage so that Azure Site Recovery replication can keep up with the new higher churn, you will have to disable and re-enable protection to a premium storage account. So, it is strongly advised to plan for growth while deployment planning and the default value is 30%. You know your applications usage pattern and growth projections the best and can change this number accordingly while generating a report. You can in fact generate multiple reports with different growth factors with the same profiled data and see what target Azure Storage and source bandwidth recommendations work best for you.

The generated Microsoft Excel report has following sheets

* [Input](site-recovery-deployment-planner.md#input) 
* [Recommedations](site-recovery-deployment-planner.md#recommendations-with-desired-rpo-as-input) 
* [Recommedations-Bandwidth Input](site-recovery-deployment-planner.md#recommendations-with-available-bandwidth-as-input)
* [VM<->Storage Placement](site-recovery-deployment-planner.md#vm-storage-placement)
* [Compatible VMs](site-recovery-deployment-planner.md#compatible-vms)
* [Incompatible VMs](site-recovery-deployment-planner.md#incompatible-vms)

![Deployment Planner](./media/site-recovery-deployment-planner/dp-report.png)


##Get throughput
To estimate the throughput that Azure Site Recovery can achieve from on-premises to Azure during replication, run the tool in GetThroughput mode. The tool calculates the throughput from the server where the tool is running (ideally a server based on the Configuration Server sizing guide).  If you have already deployed Azure Site Recovery infrastructure components on-premises, run the tool on the Configuration Server. 

Open a command line console and go to ASR deployment planning tool folder.  Run ASRDeploymentPlanner.exe with following parameters. Parameters in [] are optional.

ASRDeploymentPlanner.exe -Operation GetThroughput /?

|Parmeter Name | Description |
|-|-|
| -operation | GetThroughput |
| [-Directory] | UNC or local directory path where the profiled data (files generated during profiling) is stored. This data is required for generating the report. If not specified, ‘ProfiledData’ directory will be used.  |
| -StorageAccountName | Azure Storage account name to find the bandwidth consumed for replication of data from on-premises to Azure. The tool uploads test data to this storage account to find the bandwidth consumed. |
| -StorageAccountKey | Azure Storage Account Key used to access the storage account. Go to the Azure portal > Storage accounts > [Storage account name] > Settings > Access Keys > Key1(or Primary access key for classic storage account). |
| -VMListFile | The file with the list of virtual machines to be profiled for calculating the bandwidth consumed. The file path can be absolute or relative. This file should contain one virtual machine name/IP address per line. The virtual machine names specified in the file should be the same as the virtual machine names on the vCenter server or ESXi host.<br>E.g. File “VMList.txt” contains the following virtual machines:<br>virtual machine_A <br>10.150.29.110<br>virtual machine_B|

##### Example 
ASRDeploymentPlanner.exe **-Operation** GetThroughput **-Directory**  E:\vCenter1_ProfiledData **-VMListFile** E:\vCenter1_ProfiledData\ProfileVMList1.txt  **-StorageAccountName**  asrspfarm1 **-StorageAccountKey** by8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==

>[!NOTE]
>
> * Run the tool on a server which has the same storage and CPU characteristics as the Configuration Server
> 
> * For replication, provision the bandwidth that is recommended to meet the RPO 100% of the time. Even after provisioning the right bandwidth, if you don’t see any increase in the achieved throughput reported by the tool, check the following:
> 
> a. Check if there is any network Quality of Service (QoS) that is limiting Azure Site Recovery throughput
> 
> b. Check if your Azure Site Recovery vault is in the nearest physical supported Microsoft Azure region to minimize network latency
> 
> c. Check your local storage characteristics and look to improve the hardware (e.g. HDD to SSD, etc.)
> 
> * The tool creates several 64 MB ‘asrvhdfile<#>.vhd’ (where # is the number) files on the specified directory.  It uploads these files to the Azure Storage account to find the throughput. Once the throughput is measured it deletes all these files from the Azure Storage account and from the local server. If the tool is terminated for any reason mid-way while calculating throughput, it will not delete the files from Azure Storage or from the local server and you will have to delete them manually.
> 
> * The throughput is measured at a given point of time and it is the maximum throughput that Azure Site Recovery can achieve during replication provided all other factors remain the same. For example, if any application starts consuming more bandwidth on the same network, then actual throughput varies during replication. If you are running GetThroughput command from a Configuration Server, the tool is not aware of any protected virtual machines and on-going replication. Result of measured throughout will be different if the GetThroughput operation is run at the time when protected virtual machines have high data churn vs. when they have low data churn.  It is recommended to run the tool at different points of time during profiling to understand what throughput can be achieved at various times. In the report, the tool shows the last measured throughput.
> 

##Recommendations with desired RPO as input

###Profiled data

![Deployment Planner](./media/site-recovery-deployment-planner/profiled-data-period.png)

**Profiled data period** is the duration for which profiling was run. By default, the tool takes all the profiled data for the calculation unless the report is generated for a specific period by using StartDate and EndDate options during report generation.

**Server Name** is the name or IP address of the VMware vCenter or ESXi host whose virtual machines’ report is generated.

**Desired RPO** is the Recovery Point Objective (RPO) goal for your deployment. By default, the required network bandwidth is calculated for RPO values of 15, 30 and 60 minutes. Based on the selection, the impacted values are updated on the sheet. If you have used the DesiredRPOinMin parameter while generating the report, that value is shown in this Desired RPO dropdown.

###Profiling Overview

![Deployment Planner](./media/site-recovery-deployment-planner/profiling-overview.png)

**Total Profiled Virtual Machines** is the total number of virtual machines whose profiled data is available. If the VMListFile has names of any virtual machines which were not profiled, those virtual machines are not considered in the report generation and excluded from the total profiled virtual machines count.

**Compatible Virtual Machines** is the number of virtual machines that can be protected to Azure using Azure Site Recovery. It is the total number of compatible virtual machines for which required network bandwidth, number of Azure Storage accounts, number of Microsoft Azure cores and number of Configuration Servers and additional Process Servers are calculated. The details of every compatible virtual machine is available in the Compatible VMs sheet of the report.

**Incompatible Virtual Machines** is the number of profiled virtual machines which are incompatible for protection with Azure Site Recovery. The reasons for incompatibility are noted in the Incompatible VMs section below. If the VMListFile has names of any virtual machines which were not profiled, those virtual machines are excluded from the incompatible virtual machines count. These virtual machines are listed as ‘Data not found’ at the end of the Incompatible VMs sheet.

**Desired RPO** is your desired RPO in minutes. The report is generated for three RPO values – 15, 30 and 60 minutes, with 15 minutes being the default. The bandwidth recommendation in the report will be changed based on your selection in the Desired RPO dropdown on the top right of the sheet. If you have generated the report using the “-DesiredRPO” parameter with a custom value, this custom value will show as the default in the Desired RPO dropdown.

###Required Network Bandwidth (Mbps)

![Deployment Planner](./media/site-recovery-deployment-planner/required-network-bandwidth.png)

**To meet RPO 100% of the time:** It is the recommended bandwidth in Mbps to be allocated to meet your desired RPO 100% of the time. This amount of bandwidth must be dedicated for steady state delta replication of all your compatible virtual machines to avoid any RPO violations.

**To meet RPO 90% of the time**: Due to broadband pricing or for any other reason if you cannot provision the bandwidth needed to meet your desired RPO 100% of the time, you can choose to go with provisioning a lower bandwidth amount that can meet your desired RPO 90% of the time. To understand the implications of provisioning this lower bandwidth, the report provides a what if analysis on the number and duration of RPO violations to expect.

**Achieved Throughput:** It is the throughput from the server where you have run the GetThroughput command to the Microsoft Azure region where the Azure Storage account is located. It indicates the ballpark throughput that can be achieved when you protect the compatible virtual machines using Azure Site Recovery, provided your Configuration Server / Process Server storage and network characteristics remain the same as that of the server from where you have run the tool. Achieved Throughput is the throughput from the server where you have run the GetThroughput command to the Microsoft Azure region where the Azure Storage account is located. It indicates the ballpark throughput that can be achieved when you protect the compatible virtual machines using Azure Site Recovery, provided your Configuration Server / Process Server storage and network characteristics remain the same as that of the server from where you have run the tool.

For replication, you should provision the bandwidth that is recommended to meet the RPO 100% of the time. Even after provisioning the right bandwidth, if you don’t see any increase in the achieved throughput reported by the tool, check the following:

a.	Check if there is any network Quality of Service (QoS) that is limiting Azure Site Recovery throughput

b.	Check if your Azure Site Recovery vault is in the nearest physical supported Microsoft Azure region to minimize network latency

c.	Check your local storage characteristics and look to improve the hardware (e.g. HDD to SSD, etc.)

In cases where you are running the tool on a Configuration Server / Process Server that already has protected virtual machines, run the tool a few times because the achieved throughput number will change depending on the amount of churn being processed at that particular point of time.

For all enterprise Azure Site Recovery deployments, using [ExpressRoute](https://aka.ms/expressroute) is recommended. 

###Required Azure Storage Accounts
This chart shows the total number of Azure Storage accounts (standard and premium) required to protect all the compatible virtual machines.  Click on [Recommended VM placement plan](site-recovery-deployment-planner.md#vm-storage-placement) to know which storage account should be used for each virtual machine.  

![Deployment Planner](./media/site-recovery-deployment-planner/required-azure-storage-accounts.png)

###Required Number of Azure Cores
This is the total number of cores to be provisioned before failover or test failover of all the compatible virtual machines. If sufficient cores are not available in the subscription, Azure Site Recovery fails to create virtual machine(s) at the time of test failover or failover.

![Deployment Planner](./media/site-recovery-deployment-planner/required-number-of-azure-cores.png)

###Required On-premises Infrastructure
It is the total number of Configuration Servers and additional Process Servers to be configured to protect all the compatible virtual machines. Based on the supported [limits](https://aka.ms/asr-v2a-on-prem-components) on the largest configuration - either the per day churn or the maximum number of protected virtual machines (assuming average of three disks per virtual machine), whichever is hit first on the Configuration Server or the additional Process Server, the tool recommends additional servers. The details of total churn per day and total number of protected disks are found in the [Input](site-recovery-deployment-planner.md#input) sheet.

![Deployment Planner](./media/site-recovery-deployment-planner/required-on-premises-infrastructure.png)

###What If Analysis
This analysis outlines how many violations could occur during the profiling period when you provision lower bandwidth for the desired RPO to be met only 90% of the time. There can be one or more RPO violations that occur on any given day - the graph shows the peak RPO of the day.
Based on this analysis, you can decide if the number of RPO violations across all days and peak RPO hit per day is acceptable with the specified lower bandwidth. If it is acceptable you can allocate the lower bandwidth for replication, else allocate the higher bandwidth as suggested to meet the desired RPO 100% of the time.

![Deployment Planner](./media/site-recovery-deployment-planner/what-if-analysis.png)

###Recommended VM batch size for initial replication
This section recommends the number of virtual machines that can be protected in parallel to complete initial replication within 72 hours (configurable value – use the GoalToCompleteIR parameter at report generation time to change this) with the suggested bandwidth to meet desired RPO 100% of the time being provisioned.  The graph shows a range of bandwidth values and calculated virtual machine batch size count to complete initial replication in 72 hours based on the average detected virtual machine size across all the compatible virtual machines.  

In the Public Preview, the report does not specify which virtual machines should be included in a batch. You can use the disk size shown in the Compatible VMs sheet to find each virtual machine’s size and select your virtual machines for a batch or select based on known workload characteristics.  Initial replication completion time proportionately changes based on the actual virtual machine disk size, used space disk space and available network throughput.

![Deployment Planner](./media/site-recovery-deployment-planner/recommended-vm-batch-size.png)

###Growth factor and percentile values used
This section at the bottom of the sheet shows the percentile value used for all the performance counters of the profiled virtual machines (default 95th percentile), and the growth factor in % used in all the calculations (default 30%).

![Deployment Planner](./media/site-recovery-deployment-planner/max-iops-and-data-churn-setting.png)

##Recommendations with available bandwidth as input

![Deployment Planner](./media/site-recovery-deployment-planner/profiling-overview-bandwidth-input.png)

You may have a situation where you know that you cannot provision more than x Mbps bandwidth for Azure Site Recovery replication. The tool allows you to input available bandwidth (using the -Bandwidth parameter while report generation) and get the achievable RPO in minutes. With this achievable RPO value, you can decide if you need to provision additional bandwidth or are okay with having a disaster recovery solution with this RPO.

![Deployment Planner](./media/site-recovery-deployment-planner/achievable-rpos.png)

##Input
The Input page provides an overview of the profiled VMware environment. 

![Deployment Planner](./media/site-recovery-deployment-planner/Input.png)

**Start Date and End Date** are the start and end dates of the profiling data considered for report generation. By default, the start date is the date when profiling started and end date is the date when profiling stops.  This can be the ‘StartDate’ and ‘EndDate’ values if the report is generated with these parameters. Start Date and End Date: These are the start and end dates of the profiling data considered for report generation. By default, the start date is the date when profiling started and end date is the date when profiling stops.  This can be the ‘StartDate’ and ‘EndDate’ values if the report is generated with these parameters.

**Total number of profiling days** is the total number of days of profiling between the start and end dates for which the report is generated. Total number of profiling days is the total number of days of profiling between the start and end dates for which report is generated.

**Number of compatible virtual machines** is the total number of compatible virtual machines for which the required network bandwidth, required number of Azure Storage accounts, Microsoft Azure cores, Configuration Servers and additional Process Servers are calculated. 
Total number of disks across all compatible virtual machines  is the total number of disks across all compatible virtual machines. This number is used as one of the inputs to decide the number of Configuration Servers and additional Process Servers to be used in the deployment.

**Average number of disks per compatible virtual machine** is the average number of disks calculated across all compatible virtual machines.

**Average disk size (GB)** is the average disk size calculated across all compatible virtual machines.

**Desired RPO (minutes)** is either the default RPO or the value passed for the ‘DesiredRPO’ parameter at the time of report generation to estimate required bandwidth.

**Desired bandwidth (Mbps)** is the value that you have passed for the ‘Bandwidth’ parameter at the time of report generation to estimate achievable RPO.

**Observed typical data churn per day (GB)** is the average data churn observed across all profiling days. This number is used as one of the inputs to decide the number of Configuration Servers and additional Process Servers to be used in the deployment.


##VM-Storage placement

![Deployment Planner](./media/site-recovery-deployment-planner/vm-storage-placement.png)

**Disk Storage Type** is either ‘Standard’ or ‘Premium’ Azure Storage account used to replicate all the corresponding virtual machines mentioned in the ‘VMs to Place’ column.

**Suggested Prefix**  is the suggested three-character prefix that can be used for naming the Azure storage account. You can always use your own prefix, but what the tool suggests is following the [partition naming convention of Azure Storage accounts](https://aka.ms/storage-performance-checklist). 

**Suggested Account Name** indicates how your Azure Storage account name should look like after including the suggested prefix. Replace name in < > with your custom input.

**Log Storage Account:** All the replication logs are stored in a standard Azure Storage account. For the virtual machines replicating to a premium Azure Storage account, an additional standard Azure Storage account needs to be provisioned for log storage. A single standard log storage account can be used by multiple premium replication storage accounts. Virtual machines replicated to standard storage accounts use the same storage account for logs. 

**Suggested Log Account Name** indicates how your log Azure Storage account name should look like after including the suggested prefix. Replace name in < > with your custom input.

**Placement Summary** provides a summary of the total virtual machines load on the Azure Storage account at the time of replication and test failover / failover. It includes the total number of virtual machines mapped to the Azure Storage account, total read/write IOPS across all virtual machines being placed in this Azure Storage account, total write (replication) IOPS, total provisioned size across all disks, and total number of disks.

**Virtual Machines to Place** lists all the virtual machines that should be placed on the given Azure Storage account for optimal performance and utilization.

##Compatible VMs
![Deployment Planner](./media/site-recovery-deployment-planner/compatible-vms.png)

**VM Name** is the virtual machine name or IP address as used in the VMListFile at the time of report generation. This column also lists the disks (VMDKs) attached to the virtual machines.

**VM Compatibility** has two values – Yes / Yes*. Yes* is for those cases where the virtual machine is a fit for [premium Azure Storage](https://aka.ms/premium-storage-workload) with the profiled high churn / IOPS disk fitting in the P20 or P30 category, but the size of the disk causes it to be mapped down to a P10 or P20. Azure Storage decides which premium storage disk type to map a disk to based on its size – i.e. < 128 GB is a P10, 128 to 512 GB is a P20, and 512 GB to 1023 GB is a P30. So if the workload characteristics of a disk put it in a P20 or P30, but the size maps it down to a lower premium storage disk type, the tool marks that virtual machine as a Yes* and recommends you to either change the source disk size to fit into the right recommended premium storage disk type, or change the target disk type post failover.
Storage Type is standard or premium.

**Suggested Prefix** is the three-character Azure Storage account prefix

**Storage Account** is the name using the suggested prefix

**R/W IOPS (with Growth Factor)** is the peak workload IOPS on the disk (default 95th percentile) including the future growth factor (default 30%). Note that the total R/W IOPS of the virtual machine is not always going to be the sum of the virtual machine’s individual disks’ R/W IOPS, because the peak R/W IOPS of the virtual machine is the peak of the sum of its individual disks R/W IOPS across every minute of the profiling period.

**Data Churn in Mbps (with Growth Factor)** is the peak churn rate on the disk (default 95th percentile) including the future growth factor (default 30%). Note that the total data churn of the virtual machine is not always going to be the sum of the virtual machine’s individual disks’ data churn, because the peak data churn of the virtual machine is the peak of the sum of its individual disks churn across every minute of the profiling period.

**Azure VM Size** is the ideal mapped Azure Compute virtual machine size for this on-premises virtual machine. This mapping is done based on the on-premises virtual machine’s memory, number of disks/cores/NICs, and R/W IOPS - the recommendation is always the lowest Azure virtual machine size that matches all these on-premises virtual machine characteristics.

**Number of Disks** is the total number of disks (VMDKs) on the virtual machine

**Disk size (GB)** is the total provisioned size of all disks of the virtual machine. The tool also shows the disk size for the individual disks in the virtual machine.

**Cores** is the number of CPU cores on the virtual machine.

**Memory (MB)** is the RAM on the virtual machine.

**NICs** is the number of NICs on the virtual machine.

##Incompatible VMs

![Deployment Planner](./media/site-recovery-deployment-planner/incompatible-vms.png)

**VM Name** is the virtual machine name or IP address as used in the VMListFile at the time of report generation. This column also lists the disks (VMDKs) attached to the virtual machines.

**VM Compatibility** indicates why the given virtual machine is incompatible for use with Azure Site recovery. The reasons are outlined per incompatible disk of the virtual machine and can be one of the following based on published Azure Storage [limits](https://aka.ms/azure-storage-scalbility-performance).

* Disk size > 1023 GB – Azure Storage currently does not support > 1 TB disk sizes
* Total VM size (replication + TFO) exceeds supported Azure Storage account size limit (35 TB) – This usually happens when there is a single disk in the virtual machine that has some performance characteristics that exceeds the maximum supported Microsoft Azure / Azure Site Recovery limits for standard storage which pushes the virtual machine into premium storage zone. However, the maximum supported size of a premium Azure Storage account is 35 TB, and a single protected virtual machine cannot be protected across multiple storage accounts. Also note that when a TFO (test failover) is executed on a protected virtual machine, it runs in the same storage account where replication is progressing – so we need to provision 2x the size of the disk for replication to progress and test failover to succeed in parallel.
* Source IOPS exceeds supported Azure Storage IOPS limit of 5000 per disk
* Source IOPS exceeds supported Azure Storage IOPS limit of 80,000 per VM
* Average data churn exceeds supported Azure Site Recovery data churn limit of 10 MBps for average IO size for disk
* Total data churn across all disks on the VM exceeds the maximum supported Azure Site Recovery data churn limit of 54 MBps per VM
* Average effective write IOPS exceeds supported Azure Site Recovery IOPS limit of 840 for disk
* Calculated snapshot storage exceeding the supported snapshot storage limit of 10 TB

**R/W IOPS (with Growth Factor)** is the peak workload IOPS on the disk (default 95th percentile) including the future growth factor (default 30%). Note that the total R/W IOPS of the virtual machine is not always going to be the sum of the virtual machine’s individual disks’ R/W IOPS, because the peak R/W IOPS of the virtual machine is the peak of the sum of its individual disks R/W IOPS across every minute of the profiling period.

**Data Churn in Mbps (with Growth Factor)** is the peak churn rate on the disk (default 95th percentile) including the future growth factor (default 30%). Note that the total data churn of the virtual machine is not always going to be the sum of the virtual machine’s individual disks’ data churn, because the peak data churn of the virtual machine is the peak of the sum of its individual disks churn across every minute of the profiling period.

**Number of Disks** is the total number of disks (VMDKs) on the virtual machine

**Disk size (GB)** is the total provisioned size of all disks of the virtual machine. The tool also shows the disk size for the individual disks in the virtual machine.

**Cores** is the number of CPU cores on the virtual machine.

**Memory (MB)** is the RAM on the virtual machine.

**NICs** is the number of NICs on the virtual machine.


##Azure Site Recovery limits

**Replication Storage Target** | **Average Source Disk I/O Size** |**Average Source Disk Data Churn** | **Total Source Disk Data Churn Per Day**
---|---|---|---
Standard storage | 8 KB	| 2 MB/s | 168 GB per disk
Premium P10 disk | 8 KB	| 2 MB/s | 168 GB per disk
Premium P10 disk | 16 KB | 4 MB/s |	336 GB per disk
Premium P10 disk | 32 KB or higher | 8 MB/s | 672 GB per disk
Premium P20/P30 disk | 8 KB	| 5 MB/s | 421 GB per disk
Premium P20/P30 disk | 16 KB or higher |10 MB/s	| 842 GB per disk


These are average numbers assuming a 30% IO overlap. Azure Site Recovery is capable of handling higher throughput based on overlap ratio, larger write sizes and actual workload I/O behaviour. The above numbers assume a typical backlog of ~5 minutes, i.e. data once uploaded will be processed and a recovery point created within 5 minutes.

The above published limits are based on our tests but cannot cover all possible application I/O combinations. Actual results will vary based on your application I/O mix. For best results, even after deployment planning, it is always recommended to perform extensive application testing using test failover to get the true performance picture. 

##Release notes
The Azure Site Recovery Deployment Planner Public Preview 1.0 has the following known issues that will be addressed in upcoming updates.

* The tool works only for the VMware to Azure scenario, not for Hyper-V to Azure deployments.
* The GetThroughput operation is not supported in US Government and China Microsoft Azure regions.
* The tool cannot profile virtual machines if the vCenter has two or more virtual machines with the same name/IP address  across different ESXi hosts. In this version, the tool skips profiling for duplicate virtual machine names/IP addresses in the VMListFile. Workaround is to profile virtual machines with ESXi host instead of vCenter server. You need to run one instance for each ESXi host.
