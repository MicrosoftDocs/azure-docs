---
title: Restore Azure Elastic SAN volume backup by using the Azure portal or Azure CLI
description: Learn how to restore Azure Elastic SAN volume backup by using the Azure portal or Azure CLI.
zone_pivot_groups: backup-client-portal-cli
ms.topic: how-to
ms.date: 09/17/2026
ms.custom: devx-track-azurecli
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a cloud administrator, I want to restore backups of Azure Elastic SAN, so that I can ensure data recovery and business continuity in case of data loss.
---

# Restore an Azure Elastic SAN volume backup by using the Azure portal or Azure CLI

::: zone pivot="client-portal"

This article describes how to restore an Elastic SAN volume backup by using the Azure portal.

## Prerequisites

Before you restore an Elastic SAN volume backup by using the Azure portal, ensure that you meet the following prerequisites:

- Use a protected Elastic SAN backup instance with at least one recovery point.
- Use a target Elastic SAN instance and volume group for the restored volume.
- Check that the Elastic SAN volume size is **16 TB or less**.
- Review the [supported scenarios, limitations, and region availability](azure-elastic-san-backup-support-matrix.md) for Elastic SAN volume operational backup and restore.

## Restore the Elastic SAN volume backup by using the Azure portal

To restore the Elastic SAN volume backup, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to **Resiliency**, and select **Recover**.
1. On the **Recover** pane, select **Datasource type** as **Elastic SAN volumes**, and under **Protected item**, select **Select**.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-restore/select-protected-item.png" alt-text="Screenshot that shows the selection of datasource type." lightbox="./media/azure-elastic-storage-area-network-backup-restore/select-protected-item.png":::

1. On the **Select protected item** pane, select the Elastic SAN instance that you want to restore, and select **Select**.
1. On the **Recover** pane, select **Continue**.
1. On the **Restore** pane, on the **Restore point** tab, under **Restore point**, select **Select restore point**.
1. On the **Select restore point** pane, select the required restore point from the list.
1. On the **Restore** pane, on the **Restore parameters** tab, select **Select** to specify the restore configuration parameters.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-restore/set-restore-parameter.png" alt-text="Screenshot that shows how to configure restore." lightbox="./media/azure-elastic-storage-area-network-backup-restore/set-restore-parameter.png":::

1. On the **Restore configuration** pane, select the **Target subscription**, **Resource group**, **Target Elastic SAN instance**, and **Target Elastic SAN volume group**.
1. Under **Target volume details**, select the volumes you want to restore.
1. Under **Volume name**, enter a name for the volume to create, and select **Select**.

   > [!IMPORTANT]
   > - An Elastic SAN volume name, once assigned, can't be changed.
   > - You can't overwrite an existing volume. If a volume with the same name exists, the restore operation fails.

1. On the **Restore** pane, on the **Restore parameters** tab, select **Validate** to verify that Azure Backup has the required permissions to restore the selected backup to the target Elastic SAN volume. 

   Validation checks the restore prerequisites and identifies any missing permissions before you start the restore operation.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-restore/validate-restore-configuration.png" alt-text="Screenshot that shows how to validate missing roles for the restore operation." lightbox="./media/azure-elastic-storage-area-network-backup-restore/validate-restore-configuration.png":::

   Validation errors appear if the selected Backup vault's managed identity doesn't have the **Elastic SAN Volume Importer** and **Reader (on the snapshot resource group)** roles assigned.

1. To assign the required roles, select **Assign missing roles**.

   > [!NOTE]
   > If you don't have **Role-Based Access Control Administrator** permissions, the **Assign missing roles** option is disabled.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-restore/assign-missing-roles.png" alt-text="Screenshot that shows how to assign missing roles for the restore operation." lightbox="./media/azure-elastic-storage-area-network-backup-restore/assign-missing-roles.png":::

1. On the **Grant missing permissions** pane, select the scope at which the access permissions must be granted, and then select **Next**.
1. When the role assignment is complete, on the **Restore** pane, on the **Restore parameter** tab, select **Validate**.
1. On the **Review + restore** tab, select **Restore** to start the restore operation.

You can [track the progress of restore](azure-elastic-san-backup-manage.md#view-the-elastic-san-volume-backup-and-restore-jobs-by-using-the-azure-portal) under **Backup Jobs**.

::: zone-end

::: zone pivot="client-cli"

This article describes how to restore an Elastic SAN volume backup by using Azure CLI.

## Prerequisites

Before you restore an Elastic SAN volume backup by using Azure CLI, ensure that you meet the following prerequisites:

- Verify that you use the Azure CLI and the dataprotection extension 1.12.0 or later.
- Check that the protected Elastic SAN backup instance has at least one recovery point.
- Use a target Elastic SAN instance and volume group for the restored volume.

## Sign in to Azure CLI

To sign in and select a subscription to restore an Azure Elastic SAN volume, run the following command:

```azurecli-interactive
az login
az account set --subscription "<subscription_id>"
```

## Set variables for Azure Elastic SAN volume restore by using Azure CLI

To set the variables for Azure Elastic SAN volume restore for your environment, update the configuration values and run the following command:

```azurecli-interactive
sub="<subscription_id>"
rg="<resource_group>"
vault="<backup_vault_name>"
location="<region>"
esanName="<target_elastic_san_name>"
vgName="<target_volume_group_name>"
volume="<source_volume>"
restoreVol="<restored_volume>"

vgId="/subscriptions/$sub/resourceGroups/$rg/providers/Microsoft.ElasticSan/elasticSans/$esanName/volumeGroups/$vgName"
snapshotRgId="/subscriptions/$sub/resourceGroups/$rg"
```

## Restore the Elastic SAN volume backup by using Azure CLI

To restore the Azure Elastic SAN volume backup by using Azure CLI, run the following commands: 

1. Resolve the backup instance and recovery point.

    ```azurecli-interactive
    biName=$(az dataprotection backup-instance list \
        --resource-group $rg \
        --vault-name $vault \
        --query "[?contains(properties.friendlyName, 'esan-bi')].name | [0]" \
        --output tsv)

    rpId=$(az dataprotection recovery-point list \
        --resource-group $rg \
        --vault-name $vault \
        --backup-instance-name $biName \
        --query "[0].name" \
        --output tsv)
    ```

1. Create the restore configuration.

    ```azurecli-interactive
    az dataprotection backup-instance initialize-restoreconfig \
        --datasource-type AzureElasticSAN \
        --resource-identifiers $volume \
        --resource-name-overrides "{\"$volume\":\"$restoreVol\"}" \
        > esan_restore_config.json
    ```

1. Initialize the restore request.

    ```azurecli-interactive
    az dataprotection backup-instance restore initialize-for-item-recovery \
        --datasource-type AzureElasticSAN \
        --source-datastore OperationalStore \
        --restore-location $location \
        --recovery-point-id $rpId \
        --target-resource-id $vgId \
        --restore-configuration @esan_restore_config.json \
        > esan_restore_request.json
    ```

1. Grant restore permissions.

    ```azurecli-interactive
    az dataprotection backup-instance update-msi-permissions \
        --datasource-type AzureElasticSAN \
        --operation Restore \
        --permissions-scope Resource \
        --resource-group $rg \
        --vault-name $vault \
        --restore-request-object @esan_restore_request.json \
        --snapshot-resource-group-id $snapshotRgId \
        --yes
    ```

1. Validate the restore request.

    ```azurecli-interactive
    az dataprotection backup-instance validate-for-restore \
        --resource-group $rg \
        --vault-name $vault \
        --backup-instance-name $biName \
        --restore-request-object @esan_restore_request.json
    ```
1. Trigger restore.

    ```azurecli-interactive
    az dataprotection backup-instance restore trigger \
        --resource-group $rg \
        --vault-name $vault \
        --backup-instance-name $biName \
        --restore-request-object @esan_restore_request.json
    ```

::: zone-end

## Next step

[Manage Azure Elastic SAN volume backup by using the Azure portal or Azure CLI](azure-elastic-san-backup-manage.md).
