---
title: Troubleshoot AzCopy V10 issues in Azure Storage by using log files | Microsoft Docs
description: Learn how to use logs to find and fix issues with AzCopy v10 in Azure Storage.
author: normesta
ms.service: storage
ms.topic: how-to
ms.date: 03/22/2021
ms.author: normesta
ms.subservice: common
ms.reviewer: dineshm
---

# Troubleshoot AzCopy V10 issues in Azure Storage by using log files

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article helps you to troubleshoot issues that can arise as you use AzCopy by using log files

> [!NOTE]
> If you're looking for content to help you get started with AzCopy, see [Get started with AzCopy](storage-use-azcopy-v10.md).

## Log and plan files

AzCopy creates *log* and *plan* files for every job. You can use these logs to investigate and troubleshoot any potential problems. 

The logs will contain the status of failure (`UPLOADFAILED`, `COPYFAILED`, and `DOWNLOADFAILED`), the full path, and the reason of the failure.

By default, the log and plan files are located in the `%USERPROFILE%\.azcopy` directory on Windows or `$HOME$\.azcopy` directory on Mac and Linux, but you can change that location. 

The relevant error isn't necessarily the first error that appears in the file. For errors such as network errors, timeouts and Server Busy errors, AzCopy will retry up to 20 times and usually the retry process succeeds.  The first error that you see might be something harmless that was successfully retried.  So instead of looking at the first error in the file, look for the errors that are near `UPLOADFAILED`, `COPYFAILED`, or `DOWNLOADFAILED`. 

> [!IMPORTANT]
> When submitting a request to Microsoft Support (or troubleshooting the issue involving any third party), share the redacted version of the command you want to execute. This ensures the SAS isn't accidentally shared with anybody. You can find the redacted version at the start of the log file.

## Review the logs for errors

The following command will get all errors with `UPLOADFAILED` status from the `04dc9ca9-158f-7945-5933-564021086c79` log:

**Windows (PowerShell)**

```
Select-String UPLOADFAILED .\04dc9ca9-158f-7945-5933-564021086c79.log
```

**Linux**

```
grep UPLOADFAILED .\04dc9ca9-158f-7945-5933-564021086c79.log
```

## View and resume jobs

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

> [!TIP]
> Enclose path arguments such as the SAS token with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

When you resume a job, AzCopy looks at the job plan file. The plan file lists all the files that were identified for processing when the job was first created. When you resume a job, AzCopy will attempt to transfer all of the files that are listed in the plan file which weren't already transferred.

## Change the location of plan files

Use any of these commands.

| Operating system | Command  |
|--------|-----------|
| **Windows** | PowerShell:`$env:AZCOPY_JOB_PLAN_LOCATION="<value>"` <br> In a command prompt use:: `set AZCOPY_JOB_PLAN_LOCATION=<value>` |
| **Linux** | `export AZCOPY_JOB_PLAN_LOCATION=<value>` |
| **macOS** | `export AZCOPY_JOB_PLAN_LOCATION=<value>` |

Use the `azcopy env` to check the current value of this variable. If the value is blank, then plan files are written to the default location.

## Change the location of log files

Use any of these commands.

| Operating system | Command  |
|--------|-----------|
| **Windows** | PowerShell:`$env:AZCOPY_LOG_LOCATION="<value>"` <br> In a command prompt use:: `set AZCOPY_LOG_LOCATION=<value>`|
| **Linux** | `export AZCOPY_LOG_LOCATION=<value>` |
| **macOS** | `export AZCOPY_LOG_LOCATION=<value>` |

Use the `azcopy env` to check the current value of this variable. If the value is blank, then logs are written to the default location.

## Change the default log level

By default, AzCopy log level is set to `INFO`. If you would like to reduce the log verbosity to save disk space, overwrite this setting by using the ``--log-level`` option. 

Available log levels are: `NONE`, `DEBUG`, `INFO`, `WARNING`, `ERROR`, `PANIC`, and `FATAL`.

## Remove plan and log files

If you want to remove all plan and log files from your local machine to save disk space, use the `azcopy jobs clean` command.

To remove the plan and log files associated with only one job, use `azcopy jobs rm <job-id>`. Replace the `<job-id>` placeholder in this example with the job id of the job.

## See also

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [AzCopy V10 with Azure Storage FAQ](storage-use-azcopy-faq.yml)
