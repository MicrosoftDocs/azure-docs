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

You migrate a machine by enabling replication for it, and failing it over to Azure. Migration doesn't include ongoing replication, or failback of machines from Azure. 


## Prerequisites

Here's what you need to do for this tutorial.

- Make sure that machines that you want to replicate comply with [operating system requirements](site-recovery-support-matrix-to-azure#support-for-replicated-machine-os-versions), [file storage requirements](site-recovery-support-matrix-to-azure.md#supported-file-systems-and-guest-storage-configurations-on-linux-vmwarephysical-servers), and [prerequisites for Azure VMs](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements).
- Prepare Azure, including an Azure subscription, an Azure virtual network, and a storage account.
- Make sure your Azure account has permissions to create VMs.
- Prepare on-premises prerequisites for VMware, physical servers, or Hyper-V.
- Make sure that on-premises management servers (VMware, Hyper-V, System Center VMM) meet [Site Recovery requirements](site-recovery-support-matrix-to-azure.md#support-for-datacenter-management-servers).




### Set up an Azure account

Get a Microsoft [Azure account](http://azure.microsoft.com/).

- You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/).
- Learn about supported regions for Site Recovery, under Geographic Availability in [Azure Site Recovery Pricing Details](https://azure.microsoft.com/pricing/details/site-recovery/).
- Learn about [Site Recovery pricing](site-recovery-faq.md#pricing), and get [pricing details](https://azure.microsoft.com/pricing/details/site-recovery/).

### Verify Azure account permissions

Make sure your Azure account has permissions for replication of VMs to Azure.

- Review the [permissions](site-recovery-role-based-linked-access-control#permissions-required-to-enable-replication-for-new-virtual-machines) you need.
- Verify/add permissions for [role-based access](../active-directory/role-based-access-control-configure).


### Set up an Azure network

Set up an [Azure network](../virtual-network/virtual-network-get-started-vnet-subnet).

- Azure VMs are placed in this network when they're created after failover.
- The network should be in the same region as the Recovery Services vault.


### Set up an Azure storage account

Set up an [Azure storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account).

- Site Recovery replicates the AWS VMs to Azure storage. Azure VMs are created from the storage after failover occurs.
- The storage account must be in the same region as the Recovery Services vault.
- The storage account can be standard or [premium](../storage/common/storage-premium-storage.md).
- If you set up a premium account, you will also need an additional standard account for log data.
- You can't replicate to premium accounts in Central and South India.

### Prepare for VMware VM migration
1. [Prepare an account](tutorial-vmware-to-azure.md#prepare-an-account-for-automatic-discovery) for automatic discovery of VMs.
2. [Prepare an account](tutorial-vmware-to-azure.md#prepare-an-account-for-mobility-service-installation) for Mobility service installation on each VMware VM you want to migrate.


### Prepare for physical server migration
[Prepare an account](tutorial-physical-to-azure.md#prepare-an-account-for-mobility-service-installation) for Mobility service installation on each VMware VM you want to migrate.

### Prepare for Hyper-V VM (in VMM clouds) migration

- If you're migrating Hyper-V VMs in System Center VMM clouds, you need to make sure that VMM servers meet [Site Recovery requirements](tutorial-hyper-v-to-azure.md#prepare-vmm-servers), including URL access. The VMM server should also be [prepared for network mapping](tutorial-hyper-v-to-azure.md#prepare-vmm-for-network-mapping). Network mapping is needed so that Azure VMs are located in a compatible virtual network after failover.
- Make sure that [Hyper-V hosts](tutorial-hyper-v-to-azure.md#prepare-hyper-v-hosts) and [VMM servers](tutorial-hyper-v-to-azure.md#prepare-hyper-v-hosts) have access to Azure URLs.



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
- [Set up](tutorial-hyper-v-to-azure#set-up-the-source-environment) the source environment for Hyper-V VMs.

## Set up the target environment

Select and verify target resources.

1. Click **Prepare infrastructure** > **Target**, and select the Azure subscription you want to use.
2. Specify the target deployment model.
3. Site Recovery checks that you have one or more compatible Azure storage accounts and networks.

## Configure network mapping for VMM

If you're migrating Hyper-V VMs in System Center VMM clouds, you need to map an on-premises VMM VM network to an Azure virtual network. [Learn more](tutorial-hyper-v-to-azure.md#configure-network-mapping-with-vmm).

## Create a replication policy

- [Set up a replication policy](tutorial-vmware-to-azure.md#create-a-replication-policy) for VMware VMs.
- [Set up a replication policy](tutorial-physical-to-azure.md#create-a-replication-policy) for physical servers.
- [Set up a replication policy](tutorial-hyper-v-to-azure#create-a-replication-policy) for Hyper-V VMs.

## Enable replication

- [Enable replication](tutorial-vmware-to-azure.md#enable-replication) for VMware VMs.
- [Enable replication](tutorial-physical-to-azure.md#enable-replication) for physical servers.
- [Enable replication](tutorial-hyper-v-to-azure#enable-replication) for Hyper-V VMs.


## Run a disaster recovery drill

Run a [test failover](tutorial-dr-drill-azure.md) to Azure, to make sure everything's working as expected.


## Fail over to Azure

Run a fail over for the machines you want to migrate.

> [!WARNING]
> **Don't cancel a failover in progress**: Before failover is started, VM replication is stopped. If you cancel a failover in progress, failover stops, but the VM won't replicate again.  




### Run a failover to Azure for VMware VMs and physical servers

1. In **Settings** > **Replicated items** click the machine > **Failover**.
2. In **Failover** select a **Recovery Point** to fail over to. Select the latest recovery point.
3. The encryption key setting isn't relevant for this scenario. 
4. Select **Shut down machine before beginning failover** if you want Site Recovery to attempt to do a shutdown of source virtual machines before triggering the failover. Failover continues even if shutdown fails. You can follow the failover progress on the **Jobs** page.
5. Check that the Azure VM appears in Azure as expected. 
6. In **Replicated items**, right-click the VM > **Complete Migration**. This finishes the migration process, stops replication for the AWS VM, and stops Site Recovery billing for the VM.

    ![Complete migration](./media/tutorial-migrate-on-premises-to-azure/complete-migration.png)

>[!NOTE]
> In some scenarios, failover requires additional processing that takes around eight to ten minutes to complete. You might notice longer test failover times for physical servers, VMware Linux machines, VMware VMs that don't have the DHCP service enables, and VMware VMs that don't have the following boot drivers: storvsc, vmbus, storflt, intelide, atapi.
  
### Run a planned failover for Hyper-V VMs

A planned failover is supported for Hyper-V VMs. A planned failover ensures no data loss. When a planned failover is triggered, the source VMs are shut down. Unsynchronized data is synchronized, and the failover is triggered.

1. In **Settings** > **Replicated items** click the VM > **Planned Failover**.
2. In **Confirm Planned Failover**, verify the failover direction (to Azure), and select the source and target locations. 
3. In **Data Synchronization**, select **Synchronize data during failover only (full download)**. This performs a disk download. 
4. If you're failing over Hyper-V VMs in System Center VMM clouds, to Azure, and data encryption is enabled for the cloud, in **Encryption Key**, select the certificate that was issued when you enabled data encryption during Provider setup on the VMM server.
5. Initiate the failover. You can follow the failover progress on the **Jobs** tab.
6. After the initial data synchronization is done and you're ready to shut down the Azure VMs click **Jobs** > planned failover job name > **Complete Failover**. This shuts down the on-premises, transfers the latest changes to Azure, and starts the Azure VM.
7. Check that the Azure VM appears in Azure as expected.
8. In **Replicated items**, right-click the VM > **Complete migration**. This finishes the migration process, stops replication for the on-premises VM, and stops Site Recovery billing for the VM.

## Next steps

[Learn about](site-recovery-azure-to-azure-after-migration.md) replicating Azure VMs to another region after migration to Azure.