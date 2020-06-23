---
title: azcopy bench | Microsoft Docs
description: This article provides reference information for the azcopy bench command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 10/16/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy benchmark

Runs a performance benchmark by uploading test data to a specified destination. The test data is automatically generated.

The benchmark command runs the same upload process as 'copy', except that:

  - There's no source parameter.  The command requires only a destination URL. 
  
  - The payload is described by command-line parameters, which control how many files are automatically generated and their size. The generation process takes place entirely in memory. Disk is not used.
  
  - Only a few of the optional parameters that are available to the copy command are supported.
  
  - Additional diagnostics are measured and reported.
  
  - By default, the transferred data is deleted at the end of the test run.

Benchmark mode will automatically tune itself to the number of parallel TCP connections that gives the maximum throughput. It will display that number at the end. To prevent autotuning, set the AZCOPY_CONCURRENCY_VALUE environment variable to a specific number of connections.

All the usual authentication types are supported. However, the most convenient approach for benchmarking is typically
to create an empty container with a SAS token and use SAS authentication.

## Examples

```azcopy
azcopy benchmark [destination] [flags]
```

Run a benchmark test with default parameters (suitable for benchmarking networks up to 1 Gbps):'

- azcopy bench "https://[account].blob.core.windows.net/[container]?<SAS>"

Run a benchmark test that uploads 100 files, each 2 GiB in size: (suitable for benchmarking on a fast network, for example, 10 Gbps):'

- azcopy bench "https://[account].blob.core.windows.net/[container]?<SAS>"--file-count 100 --size-per-file 2G

Run a benchmark test but use 50,000 files, each 8 MiB in size and compute their MD5 hashes (in the same way that the `--put-md5` flag does this
in the copy command). The purpose of `--put-md5` when benchmarking is to test whether MD5 computation affects throughput for the 
selected file count and size:

- azcopy bench "https://[account].blob.core.windows.net/[container]?<SAS>" --file-count 50000 --size-per-file 8M --put-md5

## Options

**--blob-type** string  Defines the type of blob at the destination. Used to allow benchmarking different blob types. Identical to the same-named parameter in the copy command (default "Detect").

**--block-size-mb** float  Use this block size (specified in MiB). Default is automatically calculated based on file size. Decimal fractions are allowed - e.g. 0.25. Identical to the same-named parameter in the copy command.

**--delete-test-data**  If true, the benchmark data will be deleted at the end of the benchmark run.  Set it to false if you want to keep the data at the destination - e.g. to use it for manual tests outside benchmark mode (default true).

**--file-count** uint  The number of auto-generated data files to use (default 100).

**-h, --help**  Help for bench

**--log-level** string Define the log verbosity for the log file, available levels: INFO(all requests/responses), WARNING(slow responses), ERROR(only failed requests), and NONE(no output logs). (default "INFO")

**--put-md5**  Create an MD5 hash of each file, and save the hash as the Content-MD5 property of the destination blob/file. (By default the hash is NOT created.) Identical to the same-named parameter in the copy command.

**--size-per-file** string   Size of each auto-generated data file. Must be a number immediately followed by K, M or G. E.g. 12k or 200G (default "250M").

## Options inherited from parent commands

**--cap-mbps uint32**  Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it is omitted, the throughput isn't capped.

**--output-type** string  Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text").

**--trusted-microsoft-suffixes** string   Specifies additional domain suffixes where Azure Active Directory login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy](storage-ref-azcopy.md)
