---
title: Use Container Storage Interface (CSI) drivers for Azure Files on Azure Kubernetes Service (AKS)
description: Learn how to use the Container Storage Interface (CSI) drivers for Azure Files in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 08/27/2020
author: palma21

---

# Use Azure Files Container Storage Interface (CSI) drivers in Azure Kubernetes Service (AKS)

The Azure Files Container Storage Interface (CSI) driver is a [CSI specification](https://github.com/container-storage-interface/spec/blob/master/spec.md)-compliant driver used by Azure Kubernetes Service (AKS) to manage the lifecycle of Azure Files shares.

The CSI is a standard for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes. By adopting and using CSI, AKS now can write, deploy, and iterate plug-ins to expose new or improve existing storage systems in Kubernetes without having to touch the core Kubernetes code and wait for its release cycles.

To create an AKS cluster with CSI driver support, see [Enable CSI drivers for Azure disks and Azure Files on AKS](csi-storage-drivers.md).

> [!NOTE]
> *In-tree drivers* refers to the current storage drivers that are part of the core Kubernetes code versus the new CSI drivers, which are plug-ins.

## Use a persistent volume with Azure Files

A [persistent volume (PV)](concepts-storage.md#persistent-volumes) represents a piece of storage that's provisioned for use with Kubernetes pods. A PV can be used by one or many pods and can be dynamically or statically provisioned. If multiple pods need concurrent access to the same storage volume, you can use Azure Files to connect by using the [Server Message Block (SMB) protocol][smb-overview]. This article shows you how to dynamically create an Azure Files share for use by multiple pods in an AKS cluster. For static provisioning, see [Manually create and use a volume with an Azure Files share](azure-files-volume.md).

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Dynamically create Azure Files PVs by using the built-in storage classes

A storage class is used to define how an Azure Files share is created. A storage account is automatically created in the [node resource group][node-resource-group] for use with the storage class to hold the Azure Files shares. Choose one of the following [Azure storage redundancy SKUs][storage-skus] for *skuName*:

* **Standard_LRS**: Standard locally redundant storage
* **Standard_GRS**: Standard geo-redundant storage
* **Standard_ZRS**: Standard zone-redundant storage
* **Standard_RAGRS**: Standard read-access geo-redundant storage
* **Premium_LRS**: Premium locally redundant storage

> [!NOTE]
> Azure Files supports Azure Premium Storage. The minimum premium file share is 100 GB.

When you use storage CSI drivers on AKS, there are two additional built-in `StorageClasses` that use the Azure Files CSI storage drivers. The additional CSI storage classes are created with the cluster alongside the in-tree default storage classes.

- `azurefile-csi`: Uses Azure Standard Storage to create an Azure Files share.
- `azurefile-csi-premium`: Uses Azure Premium Storage to create an Azure Files share.

The reclaim policy on both storage classes ensures that the underlying Azure Files share is deleted when the respective PV is deleted. The storage classes also configure the file shares to be expandable, you just need to edit the persistent volume claim (PVC) with the new size.

To use these storage classes, create a [PVC](concepts-storage.md#persistent-volume-claims) and respective pod that references and uses them. A PVC is used to automatically provision storage based on a storage class. A PVC can use one of the pre-created storage classes or a user-defined storage class to create an Azure Files share for the desired SKU and size. When you create a pod definition, the PVC is specified to request the desired storage.

Create an [example PVC and pod that prints the current date into an `outfile`](https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/deploy/example/statefulset.yaml) with the [kubectl apply][kubectl-apply] command:

```console
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azurefile-csi-driver/master/deploy/example/pvc-azurefile-csi.yaml
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azurefile-csi-driver/master/deploy/example/nginx-pod-azurefile.yaml

persistentvolumeclaim/pvc-azurefile created
pod/nginx-azurefile created
```

After the pod is in the running state, you can validate that the file share is correctly mounted by running the following command and verifying the output contains the `outfile`:

```console
$ kubectl exec nginx-azurefile -- ls -l /mnt/azurefile

total 29
-rwxrwxrwx 1 root root 29348 Aug 31 21:59 outfile
```

## Create a custom storage class

The default storage classes suit the most common scenarios, but not all. For some cases, you might want to have your own storage class customized with your own parameters. For example, use the following manifest to configure the `mountOptions` of the file share.

The default value for *fileMode* and *dirMode* is *0777* for Kubernetes mounted file shares. You can specify the different mount options on the storage class object.

Create a file named `azure-file-sc.yaml`, and paste the following example manifest:

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: my-azurefile
provisioner: file.csi.azure.com
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
mountOptions:
  - dir_mode=0640
  - file_mode=0640
  - uid=0
  - gid=0
  - mfsymlinks
  - cache=strict # https://linux.die.net/man/8/mount.cifs
  - nosharesock
parameters:
  skuName: Standard_LRS
```

Create the storage class with the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f azure-file-sc.yaml

storageclass.storage.k8s.io/my-azurefile created
```

The Azure Files CSI driver supports creating [snapshots of persistent volumes](https://kubernetes-csi.github.io/docs/snapshot-restore-feature.html) and the underlying file shares.

Create a [volume snapshot class](https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/deploy/example/snapshot/volumesnapshotclass-azurefile.yaml) with the [kubectl apply][kubectl-apply] command:

```console
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azurefile-csi-driver/master/deploy/example/snapshot/volumesnapshotclass-azurefile.yaml

volumesnapshotclass.snapshot.storage.k8s.io/csi-azurefile-vsc created
```

Create a [volume snapshot](https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/deploy/example/snapshot/volumesnapshot-azurefile.yaml) from the PVC [we dynamically created at the beginning of this tutorial](#dynamically-create-azure-files-pvs-by-using-the-built-in-storage-classes), `pvc-azurefile`.

```bash
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azurefile-csi-driver/master/deploy/example/snapshot/volumesnapshot-azurefile.yaml

volumesnapshot.snapshot.storage.k8s.io/azurefile-volume-snapshot created
```

Verify the snapshot was created correctly:

```bash
$ kubectl describe volumesnapshot azurefile-volume-snapshot

Name:         azurefile-volume-snapshot
Namespace:    default
Labels:       <none>
Annotations:  API Version:  snapshot.storage.k8s.io/v1beta1
Kind:         VolumeSnapshot
Metadata:
  Creation Timestamp:  2020-08-27T22:37:41Z
  Finalizers:
    snapshot.storage.kubernetes.io/volumesnapshot-as-source-protection
    snapshot.storage.kubernetes.io/volumesnapshot-bound-protection
  Generation:        1
  Resource Version:  955091
  Self Link:         /apis/snapshot.storage.k8s.io/v1beta1/namespaces/default/volumesnapshots/azurefile-volume-snapshot
  UID:               c359a38f-35c1-4fb1-9da9-2c06d35ca0f4
Spec:
  Source:
    Persistent Volume Claim Name:  pvc-azurefile
  Volume Snapshot Class Name:      csi-azurefile-vsc
Status:
  Bound Volume Snapshot Content Name:  snapcontent-c359a38f-35c1-4fb1-9da9-2c06d35ca0f4
  Ready To Use:                        false
Events:                                <none>
```

## Resize a persistent volume

You can request a larger volume for a PVC. Edit the PVC object, and specify a larger size. This change triggers the expansion of the underlying volume that backs the PV.

> [!NOTE]
> A new PV is never created to satisfy the claim. Instead, an existing volume is resized.

In AKS, the built-in `azurefile-csi` storage class already supports expansion, so use the [PVC created earlier with this storage class](#dynamically-create-azure-files-pvs-by-using-the-built-in-storage-classes). The PVC requested a 100Gi file share. We can confirm that by running:

```console
$ kubectl exec -it nginx-azurefile -- df -h /mnt/azurefile

Filesystem                                                                                Size  Used Avail Use% Mounted on
//f149b5a219bd34caeb07de9.file.core.windows.net/pvc-5e5d9980-da38-492b-8581-17e3cad01770  100G  128K  100G   1% /mnt/azurefile
```

Expand the PVC by increasing the `spec.resources.requests.storage` field:

```console
$ kubectl patch pvc pvc-azurefile --type merge --patch '{"spec": {"resources": {"requests": {"storage": "200Gi"}}}}'

persistentvolumeclaim/pvc-azurefile patched
```

Verify that both the PVC and the file system inside the pod show the new size:

```console
$ kubectl get pvc pvc-azurefile
NAME            STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS    AGE
pvc-azurefile   Bound    pvc-5e5d9980-da38-492b-8581-17e3cad01770   200Gi      RWX            azurefile-csi   64m

$ kubectl exec -it nginx-azurefile -- df -h /mnt/azurefile
Filesystem                                                                                Size  Used Avail Use% Mounted on
//f149b5a219bd34caeb07de9.file.core.windows.net/pvc-5e5d9980-da38-492b-8581-17e3cad01770  200G  128K  200G   1% /mnt/azurefile
```

## Use a persistent volume with private Azure Files storage (private endpoint)

If your Azure Files resources are protected with a private endpoint, you must create your own storage class that's customized with the following parameters:

* `resourceGroup`: The resource group where the storage account is deployed.
* `storageAccount`: The storage account name.
* `server`: The FQDN of the storage account's private endpoint (for example, `<storage account name>.privatelink.file.core.windows.net`).

Create a file named *private-azure-file-sc.yaml*, and then paste the following example manifest in the file. Replace the values for `<resourceGroup>` and `<storageAccountName>`.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: private-azurefile-csi
provisioner: file.csi.azure.com
allowVolumeExpansion: true
parameters:
  resourceGroup: <resourceGroup>
  storageAccount: <storageAccountName>
  server: <storageAccountName>.privatelink.file.core.windows.net 
reclaimPolicy: Delete
volumeBindingMode: Immediate
mountOptions:
  - dir_mode=0777
  - file_mode=0777
  - uid=0
  - gid=0
  - mfsymlinks
  - cache=strict  # https://linux.die.net/man/8/mount.cifs
  - nosharesock  # reduce probability of reconnect race
  - actimeo=30  # reduce latency for metadata-heavy workload
```

Create the storage class by using the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f private-azure-file-sc.yaml

storageclass.storage.k8s.io/private-azurefile-csi created
```
  
Create a file named *private-pvc.yaml*, and then paste the following example manifest in the file:
  
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: private-azurefile-pvc
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: private-azurefile-csi
  resources:
    requests:
      storage: 100Gi
```
  
Create the PVC by using the [kubectl apply][kubectl-apply] command:
  
```console
kubectl apply -f private-pvc.yaml
```

## NFS file shares

[Azure Files supports the NFS v4.1 protocol](../storage/files/storage-files-how-to-create-nfs-shares.md). NFS 4.1 support for Azure Files provides you with a fully managed NFS file system as a service built on a highly available and highly durable distributed resilient storage platform.

 This option is optimized for random access workloads with in-place data updates and provides full POSIX file system support. This section shows you how to use NFS shares with the Azure File CSI driver on an AKS cluster.

### Create NFS file share storage class

Save a `nfs-sc.yaml` file with the manifest below editing the respective placeholders.

```yml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azurefile-csi-nfs
provisioner: file.csi.azure.com
parameters:
  protocol: nfs
```

After editing and saving the file, create the storage class with the [kubectl apply][kubectl-apply] command:

```console
$ kubectl apply -f nfs-sc.yaml

storageclass.storage.k8s.io/azurefile-csi-nfs created
```

### Create a deployment with an NFS-backed file share

You can deploy an example [stateful set](https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/deploy/example/nfs/statefulset.yaml) that saves timestamps into a file `data.txt` by deploying the following command with the [kubectl apply][kubectl-apply] command:

```console
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azurefile-csi-driver/master/deploy/example/nfs/statefulset.yaml

statefulset.apps/statefulset-azurefile created
```

Validate the contents of the volume by running:

```console
$ kubectl exec -it statefulset-azurefile-0 -- df -h

Filesystem      Size  Used Avail Use% Mounted on
...
/dev/sda1                                                                                 29G   11G   19G  37% /etc/hosts
accountname.file.core.windows.net:/accountname/pvc-fa72ec43-ae64-42e4-a8a2-556606f5da38  100G     0  100G   0% /mnt/azurefile
...
```

> [!NOTE]
> Note that since NFS file share is in Premium account, the minimum file share size is 100GB. If you create a PVC with a small storage size, you might encounter an error "failed to create file share ... size (5)...".

## Windows containers

The Azure Files CSI driver also supports Windows nodes and containers. If you want to use Windows containers, follow the [Windows containers tutorial](windows-container-cli.md) to add a Windows node pool.

After you have a Windows node pool, use the built-in storage classes like `azurefile-csi` or create custom ones. You can deploy an example [Windows-based stateful set](https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/deploy/example/windows/statefulset.yaml) that saves timestamps into a file `data.txt` by deploying the following command with the [kubectl apply][kubectl-apply] command:

```console
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azurefile-csi-driver/master/deploy/example/windows/statefulset.yaml

statefulset.apps/busybox-azurefile created
```

Validate the contents of the volume by running:

```console
$ kubectl exec -it busybox-azurefile-0 -- cat c:\\mnt\\azurefile\\data.txt # on Linux/MacOS Bash
$ kubectl exec -it busybox-azurefile-0 -- cat c:\mnt\azurefile\data.txt # on Windows Powershell/CMD

2020-08-27 22:11:01Z
2020-08-27 22:11:02Z
2020-08-27 22:11:04Z
(...)
```

## Next steps

- To learn how to use CSI drivers for Azure disks, see [Use Azure disks with CSI drivers](azure-disk-csi.md).
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service][operator-best-practices-storage].

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/
[smb-overview]: /windows/desktop/FileIO/microsoft-smb-protocol-and-cifs-protocol-overview

<!-- LINKS - internal -->
[azure-disk-volume]: azure-disk-volume.md
[azure-files-pvc]: azure-files-dynamic-pv.md
[premium-storage]: ../virtual-machines/disks-types.md
[az-disk-list]: /cli/azure/disk#az_disk_list
[az-snapshot-create]: /cli/azure/snapshot#az_snapshot_create
[az-disk-create]: /cli/azure/disk#az_disk_create
[az-disk-show]: /cli/azure/disk#az_disk_show
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[storage-class-concepts]: concepts-storage.md#storage-classes
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[node-resource-group]: faq.md#why-are-two-resource-groups-created-with-aks
[storage-skus]: ../storage/common/storage-redundancy.md
