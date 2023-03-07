---
title: Set up replication policies for VMware disaster recovery with Azure Site Recovery| Microsoft Docs
description: Describes how to configure replication settings for VMware disaster recovery to Azure with Azure Site Recovery.
author: ankitaduttaMSFT
manager: gaggupta
ms.service: site-recovery
ms.topic: conceptual
ms.author: ankitadutta
ms.date: 05/27/2021

---
# Configure and manage replication policies for VMware disaster recovery

This article describes how to configure a replication policy when you're replicate VMware VMs to Azure, using [Azure Site Recovery](site-recovery-overview.md).

## Create a policy

1. Select **Manage** > **Site Recovery Infrastructure**.
2. In **For VMware and Physical machines**, select **Replication policies**.
3. Click **+Replication policy**, and specify the policy name.
4. In **RPO threshold**, specify the RPO limit. Alerts are generated when continuous replication exceeds this limit.
5. In **Recovery point retention**, specify (in days) the duration of the retention window for each recovery point. Protected machines can be recovered to any point within a retention window. Up to 15 days of retention is supported.
6. In **App-consistent snapshot frequency**, you can choose to enable app-consistent snapshot frequency and input the frequency from 0 - 12 (in hours) that will determine how frequently application-consistent snapshots should be created.
7. Click **OK**. The policy should be created in 30 to 60 seconds.

When you create a replication policy, a matching failback replication policy is automatically created, with the suffix "failback". After creating the policy, you can edit it by selecting it > **Edit Settings**.
>[!NOTE]
>High recovery point retention period in a policy may have an implication on storage cost since more recovery points may need to be saved. 


## Associate a configuration server

Associate the replication policy with your on-premises configuration server.

1. Select the replication policy.
    
    ![Replication policy listing.](./media/vmware-azure-set-up-replication/replication-policy-listing.png)
2. Click **Associate**.
    
    ![Associate configuration server.](./media/vmware-azure-set-up-replication/associate1.png)
3. Select the configuration server.

    ![Configuration server selection.](./media/vmware-azure-set-up-replication/select-config-server.png)
3. Click **OK**. The configuration server should be associated in one to two minutes.

    ![Configuration server association.](./media/vmware-azure-set-up-replication/associate2.png)

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
