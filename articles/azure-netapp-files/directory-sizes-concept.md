---
title: Understand directory sizes in Azure NetApp Files 
description: This article shows you how to create an SMB3 volume in Azure NetApp Files. Learn about requirements for Active Directory connections and Domain Services.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: concept
ms.date: 07/23/2024
ms.author: anfdocs
---
# Understand directory sizes in Azure NetApp Files 

When a file is created in a directory, an entry is added to a hidden index file within the Azure NetApp Files volume. This index file helps keep track of the existing inodes in a directory and helps speed up lookup requests for directories with a high number of files. As entries are added to this file, the file size increases (but never decrease) at a rate of approximately 512 bytes per entry depending on the length of the filename. Longer file names add more size to the file. Symbolic links also add entries to this file. This concept is known as the directory size, which is a common element in all Linux-based filesystems. Directory size is not the maximum total number of files in a single Azure NetApp Files volume. That is determined by the [`maxfiles` value](). 

By default, when a new directory is created, it consumes 4 KiB (4096 bytes) or eight 512-byte blocks. You can view the size of a newly created directory from a Linux client using the stat command. 

```
# mkdir dirsize 
# stat dirsize 
File: ‘dirsize’ 
Size: 4096            Blocks: 8          IO Block: 32768  directory 
``` 

Directory sizes are specific to a single directory and don't combine in sizes. For example, if there are ten directories in a volume, each can approach the 320 MiB directory size limit in a single volume. 

## Determine if a directory is approaching the limit size <a name="directory-limit"></a>  

For a 320-MiB directory, the number of blocks is 655360, with each block size being 512 bytes. (That is, 320x1024x1024/512.) This number translates to approximately 4-5 million files maximum for a 320-MiB directory. However, the actual number of maximum files might be lower, depending on factors such as the number of files with non-ASCII characters in the directory. 
You can use the `stat` command from a client to see whether a directory is approaching the maximum size limit for directory metadata (320 MB). If you reach the maximum size limit for a single directory for Azure NetApp Files, the error `No space left on device` occurs.   

For a 320-MB directory, the number of blocks is 655,360, with each block size being 512 bytes.  (That is, 320x1024x1024/512.)  This number translates to approximately 4 million files maximum for a 320-MB directory. However, the actual number of maximum files might be lower, depending on factors such as the number of files with non-ASCII characters in the directory. For information on how to monitor the maxdirsize, see [Monitoring `maxdirsize`]().

## Directory size considerations 

When dealing with a high-file count environment, consider the following recommendations: 

- Azure NetApp Files volumes support up to 320 MiB for directory sizes. This value can't be increased. 
- Once a volume’s directory size has been exceeded, clients display an out-of-space error even if there's available free space in the volume.  
- For regular volumes, a 320 MiB directory size equates to roughly 4-5 million files in a single directory. This value is dependent on the file name lengths. 
- [Large volumes](large-volumes-requirements-considerations.md) have a different architecture than regular volumes.
- High file counts in a single directory can present performance problems when searching. When possible, limit the total size of a single directory to 2 MiB (roughly 27,000 files) when frequent searches are needed.  
    - If more files are needed in a single directory, adjust search performance expectations accordingly. While Azure NetApp Files indexes the directory file listings for performance, searches can  take some time with high file counts. 
- When designing your file system, avoid flat directory layouts. For information about different approaches to directory layouts, see [About directory layouts](#about-directory-layouts).
- To resolve issues where the directory size has been exceeded and new files can't be created, delete or move files out of the relevant directory.

## About directory layouts

The `maxdirsize` value can create concerns when you are using flat directory structures, where a single folder contains millions of files at a single level. Folder structures where files, folders, and subfolders are interspersed have a low impact on `maxdirsize`. There are several directory structure methodologies. 

A **flat directory structure** is a single directory with many files below the same directory. 

:::image type="content" source="./media/directory-sizes-concept/flat-structure.png" alt-text="Diagram of a flat directory structure.":::

A **wide directory structure** contains many top-level directories with files spread across all directories.

:::image type="content" source="./media/directory-sizes-concept/wide-structure.png" alt-text="Diagram of a wide directory structure.":::

A **deep directory structure** contains fewer top-level directories with many subdirectories. Although this structure provides fewer files per folder, file path lengths can become an issue if directory layouts are too deep and file paths become too long. For details on file path lengths, see [Understand file path lengths in Azure NetApp Files](understand-path-lengths.md).

:::image type="content" source="./media/directory-sizes-concept/deep-structure.png" alt-text="Diagram of a deep directory structure.":::

### Impact of flat directory structures in Azure NetApp Files

Flat directory structures (many files in a single or few directories) have a negative effect on a wide array of file systems, Azure NetApp File volumes or others. Potential issues include:

- Memory pressure
- CPU utilization
- Network performance/latency (especiall during mass queries of files, `GETATTR` operations, `READDIR` operations)

Due to the design of Azure NetApp Files large volumes, the impact of `maxdirsize` is unique. Azure NetApp Files large volume `maxdirsize` is impacted uniquely due to its design. Unlike a regular volume, a large volume uses remote hard links inside Azure NetApp Files to help redirect traffic across different storage devices to provide more scale and performance. When using flat directories, there's a a higher ratio of internal remote hard links to local files. These remote hard links count against the total `maxdirsize` value, so a large volume might approach its `maxdirsize` limit faster than a regular volume.

For example, if a single directory has millions of files and generates roughly 85% remote hard links for the file system, you can expect `maxdirsize` to be exhausted at nearly twice the amount as a regular volume would.

For best results with directory sizes in Azure NetApp Files:

- **Avoid flat directory structures in Azure NetApp Files**. **Wide or deep directory structures work best**, provided the [path length](understand-path-lengths.md) of the file or folder doesn't exceed NAS protocol standards. 
- If flat directory structures are unavoidable, monitor the `maxdirsize` for the directories.

## Monitor `maxdirsize`

For a single directory, use the `stat` command to find the directory size. 

```
# stat /mnt/dir_11/c5 
```
 
Although the `stat` command can be used to check the directory size of a specific directory, it might not be as efficient to run it individually against a single directory. To see a list of the largest directory sizes sorted from largest to smallest, the following command provides that while omitting snapshot directories from the query. 

```
# find /mnt -name .snapshot -prune -o -type d -ls -links 2 -prune | sort -rn -k 7 | head | awk '{print $2 " " $11}' | sort -rn 
```

>[!NOTE]
>The directory size reported by the stat command is in bytes. The size reported in the find command is in KiB.
 
**Example**
```
# stat /mnt/dir_11/c5 

  File: ‘/mnt/dir_11/c5’ 

  Size: 322396160       Blocks: 632168     IO Block: 32768  directory 
 
# find /mnt -name .snapshot -prune -o -type d -ls -links 2 -prune | sort -rn -k 7 | head | awk '{print $2 " " $11}' | sort -rn 
316084 /mnt/dir_11/c5 

3792 /mnt/dir_19 

3792 /mnt/dir_16 
```

In the previous, the directory size of `/mnt/dir_11/c5` is 316,084 KiB (308.6 MiB), which approaches the 320 MiB limit. That equates to around 4.1 million files.

```
# ls /mnt/dir_11/c5 | wc -l
4171624
```

In this case, consider corrective actions such as moving or deleting files.

## More information 

* [Azure NetApp Files resources limits](azure-netapp-files-resource-limits.md)
* [Understand file path lengths in Azure NetApp Files](understand-path-lengths.md)