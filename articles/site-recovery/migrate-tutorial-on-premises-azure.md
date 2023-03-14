---
title: Migrate on-premises machines with Azure Migrate
description: This article summarizes how to migrate on-premises machines to Azure, and recommends Azure Migrate.
ms.service: site-recovery
ms.topic: tutorial
ms.date: 07/27/2020
ms.author: ankitadutta
author: ankitaduttaMSFT
---

# Migrate on-premises machines to Azure

This article describes options for migrating on-premises machines to Azure. 

## Migrate with Azure Migrate

We recommend that you migrate machines to Azure using the [Azure Migrate](../migrate/migrate-services-overview.md) service. Azure Migrate is purpose-built for server migration. Azure Migrate provides a centralized hub for discovery, assessment, and migration of on-premises machines to Azure.

Follow these links to migrate with Azure Migrate:

- [Learn about](../migrate/server-migrate-overview.md) migration options for VMware VMs, then migrate VMs to Azure with [agentless](../migrate/tutorial-migrate-vmware.md) or [agent-based](../migrate/tutorial-migrate-vmware-agent.md) migration.
- [Migrate Hyper-V VMs](../migrate/tutorial-migrate-hyper-v.md) to Azure.
- Migrate [physical servers or other VMs](../migrate/tutorial-migrate-physical-virtual-machines.md), including [AWS instances](../migrate/tutorial-migrate-aws-virtual-machines.md) to Azure.

## Migrate with Site Recovery
Site Recovery should be used for disaster recovery only, and not migration.

If you're already using Azure Site Recovery, and you want to continue using it for migration, follow the same steps that you use for disaster recovery.

- VMware VMs: [Prepare Azure](tutorial-prepare-azure.md) and [VMware](vmware-azure-tutorial-prepare-on-premises.md), start [replicating machines](vmware-azure-tutorial.md), [check](tutorial-dr-drill-azure.md) that everything's working, and [run a failover](vmware-azure-tutorial-failover-failback.md).
- Hyper-V VMs: [Prepare Azure](tutorial-prepare-azure-for-hyperv.md) and [Hyper-V](hyper-v-prepare-on-premises-tutorial.md), start [replicating machines](hyper-v-azure-tutorial.md), [check](tutorial-dr-drill-azure.md) that everything's working, and [run a failover](hyper-v-azure-failover-failback-tutorial.md).
- Physical servers: [Follow the walkthrough](physical-azure-disaster-recovery.md) to prepare Azure, prepare machines for disaster recovery, and set up replication.

> [!NOTE]
> When you run a failover for disaster recovery, as a last step you commit the failover. When you migrate on-premises machines, the **Commit** option isn't relevant. Instead, you select the **Complete Migration** option. 

## Next steps

> [!div class="nextstepaction"]
> [Review common questions](../migrate/resources-faq.md) about Azure Migrate.

  
