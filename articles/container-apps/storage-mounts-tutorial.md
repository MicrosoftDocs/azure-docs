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

create a storage mount
manage secrets

## Prerequisites

- Install the latest version of the [Azure CLI](/cli/azure/install-azure-cli)

## Set up

1. Login to the Azure CLI.

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

1. Define the storage volume name.

    ```bash
    STORAGE_MOUNT_NAME="my-storage-mount"
    ```

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

    Now that the storage account and environment are linked, you can created a container app to use the storage mount.

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
      --output table
    ```

    This command displays a table once the application in deployed.

1. Copy the FQDN value from the `containerapp create` output table and paste into your web browser to navigate to the website.

    Once the page loads, you'll see the "Welcome to nginx!" message.

    Now that you've verified the container app is deployed you can update the app to with a storage mount definition.

1. Export the container app's configuration.

    ```azurecli
    az containerapp show \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --output yaml > app.yaml
    ```

    While this application does not have any secrets defined, many apps you encounter will. When you export an app's configuration, the values for secrets are not included in the generated YAML.

    If you don't need to change secret values, then you can remove this section and your secrets are unaltered. Alternatively, if you need to change a secret's value, make sure to provide both the `name` and `value` in the file before attempting to update the app.

1. Open *app.yaml* in a code editor.

1. Add a reference to the storage volumes to the `template` and configure the storage mount in the `containers` definition.

    ```yml
    template:
      volumes:
      - name: my-azure-file-volume
        storageName: my-storage-mount
        storageType: AzureFile
      containers:
      - image: nginx
        name: my-container-app
        volumeMounts:
        - volumeName: mystoragevolume
          mountPath: /usr/share/nginx/html
    ```

    The new `volumes` section includes the following properties.

    | Property | Description |
    |--|--|
    | `volumes.name` | This value matches the volume created by calling the `az containerapp env storage set` command. |
    | `volumes.storageName` | This value defines the name used by containers in the environment to access the storage volume. |
    | `volumes.storageType` | This value determines the type of storage volume defined for the environment. In this case, Azure Storage file mount is declared. |

1. Update the container app with the storage mount configuration.

    ```azurecli
    az containerapp update \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --yaml app.yaml \
      --output table
    ```

show fqdn in browser

1. Open an interactive shell inside the container app.

    ```azurecli
    az containerapp exec \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP
    ```

    This command may take a moment to open the shell.

1. Change into the *html* folder.

    ```bash
    cd /var/www/html
    ```

1. 

```bash
ls
```

> nothing

```bash
touch text.txt
```

```bash
exit
````

```yml
template:
volumes:
- name: mystoragevolume
storageName: ourshare
storageType: AzureFile
- name: myemptyvolume
storageType: EmptyDir
```

```yml
  volumeMounts:
  - volumeName: mystoragevolume
    mountPath: /usr/share/nginx/html
```

```bash
cd /usr/share/nginx/html
echo "hello" > file-mount.html
```

```bash
cd /var/www/empty
touch replica-data.txt
```
