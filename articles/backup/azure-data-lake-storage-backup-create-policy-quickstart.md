---
title: Quickstart - Create a vaulted backup  policy for Azure Data Lake Storage using Azure portal, PowerShell, or Azure
description: Learn how to create a vaulted backup policy for Azure Data Lake Storage using Azure portal, PowerShell, or Azure.
ms.custom:
  - ignite-2025
  - devx-track-azurepowershell-azurecli, devx-track-azurecli
zone_pivot_groups: backup-client-portal-powershell-cli
ms.topic: tutorial
ms.date: 11/18/2025
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As an IT administrator, I want to create a vaulted backup policy for Azure Data Lake Storage using the portal, PowerShell, or Azure CLI so that I can ensure data protection against accidental or malicious deletions without maintaining on-premises infrastructure.
---

# Quickstart: Create a vaulted backup policy for Azure Data Lake Storage

::: zone pivot="client-portal"

This quickstart describes how to create a vaulted backup policy for [Azure Data Lake Storage](azure-data-lake-storage-backup-overview.md) from the Azure portal.

## Prerequisites

Before you create a vaulted backup policy for Azure Data Lake Storage, ensure that the following prerequisites are met:

- Identify or [create a Backup vault](create-manage-backup-vault.md#create-a-backup-vault) to configure Azure Data Lake Storage backup.
- Review the [supported scenarios](azure-data-lake-storage-backup-support-matrix.md) for Azure Data Lake Storage backup.

## Configure a vaulted backup policy for Azure Data Lake Storage using the Azure portal

A backup policy defines the schedule and frequency for backing up Azure Data Lake Storage. You can either create a backup policy from the Backup vault or create it on the go during the backup configuration.

To configure a vaulted backup policy for Azure Data Lake Storage from the Backup vault, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **Backup vault** > **Backup policies**, and then select **+ Add**.
1. On the **Create Backup Policy** pane, on the **Basics** tab, provide a name for the new policy on **Policy name**, and then select **Datasource type** as **Azure Data Lake Storage**.

   :::image type="content" source="./media/azure-data-lake-storage-configure-backup/create-policy.png" alt-text="Screenshot shows how to start creating a backup policy." lightbox="./media/azure-data-lake-storage-configure-backup/create-policy.png":::

1. On the **Schedule + retention** tab, under the **Backup schedule** section, set the **Backup Frequency** as **Daily** or **Weekly** and the schedule for creating recovery points for backups.
1. Under the **Add retention** section, edit the default retention rule or add new rules to specify the retention of recovery points.
1. Select **Review + create**.
1. After the review succeeds, select **Create**.

::: zone-end


::: zone pivot="client-powershell"

This quickstart describes how to create a vaulted backup policy for [Azure Data Lake Storage backup](azure-data-lake-storage-backup-overview.md) using PowerShell.

## Prerequisites

Before you create a vaulted backup policy for Azure Data Lake Storage, ensure that the following prerequisites are met:

- Install the Azure PowerShell version Az 14.6.0. Learn [how to install Azure PowerShell](/powershell/azure/install-az-ps).
- Identify or [create a Backup vault](backup-blobs-storage-account-ps.md#create-a-backup-vault) to configure Azure Data Lake Storage backup.
- Review the [supported scenarios](azure-data-lake-storage-backup-support-matrix.md) for Azure Data Lake Storage backup.

## Configure a vaulted backup policy for Azure Data Lake Storage using PowerShell

To configure a vaulted backup policy for Azure Data Lake Storage, run the following cmdlets:

1.	To fetch the policy template, use the [`Get-AzDataProtectionPolicyTemplate`](/powershell/module/az.dataprotection/get-azdataprotectionpolicytemplate) cmdlet. This command fetches a default policy template for a given datasource type. Use this policy template to create a new policy.

     ```azurepowershell-interactive
     $defaultPol = Get-AzDataProtectionPolicyTemplate -DatasourceType AzureDataLakeStorage
     ```

1.	To create a vaulted backup policy, define the schedule and retention for backups. The following example cmdlets create a backup policy with backup frequency every week on Friday and Tuesday at 10 AM and retention of three months.

      ```azurepowershell-interactive
      $schDates = @(
      (
      (Get-Date -Year 2023 -Month 08 -Day 18 -Hour 10 -Minute 0 -Second 0)
      ),
      (
      (Get-Date -Year 2023 -Month 08 -Day 22 -Hour 10 -Minute 0 -Second 0)
      ))
      $trigger =  New-AzDataProtectionPolicyTriggerScheduleClientObject -ScheduleDays $schDates -IntervalType Weekly -IntervalCount 1
      Edit-AzDataProtectionPolicyTriggerClientObject -Schedule $trigger -Policy $defaultPol

      $lifeCycleVault = New-AzDataProtectionRetentionLifeCycleClientObject -SourceDataStore VaultStore -SourceRetentionDurationType Months -SourceRetentionDurationCount 3
      Edit-AzDataProtectionPolicyRetentionRuleClientObject -Policy $defaultPol -Name Default -LifeCycles $lifeCycleVault -IsDefault $true
      New-AzDataProtectionBackupPolicy -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" -ResourceGroupName "resourceGroupName" -VaultName "vaultName" -Name "MyPolicy" -Policy $defaultPol

      ```

::: zone-end


::: zone pivot="client-cli"

This quickstart describes how to create a vaulted backup policy for [Azure Data Lake Storage backup](azure-data-lake-storage-backup-overview.md) using Azure CLI.

## Prerequisites

Before you create a vaulted backup policy for Azure Data Lake Storage, ensure that the following prerequisites are met:

- Identify or [create a Backup vault](backup-blobs-storage-account-cli.md#create-a-backup-vault) to configure Azure Data Lake Storage backup.
- Review the [supported scenarios](azure-data-lake-storage-backup-support-matrix.md) for Azure Data Lake Storage backup.

## Configure a vaulted backup policy for Azure Data Lake Storage using Azure CLI

To configure a vaulted backup policy for Azure Date Lake Storage backup, run the following commands:

>[!Important]
>The backup schedule follows the ISO 8601 duration format. However, the repeating interval prefix `R` isn't supported, as backups are configured to run indefinitely. Any value specified with `R` is ignored.

1.	To understand the backup policy components for Azure Data Lake Storage backup, fetch the policy template using the `az dataprotection backup-policy get-default-policy-template` command. The following command returns a default policy template for a given datasource type that you can use to create a new policy.

       ```azurecli-interactive
       az dataprotection backup-policy get-default-policy-template --datasource-type AzureDataLakeStorage > policy.json
       ```
1.	After you save the policy JSON with all the required values, proceed to create a new policy from the policy object using the `az dataprotection backup-policy create` command.

      ```azurecli-interactive
      Az dataprotection backup-policy create -g adlsrg –vault-name TestBkpVault -n AdlsPolicy1  –policy policy.json
      ```

     The following example JSON is defined to configure a policy 30 days default retention for vaulted backup. The vaulted backup is scheduled for every day at 7:30 UTC.

      ```JSON
      {
         "properties": {
            "policyRules": [
                  {
                     "lifecycles": [
                        {
                              "deleteAfter": {
                                 "objectType": "AbsoluteDeleteOption",
                                 "duration": "P30D"
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
                  },
                  {
                     "backupParameters": {
                        "backupType": "Discrete",
                        "objectType": "AzureBackupParams"
                     },
                     "trigger": {
                        "schedule": {
                              "repeatingTimeIntervals": [
                                 "R/2025-10-13T07:00:00+00:00/P1D"
                              ],
                              "timeZone": "Coordinated Universal Time"
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
                        "dataStoreType": "VaultStore",
                        "objectType": "DataStoreInfoBase"
                     },
                     "name": "BackupDaily",
                     "objectType": "AzureBackupRule"
                  }
            ],
            "datasourceTypes": [
                  "Microsoft.Storage/storageAccounts/adlsBlobServices"
            ],
            "objectType": "BackupPolicy"
         },
         "id": "/subscriptions/ xxxxxxxx-xxxx-xxxx-xxxx /resourceGroups/ adlsrg/providers/Microsoft.DataProtection/backupVaults/ TestBkpVault/backupPolicies/AdlsPolicy1",
         "name": "AdlsPolicy1",
         "type": "Microsoft.DataProtection/backupVaults/backupPolicies"
      }
      ```

::: zone-end

## Next steps

- [Configure vaulted backup for Azure Data Lake Storage using Azure portal, PowerShell, Azure CLI](azure-data-lake-storage-configure-backup.md).
- [Restore Azure Data Lake Storage using Azure portal](azure-data-lake-storage-restore.md).
- [Manage vaulted backup for Azure Data Lake Storage using Azure portal](azure-data-lake-storage-backup-manage.md).
- [Troubleshoot Azure Data Lake Storage backup](azure-data-lake-storage-backup-troubleshoot.md). 
 





