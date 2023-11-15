---
title: Azure Operator Nexus storage appliance
description: Get an overview of storage appliance resources for Azure Operator Nexus.
author: soumyamaitra
ms.author: soumyamaitra
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 06/29/2023
ms.custom: template-concept
---

# Azure Operator Nexus storage appliance

Azure Operator Nexus is built on basic constructs like compute servers, storage appliances, and network fabric devices. Azure Operator Nexus storage appliances represent persistent storage appliances on the rack.

Each storage appliance contains multiple storage devices, which are aggregated to provide a single storage pool. This storage pool is then carved out into multiple volumes, which are presented to the compute servers as block storage devices. The compute servers can use these block storage devices as persistent storage for their workloads. Each Azure Operator Nexus cluster is provisioned with a single storage appliance that's shared across all the tenant workloads.

The storage appliance in an Azure Operator Nexus instance is represented as an Azure resource. Operators get access to view its attributes like any other Azure resource.

## Kubernetes storage classes

The Azure Operator Nexus software Kubernetes stack offers two types of storage. Operators select them through the Kubernetes StorageClass mechanism.

### StorageClass: nexus-volume

The default storage mechanism, *nexus-volume*, is the preferred choice for most users. It provides the highest levels of performance and availability. However, volumes can't be simultaneously shared across multiple worker nodes. Operators can access and manage these volumes by using the Azure API and portal, through the volume resource.

```
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

In situations where a shared file system is required, the *nexus-shared* storage class is available. This storage class provides a shared storage solution by enabling multiple pods to concurrently access and share the same volume. These volumes are of type NFS Storage that are accessed by the kubernetes nodes as a persistent volume. Nexus-shared supports both Read Write Once (RWO) and Read Write Many (RWX) access modes. What that means is that the workload applications can make use of either of these access modes to access the storage.

Although the performance and availability of *nexus-shared* are sufficient for most applications, we recommend that workloads with heavy I/O requirements use the *nexus-volume* option for optimal performance.

#### Read Write Once (RWO)

In Read Write Once (RWO) mode, the nexus-shared volume can be mounted by only one node or claimant at a time. ReadWriteOnce access mode still allows multiple pods to access the volume when the pods are running on the same node.
```
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

In Read Write Many (RWX) mode, the nexus-shared volume can be mounted by multiple nodes or claimants at the same time.
```
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
The below manifest creates a StatefulSet with PersistentVolumeClaimTemplate using nexus-volume storage class in ReadWriteOnce mode.
```
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
Each pod of the StatefulSet will have one PersistentVolumeClaim created.
```
# kubectl get pvc
NAME                             STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
test-volume-rwo-test-sts-rwo-0   Bound    pvc-e41fec47-cc43-4cd5-8547-5a4457cbdced   10Gi       RWO            nexus-volume   8m17s
test-volume-rwo-test-sts-rwo-1   Bound    pvc-1589dc79-59d2-4a1d-8043-b6a883b7881d   10Gi       RWO            nexus-volume   7m58s
test-volume-rwo-test-sts-rwo-2   Bound    pvc-82e3beac-fe67-4676-9c61-e982022d443f   10Gi       RWO            nexus-volume   12s
```
```
# kubectl get pods -o wide -w
NAME             READY   STATUS    RESTARTS   AGE     IP              NODE                                         NOMINATED NODE   READINESS GATES
test-sts-rwo-0   1/1     Running   0          8m31s   10.245.231.74   nexus-cluster-6a8c4018-agentpool2-md-vhhv6   <none>           <none>
test-sts-rwo-1   1/1     Running   0          8m12s   10.245.126.73   nexus-cluster-6a8c4018-agentpool1-md-27nw4   <none>           <none>
test-sts-rwo-2   1/1     Running   0          26s     10.245.183.9    nexus-cluster-6a8c4018-agentpool1-md-4jprt   <none>           <none>
```
```
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
```
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
Once applied, there will be three replicas of the deployment sharing the same PVC.
```
# kubectl get pvc
NAME                             STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
test-volume-rwx                  Bound    pvc-32f0717e-6b63-4d64-a458-5be4ffe21d37   3Gi        RWX            nexus-shared   6s
```
```
# kubectl get pods -o wide -w
NAME                             READY   STATUS    RESTARTS   AGE     IP               NODE                                         NOMINATED NODE   READINESS GATES
test-deploy-rwx-fdb8f49c-86pv4   1/1     Running   0          18s     10.245.224.140   nexus-cluster-6a8c4018-agentpool1-md-s2dh7   <none>           <none>
test-deploy-rwx-fdb8f49c-9zsjf   1/1     Running   0          18s     10.245.126.74    nexus-cluster-6a8c4018-agentpool1-md-27nw4   <none>           <none>
test-deploy-rwx-fdb8f49c-wdgw7   1/1     Running   0          18s     10.245.231.75    nexus-cluster-6a8c4018-agentpool2-md-vhhv6   <none>           <none>
```
It can observed from the below output that all pods are writing into the same PVC.
```
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

## Storage appliance status

The following properties reflect the operational state of a storage appliance:

- `Status` indicates the state as derived from the storage appliance. The state can be `Available`, `Error`, or `Provisioning`.

- `Provisioning State` provides the current provisioning state of the storage appliance. The provisioning state can be `Succeeded`, `Failed`, or `InProgress`.

- `Capacity` provides the total and used capacity of the storage appliance.

- `Remote Vendor Management` indicates whether remote vendor management is enabled or disabled for the storage appliance.

## Storage appliance operations

- **List Storage Appliances**: List storage appliances in the provided resource group or subscription.
- **Show Storage Appliance**: Get properties of the provided storage appliance.
- **Update Storage Appliance**: Update properties or tags of the provided storage appliance.
- **Enable/Disable Remote Vendor Management for Storage Appliance**: Enable or disable remote vendor management for the provided storage appliance.

> [!NOTE]
> Customers can't create or delete storage appliances directly. These resources are  created only as the realization of the cluster lifecycle. Implementation blocks creation or deletion requests from any user, and it allows only internal/application-driven creation or deletion operations.
