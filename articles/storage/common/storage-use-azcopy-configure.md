---
title: Find errors & resume jobs with logs in AzCopy (Azure Storage)
description: Learn how to use logs to diagnose errors, and to resume jobs that are paused by using plan files. 
author: normesta
ms.service: azure-storage
ms.topic: how-to
ms.date: 10/25/2025
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: dineshm
# Customer intent: As a cloud operations engineer, I want to analyze job logs and manage plan files in AzCopy, so that I can diagnose errors and efficiently resume data transfer tasks.
---

# Find errors and resume jobs by using log and plan files in AzCopy

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article helps you use logs to diagnose errors, and then use plan files to resume jobs. This article also shows how to configure log and plan files by changing their verbosity level, and the default location where they're stored.

> [!NOTE]
> For content to help you get started with AzCopy, see [Get started with AzCopy](storage-use-azcopy-v10.md). This article applies to AzCopy **V10** as is this is the currently supported version of AzCopy. If you need to use a previous version of AzCopy, see [Use the previous version of AzCopy](storage-use-azcopy-v10.md#previous-version).

## Log and plan files

AzCopy creates *log* and *plan* files for every job. You can use these logs to investigate and troubleshoot any potential problems.

The logs contain the status of failure (`UPLOADFAILED`, `COPYFAILED`, and `DOWNLOADFAILED`), the full path, and the reason for the failure.

By default, the log and plan files are located in the `%USERPROFILE%\.azcopy` directory on Windows or `$HOME$\.azcopy` directory on Mac and Linux, but you can change that location.

The relevant error isn't necessarily the first error that appears in the file. For errors such as network errors, timeouts, and server busy errors, AzCopy retries up to 20 times and usually the retry process succeeds. The first error that you see might be something harmless that was successfully retried. So instead of looking at the first error in the file, look for the errors that are near `UPLOADFAILED`, `COPYFAILED`, or `DOWNLOADFAILED`.

> [!IMPORTANT]
> When submitting a request to Microsoft Support (or troubleshooting the issue involving any third party), share the redacted version of the command you want to execute. This version ensures the SAS isn't accidentally shared with anybody. You can find the redacted version at the start of the log file.

## Review the logs for errors

The following command gets all errors with `UPLOADFAILED` status from the `04dc9ca9-158f-7945-5933-564021086c79` log:

### [Linux](#tab/linux)

```bash
Select-String UPLOADFAILED .\04dc9ca9-158f-7945-5933-564021086c79.log
```

### [Windows](#tab/windows)

```powershell
Select-String UPLOADFAILED .\04dc9ca9-158f-7945-5933-564021086c79.log

```

---

## View and resume jobs

Each transfer operation creates an AzCopy job. Use the following command to view the history of jobs:

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

> [!TIP]
> The value of the `--with-status` flag is case-sensitive. 

Use the following command to resume a failed or canceled job. This command uses the job identifier along with the SAS token as it isn't persistent for security reasons:

```
azcopy jobs resume <job-id> --source-sas="<sas-token>" --destination-sas="<sas-token>"
```

> [!TIP]
> Enclose path arguments such as the SAS token with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

When you resume a job, AzCopy looks at the job plan file. The plan file lists all the files that were identified for processing when the job was first created. When you resume a job, AzCopy attempts to transfer all of the files that are listed in the plan file and weren't already transferred.

## Change the location of plan files

Use the following command.

### [Linux](#tab/linux)

```bash
export AZCOPY_JOB_PLAN_LOCATION=<value>
```

### [Windows](#tab/windows)

```powershell
$env:AZCOPY_JOB_PLAN_LOCATION="<value>"
```

Use the `azcopy env` command to check the current value of this variable. If the value is blank, then plan files are written to the default location.

---

## Change the location of log files

Use the following command.

### [Linux](#tab/linux)

```bash
export AZCOPY_LOG_LOCATION=<value>
```

### [Windows](#tab/windows)

```powershell
$env:AZCOPY_LOG_LOCATION="<value>"
```

Use the `azcopy env` command to check the current value of this variable. If the value is blank, then logs are written to the default location.

---

## Change the default log level

By default, AzCopy sets the log level to `INFO`. To reduce the log verbosity and save disk space, use the ``--log-level`` option to overwrite this setting.

Available log levels are: `DEBUG`, `INFO`, `WARNING`, `ERROR`, and `NONE`.

## Remove plan and log files

To remove all plan and log files from your local machine and save disk space, use the `azcopy jobs clean` command.

To remove the plan and log files for only one job, use `azcopy jobs rm <job-id>`. Replace the `<job-id>` placeholder in this example with the job ID of the job.

## See also

- [Get started with AzCopy](storage-use-azcopy-v10.md)
