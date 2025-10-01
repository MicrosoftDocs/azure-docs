---
title: Use Azure Container Storage with Local NVMe
description: Configure Azure Container Storage for use with local NVMe on the Azure Kubernetes Service (AKS) cluster nodes. Create a storage class and deploy a pod using standard Kubernetes patterns.
author: khdownie
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 09/10/2025
ms.author: kendownie
ms.custom: references_regions
# Customer intent: "As a Kubernetes administrator, I want to configure Azure Container Storage to use local NVMe for ephemeral volumes, so that I can optimize storage performance for my applications requiring low latency that don't require data durability using standard Kubernetes patterns."
---

# Use Azure Container Storage with local NVMe

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This article shows you how to configure Azure Container Storage to use local NVMe disk as back-end storage for your Kubernetes workloads. NVMe is designed for high-speed data transfer between storage and CPU, providing extremely high IOPS and throughput.

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md), which currently only supports local NVMe disk for backing storage. For details about earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md).

## What is local NVMe?

When your application needs sub-millisecond storage latency and extremely high throughput, you can use local NVMe with Azure Container Storage to meet your performance requirements. Ephemeral means that the disks are deployed on the local virtual machine (VM) hosting the AKS cluster and not saved to an Azure storage service. Data will be lost on these disks if you stop/deallocate your VM. Local NVMe disks are offered on select Azure VM families such as [storage-optimized](/azure/virtual-machines/sizes/overview#storage-optimized) VMs.

Azure Container Storage supports the use of *generic ephemeral volumes* by default when using ephemeral disk. For use cases that require *persistent volume claims*, you can add the annotation `localdisk.csi.acstor.io/accept-ephemeral-storage: "true"` in your persistent volume claim template.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- This article requires the latest version (2.77.0 or later) of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). Don't use Azure Cloud Shell, because `az upgrade` isn't available in Cloud Shell. Be sure to run the commands in this article with administrative privileges.

- You'll need the Kubernetes command-line client, `kubectl`. You can install it locally by running the `az aks install-cli` command.

- Check if your target region is supported in [Azure Container Storage regions](container-storage-introduction.md#regional-availability).

- You can now use clusters with a single node, though multi-node configurations are still recommended.

## Choose a VM type that supports local NVMe

Local NVMe disks are only available in certain types of VMs, for example, [Storage optimized VM SKUs](/azure/virtual-machines/sizes/overview#storage-optimized) or [GPU accelerated VM SKUs](/azure/virtual-machines/sizes/overview#gpu-accelerated). If you plan to use local NVMe capacity, choose one of these VM SKUs.

Run the following command to get the VM type that's used with your node pool. Replace `<resource group>` and `<cluster name>` with your own values. You don't need to supply values for `PoolName` or `VmSize`, so keep the query as shown here.

```azurecli
az aks nodepool list --resource-group <resource group> --cluster-name <cluster name> --query "[].{PoolName:name, VmSize:vmSize}" -o table
```

The following is an example of output.

```output
PoolName    VmSize
----------  ---------------
nodepool1   standard_l8s_v3
```

> [!NOTE]
> In Azure Container Storage (version 2.x.x), you can now use clusters with fewer than three nodes.

## Create and attach generic ephemeral volumes

Follow these steps to create and attach a generic ephemeral volume using Azure Container Storage.

### 1. Create a storage class

Unlike previous versions that required creating a custom storage pool resource, Azure Container Storage (version 2.x.x) uses standard Kubernetes storage classes. This is a significant change that simplifies the storage configuration process.

Follow these steps to create a storage class using local NVMe.

1. Use your favorite text editor to create a YAML manifest file such as `code storageclass.yaml`.

1. Paste in the following code and save the file.

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: local
   provisioner: localdisk.csi.acstor.io
   reclaimPolicy: Delete
   volumeBindingMode: WaitForFirstConsumer
   allowVolumeExpansion: true
   ```

1. Apply the YAML manifest file to create the storage pool.

   ```azurecli
   kubectl apply -f storageclass.yaml
   ```

### 2. Verify the storage class

Run the following command to verify that the storage class is created:

```azurecli
kubectl get storageclass local
```

You should see output similar to:

```output
NAME    PROVISIONER                RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local   localdisk.csi.acstor.io    Delete          WaitForFirstConsumer   true                   10s
```

### 3. Deploy a pod with generic ephemeral volume

Create a pod using [Fio](https://github.com/axboe/fio) (Flexible I/O Tester) for benchmarking and workload simulation that uses a generic ephemeral volume.

1. Use your favorite text editor to create a YAML manifest file such as `code fiopod.yaml`.

1. Paste in the following code and save the file.

   ```yml
   kind: Pod
   apiVersion: v1
   metadata:
     name: fiopod
   spec:
     nodeSelector:
       "kubernetes.io/os": linux
     containers:
       - name: fio
         image: openeuler/fio
         args: ["sleep", "1000000"]
         volumeMounts:
           - mountPath: "/volume"
             name: ephemeralvolume
     volumes:
       - name: ephemeralvolume
         ephemeral:
           volumeClaimTemplate:
             spec:
               volumeMode: Filesystem
               accessModes: ["ReadWriteOnce"]
               storageClassName: local
               resources:
                 requests:
                   storage: 10Gi
   ```

1. Apply the YAML manifest file to deploy the pod.
   
   ```azurecli
   kubectl apply -f fiopod.yaml
   ```

### 4. Verify the deployment and run benchmarks

Check that the pod is running:

```azurecli
kubectl get pod fiopod
```

You should see the pod in the Running state. Once running, you can execute a Fio benchmark test:

```azurecli
kubectl exec -it fiopod -- fio --name=benchtest --size=800m --filename=/volume/test --direct=1 --rw=randrw --ioengine=libaio --bs=4k --iodepth=16 --numjobs=8 --time_based --runtime=60
```

## Create and attach persistent volumes with ephemeral storage annotation

While generic ephemeral volumes are recommended for ephemeral storage, Azure Container Storage also supports persistent volumes with ephemeral storage when needed for compatibility with existing workloads.

> [!NOTE]
> In Azure Container Storage (version 2.x.x), the annotation has changed from `acstor.azure.com/accept-ephemeral-storage: "true"` to `localdisk.csi.acstor.io/accept-ephemeral-storage: "true"`. This reflects the new CSI driver naming convention.

### 1. Create a storage class (if not already created)

If you haven't already created a storage class that uses local NVMe in the previous section, create one now:

1. Use your favorite text editor to create a YAML manifest file such as `code storageclass.yaml`.

1. Paste in the following code and save the file.

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: local
   provisioner: localdisk.csi.acstor.io
   reclaimPolicy: Delete
   volumeBindingMode: WaitForFirstConsumer
   allowVolumeExpansion: true
   ```

1. Apply the YAML manifest file to create the storage pool.

   ```azurecli
   kubectl apply -f storageclass.yaml
   ```

### 2. Deploy a stateful set with persistent volumes

If you need to use persistent volume claims that aren't tied to the pod lifecycle, you must add the `localdisk.csi.acstor.io/accept-ephemeral-storage: "true"` annotation. Note that the data on the volume is local to the node and will be lost if the node is deleted or the pod is moved to another node.

Here's an example stateful set using persistent volumes with the ephemeral storage annotation:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: statefulset-lcd-lvm-annotation
  labels:
    app: busybox
spec:
  podManagementPolicy: Parallel
  serviceName: statefulset-lcd
  replicas: 10
  template:
    metadata:
      labels:
        app: busybox
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
        - name: statefulset-lcd
          image: mcr.microsoft.com/azurelinux/busybox:1.36
          command:
            - "/bin/sh"
            - "-c"
            - set -euo pipefail; trap exit TERM; while true; do date -u +"%Y-%m-%dT%H:%M:%SZ" >> /mnt/lcd/outfile; sleep 1; done
          volumeMounts:
            - name: persistent-storage
              mountPath: /mnt/lcd
  updateStrategy:
    type: RollingUpdate
  selector:
    matchLabels:
      app: busybox
  volumeClaimTemplates:
    - metadata:
        name: persistent-storage
        annotations:
          localdisk.csi.acstor.io/accept-ephemeral-storage: "true"
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: local
        resources:
          requests:
            storage: 10Gi
```

Save and apply this YAML to create the stateful set with persistent volumes:

```azurecli
kubectl apply -f statefulset-pvc.yaml
```

## Manage storage

In this section, you'll learn how to check node ephemeral disk capacity, expand storage capacity, and delete storage resources.

### Check node ephemeral disk capacity

An ephemeral volume is allocated on a single node. When you configure the size of your ephemeral volumes, the size should be less than the available capacity of the single node's ephemeral disk.

Ensure you have created a StorageClass for the **localdisk.csi.acstor.io**. Run the following command to check the available capacity of ephemeral disk for each node.

```azurecli
kubectl get csistoragecapacities.storage.k8s.io -n kube-system -o custom-columns=NAME:.metadata.name,STORAGE_CLASS:.storageClassName,CAPACITY:.capacity,NODE:.nodeTopology.matchLabels."topology\.localdisk\.csi\.acstor\.io/node"
```

You should see output similar to this:

```output
NAME          STORAGE_CLASS   CAPACITY    NODE
csisc-2pkx4   local           1373172Mi   aks-storagepool-31410930-vmss000001
csisc-gnmm9   local           1373172Mi   aks-storagepool-31410930-vmss000000
```

If you encounter empty capacity output, ensure that a StorageClass for **localdisk.csi.acstor.io** has been created. The **csistoragecapacities.storage.k8s.io** resource is only generated after a StorageClass for **localdisk.csi.acstor.io** exists.

### Expand storage capacity

Because ephemeral disk storage uses local resources on the AKS cluster nodes, expanding storage capacity requires adding nodes to the cluster.

To add a node to your cluster, run the following command. Replace `<cluster-name>`, `<nodepool-name>`, `<resource-group>`, and `<new-count>` with your values.

```azurecli
az aks nodepool scale --cluster-name <cluster-name> --name <nodepool-name> --resource-group <resource-group> --node-count <new-count>
```

### Delete storage resources

To clean up storage resources, you must first delete all PersistentVolumeClaims and/or PersistentVolumes. Deleting the Azure Container Storage StorageClass won't automatically remove your existing PersistentVolumes/PersistentVolumeClaims.

To delete a storage class named **local**, run the following command:

```azurecli
kubectl delete storageclass local
```

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
- [Use Azure Container Storage (version 1.x.x) with local NVMe](use-container-storage-with-local-disk-version-1.md)
