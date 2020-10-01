---
 title: include file
 description: include file
 services: virtual-machines
 author: albecker1
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/25/2020
 ms.author: albecker1
 ms.custom: include file
---
![Dsv3 Documentation](media/vm-disk-performance/dsv3-documentation.jpg)

The max **uncached** disk throughput is the default storage maximum limit that the virtual machine is able to handle. The max **cached** storage throughput limit is a separate limit when you enable host caching. Host caching works by bringing storage closer to the VM that can be written or read to quickly. The amount of storage that is available to the VM for host caching is in the documentation. For example, you can see the Standard_D8s_v3 comes with 200 GiB of cache storage.

Enabling host caching can be done when creating your virtual machine and attaching disks. You can also adjust to turn on and off host caching your disks on an existing VM.

![Host Caching](media/vm-disk-performance/host-caching.jpg)

The host caching can be adjusted to match your workload requirements for each disk. You can set your host caching to be Read-only for workloads that only do reading operations and Read/write for workloads that do a balance of read and write operations. If your workload doesn't follow either of those patterns, we don't recommend using use host caching. 

Let's run through a couple examples of different host cache settings and see how it effects the data flow and performance. In this first example, we will take a look at what happens with IO requests when the host caching setting is set to **Read-only**.

Set up:
- Standard_D8s_v3 
    - Cached IOPS: 16,000
    - Uncached IOPS: 12,800
- P30 Data Disk 
    - IOPS: 5,000
    - **Host Caching: Read-only** 

When a read is performed and the desired data is available on the cache, the cache returns the requested data and there is no need to read from the disk. This read is counted towards the VM's cached limits.

![Read Host Caching Read Hit](media/vm-disk-performance/host-caching-read-hit.jpg)

When a read is performed and the desired data is **not** available on the cache, the read request is then relayed to the disk who then surfaces it to both the cache and the VM. This read is counted towards both the VM's uncached limit and the VM's cached limit.

![Read Host Caching Read miss](media/vm-disk-performance/host-caching-read-miss.jpg)

When a write is performed, the write has to be written to both the cache and the disk before it is considered complete. This write is counted towards the VM's uncached limit and the VM's cached limit.

![Read Host Caching Write](media/vm-disk-performance/host-caching-write.jpg)

In this next example, let's take a look at what happens with IO requests when the host cache setting is set to **Read/write**.

Set up:
- Standard_D8s_v3 
    - Cached IOPS: 16,000
    - Uncached IOPS: 12,800
- P30 Data Disk 
    - IOPS: 5,000
    - **Host Caching: Read/write** 

Reads are handled the exact same way as Read-only, writes are the only thing that is different with Read/write caching. When writing with host caching set to Read/write, the write only needs to be written to the host cache to be considered complete. The write is then lazily written to the disk as a background process. This means that writes will be counted towards cached IO when it is written to the cache and when it is lazily written to the disk it will count towards the uncached IO.

![Read/Write Host Caching Write](media/vm-disk-performance/host-caching-read-write.jpg)

Let’s continue with an example with our Standard_D8s_v3 virtual machine. Except this time, we'll enable host caching on the disks and now the VM's IOPS limit is 16,000 IOPS. Attached to the VM are three underlying P30 disks that can handle 5,000 IOPS.

Set up:
- Standard_D8s_v3 
    - Cached IOPS: 16,000
    - Uncached IOPS: 12,800
- P30 OS Disk 
    - IOPS: 5,000
    - Host Caching: Read/write 
- 2 P30 Data Disks
    - IOPS: 5,000
    - Host Caching: Read/write

![Host Caching Example](media/vm-disk-performance/host-caching-example-without-remote.jpg)

Now, The application using this Standard_D8s_v3 virtual machine with caching enabled makes a request for 15,000 IOPS. Those requests are broken down as 5,000 IOPS to each underlying disk attached and no performance capping occurs.

## Combined uncached and cached limits

A virtual machine's caching limits are separate from their uncached limits. This means you can enable host caching on disks attached to a vm while also not enabling host caching on other disks to allow your virtual machines to do get a total storage IO of the cached limit plus the uncached limit. Let's run through an example of this to help solidify how these limits work together and we'll continue with the Standard_D8s_v3 virtual machine and premium disks attached configuration.

Set up:
- Standard_D8s_v3 
    - Cached IOPS: 16,000
    - Uncached IOPS: 12,800
- P30 OS Disk 
    - IOPS: 5,000
    - Host Caching: Read/write
- 2 P30 Data Disks X 2
    - IOPS: 5,000
    - Host Caching: Read/write
- 2 P30 Data Disks X 2
    - IOPS: 5,000
    - Host Caching: Disabled

![Host Caching Example With Remote Storage](media/vm-disk-performance/host-caching-example-with-remote.jpg)

Now, The application running on Standard_D8s_v3 virtual machine with makes a request for 25,000 IOPS. This request is broken down as 5,000 IOPS to each underlying disk attached where 3 of those disks are using host caching and 2 of the disks are not. Since the 3 using host caching are within the cached limits of 16,000, those requests are successfully completed and no storage performance capping occurs. Also, since the 2 disks not using host caching are within the uncached limits of 12,800, those requests are also successfully completed and no capping occurs.

## Metrics for disk performance
We have metrics on Azure that provides insight on how your virtual machines and disks are performing. These metrics can be viewed visually through the Azure portal or they can be retrieved through an API call. Metrics are calculated over one-minute intervals. The following Metrics are available to get insight on VM and Disk IO and throughput performance:
- **OS Disk Queue Depth** – The number of current outstanding IO requests that waiting to be read from or written to the OS disk.
- **OS Disk Read Bytes/Sec** – The number of Bytes that are read in a second from the OS disk.
- **OS Disk Read Operations/Sec** – The number of input operations that are read in a second from the OS disk.
- **OS Disk Write Bytes/Sec** – The number of Bytes that are written in a second from the OS disk.
- **OS Disk Write Operations/Sec** – The number of output operations that are written in a second from the OS disk.
- **Data Disk Queue Depth** – The number of current outstanding IO requests that waiting to be read from or written to the data disk(s).
- **Data Disk Read Bytes/Sec** – The number of Bytes that are read in a second from the data disk(s).
- **Data Disk Read Operations/Sec** – The number of input operations that are read in a second from a data disk(s).
- **Data Disk Write Bytes/Sec** – The number of Bytes that are written in a second from the data disk(s).
- **Data Disk Write Operations/Sec** – The number of output operations that are written in a second from a data disk(s).
- **Disk Read Bytes/Sec** – The number of total Bytes that are read in a second from all disks attached to a VM.
- **Disk Read Operations/Sec** – The number of input operations that are read in a second from all disks attached to a VM.
- **Disk Write Bytes/Sec** – The number of Bytes that are written in a second from all disks attached to a VM.
- **Disk Write Operations/Sec** – The number of output operations that are written in a second from all disks attached to a VM.

## Storage IO utilization metrics
Metrics that help diagnose disk IO capping:
- **Data Disk IOPS Consumed Percentage** - the percentage calculated by the data disk IOPS completed over the provisioned data disk IOPS. If this amount is at 100%, your application running will be IO capped from your data disk's IOPS limit.
- **Data Disk Bandwidth Consumed Percentage** - the percentage calculated by the data disk throughput completed over the provisioned data disk throughput. If this amount is at 100%, your application running will be IO capped from your data disk's bandwidth limit.
- **OS Disk IOPS Consumed Percentage** - the percentage calculated by the OS disk IOPS completed over the provisioned OS disk IOPS. If this amount is at 100%, you'll your application running will be IO capped from your OS disk's IOPS limit.
- **OS Disk Bandwidth Consumed Percentage** - the percentage calculated by the OS disk throughput completed over the provisioned OS disk throughput. If this amount is at 100%, your application running will be IO capped from your OS disk's bandwidth limit.

Metrics that help diagnose VM IO capping:
- **VM Cached IOPS Consumed Percentage** - the percentage calculated by the total IOPS completed over the max cached virtual machine IOPS limit. If this amount is at 100%, your application running will be IO capped from your VM's cached IOPS limit.
- **VM Cached Bandwidth Consumed Percentage** - the percentage calculated by the total disk throughput completed over the max cached virtual machine throughput. If this amount is at 100%, your application running will be IO capped from your VM's cached bandwidth limit.
- **VM uncached IOPS Consumed Percentage** - the percentage calculated by the total IOPS on a virtual machine completed over the max uncached  virtual machine IOPS limit. If this amount is at 100%, your application running will be IO capped from your VM's uncached IOPS limit.
- **VM Uncached Bandwidth Consumed Percentage** - the percentage calculated by the total disk throughput on a virtual machine completed over the max provisioned virtual machine throughput. If this amount is at 100%, your application running will be IO capped from your VM's uncached bandwidth limit.

