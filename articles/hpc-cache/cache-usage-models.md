---
title: Azure HPC Cache usage models
description: Describes the different cache usage models and how to choose among them to set read-only or read/write caching and control other caching settings
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 06/29/2022
ms.author: rohogue
---
<!-- filename is referenced from GUI in aka.ms/hpc-cache-usagemodel -->

# Understand cache usage models

Cache usage models let you customize how your Azure HPC Cache stores files to speed up your workflow.

## Basic file caching concepts

File caching is how Azure HPC Cache expedites client requests. It uses these basic practices:

* **Read caching** - Azure HPC Cache keeps a copy of files that clients request from the storage system. The next time a client requests the same file, HPC Cache can provide the version in its cache instead of having to fetch the file from the back-end storage system again.

* **Write caching** - Optionally, Azure HPC Cache can store a copy of any changed files sent from the client machines. If multiple clients make changes to the same file over a short period, the cache can collect all the changes in the cache instead of having to write each change individually to the back-end storage system.

  After a specified amount of time with no changes, the cache moves the file to the long-term storage system.

  If write caching is disabled, the cache doesn't store the changed file and immediately writes it to the back-end storage system.

* **Write-back delay** - For a cache with write caching turned on, write-back delay is the amount of time the cache waits for additional file changes before copying the file to the back-end storage system.

* **Back-end verification** - The back-end verification setting determines how frequently the cache compares its local copy of a file with the remote version on the back-end storage system. If the back-end copy is newer than the cached copy, the cache fetches the remote copy and stores it for future requests.

  The back-end verification setting shows when the cache *automatically* compares its files with source files in remote storage. However, you can force Azure HPC Cache to compare files by performing a directory operation that includes a readdirplus request. Readdirplus is a standard NFS API (also called extended read) that returns directory metadata, which causes the cache to compare and update files.

The usage models built into Azure HPC Cache have different values for these settings so that you can choose the best combination for your situation.

## Choose the right usage model for your workflow

You must choose a usage model for each NFS-protocol storage target that you use. Azure Blob storage targets have a built-in usage model that can't be customized.

HPC Cache usage models let you choose how to balance fast response with the risk of getting stale data. If you want to optimize speed for reading files, you might not care whether the files in the cache are checked against the back-end files. On the other hand, if you want to make sure your files are always up to date with the remote storage, choose a model that checks frequently.

These are the usage model options:

* **Read heavy, infrequent writes** - Use this option if you want to speed up read access to files that are static or rarely changed.

  This option caches client reads but doesn't cache writes. It passes writes through to the back-end storage immediately.
  
  Files stored in the cache are not automatically compared to the files on the NFS storage volume. (Read the description of back-end verification above to learn how to compare them manually.)

  Do not use this option if there is a risk that a file might be modified directly on the storage system without first writing it to the cache. If that happens, the cached version of the file will be out of sync with the back-end file.

* **Greater than 15% writes** - This option speeds up both read and write performance. When using this option, all clients must access files through the Azure HPC Cache instead of mounting the back-end storage directly. The cached files will have recent changes that have not yet been copied to the back end.

  In this usage model, files in the cache are only checked against the files on back-end storage every eight hours. The cached version of the file is assumed to be more current. A modified file in the cache is written to the back-end storage system after it has been in the cache for an hour with no additional changes.

* **Clients write to the NFS target, bypassing the cache** - Choose this option if any clients in your workflow write data directly to the storage system without first writing to the cache, or if you want to optimize data consistency. Files that clients request are cached (reads), but any changes to those files from the client (writes) are not cached. They are passed through directly to the back-end storage system.

  With this usage model, the files in the cache are frequently checked against the back-end versions for updates - every 30 seconds. This verification allows files to be changed outside of the cache while maintaining data consistency.

  > [!TIP]
  > Those first three basic usage models can be used to handle the majority of Azure HPC Cache workflows. The next options are for less common scenarios.

* **Greater than 15% writes, checking the backing server for changes every 30 seconds** and **Greater than 15% writes, checking the backing server for changes every 60 seconds** - These options are designed for workflows where you want to speed up both reads and writes, but there's a chance that another user will write directly to the back-end storage system. For example, if multiple sets of clients are working on the same files from different locations, these usage models might make sense to balance the need for quick file access with low tolerance for stale content from the source.

* **Greater than 15% writes, write back to the server every 30 seconds** - This option is designed for the scenario where multiple clients are actively modifying the same files, or if some clients access the back-end storage directly instead of mounting the cache.

  The frequent back-end writes affect cache performance, so you should consider using the **Greater than 15% writes** usage model if there's a low risk of file conflict - for example, if you know that different clients are working in different areas of the same file set.

* **Read heavy, checking the backing server every 3 hours** - This option prioritizes fast reads on the client side, but also refreshes cached files from the back-end storage system regularly, unlike the **Read heavy, infrequent writes** usage model.

This table summarizes the usage model differences:

[!INCLUDE [usage-models-table.md](includes/usage-models-table.md)]

If you have questions about the best usage model for your Azure HPC Cache workflow, talk to your Azure representative or open a support request for help.

> [!TIP]
> A utility is available to write specific individual files back to a storage target without writing the entire cache contents. Learn more about the flush_file.py script in [Customize file write-back in Azure HPC Cache](custom-flush-script.md).

## Change usage models

You can change usage models by editing the storage target, but some changes are not allowed because they create a small risk of file version conflict.

You can't change **to** or **from** the model named **Read heavy, infrequent writes**. To change a storage target to this usage model, or to change it from this model to a different usage model, you have to delete the original storage target and create a new one.

This restriction also applies to the usage model **Read heavy, checking the backing server every 3 hours**, which is less commonly used. Also, you can change between the two "read heavy..." usage models, but not into or out of a different usage model style.

This restriction is needed because of the way different usage models handle Network Lock Manager (NLM) requests. Azure HPC Cache sits between clients and the back-end storage system. Usually, the cache passes NLM requests through to the back-end storage system, but in some situations, the cache itself acknowledges the NLM request and returns a value to the client. In Azure HPC Cache, this only happens when you use the usage models **Read heavy, infrequent writes** or **Read heavy, checking the backing server every 3 hours**, or with a standard blob storage target, which doesn't have configurable usage models.

If you change between **Read heavy, infrequent writes** and a different usage model, there's no way to transfer the current NLM state from the cache to the storage system or vice versa. So the client's lock status is inaccurate.

> [!NOTE]
> ADLS-NFS does not support NLM. You should disable NLM when clients mount the cluster to access an ADLS-NFS storage target.
>
> Use the option ``-o nolock`` in the ``mount`` command. Check your client operating system's mount documentation (man 5 nfs) to learn the exact behavior of the ``nolock`` option for your clients.

## Next steps

* [Add storage targets](hpc-cache-add-storage.md) to your Azure HPC Cache
