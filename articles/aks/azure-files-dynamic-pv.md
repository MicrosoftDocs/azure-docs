---
title: Use Azure File with AKS
description: Use Azure Disks with AKS
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 03/06/2018
ms.author: nepeters
ms.custom: mvc
---

# Persistent volumes with Azure files

A persistent volume represents a piece of storage that has been provisioned for use in a Kubernetes cluster. A persistent volume can be used by one or many pods, and can be dynamically or statically provisioned. This document details dynamic provisioning of an Azure file share as a Kubernetes persistent volume in an AKS cluster. 

For more information on Kubernetes persistent volumes, see [Kubernetes persistent volumes][kubernetes-volumes].

## Create storage account

When dynamically provisioning an Azure file share as a Kubernetes volume, any storage account can be used as long as it is contained in the same resource group as the AKS cluster. If needed, create a storage account in the same resource group as the AKS cluster. 

To identify the proper resource group, use the [az group list][az-group-list] command.

```azurecli-interactive
az group list --output table
```

You are looking for a resource group with a name similar to `MC_clustername_clustername_locaton`, where clustername is the name of your AKS cluster, and location is the Azure region where the cluster has been deployed.

```
Name                                 Location    Status
-----------------------------------  ----------  ---------
MC_myAKSCluster_myAKSCluster_eastus  eastus      Succeeded
myAKSCluster                         eastus      Succeeded
```

Use the [az storage account create][az-storage-account-create] command to create the storage account. 

Using this example, update `--resource-group` with the name of the resource group, and `--name` to a name of your choice.


```azurecli-interactive
az storage account create \
  --resource-group  MC_myAKSCluster_myAKSCluster_eastus \
  --name mystorageaccount --location eastus \
  --sku Standard_LRS
```

## Create storage class

A storage class is used to define how a dynamically created persistent volume is configured. Items such as the Azure storage account name, SKU, and region are defined in the storage class object. For more information on Kubernetes storage classes, see [Kubernetes Storage Classes][kubernetes-storage-classes].

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: azurefile
provisioner: kubernetes.io/azure-file
parameters:
  storageAccount: azure_storage_account_name
```

## Create persistent volume claim

A persistent volume claim uses the storage class object to dynamically provision a piece of storage. When using an Azure Files, an Azure file share is created in the storage account selected or specified in the storage class object.

The following manifest can be used to create a persistent volume claim `5GB` in size with `ReadWriteOnce` access. For more information on PVC access modes, see [Access Modes][access-modes].

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: azurefile
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: azurefile
  resources:
    requests:
      storage: 5Gi
```

## Using the persistent volume

Once the persistent volume claim has been created, and the storage successfully provisioned, a pod can be created with access to the volume. The following manifest creates a pod that uses the persistent volume claim `azurefile` to mount the Azure file share at the `/var/www/html` path. 

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: volume
  volumes:
    - name: volume
      persistentVolumeClaim:
        claimName: azurefile
```

## Next steps

Learn more about Kubernetes persistent volumes using Azure Files.

> [!div class="nextstepaction"]
> [Kubernetes plugin for Azure Files][kubernetes-files]

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubectl-create]: https://kubernetes.io/docs/user-guide/kubectl/v1.8/#create
[kubectl-describe]: https://kubernetes-v1-4.github.io/docs/user-guide/kubectl/kubectl_describe/
[kubernetes-files]: https://github.com/kubernetes/examples/blob/master/staging/volumes/azure_file/README.md
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubernetes-security-context]: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/

<!-- LINKS - internal -->
[az-group-create]: /cli/azure/group#az_group_create
[az-group-list]: /cli/azure/group#az_group_list
[az-storage-account-create]: /cli/azure/storage/account#az_storage_account_create
[az-storage-create]: /cli/azure/storage/account#az_storage_account_create
[az-storage-key-list]: /cli/azure/storage/account/keys#az_storage_account_keys_list
[az-storage-share-create]: /cli/azure/storage/share#az_storage_share_create