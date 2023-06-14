---
title: Troubleshoot replication of Azure VMs with Azure Site Recovery
description: Troubleshoot replication in Azure VM disaster recovery with Azure Site Recovery
author: ankitaduttaMSFT
manager: rochakm
ms.topic: troubleshooting
ms.date: 03/07/2022
ms.service: site-recovery
ms.custom: engagement-fy23
---

# Troubleshoot replication in Azure VM disaster recovery

This article describes common problems in Azure Site Recovery when you're replicating and recovering Azure virtual machines (VM) from one region to another region. It also explains how to troubleshoot the common problems. For more information about supported configurations, see the [support matrix for replicating Azure VMs](./azure-to-azure-support-matrix.md).

Azure Site Recovery consistently replicates data from the source region to the disaster recovery region. It also creates a crash-consistent recovery point every 5 minutes. If Site Recovery can't create recovery points for 60 minutes, it alerts you with this information:

```plaintext
Error message: "No crash consistent recovery point available for the VM in the last 60 minutes."

Error ID: 153007
```

The following sections describe causes and solutions.

## High data change rate on the source virtual machine

Azure Site Recovery creates an event if the data change rate on the source virtual machine is higher than the supported limits. To see whether the problem is because of high churn, go to **Replicated items** > **VM** > **Events - last 72 hours**.
You should see the event **Data change rate beyond supported limits**:

:::image type="content" source="./media/site-recovery-azure-to-azure-troubleshoot/data_change_event.png" alt-text="Azure Site Recovery page that shows a high data change rate that is too high.":::

If you select the event, you should see the exact disk information:

:::image type="content" source="./media/site-recovery-azure-to-azure-troubleshoot/data_change_event2.png" alt-text="Page that shows the data change rate event details.":::

### Azure Site Recovery limits

The following table provides the Azure Site Recovery limits. These limits are based on our tests, but they can't cover all possible application input-output (I/O) combinations. Actual results can vary based on your application I/O mix.

There are two limits to consider: data churn per disk and data churn per virtual machine. Let's look at the Premium P20 disk in the following table for an example. For a single VM, Site Recovery can handle 5 MB/s of churn per disk with a maximum of five such disks. Site Recovery has a limit of 54 MB/s of total churn per VM.

**Replication storage target** | **Average I/O size for source disk** |**Average data churn for source disk** | **Total data churn per day for source data disk**
---|---|---|---
Standard storage | 8 KB    | 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 8 KB    | 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 16 KB | 4 MB/s |    336 GB per disk
Premium P10 or P15 disk | 32 KB or greater | 8 MB/s | 672 GB per disk
Premium P20 or P30 or P40 or P50 disk | 8 KB    | 5 MB/s | 421 GB per disk
Premium P20 or P30 or P40 or P50 disk | 16 KB or greater |20 MB/s | 1684 GB per disk

### Solution

Azure Site Recovery has limits on data change rates, depending on the type of disk. To see if this problem is recurring or temporary, find the data change rate of the affected virtual machine. Go to the source virtual machine, find the metrics under **Monitoring**, and add the metrics as shown in this screenshot:

:::image type="content" source="./media/site-recovery-azure-to-azure-troubleshoot/churn.png" alt-text="Page that shows the three-step process for finding the data change rate.":::

1. Select **Add metric**, and add **OS Disk Write Bytes/Sec** and **Data Disk Write Bytes/Sec**.
1. Monitor the spike as shown in the screenshot.
1. View the total write operations happening across OS disks and all data disks combined. These metrics might not give you information at the per-disk level, but they indicate the total pattern of data churn.

A spike in data change rate might come from an occasional data burst. If the data change rate is greater than 10 MB/s (for Premium) or 2 MB/s (for Standard) and comes down, replication will catch up. If the churn is consistently well beyond the supported limit, consider one of these options:

- Exclude the disk that's causing a high data-change rate: First, disable the replication. Then you can exclude the disk by using [PowerShell](azure-to-azure-exclude-disks.md).
- Change the tier of the disaster recovery storage disk: This option is possible only if the disk data churn is less than 20 MB/s. For example, a VM with a P10 disk has a data churn of greater than 8 MB/s but less than 10 MB/s. If the customer can use a P30 disk for target storage during protection, the problem can be solved. This solution is only possible for machines that are using Premium-Managed Disks. Follow these steps:

  1. Go to **Disks** of the affected replicated machine and copy the replica disk name.
  1. Go to this replica of the managed disk.
  1. You might see a banner in **Overview** that says an SAS URL has been generated. Select this banner and cancel the export. Ignore this step if you don't see the banner.
  1. As soon as the SAS URL is revoked, go to **Size + Performance** for the managed disk. Increase the size so that Site Recovery supports the observed churn rate on the source disk.

## Network connectivity problems

### Network latency to a cache storage account

Site Recovery sends replicated data to the cache storage account. You might experience network latency if uploading the data from a virtual machine to the cache storage account is slower than 4 MB in 3 seconds.

To check for a problem related to latency, use [AzCopy](../storage/common/storage-use-azcopy-v10.md). You can use this command-line utility to upload data from the virtual machine to the cache storage account. If the latency is high, check whether you're using a network virtual appliance (NVA) to control outbound network traffic from VMs. The appliance might get throttled if all the replication traffic passes through the NVA.

We recommend creating a network service endpoint in your virtual network for "Storage" so that the replication traffic doesn't go to the NVA. For more information, see [Network virtual appliance configuration](azure-to-azure-about-networking.md#network-virtual-appliance-configuration).

### Network connectivity

For Site Recovery replication to work, it needs the VM to provide outbound connectivity to specific URLs or IP ranges. You might have your VM behind a firewall or use network security group (NSG) rules to control outbound connectivity. If so, you might experience issues. To make sure all the URLs are connected, see [Outbound connectivity for URLs](azure-to-azure-about-networking.md#outbound-connectivity-for-urls).

## Error ID 153006 - No app-consistent recovery point available for the VM in the past "X" minutes

Following are some of the most common issues.

### Known issue in SQL server 2008/2008 R2

**How to fix:** There's a known issue with SQL server 2008/2008 R2. Refer to the article [Azure Site Recovery Agent or other non-component VSS backup fails for a server hosting SQL Server 2008 R2](https://support.microsoft.com/help/4504103/non-component-vss-backup-fails-for-server-hosting-sql-server-2008-r2).

### Azure Site Recovery jobs fail on servers hosting any version of SQL Server instances with AUTO_CLOSE DBs

**How to fix:** Refer to the article [Non-component VSS backups such as Azure Site Recovery jobs fail on servers hosting SQL Server instances with AUTO_CLOSE DBs](https://support.microsoft.com/help/4504104/non-component-vss-backups-such-as-azure-site-recovery-jobs-fail-on-ser).

### Known issue in SQL Server 2016 and 2017

**How to fix**: Refer to the article [Cumulative Update 16 for SQL Server 2017](https://support.microsoft.com/help/4508218/cumulative-update-16-for-sql-server-2017).

### You're using Azure Storage Spaces Direct Configuration

**How to fix**: Azure Site Recovery can't create application consistent recovery point for Storage Spaces Direct Configuration. [Configure the replication policy](azure-to-azure-how-to-enable-replication-s2d-vms.md).

### App-consistency not enabled on Linux servers

**How to fix** : Azure Site Recovery for Linux Operation System supports application custom scripts for app-consistency. The custom script with pre and post options will be used by the Azure Site Recovery Mobility Agent for app-consistency. [Here](./site-recovery-faq.yml) are the steps to enable it.

### More causes because of VSS-related issues:

To troubleshoot further, check the files on the source machine to get the exact error code for failure:

`C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\Application Data\ApplicationPolicyLogs\vacp.log`

To locate the errors, open the _vacp.log_ file in a text editor search for the string **vacpError**.

```plaintext
Ex: vacpError:220#Following disks are in FilteringStopped state [\\.\PHYSICALDRIVE1=5, ]#220|^|224#FAILED: CheckWriterStatus().#2147754994|^|226#FAILED to revoke tags.FAILED: CheckWriterStatus().#2147754994|^|
```

In the preceding example, **2147754994** is the error code that tells you about the failure following this sentence.

#### VSS writer is not installed - Error 2147221164

**How to fix**: To generate application consistency tag, Azure Site Recovery uses Volume Shadow Copy Service (VSS). Site Recovery installs a VSS Provider for its operation to take app consistency snapshots. Azure Site Recovery installs this VSS Provider as a service. If VSS Provider isn't installed, the application consistency snapshot creation fails. It shows the **error ID 0x80040154 Class not registered**. Refer to the article for [VSS writer installation troubleshooting](vmware-azure-troubleshoot-push-install.md#vss-installation-failures).

#### VSS writer is disabled - Error 2147943458

**How to fix**: To generate the application consistency tag, Azure Site Recovery uses VSS. Site Recovery installs a VSS Provider for its operation to take app consistency snapshots. This VSS Provider is installed as a service. If you don't have the VSS Provider service enabled, the application consistency snapshot creation fails. It shows the error: **The specified service is disabled and cannot be started (0x80070422)**.

If VSS is disabled:

- Verify that the startup type of the VSS Provider service is set to **Automatic**.
- Restart the following services:
  - VSS service.
  - Azure Site Recovery VSS Provider.
  - VDS service.

#### VSS PROVIDER NOT_REGISTERED - Error 2147754756

**How to fix**: To generate the application consistency tag, Azure Site Recovery uses VSS. Check whether the Azure Site Recovery VSS Provider service is installed.

Use the following commands to reinstall VSS Provider:

1. Uninstall existing provider:

   `"C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\InMageVSSProvider_Uninstall.cmd"`

1. Reinstall VSS Provider:

   `"C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\InMageVSSProvider_Install.cmd"`

Verify that the startup type of the VSS Provider service is set to **Automatic**.

Restart the following services:

- VSS service.
- Azure Site Recovery VSS Provider.
- VDS service.
