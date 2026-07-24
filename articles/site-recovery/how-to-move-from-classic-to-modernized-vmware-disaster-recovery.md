---
title: How to move from classic to modernized VMware disaster recovery?
description: This article describes how to move from classic to modernized VMware disaster recovery.
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: how-to
ms.date: 02/13/2026
ms.custom: engagement-fy23
# Customer intent: "As a VMware administrator, I want to migrate replicated items from classic to modernized disaster recovery architecture, so that I can benefit from enhanced protection and efficiency without redoing the entire replication process."
---

# How to move from classic to modernized VMware disaster recovery  

This article explains how to move or migrate your VMware or physical machine replications from [classic](./vmware-azure-architecture.md) to [modernized](./vmware-azure-architecture-modernized.md) protection architecture. By using this migration capability, you can transfer your replicated items from a configuration server to an Azure Site Recovery replication appliance. A smart replication mechanism guides this migration. It ensures that the complete initial replication isn't performed again for noncritical replicated items, and only the differential data is transferred. 

> [!NOTE]
> - Recovery plans aren't migrated and must be created again in the modernized Recovery Services vault.   

## Prerequisites  

- [Prepare the required infrastructure](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-the-infrastructure).
- [Prepare the classic Recovery Services vault](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-classic-recovery-services-vault).
- [Prepare the modernized Recovery Services vault](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-modernized-recovery-services-vault).

## Move replicated items  

Follow these steps to move the replicated items from classic architecture to modernized architecture: 

1. Go to the classic Recovery Services vault and open **Replicated items**.

   :::image type="Replicated items" source="media/migrate-tool/replicated-items-inline.png" alt-text="Screenshot showing replicated items." lightbox="media/migrate-tool/replicated-items-expanded.png":::

1. Select **Upgrade to modernized VMware replication**. The portal displays the **Pre-requisites** details. Make sure you read through the prerequisites and then select **Next** to proceed to configure the migration settings.

    :::image type="Prerequisites" source="media/migrate-tool/prerequisites-inline.png" alt-text="Screenshot showing prerequisites." lightbox="media/migrate-tool/prerequisites-expanded.png":::

1. Select the modernized vault you plan to move to, machines from the current vault, which is moved to the modernized vault, and an appliance for each of them.

   :::image type="Migration settings" source="media/migrate-tool/migration-settings-inline.png" alt-text="Screenshot showing migration settings." lightbox="media/migrate-tool/migration-settings-expanded.png":::

1. Select **Next** to review and make sure to check **Maximum migration time**.

1. Select **I understand the risk. Proceed to move selected replicated item(s)** check box.  

   :::image type="review" source="media/migrate-tool/review-inline.png" alt-text="Screenshot showing review." lightbox="media/migrate-tool/review-expanded.png":::
  
1. Select **Migrate**.

1. You can monitor the migration jobs in the **Site Recovery jobs** section of the vault.  

## Allowed actions during migration and post migration  

### During the migration of machines   

During the migration of a replicated item, continuous replication might stop temporarily. Replication resumes as soon as the migration finishes. During migration, you can initiate the **Failover** operation. You can select the last available recovery point for replication.   

While the migration is in progress, you can only perform the **Failover** operation. After the migration finishes, data starts replicating by using the modernized architecture and the new vault. You can perform all operations from the new vault.   

> [!NOTE]
> If the migration fails, Site Recovery automatically rolls back the changes and ensures replication starts again from the classic vault.   

### Post migration operations from classic vault  

**Failover** and **Disable replication** operations continue to be available from the classic vault even after migration is performed successfully. The classic vault continues to exist until the retention period of last available recovery point has expired. Once the retention period is up, the vault is cleaned up automatically. During this time, recovery points from both the vaults can be used for failover. It depends on your failover needs to select a proper recovery point.    

You can continue to get charged for the retention points until the deletion of classic vault, . Once the deletion is done, no charge is associated to the classic vault.  

After migration, if you perform failover by using the classic vault, the replicated items in the modernized vault are automatically cleaned up. After this cleanup, you can perform all further operations, such as commit, reprotect, and failback, only through the classic vault.   

## Next steps

-  Learn how to [move from classic to modernized VMware disaster recovery](move-from-classic-to-modernized-vmware-disaster-recovery.md).