---
title: How to move from classic to modernized VMware disaster recovery?
description: This article describes how to move from classic to modernized VMware disaster recovery.
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: how-to
ms.date: 05/23/2024
ms.custom: engagement-fy23
---

# How to move from classic to modernized VMware disaster recovery  

This article provides information about how you can move/migrate your VMware or Physical machine replications from [classic](./vmware-azure-architecture.md) to [modernized](./vmware-azure-architecture-modernized.md) protection architecture. With this capability to migrate, you can successfully transfer your replicated items from a configuration server to an Azure Site Recovery replication appliance. This migration is guided by a smart replication mechanism, which ensures that the complete initial replication is not performed again for noncritical replicated items, and only the differential data is transferred. 

> [!NOTE]
> - Recovery plans is not migrated and must be created again in the modernized Recovery Services vault.   

## Prerequisites  

- [Prepare the required infrastructure](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-the-infrastructure).
- [Prepare the classic Recovery Services vault](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-classic-recovery-services-vault).
- [Prepare the modernized Recovery Services vault](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-modernized-recovery-services-vault).

## Move replicated items  

Follow these steps to move the replicated items from classic architecture to modernized architecture: 

1. Navigate to the classic Recovery Services vault and open **Replicated items**.

   :::image type="Replicated items" source="media/migrate-tool/replicated-items-inline.png" alt-text="Screenshot showing replicated items." lightbox="media/migrate-tool/replicated-items-expanded.png":::

2. Select **Upgrade to modernized VMware replication**. The **Pre-requisites** details are displayed. Ensure you read through the prerequisites and then select **Next** to proceed to configure the migration settings.

    :::image type="Prerequisites" source="media/migrate-tool/prerequisites-inline.png" alt-text="Screenshot showing prerequisites." lightbox="media/migrate-tool/prerequisites-expanded.png":::

3. Select the modernized vault you plan to move to, machines from the current vault, which is moved to the modernized vault and an appliance for each of them.

   :::image type="Migration settings" source="media/migrate-tool/migration-settings-inline.png" alt-text="Screenshot showing migration settings." lightbox="media/migrate-tool/migration-settings-expanded.png":::

4. Select **Next** to review and make sure to check **Maximum migration time**.

5. Select **I understand the risk. Proceed to move selected replicated item(s)** check box.  

   :::image type="review" source="media/migrate-tool/review-inline.png" alt-text="Screenshot showing review." lightbox="media/migrate-tool/review-expanded.png":::
  
6. Select **Migrate**.

7. You can monitor the migration jobs in the **Site Recovery jobs** section of the vault.  

## Allowed actions during migration and post migration  

### During the migration of machines   

During the migration of a replicated item, continuous replication may get broken for some time. Replication continues as soon as the migration is complete. During migration, you are allowed to do **Failover** operation. The last available recovery point is present for selection and can be chosen for replication.   

While the migration is in progress, you can only perform **Failover** operation. Once the migration is complete, data starts replicating using the modernized architecture and the new vault. All the operations are available for you to perform from the new vault.   

> [!NOTE]
> If the migration fails, Site Recovery automatically rolls back the changes and ensures the replication starts again from the classic vault.   

### Post migration operations from Classic vault  

**Failover** and **Disable replication** operations continue to be available from the classic vault even after migration is performed successfully. The classic vault continues to exist until the retention period of last available recovery point has expired. Once the retention period is up, the vault is cleaned up automatically. During this time, recovery points from both the vaults can be used for failover. It depends on your failover needs to select a proper recovery point.  

You can continue to get charged for the retention points until the deletion of classic vault, . Once the deletion is done, no charge is associated to the classic vault.  

After migration, if the failover is performed using the classic vault, then the replicated items present in the modernized vault is automatically cleaned up. Once done, all the further operations, such as commit, reprotect, failback, is only possible via the classic vault.   

## Next steps

-  Learn to [move from classic to modernized VMware disaster recovery](move-from-classic-to-modernized-vmware-disaster-recovery.md).