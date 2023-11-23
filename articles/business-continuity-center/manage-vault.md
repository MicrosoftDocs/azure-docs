---
title: Manage vault lifecycle used for Azure Backup and Azure Site Recovery
description: In this article, you'll learn how to manage the lifecycle of the vaults (Recovery Services and Backup vault) used for Azure Backup and/or Azure Site Recovery.
ms.topic: how-to
ms.date: 10/18/2023
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Manage vault lifecycle used for Azure Backup and Azure Site Recovery (preview)

Using the Azure Business Continuity center, you can centrally manage the lifecycle of your Recovery Services and Backup vaults for both Azure Backup and Azure Site Recovery. 

This tutorial guides you on how to view your vaults and perform actions related to them using Azure Business Continuity center.

## Prerequisites

Before you start this tutorial:

- Ensure you have the required resource permissions to view them in the ABC center.

## View vaults

Use Azure Business Continuity center to view all your existing Recovery Services and Backup vaults from a single location and manage their lifecycle as needed.

Follow these steps:

1.	In the Azure Business Continuity center, select **Vaults** under **Manage**. 
    In this view you can see a list of all the vaults across subscription, resource groups, location, type, and more, along with their properties. 
    :::image type="content" source="./media/manage-vault/view-vaults.png" alt-text="Screenshot showing vaults page." lightbox="./media/manage-vault/view-vaults.png":::

3.	Azure Backup provides security features to help protect backed up data in a vault. These settings can be configured at a vault level. You can find the configured [security settings](../backup/guidance-best-practices.md#security-considerations) for each vault within Azure Backup solution under the [**Security level**](../backup/backup-encryption.md) displayed beside each vault.
    :::image type="content" source="./media/manage-vault/security-level.png" alt-text="Screenshot showing security level page." lightbox="./media/manage-vault/security-level.png":::
 
1.	You can select the vault name or the ellipsis (`...`) icon to view the action menu for the vault and navigate to view further details of the vault. See the support matrix for a detailed list of supported and unsupported scenarios for actions on vaults.
    :::image type="content" source="./media/manage-vault/view-vault-details.png" alt-text="Screenshot showing options to see vault details." lightbox="./media/manage-vault/view-vault-details.png":::
 
5.	To look for specific vaults, you can use various filters, such as subscriptions, resource groups, location, and vault type, and etc. 
    :::image type="content" source="./media/manage-vault/vault-filter.png" alt-text="Screenshot showing vault filtering page." lightbox="./media/manage-vault/vault-filter.png":::
 
6.	You can also search by the vault name to get specific information.
 
7.	You can use **Select columns** to add or remove columns. 
    :::image type="content" source="./media/manage-vault/select-columns.png" alt-text="Screenshot showing *select columns* option." lightbox="./media/manage-vault/select-columns.png":::
 

## Modify security level

Follow these steps to modify the security level for a vault using Azure Business Continuity center:

1.	On the **Vaults** pane, select the security level value for a vault.
    :::image type="content" source="./media/manage-vault/security-level-option.png" alt-text="Screenshot showing the security level option." lightbox="./media/manage-vault/security-level-option.png":::
 
2.	On the vault properties page, modify the [security settings](../backup/backup-azure-enhanced-soft-delete-about.md) as required. It can take a while to get the security levels updated in Azure Business Continuity center.  
    :::image type="content" source="./media/manage-vault/modify-settings.png" alt-text="Screenshot showing vaults settings page." lightbox="./media/manage-vault/modify-settings.png":::
    > [!NOTE]
    > When you modify the security settings for a vault, Azure Backup applies the changes to all the protected datasources in that vault.


## Next steps

- [Create policy](./backup-protection-policy.md)
- [Configure protection from ABC center](./tutorial-configure-protection-datasource.md).
