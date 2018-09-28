---
title: Use Azure File with AKS
description: Use Azure Disks with AKS
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 03/08/2018
ms.author: iainfou
ms.custom: mvc
---

# Volumes with Azure files

Container-based applications often need to access and persist data in an external data volume. Azure files can be used as this external data store. This article details using Azure files as a Kubernetes volume in Azure Kubernetes Service.

For more information on Kubernetes volumes, see [Kubernetes volumes][kubernetes-volumes].

## Create an Azure file share

Before using an Azure File Share as a Kubernetes volume, you must create an Azure Storage account and the file share. The following script can be used to complete these tasks. Take note or update the parameter values, some of these are needed when creating the Kubernetes volume.

```azurecli-interactive
#!/bin/bash

# Change these four parameters
AKS_PERS_STORAGE_ACCOUNT_NAME=mystorageaccount$RANDOM
AKS_PERS_RESOURCE_GROUP=myAKSShare
AKS_PERS_LOCATION=eastus
AKS_PERS_SHARE_NAME=aksshare

# Create the Resource Group
az group create --name $AKS_PERS_RESOURCE_GROUP --location $AKS_PERS_LOCATION

# Create the storage account
az storage account create -n $AKS_PERS_STORAGE_ACCOUNT_NAME -g $AKS_PERS_RESOURCE_GROUP -l $AKS_PERS_LOCATION --sku Standard_LRS

# Export the connection string as an environment variable, this is used when creating the Azure file share
export AZURE_STORAGE_CONNECTION_STRING=`az storage account show-connection-string -n $AKS_PERS_STORAGE_ACCOUNT_NAME -g $AKS_PERS_RESOURCE_GROUP -o tsv`

# Create the file share
az storage share create -n $AKS_PERS_SHARE_NAME

# Get storage account key
STORAGE_KEY=$(az storage account keys list --resource-group $AKS_PERS_RESOURCE_GROUP --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv)

# Echo storage account name and key
echo Storage account name: $AKS_PERS_STORAGE_ACCOUNT_NAME
echo Storage account key: $STORAGE_KEY
```

## Create Kubernetes Secret

Kubernetes needs credentials to access the file share. These credentials are stored in a [Kubernetes secret][kubernetes-secret], which is referenced when creating a Kubernetes pod.

Use the following command to create the secret. Replace `STORAGE_ACCOUNT_NAME` with your storage account name, and `STORAGE_ACCOUNT_KEY` with your storage key.

```console
kubectl create secret generic azure-secret --from-literal=azurestorageaccountname=STORAGE_ACCOUNT_NAME --from-literal=azurestorageaccountkey=STORAGE_ACCOUNT_KEY
```

## Mount file share as volume

Mount your Azure Files share into your pod by configuring the volume in its spec. Create a new file named `azure-files-pod.yaml` with the following contents. Update `aksshare` with the name given to the Azure Files share.

```yaml
apiVersion: v1
kind: Pod
metadata:
 name: azure-files-pod
spec:
 containers:
  - image: microsoft/sample-aks-helloworld
    name: azure
    volumeMounts:
      - name: azure
        mountPath: /mnt/azure
 volumes:
  - name: azure
    azureFile:
      secretName: azure-secret
      shareName: aksshare
      readOnly: false
```

Use kubectl to create a pod.

```azurecli-interactive
kubectl apply -f azure-files-pod.yaml
```

You now have a running container with your Azure file share mounted in the `/mnt/azure` directory.  You can see the volume mount when inspecting your pod via `kubectl describe pod azure-files-pod`.

## Next steps

Learn more about Kubernetes volumes using Azure Files.

> [!div class="nextstepaction"]
> [Kubernetes plugin for Azure Files][kubernetes-files]

<!-- LINKS - external -->
[kubectl-create]: https://kubernetes.io/docs/user-guide/kubectl/v1.8/#create
[kubernetes-files]: https://github.com/kubernetes/examples/blob/master/staging/volumes/azure_file/README.md
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/volumes/

<!-- LINKS - internal -->
[az-group-create]: /cli/azure/group#az-group-create
[az-storage-create]: /cli/azure/storage/account#az-storage-account-create
[az-storage-key-list]: /cli/azure/storage/account/keys#az-storage-account-keys-list
[az-storage-share-create]: /cli/azure/storage/share#az-storage-share-create
