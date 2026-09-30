---
title: Include file
description: Include file
services: backup
ms.service: azure-backup
ms.custom:
  - ignite-2024
ms.topic: include
ms.date: 12/10/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
---

## Create a Recovery Services vault

A Recovery Services vault is a management entity that stores recovery points that are created over time. It provides an interface to perform backup-related operations. These operations include taking on-demand backups, performing restores, and creating backup policies.

To create a Recovery Services vault:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for **Resiliency**, and then go to the **Resiliency** dashboard.

    :::image type="content" source="../includes/media/backup-create-rs-vault/search-resiliency.png" alt-text="Screenshot that shows where to search for and select Resiliency." lightbox="../includes/media/backup-create-rs-vault/search-resiliency.png":::

1. On the **Vault** pane, select **+ Vault**.

    :::image type="content" source="./media/backup-create-rs-vault/create-vault.png" alt-text="Screenshot that shows how to start creating a Recovery Services vault." lightbox="./media/backup-create-rs-vault/create-vault.png":::

1. Select **Recovery Services vault** > **Continue**.

    :::image type="content" source="./media/backup-create-rs-vault/backup-center-select-recovery-services-vault.png" alt-text="Screenshot that shows where to select Recovery Services as the vault type.":::

1. On the **Create Recovery Services vault** pane, enter the following values:

   - **Subscription**: Select the subscription to use. If you're a member of only one subscription, you see that name. If you're not sure which subscription to use, use the default subscription. Multiple choices appear only if your work or school account is associated with more than one Azure subscription.
   - **Resource group**: Use an existing resource group or create a new one. To view a list of available resource groups in your subscription, select **Use existing**. Then select a resource in the dropdown list. To create a new resource group, select **Create new**, and then enter the name. For more information about resource groups, see [Azure Resource Manager overview](../articles/azure-resource-manager/management/overview.md).
   - **Vault name**: Enter a friendly name to identify the vault. The name must be unique to the Azure subscription. Specify a name that has at least 2 but not more than 50 characters. The name must start with a letter and consist only of letters, numbers, and hyphens.
   - **Region**: Select the geographic region for the vault. For you to create a vault to help protect any data source, the vault *must* be in the same region as the data source.

      > [!IMPORTANT]
      > If you're not sure of the location of your data source, close the window. Go to the list of your resources in the portal. If you have data sources in multiple regions, create a Recovery Services vault for each region. Create the vault in the first location before you create a vault in another location. You don't need to specify storage accounts to store the backup data. The Recovery Services vault and Azure Backup handle that step automatically.

    :::image type="content" source="./media/backup-create-rs-vault/backup-center-add-vault-details.png" alt-text="Screenshot that shows fields for configuring a Recovery Services vault.":::

1. After you provide the values, select **Review + create**.

1. To finish creating the Recovery Services vault, select **Create**.

   It can take a while to create the Recovery Services vault. Monitor the status notifications in the **Notifications** area at the upper right. After the vault is created, it appears in the list of Recovery Services vaults. If the vault doesn't appear, select **Refresh**.

    :::image type="content" source="./media/backup-create-rs-vault/refresh-button.png" alt-text="Screenshot that shows the button for refreshing the list of backup vaults.":::

Azure Backup now supports immutable vaults that help you ensure that after recovery points are created, they can't be deleted before their expiry according to the backup policy. You can make the immutability irreversible to help protect your backup data from various threats, including ransomware attacks and malicious actors. [Learn more about Azure Backup immutable vaults](/azure/backup/backup-azure-immutable-vault-concept).
