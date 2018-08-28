---
title: Migrate on-premises machines to Azure with Azure Site Recovery | Microsoft Docs
description: This article describes how to migrate on-premises machines to Azure, using Azure Site Recovery.
services: site-recovery
author: rayne-wiselman
ms.service: site-recovery
ms.topic: tutorial
ms.date: 07/16/2018
ms.author: raynew
ms.custom: MVC
---

# Migrate on-premises machines to Azure

In addition to using the [Azure Site Recovery](site-recovery-overview.md) service to manage and orchestrate disaster recovery of on-premises machines and Azure VMs for the purposes of business continuity and disaster recovery (BCDR), you can also use Site Recovery to manage migration of on-premises machines to Azure.


This tutorial shows you how to migrate on-premises VMs and physical servers to Azure. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Select a replication goal
> * Set up the source and target environment
> * Set up a replication policy
> * Enable replication
> * Run a test migration to make sure everything's working as expected
> * Run a one-time failover to Azure

This is the third tutorial in a series. This tutorial assumes that you have already completed the tasks in the previous tutorials:

1. [Prepare Azure](tutorial-prepare-azure.md)
2. Prepare on-premises [VMware](vmware-azure-tutorial-prepare-on-premises.md) or [Hyper-V] (hyper-v-prepare-on-premises-tutorial.md) servers.

Before you start, it's helpful to review the [VMware](vmware-azure-architecture.md) or [Hyper-V](hyper-v-azure-architecture.md) architectures for disaster recovery.


## Prerequisites

- Devices exported by paravirtualized drivers aren't supported.
 
> [!WARNING]
> It is possible to migrate VMs on other virtualization platforms(other than VMware, Hyper-V) such as XenServer by treating the VMs like Physical servers. This approach however, hasn't been tested and validated by Microsoft and may or may not work. For example, VMs running on the XenServer platform may not run in  Azure unless XenServer tools and para-virtualized storage and network drivers are uninstalled from the VM before starting the migration.


## Create a Recovery Services vault

1. Sign in to the [Azure portal](https://portal.azure.com) > **Recovery Services**.
2. Click **Create a resource** > **Monitoring & Management** > **Backup and Site Recovery**.
3. In **Name**, specify the friendly name **ContosoVMVault**. If you have more than one
   subscription, select the appropriate one.
4. Create a resource group **ContosoRG**.
5. Specify an Azure region. To check supported regions, see geographic availability in [Azure Site Recovery Pricing Details](https://azure.microsoft.com/pricing/details/site-recovery/).
6. To quickly access the vault from the dashboard, click **Pin to dashboard** and then click **Create**.

   ![New vault](./media/migrate-tutorial-on-premises-azure/onprem-to-azure-vault.png)

The new vault is added to the **Dashboard** under **All resources**, and on the main **Recovery Services vaults** page.



## Select a replication goal

Select what you want to replicate, and where you want to replicate to.
1. Click **Recovery Services vaults** > vault.
2. In the Resource Menu, click **Site Recovery** > **Prepare Infrastructure** > **Protection goal**.
3. In **Protection goal**, select what you want to migrate.
    - **VMware**: Select **To Azure** > **Yes, with VMWare vSphere Hypervisor**.
    - **Physical machine**: Select **To Azure** > **Not virtualized/Other**.
    - **Hyper-V**: Select **To Azure** > **Yes, with Hyper-V**. If Hyper-V VMs are managed by VMM, select **Yes**.


## Set up the source environment

- [Set up](vmware-azure-tutorial.md#set-up-the-source-environment) the source environment for VMware VMs.
- [Set up](physical-azure-disaster-recovery.md#set-up-the-source-environment) the source environment for physical servers.
- [Set up](hyper-v-azure-tutorial.md#set-up-the-source-environment) the source environment for Hyper-V VMs.

## Set up the target environment

Select and verify target resources.

1. Click **Prepare infrastructure** > **Target**, and select the Azure subscription you want to use.
2. Specify the Resource Manager deployment model.
3. Site Recovery checks that you have one or more compatible Azure storage accounts and networks.

## Set up a replication policy

- [Set up a replication policy](vmware-azure-tutorial.md#create-a-replication-policy) for VMware VMs.
- [Set up a replication policy](physical-azure-disaster-recovery.md#create-a-replication-policy) for physical servers.
- [Set up a replication policy](hyper-v-azure-tutorial.md#set-up-a-replication-policy) for Hyper-V VMs.


## Enable replication

- [Enable replication](vmware-azure-tutorial.md#enable-replication) for VMware VMs.
- [Enable replication](physical-azure-disaster-recovery.md#enable-replication) for physical servers.
- Enable replication for Hyper-V VMs [with](hyper-v-vmm-azure-tutorial.md#enable-replication) or [without VMM](hyper-v-azure-tutorial.md#enable-replication).


## Run a test migration

Run a [test failover](tutorial-dr-drill-azure.md) to Azure, to make sure everything's working as expected.


## Migrate to Azure

Run a failover for the machines you want to migrate.

1. In **Settings** > **Replicated items** click the machine > **Failover**.
2. In **Failover** select a **Recovery Point** to fail over to. Select the latest recovery point.
3. The encryption key setting isn't relevant for this scenario.
4. Select **Shut down machine before beginning failover**. Site Recovery will attempt to shutdown virtual machines before triggering the failover. Failover continues even if shutdown fails. You can follow the failover progress on the **Jobs** page.
5. Check that the Azure VM appears in Azure as expected.
6. In **Replicated items**, right-click the VM > **Complete Migration**. This finishes the migration process, stops replication for the VM, and stops Site Recovery billing for the VM.

    ![Complete migration](./media/migrate-tutorial-on-premises-azure/complete-migration.png)


> [!WARNING]
> **Don't cancel a failover in progress**: VM replication is stopped before failover starts. If you cancel a failover in progress, failover stops, but the VM won't replicate again.

In some scenarios, failover requires additional processing that takes around eight to ten minutes to complete. You might notice longer test failover times for physical servers, VMware Linux machines, VMware VMs that don't have the DHCP service enables, and VMware VMs that don't have the following boot drivers: storvsc, vmbus, storflt, intelide, atapi.


## Next steps

In this tutorial you migrated on-premises VMs to Azure VMs. Now that you've successfully migrated VMs:
- [Set up disaster recovery](azure-to-azure-replicate-after-migration.md) for the migrated VMs.
- Take advantage of Azure's [Secure and well managed cloud](https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/) capabilities to manage your VMs in Azure.
  
