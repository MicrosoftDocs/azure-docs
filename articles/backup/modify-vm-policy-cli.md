---
title: Update the existing VM backup policy using CLI
description: Learn how to update the existing VM backup policy using Azure CLI.
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 12/31/2020
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Update the existing VM backup policy using CLI

You can use Azure CLI to update an existing VM backup policy. This article will explain how to export the existing policy to a JSON file, modify the file, and then use Azure CLI to update the policy with the modified policy.

## Modify an existing policy

To modify an existing VM backup policy, follow these steps:

1. Execute the [az backup policy show](/cli/azure/backup/policy#az-backup-policy-show) command to retrieve the details of policy you want to update.

    Example:

    ```azurecli
    az backup policy show --name testing123 --resource-group rg1234 --vault-name testvault
    ```

    The example above shows the details for a VM policy with the name *testing123*.

    Output:

    ```json
    {
    "eTag": null,
    "id": "/Subscriptions/efgsf-123-test-subscription/resourceGroups/rg1234/providers/Microsoft.RecoveryServices/vaults/testvault/backupPolicies/testing123",
    "location": null,
    "name": "testing123",
    "properties": {
        "backupManagementType": "AzureIaasVM",
        "instantRpDetails": {
        "azureBackupRgNamePrefix": null,
        "azureBackupRgNameSuffix": null
        },
        "instantRpRetentionRangeInDays": 2,
        "protectedItemsCount": 0,
        "retentionPolicy": {
        "dailySchedule": {
            "retentionDuration": {
            "count": 180,
            "durationType": "Days"
            },
            "retentionTimes": [
            "2020-08-03T04:30:00+00:00"
            ]
        },
        "monthlySchedule": null,
        "retentionPolicyType": "LongTermRetentionPolicy",
        "weeklySchedule": {
            "daysOfTheWeek": [
            "Sunday"
            ],
            "retentionDuration": {
            "count": 30,
            "durationType": "Weeks"
            },
            "retentionTimes": [
            "2020-08-03T04:30:00+00:00"
            ]
        },
        "yearlySchedule": null
        },
        "schedulePolicy": {
        "schedulePolicyType": "SimpleSchedulePolicy",
        "scheduleRunDays": null,
        "scheduleRunFrequency": "Daily",
        "scheduleRunTimes": [
            "2020-08-03T04:30:00+00:00"
        ],
        "scheduleWeeklyFrequency": 0
        },
        "timeZone": "UTC"
    },
    "resourceGroup": "azurefiles",
    "tags": null,
    "type": "Microsoft.RecoveryServices/vaults/backupPolicies"
    }
    ```

1. Save the above output in a .json file. For example, let's save it as *Policy.json*.
1. Update the JSON file based on your requirements and save the changes.

    Example:
    To update the weekly retention to 60 days, update the following section of the JSON file by changing the count to 60.

    ```json
            "retentionDuration": {
          "count": 60,
          "durationType": "Weeks"
        }

    ```

1. Save the changes.
1. Execute the [az backup policy set](/cli/azure/backup/policy#az-backup-policy-set) command and pass the complete path of the updated JSON file as the value for the **- - policy** parameter.

    ```azurecli
    az backup policy set --resource-group rg1234 --vault-name testvault --policy C:\temp2\Policy.json --name testing123
    ```

>[!NOTE]
>You can also retrieve the sample JSON policy by executing the [az backup policy get-default-for-vm](/cli/azure/backup/policy#az-backup-policy-get-default-for-vm) command.

## Next steps

- [Manage Azure VM backups with the Azure Backup service](backup-azure-manage-vms.md)
