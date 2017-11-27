---
title: Azure Site Recovery deployment planner recommendations for  Hyper-V-to-Azure| Microsoft Docs
description: This article describes recommedations details in the  generated report using Azure Site Recovery deployment planner for Hyper-V to Azure scenario.
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
# Recommendations
The recommendations sheet of the Hyper-V to Azure report has the following details.

## Profile data
**Profiled data period:** The period during which the profiling was run. By default, the tool includes all profiled data in the calculation, unless it generates the report for a specific period by using StartDate and EndDate options during report generation.

**Number of Hyper-V servers profiled**: The number of Hyper-V server whose VMs’ report is generated. Click on the number to view the name of the Hyper-V servers. It opens the On-premises Storage Requirement sheet where all the servers name along with storage requirement are listed.    

**Desired RPO**: The recovery point objective for your deployment. By default, the required network bandwidth is calculated for RPO values of 15, 30, and 60 minutes. Based on the selection, the affected values are updated on the sheet. If you have used the DesiredRPOinMin parameter while generating the report, that value is shown in the Desired RPO result.

## Profiling overview
**Total Profiled Virtual Machines**: The total number of VMs whose profiled data is available. If the VMListFile has names of any VMs which were not profiled, those VMs are not considered in the report generation and are excluded from the total profiled VMs count.

**Compatible Virtual Machines**: The number of VMs that can be protected to Azure by using Site Recovery. It is the total number of compatible VMs for which the required network bandwidth, number of storage accounts, number of Azure cores are calculated. The details of every compatible VM are available in the "Compatible VMs" section.

**Incompatible Virtual Machines**: The number of profiled VMs that are incompatible for protection with Site Recovery. The reasons for incompatibility are noted in the "Incompatible VMs" section. If the VMListFile has names of any VMs that were not profiled, those VMs are excluded from the incompatible VMs count. These VMs are listed as "Data not found" at the end of the "Incompatible VMs" section.

**Desired RPO**: Your desired recovery point objective, in minutes. The report is generated for three RPO values: 15 (default), 30, and 60 minutes. The bandwidth recommendation in the report is changed based on your selection in the Desired RPO drop-down list given at the top right of the sheet. If you have generated the report by using the -DesiredRPO parameter with a custom value, this custom value shows as the default in the Desired RPO drop-down list.

## Required network bandwidth (Mbps)
**To meet RPO 100 percent of the time**: The recommended bandwidth in Mbps to be allocated to meet your desired RPO 100 percent of the time. This amount of bandwidth must be dedicated for steady-state delta replication of all your compatible VMs to avoid any RPO violations.

**To meet RPO 90 percent of the time**: Because of broadband pricing or for any other reason, if you cannot set the bandwidth needed to meet your desired RPO 100 percent of the time, you can choose to go with a lower bandwidth setting that can meet your desired RPO 90 percent of the time. To understand the implications of setting this lower bandwidth, the report provides a what-if analysis on the number and duration of RPO violations to expect.

**Achieved Throughput**: The throughput from the server on which you have run the GetThroughput command to the Azure region where the storage account is located. This throughput number indicates the estimated level that you can achieve when you protect the compatible VMs by using Site Recovery, provided that Hyper-V server storage and network characteristics remain the same as that of the server from which you have run the tool.

For all enterprise Site Recovery deployments, we recommend that you use [ExpressRoute](https://aka.ms/expressroute).

## Required storage accounts
The following chart shows the total number of storage accounts (standard and premium) that are required to protect all the compatible VMs. To learn which storage account to use for each VM, see the "VM-storage placement" section.

## Required number of Azure cores
This result is the total number of cores to be set up before failover or test failover of all the compatible VMs. If too few cores are available in the subscription, Site Recovery fails to create VMs at the time of test failover or failover.

## Additional on-premises storage requirement
The total free storage required on Hyper-V servers for successful initial replication and delta replication to ensure that the VM replication will not cause any undesirable downtime for your production applications. Detail of each volume requirement is available in [on-premises storage requirement](site-recovery-hyper-v-deployment-planner-on-premises-storage-requirement.md) sheet. 

To understand why free space is required for the replication, refer to [On-premises storage requirement](./site-recovery-hyper-v-deployment-planner-on-premises-storage-requirement.md#) section.

## Maximum copy frequency
The recommended maximum copy frequency must be set for the replication to achieve the desired RPO. Default is 5 minutes. You can set 30 seconds copy frequency to achieve better RPO.

## What-if analysis
This analysis outlines how many violations could occur during the profiling period when you set a lower bandwidth for the desired RPO to be met only 90%of the time. One or more RPO violations can occur on any given day. The graph shows the peak RPO of the day. Based on this analysis, you can decide if the number of RPO violations across all days and peak RPO hit per day is acceptable with the specified lower bandwidth. If it is acceptable, you can allocate the lower bandwidth for replication, else allocate higher bandwidth as suggested to meet the desired RPO 100 percent of the time. 

## Recommendation for successful initial replication
In this section, we recommend the number of batches in which the VMs to be protected and the minimum bandwidth required to complete initial replication (IR) successfully. 

The batch must be protected in the given order. Each batch has specific list of VMs. Batch 1 VMs must be protected before Batch 2. Batch 2 VMs must be protected before Batch 3 VMs and so on. Once initial replication of the Batch 1 VMs is completed, you can enable replication for Batch 2 VMs. Similarly, once initial replication of VMs of Batch 2 is completed, you can enable replication for Batch 3 VMs and so on. If the batch order is not followed, sufficient bandwidth for initial replication may not be available for the VMs, which are protected later. Result is, either VMs will never be able to complete initial replication, or few protected VMs may go into resync mode. IR batching for the selected RPO sheet has the detailed information about which VMs should be included in each batch.

The graph here shows the bandwidth distribution for initial replication and delta replication across batches in the given batch order. When you protect VMs of the first batch, full bandwidth is available for initial replication. Once initial replication is over for the first batch, part of bandwidth will be required for delta replication. The remaining bandwidth will be available for initial replication of VMs of the second batch. The Batch 2 bar shows the required delta replication bandwidth for Batch 1 VMs and the bandwidth available for initial replication for Batch 2 VMs. Similarly, Batch 3 bar shows the bandwidth required for delta replication for previous batches (Batch 1 and Batch 2 VMs) and the bandwidth available for initial replication for Batch 3 and so on.  Once initial replication of all the batches is over, the last bar shows the bandwidth required for delta replication for all the protected VMs. 

**Why do I need initial replication batching?**
The completion time of the initial replication is based on the VM disk size, used disk space, and available network throughput. The detail is available in IR batching for a selected RPO sheet.

## Cost estimation
The graph shows the summary view of the estimated total disaster recovery (DR) cost to Azure of your chosen target region and the currency that you have specified for report generation.

The summary helps you to understand the cost that you need to pay for storage, compute, network, and license when you protect all your compatible VMs to Azure using Azure Site Recovery. The cost is calculated on for compatible VMs and not on all the profiled VMs.  
 
You can view the cost either monthly or yearly. Learn more about [supported target regions]() and [supported currencies]().

**Cost by components**
The total DR cost is divided into four components: Compute, Storage, Network, and Azure Site Recovery license cost. The cost is calculated based on the consumption that will be incurred during replication and at DR drill time for compute, storage (premium and standard), ExpressRoute/VPN that is configured between the on-premises site and Azure, and Azure Site Recovery license.

**Cost by states**
The total disaster recovery (DR) cost is categories based on two different states - Replication and DR drill. 

**Replication cost**:  The cost that will be incurred during replication. It covers the cost of storage, network, and Azure Site Recovery license. 

**DR-Drill cost**: The cost that will be incurred during test failovers. Azure Site Recovery spins up VMs during test failover. The DR drill cost covers the running VMs’ compute and storage cost. 

**Azure Storage Cost per Month/Year**
It shows the total storage cost that will be incurred for premium and standard storage for replication and DR drill.
You can view detailed cost analysis per VM in the Cost Estimation sheet.

## Recommendations with available bandwidth as input
You might have a situation where you know that you cannot set a bandwidth of more than x Mbps for Site Recovery replication. The tool allows you to input available bandwidth (using the -Bandwidth parameter during report generation) and get the achievable RPO in minutes. With this achievable RPO value, you can decide whether you need to provision additional bandwidth or you are OK with having a disaster recovery solution with this RPO.


## Next steps
* Learn more about the [cost estimation](site-recovery-hyper-v-deployment-planner-cost-estimation.md).
* Learn more about [initial replication batching](site-recovery-hyper-v-deployment-planner-ir-batchting.md).
* Learn more about [on-premises storage requirement](site-recovery-hyper-v-deployment-planner-on-premises-storage-requirement.md).