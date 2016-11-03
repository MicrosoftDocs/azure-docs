---
title: Migrate Azure IaaS virtual machines from one Azure region to another with Site Recovery | Microsoft Docs
description: Use Azure Site Recovery to migrate Azure IaaS virtual machines from one Azure region to another.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: tysonn

ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/21/2016
ms.author: raynew

---
# Migrate Azure IaaS virtual machines between Azure regions with Azure Site Recovery
## Overview
Welcome to Azure Site Recovery! Use this article if you want to migrate Azure VMs between Azure regions. Before you start, note that:

* Azure has two different deployment models for creating and working with resources: Azure Resource Manager and classic. Azure also has two portals – the Azure classic portal that supports the classic deployment model, and the Azure portal with support for both deployment models. The basic steps for migration are the same whether you're configuring Site Recovery in Resource Manager or in classic. However the UI instructions and screenshots in this article are relevant for the Azure portal.
* **Currently you can only migrate from one region to another. You can fail over VMs from one Azure region to another, but you can't fail them back again.**
* The migration instructions in this article are based on the instructions for replicating a physical machine to Azure. It includes links to the steps in [Replicate VMware VMs or physical servers to Azure](site-recovery-vmware-to-azure.md), which describes how to replicate a physical server in the Azure portal.
* If you're setting up Site Recovery in the classic portal, follow the detailed instructions in [this article](site-recovery-vmware-to-azure-classic.md). **You should no longer use** the instructions in this [legacy article](site-recovery-vmware-to-azure-classic-legacy.md).

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Prerequisites
Here's what you need for this deployment:

* **Configuration server**: An on-premises VM running Windows Server 2012 R2 that acts as the configuration server. You install the other Site Recovery components (including the process server and master target server) on this VM too. Read more in [scenario architecture](site-recovery-vmware-to-azure.md#scenario-architecture) and [configuration server prerequisites](site-recovery-vmware-to-azure.md#configuration-server-prerequisites).
* **IaaS virtual machines**: The VMs you want to migrate. You migrate these VMs by treating them as physical machines.

## Deployment steps
This section describes the deployment steps in the new Azure portal. If you need these deployment steps for Site Recovery in the classic portal, refer to [this article](site-recovery-vmware-to-azure-classic.md).

1. [Create a vault](site-recovery-vmware-to-azure.md#create-a-recovery-services-vault).
2. [Deploy a configuration server](site-recovery-vmware-to-azure.md#step-2-set-up-the-source-environment).
3. After you've deployed the configuration server, check that it can communicate with the VMs that you want to migrate.
4. [Set up replication settings](site-recovery-vmware-to-azure.md#step-4-set-up-replication-settings). Create a replication policy and assign to the configuration server.
5. [Install the Mobility service](site-recovery-vmware-to-azure.md#step-6-replication-application). Each VM you want to protect needs the Mobility service installed. This service sends data to the process server. The Mobility service can be installed manually or pushed and installed automatically by the process server when protection for the VM is enabled. Firewall rules on the VMs that you want to migrate should be configured to allow push installation of this service.
6. [Enable replication](site-recovery-vmware-to-azure.md#enable-replication). Enable replication for the VMs you want to migrate. You can discover the IaaS virtual machines that you want to migrate to Azure using the private IP address of the virtual machines. Find this address on the virtual machine dashboard in Azure. When you enable replication, you set the machine type for the VMs as physical machines.
7. [ Run an unplanned failover](site-recovery-failover.md#run-an-unplanned-failover). After initial replication is complete, you can run an unplanned failover from one Azure region to another. Optionally, you can create a recovery plan and run an unplanned failover, to migrate multiple virtual machines between regions. [Learn more](site-recovery-create-recovery-plans.md) about recovery plans.

## Next steps
Learn more about other replication scenarios in [What is Azure Site Recovery?](site-recovery-overview.md)

