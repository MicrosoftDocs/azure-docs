---
title: "Tutorial: Use storage mounts in Azure Container Apps"
description: Learn to deploy and update an app that uses temporary and permanent storage mounts in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 07/11/2022
ms.author: cshoe
---

# Tutorial: Use storage mounts in Azure Container Apps

Learn to link together a container app and storage account using an Azure File storage mount.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Container Apps environment
> * Create an Azure Storage account
> * Define a file share in the storage account
> * Link the environment to the storage file share
> * Mount the storage share in an individual container

## Prerequisites

- Install the latest version of the [Azure CLI](/cli/azure/install-azure-cli).

## Set up

1. Log in to the Azure CLI.

    ```azurecli
    az login
    ```

1. Set up environment variables used in various commands to follow.

    ```bash
    RESOURCE_GROUP="my-storage-group"
    ENVIRONMENT_NAME="my-storage-environment"
    LOCATION="canadacentral"
    ```

1. Ensure you have the latest version of the Container Apps Azure CLI extension.

    ```azurecli
    az extension add -n containerapp --upgrade
    ```

## Create an environment

TODO

1. Create a resource group.

    ```azurecli
    az group create \
      --name $RESOURCE_GROUP \
      --location $LOCATION \
      --query "properties.provisioningState"
    ```

    Once created, the command returns a "Succeeded" message.

    At the end of this tutorial, you can delete the resource group to remove all the services created during this article.

1. Create a Container Apps environment.

    ```azurecli
    az containerapp env create \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION \
      --query "properties.provisioningState"
    ```

    Once created, the command returns a "Succeeded" message.

    Storage mounts are associated with a Container Apps environment and configured within individual container apps.

## Set up a storage account

1. Define a storage account name.

    ```bash
    STORAGE_ACCOUNT_NAME="myacastorageaccount$RANDOM"
    ```

    This value is used with a few different commands in this procedure.

1. Create an Azure Storage account.

    ```azurecli
    az storage account create \
      --resource-group $RESOURCE_GROUP \
      --name $STORAGE_ACCOUNT_NAME \
      --location $LOCATION \
      --kind StorageV2 \
      --sku Standard_LRS \
      --enable-large-file-share \
      --query provisioningState
    ```

    Once created, the command returns a "Succeeded" message.

1. Define a file share name.

    ```bash
    STORAGE_SHARE_NAME="myfileshare"
    ```

1. Create the Azure Storage file share.

    ```azurecli
    az storage share-rm create \
      --resource-group $RESOURCE_GROUP \
      --storage-account $STORAGE_ACCOUNT_NAME \
      --name $STORAGE_SHARE_NAME \
      --quota 1024 \
      --enabled-protocols SMB \
      --output table
    ```

1. Get the storage account key.

    ```bash
    STORAGE_ACCOUNT_KEY=`az storage account keys list -n $STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv`
    ```

    The storage account key is required to create the storage link in your Container Apps environment.

1. Define the storage mount name.

    ```bash
    STORAGE_MOUNT_NAME="mystoragemount"
    ```

    This value is the name used to define the storage mount link from your Container Apps environment to your Azure Storage account.

## Create the storage mount

1. Create the storage link in the environment.

    ```azurecli
    az containerapp env storage set \
      --access-mode ReadWrite \
      --azure-file-account-name $STORAGE_ACCOUNT_NAME \
      --azure-file-account-key $STORAGE_ACCOUNT_KEY \
      --azure-file-share-name $STORAGE_SHARE_NAME \
      --storage-name $STORAGE_MOUNT_NAME \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --output table
    ```

    This command creates a link between container app environment and the file share created with the `az storage share-rm` command.

    Now that the storage account and environment are linked, you can create a container app that uses the storage mount.

1. Define the container app name.

    ```bash
    CONTAINER_APP_NAME="my-container-app"
    ```

1. Create the container app.

    ```azurecli
    az containerapp create \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --environment $ENVIRONMENT_NAME \
      --image nginx \
      --target-port 80 \
      --ingress external \
      --query properties.configuration.ingress.fqdn
    ```

    This command displays the URL of your new container app.

1. Copy the URL and paste into your web browser to navigate to the website.

    Once the page loads, you'll see the "Welcome to nginx!" message.

    Now that you've verified the container app is configured, you can update the app to with a storage mount definition.

1. Export the container app's configuration.

    ```azurecli
    az containerapp show \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --output yaml > app.yaml
    ```

    > [!NOTE]
    > While this application doesn't have secrets, many apps do feature secrets. By default, when you export an app's configuration, the values for secrets aren't included in the generated YAML.
    >
    > If you don't need to change secret values, then you can remove this section and your secrets are unaltered. Alternatively, if you need to change a secret's value, make sure to provide both the `name` and `value` in the file before attempting to update the app.

1. Open *app.yaml* in a code editor.

1. Add a reference to the storage volumes to the `template` and configure the storage mount in the `containers` definition.

    ```yml
    template:
      volumes:
      - name: my-azure-file-volume
        storageName: mystoragemount
        storageType: AzureFile
    ```

    The new `template.volumes` section includes the following properties.

    | Property | Description |
    |--|--|
    | `name` | This value matches the volume created by calling the `az containerapp env storage set` command. |
    | `storageName` | This value defines the name used by containers in the environment to access the storage volume. |
    | `storageType` | This value determines the type of storage volume defined for the environment. In this case, Azure Storage file mount is declared. |

    The `volumes` section defines volumes at the app level that your application container or sidecar containers can reference via a `volumeMounts` section associated with a container.

1. Add a `volumeMounts` section.

    ```yml
    containers:
      - image: nginx
        name: my-container-app
        volumeMounts:
        - volumeName: my-azure-file-volume
          mountPath: /usr/share/nginx/html
    ```

    The new `volumeMounts` section under the *nginx* container includes the following properties:

    | Property | Description |
    |--|--|
    | `volumeName` | This value must match the name defined in the `volumes` definition. |
    | `mountPath` | This value defines the path in your container where the storage is mounted. |

1. Update the container app with the new storage mount configuration.

    ```azurecli
    az containerapp update \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --yaml app.yaml \
      --output table
    ```

## Verify the storage mount

1. Open an interactive shell inside the container app to test the storage mount.

    ```azurecli
    az containerapp exec \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP
    ```

    This command may take a moment to open the shell. Once the shell is ready, then you can interact with the storage mount via file system commands.

1. Change into the nginx *html* folder.

    ```bash
    cd /usr/share/nginx/html
    ```

1. Create a test file.

    ```bash
    echo "hello" > file-mount.html
    ```

1. Return to your browser and navigate to the *file-mount.html* file from the nginx website.

    Verify you see the *hello* message in the browser.

    You can now run the `exit` command to return to your native terminal environment.

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this article.

# [Bash](#tab/bash)

```azurecli
az group delete \
  --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```powershell
az group delete `
  --name $RESOURCE_GROUP
```
