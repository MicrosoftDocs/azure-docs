---
title: Use Azure File with AKS
description: Use Azure Disks with AKS
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 05/21/2018
ms.author: iainfou
ms.custom: mvc
---

# Persistent volumes with Azure files

A persistent volume is a piece of storage that has been created for use in a Kubernetes cluster. A persistent volume can be used by one or many pods and can be dynamically or statically created. This document details **dynamic creation** of an Azure file share as a persistent volume.

For more information on Kubernetes persistent volumes, including static creation, see [Kubernetes persistent volumes][kubernetes-volumes].

## Create storage account

When dynamically creating an Azure file share as a Kubernetes volume, any storage account can be used as long as it is in the AKS **node** resource group. This is the one with the `MC_` prefix that was created by the provisioning of the resources for the AKS cluster. Get the resource group name with the [az resource show][az-resource-show] command.

```azurecli-interactive
$ az resource show --resource-group myResourceGroup --name myAKSCluster --resource-type Microsoft.ContainerService/managedClusters --query properties.nodeResourceGroup -o tsv

MC_myResourceGroup_myAKSCluster_eastus
```

Use the [az storage account create][az-storage-account-create] command to create the storage account.

Update `--resource-group` with the name of the resource group gathered in the last step, and `--name` to a name of your choice.

```azurecli-interactive
az storage account create --resource-group MC_myResourceGroup_myAKSCluster_eastus --name mystorageaccount --location eastus --sku Standard_LRS
```

> Azure Files only currently work with standard storage. If you use premium storage, your volume will fail to provision.

## Create storage class

A storage class is used to define how an Azure file share is created. A specific storage account can be specified in the class. If a storage account is not specified, a `skuName` and `location` must be specified, and all storage accounts in the associated resource group are evaluated for a match.

For more information on Kubernetes storage classes for Azure files, see [Kubernetes Storage Classes][kubernetes-storage-classes].

Create a file named `azure-file-sc.yaml` and copy in the following manifest. Update the `storageAccount` with the name of your target storage account. See the [Mount options] section for more information on `mountOptions`.

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

Create the storage class with the [kubectl apply][kubectl-apply] command.

```azurecli-interactive
kubectl apply -f azure-file-sc.yaml
```

## Create persistent volume claim

A persistent volume claim (PVC) uses the storage class object to dynamically provision an Azure file share.

The following YAML can be used to create a persistent volume claim `5GB` in size with `ReadWriteMany` access. For more information on access modes, see the [Kubernetes persistent volume][access-modes] documentation.

Create a file named `azure-file-pvc.yaml` and copy in the following YAML. Make sure that the `storageClassName` matches the storage class created in the last step.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: azurefile
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: azurefile
  resources:
    requests:
      storage: 5Gi
```

Create the persistent volume claim with the [kubectl apply][kubectl-apply] command.

```azurecli-interactive
kubectl apply -f azure-file-pvc.yaml
```

Once completed, the file share will be created. A Kubernetes secret is also created that includes connection information and credentials.

## Using the persistent volume

The following YAML creates a pod that uses the persistent volume claim `azurefile` to mount the Azure file share at the `/mnt/azure` path.

Create a file named `azure-pvc-files.yaml`, and copy in the following YAML. Make sure that the `claimName` matches the PVC created in the last step.

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

Create the pod with the [kubectl apply][kubectl-apply] command.

```azurecli-interactive
kubectl apply -f azure-pvc-files.yaml
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

If using a cluster of version 1.8.5 or greater and dynamically creating the persistant volume with a storage class, mount options can be specified on the storage class object. The following example sets `0777`.

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

If using a cluster of version 1.8.5 or greater and statically creating the persistant volume object, mount options need to be specified on the `PersistentVolume` object. for more information on statically creating a persistant volume, see [Static Persistent Volumes][pv-static].

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: azurefile
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteMany
  azureFile:
    secretName: azure-secret
    shareName: azurefile
    readOnly: false
  mountOptions:
  - dir_mode=0777
  - file_mode=0777
  - uid=1000
  - gid=1000
  ```

If using a cluster of version 1.8.0 - 1.8.4, a security context can be specified with the `runAsUser` value set to `0`. For more information on Pod security context, see [Configure a Security Context][kubernetes-security-context].

## Next steps

Learn more about Kubernetes persistent volumes using Azure Files.

> [!div class="nextstepaction"]
> [Kubernetes plugin for Azure Files][kubernetes-files]

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-describe]: https://kubernetes-v1-4.github.io/docs/user-guide/kubectl/kubectl_describe/
[kubernetes-files]: https://github.com/kubernetes/examples/blob/master/staging/volumes/azure_file/README.md
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubernetes-security-context]: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/#azure-file
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[pv-static]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#static

<!-- LINKS - internal -->
[az-group-create]: /cli/azure/group#az-group-create
[az-group-list]: /cli/azure/group#az-group-list
[az-resource-show]: /cli/azure/resource#az-resource-show
[az-storage-account-create]: /cli/azure/storage/account#az-storage-account-create
[az-storage-create]: /cli/azure/storage/account#az-storage-account-create
[az-storage-key-list]: /cli/azure/storage/account/keys#az-storage-account-keys-list
[az-storage-share-create]: /cli/azure/storage/share#az-storage-share-create
[mount-options]: #mount-options
