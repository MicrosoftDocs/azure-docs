---
title: Use Azure Container Storage with local NVMe replication
description: Configure Azure Container Storage for use with Ephemeral Disk using local NVMe on the Azure Kubernetes Service (AKS) cluster nodes. Create a storage pool with volume replication, create a volume, and deploy a pod.
author: khdownie
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 07/23/2024
ms.author: kendownie
ms.custom: references_regions
---

# Use Azure Container Storage with local NVMe and volume replication

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This article shows you how to configure Azure Container Storage to use Ephemeral Disk with local NVMe and volume replication as back-end storage for your Kubernetes workloads. At the end, you'll have a pod that's using local NVMe as its storage. Replication copies data across volumes on different nodes and restores a volume when a replica is lost, providing resiliency for Ephemeral Disk.

## What is Ephemeral Disk?

When your application needs sub-millisecond storage latency, you can use Ephemeral Disk with Azure Container Storage to meet your performance requirements. Ephemeral means that the disks are deployed on the local virtual machine (VM) hosting the AKS cluster and not saved to an Azure storage service. Data will be lost on these disks if you stop/deallocate your VM.

There are two types of Ephemeral Disk available: local NVMe and [temp SSD](use-container-storage-with-temp-ssd.md). NVMe is designed for high-speed data transfer between storage and CPU. Choose NVMe when your application needs higher IOPS or throughput than temp SSD, or requires more storage space. Be aware that Azure Container Storage only supports synchronous data replication for local NVMe.

Due to the ephemeral nature of these disks, Azure Container Storage supports the use of *generic ephemeral volumes* by default when using ephemeral disk. However, certain use cases might call for *persistent volumes* even if the data isn't durable; for example, if you want to use existing YAML files or deployment templates that are hard-coded to use persistent volumes, and your workload supports application-level replication for durability. In such cases, you can [update your Azure Container Storage installation](#create-and-attach-persistent-volumes) and add the annotation `acstor.azure.com/accept-ephemeral-storage=true` in your persistent volume claim definition to support the creation of persistent volumes from ephemeral disk storage pools.

## Prerequisites

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]

## Choose a VM type that supports local NVMe

Local NVMe Disk is only available in certain types of VMs, for example, [Storage optimized VM SKUs](/azure/virtual-machines/sizes/overview#storage-optimized) or [GPU accelerated VM SKUs](/azure/virtual-machines/sizes/overview#gpu-accelerated). If you plan to use local NVMe, choose one of these VM SKUs.

Run the following command to get the VM type that's used with your node pool. Replace `<resource group>` and `<cluster name>` with your own values. You don't need to supply values for `PoolName` or `VmSize`, so keep the query as shown here.

```azurecli-interactive
az aks nodepool list --resource-group <resource group> --cluster-name <cluster name> --query "[].{PoolName:name, VmSize:vmSize}" -o table
```

The following is an example of output.

```output
PoolName    VmSize
----------  ---------------
nodepool1   standard_l8s_v3
```

We recommend that each VM have a minimum of four virtual CPUs (vCPUs), and each node pool have at least three nodes.

## Create and attach generic ephemeral volumes

Follow these steps to create and attach a generic ephemeral volume.

### 1. Create a storage pool with volume replication

First, create a storage pool, which is a logical grouping of storage for your Kubernetes cluster, by defining it in a YAML manifest file.

If you enabled Azure Container Storage using `az aks create` or `az aks update` commands, you might already have a storage pool. Use `kubectl get sp -n acstor` to get the list of storage pools. If you have a storage pool already available that you want to use, you can skip this section and proceed to [Display the available storage classes](#2-display-the-available-storage-classes).

Follow these steps to create a storage pool using local NVMe with replication. Azure Container Storage currently supports three-replica and five-replica configurations. If you specify three replicas, you must have at least three nodes in your AKS cluster. If you specify five replicas, you must have at least five nodes.

> [!NOTE]
> Because Ephemeral Disk storage pools consume all the available NVMe disks, you must delete any existing local NVMe storage pools before creating a new storage pool.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-storagepool.yaml`.

1. Paste in the following code and save the file. The storage pool **name** value can be whatever you want.

   ```yml
   apiVersion: containerstorage.azure.com/v1
   kind: StoragePool
   metadata:
     name: ephemeraldisk-nvme
     namespace: acstor
   spec:
     poolType:
       ephemeralDisk:
         diskType: nvme
         replicas: 3
   ```

1. Apply the YAML manifest file to create the storage pool.
   
   ```azurecli-interactive
   kubectl apply -f acstor-storagepool.yaml 
   ```
   
   When storage pool creation is complete, you'll see a message like:
   
   ```output
   storagepool.containerstorage.azure.com/ephemeraldisk-nvme created
   ```
   
   You can also run this command to check the status of the storage pool. Replace `<storage-pool-name>` with your storage pool **name** value. For this example, the value would be **ephemeraldisk-nvme**.
   
   ```azurecli-interactive
   kubectl describe sp <storage-pool-name> -n acstor
   ```

When the storage pool is created, Azure Container Storage will create a storage class on your behalf, using the naming convention `acstor-<storage-pool-name>`.

### 2. Display the available storage classes

When the storage pool is ready to use, you must select a storage class to define how storage is dynamically created when creating and deploying volumes.

Run `kubectl get sc` to display the available storage classes. You should see a storage class called `acstor-<storage-pool-name>`.

```output
$ kubectl get sc | grep "^acstor-"
acstor-azuredisk-internal   disk.csi.azure.com               Retain          WaitForFirstConsumer   true                   65m
acstor-ephemeraldisk-nvme        containerstorage.csi.azure.com   Delete          WaitForFirstConsumer   true                   2m27s
```

> [!IMPORTANT]
> Don't use the storage class that's marked **internal**. It's an internal storage class that's needed for Azure Container Storage to work.

### 3. Deploy a pod with a generic ephemeral volume

Create a pod using [Fio](https://github.com/axboe/fio) (Flexible I/O Tester) for benchmarking and workload simulation, that uses a generic ephemeral volume.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-pod.yaml`.

1. Paste in the following code and save the file.

   ```yml
   kind: Pod
   apiVersion: v1
   metadata:
     name: fiopod
   spec:
     nodeSelector:
       acstor.azure.com/io-engine: acstor
     containers:
       - name: fio
         image: nixery.dev/shell/fio
         args:
           - sleep
           - "1000000"
         volumeMounts:
           - mountPath: "/volume"
             name: ephemeralvolume
     volumes:
       - name: ephemeralvolume
         ephemeral:
           volumeClaimTemplate:
             metadata:
               labels:
                 type: my-ephemeral-volume
             spec:
               accessModes: [ "ReadWriteOnce" ]
               storageClassName: acstor-ephemeraldisk-nvme # replace with the name of your storage class if different
               resources:
                 requests:
                   storage: 1Gi
   ```

   When you change the storage size of your volumes, make sure the size is less than the available capacity of a single node's ephemeral disk. See [Check node ephemeral disk capacity](#check-node-ephemeral-disk-capacity).

1. Apply the YAML manifest file to deploy the pod.
   
   ```azurecli-interactive
   kubectl apply -f acstor-pod.yaml
   ```
   
   You should see output similar to the following:
   
   ```output
   pod/fiopod created
   ```

1. Check that the pod is running and that the ephemeral volume claim has been bound successfully to the pod:

   ```azurecli-interactive
   kubectl describe pod fiopod
   kubectl describe pvc fiopod-ephemeralvolume
   ```

1. Check fio testing to see its current status:

   ```azurecli-interactive
   kubectl exec -it fiopod -- fio --name=benchtest --size=800m --filename=/volume/test --direct=1 --rw=randrw --ioengine=libaio --bs=4k --iodepth=16 --numjobs=8 --time_based --runtime=60
   ```

You've now deployed a pod that's using local NVMe with volume replication, and you can use it for your Kubernetes workloads.

## Create and attach persistent volumes

To create a persistent volume from an ephemeral disk storage pool, you must include an annotation in your persistent volume claims (PVCs) as a safeguard to ensure that you intend to use persistent volumes even when the data is ephemeral. Additionally, you need to enable the `--ephemeral-disk-volume-type` flag with the `PersistentVolumeWithAnnotation` value on your cluster before creating your persistent volume claims.

Follow these steps to create and attach a persistent volume.

### 1. Update your Azure Container Storage installation

Run the following command to update your Azure Container Storage installation to allow the creation of persistent volumes from ephemeral disk storage pools.

```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage ephemeralDisk --storage-pool-option NVMe --ephemeral-disk-volume-type PersistentVolumeWithAnnotation 
```

### 2. Create a storage pool with volume replication

Follow these steps to create a storage pool using local NVMe with replication. Azure Container Storage currently supports three-replica and five-replica configurations. If you specify three replicas, you must have at least three nodes in your AKS cluster. If you specify five replicas, you must have at least five nodes.

> [!NOTE]
> Because Ephemeral Disk storage pools consume all the available NVMe disks, you must delete any existing local NVMe storage pools before creating a new storage pool.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-storagepool.yaml`.

1. Paste in the following code and save the file. The storage pool **name** value can be whatever you want. Set replicas to 3 or 5.

   ```yml
   apiVersion: containerstorage.azure.com/v1
   kind: StoragePool
   metadata:
     name: ephemeraldisk-nvme
     namespace: acstor
   spec:
     poolType:
       ephemeralDisk:
         diskType: nvme
         replicas: 3
   ```

1. Apply the YAML manifest file to create the storage pool.
   
   ```azurecli-interactive
   kubectl apply -f acstor-storagepool.yaml 
   ```
   
   When storage pool creation is complete, you'll see a message like:
   
   ```output
   storagepool.containerstorage.azure.com/ephemeraldisk-nvme created
   ```
   
   You can also run this command to check the status of the storage pool. Replace `<storage-pool-name>` with your storage pool **name** value. For this example, the value would be **ephemeraldisk-nvme**.
   
   ```azurecli-interactive
   kubectl describe sp <storage-pool-name> -n acstor
   ```

When the storage pool is created, Azure Container Storage will create a storage class on your behalf, using the naming convention `acstor-<storage-pool-name>`.

### 3. Display the available storage classes

When the storage pool is ready to use, you must select a storage class to define how storage is dynamically created when creating and deploying volumes.

Run `kubectl get sc` to display the available storage classes. You should see a storage class called `acstor-<storage-pool-name>`.

```output
$ kubectl get sc | grep "^acstor-"
acstor-azuredisk-internal   disk.csi.azure.com               Retain          WaitForFirstConsumer   true                   65m
acstor-ephemeraldisk-nvme        containerstorage.csi.azure.com   Delete          WaitForFirstConsumer   true                   2m27s
```

> [!IMPORTANT]
> Don't use the storage class that's marked **internal**. It's an internal storage class that's needed for Azure Container Storage to work.

### 4. Create a persistent volume claim

A persistent volume claim (PVC) is used to automatically provision storage based on a storage class. Follow these steps to create a PVC using the new storage class.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-pvc.yaml`.

1. Paste in the following code and save the file. The PVC `name` value can be whatever you want.

   ```yml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: ephemeralpvc
     annotations:
       acstor.azure.com/accept-ephemeral-storage: "true"
   spec:
     accessModes:
       - ReadWriteOnce
     storageClassName: acstor-ephemeraldisk-nvme # replace with the name of your storage class if different
     resources:
       requests:
         storage: 100Gi
   ```
   
   When you change the storage size of your volumes, make sure the size is less than the available capacity of a single node's ephemeral disk. See [Check node ephemeral disk capacity](#check-node-ephemeral-disk-capacity).

1. Apply the YAML manifest file to create the PVC.
   
   ```azurecli-interactive
   kubectl apply -f acstor-pvc.yaml
   ```
   
   You should see output similar to:
   
   ```output
   persistentvolumeclaim/ephemeralpvc created
   ```
   
   You can verify the status of the PVC by running the following command:
   
   ```azurecli-interactive
   kubectl describe pvc ephemeralpvc
   ```

Once the PVC is created, it's ready for use by a pod.

### 5. Deploy a pod and attach a persistent volume

Create a pod using [Fio](https://github.com/axboe/fio) (Flexible I/O Tester) for benchmarking and workload simulation, and specify a mount path for the persistent volume. For **claimName**, use the **name** value that you used when creating the persistent volume claim.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-pod.yaml`.

1. Paste in the following code and save the file.

   ```yml
   kind: Pod
   apiVersion: v1
   metadata:
     name: fiopod
   spec:
     nodeSelector:
       acstor.azure.com/io-engine: acstor
     volumes:
       - name: ephemeralpv
         persistentVolumeClaim:
           claimName: ephemeralpvc
     containers:
       - name: fio
         image: nixery.dev/shell/fio
         args:
           - sleep
           - "1000000"
         volumeMounts:
           - mountPath: "/volume"
             name: ephemeralpv
   ```

1. Apply the YAML manifest file to deploy the pod.
   
   ```azurecli-interactive
   kubectl apply -f acstor-pod.yaml
   ```
   
   You should see output similar to the following:
   
   ```output
   pod/fiopod created
   ```

1. Check that the pod is running and that the persistent volume claim has been bound successfully to the pod:

   ```azurecli-interactive
   kubectl describe pod fiopod
   kubectl describe pvc ephemeralpvc
   ```

1. Check fio testing to see its current status:

   ```azurecli-interactive
   kubectl exec -it fiopod -- fio --name=benchtest --size=800m --filename=/volume/test --direct=1 --rw=randrw --ioengine=libaio --bs=4k --iodepth=16 --numjobs=8 --time_based --runtime=60
   ```

You've now deployed a pod that's using local NVMe with volume replication, and you can use it for your Kubernetes workloads.

## Manage volumes and storage pools

In this section, you'll learn how to check the available capacity of ephemeral disk, how to detach and reattach a persistent volume, how to expand or delete a storage pool, and how to optimize performance.

### Check node ephemeral disk capacity

An ephemeral volume is allocated on a single node. When you configure the size of your ephemeral volumes, the size should be less than the available capacity of the single node's ephemeral disk.

Run the following command to check the available capacity of ephemeral disk for a single node.

```output
$ kubectl get diskpool -n acstor
NAME                                CAPACITY      AVAILABLE     USED        RESERVED    READY   AGE
ephemeraldisk-nvme-diskpool-jaxwb   75660001280   75031990272   628011008   560902144   True    21h
ephemeraldisk-nvme-diskpool-wzixx   75660001280   75031990272   628011008   560902144   True    21h
ephemeraldisk-nvme-diskpool-xbtlj   75660001280   75031990272   628011008   560902144   True    21h
```

In this example, the available capacity of ephemeral disk for a single node is `75031990272` bytes or 69 GiB.

### Detach and reattach a persistent volume

To detach a persistent volume, delete the pod that the persistent volume is attached to.

```azurecli-interactive
kubectl delete pods <pod-name>
```

To reattach a persistent volume, simply reference the persistent volume claim name in the YAML manifest file as described in [Deploy a pod and attach a persistent volume](#5-deploy-a-pod-and-attach-a-persistent-volume).

To check which persistent volume a persistent volume claim is bound to, run:

```azurecli-interactive
kubectl get pvc <persistent-volume-claim-name>
```

## Enable hyperconvergence (optional) 

### What is hyperconvergence?  

Hyperconvergence in Azure Container Storage enables pods to run on the same host as their corresponding volumes, reducing network overhead and significantly improving read performance. 

* For single-replica workloads, hyperconvergence is **always enabled by default** to maximize data locality. 

* For multi-replica workloads, hyperconvergence is **optional** and must be explicitly enabled. 

When hyperconvergence is enabled for multi-replica volumes, the workload is scheduled on the same host as one of the volume replicas, optimizing data access while still maintaining redundancy. 

### Hyperconvergence behavior for non-replicated vs. replicated volumes 

Non-replicated NVMe/TempSSD volumes:

* Hyperconvergence is **enabled by default**. 

* If no suitable node is available with a localized disk pool, the application pod will fail to start due to insufficient resources. 

* This strict enforcement prevents a non-replicated volume-consuming application from running on a different node than where its storage is provisioned. 

Replicated NVMe/TempSSD volumes:  

* Hyperconvergence is **best effort**. 

* The scheduler will attempt to place the application pod on the same node as one of its volume replicas. 

* If no suitable node is available, the pod will still be scheduled elsewhere, but read performance may be lower than expected.

### How It Works 

When hyperconvergence is enabled, Azure Container Storage prioritizes scheduling pods on the nodes where their volume replicas reside. 

1. The default Kubernetes scheduler assigns scores to all nodes based on standard parameters like CPU, memory, affinities, and tolerations. 
2. Azure Container Storage Node Affinity Scoring: Azure Container Storage uses preferred node affinities to influence the scheduler’s decision. Thus, each node receives: 
   * 1 point if it has a valid disk pool. 
   * 1 point if it already hosts a replica of the volume; these scores are additive and provide a slight preference for nodes with local volume replicas while respecting other scheduling criteria. 
3. Final Scheduling Decision: The Kubernetes scheduler combines the default scores with Azure Container Storage affinity-based scores. The node with the highest combined score, balancing both Azure Container Storage preferences and Kubernetes default logic, is selected for pod placement.

### When to Use Hyperconvergence 
**Note**: The following considerations apply only to replicated volumes, as non-replicated volumes always use hyperconvergence by default and cannot be configured otherwise. 

Consider enabling hyperconvergence for replicated volumes when: 

* High read performance is critical – Keeping workloads and storage replicas on the same node reduces network latency and improves read performance. 
* Data locality can significantly impact performance – Applications that frequently read from storage benefit from reduced cross-node data transfers. 

### When to Not Use Hyperconvergence 
**Note**: This section applies only to replicated volumes because hyperconvergence is always enforced for non-replicated volumes. 

Hyperconvergence can improve performance by co-locating workloads with their storage, but there are scenarios where it might not be ideal: 

* **Potential resource imbalance**: While hyperconvergence itself doesn't limit the number of applications on a node, if multiple workloads create replicas on the same node and that node runs out of resources (CPU, memory, or storage bandwidth), some workloads might not be able to schedule there. As a result, they might end up running **without hyperconvergence**, despite it being enabled.

### Enable hyperconvergence in Azure Container Storage  

Hyperconvergence is enabled by default for NVMe and temporary disk storage pools with only one replica. This ensures optimized data locality and improved performance for single-replica configurations. For multi-replica setups, hyperconvergence isn't enabled by default but can be configured using the `hyperconverged` parameter in the StoragePool specification. 

The following is an example YAML template to enable hyperconvergence for multi-replica configurations: 

```
apiVersion: containerstorage.azure.com/v1 

kind: StoragePool 

metadata: 

  name: nvmedisk 

  namespace: acstor 

spec: 

  poolType: 

    ephemeralDisk: 

      diskType: "nvme" 

      replicas: 3 

      hyperconverged: true 
```
 
## Expand a storage pool

You can expand storage pools backed by local NVMe to scale up quickly and without downtime. Shrinking storage pools isn't currently supported.

Because a storage pool backed by Ephemeral Disk uses local storage resources on the AKS cluster nodes (VMs), expanding the storage pool requires adding another node to the cluster. Follow these instructions to expand the storage pool.

1. Run the following command to add a node to the AKS cluster. Replace `<cluster-name>`, `<nodepool name>`, and `<resource-group-name>` with your own values. To get the name of your node pool, run `kubectl get nodes`.
   
   ```azurecli-interactive
   az aks nodepool add --cluster-name <cluster name> --name <nodepool name> --resource-group <resource group> --node-vm-size Standard_L8s_v3 --node-count 1 --labels acstor.azure.com/io-engine=acstor
   ```
   
1. Run `kubectl get nodes` and you'll see that a node has been added to the cluster.

1. Run `kubectl get sp -A` and you should see that the capacity of the storage pool has increased.

## Delete a storage pool

If you want to delete a storage pool, run the following command. Replace `<storage-pool-name>` with the storage pool name.

```azurecli-interactive
kubectl delete sp -n acstor <storage-pool-name>
```

## Optimize performance when using local NVMe

Depending on your workload’s performance requirements, you can choose from three different performance tiers: **Basic**, **Standard**, and **Premium**. These tiers offer a different range of IOPS, and your selection will impact the number of vCPUs that Azure Container Storage components consume in the nodes where it's installed. Standard is the default configuration if you don't update the performance tier.

**Single-zone replication**

| **Tier** | **Number of vCPUs** | **100% Read IOPS** | **100% Write IOPS** |
|---------------|--------------------------|-----------|---------------------|
| `Basic` | 12.5% of total VM cores | Up to 120,000 | Up to 45,000 |
| `Standard` (default) | 25% of total VM cores | Up to 220,000 | Up to 90,000 |
| `Premium` | 50% of total VM cores | Up to 550,000 | Up to 180,000 | 

**Multi-zone replication**

| **Tier** | **Number of vCPUs** | **100% Read IOPS** | **100% Write IOPS** |
|---------------|--------------------------|-----------|---------------------|
| `Basic` | 12.5% of total VM cores | Up to 120,000 | Up to 45,000 |
| `Standard` (default) | 25% of total VM cores | Up to 220,000 | Up to 90,000 |
| `Premium` | 50% of total VM cores | Up to 550,000 | Up to 180,000 | 

> [!NOTE]
> RAM and hugepages consumption will stay consistent across all tiers: 1 GiB of RAM and 2 GiB of hugepages.

Once you've identified the performance tier that aligns best to your needs, you can run the following command to update the performance tier of your Azure Container Storage installation. Replace `<performance tier>` with basic, standard, or premium.

```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage <storage-pool-type> --ephemeral-disk-nvme-perf-tier <performance-tier>
```

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
