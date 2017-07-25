---
title: Prepare System Center VMM for Hyper-V replication to Azure  | Microsoft Docs
description: Describes how to prepare System Center VMM server for Hyper-V replication to Azure, using Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: afcd81ae-d192-4013-a0af-3dac45b3c7e9
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 07/23/2017
ms.author: raynew
---

# Step 6: Prepare VMM servers and Hyper-V hosts for Hyper-V replication to Azure

After setting up [Azure components](vmm-to-azure-walkthrough-prepare-azure.md) for the deployment, use the instructions in this article to prepare on-premises VMM servers and Hyper-V hosts to interact with Azure Site Recovery.

After reading this article, post any comments at the bottom, or ask technical questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Prepare VMM servers

- You need at least one VMM server that meet the support requirements for Site Recovery replication (site-recovery-support-matrix-to-azure.md#support-for-datacenter-management-servers).
- Make sure you've prepared the VMM server for [network mapping](vmm-to-azure-walkthrough-network.md#network-mapping-for-replication-to-azure).
- Make sure that the VMM server can access these URLs

    [!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]
    
- If you have IP address-based firewall rules, ensure they allow communication to Azure.
- Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.
- Allow IP address ranges for the Azure region of your subscription, and for West US (used for Access Control and Identity Management).

During Site Recovery deployment, you download the Site Recovery Provider and install it on each VMM server. The VMM server is registered in the Recovery Services vault.




## Next steps

Go to [Step 7: Create a vault](vmm-to-azure-walkthrough-create-vault.md)

