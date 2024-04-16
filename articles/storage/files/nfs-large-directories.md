---
title: Work with large directories in NFS Azure file shares
description: Learn recommendations for working with large directories in NFS Azure file shares mounted on Linux clients, including mount options, commands, and operations.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 03/19/2024
ms.author: kendownie
---

# Work with large directories in NFS Azure file shares

This article provides recommendations for working with NFS directories that contain large numbers of files. It's usually a good practice to reduce the number of files in a single directory by spreading the files over multiple directories. However, there are situations in which large directories can't be avoided. Consider the following suggestions when working with large directories on NFS Azure file shares that are mounted on Linux clients.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![No, this article doesn't apply to standard SMB Azure file shares LRS/ZRS.](../media/icons/no-icon.png) | ![NFS shares are only available in premium Azure file shares.](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![No, this article doesn't apply to standard SMB Azure file shares GRS/GZRS.](../media/icons/no-icon.png) | ![NFS is only available in premium Azure file shares.](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![No, this article doesn't apply to premium SMB Azure file shares.](../media/icons/no-icon.png) | ![Yes, this article applies to premium NFS Azure file shares.](../media/icons/yes-icon.png) |

## Recommended mount options

The following mount options are specific to enumeration and can reduce latency when working with large directories.

### actimeo

Specifying `actimeo` sets all of `acregmin`, `acregmax`, `acdirmin`, and `acdirmax` to the same value. If `actimeo` isn't specified, the NFS client uses the defaults for each of these options.

We recommend setting `actimeo` between 30 and 60 seconds when working with large directories. Setting a value in this range makes the attributes remain valid for a longer time period in the client's attribute cache, allowing operations to get file attributes from the cache instead of fetching them over the wire. This can reduce latency in situations where the cached attributes expire while the operation is still running.

The following graph compares the total time it takes to finish different operations with default mount versus setting an `actimeo` value of 30 for a workload that has 1 million files in a single directory. In our testing, the total completion time reduced by as much as 77% for some operations. All operations were done with [unaliased ls](#use-unaliased-ls).

:::image type="content" source="media/nfs-large-directories/default-mount-versus-actimeo.png" alt-text="Graph comparing the time to finish different operations with default mount versus setting an actimeo value of 30 for a workload with 1 million files." border="false":::

### nconnect

`Nconnect` is a client-side mount option that allows you to use multiple TCP connections between the client and the Azure Premium Files service for NFSv4.1. We recommend the optimal setting of `nconnect=4` to reduce latency and improve performance. `Nconnect` can be especially useful for workloads that use asynchronous or synchronous I/O from multiple threads. [Learn more](nfs-performance.md#nconnect).

## Commands and operations

The way commands and operations are specified can also affect performance. Listing all the files in a large directory using the `ls` command is a good example.

> [!NOTE]
> Some operations such as recursive `ls`, `find`, and `du` need both file names and file attributes, so they combine directory enumerations (to get the entries) with a stat on each entry (to get the attributes). We suggest using a higher value for [actimeo](#actimeo) on mount points where you're likely to run such commands.

### Use unaliased ls

In some Linux distributions, the shell automatically sets default options for the `ls` command such as `ls --color=auto`. This changes how `ls` works over the wire and adds more operations to the `ls` execution. To avoid performance degradation, we recommended using unaliased ls. You can do this one of three ways:

- Remove the alias by using the command `unalias ls`. This is only a temporary solution for the current session.

- For a permanent change, you can edit the `ls` alias in the user's `bashrc/bash_aliases` file. In Ubuntu, edit `~/.bashrc` to remove the alias for `ls`.

- Instead of calling `ls`, you can directly call the `ls` binary, for example `/usr/bin/ls`. This allows you to use `ls` without any options that might be in the alias. You can find the location of the binary by running the command `which ls`.

### Prevent ls from sorting its output

When using `ls` with other commands, you can improve performance by preventing `ls` from sorting its output in situations where you don't care about the order that `ls` returns the files. Sorting the output adds significant overhead.

Instead of running `ls -l | wc -l` to get the total number of files, you can use the `-f` or `-U` options with `ls` to prevent the output from being sorted. The difference is that `-f` will also show hidden files, and `-U` won't.

For example, if you're directly calling the `ls` binary in Ubuntu, you would run `/usr/bin/ls -1f | wc -l` or `/usr/bin/ls -1U | wc -l`.

The following chart compares the time it takes to output results using unaliased, unsorted `ls` versus sorted `ls`.

:::image type="content" source="media/nfs-large-directories/sorted-versus-unsorted-ls.png" alt-text="Graph comparing the total time in seconds to complete a sorted ls operation versus unsorted." border="false":::

## File copy and backup operations

When copying data from an NFS file share or backing up from NFS file shares to another location, for optimal performance we recommend using a share snapshot as the source instead of the live file share with active I/O. Backup applications should run commands on the snapshot directly. For more information, see [NFS file share snapshots](storage-files-how-to-mount-nfs-shares.md#nfs-file-share-snapshots).

## Application-level recommendations

When developing applications that use large directories with NFS file shares, follow these recommendations.

- **Skip file attributes.** If the application only needs the file name and not file attributes like file type or last modified time, you can use multiple calls to system calls such as `getdents64` with a good buffer size. This will get the entries in the specified directory without the file type, making the operation faster by avoiding extra operations that aren't needed.  

- **Interleave stat calls.** If the application needs attributes and the file name, we recommend interleaving the stat calls along with `getdents64` instead of getting all entries until end of file with `getdents64` and then doing a statx on all entries returned. Interleaving the stat calls instructs the NFS client to request both the file and its attributes at once, reducing the number of calls to the server. When combined with a high `actimeo` value, this can significantly improve performance. For example, instead of `[ getdents64, getdents64, ... , getdents64, statx (entry1), ... , statx(n) ]`, place the statx calls after each `getdents64` like this: `[ getdents64, (statx, statx, ... , statx), getdents64, (statx, statx, ... , statx), ... ]`.

- **Increase I/O depth.** If possible, we suggest configuring `nconnect` to a non-zero value (greater than 1) and distributing the operation among multiple threads, or using asynchronous I/O. This will enable operations that can be asynchronous to benefit from multiple concurrent connections to the file share.

- **Force-use cache.** If the application is querying the file attributes on a file share that only one client has mounted, use the statx system call with the `AT_STATX_DONT_SYNC` flag. This flag ensures that the cached attributes are retrieved from the cache without synchronizing with the server, avoiding extra network round trips to get the latest data.

## See also

- [Improve NFS Azure file share performance](nfs-performance.md)
- [NFS file shares in Azure Files](files-nfs-protocol.md)
