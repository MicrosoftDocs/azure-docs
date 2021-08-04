---
title: SMB Multichannel performance - Azure Files
description: Learn about SMB Multichannel performance.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 05/17/2021
ms.author: rogarana
ms.subservice: files
---

# SMB Multichannel performance

Azure Files SMB Multichannel (preview) enables an SMB 3.x client to establish multiple network connections to the premium file shares in a FileStorage account. The SMB 3.x protocol introduced SMB Multichannel feature in Windows Server 2012 and Windows 8 clients. Because of this, any Azure Files SMB 3.x client that supports SMB Multichannel can take advantage of the feature for their Azure premium file shares. There is no additional cost for enabling SMB Multichannel on a storage account.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Benefits

Azure Files SMB Multichannel enables clients to use multiple network connections that provide increased performance while lowering the cost of ownership. Increased performance is achieved through bandwidth aggregation over multiple NICs and utilizing Receive Side Scaling (RSS) support for NICs to distribute the IO load across multiple CPUs.

- **Increased throughput**:
    Multiple connections allow data to be transferred over multiple paths in parallel and thereby significantly benefits workloads that use larger file sizes with larger IO sizes, and require high throughput from a single VM or a smaller set of VMs. Some of these workloads include media and entertainment for content creation or transcoding, genomics, and financial services risk analysis.
- **Higher IOPS**:
    NIC RSS capability allows effective load distribution across multiple CPUs with multiple connections. This helps achieve higher IOPS scale and effective utilization of VM CPUs. This is useful for workloads that have small IO sizes, such as database applications.
- **Network fault tolerance**:
    Multiple connections mitigate the risk of disruption since clients no longer rely on an individual connection.
- **Automatic configuration**:
    When SMB Multichannel is enabled on clients and storage accounts, it allows for dynamic discovery of existing connections, and can create addition connection paths as necessary.
- **Cost optimization**:
    Workloads can achieve higher scale from a single VM, or a small set of VMs, while connecting to premium shares. This could reduce the total cost of ownership by reducing the number of VMs necessary to run and manage a workload.

To learn more about SMB Multichannel, refer to the [Windows documentation](/azure-stack/hci/manage/manage-smb-multichannel).

This feature provides greater performance benefits to multi-threaded applications but typically does not help single-threaded applications. See the [Performance comparison](#performance-comparison) section for more details.

## Limitations

[!INCLUDE [storage-files-smb-multi-channel-restrictions](../../../includes/storage-files-smb-multi-channel-restrictions.md)]

### Regional availability

[!INCLUDE [storage-files-smb-multi-channel-regions](../../../includes/storage-files-smb-multi-channel-regions.md)]

## Configuration

SMB Multichannel only works when the feature is enabled on both client-side (your client) and service-side (your Azure storage account).

On Windows clients, SMB Multichannel is enabled by default. You can verify your configuration by running the following PowerShell command: 

`Get-smbClientConfiguration | select EnableMultichannel`.
 
On your Azure storage account, you will need to enable SMB Multichannel. See [Enable SMB Multichannel (preview)](storage-files-enable-smb-multichannel.md).

### Disable SMB Multichannel
In most scenarios, particularly multi-threaded workloads, clients should see improved performance with SMB Multichannel. However, some specific scenarios such as single-threaded workloads or for testing purposes, you may want to disable SMB Multichannel. See [Performance comparison](#performance-comparison) for more details.

## Verify SMB Multichannel is configured correctly

1. Create a premium file share or use an existing one.
1. Ensure your client supports SMB Multichannel (one or more network adapters has receive-side scaling enabled). Refer to the [Windows documentation](/azure-stack/hci/manage/manage-smb-multichannel) for more details.
1. Mount a file share to your client.
1. Generate load with your application.
    A copy tool such as robocopy /MT, or any performance tool such as Diskspd to read/write files can generate load.
1. Open PowerShell as an admin and use the following command: 
`Get-SmbMultichannelConnection |fl`
1. Look for **MaxChannels** and **CurrentChannels** properties

:::image type="content" source="media/storage-files-smb-multichannel-performance/files-smb-multi-channel-connection.PNG" alt-text="Screenshot of Get-SMBMultichannelConnection results." lightbox="media/storage-files-smb-multichannel-performance/files-smb-multi-channel-connection.PNG":::

## Performance comparison

There are two categories of read/write workload patterns - single-threaded and multi-threaded. Most workloads use multiple files, but there could be specific use cases where the workload works with a single file in a share. This section covers different use cases and the performance impact for each of them. In general, most workloads are multi-threaded and distribute workload over multiple files so they should observe significant performance improvements with SMB Multichannel.

- **Multi-threaded/multiple files**:
    Depending on the workload pattern, you should see significant performance improvement in read and write IOs over multiple channels. The performance gains vary from anywhere between 2x to 4x in terms of IOPS, throughput, and latency. For this category, SMB Multichannel should be enabled for the best performance.
- **Multi-threaded/single file**:
    For most use cases in this category, workloads will benefit from having SMB Multichannel enabled, especially if the workload has an average IO size > ~16k. A few example scenarios that benefit from SMB Multichannel are backup or recovery of a single large file. An exception where you may want to disable SMB Multichannel is if your workload is small IOs heavy. In that case, you may observe a slight performance loss of ~10%. Depending on the use case, consider spreading load across multiple files, or disable the feature. See the [Configuration](#configuration) section for details.
- **Single-threaded/multiple files or single file**:
    For most single-threaded workloads, there are minimum performance benefits due to lack of parallelism, usually there is a slight performance degradation of ~10% if SMB Multichannel is enabled. In this case, it's ideal to disable SMB Multichannel, with one exception. If the single-threaded workload can distribute load across multiple files and uses on an average larger IO size (> ~16k), then there should be slight performance benefits from SMB Multichannel.

### Performance test configuration

For the charts in this article, the following configuration was used: A single Standard D32s v3 VM with a single RSS enabled NIC with four channels. Load was generated using diskspd.exe, multiple-threaded with IO depth of 10, and random IOs with various IO sizes.

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB) | Max uncached disk throughput: IOPS/MBps | Max NICs|Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|
| [Standard_D32s_v3](../../virtual-machines/dv3-dsv3-series.md) | 32 | 128 | 256 | 32 | 64000/512 (800)    | 51200/768  | 8|16000 |

:::image type="content" source="media/storage-files-smb-multichannel-performance/files-smb-multi-channel-nic-settings-all-nics.PNG" alt-text="Screenshot that shows the performance test configuration." lightbox="media/storage-files-smb-multichannel-performance/files-smb-multi-channel-nic-settings-all-nics.PNG":::

### Mutli-threaded/multiple files with SMB Multichannel

Load was generated against 10 files with various IO sizes. The scale up test results showed significant improvements in both IOPS and throughput test results with SMB Multichannel enabled. The following diagrams depict the results:

:::image type="content" source="media/storage-files-smb-multichannel-performance/diagram-smb-multi-channel-multiple-files-compared-to-single-channel-iops-performance.png" alt-text="Diagram of performance" lightbox="media/storage-files-smb-multichannel-performance/diagram-smb-multi-channel-multiple-files-compared-to-single-channel-iops-performance.png":::

:::image type="content" source="media/storage-files-smb-multichannel-performance/diagram-smb-multi-channel-multiple-files-compared-to-single-channel-throughput-performance.png" alt-text="Diagram of throughput performance." lightbox="media/storage-files-smb-multichannel-performance/diagram-smb-multi-channel-multiple-files-compared-to-single-channel-throughput-performance.png":::

- On a single NIC, for reads, performance increase of 2x-3x was observed and for writes, gains of 3x-4x in terms of both IOPS and throughput.
- SMB Multichannel allowed IOPS and throughput to reach VM limits even with a single NIC and the four channel limit.
- Since egress (or reads to storage) is not metered, read throughput was able to exceed the VM published limit of 16,000 Mbps (2 GiB/s). The test achieved >2.7 GiB/s. Ingress (or writes to storage) are still subject to VM limits.
- Spreading load over multiple files allowed for substantial improvements.

An example command that was used in this testing is: 

`diskspd.exe -W300 -C5 -r -w100 -b4k -t8 -o8 -Sh -d60 -L -c2G -Z1G z:\write0.dat z:\write1.dat z:\write2.dat z:\write3.dat z:\write4.dat z:\write5.dat z:\write6.dat z:\write7.dat z:\write8.dat z:\write9.dat `.

### Multi-threaded/single file workloads with SMB Multichannel

The load was generated against a single 128 GiB file. With SMB Multichannel enabled, the scale up test with multi-threaded/single files showed improvements in most cases. The following diagrams depict the results:

:::image type="content" source="media/storage-files-smb-multichannel-performance/diagram-smb-multi-channel-single-file-compared-to-single-channel-iops-performance.png" alt-text="Diagram of IOPS performance." lightbox="media/storage-files-smb-multichannel-performance/diagram-smb-multi-channel-single-file-compared-to-single-channel-iops-performance.png":::

:::image type="content" source="media/storage-files-smb-multichannel-performance/diagram-smb-multi-channel-single-file-compared-to-single-channel-throughput-performance.png" alt-text="Diagram of single file throughput performance." lightbox="media/storage-files-smb-multichannel-performance/diagram-smb-multi-channel-single-file-compared-to-single-channel-throughput-performance.png":::

- On a single NIC with larger average IO size (> ~16k), there were significant improvements in both reads and writes.
- For smaller IO sizes, there was a slight impact of ~10% on performance when SMB Multichannel was enabled. This could be mitigated by spreading the load over multiple files, or disabling the feature.
- Performance is still bound by [single file limits](storage-files-scale-targets.md#file-scale-targets).

## Optimizing performance

The following tips may help you optimize your performance:

- Ensure that your storage account and your client are colocated in the same Azure region to reduce network latency.
- Use multi-threaded applications and spread load across multiple files.
- Performance benefits of SMB Multichannel increase with the number of files distributing load.
- Premium share performance is bound by provisioned share size (IOPS/egress/ingress) and single file limits. For details, see [Understanding provisioning for premium file shares](understanding-billing.md#provisioned-model).
- Maximum performance of a single VM client is still bound to VM limits. For example, [Standard_D32s_v3](../../virtual-machines/dv3-dsv3-series.md) can support a maximum bandwidth of 16,000 MBps (or 2GBps), egress from the VM (writes to storage) is metered, ingress (reads from storage) is not. File share performance is subject to machine network limits, CPUs, internal storage available network bandwidth, IO sizes, parallelism, as well as other factors.
- The initial test is usually a warm-up, discard its results and repeat the test.
- If performance is limited by a single client and workload is still below provisioned share limits, higher performance can be achieved by spreading load over multiple clients.

### The relationship between IOPS, throughput, and IO sizes

**Throughput = IO size * IOPS**

Higher IO sizes drive higher throughput and will have higher latencies, resulting in a lower number of net IOPS. Smaller IO sizes will drive higher IOPS but results in lower net throughput and latencies.

## Next steps

- [Enable SMB Multichannel on a FileStorage account (preview)](storage-files-enable-smb-multichannel.md)
- See the [Windows documentation](/azure-stack/hci/manage/manage-smb-multichannel) to learn more about SMB Multichannel.
