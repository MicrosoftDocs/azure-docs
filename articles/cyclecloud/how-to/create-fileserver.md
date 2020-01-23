---
title: Create FileServer
description: How to create a simple network file server that can be used in CycleCloud
author: mvrequa
ms.date: 01/20/2020
ms.author: adjohnso
---

# Configuring a NFS server and file share

By assimilating two topics, disks and nfs exports, we can define a nfs file share within 
a Cyclecloud cluster template. The local filesystem is defined by volumes and mounts. The
NFS service is defined by exports. By these configs we have very fine control over the properties
of the filesystem.

Consider the following example which pulls these topics together in a single node file share.

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
The _configuration_ section are automation parameters interpreted by the node
when it starts. These instructions are necessary to invoke the nfs configuration.

This example defines two SSD volumes, or Azure Premium Disks, which
will be mounted in a RAID 0 configuration to the mount point _/data_. 
All this is done with the two _volume_ sections and the 
_cyclecloud.mounts_ section.

The _exports_ section then specifies which director to export. 
Since the _export_path_ falls under the RAID volume, data written to
this export will be handled by the RAID volume.

Using local disks for a file share is not supported. The _volume_ section 
refers to Azure Disk Storage.