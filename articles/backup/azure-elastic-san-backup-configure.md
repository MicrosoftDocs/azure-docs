---
title: Configure operational backup for Azure Elastic SAN volume by using the Azure portal or Azure CLI
description: Learn how to configure operational backup for Azure Elastic SAN volume by using the Azure portal or Azure CLI.
zone_pivot_groups: backup-client-portal-cli
ms.topic: how-to
ms.date: 09/17/2026
ms.custom: devx-track-azurecli
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As an IT administrator, I want to configure backup for Azure Elastic SAN, so that I can ensure data protection and recovery for my storage resources."
---

# Configure operational backup for Azure Elastic SAN volume by using the Azure portal or Azure CLI

::: zone pivot="client-portal"

This article describes how to configure operational backup for Azure Elastic SAN volume by using the Azure portal.

## Prerequisites

Before you configure operational backup for an Azure Elastic SAN volume by using the Azure portal, ensure that you meet the following prerequisites:

- Use an existing Elastic SAN volume, or [create a new one](/azure/storage/elastic-san/elastic-san-create?tabs=azure-portal).
- Check if the Elastic SAN volume is present in a [supported region](azure-elastic-san-backup-support-matrix.md#supported-regions).
- Verify if the Elastic SAN volume size is **16 TB or less**.
- Use an existing Backup vault in the subscription that's the same as the Elastic SAN volume, or [create a new one](create-manage-backup-vault.md#create-backup-vault).
- Use an Elastic SAN backup policy. To create one, see [Quickstart: Create an operational backup policy for Azure Elastic SAN volume](azure-elastic-san-backup-quickstart.md).

For more information about the supported scenarios, limitations, and availability of Azure Elastic SAN volume operational backup, see the [support matrix](azure-elastic-san-backup-support-matrix.md).

[!INCLUDE [Configure Azure Elastic SAN backup](../../includes/azure-elastic-san-configure-backup.md)]

## Next steps

- [Run an on-demand backup for Azure Elastic SAN volume by using the Azure portal and Azure CLI](azure-elastic-san-backup-manage.md?pivots=client-portal#run-an-on-demand-backup-for-azure-elastic-san-volume-by-using-the-azure-portal).
- [Restore Azure Elastic SAN volume backup by using the Azure portal or Azure CLI](azure-elastic-san-backup-restore.md?pivots=client-portal).
- [Manage Azure Elastic SAN volume backup by using the Azure portal or Azure CLI](azure-elastic-san-backup-manage.md?pivots=client-portal).


::: zone-end

::: zone pivot="client-cli"

This article describes how to configure operational backup for Azure Elastic SAN volume by using Azure CLI.

## Prerequisites

Before you configure operational backup for an Azure Elastic SAN volume by using Azure CLI, ensure that you meet the following prerequisites:

- Use an existing Elastic SAN volume, or [create a new one](/azure/storage/elastic-san/elastic-san-create?tabs=azure-portal).
- Check if the Elastic SAN volume is present in a [supported region](azure-elastic-san-backup-support-matrix.md#supported-regions).
- Verify if the Elastic SAN volume size is **16 TB or less**.
- Use an existing vault in the subscription that's the same as the Elastic SAN volume, or [create a new one](create-manage-backup-vault.md#create-backup-vault).
- Use an Elastic SAN backup policy. To install the Azure CLI extension and create a new backup policy, see [Quickstart: Create an operational backup policy for Azure Elastic SAN volume by using Azure CLI](azure-elastic-san-backup-quickstart.md?pivots=client-cli).
- Verify that you use the Azure CLI and the dataprotection extension 1.12.0 or later.

## Configure operational backup for Azure Elastic SAN volume by using Azure CLI

To configure operational backup for an Azure Elastic SAN volume by using Azure CLI, run the following commands:

1. Create a backup configuration for the Elastic SAN volume.

    ```azurecli-interactive
    az dataprotection backup-instance initialize-backupconfig \
        --datasource-type AzureElasticSAN \
        --resource-selectors $volume \
        > esan_backup_config.json
    ```

1. Initialize the backup instance.

    ```azurecli-interactive
    az dataprotection backup-instance initialize \
        --datasource-type AzureElasticSAN \
        --datasource-location $location \
        --datasource-id $vgId \
        --policy-id $policyId \
        --friendly-name esan-bi \
        --backup-configuration @esan_backup_config.json \
        > esan_backup_instance.json
    ```

1. Grant the Backup vault managed identity the required permissions.

    ```azurecli-interactive
    az dataprotection backup-instance update-msi-permissions \
        --datasource-type AzureElasticSAN \
        --operation Backup \
        --permissions-scope Resource \
        --resource-group $rg \
        --vault-name $vault \
        --backup-instance @esan_backup_instance.json \
        --yes
    ```

1. Validate backup readiness.

    ```azurecli-interactive
    az dataprotection backup-instance validate-for-backup \
        --resource-group $rg \
        --vault-name $vault \
        --backup-instance @esan_backup_instance.json
    ```

1. Enable backup.

    ```azurecli-interactive
    az dataprotection backup-instance create \
        --resource-group $rg \
        --vault-name $vault \
        --backup-instance @esan_backup_instance.json
    ```

## Next steps

- [Run an on-demand backup for Azure Elastic SAN volume by using the Azure portal and Azure CLI](azure-elastic-san-backup-manage.md?pivots=client-cli#run-an-on-demand-backup-for-azure-elastic-san-volume-backup-by-using-azure-cli).
- [Restore Azure Elastic SAN volume backup by using the Azure portal or Azure CLI](azure-elastic-san-backup-restore.md?pivots=client-cli).
- [Manage Azure Elastic SAN volume backup by using the Azure portal or Azure CLI](azure-elastic-san-backup-manage.md?pivots=client-cli).


::: zone-end

