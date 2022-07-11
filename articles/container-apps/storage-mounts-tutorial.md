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

## Prerequisites

- Latest version of the [Azure CLI](/cli/azure/install-azure-cli)
- An existing Container Apps [environment](environment.md)

## Set up

1. Login to the Azure CLI.

    ```azurecli
    az login
    ```

1. Set up environment variables.

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

1. Create an environment.

    ```azurecli
    az containerapp env create \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION \
      --query "properties.provisioningState"
    ```

1. Create a storage account name.

    ```bash
    STORAGE_ACCOUNT_NAME="mystorageaccount$RANDOM"
    ```

1. Create a storage account.

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

1. Define a file share name.

    ```bash
    STORAGE_SHARE_NAME="myfileshare"
    ```

1. Create the file share.

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

1. Create the storage mount in the environment.

    ```azurecli
    az containerapp env storage set \
      --access-mode ReadWrite \
      --azure-file-account-name $STORAGE_ACCOUNT_NAME \
      --azure-file-account-key $STORAGE_ACCOUNT_KEY \
      --azure-file-share-name $STORAGE_SHARE_NAME \
      --storage-name "my-storage-mount" \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --output table
    ```

1. See the storage mounts associated with an environment.

    ```azurecli
    az containerapp env storage list \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --output table
    ```

1. Define the container app name.

    ```bash
    CONTAINER_APP_NAME="mycontainerapp"
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

1. Create a secret.

    ```azurecli
    az containerapp secret set \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --secrets foo=bar \
      --output table
    ```

1. Export the container app's configuration.

    ```azurecli
    az containerapp show \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --output yaml > app.yaml
    ```

1. Open *app.yaml* in a code editor.

1. Extract secret configuration as formatted YAML.

    ```azurecli
    az containerapp secret list \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --show-values \
      --output yamlc
    ```

1. Update the secrets section to include both the key and value.

    ```yaml
    - name: foo
      value: bar
    ```

add volume to template & mount in container

```yml
template:
  volumes:
  - name: mystoragevolume
    storageName: ourshare
    storageType: AzureFile
  containers:
  - image: nginx
    name: mycontainerapp
  volumeMounts:
  - volumeName: mystoragevolume
    mountPath: /usr/share/nginx/html
```

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
