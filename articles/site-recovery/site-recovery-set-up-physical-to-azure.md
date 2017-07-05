---
title: 'Set up the source environment (physical servers to Azure) | Microsoft Docs'
description: This article describes how to set up your on-premises environment to start replicating physical servers running Windows or Linux into Azure.
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
ms.workload: storage-backup-recovery
ms.date: 06/05/2017
ms.author: anoopkv
---

# Set up the source environment (physical server to Azure)
> [!div class="op_single_selector"]
> * [VMware to Azure](./site-recovery-set-up-vmware-to-azure.md)
> * [Physical to Azure](./site-recovery-set-up-physical-to-azure.md)

This article describes how to set up your on-premises environment to start replicating physical servers running Windows or Linux into Azure.

## Prerequisites

The article assumes that you already have:
1. A Recovery Services vault in the [Azure portal](http://portal.azure.com "Azure portal").
3. A physical computer on which to install the configuration server.

### Configuration server minimum requirements
The following table lists the minimum hardware, software, and network requirements for a configuration server.
[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-and-scaleout-process-server-requirements.md)]

> [!NOTE]
> HTTPS-based proxy servers are not supported by the configuration server.

## Choose your protection goals

1. In the Azure portal, go to the **Recovery Services** vaults blade and select your vault.
2. In the **Resource** menu of the vault, click **Getting Started** > **Site Recovery** > **Step 1: Prepare Infrastructure** > **Protection goal**.

    ![Choose goals](./media/site-recovery-set-up-physical-to-azure/choose-goals.png)
3. In **Protection goal**, select **To Azure** and **Not virtualized/Other**, and then click **OK**.

    ![Choose goals](./media/site-recovery-set-up-physical-to-azure/physical-protection-goal.PNG)

## Set up the source environment

1. In **Prepare source**, if you don’t have a configuration server, click **+Configuration server** to add one.

  ![Set up source](./media/site-recovery-set-up-physical-to-azure/plus-config-srv.png)
2. In the **Add Server** blade, check that **Configuration Server** appears in **Server type**.
4. Download the Site Recovery Unified Setup installation file.
5. Download the vault registration key. You need the registration key when you run Unified Setup. The key is valid for five days after you generate it.

	![Set up source](./media/site-recovery-set-up-physical-to-azure/set-source2.png)
6. On the machine you’re using as the configuration server, run **Azure Site Recovery Unified Setup** to install the configuration server, the process server, and the master target server.

#### Run Azure Site Recovery Unified Setup

> [!TIP]
> Configuration server registration fails if the time on your computer's system clock is more than five minutes off of local time. Synchronize your system clock with a [time server](https://technet.microsoft.com/windows-server-docs/identity/ad-ds/get-started/windows-time-service/windows-time-service) before starting the installation.

[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]

> [!NOTE]
> The configuration server can be installed via a command line. For more information, see [Installing configuration server using command-line tools](http://aka.ms/installconfigsrv).


## Common issues

[!INCLUDE [site-recovery-vmware-to-azure-install-register-issues](../../includes/site-recovery-vmware-to-azure-install-register-issues.md)]


## Next steps

Next step involves [setting up your target environment](./site-recovery-prepare-target-physical-to-azure.md) in Azure.
