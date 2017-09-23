---
title: Migrate on-premises machines to Azure with Azure Site Recovery | Microsoft Docs
description: This article describes how to migrate on-premises machines to Azure, using Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid: ddb412fd-32a8-4afa-9e39-738b11b91118
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/16/2017
ms.author: raynew

---
# Migrate on-premises machines to Azure

The [Azure Site Recovery](site-recovery-overview.md) service manages and orchestrates replication, failover, and failback of on-premises machines, and Azure virtual machines (VMs).

This tutorial shows you how to migrate on-premises VMs and physical servers to Azure, with Site Recovery. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up prerequisites for the deployment
> * Create a Recovery Services vault for Site Recovery 
> * Deploy on-premises management servers
> * Set up a replication policy and enable replication
> * Run a disaster recovery drill to make sure everything's working
> * Run a one-time failover to Azure

## Overview

You migrate a machine by enabling replication for it, and failing it over to Azure. 


## Prerequisites

Here's what you need to do for this tutorial.

- [Prepare](tutorial-prepare-azure.md) Azure resources, including an Azure subscription, an Azure virtual network, and a storage account.
- [Prepare](tutorial-prepare-on-premises-vmware.md) VMware on-premises VMware servers and VMs.
- Note that devices exported by paravirtualized drivers aren't supported.


## Create a Recovery Services vault

[!INCLUDE [site-recovery-create-vault](../../includes/site-recovery-create-vault.md)]

## Select a protection goal

Select what you want to replicate, and where you want to replicate to.
1. Click **Recovery Services vaults** > vault.
2. In the Resource Menu, click **Site Recovery** > **Prepare Infrastructure** > **Protection goal**.
3. In **Protection goal**, select:
    - **VMware**: Select **To Azure** > **Yes, with VMWare vSphere Hypervisor**.
    - **Physical machine**: Select **To Azure** > **Not virtualized/Other**.
    - **Hyper-V**: Select **To Azure** > **Yes, with Hyper-V**.


## Set up the source environment

- [Set up](tutorial-vmware-to-azure.md#set-up-the-source-environment) the source environment for VMware VMs.
- [Set up](tutorial-physical-to-azure.md#set-up-the-source-environment) the source environment for physical servers.
- [Set up](tutorial-hyper-v-to-azure.md#set-up-the-source-environment) the source environment for Hyper-V VMs.

## Set up the target environment

Select and verify target resources.

1. Click **Prepare infrastructure** > **Target**, and select the Azure subscription you want to use.
2. Specify the target deployment model.
3. Site Recovery checks that you have one or more compatible Azure storage accounts and networks.

## Create a replication policy

- [Set up a replication policy](tutorial-vmware-to-azure.md#create-a-replication-policy) for VMware VMs.


## Enable replication

- [Enable replication](tutorial-vmware-to-azure.md#enable-replication) for VMware VMs.


## Run a test migration

Run a [test failover](tutorial-dr-drill-azure.md) to Azure, to make sure everything's working as expected.


## Migrate to Azure

Run a failover for the machines you want to migrate.

1. In **Settings** > **Replicated items** click the machine > **Failover**.
2. In **Failover** select a **Recovery Point** to fail over to. Select the latest recovery point.
3. The encryption key setting isn't relevant for this scenario. 
4. Select **Shut down machine before beginning failover** if you want Site Recovery to attempt to do a shutdown of source virtual machines before triggering the failover. Failover continues even if shutdown fails. You can follow the failover progress on the **Jobs** page.
5. Check that the Azure VM appears in Azure as expected. 
6. In **Replicated items**, right-click the VM > **Complete Migration**. This finishes the migration process, stops replication for the VM, and stops Site Recovery billing for the VM.

    ![Complete migration](./media/tutorial-migrate-on-premises-to-azure/complete-migration.png)


> [!WARNING]
> **Don't cancel a failover in progress**: Before failover is started, VM replication is stopped. If you cancel a failover in progress, failover stops, but the VM won't replicate again.  

In some scenarios, failover requires additional processing that takes around eight to ten minutes to complete. You might notice longer test failover times for physical servers, VMware Linux machines, VMware VMs that don't have the DHCP service enables, and VMware VMs that don't have the following boot drivers: storvsc, vmbus, storflt, intelide, atapi.
  

## Next steps

[Learn about](site-recovery-azure-to-azure-after-migration.md) replicating Azure VMs to another region after migration to Azure.
