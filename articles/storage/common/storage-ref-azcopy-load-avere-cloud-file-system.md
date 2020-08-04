---
title: azcopy load clfs | Microsoft Docs
titleSuffix: Azure Storage
description: This article provides reference information for the azcopy load clfs command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 07/24/2020
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy load clfs

Transfers local data into a Container and stores it in Microsoft's Avere Cloud FileSystem (CLFS) format.

## Synopsis

The load command copies data into Azure Blob storage containers and then stores that data in Microsoft's Avere Cloud FileSystem (CLFS) format. 
The proprietary CLFS format is used by the Azure HPC Cache and Avere vFXT for Azure products.

To leverage this command, install the necessary extension via: pip3 install clfsload~=1.0.23. Make sure CLFSLoad.py is 
in your PATH. For more information on this step, visit [https://aka.ms/azcopy/clfs](https://aka.ms/azcopy/clfs).

This command is a simple option for moving existing data to cloud storage for use with specific Microsoft high-performance computing cache products. 

Because these products use a proprietary cloud filesystem format to manage data, that data cannot be loaded through the native copy command. 

Instead, the data must be loaded through the cache product itself or via this load command, which uses the correct proprietary format.
This command lets you transfer data without using the cache. For example, to pre-populate storage or to add files to a working set without increasing cache load.

The destination is an empty Azure Storage Container. When the transfer is complete, the destination container can be used with an Azure HPC Cache instance or Avere vFXT for Azure cluster.

> [!NOTE] 
> This is a preview release of the load command. Please report any issues on the AzCopy Github repo.

```
azcopy load clfs [local dir] [container URL] [flags]
```

## Related conceptual articles

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Transfer data with AzCopy and Blob storage](storage-use-azcopy-blobs.md)
- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)
- [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)

## Examples

Load an entire directory to a container with a SAS in CLFS format:

```azcopy
azcopy load clfs "/path/to/dir" "https://[account].blob.core.windows.net/[container]?[SAS]" --state-path="/path/to/state/path"
```

## Options

**--compression-type** string   specify the compression type to use for the transfers. Available values are: `DISABLED`,`LZ4`. (default `LZ4`)

**--help**    help for the `azcopy load clfs` command.

**--log-level** string   Define the log verbosity for the log file, available levels: `DEBUG`, `INFO`, `WARNING`, `ERROR`. (default `INFO`)

**--max-errors** uint32   Specify the maximum number of transfer failures to tolerate. If enough errors occur, stop the job immediately.

**--new-session**   Start a new job rather than continuing an existing one whose tracking information is kept at `--state-path`. (default true)

**--preserve-hardlinks**    Preserve hard link relationships.

**--state-path** string   Required path to a local directory for job state tracking. The path must point to an existing directory in order to resume a job. It must be empty for a new job.

## Options inherited from parent commands

|Option|Description|
|---|---|
|--cap-mbps float|Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it is omitted, the throughput isn't capped.|
|--output-type string|Format of the command's output. The choices include: text, json. The default value is "text".|
|--trusted-microsoft-suffixes string   | Specifies additional domain suffixes where Azure Active Directory login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.|

## See also

- [azcopy](storage-ref-azcopy.md)
