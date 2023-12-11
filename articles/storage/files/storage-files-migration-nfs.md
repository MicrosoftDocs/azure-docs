---
title: Migrate to NFS Azure file shares
description: Learn how to migrate from Linux file servers to NFS Azure file shares using open source file copy tools.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 12/11/2023
ms.author: kendownie
---

# Migrate to NFS Azure file shares

This article covers the basic aspects of migrating from Linux file servers to NFS Azure file shares, which are only available as Premium file shares (FileStorage account kind). We'll also compare open source tools fpsync and rsync to understand how they perform in different situations when copying data to Azure file shares.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![No](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![No](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![No](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Prerequisites

You'll need at least one NFS Azure file share mounted to a Linux virtual machine (VM). To create one, see [Create an NFS Azure file share and mount it on a Linux VM](storage-files-quick-create-use-linux.md). We recommend mounting the share with nconnect to make use of multiple TCP connections. For more information, see [Improve NFS Azure file share performance](nfs-performance.md#nconnect).

## Migration basics

Many open source tools are available to transfer data to NFS file shares. However, not all of them are efficient when dealing with a distributed file system with distinct performance considerations compared to on-premises setups. In a distributed file system, each network call involves a round trip to a server that might not be local. Therefore, optimizing the time spent on network calls is crucial to achieving optimal performance and efficient data transfer over the network.

## Using fpsync

In this article, we'll use the open source tool fpsync to copy the data. Designed to synchronize files between two locations, [fpsync](https://manpages.ubuntu.com/manpages/lunar/en/man1/fpsync.1.html) stands for File Parallel Synchronization. It comes as a part of the fpart filesystem partitioner.

Internally, fpsync uses [rsync](https://linux.die.net/man/1/rsync) (default), [cpio](https://linux.die.net/man/1/cpio), or tar tools to copy. It computes subsets of `src_dir/` and spawns synchronization jobs to synchronize them to `dst_dir/`. Synchronization jobs are executed on the fly while fpsync crawls the file system, making it a useful tool for efficiently migrating large file systems and copying large datasets with multiple files.

### Install fpart

Install fpart on the Linux distribution of your choice. Once it's installed, you should see fpsync under `/usr/bin/`.

# [Ubuntu](#tab/ubuntu)

On Ubuntu, use the apt package manager.

```bash
sudo apt-get install fpart
```

# [RHEL](#tab/rhel)

On Red Hat Enterprise Linux, use the yum package manager.

**Red Hat Enterprise Linux 7:**

```bash
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
sudo yum install fpart -y
```

**Red Hat Enterprise Linux 8:**

```bash
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
sudo yum install fpart -y
```

**Red Hat Enterprise Linux 9:**

```bash
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
sudo yum install fpart -y
```

# [SUSE](#tab/suse)

```bash
git clone https://github.com/martymac/fpart
./make_release.sh  
```
---

## Copy data from source to target

Make sure your target Azure file share is mounted to a Linux VM, then copy your data in three phases:

1. **Baseline copy:** Copy from source to target when no data exists on the target.
1. **Incremental copy:** Copy only the incremental changes from source to target. This is often done multiple times.
1. **Final pass:** A final pass is needed to delete any files on the target that don't exist at the source.

Copying the data always involves some version of this command:

```bash
fpsync -m <copy tool - rsync/cpio/tar> -n <parallel transfers> <absolute source path> <absolute target path>
```

### Baseline copy

For baseline copy we recommend using fpsync with cpio as the copy tool, for example:

```bash
fpsync -m cpio –n <parallel transfers> <absolute source path> <absolute target path>    
```

For more information, see [Cpio and Tar support](http://www.fpart.org/fpsync/#cpio-and-tar-support).

### Incremental copy

For incremental sync, we recommend using fpsync with the default copy tool (rsync):

```bash
fpsync –n <parallel transfers> <absolute source path> <absolute target path>
```

By default, fpsync will specify the following rsync options: `-lptgoD -v --numeric-ids`. You can specify additional rsync options by adding `–o option` to the fpsync command.

## Next steps

- [Improve NFS Azure file share performance](nfs-performance.md)
