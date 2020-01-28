---
title: Create a simple NFS and file share
description: How to create a simple network file server that can be used in CycleCloud
author: mvrequa
ms.date: 01/20/2020
ms.author: adjohnso
---

# Configuring an NFS server and file share

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

## Further Reading

* [How to Mount a Disk](./mount-disk.md)
* [How to Mount a File Server](./mount-fileserver.md)