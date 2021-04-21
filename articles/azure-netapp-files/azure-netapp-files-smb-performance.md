---
title: FAQs about SMB performance for Azure NetApp Files| Microsoft Docs
description: Answers frequently asked questions about SMB performance for Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/30/2020
ms.author: b-juche
---
# FAQs about SMB performance for Azure NetApp Files

This article answers frequently asked questions (FAQs) about SMB performance best practices for Azure NetApp Files.

## Is SMB Multichannel enabled in SMB shares? 

Yes, SMB Multichannel is enabled by default, a change put in place in early January 2020. All SMB shares pre-dating existing SMB volumes have had the feature enabled, and all newly created volumes will also have the feature enabled at time of creation. 

Any SMB connection established before the feature enablement will need to be reset to take advantage of the SMB Multichannel functionality. To reset, you can disconnect and reconnect the SMB share.

## Is RSS supported?

Yes, Azure NetApp Files supports receive-side-scaling (RSS).

With SMB Multichannel enabled, an SMB3 client establishes multiple TCP connections to the Azure NetApp Files SMB server over a network interface card (NIC) that is single RSS capable. 

## Which Windows versions support SMB Multichannel?

Windows has supported SMB Multichannel since Windows 2012 to enable best performance.  See [Deploy SMB Multichannel](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn610980(v%3Dws.11)) and [The basics of SMB Multichannel](/archive/blogs/josebda/the-basics-of-smb-multichannel-a-feature-of-windows-server-2012-and-smb-3-0) for details. 


## Does my Azure virtual machine support RSS?

To see if your Azure virtual machine NICs support RSS, run the command
`Get-SmbClientNetworkInterface` as follows and check the field `RSS Capable`: 

![Screenshot that shows RSS output for Azure virtual machine.](../media/azure-netapp-files/azure-netapp-files-formance-rss-support.png)

## Does Azure NetApp Files support SMB Direct?

No, Azure NetApp Files does not support SMB Direct. 

## What is the benefit of SMB Multichannel? 

The SMB Multichannel feature enables an SMB3 client to establish a pool of connections over a single network interface card (NIC) or multiple NICs and to use them to send requests for a single SMB session. In contrast, by design, SMB1 and SMB2 require the client to establish one connection and send all the SMB traffic for a given session over that connection. This single connection limits the overall protocol performance that can be achieved from a single client.

## Should I configure multiple NICs on my client for SMB?

No. The SMB client will match the NIC count returned by the SMB server.  Each storage volume is accessible from one and only one storage endpoint.  That means that only one NIC will be used for any given SMB relationship.  

As the output of `Get-SmbClientNetworkInterace` below shows, the virtual machine has 2 network interfaces--15 and 12.  As shown under the following command `Get-SmbMultichannelConnection`, even though there are two RSS-capable NICS, only interface 12 is used in connection with the SMB share; interface 15 is not in use.

![Screeshot that shows output for RSS-capable NICS.](../media/azure-netapp-files/azure-netapp-files-rss-capable-nics.png)

## Is NIC Teaming supported in Azure?

NIC Teaming is not supported in Azure. Although multiple network interfaces are supported on Azure virtual machines, they represent a logical rather than a physical construct. As such, they provide no fault tolerance.  Also, the bandwidth available to an Azure virtual machine is calculated for the machine itself and not any individual network interface.

## What’s the performance like for SMB Multichannel?

The following tests and graphs demonstrate the power of SMB Multichannel on single-instance workloads.

### Random I/O  

With SMB Multichannel disabled on the client, pure 4 KiB read and write tests were performed using FIO and a 40 GiB working set.  The SMB share was detached between each test, with increments of the SMB client connection count per RSS network interface settings of `1`,`4`,`8`,`16`, `set-SmbClientConfiguration -ConnectionCountPerRSSNetworkInterface <count>`. The tests show that the default setting of `4` is sufficient for I/O intensive workloads; incrementing to `8` and `16` had negligible effect. 

The command `netstat -na | findstr 445` proved that additional connections were established with increments from `1` to `4` to `8` and to `16`.  Four CPU cores were fully utilized for SMB during each test, as confirmed by the perfmon `Per Processor Network Activity Cycles` statistic (not included in this article.)

![Chart that shows random I/O comparison of SMB Multichannel.](../media/azure-netapp-files/azure-netapp-files-random-io-tests.png)

The Azure virtual machine does not affect SMB (nor NFS) storage I/O limits.  As shown in the following chart, the D32ds instance type has a limited rate of 308,000 for cached storage IOPS and 51,200 for uncached storage IOPS.  However, the graph above shows significantly more I/O over SMB.

![Chart that shows random I/O comparison test.](../media/azure-netapp-files/azure-netapp-files-random-io-tests-list.png)

### Sequential IO 

Tests similar to the random I/O tests described previously were performed with 64-KiB sequential I/O. Although the increases in client connection count per RSS network interface beyond 4’ had no noticeable effect on random I/O, the same does not apply to sequential I/O. As the following graph shows, each increase is associated with a corresponding increase in read throughput. Write throughput remained flat due to network bandwidth restrictions placed by Azure for each instance type/size. 

![Chart that shows throughput test comparison.](../media/azure-netapp-files/azure-netapp-files-sequential-io-tests.png)

Azure places network rate limits on each virtual machine type/size. The rate limit is imposed on outbound traffic only. The number of NICs present on a virtual machine has no bearing on the total amount of bandwidth available to the machine.  For example, the D32ds instance type has an imposed network limit of 16,000 Mbps (2,000 MiB/s).  As the sequential graph above shows, the limit affects the outbound traffic (writes) but not multichannel reads.

![Chart that shows sequential I/O comparison test.](../media/azure-netapp-files/azure-netapp-files-sequential-io-tests-list.png)

## What performance is expected with a single instance with a 1-TB dataset?

To provide more detailed insight into workloads with read/write mixes, the following two charts show the performance of a single, Ultra service-level cloud volume of 50 TB with a 1-TB dataset and with SMB multichannel of 4. An optimal IODepth of 16 was used, and Flexible IO (FIO) parameters were used to ensure the full use of the network bandwidth (`numjobs=16`).

The following chart shows the results for 4k random I/O, with a single VM instance and a read/write mix at 10% intervals:

![Chart that shows Windows 2019 standard _D32ds_v4 4K random IO test.](../media/azure-netapp-files/smb-performance-standard-4k-random-io.png)

The following chart shows the results for sequential I/O:

![Chart that shows Windows 2019 standard _D32ds_v4 64K sequential throughput.](../media/azure-netapp-files/smb-performance-standard-64k-throughput.png)

## What performance is expected when scaling out using 5 VMs with a 1-TB dataset?

These tests with 5 VMs use the same testing environment as the single VM, with each process writing to its own file.

The following chart shows the results for random I/O:

![Chart that shows Windows 2019 standard _D32ds_v4 4K 5-instance randio IO test.](../media/azure-netapp-files/smb-performance-standard-4k-random-io-5-instances.png)

The following chart shows the results for sequential I/O:

![Chart that shows Windows 2019 standard _D32ds_v4 64K 5-instance sequential throughput.](../media/azure-netapp-files/smb-performance-standard-64k-throughput-5-instances.png)

## How do you monitor Hyper-V ethernet adapters and ensure that you maximize network capacity?  

One strategy used in testing with FIO is to set `numjobs=16`. Doing so forks each job into 16 specific instances to maximize the Microsoft Hyper-V Network Adapter.

You can check for activity on each of the adapters in Windows Performance Monitor by selecting **Performance Monitor > Add Counters > Network Interface > Microsoft Hyper-V Network Adapter**.

![Screenshot that shows Performance Monitor Add Counter interface.](../media/azure-netapp-files/smb-performance-performance-monitor-add-counter.png)

After you have data traffic running in your volumes, you can monitor your adapters in Windows Performance Monitor. If you do not use all of these 16 virtual adapters, you might not be maximizing your network bandwidth capacity.

![Screenshot that shows Performance Monitor output.](../media/azure-netapp-files/smb-performance-performance-monitor-output.png)

## Is Accelerated Networking recommended?

For maximum performance, it is recommended that you configure [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-powershell.md) where possible. Keep the following considerations in mind:  

* The Azure portal enables Accelerated Networking by default for virtual machines supporting this feature.  However, other deployment methods such as Ansible and similar configuration tools may not.  Failure to enable Accelerated Networking can hobble the performance of a machine.  
* If Accelerated Networking is not enabled on the network interface of a virtual machine due to its lack of support for an instance type or size, it will remain disabled with larger instance types. You will need manual intervention in those cases.

## Are jumbo frames supported?

Jumbo frames are not supported with Azure virtual machines.

## Is SMB Signing supported? 

The SMB protocol provides the basis for file and print sharing and other networking operations such as remote Windows administration. To prevent man-in-the-middle attacks that modify SMB packets in transit, the SMB protocol supports the digital signing of SMB packets. 

SMB Signing is supported for all SMB protocol versions that are supported by Azure NetApp Files. 

## What is the performance impact of SMB Signing?  

SMB Signing has a deleterious effect upon SMB performance. Among other potential causes of the performance degradation, the digital signing of each packet consumes additional client-side CPU as the perfmon output below shows. In this case, Core 0 appears responsible for SMB, including SMB Signing.  A comparison with the non-multichannel sequential read throughput numbers in the previous section shows that SMB Signing reduces overall throughput from 875MiB/s to approximately 250MiB/s. 

![Chart that shows SMB Signing performance impact.](../media/azure-netapp-files/azure-netapp-files-smb-signing-performance.png)

## What is the anticipated impact of SMB encryption on client workloads?

See [SMB encryption FAQs](azure-netapp-files-faqs.md#smb_encryption_impact).

## Next steps  

- [FAQs About Azure NetApp Files](azure-netapp-files-faqs.md)
- See the [Azure NetApp Files: Managed Enterprise File Shares for SMB Workloads](https://cloud.netapp.com/hubfs/Resources/ANF%20SMB%20Quickstart%20doc%20-%2027-Aug-2019.pdf?__hstc=177456119.bb186880ac5cfbb6108d962fcef99615.1550595766408.1573471687088.1573477411104.328&__hssc=177456119.1.1573486285424&__hsfp=1115680788&hsCtaTracking=cd03aeb4-7f3a-4458-8680-1ddeae3f045e%7C5d5c041f-29b4-44c3-9096-b46a0a15b9b1) about using SMB file shares with Azure NetApp Files.