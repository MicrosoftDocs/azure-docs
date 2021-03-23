---
title: AzCopy v10 configuration setting reference | Microsoft Docs
description: This article provides reference information for AzCopy V10 configuration settings.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 03/23/2021
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# AzCopy v10 configuration setting reference

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article contains a list of configuration settings for AzCopy v10.

> [!NOTE]
> If you're looking for content to help you get started with AzCopy, see [Get started with AzCopy](storage-use-azcopy-v10.md).

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

> [!NOTE]
> For information about how to use logs to find and fix problems, see [Troubleshoot AzCopy V10 issues in Azure Storage by using log files](storage-use-azcopy-configure.md).

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

### Authorize with Google Cloud Storage

To authorize with Google Cloud Storage, you'll use a service account key. For information about how to create a service account key, see [Creating and managing service account keys](https://cloud.google.com/iam/docs/creating-managing-service-account-keys).

After you've obtained a service key, set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to absolute path to the service account key file:

| Operating system | Command  |
|--------|-----------|
| **Windows** | `set GOOGLE_APPLICATION_CREDENTIALS=<path-to-service-account-key>` |
| **Linux** | `export GOOGLE_APPLICATION_CREDENTIALS=<path-to-service-account-key>` |
| **macOS** | `export GOOGLE_APPLICATION_CREDENTIALS=<path-to-service-account-key>` |

### Authorize with AWS S3

Gather your AWS access key and secret access key, and then set these environment variables:

| Operating system | Command  |
|--------|-----------|
| **Windows** | `set AWS_ACCESS_KEY_ID=<access-key>`<br>`set AWS_SECRET_ACCESS_KEY=<secret-access-key>` |
| **Linux** | `export AWS_ACCESS_KEY_ID=<access-key>`<br>`export AWS_SECRET_ACCESS_KEY=<secret-access-key>` |
| **macOS** | `export AWS_ACCESS_KEY_ID=<access-key>`<br>`export AWS_SECRET_ACCESS_KEY=<secret-access-key>`|

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


## See also

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Optimize the performance of AzCopy v10 with Azure Storage](storage-use-azcopy-optimize.md)
- [Troubleshoot AzCopy V10 issues in Azure Storage by using log files](storage-use-azcopy-configure.md)
- [AzCopy V10 with Azure Storage FAQ](storage-use-faq.yml)
