---
title: Replicate Azure VMs between Azure regions | Microsoft Docs'
description: Summarizes the steps required to replicate Azure VMs between Azure regions with the Azure Site Recovery service in the Azure portal
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmon
editor: ''

ms.assetid: 6dd36239-4363-4538-bf80-a18e71b8ec67
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/01/2017
ms.author: raynew

---

# Replicate Azure VMs between regions with Azure Site Recovery

>This article provides an overview of the steps required to replicate Azure virtual machines (VMs) in one Azure region to Azure VMs in a different region. 

>[!NOTE]
>
> Azure VM replication is currently in preview.

Post comments and questions at the bottom of this article or on the [Azure Recovery Services forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Step 1: Review architecture

Before you start deployment, review the scenario architecture, and the components you need to deploy.

Go to [Step 1: Review the architecture](azure-to-azure-walkthrough-architecture.md)


## Step 2: Review prerequisites

Check that you have the Azure prerequisites in places, including a subscription, virtual networks, storage accounts, and VM requirements.

Go to [Step 2: Verify prerequisites and limitations](azure-to-azure-walkthrough-prerequisites.md)


## Step 3: Plan networking

Check that outbound connectivity is set up on Azure VMs you want to replicate, and that connections from on-premises are set up.

Go to [Step 4: Plan networking](azure-to-azure-walkthrough-network.md)



## Step 4: Create a vault 

You need to set up a Recovery Services vault to orchestrate and manage replication, and specify the source region.

Go to [Step 4: Create a vault](azure-to-azure-walkthrough-vault.md)


## Step 5: Enable replication


To enable replication, you configure target location settings, set up a replication policy, and select the Azure VMs that you want to replicate. After enabling, initial replication of the VM occurs.

Go to [Step 5: Enable replication](azure-to-azure-walkthrough-enable-replication.md)


## Step 6: Run a test failover

After initial replication finishes, and delta replication is running, you can run a test failover to make sure everything works as expected.

Go to [Step 6: Run a test failover](azure-to-azure-walkthrough-test-failover.md)


