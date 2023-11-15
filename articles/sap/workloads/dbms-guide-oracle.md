---
title: Oracle Azure Virtual Machines DBMS deployment for SAP workload | Microsoft Docs
description: Oracle Azure Virtual Machines DBMS deployment for SAP workload
author: msjuergent
manager: bburns
tags: azure-resource-manager
keywords: 'SAP, Azure, Oracle, Data Guard'
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.workload: infrastructure
ms.date: 11/15/2023
ms.author: juergent
ms.custom: H1Hack27Feb2017
---

# Azure Virtual Machines Oracle DBMS deployment for SAP workload

This document covers several different areas to consider when deploying Oracle Database for SAP workload in Azure IaaS. Before you read this document, we recommend you read [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](./dbms-guide-general.md).
We also recommend that you read other guides in the [SAP workload on Azure documentation](./get-started.md).

You can find information about Oracle versions and corresponding OS versions that are supported for running SAP on Oracle on Azure in SAP Note [2039619](https://launchpad.support.sap.com/#/notes/2039619).

General information about running SAP Business Suite on Oracle can be found at [SAP on Oracle](https://www.sap.com/community/topic/oracle.html). Oracle software is supported by Oracle to run on Microsoft Azure. For more information about general support for Windows Hyper-V and Azure, check the [Oracle and Microsoft Azure FAQ](https://www.oracle.com/technetwork/topics/cloud/faq-1963009.html).



### The following SAP notes are relevant for an Oracle Installation

| Note number  | Note title  |
| --- | --- |
| 1738053 | [SAPinst for Oracle ASM installation SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/0001738053) |
| 2896926 | [ASM disk group compatibility NetWeaver SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/0002896926) |
| 1550133 | [Using Oracle Automatic Storage Management (ASM) with SAP NetWeaver based Products SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/0001550133)] |
| 888626 | [Redo log layout for high-end systems SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/0000888626) |
| 105047  | [Support for Oracle functions in the SAP environment SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/0000105047) | 
| 2799920 | [Patches for 19c: Database SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/0002799920) |
| 974876 |  [Oracle Transparent Data Encryption (TDE) SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/0000974876) |
| 2936683 | [Oracle Linux 8: SAP Installation and Upgrade SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/2936683) |
| 1672954 | [Oracle 11g, 12c, 18c and 19c: Usage of hugepages on Linux](https://launchpad.support.sap.com/#/notes/1672954) |
| 1171650 | [Automated Oracle DB parameter check](https://launchpad.support.sap.com/#/notes/1171650) |
| 2936683 | [Oracle Linux 8: SAP Installation and Upgrade](https://launchpad.support.sap.com/#/notes/2936683) |

### Specifics for Oracle Database on Oracle Linux

Oracle software is supported by Oracle to run on Microsoft Azure with Oracle Linux as the guest OS. For more information about general support for Windows Hyper-V and Azure, see the [<u>Azure and Oracle FAQ</u>](https://www.oracle.com/technetwork/topics/cloud/faq-1963009.html).

The specific scenario of SAP applications using Oracle Databases is supported as well. Details are discussed in the next part of the document.

### General Recommendations for running SAP on Oracle on Azure 

Installing or migrating existing SAP on Oracle systems to Azure, the following deployment pattern should be followed:

1.  Use the most [recent Oracle Linux](https://docs.oracle.com/en/operating-systems/oracle-linux/8/) version available (Oracle Linux 8.6 or higher)
2.  Use the most recent Oracle Database version available with the latest SAP Bundle Patch (SBP) (Oracle 19 Patch 15 or higher) [2799920 - Patches for 19c: Database](https://launchpad.support.sap.com/#/notes/2799920)
3.  Use Automatic Storage Management (ASM) for small, medium and large sized databases on block storage
4.  Azure Premium Storage SSD should be used. Don't use Standard or other storage types.
5.  ASM removes the requirement for Mirror Log. Follow the guidance from Oracle in Note [888626 - Redo log layout for high-end systems](https://launchpad.support.sap.com/#/notes/888626)
6.  Use ASMLib and don't use udev
7.  Azure NetApp Files deployments should use Oracle dNFS (Oracle’s own high performance Direct NFS solution)
8.  Large databases benefit greatly from large SGA sizes. Large customers should deploy on Azure M-series with 4 TB or more RAM size.
    - Set Linux Huge Pages to 75% of Physical RAM size
    - Set SGA to 90% of Huge Page size
9.  Oracle Home should be located outside of the “root” volume or disk. Use a separate disk or ANF volume. The disk holding the Oracle Home should be 64GB or larger
10. The size of the boot disk for large high performance Oracle database servers is important. As a minimum a P10 disk should be used for M-series or E-series. Don't use small disks such as P4 or P6. A small disk can cause performance issues.
11. Accelerated Networking must be enabled on all VMs. Upgrade to the latest OL release if there are any problems enabling Accelerated Networking
12. Check for updates in this documentation and SAP note [2039619 - SAP Applications on Microsoft Azure using the Oracle Database: Supported Products and Versions - SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/2039619)

For information about which Oracle versions and corresponding OS versions are supported for running SAP on Oracle on Azure Virtual Machines, see SAP Note [<u>2039619</u>](https://launchpad.support.sap.com/#/notes/2039619).

General information about running SAP Business Suite on Oracle can be found in the [<u>SAP on Oracle community page</u>](https://www.sap.com/community/topic/oracle.html). SAP on Oracle on Azure is only supported on Oracle Linux (and not Suse or Red Hat) for application and database servers.
ASCS/ERS servers can use RHEL/SUSE because Oracle client isn't installed or used on these VMs. Application Servers (PAS/AAS) shouldn't be installed on these VMs. Refer to SAP Note [3074643 - OLNX: FAQ: if Pacemaker for Oracle Linux is supported in SAP Environment](https://me.sap.com/notes/3074643). Oracle RAC isn't supported on Azure because RAC would require Multicast networking.

## Storage configuration

There are two recommended storage deployment patterns for SAP on Oracle on Azure:

1.  Oracle Automatic Storage Management (ASM)
2.  Azure NetApp Files (ANF) with Oracle dNFS (Direct NFS)

Customers currently running Oracle databases on EXT4 or XFS file systems with LVM are encouraged to move to ASM. There are considerable performance, administration and reliability advantages to running on ASM compared to LVM. ASM reduces complexity, improves supportability and makes administration tasks simpler. This documentation contains links for Oracle DBAs to learn how to install and manage ASM.

Azure provides [multiple storage solutions](../../virtual-machines/disks-types.md).  The table below details the support status 

| Storage type  | Oracle support    | Sector Size     | Oracle Linux 8.x or higher | Windows Server 2019 |
|--------|------------|--------| ------| -----|
| **Block Storage Type** | | | | |
| Premium SSD | Supported | 512e | ASM Recommended. LVM Supported | No support for ASM on Windows |
| Premium SSD v2 | Supported | 4K Native | ASM Recommended. LVM Supported | No support for ASM on Windows. Change Log File disks from 4K Native to 512e |
| Standard SSD | Not supported | | | |
| Standard HDD | Not supported | | | |
| Ultra disk | Supported | 4K Native | ASM Recommended. LVM Supported | No support for ASM on Windows. Change Log File disks from 4K Native to 512e |
| | | | | |
| **Network Storage Types** | | | | | 
| Azure NetApp Service (ANF) | Supported | - | Oracle dNFS Required | Not supported |
| Azure Files NFS | Not supported | | |
| Azure files SMB | Not supported | | |

Additional considerations that apply list like:
1. No support for DIRECTIO with 4K Native sector size. **Do not set FILESYSTEMIO_OPTIONS for LVM configurations**
2. Oracle 19c and higher fully supports 4K Native sector size with both ASM and LVM
3. Oracle 19c and higher on Linux – when moving from 512e storage to 4K Native storage Log sector sizes must be changed  
4. To migrate from 512/512e sector size to 4K Native Review (Doc ID 1133713.1) – see section “Offline Migration to 4Kb Sector Disks”
5. No support for ASM on Windows platforms
6. No support for 4K Native sector size for Log volume on Windows platforms.  SSDv2 and Ultra Disk must be changed to 512e via the “Edit Disk” pencil icon in the Azure Portal
7. 4K Native sector size is supported on Data volume for Windows platforms only
8. It is recommended to review these MOS articles:
    - Oracle Linux: File System's Buffer Cache versus Direct I/O (Doc ID 462072.1)
    - Supporting 4K Sector Disks (Doc ID 1133713.1)
    - Using 4k Redo Logs on Flash, 4k-Disk and SSD-based Storage (Doc ID 1681266.1)
    - Things To Consider For Setting filesystemio_options And disk_asynch_io (Doc ID 1987437.1)

In all cases it is recommended to use Oracle ASM on Linux with ASMLib.  Performance, administration, support and configuration is optimized with deployment pattern.  Oracle ASM and Oracle dNFS will in general set the correct parameters or bypass parameters (such as FILESYSTEMIO_OPTIONS) and therefore deliver better performance and reliability. 


### Oracle Automatic Storage Management (ASM)

Checklist for Oracle Automatic Storage Management:

1.  All SAP on Oracle on Azure systems are running **ASM** including Development, QAS and Production. Small, Medium and Large databases
2.  [**ASMLib**](https://docs.oracle.com/en/database/oracle/oracle-database/19/ladbi/about-oracle-asm-with-oracle-asmlib.html)
    is used and not UDEV. UDEV is required for multiple SANs, a scenario that doesn't exist on Azure
3.  ASM should be configured for **External Redundancy**. Azure Premium SSD storage has built in triple redundancy. Azure Premium SSD matches the reliability and integrity of any other storage solution. For optional safety customers can consider **Normal Redundancy** for the Log Disk Group
4.  No Mirror Log is required for ASM [888626 - Redo log layout for high-end systems](https://launchpad.support.sap.com/#/notes/888626)
5.  ASM Disk Groups configured as per Variant 1, 2 or 3 below
6.  ASM Allocation Unit size = 4MB (default). VLDB OLAP systems such as BW may benefit from larger ASM Allocation Unit size. Change only after confirming with Oracle support
7.  ASM Sector Size and Logical Sector Size = default (UDEV isn't recommended but requires 4k)
8.  Appropriate ASM Variant is used. Production systems should use Variant 2 or 3

### Oracle Automatic Storage Management Disk Groups

Part II of the official Oracle Guide describes the installation and the management of ASM:

- [Oracle Automatic Storage Management Administrator's Guide, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/ostmg/index.html)
- [Oracle Grid Infrastructure Grid Infrastructure Installation and Upgrade Guide, 19c for Linux](https://docs.oracle.com/en/database/oracle/oracle-database/19/cwlin/index.html)

The following ASM limits exist for Oracle Database 12c or later:

511 disk groups, 10,000 ASM disks in a Disk Group, 65,530 ASM disks in a storage system, 1 million files for each Disk Group. More info here: [Performance and Scalability Considerations for Disk Groups (oracle.com)](https://docs.oracle.com/en/database/oracle/oracle-database/19/ostmg/performance-scability-diskgroup.html#GUID-5AC1176D-D331-4C1C-978F-0ECA43E0900F)

Review the ASM documentation in the relevant SAP Installation Guide for Oracle available from <https://help.sap.com/viewer/nwguidefinder>

### Variant 1 – small to medium data volumes up to 3 TB, restore time not critical

Customer has small or medium sized databases where backup and/or restore + recovery of all databases can be accomplished by RMAN in a timely fashion. Example: When a complete Oracle ASM disk group, with data files, from one or more databases is broken and all data files from all databases need to be restored to a newly created Oracle ASM disk group using RMAN.

Oracle ASM disk group recommendation:

|ASM Disk Group Name   |Stores                        | Azure Storage       |
|----------------------|------------------------------|--------------------|
| **+DATA**  |All data files |3-6 x P 30 (1 TiB) |
| |Control file (first copy) | To increase DB size, add extra P30 disks |
| |Online redo logs (first copy) |                    |
| **+ARCH** |Control file (second copy) | 2 x P20 (512 GiB) |
| |Archived redo logs  |  |
| **+RECO**  |Control file (third copy) | 2 x P20 (512 GiB) |
|  |RMAN backups (optional) |  |
|  |  recovery area (optional) |   |

### Variant 2 – medium to large data volumes between 3 TB and 12 TB, restore time important

Customer has medium to large sized databases where backup and/or restore
+

recovery of all databases can't be accomplished in a timely fashion.

Usually customers are using RMAN, Azure Backup for Oracle and/or disk snap techniques in combination.

Major differences to Variant 1 are:

1.  Separate Oracle ASM Disk Group for each database
2.  \<DBNAME\>+“\_” is used as a prefix for the name of the DATA disk group
3.  The number of the DATA disk group is appended if the database spans over more than one DATA disk group
4.  No online redo logs are located in the “data” disk groups. Instead an extra disk group is used for the first member of each online redo log group.

| ASM Disk Group Name   | Stores |Azure Storage |
|---|----|---|
| **+\<DBNAME\>\_DATA[#]** | All data files | 3-12 x P 30 (1 TiB) |
|   | All temp files | To increase DB size, add extra P30 disks |
|   |Control file (first copy)   |  |
| **+OLOG**  | Online redo logs (first copy) | 3 x P20 (512 GiB) |
| **+ARCH**  | Control file (second copy) |3 x P20 (512 GB) |
|   | Archived redo logs  |   |
| **+RECO** | Control file (third copy) | 3 x P20 (512 GiB)  |
|   |RMAN backups (optional)  |   |
|    |Fast recovery area (optional) |  |



### Variant 3 – huge data and data change volumes more than 5 TB, restore time crucial

Customer has a huge database where backup and/or restore + recovery of a single database can't be accomplished in a timely fashion.

Usually customers are using RMAN, Azure Backup for Oracle and/or disk snap techniques in combination. In this variant, each relevant database file type is separated to different Oracle ASM disk groups.

|ASM Disk Group Name | Stores | Azure Storage  |
|---|---|---|
| **+\<DBNAME\>\_DATA[#]** | All data files  |5-30 or more x P30 (1 TiB) or P40 (2 TiB) 
|   | All temp files  To increase DB size, add extra P30 disks |
|   |Control file (first copy)  |  |
| **+OLOG** | Online redo logs (first copy) |3-8 x P20 (512 GiB) or P30 (1 TiB)  |
|   |    | For more safety “Normal Redundancy” can be selected for this ASM Disk Group |
|**+ARCH** | Control file (second copy) |3-8 x P20 (512 GiB) or P30 (1 TiB) |
|   | Archived redo logs | |
| **+RECO** | Control file (third copy) |3 x P30 (1 TiB), P40 (2 TiB) or P50 (4 TiB) |
|    |RMAN backups (optional)  |  |
|     | Fast recovery area (optional) |   |



> [!NOTE]
> Azure Host Disk Cache for the DATA ASM Disk Group can be set to either Read Only or None. All other ASM Disk Groups should be set to None. On BW or SCM a separate ASM Disk Group for TEMP can be considered for large or busy systems.

### Adding Space to ASM + Azure Disks

Oracle ASM Disk Groups can either be extended by adding extra disks or by extending current disks. It's recommended to add extra disks rather than extending existing disks. Review these MOS articles and links MOS Notes 1684112.1 and 2176737.1

ASM adds a disk to the disk group:
`asmca -silent -addDisk -diskGroupName DATA -disk '/dev/sdd1'`

ASM automatically rebalances the data. 
To check rebalancing run this command.

`ps -ef | grep rbal`

`oraasm 4288 1 0 Jul28 ? 00:04:36 asm_rbal_oradb1`


Documentation is available with:
- [How to Resize ASM Disk Groups Between Multiple Zones (aemcorp.com)](https://www.aemcorp.com/managedservices/blog/resizing-asm-disk-groups-between-multiple-zones)
- [RESIZING - Altering Disk Groups (oracle.com)](https://docs.oracle.com/en/database/oracle/oracle-database/21/ostmg/alter-diskgroups.html#GUID-6AEFFA72-7BDC-4AA8-8667-8417AAF3DAC8)

### Monitoring SAP on Oracle ASM Systems on Azure

Run an Oracle AWR report as the first step when troubleshooting a performance problem. Disk performance metrics are detailed in the AWR report.

Disk performance can be monitored from inside Oracle Enterprise Manager and via external tools. Documentation, which might help is available here:
- [Using Views to Display Oracle ASM Information](https://docs.oracle.com/en/database/oracle/oracle-database/19/ostmg/views-asm-info.html#GUID-23E1F0D8-ECF5-4A5A-8C9C-11230D2B4AD4)
- [ASMCMD Disk Group Management Commands (oracle.com)](https://docs.oracle.com/en/database/oracle/oracle-database/19/ostmg/asmcmd-diskgroup-commands.html#GUID-55F7A91D-2197-467C-9847-82A3308F0392)

OS level monitoring tools can't monitor ASM disks as there is no recognizable file system. Freespace monitoring must be done from within Oracle.

### Training Resources on Oracle Automatic Storage Management (ASM)

Oracle DBAs that aren't familiar with Oracle ASM follow the training materials and resources here:
- [Sap on Oracle with ASM on Microsoft Azure - Part1 - Microsoft Tech Community](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/sap-on-oracle-with-asm-on-microsoft-azure-part1/ba-p/1865024)
- [Oracle19c DB \[ ASM \] installation on \[ Oracle Linux 8.3 \] \[ Grid \| ASM \| UDEV \| OEL 8.3 \] \[ VMware \] - YouTube](https://www.youtube.com/watch?v=pRJgiuT-S2M)
- [ASM Administrator's Guide (oracle.com)](https://docs.oracle.com/en/database/oracle/oracle-database/19/ostmg/automatic-storage-management-administrators-guide.pdf)
- [Oracle for SAP Development Update (May 2022)](https://www.oracle.com/a/ocom/docs/sap-on-oracle-dev-update.pdf)
- [Performance and Scalability Considerations for Disk Groups (oracle.com)](https://docs.oracle.com/en/database/oracle/oracle-database/19/ostmg/performance-scability-diskgroup.html#GUID-BC6544D7-6D59-42B3-AE1F-4201D3459ADD)
- [Migrating to Oracle ASM with Oracle Enterprise Manager](https://docs.oracle.com/en/database/oracle/oracle-database/19/ostmg/admin-asm-em.html#GUID-002546C0-7D5F-46E9-B3AD-CDCFF25AFEA0)
- [Using RMAN to migrate to ASM \| The Oracle Mentor (wordpress.com)](https://theoraclementor.wordpress.com/2013/07/07/using-rman-to-migrate-to-asm/)
- [<u>What is Oracle ASM to Azure IaaS? - Simple Talk (red-gate.com)</u>](https://www.red-gate.com/simple-talk/databases/oracle-databases/what-is-oracle-asm-to-azure-iaas/)
- [ASM Command-Line Utility (ASMCMD) (oracle.com)](https://docs.oracle.com/cd/B19306_01/server.102/b14215/asm_util.htm)
- [Useful asmcmd commands - DBACLASS DBACLASS](https://dbaclass.com/article/useful-asmcmd-commands-oracle-cluster/)
- [Moving your SAP Database to Oracle Automatic Storage Management 11g Release 2 - A Best Practices Guide](https://www.sap.com/documents/2016/08/f2e8c029-817c-0010-82c7-eda71af511fa.html)
- [Installing and Configuring Oracle ASMLIB Software](https://docs.oracle.com/en/database/oracle/oracle-database/19/ladbi/installing-and-configuring-oracle-asmlib-software.html#GUID-79F9D58F-E5BB-45BD-A664-260C0502D876)

## Azure NetApp Files (ANF) with Oracle dNFS (Direct NFS)

The combination of Azure VMs and ANF is a robust and proven combination implemented by many customers on an exceptionally large scale.

Databases of 100+ TB are already running productive on this combination. To start, we wrote a detailed blog on how to set up this combination:

- [Deploy SAP AnyDB (Oracle 19c) with Azure NetApp Files - Microsoft Tech Community](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/deploy-sap-anydb-oracle-19c-with-azure-netapp-files/ba-p/2064043)

More general information

- [Solution architectures using Azure NetApp Files | Oracle](../../azure-netapp-files/azure-netapp-files-solution-architectures.md#oracle)
- [Solution architectures using Azure NetApp Files | SAP on anyDB](../../azure-netapp-files/azure-netapp-files-solution-architectures.md#sap-anydb)

Mirror Log is required on dNFS ANF Production systems.

Even though the ANF is highly redundant, Oracle still requires a mirrored redo-logfile volume. The recommendation is to create two separate volumes and configure origlogA together with mirrlogB and origlogB together with mirrlogA. In this case, you make use of a distributed load balancing of the redo-logfiles.

The mount option “nconnect” is NOT recommended when the dNFS client is configured. dNFS manages the IO channel and makes use of multiple sessions, so this option is obsolete and can cause manifold issues. The dNFS client is going to ignore the mount options and is going to handle the IO directly.

Both NFS versions (v3 and v4.1) with ANF are supported for the Oracle binaries, data- and log-files.

We highly recommend using the Oracle dNFS client for all Oracle volumes.

Recommended mount options are:

| NFS Version    | Mount Options                                                 |
|-------------|---------------------------------------------------------------|
| **NFSv3**   | rw,vers=3,rsize=262144,wsize=262144,hard,timeo=600,noatime    |
|             |                                                               |
| **NFSv4.1** | rw,vers=4.1,rsize=262144,wsize=262144,hard,timeo=600,noatime  |


### ANF Backup

With ANF, some key features are available like consistent snapshot-based backups, low latency, and remarkably high performance. From version 6 of our AzAcSnap tool [Azure Application Consistent Snapshot tool for ANF](../../azure-netapp-files/azacsnap-get-started.md) Oracle databases can be configured for consistent database snapshots. Also, the option of resizing the volumes on the fly is valued by our customers.

Those snapshots remain on the actual data volume and must be copied away using ANF CRR (Cross Region Replication) [Cross-region replication of ANF](../../azure-netapp-files/cross-region-replication-introduction.md)
or other backup tools.

## SAP on Oracle on Azure with LVM

ASM is the default recommendation from Oracle for all SAP systems of any size on Azure. Performance, Reliability and Support are better for customers using ASM. Oracle provides documentation and training for DBAs to transition to ASM and every customer who has migrated to ASM has been pleased with the benefits. In cases where the Oracle DBA team doesn't follow the recommendation from Oracle, Microsoft and SAP to use ASM the following LVM configuration should be used.

Note that: when creating LVM the “-i” option must be used to evenly distribute data across the number of disks in the LVM group.

Mirror Log is required when running LVM.

### Minimum configuration Linux:

| **Component**                        | **Disk** | **Host Cache**        | **Striping<sup>1</sup>** |
|--------------------------------------|----------|-----------------------|--------------------------|
| /oracle/\<SID\>/origlogaA & mirrlogB | Premium  | None                  | Not needed               |
| /oracle/\<SID\>/origlogaB & mirrlogA | Premium  | None                  | Not needed               |
| /oracle/\<SID\>/sapdata1...n         | Premium  | Read-only<sup>2</sup> | Recommended              |
| /oracle/\<SID\>/oraarch<sup>3</sup>  | Premium  | None                  | Not needed               |
| Oracle Home, saptrace, ...           | Premium  | None                  | None                     |

1. Striping: LVM stripe using RAID0
2. During R3load migrations, the Host Cache option for SAPDATA should be set to None
3. oraarch: LVM is optional

The disk selection for hosting Oracle's online redo logs should be driven by IOPS requirements. It's possible to store all sapdata1...n (tablespaces) on a single mounted disk as long as the volume, IOPS, and throughput satisfy the requirements.

### Performance configuration Linux:

| **Component**                       | **Disk** | **Host Cache**        | **Striping<sup>1</sup>** |
|-------------------------------------|----------|-----------------------|--------------------------|
| /oracle/\<SID\>/origlogaA           | Premium  | None                  | Can be used              |
| /oracle/\<SID\>/origlogaB           | Premium  | None                  | Can be used              |
| /oracle/\<SID\>/mirrlogAB           | Premium  | None                  | Can be used              |
| /oracle/\<SID\>/mirrlogBA           | Premium  | None                  | Can be used              |
| /oracle/\<SID\>/sapdata1...n        | Premium  | Read-only<sup>2</sup> | Recommended              |
| /oracle/\<SID\>/oraarch<sup>3</sup> | Premium  | None                  | Not needed               |
| Oracle Home, saptrace, ...          | Premium  | None                  | None                     |

1. Striping: LVM stripe using RAID0
2. During R3load migrations, the Host Cache option for SAPDATA should be set to None
3. oraarch: LVM is optional

## Azure Infra: VM Throughput Limits & Azure Disk Storage Options

### Oracle Automatic Storage Management (ASM)## can evaluate these storage technologies:

1.  Azure Premium Storage – currently the default choice
3.  Managed Disk Bursting - [Managed disk bursting - Azure Virtual Machines \| Microsoft  Docs](../../virtual-machines/disk-bursting.md)
4.  Azure Write Accelerator
5.  Online disk extension for Azure Premium SSD storage is still in progress

Log write times can be improved on Azure M-Series VMs by enabling Write Accelerator. Enable Azure Write Accelerator for the Azure Premium Storage disks used by the ASM Disk Group for <u>online redo log files</u>. For more information, see [<u>Write Accelerator</u>](../../virtual-machines/how-to-enable-write-accelerator.md).

Using Write Accelerator is optional but can be enabled if the AWR report indicates higher than expected log write times.

### Azure VM Throughput Limits

Each Azure VM type has specified limits for CPU, Disk, Network and RAM. The limits are documented in the links below

The following recommendations should be followed when selecting a VM type:

1.  Ensure the **Disk Throughput and IOPS** is sufficient for the workload and at least equal to the aggregate throughput of the disks
2.  Consider enabling paid **bursting** especially for Redo Log disk(s)
3.  For ANF, the Network throughput is important as all storage traffic is counted as “Network” rather than Disk throughput
4.  Review this blog for Network tuning for M-series [Optimizing Network Throughput on Azure M-series VMs HCMT (microsoft.com)](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/optimizing-network-throughput-on-azure-m-series-vms/ba-p/3581129)
5.  Review this [link](../../virtual-machines/workloads/oracle/oracle-design.md) that describes how to use an AWR report to select the correct Azure VM
6.  Azure Intel Ev5 [Edv5 and Edsv5-series - Azure Virtual Machines \|Microsoft Docs](../../virtual-machines/easv5-eadsv5-series.md)
7.  Azure AMD Eadsv5 [Easv5 and Eadsv5-series - Azure Virtual Machines \|Microsoft Docs](../../virtual-machines/easv5-eadsv5-series.md#eadsv5-series)
8.  Azure M-series/Msv2-series [M-series - Azure Virtual Machines \|Microsoft Docs](../../virtual-machines/m-series.md) and [Msv2/Mdsv2 Medium Memory Series - Azure Virtual Machines \| Microsoft Docs](../../virtual-machines/msv2-mdsv2-series.md) 
9.  Azure Mv2 [Mv2-series - Azure Virtual Machines \| Microsoft Docs](../../virtual-machines/mv2-series.md)

## Backup/restore

For backup/restore functionality, the SAP BR\*Tools for Oracle are supported in the same way as they are on bare metal and Hyper-V. Oracle Recovery Manager (RMAN) is also supported for backups to disk and restores from disk.

For more information about how you can use Azure Backup and Recovery services for Oracle databases, see:
-  [<u>Back up and recover an Oracle Database 12c database on an Azure Linux virtual machine</u>](../../virtual-machines/workloads/oracle/oracle-overview.md)
- [<u>Azure Backup service</u>](../../backup/backup-overview.md) is also supporting Oracle backups as described in the article [<u>Back up and recover an Oracle Database 19c database on an Azure Linux VM using Azure Backup</u>](../../virtual-machines/workloads/oracle/oracle-database-backup-azure-backup.md).

## High availability

Oracle Data Guard is supported for high availability and disaster recovery purposes. To achieve automatic failover in Data Guard, you need to use Fast-Start Failover (FSFA). The Observer functionality (FSFA) triggers the failover. If you don't use FSFA, you can only use a manual failover configuration. For more information, see [<u>Implement Oracle Data Guard on an Azure Linux virtual machine</u>](../../virtual-machines/workloads/oracle/configure-oracle-dataguard.md).

Disaster Recovery aspects for Oracle databases in Azure are presented in the article [<u>Disaster recovery for an Oracle Database 12c database in an Azure environment</u>](../../virtual-machines/workloads/oracle/oracle-disaster-recovery.md).

Another good Oracle whitepaper [Setting up Oracle 12c Data Guard for SAP Customers](https://www.sap.com/documents/2016/12/a67bac51-9a7c-0010-82c7-eda71af511fa.html)

## Huge Pages & Large Oracle SGA Configurations

VLDB SAP on Oracle on Azure deployments apply SGA sizes in excess of 3TB.  Modern versions of Oracle handle large SGA sizes well and significantly reduce IO.  Review the AWR report and increase the SGA size to reduce read IO. 

As general guidance Linux Huge Pages should be configured to approximately 75% of the VM RAM size.  The SGA size can be set to 90% of the Huge Page size.  An approximate example would be a m192ms VM with 4 TB of RAM would have Huge Pages set proximately 3 TB.  The SGA can be set to a value a little less such as 2.95 TB.

Large SAP customers running on High Memory Azure VMs greatly benefit from HugePages as described in this [article](https://www.carajandb.com/en/blog/2016/7-easy-steps-to-configure-hugepages-for-your-oracle-database-server/)

NUMA systems vm.min_free_kbytes should be set to 524288 \* \<# of NUMA nodes\>.  [See Oracle Linux : Recommended Value of vm.min_free_kbytes Kernel Tuning Parameter (Doc ID 2501269.1...](https://support.oracle.com/epmos/faces/DocumentDisplay?_afrLoop=79485198498171&parent=EXTERNAL_SEARCH&sourceId=HOWTO&id=2501269.1&_afrWindowMode=0&_adf.ctrl-state=mvhajwq3z_4)

 
## Links & other Oracle Linux Utilities

Oracle Linux provides a useful GUI management utility
- Oracle web console [Oracle Linux: Install Cockpit Web Console on Oracle Linux](https://docs.oracle.com/en/operating-systems/oracle-linux/8/obe-cockpit-install/index.html#want-to-learn-more)
- Upstream [Cockpit Project — Cockpit Project (cockpit-project.org)](https://cockpit-project.org/)

Oracle Linux has a new package management tool – DNF

[Oracle Linux 8: Package Management made easy with free videos \| Oracle Linux Blog](https://blogs.oracle.com/linux/oracle-linux-8%3a-package-management-made-easy-with-free-videos)

[Oracle® Linux 8 Managing Software on Oracle Linux - Chapter 1 Yum DNF](https://docs.oracle.com/en/operating-systems/oracle-linux/8/software-management/dnf.html)

Memory and NUMA configurations can be tested and benchmarked with a useful tool - Oracle Real Application Testing (RAT)

[Oracle Real Application Testing: What Is It and How Do You Use It? (aemcorp.com)](https://www.aemcorp.com/managedservices/blog/oracle-real-application-testing-rat-what-is-it-and-how-do-you-use-it)

Information on UDEV Log Corruption issue [Oracle Redolog corruption on Azure \| Oracle in the field (wordpress.com)](https://bjornnaessens.wordpress.com/2021/07/29/oracle-redolog-corruption-on-azure/)

[Oracle ASM in Azure corruption - follow up (dbaharrison.blogspot.com)](http://dbaharrison.blogspot.com/2017/07/oracle-asm-in-azure-corruption-follow-up.html)

[Data corruption on Hyper-V or Azure when running Oracle ASM - Red Hat Customer Portal](https://access.redhat.com/solutions/3114361)

[Set up Oracle ASM on an Azure Linux virtual machine - Azure Virtual Machines \| Microsoft Docs](../../virtual-machines/workloads/oracle/configure-oracle-asm.md)

### Oracle Configuration guidelines for SAP installations in Azure VMs on Windows

SAP on Oracle on Azure also supports Windows. The recommendations for Windows deployments are summarized below:

1.  The following Windows releases are recommended:
    Windows Server 2022 (only from Oracle Database 19.13.0 on)
    Windows Server 2019 (only from Oracle Database 19.5.0 on)
2.  There's no support for ASM on Windows. Windows Storage Spaces should be used to aggregate disks for optimal performance
3.  Install the Oracle Home on a dedicated independent disk (don't install Oracle Home on the C: Drive)
4.  All disks must be formatted NTFS
5.  Follow the Windows Tuning guide from Oracle and enable large pages, lock pages in memory and other Windows specific settings

At the time, of writing ASM for Windows customers on Azure isn't supported. SWPM for Windows doesn't support ASM currently. VLDB SAP on Oracle migrations to Azure have required ASM and have therefore selected Oracle Linux.

## Storage Configurations for SAP on Oracle on Windows

### Minimum configuration Windows:

| **Component**                           | **Disk** | **Host Cache**        | **Striping<sup>1</sup>** |
|-----------------------------------------|----------|-----------------------|--------------------------|
| E:\oracle\\\<SID\>\origlogaA & mirrlogB | Premium  | None                  | Not needed               |
| F:\oracle\\\<SID\>\origlogaB & mirrlogA | Premium  | None                  | Not needed               |
| G:\oracle\\\<SID\>\sapdata1...n         | Premium  | Read-only<sup>2</sup> | Recommended              |
| H:\oracle\\\<SID\>\oraarch<sup>3</sup>  | Premium  | None                  | Not needed               |
| I:\Oracle Home, saptrace, ...           | Premium  | None                  | None                     |

1. Striping: Windows Storage Spaces
2. During R3load migrations, the Host Cache option for SAPDATA should be set to None
3. oraarch: Windows Storage Spaces is optional

The disk selection for hosting Oracle's online redo logs should be driven by IOPS requirements. It's possible to store all sapdata1...n (tablespaces) on a single mounted disk as long as the volume, IOPS, and throughput satisfy the requirements.

### Performance configuration Windows:

| **Component**                          | **Disk** | **Host Cache**        | **Striping<sup>1</sup>** |
|----------------------------------------|----------|-----------------------|--------------------------|
| E:\oracle\\\<SID\>\origlogaA           | Premium  | None                  | Can be used              |
| F:\oracle\\\<SID\>\origlogaB           | Premium  | None                  | Can be used              |
| G:\oracle\\\<SID\>\mirrlogAB           | Premium  | None                  | Can be used              |
| H:\oracle\\\<SID\>\mirrlogBA           | Premium  | None                  | Can be used              |
| I:\oracle\\\<SID\>\sapdata1...n        | Premium  | Read-only<sup>2</sup> | Recommended              |
| J:\oracle\\\<SID\>\oraarch<sup>3</sup> | Premium  | None                  | Not needed               |
| K:\Oracle Home, saptrace, ...          | Premium  | None                  | None                     |

1. Striping: Windows Storage Spaces
2. During R3load migrations, the Host Cache option for SAPDATA should be set to None
3. oraarch: Windows Storage Spaces is optional

### Links for Oracle on Windows
- [Overview of Windows Tuning (oracle.com)](https://docs.oracle.com/en/database/oracle/oracle-database/19/ntqrf/overview-of-windows-tuning.html#GUID-C0A0EC5D-65DD-4693-80B1-DA2AB6147AB9)
- [Postinstallation Configuration Tasks on Windows (oracle.com)](https://docs.oracle.com/en/database/oracle/oracle-database/19/ntqrf/postinstallation-configuration-tasks-on-windows.html#GUID-ECCA1626-A624-48E4-AB08-3D1F6419709E)
- [SAP on Windows Presentation (oracle.com)](https://www.oracle.com/technetwork/topics/dotnet/tech-info/oow2015-windowsdb-bestpracticesperf-2757613.pdf)
 [2823030 - Oracle on MS WINDOWS Large Pages](https://launchpad.support.sap.com/#/notes/2823030)

### Next steps
Read the article 

- [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-general.md)