---
title: Back up Azure Managed Disks using Azure CLI
description: Learn how to back up Azure Managed Disks using Azure CLI.
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 09/17/2021
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure Managed Disks using Azure CLI

This article describes how to back up [Azure Managed Disk](../virtual-machines/managed-disks-overview.md) using Azure CLI.

> [!IMPORTANT]
> Support for Azure Managed Disks backup and restore via CLI is in preview and available as an extension in Az 2.15.0 version and later. The extension is automatically installed when you run the **az dataprotection** commands. [Learn more](/cli/azure/azure-cli-extensions-overview) about extensions.

In this article, you'll learn how to:

- Create a Backup vault

- Create a Backup policy

- Configure Backup of an Azure Disk

- Run an on-demand backup job

For information on the Azure Disk backup region availability, supported scenarios and limitations, see the [support matrix](disk-backup-support-matrix.md).

## Create a Backup vault

Backup vault is a storage entity in Azure that stores backup data for various newer workloads that Azure Backup supports, such as Azure Database for PostgreSQL servers, blobs in a storage account, and Azure Disks. Backup vaults make it easy to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.

Before you create a Backup vault, choose the storage redundancy of the data within the vault. Then proceed to create the Backup vault with that storage redundancy and the location. In this article, we'll create a Backup vault _TestBkpVault_, in the region _westus_, under the resource group _testBkpVaultRG_. Use the [az dataprotection vault create](/cli/azure/dataprotection/backup-vault#az-dataprotection-backup-vault-create) command to create a Backup vault. Learn more about [creating a Backup vault](./create-manage-backup-vault.md#create-a-backup-vault).

```azurecli-interactive
az dataprotection backup-vault create -g testBkpVaultRG --vault-name TestBkpVault -l westus --type SystemAssigned --storage-settings datastore-type="VaultStore" type="LocallyRedundant"
```

```json
{
  "eTag": null,
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/testBkpVaultRG/providers/Microsoft.DataProtection/BackupVaults/TestBkpVault",
  "identity": {
    "principalId": "2ca1d5f7-38b3-4b61-aa45-8147d7e0edbc",
    "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "type": "SystemAssigned"
  },
  "location": "westus",
  "name": "TestBkpVault",
  "properties": {
    "provisioningState": "Succeeded",
    "storageSettings": [
      {
        "datastoreType": "VaultStore",
        "type": "LocallyRedundant"
      }
    ]
  },
  "resourceGroup": "testBkpVaultRG",
  "systemData": null,
  "tags": null,
  "type": "Microsoft.DataProtection/backupVaults"
}
```

After creation of vault, let's create a Backup policy to protect Azure disks.

## Create a Backup policy

To understand the inner components of a Backup policy for Azure Disk Backup, retrieve the policy template using the [az dataprotection backup-policy get-default-policy-template](/cli/azure/dataprotection/backup-policy#az-dataprotection-backup-policy-get-default-policy-template) command. This command returns a default policy template for a given datasource type. Use this policy template to create a new policy.

```azurecli-interactive
az dataprotection backup-policy get-default-policy-template --datasource-type AzureDisk
```

```json
{
  "datasourceTypes": [
    "Microsoft.Compute/disks"
  ],
  "name": "DiskPolicy",
  "objectType": "BackupPolicy",
  "policyRules": [
    {
      "backupParameters": {
        "backupType": "Incremental",
        "objectType": "AzureBackupParams"
      },
      "dataStore": {
        "dataStoreType": "OperationalStore",
        "objectType": "DataStoreInfoBase"
      },
      "name": "BackupHourly",
      "objectType": "AzureBackupRule",
      "trigger": {
        "objectType": "ScheduleBasedTriggerContext",
        "schedule": {
          "repeatingTimeIntervals": [
            "R/2020-04-05T13:00:00+00:00/PT4H"
          ]
        },
        "taggingCriteria": [
          {
            "isDefault": true,
            "tagInfo": {
              "id": "Default_",
              "tagName": "Default"
            },
            "taggingPriority": 99
          }
        ]
      }
    },
    {
      "isDefault": true,
      "lifecycles": [
        {
          "deleteAfter": {
            "duration": "P7D",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "OperationalStore",
            "objectType": "DataStoreInfoBase"
          }
        }
      ],
      "name": "Default",
      "objectType": "AzureRetentionRule"
    }
  ]
}
```

The policy template consists of a trigger (which decides what triggers the backup) and a lifecycle (which decides when to delete/copy/move the backup). In Azure Disk Backup, the default values for trigger are a scheduled trigger for every 4 hours (PT4H) and to retain each backup for seven days.

**Scheduled trigger:**

```json
"trigger": {
        "objectType": "ScheduleBasedTriggerContext",
        "schedule": {
          "repeatingTimeIntervals": [
            "R/2020-04-05T13:00:00+00:00/PT4H"
          ]
        }
}
```

**Default retention lifecycle:**

```json
"lifecycles": [
        {
          "deleteAfter": {
            "duration": "P7D",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "OperationalStore",
            "objectType": "DataStoreInfoBase"
          }
        }
      ]
```

Azure Disk Backup offers multiple backups per day. If you require more frequent backups, choose the **Hourly** backup frequency with the ability to take backups with intervals of every 4, 6, 8 or 12 hours. The backups are scheduled based on the **Time** interval selected.

For example, if you select **Every 4 hours**, then the backups are taken at approximately in the interval of every 4 hours so the backups are distributed equally across the day. If a once-a-day backup is sufficient, choose the **Daily** backup frequency. In the daily backup frequency, you can specify the time of the day when your backups are taken.

>[!IMPORTANT]
>The time of the day indicates the backup start time and not the time when the backup completes.

The time required for completing the backup operation depends on various factors including size of the disk, and churn rate between consecutive backups. However, Azure Disk Backup is an agentless backup that uses [incremental snapshots](../virtual-machines/disks-incremental-snapshots.md), which doesn't impact the production application performance.

   >[!NOTE]
   >Although the selected vault may have the global-redundancy setting, currently, Azure Disk Backup supports snapshot datastore only. All backups are stored in a resource group in your subscription and aren't copied to the Backup vault storage.

To know more details about policy creation, refer to the [Azure Disk Backup policy](backup-managed-disks.md#create-backup-policy) document.

Once the template is downloaded as a JSON file, you can edit it for scheduling and retention as required. Then create a new policy with the resulting JSON. If you want to edit the hourly frequency or the retention period, use the [az dataprotection backup-policy trigger set](/cli/azure/dataprotection/backup-policy/trigger#az-dataprotection-backup-policy-trigger-set) and/or [az dataprotection backup-policy retention-rule set](/cli/azure/dataprotection/backup-policy/retention-rule#az-dataprotection-backup-policy-retention-rule-set) commands. Once the policy JSON has all the required values, proceed to create a new policy from the policy object using the [az dataprotection backup-policy create](/cli/azure/dataprotection/backup-policy#az-dataprotection-backup-policy-create) command.

```azurecli-interactive
az dataprotection backup-policy get-default-policy-template --datasource-type AzureDisk > policy.json
az dataprotection backup-policy create -g testBkpVaultRG --vault-name TestBkpVault -n mypolicy --policy policy.json
```

```json
{
"id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupPolicies/mypolicy",
"name": "mypolicy",
"properties": {
"datasourceTypes": [
"Microsoft.Compute/disks"
],
"objectType": "BackupPolicy",
"policyRules": [
{
"backupParameters": {
"backupType": "Incremental",
"objectType": "AzureBackupParams"
},
"dataStore": {
"dataStoreType": "OperationalStore",
"objectType": "DataStoreInfoBase"
},
"name": "BackupHourly",
"objectType": "AzureBackupRule",
"trigger": {
"objectType": "ScheduleBasedTriggerContext",
"schedule": {
"repeatingTimeIntervals": [
"R/2020-04-05T13:00:00+00:00/PT4H"
]
},
"taggingCriteria": [
{
"criteria": null,
"isDefault": true,
"tagInfo": {
"eTag": null,
"id": "Default_",
"tagName": "Default"
},
"taggingPriority": 99
}
]
}
},
{
"isDefault": true,
"lifecycles": [
{
"deleteAfter": {
"duration": "P7D",
"objectType": "AbsoluteDeleteOption"
},
"sourceDataStore": {
"dataStoreType": "OperationalStore",
"objectType": "DataStoreInfoBase"
},
"targetDataStoreCopySettings": null
}
],
"name": "Default",
"objectType": "AzureRetentionRule"
}
]
},
"resourceGroup": "testBkpVaultRG",
"systemData": null,
"type": "Microsoft.DataProtection/backupVaults/backupPolicies"
}
```

## Configure backup

Once the vault and policy are created, there are three critical points that you need to consider to protect an Azure Disk.

### Key entities involved

#### Disk to be protected

Fetch the ARM ID and the location of the disk to be protected. This will serve as the identifier of the disk. We'll use an example of a disk named _CLITestDisk_, under a resource group _diskrg_, under a different subscription.

```azurecli-interactive
$DiskId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/diskrg/providers/Microsoft.Compute/disks/CLITestDisk"
```

#### Snapshot resource group

The disk snapshots are stored in a resource group within your subscription. As a guideline, we recommend creating a dedicated resource group as a snapshot datastore to be used by the Azure Backup service. Having a dedicated resource group allows restricting access permissions on the resource group, providing safety and ease of management of the backup data. Note the ARM ID for the resource group where you wish to place the disk snapshots

```azurecli-interactive
$snapshotrg = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourceGroups/snapshotrg"
```

#### Backup vault

The Backup vaults require permissions on the disk and the snapshot resource group to be able to trigger snapshots and manage their lifecycle. The system-assigned managed identity of the vault is used for assigning such permissions. Use the [az dataprotection backup-vault update](/cli/azure/dataprotection/backup-vault#az-dataprotection-backup-vault-update) command to enable system-assigned managed identity for the Recovery Services Vault.

```azurecli-interactive
az dataprotection backup-vault update -g testBkpVaultRG --vault-name TestBkpVault --type SystemAssigned
```

### Assign permissions

You need to assign a few permissions via RBAC to the vault (represented by vault MSI) and the relevant disk and/or the disk RG. These can be performed via Azure portal or CLI. To assign related permissions, see the [prerequisites to configure backup of managed disks](backup-managed-disks-ps.md#assign-permissions).

### Prepare the request

Once all the relevant permissions are set, the configuration of backup is performed in two steps. First, we prepare the relevant request by using the relevant vault, policy, disk, and snapshot resource group using the [az dataprotection backup-instance initialize](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-initialize) command. The initialize command will return a JSON file, and then you have to update the snapshot resource group value. Then, we submit the request to protect the disk using the [az dataprotection backup-instance create](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-create) command.

```azurecli-interactive
az dataprotection backup-instance initialize --datasource-type AzureDisk  -l southeastasia --policy-id "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupPolicies/mypolicy" --datasource-id "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/diskrg/providers/Microsoft.Compute/disks/CLITestDisk" > backup_instance.json
```

Open the JSON file and edit the **snapshot resource group ID** in the ``` resource_group_id ``` under the ```data_store_parameters_list``` section.

```json
{
  "backup_instance_name": "diskrg-CLITestDisk-3df6ac08-9496-4839-8fb5-8b78e594f166",
  "properties": {
    "data_source_info": {
      "datasource_type": "Microsoft.Compute/disks",
      "object_type": "Datasource",
      "resource_id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/diskrg/providers/Microsoft.Compute/disks/CLITestDisk",
      "resource_location": "southeastasia",
      "resource_name": "CLITestDisk",
      "resource_type": "Microsoft.Compute/disks",
      "resource_uri": ""
    },
    "data_source_set_info": null,
    "object_type": "BackupInstance",
    "policy_info": {
      "policy_id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/testBkpVaultRG/providers/Microsoft.DataProtection/BackupVaults/TestBkpVault/backupPolicies/DiskPolicy",
      "policy_parameters": {
        "data_store_parameters_list": [
          {
            "data_store_type": "OperationalStore",
            "object_type": "AzureOperationalStoreParameters",
            "resource_group_id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/snapshotrg"
          }
        ]
      }
    }
  }
}
```

> [!NOTE]
> The backup instance name is generated by clients so that this will be a unique value. It's based on datasource name and a unique GUID. Once you list the backup instances, you should be able to check the name of backup instance and the relevant datasource name.

Use the edited JSON file to create a backup instance of the Azure Managed Disk.

```azurecli-interactive
az dataprotection backup-instance create -g testBkpVaultRG --vault-name TestBkpVault --backup-instance backup_instance.json
```

```json
{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/testBkpVaultRG/providers/Microsoft.DataProtection/BackupVaults/TestBkpVault/backupInstances/diskrg-CLITestDisk-3df6ac08-9496-4839-8fb5-8b78e594f166",
  "name": "diskrg-CLITestDisk-3df6ac08-9496-4839-8fb5-8b78e594f166",
  "properties": {
    "currentProtectionState": "ProtectionConfigured",
    "dataSourceInfo": {
      "datasourceType": "Microsoft.Compute/disks",
      "objectType": "Datasource",
      "resourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/diskrg/providers/Microsoft.Compute/disks/CLITestDisk",
      "resourceLocation": "southeastasia",
      "resourceName": "CLITestDisk",
      "resourceType": "Microsoft.Compute/disks",
      "resourceUri": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/diskrg/providers/Microsoft.Compute/disks/CLITestDisk"
    },
    "dataSourceSetInfo": null,
    "friendlyName": "CLITestDisk",
    "objectType": "BackupInstance",
    "policyInfo": {
      "policyId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/testBkpVaultRG/providers/Microsoft.DataProtection/BackupVaults/TestBkpVault/backupPolicies/DiskPolicy",
      "policyParameters": {
        "dataStoreParametersList": [
          {
            "dataStoreType": "OperationalStore",
            "objectType": "AzureOperationalStoreParameters",
            "resourceGroupId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/sarath-rg"
          }
        ]
      },
      "policyVersion": null
    },
    "protectionErrorDetails": null,
    "protectionStatus": {
      "errorDetails": null,
      "status": "ProtectionConfigured"
    },
    "provisioningState": "Succeeded"
  },
  "resourceGroup": "testBkpVaultRG",
  "systemData": null,
  "type": "Microsoft.DataProtection/backupVaults/backupInstances"
}
```

Once the backup instance is created, you can proceed to trigger an on-demand backup if you don't want to wait for the policy's scheduled.

## Run an on-demand backup

List all backup instances within a vault using [az dataprotection backup-instance list](/cli/azure/dataprotection/backup-instance) command, and then fetch the relevant instance using the [az dataprotection backup-instance show](/cli/azure/dataprotection/backup-instance) command. Alternatively, for at-scale scenarios, you can list backup instances across vaults and subscriptions using the [az dataprotection backup-instance list-from-resourcegraph](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-list-from-resourcegraph) command.

```azurecli-interactive
az dataprotection backup-instance list-from-resourcegraph --datasource-type AzureDisk --datasource-id /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/diskrg/providers/Microsoft.Compute/disks/CLITestDisk
```

```json
[
  {
    "datasourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/diskrg/providers/Microsoft.Compute/disks/CLITestDisk",
    "extendedLocation": null,
    "id": "//subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/testBkpVaultRG/providers/Microsoft.DataProtection/BackupVaults/TestBkpVault/backupInstances/diskrg-CLITestDisk-3df6ac08-9496-4839-8fb5-8b78e594f166",
    "identity": null,
    "kind": "",
    "location": "",
    "managedBy": "",
    "name": "diskrg-CLITestDisk-3df6ac08-9496-4839-8fb5-8b78e594f166",
    "plan": null,
    "properties": {
      "currentProtectionState": "ProtectionConfigured",
      "dataSourceInfo": {
        "baseUri": null,
        "datasourceType": "Microsoft.Compute/disks",
        "objectType": "Datasource",
        "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/diskrg/providers/Microsoft.Compute/disks/CLITestDisk",
        "resourceLocation": "westus",
        "resourceName": "CLITestDisk",
        "resourceType": "Microsoft.Compute/disks",
        "resourceUri": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/diskrg/providers/Microsoft.Compute/disks/CLITestDisk"
      },
      "dataSourceProperties": null,
      "dataSourceSetInfo": null,
      "datasourceAuthCredentials": null,
      "friendlyName": "CLITestDisk",
      "objectType": "BackupInstance",
      "policyInfo": {
        "policyId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/testBkpVaultRG/providers/Microsoft.DataProtection/BackupVaults/TestBkpVault/backupPolicies/DiskPolicy",
        "policyParameters": {
          "dataStoreParametersList": [
            {
              "dataStoreType": "OperationalStore",
              "objectType": "AzureOperationalStoreParameters",
              "resourceGroupId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/snapshotrg"
            }
          ]
        },
        "policyVersion": null
      },
      "protectionErrorDetails": null,
      "protectionStatus": {
        "errorDetails": null,
        "status": "ProtectionConfigured"
      },
      "provisioningState": "Succeeded"
    },
    "protectionState": "ProtectionConfigured",
    "resourceGroup": "testBkpVaultRG",
    "sku": null,
    "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "tags": null,
    "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "type": "microsoft.dataprotection/backupvaults/backupinstances",
    "vaultName": "TestBkpVault",
    "zones": null
  }
]
```

You can specify a retention rule while triggering backup. To view the retention rules in policy, look through the policy JSON for retention rules. In the below example, the rule with the name _default_ is displayed and we'll use that rule for the on-demand backup.

```json
{
      "isDefault": true,
      "lifecycles": [
        {
          "deleteAfter": {
            "duration": "P7D",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "OperationalStore",
            "objectType": "DataStoreInfoBase"
          }
        }
      ],
      "name": "Default",
      "objectType": "AzureRetentionRule"
    }
```

Trigger an on-demand backup using the [az dataprotection backup-instance adhoc-backup](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-adhoc-backup) command.

```azurecli-interactive
az dataprotection backup-instance adhoc-backup --name "diskrg-CLITestDisk-3df6ac08-9496-4839-8fb5-8b78e594f166" --rule-name "Default" --resource-group "000pikumar" --vault-name "PratikPrivatePreviewVault1"
```

## Tracking jobs

Track all the jobs using the [az dataprotection job list](/cli/azure/dataprotection/job#az-dataprotection-job-list) command. You can list all jobs and fetch a particular job detail.

You can also use Az.ResourceGraph to track all jobs across all Backup vaults. Use the [az dataprotection job list-from-resourcegraph](/cli/azure/dataprotection/job#az-dataprotection-job-list-from-resourcegraph) command to get the relevant job that can be across any Backup vault.

```azurecli
az dataprotection job list-from-resourcegraph --datasource-type AzureDisk --status Completed
```

## Next steps

[Restore Azure Managed Disks using Azure CLI](restore-managed-disks-cli.md)
