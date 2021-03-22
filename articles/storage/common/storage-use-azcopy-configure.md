---
title: Configure AzCopy with Azure Storage | Microsoft Docs
description: Configure AzCopy with Azure Storage.
author: normesta
ms.service: storage
ms.topic: how-to
ms.date: 03/22/2021
ms.author: normesta
ms.subservice: common
ms.reviewer: dineshm
---

# Configure AzCopy

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article helps you to perform advanced configuration tasks.

> [!NOTE]
> If you're looking for content to help you get started with AzCopy, see any of the following articles:
> - [Get started with AzCopy](storage-use-azcopy-v10.md)
> - [Transfer data with AzCopy and blob storage](./storage-use-azcopy-v10.md#transfer-data)
> - [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)
> - [Transfer data with AzCopy and Amazon S3 buckets](storage-use-azcopy-s3.md)

## Configure proxy settings

To configure the proxy settings for AzCopy, set the `HTTPS_PROXY` environment variable. If you run AzCopy on Windows, AzCopy automatically detects proxy settings, so you don't have to use this setting in Windows. If you choose to use this setting in Windows, it will override automatic detection.

| Operating system | Command  |
|--------|-----------|
| **Windows** | In a command prompt use: `set HTTPS_PROXY=<proxy IP>:<proxy port>`<br> In PowerShell use: `$env:HTTPS_PROXY="<proxy IP>:<proxy port>"`|
| **Linux** | `export HTTPS_PROXY=<proxy IP>:<proxy port>` |
| **macOS** | `export HTTPS_PROXY=<proxy IP>:<proxy port>` |

Currently, AzCopy doesn't support proxies that require authentication with NTLM or Kerberos.

### Bypassing a proxy

If you are running AzCopy on Windows, and you want to tell it to use _no_ proxy at all (instead of auto-detecting the settings) use these commands. With these settings, AzCopy will not look up or attempt to use any proxy.

| Operating system | Environment | Commands  |
|--------|-----------|----------|
| **Windows** | Command prompt (CMD) | `set HTTPS_PROXY=dummy.invalid` <br>`set NO_PROXY=*`|
| **Windows** | PowerShell | `$env:HTTPS_PROXY="dummy.invalid"` <br>`$env:NO_PROXY="*"`<br>|

On other operating systems, simply leave the HTTPS_PROXY variable unset if you want to use no proxy.

## Configure logging

By default, plan and log files are located in the `%USERPROFILE%\.azcopy` directory on Windows, or in the `$HOME/.azcopy` directory on Mac and Linux. You can change this location.

### Change the location of plan files

Use any of these commands.

| Operating system | Command  |
|--------|-----------|
| **Windows** | PowerShell:`$env:AZCOPY_JOB_PLAN_LOCATION="<value>"` <br> In a command prompt use:: `set AZCOPY_JOB_PLAN_LOCATION=<value>` |
| **Linux** | `export AZCOPY_JOB_PLAN_LOCATION=<value>` |
| **macOS** | `export AZCOPY_JOB_PLAN_LOCATION=<value>` |

Use the `azcopy env` to check the current value of this variable. If the value is blank, then plan files are written to the default location.

### Change the location of log files

Use any of these commands.

| Operating system | Command  |
|--------|-----------|
| **Windows** | PowerShell:`$env:AZCOPY_LOG_LOCATION="<value>"` <br> In a command prompt use:: `set AZCOPY_LOG_LOCATION=<value>`|
| **Linux** | `export AZCOPY_LOG_LOCATION=<value>` |
| **macOS** | `export AZCOPY_LOG_LOCATION=<value>` |

Use the `azcopy env` to check the current value of this variable. If the value is blank, then logs are written to the default location.

### Change the default log level

By default, AzCopy log level is set to `INFO`. If you would like to reduce the log verbosity to save disk space, overwrite this setting by using the ``--log-level`` option. 

Available log levels are: `NONE`, `DEBUG`, `INFO`, `WARNING`, `ERROR`, `PANIC`, and `FATAL`.