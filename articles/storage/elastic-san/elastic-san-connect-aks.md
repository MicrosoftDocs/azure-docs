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

For AKS clusters connecting to Elastic SAN, we use an open source iSCSI csi driver enabled on the cluster to connect to our SAN volumes.  

Volumes on your Elastic SAN can be accessed via the creation of Persistent volumes on the AKS cluster by using identifying information on the volume: the Target IQN & Target Portal Hostname. 

Then we create this persistent volume referenced to the pod onto the AKS cluster. After that we can verify the connection by running some basic read/write workloads onto the volume. 

## Pre-requisites

Install the [iSCSI CSI driver](https://github.com/kubernetes-csi/csi-driver-iscsi) on your Kubernetes cluster.

## Get started

To connect a volume to an AKS cluster, you must get the volume's StorageTargetIQN, StorageTargetPortalHostName, and StorageTargetPortalPort.

```azurepowershell
Get-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $searchedVolumeGroup -Name $searchedVolume 
```

```azurecli
az elastic-san volume show --elastic-san-name --name --resource-group --volume-group-name
```

To use the volume with AKS, create a yaml file with the information.

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
      targetPortal: "yourTargetPortal"
      portals: "[]"
      iqn: "yourIQN"
      lun: "0"
      iscsiInterface: "default"
      discoveryCHAPAuth: "false"
      sessionCHAPAuth: "false"
```

Then, create the persistent volume with the following command:

```bash
kubectl apply -f pathtoyourfile/pv.yaml
```

Now that the persistent volume is created, create a persistent volume claim.

```bash
kubectl apply -f pathtoyourfile/pvc.yaml
```
