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
ms.date: 08/31/2017
ms.author: raynew

---
# Migrate Azure IaaS virtual machines between Azure regions with Azure Site Recovery
## Overview

se this article if you want to migrate Azure VMs between Azure regions using the [Site Recovery](../site-recovery-overview.md) service.



## Prerequisites
Here's what you need for this deployment:

* **IaaS virtual machines**: The VMs you want to migrate. You migrate these VMs by treating them as physical machines.

## Deployment steps

1. [Create a vault](azure-to-azure-tutorial-enable-replication.md#create-a-vault).
2. [Enable replication](azure-to-azure-tutorial-enable-replication.md#enable-replication) for the VMs you want to migrate, and choose Azure as source.
  >[!NOTE]
  >
  > Currently, native replication of Azure VMs using managed disks are not supported. You can use "Physical to Azure" option in [this document](../tutorial-vmware-to-azure.md) to migrate VMs with managed disks.
3. [Run a failover](../site-recovery-failover.md). After initial replication is complete, you can run a failover from one Azure region to another. Optionally, you can create a recovery plan and run a failover, to migrate multiple virtual machines between regions. [Learn more](../site-recovery-create-recovery-plans.md) about recovery plans.

## Next steps
Learn more about other replication scenarios in [What is Azure Site Recovery?](../site-recovery-overview.md)
