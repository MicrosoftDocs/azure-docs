---
title: Create a service principal in Azure.
description: This article describes how you can create a service principal in Azure for use with Microsoft Purview.
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 03/24/2023
# Customer intent: As an Azure AD Global Administrator or other roles such as Application Administrator, I need to create a new service principal, in order to register an application in the Azure AD tenant.
ms.custom: ignite-fall-2021
---

# Creating a service principal for use with Microsoft Purview

You can create a new or use an existing service principal in your Azure Active Directory tenant to use to authenticate with other services.

## App registration

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Select **Azure Active Directory** from the left-hand side menu.

    :::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-aad.png" alt-text="Screenshot that shows the link to the Azure Active Directory.":::

1. Select **App registrations** and **+ New registration**.

    :::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-new-reg.png" alt-text="Screenshot that shows the link to New registration.":::

1. Enter a name for the **application** (the service principal name).

1. Select **Accounts in this organizational directory only**.

1. For **Redirect URI** select **Web** and enter any URL you want. If you have an authentication endpoint for your organization you want to use, this is the place. Otherwise `https://example.com/auth` will do.

1. Then select **Register**.

    :::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-register.png" alt-text="Screenshot that shows the details for the new app registration.":::

1. Copy the **Application (client) ID** value. We'll use this later to create a credential in Microsoft Purview.

    :::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-new-app.png" alt-text="Screenshot that shows the newly created application.":::

## Adding a secret to the client credentials

1. Select the app from the **App registrations**.

    :::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-app-select.png" alt-text="Screenshot that shows the app for registration.":::

1. Select **Add a certificate or secret**.

    :::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-add-secret.png" alt-text="Screenshot that shows the app.":::

1. Select **+ New client secret** under **Client secrets**.

    :::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-new-client-secret.png" alt-text="Screenshot that shows the client secret menu.":::

1. Provide a **Description** and set the **Expires** for the secret.

    :::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-secret-desc.png" alt-text="Screenshot that shows the client secret details.":::

1. Copy the value of the **Secret value**. We'll use this later to create a secret in Azure Key Vault.

    :::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-client-secret.png" alt-text="Screenshot that shows the client secret.":::

## Adding the secret to your Azure Key Vault

To allow Microsoft Purview to use this service principal to authenticate with other services, you'll need to store this credential in Azure Key Vault.

* If you need an Azure Key vault, you can [follow these steps to create one.](../key-vault/general/quick-create-portal.md)
* To grant your Microsoft Purview account access to the Azure Key Vault, you can [follow these steps](manage-credentials.md#microsoft-purview-permissions-on-the-azure-key-vault).

1. Navigate to your **Key vault**.

    :::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-key-vault.png" alt-text="Screenshot that shows the Key vault.":::

1. Select **Settings** --> **Secrets** --> **+ Generate/Import**

    :::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-generate-secret.png" alt-text="Screenshot that options in the Key vault.":::

1. Enter the **Name** of your choice, and save it to create a credential in Microsoft Purview.

1. Enter the **Value** as the **Secret value** from your Service Principal.

    :::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-sp-secret.png" alt-text="Screenshot that shows the Key vault to create a secret.":::

1. Select **Create** to complete.

## Create a credential for your secret in Microsoft Purview

To enable Microsoft Purview to use this service principal to authenticate with other services, you'll need to follow these three steps.

1. [Connect your Azure Key Vault to Microsoft Purview](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account)
1. [Grant your service principal authentication on your source](microsoft-purview-connector-overview.md) - Follow instructions on each source page to grant appropriate authentication.
1. [Create a new credential in Microsoft Purview](manage-credentials.md#create-a-new-credential) - You'll use the service principal's application (client) ID and the name of the secret you created in your Azure Key Vault.
