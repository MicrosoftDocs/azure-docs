---
title: Configure logging for BlobFuse
titleSuffix: Azure Storage
description: Learn how to configure logging for BlobFuse activity.
author: normesta
ms.author: normesta

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 1/29/2026

ms.custom: linux-related-content

# Customer intent: "As a system administrator troubleshooting BlobFuse issues, I want to configure detailed logging to capture diagnostic information and track mount operations for effective problem resolution."
---

# Configure logging for BlobFuse

This article shows you how to configure the logging behavior for BlobFuse. By default, BlobFuse logs warnings to the system log. However, you can route logs to a local directory, change which types of information appear in logs, or disable logs entirely by changing the default configuration.

## Configuration parameters

The following table describes each parameter and its default setting.

| Parameter | Description | Default value |
|-----------|-------------|---------------|
| Log type | The type of logger used by the system | Syslog |
| Log level | The severity level of logs | Warnings only |
| File path | The path to store log files | `$HOME/.blobfuse2/blobfuse2.log` |

### Log level parameter settings

The following table describes each log severity level. Choose the level most appropriate for your workload requirements.

| Log level | Description |
|---|---|
| `log_off` | Disables logging. |
| `log_crit` | Logs critical issues that prevent BlobFuse from starting. |
| `log_err` | Logs issues that result in errors being returned to the caller. For example, if you write data and then try to close the file handle, but BlobFuse fails (for whatever reason) to properly connect to Azure Storage to commit the data, this event is logged at the `log_err` level (and returning a failure to the process attempting to close the file handle). |
| `log-warning` | Logs issues that BlobFuse encounters that might not be actual errors, but are still valuable to log. For example, if a network operation fails but it can be retried, a warning is logged before automatic retries begin. |
| `log_info` | Logs all operations relating to uploading or downloading blob data to Azure Storage. Some other operations are also logged at this level, which might be informative if problems are encountered. |
| `log-trace` | Logs trace statements for all calls into BlobFuse. This level is very verbose and contains helpful debugging information such as line numbers, method names, method inputs, and return values. This level is probably only helpful if you're also looking at the source code. |
| `log-debug` | Logs extra helpful debugging information. |

### Configure log settings

The following example sets these values as parameters to the `mount` command.

```bash
sudo blobfuse2 mount ~/mycontainer --log-level=log_err --file-path=$HOME/.mycustomdirectory/blobfuse2.log
```

The following example shows how these settings appear in the BlobFuse configuration file:

```yaml
logging:
  type: base
  level: log_err
  file-path: $HOME/.mycustomdirectory/blobfuse2.log
```

> [!NOTE]
> You can modify logging behavior after you mount a container by changing settings in the configuration file and saving the file. If you use only command line parameters to set behavior, you must first unmount the container and then mount it again by using the `mount` command along with the correct parameters. 

### Find logs in Syslog

By default, the system writes logs to the `/var/log/syslog` file. If you choose to use syslog as the output location, you can find logs by using the `grep` command and pass the string `blobfuse` as a parameter. The following example shows how to find BlobFuse logs in the syslog.

```bash
grep blobfuse /var/log/syslog
```

### Route logs to a local directory

The simplest way to route logs to a location other than the `/var/log/syslog` file is to set the output location to `base` in your configuration file.

However, if you want to keep the output location set to `syslog`, you can instead redirect logs from the `/var/log/syslog` file to a separate file location. The following example shows how to do this:

> [!NOTE]
> The files required for these commands are part of the BlobFuse package. You can also find them in the source code under the `systemd` directory.

```bash
copy setup/11-blobfuse2.conf to /etc/rsyslog.d/
copy setup/blobfuse2-logrotate to /etc/logrotate.d/
service rsyslog restart
```

## Enable LibFuse logging

The LibFuse library provides a `-d` option in the mount command to enable verbose logging on the console. This option enables debug logs in the library and prints all system calls being made along with their return values on the console. Alternatively, you can enable LibFuse logging by specifying the configuration file parameter `libfuse.fuse-trace: true`.

## Enable SDK logging

If the logs indicate that the issue comes from the storage SDK, turn on SDK logging to get detailed logs of the REST calls. This information helps you diagnose whether an issue is in BlobFuse, the SDK, or the service. To enable SDK logging, specify the configuration file parameter `azstorage.sdk-trace: true`.

## Next steps

- [Monitor BlobFuse mount activities and resource usage](blobfuse2-health-monitor.md).
- [Troubleshooting BlobFuse](blobfuse2-troubleshooting.md)
- [Known issues with BlobFuse](blobfuse2-known-issues.md)
- [BlobFuse frequently asked questions](blobfuse2-faq.yml)

## See also

- [What is BlobFuse?](blobfuse2-what-is.md)
