---
title: Linux NFS mount options best practices for Azure NetApp Files | Microsoft Docs
description: Describes mount options and the best practices about using them with Azure NetApp Files.  
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 12/07/2022
ms.author: anfdocs
---
# Linux NFS mount options best practices for Azure NetApp Files

This article helps you understand mount options and the best practices for using them with Azure NetApp Files.

## `Nconnect` 

Using the `nconnect` mount option allows you to specify the number of connections (network flows) that should be established between the NFS client and NFS endpoint up to a limit of 16. Traditionally, an NFS client uses a single connection between itself and the endpoint.  By increasing the number of network flows, the upper limits of I/O and throughput are increased significantly. Testing has found `nconnect=8` to be the most performant.  

When preparing a multi-node SAS GRID environment for production, you might notice a repeatable 30% reduction in run time going from 8 hours to 5.5 hours: 

| Mount option | Job run times |
|-|-|
| No `nconnect` | 8 hours |
| `nconnect=8`  | 5.5 hours | 

Both sets of tests used the same E32-8_v4 virtual machine and RHEL8.3, with read-ahead set to 15 MiB.

When you use `nconnect`, keep the following rules in mind:

* `nconnect` is supported by Azure NetApp Files on all major Linux distributions but only on newer releases:

    | Linux release | NFSv3 (minimum release) | NFSv4.1 (minimum release) |
    |-|-|-|
    | Redhat Enterprise Linux | RHEL8.3 | RHEL8.3 |
    | SUSE | SLES12SP4 or SLES15SP1 | SLES15SP2 |
    | Ubuntu | Ubuntu18.04 |          |

    > [!NOTE]
    > SLES15SP2 is the minimum SUSE release in which `nconnect` is supported by Azure NetApp Files for NFSv4.1.  All other releases as specified are the first releases that introduced the `nconnect` feature.

* All mounts from a single endpoint will inherit the `nconnect` setting of the first export mounted, as shown in the following scenarios: 

    Scenario 1: `nconnect` is used by the first mount. Therefore, all mounts against the same endpoint use `nconnect=8`.

    * `mount 10.10.10.10:/volume1 /mnt/volume1 -o nconnect=8`
    * `mount 10.10.10.10:/volume2 /mnt/volume2`
    * `mount 10.10.10.10:/volume3 /mnt/volume3`

    Scenario 2: `nconnect` is not used by the first mount. Therefore, no mounts against the same endpoint use `nconnect` even though `nconnect` may be specified thereon.

    * `mount 10.10.10.10:/volume1 /mnt/volume1`
    * `mount 10.10.10.10:/volume2 /mnt/volume2 -o nconnect=8`
    * `mount 10.10.10.10:/volume3 /mnt/volume3 -o nconnect=8`

    Scenario 3: `nconnect` settings are not propagated across separate storage endpoints.  `nconnect` is used by the mount coming from `10.10.10.10` but not by the mount coming from `10.12.12.12`.

    * `mount 10.10.10.10:/volume1 /mnt/volume1 -o nconnect=8`
    * `mount 10.12.12.12:/volume2 /mnt/volume2`

* `nconnect` may be used to increase storage concurrency from any given client. 

For details, see [Linux concurrency best practices for Azure NetApp Files](performance-linux-concurrency-session-slots.md).

### `Nconnect` considerations

[!INCLUDE [nconnect krb5 performance warning](includes/kerberos-nconnect-performance.md)]

## `Rsize` and `Wsize`
 
Examples in this section provide information about how to approach performance tuning. You might need to make adjustments to suit your specific application needs.

The `rsize` and `wsize` flags set the maximum transfer size of an NFS operation.  If `rsize` or `wsize` are not specified on mount, the client and server negotiate the largest size supported by the two.   Currently, both Azure NetApp Files and modern Linux distributions support read and write sizes as large as 1,048,576 Bytes (1 MiB).   However, for best overall throughput and latency, Azure NetApp Files recommends setting both `rsize` and `wsize` no larger than 262,144 Bytes (256 K). You might observe that both increased latency and decreased throughput when using `rsize` and `wsize` larger than 256 KiB. 

For example, [Deploy a SAP HANA scale-out system with standby node on Azure VMs by using Azure NetApp Files on SUSE Linux Enterprise Server](../virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse.md#mount-the-azure-netapp-files-volumes) shows the 256-KiB `rsize` and `wsize` maximum as follows:

```
sudo vi /etc/fstab
# Add the following entries
10.23.1.5:/HN1-data-mnt00001 /hana/data/HN1/mnt00001  nfs rw,vers=4,minorversion=1,hard,timeo=600,rsize=262144,wsize=262144,noatime,_netdev,sec=sys  0  0
10.23.1.6:/HN1-data-mnt00002 /hana/data/HN1/mnt00002  nfs   rw,vers=4,minorversion=1,hard,timeo=600,rsize=262144,wsize=262144,noatime,_netdev,sec=sys  0  0
10.23.1.4:/HN1-log-mnt00001 /hana/log/HN1/mnt00001  nfs   rw,vers=4,minorversion=1,hard,timeo=600,rsize=262144,wsize=262144,noatime,_netdev,sec=sys  0  0
10.23.1.6:/HN1-log-mnt00002 /hana/log/HN1/mnt00002  nfs   rw,vers=4,minorversion=1,hard,timeo=600,rsize=262144,wsize=262144,noatime,_netdev,sec=sys  0  0
10.23.1.4:/HN1-shared/shared /hana/shared  nfs   rw,vers=4,minorversion=1,hard,timeo=600,rsize=262144,wsize=262144,noatime,_netdev,sec=sys  0  0
```
 
For example, SAS Viya recommends a 256-KiB read and write sizes, and [SAS GRID](https://communities.sas.com/t5/Administration-and-Deployment/Azure-NetApp-Files-A-shared-file-system-to-use-with-SAS-Grid-on/m-p/606973/highlight/true#M17740) limits the `r/wsize` to 64 KiB while augmenting read performance with increased read-ahead for the NFS mounts. See [NFS read-ahead best practices for Azure NetApp Files](performance-linux-nfs-read-ahead.md) for details.

The following considerations apply to the use of `rsize` and `wsize`:

* Random I/O operation sizes are often smaller than the `rsize` and `wsize` mount options. As such, in effect, they will not be constrained thereby.
* When using the filesystem cache, sequential I/O will occur at the size predicated by the `rsize` and `wsize` mount options, unless the file size is smaller than `rsize` and `wsize`.
* Operations bypassing the filesystem cache, although still constrained by the `rsize` and `wsize` mount options, will not necessarily issue as large as the maximum specified by `rsize` or `wsize`.  This consideration is important when you use workload generators that have the `directio` option.

*As a best practice with Azure NetApp Files, for best overall throughput and latency, set `rsize` and `wsize` no larger than 262,144 Bytes.*

## Close-to-open consistency and cache attribute timers   

NFS uses a loose consistency model. The consistency is loose because the application does not have to go to shared storage and fetch data every time to use it, a scenario that would have a tremendous impact to application performance.  There are two mechanisms that manage this process: cache attribute timers and close-to-open consistency.

*If the client has complete ownership of data, that is, it is not shared between multiple nodes or systems, there is guaranteed consistency.* In that case, you can reduce the `getattr` access operations to storage and speed up the application by turning off close-to-open (`cto`) consistency (`nocto` as a mount option) and by turning up the timeouts for the attribute cache management (`actimeo=600` as a mount option changes the timer to 10m versus the defaults `acregmin=3,acregmax=30,acdirmin=30,acdirmax=60`). In some testing, `nocto` reduces approximately 65-70% of the `getattr` access calls, and adjusting `actimeo` reduces these calls another 20-25%.

### How attribute cache timers work  

The attributes `acregmin`, `acregmax`, `acdirmin`, and `acdirmax` control the coherency of the cache. The former two attributes control how long the attributes of files are trusted. The latter two attributes control how long the attributes of the directory file itself are trusted (directory size, directory ownership, directory permissions).  The `min` and `max` attributes define minimum and maximum duration over which attributes of a directory, attributes of a file, and cache content of a file are deemed trustworthy, respectively. Between `min` and `max`, an algorithm is used to define the amount of time over which a cached entry is trusted.

For example, consider the default `acregmin` and `acregmax` values, 3 and 30 seconds, respectively.  For instance, the attributes are repeatedly evaluated for the files in a directory.  After 3 seconds, the NFS service is queried for freshness.  If the attributes are deemed valid, the client doubles the trusted time to 6 seconds, 12 seconds, 24 seconds, then as the maximum is set to 30, 30 seconds.  From that point on, until the cached attributes are deemed out of date (at which point the cycle starts over), trustworthiness is defined as 30 seconds being the value specified by `acregmax`.

There are other cases that can benefit from a similar set of mount options, even when there's no complete ownership by the clients, for example, if the clients use the data as read only and data update is managed through another path.  For applications that use grids of clients like EDA, web hosting and movie rendering and have relatively static data sets (EDA tools or libraries, web content, texture data), the typical behavior is that the data set is largely cached on the clients. There are few reads and no writes. There will be many `getattr`/access calls coming back to storage.  These data sets are typically updated through another client mounting the file systems and periodically pushing content updates.

In these cases, there's a known lag in picking up new content and the application still works with potentially out-of-date data.  In these cases, `nocto` and `actimeo` can be used to control the period where out-of-data date can be managed.  For example, in EDA tools and libraries, `actimeo=600` works well because this data is typically updated infrequently.  For small web hosting where clients need to see their data updates timely as they're editing their sites, `actimeo=10` might be acceptable. For large-scale web sites where there's content pushed to multiple file systems, `actimeo=60` might be acceptable.

Using these mount options significantly reduces the workload to storage in these cases. (For example, a recent EDA experience reduced IOPs to the tool volume from >150 K to ~6 K.) Applications can run significantly faster because they can trust the data in memory. (Memory access time is nanoseconds vs. hundreds of microseconds for `getattr`/access on a fast network.)

### Close-to-open consistency 

Close-to-open consistency (the `cto` mount option) ensures that no matter the state of the cache, on open the most recent data for a file is always presented to the application.  

* When a directory is crawled (`ls`, `ls -l` for example) a certain set of RPCs (remote procedure calls) are issued.  
    The NFS server shares its view of the filesystem. As long as `cto` is used by all NFS clients accessing a given NFS export, all clients will see the same list of files and directories therein.  The freshness of the attributes of the files in the directory is controlled by the [attribute cache timers](#how-attribute-cache-timers-work).  In other words, as long as `cto` is used, files appear to remote clients as soon as the file is created and the file lands on the storage.
* When a file is opened, the content of the file is guaranteed fresh from the perspective of the NFS server.  
    If there's a race condition where the content has not finished flushing from Machine 1 when a file is opened on Machine 2, Machine 2 will only receive the data present on the server at the time of the open. In this case, Machine 2 will not retrieve more data from the file until the `acreg` timer is reached, and Machine 2 checks its cache coherency from the server again.  This scenario can be observed using a tail `-f` from Machine 2 when the file is still being written to from Machine 1.

### No close-to-open consistency  

When no close-to-open consistency (`nocto`) is used, the client will trust the freshness of its current view of the file and directory until the cache attribute timers have been breached.  

* When a directory is crawled (`ls`, `ls -l` for example) a certain set of RPCs (remote procedure calls) are issued.  
    The client will only issue a call to the server for a current listing of files when the `acdir` cache timer value has been breached.  In this case, recently created files and directories will not appear and recently removed files and directories will still appear.  

* When a file is opened, as long as the file is still in the cache, its cached content (if any) is returned without validating consistency with the NFS server.

## Next steps  

* [Linux direct I/O best practices for Azure NetApp Files](performance-linux-direct-io.md)
* [Linux filesystem cache best practices for Azure NetApp Files](performance-linux-filesystem-cache.md)
* [Linux concurrency best practices for Azure NetApp Files](performance-linux-concurrency-session-slots.md)
* [Linux NFS read-ahead best practices](performance-linux-nfs-read-ahead.md)
* [Azure virtual machine SKUs best practices](performance-virtual-machine-sku.md) 
* [Performance benchmarks for Linux](performance-benchmarks-linux.md) 
