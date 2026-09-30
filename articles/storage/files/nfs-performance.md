---
title: Improve NFS Azure File Share Performance
description: Learn ways to improve the performance and throughput of NFS Azure file shares at scale, including the nconnect mount option for Linux clients.
author: khdownie
ms.service: azure-file-storage
ms.custom: linux-related-content
ms.topic: concept-article
ms.date: 07/29/2026
ms.author: kendownie
# Customer intent: "As a system administrator managing NFS Azure file shares, I want to optimize performance using features like read-ahead and nconnect, so that I can enhance throughput and reduce costs while efficiently handling large-scale workloads."
---

# Improve performance for NFS Azure file shares

**Applies to:** :heavy_check_mark: NFS file shares

This article provides various ways to improve performance for network file system (NFS) Azure file shares. Topics include configuring the Linux `read_ahead_kb` kernel parameter for better sequential read throughput, using the `nconnect` mount option to scale throughput with fewer client machines, and placing your storage account in the same availability zone as your clients to reduce latency.

## Increase read-ahead size to improve read throughput

The `read_ahead_kb` kernel parameter in Linux represents the amount of data that should be "read ahead" or prefetched during a sequential read operation. Linux kernel versions before 5.4 set the read-ahead value to the equivalent of 15 times the mounted file system's `rsize`, which represents the client-side mount option for read buffer size. This sets the read-ahead value high enough to improve client sequential read throughput in most cases.

However, beginning with Linux kernel version 5.4, the Linux NFS client uses a default `read_ahead_kb` value of 128 KiB. This smaller value might reduce the amount of read throughput for large files. Users upgrading from Linux releases with the larger read-ahead value to releases with the 128 KiB default might experience a decrease in sequential read performance.

For Linux kernels 5.4 or later, persistently set the `read_ahead_kb` to 15 MiB for improved performance.

To change this value, set the read-ahead size by adding a rule in udev, a Linux kernel device manager. Follow these steps:

1. In a text editor, create the */etc/udev/rules.d/99-nfs.rules* file by entering and saving the following text:

   ```output
   SUBSYSTEM=="bdi" \
   , ACTION=="add" \
   , PROGRAM="/usr/bin/awk -v bdi=$kernel 'BEGIN{ret=1} {if ($4 == bdi) {ret=0}} END{exit ret}' /proc/fs/nfsfs/volumes" \
   , ATTR{read_ahead_kb}="15360"
   ```

1. In a console, apply the udev rule by running the [udevadm](https://www.man7.org/linux/man-pages/man8/udevadm.8.html) command as a superuser and reloading the rules files and other databases. You only need to run this command once to make udev aware of the new file.

   ```bash
   sudo udevadm control --reload
   ```

## NFS nconnect
NFS nconnect is a client-side mount option for NFS file shares that you use to create multiple TCP connections between the client and your NFS file share. It's particularly useful for large-scale workloads where a single TCP connection becomes a bottleneck.

### nconnect benefits

With nconnect, you can increase performance at scale using fewer client machines to reduce total cost of ownership (TCO). The nconnect feature increases performance by using multiple TCP channels on one or more NICs, using single or multiple clients. Without nconnect, you need roughly 20 client machines to achieve the bandwidth scale limits (10 GiB / sec) offered by the largest SSD file share provisioning size. With nconnect, you can achieve those limits using only 6-7 clients, reducing compute costs by nearly 70% while providing significant improvements in I/O operations per second (IOPS) and throughput at scale. See the following table.

| **Metric (operation)** | **I/O size**  | **Performance improvement** |
|-|-|-|
| IOPS (write) | 64 KiB, 1,024 KiB | 3x |
| IOPS (read) | All I/O sizes | 2-4x |
| Throughput (write) | 64 KiB, 1,024 KiB | 3x |
| Throughput (read) | All I/O sizes | 2-4x |

### nconnect prerequisites

- The latest Linux distributions fully support nconnect. For older Linux distributions, ensure that the Linux kernel version is 5.3 or higher.
- Per-mount configuration is only supported when a single file share is used per storage account over a private endpoint.

### Performance impact

The following performance results were measured using the nconnect mount option with NFS Azure file shares on Linux clients at scale. For more information on how these results were achieved, see [performance test configuration](#performance-test-configuration).

:::image type="content" source="media/nfs-performance/nconnect-iops-improvement.png" alt-text="Screenshot showing average improvement in IOPS when using nconnect with NFS Azure file shares." border="false":::

:::image type="content" source="media/nfs-performance/nconnect-throughput-improvement.png" alt-text="Screenshot showing average improvement in throughput when using nconnect with NFS Azure file shares." border="false":::

### nconnect recommendations
Follow these recommendations to get the best results from `nconnect`.

#### Set `nconnect=4`

While Azure Files supports setting nconnect up to the maximum setting of 16, configure the mount options with the optimal setting of nconnect=4. Currently, there are no gains beyond four channels for the Azure Files implementation of nconnect. In fact, exceeding four channels to a single Azure file share from a single client might adversely affect performance due to TCP network saturation.

#### Size virtual machines carefully

Depending on your workload requirements, it's important to correctly size the client virtual machines (VMs) to avoid being restricted by their [expected network bandwidth](../../virtual-network/virtual-machine-network-throughput.md#expected-network-throughput). You don't need multiple network interface controllers (NICs) in order to achieve the expected network throughput. While it's common to use [general purpose VMs](/azure/virtual-machines/sizes-general) with Azure Files, various VM types are available depending on your workload needs and region availability. For more information, see [Azure VM Selector](https://azure.microsoft.com/pricing/vm-selector/).

#### Keep queue depth less than or equal to 64

Queue depth is the number of pending I/O requests that a storage resource can service. We don't recommend exceeding the optimal queue depth of 64 because you won't see any more performance gains. For more information, see [Queue depth](understand-performance.md#queue-depth).

### Per mount configuration

If a workload requires mounting multiple shares with one or more storage accounts with different nconnect settings from a single client, the settings aren't guaranteed to persist when mounting over the public endpoint. Per mount configuration supports only a single Azure file share per storage account over the private endpoint as described in Scenario 1.

#### Scenario 1: per mount configuration over private endpoint with multiple storage accounts (supported)

- StorageAccount.file.core.windows.net = 10.10.10.10
- StorageAccount2.file.core.windows.net = 10.10.10.11
  - `Mount StorageAccount.file.core.windows.net:/StorageAccount/FileShare1 nconnect=4`
  - `Mount StorageAccount2.file.core.windows.net:/StorageAccount2/FileShare1`

#### Scenario 2: per mount configuration over public endpoint (not supported)

- StorageAccount.file.core.windows.net = 52.239.238.8
- StorageAccount2.file.core.windows.net = 52.239.238.7
  - `Mount StorageAccount.file.core.windows.net:/StorageAccount/FileShare1 nconnect=4`
  - `Mount StorageAccount.file.core.windows.net:/StorageAccount/FileShare2`
  - `Mount StorageAccount2.file.core.windows.net:/StorageAccount2/FileShare1`

> [!NOTE]
> Even if the storage account resolves to a different IP address, the address isn't guaranteed to persist because public endpoints aren't static addresses.

#### Scenario 3: per mount configuration over private endpoint with multiple shares on single storage account (not supported)

- StorageAccount.file.core.windows.net = 10.10.10.10
  - `Mount StorageAccount.file.core.windows.net:/StorageAccount/FileShare1 nconnect=4`
  - `Mount StorageAccount.file.core.windows.net:/StorageAccount/FileShare2`
  - `Mount StorageAccount.file.core.windows.net:/StorageAccount/FileShare3`

### Performance test configuration

To achieve and measure the results outlined in this article, use the following resources and benchmarking tools.

- **Single client:** Azure VM ([DSv4-Series](/azure/virtual-machines/dv4-dsv4-series#dsv4-series)) with single NIC
- **OS:** Linux (Ubuntu 20.04)
- **NFS storage:** SSD file share (provisioned 30 TiB, set `nconnect=4`)

| **Size**        | **vCPU**  | **Memory** | **Temp storage (SSD)** | **Max data disks** | **Max NICs** | **Expected network bandwidth** |
|-----------------|-----------|------------|------------------------|--------------------|--------------|--------------------------------|
| Standard_D16_v4 | 16        | 64 GiB     | Remote storage only    | 32                 | 8            | 12,500 Mbps                    |

### Benchmarking tools and tests

These tests use Flexible I/O Tester (FIO), a free, open-source disk I/O tool that's used for both benchmarking and stress or hardware verification. To install FIO, see the Binary Packages section in the [FIO README file](https://github.com/axboe/fio#readme) and follow the instructions for the platform you choose.

While these tests focus on random I/O access patterns, you get similar results when using sequential I/O.

#### High IOPS: 100% reads

**4k I/O size - random read - 64 queue depth**

```bash
fio --ioengine=libaio --direct=1 --nrfiles=4 --numjobs=1 --runtime=1800 --time_based --bs=4k --iodepth=64 --filesize=4G --rw=randread --group_reporting --ramp_time=300
```

**8k I/O size - random read - 64 queue depth**

```bash
fio --ioengine=libaio --direct=1 --nrfiles=4 --numjobs=1 --runtime=1800 --time_based --bs=8k --iodepth=64 --filesize=4G --rw=randread --group_reporting --ramp_time=300
```

#### High throughput: 100% reads

**64 KiB I/O size - random read - 64 queue depth**

```bash
fio --ioengine=libaio --direct=1 --nrfiles=4 --numjobs=1 --runtime=1800 --time_based --bs=64k --iodepth=64 --filesize=4G --rw=randread --group_reporting --ramp_time=300
```

**1,024 KiB I/O size - 100% random read - 64 queue depth**

```bash
fio --ioengine=libaio --direct=1 --nrfiles=4 --numjobs=1 --runtime=1800 --time_based --bs=1024k --iodepth=64 --filesize=4G --rw=randread --group_reporting --ramp_time=300
```

#### High IOPS: 100% writes

**4 KiB I/O size - 100% random write - 64 queue depth**

```bash
fio --ioengine=libaio --direct=1 --nrfiles=4 --numjobs=1 --runtime=1800 --time_based --bs=4k --iodepth=64 --filesize=4G --rw=randwrite --group_reporting --ramp_time=300
```

**8 KiB I/O size - 100% random write - 64 queue depth**

```bash
fio --ioengine=libaio --direct=1 --nrfiles=4 --numjobs=1 --runtime=1800 --time_based --bs=8k --iodepth=64 --filesize=4G --rw=randwrite --group_reporting --ramp_time=300
```

#### High throughput: 100% writes

**64 KiB I/O size  - 100% random write - 64 queue depth**

```bash
fio --ioengine=libaio --direct=1 --nrfiles=4 --numjobs=1 --runtime=1800 --time_based --bs=64k --iodepth=64 --filesize=4G --rw=randwrite --group_reporting --ramp_time=300
```

**1024 KiB I/O size  - 100% random write - 64 queue depth**

```bash
fio --ioengine=libaio --direct=1 --nrfiles=4 --numjobs=1 --runtime=1800 --time_based --bs=1024k --iodepth=64 --filesize=4G --rw=randwrite --group_reporting --ramp_time=300
```

### Performance considerations for `nconnect`

When using the `nconnect` mount option, you should closely evaluate workloads that have the following characteristics:

- Latency sensitive write workloads that are single threaded and/or use a low queue depth (less than 16)
- Latency sensitive read workloads that are single threaded and/or use a low queue depth in combination with smaller I/O sizes

Not all workloads require high-scale IOPS or throughput performance. For smaller scale workloads, `nconnect` might not be beneficial. Use the following table to decide whether `nconnect` is advantageous for your workload. Scenarios highlighted in green are recommended, while scenarios highlighted in red aren't. Scenarios highlighted in yellow are neutral.

:::image type="content" source="media/nfs-performance/nconnect-latency-comparison.png" alt-text="Screenshot showing various read and write I O scenarios with corresponding latency to indicate when nconnect is advisable." border="false":::

## Use zonal placement

For classic file shares created with the Microsoft.Storage resource provider, we recommend using [zonal placement](zonal-placement.md) to select the specific availability zone in which your storage account resides. This allows you to place your VMs in the same availability zone as your storage, which can reduce latency by up to 30 percent. This feature is currently available only for SSD storage accounts using locally redundant storage (LRS) in [supported regions](zonal-placement.md#region-support).

## See also

- [Mount NFS file share to Linux](storage-files-how-to-mount-nfs-shares.md)
- [List of mount options](https://linux.die.net/man/5/nfs)
- [Understand Azure Files performance](understand-performance.md)
