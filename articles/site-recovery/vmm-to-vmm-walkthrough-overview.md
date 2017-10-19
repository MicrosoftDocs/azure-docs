---
title: Replicate Hyper-V VMs to a secondary VMM site with Azure Site Recovery | Microsoft Docs
description: Provides an overview for replicating Hyper-V VMs to a secondary VMM site using the Azure portal.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid: 476ca82a-8f5c-4498-9dcf-e1011d60ed59
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/27/2017
ms.author: raynew

---
# Replicate Hyper-V virtual machines in VMM clouds to a secondary VMM site

> [!div class="op_single_selector"]
> * [Azure portal](site-recovery-vmm-to-vmm.md)
> * [Classic portal](site-recovery-vmm-to-vmm-classic.md)
> * [PowerShell - Resource Manager](site-recovery-vmm-to-vmm-powershell-resource-manager.md)
>
>

This article provides an overview of the steps required to replicate on-premises Hyper-V virtual machines (VMs) managed in System Center Virtual Machine Manager (VMM) clouds, to a secondary VMM location, using [Azure Site Recovery](site-recovery-overview.md) in the Azure portal.

After reading this article, post any comments at the bottom, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Step 1: Review the scenario architecture

Before you start deployment, review the scenario architecture, and make sure that you understand all the components you need to deploy.

Go to [Step 1: Review the architecture](vmm-to-vmm-walkthrough-architecture.md).

## Step 2: Review prerequisites and limitations

Make sure that you understand the deployment prerequisites and limitations.

**Azure prerequisites**: You need a Microsoft Azure subscription, and Azure Recovery Services vault, to orchestrate and manage replication.
**On-premises VMM servers and Hyper-V hosts**: Make sure that VMM servers and Hyper-V hosts are compliant and prepared for Site Recovery deployment.

Go to [Step 2: Verify prerequisites and limitations](vmm-to-vmm-walkthrough-prerequisites.md).

## Step 3: Plan networking

You need to do some network planning to ensure that you can configure network mapping between VMM VM networks when you deploy the scenario.

Go to [Step 3: Plan networking](vmm-to-vmm-walkthrough-network.md).


## Step 4: Prepare VMM and Hyper-V

Prepare the VMM servers and Hyper-V hosts for Site Recovery deployment.

Go to [Step 4: Prepare on-premises servers](vmm-to-vmm-walkthrough-vmm-hyper-v.md).

## Step 5: Set up a vault

Set up a Recovery Services vault. The vault contains configuration settings, and orchestrates replication.

[Step 5: Set up a vault](vmm-to-vmm-walkthrough-create-vault.md).

## Step 6: Set up source and target settings

Set up the source and target replication VMM locations. Add the VMM servers to the vault, and download the installation files for Site Recovery components. Run Azure Site Recovery Provider setup on the VMM server. Setup installs the Provider on the VMM server, and registers the server in the vault. You install the Microsoft Recovery Services agent on each Hyper-V host.

Go to [Step 6: Set up the source and target settings](vmm-to-vmm-walkthrough-source-target.md).

## Step 7: Configure network mapping

Map VMM VM networks in the source and target locations. After failover, VMs are created in the target network that maps to the source VM network in which the source Hyper-V VM is located.

Go to [Step 7: Configure network mapping](vmm-to-vmm-walkthrough-network-mapping.md).


## Step 8: Set up a replication policy

Specify how  VMs will be replicated between VMM locations.

Go to [Step 8: Set up a replication policy](vmm-to-vmm-walkthrough-replication.md).


## Step 9: Enable replication for VMs

Select the VMs you want to replicate. Enabling a VM for replication triggers the initial replication to the secondary site, followed by ongoing delta replication.

Go to [Step 9: Enable replication](vmm-to-vmm-walkthrough-enable-replication.md).


## Step 10: Run a test failover

Run a test failover to make sure everything's working as expected.

Go to [Step 10: Run a test failover](vmm-to-vmm-walkthrough-test-failover.md).
