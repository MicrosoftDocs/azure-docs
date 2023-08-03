---
title: azcopy bench
description: This article provides reference information for the azcopy bench command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 05/26/2022
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: zezha-msft
---

# azcopy bench

Runs a performance benchmark by uploading or downloading test data to or from a specified destination. For uploads, the test data is automatically generated.

The benchmark command runs the same process as 'copy', except that:

- Instead of requiring both source and destination parameters, benchmark takes just one. This is the blob container, Azure Files Share, or Azure Data Lake Storage Gen2 file system that you want to upload to or download from.

- The 'mode' parameter describes whether AzCopy should test uploads to or downloads from given target. Valid values ar`e 'Upload'
    and 'Download'. Default value is 'Upload'.

- For upload benchmarks, the payload is described by command line parameters, which control how many files are auto-generated and 
    how big they are. The generation process takes place entirely in memory. Disk isn't used.

- For downloads, the payload consists of whichever files already exist at the source. (See example below about how to generate
    test files if needed).
  
- Only a few of the optional parameters that are available to the copy command are supported.
  
- Additional diagnostics are measured and reported.
  
- For uploads, the default behavior is to delete the transferred data at the end of the test run.  For downloads, the data is never actually saved locally.

Benchmark mode will automatically tune itself to the number of parallel TCP connections that gives the maximum throughput. It will display that number at the end. To prevent auto-tuning, set the COPY_CONCURRENCY_VALUE environment variable to a specific number of connections.

All the usual authentication types are supported. However, the most convenient approach for benchmarking upload is typically
to create an empty container with a SAS token and use SAS authentication. (Download mode requires a set of test data to be
present in the target container.)
  
```azcopy
azcopy bench [destination] [flags]
```

## Examples

Run an upload benchmark with default parameters (suitable for benchmarking networks up to 1 Gbps):

`azcopy bench "https://[account].blob.core.windows.net/[container]?<SAS>"`

Run a benchmark test that uploads 100 files, each 2 GiB in size: (suitable for benchmarking on a fast network, e.g. 10 Gbps):'

`azcopy bench "https://[account].blob.core.windows.net/[container]?<SAS>" --file-count 100 --size-per-file 2G`

Same as above, but use 50,000 files, each 8 MiB in size and compute their MD5 hashes (in the same way that the --put-md5 flag does this
in the copy command). The purpose of --put-md5 when benchmarking is to test whether MD5 computation affects throughput for the selected file count and size:

`azcopy bench --mode='Upload' "https://[account].blob.core.windows.net/[container]?<SAS>" --file-count 50000 --size-per-file 8M --put-md5`

Run a benchmark test that downloads existing files from a target

`azcopy bench --mode='Download' "https://[account].blob.core.windows.net/[container]?<SAS?"`

Run an upload that doesn't delete the transferred files. (These files can then serve as the payload for a download test)

`azcopy bench "https://[account].blob.core.windows.net/[container]?<SAS>" --file-count 100 --delete-test-data=false`

## Options

`--blob-type string`    defines the type of blob at the destination. Used to allow benchmarking different blob types. Identical to the same-named parameter in the copy command (default "Detect")

`--block-size-mb float`    Use this block size (specified in MiB). Default is automatically calculated based on file size. Decimal fractions are allowed - for example, 0.25. Identical to the same-named parameter in the copy command

`--check-length` Check the length of a file on the destination after the transfer. If there's a mismatch between source and destination, the transfer is marked as failed. (default true)

`--delete-test-data`   If true, the benchmark data will be deleted at the end of the benchmark run.  Set it to false if you want to keep the data at the destination - for example, to use it for manual tests outside benchmark mode (default true)

`--file-count`    (uint)    number of auto-generated data files to use (default 100)

`-h`, `--help`    help for bench

`--log-level`    (string)    define the log verbosity for the log file, available levels: INFO(all requests/responses), WARNING(slow responses), ERROR(only failed requests), and NONE(no output logs). (default "INFO")

`--mode`    (string)    Defines if Azcopy should test uploads or downloads from this target. Valid values are 'upload' and 'download'. Defaulted option is 'upload'. (default "upload")

`--number-of-folders`    (uint)    If larger than 0, create folders to divide up the data.

`--put-md5`    Create an MD5 hash of each file, and save the hash as the Content-MD5 property of the destination blob/file. (By default the hash is NOT created.) Identical to the same-named parameter in the copy command

`--size-per-file`    (string)    Size of each auto-generated data file. Must be a number immediately followed by K, M or G. E.g. 12k or 200G (default "250M")

## Options inherited from parent commands

`--cap-mbps`    (float)    Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it's omitted, the throughput isn't capped.

`--output-type`    (string)    Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

`--trusted-microsoft-suffixes`    (string)    Specifies additional domain suffixes where Azure Active Directory login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net;*.storage.azure.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy](storage-ref-azcopy.md)
