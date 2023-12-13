---
title: Resize persistent volume claim (PVC) for Azure Arc-enabled data services volume
description: Explains how to resize a persistent volume claim for a volume used for Azure Arc-enabled data services.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/19/2023
ms.topic: how-to
---

# Resize persistent volume to increase size

This article explains how to resize an existing persistent volume to increase its size by editing the `PersistentVolumeClaim` (PVC) object. 

> [!NOTE]
> Resizing PVCs using this method only works your `StorageClass` supports `AllowVolumeExpansion=True`.

When you deploy a SQL Managed Instance enabled by Azure Arc, you can configure the size of the persistent volume (PV) for `data`, `logs`, `datalogs`, and `backups`. The deployment creates these volumes based on the values set by parameters `--volume-size-data`, `--volume-size-logs`, `--volume-size-datalogs`, and `--volume-size-backups`. When these volumes become full, you will need to resize the `PersistentVolumes`. SQL Managed Instance enabled by Azure Arc is deployed as part of a `StatefulSet` for both General Purpose or Business Critical service tiers. Kubernetes supports automatic resizing for persistent volumes but not for volumes attached to `StatefulSet`. 

Following are the steps to resize persistent volumes attached to `StatefulSet`: 

1. Scale the `StatefulSet` replicas to 0
2. Patch the PVC to the new size
3. Scale the `StatefulSet` replicas back to the original size

During the patching of `PersistentVolumeClaim`, the status of the persistent volume claim will likely change from: `Attached` to `Resizing` to `FileSystemResizePending` to `Attached`. The exact states will depend on the storage provisioner. 

> [!NOTE]
> Ensure the managed instance is in a healthy state before you proceed. Run `kubectl get sqlmi -n <namespace>` and check the status of the managed instance.

## 1. Scale the `StatefulSet` replicas to 0

There is one `StatefulSet` deployed for each Arc SQL MI. The number of replicas in the `StatefulSet` is equal to the number of replicas in the Arc SQL MI. For General Purpose service tier, this is 1. For Business Critical service tier it could be 1, 2 or 3 depending on how many replicas were specified. Run the below command to get the number of `StatefulSet` replicas if you have a Business Critical instance. 

```console
kubectl get sts --namespace  <namespace>
```

For example, if the namespace is `arc`, run:

```console
kubectl get sts --namespace arc
```

Notice the number of stateful sets under the `READY` column for the SQL managed instance(s).

Run the below command to scale the `StatefulSet` replicas to 0:

```console
kubectl scale statefulsets <statefulset> --namespace <namespace> --replicas= <number>
```

For example:

```console
kubectl scale statefulsets sqlmi1 --namespace arc --replicas=0
```

## 2. Patch the PVC to the new size

Run the below command to get the name of the `PersistentVolumeClaim` which needs to be resized:

```console
kubectl get pvc --namespace <namespace>
```

For example:

```console
kubectl get pvc --namespace arc
```


Once the stateful `StatefulSet` replicas have completed scaling down to 0, patch the  `StatefulSet`. Run the following command:

```console
$newsize='{\"spec\":{\"resources\":{\"requests\":{\"storage\":\"<newsize>Gi\"}}}}'
kubectl patch pvc <name of PVC> --namespace <namespace> --type merge --patch $newsize
```

For example: the following command will resize the data PVC to 50Gi. 

```console
$newsize='{\"spec\":{\"resources\":{\"requests\":{\"storage\":\"50Gi\"}}}}'
kubectl patch pvc data-a6gt3be7mrtq60eao0gmgxgd-sqlmi1-0 --namespace arcns --type merge --patch $newsize
```

## 3. Scale the `StatefulSet` replicas to original size

Once the resize completes, scale the `StatefulSet` replicas back to its original size by running the below command:

```console
kubectl scale statefulsets <statefulset> --namespace <namespace> --replicas= <number>
```

For example: The below command sets the `StatefulSet` replicas to 3.

```
kubectl scale statefulsets sqlmi1 --namespace arc --replicas=3
```
Ensure the Arc-enabled SQL managed instance is back to ready status by running:

```console
kubectl get sqlmi -A
```

## See also

[Sizing Guidance](sizing-guidance.md)
