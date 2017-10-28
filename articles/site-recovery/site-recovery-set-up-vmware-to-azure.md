---
title: 'Set up the source environment (VMware to Azure) | Microsoft Docs'
description: This article describes how to set up your on-premises environment to start replicating VMware virtual machines to Azure.
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
ms.date: 06/29/2017
ms.author: anoopkv
---

# Set up the source environment (VMware to Azure)
> [!div class="op_single_selector"]
> * [VMware to Azure](./site-recovery-set-up-vmware-to-azure.md)
> * [Physical to Azure](./site-recovery-set-up-physical-to-azure.md)

This article describes how to set up your on-premises environment to start replicating virtual machines running on VMware to Azure.

## Prerequisites

The article assumes that you have already created:
- A Recovery Services Vault in the [Azure portal](http://portal.azure.com "Azure portal").
- A dedicated account in your VMware vCenter that can be used for [automatic discovery](./site-recovery-vmware-to-azure.md#vmware-account-permissions).
- A virtual machine on which to install the configuration server.

## Configuration server minimum requirements
The configuration server software should be deployed on a highly available VMware virtual machine. The following table lists the minimum hardware, software, and network requirements for a configuration server.
[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-and-scaleout-process-server-requirements.md)]

> [!NOTE]
> HTTPS-based proxy servers are not supported by the configuration server.

## Choose your protection goals

1. In the Azure portal, go to the **Recovery Services** vault blade and select your vault.
2. On the resource menu of the vault, go to **Getting Started** > **Site Recovery** > **Step 1: Prepare Infrastructure** > **Protection goal**.

    ![Choose goals](./media/site-recovery-set-up-vmware-to-azure/choose-goals.png)
3. In **Protection goal**, select **To Azure**, and choose **Yes, with VMware vSphere Hypervisor**. Then click **OK**.

    ![Choose goals](./media/site-recovery-set-up-vmware-to-azure/choose-goals2.png)

## Set up the source environment
Setting up the source environment involves two main activities:

- Install and register a configuration server with Site Recovery.
- Discover your on-premises virtual machines by connecting Site Recovery to your on-premises VMware vCenter or vSphere EXSi hosts.

### Step 1: Install and register a configuration server

1. Click **Step 1: Prepare Infrastructure** > **Source**. In **Prepare source**, if you don’t have a configuration server, click **+Configuration server** to add one.

    ![Set up source](./media/site-recovery-set-up-vmware-to-azure/set-source1.png)
2. On the **Add Server** blade, check that **Configuration Server** appears in **Server type**.
4. Download the Site Recovery Unified Setup installation file.
5. Download the vault registration key. You need the registration key when you run Unified Setup. The key is valid for five days after you generate it.

	![Set up source](./media/site-recovery-set-up-vmware-to-azure/set-source2.png)
6. On the machine you’re using as the configuration server, run **Azure Site Recovery Unified Setup** to install the configuration server, the process server, and the master target server.

#### Run Azure Site Recovery Unified Setup

> [!TIP]
> Configuration server registration fails if the time on your computer's system clock differs from local time by more than five minutes. Synchronize your system clock with a [Time Server](https://technet.microsoft.com/windows-server-docs/identity/ad-ds/get-started/windows-time-service/windows-time-service) before starting the installation.

[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]

> [!NOTE]
> The configuration server can be installed via command line. For more information, see [Installing the configuration server using Command-line tools](http://aka.ms/installconfigsrv).

#### Add the VMware account for automatic discovery

[!INCLUDE [site-recovery-add-vcenter-account](../../includes/site-recovery-add-vcenter-account.md)]

### Step 2: Add a vCenter
To allow Azure Site Recovery to discover virtual machines running in your on-premises environment, you need to connect your VMware vCenter Server or vSphere ESXi hosts with Site Recovery.

Select **+vCenter** to start connecting a VMware vCenter server or a VMware vSphere ESXi host.

[!INCLUDE [site-recovery-add-vcenter](../../includes/site-recovery-add-vcenter.md)]


## Common issues
[!INCLUDE [site-recovery-vmware-to-azure-install-register-issues](../../includes/site-recovery-vmware-to-azure-install-register-issues.md)]


## Next steps
[Set up your target environment](./site-recovery-prepare-target-vmware-to-azure.md) in Azure.
