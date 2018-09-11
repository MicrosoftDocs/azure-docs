---
title: Azure CycleCloud Network File System Options | Microsoft Docs
description: Attach and manage simple network file systems within Azure CycleCloud.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Configure NFS Mounts and Exports

Azure CycleCloud provides built-in support for exporting, mounting, and configuring simple Network File System.

## Create an NFS Export

To export a directory from a node as a shared NFS filesystem, provide a mount configuration section with `type=nfs` and an export path:

``` ini
[[[configuration cyclecloud.exports.nfs_data]]]
type = nfs
export_path = /mnt/exports/nfs_data
```

The above configuration `cyclecloud.exports.nfs_data` specifies that you are configuring directory `/mnt/exports/nfs_data` to be exported as an NFS filesystem named `nfs_data`. The attributes within the configuration section describe the exported filesystem properties.

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
[[[configuration cyclecloud.mounts.shared]]]
disabled = true
```

## Export Configuration Options

| Option       | Definition                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type         | *REQUIRED* The type attribute must be set to `nfs` for all NFS exports to differentiate from other shared filesystem types. |
| export_path  | The local path to export as an NFS filesystem.  If the directory does not exist already, it will be created.                                            |
| owner        | The user account that should own the exported directory.                                                                                                |
| group        | The group of the user that should own the exported directory.                                                                                           |
| mode         | The default filesystem permissions on the exported directory.                                                                                           |
| network      | The network interface on which the directory is exported.  Defaults to all: `*`.                                                                        |
| sync         | Synchronous/asynchronous export option.  Defaults to `true`.                                                                                            |
| writable     | The ro/rw export option for the filesystem. Defaults to `true`.                                                                                         |
| options      | Any non-default options to use when exporting the filesystem.                                                                                           |

## Mount Configuration Options

| Option        | Definition                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type          | *REQUIRED* The type attribute must be set to `nfs` for all NFS exports to differentiate from volume mounts and other shared filesystem types.                  |
| export_path   | The location of the export on the NFS filer.  If an export_path is not specified, the  mountpoint of the mount will be used as the export_path.                |
| mountpoint    | The location where the filesystem will be mounted after any additional configuration is applied.  If the directory does not already exist, it will be created. |
| cluster_name  | The name of the CycleCloud cluster which exports the filesystem.  If not set, the node's local cluster is assumed.                                             |
| address       | The explicit hostname or IP address of the filesystem.  If not set, search will attempt to find the filesystem in a CycleCloud cluster.                        |
| options       | Any non-default options to use when mounting the filesystem.                                                                                                   |
| disabled      | If set to `true`, the node will not mount the filesystem.                                                                                                      || Option
