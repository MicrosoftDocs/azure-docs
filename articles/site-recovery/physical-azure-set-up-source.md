---
title: Set up the configuration server for disaster recovery of physical servers to Azure using Azure Site Recovery | Microsoft Docs'
description: This article describes how to set up the on-premises configuration server for disaster recovery of on-premises physical servers to Azure.
services: site-recovery
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 07/03/2019
ms.author: ankitadutta
---

# Set up the configuration server for disaster recovery of physical servers to Azure

This article describes how to set up your on-premises environment to start replicating physical servers running Windows or Linux into Azure.

## Prerequisites

The article assumes that you already have:
- A Recovery Services vault in the [Azure portal](https://portal.azure.com "Azure portal").
- A physical computer on which to install the configuration server.
- If you've disabled TLS 1.0 on the machine on which you're installing the configuration server, make sure that TLs 1.2 is enabled, and that the .NET Framework version 4.6 or later is installed on the machine (with strong cryptography enabled). [Learn more](https://support.microsoft.com/help/4033999/how-to-resolve-azure-site-recovery-agent-issues-after-disabling-tls-1).

### Configuration server minimum requirements
The following table lists the minimum hardware, software, and network requirements for a configuration server.
[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-and-scaleout-process-server-requirements.md)]

> [!NOTE]
> HTTPS-based proxy servers are not supported by the configuration server.

## Choose your protection goals

1. In the Azure portal, go to the **Recovery Services** vaults blade and select your vault.
2. In the **Resource** menu of the vault, click **Getting Started** > **Site Recovery** > **Step 1: Prepare Infrastructure** > **Protection goal**.

    ![Screenshot that shows where to select the protection goal.](./media/physical-azure-set-up-source/choose-goals.png)
3. In **Protection goal**, select **To Azure** and **Not virtualized/Other**, and then click **OK**.

    ![Choose goals](./media/physical-azure-set-up-source/physical-protection-goal.png)

## Set up the source environment

1. In **Prepare source**, if you don’t have a configuration server, click **+Configuration server** to add one.

   ![Screenshot that shows how to select the configuration server.](./media/physical-azure-set-up-source/plus-config-srv.png)
2. In the **Add Server** blade, check that **Configuration Server** appears in **Server type**.
4. Download the Site Recovery Unified Setup installation file.
5. Download the vault registration key. You need the registration key when you run Unified Setup. The key is valid for five days after you generate it.

	![Set up source](./media/physical-azure-set-up-source/set-source2.png)
6. On the machine you’re using as the configuration server, run **Azure Site Recovery Unified Setup** to install the configuration server, the process server, and the master target server.

#### Run Azure Site Recovery Unified Setup

> [!TIP]
> Configuration server registration fails if the time on your computer's system clock is more than five minutes off of local time. Synchronize your system clock with a [time server](/windows-server/networking/windows-time-service/windows-time-service-top) before starting the installation.

[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]

> [!NOTE]
> The configuration server can be installed via a command line. [Learn more](physical-manage-configuration-server.md#install-from-the-command-line).


## Common issues

[!INCLUDE [site-recovery-vmware-to-azure-install-register-issues](../../includes/site-recovery-vmware-to-azure-install-register-issues.md)]


## Next steps

Next step involves [setting up your target environment](physical-azure-set-up-target.md) in Azure.
