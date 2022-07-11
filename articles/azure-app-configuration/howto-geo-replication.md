---
title: Replicate a configuration store (preview)
description: Learn how to use Azure App Configuration geo replication to create, delete, and manage replicas of your configuration store. 
services: azure-app-configuration
author: AlexandraKemperMS
ms.assetid: 
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: how-to
ms.date: 7/11/2022
ms.author: alkemper 
ms.custom: devx-track-azurecli

#Customer intent: I want to be able to list, create, and delete the replicas of my configuration store. 
---

# Replicate a configuration store (preview)

This article covers the soft delete feature of Azure App Configuration stores. You'll learn about how to set retention policy, enable purge protection, recover and purge a soft-deleted store.

To learn more about the concept of soft delete feature, see [Soft-Delete in Azure App Configuration](./concept-soft-delete.md).

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)
- We assume you already have an App Configuration store. If you want to create one, [create an App Configuration store](quickstart-aspnet-core-app.md).

## Sign in to Azure

You will need to sign in to Azure first to access the App Configuration service.

### [Portal](#tab/azure-portal)

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

### [Azure CLI](#tab/azure-cli)

Sign in to Azure using the `az login` command in the [Azure CLI](/cli/azure/install-azure-cli).

```azurecli-interactive
az login
```

This command will prompt your web browser to launch and load an Azure sign-in page. If the browser fails to open, use device code flow with `az login --use-device-code`. For more sign in options, go to [sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

---

## Create a replica 

To create a replica of your configuration store, follow the steps below. 

### [Portal](#tab/azure-portal)

1. In your App Configuration store, under **Settings**, select **Geo-replication**.
1. Under **Replica(s)**, select **Create**. Select the location of your replica from the dropdown and assign the replica a name. Note that this name must be unique. The endpoint of the new replica

    <!-- PLACEHOLDER FOR SCREENSHOT
    :::image type="content" source="./media/how-to-soft-delete-app-config-4.png" alt-text="On App Configuration stores, the Manage deleted stores option is highlighted."::: 
    -->

1. Select **Create**. On the **Geo-replication** blade, you should now see your new replica listed. Check that the status of the replica shows "Ready".  

    <!-- PLACEHOLDER FOR SCREENSHOT
    :::image type="content" source="media/disable-public-access.png" alt-text="Screenshot of the Azure portal disabling public access.":::
   -->

### [Azure CLI](#tab/azure-cli)

In the CLI, run the following code:

```azurecli-interactive
az appconfig update --name <name-of-the-appconfig-store> --enable-public-network false
```


## Delete a replica

1. Log in to the Azure portal.
1. Click on the search bar at the top of the page.
1. Search for "App Configuration" and click on **App Configuration** under **Services**. Don't click on an individual App Configuration store.
1. At the top of the screen, click the option to **Manage deleted stores**. A context pane will open on the right side of your screen.

    :::image type="content" source="./media/how-to-soft-delete-app-config-4.png" alt-text="On App Configuration stores, the Manage deleted stores option is highlighted.":::

1. Select your subscription from the drop box. If you've deleted one or more App Configuration stores, these stores will appear in the context pane on the right. Click "Load More" at the bottom of the context pane if not all deleted stores are loaded.
1. Once you find the store that you wish to recover or purge, select the checkbox next to it. You can select multiple stores
1. Please click **Recover** at the bottom of the context pane to recover the store OR
   click **Purge** option to permanently delete the store. Note you won't be able to purge a store when purge protection is enabled.

    :::image type="content" source="./media/how-to-soft-delete-app-config-5.png" alt-text="On Manage deleted stores panel, one store is selected, and the Recover button is highlighted.":::


## Next steps
> [!div class="nextstepaction"]
> [Geo-replication concept](./concept-soft-delete.md)
