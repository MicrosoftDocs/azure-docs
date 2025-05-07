---
title: SAP ASE Azure Virtual Machines DBMS deployment for SAP workload | Microsoft Docs
description: SAP ASE Azure Virtual Machines DBMS deployment for SAP workload
author: msjuergent
manager: patfilot
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.date: 10/14/2024
ms.author: juergent
ms.custom: H1Hack27Feb2017, linux-related-content
---
# SAP ASE Azure Virtual Machines DBMS deployment for SAP workload

In this document, covers several different areas to consider when deploying SAP ASE in Azure IaaS. As a precondition to this document, you read the document [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-general.md) and other guides in the [SAP workload on Azure documentation](./get-started.md). This document covers SAP ASE running on Linux and on Windows Operating Systems. The minimum supported release on Azure is SAP ASE 16.0.02 (Release 16 Support Pack 2). It's recommended to deploy the latest version of SAP with the most recent Patch Level.  As a minimum SAP ASE 16.0.03.07 (Release 16 Support Pack 3 Patch Level 7) is recommended.  The most recent version of SAP can be found in [Targeted ASE 16.0 Release Schedule and CR list Information](https://wiki.scn.sap.com/wiki/display/SYBASE/Targeted+ASE+16.0+Release+Schedule+and+CR+list+Information).

Additional information about release support with SAP applications or installation media location are found, besides in the SAP Product Availability Matrix in these locations:

- [SAP support note #2134316](https://launchpad.support.sap.com/#/notes/2134316)
- [SAP support note #1941500](https://launchpad.support.sap.com/#/notes/1941500)
- [SAP support note #1590719](https://launchpad.support.sap.com/#/notes/1590719)
- [SAP support note #1973241](https://launchpad.support.sap.com/#/notes/1973241)

Remark: Throughout documentation within and outside the SAP world, the name of the product is referenced as Sybase ASE or SAP ASE or in some cases both. In order to stay consistent, we use the name **SAP ASE** in this documentation.

## Operating system support
The SAP Product Availability Matrix contains the supported Operating System and SAP Kernel combinations for each SAP application.  Linux distributions SLES 12.x, SLES 15.x, RHEL 7.x, and RHEL 8.x are fully supported. Oracle Linux as operating system for SAP ASE isn't supported.  It's recommended to use the most recent Linux releases available. Windows customers should use Windows Server 2016 or Windows Server 2019 releases.  Older releases of Windows such as Windows 2012 are technically supported but the latest Windows version is always recommended.


## Specifics to SAP ASE on Windows
Starting with Microsoft Azure, you can migrate your existing SAP ASE applications to Azure Virtual Machines. SAP ASE in an Azure Virtual Machine enables you to reduce the total cost of ownership of deployment, management, and maintenance of enterprise breadth applications by easily migrating these applications to Microsoft Azure. With SAP ASE in an Azure Virtual Machine, administrators and developers can still use the same development and administration tools that are available on-premises.

Microsoft Azure offers numerous different virtual machine types that allow you to run smallest SAP systems and landscapes up to large SAP systems and landscapes with thousands of users. SAP sizing SAPS numbers of the different SAP certified Virtual Machine (VM) SKUs is provided in [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533).

Documentation to install SAP ASE on Windows can be found in the [SAP ASE Installation Guide for Windows](https://help.sap.com/viewer/36031975851a4f82b1022a9df877280b/16.0.3.7/en-US/a660d3f1bc2b101487cbdbf10069c3ac.html)

Lock Pages in Memory is a setting that is preventing the SAP ASE database buffer from being paged out.  This setting is useful for large busy systems with a high memory demand. Contact BC-DB-SYB for more information. 


## Linux operating system specific settings
On SLES VMs, run `saptune` with profile SAP-ASE. Tune RHEL VMs as described in [69988](https://access.redhat.com/solutions/69988).  
Linux Huge Pages should be enabled by default and can be verified with command  

`cat /proc/meminfo` 

The page size is typically 2,048 KB. For details see the article [Huge Pages on Linux](https://help.sap.com/viewer/ecbccd52e7024feaa12f4e780b43bc3b/16.0.3.7/en-US/a703d580bc2b10149695f7d838203fad.html) 


## Recommendations on VM and disk structure for SAP ASE deployments

SAP ASE for SAP NetWeaver Applications is supported on any VM type listed in [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533)
Typical VM types used for medium size SAP ASE database servers include Esv3.  Large multi-terabyte databases can use M-series VM types. 

The SAP ASE transaction log disk write performance may be improved by enabling the M-series Write Accelerator. Write Accelerator should be tested carefully with SAP ASE due to the way that SAP ASE performs Log Writes.  Review [SAP support note #2816580](/azure/virtual-machines/how-to-enable-write-accelerator) and consider running a performance test.  
Write Accelerator is designed for transaction log disk only. The disk level cache should be set to NONE. Don't be surprised if Azure Write Accelerator doesn't show similar improvements as with other DBMS. Based on the way, SAP ASE writes into the transaction log, it could be that there's little to no acceleration by Azure Write Accelerator.

> [!NOTE]
> With some of the new M(b)v3 VM types, the usage of read cached Premium SSD v1 storage could result in lower read and write IOPS rates and throughput than you would get if you don't use read cache. 

Separate disks are recommended for Data devices and Log Devices.  The system databases sybsecurity and `saptools` don't require dedicated disks and can be placed on the disks containing the SAP database data and log devices 

![Storage configuration for SAP ASE](./media/dbms-guide-sap-ase/sap-ase-disk-structure.png)

### File systems, stripe size & IO balancing 
SAP ASE writes data sequentially into disk storage devices unless configured otherwise. This means an empty SAP ASE database with four devices writes data into the first device only.  The other disk devices are only written into when the first device is full.  The amount of READ and WRITE IO to each SAP ASE device is likely to be different. To balance disk IO across all available Azure disks, either Windows Storage Spaces or Linux LVM2 needs to be used. On Linux, it's recommended to use XFS file system to format the disks. The LVM stripe size should be tested with a performance test. 128 KB stripe size is a good starting point. On Windows, the NTFS Allocation Unit Size (AUS) should be tested. 64 KB can be used as a starting value. 

It's recommended to configure Automatic Database Expansion as described in the article [Configuring Automatic Database Space Expansion in SAP Adaptive Server Enterprise](https://blogs.sap.com/2014/07/09/configuring-automatic-database-space-expansion-in-sap-adaptive-server-enterprise/)  and [SAP support note #1815695](https://launchpad.support.sap.com/#/notes/1815695). 

### Sample SAP ASE on Azure virtual machine, disk, and file system configurations 
The templates below show sample configurations for both Linux and Windows. Before confirming the virtual machine and disk configuration, ensure that the network and storage bandwidth quotas of the individual VM are sufficient to meet the business requirement. Also keep in mind that different Azure VM types have different maximum numbers of disks that can be attached to the VM. For example, a E4s_v3 VM  has a limit 48 MB/sec storage IO throughput. If the storage throughput required by database backup activity demands more than 48 MB/sec then a larger VM type with more storage bandwidth throughput is unavoidable. When configuring Azure storage, you also need to keep in mind that especially with [Azure Premium storage](/azure/virtual-machines/premium-storage-performance) the throughput, and IOPS per GB of capacity do change. See more on this topic in the article [What disk types are available in Azure?](/azure/virtual-machines/disks-types). The quotas for specific Azure VM types are documented in the article [Memory optimized virtual machine sizes](/azure/virtual-machines/sizes-memory) and articles linked to it. 

> [!NOTE]
>  If a DBMS system is being moved from on-premises to Azure, it's recommended to perform monitoring on the VM and assess the CPU, memory, IOPS and storage throughput. Compare the peak values observed with the VM quota limits documented in the articles mentioned above

The examples given below are for illustrative purposes and can be modified based on individual needs. Due to the design of SAP ASE, the number of data devices isn't as critical as with other databases. The number of data devices detailed in this document is a guide only. The configurations suggested should be treated as what they're. They're starting points for you. But they're configurations that are going to need some fine-tuning to your workload and cost efficiencies.

An example of a configuration for a little SAP ASE DB Server with a database size between 50 GB – 250 GB could look like

| Configuration | Windows | Linux | Comments |
| --- | --- | --- | --- |
| VM Type | E4s_v3/v4/v5 (4 vCPU/32 GB RAM) | E4s_v3/v4/v5 (4 vCPU/32 GB RAM) | --- |
| Accelerated Networking | Enable | Enable | ---|
| SAP ASE version | 16.0.03.07 or higher | 16.0.03.07 or higher | --- |
| # of data devices | 4 | 4 | ---|
| # of log devices | 1 | 1 | --- |
| # of temp devices | 1 | 1 | More for SAP BW workload |
| Operating system | Windows Server 2019 | SLES 12 SP5, 15 SP1 or later or RHEL 7.9, 8.1/8.2/8.4 | --- |
| Disk aggregation | Storage Spaces | LVM2 | --- |
| File system | NTFS | XFS |
| Format block size | Needs workload testing | Needs workload testing | --- |
| # and type of data disks | Premium storage v1: 2 x P10 (RAID0) <br /> Premium storage v2: 2 x 150 GiB (RAID0) - default IOPS and throughput | Premium storage v1: 2 x P10 (RAID0) <br /> Premium storage v2: 2 x 150 GiB (RAID 0) - default IOPS and throughput | Cache = Read Only |
| # and type of log disks | Premium storage v1: 1 x P20 <br /> Premium storage v2: 1 x 128 GiB - default IOPS and throughput | Premium storage v1: 1 x P20 <br /> Premium storage v2: 1 x 128 GiB - default IOPS and throughput | Cache = NONE |
| ASE MaxMemory parameter | 90% of Physical RAM | 90% of Physical RAM | Assuming single instance |
| # of backup devices | 4 | 4| --- |
| # and type of backup disks | 1 | 1 | --- |


An example of a configuration for a small SAP ASE DB Server with a database size between 250 GB – 750 GB, such as a smaller SAP Business Suite system, could look like

| Configuration | Windows | Linux | Comments |
| --- | --- | --- | --- |
| VM Type | E16s_v3/v4/v5 (16 vCPU/128 GB RAM) | E16s_v3/v4/v5 (16 vCPU/128 GB RAM) | --- |
| Accelerated Networking | Enable | Enable | ---|
| SAP ASE version | 16.0.03.07 or higher | 16.0.03.07 or higher | --- |
| # of data devices | 8 | 8 | ---|
| # of log devices | 1 | 1 | --- |
| # of temp devices | 1 | 1 | More for SAP BW workload |
| Operating system | Windows Server 2019 | SLES 12 SP5, 15 SP1 or later or RHEL 7.9, 8.1/8.2/8.4| --- |
| Disk aggregation | Storage Spaces | LVM2 | --- |
| File system | NTFS | XFS |
| Format block size | Needs workload testing | Needs workload testing | --- |
| # and type of data disks | Premium storage v1: 4 x P20 (RAID0) <br /> Premium storage v2: 4 x 100 GiB - 200 GiB (RAID0) - default IOPS and 25 MB/sec extra throughput per disk | Premium storage v1: 4 x P20 (RAID0) <br /> Premium storage v2: 4 x 100 GiB- 200 GiB (RAID0) - default IOPS and 25 MB/sec extra per disk throughput | Cache = Read Only |
| # and type of log disks | Premium storage v1: 1 x P20 <br /> Premium storage v2: 1 x 200 GiB - default IOPS and throughput | Premium storage v1: 1 x P20 <br /> Premium storage v2: 1 x 200 GiB - default IOPS and throughput | Cache = NONE |
| ASE MaxMemory parameter | 90% of Physical RAM | 90% of Physical RAM | Assuming single instance |
| # of backup devices | 4 | 4| --- |
| # and type of backup disks | 1 | 1 | --- |

An example of a configuration for a medium SAP ASE DB Server with a database size between 750 GB – 2,000 GB, such as a larger SAP Business Suite system, could look like

| Configuration | Windows | Linux | Comments |
| --- | --- | --- | --- |
| VM Type | E64s_v3/v4/v5 (64 vCPU/432 GB RAM) | E64s_v3/v4/v5 (64 vCPU/432 GB RAM) | --- |
| Accelerated Networking | Enable | Enable | ---|
| SAP ASE version | 16.0.03.07 or higher | 16.0.03.07 or higher | --- |
| # of data devices | 16 | 16 | ---|
| # of log devices | 1 | 1 | --- |
| # of temp devices | 1 | 1 | More for SAP BW workload |
| Operating system | Windows Server 2019 | SLES 12 SP5, 15 SP1 or later or RHEL 7.9, 8.1/8.2/8.4 | --- |
| Disk aggregation | Storage Spaces | LVM2 | --- |
| File system | NTFS | XFS |
| Format block size | Needs workload testing | Needs workload testing | --- |
| # and type of data disks | Premium storage v1: 4 x P30 (RAID0) <br /> Premium storage v2: 4 x 250 GiB - 500 GiB - plus 2,000 IOPS and 75 MB/sec throughput per disk | Premium storage v1: 4 x P30 (RAID0) <br /> Premium storage v2: 4 x 250 GiB - 500 GiB - plus 2,000 IOPS and 75 MB/sec throughput per disk | Cache = Read Only |
| # and type of log disks | Premium storage v1: 1 x P20 <br /> Premium storage v2: 1 x 400 GiB - default IOPS and 75MB/sec extra throughput | Premium storage v1: 1 x P20 <br /> Premium storage v2: 1 x 400 GiB - default IOPS and 75 MB/sec extra throughput | Cache = NONE |
| ASE MaxMemory parameter | 90% of Physical RAM | 90% of Physical RAM | Assuming single instance |
| # of backup devices | 4 | 4| --- |
| # and type of backup disks | 1 | 1 | --- |


An example of a configuration for a larger SAP ASE DB Server with a database size between 2,000 GB – 4,000 GB, such as a larger SAP Business Suite system, could look like

| Configuration | Windows | Linux | Comments |
| --- | --- | --- | --- |
| VM Type | E96(d)s_v5 (96 vCPU/672 GiB RAM) | E96(d)s_v5 (96 vCPU/672 GiB RAM) | --- |
| Accelerated Networking | Enable | Enable | ---|
| SAP ASE version | 16.0.03.07 or higher | 16.0.03.07 or higher | --- |
| # of data devices | 16 | 16 | ---|
| # of log devices | 1 | 1 | --- |
| # of temp devices | 1 | 1 | More for SAP BW workload |
| Operating system | Windows Server 2019 | SLES 12 SP5, 15 SP1 or later or RHEL 7.9, 8.1/8.2/8.4 | --- |
| Disk aggregation | Storage Spaces | LVM2 | --- |
| File system | NTFS | XFS |
| Format block size | Needs workload testing | Needs workload testing | --- |
| # and type of data disks | Premium storage v1: 4 x P30 (RAID0) <br /> Premium storage v2: 4 x 500 GiB - 1,000 GiB - plus 2,500 IOPS and 100 MB/sec throughput per disk | Premium storage v1: 4 x P30 (RAID0) <br /> Premium storage v2: 4 x 500 GiB - 1,000 GiB - plus 2,500 IOPS and 100 MB/sec throughput per disk | Cache = Read Only |
| # and type of log disks | Premium storage v1: 1 x P20 <br /> Premium storage v2: 1 x 400 GiB - plus 1,000 IOPS and 75MB/sec extra throughput | Premium storage v1: 1 x P20 <br /> Premium storage v2: 1 x 400 GiB - plus 1,000 IOPS and 75 MB/sec extra throughput | Cache = NONE |
| ASE MaxMemory parameter | 90% of Physical RAM | 90% of Physical RAM | Assuming single instance |
| # of backup devices | 4 | 4| --- |
| # and type of backup disks | 1 | 1 | --- |


An example of a configuration for a large SAP ASE DB Server with a database size of 4 TB+, such as a larger globally used SAP Business Suite system, could look like

| Configuration | Windows | Linux | Comments |
| --- | --- | --- | --- |
| VM Type | M-Series (1.0 to 4.0 TB RAM)  | M-Series (1.0 to 4.0 TB RAM) | --- |
| Accelerated Networking | Enable | Enable | ---|
| SAP ASE version | 16.0.03.07 or higher | 16.0.03.07 or higher | --- |
| # of data devices | 32 | 32 | ---|
| # of log devices | 1 | 1 | --- |
| # of temp devices | 1 | 1 | More for SAP BW workload |
| Operating system | Windows Server 2019 | SLES 12 SP5, 15 SP1 or later or RHEL 7.9, 8.1/8.2/8.4 | --- |
| Disk aggregation | Storage Spaces | LVM2 | --- |
| File system | NTFS | XFS |
| Format block size | Needs workload testing | Needs workload testing | --- |
| # and type of data disks | Premium storage v1: 4+ x P30 (RAID0) <br /> Premium storage v2: 4+ x 1,000 GiB - 4,000 GiB - plus 3,000 IOPS and 125 MB/sec throughput per disk | Premium storage v1: 4+ x P30 (RAID0) <br /> Premium storage v2: 4+ x 1,000 GiB - 4,000 GiB - plus 3,000 IOPS and 125 MB/sec throughput per disk | Cache = Read Only, Consider Azure Ultra disk |
| # and type of log disks | Premium storage v1: 1 x P30 <br /> Premium storage v2: 1 x 500 GiB - plus 2,000 IOPS and 125 MB/sec throughput | Premium storage v1: 1 x P30 <br /> Premium storage v2: 1 x 500 GiB - plus 2,000 IOPS and 125 MB/sec throughput | Consider Write Accelerator or Azure Ultra disk |
| ASE MaxMemory parameter | 90% of Physical RAM | 90% of Physical RAM | Assuming single instance |
| # of backup devices | 16 | 16 | --- |
| # and type of backup disks | 4 | 4 | Use LVM2/Storage Spaces |


NFS v4.1 volumes hosted Azure NetApp Files is another alternative to use for SAP ASE database storage. The principle structure of such a configuration should look like

![Storage configuration for SAP ASE with ANF](./media/dbms-guide-sap-ase/anf-layout.png)

In the example, the SID of the database was A11. The sizes and the performance tiers of the Azure NetApp Files based volumes are dependent on the database volume and the IOPS and throughput you require. For sapdata and saplog, we recommend starting with the Ultra performance tier to be able to provide enough bandwidth. For many non-production deployments, the Premium performance tier can be sufficient. For more details on specific sizing and limitations of Azure NetApp Files for database usage, read the chapter [Sizing for HANA database on Azure NetApp Files in NFS v4.1 volumes on Azure NetApp Files for SAP HANA](./hana-vm-operations-netapp.md).


### Backup & restore considerations for SAP ASE on Azure
Increasing the number of data and backup devices increases backup and restore performance. It's recommended to stripe the Azure disks that are hosting the SAP ASE backup device as show in the tables shown earlier. Care should be taken to balance the number of backup devices and disks and ensure that backup throughput shouldn't exceed 40%-50% of total VM throughput quota. It's recommended to use SAP Backup Compression as a default. More details can be found in the articles:

- [SAP support note #1588316](https://launchpad.support.sap.com/#/notes/1588316)
- [SAP support note #1801984](https://launchpad.support.sap.com/#/notes/1801984)
- [SAP support note #1585981](https://launchpad.support.sap.com/#/notes/1585981) 

Don't use drive D:\ or /temp space as database or log dump destination.

### Impact of database compression
In configurations where I/O bandwidth can become a limiting factor, measures, which reduce IOPS might help to stretch the workload one can run in an IaaS scenario like Azure. Therefore, it's recommended to make sure that SAP ASE compression is used before uploading an existing SAP database to Azure.

The recommendation to apply compression before uploading to Azure is given out of several reasons:

* The amount of data to be uploaded to Azure is lower
* The duration of the compression execution is shorter assuming that one can use stronger hardware with more CPUs or higher I/O bandwidth or less I/O latency on-premises
* Smaller database sizes might lead to less costs for disk allocation

Data- and LOB-Compression work in a VM hosted in Azure Virtual Machines as it does on-premises. For more details on how to check if compression is already in use in an existing SAP ASE database, check [SAP support note 1750510](https://launchpad.support.sap.com/#/notes/1750510). For more details on SAP ASE database compression check [SAP support note #2121797](https://launchpad.support.sap.com/#/notes/2121797)

## High availability of SAP ASE on Azure 
The HADR Users Guide details the setup and configuration of a two-node SAP ASE “Always-on” solution.  In addition, a third disaster recovery node is also supported. SAP ASE supports many High Availability [configurations](https://help.sap.com/viewer/efe56ad3cad0467d837c8ff1ac6ba75c/16.0.4.1/en-US/9b40a3c038a34cbda1064312aa8d25a4.html) including shared disk and native OS clustering (such as Pacemaker and Windows Server Failover Cluster). 
There are two supported High Availability configurations for SAP ASE on Azure:

- HA Aware with Fault Manager - The SAP Kernel is an “HA Aware” application and knows about the primary and secondary SAP ASE servers. There are no close integrations between the SAP ASE “HA Aware“ solution and Azure, the Azure Internal load balancer isn't used.  The solution is documented in the [SAP ASE HADR Users Guide](https://help.sap.com/viewer/efe56ad3cad0467d837c8ff1ac6ba75c/16.0.3.7/en-US/a6645e28bc2b1014b54b8815a64b87ba.html)
- Floating IP with Fault Manager – This solution can be used for SAP Business Suite and non-SAP Business Suite applications.  This solution utilizes the Azure ILB and the SAP ASE database engine provides a Probe Port.  The Fault Manager calls the SAPHostAgent to start or stop a secondary Floating IP on the ASE hosts.  This solution is documented in [SAP note #3086679 - SYB: Fault Manager: floating IP address on Microsoft Azure](https://launchpad.support.sap.com/#/notes/3086679)


> [!NOTE]
> The failover times and other characteristics of either HA Aware or Floating IP solutions are similar.  When deciding between these two solutions customers should perform their own testing and evaluation including factors such as planned and unplanned failover times and other operational procedures. 

### Third node for disaster recovery
Beyond using SAP ASE Always-On for local high availability, you might want to extend the configuration to an asynchronously replicated node in another Azure region. For more information, see [Installation Procedure for Sybase 16. 3 Patch Level 3 Always-on + DR on Suse 12.3](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/installation-procedure-for-sybase-16-3-patch-level-3-always-on/ba-p/368199).

## SAP ASE database encryption & SSL 
SAP Software provisioning Manager (SWPM) is giving an option to encrypt the database during installation.  If you want to use encryption, it's recommended to use SAP Full Database Encryption.  See details documented in:

- [SAP support note #2556658](https://launchpad.support.sap.com/#/notes/2556658)
- [SAP support note #2224138](https://launchpad.support.sap.com/#/notes/2224138)
- [SAP support note #2401066](https://launchpad.support.sap.com/#/notes/2401066)
- [SAP support note #2593925](https://launchpad.support.sap.com/#/notes/2593925) 

> [!NOTE]
> If a SAP ASE database is encrypted then Backup Dump Compression is not working. See also [SAP support note #2680905](https://launchpad.support.sap.com/#/notes/2680905) 

## SAP ASE on Azure deployment checklist
 
- Deploy SAP ASE 16.0.03.07 or higher
- Update to latest version and patches of FaultManager and SAPHostAgent
- Deploy on latest certified OS available such as Windows 2019, SLES 15, or RHEL 8 
- Use SAP Certified VMs – high memory Azure VM SKUs such as Es_v3 or for x-large systems M-Series VM SKUs are recommended
- Match the disk IOPS and total VM aggregate throughput quota of the VM with the disk design.  Deploy sufficient number of disks
- Aggregate disks using Windows Storage Spaces or Linux LVM2 with correct stripe size and file system
- Create sufficient number of devices for data, log, temp, and backup purposes
- Consider using UltraDisk for x-large systems 
- Run `saptune` SAP-ASE on SLES. Tune RHEL VMs per [69988](https://access.redhat.com/solutions/69988).
- Secure the database with DB Encryption – manually store keys in Azure Key Vault 
- Complete the [SAP on Azure Checklist](./deployment-checklist.md) 
- Configure log backup and full backup 
- Test HA/DR, backup and restore and perform stress & volume test 
- Confirm Automatic Database Extension is working 

## Using DBACockpit to monitor database instances
For SAP systems, which are using SAP ASE as database platform, the DBACockpit is accessible as embedded browser windows in transaction DBACockpit or as Webdynpro. However, the full functionality for monitoring and administering the database is available in the Webdynpro implementation of the DBACockpit only.

As with on-premises systems several steps are required to enable all SAP NetWeaver functionality used by the Webdynpro implementation of the DBACockpit. Follow [SAP support note #1245200](https://launchpad.support.sap.com/#/notes/1245200) to enable the usage of webdynpros and generate the required ones. When following the instructions in the above notes, you also configure the Internet Communication Manager (`ICM`) along with the ports to be used for http and https connections. The default setting for http looks like:

> icm/server_port_0 = PROT=HTTP,PORT=8000,PROCTIMEOUT=600,TIMEOUT=600
> 
> icm/server_port_1 = PROT=HTTPS,PORT=443$$,PROCTIMEOUT=600,TIMEOUT=600
> 
> 

And the links generated in transaction DBACockpit look similar to:

> https:\//\<fullyqualifiedhostname>:44300/sap/bc/webdynpro/sap/dba_cockpit
> 
> http:\//\<fullyqualifiedhostname>:8000/sap/bc/webdynpro/sap/dba_cockpit
> 
> 

Depending on how the Azure Virtual Machine hosting the SAP system is connected to your AD and DNS, you need to make sure that ICM is using a fully qualified hostname that can be resolved on the machine where you're opening the DBACockpit from. See [SAP support note #773830](https://launchpad.support.sap.com/#/notes/773830) to understand how ICM determines the fully qualified host name based on profile parameters and set parameter icm/host_name_full explicitly if necessary.

If you deployed the VM in a Cloud-Only scenario without cross-premises connectivity between on-premises and Azure, you need to define a public IP address and a `domainlabel`. The format of the public DNS name of the VM looks like:

> `<custom domainlabel`>.`<azure region`>.cloudapp.azure.com
> 
> 


Setting the SAP profile parameter icm/host_name_full to the DNS name of the Azure VM the link might look similar to:

> https:\//mydomainlabel.westeurope.cloudapp.net:44300/sap/bc/webdynpro/sap/dba_cockpit
> 
> http:\//mydomainlabel.westeurope.cloudapp.net:8000/sap/bc/webdynpro/sap/dba_cockpit

In this case you need to make sure to:

* Add Inbound rules to the Network Security Group in the Azure portal for the TCP/IP ports used to communicate with ICM
* Add Inbound rules to the Windows Firewall configuration for the TCP/IP ports used to communicate with the ICM

For an automated imported of all corrections available, it's recommended to periodically apply the correction collection SAP Note applicable to your SAP version:

* [SAP support note #1558958](https://launchpad.support.sap.com/#/notes/1558958)
* [SAP support note #1619967](https://launchpad.support.sap.com/#/notes/1619967)
* [SAP support note #1882376](https://launchpad.support.sap.com/#/notes/1882376)

Further information about DBA Cockpit for SAP ASE can be found in the following SAP Notes:

* [SAP support note #1605680](https://launchpad.support.sap.com/#/notes/1605680)
* [SAP support note #1757924](https://launchpad.support.sap.com/#/notes/1757924)
* [SAP support note #1757928](https://launchpad.support.sap.com/#/notes/1757928)
* [SAP support note #1758182](https://launchpad.support.sap.com/#/notes/1758182)
* [SAP support note #1758496](https://launchpad.support.sap.com/#/notes/1758496)    
* [SAP support note #1814258](https://launchpad.support.sap.com/#/notes/1814258)
* [SAP support note #1922555](https://launchpad.support.sap.com/#/notes/1922555)
* [SAP support note #1956005](https://launchpad.support.sap.com/#/notes/1956005)


## Useful links, notes & whitepapers for SAP ASE
The starting page for [SAP ASE 16.0.03.07 Documentation](https://help.sap.com/viewer/product/SAP_ASE/16.0.3.7/en-US) gives links to various documents of which the documents of:

- SAP ASE Learning Journey - Administration & Monitoring
- SAP ASE Learning Journey - Installation & Upgrade

Are helpful. Another useful document is [SAP Applications on SAP Adaptive Server Enterprise Best Practices for Migration and Runtime](https://assets.cdn.sap.com/sapcom/docs/2016/06/26450353-767c-0010-82c7-eda71af511fa.pdf).

Other helpful SAP support notes are:

- [SAP support note #2134316](https://launchpad.support.sap.com/#/notes/2134316) 
- [SAP support note #1748888](https://launchpad.support.sap.com/#/notes/1748888) 
- [SAP support note #2588660](https://launchpad.support.sap.com/#/notes/2588660) 
- [SAP support note #1680803](https://launchpad.support.sap.com/#/notes/1680803) 
- [SAP support note #1724091](https://launchpad.support.sap.com/#/notes/1724091) 
- [SAP support note #1775764](https://launchpad.support.sap.com/#/notes/1775764) 
- [SAP support note #2162183](https://launchpad.support.sap.com/#/notes/2162183) 
- [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533)
- [SAP support note #2015553](https://launchpad.support.sap.com/#/notes/2015553)
- [SAP support note #1750510](https://launchpad.support.sap.com/#/notes/1750510) 
- [SAP support note #1752266](https://launchpad.support.sap.com/#/notes/1752266) 
- [SAP support note #2162183](https://launchpad.support.sap.com/#/notes/2162183) 
- [SAP support note #1588316](https://launchpad.support.sap.com/#/notes/158831) 

Other information is published on 

- [SAP Applications on SAP Adaptive Server Enterprise](https://community.sap.com/topics/applications-on-ase)
- [SAP ASE infocenter](http://infocenter.sybase.com/help/index.jsp) 
- [SAP ASE Always-on with 3rd DR Node Setup](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/installation-procedure-for-sybase-16-3-patch-level-3-always-on/ba-p/368199)

A Monthly newsletter is published through [SAP support note #2381575](https://launchpad.support.sap.com/#/notes/2381575) 


## Next steps
Check the article [SAP workloads on Azure: planning and deployment checklist](./deployment-checklist.md)
