---
title: Use Azure Container Storage with Azure Elastic SAN (preview)
description: As a preview, you can configure Azure Container Storage to use Azure Elastic SAN. Create a storage pool, select a storage class, create a persistent volume claim, and attach the persistent volume to a pod.
author: khdownie
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 08/06/2024
ms.author: kendownie
ms.custom: references_regions
---

# Use Azure Container Storage with Azure Elastic SAN (preview)

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. Azure Elastic SAN is a fully integrated solution that simplifies deploying, scaling, managing, and configuring a SAN, while also offering built-in cloud capabilities like high availability.

As a preview feature, you can configure Azure Container Storage to use Azure Elastic SAN. This article covers how to make that configuration. At the end of this article, you'll have a pod that's using Elastic SAN as its storage.

## Prerequisites

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]

- Ensure you have either an [Azure Container Storage Owner](../../role-based-access-control/built-in-roles/containers.md#azure-container-storage-owner) role or [Azure Container Storage Contributor](../../role-based-access-control/built-in-roles/containers.md#azure-container-storage-contributor) role on your subscription. Either of these roles grant permissions that allow Azure Container Storage to communicate with the Elastic SAN resource. To make this change, go to your subscription page on the Azure portal. Select **Access control (IAM) > Add role assignment** and search for either "Azure Container Storage Owner" or "Azure Container Storage Contributor" in the **Job function roles** tab. Select **View > Assignments > Add assignment** and add your account.

- To use Azure Container Storage with Azure Elastic SAN (preview), your AKS cluster must have a node pool of at least three [general purpose VMs](/azure/virtual-machines/sizes-general) such as **standard_d4s_v5** for the cluster nodes, each with a minimum of four virtual CPUs (vCPUs).

## Limitations

The following features aren't currently supported when you use Azure Container Storage to deploy and orchestrate an Elastic SAN.

- Volume snapshots
- Storage pool expansion

## Regional availability

[!INCLUDE [container-storage-regions](../../../includes/container-storage-regions.md)]

## Create and attach persistent volumes

Follow these steps to create and attach a persistent volume.

### 1. Create a storage pool

First, create a storage pool, which is a logical grouping of storage for your Kubernetes cluster, by defining it in a YAML manifest file.

If you enabled Azure Container Storage using `az aks create` or `az aks update` commands, you might already have a storage pool. Use `kubectl get sp -n acstor` to get the list of storage pools. If you have a storage pool already available that you want to use, you can skip this section and proceed to [Display the available storage classes](#2-display-the-available-storage-classes).

Follow these steps to create a storage pool with Azure Elastic SAN (preview).

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-storagepool.yaml`.

1. Paste in the following code. The storage pool **name** value can be whatever you want. Adjust *storage* to reflect the storage capacity you want in Gi or Ti, and save the file. Azure Elastic SAN doesn't currently support resizing storage pools.

   ```yml
   apiVersion: containerstorage.azure.com/v1
   kind: StoragePool
   metadata:
     name: managed
     namespace: acstor
   spec:
     poolType:
       elasticSan: {}
     resources:
       requests: {"storage": 1Ti}
   ```

1. Apply the YAML manifest file to create the storage pool.
   
   ```azurecli-interactive
   kubectl apply -f acstor-storagepool.yaml 
   ```
   
   When storage pool creation is complete, you'll see a message like:
   
   ```output
   storagepool.containerstorage.azure.com/managed created
   ```
   
   You can also run this command to check the status of the storage pool. Replace `<storage-pool-name>` with your storage pool **name** value. For this example, the value would be **managed**.
   
   ```azurecli-interactive
   kubectl describe sp <storage-pool-name> -n acstor
   ```

When the storage pool is created, Azure Container Storage will create a storage class on your behalf using the naming convention `acstor-<storage-pool-name>`. It will also create an Azure Elastic SAN resource.

### 2. Display the available storage classes

When the storage pool is ready to use, you must select a storage class to define how storage is dynamically created when creating persistent volume claims and deploying persistent volumes.

Run `kubectl get sc` to display the available storage classes. You should see a storage class called `acstor-<storage-pool-name>`.

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
     name: managedpvc
   spec:
     accessModes:
       - ReadWriteOnce
     storageClassName: acstor-managed # replace with the name of your storage class if different
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
   persistentvolumeclaim/managedpvc created
   ```
   
   You can verify the status of the PVC by running the following command:
   
   ```azurecli-interactive
   kubectl describe pvc managedpvc
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
       - name: managedpv
         persistentVolumeClaim:
           claimName: managedpvc
     containers:
       - name: fio
         image: nixery.dev/shell/fio
         args:
           - sleep
           - "1000000"
         volumeMounts:
           - mountPath: "/volume"
             name: managedpv
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
   kubectl describe pvc managedpvc
   ```

1. Check fio testing to see its current status:

   ```azurecli-interactive
   kubectl exec -it fiopod -- fio --name=benchtest --size=800m --filename=/volume/test --direct=1 --rw=randrw --ioengine=libaio --bs=4k --iodepth=16 --numjobs=8 --time_based --runtime=60
   ```

You've now deployed a pod that's using an Elastic SAN as its storage, and you can use it for your Kubernetes workloads.

## Manage persistent volumes and storage pools

Now that you've created a persistent volume, you can detach and reattach it as needed. You can also delete a storage pool.

### Detach and reattach a persistent volume

To detach a persistent volume, delete the pod that the persistent volume is attached to. Replace `<pod-name>` with the name of the pod, for example **fiopod**.

```azurecli-interactive
kubectl delete pods <pod-name>
```

To reattach a persistent volume, simply reference the persistent volume claim name in the YAML manifest file as described in [Deploy a pod and attach a persistent volume](#4-deploy-a-pod-and-attach-a-persistent-volume).

To check which persistent volume a persistent volume claim is bound to, run `kubectl get pvc <persistent-volume-claim-name>`.

### Delete a storage pool

If you want to delete a storage pool, run the following command. Replace `<storage-pool-name>` with the storage pool name.

```azurecli-interactive
kubectl delete sp -n acstor <storage-pool-name>
```

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
- [What is Azure Elastic SAN?](../elastic-san/elastic-san-introduction.md)
