---
title: Azure CycleCloud Storage Options | Microsoft Docs
description: Attach and manage storage options within Azure CycleCloud.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Storage

CycleCloud supports automatically attaching volumes (disks) to your nodes for additional storage space. To create a 100GB volume, add the following to your `[[node]]` element in your cluster template:

``` ini
[[[volume example-vol]]]
Size = 100
```

This volume will be created when the instance is started, and deleted when the instance is terminated.
If you want to preserve the data on the volume even after the instance is terminated, make it a **persistent** volume:

``` ini
[[[volume example-vol]]]
Size = 100
Persistent = true
```

This volume will be created the first time the instance is started, but will not be deleted when the instance is terminated. Instead, it will be kept and re-attached to the instance the next time the node is started. Persistent volumes are not deleted until the cluster is deleted.

To use Premium Storage for the disk (or the equivalent cloud provider SSD storage), use `SSD = true`:

``` ini
[[[volume example-vol]]]
Size = 100
Persistent = true
SSD = true
```

> [!NOTE]
Azure SSD will round up to the next size for [pricing](https://azure.microsoft.com/en-us/pricing/details/managed-disks). For example, if you create a disk size of 100GB, you will be charged at the 128GB rate.

> [!WARNING]
> When your cluster is deleted, all persistent volumes are deleted as well! If you want your storage to persist longer than your cluster, you must attach a preexisting volume by id.

For Linux-based operating systems, you can control what device to attach the volume to, using the `Device` attribute:

``` ini
[[[volume example-vol]]]
Size = 100
Device = /dev/sdk
```

If you do not specify a device, CycleCloud will automatically pick a device that is not in use.
The specific device chosen depends on the cloud provider configuration and the image.
