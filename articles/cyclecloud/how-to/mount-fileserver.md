---
title: Network File System Options
description: Learn to mount and configure a simple network file system (NFS) within Azure CycleCloud. Also learn about default shares and how to disable an NFS mount.
author: KimliW
ms.date: 02/21/2020
ms.author: adjohnso
---

# Configure NFS Mounts

Azure CycleCloud provides built-in support for mounting a simple Network File System (NFS).
The NFS can be another resource managed by CycleCloud or an external resource.

::: moniker range=">=cyclecloud-8"
## Default Templates - Network Attached Storage Settings

The default cluster templates for each scheduler includes a section for configuring NFS options when creating a clsuter.

![New Cluster Network Attached Storage Settings screen](../images/version-8/quickstart-networkattachedstorage-settings.png)

The `/shared/` directory for each cluster is an NFS share by default. The `NFS Type` dropdown in this configuration section provides options for this NFS share to be either exported from the cluster headnode (the `Builtin` option), or mounted from an NFS server. 

If `Builtin` is selected, the NFS share is created on a Azure Managed Disk([Standard SSD](/azure/virtual-machines/disks-types#standard-ssd)) mounted onto the headnode of the cluster, and the `Size` option specifies the size of the  provisioned disk.

Alternatively, if the `External NFS` option is specified, additional fields appear for specifying the IP address (or hostname) of the NFS server, as well as other NFS mount options. This `External NFS` option can be used to mount endpoints such as [NFS on Azure Files Storage](/azure/storage/files/storage-files-quick-create-use-linux), [Azure HPC Cache](/azure/hpc-cache/hpc-cache-overview), [Azure NetApp Files](/azure/azure-netapp-files/azure-netapp-files-introduction), or [NFS on Azure Blob Storage](/azure/storage/blobs/network-file-system-protocol-support).

![Mount an external NFS to /shared](../images/external-nfs-options.png)

If another NFS mount point is required, for example as a `/data` resource for all users, selecting the `Add NFS Mount` option brings up additional fields add another mount.

![Add an another NFS mountpoint](../images/additional-nfs-options.png)
::: moniker-end

## Mount an NFS Filesystem

To mount an existing NFS filesystem:

``` ini
[[[configuration cyclecloud.mounts.nfs_data]]]
type = nfs
mountpoint = /mnt/exports/nfs_data
export_path = /mnt/exports/data
```

The `export_path` is the path on the server, and the `mountpoint` is the path to mount the share on the client. The mounted NFS filesystem may be exported from a node in the same CycleCloud cluster, exported from a node in another CycleCloud cluster, or a separate NFS filesystem that allows simple mounts. If the filesystem is exported from a node in the local cluster, then CycleCloud will use search to discover the address automatically. If the filesystem is exported from a different CycleCloud cluster, then the mount configuration may specify attribute `cluster_name` to instruct CycleCloud to search the cluster with that name:

``` ini
[[[configuration cyclecloud.mounts.other_cluster_fs]]]
type = nfs
mountpoint = /mnt/exports/other_cluster_fs
export_path = /mnt/exports/data
cluster_name = filesystem_cluster
```

To specify the location of the filesystem explicitly (required for mounting non-CycleCloud filesystems), the mount configuration may specify the attribute `address` with the hostname or IP of the filesystem:

``` ini
[[[configuration cyclecloud.mounts.external_filer]]]
type = nfs
mountpoint = /mnt/exports/external_filer
address = 54.83.20.2
```

## Default Shares

By default, most CycleCloud cluster types include at least one shared drive mounted at _/shared_ and _/mnt/exports/shared_. For clusters that need a simple shared filesystem, this mount is often sufficient.

Many cluster types also include a second NFS mount at _/sched_ and _/mnt/exports/sched_ which is reserved for use by the chosen scheduler. In general, this mount should not be accessed by applications.

The mount configurations for the default shares reserve filesystem names `cyclecloud.mounts.shared` and `cyclecloud.mounts.sched`. Modifying the default configurations for these shares is possible, but may result in unexpected behavior since many cluster types rely on the default mounts.

## Disabling NFS Mounts

Azure CycleCloud NFS mounts may be disabled by setting the `disabled` attribute to true. The default shares may also be disabled this way:

``` ini
[[[configuration]]]
    cyclecloud.mounts.sched.disabled = true
    cyclecloud.mounts.shared.disabled = true
    cshared.server.legacy_links_disabled = true
```

Many clusters assume a shared storage device to be available cluster-wide at _/shared_. Therefore if you use these configurations
enable a fileserver and mount it on each cluster node with:

``` ini
[[[configuration cyclecloud.mounts.external_shared]]]
    type = nfs
    mountpoint = /shared
    export_path = /mnt/raid/export
    address = 54.83.20.2
```

## Mount Configuration Options

| Option | Definition |
| ------ | ---------- |
| type          | *REQUIRED* The type attribute must be set to `nfs` for all NFS exports to differentiate from volume mounts and other shared filesystem types.   |
| export_path   | The location of the export on the NFS filer.  If an export_path is not specified, the  mountpoint of the mount will be used as the export_path.  |
| mountpoint    | The location where the filesystem will be mounted after any additional configuration is applied.  If the directory does not already exist, it will be created. |
| cluster_name  | The name of the CycleCloud cluster which exports the filesystem.  If not set, the node's local cluster is assumed.   |
| address       | The explicit hostname or IP address of the filesystem.  If not set, search will attempt to find the filesystem in a CycleCloud cluster. |
| options       | Any non-default options to use when mounting the filesystem.    |
| disabled      | If set to `true`, the node will not mount the filesystem.  |

> [!NOTE]
> Changing the hostname scheme is not supported for most schedulers.

## Further Reading

* [How to Mount a Disk](./mount-disk.md)
* [How to Create a File Share and File Server](./create-fileserver.md)
