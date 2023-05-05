---
title: Azure Site Recovery Deployment Planner for VMware disaster recovery 
description: Learn about the Azure Site Recovery Deployment Planner for disaster recovery of VMware VMs to Azure.
author: ankitaduttaMSFT
manager: gaggupta
ms.service: site-recovery
ms.topic: conceptual
ms.author: ankitadutta
ms.date: 05/02/2023
---


# About the Azure Site Recovery Deployment Planner for VMware to Azure
This article is the Azure Site Recovery Deployment Planner user guide for VMware to Azure production deployments.

## Overview

Before you begin to protect any VMware vSphere virtual machines (VMs) by using Azure Site Recovery, allocate sufficient bandwidth, based on your daily data-change rate, to meet your desired recovery point objective (RPO). Be sure to deploy the right number of configuration servers and process servers on-premises.

You also need to create the right type and number of target Azure Storage accounts. You create either standard or premium storage accounts, factoring in growth on your source production servers because of increased usage over time. You choose the storage type per VM, based on workload characteristics (for example, read/write I/O operations per second [IOPS] or data churn) and Site Recovery limits.

 Site Recovery Deployment Planner is a command-line tool for both Hyper-V to Azure and VMware to Azure disaster recovery scenarios. You can remotely profile your VMware VMs by using this tool (with no production impact whatsoever) to understand the bandwidth and storage requirements for successful replication and test failover. You can run the tool without installing any Site Recovery components on-premises. To get accurate achieved throughput results, run the planner on a Windows Server that meets the minimum requirements of the Site Recovery configuration server that you eventually need to deploy as one of the first steps in production deployment.

The tool provides the following details:

**Compatibility assessment**

* VM eligibility assessment, based on number of disks, disk size, IOPS, churn, boot type (EFI/BIOS), and OS version

**Network bandwidth need versus RPO assessment**

* Estimated network bandwidth that's required for delta replication
* Throughput that Site Recovery can get from on-premises to Azure
* Number of VMs to batch, based on the estimated bandwidth to complete initial replication in a given amount of time
* RPO that can be achieved for a given bandwidth
* Impact on the desired RPO if lower bandwidth is provisioned

**Azure infrastructure requirements**

* Storage type (standard or premium storage) requirement for each VM
* Total number of standard and premium storage accounts to be set up for replication (Includes cache storage accounts)
* Storage-account naming suggestions, based on Storage guidance
* Number of Azure cores to be set up before test failover or failover on the subscription
* Azure VM-recommended size for each on-premises VM

**On-premises infrastructure requirements**
* Required number of configuration servers and process servers to be deployed on-premises

**Estimated disaster recovery cost to Azure**
* Estimated total disaster recovery cost to Azure: compute, storage, network, and Site Recovery license cost
* Detail cost analysis per VM


>[!IMPORTANT]
>
>Because usage is likely to increase over time, all the preceding tool calculations are performed assuming a 30 percent growth factor in workload characteristics. The calculations also use a 95th percentile value of all the profiling metrics, such as read/write IOPS and churn. Both growth factor and percentile calculation are configurable. To learn more about growth factor, see the "Growth-factor considerations" section. To learn more about percentile value, see the "Percentile value used for the calculation" section.
>

## Support matrix

| **Category** | **VMware to Azure** |**Hyper-V to Azure**|**Azure to Azure**|**Hyper-V to secondary site**|**VMware to secondary site**
--|--|--|--|--|--
Supported scenarios |Yes|Yes|No|Yes*|No
Supported version | vCenter Server 7.0, 6.7, 6.5, 6.0 or 5.5| Windows Server 2016, Windows Server 2012 R2 | NA |Windows Server 2016, Windows Server 2012 R2|NA
Supported configuration|vCenter Server, ESXi| Hyper-V cluster, Hyper-V host|NA|Hyper-V cluster, Hyper-V host|NA|
Number of servers that can be profiled per running instance of Site Recovery Deployment Planner |Single (VMs belonging to one vCenter Server or one ESXi server can be profiled at a time)|Multiple (VMs across multiple hosts or host clusters can be profiled at a time)| NA |Multiple (VMs across multiple hosts or host clusters can be profiled at a time)| NA

*The tool is primarily for the Hyper-V to Azure disaster recovery scenario. For Hyper-V to secondary site disaster recovery, it can be used only to understand source-side recommendations like required network bandwidth, required free storage space on each of the source Hyper-V servers, and initial replication batching numbers and batch definitions. Ignore the Azure recommendations and costs from the report. Also, the Get Throughput operation is not applicable for the Hyper-V-to-secondary-site disaster recovery scenario.

## Prerequisites
The tool has two main phases: profiling and report generation. There is also a third option to calculate throughput only. The requirements for the server from which the profiling and throughput measurement is initiated are presented in the following table.

| Server requirement | Description|
|---|---|
|Profiling and throughput measurement| <ul><li>Operating system: Windows Server 2016 or Windows Server 2012 R2<br>(ideally matching at least the [size recommendations for the configuration server](/en-in/azure/site-recovery/site-recovery-plan-capacity-vmware#size-recommendations-for-the-configuration-server))</li><li>Machine configuration: 8 vCPUs, 16 GB RAM, 300 GB HDD</li><li>[.NET Framework 4.5](https://aka.ms/dotnet-framework-45)</li><li>[VMware vSphere PowerCLI 6.0 R3](https://aka.ms/download_powercli)</li><li>[Visual C++ Redistributable for Visual Studio 2012](https://aka.ms/vcplusplus-redistributable)</li><li>Internet access to Azure (*.blob.core.windows.net) from this server, port 443<br>[This is optional. You can choose to provide the available bandwidth during Report Generation manually.]</li><li>Azure storage account</li><li>Administrator access on the server</li><li>Minimum 100 GB of free disk space (assuming 1,000 VMs with an average of three disks each, profiled for 30 days)</li><li>VMware vCenter statistics level settings can be 1 or higher level</li><li>Allow vCenter port (default 443): Site Recovery Deployment Planner uses this port to connect to the vCenter server/ESXi host</ul></ul>|
| Report generation | A Windows PC or Windows Server with Excel 2013 or later.<li>[.NET Framework 4.5](https://aka.ms/dotnet-framework-45)</li><li>[Visual C++ Redistributable for Visual Studio 2012](https://aka.ms/vcplusplus-redistributable)</li><li>[VMware vSphere PowerCLI 6.0 R3](https://aka.ms/download_powercli) is required only when you pass -User option in the report generation command to fetch the latest VM configuration information of the VMs. The Deployment Planner connects to vCenter server. Allow  vCenter port (default 443) port to connect to vCenter server.</li>|
| User permissions | Read-only permission for the user account that's used to access the VMware vCenter server/VMware vSphere ESXi host during profiling |

> [!NOTE]
>
>The tool can profile only VMs with VMDK and RDM disks. It can't profile VMs with iSCSI or NFS disks. Site Recovery does support iSCSI and NFS disks for VMware servers. Because the deployment planner isn't inside the guest and it profiles only by using vCenter performance counters, the tool doesn't have visibility into these disk types.
>

## Download and extract the deployment planner tool
1. Download the latest version of [Site Recovery Deployment Planner](https://aka.ms/asr-deployment-planner).
The tool is packaged in a .zip folder. The current version of the tool supports only the VMware to Azure scenario.

2. Copy the .zip folder to the Windows server from which you want to run the tool.
You can run the tool from Windows Server 2012 R2 if the server has network access to connect to the vCenter Server/vSphere ESXi host that holds the VMs to be profiled. However, we recommend that you run the tool on a server whose hardware configuration meets the [configuration server sizing guidelines](site-recovery-plan-capacity-vmware.md#size-recommendations-for-the-configuration-server-and-inbuilt-process-server). If you already deployed Site Recovery components on-premises, run the tool from the configuration server.

    We recommend that you have the same hardware configuration as the configuration server (which has an in-built process server) on the server where you run the tool. Such a configuration ensures that the achieved throughput that the tool reports matches the actual throughput that Site Recovery can achieve during replication. The throughput calculation depends on available network bandwidth on the server and hardware configuration (such as CPU and storage) of the server. If you run the tool from any other server, the throughput is calculated from that server to Azure. Also, because the hardware configuration of the server might differ from that of the configuration server, the achieved throughput that the tool reports might be inaccurate.

3. Extract the .zip folder.
The folder contains multiple files and subfolders. The executable file is ASRDeploymentPlanner.exe in the parent folder.

    Example:
    Copy the .zip file to E:\ drive and extract it.
    E:\ASR Deployment Planner_v2.3.zip

    E:\ASR Deployment Planner_v2.3\ASRDeploymentPlanner.exe

### Update to the latest version of Deployment Planner

The latest updates are summarized in the Deployment Planner [version history](site-recovery-deployment-planner-history.md).

If you have a previous version of Deployment Planner, do either of the following:
 * If the latest version doesn't contain a profiling fix and profiling is already in progress on your current version of the planner, continue the profiling.
 * If the latest version does contain a profiling fix, we recommend that you stop profiling on your current version and restart the profiling with the new version.


 >[!NOTE]
 >
 >When you start profiling with the new version, pass the same output directory path so that the tool appends profile data on the existing files. A complete set of profiled data is used to generate the report. If you pass a different output directory, new files are created and old profiled data isn't used to generate the report.
 >
 >Each new Deployment Planner version is a cumulative update of the .zip file. You don't need to copy the newest files to the previous folder. You can create and use a new folder.


## Version history
The latest Site Recovery Deployment Planner tool version is 2.5.
See the [Site Recovery Deployment Planner version history](./site-recovery-deployment-planner-history.md) page for the fixes that are added in each update.

## Next steps
[Run Site Recovery Deployment Planner](site-recovery-vmware-deployment-planner-run.md)
