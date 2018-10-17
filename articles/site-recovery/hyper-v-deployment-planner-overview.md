---
title: Azure Site Recovery deployment planner for Hyper-V-to-Azure| Microsoft Docs
description: This is the Azure Site Recovery deployment planner user guide for Hyper-V to Azure scenario.
services: site-recovery
author: nsoneji
manager: garavd
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.topic: conceptual
ms.date: 10/11/2018
ms.author: nisoneji

---
# Site Recovery Deployment Planner for Hyper-V to Azure

This article is the Azure Site Recovery Deployment Planner user guide for Hyper-V-to-Azure production deployments.

Before you begin protecting any Hyper-V virtual machines (VMs) using Site Recovery, allocate sufficient bandwidth based on your daily data-change rate to meet your desired Recovery Point Objective (RPO), and allocate sufficient free storage space on each volume of Hyper-V storage on-premises.

You also need to create the right type and number of target Azure storage accounts. You create either standard or premium storage accounts, factoring in growth on your source production servers because of increased usage over time. You choose the storage type per VM, based on workload characteristics, for example, read/write I/O operations per second (IOPS), or data churn, and Azure Site Recovery limits. 

The Azure Site Recovery deployment planner is a command-line tool for both Hyper-V to Azure and VMware to Azure disaster recovery scenarios. You can remotely profile your Hyper-V VMs present on multiple Hyper-V hosts using this tool (with no production impact whatsoever) to understand the bandwidth and Azure storage requirements for successful replication and test failover / failover. You can run the tool without installing any Azure Site Recovery components on-premises. However, to get accurate achieved throughput results, we recommend that you run the planner on a Windows Server that has the same hardware configuration as that of one of the Hyper-V servers that you will use to enable disaster recovery protection to Azure. 

The tool provides the following details:

**Compatibility assessment**

* VM eligibility assessment, based on number of disks, disk size, IOPS, churn, and few VM characteristics.

**Network bandwidth need versus RPO assessment**

* The estimated network bandwidth that's required for delta replication
* The throughput that Azure Site Recovery can get from on-premises to Azure
* RPO that can be achieved for a given bandwidth
* Impact on the desired RPO if lower bandwidth is provisioned.

    
**Azure infrastructure requirements**

* The storage type (standard or premium storage account) requirement for each VM
* The total number of standard and premium storage accounts to be set up for replication
* Storage-account naming suggestions, based on Azure Storage guidance
* The storage-account placement for all VMs
* The number of Azure cores to be set up before test failover or failover on the subscription
* The Azure VM-recommended size for each on-premises VM

**On-premises infrastructure requirements**
* The required free storage space on each volume of Hyper-V storage for successful initial replication and delta replication to ensure that VM replication will not cause any undesirable downtime for your production applications
* Maximum copy frequency to be set for Hyper-V replication

**Initial replication batching guidance** 
* Number of VM batches to be used for protection
* List of VMs in each batch
* Order in which each batch is to be protected
* Estimated time to complete initial replication of each batch

**Estimated DR cost to Azure**
* Estimated total DR cost to Azure: compute, storage, network, and Azure Site Recovery license cost
* Detail cost analysis per VM



>[!IMPORTANT]
>
>Because usage is likely to increase over time, all the preceding tool calculations are performed assuming a 30% growth factor in  workload characteristics, and using a 95th percentile value of all the profiling metrics (read/write IOPS, churn, and so forth). Both of these elements (growth factor and percentile calculation) are configurable. To learn more about growth factor, see the "Growth-factor considerations" section. To learn more about  percentile value, see the "Percentile value used for the calculation" section.
>

## Support matrix

| | **VMware to Azure** |**Hyper-V to Azure**|**Azure to Azure**|**Hyper-V to secondary site**|**VMware to secondary site**
--|--|--|--|--|--
Supported scenarios |Yes|Yes|No|Yes*|No
Supported Version | vCenter 6.5, 6.0 or 5.5| Windows Server 2016, Windows Server 2012 R2 | NA |Windows Server 2016, Windows Server 2012 R2|NA
Supported configuration|vCenter, ESXi| Hyper-V cluster, Hyper-V host|NA|Hyper-V cluster, Hyper-V host|NA|
Number of servers that can be profiled per running instance of the Azure Site Recovery Deployment Planner |Single (VMs belonging to one vCenter Server or one ESXi server can be profiled at a time)|Multiple (VMs across multiple hosts or host clusters can be profile at a time)| NA |Multiple (VMs across multiple hosts or host clusters can be profile at a time)| NA

*The tool is primarily for the Hyper-V to Azure disaster recovery scenario. For Hyper-V to secondary site disaster recovery, it can be used only to understand source side recommendations like required network bandwidth, required free storage space on each of the source Hyper-V servers, and initial replication batching numbers and batch definitions.  Ignore the Azure recommendations and costs from the report. Also, the Get Throughput operation is not applicable for the Hyper-V to secondary site disaster recovery scenario.

## Prerequisites
The tool has three main phases for Hyper-V: get VM list, profiling, and report generation. There is also a fourth option to calculate throughput only. The requirements for the server on which the different phases need to be executed are presented in the following table:

| Server requirement | Description |
|---|---|
|Get VM list, profiling, and throughput measurement |<ul><li>Operating system: Microsoft Windows Server 2016 or Microsoft Windows Server 2012 R2 </li><li>Machine configuration: 8 vCPUs, 16 GB RAM, 300 GB HDD</li><li>[Microsoft .NET Framework 4.5](https://aka.ms/dotnet-framework-45)</li><li>[Microsoft Visual C++ Redistributable for Visual Studio 2012](https://aka.ms/vcplusplus-redistributable)</li><li>Internet access to Azure from this server</li><li>Azure storage account</li><li>Administrator access on the server</li><li>Minimum 100 GB of free disk space (assuming 1000 VMs with an average of three disks each, profiled for 30 days)</li><li>The VM from where you are running the Azure Site Recovery deployment planner tool must be added to TrustedHosts list of all the Hyper-V servers.</li><li>All Hyper-V servers’ VMs to be profiled must be added to TrustedHosts list of the client VM from where the tool is being run. [Learn more to add servers into TrustedHosts list](#steps-to-add-servers-into-trustedhosts-list). </li><li> The tool should be run from Administrative privileges from PowerShell or command-line console on the client</ul></ul>|
| Report generation | A Windows PC or Windows Server with Microsoft Excel 2013 or later |
| User permissions | Administrator account to access Hyper-V cluster/Hyper-V host during get VM list and profiling operations.<br>All the hosts that need to be profiled should have a domain administrator account with the same credentials i.e. user name and password
 |

## Steps to add servers into TrustedHosts List
1.	The VM from where the tool is to be deployed should have all the hosts to be profiled in its TrustedHosts list. To add the client into Trustedhosts list run the following command from an elevated PowerShell on the VM. The VM can be a Windows Server 2012 R2 or Windows Server 2016. 

            set-item wsman:\localhost\Client\TrustedHosts -value '<ComputerName>[,<ComputerName>]' -Concatenate

1.	Each Hyper-V Host that needs to be profiled should have:

    a. The VM on which the tool is going to be run in its TrustedHosts list. Run the following command from an elevated PowerShell on the Hyper-V host.

            set-item wsman:\localhost\Client\TrustedHosts -value '<ComputerName>[,<ComputerName>]' -Concatenate

    b. PowerShell remoting enabled.

            Enable-PSRemoting -Force

## Download and extract the deployment planner tool

1.	Download the latest version of the [Azure Site Recovery deployment planner](https://aka.ms/asr-deployment-planner).
The tool is packaged in a .zip folder. The same tool supports both VMware to Azure and Hyper-V to Azure disaster recovery scenarios. You can use this tool for Hyper-V-to secondary site disaster recovery scenario as well but ignore the Azure infrastructure recommendation from the report.

1.	Copy the .zip folder to the Windows Server on which you want to run the tool. You can run the tool on a Windows Server 2012 R2 or Windows Server 2016. The server must have network access to connect to the  Hyper-V cluster or Hyper-V host that holds the VMs to be profiled. We recommend that you have the same hardware configuration of the VM, where the tool is going to run, as that of the Hyper-V server, which you want to protect. Such a configuration ensures that the achieved throughput that the tool reports matches the actual throughput that Azure Site Recovery can achieve during replication. The throughput calculation depends on available network bandwidth on the server and hardware configuration (CPU, storage, and so forth) of the server. The throughput is calculated from the server where the tool is running to Azure. If the hardware configuration of the server differs from the Hyper-V server, the achieved throughput that the tool reports will be inaccurate.
The recommended configuration of the VM: 8 vCPUs, 16 GB RAM, 300 GB HDD.

1.	Extract the .zip folder.
The folder contains multiple files and subfolders. The executable file is ASRDeploymentPlanner.exe in the parent folder.

Example: Copy the .zip file to E:\ drive and extract it. E:\ASR Deployment Planner_v2.2.zip

E:\ASR Deployment Planner_v2.2\ASRDeploymentPlanner.exe

### Updating to the latest version of deployment planner
If you have previous version of the deployment planner, do either of the following:
 * If the latest version doesn't contain a profiling fix and profiling is already in progress on your current version of the planner, continue the profiling.
 * If the latest version does contain a profiling fix, we recommended that you stop profiling on your current version and restart the profiling with the new version.


  >[!NOTE]
  >
  >When you start profiling with the new version, pass the same output directory path so that the tool appends profile data on the existing files. A complete set of profiled data will be used to generate the report. If you pass a different output directory, new files are created, and old profiled data is not used to generate the report.
  >
  >Each new deployment planner is a cumulative update of the .zip file. You don't need to copy the newest files to the previous  folder. You can create and use a new folder.

## Version history
The latest ASR Deployment Planner tool version is 2.2.
Refer to [ASR Deployment Planner Version History](https://social.technet.microsoft.com/wiki/contents/articles/51049.asr-deployment-planner-version-history.aspx) page for the fixes that are added in each update.


## Next steps
* [Run the deployment planner](site-recovery-hyper-v-deployment-planner-run.md).
