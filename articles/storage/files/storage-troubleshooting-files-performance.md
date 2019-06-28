---
title: Azure Files performance troubleshooting guide
description: Known performance issues with Azure file shares and associated workarounds.
services: storage
author: gunjanj
ms.service: storage
ms.topic: article
ms.date: 04/25/2019
ms.author: gunjanj
ms.subservice: files
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# Troubleshoot Azure Files performance issues

This article lists some common problems related to Azure file shares. It provides potential causes and workarounds when these problems are encountered.

## High latency, low throughput, and general performance issues

### Cause 1: Share experiencing throttling

The default quota on a premium share is 100 GiB, which provides 100 baseline IOPS (with a potential to burst up to 300 for an hour). For more information on provision and its relationship to IOPS, see the [Provisioned shares](storage-files-planning.md#provisioned-shares) section of the planning guide.

To confirm if your share is being throttled, you can leverage Azure Metrics in the portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **All services** and then search for **Metrics**.

1. Select **Metrics**.

1. Select your storage account as the resource.

1. Select **File** as the metric namespace.

1. Select **Transactions** as the metric.

1. Add a filter for **ResponseType** and check to see if any requests have a response code of **SuccessWithThrottling** (for SMB) or **ClientThrottlingError** (for REST).

![Metrics options for premium fileshares](media/storage-troubleshooting-premium-fileshares/metrics.png)

### Solution

- Increase share provisioned capacity by specifying a higher quota on your share.

### Cause 2: Metadata/namespace heavy workload

If the majority of your requests are metadata centric, (such as createfile/openfile/closefile/queryinfo/querydirectory) then the latency will be worse when compared to read/write operations.

To confirm if most of your requests are metadata centric, you can use the same steps as above. Except instead of adding a filter for **ResponseType**, add a filter for **API Name**.

![Filter for API Name in your metrics](media/storage-troubleshooting-premium-fileshares/MetadataMetrics.png)

### Workaround

- Check if the application can be modified to reduce the number of metadata operations.

### Cause 3: Single-threaded application

If the application being used by the customer is single-threaded, this can result in significantly lower IOPS/throughput than the maximum possible based on your provisioned share size.

### Solution

- Increase application parallelism by increasing the number of threads.
- Switch to applications where parallelism is possible. For example, for copy operations, customers could use AzCopy or RoboCopy from Windows clients or the **parallel** command on Linux clients.

## Very high latency for requests

### Cause

The client VM could be located in a different region than the file share.

### Solution

- Run the application from a VM that is located in the same region as the file share.

## Client unable to achieve maximum throughput supported by the network

One potential cause of this is a lack fo SMB multi-channel support. Currently, Azure file shares only support single channel, so there is only one connection from the client VM to the server. This single connection is pegged to a single core on the client VM, so the maximum throughput achievable from a VM is bound by a single core.

### Workaround

- Obtaining a VM with a bigger core may help improve throughput.
- Running the client application from multiple VMs will increase throughput.
- Use REST APIs where possible.

## Throughput on Linux clients is significantly lower when compared to Windows clients.

### Cause

This is a known issue with the implementation of SMB client on Linux.

### Workaround

- Spread the load across multiple VMs
- On the same VM, use multiple mount points with **nosharesock** option, and spread the load across these mount points.

## High latencies for metadata heavy workloads involving extensive open/close operations.

### Cause

Lack of support for directory leases.

### Workaround

- If possible, avoid excessive opening/closing handle on the same directory within a short period of time.
- For Linux VMs, increase the directory entry cache timeout by specifying **actimeo=<sec>** as a mount option. By default, it is one second, so a larger value like three or five might help.
- For Linux VMs, upgrade the kernel to 4.20 or higher.

## Low IOPS on CentOS/RHEL

### Cause

IO depth greater than one is not supported on CentOS/RHEL.

### Workaround

- Upgrade to CentOS 8 / RHEL 8.
- Change to Ubuntu.

## Slow file copying to and from Azure Files in Linux

If you are experiencing slow file copying to and from Azure Files, take a look at the [Slow file copying to and from Azure Files in Linux](storage-troubleshoot-linux-file-connection-problems.md#slow-file-copying-to-and-from-azure-files-in-linux) section in the Linux troubleshooting guide.

## Jittery/saw-tooth pattern for IOPS

### Cause

Client application consistently exceeds baseline IOPS. Currently, there is no service side smoothing of the request load, so if the client exceeds baseline IOPS, it will get throttled by the service. That throttling can result in the client experiencing a jittery/saw-tooth IOPS pattern. In this case, average IOPS achieved by the client might be lower than the baseline IOPS.

### Workaround

- Reduce the request load from the client application, so that the share does not get throttled.
- Increase the quota of the share so that the share does not get throttled.

## Excessive DirectoryOpen/DirectoryClose calls

### Cause

If the number of DirectoryOpen/DirectoryClose calls is among the top API calls and you don't expect the client to be making that many calls, it may be an issue with the antivirus installed on the Azure client VM.

### Workaround

- A fix for this issue is available in the [April Platform Update for Windows](https://support.microsoft.com/help/4052623/update-for-windows-defender-antimalware-platform).

## File creation is slower than expected

### Cause

Workloads that rely on creating a large number of files will not see a substantial difference between the performance of premium file shares and standard file shares.

### Workaround

- None.

## Slow performance from Windows 8.1 or Server 2012 R2

### Cause

Higher than expected latency accessing Azure Files for IO intensive workloads.

### Workaround

- Install the available [hotfix](https://support.microsoft.com/help/3114025/slow-performance-when-you-access-azure-files-storage-from-windows-8-1).