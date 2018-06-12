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

## Creating a file share

An existing Azure File share can be used with Azure Container Service. If you need to create one, use the following set of commands.

Create a resource group for the Azure File share using the [az group create][az-group-create] command. The resource group of the storage account and the Kubernetes cluster must be located in the same region.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Use the [az storage account create][az-storage-create] command to create an Azure Storage account. The storage account name must be unique. Update the value of the `--name` argument with a unique value.

```azurecli-interactive
az storage account create --name mystorageaccount --resource-group myResourceGroup --sku Standard_LRS
```

Use the [az storage account keys list ][az-storage-key-list] command to return the storage key. Update the value of the `--account-name` argument with the unique storage account name.

Take note of one of the key values, this is used in subsequent steps.

```azurecli-interactive
az storage account keys list --account-name mystorageaccount --resource-group myResourceGroup --output table
```

Use the [az storage share create][az-storage-share-create] command to create the Azure File share. Update the `--account-key` value with the value collected in the last step.

```azurecli-interactive
az storage share create --name myfileshare --account-name mystorageaccount --account-key <key>
```

## Create Kubernetes Secret

Kubernetes needs credentials to access the file share. Rather than storing the Azure Storage account name and key with each pod, it is stored once in a [Kubernetes secret][kubernetes-secret] and referenced by each Azure Files volume. 

The values in a Kubernetes secret manifest must be base64 encoded. Use the following commands to return encoded values.

First, encode the name of the storage account. Replace `storage-account` with the name of your Azure storage account.

```azurecli-interactive
echo -n <storage-account> | base64
```

Next, the storage account access key is needed. Run the following command to return the encoded key. Replace `storage-key` with the key collected in an earlier step

```azurecli-interactive
echo -n <storage-key> | base64
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

Use the [kubectl apply][kubectl-apply] command to create the secret.

```azurecli-interactive
kubectl apply -f azure-secret.yml
```

## Mount file share as volume

You can mount your Azure Files share into your pod by configuring the volume in its spec. Create a new file named `azure-files-pod.yml` with the following contents. Update `share-name` with the name given to the Azure Files share.

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
      shareName: <share-name>
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
[kubectl-apply]: https://kubernetes.io/docs/user-guide/kubectl/v1.8/#apply
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[az-group-create]: /cli/azure/group#az_group_create