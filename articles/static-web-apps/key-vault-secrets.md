---
title: Securing Secrets in Key Vault
description: Use managed identity to secure secrets in Key Vault.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 04/27/2021
ms.author: cshoe
---

# Securing secrets in Azure Key Vault

When configuring custom ODIC providers, you may want to store connection secrets in Key Vault. This article demonstrates how to use a managed identity to grant Azure Static Web Apps access to Key Vault secrets.

Security secrets require the following items to be in place.

- Create a system-assigned identity in the Static Web Apps instance.
- Grant access a Key Vault secret access to the identity.
- Reference the Key Vault secret from the Static Web Apps application settings.

## Prerequisites

- Existing Azure Static Web App site.
- Existing Key Vault resource with a secret value.

## Create identity

1. Open your Static Web Apps site in the Azure portal.
1. Under _Settings_ menu, select **Identity**.
1. Select the **System Assigned** tab.
1. Select the **On** button.
1. Select the **Save** button.
1. Select the **Yes** button.

You can now define an access policy to allow your static web app to read Key Vault secrets.

## Define a Key Vault access policy

1. Open your Key Vault resource in the Azure portal.
1. Under the _Settings_ menu, select **Access policies**.
1. Select **Secret permissions** drop down.
1. Select **Get**.
1. Next to the _Select principal_ label, select the **None selected** link.
1. In search box, search for your Static Web Apps application name.
1. Select list item that matches your application name.
1. Select the **Select** button.
1. Select the **Add** button.
1. Select the **Save** button.

The access policy is now saved to Key Vault. Next, access the secret's URI to use when associating your static web app to the Key Vault resource.

1. Under the _Settings_ menu, select **Secrets**.
1. Select your desired secret from the list.
1. Select your desired secret version from the list.
1. Select the copy button at end of _Secret Identifier_ text box to copy the secret URI value.
1. Paste this value into a text editor for later use.

## Add application setting

1. Open your Static Web Apps site in the Azure portal.
1. Under the _Settings_ menu, select **Configuration**.
1. Select **New application setting**.
1. Enter a name in the text box for the _Name_ field.
1. Enter the secret value in text box for the _Value_ field.

    The secret value is a composite of a few different values. The following template depicts how the final string is built.

    ```text
    @Microsoft.KeyVault(SecretUri=<YOUR-KEY-VAULT-SECRET-URI>)
    ```

    Use the following steps to build the full secret value.

    1. Copy the template from above and paste it into a text editor. Then, replace `<YOUR-KEY-VAULT-SECRET-URI>` with the URI value you set earlier.

    1. Copy the full string value.

    1. Paste it into the text box for the _Value_ field.

1. Select the **Save** button.
1. Select the **Continue** button.

## Next Steps

> [!div class="nextstepaction"]
> [Configure your application](configuration.md)