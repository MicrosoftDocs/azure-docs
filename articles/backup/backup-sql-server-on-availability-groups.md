---
title: Back up SQL Server always on availability groups
description: In this article, learn how to back up SQL Server on availability groups.
ms.topic: conceptual
ms.date: 08/11/2021
---
# Backup SQL Server always on availability groups

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

:::image type="content" source="./media/backup-sql-server-on-availability-groups/ag-deployment.png" alt-text="Diagram for AG deployment as reference.":::

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

## Configuring backups for a multi-region AG

Recovery services vault doesn’t support cross-subscription or cross-region backups. This section briefly summarizes how to enable backups for AGs which are spanning subscriptions or Azure regions and the associated considerations.

1. Evaluate if you really need to enable backups from all nodes. If one region/subscription has most of the AG nodes and failover to other nodes will happen very rarely, setting up backup in that first region may be enough. If the failovers to other region/subscription happen frequently and for prolonged duration, then you may want to setup backups proactively in the other region as well.

1. Each vault where the backup gets enabled will have its own set of recovery point chains. Restores from these recovery points can be done to VMs registered in that vault only.

1. Full/Diff backups will happen successfully only in the vault that has the primary node. These backups in other vaults will keep failing.

1. Log backups will keep working in the previous vault till a log backup runs in the new vault (i.e., in the vault where the new primary node is present) and ‘breaks’ the log chain for old vault. Note that there is a hard limit of 15 days beyond which log backups will start failing.

1. Copy-only full backups will work in all the vaults.

1. Protection in each vault is treated as a distinct data source and is billed separately. 

To avoid log backup conflicts between the two vaults, it is recommended that you set the backup preference to Primary. Then, whichever vault has the primary node will also take the log backups.

Taking the above sample AG deployment, here are the steps to enable backup from all the nodes. The assumption is that backup preference is satisfied in all the steps.

### Step 1: Enable backups in region 1, subscription 1 (vault 1)

As the primary node is in region and subscription, the usual steps to enable backups will work.

### Step 2: Enable backups in region 1, subscription 2 (vault 2)

1. Failover the AG to VM3 so that the primary node is present in vault 2.
1. Configure backups for the AG databases in vault 2.
1. At this point, 
   1. The full/diff backups will fail in vault 1 since none of the registered nodes can take this backup.
   1. The log backups will succeed in vault 1 till a log backup runs in vault 2 and ‘breaks’ the log chain for vault 1.
1. Failback the AG to VM1

### Step 3: Enable backups in region 2, subscription 1 (vault 4)

Same as step 2.

## Backup an AG that spans Azure and on-premises?

Azure Backup for SQL Server can’t be run on-premises. If the primary node is in Azure and the backup preference is satisfied by the nodes in Azure, the above guidance for multi-region AG can be followed to enable backups for the replicas in Azure. 
If a failover to on-premises node happens, the full and diff backups in Azure will start failing. Log backups may continue till the log chain break happens/15 days pass. 

## Throttling for backup jobs in an AG database

Currently, the backup throttling limits apply at an individual machine level. The default limit is 20 – if more than 20 backups are triggered concurrently, first 20 will run and the others will get queued. As and when the running jobs finish, the queued ones will start running. This value can be changed to a smaller value if the concurrent backups are causing memory/IO/CPU strain on the node.
**Since the throttling is at node level, having unbalanced AG nodes can lead to backup synchronization problems**. To understand  this, consider a 2 node AG for instance. Assume that the first node has 50 standalone databases protected and both the nodes have 5 AG databases protected. Effectively, node 1 has 55 database backup jobs scheduled whereas node 2 has only 5. Also assume that all these backups are configured to run at the same time every hour. At a point, all 55 backups will trigger on node 1 and 35 of these will get queued. Some of these would be the AG database backups. But on node 2, the AG database backups would go ahead without any queuing. Since the AG database jobs are queued on one node and running on another, the backup synchronization (mentioned in section 6) won’t work properly. Node 2 might assume that node 1 is down and hence jobs from there are not coming up for synchronization. This can lead to log chain breaks or extra backups since both nodes can take backups independently.
Similar problem can happen if the number of AG databases protected are more than the throttling limit. In such case, backup for, say, DB1 can be queued on node 1 whereas it runs on node 2. 

The recommendation is to use the following backup preferences to avoid these synchronization related issues:

1. For a 2 node AG, set the Backup Preference to either Primary or Secondary Only – then only one node can do the backups, the other will always bail out. 
1. For an AG with more than 2 nodes, set the Backup Preference to Primary – then only primary node can do the backups, others will bail out.

## Billing for AG backups

Like a standalone SQL instance, one backed-up AG instance is considered as one protected instance. Total frontend size of all protected databases in an instance is charged. Consider the following deployment:

:::image type="content" source="./media/backup-sql-server-on-availability-groups/protected-instances-calculation.png" alt-text="Diagram showing the calculation of protected instances of databases.":::

The protected instances are calculated as follows:

| Protected Instance/ Billing instance | Databases considered for calculating frontend size |
| ------------------------------------ | -------------------------------------------------- |
| AG1 | DB1, DB2 |
| AG2 | DB4 |
| VM2 | DB3 |
| VM3 | DB6 |
| VM4 | DB5 |

## Moving a protected database in or out of an AG

Azure Backup considers the ‘SQL instance or AG name\Database name’ as the database unique name. 
When the standalone DB was protected, its unique name was ‘StandAloneInstanceName\DBName’. When it moves under an AG, the unique name changes to ‘AGName\DBName’. The backups for the standalone database will start failing with error code: UserErrorBackupFailedStandaloneDatabaseMovedInToAG. The database must be configured for protection from under the AG. This will be treated as a new data source with a separate recovery point chain. The older protection of standalone database can be stopped with retain data to avoid future backups from triggering and failing on it.
Similarly, when a protected AG database moves out of AG and becomes standalone database, its backups start failing with error code UserErrorBackupFailedDatabaseMovedOutOfAG. The database must be configured for protection again from under the standalone instance. This will be treated as a new data source with a separate recovery point chain. The older protection of AG database can be stopped with retain data to avoid future backups from triggering and failing on it.

## Addition/Removal of a node to an AG

When a new node gets added to an AG that is configured for backups, the workload backup extensions running on the already registered AG nodes detect the AG topology change and inform the Azure Backup service during the next scheduled database discovery job. When this new node gets registered for backups to the same recovery services vault as the other existing nodes, Azure Backup service triggers a workflow that configures this new node with the necessary metadata for performing AG backups. After this, the new node syncs the AG backup schedule information from the Azure Backup service and starts participating in the synchronized backup process.
In cases where the new node is not able to sync the backup schedules and participate in backups, triggering a re-registration on the node forces reconfiguration of the node for AG backups as well.
Like node addition, the workload extensions detect the AG topology change in this case and inform the Azure Backup service. The service starts a node ‘un-configuration’ workflow in the removed node to clear the backup schedules for AG databases and delete the AG related metadata.

## Un-register an AG node from Azure Backup

If a node is part of an AG that has one or more databases configured for backup, then Azure Backup doesn’t allow un-registration of that node. This is to prevent future backup failures in case the backup preference can’t be met without this node. To unregister the node, it needs to be removed from the AG first. Once the node ‘un-configuration’ workflow finishes cleaning up that node, it can be unregistered.

Restore a database from Azure Backup to an AG
SQL Availability Groups do not support directly restoring a database into AG. The database needs to be restored to a standalone SQL instance and then needs to be joined to an AG.

## Next steps

Learn how to:

* [Restore backed-up SQL Server databases](restore-sql-database-azure-vm.md)
* [Manage backed-up SQL Server databases](manage-monitor-sql-database-backup.md)
