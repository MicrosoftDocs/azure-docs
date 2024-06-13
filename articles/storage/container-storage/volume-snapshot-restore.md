---
title: Use volume snapshots with Azure Container Storage Preview
description: Take a point-in-time snapshot of a persistent volume and restore it. You'll create a volume snapshot class, take a snapshot, create a restored persistent volume claim, and deploy a new pod.
author: khdownie
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 03/14/2024
ms.author: kendownie
---

# Use volume snapshots with Azure Container Storage Preview

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This article shows you how to take a point-in-time snapshot of a persistent volume and restore it with a new persistent volume claim.

## Prerequisites

- This article requires version 2.0.64 or later of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). If you're using Azure Cloud Shell, the latest version is already installed. If you plan to run the commands locally instead of in Azure Cloud Shell, be sure to run them with administrative privileges.
- You'll need an Azure Kubernetes Service (AKS) cluster with a node pool of at least three virtual machines (VMs) for the cluster nodes, each with a minimum of four virtual CPUs (vCPUs).
- This article assumes you've already installed Azure Container Storage on your AKS cluster, and that you've created a storage pool and persistent volume claim (PVC) using either [Azure Disks](use-container-storage-with-managed-disks.md) or [ephemeral disk (local storage)](use-container-storage-with-local-disk.md). Volume snapshots aren't currently supported when you use Elastic SAN as backing storage.

## Create a volume snapshot class

First, create a volume snapshot class, which allows you to specify the attributes of the volume snapshot, by defining it in a YAML manifest file. Follow these steps to create a volume snapshot class for Azure Disks.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-volumesnapshotclass.yaml`.

1. Paste in the following code. The volume snapshot class **name** value can be whatever you want.

   ```yml
   apiVersion: snapshot.storage.k8s.io/v1
   kind: VolumeSnapshotClass
   metadata:
     name: csi-acstor-vsc
   driver: containerstorage.csi.azure.com
   deletionPolicy: Delete
   parameters:
     incremental: "true"  # available values: "true", "false" ("true" by default for Azure Public Cloud, and "false" by default for Azure Stack Cloud)
   ```

1. Apply the YAML manifest file to create the volume snapshot class.
   
   ```azurecli-interactive
   kubectl apply -f acstor-volumesnapshotclass.yaml
   ```
   
   When creation is complete, you'll see a message like:
   
   ```output
   volumesnapshotclass.snapshot.storage.k8s.io/csi-acstor-vsc created
   ```
   
   You can also run `kubectl get volumesnapshotclass` to check that the volume snapshot class has been created. You should see output such as:
   
   ```output
   NAME            DRIVER                            DELETIONPOLICY    AGE
   csi-acstor-vsc	 containerstorage.csi.azure.com	   Delete	           11s
   ```
   
## Create a volume snapshot

Next, you'll create a snapshot of an existing persistent volume claim and apply the volume snapshot class you created in the previous step.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-volumesnapshot.yaml`.

1. Paste in the following code. The `volumeSnapshotClassName` should be the name of the volume snapshot class that you created in the previous step. For `persistentVolumeClaimName`, use the name of the persistent volume claim that you want to take a snapshot of. The volume snapshot **name** value can be whatever you want.

   ```yml
   apiVersion: snapshot.storage.k8s.io/v1
   kind: VolumeSnapshot
   metadata:
     name: azuredisk-volume-snapshot
   spec:
     volumeSnapshotClassName: csi-acstor-vsc
     source:
       persistentVolumeClaimName: azurediskpvc
   ```

1. Apply the YAML manifest file to create the volume snapshot.
   
   ```azurecli-interactive
   kubectl apply -f acstor-volumesnapshot.yaml
   ```
   
   When creation is complete, you'll see a message like:
   
   ```output
   volumesnapshot.snapshot.storage.k8s.io/azuredisk-volume-snapshot created
   ```
   
   You can also run `kubectl get volumesnapshot` to check that the volume snapshot has been created. If `READYTOUSE` indicates *true*, you can move on to the next step.

## Create a restored persistent volume claim

Now you can create a new persistent volume claim that uses the volume snapshot as a data source.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-pvc-restored.yaml`.

1. Paste in the following code. The `storageClassName` must match the storage class that you used when creating the original persistent volume. For example, if you're using ephemeral disk (local NVMe) instead of Azure Disks for back-end storage, change `storageClassName` to `acstor-ephemeraldisk`. For the data source **name** value, use the name of the volume snapshot that you created in the previous step. The metadata **name** value for the persistent volume claim can be whatever you want.

   ```yml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: pvc-azuredisk-snapshot-restored
   spec:
     accessModes:
       - ReadWriteOnce
     storageClassName: acstor-azuredisk
     resources:
       requests:
         storage: 100Gi
     dataSource:
       name: azuredisk-volume-snapshot
       kind: VolumeSnapshot
       apiGroup: snapshot.storage.k8s.io
   ```

1. Apply the YAML manifest file to create the PVC.
   
   ```azurecli-interactive
   kubectl apply -f acstor-pvc-restored.yaml
   ```
   
   When creation is complete, you'll see a message like:
   
   ```output
   persistentvolumeclaim/pvc-azuredisk-snapshot-restored created
   ```
   
   You can also run `kubectl describe pvc pvc-azuredisk-snapshot-restored` to check that the persistent volume has been created. You should status **Pending** and the message **waiting for first consumer to be created before binding**.

> [!TIP]
> If you already created a restored persistent volume claim and want to apply the yaml file again to correct an error or make a change, you'll need to first delete the old persistent volume claim before applying the yaml file again: `kubectl delete pvc <pvc-name>`.

## Delete the original pod (optional)

Before you create a new pod, you might want to delete the original pod that you created the snapshot from.

1. Run `kubectl get pods` to list the pods. Make sure you're deleting the right pod.
1. To delete the pod, run `kubectl delete pod <pod-name>`.

## Create a new pod using the restored snapshot

Next, create a new pod using the restored persistent volume claim. Create the pod using [Fio](https://github.com/axboe/fio) (Flexible I/O Tester) for benchmarking and workload simulation, and specify a mount path for the persistent volume.

1. Use your favorite text editor to create a YAML manifest file such as `code acstor-pod2.yaml`.

1. Paste in the following code. The persistent volume claim `claimName` should be the name of the restored snapshot persistent volume claim that you created. The metadata **name** value for the pod can be whatever you want.

   ```yml
   kind: Pod
   apiVersion: v1
   metadata:
     name: fiopod2
   spec:
     nodeSelector:
       acstor.azure.com/io-engine: acstor
     volumes:
       - name: diskpv
         persistentVolumeClaim:
           claimName: pvc-azuredisk-snapshot-restored
     containers:
       - name: fio
         image: nixery.dev/shell/fio
         args:
           - sleep
           - "1000000"
         volumeMounts:
           - mountPath: "/volume"
             name: diskpv
   ```

1. Apply the YAML manifest file to deploy the pod.
   
   ```azurecli-interactive
   kubectl apply -f acstor-pod2.yaml
   ```
   
   You should see output similar to the following:
   
   ```output
   pod/fiopod2 created
   ```

1. Check that the pod is running and that the persistent volume claim has been bound successfully to the pod:

   ```azurecli-interactive
   kubectl describe pod fiopod2
   kubectl describe pvc pvc-azuredisk-snapshot-restored
   ```

1. Check fio testing to see its current status:

   ```azurecli-interactive
   kubectl exec -it fiopod2 -- fio --name=benchtest --size=800m --filename=/volume/test --direct=1 --rw=randrw --ioengine=libaio --bs=4k --iodepth=16 --numjobs=8 --time_based --runtime=60
   ```

You've now deployed a new pod from the restored persistent volume claim, and you can use it for your Kubernetes workloads.

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
