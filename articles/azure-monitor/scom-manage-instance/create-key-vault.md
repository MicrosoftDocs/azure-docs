---
ms.assetid: 
title: Create an Azure key vault
description: This article describes how to create a key vault to store domain credentials.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Create an Azure key vault

This article describes how to create a key vault to store domain credentials.

>[!NOTE]
> To learn about the Azure Monitor SCOM Managed Instance architecture, see [Azure Monitor SCOM Managed Instance](overview.md).

## Create a key vault to store secrets

For security, you can store domain account credentials in key vault secrets. Later, you can use these secrets in SCOM Managed Instance creation.

Azure Key Vault is a cloud service that provides a secure store for keys, secrets, and certificates. For more information, see [About Azure Key Vault](/azure/key-vault/general/overview).

1. In the Azure portal, search for and select **Key vaults**.

     :::image type="Key vaults in portal" source="media/create-key-vault/azure-portal-key-vaults-inline.png" alt-text="Screenshot that shows the icon for key vaults in the Azure portal." lightbox="media/create-key-vault/azure-portal-key-vaults-expanded.png":::

   The **Key vaults** page opens.

1. Select **Create**.

     :::image type="Key vault" source="media/create-key-vault/key-vaults-inline.png" alt-text="Screenshot that shows the Create button for creating a key vault." lightbox="media/create-key-vault/key-vaults-expanded.png":::

1. For **Basics**, do the following:
    - **Project details**:
        - **Subscription**: Select the subscription.
        - **Resource group**: Select the resource group you want.
    - **Instance details**:
        - **Key vault name**: Enter the name of your key vault. There are no added restrictions, except for those that apply to names in other Azure services.
        - **Region**: Choose the region that you're going to select for your other resources.
        - **Pricing tier**: Select **Standard** or **Premium** as required.
    - **Recovery options**:
        - **Days to retain deleted vaults**: Enter a value from 7 to 90.
        - **Purge protection**: We recommend enabling this feature to have a mandatory retention period.

   :::image type="Create a key vault" source="media/create-key-vault/create-a-key-vault.png" alt-text="Screenshot that shows basic information for creating a key vault.":::
1. Select **Next**. For now, no change is required in access configuration. Access configuration is done in the [step 5](create-user-assigned-identity.md).

1. For **Networking**, do the following:
    - Select **Enable public access**.
    - Under **Public Access**, for **Allow access from**, select **All networks**.

   :::image type="Networking tab" source="media/create-key-vault/networking-inline.png" alt-text="Screenshot that shows selections for enabling public access on the Networking tab." lightbox="media/create-key-vault/networking-expanded.png":::
1. Select **Next**.
1. For **Tags**, select the tags if required and select **Next**.
1. For **Review + create**, review the selections and select **Create** to create the key vault.
  
    :::image type="Tab for reviewing selections before creating a key vault" source="media/create-key-vault/review.png" alt-text="Screenshot that shows the tab for reviewing selections before you create a key vault.":::

## Next steps

- [Create a user-assigned identity](create-user-assigned-identity.md)