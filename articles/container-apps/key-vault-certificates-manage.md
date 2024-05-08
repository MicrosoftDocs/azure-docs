---
title: Import certificates from Azure Key Vault to Azure Container Apps
description: Learn to managing secure certificates in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 05/08/2024
ms.author: cshoe
---

# Import certificates from Azure Key Vault to Azure Container Apps (preview)

You can set up Azure Key Vault to manage your container app's certificates to handle updates, renewals, and monitoring. Without Key Vault, you're left managing your certificate manually, which means you can't manage certificates in a central location and can't take advantage of lifecycle automation or notifications.

## Prerequisites

- [Azure Key Vault](/azure/key-vault/): Make sure you have a certificate stored in Azure Key Vault.

- [Azure CLI](/cli/azure/install-azure-cli): You need the Azure CLI updated with the Azure Container Apps extension version `0.3.49` or higher. Use the `az extension add` command to install the latest version.

    ```azurecli
    az extension add --name containerapp --upgrade --allow-preview`
    ```

- [Managed identity](./managed-identity.md): Enable managed identity on your Container Apps environment.

## Secret configuration

An [Azure Key Vault](/azure/key-vault/general/manage-with-cli2) instance is required to store your certificate. Make the following updates to your Key Vault instance:

1. Open the [Azure portal](https://portal.azure.com).

1. Go to your Azure Container Apps environment.

1. From *Settings*, select Access control (IAM).

1. From the *Roles* tab, and set yourself as a *Key Vault Administrator*.

1. Go to your certificate's details and copy the value for *Secret Identifier* and paste it into a text editor for use in an upcoming step.

    > [!NOTE]
    > The secret identifier with a version suffix only attempts to get a certificate from the specified version. If you are using a secret identifier without a version suffix, it uses the latest version.

## Assign roles

1. Open the [Azure portal](https://portal.azure.com) and find your instance of your Azure Container Apps environment where you want to import a certificate.

1. Go to the *Identity* tab and set *RBAC* to **Key Vault Secrets User**.

## Import a certificate

Once you authorize your container app to read the vault, you can use the `az containerapp env certificate upload` command to import your vault to your Container Apps environment.

Before you run the following command, replace the placeholder tokens surrounded by `<>` brackets with your own values.

```azurecli
az containerapp env certificate upload \
  --resource-group <RESOURCE_GROUP> \
  --name <CONTAINER_APP_NAME> \
  --akv-url <KEY_VAULT_URL>
  --certificate-identity <CERTIFICATE_IDENTITY>
```

## Related

> [!div class="nextstepaction"]
> [Manage secrets](manage-secrets.md)
