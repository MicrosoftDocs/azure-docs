---
title: Use Azure Container Storage Preview with local NVMe replication
description: Configure Azure Container Storage for use with Ephemeral Disk using local NVMe on the Azure Kubernetes Service (AKS) cluster nodes. Create a storage pool with volume replication, create a persistent volume claim, and attach the persistent volume to a pod.
author: khdownie
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 06/20/2024
ms.author: kendownie
ms.custom: references_regions
---

# Use Azure Container Storage Preview with local NVMe and volume replication

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This article shows you how to configure Azure Container Storage to use Ephemeral Disk with local NVMe and volume replication as back-end storage for your Kubernetes workloads. At the end, you'll have a pod that's using local NVMe as its storage. Replication copies data across volumes on different nodes and restores a volume when a replica is lost, providing resiliency for Ephemeral Disk.

## What is Ephemeral Disk?

When your application needs sub-millisecond storage latency, you can use Ephemeral Disk with Azure Container Storage to meet your performance requirements. Ephemeral means that the disks are deployed on the local virtual machine (VM) hosting the AKS cluster and not saved to an Azure storage service. Data will be lost on these disks if you stop/deallocate your VM.

There are two types of Ephemeral Disk available: NVMe and [temp SSD](use-container-storage-with-temp-ssd.md). NVMe is designed for high-speed data transfer between storage and CPU. Choose NVMe when your application requires higher IOPS and throughput than temp SSD, or if your workload requires replication. Replication isn't currently supported for temp SSD.

## Prerequisites

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]

## Choose a VM type that supports local NVMe

Ephemeral Disk is only available in certain types of VMs. If you plan to use local NVMe, a [storage optimized VM](../../virtual-machines/sizes-storage.md) such as **standard_l8s_v3** is required.

You can run the following command to get the VM type that's used with your node pool.

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

## Create and attach persistent volumes

Follow these steps to create and attach a persistent volume.

### 1. Create a storage pool with volume replication

Follow these steps to create a storage pool using local NVMe with replication. Azure Container Storage currently supports three-replica and five-replica configurations. If you specify three replicas, you must have at least three nodes in your AKS cluster. If you specify five replicas, you must have at least five nodes.

> [!NOTE]
> Because Ephemeral Disk storage pools consume all the available NVMe disks, you must delete any existing local NVMe storage pools before creating a new storage pool.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-storagepool.yaml`.

1. Paste in the following code and save the file. The storage pool **name** value can be whatever you want. Set replicas to 3 or 5.

   ```yml
   apiVersion: containerstorage.azure.com/v1
   kind: StoragePool
   metadata:
     name: nvme
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
   storagepool.containerstorage.azure.com/nvme created
   ```
   
   You can also run this command to check the status of the storage pool. Replace `<storage-pool-name>` with your storage pool **name** value. For this example, the value would be **nvme**.
   
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
acstor-ephemeraldisk        containerstorage.csi.azure.com   Delete          WaitForFirstConsumer   true                   2m27s
```

> [!IMPORTANT]
> Don't use the storage class that's marked **internal**. It's an internal storage class that's needed for Azure Container Storage to work.

### 3. Create a persistent volume claim

A persistent volume claim (PVC) is used to automatically provision storage based on a storage class. Follow these steps to create a PVC using the new storage class.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-pvc.yaml`.

1. Paste in the following code and save the file. The PVC `name` value can be whatever you want.

   ```yml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: ephemeralpvc
   spec:
     accessModes:
       - ReadWriteOnce
     storageClassName: acstor-ephemeraldisk-nvme # replace with the name of your storage class if different
     resources:
       requests:
         storage: 100Gi
   ```

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

### 4. Deploy a pod and attach a persistent volume

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

## Manage persistent volumes and storage pools

Now that you've created a persistent volume, you can detach and reattach it as needed. You can also expand or delete a storage pool.

## Detach and reattach a persistent volume

To detach a persistent volume, delete the pod that the persistent volume is attached to.

```azurecli-interactive
kubectl delete pods <pod-name>
```

To reattach a persistent volume, simply reference the persistent volume claim name in the YAML manifest file as described in [Deploy a pod and attach a persistent volume](#4-deploy-a-pod-and-attach-a-persistent-volume).

To check which persistent volume a persistent volume claim is bound to, run:

```azurecli-interactive
kubectl get pvc <persistent-volume-claim-name>
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

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
