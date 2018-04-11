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

A persistent volume represents a piece of storage that has been provisioned for use in a Kubernetes cluster. A persistent volume can be used by one or many pods and can be dynamically or statically provisioned. This document details dynamic provisioning of an Azure file share as a Kubernetes persistent volume in an AKS cluster.

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
az storage account create --resource-group MC_myAKSCluster_myAKSCluster_eastus --name mystorageaccount --location eastus --sku Standard_LRS
```

## Create storage class

A storage class is used to define how an Azure file share is created. A specific storage account can be specified in the class. If a storage account is not specified, a `skuName` and `location` must be specified, and all storage accounts in the associated resource group are evaluated for a match.

For more information on Kubernetes storage classes for Azure files, see [Kubernetes Storage Classes][kubernetes-storage-classes].

Create a file named `azure-file-sc.yaml` and copy in the following manifest. Update the `storageAccount` with the name of your target storage account.

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: azurefile
provisioner: kubernetes.io/azure-file
parameters:
  storageAccount: mystorageaccount
```

Create the storage class with the [kubectl create][kubectl-create] command.

```azurecli-interactive
kubectl create -f azure-file-sc.yaml
```

## Create persistent volume claim

A persistent volume claim (PVC) uses the storage class object to dynamically provision an Azure file share.

The following manifest can be used to create a persistent volume claim `5GB` in size with `ReadWriteOnce` access.

Create a file named `azure-file-pvc.yaml` and copy in the following manifest. Make sure that the `storageClassName` matches the storage class created in the last step.

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

Create the persistent volume claim with the [kubectl create][kubectl-create] command.

```azurecli-interactive
kubectl create -f azure-file-pvc.yaml
```

Once completed, the file share will be created. A Kubernetes secret is also created that contains connection information and credentials.

## Using the persistent volume

The following manifest creates a pod that uses the persistent volume claim `azurefile` to mount the Azure file share at the `/mnt/azure` path.

Create a file named `azure-pvc-files.yaml`, and copy in the following manifest. Make sure that the `claimName` matches the PVC created in the last step.

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
      - mountPath: "/mnt/azure"
        name: volume
  volumes:
    - name: volume
      persistentVolumeClaim:
        claimName: azurefile
```

Create the pod with the [kubectl create][kubectl-create] command.

```azurecli-interactive
kubectl create -f azure-pvc-files.yaml
```

You now have a running pod with your Azure disk mounted in the `/mnt/azure` directory. This configuration can be seen when inspecting your pod via `kubectl describe pod mypod`.

## Mount options

Default fileMode and dirMode values differ between Kubernetes versions as described in the following table.

| version | value |
| ---- | ---- |
| v1.6.x, v1.7.x | 0777 |
| v1.8.0-v1.8.5 | 0700 |
| v1.8.6 or above | 0755 |
| v1.9.0 | 0700 |
| v1.9.1 or above | 0755 |

If using a cluster of version 1.8.5 or greater, mount options can be specified on the storage class object. The following example sets `0777`.

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: azurefile
provisioner: kubernetes.io/azure-file
mountOptions:
  - dir_mode=0777
  - file_mode=0777
  - uid=1000
  - gid=1000
parameters:
  skuName: Standard_LRS
```

If using a cluster of version 1.8.0 - 1.8.4, a security context can be specified with the `runAsUser` value set to `0`. For more information on Pod security context, see [Configure a Security Context][kubernetes-security-context].

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
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/#azure-file
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/

<!-- LINKS - internal -->
[az-group-create]: /cli/azure/group#az_group_create
[az-group-list]: /cli/azure/group#az_group_list
[az-storage-account-create]: /cli/azure/storage/account#az_storage_account_create
[az-storage-create]: /cli/azure/storage/account#az_storage_account_create
[az-storage-key-list]: /cli/azure/storage/account/keys#az_storage_account_keys_list
[az-storage-share-create]: /cli/azure/storage/share#az_storage_share_create
