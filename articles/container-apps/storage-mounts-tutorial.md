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

- resource group
- environment
- region

```bash
RESOURCE_GROUP="my-storage-group"
ENVIRONMENT_NAME="my-storage-environment"
LOCATION="canadacentral"
```

```azurecli
az containerapp env list \
  --output table
```

```azurecli
az containerapp env show \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --output yamlc
```

```azurecli
az containerapp env storage list \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --output yamlc
```

```bash
STORAGE_ACCOUNT_NAME="mystorageaccount$RANDOM"
```

```azurecli
az storage account create \
  --resource-group $RESOURCE_GROUP \
  --name $STORAGE_ACCOUNT_NAME \
  --location $LOCATION \
  --kind StorageV2 \
  --sku Standard_LRS \
  --enable-large-file-share \
  // --output table
```

// query for provisioning state

```bash
STORAGE_SHARE_NAME="myfileshare"
```

```azurecli
az storage share-rm create \
  --resource-group $RESOURCE_GROUP \
  --storage-account $STORAGE_ACCOUNT_NAME \
  --name $STORAGE_SHARE_NAME \
  --quota 1024 \
  --enabled-protocols SMB \
  --output table
```

```bash
STORAGE_ACCOUNT_KEY=`az storage account keys list -n $STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv`
```

```azurecli
az containerapp env storage set \
  --access-mode ReadWrite \
  --azure-file-account-name $STORAGE_ACCOUNT_NAME \
  --azure-file-account-key $STORAGE_ACCOUNT_KEY \
  --azure-file-share-name $STORAGE_SHARE_NAME \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP
```

```azurecli
az containerapp env storage list \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --output yamlc
```

```bash
CONTAINER_APP_NAME="mycontainerapp"
```

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

```azurecli
az containerapp secret set \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --secrets foo=bar \
  --output table
```

> update an existing app or copy yaml

```azurecli
az containerapp show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --output yaml > app.yaml
```

```azurecli
az containerapp secret show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --secret-name foo \
  --query value -o tsv
```

edit file and add secret value
👇

```azurecli
az containerapp secret list \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --show-values \
  --output yamlc
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
resources:
cpu: 0.5
ephemeralStorage: ''
memory: 1Gi
```

```azurecli
az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --yaml app.yaml \
  --output table
```

show fqdn in browser

```azurecli
az containerapp exec \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP
```

> may take a moment to resolve

```bash
cd /var/www/html
```

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
