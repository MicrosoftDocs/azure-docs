---
title: Replicate physical on-premises servers to Azure with Azure Site Recovery | Microsoft Docs
description: Provides an overview of the steps for replicating workloads running on on-premises Windows/Linux physical servers to Azure with the Azure Site Recovery service.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 20122f01-929a-4675-b85b-a9b99d2618bc
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/27/2017
ms.author: raynew

---
# Replicate physical servers to Azure with Site Recovery

This article provides an overview of the steps required to replicate on-premises Windows/Linux physical servers to Azure, using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.


## Step 1: Review architecture and prerequisites

Before you start deployment, review the scenario architecture, and make sure you understand all the components you need to set up the deployment.

Go to [Step 1: Review the architecture](physical-walkthrough-architecture.md)


## Step 2: Review prerequisites

Make sure you have the prerequisites in place for each deployment component:

- **Azure prerequisites**: You need a Microsoft Azure account, Azure networks, and storage accounts.
- **On-premises Site Recovery components**: You need a machine running on-premises Site Recovery components.
- **Replicated machines**: Servers you want to replicate need to comply with on-premises and Azure requirements.

Go to [Step 2: Review prerequisites and limitations](physical-walkthrough-prerequisites.md)

## Step 3: Plan capacity

If you're doing a full deployment you need to figure out what replication resources you need. If you're doing a quick set up to test the environment, you can skip this step.

Go to [Step 3: Plan capacity](physical-walkthrough-capacity.md)

## Step 4: Plan networking

You need to do some network planning to ensure that Azure VMs are connected to networks after failover occurs, and  that that they have the right IP addresses.

Go to [Step 4: Plan networking](physical-walkthrough-network.md)

##  Step 5: Prepare Azure resources

Set up Azure networks and storage before you start. 

Go to [Step 5: Prepare Azure](physical-walkthrough-prepare-azure.md)


## Step 6: Set up a vault

You set up a Recovery Services vault to orchestrate and manage replication. When you set up the vault, you specify what you want to replicate, and where you want to replicate it to.

Go to [Step 6: Set up a vault](physical-walkthrough-create-vault.md)

## Step 7: Configure source and target settings

Configure settings for the source and target (Azure) site. Source settings includes running Unified Setup to install the on-premises Site Recovery components.

Go to [Step 7: Set up the source and target](physical-walkthrough-source-target.md)

## Step 8: Set up a replication policy

You set up a policy to specify how physical servers should replicate.

Go to [Step 8: Set up a replication policy](physical-walkthrough-replication.md)

## Step 9: Install the Mobility service

The Mobility service must be installed on each server you want to replicate. There are a few ways to set up the service, with push or pull installation.

Go to [Step 9: Install the Mobility service](physical-walkthrough-install-mobility.md)

## Step 10: Enable replication

After the Mobility service is running on a server, you can enable replication for it. After enabling, initial replication of the VM occurs.

Go to [Step 10: Enable replication](physical-walkthrough-enable-replication.md)

## Step 11: Run a test failover

After initial replication finishes and delta replication is running, you can run a test failover to make sure everything works as expected.

Go to [Step 11: Run a test failover](physical-walkthrough-test-failover.md)

