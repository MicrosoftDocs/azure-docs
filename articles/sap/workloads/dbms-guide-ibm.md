---
title: IBM Db2 Azure Virtual Machines DBMS deployment for SAP workload | Microsoft Docs
description: IBM Db2 Azure Virtual Machines DBMS deployment for SAP workload
author: msjuergent
manager: bburns
keywords: 'Azure, Db2, SAP, IBM'
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.date: 08/29/2024
ms.author: juergent
ms.custom: H1Hack27Feb2017, linux-related-content
---

# IBM Db2 Azure Virtual Machines DBMS deployment for SAP workload

With Microsoft Azure, you can migrate your existing SAP application running on IBM Db2 for Linux, UNIX, and Windows (LUW) to Azure virtual machines. With SAP on IBM Db2 for LUW, administrators and developers can still use the same development and administration tools, which are available on-premises.
General information about running SAP Business Suite on IBM Db2 for LUW is available via the SAP Community Network (SCN) in [SAP on IBM Db2 for Linux, UNIX, and Windows](https://www.sap.com/community/topic/db2-for-linux-unix-and-windows.html).

For more information and updates about SAP on Db2 for LUW on Azure, see SAP Note [2233094]. 

There are various articles for SAP workload on Azure. We recommend beginning with [Get started with SAP on Azure VMs](./get-started.md) and then read about other areas of interest.

The following SAP Notes are related to SAP on Azure regarding the area covered in this document:

| Note number |Title |
| --- |--- |
| [1928533] |SAP Applications on Azure: Supported Products and Azure VM types |
| [2015553] |SAP on Microsoft Azure: Support Prerequisites |
| [1999351] |Troubleshooting Enhanced Azure Monitoring for SAP |
| [2178632] |Key Monitoring Metrics for SAP on Microsoft Azure |
| [1409604] |Virtualization on Windows: Enhanced Monitoring |
| [2191498] |SAP on Linux with Azure: Enhanced Monitoring |
| [2233094] |DB6: SAP Applications on Azure Using IBM DB2 for Linux, UNIX, and Windows - Additional Information |
| [2243692] |Linux on Microsoft Azure (IaaS) VM: SAP license issues |
| [1984787] |SUSE LINUX Enterprise Server 12: Installation notes |
| [2002167] |Red Hat Enterprise Linux 7.x: Installation and Upgrade |
| [1597355] |Swap-space recommendation for Linux |

As a preread to this document, review [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-general.md). Review other guides in the [SAP workload on Azure](./get-started.md). 


## IBM Db2 for Linux, UNIX, and Windows Version Support
SAP on IBM Db2 for LUW on Microsoft Azure Virtual Machine Services is supported as of Db2 version 10.5.

For information about supported SAP products and Azure VM(Virtual Machines) types, refer to SAP Note [1928533].

## IBM Db2 for Linux, UNIX, and Windows Configuration Guidelines for SAP Installations in Azure VMs
### Storage Configuration
For an overview of Azure storage types for SAP workload, consult the article [Azure Storage types for SAP workload](./planning-guide-storage.md)
All database files must be stored on mounted disks of Azure block storage (Windows: NTFS, Linux: xfs, [supported](https://www.ibm.com/support/pages/file-systems-recommended-db2-linux-unix-and-windows) as of Db2 11.1, or ext3).  
  
Remote shared volumes like the Azure services in the listed scenarios are **NOT** supported for Db2 database files: 

* [Microsoft Azure File Service](/archive/blogs/windowsazurestorage/introducing-microsoft-azure-file-service) for all guest OS.

* [Azure NetApp Files](https://azure.microsoft.com/services/netapp/) for Db2 running in Windows guest OS. 

Remote shared volumes like the Azure services in the listed scenarios are supported for Db2 database files: 
 
* Hosting Linux guest OS based Db2 data and log files on NFS shares hosted on Azure NetApp Files is supported!

If you're using disks based on Azure Page BLOB Storage or Managed Disks, the statements made in [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-general.md) apply to deployments with the Db2 DBMS (Database Management System) as well.

As explained earlier in the general part of the document, quotas on IOPS (I/O operations per second) throughput for Azure disks exist. The exact quotas are depending on the VM type used. A list of VM types with their quotas can be found [here (Linux)](/azure/virtual-machines/sizes) and [here (Windows)](/azure/virtual-machines/sizes).

As long as the current IOPS quota per disk is sufficient, it's possible to store all the database files on one single mounted disk. Whereas you always should separate the data files and transaction log files on different disks/VHDs.

For performance considerations, also refer to chapter 'Data Safety and Performance Considerations for Database Directories' in SAP installation guides.

Alternatively, you can use Windows Storage Pools, which are only available in Windows Server 2012 and higher as described [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-general.md). On Linux, you can use LVM or mdadm to create one large logical device over multiple disks.

<!-- log_dir, sapdata and saptmp are terms in the SAP and DB2 world and now spelling errors -->

For Azure M-Series VM, you can reduce by factors the latency writing into the transaction logs, compared to Azure Premium storage performance, when using Azure Write Accelerator. Therefore, you should deploy Azure Write Accelerator for one or more VHDs that form the volume for the Db2 transaction logs. Details can be read in the document [Write Accelerator](/azure/virtual-machines/how-to-enable-write-accelerator).

IBM Db2 LUW 11.5 released support for 4-KB sector size. Though you need to enable the usage of 4-KB sector size with 11.5 by the configurations setting of db2set DB2_4K_DEVICE_SUPPORT=ON as documented in:

- [Db1 11.5 performance variable](https://www.ibm.com/docs/en/db2/11.5?topic=variables-performance)
- [Db2 registry and environment variables](https://www.ibm.com/docs/en/db2/11.5?topic=variables-registry-environment)

For older Db2 versions, a 512 Byte sector size must be used. Premium SSD disks are 4-KB native and have 512 Byte emulation. Ultra disk uses 4-KB sector size by default. You can enable 512 Byte sector size during creation of Ultra disk. Details are available [Using Azure ultra disks](/azure/virtual-machines/disks-enable-ultra-ssd#deploy-an-ultra-disk---512-byte-sector-size). This 512 Byte sector size is a prerequisite for IBM Db2 LUW versions lower than 11.5.

On Windows using Storage pools for Db2 storage paths for `log_dir`, `sapdata` and `saptmp` directories, you must specify a physical disk sector size of 512 Bytes. When using Windows Storage Pools, you must create the storage pools  manually via command line interface using the parameter `-LogicalSectorSizeDefault`. For more information, see [New-StoragePool](/powershell/module/storage/new-storagepool).

## Recommendation on VM and disk structure for IBM Db2 deployment

IBM Db2 for SAP NetWeaver Applications is supported on any VM type listed in SAP support note [1928533].  Recommended VM families for running IBM Db2 database are Esd_v4/Eas_v4/Es_v3 and M/M_v2-series for large multi-terabyte databases. The IBM Db2 transaction log disk write performance can be improved by enabling the M-series Write Accelerator. 

Following is a baseline configuration for various sizes and uses of SAP on Db2 deployments from small to x-large.  

>[!IMPORTANT]
> The VM types listed below are examples that meet the vCPU and memory criteria of each of the categories. The storage configuration is based on Azure premium storage v1. Premium SSD v2 and Azure Ultra disk is fully supported with IBM Db2 as well and can be used for deployments. Use the values for capacity, burst throughput, and burst IOPS to define the Ultra disk or Premium SSD v2 configuration. You can limit the IOPS for the /db2/```<SID>```/log_dir at around 5000 IOPS. Adjust the throughput and IOPS to the specific workload if these baseline recommendations don't meet the requirements

#### Extra small SAP system: database size 50 - 200 GB: example Solution Manager
| VM Size / Examples |Db2 mount point |Azure Premium Disk |# of Disks |IOPS |Through-<br />put [MB/s] |Size [GB] |Burst IOPS |Burst Through-<br />put [GB] | Stripe size | Caching |
| --- | --- | --- | :---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| vCPU: 4 |/db2 |P6 |1 |240  |50  |64  |3,500  |170  ||  |
| RAM: ~32 GiB |/db2/```<SID>```/sapdata |P10 |2 |1,000  |200  |256  |7,000  |340  |256<br />KB |ReadOnly |
| E4(d)s_v5|/db2/```<SID>```/saptmp |P6 |1 |240  |50  |128  |3,500  |170  | ||
| E4(d)as_v5 |/db2/```<SID>```/log_dir |P6 |2 |480  |100  |128  |7,000  |340  |64<br />KB ||
| ... |/db2/```<SID>```/offline_log_dir |P10 |1 |500  |100  |128  |3,500  |170  || |

#### Small SAP system: database size 200 - 750 GB: small Business Suite
| VM Size / Examples |Db2 mount point |Azure Premium Disk |# of Disks |IOPS |Through-<br />put [MB/s] |Size [GB] |Burst IOPS |Burst Through-<br />put [GB] | Stripe size | Caching |
| --- | --- | --- | :---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| vCPU: 16 |/db2 |P6 |1 |240  |50  |64  |3,500  |170  || |
| RAM: ~128 GiB |/db2/```<SID>```/sapdata |P15 |4 |4,400  |500  |1.024  |14,000  |680  |256 KB |ReadOnly |
| E16(d)s_v5 |/db2/```<SID>```/saptmp |P6 |2 |480  |100  |128  |7,000  |340  |128 KB ||
| E16(d)as_v5 |/db2/```<SID>```/log_dir |P15 |2 |2,200  |250  |512  |7,000  |340  |64<br />KB ||
| ... |/db2/```<SID>```/offline_log_dir |P10 |1 |500  |100  |128  |3,500  |170  ||| 

#### Medium SAP system: database size 500 - 1000 GB: small Business Suite
| VM Size / Examples |Db2 mount point |Azure Premium Disk |# of Disks |IOPS |Through-<br />put [MB/s] |Size [GB] |Burst IOPS |Burst Through-<br />put [GB] | Stripe size | Caching |
| --- | --- | --- | :---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| vCPU: 32 |/db2 |P6 |1 |240  |50  |64  |3,500  |170  || |
| RAM: ~256 GiB |/db2/```<SID>```/sapdata |P30 |2 |10,000  |400  |2.048  |10,000  |400  |256 KB |ReadOnly |
| E32(d)s_v5 |/db2/```<SID>```/saptmp |P10 |2 |1,000  |200  |256  |7,000  |340  |128 KB ||
| E32(d)as_v5 |/db2/```<SID>```/log_dir |P20 |2 |4,600  |300  |1.024  |7,000  |340  |64<br />KB ||
| M32ls |/db2/```<SID>```/offline_log_dir |P15 |1 |1,100  |125  |256  |3,500  |170  ||| 

#### Large SAP system: database size 750 - 2000 GB: Business Suite
| VM Size / Examples |Db2 mount point |Azure Premium Disk |# of Disks |IOPS |Through-<br />put [MB/s] |Size [GB] |Burst IOPS |Burst Through-<br />put [GB] | Stripe size | Caching |
| --- | --- | --- | :---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| vCPU: 64 |/db2 |P6 |1 |240  |50  |64  |3,500  |170  || |
| RAM: ~512 GiB |/db2/```<SID>```/sapdata |P30 |4 |20,000  |800  |4.096  |20,000  |800  |256 KB |ReadOnly |
| E64(d)s_v5 |/db2/```<SID>```/saptmp |P15 |2 |2,200  |250  |512  |7,000  |340  |128 KB ||
| E64(d)as_v5 |/db2/```<SID>```/log_dir |P20 |4 |9,200  |600  |2.048  |14,000  |680  |64<br />KB ||
| M64ls |/db2/```<SID>```/offline_log_dir |P20 |1 |2,300  |150  |512  |3,500  |170  || |

#### Large multi-terabyte SAP system: database size 2 TB+: Global Business Suite system
Especially for such larger systems it's important to evaluate the infrastructure that the system is currently running on and the resource consumption data of those systems to find the best match of Azure compute and storage infrastructure and configuration.

| VM Name / Size |Db2 mount point |Azure Premium Disk |# of Disks |IOPS |Through-<br />put [MB/s] |Size [GB] |Burst IOPS |Burst Through-<br />put [GB] | Stripe size | Caching |
| --- | --- | --- | :---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| vCPU: =>128 |/db2 |P10 |1 |500  |100  |128  |3,500  |170  || |
| RAM:  =>2,048 GiB |/db2/```<SID>```/sapdata |P40 |4 |30,000  |1.000  |8.192  |30,000  |1.000  |256 KB |ReadOnly |
| M128s_v2 |/db2/```<SID>```/saptmp |P20 |2 |4,600  |300  |1.024  |7,000  |340  |128 KB ||
| M176s_2_v3 |/db2/```<SID>```/log_dir |P30 |4 |20,000  |800  |4.096  |20,000  |800  |64<br />KB |Write-<br />Accelerator |
| M176s_3_v3,<br />M176s_4_v3 |/db2/```<SID>```/offline_log_dir |P30 |1 |5,000  |200  |1.024  |5,000  |200  || |


### Using Azure NetApp Files
The usage of NFS v4.1 volumes based on Azure NetApp Files (ANF) is supported with IBM Db2, hosted in Suse or Red Hat Linux guest OS. You should create at least four different volumes that list like:

- Shared volume for saptmp1, sapmnt, usr_sap, ```<sid>```_home, db2```<sid>```_home, db2_software
- One data volume for sapdata1 to sapdatan
- One log volume for the redo log directory
- One volume for the log archives and backups

A fifth potential volume could be an ANF volume that you use for more long-term backups that you use to snapshot and store the snapshots in Azure Blob store.

The configuration could look like shown here:

![Example of Db2 configuration using ANF](./media/dbms_guide_ibm/anf-configuration-example.png)


The performance tier and the size of the ANF hosted volumes must be chosen based on the performance requirements. However, we recommend taking the Ultra performance level for the data and the log volume. It isn't supported to mix block storage and shared storage types for the data and log volume.

As of mount options, mounting those volumes could look like (you need to replace ```<SID>``` and ```<sid>``` by the SID of your SAP system):

```
vi /etc/idmapd.conf   
 # Example
 [General]
 Domain = defaultv4iddomain.com
 [Mapping]
 Nobody-User = nobody
 Nobody-Group = nobody

mount -t nfs -o rw,hard,sync,rsize=262144,wsize=262144,sec=sys,vers=4.1,tcp 172.17.10.4:/db2shared /mnt 
mkdir -p /db2/Software /db2/AN1/saptmp /usr/sap/<SID> /sapmnt/<SID> /home/<sid>adm /db2/db2<sid> /db2/<SID>/db2_software
mkdir -p /mnt/Software /mnt/saptmp  /mnt/usr_sap /mnt/sapmnt /mnt/<sid>_home /mnt/db2_software /mnt/db2<sid>
umount /mnt

mount -t nfs -o rw,hard,sync,rsize=262144,wsize=262144,sec=sys,vers=4.1,tcp 172.17.10.4:/db2data /mnt
mkdir -p /db2/AN1/sapdata/sapdata1 /db2/AN1/sapdata/sapdata2 /db2/AN1/sapdata/sapdata3 /db2/AN1/sapdata/sapdata4
mkdir -p /mnt/sapdata1 /mnt/sapdata2 /mnt/sapdata3 /mnt/sapdata4
umount /mnt

mount -t nfs -o rw,hard,sync,rsize=262144,wsize=262144,sec=sys,vers=4.1,tcp 172.17.10.4:/db2log /mnt 
mkdir /db2/AN1/log_dir
mkdir /mnt/log_dir
umount /mnt

mount -t nfs -o rw,hard,sync,rsize=262144,wsize=262144,sec=sys,vers=4.1,tcp 172.17.10.4:/db2backup /mnt
mkdir /db2/AN1/backup
mkdir /mnt/backup
mkdir /db2/AN1/offline_log_dir /db2/AN1/db2dump
mkdir /mnt/offline_log_dir /mnt/db2dump
umount /mnt
```

>[!NOTE]
> The mount option hard and sync are required


### Backup/Restore
The backup/restore functionality for IBM Db2 for LUW is supported in the same way as on standard Windows Server Operating Systems and Hyper-V.

Make sure that you have a valid database backup strategy in place. 

As in bare-metal deployments, backup/restore performance depends on how many volumes can be read in parallel and what the throughput of those volumes might be. In addition, the CPU consumption used by backup compression may play a significant role on VMs with up to eight CPU threads. Therefore, one can assume:

* The fewer the number of disks used to store the database devices, the smaller the overall throughput in reading
* The smaller the number of CPU threads in the VM, the more severe the impact of backup compression
* The fewer targets (Stripe Directories, disks) to write the backup to, the lower the throughput

To increase the number of targets to write to, two options can be used/combined depending on your needs:

* Striping the backup target volume over multiple disks to improve the IOPS throughput on that striped volume
* Using more than one target directory to write the backup to

>[!NOTE]
>Db2 on Windows doesn't support the Windows VSS technology. As a result, the application consistent VM backup of Azure Backup Service can't be leveraged for VMs the Db2 DBMS is deployed in.

### High Availability and Disaster Recovery

#### Linux Pacemaker

>[!IMPORTANT]
>For Db2 versions 11.5.6 and higher we highly recommend Integrated solution using Pacemaker from IBM.
>* [Integrated solution using Pacemaker](https://www.ibm.com/docs/en/db2/11.5?topic=feature-integrated-solution-using-pacemaker)
>* [Alternate or additional configurations available on Microsoft Azure](https://www.ibm.com/support/pages/alternate-or-additional-configurations-available-microsoft-azure)
Db2 high availability disaster recovery (HADR) with pacemaker is supported. Both SLES and RHEL operating systems are supported. This configuration enables high availability of IBM Db2 for SAP. Deployment guides:
* SLES: [High availability of IBM Db2 LUW on Azure VMs on SUSE Linux Enterprise Server with Pacemaker](dbms-guide-ha-ibm.md) 
* RHEL: [High availability of IBM Db2 LUW on Azure VMs on Red Hat Enterprise Linux Server](high-availability-guide-rhel-ibm-db2-luw.md)

#### Windows Cluster Server

Windows Server Failover Cluster (WSFC) also known as Microsoft Cluster Server (MSCS) isn't supported.

Db2 high availability disaster recovery (HADR) is supported. If the virtual machines of the HA configuration have working name resolution, the setup in Azure doesn't differ from any setup that is done on-premises. It isn't recommended to rely on IP resolution only.

Don't use Geo-Replication for the storage accounts that store the database disks. For more information, see the document [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-general.md). 

### Accelerated Networking
For Db2 deployments on Windows, we highly recommend using the Azure functionality of Accelerated Networking as described in the document [Azure Accelerated Networking](https://azure.microsoft.com/blog/maximize-your-vm-s-performance-with-accelerated-networking-now-generally-available-for-both-windows-and-linux/). Also consider recommendations made in [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-general.md). 


### Specifics for Linux deployments
As long as the current IOPS quota per disk is sufficient, it's possible to store all the database files on one single disk. Whereas you always should separate the data files and transaction log files on different disks.

If the IOPS or I/O throughput of a single Azure VHD isn't sufficient, you can use LVM (Logical Volume Manager) or MDADM as described in the document [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-general.md) to create one large logical device over multiple disks.
For the disks containing the Db2 storage paths for your `sapdata` and `saptmp` directories, you must specify a physical disk sector size of 512 KB.

<!-- sapdata and saptmp are terms in the SAP and DB2 world and now spelling errors -->


### Other
All other general areas like Azure Availability Sets or SAP monitoring apply for deployments of VMs with the IBM Database as well. These general areas we describe in [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-general.md).

## Next steps
Read the article: 

- [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-general.md)


[767598]:https://launchpad.support.sap.com/#/notes/767598
[773830]:https://launchpad.support.sap.com/#/notes/773830
[826037]:https://launchpad.support.sap.com/#/notes/826037
[965908]:https://launchpad.support.sap.com/#/notes/965908
[1031096]:https://launchpad.support.sap.com/#/notes/1031096
[1114181]:https://launchpad.support.sap.com/#/notes/1114181
[1139904]:https://launchpad.support.sap.com/#/notes/1139904
[1173395]:https://launchpad.support.sap.com/#/notes/1173395
[1245200]:https://launchpad.support.sap.com/#/notes/1245200
[1409604]:https://launchpad.support.sap.com/#/notes/1409604
[1558958]:https://launchpad.support.sap.com/#/notes/1558958
[1585981]:https://launchpad.support.sap.com/#/notes/1585981
[1588316]:https://launchpad.support.sap.com/#/notes/1588316
[1590719]:https://launchpad.support.sap.com/#/notes/1590719
[1597355]:https://launchpad.support.sap.com/#/notes/1597355
[1605680]:https://launchpad.support.sap.com/#/notes/1605680
[1619720]:https://launchpad.support.sap.com/#/notes/1619720
[1619726]:https://launchpad.support.sap.com/#/notes/1619726
[1619967]:https://launchpad.support.sap.com/#/notes/1619967
[1750510]:https://launchpad.support.sap.com/#/notes/1750510
[1752266]:https://launchpad.support.sap.com/#/notes/1752266
[1757924]:https://launchpad.support.sap.com/#/notes/1757924
[1757928]:https://launchpad.support.sap.com/#/notes/1757928
[1758182]:https://launchpad.support.sap.com/#/notes/1758182
[1758496]:https://launchpad.support.sap.com/#/notes/1758496
[1772688]:https://launchpad.support.sap.com/#/notes/1772688
[1814258]:https://launchpad.support.sap.com/#/notes/1814258
[1882376]:https://launchpad.support.sap.com/#/notes/1882376
[1909114]:https://launchpad.support.sap.com/#/notes/1909114
[1922555]:https://launchpad.support.sap.com/#/notes/1922555
[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[1941500]:https://launchpad.support.sap.com/#/notes/1941500
[1956005]:https://launchpad.support.sap.com/#/notes/1956005
[1973241]:https://launchpad.support.sap.com/#/notes/1973241
[1984787]:https://launchpad.support.sap.com/#/notes/1984787
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2002167]:https://launchpad.support.sap.com/#/notes/2002167
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2039619]:https://launchpad.support.sap.com/#/notes/2039619
[2069760]:https://launchpad.support.sap.com/#/notes/2069760
[2121797]:https://launchpad.support.sap.com/#/notes/2121797
[2134316]:https://launchpad.support.sap.com/#/notes/2134316
[2171857]:https://launchpad.support.sap.com/#/notes/2171857
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2233094]:https://launchpad.support.sap.com/#/notes/2233094
[2243692]:https://launchpad.support.sap.com/#/notes/2243692

[dbms-guide]:dbms-guide-general.md 
[dbms-guide-2.1]:dbms-guide-general.md#c7abf1f0-c927-4a7c-9c1d-c7b5b3b7212f 
[dbms-guide-2.2]:dbms-guide-general.md#c8e566f9-21b7-4457-9f7f-126036971a91 
[dbms-guide-2.3]:dbms-guide-general.md#10b041ef-c177-498a-93ed-44b3441ab152 
[dbms-guide-2]:dbms-guide-general.md#65fa79d6-a85f-47ee-890b-22e794f51a64 
[dbms-guide-3]:dbms-guide-general.md#871dfc27-e509-4222-9370-ab1de77021c3 
[dbms-guide-5.5.1]:dbms-guide-general.md#0fef0e79-d3fe-4ae2-85af-73666a6f7268 
[dbms-guide-5.5.2]:dbms-guide-general.md#f9071eff-9d72-4f47-9da4-1852d782087b 
[dbms-guide-5.6]:dbms-guide-general.md#1b353e38-21b3-4310-aeb6-a77e7c8e81c8 
[dbms-guide-5.8]:dbms-guide-general.md#9053f720-6f3b-4483-904d-15dc54141e30 
[dbms-guide-5]:dbms-guide-general.md#3264829e-075e-4d25-966e-a49dad878737 
[dbms-guide-8.4.1]:dbms-guide-general.md#b48cfe3b-48e9-4f5b-a783-1d29155bd573 
[dbms-guide-8.4.2]:dbms-guide-general.md#23c78d3b-ca5a-4e72-8a24-645d141a3f5d 
[dbms-guide-8.4.3]:dbms-guide-general.md#77cd2fbb-307e-4cbf-a65f-745553f72d2c 
[dbms-guide-8.4.4]:dbms-guide-general.md#f77c1436-9ad8-44fb-a331-8671342de818 
[dbms-guide-900-sap-cache-server-on-premises]:dbms-guide-general.md#642f746c-e4d4-489d-bf63-73e80177a0a8
[dbms-guide-managed-disks]:dbms-guide-general.md#f42c6cb5-d563-484d-9667-b07ae51bce29

[dbms-guide-figure-100]:media/virtual-machines-shared-sap-dbms-guide/100_storage_account_types.png
[dbms-guide-figure-200]:media/virtual-machines-shared-sap-dbms-guide/200-ha-set-for-dbms-ha.png
[dbms-guide-figure-300]:media/virtual-machines-shared-sap-dbms-guide/300-reference-config-iaas.png
[dbms-guide-figure-400]:media/virtual-machines-shared-sap-dbms-guide/400-sql-2012-backup-to-blob-storage.png
[dbms-guide-figure-500]:media/virtual-machines-shared-sap-dbms-guide/500-sql-2012-backup-to-blob-storage-different-containers.png
[dbms-guide-figure-600]:media/virtual-machines-shared-sap-dbms-guide/600-iaas-maxdb.png
[dbms-guide-figure-700]:media/virtual-machines-shared-sap-dbms-guide/700-livecach-prod.png
[dbms-guide-figure-800]:media/virtual-machines-shared-sap-dbms-guide/800-azure-vm-sap-content-server.png
[dbms-guide-figure-900]:media/virtual-machines-shared-sap-dbms-guide/900-sap-cache-server-on-premises.png

[deployment-guide]:deployment-guide.md 
[deployment-guide-2.2]:deployment-guide.md#42ee2bdb-1efc-4ec7-ab31-fe4c22769b94 
[deployment-guide-3.1.2]:deployment-guide.md#3688666f-281f-425b-a312-a77e7db2dfab 
[deployment-guide-3.2]:deployment-guide.md#db477013-9060-4602-9ad4-b0316f8bb281 
[deployment-guide-3.3]:deployment-guide.md#54a1fc6d-24fd-4feb-9c57-ac588a55dff2 
[deployment-guide-3.4]:deployment-guide.md#a9a60133-a763-4de8-8986-ac0fa33aa8c1 
[deployment-guide-3]:deployment-guide.md#b3253ee3-d63b-4d74-a49b-185e76c4088e 
[deployment-guide-4.1]:deployment-guide.md#604bcec2-8b6e-48d2-a944-61b0f5dee2f7 
[deployment-guide-4.2]:deployment-guide.md#7ccf6c3e-97ae-4a7a-9c75-e82c37beb18e 
[deployment-guide-4.3]:deployment-guide.md#31d9ecd6-b136-4c73-b61e-da4a29bbc9cc 
[deployment-guide-4.4.2]:deployment-guide.md#6889ff12-eaaf-4f3c-97e1-7c9edc7f7542 
[deployment-guide-4.4]:deployment-guide.md#c7cbb0dc-52a4-49db-8e03-83e7edc2927d 
[deployment-guide-4.5.1]:deployment-guide.md#987cf279-d713-4b4c-8143-6b11589bb9d4 
[deployment-guide-4.5.2]:deployment-guide.md#408f3779-f422-4413-82f8-c57a23b4fc2f 
[deployment-guide-4.5]:deployment-guide.md#d98edcd3-f2a1-49f7-b26a-07448ceb60ca 
[deployment-guide-5.1]:deployment-guide.md#bb61ce92-8c5c-461f-8c53-39f5e5ed91f2 
[deployment-guide-5.2]:deployment-guide.md#e2d592ff-b4ea-4a53-a91a-e5521edb6cd1
[deployment-guide-5.3]:deployment-guide.md#fe25a7da-4e4e-4388-8907-8abc2d33cfd8 

[deployment-guide-configure-monitoring-scenario-1]:deployment-guide.md#ec323ac3-1de9-4c3a-b770-4ff701def65b 
[deployment-guide-configure-proxy]:deployment-guide.md#baccae00-6f79-4307-ade4-40292ce4e02d 
[deployment-guide-figure-100]:media/virtual-machines-shared-sap-deployment-guide/100-deploy-vm-image.png
[deployment-guide-figure-1000]:media/virtual-machines-shared-sap-deployment-guide/1000-service-properties.png
[deployment-guide-figure-11]:deployment-guide.md#figure-11
[deployment-guide-figure-1100]:media/virtual-machines-shared-sap-deployment-guide/1100-azperflib.png
[deployment-guide-figure-1200]:media/virtual-machines-shared-sap-deployment-guide/1200-cmd-test-login.png
[deployment-guide-figure-1300]:media/virtual-machines-shared-sap-deployment-guide/1300-cmd-test-executed.png
[deployment-guide-figure-14]:deployment-guide.md#figure-14
[deployment-guide-figure-1400]:media/virtual-machines-shared-sap-deployment-guide/1400-azperflib-error-servicenotstarted.png
[deployment-guide-figure-300]:media/virtual-machines-shared-sap-deployment-guide/300-deploy-private-image.png
[deployment-guide-figure-400]:media/virtual-machines-shared-sap-deployment-guide/400-deploy-using-disk.png
[deployment-guide-figure-5]:deployment-guide.md#figure-5
[deployment-guide-figure-50]:media/virtual-machines-shared-sap-deployment-guide/50-forced-tunneling-suse.png
[deployment-guide-figure-500]:media/virtual-machines-shared-sap-deployment-guide/500-install-powershell.png
[deployment-guide-figure-6]:deployment-guide.md#figure-6
[deployment-guide-figure-600]:media/virtual-machines-shared-sap-deployment-guide/600-powershell-version.png
[deployment-guide-figure-7]:deployment-guide.md#figure-7
[deployment-guide-figure-700]:media/virtual-machines-shared-sap-deployment-guide/700-install-powershell-installed.png
[deployment-guide-figure-760]:media/virtual-machines-shared-sap-deployment-guide/760-azure-cli-version.png
[deployment-guide-figure-900]:media/virtual-machines-shared-sap-deployment-guide/900-cmd-update-executed.png
[deployment-guide-figure-azure-cli-installed]:deployment-guide.md#402488e5-f9bb-4b29-8063-1c5f52a892d0
[deployment-guide-figure-azure-cli-version]:deployment-guide.md#0ad010e6-f9b5-4c21-9c09-bb2e5efb3fda
[deployment-guide-install-vm-agent-windows]:deployment-guide.md#b2db5c9a-a076-42c6-9835-16945868e866
[deployment-guide-troubleshooting-chapter]:deployment-guide.md#564adb4f-5c95-4041-9616-6635e83a810b

[deploy-template-cli]:../../../resource-group-template-deploy-cli.md
[deploy-template-portal]:../../../resource-group-template-deploy-portal.md
[deploy-template-powershell]:../../../resource-group-template-deploy.md

[dr-guide-classic]:https://go.microsoft.com/fwlink/?LinkID=521971

[getting-started]:get-started.md
[getting-started-dbms]:get-started.md#1343ffe1-8021-4ce6-a08d-3a1553a4db82
[getting-started-deployment]:get-started.md#6aadadd2-76b5-46d8-8713-e8d63630e955
[getting-started-planning]:get-started.md#3da0389e-708b-4e82-b2a2-e92f132df89c

[getting-started-windows-classic]:../../virtual-machines-windows-classic-sap-get-started.md
[getting-started-windows-classic-dbms]:../../virtual-machines-windows-classic-sap-get-started.md#c5b77a14-f6b4-44e9-acab-4d28ff72a930
[getting-started-windows-classic-deployment]:../../virtual-machines-windows-classic-sap-get-started.md#f84ea6ce-bbb4-41f7-9965-34d31b0098ea
[getting-started-windows-classic-dr]:../../virtual-machines-windows-classic-sap-get-started.md#cff10b4a-01a5-4dc3-94b6-afb8e55757d3
[getting-started-windows-classic-ha-sios]:../../virtual-machines-windows-classic-sap-get-started.md#4bb7512c-0fa0-4227-9853-4004281b1037
[getting-started-windows-classic-planning]:../../virtual-machines-windows-classic-sap-get-started.md#f2a5e9d8-49e4-419e-9900-af783173481c

[ha-guide-classic]:https://go.microsoft.com/fwlink/?LinkId=613056

[install-extension-cli]:virtual-machines-linux-enable-aem.md

[Logo_Linux]:media/virtual-machines-shared-sap-shared/Linux.png
[Logo_Windows]:media/virtual-machines-shared-sap-shared/Windows.png

[msdn-set-azurermvmaemextension]:https://msdn.microsoft.com/library/azure/mt670598.aspx

[planning-guide]:planning-guide.md 
[planning-guide-1.2]:planning-guide.md#e55d1e22-c2c8-460b-9897-64622a34fdff 
[planning-guide-11]:planning-guide.md#7cf991a1-badd-40a9-944e-7baae842a058 
[planning-guide-11.4.1]:planning-guide.md#5d9d36f9-9058-435d-8367-5ad05f00de77 
[planning-guide-11.5]:planning-guide.md#4e165b58-74ca-474f-a7f4-5e695a93204f 
[planning-guide-2.1]:planning-guide.md#1625df66-4cc6-4d60-9202-de8a0b77f803 
[planning-guide-2.2]:planning-guide.md#f5b3b18c-302c-4bd8-9ab2-c388f1ab3d10 
[planning-guide-3.1]:planning-guide.md#be80d1b9-a463-4845-bd35-f4cebdb5424a 
[planning-guide-3.2.1]:planning-guide.md#df49dc09-141b-4f34-a4a2-990913b30358 
[planning-guide-3.2.2]:planning-guide.md#fc1ac8b2-e54a-487c-8581-d3cc6625e560 
[planning-guide-3.2.3]:planning-guide.md#18810088-f9be-4c97-958a-27996255c665 
[planning-guide-3.2]:planning-guide.md#8d8ad4b8-6093-4b91-ac36-ea56d80dbf77 
[planning-guide-3.3.2]:planning-guide.md#ff5ad0f9-f7f4-4022-9102-af07aef3bc92 
[planning-guide-5.1.1]:planning-guide.md#4d175f1b-7353-4137-9d2f-817683c26e53 
[planning-guide-5.1.2]:planning-guide.md#e18f7839-c0e2-4385-b1e6-4538453a285c 
[planning-guide-5.2.1]:planning-guide.md#1b287330-944b-495d-9ea7-94b83aff73ef 
[planning-guide-5.2.2]:planning-guide.md#57f32b1c-0cba-4e57-ab6e-c39fe22b6ec3 
[planning-guide-5.2]:planning-guide.md#6ffb9f41-a292-40bf-9e70-8204448559e7 
[planning-guide-5.3.1]:planning-guide.md#6e835de8-40b1-4b71-9f18-d45b20959b79 
[planning-guide-5.3.2]:planning-guide.md#a43e40e6-1acc-4633-9816-8f095d5a7b6a 
[planning-guide-5.4.2]:planning-guide.md#9789b076-2011-4afa-b2fe-b07a8aba58a1 
[planning-guide-5.5.1]:planning-guide.md#4efec401-91e0-40c0-8e64-f2dceadff646 
[planning-guide-5.5.3]:planning-guide.md#17e0d543-7e8c-4160-a7da-dd7117a1ad9d 
[planning-guide-7.1]:planning-guide.md#3e9c3690-da67-421a-bc3f-12c520d99a30 
[planning-guide-7]:planning-guide.md#96a77628-a05e-475d-9df3-fb82217e8f14 
[planning-guide-9.1]:planning-guide.md#6f0a47f3-a289-4090-a053-2521618a28c3 
[planning-guide-azure-premium-storage]:planning-guide.md#ff5ad0f9-f7f4-4022-9102-af07aef3bc92 

[planning-guide-figure-100]:media/virtual-machines-shared-sap-planning-guide/100-single-vm-in-azure.png
[planning-guide-figure-1300]:media/virtual-machines-shared-sap-planning-guide/1300-ref-config-iaas-for-sap.png
[planning-guide-figure-1400]:media/virtual-machines-shared-sap-planning-guide/1400-attach-detach-disks.png
[planning-guide-figure-1600]:media/virtual-machines-shared-sap-planning-guide/1600-firewall-port-rule.png
[planning-guide-figure-1700]:media/virtual-machines-shared-sap-planning-guide/1700-single-vm-demo.png
[planning-guide-figure-1900]:media/virtual-machines-shared-sap-planning-guide/1900-vm-set-vnet.png
[planning-guide-figure-200]:media/virtual-machines-shared-sap-planning-guide/200-multiple-vms-in-azure.png
[planning-guide-figure-2100]:media/virtual-machines-shared-sap-planning-guide/2100-s2s.png
[planning-guide-figure-2200]:media/virtual-machines-shared-sap-planning-guide/2200-network-printing.png
[planning-guide-figure-2300]:media/virtual-machines-shared-sap-planning-guide/2300-sapgui-stms.png
[planning-guide-figure-2400]:media/virtual-machines-shared-sap-planning-guide/2400-vm-extension-overview.png
[planning-guide-figure-2500]:media/virtual-machines-shared-sap-planning-guide/2500-vm-extension-details.png
[planning-guide-figure-2600]:media/virtual-machines-shared-sap-planning-guide/2600-sap-router-connection.png
[planning-guide-figure-2700]:media/virtual-machines-shared-sap-planning-guide/2700-exposed-sap-portal.png
[planning-guide-figure-2800]:media/virtual-machines-shared-sap-planning-guide/2800-endpoint-config.png
[planning-guide-figure-2900]:media/virtual-machines-shared-sap-planning-guide/2900-azure-ha-sap-ha.png
[planning-guide-figure-300]:media/virtual-machines-shared-sap-planning-guide/300-vpn-s2s.png
[planning-guide-figure-3000]:media/virtual-machines-shared-sap-planning-guide/3000-sap-ha-on-azure.png
[planning-guide-figure-3200]:media/virtual-machines-shared-sap-planning-guide/3200-sap-ha-with-sql.png
[planning-guide-figure-400]:media/virtual-machines-shared-sap-planning-guide/400-vm-services.png
[planning-guide-figure-600]:media/virtual-machines-shared-sap-planning-guide/600-s2s-details.png
[planning-guide-figure-700]:media/virtual-machines-shared-sap-planning-guide/700-decision-tree-deploy-to-azure.png
[planning-guide-figure-800]:media/virtual-machines-shared-sap-planning-guide/800-portal-vm-overview.png
[planning-guide-microsoft-azure-networking]:planning-guide.md#61678387-8868-435d-9f8c-450b2424f5bd 
[planning-guide-storage-microsoft-azure-storage-and-data-disks]:planning-guide.md#a72afa26-4bf4-4a25-8cf7-855d6032157f 

[powershell-install-configure]: /powershell/azure/azurerm/install-azurerm-ps
[resource-group-authoring-templates]:../../../resource-group-authoring-templates.md
[resource-group-overview]:../../azure-resource-manager/management/overview.md
[resource-groups-networking]:../../networking/networking-overview.md
[sap-pam]:https://support.sap.com/pam 
[sap-templates-2-tier-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fsap%2Fsap-2-tier-marketplace-image%2Fazuredeploy.json
[sap-templates-2-tier-os-disk]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-user-disk%2Fazuredeploy.json
[sap-templates-2-tier-user-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-user-image%2Fazuredeploy.json
[sap-templates-3-tier-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image%2Fazuredeploy.json
[sap-templates-3-tier-user-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-user-image%2Fazuredeploy.json
[storage-azure-cli]:../../storage/common/storage-azure-cli.md
[storage-azure-cli-copy-blobs]:../../storage/common/storage-azure-cli.md#copy-blobs
[storage-introduction]:../../storage/common/storage-introduction.md
[storage-powershell-guide-full-copy-vhd]:../../storage/common/storage-powershell-guide-full.md#how-to-copy-blobs-from-one-storage-container-to-another
[storage-premium-storage-preview-portal]:../../virtual-machines/disks-types.md
