---
title: Azure Site Recovery deployment planner for Hyper-V-to-Azure| Microsoft Docs
description: This is the Azure Site Recovery deployment planner user guide for Hyper-V to Azure scenario.
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
# Site Recovery deployment planner
This article is the Site Recovery Deployment Planner user guide for Hyper-V-to-Azure production deployments.

## Overview

Before you begin protecting any Hyper-V virtual machines (VMs) using Site Recovery, allocate sufficient bandwidth based on your daily data-change rate to meet your desired Recovery Point Objective (RPO), and allocate sufficient free storage space on each volume of Hyper-V storage on-premises.

You also need to create the right type and number of target Azure storage accounts. You create either standard or premium storage accounts, factoring in growth on your source production servers because of increased usage over time. You choose the storage type per VM, based on workload characteristics, for example, read/write I/O operations per second (IOPS), or data churn, and Site Recovery limits. 

The Site Recovery deployment planner (version 2) is a command-line tool available for both Hyper-V to Azure and VMware to Azure disaster recovery scenarios. You can remotely profile your Hyper-V VMs present on multiple Hyper-V hosts using this tool (with no production impact whatsoever) to understand the bandwidth and Azure storage requirements for successful replication and test failover / failover. You can run the tool without installing any Site Recovery components on-premises. However, to get accurate achieved throughput results, we recommend that you run the planner on a Windows Server that has the same hardware configuration as that of one of the Hyper-V servers that you will use to enable disaster recovery protection to Azure. 

The tool provides the following details:

**Compatibility assessment**

* VM eligibility assessment, based on number of disks, disk size, IOPS, churn, and few VM characteristics.

**Network bandwidth need versus RPO assessment**

* The estimated network bandwidth that's required for delta replication
* The throughput that Site Recovery can get from on-premises to Azure
    
**Azure infrastructure requirements**

* The storage type (standard or premium storage account) requirement for each VM
* The total number of standard and premium storage accounts to be set up for replication
* Storage-account naming suggestions, based on Azure Storage guidance
* The storage-account placement for all VMs
* The number of Azure cores to be set up before test failover or failover on the subscription
* The Azure VM-recommended size for each on-premises VM

**On-premises infrastructure requirements**
* The required free storage space on each volume of Hyper-V storage for successful initial replication and delta replication to ensure that VM replication will not cause any undesirable downtime for your production applications

**Initial replication batching guidance** 
* Number of VM batches to be used for protection
* List of VMs in each batch
* Order in which each batch is to be protected
* Estimated time to complete initial replication of each batch

**Cost** 
* Estimated total DR cost to Azure: compute, storage, network, and Azure Site Recovery license cost
* Detail cost analysis per VM



>[!IMPORTANT]
>
>Because usage is likely to increase over time, all the preceding tool calculations are performed assuming a 30% growth factor in  workload characteristics, and using a 95th percentile value of all the profiling metrics (read/write IOPS, churn, and so forth). Both of these elements (growth factor and percentile calculation) are configurable. To learn more about growth factor, see the "Growth-factor considerations" section. To learn more about  percentile value, see the "Percentile value used for the calculation" section.
>

## Next steps
* [Learn more](site-recovery-hyper-v-deployment-planner-requirements.md) about the requirements for Site Recovery deployment planner.
*  [Learn more](site-recovery-hyper-v-deployment-panner-download.md) about download Site Recovery deployment planner.