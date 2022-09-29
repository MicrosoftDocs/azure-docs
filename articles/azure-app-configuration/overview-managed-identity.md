---
title: Configure managed identities with Azure App Configuration
description: Learn how managed identities work in Azure App Configuration and how to configure a managed identity
author: maud-lv
ms.topic: article
ms.date: 02/25/2020
ms.author: malev
ms.reviewer: lcozzens
ms.service: azure-app-configuration

---

# How to use managed identities for Azure App Configuration

This topic shows you how to create a managed identity for Azure App Configuration. A managed identity from Azure Active Directory (Azure AD) allows Azure App Configuration to easily access other Azure AD protected resources. The identity is managed by the Azure platform. It does not require you to provision or rotate any secrets. For more about managed identities in Azure AD, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

Your application can be granted two types of identities:

- A **system-assigned identity** is tied to your configuration store. It's deleted if your configuration store is deleted. A configuration store can only have one system-assigned identity.
- A **user-assigned identity** is a standalone Azure resource that can be assigned to your configuration store. A configuration store can have multiple user-assigned identities.

## Adding a system-assigned identity

Creating an App Configuration store with a system-assigned identity requires an additional property to be set on the store.

### Using the Azure CLI

To set up a managed identity using the Azure CLI, use the [az appconfig identity assign] command against an existing configuration store. You have three options for running the examples in this section:

- Use [Azure Cloud Shell](../cloud-shell/overview.md) from the Azure portal.
- Use the embedded Azure Cloud Shell via the "Try It" button, located in the top-right corner of each code block below.
- [Install the latest version of Azure CLI](/cli/azure/install-azure-cli) (2.1 or later) if you prefer to use a local CLI console.

The following steps will walk you through creating an App Configuration store and assigning it an identity using the CLI:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login]. Use an account that is associated with your Azure subscription:

    ```azurecli-interactive
    az login
    ```

1. Create an App Configuration store using the CLI. For more examples of how to use the CLI with Azure App Configuration, see [App Configuration CLI samples](scripts/cli-create-service.md):

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    az appconfig create --name myTestAppConfigStore --location eastus --resource-group myResourceGroup --sku Free
    ```

1. Run the [az appconfig identity assign] command to create the system-assigned identity for this configuration store:

    ```azurecli-interactive
    az appconfig identity assign --name myTestAppConfigStore --resource-group myResourceGroup
    ```

## Adding a user-assigned identity

Creating an App Configuration store with a user-assigned identity requires that you create the identity and then assign its resource identifier to your store.

### Using the Azure CLI

To set up a managed identity using the Azure CLI, use the [az appconfig identity assign] command against an existing configuration store. You have three options for running the examples in this section:

- Use [Azure Cloud Shell](../cloud-shell/overview.md) from the Azure portal.
- Use the embedded Azure Cloud Shell via the "Try It" button, located in the top-right corner of each code block below.
- [Install the latest version of Azure CLI](/cli/azure/install-azure-cli) (2.0.31 or later) if you prefer to use a local CLI console.

The following steps will walk you through creating a user-assigned identity and an App Configuration store, then assigning the identity to the store using the CLI:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login]. Use an account that is associated with your Azure subscription:

    ```azurecli-interactive
    az login
    ```

1. Create an App Configuration store using the CLI. For more examples of how to use the CLI with Azure App Configuration, see [App Configuration CLI samples](scripts/cli-create-service.md):

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    az appconfig create --name myTestAppConfigStore --location eastus --resource-group myResourceGroup --sku Free
    ```

1. Create a user-assigned identity called `myUserAssignedIdentity` using the CLI.

    ```azurecli-interactive
    az identity create -resource-group myResourceGroup --name myUserAssignedIdentity
    ```

    In the output of this command, note the value of the `id` property.

1. Run the [az appconfig identity assign] command to assign the new user-assigned identity to this configuration store. Use the value of the `id` property that you noted in the previous step.

    ```azurecli-interactive
    az appconfig identity assign --name myTestAppConfigStore --resource-group myResourceGroup --identities /subscriptions/[subscription id]/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUserAssignedIdentity
    ```

## Removing an identity

A system-assigned identity can be removed by disabling the feature by using the [az appconfig identity remove](/cli/azure/appconfig/identity#az-appconfig-identity-remove) command in the Azure CLI. User-assigned identities can be removed individually. Removing a system-assigned identity in this way will also delete it from Azure AD. System-assigned identities are also automatically removed from Azure AD when the app resource is deleted.

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET Core app with Azure App Configuration](quickstart-aspnet-core-app.md)

[az appconfig identity assign]: /cli/azure/appconfig/identity#az_appconfig_identity_assign
[az login]: /cli/azure/reference-index#az_login
