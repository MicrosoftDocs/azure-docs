---
title: Optimize the performance of AzCopy v10 with Azure Storage | Microsoft Docs
description: Description goes here 2.
author: normesta
ms.service: storage
ms.topic: how-to
ms.date: 03/22/2021
ms.author: normesta
ms.subservice: common
ms.reviewer: dineshm
---

# Optimize the performance of AzCopy v10 with Azure Storage

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article helps you to optimize performance.

> [!NOTE]
> If you're looking for content to help you get started with AzCopy, see [Get started with AzCopy](storage-use-azcopy-v10.md)

You can benchmark performance, and then use commands and environment variables to find an optimal tradeoff between performance and resource consumption.

## Run benchmark tests

You can run a performance benchmark test on specific blob containers or file shares to view general performance statistics and to identity performance bottlenecks. You can run the test by uploading or downloading generated test data. 

Use the following command to run a performance benchmark test.

**Syntax**

`azcopy benchmark 'https://<storage-account-name>.blob.core.windows.net/<container-name>'`

**Example**

```azcopy
azcopy benchmark 'https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobDirectory?sv=2018-03-28&ss=bjqt&srs=sco&sp=rjklhjup&se=2019-05-10T04:37:48Z&st=2019-05-09T20:37:48Z&spr=https&sig=%2FSOVEFfsKDqRry4bk3qz1vAQFwY5DDzp2%2B%2F3Eykf%2FJLs%3D'
```

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

This command runs a performance benchmark by uploading test data to a specified destination. The test data is generated in memory, uploaded to the destination, then deleted from the destination after the test is complete. You can specify how many files to generate and what size you'd like them to be by using optional command parameters.

If you prefer to run this test by downloading data, set the `mode` parameter to `download`. For detailed reference docs, see [azcopy benchmark](storage-ref-azcopy-bench.md). 

## Optimize throughput

You can use the `cap-mbps` flag in your commands to place a ceiling on the throughput data rate. For example, the following command resumes a job and caps throughput to `10` megabits (Mb) per second. 

```azcopy
azcopy jobs resume <job-id> --cap-mbps 10
```

Throughput can decrease when transferring small files. You can increase throughput by setting the `AZCOPY_CONCURRENCY_VALUE` environment variable. This variable specifies the number of concurrent requests that can occur.  

If your computer has fewer than 5 CPUs, then the value of this variable is set to `32`. Otherwise, the default value is equal to 16 multiplied by the number of CPUs. The maximum default value of this variable is `3000`, but you can manually set this value higher or lower. 

| Operating system | Command  |
|--------|-----------|
| **Windows** | `set AZCOPY_CONCURRENCY_VALUE=<value>` |
| **Linux** | `export AZCOPY_CONCURRENCY_VALUE=<value>` |
| **macOS** | `export AZCOPY_CONCURRENCY_VALUE=<value>` |

Use the `azcopy env` to check the current value of this variable. If the value is blank, then you can read which value is being used by looking at the beginning of any AzCopy log file. The selected value, and the reason it was selected, are reported there.

Before you set this variable, we recommend that you run a benchmark test. The benchmark test process will report the recommended concurrency value. Alternatively, if your network conditions and payloads vary, set this variable to the word `AUTO` instead of to a particular number. That will cause AzCopy to always run the same automatic tuning process that it uses in benchmark tests.

## Optimize memory use

Set the `AZCOPY_BUFFER_GB` environment variable to specify the maximum amount of your system memory you want AzCopy to use when downloading and uploading files.
Express this value in gigabytes (GB).

| Operating system | Command  |
|--------|-----------|
| **Windows** | `set AZCOPY_BUFFER_GB=<value>` |
| **Linux** | `export AZCOPY_BUFFER_GB=<value>` |
| **macOS** | `export AZCOPY_BUFFER_GB=<value>` |

## Optimize file synchronization

The [sync](storage-ref-azcopy-sync.md) command identifies all files at the destination, and then compares file names and last modified timestamps before the starting the sync operation. If you have a large number of files, then you can improve performance by eliminating this up-front processing. 

To accomplish this, use the [azcopy copy](storage-ref-azcopy-copy.md) command instead, and set the `--overwrite` flag to `ifSourceNewer`. AzCopy will compare files as they are copied without performing any up-front scans and comparisons. This provides a performance edge in cases where there are a large number of files to compare.

The [azcopy copy](storage-ref-azcopy-copy.md) command doesn't delete files from the destination, so if you want to delete files at the destination when they no longer exist at the source, then use the [azcopy sync](storage-ref-azcopy-sync.md) command with the `--delete-destination` flag set to a value of `true` or `prompt`.

## See also

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [AzCopy V10 with Azure Storage FAQ](storage-use-azcopy-faq.yml)