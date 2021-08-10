---
title: Back up SQL always on availability groups
description: In this article, learn how to back up SQL on availability groups.
ms.topic: conceptual
ms.date: 08/11/2021
---
# Backup SQL always on availability groups

Azure Backup offers end-to-end support for SQL always on availability groups (AG) if all the nodes are in the same region and subscription as the recovery services vault. However, if the AG nodes are spread across regions or subscriptions or on-premises and Azure, there are a few considerations to keep in mind. 
Also note that backup of Basic Availability Group databases is not supported by Azure Backup.

Backup preference used by Azure Backup
SQL AG supports Full and Differential backups only from the primary replica, so these backup jobs always run on the Primary node irrespective of the backup preference. For copy-only full and transaction log backups, the AG backup preference is considered while deciding the node where backup will run.

| AG Backup preference | Full and Diff backups run on | Copy-Only and Log backups are taken from |
| -------------------- | ---------------------------- | ---------------------------------------- |
| Primary | Primary replica | Primary replica |
| Secondary only | Primary replica | Any one of the secondary replicas |
| Prefer Secondary | Primary replica | Secondary replicas are preferred, but backups can run on primary replica also. |
| None/Any | Primary replica | Any replica |

The workload backup extension gets installed on the node when it is registered with Azure Backup service. When an AG database is configured for backup, the backup schedules are pushed to all the registered nodes of the AG. The schedules fire on all the AG nodes and the workload backup extensions on these nodes synchronize between themselves to decide which node will perform the backup. The node selection depends on the backup type and the backup preference as explained in section 1. 

The selected node goes ahead with the backup job, whereas the job triggered on the other nodes bail out i.e., skip the job. Note that Azure Backup doesn’t consider backup priorities or replicas while deciding among the secondary replicas.

## Registration of AG nodes to the Recovery Services vault

A Recovery Services vault supports backup of databases only from VMs in the same region and subscription as that of the vault. This fact, combined with the backup preference handling result in the following pre-requisites need to be met for successfully configuring backups for AG databases:

1. Primary node must be registered to the vault (otherwise, full backups cannot happen)
1. If the backup preference is ‘secondary only’, then at least one secondary node must be registered to the vault (otherwise, log/copy-only full backups cannot happen)

Configuring backups for AG databases will fail with the error code FabricSvcBackupPreferenceCheckFailedUserError if the above conditions are not met.

Let’s consider the following AG deployment as reference for this article. 

:::image type="content" source="{source}" alt-text="{alt-text}":::

Taking the above sample AG deployment, here are various considerations:

1. Since the primary node is in region 1 and subscription 1, the recovery services vault (Vault 1) must be in region 1 and subscription 1 for protecting this AG.      
1. VM3 cannot be registered to Vault 1 since it is in a different subscription.
1. VM4 cannot be registered to Vault 1 since it is in a different region.
1. If the backup preference is ‘secondary only’, VM1 (Primary) and VM2 (Secondary) must be registered to the Vault 1 (because fulls require the primary node and logs require a secondary node). For all other backup preferences, VM1 (Primary) must be registered to vault 1, VM2 is optional (because all backups can run on primary node).
1. While VM3 could be registered to vault 2 in subscription 2 and the AG databases would then show up for protection in vault 2 but due to absence of the primary node in vault 2, configuring backups would fail.
1. Similarly, while VM4 could be registered to vault 4 in region 2, configuring backups would fail since the primary node is not registered in vault 4.

## Handling failover

After the AG has failed over to one of the secondary nodes, 

1. The full and diff backups will continue from the new primary node if it is registered to the vault.
1. The log and copy-only full backups will continue from primary/secondary node based on the backup preference.

Log chain breaks do not happen on failover if the failover doesn’t coincide with a backup.

Taking the above sample AG deployment, here are various failover possibilities:  

1. Failover to VM2

   1. Full and Diff backups will happen from VM2
   1. Log and Copy-Only full backups will happen from VM1 or VM2 based on backup preference

1. Failover to VM3 (another subscription)

   1. Since backups are not configured in vault 2, no backups would happen.
   1. If the backup preference is not secondary-only, backups can be configured now in this vault 2 because the primary node is registered in this vault. But this can lead to conflicts/backup failures. More about this in section 4 below.

1. Failover to VM4 (another region)

   1. Since backups are not configured in vault 4, no backups would happen.
   1. If the backup preference is not secondary-only, backups can be configured now in this vault 4 because the primary node is registered in this vault. But this can lead to conflicts/backup failures. More about this in section 4 below.





















## Next steps

Learn how to:

* [Restore backed-up SQL Server databases](restore-sql-database-azure-vm.md)
* [Manage backed-up SQL Server databases](manage-monitor-sql-database-backup.md)
