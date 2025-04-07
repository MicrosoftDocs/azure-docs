---
title: Create a simple NFS and file share
description: How to create a simple network file server that can be used in CycleCloud
author: mvrequa
ms.date: 01/20/2020
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

The above configuration `cyclecloud.exports.nfs_data` specifies that you are configuring directory `/mnt/exports/nfs_data` to be exported as an NFS filesystem named `nfs_data`. The attributes within the configuration section describe the exported filesystem properties.

Note that you can only have one fileserver per cluster otherwise the discovery mechanisms will interfere.

## Creating exports

NFS exports can also be configured in a cluster template. A node can have an arbitrary number of exports but only one node in
a cluster may be a fileserver. In the example below we show configs to add to a node to disable the default nfs exports and add
a new export named _backup_. This export will then be available to other nodes via the mount configurations in this page.

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

Most HPC workflows will mount a network file system (NFS) to nodes that can be used for shared application data and job results. A file server node can be defined in a CycleCloud cluster template. The template configs provide very fine control over the file system properties. The local filesystem is defined by `volumes` and `mounts` and the NFS service is defined by `exports`. 

The following example pulls these topics together in a single node file share.

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

The `configuration` section contains automation parameters interpreted by the node when it starts. These instructions are necessary to invoke the NFS configuration.

This example defines two SSD volumes, or Azure Premium Disks, which will be mounted in a RAID 0 configuration to the mount point _/data_. 
The two `volume` sections define the volumes while the `cyclecloud.mounts` section defines how the volumes are mounted.

The `exports` section then specifies which directory to export. Since the `export_path` falls under the RAID volume, data written to this export will be handled by the RAID volume.

> [!NOTE]
> Using local disks for a file share is not supported. The `volume` section refers to Azure Disk Storage.

## Export Configuration Options

| Option | Definition |
| ------ | ---------- |
| type         | *REQUIRED* The type attribute must be set to `nfs` for all NFS exports to differentiate from other shared filesystem types. |
| export_path  | The local path to export as an NFS filesystem.  If the directory does not exist already, it will be created. |
| owner        | The user account that should own the exported directory.  |
| group        | The group of the user that should own the exported directory. |
| mode         | The default filesystem permissions on the exported directory.  |
| network      | The network interface on which the directory is exported.  Defaults to all: `*`.  |
| sync         | Synchronous/asynchronous export option.  Defaults to `true`.   |
| writable     | The ro/rw export option for the filesystem. Defaults to `true`.  |
| options      | Any non-default options to use when exporting the filesystem.   |

## Further Reading

* [How to Mount a Disk](./mount-disk.md)
* [How to Mount a File Server](./mount-fileserver.md)