---
title: Prepare Hyper-V hosts (without System Center VMM) for replication to Azure  | Microsoft Docs
description: Describes how to prepare Hyper-V hosts for replication to Azure using Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 0f204e24-8d78-4076-95c5-8137d1be9c01
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 06/22/2017
ms.author: raynew
---

# Step 6: Prepare Hyper-V hosts for replication to Azure

Use the instructions in this article to prepare on-premises Hyper-V hosts to interact with Azure Site Recovery.

After reading this article, post any comments at the bottom, or ask technical questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Prepare hosts

- Make sure that the Hyper-V hosts meet the [prerequisites](site-recovery-prereq.md#disaster-recovery-of-hyper-v-virtual-machines-to-azure-no-virtual-machine-manager).
- Make sure that the hosts can access the required URLs:

    [!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]
- If you have IP address-based firewall rules, ensure they allow communication to Azure.
- Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.
- Allow IP address ranges for the Azure region of your subscription, and for West US (used for Access Control and Identity Management).

During Site Recovery deployment, you add Hyper-V hosts that contain VMs you want to replicate to a Hyper-V site. The Site Recovery Provider, and Recovery Services agent are installed on each host. The Hyper-V site is registered in the Recovery Services vault.

## Next steps

Go to [Step 7: Create a vault](hyper-v-site-walkthrough-create-vault.md)

