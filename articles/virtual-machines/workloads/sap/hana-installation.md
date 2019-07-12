---
title: Install SAP HANA on SAP HANA on Azure (Large Instances) | Microsoft Docs
description: How to install SAP HANA on an SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: hermanndms
manager: gwallace
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/12/2019
ms.author: juergent
ms.custom: H1Hack27Feb2017

---
# How to install and configure SAP HANA (Large Instances) on Azure

Before reading this article, get familiar with [HANA Large Instances common terms](hana-know-terms.md) and the [HANA Large Instances SKUs](hana-available-skus.md).

The installation of SAP HANA is your responsibility. You can start installing a new SAP HANA on Azure (Large Instances) server after you establish the connectivity between your Azure virtual networks and the HANA Large Instance unit(s). 

> [!Note]
> Per SAP policy, the installation of SAP HANA must be performed by a person who's passed the Certified SAP Technology Associate exam, SAP HANA Installation certification exam, or who is an SAP-certified system integrator (SI).

When you're planning to install HANA 2.0, see [SAP support note #2235581 - SAP HANA: Supported operating systems](https://launchpad.support.sap.com/#/notes/2235581/E) to make sure that the OS is supported with the SAP HANA release you that you're installing. The supported OS for HANA 2.0 is more restrictive than the supported OS for HANA 1.0. 

> [!IMPORTANT] 
> For Type II units, currently only the SLES 12 SP2 OS version is supported. 

Validate the following before you begin the HANA installation:
- [HLI unit(s)](#validate-the-hana-large-instance-units)
- [Operating system configuration](#operating-system)
- [Network configuration](#networking)
- [Storage configuration](#storage)


## Validate the HANA Large Instance unit(s)

After you receive the HANA Large Instance unit from Microsoft, validate the following settings and adjust as necessary.

The **first step** after you receive the HANA Large Instance and establish access and connectivity to the instances, is to check in Azure portal whether the instance(s) are showing up with the correct SKUs and OS in Azure portal. Read [Azure HANA Large Instances control through Azure portal](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-li-portal) for the steps necessary to perform the checks.

The **second step** after you receive the HANA Large Instance and establish access and connectivity to the instances, is to register the OS of the instance with your OS provider. This step includes registering your SUSE Linux OS in an instance of SUSE SMT that's deployed in a VM in Azure. 

The HANA Large Instance unit can connect to this SMT instance. (For more information, see [How to set up SMT server for SUSE Linux](hana-setup-smt.md)). Alternatively, your Red Hat OS needs to be registered with the Red Hat Subscription Manager that you need to connect to. For more information, see the remarks in [What is SAP HANA on Azure (Large Instances)?](https://docs.microsoft.com/azure/virtual-machines/linux/sap-hana-overview-architecture?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). 

This step is necessary for patching the OS, which is the responsibility of the customer. For SUSE, find the documentation for installing and configuring SMT on this page about [SMT installation](https://www.suse.com/documentation/sles-12/book_smt/data/smt_installation.html).

The **third step** is to check for new patches and fixes of the specific OS release/version. Verify that the patch level of the HANA Large Instance is in the latest state. There might be cases where the latest patches aren't included. After taking over a HANA Large Instance unit, it's mandatory to check whether patches need to be applied.

The **fourth step** is to check out the relevant SAP notes for installing and configuring SAP HANA on the specific OS release/version. Due to changing recommendations or changes to SAP notes or configurations that are dependent on individual installation scenarios, Microsoft won't always be able to configure a HANA Large Instance unit perfectly. 

Therefore, it's mandatory for you as a customer to read the SAP notes related to SAP HANA for your exact Linux release. Also check the configurations of the OS release/version and apply the configuration settings if you haven't already.

Specifically, check the following parameters and eventually adjust to:

- net.core.rmem_max = 16777216
- net.core.wmem_max = 16777216
- net.core.rmem_default = 16777216
- net.core.wmem_default = 16777216
- net.core.optmem_max = 16777216
- net.ipv4.tcp_rmem = 65536 16777216 16777216
- net.ipv4.tcp_wmem = 65536 16777216 16777216

Starting with SLES12 SP1 and RHEL 7.2, these parameters must be set in a configuration file in the /etc/sysctl.d directory. For example, a configuration file with the name 91-NetApp-HANA.conf must be created. For older SLES and RHEL releases, these parameters must be set in/etc/sysctl.conf.

For all RHEL releases starting with RHEL 6.3, keep in mind: 
- The sunrpc.tcp_slot_table_entries = 128 parameter must be set in/etc/modprobe.d/sunrpc-local.conf. If the file does not exist, you need to create it first by adding the entry: 
    - options sunrpc tcp_max_slot_table_entries=128

The **fifth step** is to check the system time of your HANA Large Instance unit. The instances are deployed with a system time zone. This time zone represents the location of the Azure region in which the HANA Large Instance stamp is located. You can change the system time or time zone of the instances you own. 

If you order more instances into your tenant, you need to adapt the time zone of the newly delivered instances. Microsoft has no insight into the system time zone you set up with the instances after the handover. Thus, newly deployed instances might not be set in the same time zone as the one you changed to. It's is your responsibility as customer to adapt the time zone of the instance(s) that were handed over, if necessary. 

The **sixth step** is to check etc/hosts. As the blades get handed over, they have different IP addresses that are assigned for different purposes. Check the etc/hosts file. When units are added into an existing tenant, don't expect to have etc/hosts of the newly deployed systems maintained correctly with the IP addresses of systems that were delivered earlier. It's your responsibility as customer to makes sure that a newly deployed instance can interact and resolve the names of the units that you deployed earlier in your tenant. 


## Operating system

> [!IMPORTANT] 
> For Type II units, only the SLES 12 SP2 OS version is currently supported. 

The swap space of the delivered OS image is set to 2 GB according to the [SAP support note #1999997 - FAQ: SAP HANA memory](https://launchpad.support.sap.com/#/notes/1999997/E). As a customer, if you want a different setting, you must set it yourself.

[SUSE Linux Enterprise Server 12 SP1 for SAP applications](https://www.suse.com/products/sles-for-sap/download/) is the distribution of Linux that's installed for SAP HANA on Azure (Large Instances). This particular distribution provides SAP-specific capabilities "out of the box" (including pre-set parameters for running SAP on SLES effectively).

See [Resource library/white papers](https://www.suse.com/products/sles-for-sap/resource-library#white-papers) on the SUSE website and [SAP on SUSE](https://wiki.scn.sap.com/wiki/display/ATopics/SAP+on+SUSE) on the SAP Community Network (SCN) for several useful resources related to deploying SAP HANA on SLES (including the set-up of high availability, security hardening that's specific to SAP operations, and more).

Following is additional and useful SAP on SUSE-related links:

- [SAP HANA on SUSE Linux site](https://wiki.scn.sap.com/wiki/display/ATopics/SAP+on+SUSE)
- [Best practices for SAP: Enqueue replication – SAP NetWeaver on SUSE Linux Enterprise 12](https://www.suse.com/docrepcontent/container.jsp?containerId=9113)
- [ClamSAP – SLES virus protection for SAP](https://scn.sap.com/community/linux/blog/2014/04/14/clamsap--suse-linux-enterprise-server-integrates-virus-protection-for-sap) (including SLES 12 for SAP applications)

The following are SAP support notes that are applicable to implementing SAP HANA on SLES 12:

- [SAP support note #1944799 – SAP HANA guidelines for SLES operating system installation](https://go.sap.com/documents/2016/05/e8705aae-717c-0010-82c7-eda71af511fa.html)
- [SAP support note #2205917 – SAP HANA DB recommended OS settings for SLES 12 for SAP applications](https://launchpad.support.sap.com/#/notes/2205917/E)
- [SAP support note #1984787 – SUSE Linux Enterprise Server 12:  installation notes](https://launchpad.support.sap.com/#/notes/1984787)
- [SAP support note #171356 – SAP software on Linux:  General information](https://launchpad.support.sap.com/#/notes/1984787)
- [SAP support note #1391070 – Linux UUID solutions](https://launchpad.support.sap.com/#/notes/1391070)

[Red Hat Enterprise Linux for SAP HANA](https://www.redhat.com/en/resources/red-hat-enterprise-linux-sap-hana) is another offer for running SAP HANA on HANA Large Instances. Releases of RHEL 6.7 and 7.2 are available. Note, opposite to native Azure VMs where only RHEL 7.2 and more recent releases are supported, HANA Large Instances do support RHEL 6.7 as well. However, we recommend using an RHEL 7.x release.

Following are additional useful SAP on Red Hat related links:
- [SAP HANA on Red Hat Linux site](https://wiki.scn.sap.com/wiki/display/ATopics/SAP+on+Red+Hat).

Following are SAP support notes that are applicable to implementing SAP HANA on Red Hat:

- [SAP support note #2009879 - SAP HANA guidelines for Red Hat Enterprise Linux (RHEL) operating system](https://launchpad.support.sap.com/#/notes/2009879/E)
- [SAP support note #2292690 - SAP HANA DB: Recommended OS settings for RHEL 7](https://launchpad.support.sap.com/#/notes/2292690)
- [SAP Support Note #2247020 - SAP HANA DB: Recommended OS settings for RHEL 6.7](https://launchpad.support.sap.com/#/notes/2247020)
- [SAP support note #1391070 – Linux UUID solutions](https://launchpad.support.sap.com/#/notes/1391070)
- [SAP support note #2228351 - Linux: SAP HANA Database SPS 11 revision 110 (or higher) on RHEL 6 or SLES 11](https://launchpad.support.sap.com/#/notes/2228351)
- [SAP support note #2397039 - FAQ: SAP on RHEL](https://launchpad.support.sap.com/#/notes/2397039)
- [SAP support note #1496410 - Red Hat Enterprise Linux 6.x: Installation and upgrade](https://launchpad.support.sap.com/#/notes/1496410)
- [SAP support note #2002167 - Red Hat Enterprise Linux 7.x: Installation and upgrade](https://launchpad.support.sap.com/#/notes/2002167)

### Time synchronization

SAP applications that are built on the SAP NetWeaver architecture are sensitive to time differences for the various components that comprise the SAP system. SAP ABAP short dumps with the error title of ZDATE\_LARGE\_TIME\_DIFF are probably familiar. That's because these short dumps appear when the system time of different servers or VMs is drifting too far apart.

For SAP HANA on Azure (Large Instances), time synchronization that's done in Azure doesn't apply to the compute units in the Large Instance stamps. This synchronization is not applicable for running SAP applications in native Azure VMs, because Azure ensures that a system's time is properly synchronized. 

As a result, you must set up a separate time server that can be used by SAP application servers that are  running on Azure VMs and by the SAP HANA database instances that are running on HANA Large Instances. The storage infrastructure in Large Instance stamps is time-synchronized with NTP servers.


## Networking
We assume that you followed the recommendations in designing your Azure virtual networks and in connecting those virtual networks to the HANA Large Instances, as described in the following documents:

- [SAP HANA (Large Instance) overview and architecture on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-architecture)
- [SAP HANA (Large Instances) infrastructure and connectivity on Azure](hana-overview-infrastructure-connectivity.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

There are some details worth mentioning about the networking of the single units. Every HANA Large Instance unit comes with two or three IP addresses that are assigned to two or three NIC ports. Three IP addresses are used in HANA scale-out configurations and the HANA system replication scenario. One of the IP addresses that's assigned to the NIC of the unit is out of the server IP pool that's described in [SAP HANA (Large Instances) overview and architecture on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-architecture).

For more information about Ethernet details for your architecture, see the [HLI supported scenarios](hana-supported-scenario.md).

## Storage

The storage layout for SAP HANA on Azure (Large Instances) is configured by SAP HANA on Azure `service management` through SAP recommended guidelines. These guidelines are documented in the [SAP HANA storage requirements](https://go.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html) white paper. 

The rough sizes of the different volumes with the different HANA Large Instances SKUs is documented in [SAP HANA (Large Instances) overview and architecture on Azure](hana-overview-architecture.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

The naming conventions of the storage volumes are listed in the following table:

| Storage usage | Mount name | Volume name | 
| --- | --- | ---|
| HANA data | /hana/data/SID/mnt0000\<m> | Storage IP:/hana_data_SID_mnt00001_tenant_vol |
| HANA log | /hana/log/SID/mnt0000\<m> | Storage IP:/hana_log_SID_mnt00001_tenant_vol |
| HANA log backup | /hana/log/backups | Storage IP:/hana_log_backups_SID_mnt00001_tenant_vol |
| HANA shared | /hana/shared/SID | Storage IP:/hana_shared_SID_mnt00001_tenant_vol/shared |
| usr/sap | /usr/sap/SID | Storage IP:/hana_shared_SID_mnt00001_tenant_vol/usr_sap |

*SID* is the HANA instance System ID. 

*Tenant* is an internal enumeration of operations when deploying a tenant.

HANA usr/sap share the same volume. The nomenclature of the mountpoints includes the system ID of the HANA instances as well as the mount number. In scale-up deployments, there is only one mount, such as mnt00001. In scale-out deployments, on the other hand, you  see as many mounts as you have worker and master nodes. 

For scale-out environments, data, log, and log backup volumes are shared and attached to each node in the scale-out configuration. For configurations that are multiple SAP instances, a different set of volumes is created and attached to the HANA Large Instance unit. For storage layout details for your scenario, see [HLI supported scenarios](hana-supported-scenario.md).

When you look at a HANA Large Instance unit, you realize that the units come with generous disk volume for HANA/data, and that there is a volume HANA/log/backup. The reason that we made the HANA/data so large is that the storage snapshots we offer you as a customer are using the same disk volume. The     more storage snapshots you perform, the more space is consumed by snapshots in your assigned storage volumes. 

The HANA/log/backup volume is not supposed to be the volume for database backups. It is sized to be used as the backup volume for the HANA transaction log backups. For more information, see [SAP HANA (Large Instances) high availability and disaster recovery on Azure](hana-overview-high-availability-disaster-recovery.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). 

In addition to the storage that's provided, you can purchase additional storage capacity in 1-TB increments. This additional storage can be added as new volumes to a HANA Large Instance.

During onboarding with SAP HANA on Azure `service management`, the customer specifies a user ID (UID) and group ID (GID) for the sidadm user and sapsys group (for example: 1000,500). During installation of the SAP HANA system, you must use these same values. Because you want to deploy multiple HANA instances on a unit, you get multiple sets of volumes (one set for each instance). As a result, at deployment time you need to define:

- The SID of the different HANA instances (sidadm is derived from it).
- The memory sizes of the different HANA instances. The memory size per instance defines the size of the volumes in each individual volume set.

Based on storage provider recommendations, the following mount options are configured for all mounted volumes (excludes boot LUN):

- nfs    rw, vers=4, hard, timeo=600, rsize=1048576, wsize=1048576, intr, noatime, lock 0 0

These mount points are configured in /etc/fstab as shown in the following graphics:

![fstab of mounted volumes in HANA Large Instance unit](./media/hana-installation/image1_fstab.PNG)

The output of the command df -h on a S72m HANA Large Instance unit looks like:

![fstab of mounted volumes in HANA Large Instance unit](./media/hana-installation/image2_df_output.PNG)


The storage controller and nodes in the Large Instance stamps are synchronized to NTP servers. When you synchronize the SAP HANA on Azure (Large Instances) units and Azure VMs against an NTP server, there should be no significant time drift between the infrastructure and the compute units in Azure or Large Instance stamps.

To optimize SAP HANA to the storage used underneath, set the following SAP HANA configuration parameters:

- max_parallel_io_requests 128
- async_read_submit on
- async_write_submit_active on
- async_write_submit_blocks all
 
For SAP HANA 1.0 versions up to SPS12, these parameters can be set during the installation of the SAP HANA database, as described in [SAP note #2267798 - Configuration of the SAP HANA database](https://launchpad.support.sap.com/#/notes/2267798).

You can also configure the parameters after the SAP HANA database installation by using the hdbparam framework. 

The storage used in HANA Large Instances has a file size limitation. The [size limitation is 16 TB](https://docs.netapp.com/ontap-9/index.jsp?topic=%2Fcom.netapp.doc.dot-cm-vsmg%2FGUID-AA1419CF-50AB-41FF-A73C-C401741C847C.html) per file. Unlike in file size limitations in the EXT3 file systems, HANA is not aware implicitly of the storage limitation enforced by the HANA Large Instances storage. As a result HANA will not automatically create a new data file when the file size limit of 16TB is reached. As HANA attempts to grow the file beyond 16 TB, HANA will report errors and the index server will crash at the end.

> [!IMPORTANT]
> In order to prevent HANA trying to grow data files beyond the 16 TB file size limit of HANA Large Instance storage, you need to set the following parameters in the SAP HANA global.ini configuration file
> 
> - datavolume_striping=true
> - datavolume_striping_size_gb = 15000
> - See also SAP note [#2400005](https://launchpad.support.sap.com/#/notes/2400005)
> - Be aware of SAP note [#2631285](https://launchpad.support.sap.com/#/notes/2631285)


With SAP HANA 2.0, the hdbparam framework has been deprecated. As a result, the parameters must be set by using SQL commands. For more information, see [SAP note #2399079: Elimination of hdbparam in HANA 2](https://launchpad.support.sap.com/#/notes/2399079).

Refer to [HLI supported scenarios](hana-supported-scenario.md) to learn more about the storage layout for your architecture.


**Next steps**

- Refer to [HANA Installation on HLI](hana-example-installation.md)










































 







 




