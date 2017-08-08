---
title: Replicate Hyper-V VMs in VMM clouds to Azure with Azure Site Recovery | Microsoft Docs
description: Provides an overview for replicating Hyper-V VMs in VMM clouds to Azure using the Azure Site Recovery service
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 8e7d868e-00f3-4e8b-9a9e-f23365abf6ac
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/14/2017
ms.author: raynew

---
# Replicate Hyper-V virtual machines in VMM clouds to Azure using Site Recovery in the Azure portal
> [!div class="op_single_selector"]
> * [Azure portal](site-recovery-vmm-to-azure.md)
> * [Azure classic](site-recovery-vmm-to-azure-classic.md)
> * [PowerShell Resource Manager](site-recovery-vmm-to-azure-powershell-resource-manager.md)
> * [PowerShell classic](site-recovery-deploy-with-powershell.md)


This article provides an overview of the steps required to replicate on-premises Hyper-V virtual machines (VMs) managed in System Center Virtual Machine Manager (VMM) clouds to Azure, using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.

After reading this article, post any comments at the bottom, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Step 1: Review the scenario architecture

Before you start deployment, review the scenario architecture, and make sure that you understand all the components you need to deploy.

Go to [Step 1: Review the architecture](vmm-to-azure-walkthrough-architecture.md)

## Step 2: Review prerequisites and limitations

Make sure that you understand the deployment prerequisites and limitations.

**Azure prerequisites**: You need a Microsoft Azure account, Azure networks, and storage accounts.
**On-premises VMM servers and Hyper-V hosts**: Make sure that VMM servers and Hyper-V hosts are compliant and prepared for Site Recovery deployment.
**Replicated VMs**: Check that VMs you want to replicate comply with Azure requirements.

Go to [Step 2: Verify prerequisites and limitations](vmm-to-azure-walkthrough-prerequisites.md)

## Step 3: Plan capacity

If you're doing a full deployment, you need to figure out what replication resources you need. There are a couple of tools available to help you do this. If you're doing a quick set up to test the environment, you can skip this step.

Go to [Step 3: Plan capacity](vmm-to-azure-walkthrough-capacity.md)

## Step 4: Plan networking

You need to do some network planning to ensure that you can configure network mapping when you deploy the scenario, that Azure VMs will be connected to Azure virtual networks after failover occurs, and that that they're assigned appropriate IP addresses.

Go to [Step 4: Plan networking](vmm-to-azure-walkthrough-network.md)


## Step 5: Prepare Azure resources

Set up an Azure account, networks, and storage. You can do this during deployment, but we recommend you do this before you start.

Go to [Step 5: Prepare Azure](vmm-to-azure-walkthrough-prepare-azure.md)

## Step 6: Prepare VMM and Hyper-V

Prepare the on-premises VMM servers and Hyper-V hosts for Site Recovery deployment.

Go to [Step 6: Prepare on-premises servers](vmm-to-azure-walkthrough-vmm-hyper-v.md)

## Step 7: Set up a vault

Set up a Recovery Services vault. The vault contains configuration settings, and orchestrates replication.

[Step 7: Set up a vault](vmm-to-azure-walkthrough-create-vault.md)

## Step 8: Configure source and target settings

Set up the source and target replication locations. Add the VMM server to the vault, and download the installation files for Site Recovery components. Run Azure Site Recovery Provider setup on the VMM server. Setup installs the Provider on the VMM server, and registers the server in the vault. You install the Microsoft Recovery Services agent on each Hyper-V host.

Go to [Step 8: Configure source and target settings](vmm-to-azure-walkthrough-source-target.md)

## Step 9: Configure network mapping

Map on-premises VMM VM networks to Azure virtual networks. After failover, Azure VMs are created in the Azure network that maps to the on-premises VM network in which the source Hyper-V is located.

Go to [Step 9: Configure network mapping](vmm-to-azure-walkthrough-network-mapping.md)


## Step 10: Set up a replication policy

Specify how on-premises VMs will be replicated to Azure.

Go to [Step 10: Set up a replication policy](vmm-to-azure-walkthrough-replication.md)


## Step 11: Enable replication for VMs

Select the VMs you want to replicate. ENabling a VM for replication triggers the initial replication to Azure, followed by ongoing delta replication.

Go to [Step 11: Enable replication](vmm-to-azure-walkthrough-enable-replication.md)


## Step 12: Run a test failover

Run a test failover to make sure everything's working as expected.

Go to [Step 12: Run a test failover](vmm-to-azure-walkthrough-test-failover.md)


