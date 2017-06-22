---
title: Replicate Hyper-V VMs to Azure with Azure Site Recovery | Microsoft Docs
description: Describes how to orchestrate replication, failover and recovery of on-premises Hyper-V VMs to Azure
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: efddd986-bc13-4a1d-932d-5484cdc7ad8d
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 21/06/2017
ms.author: raynew
---

# Replicate Hyper-V virtual machines (without VMM) to Azure 

> [!div class="op_single_selector"]
> * [Azure portal](site-recovery-hyper-v-site-to-azure.md)
> * [Azure classic](site-recovery-hyper-v-site-to-azure-classic.md)
> * [PowerShell - Resource Manager](site-recovery-deploy-with-powershell-resource-manager.md)
>
>

This article provides an overview of the steps required to replicate on-premises Hyper-V virtual machines to Azure, using the [Azure Site Recovery](site-recovery-overview.md) in the Azure portal. In this deployment Hyper-V VMs aren't managed by System Center Virtual Machine Manager (VMM).


After reading this article, post any comments at the bottom, or ask technical questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Step 1: Review architecture and prerequisites

Before you start deployment, review the scenario architecture, and make sure you understand all the components you need to deploy

Go to [Step 1: Review the architecture](hyper-v-site-walkthrough-architecture.md)


## Step 2: Review prerequisites

Make sure you have the prerequisites in place for each deployment component:

- **Azure prerequisites**: You need a Microsoft Azure account, Azure networks, and storage accounts.
- **On-premises Hyper-V prerequisites**: Make sure Hyper-V hosts are prepared for Site Recovery deployment.
- **Replicated VMs**: VMs you want to replicate need to comply with Azure requirements.
- 
Go to [Step 2: Verify prerequisites and limitations](hyper-v-site-walkthrough-prerequisites.md)

## Step 3: Plan capacity

If you're doing a full deployment you need to figure out what replication resources you need. There are a couple of tools available to help you do this. Go to Step 2. If you're doing a quick set up to test the environment you can skip this step.

Go to [Step 3: Plan capacity](hyper-v-site-walkthrough-capacity.md)

## Step 4: Plan networking

You need to do some network planning to ensure that Azure VMs are connected to networks after failover occurs, and  that that they have the right IP addresses.

Go to [Step 4: Plan networking](hyper-v-site-walkthrough-network.md)

##  Step 5: Prepare Azure resources

Set up Azure networks and storage before you start. You can do this during deployment, but we recommend you do this before you start.

Go to [Step 5: Prepare Azure](hyper-v-site-walkthrough-prepare-azure.md)


## Step 6: Prepare Hyper-V

Make sure that Hyper-V servers meet Site Recovery deployment requirements.

Go to [Step 6: Prepare Hyper-V](hyper-v-site-walkthrough-prepare-hyper-v.md)

## Step 7: Set up a vault

You need to set up a Recovery Services vault to orchestrate and manage replication. When you set up the vault, you specify what you want to replicate, and where you want to replicate it to.

Go to [Step 7: Create a vault](hyper-v-site-walkthrough-create-vault.md)

## Step 8: Configure source and target settings

Set up the source and target that's used for replication. Setting up source settings includes adding Hyper-V hosts to a Hyper-V site, installing the Site Recovery Provider and Recovery Services agent on each Hyper-V host, and registering the site in the Recovery Services vault.

Go to [Step 8: Set up the source and target](hyper-v-site-walkthrough-source-target.md)

## Step 9: Set up a replication policy

You set up a policy to specify replication settings for Hyper-V VMs in the vault.

Go to [Step 9: Set up a replication policy](hyper-v-site-walkthrough-replication.md)


## Step 10: Enable replication

After you have a replication policy in place,  After enabling, initial replication of the VM occurs.

Go to [Step 10: Enable replication](hyper-v-site-walkthrough-enable-replication.md)

## Step 11: Run a test failover

After initial replication finishes, and delta replication is running, you can run a test failover to make sure everything works as expected.

Go to [Step 11: Run a test failover](hyper-v-site-walkthrough-test-failover.md)
