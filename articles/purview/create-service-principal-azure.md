---
title: Create a service principal in Azure
description: This article describes how you can create a service principal in Azure
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 09/15/2021
# Customer intent: As an Azure AD Global Administrator or other roles such as Application Administrator, I need to create a new service principal, in order to register an application in the Azure AD tenant.
ms.custom: ignite-fall-2021
---

# Creating a service principal

You can create a new or use an existing service principal in your Azure Active Directory tenant.

## App registration

1. Navigate to the [Azure portal](https://portal.azure.com).
2. Select **Azure Active Directory** from the left-hand side menu.
:::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-aad.png" alt-text="Screenshot that shows the link to the Azure Active Directory":::

3. Select **App registrations** and **+ New registration**
:::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-new-reg.png" alt-text="Screenshot that shows the link to New registration":::

4. Enter a name for the **application** (the service principal name).

5. Select **Accounts in this organizational directory only**.

6. For **Redirect URI** select **Web** and enter any URL you want; it doesn't have to be real or work.

7. Then select **Register**.
:::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-register.png" alt-text="Screenshot that shows the details for the new app registration":::
:::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-new-app.png" alt-text="Screenshot that shows the newly created application":::

## Adding a secret to the client credentials

1. Select the app from the **App registrations**
:::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-app-select.png" alt-text="Screenshot that shows the app for registration":::

2. Click on the **Add a certificate or secret**
:::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-add-secret.png" alt-text="Screenshot that shows the app ":::

3. Click on the **+ New client secret** under **Client secrets**
:::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-new-client-secret.png" alt-text="Screenshot that shows the client secret menu":::

4. Provide a **Description** and set the **Expires** for the secret
:::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-secret-desc.png" alt-text="Screenshot that shows the client secret details":::
:::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-client-secret.png" alt-text="Screenshot that shows the client secret":::

5. Copy the value of **Client credentials** from **Overview**
:::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-client-cred.png" alt-text="Screenshot that shows the app Overview":::

## Adding the secret to the key vault

1. Navigate to your **Key vault**
:::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-key-vault.png" alt-text="Screenshot that shows the Key vault":::

2. Select **Settings** --> **Secrets** --> **+ Generate/Import**  
:::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-generate-secret.png" alt-text="Screenshot that options in the Key vault":::

3. Enter the **Name** of your choice and **Value** as the **Client secret** from your Service Principal  
:::image type="content" source="media/create-service-principal-azure/create-service-principal-azure-sp-secret.png" alt-text="Screenshot that shows the Key vault to create a secret":::

4. Select **Create** to complete
