---
title: Move mainframe storage to Azure Storage
description: Massively scalable Azure storage resources can help mainframe-based organizations migrate and modernize IBM z14 applications.
author: njray
ms.author: larryme
ms.date: 04/02/2019
ms.topic: article
ms.service: storage
---
# Move mainframe storage to Azure

To run mainframe workloads on Microsoft Azure, you need to know how your mainframe’s capabilities compare to Azure. The massively scalable storage resources can help organizations begin to modernize without abandoning the applications they rely on.

Azure provides mainframe-like features and storage capacity that is comparable to IBM z14-based systems (the most current model as of this writing). This article tells you how to get comparable results on Azure.

## Mainframe storage at a glance

The IBM mainframe characterizes storage in two ways. The first is a direct access storage device (DASD). The second is sequential storage. For managing storage, the mainframe provides the Data Facility Storage Management Subsystem
(DFSMS). It manages data access to the various storage devices.

[DASD](https://en.wikipedia.org/wiki/Direct-access_storage_device) refers to a separate device for secondary (not in-memory) storage that allows a unique address to be used for direct access of data. Originally, the term DASD applied to spinning disks, magnetic drums, or data cells. However, now the term can also apply to solid-state storage devices (SSDs), storage area networks (SANs), network attached storage (NAS), and optical drives. For the purposes of this document, DASD refers to spinning disks, SANs, and SSDs.

In contrast to DASD storage, sequential storage on a mainframe refers to devices like tape drives where data is accessed from a starting point, then read or written in a line.

Storage devices are typically attached using a fiber connection (FICON) or are accessed directly on the mainframe’s IO bus using [HiperSockets](https://www.ibm.com/support/knowledgecenter/zosbasics/com.ibm.zos.znetwork/znetwork_85.htm), an IBM technology for high-speed communications between partitions on a server with a hypervisor.

Most mainframe systems separate storage into two types:

- *Online storage* (also know as hot storage) is needed for daily operations. DASD storage is usually used for this purpose. However, sequential storage, such as daily tape backups (logical or physical), can also be used for this purpose.

- *Archive storage* (also known as cold storage) is not guaranteed to be mounted at a given time. Instead, it is mounted and accessed as needed. Archive storage is often implemented using sequential tape backups (logical or physical) for storage.

## Mainframe versus IO latency and IOPS

Mainframes are often used for applications that require high performance IO and low IO latency. They can do this using the FICON connections to IO devices and HiperSockets. When HiperSockets are used to connect applications and devices directly to a mainframe’s IO channel, latency in the microseconds can be achieved.

## Azure storage at a glance

Azure infrastructure-as-a-service ([IaaS](https://azure.microsoft.com/overview/what-is-iaas/)) options for storage provide comparable mainframe capacity.

Microsoft offers petabytes worth of storage for applications hosted in Azure, and you have several storage options. These range from SSD storage for high performance to low-cost blob storage for mass storage and archives. Additionally, Azure provides a data redundancy option for storage—something that takes more effort to set up in a mainframe environment.

Azure storage is available as [Azure Disks](/azure/virtual-machines/windows/managed-disks-overview), [Azure Files](/azure/storage/files/storage-files-introduction), and [Azure Blobs](/azure/storage/blobs/storage-blobs-overview) as the
following table summarizes. Learn more about [when to use each](https://docs.microsoft.com/azure/storage/common/storage-decide-blobs-files-disks).

<!-- markdownlint-disable MD033 -->

<table>
<thead>
    <tr><th>Type</th><th>Description</th><th>Use when you want to:</th></tr>
</thead>
<tbody>
<tr><td>Azure Files
</td>
<td>
Provides an SMB interface, client libraries, and a <a href="https://docs.microsoft.com/rest/api/storageservices/file-service-rest-api">REST</a> interface that allows access from anywhere to stored files.
</td>
<td><ul>
<li>Lift and shift an application to the cloud when the application uses the native file system APIs to share data between it and other applications running in Azure.</li>
<li>Store development and debugging tools that need to be accessed from many VMs.</li>
</ul>
</td>
</tr>
<tr><td>Azure Blobs
</td>
<td>Provides client libraries and a <a href="https://docs.microsoft.com/rest/api/storageservices/blob-service-rest-api">REST</a> interface that allows unstructured data to be stored and accessed at a massive scale in block blobs. Also supports <a href="/azure/storage/blobs/data-lake-storage-introduction">Azure Data Lake Storage Gen2</a> for enterprise big data analytics solutions.
</td>
<td><ul>
<li>Support streaming and random-access scenarios in an application.</li>
<li>Have access to application data from anywhere.</li>
<li>Build an enterprise data lake on Azure and perform big data analytics.</li>
</ul></td>
</tr>
<tr><td>Azure Disks
</td>
<td>Provides client libraries and a <a href="https://docs.microsoft.com/rest/api/compute/disks">REST</a>
interface that allows data to be persistently stored and accessed from an attached virtual hard disk.
</td>
<td><ul>
<li>Lift and shift applications that use native file system APIs to read and write data to persistent disks.</li>
<li>Store data that is not required to be accessed from outside the VM to which the disk is attached.</li>
</ul></td>
</tr>
</tbody>
</table>
<!-- markdownlint-enable MD033 -->

## Azure hot (online) and cold (archive) storage

The type of storage for a given system depends on the requirements of the system, including storage size, throughput, and IOPS. For DASD-type storage on a mainframe, applications on Azure typically use Azure Disks drive storage instead. For mainframe archive storage, blob storage is used on Azure.

SSDs provide the highest storage performance on Azure. The following options are available (as of the writing of this document):

| Type         | Size           | IOPS                  |
|--------------|----------------|-----------------------|
| Ultra SSD    | 4 GB to 64 TB  | 1,200 to 160,000 IOPS |
| Premium SSD  | 32 GB to 32 TB | 12 to 15,000 IOPS     |
| Standard SSD | 32 GB to 32 TB | 12 to 2,000 IOPS      |

Blob storage provides the largest volume of storage on Azure. In addition to storage size, Azure offers both managed and unmanaged storage. With managed storage, Azure takes care of managing the underlying storage accounts. With unmanaged storage, the user takes responsibility for setting up Azure storage accounts of the appropriate size to meet the storage requirements.

## Next steps

- [Mainframe migration](/azure/architecture/cloud-adoption/infrastructure/mainframe-migration/overview)
- [Mainframe rehosting on Azure Virtual Machines](/azure/virtual-machines/workloads/mainframe-rehosting/overview)
- [Move mainframe compute to Azure](mainframe-compute-Azure.md)
- [Deciding when to use Azure Blobs, Azure Files, or Azure Disks](https://docs.microsoft.com/azure/storage/common/storage-decide-blobs-files-disks)
- [Standard SSD Managed Disks for Azure VM workloads](https://docs.microsoft.com/azure/virtual-machines/windows/disks-standard-ssd)

### IBM resources

- [Parallel Sysplex on IBM Z](https://www.ibm.com/it-infrastructure/z/technologies/parallel-sysplex-resources)
- [IBM CICS and the Coupling Facility: Beyond the Basics](https://www.redbooks.ibm.com/redbooks/pdfs/sg248420.pdf)
- [Creating required users for a Db2 pureScale Feature installation](https://www.ibm.com/support/knowledgecenter/en/SSEPGG_11.1.0/com.ibm.db2.luw.qb.server.doc/doc/t0055374.html?pos=2)
- [Db2icrt - Create instance command](https://www.ibm.com/support/knowledgecenter/en/SSEPGG_11.1.0/com.ibm.db2.luw.admin.cmd.doc/doc/r0002057.html)
- [Db2 pureScale Clustered Database Solution](https://www.ibmbigdatahub.com/blog/db2-purescale-clustered-database-solution-part-1)
- [IBM Data Studio](https://www.ibm.com/developerworks/downloads/im/data/index.html/)

### Azure Government

- [Microsoft Azure Government cloud for mainframe applications](https://azure.microsoft.com/resources/microsoft-azure-government-cloud-for-mainframe-applications/)
- [Microsoft and FedRAMP](https://www.microsoft.com/TrustCenter/Compliance/FedRAMP)

### More migration resources

- [Azure Virtual Data Center Lift and Shift Guide](https://azure.microsoft.com/resources/azure-virtual-datacenter-lift-and-shift-guide/)
- [GlusterFS iSCSI](https://docs.gluster.org/en/latest/Administrator%20Guide/GlusterFS%20iSCSI/)
