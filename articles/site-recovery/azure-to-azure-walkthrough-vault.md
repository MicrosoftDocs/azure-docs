---
title: Set up a vault for Azure VM repliction between regions with Azure Site Recovery | Microsoft Docs
description: Summarizes the steps you need to set up a vault for Azure replication between Azure regions using Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmon
editor: ''

ms.assetid: 40472189-3d80-4963-b175-8bddcbc2f61f
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/01/2017
ms.author: raynew

---

# Step 4: Set up a vault for Azure to Azure replication

After [planning networks](azure-to-azure-walkthrough-network.md), use this article to set up a vault, for Azure virtual machines (VMs) replicating to another Azure region, using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.

- When you finish the article, you should have a Recovery Services vault set up.
- Post any comments at the bottom of this article, or ask questions in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).



>[!NOTE]
>
> Azure VM replication is currently in preview.




## Create a vault

[!INCLUDE [site-recovery-create-vault](../../includes/site-recovery-create-vault.md)]

>[!NOTE]
>
> We recommend that you create the Recovery Services vault in the location where you want your VMs to replicate. For example, if your target location is the central US, create the vault in **Central US**.


## Next steps

Go to [Step 5: Enable replication](azure-to-azure-walkthrough-enable-replication.md)
