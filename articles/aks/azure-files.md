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
ms.date: 10/30/2017
ms.author: nepeters
ms.custom: mvc

---


# Using Azure Files with Kubernetes

Application often need to access and persist data in an external data volume. Azure files can be used as this external data volume. This article details using Azure files with a Kuebrentes POD in Azure Container Service (AKS).

For more information on Kubernetes volumes, see [Kubernetes volumes][kubernetes-volumes].

## Access details 

Azure files can be configured with three access modes. 

* ReadWriteOnce - read-write for a single node
* ReadOnlyMany - read-only for many nodes
* ReadWriteMany - read-write for many nodes

When using Azure Files with an Azure Container Service (AKS) cluster, the storage account and the AKS cluster must be created in the same Azure region. 

## Creating a file share

An existing Azure files instance can be used with Azure Container Service. If you need to create one, use the following set of commands. 

Use the [az storage account create][az-storage-create] command to create an Azure Storage account. The storage account name must be unique. Update this command with a unique value.

```azurecli-interactive
az storage account create --name mystorageaccount007 --resource-group myResourceGroup --sku Standard_LRS
```

Use the [az storage account show-connection-string][az-storage-conntection-string] to return the storage account connection string. This value is used to create the Azure Files share.

```azurecli-interactive
az storage account show-connection-string --resource-group myResourceGroup --name myfileshare007 -o tsv
```

Use the [az storage share create][az-storage-share-create] command to creat the Azure File share.

```azurecli-interactive
az storage share create --name myfileshare007 --account-name mystorageaccount007--connection-string <update>
```

## Create Kubernetes Secret

Kubernetes needs redentials to access the file share. Rather than storing the Azure Storage account name and key with each pod, it is stored once in a [Kubernetes secret][kubernetes-secret] and referenced by each Azure Files volume.

The values in the secret need to be base64 encoded. Use the following commands to return encoded values.

First, encode the name of the storage account. Replace <storage-account> with the name of your Azure storage account.

```azurecli-interactive
echo -n <storage-account> | base64
```

Next, the storag account access key is needed. Run the following command to return the encoded key. Replace <storage-account> with the storage account name and <resource-group> with the name of the resource group.

```azurecli-interactive
echo -n `az storage account keys list --name <storage-account> --resource-group <resource-group> --query '[0].value' -o tsv` | base64
```

Create a file named `azure-secret.yml` and copy in the following YAML. Update the `azurestorageaccountname` and `azurestorageaccountkey` values with the base64 ecoded values retrieved in the last step.

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

Output:

```bash
secret "azure-secret" created
```

## Mount file share as volume

You can mount your Azure file share into your pod by configuring the volume in its spec. Create a new file named `azure-files-pod.yml` with the following contents.

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
      shareName: <shareName>
      readOnly: false
```

Use kubectl to create a pod

```azurecli-interactive
kubectl apply -f azure-files-pod.yml
```

Output:

```bash
pod "azure-files-pod" created
```

You now have a running container with your Azure file share mounted in the `/mnt/azure` directory. You can see the volume mount when inspecting your pod via `kubectl describe pod azure-files-pod`.

## Next steps

Learn more about persisten volument using Azure Files.

> [!div class="nextstepaction"]
> [Kubernetes plugin for Azure Files](https://github.com/kubernetes/examples/blob/master/staging/volumes/azure_file/README.md)

<!-- LINKS -->
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/volumes/
[az-storage-create]: /cli/azure/storage/account#az_storage_account_create
[az-storage-conntection-string]: /cli/azure/storage/account#az_storage_account_show_connection_string
[[az-storage-share-create]: /cli/azure/storage/share#az_storage_share_create
[kubectl-apply]: https://kubernetes.io/docs/user-guide/kubectl/v1.8/#apply
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/