---
title: Work with large directories in Azure file shares
description: Learn recommendations for working with large directories in Azure file shares mounted on Linux clients, including mount options, commands, and operations.
author: khdownie
ms.service: azure-file-storage
ms.custom: linux-related-content
ms.topic: concept-article
ms.date: 01/24/2025
ms.author: kendownie
# Customer intent: "As a Linux administrator, I want to optimize performance when accessing large directories in Azure file shares, so that I can reduce latency and improve efficiency in file enumeration and management tasks."
---

# Optimize file share performance when accessing large directories from Linux clients

This article provides recommendations for working with directories that contain large numbers of files. It's usually a good practice to reduce the number of files in a single directory by spreading the files over multiple directories. However, there are situations in which large directories can't be avoided. Consider the following suggestions when working with large directories on Azure file shares that are mounted on Linux clients.

## Applies to
| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |

## Increase the number of hash buckets

The total amount of RAM present on the system doing the enumeration influences the internal working of filesystem protocols like NFS and SMB. Even if users aren't experiencing high memory usage, the amount of memory available influences the number of inode hash buckets the system has, which impacts/improves enumeration performance for large directories. You can modify the number of inode hash buckets the system has to reduce the hash collisions that can occur during large enumeration workloads.

To increase the number of inode hash buckets, modify your boot configuration settings:

1. Using a text editor, edit the `/etc/default/grub` file.

   ```bash
   sudo vim /etc/default/grub
   ```

2. Add the following text to the `/etc/default/grub` file. This command sets 128MB as the inode hash table size, increasing system memory consumption by a maximum of 128MB.

   ```bash
   GRUB_CMDLINE_LINUX="ihash_entries=16777216"
   ```

   If `GRUB_CMDLINE_LINUX` already exists, add `ihash_entries=16777216` separated by a space, like this:

   ```bash
   GRUB_CMDLINE_LINUX="<previous commands> ihash_entries=16777216"
   ```

3. To apply the changes, run:

   ```bash
   sudo update-grub2
   ```

4. Restart the system:

   ```bash
   sudo reboot
   ```

5. To verify that the changes are effective after reboot, check the kernel cmdline commands:

   ```bash
   cat /proc/cmdline
   ```

   If `ihash_entries` is visible, the system has applied the setting, and enumeration performance should improve exponentially.

   You can also check the dmesg output to see if the kernel cmdline was applied:

   ```bash
   dmesg | grep "Inode-cache hash table"
   Inode-cache hash table entries: 16777216 (order: 15, 134217728 bytes, linear)
   ```

## Recommended mount options

The following mount options are specific to enumeration and can reduce latency when working with large directories.

### actimeo

The `actimeo` mount option specifies the time (in seconds) that the client caches attributes of a file or directory before it requests attribute information from a server. During this period the changes that occur on the server remain undetected until the client checks the server again. For SMB clients, the default attribute cache timeout is set to 1 second.

On NFS clients, specifying `actimeo` sets all of `acregmin`, `acregmax`, `acdirmin`, and `acdirmax` to the same value. If `actimeo` isn't specified, the client uses the defaults for each of these options.

We recommend setting `actimeo` between 30 and 60 seconds when working with large directories. Setting a value in this range makes the attributes remain valid for a longer time period in the client's attribute cache, allowing operations to get file attributes from the cache instead of fetching them over the wire. This can reduce latency in situations where the cached attributes expire while the operation is still running.

The following graph compares the total time it takes to finish different operations with default mount versus setting an `actimeo` value of 30 for a workload that has 1 million files in a single directory. In our testing, the total completion time reduced by as much as 77% for some operations. All operations were done with [unaliased ls](#use-unaliased-ls).

:::image type="content" source="media/nfs-large-directories/default-mount-versus-actimeo.png" alt-text="Graph comparing the time to finish different operations with default mount versus setting an actimeo value of 30 for a workload with 1 million files." border="false":::

### NFS nconnect
NFS nconnect is a client-side mount option for NFS file shares that allows you to use multiple TCP connections between the client and your NFS file share. We recommend the optimal setting of `nconnect=4` to reduce latency and improve performance. The nconnect feature can be especially useful for workloads that use asynchronous or synchronous I/O from multiple threads. [Learn more](nfs-performance.md#nfs-nconnect).

## Commands and operations

The way commands and operations are specified can also affect performance. Listing all the files in a large directory using the `ls` command is a good example.

> [!NOTE]
> Some operations such as recursive `ls`, `find`, and `du` need both file names and file attributes, so they combine directory enumerations (to get the entries) with a stat on each entry (to get the attributes). We suggest using a higher value for [actimeo](#actimeo) on mount points where you're likely to run such commands.

### Use unaliased ls

In some Linux distributions, the shell automatically sets default options for the `ls` command such as `ls --color=auto`. This changes how `ls` works over the wire and adds more operations to the `ls` execution. To avoid performance degradation, we recommended using unaliased ls. You can do this one of three ways:

- As a temporary workaround that only impacts the current session, you can remove the alias by using the command `unalias ls`. 

- For a permanent change, you can edit the `ls` alias in the user's `bashrc/bash_aliases` file. In Ubuntu, edit `~/.bashrc` to remove the alias for `ls`.

- Instead of calling `ls`, you can directly call the `ls` binary, for example `/usr/bin/ls`. This allows you to use `ls` without any options that might be in the alias. You can find the location of the binary by running the command `which ls`.

### Prevent ls from sorting its output

When using `ls` with other commands, you can improve performance by preventing `ls` from sorting its output in situations where you don't care about the order that `ls` returns the files. Sorting the output adds significant overhead.

Instead of running `ls -l | wc -l` to get the total number of files, you can use the `-f` or `-U` options with `ls` to prevent the output from being sorted. The difference is that `-f` also shows hidden files, and `-U` doesn't.

For example, if you're directly calling the `ls` binary in Ubuntu, you would run `/usr/bin/ls -1f | wc -l` or `/usr/bin/ls -1U | wc -l`.

The following chart compares the time it takes to output results using unaliased, unsorted `ls` versus sorted `ls`.

:::image type="content" source="media/nfs-large-directories/sorted-versus-unsorted-ls.png" alt-text="Graph comparing the total time in seconds to complete a sorted ls operation versus unsorted." border="false":::

## File copy and backup operations

When copying data from a file share or backing up from file shares to another location, for optimal performance we recommend using a share snapshot as the source instead of the live file share with active I/O. Backup applications should run commands on the snapshot directly. For more information, see [Use share snapshots with Azure Files](storage-snapshots-files.md).

## Application-level recommendations

When developing applications that use large directories, follow these recommendations.

- **Skip file attributes.** If the application only needs the file name and not file attributes like file type or last modified time, you can use multiple calls to system calls such as `getdents64` with a good buffer size to get the entries in the specified directory without the file type, making the operation faster by avoiding extra operations that aren't needed.  

- **Interleave stat calls.** If the application needs attributes and the file name, we recommend interleaving the stat calls along with `getdents64` instead of getting all entries until end of file with `getdents64` and then doing a statx on all entries returned. Interleaving the stat calls instructs the client to request both the file and its attributes at once, reducing the number of calls to the server. When combined with a high `actimeo` value, interleaving stat calls can significantly improve performance. For example, instead of `[ getdents64, getdents64, ... , getdents64, statx (entry1), ... , statx(n) ]`, place the statx calls after each `getdents64` like this: `[ getdents64, (statx, statx, ... , statx), getdents64, (statx, statx, ... , statx), ... ]`.

- **Increase I/O depth.** If possible, we suggest configuring `nconnect` to a non-zero value (greater than 1) and distributing the operation among multiple threads, or using asynchronous I/O. This enables operations that can be asynchronous to benefit from multiple concurrent connections to the file share.

- **Force-use cache.** If the application is querying the file attributes on a file share that only one client has mounted, use the statx system call with the `AT_STATX_DONT_SYNC` flag. This flag ensures that the cached attributes are retrieved from the cache without synchronizing with the server, avoiding extra network round trips to get the latest data.

## See also

- [Improve NFS Azure file share performance](nfs-performance.md)
- [Improve SMB Azure file share performance](smb-performance.md)
