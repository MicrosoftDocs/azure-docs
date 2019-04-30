---
title: Configure, optimize, and troubleshoot AzCopy | Microsoft Docs
description: Configure, optimize, and troubleshoot AzCopy.
services: storage
author: normesta
ms.service: storage
ms.topic: article
ms.date: 04/23/2019
ms.author: normesta
ms.subservice: common
---

# Configure, optimize, and troubleshoot AzCopy

## Advanced configuration

### Configure proxy settings

To configure the proxy settings for AzCopy v10, set the environment variable https_proxy by using the following command:

```cmd
# For Windows:
set https_proxy=<proxy IP>:<proxy port>
# For Linux:
export https_proxy=<proxy IP>:<proxy port>
# For MacOS
export https_proxy=<proxy IP>:<proxy port>
```

### Optimize throughput

Set the environment variable AZCOPY_CONCURRENCY_VALUE to configure the number of concurrent requests, and to control the throughput performance and resource consumption. The value is set to 300 by default. Reducing the value will limit the bandwidth and CPU used by AzCopy v10.

```cmd
# For Windows:
set AZCOPY_CONCURRENCY_VALUE=<value>
# For Linux:
export AZCOPY_CONCURRENCY_VALUE=<value>
# For MacOS
export AZCOPY_CONCURRENCY_VALUE=<value>
# To check the current value of the variable on all the platforms
.\azcopy env
# If the value is blank then the default value is currently in use
```

### Change the location of the log files

You can change the location of the log files if needed or to avoid filling up the OS disk.

```cmd
# For Windows:
set AZCOPY_LOG_LOCATION=<value>
# For Linux:
export AZCOPY_LOG_LOCATION=<value>
# For MacOS
export AZCOPY_LOG_LOCATION=<value>
# To check the current value of the variable on all the platforms
.\azcopy env
# If the value is blank, then the default value is currently in use
```
### Change the default log level 

By default, AzCopy log level is set to INFO. If you would like to reduce the log verbosity to save disk space, overwrite the setting using ``--log-level`` option. Available log levels are: DEBUG, INFO, WARNING, ERROR, PANIC, and FATAL.

### Review the logs for errors

The following command will get all errors with UPLOADFAILED status from the 04dc9ca9-158f-7945-5933-564021086c79 log:

```azcopy
cat 04dc9ca9-158f-7945-5933-564021086c79.log | grep -i UPLOADFAILED
```

## Troubleshooting

AzCopy creates log files and plan files for every job. You can use the logs to investigate and troubleshoot any potential problems. The logs will contain the status of failure (UPLOADFAILED, COPYFAILED, and DOWNLOADFAILED), the full path, and the reason of the failure. The job logs and plan files are located in the %USERPROFILE\\.azcopy folder on Windows or $HOME\\.azcopy folder on Mac and Linux.

> [!IMPORTANT]
> When submitting a request to Microsoft Support (or troubleshooting the issue involving any third party), share the redacted version of the command you want to execute. This ensures the SAS isn't accidentally shared with anybody. You can find the redacted version at the start of the log file.

### View and resume jobs

Each transfer operation will create an AzCopy job. Use the following command to view the history of jobs:

```azcopy
.\azcopy jobs list
```

To view the job statistics, use the following command:

```azcopy
.\azcopy jobs show <job-id>
```

To filter the transfers by status, use the following command:

```azcopy
.\azcopy jobs show <job-id> --with-status=Failed
```

Use the following command to resume a failed/canceled job. This command uses its identifier along with the SAS token as it isn't persistent for security reasons:

```azcopy
.\azcopy jobs resume <jobid> --source-sas="<sastokenhere>"
.\azcopy jobs resume <jobid> --destination-sas="<sastokenhere>"
```
