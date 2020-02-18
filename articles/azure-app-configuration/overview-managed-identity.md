---
title: Managed identities
description: Learn how managed identities work in Azure App Configuration and how to configure a managed identity
author: jpconnock

ms.topic: article
ms.date: 02/18/2020
ms.author: jeconnoc
ms.reviewer: lcozzens
ms.service: azure-app-configuration

---

# How to use managed identities for Azure App Configuration

This topic shows you how to create a managed identity for Azure App Configuration applications and how to use it to access other resources. A managed identity from Azure Active Directory (AAD) allows your app to easily access other AAD-protected resources such as Azure Key Vault. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. For more about managed identities in AAD, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

Your application can be granted two types of identities:

- A **system-assigned identity** is tied to your application and is deleted if your app is deleted. An app can only have one system-assigned identity.
- A **user-assigned identity** is a standalone Azure resource which can be assigned to your app. An app can have multiple user-assigned identities.

## Adding a system-assigned identity

Creating an app with a system-assigned identity requires an additional property to be set on the application.

### Using the Azure portal

To set up a managed identity in the portal, you will first create an application as normal and then enable the feature.

1. Create an app in the portal as you normally would. Navigate to it in the portal.

1. If using a function app, navigate to **Platform features**. For other app types, scroll down to the **Settings** group in the left navigation.

1. Select **Identity**.

1. Within the **System assigned** tab, switch **Status** to **On**. Click **Save**.

### Using the Azure CLI

To set up a managed identity using the Azure CLI, you will need to use the `az azconfig identity assign` command against an existing application. You have three options for running the examples in this section:

- Use [Azure Cloud Shell](../cloud-shell/overview.md) from the Azure portal.
- Use the embedded Azure Cloud Shell via the "Try It" button, located in the top right corner of each code block below.
- [Install the latest version of Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.31 or later) if you prefer to use a local CLI console. 

The following steps will walk you through creating an App Configuration store and assigning it an identity using the CLI:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az-login). Use an account that is associated with the Azure subscription under which you would like to deploy the application:

    ```azurecli-interactive
    az login
    ```

1. Create an App Configuration store using the CLI. For more examples of how to use the CLI with Azure App Configuration, see [App Configuration CLI samples](scripts/cli-create-service.md):

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    az appconfig create --name myTestAppConfigStore --location eastus --resource-group myResourceGroup --sku Free
    ```

1. Run the `identity assign` command to create the identity for this configuration store:

    ```azurecli-interactive
    az appconfig identity assign --name myTestAppConfigStore --resource-group myResourceGroup
    ```

## Adding a user-assigned identity

Creating an app with a user-assigned identity requires that you create the identity and then add its resource identifier to your app config.

### Using the Azure portal

First, you'll need to create a user-assigned identity resource.

1. Create a user-assigned managed identity resource according to [these instructions](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

1. Create Azure App Configuration resource in the portal as you normally would. Navigate to it in the portal.

1. Scroll down to the **Settings** group in the left navigation.

1. Select **Identity**.

1. Within the **User assigned** tab, click **Add**.

1. Search for the identity you created earlier and select it. Click **Add**.

## Removing an identity

A system-assigned identity can be removed by disabling the feature using the portal, or by using the [az appconfig identity remove](/cli/azure/appconfig/identity?view=azure-cli-latest#az-appconfig-identity-remove) command in the Azure CLI. User-assigned identities can be removed individually. Removing a system-assigned identity in this way will also delete it from AAD. System-assigned identities are also automatically removed from AAD when the app resource is deleted.

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET Core app with Azure App Configuration](quickstart-aspnet-core-app.md)