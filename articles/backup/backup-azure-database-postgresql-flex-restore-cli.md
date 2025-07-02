---
title: Restore Azure Database for PostgreSQL - Flexible Server using Azure CLI
description: Learn how to restore Azure Database for PostgreSQL - Flexible Server using Azure CLI.
ms.topic: how-to
ms.date: 02/18/2025
ms.service: azure-backup
ms.custom: devx-track-azurecli, ignite-2024
author: jyothisuri
ms.author: jsuri
# Customer intent: As a database administrator, I want to restore an Azure Database for PostgreSQL - Flexible Server using Azure CLI, so that I can recover data from backups to a specified storage account safely and efficiently.
---

# Restore Azure Database for PostgreSQL - Flexible Servers using Azure CLI

This article describes how to restore Azure Database for PostgreSQL - Flexible Server using Azure CLI.

>[!Note]
>The Original Location Recovery (OLR) option isn't supported for PaaS databases. Instead, use the Alternate-Location Recovery (ALR) to restore from a recovery point and create a new database in the same or another Azure PostgreSQL – Flexible Server, keeping both the source and restored databases.

Let's use an existing Backup vault `TestBkpVault`, under the resource group `testBkpVaultRG` in the examples.

## Prerequisites

Before you restore from Azure Database for PostgreSQL – Flexible Server backups, review the following prerequisites:
 
- Ensure that you have the [required permissions for the restore operation](backup-azure-database-postgresql-flex-overview.md#azure-backup-authentication-with-the-postgresql-server).
- Ensure that the target storage account for the restore has the `AllowCrossTenantReplication` property set to `true`.

>[!Note]
> Backup data is stored in the Backup vault as a blob within the Microsoft tenant. During a restore operation, the backup data is copied from one storage account to another across tenants. 

 ## Set up permissions for restore

Backup vault uses managed identity to access other Azure resources. To restore from backup, Backup vault’s managed identity requires a set of permissions on the Azure PostgreSQL – Flexible Server to which the database should be restored.

To assign the relevant permissions for vault's system-assigned managed identity on the target PostgreSQL – Flexible server, check the [set of permissions](backup-azure-database-postgresql-flex-overview.md#azure-backup-authentication-with-the-postgresql-server) needed to backup Azure PostgreSQL – Flexible Server database.

To restore the recovery point as files to a storage account, the **Backup vault's system-assigned managed identity** needs access on the **target storage account**.

## Fetch the relevant recovery point

To list all backup instances within a vault, use the [`az dataprotection backup-instance list`](/cli/azure/dataprotection/backup-instance?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-instance-list) command. Then fetch the relevant instance using the [`az dataprotection backup-instance show`](/cli/azure/dataprotection/backup-instance?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-instance-show) command. Alternatively, for at-scale scenarios, you can list backup instances across vaults and subscriptions by using the [`az dataprotection backup-instance list-from-resourcegraph`](/cli/azure/dataprotection/backup-instance?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-instance-list-from-resourcegraph) command.

```azurecli
az dataprotection backup-instance list-from-resourcegraph --datasource-type AzureDatabaseForPostgreSQLFlexibleServer -subscriptions "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e"

{
    "datasourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/flexibleServers/testpostgresql/databases/empdb11",
    "extendedLocation": null,
    "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149",
    "identity": null,
    "kind": "",
    "location": "",
    "managedBy": "",
    "name": "testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149",
    "plan": null,
    "properties": {
      "currentProtectionState": "ProtectionConfigured",
      "dataSourceInfo": {
        "baseUri": null,
        "datasourceType": "Microsoft.DBforPostgreSQL/flexibleServers/databases",
        "objectType": "Datasource",
        "resourceID": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/flexibleServers/testpostgresql/databases/empdb11",
        "resourceLocation": "westus",
        "resourceName": "postgres",
        "resourceProperties": null,
        "resourceType": "Microsoft.DBforPostgreSQL/flexibleServers/databases",
        "resourceUri": ""
      },
      "dataSourceProperties": null,
      "dataSourceSetInfo": {
        "baseUri": null,
        "datasourceType": "Microsoft.DBforPostgreSQL/flexibleServers/databases",
        "objectType": "DatasourceSet",
        "resourceID": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/flexibleServers/testpostgresql",
        "resourceLocation": "westus",
        "resourceName": "testpostgresql",
        "resourceProperties": null,
        "resourceType": "Microsoft.DBforPostgreSQL/flexibleServers",
        "resourceUri": ""
      },
      "datasourceAuthCredentials": {
        "objectType": "SecretStoreBasedAuthCredentials",
        "secretStoreResource": {
          "secretStoreType": "AzureKeyVault",
          "uri": "https://vikottur-test.vault.azure.net/secrets/dbauth3",
          "value": null
        }
      },
      "friendlyName": "testpostgresql\\empdb11",
      "objectType": "BackupInstance",
      "policyInfo": {
        "policyId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupPolicies/osspol3",
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
    "subscriptionId": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
    "tags": null,
    "tenantId": "aaaabbbb-0000-cccc-1111-dddd2222eeee",
    "type": "microsoft.dataprotection/backupvaults/backupinstances",
    "vaultName": "testBkpVault",
    "zones": null
  }
.
.

```

Once the instance is identified, fetch the relevant recovery point by using the [`az dataprotection recovery-point list`](/cli/azure/dataprotection/recovery-point?view=azure-cli-latest&preserve-view=true#az-dataprotection-recovery-point-list) command.

```azurecli
az dataprotection recovery-point list --backup-instance-name testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149 -g testBkpVaultRG --vault-name TestBkpVault

{
  "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149/recoveryPoints/9da55e757af94261afa009b43cd3222a",
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

## Prepare the restore request

You can restore the recovery point for a PostgreSQL – Flexible server database as files only.

#### Restore as files

Fetch the **Uniform Resource Identifier (URI)** of the container, within the storage account to which permissions were assigned. For example, a container named `testcontainerrestore` under a storage account `testossstorageaccount` with a different subscription.

```azurecli
$contURI = "https://testossstorageaccount.blob.core.windows.net/testcontainerrestore"
```

Use the [`az dataprotection backup-instance restore initialize-for-data-recovery-as-files`](/cli/azure/dataprotection/backup-instance/restore?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-instance-restore-initialize-for-data-recovery-as-files) command to prepare the restore request with all relevant details.

```azurecli
az dataprotection backup-instance restore initialize-for-data-recovery-as-files --datasource-type AzureDatabaseForPostgreSQLFlexibleServer  --restore-location {location} --source-datastore VaultStore -target-blob-container-url $contURI --target-file-name "empdb11_postgresql-westus_1628853549768" --recovery-point-id 9da55e757af94261afa009b43cd3222a > OssRestoreAsFilesReq.JSON

```

>[!Note]
>After the restore to the target storage account is complete , you can use the `pg_restore` utility to restore an Azure Database for PostgreSQL – Flexible server database from the target. 

To connect to an existing PostgreSQL – Flexible Server and an existing database, use the following command: 

```azurecli-interactive
pg_restore -h <hostname> -U <username> -d <db name> -Fd -j <NUM> -C <dump directory>
```

In this script:

- `Fd`: The directory format.
- `-j`: The number of jobs.
- `-C`: Starts the output with a command to create the database itself and then reconnect to it.

The following example shows how the syntax might appear:

```azurecli-interactive
pg_restore -h <hostname> -U <username> -j <Num of parallel jobs> -Fd -C -d <databasename> sampledb_dir_format

```

If you have more than one database to restore, rerun the earlier command for each database. Also, by using multiple concurrent jobs `-j`, you can reduce the restore time for a large database on a **multi-vCore target server**. The number of jobs can be equal to or less than the number of `vCPUs` allocated for the target server.

## Trigger the restore

To trigger the restore operation with the prepared request, use the [`az dataprotection backup-instance restore trigger`](/cli/azure/dataprotection/backup-instance/restore?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-instance-restore-trigger) command.

```azurecli-interactive
az dataprotection backup-instance restore trigger -g testBkpVaultRG --vault-name TestBkpVault --backup-instance-name testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149 --restore-request-object OssRestoreReq.JSON

```

## Track jobs

Track all jobs using the [`az dataprotection job list`](/cli/azure/dataprotection/job?view=azure-cli-latest&preserve-view=true#az-dataprotection-job-list) command. You can list all jobs and fetch a particular job detail.

You can also use `Az.ResourceGraph` to track jobs across all Backup vaults. Use the [`az dataprotection job list-from-resourcegraph`](/cli/azure/dataprotection/job?view=azure-cli-latest&preserve-view=true#az-dataprotection-job-list-from-resourcegraph) command to get the relevant job that is across all Backup vaults.

```azurecli
az dataprotection job list-from-resourcegraph --datasource-type AzureDatabaseForPostgreSQLFlexibleServer --operation Restore

```

## Next steps

[Troubleshoot common errors for backup and restore operations for Azure Database for PostgreSQL - Flexible Server](backup-azure-database-postgresql-flex-troubleshoot.md).