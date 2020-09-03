---
title: Use Container Storage Interface (CSI) drivers for Azure Disks on Azure Kubernetes Service (AKS)
description: Learn how to use the Container Storage Interface (CSI) drivers for Azure Disks in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 08/27/2020
author: palma21

---

# Use the Azure disk Container Storage Interface (CSI) drivers in Azure Kubernetes Service (AKS) (preview)
The Azure Disk CSI Driver is a [CSI Specification](https://github.com/container-storage-interface/spec/blob/master/spec.md) compliant driver used by AKS to manage the lifecycle of Azure Disks. 

The Container Storage Interface (CSI) is a standard for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes. By adopting and using CSI, Azure Kubernetes Service (AKS) can write, deploy, and iterate plugins exposing new or improving existing storage systems in Kubernetes without having to touch the core Kubernetes code and waiting for its release cycles.

To create an AKS cluster with CSI driver support, see [Enable CSI drivers for Azure Disks and Azure Files on AKS](csi-storage-drivers.md).

>[!NOTE]
> *"In-tree drivers"* refers to the current storage drivers that are part of the core kubernetes code vs. the new CSI drivers which are plugins.

## Use CSI persistent volumes (PV) with Azure disks 

A [persistent volume](concepts-storage.md#persistent-volumes) represents a piece of storage that is provisioned for use with Kubernetes pods. A persistent volume can be used by one or many pods, and can be dynamically or statically provisioned. This article shows you how to dynamically create persistent volumes with Azure disks for use by a single pod in an Azure Kubernetes Service (AKS) cluster. For static provisioning, see [Manually create and use a volume with Azure disks](azure-disk-volume.md).

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Dynamically create Azure disk PVs using the built-in storage classes

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. For more information on Kubernetes storage classes, see [Kubernetes Storage Classes][kubernetes-storage-classes]. 
When using storage CSI Drivers on AKS, there are 2 additional built-in `StorageClasses` that leverage the **Azure Disk CSI storage drivers**. The additional CSI storage classes are created with the cluster alongside the in-tree default storage classes.

>[!NOTE]
> *"In-tree drivers"* refers to the current storage drivers that are part of the core kubernetes code vs. CSI drivers which are plugins.

- `managed-csi` - Uses Azure StandardSSD locally redundant storage (LRS) to create a Managed Disk.
- `managed-csi-premium` - Uses Azure Premium locally redundant storage (LRS) to create Managed Disk. 

The reclaim policy in both storage classes ensures that the underlying Azure Disk is deleted when the respective persistent volume is deleted. The storage classes also configure the persistent volumes to be expandable, you just need to edit the persistent volume claim with the new size.

To leverage these storage classes, you just need to create a [Persistent Volume Claim (PVC)](concepts-storage.md#persistent-volume-claims) and respective pod that references and leverages them. A persistent volume claim (PVC) is used to automatically provision storage based on a storage class. A PVC can use one of the pre-created storage classes or a user-defined storage class to create an Azure-managed disk for the desired SKU and size. When you create a pod definition, the persistent volume claim is specified to request the desired storage.

Create an example pod and respective persistent volume claim with the [kubectl apply][kubectl-apply] command:

```console
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/pvc-azuredisk-csi.yaml
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/nginx-pod-azuredisk.yaml

persistentvolumeclaim/pvc-azuredisk created
pod/nginx-azuredisk created
```

After the pod is in the running state, create a new file called `test.txt`.

```bash
$ kubectl exec nginx-azuredisk -- touch /mnt/azuredisk/test.txt
```

You can now validate the disk is correctly mounted by running the below command and verifying you see the `test.txt` file in the output: 

```console
$ kubectl exec nginx-azuredisk -- ls /mnt/azuredisk

lost+found
outfile
test.txt
```

## Create a custom Storage class

The default storage classes suit the most common scenarios but not all. For some cases, you might want to have your own storage class customized with your own parameters. To exemplify, we have a scenario where you might want to change the `volumeBindingMode`. 

The default storage classes use a `volumeBindingMode: Immediate` that guarantees that occur immediately once the PersistentVolumeClaim is created. In cases where your node pools are topology constrained, for example using Availability Zones, Persistent Volumes would be bound or provisioned without knowledge of the Pod's scheduling requirements (in this case to be in a specific zone).

To address this scenario, you can use `volumeBindingMode: WaitForFirstConsumer`, which will delay the binding and provisioning of a PersistentVolume until a Pod using the PersistentVolumeClaim is created. In this way, the PV will conform and be provisioned in the availability zone (or other topology) that is specified by the Pod's scheduling constraints. 

Create a file named `sc-azuredisk-csi-waitforfirstconsumer.yaml`, and paste the manifest below.
The storage class the same as our `managed-csi` storage class but with a different `volumeBindingMode`. 

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: azuredisk-csi-waitforfirstconsumer
provisioner: disk.csi.azure.com
parameters:
  skuname: StandardSSD_LRS 
allowVolumeExpansion: true
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
```

Create the storage class with the [kubectl apply][kubectl-apply] command and specify your `sc-azuredisk-csi-waitforfirstconsumer.yaml` file:

```console
$ kubectl apply -f sc-azuredisk-csi-waitforfirstconsumer.yaml

storageclass.storage.k8s.io/azuredisk-csi-waitforfirstconsumer created
```

## Volume snapshots

The Azure disk CSI driver supports creating [snapshots of persistent volumes](https://kubernetes-csi.github.io/docs/snapshot-restore-feature.html). As part of this capability, the driver can perform either *full* or [*incremental* snapshots](../virtual-machines/windows/disks-incremental-snapshots.md) depending on the value set in the `incremental` parameter (by default it's true). 

For details on all the parameters, see [Volume Snapshot Class parameters](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/docs/driver-parameters.md#volumesnapshotclass).

### Create a volume snapshot

To exemplify this capability, create a [volume snapshot class](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/snapshot/storageclass-azuredisk-snapshot.yaml) with the [kubectl apply][kubectl-apply] command:

```console
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/snapshot/storageclass-azuredisk-snapshot.yaml

volumesnapshotclass.snapshot.storage.k8s.io/csi-azuredisk-vsc created
```

Now let's create a [volume snapshot](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/snapshot/azuredisk-volume-snapshot.yaml) from the PVC [we dynamically created at the beginning of this tutorial](#dynamically-create-azure-disk-pvs-using-the-built-in-storage-classes), `pvc-azuredisk`.


```bash
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/snapshot/azuredisk-volume-snapshot.yaml

volumesnapshot.snapshot.storage.k8s.io/azuredisk-volume-snapshot created
```

Check the snapshot was created correctly:

```bash
$ kubectl describe volumesnapshot azuredisk-volume-snapshot

Name:         azuredisk-volume-snapshot
Namespace:    default
Labels:       <none>
Annotations:  API Version:  snapshot.storage.k8s.io/v1beta1
Kind:         VolumeSnapshot
Metadata:
  Creation Timestamp:  2020-08-27T05:27:58Z
  Finalizers:
    snapshot.storage.kubernetes.io/volumesnapshot-as-source-protection
    snapshot.storage.kubernetes.io/volumesnapshot-bound-protection
  Generation:        1
  Resource Version:  714582
  Self Link:         /apis/snapshot.storage.k8s.io/v1beta1/namespaces/default/volumesnapshots/azuredisk-volume-snapshot
  UID:               dd953ab5-6c24-42d4-ad4a-f33180e0ef87
Spec:
  Source:
    Persistent Volume Claim Name:  pvc-azuredisk
  Volume Snapshot Class Name:      csi-azuredisk-vsc
Status:
  Bound Volume Snapshot Content Name:  snapcontent-dd953ab5-6c24-42d4-ad4a-f33180e0ef87
  Creation Time:                       2020-08-31T05:27:59Z
  Ready To Use:                        true
  Restore Size:                        10Gi
Events:                                <none>
```

### Create a new PVC based on a volume snapshot

You can create a new PVC based on a volume snapshot. Use the snapshot created on the previous step and create a [new PVC](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/snapshot/pvc-azuredisk-snapshot-restored.yaml) and [new pod](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/snapshot/nginx-pod-restored-snapshot.yaml) to consume it.

```console
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/snapshot/pvc-azuredisk-snapshot-restored.yaml

$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/snapshot/nginx-pod-restored-snapshot.yaml

persistentvolumeclaim/pvc-azuredisk-snapshot-restored created
pod/nginx-restored created
```

Finally let's make sure it's the same PVC created before by checking the contents.

```console
$ kubectl exec nginx-restored -- ls /mnt/azuredisk

lost+found
outfile
test.txt
```

As expected we can still see our previously created `test.txt` file.

## Clone Volumes

A cloned volume is defined as a duplicate of an existing Kubernetes Volume. For more information on cloning volumes in Kubernetes, see the conceptual documentation for [Volume Cloning](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#volume-cloning).

The CSI driver for Azure Disks supports volume cloning. To demonstrate, create a [cloned volume](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/cloning/nginx-pod-restored-cloning.yaml) of the [previously created](#dynamically-create-azure-disk-pvs-using-the-built-in-storage-classes) `azuredisk-pvc` and [a new pod to consume it](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/cloning/nginx-pod-restored-cloning.yaml).



```console
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/cloning/pvc-azuredisk-cloning.yaml

$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/cloning/nginx-pod-restored-cloning.yaml

persistentvolumeclaim/pvc-azuredisk-cloning created
pod/nginx-restored-cloning created
```

We can now check the content of the cloned volume by running the below and confirming we still see our `test.txt` created file.

```console
$ kubectl exec nginx-restored-cloning -- ls /mnt/azuredisk

lost+found
outfile
test.txt
```

## Resize a Persistent Volume (PV)

You can instead request a larger volume for a PVC. Edit the PVC object and specify a larger size. This change triggers the expansion of the underlying volume that backs the PersistentVolume. 

> [!NOTE] 
> A new PersistentVolume is never created to satisfy the claim. Instead, an existing volume is resized.

In AKS, the built-in `managed-csi` storage class already allows for expansion, so leverage the [PVC created earlier with this storage class](#dynamically-create-azure-disk-pvs-using-the-built-in-storage-classes). The PVC requested a 10Gi persistent volume, we can confirm that by running:

```console 
$ kubectl exec -it nginx-azuredisk -- df -h /mnt/azuredisk

Filesystem      Size  Used Avail Use% Mounted on
/dev/sdc        9.8G   42M  9.8G   1% /mnt/azuredisk
```
> [!IMPORTANT]
> Currently, the Azure disk CSI driver only supports resizing PVCs with no pods associated (and the volume not mounted to a specific node).

As such lets delete the pod created earlier:

```console
$ kubectl delete -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/nginx-pod-azuredisk.yaml

pod "nginx-azuredisk" deleted
```

Let's expand the PVC by increasing the `spec.resources.requests.storage` field:

```console
$ kubectl patch pvc pvc-azuredisk --type merge --patch '{"spec": {"resources": {"requests": {"storage": "15Gi"}}}}'

persistentvolumeclaim/pvc-azuredisk patched
```

Let's confirm the volume is now larger:

```console
$ kubectl get pv

NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                     STORAGECLASS   REASON   AGE
pvc-391ea1a6-0191-4022-b915-c8dc4216174a   15Gi       RWO            Delete           Bound    default/pvc-azuredisk                     managed-csi             2d2h
(...)
```

> [!NOTE] 
> The PVC won't reflect the new size until it has a pod associated to it again.

Let's create a new pod:

```console
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/nginx-pod-azuredisk.yaml

pod/nginx-azuredisk created
```

And finally confirm the size of the PVC and inside the pod: 
```console
$ kubectl get pvc pvc-azuredisk
NAME            STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
pvc-azuredisk   Bound    pvc-391ea1a6-0191-4022-b915-c8dc4216174a   15Gi       RWO            managed-csi    2d2h

$ kubectl exec -it nginx-azuredisk -- df -h /mnt/azuredisk
Filesystem      Size  Used Avail Use% Mounted on
/dev/sdc         15G   46M   15G   1% /mnt/azuredisk
```

<!--- ## Shared disk

[Azure shared disks](../virtual-machines/windows/disks-shared.md) is an Azure managed disks feature that enables attaching an Azure disk to agent nodes simultaneously. Attaching a managed disk to multiple agent nodes allows you, for example, to deploy new or migrate existing clustered applications to Azure.

> [!IMPORTANT] Currently, only raw block device (`volumeMode: Block`) is supported by the Azure disk CSI driver. Applications should manage the coordination and control of writes, reads, locks, caches, mounts and fencing on the shared disk which is exposed as raw block device.

Let's create file called `shared-disk.yaml` by copying the below that contains the shared disk storage class and PVC:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: managed-csi-shared
provisioner: disk.csi.azure.com
parameters:
  skuname: Premium_LRS  # Currently shared disk is only available with premium SSD
  maxShares: "2"
  cachingMode: None  # ReadOnly cache is not available for premium SSD with maxShares>1
reclaimPolicy: Delete
---
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: pvc-azuredisk-shared
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 256Gi  # minimum size of shared disk is 256GB (P15)
  volumeMode: Block
  storageClassName: managed-csi-shared
```

Create the storage class with the [kubectl apply][kubectl-apply] command and specify your `shared-disk.yaml` file:

```console
$ kubectl apply -f shared-disk.yaml

storageclass.storage.k8s.io/managed-csi-shared created
persistentvolumeclaim/pvc-azuredisk-shared created
``` 

Now let's create a file called `deployment-shared.yml` by copying the below:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: deployment-azuredisk
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
      name: deployment-azuredisk
    spec:
      containers:
        - name: deployment-azuredisk
          image: nginx
          volumeDevices:
            - name: azuredisk
              devicePath: /dev/sdx
      volumes:
        - name: azuredisk
          persistentVolumeClaim:
            claimName: pvc-azuredisk-shared
```

Create the deployment with the [kubectl apply][kubectl-apply] command and specify your `deployment-shared.yml` file:

```console
$ kubectl apply -f deployment-shared.yml

deployment/deployment-azuredisk created
```

Finally, let's check the block device inside the pod:

```console
# kubectl exec -it deployment-sharedisk-7454978bc6-xh7jp bash
root@deployment-sharedisk-7454978bc6-xh7jp:/# dd if=/dev/zero of=/dev/sdx bs=1024k count=100
100+0 records in
100+0 records out
104857600 bytes (105 MB, 100 MiB) copied, 0.0502999 s, 2.1 GB/s
```
-->

## Windows Containers

The Azure disk CSI driver also supports Windows nodes and containers. If you wish to use windows containers, follow the [Windows Containers tutorial](windows-container-cli.md) to add a Windows node pool.

Once you have a windows node pool, you can now just leverage the built-in storage classes like `managed-csi`. You can deploy an example [windows-based stateful set](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/windows/statefulset.yaml) that saves timestamps into a file `data.txt` by deploying the below with the [kubectl apply][kubectl-apply] command:

 ```console
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/windows/statefulset.yaml

statefulset.apps/busybox-azuredisk created
```

You can now validate the contents of the volume by running:

```console
$ kubectl exec -it busybox-azuredisk-0 -- cat c:\\mnt\\azuredisk\\data.txt # on Linux/MacOS Bash
$ kubectl exec -it busybox-azuredisk-0 -- cat c:\mnt\azuredisk\data.txt # on Windows Powershell/CMD

2020-08-27 08:13:41Z
2020-08-27 08:13:42Z
2020-08-27 08:13:44Z
(...)
```

## Next steps

- To learn how to use CSI driver for Azure files, see [Use Azure files with CSI drivers](azure-files-csi.md).
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service (AKS)][operator-best-practices-storage]


<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/

<!-- LINKS - internal -->
[azure-disk-volume]: azure-disk-volume.md
[azure-files-pvc]: azure-files-dynamic-pv.md
[premium-storage]: ../virtual-machines/windows/disks-types.md
[az-disk-list]: /cli/azure/disk#az-disk-list
[az-snapshot-create]: /cli/azure/snapshot#az-snapshot-create
[az-disk-create]: /cli/azure/disk#az-disk-create
[az-disk-show]: /cli/azure/disk#az-disk-show
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[storage-class-concepts]: concepts-storage.md#storage-classes
[az-extension-add]: /cli/azure/extension?view=azure-cli-latest#az-extension-add
[az-extension-update]: /cli/azure/extension?view=azure-cli-latest#az-extension-update
[az-feature-register]: /cli/azure/feature?view=azure-cli-latest#az-feature-register
[az-feature-list]: /cli/azure/feature?view=azure-cli-latest#az-feature-list
[az-provider-register]: /cli/azure/provider?view=azure-cli-latest#az-provider-register