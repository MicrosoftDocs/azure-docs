---
title: Use Azure Disk with AKS
description: Use Azure Disks with AKS
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 03/06/2018
ms.author: nepeters
---

# Persistent volumes with Azure disks

A persistent volume represents a piece of storage that has been provisioned for use with Kubernetes pods. A persistent volume can be used by one or many pods and can be dynamically or statically provisioned. For more information on Kubernetes persistent volumes, see [Kubernetes persistent volumes][kubernetes-volumes].

This document details using persistent volumes with Azure disks in an Azure Kubernetes Service (AKS) cluster.

> [!NOTE]
> An Azure disk can only be mounted with Access mode type ReadWriteOnce, which makes it available to only a single AKS node. If needing to share a persistent volume across multiple nodes, consider using [Azure Files][azure-files-pvc].

## Built in storage classes

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. For more information on Kubernetes storage classes, see [Kubernetes Storage Classes][kubernetes-storage-classes].

Each AKS cluster includes two pre-created storage classes, both configured to work with Azure disks. The `default` storage class provisions a standard Azure disk. The `managed-premium` storage class provisions a premium Azure disk. If the AKS nodes in your cluster use premium storage, select the `managed-premium` class.

Use the [kubectl get sc][kubectl-get] command to see the pre-created storage classes.

```console
NAME                PROVISIONER                AGE
default (default)   kubernetes.io/azure-disk   1h
managed-premium     kubernetes.io/azure-disk   1h
```

## Create persistent volume claim

A persistent volume claim (PVC) is used to automatically provision storage based on a storage class. In this case, a PVC can use one of the pre-created storage classes to create a standard or premium Azure managed disk.

Create a file named `azure-premimum.yaml`, and copy in the following manifest.

Take note that the `managed-premium` storage class is specified in the annotation, and the claim is requesting a disk `5GB` in size with `ReadWriteOnce` access.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: azure-managed-disk
  annotations:
    volume.beta.kubernetes.io/storage-class: managed-premium
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

Create the persistent volume claim with the [kubectl create][kubectl-create] command.

```azurecli-interactive
kubectl create -f azure-premimum.yaml
```

## Using the persistent volume

Once the persistent volume claim has been created, and the disk successfully provisioned, a pod can be created with access to the disk. The following manifest creates a pod that uses the persistent volume claim `azure-managed-disk` to mount the Azure disk at the `/mnt/azure` path.

Create a file named `azure-pvc-disk.yaml`, and copy in the following manifest.

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
        claimName: azure-managed-disk
```

Create the pod with the [kubectl create][kubectl-create] command.

```azurecli-interactive
kubectl create -f azure-pvc-disk.yaml
```

You now have a running pod with your Azure disk mounted in the `/mnt/azure` directory. This configuration can be seen when inspecting your pod via `kubectl describe pod mypod`.

## Next steps

Learn more about Kubernetes persistent volumes using Azure disks.

> [!div class="nextstepaction"]
> [Kubernetes plugin for Azure disks][kubernetes-disk]

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-disk]: https://kubernetes.io/docs/concepts/storage/storage-classes/#new-azure-disk-storage-class-starting-from-v172
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/

<!-- LINKS - internal -->
[azure-files-pvc]: azure-files-dynamic-pv.md
[premium-storage]: ../virtual-machines/windows/premium-storage.md