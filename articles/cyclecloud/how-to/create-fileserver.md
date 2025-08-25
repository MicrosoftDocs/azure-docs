---
title: Create a simple NFS and file share
description: How to create a simple network file server that can be used in CycleCloud
author: mvrequa
ms.date: 07/01/2025
ms.author: adjohnso
---

# Configure NFS Exports

Azure CycleCloud provides built-in support for exporting a simple Network File System.

## Create an NFS Export

To export a directory from a node as a shared NFS filesystem, provide a mount configuration section with `type=nfs` and an export path:

``` ini
[[[configuration cyclecloud.exports.nfs_data]]]
type = nfs
export_path = /mnt/exports/nfs_data
```

The preceding configuration `cyclecloud.exports.nfs_data` specifies that you're configuring directory `/mnt/exports/nfs_data` to be exported as an NFS filesystem named `nfs_data`. The attributes within the configuration section describe the exported filesystem properties.

You can only have one file server per cluster. Otherwise, the discovery mechanisms interfere.

## Creating exports

You can also configure NFS exports in a cluster template. A node can have any number of exports, but only one node in a cluster can be the file server. The following example shows configurations to add to a node to disable the default NFS exports and add a new export named **backup**. Other nodes can access this export through the mount configurations described in this article.

``` ini
        [[[configuration]]]
        run_list = recipe[cshared::directories],recipe[cshared::server]
        cyclecloud.discoverable = true
        cshared.server.shared_dir = /shared
        cyclecloud.mounts.sched.disabled = true
        cyclecloud.mounts.shared.disabled = true
        cshared.server.legacy_links_disabled = true

        [[[configuration cyclecloud.exports.backup]]]
        type = nfs
        export_path = /mnt/raid/backup
        options = no_root_squash
        samba.enabled = false
```

## Configuring an NFS server and file share

Most HPC workflows mount a network file system (NFS) to nodes that you can use for shared application data and job results. You can define a file server node in a CycleCloud cluster template. You can set file system properties through the template configs. You define the local filesystem by using `volumes` and `mounts`, and you define the NFS service by using `exports`. 

The following example brings these topics together in a single node file share.

```ini
    [[node fileserver]]
        Credentials = my-creds
        Region = northeurope
        MachineType = Standard_D16s_v3
        KeypairLocation = ~/.ssh/cyclecloud.pem
        SubnetId = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1

        [[[configuration]]]
        run_list = recipe[cshared::server]
        cyclecloud.discoverable = true
        cyclecloud.mounts.sched.disabled = true
        cyclecloud.mounts.shared.disabled = true
        cshared.server.legacy_links_disabled = true

        [[[volume v00]]]
        SSD = true
        Size = $VolumeSize
        Mount = all

        [[[volume v01]]]
        SSD = true
        Size = $VolumeSize
        Mount = all

        [[[configuration cyclecloud.mounts.all]]]
        fs_type = ext4
        raid_level = 0
        options = noatime,nodiratime,nobarrier,nofail
        mointpoint = /data

        [[[configuration cyclecloud.exports.nfs_data]]]
        type = nfs
        export_path = /data/export

[parameters NFS]
    [[parameter VolumeSize]]
    DefaultValue = 1024
```

The `configuration` section contains automation parameters that the node interprets when it starts. These instructions are necessary to invoke the NFS configuration.

This example defines two SSD volumes, or Azure Premium Disks, which you mount in a RAID 0 configuration to the mount point _/data_. 
The two `volume` sections define the volumes while the `cyclecloud.mounts` section defines how you mount the volumes.

The `exports` section specifies which directory to export. Because the `export_path` is under the RAID volume, the RAID volume handles data written to this export.

> [!NOTE]
> You can't use local disks for a file share. The `volume` section refers to Azure Disk Storage.

## Export configuration options

| Option | Definition |
| ------ | ---------- |
| type         | *REQUIRED* Set the type attribute to `nfs` for all NFS exports to differentiate from other shared filesystem types. |
| export_path  | Set the local path to export as an NFS filesystem. If the directory doesn't exist, the process creates it. |
| owner        | Set the user account that owns the exported directory.  |
| group        | Set the group of the user that owns the exported directory. |
| mode         | Set the default filesystem permissions on the exported directory.  |
| network      | Set the network interface on which the directory is exported. Defaults to all: `*`.  |
| sync         | Set the synchronous/asynchronous export option. Defaults to `true`.   |
| writable     | Set the ro/rw export option for the filesystem. Defaults to `true`.  |
| options      | Any non-default options to use when exporting the filesystem.   |

## Further Reading

* [How to Mount a Disk](./mount-disk.md)
* [How to Mount a File Server](./mount-fileserver.md)