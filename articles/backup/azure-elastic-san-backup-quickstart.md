---
title: Quickstart - Create an operational backup policy for Azure Elastic SAN volume by using the Azure portal or Azure CLI
description: Learn how to create an operational backup policy for Azure Elastic SAN volume by using the Azure portal or Azure CLI.
zone_pivot_groups: backup-client-portal-cli
ms.topic: quickstart
ms.date: 09/17/2026
ms.custom: devx-track-azurecli
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As an IT administrator, I want to quickly create an operational backup policy for Azure Elastic SAN volume, so that I can use it to protect Elastic SAN volumes."
---

# Quickstart: Create an operational backup policy for Azure Elastic SAN volume by using the Azure portal or Azure CLI

Create an operational backup policy to define the schedule and retention duration for Azure Elastic SAN volume recovery points.

::: zone pivot="client-portal"

This quickstart describes how to create an operational backup policy for Azure Elastic SAN volume by using Azure portal. After completing these steps, you can configure and manage backup settings for your Elastic SAN resources.

## Prerequisites

Before you start creating an operational backup policy for Azure Elastic SAN volume by using the Azure portal, ensure that you meet the following prerequisites:

- Use an existing Backup vault, or [create one](create-manage-backup-vault.md#create-backup-vault).
- Reviewed the [supported scenarios and limitations](azure-elastic-san-backup-support-matrix.md).

## Create an operational backup policy by using the Azure portal

1. In the [Azure portal](https://portal.azure.com/), go to **Resiliency** > **Protection policies**.
1. Select **+ Create Policy** > **Create Backup Policy**.
1. On the **Create Backup Policy** pane, on the **Basics** tab, enter a name for the policy, and then select **Elastic SAN volumes** as the datasource type.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-configure/create-policy.png" alt-text="Screenshot that shows how to start creating a backup policy." lightbox="./media/azure-elastic-storage-area-network-backup-configure/create-policy.png":::

1. On the **Schedule + retention** tab, under the **Backup schedule** section, set the schedule for creating recovery points for backups.

   > [!NOTE]
   > Azure Backup supports **Daily** and **Weekly** backup frequency. **Daily** backup is selected by default.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-configure/set-backup-schedule.png" alt-text="Screenshot that shows how to configure the backup schedule." lightbox="./media/azure-elastic-storage-area-network-backup-configure/set-backup-schedule.png":::

1. Under **Retention settings**, edit the default retention rule or add a new rule to specify retention for recovery points.

   > [!NOTE]
   > - The default retention duration for recovery points is **7 days**.
   > - A maximum of **450** recovery points are retained at any point in time across your retention rules.

1. Select **Review + create**.
1. After validation succeeds, select **Create**.

::: zone-end

::: zone pivot="client-cli"

This quickstart describes how to create an operational backup policy for Azure Elastic SAN by using Azure CLI. After completing these steps, you can configure and manage backup settings for your Elastic SAN resources.

## Prerequisites

Before you start creating an operational backup policy for Azure Elastic SAN volume by using Azure CLI, ensure that you meet the following prerequisites:

- Use an existing Backup vault, or [create one](create-manage-backup-vault.md#create-backup-vault).
- Reviewed the [supported scenarios and limitations](azure-elastic-san-backup-support-matrix.md).
- Verify that you use the Azure CLI and the dataprotection extension 1.12.0 or later.

## Install Azure CLI and dataprotection extension

To install or update the dataprotection extension, run the following command:

```azurecli-interactive
az extension add --name dataprotection --upgrade
```

## Sign in to Azure CLI

To sign in to the Azure CLI and select the subscription, run the following command:

```azurecli-interactive
az login
az account set --subscription "<subscription_id>"
```

## Set variables to create a backup policy for Azure Elastic SAN volume by using Azure CLI 

To set the resource group, Backup vault, and Elastic SAN backup policy values for your environment, update the corresponding variables and run the following command:

```azurecli-interactive
resourceGroupName="<resource_group>"
vaultName="<backup_vault_name>"
policyName="<esan_policy_name>"
```

## Create an operational backup policy for Azure Elastic SAN volume by using Azure CLI

To create an operational backup policy for Azure Elastic SAN, run the following commands:

1. Generate the default Elastic SAN backup policy template.

    ```azurecli-interactive
    az dataprotection backup-policy get-default-policy-template \
        --datasource-type AzureElasticSAN \
        > esan_policy.json
    ```

1. Create the backup policy in the Backup vault.

    ```azurecli-interactive
    az dataprotection backup-policy create \
        --resource-group $resourceGroupName \
        --vault-name $vaultName \
        --name $policyName \
        --policy esan_policy.json
    ```

::: zone-end

## Next step

- [Configure operational backup for Azure Elastic SAN volume by using the Azure portal or Azure CLI](azure-elastic-san-backup-configure.md).
