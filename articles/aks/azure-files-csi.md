---
title: Use Container Storage Interface (CSI) driver for Azure Files on Azure Kubernetes Service (AKS)
description: Learn how to use the Container Storage Interface (CSI) driver for Azure Files in an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.date: 01/18/2023
---

# Use Azure Files Container Storage Interface (CSI) driver in Azure Kubernetes Service (AKS)

The Azure Files Container Storage Interface (CSI) driver is a [CSI specification][csi-specification]-compliant driver used by Azure Kubernetes Service (AKS) to manage the lifecycle of Azure file shares. The CSI is a standard for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes.

By adopting and using CSI, AKS now can write, deploy, and iterate plug-ins to expose new or improve existing storage systems in Kubernetes. Using CSI drivers in AKS avoids having to touch the core Kubernetes code and wait for its release cycles.

To create an AKS cluster with CSI drivers support, see [Enable CSI drivers on AKS][csi-drivers-overview].

> [!NOTE]
> *In-tree drivers* refers to the current storage drivers that are part of the core Kubernetes code versus the new CSI drivers, which are plug-ins.

## Azure Files CSI driver new features

In addition to the original in-tree driver features, Azure Files CSI driver supports the following new features:

- Network File System (NFS) version 4.1
- [Private endpoint][private-endpoint-overview]
- Creating large mount of file shares in parallel.

## Storage class driver dynamic parameters

|Name | Meaning | Available Value | Mandatory | Default value
|--- | --- | --- | --- | ---
|skuName | Azure Files storage account type (alias: `storageAccountType`)| `Standard_LRS`, `Standard_ZRS`, `Standard_GRS`, `Standard_RAGRS`, `Standard_RAGZRS`,`Premium_LRS`, `Premium_ZRS` | No | `StandardSSD_LRS`<br> Minimum file share size for Premium account type is 100 GiB.<br> ZRS account type is supported in limited regions.<br> NFS file share only supports Premium account type.|
|location | Specify Azure region where Azure storage account will be created. | For example, `eastus`. | No | If empty, driver uses the same location name as current AKS cluster.|
|resourceGroup | Specify the resource group where the Azure Disks will be created. | Existing resource group name | No | If empty, driver uses the same resource group name as current AKS cluster.|
|shareName | Specify Azure file share name | Existing or new Azure file share name. | No | If empty, driver generates an Azure file share name. |
|shareNamePrefix | Specify Azure file share name prefix created by driver. | Share name can only contain lowercase letters, numbers, hyphens, and length should be fewer than 21 characters. | No |
|folderName | Specify folder name in Azure file share. | Existing folder name in Azure file share. | No | If folder name does not exist in file share, mount will fail. |
|shareAccessTier | [Access tier for file share][storage-tiers] | General purpose v2 account can choose between `TransactionOptimized` (default), `Hot`, and `Cool`. Premium storage account type for file shares only. | No | Empty. Use default setting for different storage account types.|
|server | Specify Azure storage account server address | Existing server address, for example `accountname.privatelink.file.core.windows.net`. | No | If empty, driver uses default `accountname.file.core.windows.net` or other sovereign cloud account address. |
|disableDeleteRetentionPolicy | Specify whether disable DeleteRetentionPolicy for storage account created by driver. | `true` or `false` | No | `false` |
|allowBlobPublicAccess | Allow or disallow public access to all blobs or containers for storage account created by driver. | `true` or `false` | No | `false` |
|requireInfraEncryption | Specify whether or not the service applies a secondary layer of encryption with platform managed keys for data at rest for storage account created by driver. | `true` or `false` | No | `false` |
|networkEndpointType | Specify network endpoint type for the storage account created by driver. If `privateEndpoint` is specified, a private endpoint will be created for the storage account. For other cases, a service endpoint will be created by default. | "",`privateEndpoint`| No | "" |
|storageEndpointSuffix | Specify Azure storage endpoint suffix. | `core.windows.net`, `core.chinacloudapi.cn`, etc. | No | If empty, driver uses default storage endpoint suffix according to cloud environment. For example, `core.windows.net`. |
|tags | [tags][tag-resources] are created in new storage account. | Tag format: 'foo=aaa,bar=bbb' | No | "" |
|matchTags | Match tags when driver tries to find a suitable storage account. | `true` or `false` | No | `false` |
|--- | **Following parameters are only for SMB protocol** | --- | --- |
|subscriptionID | Specify Azure subscription ID where Azure file share is created. | Azure subscription ID | No | If not empty, `resourceGroup` must be provided. |
|storeAccountKey | Specify whether to store account key to Kubernetes secret. | `true` or `false`<br>`false` means driver leverages kubelet identity to get account key. | No | `true` |
|secretName | Specify secret name to store account key. | | No |
|secretNamespace | Specify the namespace of secret to store account key. <br><br> **Note:** <br> If `secretNamespace` isn't specified, the secret is created in the same namespace as the pod. | `default`,`kube-system`, etc | No | Pvc namespace, for example `csi.storage.k8s.io/pvc/namespace` |
|useDataPlaneAPI | Specify whether to use [data plane API][data-plane-api] for file share create/delete/resize. This could solve the SRP API throttling issue because the data plane API has almost no limit, while it would fail when there is firewall or Vnet setting on storage account. | `true` or `false` | No | `false` |
|--- | **Following parameters are only for NFS protocol** | --- | --- |
|rootSquashType | Specify root squashing behavior on the share. The default is `NoRootSquash` | `AllSquash`, `NoRootSquash`, `RootSquash` | No |
|mountPermissions | Mounted folder permissions. The default is `0777`. If set to `0`, driver doesn't perform `chmod` after mount | `0777` | No |
|--- | **Following parameters are only for vnet setting, e.g. NFS, private endpoint** | --- | --- |
|vnetResourceGroup | Specify Vnet resource group where virtual network is defined. | Existing resource group name. | No | If empty, driver uses the `vnetResourceGroup` value in Azure cloud config file. |
|vnetName | Virtual network name | Existing virtual network name. | No | If empty, driver uses the `vnetName` value in Azure cloud config file. |
|subnetName | Subnet name | Existing subnet name of the agent node. | No | If empty, driver uses the `subnetName` value in Azure cloud config file. |
|fsGroupChangePolicy | Indicates how volume's ownership is changed by the driver. Pod `securityContext.fsGroupChangePolicy` is ignored. | `OnRootMismatch` (default), `Always`, `None` | No | `OnRootMismatch`|

## Use a persistent volume with Azure Files

A [persistent volume (PV)][persistent-volume] represents a piece of storage that's provisioned for use with Kubernetes pods. A PV can be used by one or many pods and can be dynamically or statically provisioned. If multiple pods need concurrent access to the same storage volume, you can use Azure Files to connect by using the [Server Message Block (SMB)][smb-overview] or [NFS protocol][nfs-overview]. This article shows you how to dynamically create an Azure Files share for use by multiple pods in an AKS cluster. For static provisioning, see [Manually create and use a volume with an Azure Files share][statically-provision-a-volume].

With Azure Files shares, there is no limit as to how many can be mounted on a node.

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Dynamically create Azure Files PVs by using the built-in storage classes

A storage class is used to define how an Azure file share is created. A storage account is automatically created in the [node resource group][node-resource-group] for use with the storage class to hold the Azure Files shares. Choose one of the following [Azure storage redundancy SKUs][storage-skus] for *skuName*:

* **Standard_LRS**: Standard locally redundant storage
* **Standard_GRS**: Standard geo-redundant storage
* **Standard_ZRS**: Standard zone-redundant storage
* **Standard_RAGRS**: Standard read-access geo-redundant storage
* **Standard_RAGZRS**: Standard read-access geo-zone-redundant storage
* **Premium_LRS**: Premium locally redundant storage
* **Premium_ZRS**: Premium zone-redundant storage

> [!NOTE]
> Azure Files supports Azure Premium Storage. The minimum premium file share capacity is 100 GiB.

When you use storage CSI drivers on AKS, there are two more built-in `StorageClasses` that uses the Azure Files CSI storage drivers. The other CSI storage classes are created with the cluster alongside the in-tree default storage classes.

- `azurefile-csi`: Uses Azure Standard Storage to create an Azure Files share.
- `azurefile-csi-premium`: Uses Azure Premium Storage to create an Azure Files share.

The reclaim policy on both storage classes ensures that the underlying Azure Files share is deleted when the respective PV is deleted. The storage classes also configure the file shares to be expandable, you just need to edit the [persistent volume claim][persistent-volume-claim-overview] (PVC) with the new size.

To use these storage classes, create a PVC and respective pod that references and uses them. A PVC is used to automatically provision storage based on a storage class. A PVC can use one of the pre-created storage classes or a user-defined storage class to create an Azure Files share for the desired SKU and size. When you create a pod definition, the PVC is specified to request the desired storage.

Create an [example PVC and pod that prints the current date into an `outfile`](https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/deploy/example/statefulset.yaml) by running the [kubectl apply][kubectl-apply] commands:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azurefile-csi-driver/master/deploy/example/pvc-azurefile-csi.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azurefile-csi-driver/master/deploy/example/nginx-pod-azurefile.yaml
```

The output of the command resembles the following example:

```bash
persistentvolumeclaim/pvc-azurefile created
pod/nginx-azurefile created
```

After the pod is in the running state, you can validate that the file share is correctly mounted by running the following command and verifying the output contains the `outfile`:

```bash
kubectl exec nginx-azurefile -- ls -l /mnt/azurefile
```

The output of the command resembles the following example:

```bash
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

Create the storage class by running the [kubectl apply][kubectl-apply] command:

```bash
kubectl apply -f azure-file-sc.yaml
```

The output of the command resembles the following example:

```bash
storageclass.storage.k8s.io/my-azurefile created
```

The Azure Files CSI driver supports creating [snapshots of persistent volumes](https://kubernetes-csi.github.io/docs/snapshot-restore-feature.html) and the underlying file shares.

> [!NOTE]
> This driver only supports snapshot creation, restore from snapshot is not supported by this driver. Snapshots can be restored from Azure portal or CLI. For more information about creating and restoring a snapshot, see [Overview of share snapshots for Azure Files][share-snapshots-overview].

Create a [volume snapshot class](https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/deploy/example/snapshot/volumesnapshotclass-azurefile.yaml) with the [kubectl apply][kubectl-apply] command:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azurefile-csi-driver/master/deploy/example/snapshot/volumesnapshotclass-azurefile.yaml
```

The output of the command resembles the following example:

```bash
volumesnapshotclass.snapshot.storage.k8s.io/csi-azurefile-vsc created
```

Create a [volume snapshot](https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/deploy/example/snapshot/volumesnapshot-azurefile.yaml) from the PVC [we dynamically created at the beginning of this tutorial](#dynamically-create-azure-files-pvs-by-using-the-built-in-storage-classes), `pvc-azurefile`.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azurefile-csi-driver/master/deploy/example/snapshot/volumesnapshot-azurefile.yaml
```

The output of the command resembles the following example:

```bash
volumesnapshot.snapshot.storage.k8s.io/azurefile-volume-snapshot created
```

Verify the snapshot was created correctly by running the following command:

```bash
kubectl describe volumesnapshot azurefile-volume-snapshot
```

The output of the command resembles the following example:

```bash
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

In AKS, the built-in `azurefile-csi` storage class already supports expansion, so use the [PVC created earlier with this storage class](#dynamically-create-azure-files-pvs-by-using-the-built-in-storage-classes). The PVC requested a 100 GiB file share. We can confirm that by running:

```bash
kubectl exec -it nginx-azurefile -- df -h /mnt/azurefile
```

The output of the command resembles the following example:

```bash
Filesystem                                                                                Size  Used Avail Use% Mounted on
//f149b5a219bd34caeb07de9.file.core.windows.net/pvc-5e5d9980-da38-492b-8581-17e3cad01770  100G  128K  100G   1% /mnt/azurefile
```

Expand the PVC by increasing the `spec.resources.requests.storage` field:

```bash
kubectl patch pvc pvc-azurefile --type merge --patch '{"spec": {"resources": {"requests": {"storage": "200Gi"}}}}'
```

The output of the command resembles the following example:

```bash
persistentvolumeclaim/pvc-azurefile patched
```

Verify that both the PVC and the file system inside the pod show the new size:

```bash
kubectl get pvc pvc-azurefile
NAME            STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS    AGE
pvc-azurefile   Bound    pvc-5e5d9980-da38-492b-8581-17e3cad01770   200Gi      RWX            azurefile-csi   64m

kubectl exec -it nginx-azurefile -- df -h /mnt/azurefile
Filesystem                                                                                Size  Used Avail Use% Mounted on
//f149b5a219bd34caeb07de9.file.core.windows.net/pvc-5e5d9980-da38-492b-8581-17e3cad01770  200G  128K  200G   1% /mnt/azurefile
```

## Use a persistent volume with private Azure Files storage (private endpoint)

If your Azure Files resources are protected with a private endpoint, you must create your own storage class that's customized with the following parameters:

* `resourceGroup`: The resource group where the storage account is deployed.
* `storageAccount`: The storage account name.
* `server`: The FQDN of the storage account's private endpoint (for example, `<storage account name>.privatelink.file.core.windows.net`).

Create a file named `private-azure-file-sc.yaml`, and then paste the following example manifest in the file. Replace the values for `<resourceGroup>` and `<storageAccountName>`.

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
```

The output of the command resembles the following example:

```bash
storageclass.storage.k8s.io/private-azurefile-csi created
```
  
Create a file named `private-pvc.yaml`, and then paste the following example manifest in the file:
  
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

[Azure Files supports the NFS v4.1 protocol](../storage/files/storage-files-how-to-create-nfs-shares.md). NFS version 4.1 support for Azure Files provides you with a fully managed NFS file system as a service built on a highly available and highly durable distributed resilient storage platform.

This option is optimized for random access workloads with in-place data updates and provides full POSIX file system support. This section shows you how to use NFS shares with the Azure File CSI driver on an AKS cluster.

### Prerequisites

- Your AKS cluster *Control plane* identity (that is, your AKS cluster name) is added to the [Contributor](../role-based-access-control/built-in-roles.md#contributor) role on the VNet and NetworkSecurityGroup.
- Your AKS cluster's service principal or managed service identity (MSI) must be added to the Contributor role to the storage account.

> [!NOTE]
> You can use a private endpoint instead of allowing access to the selected VNet.

### Create NFS file share storage class

Create a file named `nfs-sc.yaml` and copy the manifest below.

```yml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azurefile-csi-nfs
provisioner: file.csi.azure.com
allowVolumeExpansion: true
parameters:
  protocol: nfs
```

After editing and saving the file, create the storage class with the [kubectl apply][kubectl-apply] command:

```bash
kubectl apply -f nfs-sc.yaml
```

The output of the command resembles the following example:

```bash
storageclass.storage.k8s.io/azurefile-csi-nfs created
```

### Create a deployment with an NFS-backed file share

You can deploy an example **stateful set** that saves timestamps into a file `data.txt` with the [kubectl apply][kubectl-apply] command:

```bash
kubectl apply -f

apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: statefulset-azurefile
  labels:
    app: nginx
spec:
  podManagementPolicy: Parallel  # default is OrderedReady
  serviceName: statefulset-azurefile
  replicas: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
        - name: statefulset-azurefile
          image: mcr.microsoft.com/oss/nginx/nginx:1.19.5
          command:
            - "/bin/bash"
            - "-c"
            - set -euo pipefail; while true; do echo $(date) >> /mnt/azurefile/outfile; sleep 1; done
          volumeMounts:
            - name: persistent-storage
              mountPath: /mnt/azurefile
  updateStrategy:
    type: RollingUpdate
  selector:
    matchLabels:
      app: nginx
  volumeClaimTemplates:
    - metadata:
        name: persistent-storage
        annotations:
          volume.beta.kubernetes.io/storage-class: azurefile-csi-nfs
      spec:
        accessModes: ["ReadWriteMany"]
        resources:
          requests:
            storage: 100Gi
```

The output of the command resembles the following example:

```bash
statefulset.apps/statefulset-azurefile created
```

Validate the contents of the volume by running the following command:

```bash
kubectl exec -it statefulset-azurefile-0 -- df -h
```

The output of the command resembles the following example:

```bash
Filesystem      Size  Used Avail Use% Mounted on
...
/dev/sda1                                                                                 29G   11G   19G  37% /etc/hosts
accountname.file.core.windows.net:/accountname/pvc-fa72ec43-ae64-42e4-a8a2-556606f5da38  100G     0  100G   0% /mnt/azurefile
...
```

> [!NOTE]
> Note that because the NFS file share is in a Premium account, the minimum file share size is 100 GiB. If you create a PVC with a small storage size, you might encounter an error similar to the following: *failed to create file share ... size (5)...*.

## Windows containers

The Azure Files CSI driver also supports Windows nodes and containers. To use Windows containers, follow the [Windows containers quickstart](./learn/quick-windows-container-deploy-cli.md) to add a Windows node pool.

After you have a Windows node pool, use the built-in storage classes like `azurefile-csi` or create a custom one. You can deploy an example [Windows-based stateful set](https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/deploy/example/windows/statefulset.yaml) that saves timestamps into a file `data.txt` by running the [kubectl apply][kubectl-apply] command:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/azurefile-csi-driver/master/deploy/example/windows/statefulset.yaml
```

The output of the command resembles the following example:

```bash
statefulset.apps/busybox-azurefile created
```

Validate the contents of the volume by running the following [kubectl exec][kubectl-exec] command:

```bash
kubectl exec -it busybox-azurefile-0 -- cat c:\\mnt\\azurefile\\data.txt # on Linux/MacOS Bash
kubectl exec -it busybox-azurefile-0 -- cat c:\mnt\azurefile\data.txt # on Windows Powershell/CMD
```

The output of the commands resembles the following example:

```bash
2020-08-27 22:11:01Z
2020-08-27 22:11:02Z
2020-08-27 22:11:04Z
(...)
```

## Next steps

- To learn how to use CSI driver for Azure Disks, see [Use Azure Disks with CSI driver][azure-disk-csi].
- To learn how to use CSI driver for Azure Blob storage, see [Use Azure Blob storage with CSI driver][azure-blob-csi].
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service][operator-best-practices-storage].

<!-- LINKS - external -->
[smb-overview]: /windows/desktop/FileIO/microsoft-smb-protocol-and-cifs-protocol-overview
[nfs-overview]:/windows-server/storage/nfs/nfs-overview
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec
[csi-specification]: https://github.com/container-storage-interface/spec/blob/master/spec.md
[data-plane-api]: https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azcore/internal/shared/shared.go

<!-- LINKS - internal -->
[csi-drivers-overview]: csi-storage-drivers.md
[azure-disk-csi]: azure-disk-csi.md
[azure-blob-csi]: azure-blob-csi.md
[persistent-volume-claim-overview]: concepts-storage.md#persistent-volume-claims
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[node-resource-group]: faq.md#why-are-two-resource-groups-created-with-aks
[storage-skus]: ../storage/common/storage-redundancy.md
[storage-tiers]: ../storage/files/storage-files-planning.md#storage-tiers
[private-endpoint-overview]: ../private-link/private-endpoint-overview.md
[persistent-volume]: concepts-storage.md#persistent-volumes
[share-snapshots-overview]: ../storage/files/storage-snapshots-files.md
[access-tiers-overview]: ../storage/blobs/access-tiers-overview.md
[tag-resources]: ../azure-resource-manager/management/tag-resources.md
[statically-provision-a-volume]: azure-csi-files-storage-provision.md#statically-provision-a-volume
