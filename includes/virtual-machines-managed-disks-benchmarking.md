---
 title: include file
 description: include file
 author: roygara
 ms.service: azure-disk-storage
 ms.topic: include
 ms.date: 01/29/2021
 ms.author: rogarana
 ms.custom: include file
---

## Warm up the Cache

The disk with ReadOnly host caching is able to give higher IOPS than the disk limit. To get this maximum read performance from the host cache, first you must warm up the cache of this disk. This ensures that the Read IOs that the benchmarking tool will drive on CacheReads volume, actually hits the cache, and not the disk directly. The cache hits result in more IOPS from the single cache enabled disk.

> [!IMPORTANT]
> You must warm up the cache before running benchmarks every time VM is rebooted.

## DISKSPD

[Download the DISKSP tool](https://github.com/Microsoft/diskspd) on the VM. DISKSPD is a tool that you can customize to create your own synthetic workloads. We will use the same setup described above to run benchmarking tests. You can change the specifications to test different workloads.

In this example, we use the following set of baseline parameters:

- -c200G: Creates (or recreates) the sample file used in the test. It can be set in bytes, KiB, MiB, GiB, or blocks. In this case, a large file of 200-GiB target file is used to minimize memory caching.
- -w100: Specifies the percentage of operations that are write requests (-w0 is equivalent to 100% read).
- -b4K: Indicates the block size in bytes, KiB, MiB, or GiB. In this case, 4K block size is used to simulate a random I/O test.
- -F4: Sets a total of four threads.
- -r: Indicates the random I/O test (overrides the -s parameter).
- -o128: Indicates the number of outstanding I/O requests per target per thread. This is also known as the queue depth. In this case, 128 is used to stress the CPU.
- -W7200: Specifies the duration of the warm-up time before measurements start.
- -d30: Specifies the duration of the test, not including warm-up.
- -Sh: Disable software and hardware write caching (equivalent to -Suw).

For a complete list of parameters, see the [GitHub repository](https://github.com/Microsoft/diskspd/wiki/Command-line-and-parameters).

### Maximum write IOPS
We use a high queue depth of 128, a small block size of 8 KB, and four worker threads for driving Write operations. The write workers are driving traffic on the “NoCacheWrites” volume, which has three disks with cache set to “None”.

Run the following command for 30 seconds of warm-up and 30 seconds of measurement:

`diskspd -c200G -w100 -b8K -F4 -r -o128 -W30 -d30 -Sh testfile.dat`

Results show that the Standard_D8ds_v4 VM is delivering its maximum write IOPS limit of 12,800.

:::image type="content" source="../articles/virtual-machines/linux/media/premium-storage-performance/disks-benchmarks-diskspd-max-write-io-per-second.png" alt-text="For 3208642560 total bytes, max total I/Os of 391680, with a total of 101.97 MiB/s, and a total of 13052.65 I/O per second.":::

### Maximum read IOPS

We use a high queue depth of 128, a small block size of four KB, and four worker threads for driving Read operations. The read workers are driving traffic on the “CacheReads” volume, which has one disk with cache set to “ReadOnly”.

Run the following command for two hours of warm-up and 30 seconds of measurement:

`diskspd -c200G -b4K -F4 -r -o128 -W7200 -d30 -Sh testfile.dat`

Results show that the Standard_D8ds_v4 VM is delivering its maximum read IOPS limit of 77,000.

:::image type="content" source="../articles/virtual-machines/linux/media/premium-storage-performance/disks-benchmarks-diskspd-max-read-io-per-second.png" alt-text="For 9652785152 total bytes, there were 2356637 total I/Os, at 306.72 total MiB/s, and a total of 78521.23 I/Os per second.":::

### Maximum throughput

To get the maximum read and write throughput, you can change to a larger block size of 64 KB.
## FIO

FIO is a popular tool to benchmark storage on the Linux VMs. It has the flexibility to select different IO sizes, sequential or random reads and writes. It spawns worker threads or processes to perform the specified I/O operations. You can specify the type of I/O operations each worker thread must perform using job files. We created one job file per scenario illustrated in the examples below. You can change the specifications in these job files to benchmark different workloads running on Premium Storage. In the examples, we are using a Standard_D8ds_v4 running **Ubuntu**. Use the same setup described in the beginning of the benchmark section and warm up the cache before running the benchmark tests.

Before you begin, [download FIO](https://github.com/axboe/fio) and install it on your virtual machine.

Run the following command for Ubuntu,

```
apt-get install fio
```

We use four worker threads for driving Write operations and four worker threads for driving Read operations on the disks. The write workers are driving traffic on the "nocache" volume, which has three disks with cache set to "None". The read workers are driving traffic on the "readcache" volume, which has one disk with cache set to "ReadOnly".

### Maximum write IOPS

Create the job file with following specifications to get maximum Write IOPS. Name it "fiowrite.ini".

```ini
[global]
size=30g
direct=1
iodepth=256
ioengine=libaio
bs=4k
numjobs=4

[writer1]
rw=randwrite
directory=/mnt/nocache
```

Note the follow key things that are in line with the design guidelines discussed in previous sections. These specifications are essential to drive maximum IOPS,  

* A high queue depth of 256.  
* A small block size of 4 KB.  
* Multiple threads performing random writes.

Run the following command to kick off the FIO test for 30 seconds,  

```
sudo fio --runtime 30 fiowrite.ini
```

While the test runs, you are able to see the number of write IOPS the VM and Premium disks are delivering. As shown in the sample below, the Standard_D8ds_v4 VM is delivering its maximum write IOPS limit of 12,800 IOPS.  
    :::image type="content" source="../articles/virtual-machines/linux/media/premium-storage-performance/fio-uncached-writes-1.jpg" alt-text="Number of write IOPS VM and premium SSDs are delivering, shows that writes are 13.1k IOPS.":::

### Maximum read IOPS

Create the job file with following specifications to get maximum Read IOPS. Name it "fioread.ini".

```ini
[global]
size=30g
direct=1
iodepth=256
ioengine=libaio
bs=4k
numjobs=4

[reader1]
rw=randread
directory=/mnt/readcache
```

Note the follow key things that are in line with the design guidelines discussed in previous sections. These specifications are essential to drive maximum IOPS,

* A high queue depth of 256.  
* A small block size of 4 KB.  
* Multiple threads performing random writes.

Run the following command to kick off the FIO test for 30 seconds,

```
sudo fio --runtime 30 fioread.ini
```

While the test runs, you are able to see the number of read IOPS the VM and Premium disks are delivering. As shown in the sample below, the Standard_D8ds_v4 VM is delivering more than 77,000 Read IOPS. This is a combination of the disk and the cache performance.  
    :::image type="content" source="../articles/virtual-machines/linux/media/premium-storage-performance/fio-cached-reads-1.jpg" alt-text="Screenshot of the number of write IOPS VM and premium SSDs are delivering, shows that reads are 78.6k.":::

### Maximum read and write IOPS

Create the job file with following specifications to get maximum combined Read and Write IOPS. Name it "fioreadwrite.ini".

```ini
[global]
size=30g
direct=1
iodepth=128
ioengine=libaio
bs=4k
numjobs=4

[reader1]
rw=randread
directory=/mnt/readcache

[writer1]
rw=randwrite
directory=/mnt/nocache
rate_iops=3200
```

Note the follow key things that are in line with the design guidelines discussed in previous sections. These specifications are essential to drive maximum IOPS,

* A high queue depth of 128.  
* A small block size of 4 KB.  
* Multiple threads performing random reads and writes.

Run the following command to kick off the FIO test for 30 seconds,

```
sudo fio --runtime 30 fioreadwrite.ini
```

While the test runs, you are able to see the number of combined read and write IOPS the VM and Premium disks are delivering. As shown in the sample below, the Standard_D8ds_v4 VM is delivering more than 90,000 combined Read and Write IOPS. This is a combination of the disk and the cache performance.  
    :::image type="content" source="../articles/virtual-machines/linux/media/premium-storage-performance/fio-both-1.jpg" alt-text="Combined read and write IOPS, shows that reads are 78.3k and writes are 12.6k IOPS.":::

### Maximum combined throughput

To get the maximum combined Read and Write Throughput, use a larger block size and large queue depth with multiple threads performing reads and writes. You can use a block size of 64 KB and queue depth of 128.