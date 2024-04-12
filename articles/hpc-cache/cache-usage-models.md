---
title: Azure HPC Cache usage models
description: Describes the different cache usage models and how to choose among them to set read-only or read/write caching and control other caching settings
author: ronhogue
ms.service: hpc-cache
ms.topic: how-to
ms.date: 02/16/2024
ms.author: rohogue
---
<!-- filename is referenced from GUI in aka.ms/hpc-cache-usagemodel -->

# Understand cache usage models

Cache usage models let you customize how your Azure HPC Cache stores files to speed up your workflow.

## Basic file caching concepts

File caching is how Azure HPC Cache expedites client requests. It uses these basic practices:

* **Read caching** - Azure HPC Cache keeps a copy of files that clients request from the storage system. The next time a client requests the same file, HPC Cache can provide the version in its cache instead of having to fetch the file from the back-end storage system again. Write requests   are passed to the back-end storage system.

* **Write caching** - Optionally, Azure HPC Cache can store a copy of any changed files sent from the client machines. If multiple clients make changes to the same file over a short period, the cache can collect all the changes in the cache instead of having to write each change individually to the back-end storage system. After a specified amount of time with no changes, the cache moves the file to the long-term storage system.

* **Verification timer** - The verification timer setting determines how frequently the cache compares its local copy of a file with the remote version on the back-end storage system. If the back-end copy is newer than the cached copy, the cache fetches the remote copy and stores it for future requests.

  The verification timer setting shows when the cache *automatically* compares its files with source files in remote storage. However, you can force Azure HPC Cache to compare files by performing a directory operation that includes a readdirplus request. Readdirplus is a standard NFS API (also called extended read) that returns directory metadata, which causes the cache to compare and update files.

* **Write-back timer** - For a cache with read-write caching, write-back timer is the maximum amount of time in seconds that the cache waits before copying a changed file to the back-end storage system.

The usage models built into Azure HPC Cache have different values for these settings so that you can choose the best combination for your situation.

## Choose the right usage model for your workflow

You must choose a usage model for each NFS-protocol storage target that you use. Azure Blob storage targets have a built-in usage model that can't be customized.

HPC Cache usage models let you choose how to balance fast response with the risk of getting stale data. If you want to optimize speed for reading files, you might not care whether the files in the cache are checked against the back-end files. On the other hand, if you want to make sure your files are always up to date with the remote storage, choose a model and set the verification timer to a low number to check frequently.

These are the usage model options:

* **Read-only caching** - Use this option if you want to speed up read access to files. Choose this option when your workflow involves minimal write operations like 0% to 5%.

  This option caches client reads but doesn't cache writes. Writes pass through to the back-end storage.
  
  Files stored in the cache are not automatically compared to the files on the NFS storage volume. (Read the description of verification timer above to learn how to compare them manually.)

  When choosing the **Read-only caching** option, you may change the Verification timer. The default value is 30 seconds. The value must be an integer (no decimals) between 1 and 31536000 seconds (1 year) inclusive.

* **Read-write caching** - This option caches both read and write operations. When using this option, most clients are expected to access files through the Azure HPC Cache instead of mounting the back-end storage directly. The cached files will have recent changes that have not yet been copied to the back end.

  In this usage model, files in the cache are only checked against the files on back-end storage every eight hours by default. The cached version of the file is assumed to be more current. A modified file in the cache is written to the back-end storage system after it has been in the cache for an hour by default.

  When choosing the **Read-write caching** option, you may change both the Verification timer and the Write-back timer. The Verification timer default value is 28,800 seconds (8 hours). The value must be an integer (no decimals) between 1 and 31536000 inclusive. The Write-back timer default value is 3600 seconds (1 hour). The value must be an integer (no decimals) between 1 and 31536000 seconds (1 year) inclusive.

This table summarizes the usage model differences:

[!INCLUDE [usage-models-table.md](includes/usage-models-table.md)]

> [!WARNING]
> **Changing usage models causes a service disruption.** HPC Cache clients will not receive responses while the usage model is transitioning. If you must change usage models, it is recommended that the change is made during a scheduled maintenance window to prevent client disruption.

If you have questions about the best usage model for your Azure HPC Cache workflow, talk to your Azure representative or open a support request for help.

> [!TIP]
> A utility is available to write specific individual files back to a storage target without writing the entire cache contents. Learn more about the flush_file.py script in [Customize file write-back in Azure HPC Cache](custom-flush-script.md).


## Next steps

* [Add storage targets](hpc-cache-add-storage.md) to your Azure HPC Cache
