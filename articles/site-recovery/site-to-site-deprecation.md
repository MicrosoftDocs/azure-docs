---
title: Deprecation of disaster recovery between customer-managed sites (with VMM) using Azure Site Recovery | Microsoft Docs
description: Details about Upcoming deprecation of DR between customer owned sites using Hyper-V and between sites managed by SCVMM to Azure and alternate options
services: site-recovery
author: rajani-janaki-ram 
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 02/25/2020
ms.author: rajanaki  

---
# Deprecation of disaster recovery between customer-managed sites (with VMM) using Azure Site Recovery

This article describes the upcoming deprecation plan, the corresponding implications, and the alternative options available for the customers for the following scenario:

DR between customer owned sites managed by System Center Virtual Machine Manager (SCVMM) using Site Recovery

> [!IMPORTANT]
> Customers are advised to take the remediation steps at the earliest to avoid any disruption to their environment. 

## What changes should you expect?

- Starting March 2020,you will receive Azure portal notifications & email communications with the upcoming deprecation of site-to-site replication of Hyper-V VMs. The deprecation is planned for March 2023.

- If you have an existing configuration, there will be no impact to the set up.

- Once the scenarios are deprecated unless the customer follows the alternate approaches, the existing replications may get disrupted. Customers won't be able to view, manage, or performs any DR-related operations via the Azure Site Recovery experience in Azure portal.
 
## Alternatives 

Below are the alternatives that the customer can choose from to ensure that their DR strategy is not impacted once the scenario is deprecated. 

- Option 1 (Recommended): Choose to [start using Azure as the DR target](hyper-v-vmm-azure-tutorial.md).


- Option 2: Choose to continue with site-to-site replication  using the underlying [Hyper-V Replica solution](https://docs.microsoft.com/windows-server/virtualization/hyper-v/manage/set-up-hyper-v-replica), but you will be unable to manage DR configurations using Azure Site Recovery in the Azure portal. 


## Remediation steps

If you are choosing to go with Option 1, please execute the following steps:

1. [Disable protection of all the virtual machines associated with the VMMs](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-hyper-v-virtual-machine-replicating-to-secondary-vmm-server-using-the-system-center-vmm-to-vmm-scenario). Use the **Disable replication and remove** option or run the scripts mentioned to ensure the replication settings on-premises are cleaned up. 

2. [Unregister all the VMM servers](site-recovery-manage-registration-and-protection.md#unregister-a-vmm-server) from the site-to-site replication configuration.

3. [Prepare Azure resources](tutorial-prepare-azure-for-hyperv.md) for enabling replication of your VMs.
4. [Prepare on-premises Hyper-V servers](hyper-v-prepare-on-premises-tutorial.md)
5. [Set up replication for the VMs in the VMM cloud](hyper-v-vmm-azure-tutorial.md)
6. Optional but recommended: [Run a DR drill](tutorial-dr-drill-azure.md)

If you are choosing to go with Option 2 of using Hyper-V replica, execute the following steps:

1. In **Protected Items** > **Replicated Items**, right-click the machine > **Disable replication**.
2. In **Disable replication**, select **Remove**.

    This removes the replicated item from Azure Site Recovery (billing is stopped). Replication configuration on the on-premises virtual machine **will not** be cleaned up. 

## Next steps
Plan for the deprecation and choose an alternate option that's best suited for your infrastructure and business. In case you have any queries regarding this, reach out to Microsoft Support

