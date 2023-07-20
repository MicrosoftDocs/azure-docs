---
title: Create backup policies for Azure PostgreSQL databases using data protection REST API
description: In this article, you'll learn how to create and manage backup policies for Azure PostgreSQL databases using REST API.
ms.topic: conceptual
ms.date: 01/24/2022
ms.assetid: 759ee63f-148b-464c-bfc4-c9e640b7da6b
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Create Azure Data Protection backup policies for Azure PostgreSQL databases using REST API

A backup policy governs the retention and schedule of your backups. Azure PostgreSQL database Backup offers long-term retention and supports a backup per day.

You can reuse an existing backup policy to configure backup for PostgreSQL databases to a vault, or [create a backup policy for an Azure Recovery Services vault using REST API](/rest/api/dataprotection/backup-policies/create-or-update).

## Understanding PostgreSQL backup policy

While disk backup offers multiple backups per day and blob backup is a *continuous* backup with no trigger, PostgreSQL backup offers Archive protection. The backup data that's first sent to the vault can be moved to the *archive* tier as per a defined rule or a *lifecycle*. In this context, let's understand the backup policy object for PostgreSQL.

-  PolicyRule
   -  BackupRule
      -  BackupParameter
         -  BackupType (A full database backup in this case)
         -  Initial Datastore (Where will the backups land initially)
         -  Trigger (How the backup is triggered)
            -  Schedule based
            -  Default Tagging Criteria (A default 'tag' for all the scheduled backups. This tag links the backups to the retention rule)
   -  Default Retention Rule (A rule that will be applied to all backups, by default, on the initial datastore)

So, this object defines what type of backups are triggered, how they are triggered (via a schedule), what they are tagged with, where they land (a datastore), and the lifecycle of the backup data in a datastore. The default PowerShell object for PostgreSQL says to trigger a *full* backup every week, and they will land in the vault where they are stored for three months.

If you want to add the *archive* tier to the policy, you have to decide when the data will be moved from vault to archive, how long will the data stay in the archive, and which of the scheduled backups should be tagged as *archivable*. So, you have to add a *retention rule* where the lifecycle of the backup data will be defined from vault datastore to archive datastore and how long they will stay in the *archive* datastore. Then you need to add a 'tag' that'll mark the scheduled backups as _eligible to be archived_. The resultant PowerShell object is as follows:

-  PolicyRule
   -  BackupRule
      -  BackupParameter
         -  BackupType (A full database backup in this case)
         -  Initial Datastore (Where will the backups land initially)
         -  Trigger (How the backup is triggered)
            -  Schedule based
            -  Default Tagging Criteria (A default 'tag' for all the scheduled backups. This tag links the backups to the retention rule)
            -  New Tagging criteria for the new retention rule with the same name 'X'
   -  Default Retention Rule (A rule that will be applied to all backups, by default, on the initial datastore)
   -  A new Retention rule named as 'X'
      -  Lifecycle
         -  Source datastore
         -  Delete After time period in source datastore
         - Copy to target datastore

To create a policy for backing up PostgreSQL databases, perform the following actions:

## Create a policy

>[!IMPORTANT]
>Currently, updating or modifying an existing policy isn't supported. Alternatively, you can create a new policy with the required details and assign it to the relevant backup instance.

To create an Azure Backup policy, use the following *PUT* operation:

```http
PUT https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupPolicies/{policyName}?api-version=2021-01-01
```

The `{policyName}` and `{vaultName}` are provided in the URI. Additional, information is provided in the request body.

## Create the request body

For example, to create a policy for POstgreSQL backup, the request body needs the following components:

|Name  |Required  |Type  |Description  |
|---------|---------|---------|---------|
|properties     |   True      |  BaseBackupPolicy:[BackupPolicy](/rest/api/dataprotection/backup-policies/create-or-update#backuppolicy)      | BaseBackupPolicyResource properties        |

For the complete list of definitions in the request body, see the [backup policy REST API document](/rest/api/dataprotection/backup-policies/create-or-update).

### Example request body

The policy says:

- Scheduled trigger for a weekly backup and choose the starting time. (Time + P1W).
- Datastore is _vault store_, as the backups are directly transferred to the vault.
- The backups are retained in the vault for three months (P3M).

```json
{
  "datasourceTypes": [
    "Microsoft.DBforPostgreSQL/servers/databases"
  ],
  "name": "OssPolicy1",
  "objectType": "BackupPolicy",
  "policyRules": [
    {
      "backupParameters": {
        "backupType": "Full",
        "objectType": "AzureBackupParams"
      },
      "dataStore": {
        "dataStoreType": "VaultStore",
        "objectType": "DataStoreInfoBase"
      },
      "name": "BackupWeekly",
      "objectType": "AzureBackupRule",
      "trigger": {
        "objectType": "ScheduleBasedTriggerContext",
        "schedule": {
          "repeatingTimeIntervals": [
            "R/2021-08-15T06:30:00+00:00/P1W"
          ],
          "timeZone": "UTC"
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
            "duration": "P3M",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "VaultStore",
            "objectType": "DataStoreInfoBase"
          },
          "targetDataStoreCopySettings": []
        }
      ],
      "name": "Default",
      "objectType": "AzureRetentionRule"
    }
  ]
}
```

>[!IMPORTANT]
>The time formats support only _DateTime_; only _Time_ not supported. The time of the day indicates the backup start time, and not the time when the backup completes.

Let's update the above **JSON** with two changes - Backups on multiple days of the week and adding an *archive* datastore for long-term retention of PostgreSQL database backups.

The following example modifies the weekly backup to back up happening on every Sunday, Wednesday, and Friday of every week. The schedule date array mentions the dates, and the days of the week of those dates are taken as days of the week. You also need to specify that these schedules should repeat every week. So, the schedule interval is *1* and the interval type is *Weekly*.

**Scheduled trigger:**

```json
"trigger": {
        "objectType": "ScheduleBasedTriggerContext",
        "schedule": {
          "repeatingTimeIntervals": [
            "R/2021-08-15T22:00:00+00:00/P1W",
            "R/2021-08-18T22:00:00+00:00/P1W",
            "R/2021-08-20T22:00:00+00:00/P1W"
          ],
          "timeZone": "UTC"
        }
```

If you want to add the *archive* protection, you need to modify the policy JSON as below:

The above JSON has a lifecycle for the initial datastore under the default retention rule. In this scenario, the rule says to delete the backup data after three months. You should add a new retention rule that defines when the data is *moved* to *archive* datastore, that is, backup data is first copied to archive datastore, and then deleted in vault datastore. Also, the rule should define the durations to keep the data in the archive* datastore. Let's name this new rule as **Monthly** and it defines that backups should be retained in the vault datastore for 6 months, and then copied to archive datastore. Then *delete* in the vault datastore retain the data for 24 months in the archive datastore, and then delete the data in archive datastore.

**Retention lifecycle:**

```json
"lifecycles": [
        {
          "deleteAfter": {
            "duration": "P3M",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "VaultStore",
            "objectType": "DataStoreInfoBase"
          },
          "targetDataStoreCopySettings": []
        }
      ],
      "name": "Default",
      "objectType": "AzureRetentionRule"
    },
    {
      "isDefault": false,
      "lifecycles": [
        {
          "deleteAfter": {
            "duration": "P6M",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "VaultStore",
            "objectType": "DataStoreInfoBase"
          },
          "targetDataStoreCopySettings": {
            "copyAfter": {
              "objectType": "CopyOnExpiryOption"
            },
            "dataStore": {
              "dataStoreType": "ArchiveStore",
              "objectType": "DataStoreInfoBase"
            }
          }
        },
        {
          "deleteAfter": {
            "duration": "P24M",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "ArchiveStore",
            "objectType": "DataStoreInfoBase"
          },
          "targetDataStoreCopySettings": null
        }
      ],
      "name": "Monthly",
      "objectType": "AzureRetentionRule"
    }
```

Every time you add a retention rule, you need to add a corresponding tag in *Trigger* property of the policy. The following example creates a new *tag* along with the criteria (which is the first successful backup of the month) with the exact same name as the corresponding retention rule to be applied. 

In this example, the tag criteria should be named *Monthly*.

**Tagging criteria:**

```json
{
  "criteria": [
    {
      "absoluteCriteria": [
        "FirstOfMonth"
      ],
      "objectType": "ScheduleBasedBackupCriteria"
    }
  ],
  "isDefault": false,
  "tagInfo": {
    "tagName": "Monthly"
  },
  "taggingPriority": 15
}
```

After including all changes, the policy JSON will appear as follows:

```json
{
  "datasourceTypes": [
    "Microsoft.DBforPostgreSQL/servers/databases"
  ],
  "name": "OssPolicy1",
  "objectType": "BackupPolicy",
  "policyRules": [
    {
      "backupParameters": {
        "backupType": "Full",
        "objectType": "AzureBackupParams"
      },
      "dataStore": {
        "dataStoreType": "VaultStore",
        "objectType": "DataStoreInfoBase"
      },
      "name": "BackupWeekly",
      "objectType": "AzureBackupRule",
      "trigger": {
        "objectType": "ScheduleBasedTriggerContext",
        "schedule": {
          "repeatingTimeIntervals": [
            "R/2021-08-15T22:00:00+00:00/P1W",
            "R/2021-08-18T22:00:00+00:00/P1W",
            "R/2021-08-20T22:00:00+00:00/P1W"
          ],
          "timeZone": "UTC"
        },
        "taggingCriteria": [
          {
            "isDefault": true,
            "tagInfo": {
              "id": "Default_",
              "tagName": "Default"
            },
            "taggingPriority": 99
          },
          {
            "criteria": [
              {
                "absoluteCriteria": [
                  "FirstOfMonth"
                ],
                "objectType": "ScheduleBasedBackupCriteria"
              }
            ],
            "isDefault": false,
            "tagInfo": {
              "tagName": "Monthly"
            },
            "taggingPriority": 15
          }
        ]
      }
    },
    {
      "isDefault": true,
      "lifecycles": [
        {
          "deleteAfter": {
            "duration": "P3M",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "VaultStore",
            "objectType": "DataStoreInfoBase"
          },
          "targetDataStoreCopySettings": []
        }
      ],
      "name": "Default",
      "objectType": "AzureRetentionRule"
    },
    {
      "isDefault": false,
      "lifecycles": [
        {
          "deleteAfter": {
            "duration": "P6M",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "VaultStore",
            "objectType": "DataStoreInfoBase"
          },
          "targetDataStoreCopySettings": {
            "copyAfter": {
              "objectType": "CopyOnExpiryOption"
            },
            "dataStore": {
              "dataStoreType": "ArchiveStore",
              "objectType": "DataStoreInfoBase"
            }
          }
        },
        {
          "deleteAfter": {
            "duration": "P24M",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "ArchiveStore",
            "objectType": "DataStoreInfoBase"
          },
          "targetDataStoreCopySettings": null
        }
      ],
      "name": "Monthly",
      "objectType": "AzureRetentionRule"
    }
  ]
}

```

For more details about policy creation, see the [PostGreSQL database Backup policy](backup-azure-database-postgresql.md#create-backup-policy) document.

## Responses

The backup policy creation/update is a synchronous operation and returns _OK_ once the operation is successful.

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |     [BaseBackupPolicyResource](/rest/api/dataprotection/backup-policies/create-or-update#basebackuppolicyresource)     |  OK       |

### Example responses

Once the operation completes, it returns 200 (OK) with the policy content in the response body.

```json
{
    "properties": {
        "policyRules": [
            {
                "backupParameters": {
                    "backupType": "Full",
                    "objectType": "AzureBackupParams"
                },
                "trigger": {
                    "schedule": {
                        "repeatingTimeIntervals": [
                            "R/2021-08-15T22:00:00+00:00/P1W",
                            "R/2021-08-18T22:00:00+00:00/P1W",
                            "R/2021-08-20T22:00:00+00:00/P1W"
                        ],
                        "timeZone": "UTC"
                    },
                    "taggingCriteria": [
                        {
                            "tagInfo": {
                                "tagName": "Monthly",
                                "id": "Monthly_"
                            },
                            "taggingPriority": 15,
                            "isDefault": false,
                            "criteria": [
                                {
                                    "absoluteCriteria": [
                                        "FirstOfMonth"
                                    ],
                                    "objectType": "ScheduleBasedBackupCriteria"
                                }
                            ]
                        },
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
                    "dataStoreType": "VaultStore",
                    "objectType": "DataStoreInfoBase"
                },
                "name": "BackupWeekly",
                "objectType": "AzureBackupRule"
            },
            {
                "lifecycles": [
                    {
                        "deleteAfter": {
                            "objectType": "AbsoluteDeleteOption",
                            "duration": "P6M"
                        },
                        "targetDataStoreCopySettings": [
                            {
                                "dataStore": {
                                    "dataStoreType": "ArchiveStore",
                                    "objectType": "DataStoreInfoBase"
                                },
                                "copyAfter": {
                                    "objectType": "CopyOnExpiryOption"
                                }
                            }
                        ],
                        "sourceDataStore": {
                            "dataStoreType": "VaultStore",
                            "objectType": "DataStoreInfoBase"
                        }
                    },
                    {
                        "deleteAfter": {
                            "objectType": "AbsoluteDeleteOption",
                            "duration": "P24M"
                        },
                        "targetDataStoreCopySettings": [],
                        "sourceDataStore": {
                            "dataStoreType": "ArchiveStore",
                            "objectType": "DataStoreInfoBase"
                        }
                    }
                ],
                "isDefault": false,
                "name": "Monthly",
                "objectType": "AzureRetentionRule"
            },
            {
                "lifecycles": [
                    {
                        "deleteAfter": {
                            "objectType": "AbsoluteDeleteOption",
                            "duration": "P3M"
                        },
                        "targetDataStoreCopySettings": [],
                        "sourceDataStore": {
                            "dataStoreType": "VaultStore",
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
            "Microsoft.DBforPostgreSQL/servers/databases"
        ],
        "objectType": "BackupPolicy"
    },
    "id": "/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/DebRG1/providers/Microsoft.DataProtection/backupVaults/DebBackupVault/backupPolicies/OssPolicy1",
    "name": "OssPolicy1",
    "type": "Microsoft.DataProtection/backupVaults/backupPolicies"
}
```

## Next steps

[Enable protection for Azure Disks](backup-azure-dataprotection-use-rest-api-backup-disks.md)

For more information on the Azure Backup REST APIs, see the following articles:

- [Azure Data Protection REST API](/rest/api/dataprotection/)
- [Get started with Azure REST API](/rest/api/azure/)
