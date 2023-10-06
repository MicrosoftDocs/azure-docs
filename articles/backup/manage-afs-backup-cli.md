---
title: Manage Azure file share backups with the Azure CLI
description: Learn how to use the Azure CLI to manage and monitor Azure file shares backed up by Azure Backup.
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 02/09/2022
author: AbhishekMallick-MS
ms.author: v-abhmallick

---

# Manage Azure file share backups with the Azure CLI

The Azure CLI provides a command-line experience for managing Azure resources. It's a great tool for building custom automation to use Azure resources. This article explains how to perform tasks for managing and monitoring the Azure file shares that are backed up by [Azure Backup](./backup-overview.md). You can also perform these steps with the [Azure portal](https://portal.azure.com/).

## Prerequisites

This article assumes you already have an Azure file share backed up by [Azure Backup](./backup-overview.md). If you don't have one, see [Back up Azure file shares with the CLI](backup-afs-cli.md) to configure backup for your file shares. For this article, you use the following resources:
   -  **Resource group**: *azurefiles*
   -  **RecoveryServicesVault**: *azurefilesvault*
   -  **Storage Account**: *afsaccount*
   -  **File Share**: *azurefiles*
  
  [!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
   - This tutorial requires version 2.0.18 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Monitor jobs

When you trigger backup or restore operations, the backup service creates a job for tracking. To monitor completed or currently running jobs, use the [az backup job list](/cli/azure/backup/job#az-backup-job-list) cmdlet. With the CLI, you also can [suspend a currently running job](/cli/azure/backup/job#az-backup-job-stop) or [wait until a job finishes](/cli/azure/backup/job#az-backup-job-wait).

The following example displays the status of backup jobs for the *azurefilesvault* Recovery Services vault:

```azurecli-interactive
az backup job list --resource-group azurefiles --vault-name azurefilesvault
```

```output
[
  {
    "eTag": null,
    "id": "/Subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/azurefiles/providers/Microsoft.RecoveryServices/vaults/azurefilesvault/backupJobs/d477dfb6-b292-4f24-bb43-6b14e9d06ab5",
    "location": null,
    "name": "d477dfb6-b292-4f24-bb43-6b14e9d06ab5",
    "properties": {
      "actionsInfo": null,
      "activityId": "3cef43ed-0af4-43e2-b9cb-1322c496ccb4",
      "backupManagementType": "AzureStorage",
      "duration": "0:00:29.718011",
      "endTime": "2020-01-13T08:05:29.180606+00:00",
      "entityFriendlyName": "azurefiles",
      "errorDetails": null,
      "extendedInfo": null,
      "jobType": "AzureStorageJob",
      "operation": "Backup",
      "startTime": "2020-01-13T08:04:59.462595+00:00",
      "status": "Completed",
      "storageAccountName": "afsaccount",
      "storageAccountVersion": "MicrosoftStorage"
    },
    "resourceGroup": "azurefiles",
    "tags": null,
    "type": "Microsoft.RecoveryServices/vaults/backupJobs"
  },
  {
    "eTag": null,
    "id": "/Subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/azurefiles/providers/Microsoft.RecoveryServices/vaults/azurefilesvault/backupJobs/1b9399bf-c23c-4caa-933a-5fc2bf884519",
    "location": null,
    "name": "1b9399bf-c23c-4caa-933a-5fc2bf884519",
    "properties": {
      "actionsInfo": null,
      "activityId": "2663449c-94f1-4735-aaf9-5bb991e7e00c",
      "backupManagementType": "AzureStorage",
      "duration": "0:00:28.145216",
      "endTime": "2020-01-13T08:05:27.519826+00:00",
      "entityFriendlyName": "azurefilesresource",
      "errorDetails": null,
      "extendedInfo": null,
      "jobType": "AzureStorageJob",
      "operation": "Backup",
      "startTime": "2020-01-13T08:04:59.374610+00:00",
      "status": "Completed",
      "storageAccountName": "afsaccount",
      "storageAccountVersion": "MicrosoftStorage"
    },
    "resourceGroup": "azurefiles",
    "tags": null,
    "type": "Microsoft.RecoveryServices/vaults/backupJobs"
  }
]
```
## Create policy

You can create a backup policy by executing the [az backup policy create](/cli/azure/backup/policy#az-backup-policy-create) command with the following parameters:

- --backup-management-type – Azure Storage
- --workload-type - AzureFileShare
- --name – Name of the policy
- --policy - JSON file with appropriate details for schedule and retention
- --resource-group - Resource group of the vault
- --vault-name – Name of the vault

**Example**

```azurecli-interactive
az backup policy create --resource-group azurefiles --vault-name azurefilesvault --name schedule20 --backup-management-type AzureStorage --policy samplepolicy.json --workload-type AzureFileShare

```

**Sample JSON (samplepolicy.json)**

```json
{
  "eTag": null,
  "id": "/Subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/azurefiles/providers/Microsoft.RecoveryServices/vaults/azurefilesvault/backupPolicies/schedule20",
  "location": null,
  "name": "schedule20",
  "properties": {
    "backupManagementType": "AzureStorage",
    "protectedItemsCount": 0,
    "retentionPolicy": {
      "dailySchedule": {
        "retentionDuration": {
          "count": 30,
          "durationType": "Days"
        },
        "retentionTimes": [
          "2020-01-05T08:00:00+00:00"
        ]
      },
      "monthlySchedule": null,
      "retentionPolicyType": "LongTermRetentionPolicy",
      "weeklySchedule": null,
      "yearlySchedule": null
    },
    "schedulePolicy": {
      "schedulePolicyType": "SimpleSchedulePolicy",
      "scheduleRunDays": null,
      "scheduleRunFrequency": "Daily",
      "scheduleRunTimes": [
        "2020-01-05T08:00:00+00:00"
      ],
      "scheduleWeeklyFrequency": 0
    },
    "timeZone": "UTC",
    "workLoadType": “AzureFileShare”
  },
  "resourceGroup": "azurefiles",
  "tags": null,
  "type": "Microsoft.RecoveryServices/vaults/backupPolicies"
}
```

**Example to create a backup policy that configures multiple backups a day**

This sample JSON is for the following requirements:

- **Schedule**: Back up *every 4 hours* starting from *8 AM (UTC)* for the *next 12 hours*.
- **Retention**: Daily - *5 days*, Weekly - *Every Sunday for 12 weeks*, Monthly - *First Sunday of every month for 60 months*, and Yearly - *First Sunday of January for 10 years*.

```json
{
    "properties":{
        "backupManagementType": "AzureStorage",
        "workloadType": "AzureFileShare",
        "schedulePolicy": {
            "schedulePolicyType": "SimpleSchedulePolicy",
            "scheduleRunFrequency": "Hourly",
            "hourlySchedule": {
                "interval": 4,
                "scheduleWindowStartTime": "2021-09-29T08:00:00.000Z",
                "scheduleWindowDuration": 12
            }
        },
        "timeZone": "UTC",
        "retentionPolicy": {
            "retentionPolicyType": "LongTermRetentionPolicy",
            "dailySchedule": {
                "retentionTimes": null,
                "retentionDuration": {
                    "count": 5,
                    "durationType": "Days"
                }
            },
            "weeklySchedule": {
                "daysOfTheWeek": [
                    "Sunday"
                ],
                "retentionTimes": null,
                "retentionDuration": {
                    "count": 12,
                    "durationType": "Weeks"
                }
            },
            "monthlySchedule": {
                "retentionScheduleFormatType": "Weekly",
                "retentionScheduleDaily": null,
                "retentionScheduleWeekly": {
                    "daysOfTheWeek": [
                        "Sunday"
                    ],
                    "weeksOfTheMonth": [
                        "First"
                    ]
                },
                "retentionTimes": null,
                "retentionDuration": {
                    "count": 60,
                    "durationType": "Months"
                }
            },
            "yearlySchedule": {
                "retentionScheduleFormatType": "Weekly",
                "monthsOfYear": [
                    "January"
                ],
                "retentionScheduleDaily": null,
                "retentionScheduleWeekly": {
                    "daysOfTheWeek": [
                        "Sunday"
                    ],
                    "weeksOfTheMonth": [
                        "First"
                    ]
                },
                "retentionTimes": null,
                "retentionDuration": {
                    "count": 10,
                    "durationType": "Years"
                }
            }
        }
    }
}

```

Once the policy is created successfully, the output of the command will display the policy JSON that you have passed as a parameter while executing the command.

You can modify the schedule and retention section of the policy as required.

**Example**

If you want to retain the backup of first Sunday of every month for two months, update the monthly schedule as below:

```json
"monthlySchedule": {
        "retentionDuration": {
          "count": 2,
          "durationType": "Months"
        },
        "retentionScheduleDaily": null,
        "retentionScheduleFormatType": "Weekly",
        "retentionScheduleWeekly": {
          "daysOfTheWeek": [
            "Sunday"
          ],
          "weeksOfTheMonth": [
            "First"
          ]
        },
        "retentionTimes": [
          "2020-01-05T08:00:00+00:00"
        ]
      }

```

## Modify policy

You can modify a backup policy to change backup frequency or retention range by using [az backup item set-policy](/cli/azure/backup/item#az-backup-item-set-policy).

To change the policy, define the following parameters:

* **--container-name**: The name of the storage account that hosts the file share. To retrieve the **name** or **friendly name** of your container, use the [az backup container list](/cli/azure/backup/container#az-backup-container-list) command.
* **--name**: The name of the file share for which you want to change the policy. To retrieve the **name** or **friendly name** of your backed-up item, use the [az backup item list](/cli/azure/backup/item#az-backup-item-list) command.
* **--policy-name**: The name of the backup policy you want to set for your file share. You can use [az backup policy list](/cli/azure/backup/policy#az-backup-policy-list) to view all the policies for your vault.

The following example sets the *schedule2* backup policy for the *azurefiles* file share present in the *afsaccount* storage account.

```azurecli-interactive
az backup item set-policy --policy-name schedule2 --name azurefiles --vault-name azurefilesvault --resource-group azurefiles --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --name "AzureFileShare;azurefiles" --backup-management-type azurestorage --out table
```

You can also run the previous command by using the friendly names for the container and the item by providing the following two additional parameters:

* **--backup-management-type**: *azurestorage*
* **--workload-type**: *azurefileshare*

```azurecli-interactive
az backup item set-policy --policy-name schedule2 --name azurefiles --vault-name azurefilesvault --resource-group azurefiles --container-name afsaccount --name azurefiles --backup-management-type azurestorage --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
fec6f004-0e35-407f-9928-10a163f123e5  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that's created by the backup service for your change policy operation. To track the status of the job, use the [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

## Stop protection on a file share

There are two ways to stop protecting Azure file shares:

* Stop all future backup jobs and *delete* all recovery points.
* Stop all future backup jobs but *leave* the recovery points.

There might be a cost associated with leaving the recovery points in storage, because the underlying snapshots created by Azure Backup will be retained. The benefit of leaving the recovery points is the option to restore the file share later, if you want. For information about the cost of leaving the recovery points, see the [pricing details](https://azure.microsoft.com/pricing/details/storage/files). If you choose to delete all recovery points, you can't restore the file share.

To stop protection for the file share, define the following parameters:

* **--container-name**: The name of the storage account that hosts the file share. To retrieve the **name** or **friendly name** of your container, use the [az backup container list](/cli/azure/backup/container#az-backup-container-list) command.
* **--item-name**: The name of the file share for which you want to stop protection. To retrieve the **name** or **friendly name** of your backed-up item, use the [az backup item list](/cli/azure/backup/item#az-backup-item-list) command.

### Stop protection and retain recovery points

To stop protection while retaining data, use the [az backup protection disable](/cli/azure/backup/protection#az-backup-protection-disable) cmdlet.

The following example stops protection for the *azurefiles* file share but retains all recovery points.

```azurecli-interactive
az backup protection disable --vault-name azurefilesvault --resource-group azurefiles --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --item-name “AzureFileShare;azurefiles” --out table
```

You can also run the previous command by using the friendly name for the container and the item by providing the following two additional parameters:

* **--backup-management-type**: *azurestorage*
* **--workload-type**: *azurefileshare*

```azurecli-interactive
az backup protection disable --vault-name azurefilesvault --resource-group azurefiles --container-name afsaccount --item-name azurefiles --workload-type azurefileshare --backup-management-type Azurestorage --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
fec6f004-0e35-407f-9928-10a163f123e5  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that's created by the backup service for your stop protection operation. To track the status of the job, use the [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

### Stop protection without retaining recovery points

To stop protection without retaining recovery points, use the [az backup protection disable](/cli/azure/backup/protection#az-backup-protection-disable) cmdlet with the **delete-backup-data** option set to **true**.

The following example stops protection for the *azurefiles* file share without retaining recovery points.

```azurecli-interactive
az backup protection disable --vault-name azurefilesvault --resource-group azurefiles --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --item-name “AzureFileShare;azurefiles” --delete-backup-data true --out table
```

You can also run the previous command by using the friendly name for the container and the item by providing the following two additional parameters:

* **--backup-management-type**: *azurestorage*
* **--workload-type**: *azurefileshare*

```azurecli-interactive
az backup protection disable --vault-name azurefilesvault --resource-group azurefiles --container-name afsaccount --item-name azurefiles --workload-type azurefileshare --backup-management-type Azurestorage --delete-backup-data true --out table
```

## Resume protection on a file share

If you stopped protection for an Azure file share but retained recovery points, you can resume protection later. If you don't retain the recovery points, you can't resume protection.

To resume protection for the file share, define the following parameters:

* **--container-name**: The name of the storage account that hosts the file share. To retrieve the **name** or **friendly name** of your container, use the [az backup container list](/cli/azure/backup/container#az-backup-container-list) command.
* **--item-name**: The name of the file share for which you want to resume protection. To retrieve the **name** or **friendly name** of your backed-up item, use the [az backup item list](/cli/azure/backup/item#az-backup-item-list) command.
* **--policy-name**: The name of the backup policy for which you want to resume the protection for the file share.

The following example uses the [az backup protection resume](/cli/azure/backup/protection#az-backup-protection-resume) cmdlet to resume protection for the *azurefiles* file share by using the *schedule1* backup policy.

```azurecli-interactive
az backup protection resume --vault-name azurefilesvault --resource-group azurefiles --container-name "StorageContainer;Storage;AzureFiles;afsaccount” --item-name “AzureFileShare;azurefiles” --policy-name schedule2 --out table
```

You can also run the previous command by using the friendly name for the container and the item by providing the following two additional parameters:

* **--backup-management-type**: *azurestorage*
* **--workload-type**: *azurefileshare*

```azurecli-interactive
az backup protection resume --vault-name azurefilesvault --resource-group azurefiles --container-name afsaccount --item-name azurefiles --workload-type azurefileshare --backup-management-type Azurestorage --policy-name schedule2 --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
75115ab0-43b0-4065-8698-55022a234b7f  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that's created by the backup service for your resume protection operation. To track the status of the job, use the [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

## Unregister a storage account

If you want to protect your file shares in a particular storage account by using a different Recovery Services vault, first [stop protection for all file shares](#stop-protection-on-a-file-share) in that storage account. Then unregister the account from the Recovery Services vault currently used for protection.

You need to provide a container name to unregister the storage account. To retrieve the **name** or the **friendly name** of your container, use the [az backup container list](/cli/azure/backup/container#az-backup-container-list) command.

The following example unregisters the *afsaccount* storage account from *azurefilesvault* by using the [az backup container unregister](/cli/azure/backup/container#az-backup-container-unregister) cmdlet.

```azurecli-interactive
az backup container unregister --vault-name azurefilesvault --resource-group azurefiles --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --out table
```

You can also run the previous cmdlet by using the friendly name for the container by providing the following additional parameter:

* **--backup-management-type**: *azurestorage*

```azurecli-interactive
az backup container unregister --vault-name azurefilesvault --resource-group azurefiles --container-name afsaccount --backup-management-type azurestorage --out table
```

## Next steps

For more information, see [Troubleshoot Azure file shares backup](troubleshoot-azure-files.md).
