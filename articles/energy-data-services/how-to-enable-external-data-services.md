---
title: Enable External Data Services in Azure Data Manager for Energy
description: Learn how to enable External Data Services (EDS) to pull metadata from OSDU-compliant external data sources into Azure Data Manager for Energy.
author: bharathim
ms.author: bselvaraj
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 03/05/2025
ms.custom: template-how-to
---

# Enable External Data Services (EDS) in Azure Data Manager for Energy

This article describes how to enable External Data Services (EDS) in Azure Data Manager for Energy. EDS allows you to pull metadata from OSDU-compliant external data sources into Azure Data Manager for Energy. 

Azure resources can use a [managed identity](/entra/identity/managed-identities-azure-resources/overview) to authenticate to other services without storing credentials in code. Use either a system-assigned or user-assigned managed identity to enable the EDS secret service to access secrets stored in your Azure Key Vault.

## Prerequisites

- An active Azure subscription. [Create a subscription for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Data Manager for Energy resource. [Create an Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).

## Create or configure a Key Vault

Use an Azure Key Vault to store secrets managed by the secret service.

1. Create a new Key Vault or use an existing one. To learn how to create a Key Vault, see [Quickstart: Create a key vault using the Azure portal](/azure/key-vault/general/quick-create-portal).

   > [!IMPORTANT]
   > Your Key Vault must exist in the same tenant as your Azure Data Manager for Energy resource. When you create the Key Vault, select [Enable purge protection (enforce a mandatory retention period for deleted vaults and vault objects)](/azure/key-vault/general/key-vault-recovery?tabs=azure-portal#what-are-soft-delete-and-purge-protection).

1. In the **Access configuration** tab, under **Permission model**, select **Azure role-based access control (recommended)**.
   :::image type="content" source="media/how-to-enable-external-data-services/create-a-key-vault.jpg" lightbox="media/how-to-enable-external-data-services/create-a-key-vault.jpg" alt-text="Screenshot showing the Access configuration tab with Permission model set to Azure role-based access control.":::

1. Select **Review + create** to create the key vault.

## Grant user-assigned managed identity permissions to the Key Vault

Use the following steps to grant a user-assigned managed identity with permissions to the Key Vault.

1. In the Azure portal, go to your Key Vault.
1. Select **Access control (IAM)** from the left menu and select **+ Add** > **Add role assignment**.
   :::image type="content" source="media/how-to-enable-external-data-services/key-vault-add-role-assignment.png" alt-text="Screenshot of adding role assignment to key vault." lightbox="media/how-to-enable-external-data-services/key-vault-add-role-assignment.png":::

1. On the **Role** tab, select **Job function roles**, search for and select **Key Vault Secrets User**, and then select **Next**.
   :::image type="content" source="media/how-to-enable-external-data-services/key-vault-secrets-user-selection.png" alt-text="Screenshot of selecting Key Vault Secrets User role." lightbox="media/how-to-enable-external-data-services/key-vault-secrets-user-selection.png":::

   > [!NOTE]
   > Use **Key Vault Secrets Officer** role when you want to allow the managed identity to manage secrets in addition to reading them.
    
1. On the **Members** tab, select **Managed identity** for **Assign access to**.
1. Select **+ Select members**.
1. Select **User-assigned managed identity** on the **Managed identity** dropdown.
1. Select the user-assigned managed identity, and select **Select**.
   :::image type="content" source="media/how-to-enable-external-data-services/select-a-user-assigned-managed-identity.png" alt-text="Screenshot of selecting a user-assigned managed identity." lightbox="media/how-to-enable-external-data-services/select-a-user-assigned-managed-identity.png":::

1. Select **Review + assign** to complete the role assignment.
   :::image type="content" source="media/how-to-enable-external-data-services/key-vault-review-and-assign.png" alt-text="Screenshot of review and assign of role assignment to key vault." lightbox="media/how-to-enable-external-data-services/key-vault-review-and-assign.png":::

## Grant system-assigned managed identity permissions to the Key Vault

Use the following steps if you're using a system-assigned managed identity instead.

1. In the Azure portal, go to your Key Vault.
1. Select **Access control (IAM)** from the left menu.
1. Select **+ Add** > **Add role assignment**.
1. On the **Role** tab, select **Job function roles**, search for and select **Key Vault Secrets User**, and then select **Next**.
1. On the **Members** tab, select **User, group, or service principal** for **Assign access to**.
1. Select **+ Select members**.
1. Search for your Azure Data Manager for Energy instance, select it, and select **Select**.
   :::image type="content" source="media/how-to-enable-external-data-services/select-a-system-assigned-managed-identity.png" alt-text="Screenshot of selecting a system-assigned managed identity." lightbox="media/how-to-enable-external-data-services/select-a-system-assigned-managed-identity.png":::
1. Select **Review + assign** to complete the role assignment.

## Enable External Data Services in Azure Data Manager for Energy

Use the following steps to enable External Data Services in your Azure Data Manager for Energy resource.

1. Go to your Azure Data Manager for Energy resource in the Azure portal.
1. In the left menu, under **Advanced**, select **External Data Services**.
1. Select the checkbox to **Enable External Data Services**.
1. Select **Select a Key Vault** to open the form. Select the subscription and the Key Vault you created earlier, and then select **Add**.
   :::image type="content" source="media/how-to-enable-external-data-services/external-data-services-select-a-key-vault.png" alt-text="Screenshot of selecting a Key Vault for External Data Services." lightbox="media/how-to-enable-external-data-services/external-data-services-select-a-key-vault.png":::
1. Under **Managed identity type**, select **User-assigned managed identity** or **System-assigned managed identity**.
1. If you select **User-assigned managed identity**, select **Select user assigned managed identity** to open the form. Select the subscription and managed identity, and then select **Add**.
   :::image type="content" source="media/how-to-enable-external-data-services/external-data-services-select-a-user-assigned-managed-identity.png" alt-text="Screenshot of selecting a user-assigned managed identity for External Data Services." lightbox="media/how-to-enable-external-data-services/external-data-services-select-a-user-assigned-managed-identity.png":::
1. Select **Save** to apply the configuration.
   :::image type="content" source="media/how-to-enable-external-data-services/external-data-services-save-configuration.png" alt-text="Screenshot of saving the External Data Services configuration." lightbox="media/how-to-enable-external-data-services/external-data-services-save-configuration.png":::

## Next steps

- [How to register an external data services with Azure Data Manager for Energy?](how-to-register-external-data-services.md)
- [External data services FAQ](faq-energy-data-services.yml#external-data-services)
