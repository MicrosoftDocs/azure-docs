---
title: Create vaults to back up and replicate resources
description: In this article, you learn how to create Recovery Services vault (or Backup vault) that stores backups and replication data.
ms.topic: how-to
ms.date: 10/18/2023
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Create a vault to back up and replicate resources (preview)

This article explains how to create Recovery Services vault (or Backup vault) that stores backups and replication data. Vault is required to configure protection with Azure Backup and Azure Site Recovery.

A [Recovery Services](../backup/backup-azure-recovery-services-vault-overview.md) vault is a management entity that stores recovery points that are created over time, and it provides an interface to perform backup-related and replication related operations. For certain newer workloads, Azure Backup also uses [Backup vault](../backup/backup-vault-overview.md) to store recovery points and interface for operations. [Learn about](../backup/guidance-best-practices.md#vault-considerations) on the guidelines when creating a vault.

## Create vault

Follow these steps to create a vault:

1.	In the Azure Business Continuity center, select **Vaults** under **Manage**. 
    :::image type="content" source="./media/backup-vaults/vaults.png" alt-text="Screenshot showing vaults page." lightbox="./media/backup-vaults/vaults.png":::
 
2.	On the **Vaults** pane, select **+Vault**.
    :::image type="content" source="./media/backup-vaults/create-vault.png" alt-text="Screenshot showing **+Vault** options." lightbox="./media/backup-vaults/create-vault.png":::
 
3.	Select the type of vault you want to create. You have two options:
    1. [Recovery Services vaults](../backup/backup-azure-recovery-services-vault-overview.md) to hold backup data for various Azure services such as IaaS VMs (Linux or Windows) and SQL Server in Azure VMs. Recovery Services vaults support System Center DPM, Windows Server, Azure Backup Server, and replication data for Azure Site Recovery. 
    1. [Backup vaults](../backup/backup-vault-overview.md) to hold backup data for various Azure services, such Azure Database for PostgreSQL servers and newer workloads that Azure Backup supports.
    :::image type="content" source="./media/backup-vaults/select-vault-type.png" alt-text="Screenshot showing different vault options." lightbox="./media/backup-vaults/select-vault-type.png":::
 
4.	Select **Continue** to go to the specific configuration page based on the selected vault type.
    For example, if you choose **Recovery Services vault**, it opens the **Create Recovery Services vault** page. Choosing **Backup vault** opens the **Create Backup Vault** page. 
1. Complete the workflow. After the vault is created, it appears in the list of vaults in the ABC center. If the vault doesn't appear, select **Refresh**.
    >[!NOTE]
    > It can take a while to create the vault. Monitor the status notifications in the **Notifications** pane at the top of the page.

## Next steps
 
- [Create protection policies](./backup-protection-policy.md)
- [Manage vaults](./manage-vault.md)
