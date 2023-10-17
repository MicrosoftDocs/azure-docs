---
title: Optimize the performance of AzCopy v10 with Azure Storage
description: This article helps you to optimize the performance of AzCopy v10 with Azure Storage.
author: normesta
ms.service: azure-storage
ms.topic: how-to
ms.date: 06/02/2023
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: dineshm
---

# Optimize the performance of AzCopy with Azure Storage

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article helps you to optimize performance.

> [!NOTE]
> If you're looking for content to help you get started with AzCopy, see [Get started with AzCopy](storage-use-azcopy-v10.md)

You can benchmark performance, and then use commands and environment variables to find an optimal tradeoff between performance and resource consumption.

## Run benchmark tests

You can run a performance benchmark test on specific blob containers or file shares to view general performance statistics and to identify performance bottlenecks. You can run the test by uploading or downloading generated test data.

Use the following command to run a performance benchmark test.

**Syntax**

`azcopy benchmark 'https://<storage-account-name>.blob.core.windows.net/<container-name>'`

**Example**

```azcopy
azcopy benchmark 'https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobDirectory?sv=2018-03-28&ss=bjqt&srs=sco&sp=rjklhjup&se=2019-05-10T04:37:48Z&st=2019-05-09T20:37:48Z&spr=https&sig=/SOVEFfsKDqRry4bk3qz1vAQFwY5DDzp2%2B/3Eykf/JLs%3D'
```

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

This command runs a performance benchmark by uploading test data to a specified destination. The test data is generated in memory, uploaded to the destination, then deleted from the destination after the test is complete. You can specify how many files to generate and what size you'd like them to be by using optional command parameters.

If you prefer to run this test by downloading data, set the `mode` parameter to `download`. For detailed reference docs, see [azcopy benchmark](storage-ref-azcopy-bench.md).

## Optimize for large numbers of files

Throughput can decrease when transferring large numbers of files. Each copy operation translates to one or more transactions that must be executed in the storage service. When you are transferring a large number of files, consider the number of transactions that need to be executed and any potential impact those transactions can have if other activities are occurring in the storage account at the same time. 

To maximize performance, you can reduce the size of each job by limiting the number of files that are copied in a single job. For download and upload operations, increase concurrency as needed, decrease log activity, and turn off features that incur high performance costs.

#### Reduce the size of each job

To achieve optimal performance, ensure that each jobs transfers fewer than 10 million files. Jobs that transfer more than 50 million files can perform poorly because the AzCopy job tracking mechanism incurs a significant amount of overhead. To reduce overhead, consider dividing large jobs into smaller ones.

One way to reduce the size of a job is to limit the number of files affected by a job. You can use command parameters to do that. For example, a job can copy only a subset of directories by using the `include path` parameter as part of the [azcopy copy](storage-ref-azcopy-copy.md) command.

Use the `include-pattern` parameter to copy files that have a specific extension (for example: `*.pdf`). In a separate job, use the `exclude-pattern` parameter to copy all files that don't have `*.pdf` extension. See [Upload specific files](storage-use-azcopy-blobs-upload.md#upload-specific-files) and [Download specific blobs](storage-use-azcopy-blobs-download.md#download-specific-blobs) for examples.

After you've decided how to divide large jobs into smaller ones, consider running jobs on more than one Virtual Machine (VM).

#### Increase concurrency

If you're uploading or downloading files, use the `AZCOPY_CONCURRENCY_VALUE` environment variable to increase the number of concurrent requests that can occur on your machine. Set this variable as high as possible without compromising the performance of your machine. To learn more about this variable, see the [Increase the number of concurrent requests](#increase-the-number-of-concurrent-requests) section of this article.

If you're copying blobs between storage accounts, consider setting the value of the `AZCOPY_CONCURRENCY_VALUE` environment variable to a value greater than `1000`. You can set this variable high because AzCopy uses server-to-server APIs, so data is copied directly between storage servers and does not use your machine's processing power.

#### Decrease the number of logs generated

You can improve performance by reducing the number of log entries that AzCopy creates as it completes an operation. By default, AzCopy logs all activity related to an operation. To achieve optimal performance, consider setting the `--log-level` parameter of your copy, sync, or remove command to `ERROR`. That way, AzCopy logs only errors. By default, the value log level is set to `INFO`.

#### Turn off length checking

If you're uploading or downloading files, consider setting the `--check-length` of your copy and sync commands to `false`. This prevents AzCopy from verifying the length of a file after a transfer. By default, AzCopy checks the length to ensure that source and destination files match after a transfer completes. AzCopy performs this check after each file transfer. This check can degrade performance when jobs transfer large numbers of small files.

#### Turn on concurrent local scanning (Linux)

File scans on some Linux systems don't execute fast enough to saturate all of the parallel network connections. In these cases, you can set the `AZCOPY_CONCURRENT_SCAN` to a higher number.

## Increase the number of concurrent requests

You can increase throughput by setting the `AZCOPY_CONCURRENCY_VALUE` environment variable. This variable specifies the number of concurrent requests that can occur.

If your computer has fewer than 5 CPUs, then the value of this variable is set to `32`. Otherwise, the default value is equal to 16 multiplied by the number of CPUs. The maximum default value of this variable is `300`, but you can manually set this value higher or lower.

| Operating system | Command  |
|--------|-----------|
| **Windows** | `set AZCOPY_CONCURRENCY_VALUE=<value>` |
| **Linux** | `export AZCOPY_CONCURRENCY_VALUE=<value>` |
| **macOS** | `export AZCOPY_CONCURRENCY_VALUE=<value>` |

Use the `azcopy env` to check the current value of this variable. If the value is blank, then you can read which value is being used by looking at the beginning of any AzCopy log file. The selected value, and the reason it was selected, are reported there.

Before you set this variable, we recommend that you run a benchmark test. The benchmark test process will report the recommended concurrency value. Alternatively, if your network conditions and payloads vary, set this variable to the word `AUTO` instead of to a particular number. That will cause AzCopy to always run the same automatic tuning process that it uses in benchmark tests.

## Limit the throughput data rate

You can use the `cap-mbps` flag in your commands to place a ceiling on the throughput data rate. For example, the following command resumes a job and caps throughput to `10` megabits (Mb) per second.

```azcopy
azcopy jobs resume <job-id> --cap-mbps 10
```

## Optimize memory use

Set the `AZCOPY_BUFFER_GB` environment variable to specify the maximum amount of your system memory you want AzCopy to use for buffering when downloading and uploading files. Express this value in gigabytes (GB).

| Operating system | Command  |
|--------|-----------|
| **Windows** | `set AZCOPY_BUFFER_GB=<value>` |
| **Linux** | `export AZCOPY_BUFFER_GB=<value>` |
| **macOS** | `export AZCOPY_BUFFER_GB=<value>` |

> [!NOTE]
> Job tracking always incurs additional overhead in memory usage. The amount varies based on the number of transfers in a job. Buffers are the largest component of memory usage. You can help control overhead by using `AZCOPY_BUFFER_GB` to approximately meet your requirements, but there is no flag available to strictly cap the overall memory usage.

## Optimize file synchronization

The [sync](storage-ref-azcopy-sync.md) command identifies all files at the destination, and then compares file names and last modified timestamps before the starting the sync operation. If you have a large number of files, then you can improve performance by eliminating this up-front processing.

To accomplish this, use the [azcopy copy](storage-ref-azcopy-copy.md) command instead, and set the `--overwrite` flag to `ifSourceNewer`. AzCopy will compare files as they are copied without performing any up-front scans and comparisons. This provides a performance edge in cases where there are a large number of files to compare.

The [azcopy copy](storage-ref-azcopy-copy.md) command doesn't delete files from the destination, so if you want to delete files at the destination when they no longer exist at the source, then use the [azcopy sync](storage-ref-azcopy-sync.md) command with the `--delete-destination` flag set to a value of `true` or `prompt`.

## Use multiple clients to run jobs in parallel

AzCopy performs best when only one instance runs on the client. If you want to transfer files in parallel, then use multiple clients and run only one instance of AzCopy on each one. 

## See also

- [Get started with AzCopy](storage-use-azcopy-v10.md)
