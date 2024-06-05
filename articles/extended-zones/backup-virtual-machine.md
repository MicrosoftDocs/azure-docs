---
title: Back up a virtual machine in Azure Extended Zones
description: Learn how to back up a virtual machine in Azure Extended Zones using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: azure
ms.topic: how-to #Required; leave this attribute/value as-is
ms.date: 06/05/2024

---

# Back up a virtual machine in Azure Extended Zones

You can protect your data by taking backups at regular intervals. Azure Backup creates recovery points that can be stored in geo-redundant recovery vaults. In this article, you learn how to back up an existing virtual machine (VM) using the Azure portal.

## Prerequisites

- An Azure account with an active subscription.
- An Azure VM in an Extended Zone.


## Create a Recovery Services vault

A Recovery Services vault is a management entity that stores recovery points that are created over time, and it provides an interface to perform backup-related operations. These operations include taking on-demand backups, performing restores, and creating backup policies. In this section, you create a Recovery Services vault.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter ***backup***. Select **Backup center** from the search results.

    :::image type="content" source="./media/backup-virtual-machine/portal-search.png" alt-text="Screenshot that shows how to search for Backup center in the Azure portal." lightbox="./media/backup-virtual-machine/portal-search.png":::

1. On the **Overview** page, select **+ Vault**.

    :::image type="content" source="./media/backup-virtual-machine/backup-center.png" alt-text="Screenshot that shows the Backup center in the Azure portal." " lightbox="./media/backup-virtual-machine/backup-center.png":::

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
