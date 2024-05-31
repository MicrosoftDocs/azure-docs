---
title: Start here - Migrate VMware deployments to Azure
description: Provides an overview how to migrate from VMware to Azure.
author: cynthn
ms.author: cynthn
ms.topic: overview
ms.service: azure-migrate
products:
  - azure-migrate
  - vmware
  - azure-virtual-machines
  - azure-vmware-solution
ms.date: 05/08/2024
ms.custom: vmware-scenario-422

# Customer intent - overview  of the options for assessing an existing VMware deployment for migration
---


# Start here to migrate from VMware to Azure

There are several steps to using the Azure Migration Tools to migrate a VMware deployment to Azure. This article is a map to the steps of the process that are documented for this scenario.

:::image type="content" source="./media/migration-process.png" alt-text="Diagram showing the basic steps to migrate from VMware to Azure." lightbox="./media/migration-process.png":::

<br>

## Prerequisites
Make sure you check out the [support matrix](migrate-support-matrix-vmware.md) before getting started.

## Discover
You need a list of all of the servers in your environment. To get the list, you have two choices: 

- Deploy an appliance that continually discovers servers. For more information, see [Tutorial: Discover servers running in a VMware environment with Azure Migrate](tutorial-discover-vmware.md).

- Use RVTools XLSX to discover servers and store the information in an .xlsx file. For more information, see [Tutorial: Import servers running in a VMware environment with RVTools XLSX (preview)](tutorial-import-vmware-using-rvtools-xlsx.md).

## Decide - build a business case (preview)

[Build a business proposal](../how-to-build-a-business-case.md?context=/azure/migrate/context/migrate-context) using the discovery and assessment tool to help you understand how Azure can bring the most value to your business.

## Assess

Assess your VMware environment for moving to [Azure Virtual Machines](tutorial-assess-vmware-azure-vm.md) or to the managed [Azure VMware Solution](tutorial-assess-vmware-azure-vmware-solution.md) offering.

## Migrate 

Before you begin your migration, you need to [choose whether to use an agent-based migration or agentless](server-migrate-overview.md?context=/azure/migrate/context/vmware-context).


Depending on whether you choose agent-based or agentless migration, the next step would be to review the migration articles for your choice.

### Agent-based:

   - Review the [VMware agent-based migration architecture](agent-based-migration-architecture.md).

   - [Migrate with agent-based migration](tutorial-migrate-vmware-agent.md).


### Agentless:

   - Review the [VMware agentless migration architecture](concepts-vmware-agentless-migration.md) to understand that migration process.

   - [Prepare for VMware agentless migration](prepare-for-agentless-migration.md).
   
   - [Test the migration](how-to-test-replicating-virtual-machines.md)
   - [Migrate using the Azure portal](tutorial-migrate-vmware.md) or using [Azure PowerShell](tutorial-migrate-vmware-powershell.md).
   - [Automate VMware migration at scale using Azure PowerShell](how-to-automate-migration.md)
   - [Migrate VMware VMs to Azure VMs enabled with server-side encryption and customer-managed keys](how-to-migrate-vmware-vms-with-cmk-disks.md).
   
   - If you encounter problems during migration, you can [troubleshoot replication issues](troubleshoot-changed-block-tracking-replication.md) or [troubleshoot stuck replication and slow migration ](troubleshoot-replication-vmware.md).



## Next steps

[Support matrix for VMware discovery](migrate-support-matrix-vmware.md).
