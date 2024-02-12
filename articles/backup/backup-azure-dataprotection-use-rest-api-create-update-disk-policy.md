---
title: Create backup policies for disks using data protection REST API
description: In this article, you'll learn how to create and manage backup policies for disks using REST API.
ms.topic: how-to
ms.date: 05/10/2023
ms.assetid: ecc107c0-311c-42d0-a094-654d7ee30443
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
ms.custom: engagement-fy23
---

# Create Azure Data Protection backup policies for disks using REST API

This article describes how to create a backup policy via REST API.

Azure Disk Backup offers a turnkey solution that provides snapshot lifecycle management for managed disks by automating periodic creation of snapshots and retaining it for configured duration using backup policy. You can manage the disk snapshots with zero infrastructure cost and without the need for custom scripting or any management overhead. This is a crash-consistent backup solution that takes point-in-time backup of a managed disk using incremental snapshots with support for multiple backups per day. It's also an agent-less solution and doesn't impact production application performance. It supports backup and restore of both OS and data disks (including shared disks), whether or not they're currently attached to a running Azure virtual machine.

The backup policy helps to govern the retention and schedule of your backups. The backup policy offers multiple backups per day. You can reuse the backup policy to configure backup for multiple Azure Disks to a vault or [create a backup policy for an Azure Recovery Services vault using REST API](/rest/api/dataprotection/backup-policies/create-or-update).

To create a policy for backing up disks, perform the following actions:

## Create a policy

To create an Azure Backup policy, use the following *PUT* operation:

```http
PUT https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupPolicies/{policyName}?api-version=2021-01-01
```

The `{policyName}` and `{vaultName}` are provided in the URI. Additional information is provided in the request body.

>[!IMPORTANT]
>Currently, updating or modifying an existing policy isn't supported. Alternatively, you can create a new policy with the required details and assign it to the relevant backup instance.

### Create the request body

For example, to create a policy for Disk backup, the request body needs the following components:

|Name  |Required  |Type  |Description  |
|---------|---------|---------|---------|
|properties     |   True      |  BaseBackupPolicy:[BackupPolicy](/rest/api/dataprotection/backup-policies/create-or-update#backuppolicy)      | BaseBackupPolicyResource properties        |

For the complete list of definitions in the request body, refer to the [backup policy REST API document](/rest/api/dataprotection/backup-policies/create-or-update).

**Example request body**

The policy says:

- Scheduled trigger for every 4 hours (PT4H). Then the backups are taken at approximately in the interval of every 4 hours so that the backups are distributed equally across the day.
- You can choose the trigger interval to be every 4, 6, 8 or 12 hours. To schedule a backup as once per day, use **P1D**. Backups are triggered once per day at the stipulated time.
- Datastore is _operational store_, as the backups are local, and no data is stored in the Backup vault. In the operational store, each backup instance is stored for seven days (P7D).

```json
{
"properties": {
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
}
```

>[!IMPORTANT]
>The time formats support only DateTime. They don't support only Time. The time of the day indicates the backup start time, and not the time when the backup completes.

The time required for completing the backup operation depends on various factors including size of the disk, and churn rate between consecutive backups. However, Azure Disk Backup is an agentless backup that uses [incremental snapshots](../virtual-machines/disks-incremental-snapshots.md), which doesn't impact the production application performance.

To know more details about policy creation, refer to the [Azure Disk Backup policy](backup-managed-disks.md#create-backup-policy) document.

### Responses

The backup policy creation/update is a synchronous operation and returns OK once the operation is successful.

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |     [BaseBackupPolicyResource](/rest/api/dataprotection/backup-policies/create-or-update#basebackuppolicyresource)     |  OK       |

**Example responses**

Once the operation completes, it returns 200 (OK) with the policy content in the response body.

```json
{
    "id": "/subscriptions/73307177-bb00-4801-bd11-894b2f2d5162/resourceGroups/RG-BV/providers/Microsoft.DataProtection/backupVaults/BV-JPE-GRS/backupPolicies/DiskBackupPolicy-03",
    "name": "DiskBackupPolicy-03",
    "type": "Microsoft.DataProtection/backupVaults/backupPolicies",
    "properties": {
        "policyRules": [
            {
                "backupParameters": {
                    "backupType": "Incremental",
                    "objectType": "AzureBackupParams"
                },
                "trigger": {
                    "schedule": {
                        "repeatingTimeIntervals": [
                            "R/2021-07-01T19:00:00+00:00/P1D"
                        ],
                      },
                    "taggingCriteria": [
                        {
                            "tagInfo": {
                                "tagName": "Default",
                                "id": "Default_"
                            },
                            "taggingPriority": 99,
                            "isDefault": true
                        }
                    ],
                    "objectType": "ScheduleBasedTriggerContext"
                },
                "dataStore": {
                    "dataStoreType": "OperationalStore",
                    "objectType": "DataStoreInfoBase"
                },
                "name": "BackupDaily",
                "objectType": "AzureBackupRule"
            },
            {
                "lifecycles": [
                    {
                        "deleteAfter": {
                            "objectType": "AbsoluteDeleteOption",
                            "duration": "P7D"
                        },
                        "targetDataStoreCopySettings": [],
                        "sourceDataStore": {
                            "dataStoreType": "OperationalStore",
                            "objectType": "DataStoreInfoBase"
                        }
                    }
                ],
                "isDefault": true,
                "name": "Default",
                "objectType": "AzureRetentionRule"
            }
        ],
        "datasourceTypes": [
            "Microsoft.Compute/disks"
        ],
        "objectType": "BackupPolicy"
    }
}
```

## Next steps

[Enable protection for Azure Disks](backup-azure-dataprotection-use-rest-api-backup-disks.md)

For more information on the Azure Backup REST APIs, see the following articles:

- [Azure Data Protection REST API](/rest/api/dataprotection/)
- [Get started with Azure REST API](/rest/api/azure/)
