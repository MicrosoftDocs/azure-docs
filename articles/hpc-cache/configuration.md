---
title: Configure Azure HPC Cache settings
description: Explains how to configure additional settings for the cache like MTU and no-root-squash, and how to access the express snapshots from Azure Blob storage targets.
author: ekpgh
ms.service: hpc-cache
ms.topic: conceptual
ms.date: 03/19/2020
ms.author: rohogue
---

# Configure additional Azure HPC Cache settings

The **Configuration** page in the Azure Portal has options for customizing several settings. Most users do not need to change these from the default values.

This article also describes how to use the snapshot feature for Azure Blob storage targets. The snapshot feature has no configurable settings.

To see the settings, open the cache's **Configuration** page in the Azure portal.

![screenshot of configuration page in Azure portal](media/draft-configuration.png)

## Adjust MTU value
<!-- linked from troubleshoot-nas article -->

You can select the maximum transmission unit size for the cache by using the drop-down menu labeled **MTU size**.

The default value is 1500 bytes, but you can change it to 1400.

> [!NOTE]
> If your back-end storage system sends packets larger than the cache's MTU setting, those packets might be blocked.

Lowering the cache MTU value can help you work around packet size restrictions in the rest of the cache's network. For example, some VPNs can't handle full-size 1500 byte packets. If you can set both the back-end system's MTU and the cache's MTU to send smaller packets, that can eliminate the VPN size issue.

On the other hand, if you can't control the size of the storage system's packets, you should research another solution. Using MSS clamping on the VPN might help. Read [Adjust VPN packet size restrictions](troubleshoot-nas.md#adjust-vpn-packet-size-restrictions) in the NAS troubleshooting article to learn more about diagnosing and addressing this problem.

## Configure root squash
<!-- linked from troubleshoot -->

The **Enable root squash** setting controls how the Azure HPC Cache allows root access. Root squash helps to prevent root-level access from unauthorized clients.

This setting lets users control root access at the cache level, which can help compensate for the required ``no_root_squash`` setting for NAS systems used as storage targets. (Read more about [NFS storage target prerequisites](hpc-cache-prereqs.md#nfs-storage-requirements).) It also can improve security when used with Azure Blob storage targets.

The default setting is **Yes**. (Caches created before April 2020 might have the default setting **No**.) When enabled, this feature also prevents use of set-UID permission bits in client requests to the cache.

## View snapshots for blob storage targets

Azure HPC Cache automatically saves storage snapshots for Azure Blob storage targets. Snapshots provide a quick reference point for the contents of the back-end storage container. Snapshots are not a replacement for data backups, and they don't include any information about the state of cached data.

> [!NOTE]
> This snapshot feature is different from the snapshot feature included in NetApp, Isilon, or ZFS storage software. Those snapshot implementations flush changes from the cache to the back-end storage system before taking the snapshot.
>
> For efficiency, the Azure HPC Cache snapshot does not flush changes first, and only records data that has been written to the Blob container. This snapshot does not represent the state of cached data, so recent changes might be excluded.

This feature is available for Azure Blob storage targets only, and its configuration can't be changed.

Snapshots are taken every eight hours, at UTC 0:00, 08:00, and 16:00.

Azure HPC Cache stores daily, weekly, and monthly snapshots until they are replaced by new ones. The limits are:

* up to 20 daily snapshots
* up to 8 weekly snapshots
* up to 3 monthly snapshots

Access the snapshots from the `.snapshot` directory in your blob storage target's namespace.
