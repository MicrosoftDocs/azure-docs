---
title: Manage Azure Key Vault certificates in Azure Container Apps
description: Learn to managing secure certificates in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 04/16/2024
ms.author: cshoe
---

# Manage Azure Key Vault certificates in Azure Container Apps

Securing communication across different services requires the management of critical security information such as secrets, credentials, certificates, and keys. Continuing to keep these values current requires reliable methods to handle updates, renewals, and monitoring of all your security related information. Managing these values by hand is error prone and mistakes are tough to detect and fix.

You can set up Azure Key Vault to manage your container app's certificates to handle updates, renewals, and monitoring. Links between your container app environment to Azure Key Vault use managed identity and security best practices.

You can use Azure Key Vault to manage your Container Apps environment's certificates via the `az containerapp env certificate upload` command.

## Prerequisites

To manage certificates in Azure Key Vault, you need an existing instance of Key Vault, your container app environment properly configured, and your Azure CLI version up to date.

### Azure Key Vault

An [Azure Key Vault](/azure/key-vault/general/manage-with-cli2) instance is required to store your certificate. Make the following updates to your Key Vault instance:

1. Open the [Azure portal](https://portal.azure.com) and find your instance of Azure Key Vault.

1. Edit the Identity Access Management (IAM) access control and set yourself as a *Key Vault Administrator*.

1. Go to your certificate's details and copy the value for *Secret Identifier* and paste it into a text editor for use in an upcoming step.

By default, your container app doesn't have access to your vault. To use a key vault for a certificate deployment, you must [authorize read access for the resource provider to the vault](../key-vault/general/assign-access-policy-cli.md).

### Azure Container Apps

1. Open the [Azure portal](https://portal.azure.com) and find your instance of your Azure Container Apps environment.

1. Go to the *Identity* tab and set *RBAC* to either **Key Vault Data Access Administrator** or **Key Vault Secrets User**.

### Azure CLI

You need the [Azure CLI](/cli/azure/install-azure-cli) with the Azure Container Apps extension version `0.3.49` or higher. Use the `list-available` command to view your extension's version number.

```azurecli
az extension list-available --output table | findstr containerapp
```

If you need to upgrade your extension, then use the `upgrade` parameter with the `add` command:

```azurecli
az extension add --name containerapp --upgrade`
```

## Add a certificate

Once you authorize your container app to read the vault, you can use the `az containerapp env certificate upload` command to associate your vault with your Container Apps environment.

Before you run the following command, replace the placeholder tokens surrounded by `<>` brackets with your own values.

```azurecli
az containerapp env certificate upload \
  --resource-group <RESOURCE_GROUP> \
  --name <CONTAINER_APP_NAME> \
  --akv-url <KEY_VAULT_URL>
  --certificate-identity <CERTIFICATE_IDENTITY>
```

## Next steps

> [!div class="nextstepaction"]
> [Manage secrets](manage-secrets.md)
