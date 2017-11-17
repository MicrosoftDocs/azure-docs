---
title: Mount an Azure Files volume in Azure Container Instances
description: Learn how to mount an Azure Files volume to persist state with Azure Container Instances
services: container-instances
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags:
keywords:

ms.assetid:
ms.service: container-instances
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/17/2017
ms.author: seanmck
ms.custom: mvc
---

# Mount an Azure file share with Azure Container Instances

By default, Azure Container Instances are stateless. If the container crashes or stops, all of its state is lost. To persist state beyond the lifetime of the container, you must mount a volume from an external store. This article shows how to mount an Azure file share for use with Azure Container Instances.

## Create an Azure file share

Before using an Azure file share with Azure Container Instances, you must create it. Run the following script to create a storage account to host the file share, and the share itself. The storage account name must be globally unique, so the script adds a random value to the base string.

```azurecli-interactive
# Change these four parameters
ACI_PERS_STORAGE_ACCOUNT_NAME=mystorageaccount$RANDOM
ACI_PERS_RESOURCE_GROUP=myResourceGroup
ACI_PERS_LOCATION=eastus
ACI_PERS_SHARE_NAME=acishare

# Create the storage account with the parameters
az storage account create -n $ACI_PERS_STORAGE_ACCOUNT_NAME -g $ACI_PERS_RESOURCE_GROUP -l $ACI_PERS_LOCATION --sku Standard_LRS

# Create the file share
az storage share create -n $ACI_PERS_SHARE_NAME
```

## Acquire storage account access details

To mount an Azure file share as a volume in Azure Container Instances, you need three values: the storage account name, the share name, and the storage access key.

If you used the script above, the storage account name was created with a random value at the end. To query the final string (including the random portion), use the following commands:

```azurecli-interactive
STORAGE_ACCOUNT=$(az storage account list --resource-group $ACI_PERS_RESOURCE_GROUP --query "[?contains(name,'$ACI_PERS_STORAGE_ACCOUNT_NAME')].[name]" -o tsv)
echo $STORAGE_ACCOUNT
```

The share name is already known (it is *acishare* in the script above), so all that remains is the storage account key, which can be found using the following command:

```azurecli-interactive
STORAGE_KEY=$(az storage account keys list --resource-group $ACI_PERS_RESOURCE_GROUP --account-name $STORAGE_ACCOUNT --query "[0].value" -o tsv)
echo $STORAGE_KEY
```

## Deploy the container and mount the volume

To mount an Azure file share as a volume in a container, specify the share and volume mount point when you create the container with [az container create](/cli/azure/container#az_container_create). If you've followed the previous steps, you can mount the share you created earlier by using the following command to create a container:

```azurecli-interactive
az container create \
    --resource-group $ACI_PERS_RESOURCE_GROUP \
    --name hellofiles \
    --image seanmckenna/aci-hellofiles \
    --azure-file-volume-account-name $ACI_PERS_STORAGE_ACCOUNT_NAME \
    --azure-file-volume-account-key $STORAGE_KEY \
    --azure-file-volume-share-name $ACI_PERS_SHARE_NAME \
    --azure-file-volume-mount-path /aci/logs/
```

## Manage files in mounted volume

Once the container starts up, you can use the simple web app deployed via the [seanmckenna/aci-hellofiles](https://hub.docker.com/r/seanmckenna/aci-hellofiles/) image to manage the files in the Azure file share at the mount path you specified. Obtain the IP address for the web app with the [az container show](/cli/azure/container#az_container_show) command:

```azurecli-interactive
az container show --resource-group $ACI_PERS_RESOURCE_GROUP --name hellofiles -o table
```

You can use the [Azure portal](https://portal.azure.com) or a tool like the [Microsoft Azure Storage Explorer](https://storageexplorer.com) to retrieve and inspect the file written to the file share.

>[!NOTE]
> To learn more about using Azure Resource Manager templates, parameter files, and deploying with the Azure CLI, see [Deploy resources with Resource Manager templates and Azure CLI](../azure-resource-manager/resource-group-template-deploy-cli.md).

## Next steps

- Deploy for your first container using the Azure Container Instances [quickstart](container-instances-quickstart.md)
- Learn about the [relationship between Azure Container Instances and container orchestrators](container-instances-orchestrator-relationship.md)
