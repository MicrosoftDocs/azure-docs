---
title: Create Backup Policies for PostgreSQL Databases by Using the Data Protection REST API
description: Learn how to create and manage backup policies for PostgreSQL databases in Azure Database for PostgreSQL by using the Azure Backup Data Protection REST API.
ms.topic: how-to
ms.date: 04/10/2025
ms.assetid: 759ee63f-148b-464c-bfc4-c9e640b7da6b
author: jyothisuri
ms.author: jsuri
# Customer intent: "As a database administrator, I want to create and manage backup policies for PostgreSQL databases using a REST API, so that I can automate backup scheduling, retention, and archiving for efficient data protection."
---

# Create backup policies for PostgreSQL databases by using the Data Protection REST API

A backup policy governs the retention and schedule of your PostgreSQL database backups in Azure Database for PostgreSQL. Azure Database for PostgreSQL offers long-term retention of database backups and supports a backup per day.

You can reuse an existing backup policy to configure backups for PostgreSQL databases to a vault, or you can [create a backup policy for an Azure Recovery Services vault by using the Data Protection REST API for Azure Backup](/rest/api/dataprotection/backup-policies/create-or-update). In this article, you create a backup policy.

## Understand PostgreSQL backup policies

Whereas disk backup offers multiple backups per day and blob backup is a *continuous* backup with no trigger, PostgreSQL backup offers archive protection. The backup data that's first sent to the vault can be moved to the archive tier in accordance with a defined rule or a life cycle.

In this context, the following hierarchy can help you understand the backup policy object for PostgreSQL:

- Policy rule
  - Backup rule
    - Backup parameter
      - Backup type (a full database backup in this case)
      - Initial datastore (where the backups land initially)
      - Trigger (how the backup is triggered)
        - Schedule
        - Default tagging criteria (a default tag that links all scheduled backups to the retention rule)
  - Default retention rule (a rule that's applied to all backups, by default, on the initial datastore)

The policy object defines what types of backups are triggered, how they're triggered (via a schedule), what they're tagged with, where they land (a datastore), and the life cycle of their data in a datastore.

The default PowerShell object for PostgreSQL says to trigger a *full* backup every week. The backups reach the vault, where they're stored for three months.

If you want to add the archive tier to the policy, you have to decide when the data will be moved from the vault to the archive, how long the data will stay in the archive, and which of the scheduled backups should be tagged as archivable. You have to add a retention rule that defines the life cycle of the backup data from the vault datastore to the archive datastore. The retention rule also defines how long the backup data will stay in the archive datastore. Then you need to add a tag that marks the scheduled backups as eligible to be archived.

The resultant PowerShell object is as follows:

- Policy rule
  - Backup rule
    - Backup parameter
      - Backup type (a full database backup in this case)
      - Initial datastore (where the backups land initially)
      - Trigger (how the backup is triggered)
        - Schedule
        - Default tagging criteria (a default tag that links all the scheduled backups to the retention rule)
        - New tagging criteria for the new retention rule with the same name
  - Default retention rule (a rule that's applied to all backups, by default, on the initial datastore)
  - New retention rule
    - Life cycle
      - Source datastore
      - Time period for deletion in the source datastore
      - Copy to the target datastore

## Create a policy

> [!IMPORTANT]
> Currently, updating or modifying an existing policy isn't supported. Instead, create a new policy with the required details and assign it to the relevant backup instance.

To create a backup policy, use the following `PUT` operation:

```http
PUT https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupPolicies/{policyName}?api-version=2021-01-01
```

The URI provides the `{policyName}` and `{vaultName}` values. The request body provides additional information.

## Create the request body

To create a policy for PostgreSQL backup, the request body needs the following components:

|Name  |Required  |Type  |Description  |
|---------|---------|---------|---------|
|`properties`     |   `true`      |  `BaseBackupPolicy`: [`BackupPolicy`](/rest/api/dataprotection/backup-policies/create-or-update#backuppolicy)      | `BaseBackupPolicyResource` properties        |

For the complete list of definitions in the request body, see the [REST API backup policies](/rest/api/dataprotection/backup-policies/create-or-update).

### Example request body

The policy says:

- The trigger is scheduled for a weekly backup at the chosen start time (time + `P1W`).
- The datastore is a *vault store*, because the backups are directly transferred to the vault.
- The backups are retained in the vault for three months (`P3M`).

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

> [!IMPORTANT]
> The time formats support only `DateTime`. `Time` is not supported. The time of the day indicates the backup start time, not the end time.

Let's update the preceding JSON with two changes:

- Add backups on multiple days of the week.
- Add an archive datastore for long-term retention of PostgreSQL database backups.

The following example modifies the weekly backup to Sunday, Wednesday, and Friday of every week. The schedule date array mentions the dates, and the days of the week for those dates are taken as days of the week. You also need to specify that these schedules should repeat every week. So, the schedule interval is `1` and the interval type is `Weekly`.

#### Scheduled trigger

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

If you want to add the archive protection, you need to modify the policy JSON.

#### Retention life cycle

The preceding JSON has a life cycle for the initial datastore under the default retention rule. In this scenario, the rule says to delete the backup data after three months. You should add a new retention rule that defines when the data is *moved* to the archive datastore. That is, backup data is first copied to the archive datastore and then deleted in the vault datastore.

Also, the rule should define the durations to keep the data in the archive datastore. Let's name this new rule `Monthly`. It defines that backups should be retained in the vault datastore for 6 months and then copied to the archive datastore. Then, delete the backups in the vault datastore and retain the data for 24 months in the archive datastore. Finally, delete the data in the archive datastore.

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

#### Tagging criteria

Every time you add a retention rule, you need to add a corresponding tag in the `Trigger` property of the policy. The following example creates a new tag along with the criteria (which is the first successful backup of the month) with exactly the same name as the corresponding retention rule to be applied.

In this example, the tag criteria should be named `Monthly`:

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

After you include all changes, the policy JSON appears as follows:

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

For more details about policy creation, see [Create a backup policy](backup-azure-database-postgresql.md#create-a-backup-policy).

## Check the response

The backup policy creation or update is a synchronous operation. After the operation is successful, it returns the following status response with the policy content in the response body.

|Name  |Type  |Description  |
|---------|---------|---------|
|`200 OK`     |     [`BaseBackupPolicyResource`](/rest/api/dataprotection/backup-policies/create-or-update#basebackuppolicyresource)     |  The operation is completed.       |

### Example response

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

## Related content

- [Back up Azure disks by using the Data Protection REST API](backup-azure-dataprotection-use-rest-api-backup-disks.md)
- [Azure Backup Data Protection REST API](/rest/api/dataprotection/)
- [Azure REST API reference](/rest/api/azure/)
- [Track backup and restore jobs by using the REST API in Azure Backup](backup-azure-arm-userestapi-managejobs.md)
