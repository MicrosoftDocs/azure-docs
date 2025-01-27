---
title: Secure authentication secrets in Azure Key Vault for Azure Static Web Apps
description: Use managed identity to secure authentication secrets in Azure Key Vault for Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: azure-static-web-apps
ms.topic: how-to
ms.date: 06/25/2024
ms.author: cshoe
---

# Secure authentication secrets in Azure Key Vault for Azure Static Web Apps

When configuring custom authentication providers, you may want to store connection secrets in Azure Key Vault. This article demonstrates how to use a managed identity to grant Azure Static Web Apps access to Key Vault for custom authentication secrets.

> [!NOTE]
> Azure Serverless Functions do not support direct Key Vault integration. If you require Key Vault integration with your managed Function app, you will need to implement Key Vault access into your app's code.

Security secrets require the following items to be in place.

- Create a system-assigned identity in your static web app.
- Grant the identity access to a Key Vault secret.
- Reference the Key Vault secret from the Static Web Apps application settings.

This article demonstrates how to set up each of these items in production for [bring your own functions applications](./functions-bring-your-own.md).

Key Vault integration is not available for:

- [Staging versions of your static web app](./review-publish-pull-requests.md). Key Vault integration is only supported in the production environment.
- [Static web apps using managed functions](./apis-functions.md).

> [!NOTE]
> Using managed identity is only available in the Azure Static Web Apps Standard plan.

## Prerequisites

- Existing Azure Static Web Apps site using [bring your own functions](./functions-bring-your-own.md).
- Existing Key Vault resource with a secret value.

## Create identity

1. Open your static web apps in the Azure portal.

1. Under _Settings_, select **Identity**.

1. Select the **System assigned** tab.

2. Under the _Status_ label, select **On**.

3. Select **Save**.

    :::image type="content" source="media/key-vault-secrets/azure-static-web-apps-enable-managed-identity.png" alt-text="Add system-assigned identity":::

4. When the confirmation dialog appears, select **Yes**.

    :::image type="content" source="media/key-vault-secrets/azure-static-web-apps-enable-managed-identity-confirmation.png" alt-text="Confirm identity assignment.":::

You can now add an access policy to allow your static web app to read Key Vault secrets.

## Add a Key Vault access policy

1. Open your Key Vault resource in the Azure portal.

1. Under the _Settings_ menu, select **Access policies**.

1. Select the link, **Add Access Policy**.

1. From the _Secret permissions_ drop down, select **Get**.

1. Next to the _Select principal_ label, select the **None selected** link.

1. In search box, search for your static web app name.

1. Select the list item that matches your application name.

2. Select **Select**.

3. Select **Add**.

4. Select **Save**.

    :::image type="content" source="media/key-vault-secrets/azure-static-web-apps-key-vault-save-policy.png" alt-text="Save Key Vault access policy":::

The access policy is now saved to Key Vault. Next, access the secret's URI to use when associating your static web app to the Key Vault resource.

1. Under the _Settings_ menu, select **Secrets**.

1. Select your desired secret from the list.

1. Select your desired secret version from the list.

2. Select **copy** at end of _Secret Identifier_ text box to copy the secret URI value to the clipboard.

3. Paste this value into a text editor for later use.

## Add application setting

1. Open your Static Web Apps site in the Azure portal.

1. Under the _Settings_ menu, select **Configuration**.

1. Under the _Application settings_ section, select **Add**.

1. Enter a name in the text box for the _Name_ field.

1. Determine the secret value in text box for the _Value_ field.

    The secret value is a composite of a few different values. The following template shows how the final string is built.

    ```text
    @Microsoft.KeyVault(SecretUri=<YOUR_KEY_VAULT_SECRET_URI>)
    ```
    For example, a final string would look like the following sample:

    ```
    @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)
    ```

    Alternatively:

    ```
    @Microsoft.KeyVault(VaultName=myvault;SecretName=mysecret)
    ```

    Use the following steps to build the full secret value.

1. Copy the template from above and paste it into a text editor.

1. Replace `<YOUR_KEY_VAULT_SECRET_URI>` with the Key Vault URI value you set aside earlier.

1. Copy the new full string value.

1. Paste the value into the text box for the _Value_ field.

1. Select **OK**.

1. Select **Save** at the top of the _Application settings_ toolbar.

    :::image type="content" source="media/key-vault-secrets/azure-static-web-apps-application-settings-save.png" alt-text="Save application settings":::

Now when your custom authentication configuration references your newly created application setting, the value is extracted from Azure Key Vault using your static web app's identity.

## Next Steps

> [!div class="nextstepaction"]
> [Custom authentication](./authentication-custom.md)
