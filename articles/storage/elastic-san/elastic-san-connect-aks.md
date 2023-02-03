---
title: Connect an Azure Elastic SAN (preview) volume to an AKS cluster.
description: Learn how to connect to an Azure Elastic SAN (preview) volume an AKS cluster.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 01/27/2023
ms.author: rogarana
ms.subservice: elastic-san
---

# Connect Elastic SAN volumes to AKS

For AKS clusters connecting to Elastic SAN, use the [Kubernetes iSCSI CSI driver](https://github.com/kubernetes-csi/csi-driver-iscsi) enabled on your cluster to connect Elastic SAN volumes. With this driver, you can access volumes on your Elastic SAN by creating persistent volumes on your AKS cluster, and then attaching the Elastic SAN volumes to the persistent volumes. 


## About the driver

The iSCSI CSI driver is an open source project that allows you to connect to a Kubernetes cluster over iSCSI. Since this is an open source project, Microsoft won't provide support from any issues stemming from the driver, itself.

The Kubernetes iSCSI CSI driver is available on GitHub:

- [Kubernetes iSCSI CSI driver repository](https://github.com/kubernetes-csi/csi-driver-iscsi)
- [Readme](https://github.com/kubernetes-csi/csi-driver-iscsi/blob/master/README.md)
- [Report iSCSI driver issues](https://github.com/kubernetes-csi/csi-driver-iscsi/issues)

### Licensing

The iSCSI CSI driver for Kubernetes is [licensed under the Apache 2.0 license](https://github.com/kubernetes-csi/csi-driver-iscsi/blob/master/LICENSE).

## Pre-requisites

Install the [iSCSI CSI driver](https://github.com/kubernetes-csi/csi-driver-iscsi) on your Kubernetes cluster.

## Get started

To connect an Elastic SAN volume to an AKS cluster, you must get the volume's StorageTargetIQN, StorageTargetPortalHostName, and StorageTargetPortalPort.


```azurepowershell
Get-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $searchedVolumeGroup -Name $searchedVolume 
```

```azurecli
az elastic-san volume show --elastic-san-name --name --resource-group --volume-group-name
```

To use the volume with AKS, use the following example to create a yml file, replace `yourTargetPortal`, `yourTargetPortalPort`, and `yourIQN` with the values you collected earlier.

```yml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: iscsiplugin-pv
  labels:
    name: data-iscsiplugin
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 1Gi
  csi:
    driver: iscsi.csi.k8s.io
    volumeHandle: iscsi-data-id
    volumeAttributes:
      targetPortal: "yourTargetPortal:yourTargetPortalPort"
      portals: "[]"
      iqn: "yourIQN"
      lun: "0"
      iscsiInterface: "default"
      discoveryCHAPAuth: "false"
      sessionCHAPAuth: "false"
```

Then we create this persistent volume referenced to the pod onto the AKS cluster. After that we can verify the connection by running some basic read/write workloads onto the volume.

Then, create the persistent volume with the following command:

```bash
kubectl apply -f pathtoyourfile/pv.yaml
```

Now that the persistent volume is created, create a persistent volume claim.

```bash
kubectl apply -f pathtoyourfile/pvc.yaml
```
