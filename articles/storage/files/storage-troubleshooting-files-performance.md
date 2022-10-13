---
title: Azure file shares performance troubleshooting guide
description: Troubleshoot known performance issues with Azure file shares. Discover potential causes and associated workarounds when these problems are encountered.
author: khdownie
ms.service: storage
ms.topic: troubleshooting
ms.date: 10/03/2022
ms.author: kendownie
ms.subservice: files
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---
# Troubleshoot Azure file shares performance issues

This article lists some common problems related to Azure file shares and provides potential causes and workarounds.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## High latency, low throughput, and general performance issues

### Cause 1: Share was throttled

Requests are throttled when the I/O operations per second (IOPS), ingress, or egress limits for a file share are reached. To understand the limits for standard and premium file shares, see [File share and file scale targets](./storage-files-scale-targets.md#azure-file-share-scale-targets).

To confirm whether your share is being throttled, you can access and use Azure metrics in the portal.

1. In the Azure portal, go to your storage account.

1. On the left pane, under **Monitoring**, select **Metrics**.

1. Select **File** as the metric namespace for your storage account scope.

1. Select **Transactions** as the metric.

1. Add a filter for **Response type**, and then check to see whether any requests have been throttled. 

    For standard file shares, the following response types are logged if a request is throttled:

    - SuccessWithThrottling
    - SuccessWithShareIopsThrottling
    - ClientShareIopsThrottlingError

    For premium file shares, the following response types are logged if a request is throttled:

    - SuccessWithShareEgressThrottling
    - SuccessWithShareIngressThrottling
    - SuccessWithShareIopsThrottling
    - ClientShareEgressThrottlingError
    - ClientShareIngressThrottlingError
    - ClientShareIopsThrottlingError

    To learn more about each response type, see [Metric dimensions](./storage-files-monitoring-reference.md#metrics-dimensions).

    ![Screenshot of the metrics options for premium file shares, showing a "Response type" property filter.](media/storage-troubleshooting-premium-fileshares/metrics.png)

    > [!NOTE]
    > To receive an alert, see the ["How to create an alert if a file share is throttled"](#how-to-create-an-alert-if-a-file-share-is-throttled) section later in this article.

#### Solution

- If you're using a standard file share, [enable large file shares](storage-how-to-create-file-share.md#enable-large-files-shares-on-an-existing-account) on your storage account and [increase the size of file share quota to take advantage of the large file share support](storage-how-to-create-file-share.md#expand-existing-file-shares). Large file shares support great IOPS and bandwidth limits; see [Azure Files scalability and performance targets](storage-files-scale-targets.md) for details.
- If you're using a premium file share, increase the provisioned file share size to increase the IOPS limit. To learn more, see the [Understanding provisioning for premium file shares](./understanding-billing.md#provisioned-model).

### Cause 2: Metadata or namespace heavy workload

If the majority of your requests are metadata-centric (such as `createfile`, `openfile`, `closefile`, `queryinfo`, or `querydirectory`), the latency will be worse than that of read/write operations.

To determine whether most of your requests are metadata-centric, start by following steps 1-4 as previously outlined in Cause 1. For step 5, instead of adding a filter for **Response type**, add a property filter for **API name**.

![Screenshot of the metrics options for premium file shares, showing an "API name" property filter.](media/storage-troubleshooting-premium-fileshares/MetadataMetrics.png)

#### Workaround

- Check to see whether the application can be modified to reduce the number of metadata operations.
- Add a virtual hard disk (VHD) on the file share and mount the VHD from the client to perform file operations against the data. This approach works for single writer/reader scenarios or scenarios with multiple readers and no writers. Because the file system is owned by the client rather than Azure Files, this allows metadata operations to be local. The setup offers performance similar to that of local directly attached storage.
    -   To mount a VHD on a Windows client, use the [`Mount-DiskImage`](/powershell/module/storage/mount-diskimage) PowerShell cmdlet.
    -   To mount a VHD on Linux, consult the documentation for your Linux distribution. [Here's an example](https://man7.org/linux/man-pages/man5/nfs.5.html).  

### Cause 3: Single-threaded application

If the application that you're using is single-threaded, this setup can result in significantly lower IOPS throughput than the maximum possible throughput, depending on your provisioned share size.

#### Solution

- Increase application parallelism by increasing the number of threads.
- Switch to applications where parallelism is possible. For example, for copy operations, you could use AzCopy or RoboCopy from Windows clients or the **parallel** command from Linux clients.

### Cause 4: Number of SMB channels exceeds four

If you're using SMB MultiChannel and the number of channels you have exceeds four, this will result in poor performance. To determine if your connection count exceeds four, use the PowerShell cmdlet `get-SmbClientConfiguration` to view the current connection count settings.

#### Solution

Set the Windows per NIC setting for SMB so that the total channels don't exceed four. For example, if you have two NICs, you can set the maximum per NIC to two using the following PowerShell cmdlet: `Set-SmbClientConfiguration -ConnectionCountPerRssNetworkInterface 2`.

## Very high latency for requests

### Cause

The client virtual machine (VM) could be located in a different region than the file share. Other reason for high latency could be due to the latency caused by the client or the network.

### Solution

- Run the application from a VM that's located in the same region as the file share.
- For your storage account, review transaction metrics **SuccessE2ELatency** and  **SuccessServerLatency** via **Azure Monitor** in Azure portal. A high difference between SuccessE2ELatency and SuccessServerLatency metrics values is an indication of latency that is likely caused by the network or the client. See [Transaction metrics](storage-files-monitoring-reference.md#transaction-metrics) in Azure Files Monitoring data reference.

## Client unable to achieve maximum throughput supported by the network

### Cause
One potential cause is a lack of SMB multi-channel support for standard file shares. Currently, Azure Files supports only single channel, so there's only one connection from the client VM to the server. This single connection is pegged to a single core on the client VM, so the maximum throughput achievable from a VM is bound by a single core.

### Workaround

- For premium file shares, [Enable SMB Multichannel](files-smb-protocol.md#smb-multichannel).
- Obtaining a VM with a bigger core might help improve throughput.
- Running the client application from multiple VMs will increase throughput.
- Use REST APIs where possible.
- For NFS file shares, nconnect is available, in preview. Not recommended for production workloads.

## Throughput on Linux clients is significantly lower than that of Windows clients

### Cause

This is a known issue with the implementation of the SMB client on Linux.

### Workaround

- Spread the load across multiple VMs.
- On the same VM, use multiple mount points with a `nosharesock` option, and spread the load across these mount points.
- On Linux, try mounting with a `nostrictsync` option to avoid forcing an SMB flush on every `fsync` call. For Azure Files, this option doesn't interfere with data consistency, but it might result in stale file metadata on directory listings (`ls -l` command). Directly querying file metadata by using the `stat` command will return the most up-to-date file metadata.

## High latencies for metadata-heavy workloads involving extensive open/close operations

### Cause

Lack of support for directory leases.

### Workaround

- If possible, avoid using an excessive opening/closing handle on the same directory within a short period of time.
- For Linux VMs, increase the directory entry cache timeout by specifying `actimeo=<sec>` as a mount option. By default, the timeout is 1 second, so a larger value, such as 3 or 5 seconds, might help.
- For CentOS Linux or Red Hat Enterprise Linux (RHEL) VMs, upgrade the system to CentOS Linux 8.2 or RHEL 8.2. For other Linux VMs, upgrade the kernel to 5.0 or later.

## Low IOPS on CentOS Linux or RHEL

### Cause

An I/O depth of greater than 1 is not supported on CentOS Linux or RHEL.

### Workaround

- Upgrade to CentOS Linux 8 or RHEL 8.
- Change to Ubuntu.

## Slow file copying to and from Azure file shares in Linux

If you're experiencing slow file copying, see the "Slow file copying to and from Azure file shares in Linux" section in the [Linux troubleshooting guide](storage-troubleshoot-linux-file-connection-problems.md#slow-file-copying-to-and-from-azure-files-in-linux).

## Jittery or sawtooth pattern for IOPS

### Cause

The client application consistently exceeds baseline IOPS. Currently, there's no service-side smoothing of the request load. If the client exceeds baseline IOPS, it will get throttled by the service. The throttling can result in the client experiencing a jittery or sawtooth IOPS pattern. In this case, the average IOPS achieved by the client might be lower than the baseline IOPS.

### Workaround
- Reduce the request load from the client application, so that the share doesn't get throttled.
- Increase the quota of the share so that the share doesn't get throttled.

## Excessive DirectoryOpen/DirectoryClose calls

### Cause

If the number of **DirectoryOpen/DirectoryClose** calls is among the top API calls and you don't expect the client to make that many calls, the issue might be caused by the antivirus software that's installed on the Azure client VM.

### Workaround

- A fix for this issue is available in the [April Platform Update for Windows](https://support.microsoft.com/help/4052623/update-for-windows-defender-antimalware-platform).

## File creation is slower than expected

### Cause

Workloads that rely on creating a large number of files won't see a substantial difference in performance between premium file shares and standard file shares.

### Workaround

- None.

## Slow performance from Windows 8.1 or Server 2012 R2

### Cause

Higher than expected latency accessing Azure file shares for I/O-intensive workloads.

### Workaround

- Install the available [hotfix](https://support.microsoft.com/help/3114025/slow-performance-when-you-access-azure-files-storage-from-windows-8-1).

## SMB Multichannel is not being triggered.

### Cause

Recent changes to SMB Multichannel config settings without a remount.

### Solution
 
-	After any changes to Windows SMB client or account SMB multichannel configuration settings, you have to unmount the share, wait for 60 secs, and remount the share to trigger the multichannel.
-	For Windows client OS, generate IO load with high queue depth say QD=8, for example copying a file to trigger SMB Multichannel.  For server OS, SMB Multichannel is triggered with QD=1, which means as soon as you start any IO to the share.

## High latency on web sites hosted on file shares 

### Cause  

High number file change notification on file shares can result in significant high latencies. This typically occurs with web sites hosted on file shares with deep nested directory structure. A typical scenario is IIS hosted web application where file change notification is setup for each directory in the default configuration. Each change ([ReadDirectoryChangesW](/windows/win32/api/winbase/nf-winbase-readdirectorychangesw)) on the share that the client is registered for pushes a change notification from the file service to the client, which takes system resources, and issue worsens with the number of changes. This can cause share throttling and thus, result in higher client side latency. 

To confirm, you can use Azure Metrics in the portal - 

1. In the Azure portal, go to your storage account. 
1. In the left menu, under Monitoring, select Metrics. 
1. Select File as the metric namespace for your storage account scope. 
1. Select Transactions as the metric. 
1. Add a filter for ResponseType and check to see if any requests have a response code of SuccessWithThrottling (for SMB or NFS) or ClientThrottlingError (for REST).

### Solution 

- If file change notification is not used,  disable file change notification (preferred).
    - [Disable file change notification](https://support.microsoft.com/help/911272/fix-asp-net-2-0-connected-applications-on-a-web-site-may-appear-to-sto) by updating FCNMode. 
    - Update the IIS Worker Process (W3WP) polling interval to 0 by setting `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\W3SVC\Parameters\ConfigPollMilliSeconds ` in your registry and restart the W3WP process. To learn about this setting, see [Common registry keys that are used by many parts of IIS](/troubleshoot/iis/use-registry-keys#registry-keys-that-apply-to-iis-worker-process-w3wp).
- Increase frequency of the file change notification polling interval to reduce volume.
    - Update the W3WP worker process polling interval to a higher value (e.g. 10mins or 30mins) based on your requirement. Set `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\W3SVC\Parameters\ConfigPollMilliSeconds ` [in your registry](/troubleshoot/iis/use-registry-keys#registry-keys-that-apply-to-iis-worker-process-w3wp) and restart the W3WP process.
- If your web site's mapped  physical directory has nested directory structure, you can try to limit scope of file change notification to reduce the notification volume. By default, IIS uses configuration from Web.config files in the physical directory to which the virtual directory is mapped, as well as in any child directories in that physical directory. If you do not want to use Web.config files in child directories, specify false for the allowSubDirConfig attribute on the virtual directory. More details can be found [here](/iis/get-started/planning-your-iis-architecture/understanding-sites-applications-and-virtual-directories-on-iis#virtual-directories). 
    - Set IIS  virtual directory "allowSubDirConfig" setting in Web.Config to *false* to exclude mapped physical child directories from the scope.  

## How to create an alert if a file share is throttled

1. Go to your **storage account** in the **Azure portal**.
2. In the **Monitoring** section, click **Alerts**, and then click **+ New alert rule**.
3. Click **Edit resource**, select the **File resource type** for the storage account and then click **Done**. For example, if the storage account name is `contoso`, select the `contoso/file` resource.
4. Click **Add condition** to add a condition.
5. You will see a list of signals supported for the storage account, select the **Transactions** metric.
6. On the **Configure signal logic** blade, click the **Dimension name** drop-down and select **Response type**.
7. Click the **Dimension values** drop-down and select the appropriate response types for your file share.

    For standard file shares, select the following response types:

    - SuccessWithThrottling
    - SuccessWithShareIopsThrottling
    - ClientShareIopsThrottlingError

    For premium file shares, select the following response types:

    - SuccessWithShareEgressThrottling
    - SuccessWithShareIngressThrottling
    - SuccessWithShareIopsThrottling
    - ClientShareEgressThrottlingError
    - ClientShareIngressThrottlingError
    - ClientShareIopsThrottlingError

   > [!NOTE]
   > If the response types are not listed in the **Dimension values** drop-down, this means the resource has not been throttled. To add the dimension values, next to the **Dimension values** drop-down list, select **Add custom value**, enter the respone type (for example, **SuccessWithThrottling**), select **OK**, and then repeat these steps to add all applicable response types for your file share.

8. For **premium file shares**, click the **Dimension name** drop-down and select **File Share**. For **standard file shares**, skip to **step #10**.

   > [!NOTE]
   > If the file share is a standard file share, the **File Share** dimension will not list the file share(s) because per-share metrics are not available for standard file shares. Throttling alerts for standard file shares will be triggered if any file share within the storage account is throttled and the alert will not identify which file share was throttled. Since per-share metrics are not available for standard file shares, the recommendation is to have one file share per storage account.

9. Click the **Dimension values** drop-down and select the file share(s) that you want to alert on.
10. Define the **alert parameters** (threshold value, operator, aggregation granularity and frequency of evaluation) and click **Done**.

    > [!TIP]
    > If you are using a static threshold, the metric chart can help determine a reasonable threshold value if the file share is currently being throttled. If you are using a dynamic threshold, the metric chart will display the calculated thresholds based on recent data.

11. Click **Add action groups** to add an **action group** (email, SMS, etc.) to the alert either by selecting an existing action group or creating a new action group.
12. Fill in the **Alert details** like **Alert rule name**, **Description**, and **Severity**.
13. Click **Create alert rule** to create the alert.

To learn more about configuring alerts in Azure Monitor, see [Overview of alerts in Microsoft Azure](../../azure-monitor/alerts/alerts-overview.md).

## Slow performance when unzipping files in SMB file shares
Depending on the exact compression method and unzip operation used, decompression operations may perform more slowly on an Azure file share than on your local disk. This is often because unzipping tools perform a number of metadata operations in the process of performing the decompression of a compressed archive. For the best performance, we recommend copying the compressed archive from the Azure file share to your local disk, unzipping there, and then using a copy tool such as Robocopy (or AzCopy) to copy back to the Azure file share. Using a copy tool like Robocopy can compensate for the decreased performance of metadata operations in Azure Files relative to your local disk by using multiple threads to copy data in parallel. 

## How to create alerts if a premium file share is trending toward being throttled

1. In the Azure portal, go to your storage account.
2. In the **Monitoring** section, select **Alerts**, and then select **New alert rule**.
3. Select **Edit resource**, select the **File resource type** for the storage account, and then select **Done**. For example, if the storage account name is *contoso*, select the contoso/file resource.
4. Select **Select Condition** to add a condition.
5. In the list of signals that are supported for the storage account, select the **Egress** metric.

   > [!NOTE]
   > You have to create three separate alerts to be alerted when the ingress, egress, or transaction values exceed the thresholds you set. This is because an alert is triggered only when all conditions are met. For example, if you put all the conditions in one alert, you would be alerted only if ingress, egress, and transactions exceed their threshold amounts.

6. Scroll down. In the **Dimension name** drop-down list, select **File Share**.
7. In the **Dimension values** drop-down list, select the file share or shares that you want to alert on.
8. Define the alert parameters by selecting values in the **Operator**, **Threshold value**, **Aggregation granularity**, and **Frequency of evaluation** drop-down lists, and then select **Done**.

   Egress, ingress, and transactions metrics are expressed per minute, though you're provisioned egress, ingress, and I/O per second. Therefore, for example, if your provisioned egress is 90&nbsp; MiB/s and you want your threshold to be 80&nbsp;percent of provisioned egress, select the following alert parameters: 
   - For **Threshold value**: *75497472* 
   - For **Operator**: *greater than or equal to*
   - For **Aggregation type**: *average*
   
   Depending on how noisy you want your alert to be, you can also select values for **Aggregation granularity** and **Frequency of evaluation**. For example, if you want your alert to look at the average ingress over the time period of 1 hour, and you want your alert rule to be run every hour, select the following:
   - For **Aggregation granularity**: *1 hour*
   - For **Frequency of evaluation**: *1 hour*

9. Select **Add action groups**, and then add an action group (for example, email or SMS) to the alert either by selecting an existing action group or by creating a new one.
10. Enter the alert details, such as **Alert rule name**, **Description**, and **Severity**.
11. Select **Create alert rule** to create the alert.

    > [!NOTE]
    > - To be notified that your premium file share is close to being throttled *because of provisioned ingress*, follow the preceding instructions, but with the following change:
    >    - In step 5, select the **Ingress** metric instead of **Egress**.
    >
    > - To be notified that your premium file share is close to being throttled *because of provisioned IOPS*, follow the preceding instructions, but with the following changes:
    >    - In step 5, select the **Transactions** metric instead of **Egress**.
    >    - In step 10, the only option for **Aggregation type** is *Total*. Therefore, the threshold value depends on your selected aggregation granularity. For example, if you want your threshold to be 80&nbsp;percent of provisioned baseline IOPS and you select *1 hour* for **Aggregation granularity**, your **Threshold value** would be your baseline IOPS (in bytes) &times;&nbsp;0.8 &times;&nbsp;3600. 

To learn more about configuring alerts in Azure Monitor, see [Overview of alerts in Microsoft Azure](../../azure-monitor/alerts/alerts-overview.md).

## See also
- [Troubleshoot Azure Files in Windows](storage-troubleshoot-windows-file-connection-problems.md)  
- [Troubleshoot Azure Files in Linux](storage-troubleshoot-linux-file-connection-problems.md)  
- [Azure Files FAQ](storage-files-faq.md)
