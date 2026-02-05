---
title: Use volume snapshots with Azure Container Storage (version 2.x.x) with Azure Elastic SAN
description: Take a snapshot of a persistent volume and restore it.
author: saurabh0501
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 01/28/2026
ms.author: kendownie
# Customer intent: As a Kubernetes operator, I want to create and restore volume snapshots in Azure Container Storage, so that I can recover from potential data loss.
---

# Use volume snapshots with Azure Container Storage

Azure Container Storage is a cloud-based volume management, deployment, and orchestration service built for containers. This article shows how to take a point-in-time snapshot of a persistent volume and restore it with a new persistent volume claim (PVC).

## Limitations

Volume snapshots aren't supported when you use ephemeral disk (local NVMe) as backing storage.

## Prerequisites

- This article requires the latest version of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). If you use Azure Cloud Shell, the latest version is already installed. If you run commands locally, use an account with administrative privileges.
- This article assumes you installed Azure Container Storage on your Azure Kubernetes Service (AKS) cluster and created a PVC using [Azure Elastic SAN](use-container-storage-with-elastic-san.md).

## Create a volume snapshot class

A volume snapshot class defines snapshot settings. Follow these steps to create a volume snapshot class for Elastic SAN.

1. Create a YAML manifest file such as `acstor-volumesnapshotclass.yaml`.

1. Paste the following code. The volume snapshot class `name` value can be any value.

   ```yaml
   apiVersion: snapshot.storage.k8s.io/v1
   kind: VolumeSnapshotClass
   metadata:
     name: elasticsan-snapshot-class
   driver: san.csi.azure.com
   deletionPolicy: Delete
   ```

1. Apply the manifest to create the volume snapshot class.

   ```azurecli-interactive
   kubectl apply -f acstor-volumesnapshotclass.yaml
   ```

   When creation is complete, you see a message like:

   ```output
   volumesnapshotclass.snapshot.storage.k8s.io/elasticsan-snapshot-class created
   ```

   You can also run `kubectl get volumesnapshotclass` to confirm creation. You should see output such as:

   ```output
   NAME                        DRIVER                DELETIONPOLICY    AGE
   elasticsan-snapshot-class   san.csi.azure.com     Delete            11s
   ```

## Create a volume snapshot

Next, create a snapshot of an existing PVC and apply the volume snapshot class you created in the previous step.

1. Create a YAML manifest file such as `acstor-volumesnapshot.yaml`.

1. Paste the following code. Set `volumeSnapshotClassName` to the name of the volume snapshot class you created in the previous step. Set `persistentVolumeClaimName` to the name of the PVC you want to snapshot. The volume snapshot `name` value can be any value.

   ```yaml
   apiVersion: snapshot.storage.k8s.io/v1
   kind: VolumeSnapshot
   metadata:
     name: elasticsan-volume-snapshot
   spec:
     volumeSnapshotClassName: elasticsan-snapshot-class
     source:
       persistentVolumeClaimName: elasticsanpvc
   ```

1. Apply the manifest to create the volume snapshot.

   ```azurecli-interactive
   kubectl apply -f acstor-volumesnapshot.yaml
   ```

   When creation is complete, you see a message like:

   ```output
   volumesnapshot.snapshot.storage.k8s.io/elasticsan-volume-snapshot created
   ```

   You can also run `kubectl get volumesnapshot` to check that the volume snapshot is created. If `READYTOUSE` is `true`, you can move on to the next step.

## Create a restored persistent volume claim

Create a new PVC that uses the volume snapshot as a data source.

1. Create a YAML manifest file such as `acstor-pvc-restored.yaml`.

1. Paste the following code. The `storageClassName` must match the StorageClass you used when creating the original PVC. For the data source `name` value, use the name of the volume snapshot you created in the previous step. The PVC `metadata.name` value can be any value.

   ```yaml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: pvc-elasticsan-snapshot-restored
   spec:
     accessModes:
       - ReadWriteOnce
     storageClassName: azuresan
     resources:
       requests:
         storage: 100Gi
     dataSource:
       name: elasticsan-volume-snapshot
       kind: VolumeSnapshot
       apiGroup: snapshot.storage.k8s.io
   ```

1. Apply the manifest to create the PVC.

   ```azurecli-interactive
   kubectl apply -f acstor-pvc-restored.yaml
   ```

   When creation is complete, you see a message like:

   ```output
   persistentvolumeclaim/pvc-elasticsan-snapshot-restored created
   ```

   You can also run `kubectl describe pvc pvc-elasticsan-snapshot-restored` to check that the persistent volume is created. The status shows **Pending** with a message that it is waiting for the first consumer to be created before binding.

> [!TIP]
> If you need to reapply the YAML file to fix an error or make a change, delete the old PVC first: `kubectl delete pvc <pvc-name>`.

## Delete the original pod (optional)

Before you create a new pod, you can delete the original pod that you created the snapshot from.

1. Run `kubectl get pods` to list the pods. Make sure you delete the correct pod.
1. To delete the pod, run `kubectl delete pod <pod-name>`.

## Create a new pod using the restored snapshot

Create a new pod using the restored PVC. Create the pod using Flexible I/O Tester (fio) for benchmarking and workload simulation, and specify a mount path for the persistent volume.

1. Create a YAML manifest file such as `fio-pod-restore.yaml`.

1. Paste the following code. The persistent volume claim `claimName` should be the name of the restored PVC you created. The pod `metadata.name` value can be any value.

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: fio-restore
   spec:
     volumes:
       - name: iscsi-volume
         persistentVolumeClaim:
           claimName: pvc-elasticsan-snapshot-restored
     containers:
       - name: fio
         image: nixery.dev/shell/fio
         volumeMounts:
           - mountPath: /volume
             name: iscsi-volume
   ```

1. Apply the manifest to deploy the pod.

   ```azurecli-interactive
   kubectl apply -f fio-pod-restore.yaml
   ```

   You should see output similar to the following:

   ```output
   pod/fio-restore created
   ```

1. Check that the pod is running and the PVC is bound:

   ```azurecli-interactive
   kubectl describe pod fio-restore
   kubectl describe pvc pvc-elasticsan-snapshot-restored
   ```

1. Check fio testing to see its current status:

   ```azurecli-interactive
   kubectl exec -it fio-restore -- fio --name=benchtest --size=800m --filename=/volume/test --direct=1 --rw=randrw --ioengine=libaio --bs=4k --iodepth=16 --numjobs=8 --time_based --runtime=60
   ```

You now have a pod that uses the restored PVC and can use it for your Kubernetes workloads.

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
- [Use Azure Container Storage with local NVMe](use-container-storage-with-local-disk.md)
