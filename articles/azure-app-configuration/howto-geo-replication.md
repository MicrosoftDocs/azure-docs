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

This article covers replication of Azure App Configuration stores. You'll learn about how to create and delete a replica in your configuration store. 

To learn more about the concept of geo-replication, see [Geo-replication in Azure App Configuration](./concept-soft-delete.md).

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

## Create and list a replica

To create a replica of your configuration store, follow the steps below. 

### [Portal](#tab/azure-portal)

1. In your App Configuration store, under **Settings**, select **Geo-replication**.
1. Under **Replica(s)**, select **Create**. Select the location of your new replica in the dropdown, then assign the replica a name. Note that this name must be unique. 

    <!-- PLACEHOLDER FOR SCREENSHOT
    :::image type="content" source="./media/how-to-soft-delete-app-config-4.png" alt-text="On App Configuration stores, the Manage deleted stores option is highlighted."::: 
    -->

1. Select **Create**. 
1. On the **Geo-replication** blade, you should now see your new replica listed. Check that the status of the replica is "Succeeded".  

    <!-- PLACEHOLDER FOR SCREENSHOT
    :::image type="content" source="media/disable-public-access.png" alt-text="Screenshot of the Azure portal disabling public access.":::
   -->

### [Azure CLI](#tab/azure-cli)

1. In the CLI, run the following code to create a replica of your configuration store. 

  ```azurecli-interactive
  az appconfig replica create --store-name MyConfigStoreName --name MyNewReplicaName --location MyNewReplicaLocation
    ```

1. Verify that the replica was created successfully by listing all replicas of your configuration store. 

    ```azurecli-interactive
  az appconfig replica list --store-name MyConfigStoreName 
    ```

---

## Delete a replica

To delete a replica, follow the steps below. 

### [Portal](#tab/azure-portal)

1. In your App Configuration store, under **Settings**, select **Geo-replication**.
1. Under **Replica(s)**, select the **...** to the right of the replica you want to delete. Select **Delete** from the dropdown. 

    <!-- PLACEHOLDER FOR SCREENSHOT
    :::image type="content" source="./media/how-to-soft-delete-app-config-4.png" alt-text="On App Configuration stores, the Manage deleted stores option is highlighted."::: 
    -->

1. Verify that the name of the replica to be deleted and select **OK** to confirm. 
1. Once the process if complete, check the list of replicas that the correct replica has been deleted. 

### [Azure CLI](#tab/azure-cli)

1. In the CLI, run the following code. 

```azurecli-interactive
az appconfig replica delete --store-name MyConfigStoreName --name MyNewReplicaName 
```
1. Verify that the replica was deleted successfully by listing all replicas of your configuration store. 

    ```azurecli-interactive
  az appconfig replica list --store-name MyConfigStoreName 
    ```

---


## Next steps
> [!div class="nextstepaction"]
> [Geo-replication concept](./concept-soft-delete.md)
