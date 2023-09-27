---
title: Clone persistent volumes in Azure Container Storage Preview
description: Clone persistent volumes in Azure Container Storage Preview. You can only clone volumes of the same size that are in the same storage pool.
author: khdownie
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 09/18/2023
ms.author: kendownie
---

# Clone persistent volumes in Azure Container Storage Preview
You can clone persistent volumes in [Azure Container Storage](container-storage-introduction.md). A cloned volume is a duplicate of an existing persistent volume. You can only clone volumes of the same size that are in the same storage pool.

## Prerequisites

- This article requires version 2.0.64 or later of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). If you're using Azure Cloud Shell, the latest version is already installed. If you plan to run the commands locally instead of in Azure Cloud Shell, be sure to run them with administrative privileges.
- You'll need an Azure Kubernetes Service (AKS) cluster with a node pool of at least three virtual machines (VMs) for the cluster nodes, each with a minimum of four virtual CPUs (vCPUs). 
- This article assumes you've already installed Azure Container Storage on your AKS cluster, and that you've created a storage pool and persistent volume claim (PVC) using either [Azure Disks](use-container-storage-with-managed-disks.md) or [ephemeral disk (local storage)](use-container-storage-with-local-disk.md). Azure Elastic SAN Preview doesn't support resizing volumes.

## Clone a volume

Follow the instructions below to clone a persistent volume. 

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-clonevolume.yaml`.

1. Paste in the following code and save the file. A built-in storage class supports volume cloning, so for **dataSource** be sure to reference a PVC previously created by the Azure Container Storage storage class. For example, if you created the PVC for Azure Disks, it might be called `azurediskpvc`. For **storage**, specify the size of the original PVC.

   ```yml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: pvc-acstor-cloning
   spec:
     accessModes:
       - ReadWriteOnce
     storageClassName: acstor-azuredisk
     resources:
       requests:
         storage: 100Gi
     dataSource:
       kind: PersistentVolumeClaim
       name: azurediskpvc
   ```

1. Apply the YAML manifest file to clone the PVC.
   
   ```azurecli-interactive
   kubectl apply -f acstor-clonevolume.yaml 
   ```

   You should see output similar to:
   
   ```output
   persistentvolumeclaim/pvc-acstor-cloning created
   ```

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-pod.yaml`.

1. Paste in the following code and save the file. For **claimName**, be sure to reference the cloned PVC.

   ```yml
   kind: Pod
   apiVersion: v1
   metadata:
     name: fiopod2
   spec:
     nodeSelector:
       acstor.azure.com/io-engine: acstor
     volumes:
       - name: azurediskpv
         persistentVolumeClaim:
           claimName: pvc-acstor-cloning
     containers:
       - name: fio
         image: nixery.dev/shell/fio
         args:
           - sleep
           - "1000000"
         volumeMounts:
           - mountPath: "/volume"
             name: azurediskpv
   ```

1. Apply the YAML manifest file to deploy the new pod.
   
   ```azurecli-interactive
   kubectl apply -f acstor-pod.yaml
   ```
   
   You should see output similar to the following:
   
   ```output
   pod/fiopod2 created
   ```

1. Check that the pod is running and that the persistent volume claim has been bound successfully to the pod:

   ```azurecli-interactive
   kubectl describe pod fiopod2
   kubectl describe pvc azurediskpvc
   ```
   

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
