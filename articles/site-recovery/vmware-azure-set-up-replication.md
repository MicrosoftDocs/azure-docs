---
title: Configure and manage replication policies for VMware replication with Azure Site Recovery| Microsoft Docs
description: Describes how to configure replication settings for VMware replication to Azure with Azure Site Recovery.
services: site-recovery
author: sujayt
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 07/06/2018
ms.author: sutalasi

---
# Configure and manage replication policies for VMware replication
This article describes how to configure a replication policy when you're replicate VMware VMs to Azure, using [Azure Site Recovery](site-recovery-overview.md).


## Create a policy

1. Select **Manage** > **Site Recovery Infrastructure**.
1. In **For VMware and Physical machines**, select **Replication policies**. 
1. Click **+Replication policy**, and specify the policy name.
1. In **RPO threshold**, specify the RPO limit. Alerts are generated when continuous replication exceeds this limit.
1. In **Recovery point retention**, specify (in hours) the duration of the retention window for each recovery point. Protected machines can be recovered to any point within a retention window. Up to 24 hours of retention is supported for machines replicated to premium storage. Up to 72 hours is supported for standard storage.
1. In **App-consistent snapshot frequency**, specify how often (in minutes) recovery points that contain application-consistent snapshots will be created.
1. Click **OK**. The policy should be created in 30 to 60 seconds.

When you create a replication policy, a matching failback replication policy is automatically created, with the suffix "failback". After creating the policy, you can edit it by selecting it > **Edit Settings**.

## Associate a configuration server 

Associate the replication policy with your on-premises configuration server.

1. Click **Associate**, and select the configuration server.

    ![Associate configuration server](./media/vmware-azure-set-up-replication/associate1.png)

1. Click **OK**. The configuration server should be associated in one to two minutes.

    ![Configuration server association](./media/vmware-azure-set-up-replication/associate2.png)


## Disassociate or delete a replication policy
1. Choose the replication policy.
    a. To dissociate the policy from the configuration server, make sure that no replicated machines are using the policy. Then, click **Dissociate**.
    b. To delete the policy, make sure it's not associated with a configuration server. Then, click **Delete**. It should take 30-60 seconds to delete.
1. Click **OK**.
