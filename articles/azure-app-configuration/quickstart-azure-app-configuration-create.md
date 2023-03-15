---
title: "Quickstart: Create an Azure App Configuration store"
author: maud-lv
ms.author: malev
description: "In this quickstart, learn how to create an App Configuration store."
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other
ms.topic: quickstart
ms.date: 03/14/2023

#Customer intent: As an Azure developer, I want to create an app configuration store to manage all my app settings in one place using Azure App Configuration.
---
# Quickstart: Create an Azure Azure App store

Azure App Configuration is an Azure service designed to help you centrally manage your app settings and feature flags. In this quickstart, learn how to create an App Configuration store and add a few key-values and feature flags.

## Prerequisites

An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).

## Create an App Configuration store

### [Portal](#tab/azure-portal)

1. In the upper-left corner of the home page, select **Create a resource**.
1. In the search box, enter *App Configuration* and select **App Configuration** from the search results.

    :::image type="content" source="media/azure-app-configuration-create/azure-portal-find-app-configuration.png" alt-text="Screenshot of the Azure portal that shows the App Configuration service in the search bar.":::

1. Select **Create app configuration**.

    :::image type="content" source="media/azure-app-configuration-create/azure-portal-select-create-app-configuration.png" alt-text="Screenshot of the Azure portal that shows the button to launch the creation of an App Configuration store.":::

1. In the **Basics** tab, enter the following settings:

    | Setting                          | Suggested value            | Description                                                                                                                                                                                                                                                                                                                                                   |
    |----------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Subscription**                 | Your subscription          | Select the Azure subscription that you want to use to test App Configuration. If your account has only one subscription, it's automatically selected and the **Subscription** list isn't displayed.                                                                                                                                                           |
    | **Resource group**               | *AppConfigTestResources*   | Select or create a resource group for your App Configuration store resource. This group is useful for organizing multiple resources that you might want to delete at the same time by deleting the resource group. For more information, see [Use resource groups to manage your Azure resources](../articles/azure-resource-manager/management/overview.md). |
    | **Location**                     | *Central US*               | Use **Location** to specify the geographic location in which your app configuration store is hosted. For the best performance, create the resource in the same region as other components of your application.                                                                                                                                                |
    | **Resource name**                | Globally unique name       | Enter a unique resource name to use for the App Configuration store resource. The name must be a string between 5 and 50 characters and contain only numbers, letters, and the `-` character. The name can't start or end with the `-` character.                                                                                                             |
    | **Pricing tier**                 | *Free*                     | Select the desired pricing tier. For more information, see the [App Configuration pricing page](https://azure.microsoft.com/pricing/details/app-configuration).                                                                                                                                                                                               |
    
    :::image type="content" source="media/azure-app-configuration-create/azure-portal-basic-tab.png" alt-text="Screenshot of the Azure portal that shows the basic tab of the creation for with the free tier selected.":::

1. Select **Review + create** to validate your settings.

    :::image type="content" source="media/azure-app-configuration-create/azure-portal-review.png" alt-text="Screenshot of the Azure portal that shows the configuration settings in the Review + create tab.":::

1. Select **Create**. The deployment might take a few minutes.
1. After the deployment finishes, go to the App Configuration resource. Select **Settings** > **Access keys**. Make a note of the primary read-only key connection string. You'll use this connection string later to configure your application to communicate with the App Configuration store that you created.

### [Azure CLI](#tab/azure-cli)

To create an App Configuration store, start by creating a resource group for your new service.

### Create a resource group

Create a resource group named *AppConfigTestResources* in the Central US location with the [az group create](/cli/azure/group#az-group-create) command:

```azurecli
az group create --name myResourceGroup --location centralus
```

### Create an App Configuration store

Create a new store with the [az group create](/cli/azure/appconfig/#az-appconfig-create) command and replace the placeholder `<name>` with a unique resource name for your App Configuration store.

```azurecli
az appconfig create --location centralus --name <name> --resource-group AppConfigTestResources
```

---

## Create a key-value pair

### [Portal](#tab/azure-portal)

 1. Select **Operations** > **Configuration explorer** > **Create** > **Key-value** to add a key-value pair to a store. For example:

    | Key                                | Value                               |
    |------------------------------------|-------------------------------------|
    | `TestApp:Settings:FontColor`       | *black*                             |
  
1. Select **Apply**.

    :::image type="content" source="media/azure-app-configuration-create/azure-portal-create-key-value.png" alt-text="Screenshot of the Azure portal that shows the configuration settings to create a key-value pair.":::

### [Azure CLI](#tab/azure-cli)

Add a key-value pair to the App Configuration store using the [az appconfig kv set](/cli/azure/appconfig/#az-appconfig-kv-set) command. Replace the placeholder `<name>` with the name of the App Configuration store:


```azurecli
az appconfig kv set --name <name> --key TestApp:Settings:BackgroundColor --value white
```

---

## Create a feature flag

### [Portal](#tab/azure-portal)

1. Select **Operations** > **Feature Manager** > **Create** and fill out the form with the following parameters:

    | Setting             | Suggested value | Description                                                                             |
    |---------------------|-----------------|-----------------------------------------------------------------------------------------|
    | Enable feature flag | Box is checked. | Check this box to make the new feature flag active as soon as the flag has been created. |
    | Feature flag name   | *featureA*      | The feature flag name is the unique ID of the flag, and the name that should be used when referencing the flag in code. |

1. Select **Apply**.    

:::image type="content" source="media/azure-app-configuration-create/azure-portal-create-feature-flag.png" alt-text="Screenshot of the Azure portal that shows the configuration settings to create a feature flag.":::

### [Azure CLI](#tab/azure-cli)

Add a feature flag to the App Configuration store using the [az appconfig feature set](/cli/azure/appconfig/#az-appconfig-feature-set) command. Replace the placeholder `<name>` with the name of the App Configuration store:

```azurecli
az appconfig feature set --name <name> --feature featureA
```

---


## Clean up resources

When no longer needed, delete the resource group. Deleting a resource group also deletes the resources in it.

> [!WARNING]
> Deleting a resource group is irreversible.

### [Portal](#tab/azure-portal)

1. In the Azure portal, search for and select **Resource groups**.

1. Select your resource group, for instance *AppConfigTestResources*, and then select **Delete resource group**.

1. Type the resource group name to verify, and then select **Delete**.

### [Azure CLI](#tab/azure-cli)

Run the [az group delete](/cli/azure/groupg/#az-group-delete) command. Replace the placeholder `<name>` with the name of the App Configuration store:


```azurecli
az group delete --name <name>
```

---

## Next steps

Advance to the next article to learn how to create an ASP.NET Core app with Azure App Configuration to centralize storage and management of its application settings.
> [!div class="nextstepaction"]
> [Quickstart ASP.NET Core](quickstart-aspnet-core-app.md)