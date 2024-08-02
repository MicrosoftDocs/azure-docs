---
title: "Tutorial: Back up an Azure Extended Zone VM"
description: Learn how to back up a virtual machine (VM) in Azure Extended Zones using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: azure-extended-zones
ms.topic: tutorial
ms.date: 08/02/2024
---

# Tutorial: Back up an Azure Extended Zone virtual machine

> [!IMPORTANT]
> Azure Extended Zones service is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

You can protect your data by taking backups at regular intervals. Azure Backup creates recovery points that can be stored in geo-redundant recovery vaults. In this article, you learn how to back up an existing virtual machine (VM) using the Azure portal.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a Recovery Services vault.
> - Apply a backup policy to an Extended Zone VM.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An Azure virtual machine (VM) in an Extended Zone. For more information, see [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md).

## Create a Recovery Services vault

A Recovery Services vault is a management entity that stores recovery points that are created over time, and it provides an interface to perform backup-related operations. These operations include taking on-demand backups, performing restores, and creating backup policies. In this section, you create a Recovery Services vault.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter ***backup***. Select **Backup center** from the search results.

    :::image type="content" source="./media/backup-virtual-machine/portal-search.png" alt-text="Screenshot that shows how to search for Backup center in the Azure portal." lightbox="./media/backup-virtual-machine/portal-search.png":::

1. On the **Overview** page, select **+ Vault**.

    :::image type="content" source="./media/backup-virtual-machine/backup-center-vault.png" alt-text="Screenshot that shows how to create a vault from the Backup center in the Azure portal." lightbox="./media/backup-virtual-machine/backup-center-vault.png":::

1. On the **Start: Create Vault** page, select **Recovery Services vault** and then select **Continue**.

    :::image type="content" source="./media/backup-virtual-machine/create-vault.png" alt-text="Screenshot that shows how to create a Recovery Services vault in the Azure portal." lightbox="./media/backup-virtual-machine/create-vault.png":::

1. On the **Basics** tab of **Create Recovery Services vault**, enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. |
    | **Instance Details** |  |
    | Vault name | Enter *myVault*. |
    | Region | Select **West US**. Recovery Services vault can only be created in an Azure region and not in an Azure Extended Zone. |

    :::image type="content" source="./media/backup-virtual-machine/create-vault-basics.png" alt-text="Screenshot that shows the Basics tab of creating a Recovery Services vault in the Azure portal." lightbox="./media/backup-virtual-machine/create-vault-basics.png":::

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

## Apply a backup policy

1. On the **Overview** page of **Backup center**, select **+ Backup**.

    :::image type="content" source="./media/backup-virtual-machine/backup-center-backup.png" alt-text="Screenshot that shows how to create a backup from the Backup center in the Azure portal." lightbox="./media/backup-virtual-machine/backup-center-backup.png":::

1. On **Start: Configure Backup** page, select the following information:

    | Setting | Value |
    | --- | --- |
    | **Datasource type** |  |
    | Datasource type | Select **Azure virtual machines**. |
    | Vault | Select **myVault**. You'll use this Recovery Services vault to store your VM backups. |

    :::image type="content" source="./media/backup-virtual-machine/configure-backup-vault.png" alt-text="Screenshot that shows how to select the Recovery Services vault." lightbox="./media/backup-virtual-machine/configure-backup-vault.png":::

1. Select **Continue**.

1. On **Configure backup** page, select **Enhanced** to choose the Enhanced policy, then select **Add** to add the virtual machines that you want to backup using this policy.

    :::image type="content" source="./media/backup-virtual-machine/configure-backup.png" alt-text="Screenshot that shows how to add virtual machines to the backup policy." lightbox="./media/backup-virtual-machine/configure-backup.png":::

1. Select **Enable backup**.

## Clean up resources

When no longer needed, delete the resource group and the resources it contains:

1. In the search box at the top of the portal, enter ***myResourceGroup***. Select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. In **Delete a resource group**, enter ***myResourceGroup***, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

## Related content

- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Frequently asked questions](faq.md)
