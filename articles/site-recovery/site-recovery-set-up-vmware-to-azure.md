---
title: Set up the source environment (VMware to Azure)
description: This article describes how to set up your on-premises environment to start replicating virtual machines running on VMware into Azure.
services: site-recovery
documentationcenter: ''
author: AnoopVasudavan
manager: gauravd
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: backup-recovery
ms.date: 12/9/2016
ms.author: anoopkv
---

# Set up the source environment (VMware to Azure)
This article describes how to set up your on-premises environment to start replicating virtual machines running on VMware into Azure.

## Prerequisites

The article assumes that you have already created
1. A Recovery Services Vault [Azure Portal](http://portal.azure.com "Azure Portal").
2. A dedicated account in your VMware vCenter that can be used for automatic discovery
3. A virtual machine to install the Configuration Server. This virtual machine should meet the  minimum recommendations mentioned in the below table.


### Configuration Server Minimum Requirements

[!INCLUDE [site-recovery-configuration-server-requirements](../../site-recovery-configuration-server-requirements.md)]

> [!NOTE]
> HTTPS based proxy servers are not supported by the Configuration Server.

## Choose your protection goals

Select what you want to replicate and where you want to replicate to.

1. In the **Recovery Services vaults** blade, select your vault.
2. In the Resource Menu of the vault click on **Getting Started**, click **Site Recovery** > **Step 1: Prepare Infrastructure** > **Protection goal**.

    ![Choose goals](./media/site-recovery-vmware-to-azure/choose-goals.png)
3. In **Protection goal**, select **To Azure**, and select **Yes, with VMware vSphere Hypervisor**. Then click **OK**.

    ![Choose goals](./media/site-recovery-vmware-to-azure/choose-goals2.png)

## Step 2: Set up the source environment
Set up the configuration server and register it in the Recovery Services vault. If you're replicating VMware VMs specify the VMware account you're using for automatic discovery.

1. Click **Step 1: Prepare Infrastructure** > **Source**. In **Prepare source**, if you don’t have a configuration server click **+Configuration server** to add one.

    ![Set up source](./media/site-recovery-vmware-to-azure/set-source1.png)
2. In the **Add Server** blade, check that **Configuration Server** appears in **Server type**.
4. Download the Site Recovery Unified Setup installation file.
5. Download the vault registration key. You need this when you run Unified Setup. The key is valid for 5 days after you generate it.

	![Set up source](./media/site-recovery-vmware-to-azure/set-source2.png)
6. On the machine you’re using as the configuration server, run **Azure Site Recovery Unified Setup** to install the configuration server, the process server, and the master target server.

### Running the Azure Site Recovery Unified Setup
[!INCLUDE [site-recovery-add-configuration-server](../../site-recovery-add-configuration-server.md)]

## Common issues

To be added

## Next steps

To be added
