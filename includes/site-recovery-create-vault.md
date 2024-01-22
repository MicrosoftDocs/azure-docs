---
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: include
ms.date: 01/30/2023
ms.author: ankitadutta
---

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Marketplace** search for **Backup and Site Recovery**
1. In the **Create Recovery Services vault** page, do the following:
    1. Under **Subscription**, select the appropriate subscription name.
    1. [Create a resource group](../articles/azure-resource-manager/templates/deploy-portal.md), or select an existing one. 
    1. Under **Vault name**, specify a friendly name to identify the vault. 
    1. Under **Region**, specify an Azure region.
    1. Select **Review + create** to finish. 
1. To quickly access the vault from the dashboard, click **Pin to dashboard** > **Create**.

   ![Screenshot of the Recovery Services vault creation options.](./media/site-recovery-create-vault/new-vault-settings.png)

   The new vault will appear on the **Dashboard** > **All resources**, and on the main **Recovery Services vaults** page.
