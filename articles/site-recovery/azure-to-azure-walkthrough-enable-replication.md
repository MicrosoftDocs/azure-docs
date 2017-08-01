---
title: Enable replication for Azure VMs to another Azure region with Azure Site Recovery | Microsoft Docs
description: Summarizes the steps you need to enable replication to another Azure region for Azure VMs, using the Azure Site Recovery service
services: site-recovery
documentationcenter: ''
author: raynew
manager: carmonm
editor: ''

ms.assetid: a309644f-d36b-4188-bba7-ad45a2d9bede
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 8/01/2017
ms.author: raynew

---


# Step 5: Enable replication for Azure VMs


After setting up a [Recovery Services vault](azure-to-azure-walkthrough-vault.md), use this article to enable replication of virtual machines (VMs), to another Azure region, with [Azure Site Recovery](site-recovery-overview.md). To enable replication, you set up source and target settings, verify the replication policy, and select VMs you want to replicate.

- When you finish the article, your Azure VMs should have started their initial replication to the secondary Azure region.
- Post any comments at the bottom of this article, or ask questions in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr)

>[!NOTE]
>
> Azure VM replication is currently in preview.

## Select the source region and VMs

In **Recovery Services vaults**, click the vault name. In the vault, click the **+Replicate** button.




# Step 6: Set up the target region and replication policy for Azure VM replication

This article describes how to configure settings for the target location, and a replication policy, for replicating Azure virtual machines (VMs) between Azure regions, using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.

- When you finish the article, you should have your target Azure region set up, and a replication policy in place.
- If you haven't already [set up your source region](azure-to-azure-walkthrough-vault-source.md), do that before you perform the steps in this article.
- Post any comments at the bottom of this article, or ask questions in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

>[!NOTE]
>
> Azure VM replication is currently in preview.


# Step 6: Set up the target region and replication policy for Azure VM replication

This article describes how to configure settings for the target location, and a replication policy, for replicating Azure virtual machines (VMs) between Azure regions, using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.

- When you finish the article, you should have your target Azure region set up, and a replication policy in place.
- If you haven't already [set up your source region](azure-to-azure-walkthrough-vault-source.md), do that before you perform the steps in this article.
- Post any comments at the bottom of this article, or ask questions in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

>[!NOTE]
>
> Azure VM replication is currently in preview.

## Select the source settings

1. In Recovery Services vaults, click the vault name > **+Replicate**.
2. In **Source**, select **Azure - PREVIEW**.
2. In **Source location**, select the source Azure region where your VMs are currently running.
3. Select the **Azure virtual machine deployment model** for VMs: **Resource Manager** or **Classic**.
4. Select the **Source resource group** for Resource Manager VMs, or **cloud service** for classic VMs.
5. Click **OK** to save the settings.

    ![Configure the source](./media/azure-to-azure-walkthrough-enable-replication/source.png)

## Select the VMs

Site Recovery retrieves a list of the VMs associated with the subscription and resource group/cloud service.

5. In **Virtual Machines**, select the VMs you want to replicate, and then click **OK**.

    ![Select VMs](./media/azure-to-azure-walkthrough-enable-replication/vms.png)


## Select and provision target settings

Site Recovery provisions default settings for the target region (based on the source region settings), and the replication policy:

   - **Target location**: The target region you want to use for disaster recovery. We recommend that the target location matches the location of the Site Recovery vault.
   - **Target resource group**: Resource group to which Azure VMs in the target region will belong after failover. By default, Site Recovery creates a new resource group in the target region with an "asr" suffix. 
   - **Target virtual network**: The network in which Azure VMs in the target region will be located after failover. By default, Site Recovery creates a new virtual network (and subnets) in the target region with an "asr" suffix. This network is mapped to your source network. Note that you can assign a specific IP address after failover of a VM, if you need to retain the same IP address in the source and target locations. 
   - **Cache storage accounts**: Site Recovery uses a storage account in the source region. Changes on source VMs are sent to this account, before replication to the target location. 
   - **Target storage accounts**: By default, Site Recovery creates a new storage account in the target region, to mirror the source VM storage account.
   -  **Target availability sets**: By default, Site Recovery creates a new availability set in the target region, with the "asr" suffix. 
   - **Replication policy name**: Policy name.
   - **Recovery point retention**: By default Site Recovery keeps recovery points for 24 hours.
   - **App-consistent snapshot frequency**: By default Site Recovery takes an app-consistent snapshot every 60 minutes.
        
    ![Configure settings](./media/azure-to-azure-walkthrough-enable-replication/settings.png)

>[!NOTE]
>
> Ongoing replication frequency is in the order of seconds, and can't be modified. Exact numbers will be available after general availability (GA).

### Modify and provision settings

If you want to modify target and replication policy settings, do the following:

1. To view or modify target settings, click **Settings**.
2. To override the default target settings, click **Customize**. You can specify a target resource group, virtual network, availability set, and target storage account. You can only add availability sets if VMs are part of a set in the source region.

    ![Configure settings](./media/azure-to-azure-walkthrough-enable-replication/customize-target.png)

3. To override replication settings for recovery points and app-consistent snapshots, click **Customize** next to **Replication Policy**.
 
    ![Configure settings](./media/azure-to-azure-walkthrough-enable-replication/customize-policy.png)

4. To start provisioning the target resources, click **Create target resources**. Provisioning takes a minute or so. Don't close the blade during provisioning, or you'll have to start over.




## Enable replication

1. In **Settings**, click **Enable replication**. This enables initial replication of the VMs you selected. Initial replication status might take some time to refresh. Click **Refresh** to get the latest status.

2. You can track progress of the **Enable protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**.

3. In **Settings** > **Replicated Items**, you can view the status of VMs and the initial replication progress. Click the VM to drill down into its settings.



## Next steps

Go to [Step 6: Run a test failover](azure-to-azure-walkthrough-test-failover.md)
