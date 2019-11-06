---
title: Upcoming deprecation of DR between customer owned sites using Hyper-V and between sites managed by SCVMM to Azure | Microsoft Docs
description: Details about Upcoming deprecation of DR between customer owned sites using Hyper-V and between sites managed by SCVMM to Azure and alternate options
services: site-recovery
author: rajani-janaki-ram 
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 09/13/2019
ms.author: rajanaki  

---
# Upcoming deprecation of DR between customer owned sites using Hyper-V and between sites managed by SCVMM to Azure

This article describes the upcoming deprecation plan,  the corresponding implications,  and the alternative options available for the customers for the following scenarios that were supported by Azure Site Recovery. 

- DR between of Hyper-V VMs managed by SCVMM between customer owned sites 
- DR of Hyper-V VMs managed by SCVMM to Azure

> [!IMPORTANT]
> These scenarios are currently marked for deprecation and customers are expected to take the remediation steps at the earliest to avoid any disruption to their environment. 
 

## What changes should you expect?

- Starting November 2019, no new user on-boardings will be allowed for these scenarios. **Existing replications and management operations** including failover, test failover, monitoring etc. **will not be impacted**.

- Once the scenarios are deprecated, there will be the following implications unless the customer follows the recommend steps.

    - DR between of Hyper-V VMs managed by SCVMM between customer owned sites: The replications will continue to work, as the underlying capability of Hyper-V replica will continue to work, but customers won't be able to view, manage or performs any DR-related operations via the Azure Sire Recovery experience in the Azure portal. 
    - DR of Hyper-V VMs managed by SCVMM to Azure: The existing replications will be disrupted and customers won't be able to view, manage, or performs any DR-related operations via the Azure Site Recovery


## Recommended actions to be taken

Below are the options the customer has to ensure that their DR strategy is not impacted once the scenario is deprecated. 

- Choose to [start using Azure as the DR target for VMs on Hyper-V hosts](hyper-v-azure-tutorial.md).

> [!IMPORTANT]
> Please note that your on-premises environment can still have SCVMMM, but you'll configure ASR with references to only the Hyper-V hosts.

- Choose to continue with site-to-site replication but using the underlying [Hyper-V Replica solution](https://docs.microsoft.com/windows-server/virtualization/hyper-v/manage/set-up-hyper-v-replica), but will be unable to manage DR configurations using Azure Site Recovery in the Azure portal. 


## Next Steps
Plan for the deprecation and choose an alternate option that's best suited for your infrastructure and business. In case you have any queries regarding this, please reach out to Microsoft Support

