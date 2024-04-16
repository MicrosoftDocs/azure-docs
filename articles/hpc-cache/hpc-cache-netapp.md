---
title: Use Azure HPC Cache and Azure NetApp Files
description: How to use Azure HPC Cache to improve access to data stored with Azure NetApp Files
author: femila
ms.service: hpc-cache
ms.topic: how-to
ms.date: 05/05/2021
ms.author: femila
---

# Use Azure HPC Cache with Azure NetApp Files

You can use [Azure NetApp Files](https://azure.microsoft.com/services/netapp/) as a storage target for your Azure HPC Cache. This article explains how the two services can work together, and gives tips for setting them up.

Azure NetApp Files combines their ONTAP operating system with the scalability and speed of Microsoft Azure. This combination lets users shift established workflows to the cloud without rewriting code.

Adding an Azure HPC Cache component can improve file access by presenting multiple Azure NetApp Files volumes in one aggregated namespace. It can provide edge caching for volumes located in a different service region. It also can improve performance on demand for volumes that were created at lower-tier service levels to save cost.

## Overview

To use an Azure NetApp Files system as back-end storage with Azure HPC Cache, follow this process.

1. Create the Azure NetApp Files system and volumes according to the guidance in [Plan your system, below](#plan-your-azure-netapp-files-system).
1. Create the Azure HPC Cache in the region where you need file access. (Use the instructions in [Create an Azure HPC Cache](hpc-cache-create.md).)
1. [Define storage targets](#create-storage-targets-in-the-cache) in the cache that point to the Azure NetApp Files volumes. Create one cache storage target for each unique IP address used to access the volumes.
1. Have clients [mount the Azure HPC Cache](#mount-storage-targets) instead of mounting Azure NetApp Files volumes directly.

## Plan your Azure NetApp Files system

When planning your Azure NetApp Files system, pay attention to the items in this section to make sure you can integrate it smoothly with Azure HPC Cache.

Also read the [Azure NetApp Files documentation](../azure-netapp-files/index.yml) before creating volumes for use with Azure HPC Cache.

### NFS client access only

Azure HPC Cache currently supports NFS access only. It can't be used with SMB ACL or POSIX mode bit volumes.

### Exclusive subnet for Azure NetApp Files

Azure NetApp Files uses a single delegated subnet for its volumes. No other resources can use that subnet. Also, only one subnet in a virtual network can be used for Azure NetApp Files. Learn more in [Guidelines for Azure NetApp Files network planning](../azure-netapp-files/azure-netapp-files-network-topologies.md).

### Delegated subnet size

Use the minimum size for the delegated subnet when creating an Azure NetApp Files system for use with Azure HPC Cache.

The minimum size, which is specified with the netmask /28, provides 16 IP addresses. In practice, Azure NetApp Files uses only three of those available IP addresses for volume access. This means that you only need to create three storage targets in your Azure HPC Cache to cover all of the volumes.

If the delegated subnet is too large, it's possible for the Azure NetApp Files volumes to use more IP addresses than a single Azure HPC Cache instance can handle. 

The quickstart example in Azure NetApp Files documentation uses 10.7.0.0/16 for the delegated subnet, which gives a subnet that's too large.

### Capacity pool service level

When choosing the [service level](../azure-netapp-files/azure-netapp-files-service-levels.md) for your capacity pool, consider your workflow. If you frequently write data back to the Azure NetApp Files volume, the cache's performance can be restricted if the writeback time is slow. Choose a high service level for volumes that will have frequent writes.

Volumes with low service levels also might show some lag at the start of a task while the cache pre-fills content. After the cache is up and running with a good working set of files, the delay should become unnoticeable.

It's important to plan the capacity pool service level ahead of time, because it can't be changed after creation. A new volume would need to be created in a different capacity pool, and the data copied over.

Note that you can change the storage quota of a volume and the size of the capacity pool without disrupting access.

## Create storage targets in the cache

After your Azure NetApp Files system is set up and the Azure HPC Cache is created, define storage targets in the cache that point to the file system volumes.

Create one storage target for each IP address used by your Azure NetApp Files volumes. The IP address is listed in the volume's mount instructions page.

If multiple volumes share the same IP address, you can use one storage target for all of them.  

Follow the [mount instructions in the Azure NetApp Files documentation](../azure-netapp-files/azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md) to find the IP addresses to use.

You also can find IP addresses with the Azure CLI:

```azurecli
az netappfiles volume list -g ${RESOURCE_GROUP} --account-name ${ANF_ACCOUNT} --pool-name ${POOL} --query "[].mountTargets[].ipAddress" | grep -Ee '[0-9]+[.][0-9]+[.][0-9]+[.][0-9]+' | tr -d '"' | tr -d , | sort | uniq
```

Export names on the Azure NetApp Files system have a single path component. Do not attempt to create a storage target for the root export ``/`` in Azure NetApp Files, because that export does not provide file access.

There are no special restrictions on virtual namespace paths for these storage targets.

## Mount storage targets

Client machines should mount the cache instead of mounting the Azure NetApp Files volumes directly. Follow the instructions in [Mount the Azure HPC Cache](hpc-cache-mount.md).

## Next steps

* Read more about setting up and using [Azure NetApp Files](../azure-netapp-files/index.yml)
* For help planning and setting up your Azure HPC Cache system to use Azure NetApp Files, [contact support](hpc-cache-support-ticket.md).
