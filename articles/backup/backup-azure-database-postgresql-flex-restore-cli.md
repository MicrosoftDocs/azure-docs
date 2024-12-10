---
title: Restore Azure Database for PostgreSQL - flexible server via Azure CLI
description: Learn how to restore Azure Database for PostgreSQL - flexible server using Azure CLI.
ms.topic: how-to
ms.date: 10/01/2024
ms.service: azure-backup
ms.custom: devx-track-azurecli, ignite-2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Database for PostgreSQL - flexible servers using Azure CLI (preview)

This article explains how to restore **Azure Database for PostgreSQL - flexible server** to an Azure Database for PostgreSQL - flexible server backed-up by Azure Backup.

Here, let's use an existing Backup vault _TestBkpVault_, under the resource group _testBkpVaultRG_ in the examples.

## Restore a backed-up PostgreSQL database

### Set up permissions

Backup vault uses managed identity to access other Azure resources. To restore from backup, Backup vault’s managed identity requires a set of permissions on the storage account to which the server would be restored. The managed identity should be assigned a *Storage Blob Data Contributor* role over the storage account. 

### Fetch the relevant recovery point

To list all backup instances within a vault, use [az data protection backup-instance list](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-list) command. Then fetch the relevant instance using the [az data protection backup-instance show](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-show) command. Alternatively, for _at-scale_ scenarios, you can list backup instances across vaults and subscriptions using the [az data protection backup-instance list-from-resourcegraph](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-list-from-resourcegraph) command.

```azurecli
az dataprotection backup-instance list-from-resourcegraph --datasource-type AzureDatabaseForPostgreSQLFlexibleServer -subscriptions 00001111-aaaa-2222-bbbb-3333cccc4444

  {
    "datasourceId": "/subscriptions/00001111-aaaa-2222-bbbb-3333cccc4444/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/flexibleServers/testpgflex",
    "extendedLocation": null,
    "id": "/subscriptions/00001111-aaaa-2222-bbbb-3333cccc4444/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149",
    "identity": null,
    "kind": "",
    "location": "",
    "managedBy": "",
    "name": "testpgflex-957d23b1-c679-4c94-ade6-c4d34635e149",
    "plan": null,
    "properties": {
      "currentProtectionState": "ProtectionConfigured",
      "dataSourceInfo": {
        "baseUri": null,
        "datasourceType": "Microsoft.DBforPostgreSQL/flexibleServers",
        "objectType": "Datasource",
        "resourceID": "/subscriptions/bbbb1b1b-cc2c-dd3d-ee4e-ffffff5f5f5f/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/flexibleServers/testpgflex",
        "resourceLocation": "westus",
        "resourceName": "postgres",
        "resourceProperties": null,
        "resourceType": "Microsoft.DBforPostgreSQL/flexibleServers",
        "resourceUri": ""
      },
      "dataSourceProperties": null,
      "dataSourceSetInfo": {
        "baseUri": null,
        "datasourceType": "Microsoft.DBforPostgreSQL/flexibleServers",
        "objectType": "DatasourceSet",
        "resourceID": "/subscriptions/bbbb1b1b-cc2c-dd3d-ee4e-ffffff5f5f5f/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/flexibleServers/testpgflex",
        "resourceLocation": "westus",
        "resourceName": "testpgflex",
        "resourceProperties": null,
        "resourceType": "Microsoft.DBforPostgreSQL/flexibleServers",
        "resourceUri": ""
      },
      "friendlyName": "testpgflex",
      "objectType": "BackupInstance",
      "policyInfo": {
        "policyId": "/subscriptions/00001111-aaaa-2222-bbbb-3333cccc4444/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupPolicies/osspol3",
        "policyParameters": null,
        "policyVersion": ""
      },
      "protectionErrorDetails": null,
      "protectionStatus": {
        "errorDetails": null,
        "status": "ProtectionConfigured"
      },
      "provisioningState": "Succeeded",
      "validationType": null
    },
    "protectionState": "ProtectionConfigured",
    "resourceGroup": "testBkpVaultRG",
    "sku": null,
    "subscriptionId": bbbb1b1b-cc2c-dd3d-ee4e-ffffff5f5f5f,
    "tags": null,
    "tenantId": aaaabbbb-0000-cccc-1111-dddd2222eeee,
    "type": "microsoft.dataprotection/backupvaults/backupinstances",
    "vaultName": "testBkpVault",
    "zones": null
  }
.
.
.
.
.
```

Once the instance is identified, fetch the relevant recovery point using the [az data protection recovery-point list](/cli/azure/dataprotection/recovery-point#az-dataprotection-recovery-point-list) command.

```azurecli
az dataprotection recovery-point list --backup-instance-name testpgflex-957d23b1-c679-4c94-ade6-c4d34635e149 -g testBkpVaultRG --vault-name TestBkpVault

{
  "id": "/subscriptions/00001111-aaaa-2222-bbbb-3333cccc4444/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/testpgflex-957d23b1-c679-4c94-ade6-c4d34635e149/recoveryPoints/9da55e757af94261afa009b43cd3222a",
  "name": "9da55e757af94261afa009b43cd3222a",
  "properties": {
    "friendlyName": "2031fdb43a914114b6ce644eb6fcb5ce",
    "objectType": "AzureBackupDiscreteRecoveryPoint",
    "policyName": "oss-clitest-policy",
    "policyVersion": null,
    "recoveryPointDataStoresDetails": [
      {
        "creationTime": "2021-09-13T15:17:41.209845+00:00",
        "expiryTime": null,
        "id": "beddea84-7b30-42a5-a752-7c75baf96a52",
        "metaData": "{\"objectType\":\"PostgresBackupMetadata\",\"version\":\"1.0\",\"postgresVersion\":\"11\",\"dbName\":\"postgres\",\"serverName\":\"testpostgresql\",\"serverFQDN\":\"testpostgresql.postgres.database.azure.com\",\"usernameUsed\":\"backupadmin@testpostgresql\",\"backupToolPath\":\"postgresql-11.6-1\\\\bin\\\\pg_dump.exe\",\"backupType\":\"Full\",\"backupDumpFormat\":\"CUSTOM\",\"backupToolArgsFormat\":\"--no-acl --no-owner --serializable-deferrable --no-tablespaces --quote-all-identifiers -Fc -d postgres://{0}:{1}@{2}:5432/{3}?sslmode=verify-full&sslrootcert=E:\\\\approot\\\\Plugins\\\\Postgres\\\\..\\\\..\\\\postgres-root.crt\",\"storageUnits\":{\"1\":\"DbBackupDumpData\"},\"streamNamesInFirstStorageUnit\":[\"dbbkpdmpdatastream-1631546260050\"],\"pitId\":\"2031fdb43a914114b6ce644eb6fcb5ce\",\"bytesTransferred\":2063,\"dataSourceSize\":8442527,\"backupToolVersion\":\"11\"}",
        "rehydrationExpiryTime": null,
        "rehydrationStatus": null,
        "state": "COMMITTED",
        "type": "VaultStore",
        "visible": true
      }
    ],
    "recoveryPointId": "9da55e757af94261afa009b43cd3222a",
    "recoveryPointTime": "2021-09-13T15:17:41.209845+00:00",
    "recoveryPointType": "Full",
    "retentionTagName": "default",
    "retentionTagVersion": "637671427933449525"
  },
  "resourceGroup": "testBkpVaultRG",
  "systemData": null,
  "type": "Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints"
}
```

### Prepare the restore request

You can restore the recovery point for a PostgreSQL – Flexible server database as files only.

#### Restore as files

Fetch the Uniform Resource Identifier (URI) of the container, within the storage account [to which permissions were assigned](#set-up-permissions). For example, a container named **testcontainer restore** under a storage account **testossstorageaccount** with a different subscription.

```azurecli
$contURI = "https://testossstorageaccount.blob.core.windows.net/testcontainerrestore"
```

Use the [az data protection backup-instance restore initialize-for-data-recovery-as-files](/cli/azure/dataprotection/backup-instance/restore#az-dataprotection-backup-instance-restore-initialize-for-data-recovery-as-files) command to prepare the restore request with all relevant details.

```azurecli
az dataprotection backup-instance restore initialize-for-data-recovery-as-files --datasource-type AzureDatabaseForPostgreSQLFlexibleServer  --restore-location {location} --source-datastore VaultStore -target-blob-container-url $contURI --recovery-point-id 9da55e757af94261afa009b43cd3222a > OssRestoreAsFilesReq.JSON
```

To validate if the JSON file succeeds to create new resources, use the [az data protection backup-instance validate-for-restore](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-validate-for-restore) command.

### Trigger the restore

Use the [az data protection backup-instance restore trigger](/cli/azure/dataprotection/backup-instance/restore#az-dataprotection-backup-instance-restore-trigger) command to trigger the restore operation with the previously prepared request.

```azurecli-interactive
az dataprotection backup-instance restore trigger -g testBkpVaultRG --vault-name TestBkpVault --backup-instance-name testpgflex-957d23b1-c679-4c94-ade6-c4d34635e149 --restore-request-object OssRestoreReq.JSON
```

## Tracking job

Track all jobs using the [az data protection job list](/cli/azure/dataprotection/job#az-dataprotection-job-list) command. You can list all jobs and fetch a particular job detail.

You can also use _Az.ResourceGraph_ to track jobs across all Backup vaults. Use the [az data protection job list-from-resourcegraph](/cli/azure/dataprotection/job#az-dataprotection-job-list-from-resourcegraph) command to get the relevant job that is across all Backup vaults.

```azurecli
az dataprotection job list-from-resourcegraph --datasource-type AzureDatabaseForPostgreSQLFlexibleServer --operation Restore
```

### Create PostgreSQL - flexible server from restored storage account

Post restoration completion to the target storage account, you can use **pg_restore** utility to restore an Azure Database for PostgreSQL – Flexible server database from the target. Use the following command to connect to an existing PostgreSQL – Flexible server and an existing database.

```azurecli
pg_restore -h <hostname> -U <username> -d <db name> -Fd -j <NUM> -C <dump directory>
```

-Fd: The directory format.
-j: The number of jobs.
-C: Begin the output with a command to create the database itself and then reconnect to it.

Here's an example of how this syntax might appear:

```azurecli
pg_restore -h <hostname> -U <username> -j <Num of parallel jobs> -Fd -C -d <databasename> sampledb_dir_format
```

If you have more than one database to restore, rerun the earlier command for each database.

Also, by using multiple concurrent jobs -j, you can reduce the time it takes to restore a large database on a multi-vCore target server. The number of jobs can be equal to or less than the number of vCPUs that are allocated for the target server.

## Next steps

- [Overview of Azure PostgreSQL - flexible server Backup](backup-azure-database-postgresql-flex-overview.md)
