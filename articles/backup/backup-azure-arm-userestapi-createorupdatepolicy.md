---
title: 'Azure Backup: Create backup policies using REST API'
description: Manage backup policies (schedule and retention) using REST API
services: backup
author: pvrk
manager: shivamg
keywords: REST API; Azure VM backup; Azure VM restore;
ms.service: backup
ms.topic: conceptual
ms.date: 08/21/2018
ms.author: pullabhk
ms.assetid: 5ffc4115-0ae5-4b85-a18c-8a942f6d4870
---
# Create Azure Recovery Services backup policies using REST API

The steps to create a backup policy for an Azure Recovery Services vault are outlined in the [policy REST API document](https://docs.microsoft.com/rest/api/backup/protectionpolicies/createorupdate). Let us use this document as a reference to create a policy for Azure VM backup.

## Backup policy essentials

- A backup policy is created per vault.
- A backup policy can be created for the backup of following workloads
  - Azure VM
  - SQL in Azure VM
  - Azure File Share
- A policy can be assigned to many resources. An Azure VM backup policy can be used to protect many Azure VMs.
- A policy consists of two components
  - Schedule: When to take the backup
  - Retention: For how long each backup should be retained.
- Schedule can be defined as "daily" or "weekly" with a specific point of time.
- Retention can be defined for "daily", "weekly", "monthly", "yearly" backup points.
- "weekly" refers to a backup on a certain day of the week, "monthly" means a backup on a certain day of the month and "yearly" refers to a backup on a certain day of the year.
- Retention for "monthly", "yearly" backup points is referred to as "LongTermRetention".
- When a vault is created, a policy for Azure VM backups called "DefaultPolicy" is also created and can be used to backup Azure VMs.

To create or update an Azure Backup policy, use the following *PUT* operation

```http
PUT https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupPolicies/{policyName}?api-version=2016-12-01
```

The `{policyName}` and `{vaultName}` are provided in the URI. Additional information is provided in the request body.

## Create the request body

For example, to create a policy for Azure VM backup, following are the components of the request body.

|Name  |Required  |Type  |Description  |
|---------|---------|---------|---------|
|properties     |   True      |  ProtectionPolicy:[AzureIaaSVMProtectionPolicy](https://docs.microsoft.com/rest/api/backup/protectionpolicies/createorupdate#azureiaasvmprotectionpolicy)      | ProtectionPolicyResource properties        |
|tags     |         | Object        |  Resource tags       |

For the complete list of definitions in the request body, refer to the [backup policy REST API document](https://docs.microsoft.com/rest/api/backup/protectionpolicies/createorupdate).

### Example request body

The following request body defines a backup policy for Azure VM backups.

The policy says:

- Take a weekly backup every Monday, Wednesday, Thursday at 10:00 AM Pacific Standard Time.
- Retain the backups taken on every Monday, Wednesday, Thursday for one week.
- Retain the backups taken on every first Wednesday and third Thursday of a month for two months (overrides the previous retention conditions, if any).
- Retain the backups taken on fourth Monday and fourth Thursday in February and November for four years (overrides the previous retention conditions, if any).

```json
{
  "properties": {
    "backupManagementType": "AzureIaasVM",
    "timeZone": "Pacific Standard Time",
    "schedulePolicy": {
      "schedulePolicyType": "SimpleSchedulePolicy",
      "scheduleRunFrequency": "Weekly",
      "scheduleRunTimes": [
        "2018-01-24T10:00:00Z"
      ],
      "scheduleRunDays": [
        "Monday",
        "Wednesday",
        "Thursday"
      ]
    },
    "retentionPolicy": {
      "retentionPolicyType": "LongTermRetentionPolicy",
      "weeklySchedule": {
        "daysOfTheWeek": [
          "Monday",
          "Wednesday",
          "Thursday"
        ],
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 1,
          "durationType": "Weeks"
        }
      },
      "monthlySchedule": {
        "retentionScheduleFormatType": "Weekly",
        "retentionScheduleWeekly": {
          "daysOfTheWeek": [
            "Wednesday",
            "Thursday"
          ],
          "weeksOfTheMonth": [
            "First",
            "Third"
          ]
        },
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 2,
          "durationType": "Months"
        }
      },
      "yearlySchedule": {
        "retentionScheduleFormatType": "Weekly",
        "monthsOfYear": [
          "February",
          "November"
        ],
        "retentionScheduleWeekly": {
          "daysOfTheWeek": [
            "Monday",
            "Thursday"
          ],
          "weeksOfTheMonth": [
            "Fourth"
          ]
        },
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 4,
          "durationType": "Years"
        }
      }
    }
  }
}
```

> [!IMPORTANT]
> The time formats for schedule and retention support only DateTime. They do not support Time format alone.

## Responses

The backup policy creation/update is a [asynchronous operation](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-async-operations). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created and then 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |    [Protection PolicyResource](https://docs.microsoft.com/rest/api/backup/protectionpolicies/createorupdate#protectionpolicyresource)     |  OK       |
|202 Accepted     |         |     Accepted    |

### Example responses

Once you submit the *PUT* request for policy creation or updating, the initial response is 202 (Accepted) with a location header or Azure-async-header.

```http
HTTP/1.1 202 Accepted
Pragma: no-cache
Retry-After: 60
Azure-AsyncOperation: https://management.azure.com/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SwaggerTestRg/providers/Microsoft.RecoveryServices/vaults/testVault/backupPolicies/testPolicy1/operations/00000000-0000-0000-0000-000000000000?api-version=2016-06-01
X-Content-Type-Options: nosniff
x-ms-request-id: db785be0-bb20-4598-bc9f-70c9428b170b
x-ms-client-request-id: e1f94eef-9b2d-45c4-85b8-151e12b07d03; e1f94eef-9b2d-45c4-85b8-151e12b07d03
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: db785be0-bb20-4598-bc9f-70c9428b170b
x-ms-routing-request-id: SOUTHINDIA:20180521T073907Z:db785be0-bb20-4598-bc9f-70c9428b170b
Cache-Control: no-cache
Date: Mon, 21 May 2018 07:39:06 GMT
Location: https://management.azure.com/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SwaggerTestRg/providers/Microsoft.RecoveryServices/vaults/testVault/backupPolicies/testPolicy1/operationResults/00000000-0000-0000-0000-000000000000?api-version=2016-06-01
X-Powered-By: ASP.NET
```

Then track the resulting operation using the location header or Azure-AsyncOperation header with a simple *GET* command.

```http
GET https://management.azure.com/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SwaggerTestRg/providers/Microsoft.RecoveryServices/vaults/testVault/backupPolicies/testPolicy1/operationResults/00000000-0000-0000-0000-000000000000?api-version=2016-06-01
```

Once the operation completes, it returns 200 (OK) with the policy content in the response body.

```json
{
  "id": "/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SwaggerTestRg/providers/Microsoft.RecoveryServices/vaults/testVault/backupPolicies/testPolicy1",
  "name": "testPolicy1",
  "type": "Microsoft.RecoveryServices/vaults/backupPolicies",
  "properties": {
    "backupManagementType": "AzureIaasVM",
    "schedulePolicy": {
      "schedulePolicyType": "SimpleSchedulePolicy",
      "scheduleRunFrequency": "Weekly",
      "scheduleRunDays": [
        "Monday",
        "Wednesday",
        "Thursday"
      ],
      "scheduleRunTimes": [
        "2018-01-24T10:00:00Z"
      ],
      "scheduleWeeklyFrequency": 0
    },
    "retentionPolicy": {
      "retentionPolicyType": "LongTermRetentionPolicy",
      "weeklySchedule": {
        "daysOfTheWeek": [
          "Monday",
          "Wednesday",
          "Thursday"
        ],
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 1,
          "durationType": "Weeks"
        }
      },
      "monthlySchedule": {
        "retentionScheduleFormatType": "Weekly",
        "retentionScheduleWeekly": {
          "daysOfTheWeek": [
            "Wednesday",
            "Thursday"
          ],
          "weeksOfTheMonth": [
            "First",
            "Third"
          ]
        },
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 2,
          "durationType": "Months"
        }
      },
      "yearlySchedule": {
        "retentionScheduleFormatType": "Weekly",
        "monthsOfYear": [
          "February",
          "November"
        ],
        "retentionScheduleWeekly": {
          "daysOfTheWeek": [
            "Monday",
            "Thursday"
          ],
          "weeksOfTheMonth": [
            "Fourth"
          ]
        },
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 4,
          "durationType": "Years"
        }
      }
    },
    "timeZone": "Pacific Standard Time",
    "protectedItemsCount": 0
  }
}
```

If a policy is already being used to protect an item, any update in the policy will result in [modifying protection](backup-azure-arm-userestapi-backupazurevms.md#changing-the-policy-of-protection) for all such associated items.

## Next steps

[Enable protection for an unprotected Azure VM](backup-azure-arm-userestapi-backupazurevms.md).

For more information on the Azure Backup REST APIs, refer to the following documents:

- [Azure Recovery Services provider REST API](/rest/api/recoveryservices/)
- [Get started with Azure REST API](/rest/api/azure/)