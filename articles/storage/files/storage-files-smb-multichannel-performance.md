---
title: SMB Multichannel performance - Azure Files
description: Learn about SMB Multichannel performance.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 09/15/2020
ms.author: rogarana
ms.subservice: files
---

# SMB Multichannel performance

Azure Files SMB Multichannel (Preview) enables an SMB 3.x client to establish multiple network connections to the premium file shares in a FileStorage account. The SMB 3.0 protocol introduced SMB Multichannel feature in Windows Server 2012 and Windows 8 clients. Because of this, any Azure Files SMB 3.x client that supports SMB Multichannel can take advantage of the feature for their Azure file shares. There is no additional cost for enabling SMB Multichannel on a storage account.

## Benefits

Azure Files SMB Multichannel enables clients to use multiple network connections that provides increased performance while lowering the cost of ownership. Increased performance is achieved through bandwidth aggregation over multiple NICs and utilizing Receive Side Scaling (RSS) support for NICs to distribute the IO load across multiple CPUs.

- Increased throughput
- Higher IOPS
- Network fault tolerance
- Automatic configuration
- Cost optimization

To learn more about SMB Multichannel, refer to the [Windows documentation](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn610980(v=ws.11)).

This feature provides greater performance benefits to multi-threaded applications but typically does not help single-threaded applications. See the performance section for more details.

## Limitations

SMB Multichannel for Azure file shares currently has the following restrictions:
- Can only be used with FileStorage accounts and premium file shares.
- Can only use locally redundant storage as the redundancy option.
- Maximum number of channels is four.
- SMB Direct over RDMA is not supported.
- [List Handles API](https://docs.microsoft.com/rest/api/storageservices/list-handles) is not supported.

### Regional availability

SMB Multichannel for Azure file shares is currently only available in the following regions:

- Australia East
- Canada East
- Central India
- East US
- South Central US
- UAE North
- West India

## Configuration

SMB Multichannel only works when the feature is enabled on both client-side (your client) and server-side (your Azure storage account).

On Windows clients, SMB Multichannel is generally enabled by default. You can verify your configuration by running the following PowerShell command: `Get-smbClientConfiguration | select EnableMultichannel`.

You will need to enable SMB Multichannel on your storage account in addition to your client, see [Enable SMB Multichannel (preview)](storage-files-enable-smb-multichannel.md).

### Disable SMB Multichannel
In most scenarios, particularly multi-threaded workloads, clients should see improved performance with SMB Multichannel. However, some specific scenarios such as single-threaded workloads or testing purposes, you may want to disable SMB Multichannel. See <Section> for more details.

## Verify SMB Multichannel is configured correctly

1. Create a premium file share or use an existing one.
1. Ensure your client supports SMB Multichannel (one or more network adapter has receive-side scaling enabled). Refer to the [Windows documentation](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn610980(v=ws.11)) for more details.
1. Mount a file share to your client.
1. Generate load with your application.

    A copy tool such as robocopy /MT, or any performance tool such as Diskspd to read/write files can generate load.

1. Open PowerShell as an admin and use the following command: `Get-SmbMultichannelConnection |fl`
1. Look for **MaxChannels** and **CurrentChannels** properties

## Performance comparison

There are two categories of read/write workload patterns - single-threaded and multi-threaded. Most workloads use multiple files, but there could be specific use cases where the workload works with a single file in its share. This section covers different use cases and the performance impact for each of them. In general, most workloads are multi-threaded and distribute workload over multiple files.

- Multi-threaded/multiple files
    Depending on the workload pattern, there should be a performance improvement over single-threaded from anywhere between 2x to 4x in IOPS, throughput, and latency. For this category, SMB Multichannel should be enabled for the best performance.
- Multi-threaded/single file
    For most use cases in this category, they will benefit from having SMB Multichannel enabled, especially if the workload has an average IO size > ~16k. A few example scenarios which benefit from SMB Multichannel are backup or recovery of a single large file. An exception where you may want to disable SMB Multichannel is if your workload is small IOs heavy. In that case, you may observe a slight performance loss of ~10%. Depending on the use case, consider spreading load across multiple files, or disable the feature. See the [Configuration](#configuration) section for details.
- Single-threaded/multiple files or single file
    For most single-threaded workloads, there are minimum performance benefits from parallelism, usually there is a slight performance degradation of ~10% if SMB Multichannel is enabled. In this case, it's ideal to disable SMB Multichannel, with one exception. If the single-threaded workload can distribute load across multiple files and uses on average larger IO sizes (> 16k), then there should be performance benefits from SMB Multichannel.

### Testing performance configuration

For the charts in this article, the following configuration was used: A single Standard D32s v3 VM with a single RSS enabled NIC with 4 channels. Load was generated using diskspd.exe, multiple-threaded with IO depth of 10, random IOs with various IO sizes.

- Size - Standard_D32s_v3
- vCPU - 32
- Memory (GiB) - 128
- Temp storage (SSD) in GiB - 256
- Max data disks - 32
- Max cached and temp storage throughput IOPS/MBps (cache size in GiB) - 64000/512 (800)
- Max uncached disk throughput IOPS/MBps - 51200/768
- Max NICs - 8
- Expected network bandwidth (Mbps) - 16000

### Mutli-threaded/multiple files with SMB Multichannel

Load was generated against 10 files, with SMB Mutlichannel enabled. The scale up test results showed significant improvements in both IOPS and throughput test results with SMB Multichannel than without it. The follow graphs depict the results:


- On a single NIC, for reads, performance increase of 2x-3x was observed, and writes gains of 3x-4x, in both IOPS and throughput.
- SMB Multichannel allowed IOPS and throughput to reach VM limits even with a single NIC, 4 channels limit.
- Since egress (or reads to storage) are not metered, read throughput was able to exceed the VM published limit of 16000 Mbps (2 GiB/s). The test achieved >2.7 GiB/s. Ingress (or writes to storage) are still subject to VM limits.
- Spreading load over multiple files allowed for substantial improvements.

An example command that was used in this testing is: `diskspd.exe -W300 -C5 -r -w100 -b4k -t8 -o8 -Sh -d60 -L -c2G -Z1G z:\write0.dat z:\write1.dat z:\write2.dat z:\write3.dat z:\write4.dat z:\write5.dat z:\write6.dat z:\write7.dat z:\write8.dat z:\write9.dat `.

### Multi-threaded/single file workloads with SMB Multichannel

The load was generated against a single 128 GiB file. With SMB Multichannel enabled, the scale up test with multi-threaded/single files showed improvements in most cases. The following graphs show the results of this test:

- On a single NIC with larger average IO size (> ~16k) there was significant improvements in btoh reads and writes.
- For smaller IO sizes, there was a slight impact of ~10% on performance when SMB Multichannel was enabled. This could be mitigated by spreading the load over multiple files, or disabling the feature.
- Performance is still bound by [single file limits](storage-files-scale-targets.md#file-share-and-file-scale-targets).

## Optimizing your performance

The following tips may help you optimize your performance:

- Ensure that your file share and your client are co-located in the same Azure region to reduce network latency.
- Use multi-threaded applications and spread load across multiple files.
- Performance benefits of SMB Multichannel increase with the number of files distributing load.
- Premium share performance is bound by provisioned share size (IOPS/egress/ingress) and single file limits. For details, see [Understanding provisioning for premium file shares](storage-files-planning.md#understanding-provisioning-for-premium-file-shares).
- Maximum performance of a single VM client is still bound to VM limits. For example, Standard_D32s_V3 can support a max bandwidth of 16000 MBps (or 2GBps), egress from the VM (writes to storage) is metered, ingress (reads from storage) is not. File share performance is subject to machine network limits, CPUs, internal storage available network bandwidth, IO sizes, parallelism, as well as other factors.
- The initial test is usually a warm up, discard its results and repeat the test.
- If performance is limited by a single client and workload is still below provisioned share limits, higher performance can be achieved by spreading load over multiple clients.

### The relationship between IOPS/throughput, and IO sizes

**Throughput = IO size * IOPS**

Higher IO sizes drive higher throughput and will have higher latencies, resulting in a smaller number of net IOPS. Smaller IO sizes will drive higher IOPS but results in lower net throughput and latencies.

## Next steps

- [Enable SMB Multichannel on a filestorage account (preview)](storage-files-enable-smb-multichannel.md)
- See the [Windows documentation](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn610980(v=ws.11)) to learn more about SMB Multichannel.