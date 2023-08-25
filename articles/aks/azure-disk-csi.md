---
title: Use Container Storage Interface (CSI) driver for Azure Disk on Azure Kubernetes Service (AKS)
description: Learn how to use the Container Storage Interface (CSI) driver for Azure Disk in an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.custom: devx-track-linux
ms.date: 04/19/2023
---

# Use the Azure Disk Container Storage Interface (CSI) driver in Azure Kubernetes Service (AKS)

The Azure Disks Container Storage Interface (CSI) driver is a [CSI specification](https://github.com/container-storage-interface/spec/blob/master/spec.md)-compliant driver used by Azure Kubernetes Service (AKS) to manage the lifecycle of Azure Disk.

The CSI is a standard for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes. By adopting and using CSI, AKS now can write, deploy, and iterate plug-ins to expose new or improve existing storage systems in Kubernetes. Using CSI drivers in AKS avoids having to touch the core Kubernetes code and wait for its release cycles.

To create an AKS cluster with CSI driver support, see [Enable CSI driver on AKS](csi-storage-drivers.md). This article describes how to use the Azure Disk CSI driver version 1.

> [!NOTE]
> Azure Disk CSI driver v2 (preview) improves scalability and reduces pod failover latency. It uses shared disks to provision attachment replicas on multiple cluster nodes and integrates with the pod scheduler to ensure a node with an attachment replica is chosen on pod failover. Azure Disk CSI driver v2 (preview) also provides the ability to fine tune performance. If you're interested in participating in the preview, submit a request: [https://aka.ms/DiskCSIv2Preview](https://aka.ms/DiskCSIv2Preview). This preview version is provided without a service level agreement, and you can occasionally expect breaking changes while in preview. The preview version isn't recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> *In-tree drivers* refers to the current storage drivers that are part of the core Kubernetes code versus the new CSI drivers, which are plug-ins.

## Azure Disk CSI driver features

In addition to in-tree driver features, Azure Disk CSI driver supports the following features:

- Performance improvements during concurrent disk attach and detach
  - In-tree drivers attach or detach disks in serial, while CSI drivers attach or detach disks in batch. There's significant improvement when there are multiple disks attaching to one node.
- Premium SSD v1 and v2 are supported.
  -  `PremiumV2_LRS` only supports `None` caching mode
- Zone-redundant storage (ZRS) disk support
  - `Premium_ZRS`, `StandardSSD_ZRS` disk types are supported. ZRS disk could be scheduled on the zone or non-zone node, without the restriction that disk volume should be co-located in the same zone as a given node. For more information, including which regions are supported, see [Zone-redundant storage for managed disks](../virtual-machines/disks-redundancy.md).
- [Snapshot](#volume-snapshots)
- [Volume clone](#clone-volumes)
- [Resize disk PV without downtime](#resize-a-persistent-volume-without-downtime)

> [!NOTE]
> Depending on the VM SKU that's being used, the Azure Disk CSI driver might have a per-node volume limit. For some powerful VMs (for example, 16 cores), the limit is 64 volumes per node. To identify the limit per VM SKU, review the **Max data disks** column for each VM SKU offered. For a list of VM SKUs offered and their corresponding detailed capacity limits, see [General purpose virtual machine sizes][general-purpose-machine-sizes].

## Use CSI persistent volumes with Azure Disks

A [persistent volume](concepts-storage.md#persistent-volumes) (PV) represents a piece of storage that's provisioned for use with Kubernetes pods. A PV can be used by one or many pods and can be dynamically or statically provisioned. This article shows you how to dynamically create PVs with Azure disk for use by a single pod in an AKS cluster. For static provisioning, see [Create a static volume with Azure Disks](azure-csi-disk-storage-provision.md#statically-provision-a-volume).

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Dynamically create Azure Disks PVs by using the built-in storage classes

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. For more information on Kubernetes storage classes, see [Kubernetes storage classes][kubernetes-storage-classes].

When you use the Azure Disk CSI driver on AKS, there are two more built-in `StorageClasses` that use the Azure Disk CSI storage driver. The other CSI storage classes are created with the cluster alongside the in-tree default storage classes.

- `managed-csi`: Uses Azure Standard SSD locally redundant storage (LRS) to create a managed disk.
- `managed-csi-premium`: Uses Azure Premium LRS to create a managed disk.

The reclaim policy in both storage classes ensures that the underlying Azure Disks are deleted when the respective PV is deleted. The storage classes also configure the PVs to be expandable. You just need to edit the persistent volume claim (PVC) with the new size.

To use these storage classes, create a [PVC](concepts-storage.md#persistent-volume-claims) and respective pod that references and uses them. A PVC is used to automatically provision storage based on a storage class. A PVC can use one of the pre-created storage classes or a user-defined storage class to create an Azure-managed disk for the desired SKU and size. When you create a pod definition, the PVC is specified to request the desired storage.

Create an example pod and respective PVC by running the [kubectl apply][kubectl-apply] command:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/pvc-azuredisk-csi.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/nginx-pod-azuredisk.yaml
```

The output of the command resembles the following example:

```output
persistentvolumeclaim/pvc-azuredisk created
pod/nginx-azuredisk created
```

After the pod is in the running state, run the following command to create a new file called `test.txt`.

```bash
kubectl exec nginx-azuredisk -- touch /mnt/azuredisk/test.txt
```

To validate the disk is correctly mounted, run the following command and verify you see the `test.txt` file in the output:

```bash
kubectl exec nginx-azuredisk -- ls /mnt/azuredisk

lost+found
outfile
test.txt
```

## Create a custom storage class

The default storage classes are suitable for most common scenarios. For some cases, you might want to have your own storage class customized with your own parameters. For example, you might want to change the `volumeBindingMode` class.

You can use a `volumeBindingMode: Immediate` class that guarantees it occurs immediately once the PVC is created. When your node pools are topology constrained, for example when using availability zones, PVs would be bound or provisioned without knowledge of the pod's scheduling requirements.

To address this scenario, you can use `volumeBindingMode: WaitForFirstConsumer`, which delays the binding and provisioning of a PV until a pod that uses the PVC is created. This way, the PV conforms and is provisioned in the availability zone (or other topology) that's specified by the pod's scheduling constraints. The default storage classes use `volumeBindingMode: WaitForFirstConsumer` class.

Create a file named `sc-azuredisk-csi-waitforfirstconsumer.yaml`, and then paste the following manifest. The storage class is the same as our `managed-csi` storage class, but with a different `volumeBindingMode` class.

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

Create the storage class by running the [kubectl apply][kubectl-apply] command and specify your `sc-azuredisk-csi-waitforfirstconsumer.yaml` file:

```bash
kubectl apply -f sc-azuredisk-csi-waitforfirstconsumer.yaml
```

The output of the command resembles the following example:

```output
storageclass.storage.k8s.io/azuredisk-csi-waitforfirstconsumer created
```

## Volume snapshots

The Azure Disk CSI driver supports creating [snapshots of persistent volumes](https://kubernetes-csi.github.io/docs/snapshot-restore-feature.html). As part of this capability, the driver can perform either *full* or [*incremental* snapshots](../virtual-machines/disks-incremental-snapshots.md) depending on the value set in the `incremental` parameter (by default, it's true).

The following table provides details for all of the parameters.

|Name | Meaning | Available Value | Mandatory | Default value
|--- | --- | --- | --- | ---
|resourceGroup | Resource group for storing snapshot shots | EXISTING RESOURCE GROUP | No | If not specified, snapshot will be stored in the same resource group as source Azure Disks
|incremental | Take [full or incremental snapshot](../virtual-machines/windows/incremental-snapshots.md) | `true`, `false` | No | `true`
|tags | Azure Disks [tags](../azure-resource-manager/management/tag-resources.md) | Tag format: 'key1=val1,key2=val2' | No | ""
|userAgent | User agent used for [customer usage attribution](../marketplace/azure-partner-customer-usage-attribution.md) | | No  | Generated Useragent formatted `driverName/driverVersion compiler/version (OS-ARCH)`
|subscriptionID | Specify Azure subscription ID where Azure Disks will be created  | Azure subscription ID | No | If not empty, `resourceGroup` must be provided, `incremental` must set as `false`

### Create a volume snapshot

> [!NOTE]
> Before proceeding, ensure that the application is not writing data to the source disk.

For an example of this capability, create a [volume snapshot class](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/snapshot/storageclass-azuredisk-snapshot.yaml) with the [kubectl apply][kubectl-apply] command:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/snapshot/storageclass-azuredisk-snapshot.yaml
```

The output of the command resembles the following example:

```output
volumesnapshotclass.snapshot.storage.k8s.io/csi-azuredisk-vsc created
```

Now let's create a [volume snapshot](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/snapshot/azuredisk-volume-snapshot.yaml) from the PVC that [we dynamically created at the beginning of this tutorial](#dynamically-create-azure-disks-pvs-by-using-the-built-in-storage-classes), `pvc-azuredisk`.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/snapshot/azuredisk-volume-snapshot.yaml
```

The output of the command resembles the following example:

```output
volumesnapshot.snapshot.storage.k8s.io/azuredisk-volume-snapshot created
```

To verify that the snapshot was created correctly, run the following command:

```bash
kubectl describe volumesnapshot azuredisk-volume-snapshot
```

The output of the command resembles the following example:

```output
Name:         azuredisk-volume-snapshot
Namespace:    default
Labels:       <none>
Annotations:  API Version:  snapshot.storage.k8s.io/v1
Kind:         VolumeSnapshot
Metadata:
  Creation Timestamp:  2020-08-27T05:27:58Z
  Finalizers:
    snapshot.storage.kubernetes.io/volumesnapshot-as-source-protection
    snapshot.storage.kubernetes.io/volumesnapshot-bound-protection
  Generation:        1
  Resource Version:  714582
  Self Link:         /apis/snapshot.storage.k8s.io/v1/namespaces/default/volumesnapshots/azuredisk-volume-snapshot
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

You can create a new PVC based on a volume snapshot. Use the snapshot created in the previous step, and create a [new PVC](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/snapshot/pvc-azuredisk-snapshot-restored.yaml) and a [new pod](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/snapshot/nginx-pod-restored-snapshot.yaml) to consume it.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/snapshot/pvc-azuredisk-snapshot-restored.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/snapshot/nginx-pod-restored-snapshot.yaml
```

The output of the command resembles the following example:

```output
persistentvolumeclaim/pvc-azuredisk-snapshot-restored created
pod/nginx-restored created
```

Finally, let's make sure it's the same PVC created before by checking the contents by running the following command:

```bash
kubectl exec nginx-restored -- ls /mnt/azuredisk
```

The output of the command resembles the following example:

```output
lost+found
outfile
test.txt
```

As expected, we can still see our previously created `test.txt` file.

## Clone volumes

A cloned volume is defined as a duplicate of an existing Kubernetes volume. For more information on cloning volumes in Kubernetes, see the conceptual documentation for [volume cloning](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#volume-cloning).

The CSI driver for Azure Disks supports volume cloning. To demonstrate, create a [cloned volume](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/cloning/nginx-pod-restored-cloning.yaml) of the [previously created](#dynamically-create-azure-disks-pvs-by-using-the-built-in-storage-classes) `azuredisk-pvc` and [a new pod to consume it](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/cloning/nginx-pod-restored-cloning.yaml).

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/cloning/pvc-azuredisk-cloning.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/cloning/nginx-pod-restored-cloning.yaml
```

The output of the command resembles the following example:

```output
persistentvolumeclaim/pvc-azuredisk-cloning created
pod/nginx-restored-cloning created
```

You can verify the content of the cloned volume by running the following command and confirming the file `test.txt` is created:

```bash
kubectl exec nginx-restored-cloning -- ls /mnt/azuredisk
```

The output of the command resembles the following example:

```output
lost+found
outfile
test.txt
```

## Resize a persistent volume without downtime

You can request a larger volume for a PVC. Edit the PVC object, and specify a larger size. This change triggers the expansion of the underlying volume that backs the PV.

> [!NOTE]
> A new PV is never created to satisfy the claim. Instead, an existing volume is resized.

In AKS, the built-in `managed-csi` storage class already supports expansion, so use the [PVC created earlier with this storage class](#dynamically-create-azure-disks-pvs-by-using-the-built-in-storage-classes). The PVC requested a 10-Gi persistent volume. You can confirm by running the following command:

```bash
kubectl exec -it nginx-azuredisk -- df -h /mnt/azuredisk
```

The output of the command resembles the following example:

```output
Filesystem      Size  Used Avail Use% Mounted on
/dev/sdc        9.8G   42M  9.8G   1% /mnt/azuredisk
```

Expand the PVC by increasing the `spec.resources.requests.storage` field running the following command:

```bash
kubectl patch pvc pvc-azuredisk --type merge --patch '{"spec": {"resources": {"requests": {"storage": "15Gi"}}}}'
```

> [!NOTE]
> Shrinking persistent volumes is currently not supported. Trying to patch an existing PVC with a smaller size than the current one leads to the following error message:
> `The persistentVolumeClaim "pvc-azuredisk" is invalid: spec.resources.requests.storage: Forbidden: field can not be less than previous value.`

The output of the command resembles the following example:

```output
persistentvolumeclaim/pvc-azuredisk patched
```

Run the following command to confirm the volume size has increased:

```bash
kubectl get pv
```

The output of the command resembles the following example:

```output
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                     STORAGECLASS   REASON   AGE
pvc-391ea1a6-0191-4022-b915-c8dc4216174a   15Gi       RWO            Delete           Bound    default/pvc-azuredisk                     managed-csi             2d2h
(...)
```

And after a few minutes, run the following commands to confirm the size of the PVC:

```bash
kubectl get pvc pvc-azuredisk
```

The output of the command resembles the following example:

```output
NAME            STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
pvc-azuredisk   Bound    pvc-391ea1a6-0191-4022-b915-c8dc4216174a   15Gi       RWO            managed-csi    2d2h
```

Run the following command to confirm the size of the disk inside the pod:

```bash
kubectl exec -it nginx-azuredisk -- df -h /mnt/azuredisk
```

The output of the command resembles the following example:

```output
Filesystem      Size  Used Avail Use% Mounted on
/dev/sdc         15G   46M   15G   1% /mnt/azuredisk
```

## On-demand bursting

On-demand disk bursting model allows disk bursts whenever its needs exceed its current capacity. This model generates extra charges anytime the disk bursts. On-demand bursting is only available for premium SSDs larger than 512 GiB. For more information on premium SSDs provisioned IOPS and throughput per disk, see [Premium SSD size][az-premium-ssd]. Alternatively, credit-based bursting is where the disk will burst only if it has burst credits accumulated in its credit bucket. Credit-based bursting doesn't generate extra charges when the disk bursts. Credit-based bursting is only available for premium SSDs 512 GiB and smaller, and standard SSDs 1024 GiB and smaller. For more information on on-demand bursting, see [On-demand bursting][az-on-demand-bursting].

> [!IMPORTANT]
> The default `managed-csi-premium` storage class has on-demand bursting disabled and uses credit-based bursting. Any premium SSD dynamically created by a persistent volume claim based on the default `managed-csi-premium` storage class also has on-demand bursting disabled.

To create a premium SSD persistent volume with [on-demand bursting][az-on-demand-bursting] enabled, you can create a new storage class with the [enableBursting][csi-driver-parameters] parameter set to `true` as shown in the following YAML template. For more information on enabling on-demand bursting, see [On-demand bursting][az-on-demand-bursting]. For more information on building your own storage class with on-demand bursting enabled, see [Create a Burstable Managed CSI Premium Storage Class][create-burstable-storage-class].

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: burstable-managed-csi-premium
provisioner: disk.csi.azure.com
parameters:
  skuname: Premium_LRS
  enableBursting: "true"
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
```

## Windows containers

The Azure Disk CSI driver supports Windows nodes and containers. If you want to use Windows containers, follow the [Windows containers quickstart][aks-quickstart-cli] to add a Windows node pool.

After you have a Windows node pool, you can now use the built-in storage classes like `managed-csi`. You can deploy an example [Windows-based stateful set](https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/deploy/example/windows/statefulset.yaml) that saves timestamps into the file `data.txt` by running the following [kubectl apply][kubectl-apply] command:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/deploy/example/windows/statefulset.yaml
```

The output of the command resembles the following example:

```output
statefulset.apps/busybox-azuredisk created
```

To validate the content of the volume, run the following command:

```bash
kubectl exec -it busybox-azuredisk-0 -- cat c:\\mnt\\azuredisk\\data.txt # on Linux/MacOS Bash
kubectl exec -it busybox-azuredisk-0 -- cat c:\mnt\azuredisk\data.txt # on Windows Powershell/CMD
```

The output of the command resembles the following example:

```output
2020-08-27 08:13:41Z
2020-08-27 08:13:42Z
2020-08-27 08:13:44Z
(...)
```

## Next steps

- To learn how to use CSI driver for Azure Files, see [Use Azure Files with CSI driver][azure-files-csi].
- To learn how to use CSI driver for Azure Blob storage, see [Use Azure Blob storage with CSI driver][azure-blob-csi].
- For more information about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service][operator-best-practices-storage].
- For more information about disk-based storage solutions, see [Disk-based solutions in AKS][disk-based-solutions].

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/
[csi-driver-parameters]: https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/docs/driver-parameters.md
[create-burstable-storage-class]: https://github.com/Azure-Samples/burstable-managed-csi-premium
[expand-pvc-with-downtime]: https://github.com/kubernetes-sigs/azuredisk-csi-driver/blob/master/docs/known-issues/sizegrow.md

<!-- LINKS - internal -->
[azure-disk-volume]: azure-disk-volume.md
[azure-files-pvc]: azure-files-dynamic-pv.md
[azure-files-csi]: azure-files-csi.md
[azure-blob-csi]: azure-blob-csi.md
[premium-storage]: ../virtual-machines/disks-types.md
[expand-an-azure-managed-disk]: ../virtual-machines/linux/expand-disks.md#expand-an-azure-managed-disk
[az-disk-list]: /cli/azure/disk#az_disk_list
[az-snapshot-create]: /cli/azure/snapshot#az_snapshot_create
[az-disk-create]: /cli/azure/disk#az_disk_create
[az-disk-show]: /cli/azure/disk#az_disk_show
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[storage-class-concepts]: concepts-storage.md#storage-classes
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-on-demand-bursting]: ../virtual-machines/disk-bursting.md#on-demand-bursting
[enable-on-demand-bursting]: ../virtual-machines/disks-enable-bursting.md?tabs=azure-cli
[az-premium-ssd]: ../virtual-machines/disks-types.md#premium-ssds
[general-purpose-machine-sizes]: ../virtual-machines/sizes-general.md
[disk-based-solutions]: /azure/cloud-adoption-framework/scenarios/app-platform/aks/storage#disk-based-solutions
