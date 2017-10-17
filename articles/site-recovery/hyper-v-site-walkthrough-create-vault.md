---
title: Set up a vault for Hyper-V replication (without System Center VMM) to Azure using Azure Site Recovery | Microsoft Docs
description: Summarizes the steps you need to set up a vault for Hyper-V replication to Azure using Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: a936b3e2-0dbe-47ac-a98e-5285d96dc786
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 06/22/2017
ms.author: raynew
---

# Step 7: Set up a vault for Hyper-V replication

This article describes how to set up a vault, and specify what you want to replicate from your on-premises location, to Azure using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.


Post comments and questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Create a Recovery Services vault

[!INCLUDE [site-recovery-create-vault](../../includes/site-recovery-create-vault.md)]



## Select a protection goal

Select what you want to replicate, and where you want to replicate to.

1. Click **Recovery Services vaults** > vault.
2. In the Resource Menu, click **Site Recovery** > **Prepare Infrastructure** > **Protection goal**.
3. In **Protection goal**, select **To Azure** > **Yes, with Hyper-V**. Select **No** to confirm you're not using VMM. 

    ![Choose goals](./media/hyper-v-site-walkthrough-create-vault/choose-goals2.png)



## Next steps

Go to [Step 8: Set up source and target](hyper-v-site-walkthrough-source-target.md)
