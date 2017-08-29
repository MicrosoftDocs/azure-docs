---
title: Set up the source and target for VMware replication to Azure with Azure Site Recovery | Microsoft Docs
description: Summarizes the steps to set up source and target settings for replication of VMware VMs to Azure storage with Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: d99e422e-daf7-4fa8-af3c-af2340340136
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/27/2017
ms.author: raynew

---
# Step 8: Set up the source and target for VMware replication to Azure

This article describes how to configure source and target settings when replicating on-premises VMware virtual machines to Azure, using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.

Post comments and questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Set up the source environment

Set up the configuration server, register it in the vault, and discover VMs.

1. Click **Site Recovery** > **Step 1: Prepare Infrastructure** > **Source**.
2. If you don’t have a configuration server, click **+Configuration server**.
3. In **Add Server**, check that **Configuration Server** appears in **Server type**.
4. Download the Site Recovery Unified Setup installation file.
5. Download the vault registration key. You need this when you run Unified Setup. The key is valid for five days after you generate it.

   ![Set up source](./media/vmware-walkthrough-source-target/set-source2.png)


## Register the configuration server in the vault

Do the following before you start, then run Unified Setup to install the configuration server, the process server, and the master target server.
    - Get a quick video overview

        > [!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/VMware-to-Azure-with-ASR-Video1-Source-Infrastructure-Setup/player]

    - On the configuration server VM, make sure that the system clock is synchronized with a [Time Server](https://technet.microsoft.com/windows-server-docs/identity/ad-ds/get-started/windows-time-service/windows-time-service). It should match. If it's 15 minutes in front or behind, setup might fail.
    - Run setup as a Local Administrator on the configuration server VM.
    - Make sure TLS 1.0 is enabled on the VM.


[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]

> [!NOTE]
> The configuration server can also be installed [from the command line](http://aka.ms/installconfigsrv).



## Connect to VMware servers

To allow Azure Site Recovery to discover virtual machines running in your on-premises environment, you need to connect your VMware vCenter Server or vSphere ESXi hosts with Site Recovery. Note the following before you start:

- If you add the vCenter server or vSphere hosts to Site Recovery with an account without administrator privileges on the server, the account needs these privileges enabled:
    - Datacenter, Datastore, Folder, Host, Network, Resource, Virtual machine, vSphere Distributed Switch.
    - The vCenter server needs Storage views permissions.
- When you add VMware servers to Site Recovery, it can take 15 minutes or longer for them to appear in the portal.

### Add the account for automatic discovery

[!INCLUDE [site-recovery-add-vcenter-account](../../includes/site-recovery-add-vcenter-account.md)]

### Set up a connection

Connect to servers as follows:

1. Select **+vCenter** to start connecting a VMware vCenter server or a VMware vSphere ESXi host.
2. In **Add vCenter**, specify a friendly name for the vSphere host or vCenter server, and then specify the IP address or FQDN of the server.
3. Leave the port as 443 unless your VMware servers are configured to listen for requests on a different port. Select the account that is to connect to the VMware vCenter or vSphere ESXi server. Click **OK**.
4. Site Recovery connects to VMware servers using the specified settings, and discovers VMs.

> [!NOTE]
> If you're adding a server or host with an account that doesn't have administrator privileges on the vCenter or host server, make sure that the account has these privileges enabled: Datacenter, Datastore, Folder, Host, Network, Resource, Virtual machine, and vSphere Distributed Switch. In addition, the VMware vCenter server needs the Storage Views privilege enabled.


## Set up the target environment

Before you set up the target environment, make sure you have an Azure storage account and virtual network set up.

1. Click **Prepare infrastructure** > **Target**, and select the Azure subscription you want to use.
2. Specify whether your target deployment model is Resource Manager-based, or classic.
3. Site Recovery checks that you have one or more compatible Azure storage accounts and networks.

   ![Target](./media/vmware-walkthrough-source-target/gs-target.png)
4. If you haven't created a storage account or network, click **+Storage account** or **+Network**, to create a Resource Manager account or network inline.

## Next steps

Go to [Step 9: Set up a replication policy](vmware-walkthrough-replication.md)
