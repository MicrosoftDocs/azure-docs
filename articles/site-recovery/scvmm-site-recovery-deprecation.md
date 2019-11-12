---
title: Upcoming deprecation of DR between customer owned sites manged by SCVMM using Site Recovery & Azure| Microsoft Docs
description: Details about Upcoming deprecation of DR between customer owned sites using Hyper-V and between sites managed by SCVMM to Azure and alternate options
services: site-recovery
author: rajani-janaki-ram 
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 11/12/2019
ms.author: rajanaki  

---
# Upcoming deprecation of DR between a customer owned site managed by VMM & Azure using Site Recovery

This article describes the upcoming deprecation plan, the corresponding implications,  and the alternative options available for the customers for the following scenario:

DR between customer owned sites manged by System Center Virtual Machine Manager (SCVMM) using Site Recovery & Azure using Site Recovery

> [!IMPORTANT]
> Customers are advised to take the remediation steps at the earliest to avoid any disruption to their environment. 

## What changes should you expect?

- Starting November 2019, no new user on-boardings will be allowed for these scenarios. **Existing replications and management operations** including failover, test failover, monitoring etc. **will not be impacted**.

- If you have an existing configuration, you will not be able to register new VMMs.

- Once the scenarios are deprecated unless the customer follows the alternate approaches, the existing replications will get disrupted. Customers won't be able to view, manage, or performs any DR-related operations via the Azure Site Recovery experience in Azure portal.
 
## Alternatives 

Below is the alternative approach that the customer can perform from to ensure that their DR strategy is not impacted once the scenario is deprecated. 

Choose to [start using Azure as the DR target for VMs on Hyper-V hosts](hyper-v-azure-tutorial.md).

  > [!IMPORTANT]
  > Please note that your on-premises environment can still have SCVMMM, but you'll configure ASR with references to only the Hyper-V hosts.

## Remediation steps

If you are choosing to go with Option 1, please execute the following steps:

1. [Disable protection of all the virtual machines associated with the VMMs](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-hyper-v-virtual-machine-replicating-to-secondary-vmm-server-using-the-system-center-vmm-to-vmm-scenario). Use the **Disable replication and remove** option or run the scripts mentioned to ensure the replication settings on-premises are cleaned up. 

2. [Unregister all the VMM servers](site-recovery-manage-registration-and-protection.md#unregister-a-vmm-server)

3. [Prepare Azure resources](tutorial-prepare-azure-for-hyperv.md) for enabling replication of your VMs.
4. [Prepare on-premises Hyper-V servers](hyper-v-prepare-on-premises-tutorial.md)

> [!IMPORTANT]
> Please note that you don't need to execute the steps under  prepare VMM.

5. [Set up replication for the VMs](hyper-v-azure-tutorial.md)
6. Optional but recommended: [Run a DR drill](tutorial-dr-drill-azure.md)


## Next Steps
Plan for the deprecation and execute the remediation steps. In case you have any queries regarding this, please reach out to Microsoft Support

