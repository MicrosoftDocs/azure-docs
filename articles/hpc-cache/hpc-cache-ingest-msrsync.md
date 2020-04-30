---
title: Azure HPC Cache data ingest - msrsync
description: How to use msrsync to move data to a Blob storage target in Azure HPC Cache
author: ekpgh
ms.service: hpc-cache
ms.topic: conceptual
ms.date: 10/30/2019
ms.author: rohogue
---

# Azure HPC Cache data ingest - msrsync method

This article gives detailed instructions for using the ``msrsync`` utility to copy data to an Azure Blob storage container for use with Azure HPC Cache.

To learn more about moving data to Blob storage for your Azure HPC Cache, read [Move data to Azure Blob storage](hpc-cache-ingest.md).

The ``msrsync`` tool can be used to move data to a back-end storage target for the Azure HPC Cache. This tool is designed to optimize bandwidth usage by running multiple parallel ``rsync`` processes. It is available from GitHub at https://github.com/jbd/msrsync.

``msrsync`` breaks up the source directory into separate “buckets” and then runs individual ``rsync`` processes on each bucket.

Preliminary testing using a four-core VM showed best efficiency when using 64 processes. Use the ``msrsync`` option ``-p`` to set the number of processes to 64.

Note that ``msrsync`` can only write to and from local volumes. The source and destination must be accessible as local mounts on the workstation used to issue the command.

Follow these instructions to use ``msrsync`` to populate Azure Blob storage with Azure HPC Cache:

1. Install ``msrsync`` and its prerequisites (``rsync`` and Python 2.6 or later)
1. Determine the total number of files and directories to be copied.

   For example, use the utility ``prime.py`` with arguments ```prime.py --directory /path/to/some/directory``` (available by downloading <https://github.com/Azure/Avere/blob/master/src/clientapps/dataingestor/prime.py>).

   If not using ``prime.py``, you can calculate the number of items with the GNU ``find`` tool as follows:

   ```bash
   find <path> -type f |wc -l         # (counts files)
   find <path> -type d |wc -l         # (counts directories)
   find <path> |wc -l                 # (counts both)
   ```

1. Divide the number of items by 64 to determine the number of items per process. Use this number with the ``-f`` option to set the size of the buckets when you run the command.

1. Issue the ``msrsync`` command to copy files:

   ```bash
   msrsync -P --stats -p64 -f<ITEMS_DIV_64> --rsync "-ahv --inplace" <SOURCE_PATH> <DESTINATION_PATH>
   ```

   For example, this command is designed to move 11,000 files in 64 processes from /test/source-repository to /mnt/hpccache/repository:

   ``mrsync -P --stats -p64 -f170 --rsync "-ahv --inplace" /test/source-repository/ /mnt/hpccache/repository``
