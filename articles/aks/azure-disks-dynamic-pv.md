---
title: Use Azure Disk with AKS
description: Use Azure Disks with AKS
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 03/05/2018
ms.author: nepeters
---

# Persistent volumes with Azure disks

A persistent volume represents a piece of storage that has been provisioned for use with Kubernetes pods. A persistent volume can be used by one or many pods and can be dynamically or statically provisioned. 

This document details using persistent volumes to dynamically create an Azure disk for used with AKS pods. The following Kubernetes objects are discussed throughout this document.

- Storage class - defines how storage is provisioned, this includes things like what disk type and disk SKU to use during disk creation.
- Persistent volume claim - uses a storage class to create and provision a piece of storage, and Azure disk in this case.
- Pod - once the persistent volume claim has been created, the Azure disk is auto-created and ready for use with a pod.

For more information on Kubernetes persistent volumes, see [Kubernetes persistent volumes][kubernetes-volumes].

## Built in storage classes

A storage class is used to define how a dynamically created persistent volume is configured. For more information on Kubernetes storage classes, see [Kubernetes Storage Classes][kubernetes-storage-classes].

Each AKS cluster includes two pre-created storage classes, both configured to work with Azure disks. Use the `kubectl get storageclass` command to see these.

```console
NAME                PROVISIONER                AGE
default (default)   kubernetes.io/azure-disk   1h
managed-premium     kubernetes.io/azure-disk   1h
```

The `default` storage class provisions a standard Azure disk. The `managed-premium` storage class provisions a premium Azure disk.

## Create persistent volume claim

When using an Azure disk, a persistent volume claim can be used to automatically create a disk that can then be mounted in a pod. The disk is created in the same resource group as the AKS resources.

This example manifest creates a persistent volume claim using the `managed-premium` storage class, to create a disk `5GB` in size with `ReadWriteOnce` access. For more information on PVC access modes, see [Access Modes][access-modes].

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

> [!NOTE]
> An Azure disk can only be mounted with Access mode type ReadWriteOnce, which makes it available to only a single AKS node. If needing to share a persistent volume across multiple nodes, consider using [Azure Files][azure-files-pvc].

## Using the persistent volume

Once the persistent volume claim has been created, and the disk successfully provisioned, a pod can be created with access to the disk. The following manifest creates a pod that uses the persistent volume claim `azure-managed-disk` to mount the Azure disk at the `/var/www/html` path. 

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
        claimName: azure-managed-disk
```

## Next steps

Learn more about Kubernetes persistent volumes using Azure disks.

> [!div class="nextstepaction"]
> [Kubernetes plugin for Azure disks][kubernetes-disk]

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubernetes-disk]: https://kubernetes.io/docs/concepts/storage/storage-classes/#new-azure-disk-storage-class-starting-from-v172
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/

<!-- LINKS - internal -->
[azure-files-pvc]: azure-files-dynamic-pv.md
[premium-storage]: ../virtual-machines/windows/premium-storage.md