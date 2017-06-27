---
title: Set up the source and target for physical server replication to Azure with Azure Site Recovery | Microsoft Docs
description: Summarizes the steps to set up source and target settings for replication of physical servers to Azure storage with the Azure Site Recovery service
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 2e3d03bc-4e53-4590-8a01-f702d3cc9500
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/27/2017
ms.author: raynew

---
# Step 7: Set up the source and target for physical server replication to Azure

This article describes how to configure source and target settings when replicating on-premises physical servers to Azure, using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.

Post comments and questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Set up the source environment

Set up the configuration server, register it in the vault, and discover machines.

1. Click **Site Recovery** > **Step 1: Prepare Infrastructure** > **Source**.
2. If you don’t have a configuration server, click **+Configuration server**.
3. In **Add Server**, check that **Configuration Server** appears in **Server type**.
4. Download the Site Recovery Unified Setup installation file.
5. Download the vault registration key. You need this when you run Unified Setup. The key is valid for five days after you generate it.

   ![Set up source](./media/vmware-walkthrough-source-target/set-source2.png)


## Register the configuration server in the vault

Do the following before you start, then run Unified Setup to install the configuration server, the process server, and the master target server. The video describes setting up the components for VMware VM to Azure replication. However, the same process is valid for physical server to Azure replication.

- On the configuration server VM, make sure that the system clock is synchronized with a [Time Server](https://technet.microsoft.com/windows-server-docs/identity/ad-ds/get-started/windows-time-service/windows-time-service). It should match. If it's 15 minutes in front or behind, setup might fail.
- Run setup as a Local Administrator on the configuration server machine.
- Make sure TLS 1.0 is enabled on the VM.


[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]

> [!NOTE]
> The configuration server can also be installed [from the command line](http://aka.ms/installconfigsrv).




## Set up the target environment

Before you set up the target environment, make sure you have an Azure storage account and virtual network set up.

1. Click **Prepare infrastructure** > **Target**, and select the Azure subscription you want to use.
2. Specify whether your target deployment model is Resource Manager-based, or classic.
3. Site Recovery checks that you have one or more compatible Azure storage accounts and networks.

   ![Target](./media/physical-walkthrough-source-target/gs-target.png)

4. If you haven't created a storage account or network, click **+Storage account** or **+Network**, to create a Resource Manager account or network inline.

## Next steps

Go to [Step 8: Set up a replication policy](physical-walkthrough-replication.md)
