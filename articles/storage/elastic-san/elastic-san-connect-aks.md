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

## Get started

### Driver installation

First, we'll need to install the Kubernetes iSCSI CSI driver on your cluster.

You can either perform a remote install with the following command:

`curl -skSL https://raw.githubusercontent.com/kubernetes-csi/csi-driver-iscsi/master/deploy/install-driver.sh | bash -s master --`

or you can perform a local install with the following command:

```
git clone https://github.com/kubernetes-csi/csi-driver-iscsi.git 

cd csi-driver-iscsi 

./deploy/install-driver.sh master local
```

Afterwards, check the pods status to verify that the driver installed.

```bash
kubectl -n kube-system get pod -o wide -l app=csi-iscsi-node
```

### Volume information

To connect an Elastic SAN volume to an AKS cluster, you must get the volume's StorageTargetIQN, StorageTargetPortalHostName, and StorageTargetPortalPort.


```azurepowershell
Get-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $searchedVolumeGroup -Name $searchedVolume 
```

```azurecli
az elastic-san volume show --elastic-san-name --name --resource-group --volume-group-name
```

### Cluster configuration

Then, you'll need to create a few yml files on your AKS cluster.

First, create a storageclass.yml file, which you'll use to define the persistent volume.

```yml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: manual
provisioner: manual
```

Then, create a pv.yml file, for the persistent volume. Use the following example to create a yml file, replace `yourTargetPortal`, `yourTargetPortalPort`, and `yourIQN` with the values you collected earlier. If you need more than 1 gibibytes of storage and have it available, replace `1Gi` with the amount of storage you require.

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
  storageClassName: manual
  selector:
    matchExpressions:
      - key: name
        operator: In
        values: ["data-iscsiplugin"]
```

Finally, create the pod.yml file, it should look like this:

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

### Deployment

Then, create the persistent volume with the following command:

```bash
kubectl apply -f pathtoyourfile/pv.yaml
```

Now that the persistent volume is created, create a persistent volume claim.

```bash
kubectl apply -f pathtoyourfile/pvc.yaml
```

Finally, create the pod.

```bash
kubectl apply -f pathtoyourfile/pod.yaml
```