---
title: Set up replication policies for VMware disaster recovery with Azure Site Recovery| Microsoft Docs
ms.reviewer: v-gajeronika
description: Describes how to configure replication settings for VMware disaster recovery to Azure with Azure Site Recovery.
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: how-to
ms.author: v-gajeronika
ms.date: 09/11/2026

# Customer intent: As a system administrator managing VMware environments, I want to set up and modify replication policies for disaster recovery to Azure, so that I can ensure efficient data protection and recovery for my virtual machines.
---

# Configure and manage replication policies for VMware disaster recovery

This article describes how to configure a replication policy when you're replicate VMware VMs to Azure, using [Azure Site Recovery](site-recovery-overview.md).

## Create a policy

1. Select **Manage** > **Site Recovery Infrastructure**.
2. In **For VMware and Physical machines**, select **Replication policies**.
3. Click **+Replication policy**, and specify the policy name.
4. In **RPO threshold**, specify the RPO limit. Alerts are generated when continuous replication exceeds this limit.
5. In **Recovery point retention**, specify (in days) the duration of the retention window for each recovery point. Protected machines can be recovered to any point within a retention window. Up to 15 days of retention is supported.
6. In **App-consistent snapshot frequency**, enable app-consistent snapshots and enter a frequency from 0 through 12 hours. A nonzero frequency must be at least 60 minutes.
7. Click **OK**. The policy should be created in 30 to 60 seconds.

When you create a replication policy, a matching failback replication policy is automatically created, with the suffix "failback". After creating the policy, you can edit it by selecting it > **Edit Settings**.
>[!NOTE]
>High recovery point retention period in a policy may have an implication on storage cost since more recovery points may need to be saved. 

The minimum crash-consistent recovery-point interval depends on the protection architecture:

| Protection architecture | Minimum crash-consistent interval |
| --- | --- |
| Modernized protection | 5 minutes |
| Storage-based mapping | 15 minutes |

For both architectures, a nonzero app-consistent frequency must be at least 60 minutes.

## Associate a configuration server

Associate the replication policy with your on-premises configuration server.

1. Select the replication policy.
    
    :::image type="content" source="./media/vmware-azure-set-up-replication/replication-policy-listing.png" alt-text="Screenshot of the replication policy list.":::

2. Click **Associate**.
    
    :::image type="content" source="./media/vmware-azure-set-up-replication/associate1.png" alt-text="Screenshot of the option to associate a configuration server.":::

3. Select the configuration server.

    :::image type="content" source="./media/vmware-azure-set-up-replication/select-config-server.png" alt-text="Screenshot that shows configuration server selection.":::

3. Click **OK**. The configuration server should be associated in one to two minutes.

    :::image type="content" source="./media/vmware-azure-set-up-replication/associate2.png" alt-text="Screenshot showing Configuration server association option.":::

## Edit a policy

You can modify a replication policy after creating it.

- Changes in the policy are applied to all machines using the policy.
- If you want to associate replicated machines with a different replication policy, you need to disable and reenable protection for the relevant machines.

Edit a policy as follows:
1. Select **Manage** > **Site Recovery Infrastructure** > **Replication Policies**.
2. Select the replication policy you wish to modify.
3. Click **Edit settings**, and update the RPO threshold/recovery point retention hours/app-consistent snapshot frequency fields as required.
4. If you wish to turn off generation of application consistency points, choose "Off" value in the dropdown of the field **App-consistent snapshot frequency**.
5. Click **Save**. The policy should be updated in 30 to 60 seconds.

## Disassociate or delete a replication policy

1. Choose the replication policy.
    a. To dissociate the policy from the configuration server, make sure that no replicated machines are using the policy. Then, click **Dissociate**.
    b. To delete the policy, make sure it's not associated with a configuration server. Then, click **Delete**. It should take 30-60 seconds to delete.
2. Click **OK**.
