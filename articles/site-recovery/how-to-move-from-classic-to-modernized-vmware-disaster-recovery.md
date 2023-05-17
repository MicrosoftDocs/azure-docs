---
title: How to move from classic to modernized VMware disaster recovery?
description: This article describes how to move from classic to modernized VMware disaster recovery.
ms.author: ankitadutta
author: ankitaduttaMSFT
manager: jsuri
ms.service: site-recovery
ms.topic: how-to
ms.date: 01/13/2023
ms.custom: engagement-fy23
---

# How to move from classic to modernized VMware disaster recovery  

This article provides information about how you can move/migrate your VMware or Physical machine replications from [classic](./vmware-azure-architecture.md) to [modernized](./vmware-azure-architecture-modernized.md) protection architecture. With this capability to migrate, you can successfully transfer your replicated items from a configuration server to an Azure Site Recovery replication appliance. This migration is guided by a smart replication mechanism which ensures that the complete initial replication is not performed again for non-critical replicated items, and only the differential data is transferred. 

> [!Note]
> - Recovery plans will not be migrated and will need to be created again in the modernized Recovery Services vault.   

## Prerequisites  

- [Prepare the required infrastructure](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-the-infrastructure).
- [Prepare the classic Recovery Services vault](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-classic-recovery-services-vault).
- [Prepare the modernized Recovery Services vault](move-from-classic-to-modernized-vmware-disaster-recovery.md#prepare-modernized-recovery-services-vault).

## Move replicated items  

Follow these steps to move the replicated items from classic architecture to modernized architecture: 

1. Navigate to the classic Recovery Services vault and open **Replicated items**.

   :::image type="Replicated items" source="media/migrate-tool/replicated-items-inline.png" alt-text="Screenshot showing replicated items." lightbox="media/migrate-tool/replicated-items-expanded.png":::

2. Select **Upgrade to modernized VMware replication**. The **Pre-requisites** details are displayed. Ensure you read through the prerequisites and then select **Next** to proceed to configure the migration settings.

    :::image type="Pre-requisites" source="media/migrate-tool/prerequisites-inline.png" alt-text="Screenshot showing prerequisites." lightbox="media/migrate-tool/prerequisites-expanded.png":::

3. Select the modernized vault you plan to move to, machines from the current vault which will be moved to the modernized vault and an appliance for each of them.

   :::image type="Migration settings" source="media/migrate-tool/migration-settings-inline.png" alt-text="Screenshot showing migration settings." lightbox="media/migrate-tool/migration-settings-expanded.png":::

4. Select **Next** to review and make sure to check **Maximum migration time**.

5. Select **I understand the risk. Proceed to move selected replicated item(s)** check box.  

   :::image type="review" source="media/migrate-tool/review-inline.png" alt-text="Screenshot showing review." lightbox="media/migrate-tool/review-expanded.png":::
  
6. Select **Migrate**.

7. You can monitor the migration jobs in the **Site Recovery jobs** section of the vault.  

## Allowed actions during migration and post migration  

### During the migration of machines   

During the migration of a replicated item, continuous replication may get broken for some time. Replication continues as soon as the migration is complete. During migration, you will be allowed to do **Failover** operation. The last available recovery point will be present for selection and can be chosen for replication.   

While the migration is in progress, you can only perform **Failover** operation. Once the migration is complete, data will start replicating using the modernized architecture and the new vault. All the operations will be available for you to perform from the new vault.   

> [!Note]
> If the migration fails, then we will automatically rollback the changes and ensure the replication starts again from the classic vault.   

### Post migration operations from Classic vault  

**Failover** and **Disable replication** operations will continue to be available from the classic vault even after migration is performed successfully. The classic vault will continue to exist till the retention period of last available recovery point has expired. Once the retention period is up, the vault will be cleaned up automatically. During this time, recovery points from both the vaults can be used for failover. It will depend on your failover needs to select a proper recovery point.  

Till deletion of classic vault, you will continue to get charged for the retention points. Once the deletion has been done, no charges will be associated to the classic vault.  

After migration, if the failover is performed using the classic vault, then the replicated items present in the modernized vault will be automatically cleaned up. Once done, all the further operations, such as commit, re-protect, failback, will only be possible via the classic vault.   

## Next steps

[move from classic to modernized VMware disaster recovery](move-from-classic-to-modernized-vmware-disaster-recovery.md)