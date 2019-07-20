---
title: Configure, optimize, and troubleshoot AzCopy with Azure Storage | Microsoft Docs
description: Configure, optimize, and troubleshoot AzCopy.
services: storage
author: normesta
ms.service: storage
ms.topic: article
ms.date: 05/14/2019
ms.author: normesta
ms.subservice: common
---

# Configure, optimize, and troubleshoot AzCopy

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article helps you to perform advanced configuration tasks and helps you to troubleshoot issues that can arise as you use AzCopy.

> [!NOTE]
> If you're looking for content to help you get started with AzCopy, see any of the following articles:
> - [Get started with AzCopy](storage-use-azcopy-v10.md)
> - [Transfer data with AzCopy and blob storage](storage-use-azcopy-blobs.md)
> - [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)
> - [Transfer data with AzCopy and Amazon S3 buckets](storage-use-azcopy-s3.md)

## Configure proxy settings

To configure the proxy settings for AzCopy, set the `https_proxy` environment variable.

| Operating system | Command  |
|--------|-----------|
| **Windows** | In a command prompt use: `set https_proxy=<proxy IP>:<proxy port>`<br> In PowerShell use: `$env:https_proxy="<proxy IP>:<proxy port>"`|
| **Linux** | `export https_proxy=<proxy IP>:<proxy port>` |
| **MacOS** | `export https_proxy=<proxy IP>:<proxy port>` |

Currently, AzCopy doesn't support proxies that require authentication with NTLM or Kerberos.

## Optimize throughput

Set the `AZCOPY_CONCURRENCY_VALUE` environment variable to configure the number of concurrent requests, and to control the throughput performance and resource consumption. If your computer has fewer than 5 CPUs, then the value of this variable is set to `32`. Otherwise, the default value is equal to 16 multiplied by the number of CPUs. The maximum default value of this variable is `300`, but you can manually set this value higher or lower.

| Operating system | Command  |
|--------|-----------|
| **Windows** | `set AZCOPY_CONCURRENCY_VALUE=<value>` |
| **Linux** | `export AZCOPY_CONCURRENCY_VALUE=<value>` |
| **MacOS** | `export AZCOPY_CONCURRENCY_VALUE=<value>` |

Use the `azcopy env` to check the current value of this variable.  If the value is blank, then the `AZCOPY_CONCURRENCY_VALUE` variable is set to the default value of `300`.

## Change the location of the log files

By default, log files are located in the `%USERPROFILE\\.azcopy` directory on Windows, or in the `$HOME\\.azcopy` directory on Mac and Linux. You can change this location if you need to by using these commands.

| Operating system | Command  |
|--------|-----------|
| **Windows** | `set AZCOPY_LOG_LOCATION=<value>` |
| **Linux** | `export AZCOPY_LOG_LOCATION=<value>` |
| **MacOS** | `export AZCOPY_LOG_LOCATION=<value>` |

Use the `azcopy env` to check the current value of this variable. If the value is blank, then logs are written to the default location.

## Change the default log level

By default, AzCopy log level is set to `INFO`. If you would like to reduce the log verbosity to save disk space, overwrite this setting by using the ``--log-level`` option. 

Available log levels are: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `PANIC`, and `FATAL`.

## Troubleshoot issues

AzCopy creates log and plan files for every job. You can use the logs to investigate and troubleshoot any potential problems. 

The logs will contain the status of failure (`UPLOADFAILED`, `COPYFAILED`, and `DOWNLOADFAILED`), the full path, and the reason of the failure.

By default, the log and plan files are located in the `%USERPROFILE\\.azcopy` directory on Windows or `$HOME\\.azcopy` directory on Mac and Linux.

> [!IMPORTANT]
> When submitting a request to Microsoft Support (or troubleshooting the issue involving any third party), share the redacted version of the command you want to execute. This ensures the SAS isn't accidentally shared with anybody. You can find the redacted version at the start of the log file.

### Review the logs for errors

The following command will get all errors with `UPLOADFAILED` status from the `04dc9ca9-158f-7945-5933-564021086c79` log:

**Windows**

```
Select-String UPLOADFAILED .\04dc9ca9-158f-7945-5933-564021086c79.log
```

**Linux**

```
grep UPLOADFAILED .\04dc9ca9-158f-7945-5933-564021086c79.log
```

### View and resume jobs

Each transfer operation will create an AzCopy job. Use the following command to view the history of jobs:

```
azcopy jobs list
```

To view the job statistics, use the following command:

```
azcopy jobs show <job-id>
```

To filter the transfers by status, use the following command:

```
azcopy jobs show <job-id> --with-status=Failed
```

Use the following command to resume a failed/canceled job. This command uses its identifier along with the SAS token as it isn't persistent for security reasons:

```
azcopy jobs resume <job-id> --source-sas="<sas-token>"
azcopy jobs resume <job-id> --destination-sas="<sas-token>"
```

When you resume a job, AzCopy looks at the job plan file. The plan file lists all the files that were identified for processing when the job was first created. When you resume a job, AzCopy will attempt to transfer all of the files that are listed in the plan file which weren't already transferred.