---
title: Azure Operator Nexus storage for Kubernetes
description: Get an overview of available storage classes for Kubernetes on Azure Operator Nexus.
author: pjw711
ms.author: peterwhiting
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 01/06/2025
ms.custom: template-concept
---

# Azure Operator Nexus storage for Kubernetes

Each Azure Operator Nexus cluster uses a single storage appliance to provide persistent storage to Nexus Kubernetes cluster tenant workloads. The Azure Operator Nexus software Kubernetes stack offers two types of persistent storage. Operators select them through the Kubernetes StorageClass mechanism.

> [!IMPORTANT]
> Azure Operator Nexus does not support ephemeral volumes. Nexus recommends that the persistent volume storage mechanisms described in this document are used for all Nexus Kubernetes cluster workload volumes as these provide the highest levels of performance and availability. All storage in Azure Operator Nexus is provided by the storage appliance. There is no support for storage provided by baremetal machine disks.

## Kubernetes storage classes

### StorageClass: nexus-volume

The default storage mechanism, *nexus-volume*, is the preferred choice for most users. It provides the highest levels of performance and availability. However, volumes can't be simultaneously shared across multiple worker nodes. Operators can access and manage these volumes by using the Azure API and portal, through the volume resource.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: testPvc
  namespace: default
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 107Mi
  storageClassName: nexus-volume
  volumeMode: Block
  volumeName: testVolume
status:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 107Mi
  phase: Bound
```

### StorageClass: nexus-shared

In situations where a shared file system is required, the *nexus-shared* storage class is available. This storage class provides a highly available shared storage solution by enabling multiple pods in the same Nexus Kubernetes cluster to concurrently access and share the same volume. The *nexus-shared* storage class is backed by a highly available NFS storage service. This NFS storage service (storage pool currently limited to a maximum size of 1 TiB) is available per Cloud Service Network (CSN). The NFS storage service is deployed automatically on creation of a CSN resource. Any Nexus Kubernetes cluster attached to the CSN can provision persistent volumes from this shared storage pool. Nexus-shared supports both Read Write Once (RWO) and Read Write Many (RWX) access modes. What that means is that the workload applications can make use of either of these access modes to access the shared storage.

<!--- IMG ![Nexus Shared Volume](Docs/media/nexus-shared-volume.png) IMG --->
:::image type="content" source="media/nexus-shared-volume.png" alt-text="Diagram depicting how nexus-shared provisions a volume for a workload in Nexus Kubernetes Cluster.":::

Figure: Nexus Shared Volume

Although the performance and availability of *nexus-shared* are sufficient for most applications, we recommend that workloads with heavy I/O requirements use the *nexus-volume* option for optimal performance.

#### Read Write Once (RWO)

In Read Write Once (RWO) mode, only one node or claimant can mount the nexus-shared volume at a time. ReadWriteOnce access mode still allows multiple pods to access the volume when the pods are running on the same node.

```yaml
apiVersion: v1
items:
- apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: test-pvc
    namespace: default
  spec:
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 5Gi
    storageClassName: nexus-shared
    volumeMode: Filesystem
    volumeName: TestVolume
  status:
    accessModes:
    - ReadWriteOnce
    capacity:
      storage: 5Gi
    phase: Bound
```

#### Read Write Many (RWX)

In the Read Write Many (RWX) mode, multiple nodes or claimants can mount the nexus-shared volume at the same time.

```yaml
apiVersion: v1
items:
- apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: test-pvc
    namespace: default
  spec:
    accessModes:
    - ReadWriteMany
    resources:
      requests:
        storage: 5Gi
    storageClassName: nexus-shared
    volumeMode: Filesystem
    volumeName: TestVolume
  status:
    accessModes:
    - ReadWriteMany
    capacity:
      storage: 5Gi
    phase: Bound
```

### Examples

#### Read Write Once (RWO) with nexus-volume storage class

This example manifest creates a StatefulSet with PersistentVolumeClaimTemplate using nexus-volume storage class in ReadWriteOnce mode.

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: test-sts-rwo
  labels:
    app: test-sts-rwo
spec:
  serviceName: test-sts-rwo-svc
  replicas: 3
  selector:
    matchLabels:
      app: test-sts-rwo
  template:
    metadata:
      labels:
        app: test-sts-rwo
    spec:
      containers:
      - name: busybox
        command:
        - "/bin/sh"
        - "-c"
        - while true; do echo "$(date) -- $(hostname)" >> /mnt/hostname.txt; sleep 1; done
        image: busybox
        volumeMounts:
        - name: test-volume-rwo
          mountPath: /mnt/
  volumeClaimTemplates:
    - metadata:
        name: test-volume-rwo
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
        storageClassName: nexus-volume
```

Each pod of the StatefulSet has one PersistentVolumeClaim created.

```bash
# kubectl get pvc
NAME                             STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
test-volume-rwo-test-sts-rwo-0   Bound    pvc-e41fec47-cc43-4cd5-8547-5a4457cbdced   10Gi       RWO            nexus-volume   8m17s
test-volume-rwo-test-sts-rwo-1   Bound    pvc-1589dc79-59d2-4a1d-8043-b6a883b7881d   10Gi       RWO            nexus-volume   7m58s
test-volume-rwo-test-sts-rwo-2   Bound    pvc-82e3beac-fe67-4676-9c61-e982022d443f   10Gi       RWO            nexus-volume   12s
```

```bash
# kubectl get pods -o wide -w
NAME             READY   STATUS    RESTARTS   AGE     IP              NODE                                         NOMINATED NODE   READINESS GATES
test-sts-rwo-0   1/1     Running   0          8m31s   10.245.231.74   nexus-cluster-6a8c4018-agentpool2-md-vhhv6   <none>           <none>
test-sts-rwo-1   1/1     Running   0          8m12s   10.245.126.73   nexus-cluster-6a8c4018-agentpool1-md-27nw4   <none>           <none>
test-sts-rwo-2   1/1     Running   0          26s     10.245.183.9    nexus-cluster-6a8c4018-agentpool1-md-4jprt   <none>           <none>
```

```bash
# kubectl exec test-sts-rwo-0 -- cat /mnt/hostname.txt
Thu Nov  9 21:57:25 UTC 2023 -- test-sts-rwo-0
Thu Nov  9 21:57:26 UTC 2023 -- test-sts-rwo-0
Thu Nov  9 21:57:27 UTC 2023 -- test-sts-rwo-0

# kubectl exec test-sts-rwo-1 -- cat /mnt/hostname.txt
Thu Nov  9 21:57:19 UTC 2023 -- test-sts-rwo-1
Thu Nov  9 21:57:20 UTC 2023 -- test-sts-rwo-1
Thu Nov  9 21:57:21 UTC 2023 -- test-sts-rwo-1

# kubectl exec test-sts-rwo-s -- cat /mnt/hostname.txt
Thu Nov  9 21:58:32 UTC 2023 -- test-sts-rwo-2
Thu Nov  9 21:58:33 UTC 2023 -- test-sts-rwo-2
Thu Nov  9 21:58:34 UTC 2023 -- test-sts-rwo-2
```

#### Read Write Many (RWX) with nexus-shared storage class

The below manifest creates a Deployment with a PersistentVolumeClaim (PVC) using nexus-shared storage class in ReadWriteMany mode. The PVC created is shared by all the pods of the deployment and can be used to read and write by all of them simultaneously.

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-volume-rwx
spec:
  accessModes:
    - ReadWriteMany
  volumeMode: Filesystem
  resources:
    requests:
      storage: 3Gi
  storageClassName: nexus-shared
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: test-deploy-rwx
  name: test-deploy-rwx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: test-deploy-rwx
  template:
    metadata:
      labels:
        app: test-deploy-rwx
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: kubernetes.azure.com/agentpool
                operator: Exists
                values: []
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: busybox
        command:
        - "/bin/sh"
        - "-c"
        - while true; do echo "$(date) -- $(hostname)" >> /mnt/hostname.txt; sleep 1; done
        image: busybox
        volumeMounts:
        - name: test-volume-rwx
          mountPath: /mnt/
      volumes:
      - name: test-volume-rwx
        persistentVolumeClaim:
          claimName: test-volume-rwx
...
```

Once applied, there are three replicas of the deployment sharing the same PVC.

```bash
# kubectl get pvc
NAME                             STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
test-volume-rwx                  Bound    pvc-32f0717e-6b63-4d64-a458-5be4ffe21d37   3Gi        RWX            nexus-shared   6s
```

```bash
# kubectl get pods -o wide -w
NAME                             READY   STATUS    RESTARTS   AGE     IP               NODE                                         NOMINATED NODE   READINESS GATES
test-deploy-rwx-fdb8f49c-86pv4   1/1     Running   0          18s     10.245.224.140   nexus-cluster-6a8c4018-agentpool1-md-s2dh7   <none>           <none>
test-deploy-rwx-fdb8f49c-9zsjf   1/1     Running   0          18s     10.245.126.74    nexus-cluster-6a8c4018-agentpool1-md-27nw4   <none>           <none>
test-deploy-rwx-fdb8f49c-wdgw7   1/1     Running   0          18s     10.245.231.75    nexus-cluster-6a8c4018-agentpool2-md-vhhv6   <none>           <none>
```

It can be observed from the below output that all pods are writing into the same PVC.

```bash
# kubectl exec test-deploy-rwx-fdb8f49c-86pv4 -- cat /mnt/hostname.txt
Thu Nov  9 21:51:41 UTC 2023 -- test-deploy-rwx-fdb8f49c-86pv4
Thu Nov  9 21:51:41 UTC 2023 -- test-deploy-rwx-fdb8f49c-9zsjf
Thu Nov  9 21:51:41 UTC 2023 -- test-deploy-rwx-fdb8f49c-wdgw7
Thu Nov  9 21:51:42 UTC 2023 -- test-deploy-rwx-fdb8f49c-86pv4

# kubectl exec test-deploy-rwx-fdb8f49c-9zsjf -- cat /mnt/hostname.txt
Thu Nov  9 21:51:41 UTC 2023 -- test-deploy-rwx-fdb8f49c-86pv4
Thu Nov  9 21:51:41 UTC 2023 -- test-deploy-rwx-fdb8f49c-9zsjf
Thu Nov  9 21:51:41 UTC 2023 -- test-deploy-rwx-fdb8f49c-wdgw7
Thu Nov  9 21:51:42 UTC 2023 -- test-deploy-rwx-fdb8f49c-86pv4

# kubectl exec test-deploy-rwx-fdb8f49c-wdgw7 -- cat /mnt/hostname.txt
Thu Nov  9 21:51:41 UTC 2023 -- test-deploy-rwx-fdb8f49c-86pv4
Thu Nov  9 21:51:41 UTC 2023 -- test-deploy-rwx-fdb8f49c-9zsjf
Thu Nov  9 21:51:41 UTC 2023 -- test-deploy-rwx-fdb8f49c-wdgw7
Thu Nov  9 21:51:42 UTC 2023 -- test-deploy-rwx-fdb8f49c-86pv4
```

## Volume size limits and capacity management

PVCs created using the nexus-volume and nexus-shared have minimum and maximum claim sizes.

| Storage Class | Minimum PVC Size | Maximum PVC Size |
|---------------|------------------|------------------|
| nexus-volume  | 1 MiB | 12 TiB |
| nexus-shared  | None | 1 TiB |

> [!IMPORTANT]
> Volumes that reach their consumption limit will cause out of disk space errors on the workloads that consume them. You must make sure that you provision suitable volume sizes for your workload requirements. You must monitor both the storage appliance and all NFS servers for their percentage storage consumption. You can do this using the metrics documented in the [list of available metrics](./list-of-metrics-collected.md).

- Both nexus-volume and nexus-shared PVCs have their requested storage capacity enforced as a consumption limit. A volume can't consume more storage than the associated PVC request.
- All physical volumes are thin-provisioned. You must monitor the total storage consumption on your storage appliance and perform maintenance operations to free up storage space if necessary.
- A nexus-volume PVC provisioning request fails if the requested size is less than the minimum or more than the maximum supported volume size.
- Nexus-shared volumes are logically thin-provisioned on the backing NFS server. This NFS server has a fixed capacity of 1 TiB.
  - A nexus-shared PVC can be provisioned despite requesting more than 1 TiB of storage, however, only 1 TiB can be consumed.
  - It is possible to provision a set of PVCs where the sum of capacity requests is greater than 1 TiB. However, the consumption limit of 1 TiB applies; the set of associated PVs may not consume more than 1 TiB of storage.