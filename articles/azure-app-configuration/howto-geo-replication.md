---
title: Enable geo-replication (preview)
description: Learn how to use Azure App Configuration geo replication to create, delete, and manage replicas of your configuration store. 
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: how-to
ms.date: 8/1/2022
ms.author: malev
ms.custom: devx-track-azurecli

#Customer intent: I want to be able to list, create, and delete the replicas of my configuration store. 
---

# Enable geo-replication (Preview)

This article covers replication of Azure App Configuration stores. You'll learn about how to create and delete a replica in your configuration store.

To learn more about the concept of geo-replication, see [Geo-replication in Azure App Configuration](./concept-soft-delete.md).

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)
- We assume you already have an App Configuration store. If you want to create one, [create an App Configuration store](quickstart-aspnet-core-app.md).

## Create and list a replica

To create a replica of your configuration store in the portal, follow the steps below.

<!-- ### [Portal](#tab/azure-portal) -->

1. In your App Configuration store, under **Settings**, select **Geo-replication**.
1. Under **Replica(s)**, select **Create**. Choose the location of your new replica in the dropdown, then assign the replica a name. This replica name must be unique.

    :::image type="content" source="./media/how-to-geo-replication-create-flow.png" alt-text="Screenshot of the Geo Replication button being highlighted as well as the create button for a replica.":::

1. Select **Create**.
1. You should now see your new replica listed under Replica(s). Check that the status of the replica is "Succeeded", which indicates that it was created successfully.

    :::image type="content" source="media/how-to-geo-replication-created-replica-successfully.png" alt-text="Screenshot of the list of replicas that have been created for the configuration store.":::

<!-- ### [Azure CLI](#tab/azure-cli)

1. In the CLI, run the following code to create a replica of your configuration store. 

    ```azurecli-interactive
    az appconfig replica create --store-name MyConfigStoreName --name MyNewReplicaName --location MyNewReplicaLocation
    ```

1. Verify that the replica was created successfully by listing all replicas of your configuration store. 

    ```azurecli-interactive
      az appconfig replica list --store-name MyConfigStoreName 
    ```
--- -->

## Delete a replica

To delete a replica in the portal, follow the steps below.

<!-- ### [Portal](#tab/azure-portal) -->

1. In your App Configuration store, under **Settings**, select **Geo-replication**.
1. Under **Replica(s)**, select the **...** to the right of the replica you want to delete. Select **Delete** from the dropdown.

    :::image type="content" source="./media/how-to-geo-replication-delete-flow.png" alt-text=" Screenshot showing the three dots on the right of the replica being selected, showing you the delete option.":::

1. Verify the name of the replica to be deleted and select **OK** to confirm.
1. Once the process is complete, check the list of replicas that the correct replica has been deleted.

<!-- ### [Azure CLI](#tab/azure-cli)

1. In the CLI, run the following code. 

    ```azurecli-interactive
    az appconfig replica delete --store-name MyConfigStoreName --name MyNewReplicaName 
    ```
1. Verify that the replica was deleted successfully by listing all replicas of your configuration store. 

    ```azurecli-interactive
    az appconfig replica list --store-name MyConfigStoreName 
    ```

--- -->

## Next steps

> [!div class="nextstepaction"]
> [Geo-replication concept](./concept-geo-replication.md)
