---
title: Syslog troubleshooting on Azure Monitor Agent for Linux
description: Guidance for troubleshooting rsyslog issues on Linux virtual machines, scale sets with Azure Monitor Agent, and data collection rules.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 5/31/2023
ms.custom: references_region, linux-related-content
ms.reviewer: shseth
---
# Syslog troubleshooting guide for Azure Monitor Agent for Linux

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

Overview of Azure Monitor Agent for Linux Syslog collection and supported RFC standards:

- Azure Monitor Agent installs an output configuration for the system Syslog daemon during the installation process. The configuration file specifies the way events flow between the Syslog daemon and Azure Monitor Agent.
- For `rsyslog` (most Linux distributions), the configuration file is `/etc/rsyslog.d/10-azuremonitoragent-omfwd.conf`. For `syslog-ng`, the configuration file is `/etc/syslog-ng/conf.d/azuremonitoragent-tcp.conf`.
- Azure Monitor Agent listens to a TCP port to receive events from `rsyslog` / `syslog-ng`. The port for this communication is logged at `/etc/opt/microsoft/azuremonitoragent/config-cache/syslog.port`.
  > [!NOTE]
  > Before Azure Monitor Agent version 1.28, it used a Unix domain socket instead of TCP port to receive events from rsyslog. `omfwd` output module in `rsyslog` offers spooling and retry mechanisms for improved reliability.
- The Syslog daemon uses queues when Azure Monitor Agent ingestion is delayed or when Azure Monitor Agent isn't reachable.
- Azure Monitor Agent ingests Syslog events via the previously mentioned socket and filters them based on facility or severity combination from data collection rule (DCR) configuration in `/etc/opt/microsoft/azuremonitoragent/config-cache/configchunks/`. Any `facility` or `severity` not present in the DCR is dropped.
- Azure Monitor Agent attempts to parse events in accordance with **RFC3164** and **RFC5424**. It also knows how to parse the message formats listed on [this website](./azure-monitor-agent-overview.md#data-sources-and-destinations).
- Azure Monitor Agent identifies the destination endpoint for Syslog events from the DCR configuration and attempts to upload the events.
  > [!NOTE]
  > Azure Monitor Agent uses local persistency by default. All events received from `rsyslog` or `syslog-ng` are queued in `/var/opt/microsoft/azuremonitoragent/events` if they fail to be uploaded.

## Issues

You might encounter the following issues.

### Rsyslog data isn't uploaded because of a full disk space issue on Azure Monitor Agent for Linux

The next sections describe the issue.

#### Symptom
**Syslog data is not uploading**: When you inspect the error logs at `/var/opt/microsoft/azuremonitoragent/log/mdsd.err`, you see entries about *Error while inserting item to Local persistent store…No space left on device* similar to the following snippet:

```
2021-11-23T18:15:10.9712760Z: Error while inserting item to Local persistent store syslog.error: IO error: No space left on device: While appending to file: /var/opt/microsoft/azuremonitoragent/events/syslog.error/000555.log: No space left on device
```

#### Cause
Azure Monitor Agent for Linux buffers events to `/var/opt/microsoft/azuremonitoragent/events` prior to ingestion. On a default Azure Monitor Agent for Linux installation, this directory takes ~650 MB of disk space at idle. The size on disk increases when it's under sustained logging load. It gets cleaned up about every 60 seconds and reduces back to ~650 MB when the load returns to idle.

#### Confirm the issue of a full disk
The `df` command shows almost no space available on `/dev/sda1`, as shown in the following output. Note that you should examine the line item that correlates to the log directory (for example, `/var/log` or `/var` or `/`).

```bash
   df -h
```
```output
Filesystem Size  Used Avail Use% Mounted on
udev        63G     0   63G   0% /dev
tmpfs       13G  720K   13G   1% /run
/dev/sda1   29G   29G  481M  99% /
tmpfs       63G     0   63G   0% /dev/shm
tmpfs      5.0M     0  5.0M   0% /run/lock
tmpfs       63G     0   63G   0% /sys/fs/cgroup
/dev/sda15 105M  4.4M  100M   5% /boot/efi
/dev/sdb1  251G   61M  239G   1% /mnt
tmpfs       13G     0   13G   0% /run/user/1000
```

You can use the `du` command to inspect the disk to determine which files are causing the disk to be full. For example:

```bash
   cd /var/log
   du -h syslog*
```
```output
6.7G    syslog
18G     syslog.1
```

In some cases, `du` might not report any large files or directories. It might be possible that a [file marked as (deleted) is taking up the space](https://unix.stackexchange.com/questions/182077/best-way-to-free-disk-space-from-deleted-files-that-are-held-open). This issue can happen when some other process has attempted to delete a file, but a process with the file is still open. You can use the `lsof` command to check for such files. In the following example, we see that `/var/log/syslog` is marked as deleted but it takes up 3.6 GB of disk space. It hasn't been deleted because a process with PID 1484 still has the file open.

```bash
   sudo lsof +L1
```

```output
COMMAND   PID   USER   FD   TYPE DEVICE   SIZE/OFF NLINK  NODE NAME
none      849   root  txt    REG    0,1       8632     0 16764 / (deleted)
rsyslogd 1484 syslog   14w   REG    8,1 3601566564     0 35280 /var/log/syslog (deleted)
```

### Rsyslog default configuration logs all facilities to /var/log/
On some popular distros (for example, Ubuntu 18.04 LTS), rsyslog ships with a default configuration file (`/etc/rsyslog.d/50-default.conf`), which logs events from nearly all facilities to disk at `/var/log/syslog`. RedHat/CentOS family Syslog events are stored under `/var/log/` but in a different file:  `/var/log/messages`.

Azure Monitor Agent doesn't rely on Syslog events being logged to `/var/log/`. Instead, it configures the rsyslog service to forward events over a TCP port directly to the `azuremonitoragent` service process (mdsd).

#### Fix: Remove high-volume facilities from /etc/rsyslog.d/50-default.conf
If you're sending a high log volume through rsyslog and your system is set up to log events for these facilities, consider modifying the default rsyslog config to avoid logging and storing them under `/var/log/`. The events for this facility would still be forwarded to Azure Monitor Agent because rsyslog uses a different configuration for forwarding placed in `/etc/rsyslog.d/10-azuremonitoragent-omfwd.conf`.

1. For example, to remove `local4` events from being logged at `/var/log/syslog` or `/var/log/messages`, change this line in `/etc/rsyslog.d/50-default.conf` from this snippet:

    ```config
    *.*;auth,authpriv.none          -/var/log/syslog
    ```

    To this snippet (add `local4.none;`):

    ```config
    *.*;local4.none;auth,authpriv.none          -/var/log/syslog
    ```

1. `sudo systemctl restart rsyslog`

### Azure Monitor Agent for Linux event buffer is filling a disk

If you observe the `/var/opt/microsoft/azuremonitor/events` directory growing unbounded (10 GB or higher) and not reducing in size, [file a ticket](#file-a-ticket). For **Summary**, enter **Azure Monitor Agent Event Buffer is filling disk**. For **Problem type**, enter **I need help configuring data collection from a VM**.

[!INCLUDE [azure-monitor-agent-file-a-ticket](../../../includes/azure-monitor-agent/azure-monitor-agent-file-a-ticket.md)]
