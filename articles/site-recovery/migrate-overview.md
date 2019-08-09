---
title: About migration of on-premises machines and Azure VMs Azure Site Recovery | Microsoft Docs
description: This article describes how to migrate on-premises and Azure IaaS VMs to Azure using the Azure Site Recovery service.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 05/30/2019
ms.author: raynew

---
# About migration

Read this article for a quick overview of how the [Azure Site Recovery](site-recovery-overview.md) service helps you to migrate machines. 

Here's what you can migrate using Site Recovery:

- **Migrate from on-premises to Azure**: Migrate on-premises Hyper-V VMs, VMware VMs, and physical servers to Azure. After the migration, workloads running on the on-premises machines will be running on Azure VMs. 
- **Migrate within Azure**: Migrate Azure VMs between Azure regions. 
- **Migrate AWS**: Migrate AWS Windows instances to Azure IaaS VMs. 


## What do we mean by migration?

In addition to using Site Recovery for disaster recovery of on-premises and Azure VMs, you can use the Site Recovery service to migrate them. What's the difference?

- For disaster recovery, you replicate machines on a regular basis to Azure. When an outage occurs, you fail the machines over from the primary site to the secondary Azure site, and access them from there. When the primary site is available again, you fail back from Azure.
- For migration, you replicate on-premises machines to Azure, or Azure VMs to a secondary region. Then you fail the VM over from the primary site to the secondary, and complete the migration process. There's no failback involved.  


## Migration scenarios

**Scenario** | **Details**
--- | ---
**Migrate from on-premises to Azure** | You can migrate on-premises VMware VMs, Hyper-V VMs, and physical servers to Azure. To do this, you complete almost the same steps as you would for full disaster recovery. You simply don't fail machines back from Azure to the on-premises site.
**Migrate between Azure regions** | You can migrate Azure VMs from one Azure region to another. After the migration is complete, you can configure disaster recovery for the Azure VMs now in the secondary region to which you migrated.
**Migrate AWS to Azure** | You can migrate AWS instances to Azure VMs. Site Recovery treats AWS instances as physical servers for migration purposes. 

## Next steps

- [Migrate on-premises machines to Azure](migrate-tutorial-on-premises-azure.md)
- [Migrate VMs from one Azure region to another](azure-to-azure-tutorial-migrate.md)
- [Migrate AWS to Azure](migrate-tutorial-aws-azure.md)
