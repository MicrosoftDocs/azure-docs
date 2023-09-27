---
title: Use Azure Container Storage Preview with Azure Elastic SAN Preview
description: Configure Azure Container Storage Preview for use with Azure Elastic SAN Preview. Create a storage pool, select a storage class, create a persistent volume claim, and attach the persistent volume to a pod.
author: khdownie
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 09/07/2023
ms.author: kendownie
ms.custom: references_regions
---

# Use Azure Container Storage Preview with Azure Elastic SAN Preview
[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This article shows you how to configure Azure Container Storage to use Azure Elastic SAN Preview as back-end storage for your Kubernetes workloads. At the end, you'll have a pod that's using Elastic SAN as its storage.

## Prerequisites

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]

- If you haven't already installed Azure Container Storage Preview, follow the instructions in [Install Azure Container Storage](container-storage-aks-quickstart.md).

> [!NOTE]
> To use Azure Container Storage with Azure Elastic SAN Preview, your AKS cluster should have a node pool of at least three [general purpose VMs](../../virtual-machines/sizes-general.md) such as **standard_d4s_v5** for the cluster nodes, each with a minimum of four virtual CPUs (vCPUs).

## Regional availability

[!INCLUDE [container-storage-regions](../../../includes/container-storage-regions.md)]

## Create a storage pool

First, create a storage pool, which is a logical grouping of storage for your Kubernetes cluster, by defining it in a YAML manifest file. Follow these steps to create a storage pool with Azure Elastic SAN Preview.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-storagepool.yaml`.

1. Paste in the following code and save the file. The storage pool **name** value can be whatever you want.

   ```yml
   apiVersion: containerstorage.azure.com/v1alpha1
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

When the storage pool is created, Azure Container Storage will create a storage class on your behalf using the naming convention `acstor-<storage-pool-name>`. It will also create an Azure Elastic SAN Preview resource.

## Assign Contributor role to AKS managed identity on Azure Elastic SAN Preview subscription

Next, you must assign the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) Azure RBAC built-in role to the AKS managed identity on your Azure Elastic SAN Preview subscription. You'll need an [Owner](../../role-based-access-control/built-in-roles.md#owner) role for your Azure subscription in order to do this. If you don't have sufficient permissions, ask your admin to perform these steps.

1. Sign in to the [Azure portal](https://portal.azure.com?azure-portal=true).
1. Select **Subscriptions**, and locate and select the subscription associated with the Azure Elastic SAN Preview resource that Azure Container Storage created on your behalf. This will likely be the same subscription as the AKS cluster that Azure Container Storage is installed on. You can verify this by locating the Elastic SAN resource in the resource group that AKS created (`MC_YourResourceGroup_YourAKSClusterName_Region`).
1. Select **Access control (IAM)** from the left pane.
1. Select **Add > Add role assignment**.
1. Under **Assignment type**, select **Privileged administrator roles** and then **Contributor**, then select **Next**. If you don't have an Owner role on the subscription, you won't be able to add the Contributor role.
   
   :::image type="content" source="media/install-container-storage-aks/add-role-assignment.png" alt-text="Screenshot showing how to use the Azure portal to add Contributor role to the AKS managed identity." lightbox="media/install-container-storage-aks/add-role-assignment.png":::
   
1. Under **Assign access to**, select **Managed identity**.
1. Under **Members**, click **+ Select members**. The **Select managed identities** menu will appear.
1. Under **Managed identity**, select **User-assigned managed identity**.
1. Under **Select**, search for and select the managed identity with your cluster name and `-agentpool` appended.
1. Click **Select**, then **Review + assign**.

## Display the available storage classes

When the storage pool is ready to use, you must select a storage class to define how storage is dynamically created when creating persistent volume claims and deploying persistent volumes.

Run `kubectl get sc` to display the available storage classes. You should see a storage class called `acstor-<storage-pool-name>`.

> [!IMPORTANT]
> Don't use the storage class that's marked **internal**. It's an internal storage class that's needed for Azure Container Storage to work.

## Create a persistent volume claim

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

## Deploy a pod and attach a persistent volume

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

## Detach and reattach a persistent volume

To detach a persistent volume, delete the pod that the persistent volume is attached to. Replace `<pod-name>` with the name of the pod, for example **fiopod**.

```azurecli-interactive
kubectl delete pods <pod-name>
```

To reattach a persistent volume, simply reference the persistent volume claim name in the YAML manifest file as described in [Deploy a pod and attach a persistent volume](#deploy-a-pod-and-attach-a-persistent-volume).

To check which persistent volume a persistent volume claim is bound to, run `kubectl get pvc <persistent-volume-claim-name>`.

## Delete the storage pool

If you want to delete a storage pool, run the following command. Replace `<storage-pool-name>` with the storage pool name.

```azurecli-interactive
kubectl delete sp -n acstor <storage-pool-name>
```

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
- [What is Azure Elastic SAN? Preview](../elastic-san/elastic-san-introduction.md)
