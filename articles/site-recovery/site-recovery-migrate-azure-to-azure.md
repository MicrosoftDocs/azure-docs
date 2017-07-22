---
title: Migrate Azure IaaS VMs between Azure regions | Microsoft Docs
description: Use Azure Site Recovery to migrate Azure IaaS virtual machines from one Azure region to another.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: tysonn

ms.assetid: 8a29e0d9-0010-4739-972f-02b8bdf360f6
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/14/2017
ms.author: raynew

---
# Migrate Azure IaaS virtual machines between Azure regions with Azure Site Recovery
## Overview
Welcome to Azure Site Recovery! Use this article if you want to migrate Azure VMs between Azure regions. Before you start, note that:

* Azure has two different deployment models for creating and working with resources: Azure Resource Manager and classic. Azure also has two portals – the Azure classic portal that supports the classic deployment model, and the Azure portal with support for both deployment models. The basic steps for migration are the same whether you're configuring Site Recovery in Resource Manager or in classic. However the UI instructions and screenshots in this article are relevant for the Azure portal.
* **Currently you can only migrate from one region to another. You can fail over VMs from one Azure region to another, but you can't fail them back again.**

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Prerequisites
Here's what you need for this deployment:

* **IaaS virtual machines**: The VMs you want to migrate. You migrate these VMs by treating them as physical machines.

## Deployment steps
This section describes the deployment steps in the new Azure portal.

1. [Create a vault](site-recovery-vmware-to-azure.md#create-a-recovery-services-vault).
2. [Enable replication](site-recovery-vmware-to-azure.md#enable-replication). Enable replication for the VMs you want to migrate, and choose Azure as source. 
3. [ Run an unplanned failover](site-recovery-failover.md). After initial replication is complete, you can run an unplanned failover from one Azure region to another. Optionally, you can create a recovery plan and run an unplanned failover, to migrate multiple virtual machines between regions. [Learn more](site-recovery-create-recovery-plans.md) about recovery plans.

## Next steps
Learn more about other replication scenarios in [What is Azure Site Recovery?](site-recovery-overview.md)
