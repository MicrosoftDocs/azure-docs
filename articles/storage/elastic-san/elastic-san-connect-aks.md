---
title: Connect an Azure Elastic SAN Preview volume to an AKS cluster.
description: Learn how to connect to an Azure Elastic SAN Preview volume an Azure Kubernetes Service cluster.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 07/11/2023
ms.author: rogarana
---

# Connect Azure Elastic SAN Preview volumes to an Azure Kubernetes Service cluster

This article explains how to connect an Azure Elastic storage area network (SAN) Preview volume from an Azure Kubernetes Service (AKS) cluster. To make this connection, enable the [Kubernetes iSCSI CSI driver](https://github.com/kubernetes-csi/csi-driver-iscsi) on your cluster. With this driver, you can access volumes on your Elastic SAN by creating persistent volumes on your AKS cluster, and then attaching the Elastic SAN volumes to the persistent volumes. 

## About the driver

The iSCSI CSI driver is an open source project that allows you to connect to a Kubernetes cluster over iSCSI. Since the driver is an open source project, Microsoft won't provide support from any issues stemming from the driver, itself.

The Kubernetes iSCSI CSI driver is available on GitHub:

- [Kubernetes iSCSI CSI driver repository](https://github.com/kubernetes-csi/csi-driver-iscsi)
- [Readme](https://github.com/kubernetes-csi/csi-driver-iscsi/blob/master/README.md)
- [Report iSCSI driver issues](https://github.com/kubernetes-csi/csi-driver-iscsi/issues)

### Licensing

The iSCSI CSI driver for Kubernetes is [licensed under the Apache 2.0 license](https://github.com/kubernetes-csi/csi-driver-iscsi/blob/master/LICENSE).

## Prerequisites

- Use either the [latest Azure CLI](/cli/azure/install-azure-cli) or install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell)
- Meet the [compatibility requirements](https://github.com/kubernetes-csi/csi-driver-iscsi/blob/master/README.md#container-images--kubernetes-compatibility) for the iSCSI CSI driver
- [Deploy an Elastic SAN Preview](elastic-san-create.md)
- [Configure a virtual network endpoint](elastic-san-networking.md)
- [Configure virtual network rules](elastic-san-networking.md#configure-virtual-network-rules)

## Limitations

- Dynamic provisioning isn't currently supported
- Only `ReadWriteOnce` access mode is currently supported

## Get started

### Driver installation

```
curl -skSL https://raw.githubusercontent.com/kubernetes-csi/csi-driver-iscsi/master/deploy/install-driver.sh | bash -s master --
```

After deployment, check the pods status to verify that the driver installed.

```bash
kubectl -n kube-system get pod -o wide -l app=csi-iscsi-node
```

### Get volume information

You need the volume's StorageTargetIQN, StorageTargetPortalHostName, and StorageTargetPortalPort.

You can get them with the following Azure PowerShell command:

```azurepowershell
Get-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $searchedVolumeGroup -Name $searchedVolume 
```

You can also get them with the following Azure CLI command:

```azurecli
az elastic-san volume show --elastic-san-name --name --resource-group --volume-group-name
```

### Cluster configuration

Once you've retrieved your volume's information, you need to create a few yaml files for your new resources on your AKS cluster.

### Storageclass

Use the following example to create a storageclass.yml file. This file defines your persistent volume's storageclass.

```yml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: sanVolume
provisioner: manual
```

### Persistent volume

After you've created the storage class, create a *pv.yml* file. This file defines your [persistent volume](../../aks/concepts-storage.md#persistent-volumes). In the following example, replace `yourTargetPortal`, `yourTargetPortalPort`, and `yourIQN` with the values you collected earlier, then use the example to create a *pv.yml* file. If you need more than 1 gibibyte of storage and have it available, replace `1Gi` with the amount of storage you require.

```yml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: iscsiplugin-pv
  labels:
    name: data-iscsiplugin
spec:
  storageClassName: sanVolume
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
      discoveryCHAPAuth: "true"
      sessionCHAPAuth: "false"
```

After creating the *pv.yml* file, create a persistent volume with the following command:

```bash
kubectl apply -f pathtoyourfile/pv.yaml
```

### Persistent volume claim

Next, create a [persistent volume claim](../../aks/concepts-storage.md#persistent-volume-claims). Use the storage class we defined earlier with the persistent volume we defined. The following is an example of what your pvc.yml file might look like:

```yml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: iscsiplugin-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: sanVolume
  selector:
    matchExpressions:
      - key: name
        operator: In
        values: ["data-iscsiplugin"]
```

After creating the *pvc.yml* file, create a persistent volume claim.

```bash
kubectl apply -f pathtoyourfile/pvc.yaml
```

To verify your PersistentVolumeClaim is created and bound to the PersistentVolume, run the following command: 

```bash
kubectl get pvc pathtoyourfile 
```


Finally, create a [pod manifest](../../aks/concepts-clusters-workloads.md#pods). The following is an example of what your *pod.yml* file might look like. You can use it to make your own pod manifest, replace the values for `name`, `image`, and `mountPath` with your own:

```yml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - image: maersk/nginx
      imagePullPolicy: Always
      name: nginx
      ports:
        - containerPort: 80
          protocol: TCP
      volumeMounts:
        - mountPath: /var/www
          name: iscsi-volume
  volumes:
    - name: iscsi-volume
      persistentVolumeClaim:
        claimName: iscsiplugin-pvc
```

After creating the *pod.yml* file, create a pod.

```bash
kubectl apply -f pathtoyourfile/pod.yaml
```

To verify your Pod was created, run the following command: 

```bash
kubectl get pods  
```

You've now successfully connected an Elastic SAN volume to your AKS cluster.

## Next steps

[Plan for deploying an Elastic SAN Preview](elastic-san-planning.md)

<!-- LINKS - internal -->
[Configure Elastic SAN networking Preview]: elastic-san-networking.md
