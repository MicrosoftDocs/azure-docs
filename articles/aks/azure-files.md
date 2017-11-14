---
title: Use Azure File with AKS | Microsoft Docs
description: Use Azure Disks with AKS
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: aks, azure-container-service
keywords: ''

ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/11/2017
ms.author: nepeters
ms.custom: mvc

---

# Using Azure Files with Kubernetes

Container based applications often need to access and persist data in an external data volume. Azure files can be used as this external data store. This article details using Azure files as a Kubernetes volume in Azure Container Service.

For more information on Kubernetes volumes, see [Kubernetes volumes][kubernetes-volumes].

## Create an Azure file share

Before using an Azure File Share as a Kubernetes volume, you must create an Azure Storage account and the file share. The following commands can be used to complete these tasks. Take note or update the parameter values, some of these are needed when creating the Kubernetes volume. Also, the storage account key is stored in the variable `STORAGE_KEY`. This is also used when creating the Kubernetes volume.

Copy the following commands into a bash shell to create the necessary Azure File share.

```azurecli-interactive
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
```

## Create Kubernetes Secret

Kubernetes needs credentials to access the file share. Rather than storing the Azure Storage account name and key with each pod, it is stored once in a [Kubernetes secret][kubernetes-secret] and referenced by each Azure Files volume. 

The values in a Kubernetes secret manifest must be base64 encoded. Use the following commands to return encoded values. These steps re-use the variables from the storage creation step.

First, encode the name of the storage account. If needed, replace `$AKS_PERS_STORAGE_ACCOUNT_NAME` with the name of the Azure storage account.

```azurecli-interactive
echo -n $AKS_PERS_STORAGE_ACCOUNT_NAME | base64
```

Next, encode the storage account key. If needed, replace `$STORAGE_KEY` with the name of the Azure storage account key.

```azurecli-interactive
echo -n $STORAGE_KEY | base64
```

Create a file named `azure-secret.yml` and copy in the following YAML. Update the `azurestorageaccountname` and `azurestorageaccountkey` values with the base64 encoded values retrieved in the last step.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: azure-secret
type: Opaque
data:
  azurestorageaccountname: <base64_encoded_storage_account_name>
  azurestorageaccountkey: <base64_encoded_storage_account_key>
```

Use the [kubectl create][kubectl-create] command to create the secret.

```azurecli-interactive
kubectl create -f azure-secret.yml
```

## Mount file share as volume

You can mount your Azure Files share into your pod by configuring the volume in its spec. Create a new file named `azure-files-pod.yml` with the following contents. Update `aksshare` with the name given to the Azure Files share.

```yaml
apiVersion: v1
kind: Pod
metadata:
 name: azure-files-pod
spec:
 containers:
  - image: kubernetes/pause
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
kubectl apply -f azure-files-pod.yml
```

You now have a running container with your Azure file share mounted in the `/mnt/azure` directory. You can see the volume mount when inspecting your pod via `kubectl describe pod azure-files-pod`.

## Next steps

Learn more about Kubernetes volumes using Azure Files.

> [!div class="nextstepaction"]
> [Kubernetes plugin for Azure Files](https://github.com/kubernetes/examples/blob/master/staging/volumes/azure_file/README.md)

<!-- LINKS -->
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/volumes/
[az-storage-create]: /cli/azure/storage/account#az_storage_account_create
[az-storage-key-list]: /cli/azure/storage/account/keys#az_storage_account_keys_list
[az-storage-share-create]: /cli/azure/storage/share#az_storage_share_create
[kubectl-create]: https://kubernetes.io/docs/user-guide/kubectl/v1.8/#create
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[az-group-create]: /cli/azure/group#az_group_create