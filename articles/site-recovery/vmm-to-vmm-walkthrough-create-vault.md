---
title: Create a vault for Hyper-V replication to a secondary site with Azure Site Recovery  | Microsoft Docs
description: Describes how to create a vault when replicating Hyper-V VMs to a secondary System Center VMM site with Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: ff65dbfb-cb26-410e-ab48-76971625db08
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/30/2017
ms.author: raynew

---
# Step 5: Create a vault for Hyper-V replication to a secondary site

After preparing on-premises [System Center Virtual Machine Manager (VMM) servers and Hyper-V hosts/clusters](vmm-to-vmm-walkthrough-vmm-hyper-v.md) for Hyper-V replication to a secondary site using [Azure Site Recovery](site-recovery-overview.md), you can create a Recovery Services vault, and select the replication scenario.

After reading this article, post any comments at the bottom, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Create a Recovery Services vault

[!INCLUDE [site-recovery-create-vault](../../includes/site-recovery-create-vault.md)]


## Choose a protection goal

Select what you want to replicate and where you want to replicate to.

1. Click **Site Recovery** > **Step 1: Prepare Infrastructure** > **Protection goal**.
2. Select **To recovery site**, and select **Yes, with Hyper-V**.
3. Select **Yes** to indicate you're using VMM to manage the Hyper-V hosts.
4. Select **Yes** if you have a secondary VMM server. If you're deploying replication between clouds on a single VMM server, click **No**. Then click **OK**.

    ![Choose goals](./media/vmm-to-vmm-walkthrough-create-vault/choose-goals.png)



## Next steps

Go to [Step 6: Set up the replication source and target](vmm-to-vmm-walkthrough-source-target.md).