---
title: 'Quickstart: Manual installation of single-instance SAP HANA on Azure Virtual Machines | Microsoft Docs'
description: Quickstart guide for manual installation of single-instance SAP HANA on Azure Virtual Machines
services: virtual-machines-linux
documentationcenter: ''
author: hermanndms
manager: jeconnoc
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: c51a2a06-6e97-429b-a346-b433a785c9f0
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 09/06/2018
ms.author: hermannd

---
# Quickstart: Manual installation of single-instance SAP HANA on Azure VMs
## Introduction
This guide helps you set up a single-instance SAP HANA on Azure virtual machines (VMs) when you install SAP NetWeaver 7.5 and SAP HANA 1.0 SP12 manually. The focus of this guide is on deploying SAP HANA on Azure. It does not replace SAP documentation. 

>[!Note]
>This guide describes deployments of SAP HANA into Azure VMs. For information on deploying SAP HANA into HANA large instances, see [Using SAP on Azure virtual machines (VMs)](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/get-started).
 
## Prerequisites
This guide assumes that you are familiar with such infrastructure as a service (IaaS) basics as:
 * How to deploy virtual machines or virtual networks via the Azure portal or PowerShell.
 * The Azure cross-platform command-line interface (CLI), including the option to use JavaScript Object Notation (JSON) templates.

This guide also assumes that you are familiar with:
* SAP HANA and SAP NetWeaver and how to install them on-premises.
* Installing and operating SAP HANA and SAP application instances on Azure.
* The following concepts and procedures:
   * Planning for SAP deployment on Azure, including Azure Virtual Network  planning and Azure Storage usage. See [SAP NetWeaver on Azure Virtual Machines (VMs) - Planning and implementation guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide).
   * Deployment principles and ways to deploy VMs in Azure. See [Azure Virtual Machines deployment for SAP](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/deployment-guide).
   * High availability for SAP NetWeaver ASCS (ABAP SAP Central Services), SCS (SAP Central Services), and ERS (Enqueue Replication Server) on Azure. See [High availability for SAP NetWeaver on Azure VMs](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide).
   * Details on how to improve efficiency in leveraging a multi-SID installation of ASCS/SCS on Azure. See [Create a SAP NetWeaver multi-SID configuration](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-multi-sid). 
   * Principles of running SAP NetWeaver based on Linux-driven VMs in Azure. See [Running SAP NetWeaver on Microsoft Azure SUSE Linux VMs](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/suse-quickstart). This guide provides specific settings for Linux in Azure VMs and details on how to properly attach Azure storage disks to Linux VMs.

The Azure VM types that can be used for production scenarios are listed in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html). For non-production scenarios, a wider variety of native Azure VM types is available.
For more details on VM configuration and operations consult the document [SAP HANA infrastructure configurations and operations on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations).
For SAP HANA high availability, see [SAP HANA high availability for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-availability-overview).

If you are seeking to get an SAP HANA instance or S/4HANA, or BW/4HANA system deployed in very fast time, you should consider the usage of [SAP Cloud Appliance Library](http://cal.sap.com). You can find documentation about deploying, for example, an S/4HANA system through SAP CAL on Azure in [this guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/cal-s4h). All you need to have is an Azure subscription and an SAP user that can be registered with SAP Cloud Appliance Library.

## Additional resources
### SAP HANA backup
For information on backing up SAP HANA databases on Azure VMs, see:
* [Backup guide for SAP HANA on Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-guide)
* [SAP HANA Azure Backup on file level](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-file-level)
* [SAP HANA backup based on storage snapshots](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-storage-snapshots)

### SAP Cloud Appliance Library
For information on using SAP Cloud Appliance Library to deploy S/4HANA or BW/4HANA, see [Deploy SAP S/4HANA or BW/4HANA on Microsoft Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/cal-s4h).

### SAP HANA-supported operating systems
For information on SAP HANA-supported operating systems, see [SAP Support Note #2235581 - SAP HANA: Supported Operating Systems](https://launchpad.support.sap.com/#/notes/2235581/E). Azure VMs support only a subset of these operating systems. The following operating systems are supported to deploy SAP HANA on Azure: 

* SUSE Linux Enterprise Server 12.x
* Red Hat Enterprise Linux 7.2

For additional SAP documentation about SAP HANA and different Linux operating systems, see:

* [SAP Support Note #171356 - SAP Software on Linux:  General Information](https://launchpad.support.sap.com/#/notes/1984787)
* [SAP Support Note #1944799 - SAP HANA Guidelines for SLES Operating System Installation](http://go.sap.com/documents/2016/05/e8705aae-717c-0010-82c7-eda71af511fa.html)
* [SAP Support Note #2205917 - SAP HANA DB Recommended OS Settings for SLES 12 for SAP Applications](https://launchpad.support.sap.com/#/notes/2205917/E)
* [SAP Support Note #1984787 - SUSE Linux Enterprise Server 12:  Installation Notes](https://launchpad.support.sap.com/#/notes/1984787)
* [SAP Support Note #1391070 - Linux UUID Solutions](https://launchpad.support.sap.com/#/notes/1391070)
* [SAP Support Note #2009879 - SAP HANA Guidelines for Red Hat Enterprise Linux (RHEL) Operating System](https://launchpad.support.sap.com/#/notes/2009879)
* [2292690 - SAP HANA DB: Recommended OS settings for RHEL 7](https://launchpad.support.sap.com/#/notes/2292690/E)

### SAP monitoring in Azure
For information about SAP monitoring in Azure, see:

* [SAP Note 2191498](https://launchpad.support.sap.com/#/notes/2191498/E). This note discusses SAP "enhanced monitoring" with Linux VMs on Azure. 
* [SAP Note 1102124](https://launchpad.support.sap.com/#/notes/1102124/E). This note discusses information about SAPOSCOL on Linux. 
* [SAP Note 2178632](https://launchpad.support.sap.com/#/notes/2178632/E). This note discusses key monitoring metrics for SAP on Microsoft Azure.

### Azure VM types
Azure VM types and SAP-supported workload scenarios used with SAP HANA are documented in [SAP certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html). 

Azure VM types that are certified by SAP for SAP NetWeaver or the S/4HANA application layer are documented in [SAP Note 1928533 - SAP Applications on Azure: Supported Products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533/E).

>[!Note]
>SAP-Linux-Azure integration is supported only on Azure Resource Manager and not the classic deployment model. 

## Manual installation of SAP HANA

> [!IMPORTANT]
> Make sure that the OS you select is SAP certified for SAP HANA on the specific VM types you are using. The list  of SAP HANA certified VM types and OS releases for those can be looked up in [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure). Make sure to click into the details of the VM type listed to get the complete list of SAP HANA supported OS releases for the specific VM type. Realize that in the example in this document we used a SLES OS release that is not supported by SAP for SAP HANA on M-Series VMs.
>

This guide describes how to manually install SAP HANA on Azure VMs in two different ways:

* By using SAP Software Provisioning Manager (SWPM) as part of a distributed NetWeaver installation in the "install database instance" step
* By using the SAP HANA database lifecycle manager tool, HDBLCM, and then installing NetWeaver

You can also use SWPM to install all components (SAP HANA, the SAP application server, and the ASCS instance) in one single VM, as described in this [SAP HANA blog announcement](https://blogs.saphana.com/2013/12/31/announcement-sap-hana-and-sap-netweaver-as-abap-deployed-on-one-server-is-generally-available/). This option isn't described in this Quickstart guide, but the issues that you must take into consideration are the same.

Before you start an installation, we recommend that you read the "Preparing Azure VMs for manual installation of SAP HANA" section later in this guide. Doing so can help prevent several basic mistakes that might occur when you use only a default Azure VM configuration.

## Key steps for SAP HANA installation when you use SAP SWPM
This section lists the key steps for a manual, single-instance SAP HANA installation when you use SAP SWPM to perform a distributed SAP NetWeaver 7.5 installation. The individual steps are explained in more detail in screenshots later in this guide.

1. Create an Azure virtual network that includes two test VMs.
2. Deploy the two Azure VMs with operating systems (in our example, SUSE Linux Enterprise Server (SLES) and SLES for SAP Applications 12 SP1), according to the Azure Resource Manager model.
3. Attach two Azure standard or premium storage disks (for example, 75-GB or 500-GB disks) to the application server VM.
4. Attach premium storage disks to the HANA DB server VM. For details, see the "Disk setup" section later in this guide.
5. Depending on size or throughput requirements, attach multiple disks, and then create striped volumes by using either logical volume management or a multiple-devices administration tool (MDADM) at the OS level inside the VM.
6. Create XFS file systems on the attached disks or logical volumes.
7. Mount the new XFS file systems at the OS level. Use one file system for all the SAP software. Use the other file system for the /sapmnt directory and backups, for example. On the SAP HANA DB server, mount the XFS file systems on the premium storage disks as /hana and /usr/sap. This process is necessary to prevent the root file system, which isn't large on Linux Azure VMs, from filling up.
8. Enter the local IP addresses of the test VMs in the /etc/hosts file.
9. Enter the **nofail** parameter in the /etc/fstab file.
10. Set Linux kernel parameters according to the Linux OS release you are using. For more information, see the appropriate SAP notes that discuss HANA and the "Kernel parameters" section in this guide.
11. Add swap space.
12. Optionally, install a graphical desktop on the test VMs. Otherwise, use a remote SAPinst installation.
13. Download the SAP software from the SAP Service Marketplace.
14. Install the SAP ASCS instance on the app server VM.
15. Share the /sapmnt directory among the test VMs by using NFS. The application server VM is the NFS server.
16. Install the database instance, including HANA, by using SWPM on the DB server VM.
17. Install the primary application server (PAS) on the application server VM.
18. Start SAP Management Console (SAP MC). Connect with SAP GUI or HANA Studio, for example.

## Key steps for SAP HANA installation when you use HDBLCM
This section lists the key steps for a manual, single-instance SAP HANA installation when you use SAP HDBLCM to perform a distributed SAP NetWeaver 7.5 installation. The individual steps are explained in more detail in screenshots throughout this guide.

1. Create an Azure virtual network that includes two test VMs.
2. Deploy two Azure VMs with operating systems (in our example, SLES and SLES for SAP Applications 12 SP1) according to the Azure Resource Manager model.
3. Attach two Azure standard or premium storage disks (for example, 75-GB or 500-GB disks) to the app server VM.
4. Attach premium storage disks to the HANA DB server VM. For details, see the "Disk setup" section later in this guide.
5. Depending on size or throughput requirements, attach multiple disks and create striped volumes by using either logical volume management or a multiple-devices administration tool (MDADM) at the OS level inside the VM.
6. Create XFS file systems on the attached disks or logical volumes.
7. Mount the new XFS file systems at the OS level. Use one file system for all the SAP software, and use the other one for the /sapmnt directory and backups, for example. On the SAP HANA DB server, mount the XFS file systems on the premium storage disks as /hana and /usr/sap. This process is necessary to help prevent the root file system, which isn't large on Linux Azure VMs, from filling up.
8. Enter the local IP addresses of the test VMs in the /etc/hosts file.
9. Enter the **nofail** parameter in the /etc/fstab file.
10. Set kernel parameters according to the Linux OS release you are using. For more information, see the appropriate SAP notes that discuss HANA and the "Kernel parameters" section in this guide.
11. Add swap space.
12. Optionally, install a graphical desktop on the test VMs. Otherwise, use a remote SAPinst installation.
13. Download the SAP software from the SAP Service Marketplace.
14. Create a group, sapsys, with group ID 1001, on the HANA DB server VM.
15. Install SAP HANA on the DB server VM by using HANA Database Lifecycle Manager (HDBLCM).
16. Install the SAP ASCS instance on the app server VM.
17. Share the /sapmnt directory among the test VMs by using NFS. The application server VM is the NFS server.
18. Install the database instance, including HANA, by using SWPM on the HANA DB server VM.
19. Install the primary application server (PAS) on the application server VM.
20. Start SAP MC. Connect through SAP GUI or HANA Studio.

## Preparing Azure VMs for a manual installation of SAP HANA
This section covers the following topics:

* OS updates
* Disk setup
* Kernel parameters
* File systems
* The /etc/hosts file
* The /etc/fstab file

### OS updates
Check for Linux OS updates and fixes before installing additional software. By installing a patch, you might be able to avoid a call to the support desk.

Make sure that you are using:
* SUSE Linux Enterprise Server for SAP Applications.
* Red Hat Enterprise Linux for SAP Applications or Red Hat Enterprise Linux for SAP HANA. 

If you haven't already, register the OS deployment with your Linux subscription from the Linux vendor. Note that SUSE has OS images for SAP applications that already include services and which are registered automatically.

Here is an example of checking for available patches for SUSE Linux by using the **zypper** command:

 `sudo zypper list-patches`

Depending on the kind of issue, patches are classified by category and severity. Commonly used values for category are: **security**, **recommended**, **optional**, **feature**, **document**, or **yast**.
Commonly used values for severity are: **critical**, **important**, **moderate**, **low**, or **unspecified**.

The **zypper** command looks only for the updates that your installed packages need. For example, you could use this command:

`sudo zypper patch  --category=security,recommended --severity=critical,important`

You can add the parameter `--dry-run` to test the update without actually updating the system.


### Disk setup
The root file system in a Linux VM on Azure has a size limitation. Therefore, it's necessary to attach additional disk space to an Azure VM for running SAP. For SAP application server Azure VMs, the use of Azure standard storage disks might be sufficient. However, for SAP HANA DBMS Azure VMs, the use of Azure Premium Storage disks for production and non-production implementations is mandatory.

Based on the [SAP HANA TDI Storage Requirements](https://www.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html), the following Azure Premium Storage configuration is suggested: 

| VM SKU | RAM |  /hana/data and /hana/log <br /> striped with LVM or MDADM | /hana/shared | /root volume | /usr/sap |
| --- | --- | --- | --- | --- | --- |
| GS5 | 448 GB | 2 x P30 | 1 x P20 | 1 x P10 | 1 x P10 | 

In the suggested disk configuration, the HANA data volume and log volume are placed on the same set of Azure premium storage disks that are striped with LVM or MDADM. It is not necessary to define any RAID redundancy level because Azure Premium Storage keeps three images of the disks for redundancy. To make sure that you configure enough storage, consult the [SAP HANA TDI Storage Requirements](https://www.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html) and [SAP HANA Server Installation and Update Guide](http://help.sap.com/saphelp_hanaplatform/helpdata/en/4c/24d332a37b4a3caad3e634f9900a45/frameset.htm). Also consider the different virtual hard disk (VHD) throughput volumes of the different Azure premium storage disks as documented in [High-performance Premium Storage and managed disks for VMs](https://docs.microsoft.com/azure/storage/storage-premium-storage). 

You can add more premium storage disks to the HANA DBMS VMs for storing database or transaction log backups.

For more information about the two main tools used to configure striping, see the following articles:

* [Configure software RAID on Linux](../../linux/configure-raid.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Configure LVM on a Linux VM in Azure](../../linux/configure-lvm.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

For more information on attaching disks to Azure VMs running Linux as a guest OS, see [Add a disk to a Linux VM](../../linux/add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

Azure Premium Storage allows you to define disk caching modes. For the striped set holding /hana/data and /hana/log, disk caching should be disabled. For the other volumes (disks), the caching mode should be set to **ReadOnly**.

For more information, see [Premium Storage: High-performance storage for Azure Virtual Machine workloads](../../windows/premium-storage.md).

To find sample JSON templates for creating VMs, go to [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates).
The vm-simple-sles template is a basic template. It includes a storage section, with an additional 100-GB data disk. This template can be used as a base. You can adapt the template to your specific configuration.

>[!Note]
>It is important to attach the Azure storage disk by using a UUID as documented in [Running SAP NetWeaver on Microsoft Azure SUSE Linux VMs](suse-quickstart.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

In the test environment, two Azure standard storage disks were attached to the SAP app server VM, as shown in the following screenshot. One disk stored all the SAP software (including NetWeaver 7.5, SAP GUI, and SAP HANA) for installation. The second disk ensured that enough free space would be available for additional requirements (for example, backup and test data) and for the /sapmnt directory (that is, SAP profiles) to be shared among all VMs that belong to the same SAP landscape.

![SAP HANA app server disks window displaying two data disks and their sizes](./media/hana-get-started/image003.jpg)


### Kernel parameters
SAP HANA requires specific Linux kernel settings, which are not part of the standard Azure gallery images and must be set manually. Depending on whether you use SUSE or Red Hat, the parameters might be different. The SAP Notes listed earlier give information about those parameters. In the screenshots shown, SUSE Linux 12 SP1 was used. 

SLES for SAP Applications 12 GA and SLES for SAP Applications 12 SP1 have a new tool, **tuned-adm**, that replaces the old **sapconf** tool. A special SAP HANA profile is available for **tuned-adm**. To tune the system for SAP HANA, enter the following as a root user:

   `tuned-adm profile sap-hana`

For more information about **tuned-adm**, see the [SUSE documentation
about tuned-adm](https://www.suse.com/documentation/sles-for-sap-12/pdfdoc/sles-for-sap-12-sp1.zip).

In the following screenshot, you can see how **tuned-adm** changed the `transparent_hugepage` and `numa_balancing` values, according to the required SAP HANA settings.

![The tuned-adm tool changes values according to required SAP HANA settings](./media/hana-get-started/image005.jpg)

To make the SAP HANA kernel settings permanent, use **grub2** on SLES 12. For more information about **grub2**, go to the [Configuration File Structure](https://www.suse.com/documentation/sles-for-sap-12/pdfdoc/sles-for-sap-12-sp1.zip) section of the SUSE documentation.

The following screenshot shows how the kernel settings were changed in the configuration file and then compiled by using **grub2-mkconfig**:

![Kernel settings changed in the configuration file and compiled by using grub2-mkconfig](./media/hana-get-started/image006.jpg)

Another option is to change the settings by using YaST and the **Boot Loader** > **Kernel Parameters** settings:

![The Kernel Parameters settings tab in YaST Boot Loader](./media/hana-get-started/image007.jpg)

### File systems
The following screenshot shows two file systems that were created on the SAP app server VM on top of the two attached Azure standard storage disks. Both file systems are of type XFS and are mounted to /sapdata and /sapsoftware.

It is not mandatory to structure your file systems in this way. You have other options for structuring the disk space. The most important consideration is to prevent the root file system from running out of free space.

![Two file systems created on the SAP app server VM](./media/hana-get-started/image008.jpg)

Regarding the SAP HANA DB VM, during a database installation, when you use SAPinst (SWPM) and the **typical** installation option, everything is installed under /hana and /usr/sap. The default location for the SAP HANA log backup is under /usr/sap. Again, because it's important to prevent the root file system from running out of storage space, make sure that there is enough free space under /hana and /usr/sap before you install SAP HANA by using SWPM.

For a description of the standard file-system layout of SAP HANA, see the [SAP HANA Server Installation and Update Guide](http://help.sap.com/saphelp_hanaplatform/helpdata/en/4c/24d332a37b4a3caad3e634f9900a45/frameset.htm).

![Additional file systems created on the SAP app server VM](./media/hana-get-started/image009.jpg)

When you install SAP NetWeaver on a standard SLES/SLES for SAP Applications 12 Azure gallery image, a message is displayed that says  there is no swap space, as shown in the following screenshot. To dismiss this message, you can manually add a swap file by using **dd**, **mkswap**, and **swapon**. To learn how, search for "Adding a swap file manually" in the [Using the YaST Partitioner](https://www.suse.com/documentation/sles-for-sap-12/pdfdoc/sles-for-sap-12-sp1.zip) section of the SUSE documentation.

Another option is to configure swap space by using the Linux VM agent. For more information, see the [Azure Linux Agent User Guide](../../extensions/agent-linux.md).

![Pop-up message advising that there is insufficient swap space](./media/hana-get-started/image010.jpg)


### The /etc/hosts file
Before you start to install SAP, make sure you include the host names and IP addresses of the SAP VMs in the /etc/hosts file. Deploy all the SAP VMs within one Azure virtual network, and then use the internal IP addresses, as shown here:

![Host names and IP addresses of the SAP VMs listed in the /etc/hosts file](./media/hana-get-started/image011.jpg)

### The /etc/fstab file

It is helpful to add the **nofail** parameter to the fstab file. This way, if something goes wrong with the disks, the VM does not hang in the boot process. But remember that additional disk space might not be available, and processes might fill up the root file system. If /hana is missing, SAP HANA won't start.

![Add the nofail parameter to the fstab file](./media/hana-get-started/image000c.jpg)

## Graphical GNOME desktop on SLES 12/SLES for SAP Applications 12
This section covers the following topics:

* Installing the GNOME desktop and xrdp on SLES 12/SLES for SAP Applications 12
* Running Java-based SAP MC by using Firefox on SLES 12/SLES for SAP Applications 12

You can also use alternatives such as Xterminal or VNC (not described in this guide).

### Installing the GNOME desktop and xrdp on SLES 12/SLES for SAP Applications 12
If you have a Windows background, you can easily use a graphical desktop directly within the SAP Linux VMs to run Firefox, SAPinst, SAP GUI, SAP MC, or HANA Studio, and connect to the VM through the Remote Desktop Protocol (RDP) from a Windows computer. Dependent on your company policies about adding graphical user interfaces to production and non-production Linux based systems, you might want to install GNOME on your server. To install the GNOME desktop on an Azure SLES 12/SLES for SAP Applications 12 VM:

1. Install the GNOME desktop by entering the following command (for example, in a PuTTY window):

   `zypper in -t pattern gnome-basic`

2. Install xrdp to allow a connection to the VM through RDP:

   `zypper in xrdp`

3. Edit /etc/sysconfig/windowmanager, and set the default window manager to GNOME:

   `DEFAULT_WM="gnome"`

4. Run **chkconfig** to make sure that xrdp starts automatically after a reboot:

   `chkconfig -level 3 xrdp on`

5. If you have an issue with the RDP connection, try to restart (from a PuTTY window, for example):

   `/etc/xrdp/xrdp.sh restart`

6. If an xrdp restart mentioned in the previous step doesn't work, check for a .pid file:

   `check /var/run` 

   Look for `xrdp.pid`. If you find it, remove it, and try to restart again.

### Starting SAP MC
After you install the GNOME desktop, starting the graphical Java-based SAP MC from Firefox while running in an Azure SLES 12/SLES for SAP Applications 12 VM might display an error because of the missing Java-browser plug-in.

The URL to start the SAP MC is `<server>:5<instance_number>13`.

For more information, see [Starting the Web-Based SAP Management Console](https://help.sap.com/saphelp_nwce10/helpdata/en/48/6b7c6178dc4f93e10000000a42189d/frameset.htm).

The following screenshot shows the error message that is displayed when the Java-browser plug-in is missing:

![Error message indicating missing Java-browser plug-in](./media/hana-get-started/image013.jpg)

One way to solve the problem is to install the missing plug-in by using YaST, as shown in the following screenshot:

![Using YaST to install missing plug-in](./media/hana-get-started/image014.jpg)

When you re-enter the SAP Management Console URL, a message appears asking you to activate the plug-in:

![Dialog box requesting plug-in activation](./media/hana-get-started/image015.jpg)

You might also receive an error message about a missing file, javafx.properties. This is related to the requirement of Oracle Java 1.8 for SAP GUI 7.4. (See [SAP Note 2059429](https://launchpad.support.sap.com/#/notes/2059424).)
Neither the IBM Java version nor the openjdk package delivered with SLES/SLES for SAP Applications 12 includes the needed javafx.properties file. The solution is to download and install Java SE 8 from Oracle.

For information about a similar issue with openjdk on openSUSE, see the discussion thread [SAPGui 7.4 Java for openSUSE 42.1 Leap](https://scn.sap.com/thread/3908306).

## Manual installation of SAP HANA: SWPM
The series of screenshots in this section shows the key steps for installing SAP NetWeaver 7.5 and SAP HANA SP12 when you use SWPM (SAPinst). As part of a NetWeaver 7.5 installation, SWPM can also install the HANA database as a single instance.

In a sample test environment, we installed just one Advanced Business Application Programming (ABAP) app server. As shown in the following screenshot, we used the **Distributed System** option to install the ASCS and primary application server instances in one Azure VM and SAP HANA as the database system in another Azure VM.

![ASCS and primary application server instances installed by using the Distributed System option](./media/hana-get-started/image012.jpg)

After the ASCS instance is installed on the app server VM and is set to "green" in the SAP Management Console (shown in the following screenshot), the /sapmnt directory (including the SAP profile directory) must be shared with the SAP HANA DB server VM. The DB installation step needs access to this information. The best way to provide access is to use NFS, which can be configured by using YaST.

![SAP Management Console showing the ASCS instance installed on the app server VM and set to "green"](./media/hana-get-started/image016.jpg)

On the app server VM, the /sapmnt directory should be shared via NFS by using the **rw** and **no_root_squash** options. The defaults are **ro** and **root_squash**, which might lead to problems when you install the database instance.

![Sharing the /sapmnt directory via NFS by using the rw and no_root_squash options](./media/hana-get-started/image017b.jpg)

As the next screenshot shows, the /sapmnt share from the app server VM must be configured on the SAP HANA DB server VM by using **NFS Client** (and YaST).

![The /sapmnt share configured by using NFS Client](./media/hana-get-started/image018b.jpg)

To perform a distributed NetWeaver 7.5 installation (**Database Instance**), as shown in the following screenshot, sign in to the SAP HANA DB server VM and start SWPM.

![Installing a database instance by signing in to the SAP HANA DB server VM and starting SWPM](./media/hana-get-started/image019.jpg)

After you select **typical** installation and the path to the installation media, enter a DB SID, the host name, the instance number, and the DB system administrator password.

![The SAP HANA database system administrator sign-in page](./media/hana-get-started/image035b.jpg)

Enter the password for the DBACOCKPIT schema:

![The password-entry box for the DBACOCKPIT schema](./media/hana-get-started/image036b.jpg)

Enter a question for the SAPABAP1 schema password:

![Enter a question for the SAPABAP1 schema password](./media/hana-get-started/image037b.jpg)

After each task is completed, a green check mark is displayed next to each phase of the DB installation process. The message "Execution of ... Database Instance has completed" is displayed.

![Task-completed window with confirmation message](./media/hana-get-started/image023.jpg)

After successful installation, the SAP Management Console should also show the DB instance as "green" and display the full list of SAP HANA processes (hdbindexserver, hdbcompileserver, and so forth).

![SAP Management Console window with list of SAP HANA processes](./media/hana-get-started/image024.jpg)

The following screenshot shows the parts of the file structure under the /hana/shared directory that SWPM created during the HANA installation. Because there is no option to specify a different path, it's important to mount additional disk space under the /hana directory before the SAP HANA installation by using SWPM. This prevents the root file system from running out of free space.

![The /hana/shared directory file structure created during HANA installation](./media/hana-get-started/image025.jpg)

This screenshot shows the file structure of the /usr/sap directory:

![The /usr/sap directory file structure](./media/hana-get-started/image026.jpg)

The last step of the distributed ABAP installation is to install the primary application server instance:

![ABAP installation showing primary application server instance as the final step](./media/hana-get-started/image027b.jpg)

After the primary application server instance and SAP GUI are installed, use the **DBA Cockpit** transaction to confirm that the SAP HANA installation has finished correctly:

![DBA Cockpit window confirming successful installation](./media/hana-get-started/image028b.jpg)

As a final step, you might want to first install HANA Studio in the SAP app server VM, and then connect to the SAP HANA instance that's running on the DB server VM:

![Installing SAP HANA Studio in the SAP app server VM](./media/hana-get-started/image038b.jpg)

## Manual installation of SAP HANA: HDBLCM
In addition to installing SAP HANA as part of a distributed installation by using SWPM, you can install the HANA standalone first, by using HDBLCM. You can then install SAP NetWeaver 7.5, for example. The screenshots in this section show how this process works.

For more information about the HANA HDBLCM tool, see:

* [Choosing the Correct SAP HANA HDBLCM for Your Task](https://help.sap.com/saphelp_hanaplatform/helpdata/en/68/5cff570bb745d48c0ab6d50123ca60/content.htm)
* [SAP HANA Lifecycle Management Tools](http://saphanatutorial.com/sap-hana-lifecycle-management-tools/)
* [SAP HANA Server Installation and Update Guide](http://help.sap.com/hana/SAP_HANA_Server_Installation_Guide_en.pdf)

To avoid problems with a default group ID setting for the `\<HANA SID\>adm user` (created by the HDBLCM tool), define a new group called `sapsys` by using group ID `1001` before you install SAP HANA via HDBLCM:

![New group "sapsys" defined by using group ID 1001](./media/hana-get-started/image030.jpg)

When you start HDBLCM the first time, a simple start menu is displayed. Select item 1, **Install new system**, as shown in the following screenshot:

!["Install new system" option in the HDBLCM start window](./media/hana-get-started/image031.jpg)

The following screenshot displays all the key options that you selected previously.

> [!IMPORTANT]
> Directories that are named for HANA log and data volumes, as well as the installation path (/hana/shared in this sample) and /usr/sap, should not be part of the root file system. These directories belong to the Azure data disks that were attached to the VM (described in the "Disk setup" section). This approach helps prevent the root file system from running out of space. In the following screenshot, you can see that the HANA system administrator has user ID `1005` and is part of the `sapsys` group (ID `1001`) that was defined before the installation.

![List of all key SAP HANA components selected previously](./media/hana-get-started/image032.jpg)

You can check the `\<HANA SID\>adm user` (`azdadm` in the following screenshot) details in the /etc/passwd directory:

![HANA \<HANA SID\>adm user details listed in the /etc/passwd directory](./media/hana-get-started/image033.jpg)

After you install SAP HANA by using HDBLCM, you can see the file structure in SAP HANA Studio, as shown in the following screenshot. The SAPABAP1 schema, which includes all the SAP NetWeaver tables, isn't available yet.

![SAP HANA file structure in SAP HANA Studio](./media/hana-get-started/image034.jpg)

After you install SAP HANA, you can install SAP NetWeaver on top of it. As shown in the following screenshot, the installation was performed as a distributed installation by using SWPM (as described in the previous section). When you install the database instance by using SWPM, you enter the same data by using HDBLCM (for example, host name, HANA SID, and instance number). SWPM then uses the existing HANA installation and adds more schemas.

![A distributed installation performed by using SWPM](./media/hana-get-started/image035b.jpg)

The following screenshot shows the SWPM installation step where you enter data about the DBACOCKPIT schema:

![The SWPM installation step where DBACOCKPIT schema data is entered](./media/hana-get-started/image036b.jpg)

Enter data about the SAPABAP1 schema:

![Entering data about the SAPABAP1 schema](./media/hana-get-started/image037b.jpg)

After the SWPM database instance installation is completed, you can see the SAPABAP1 schema in SAP HANA Studio:

![The SAPABAP1 schema in SAP HANA Studio](./media/hana-get-started/image038b.jpg)

Finally, after the SAP app server and SAP GUI installations are completed, you can verify the HANA DB instance by using the **DBA Cockpit** transaction:

![The HANA DB instance verified with the DBA Cockpit transaction](./media/hana-get-started/image039b.jpg)


## SAP software downloads
You can download software from the SAP Service Marketplace, as shown in the following screenshots.

Download NetWeaver 7.5 for Linux/HANA:

 ![SAP Service Installation and Upgrade window for downloading NetWeaver 7.5](./media/hana-get-started/image001.jpg)

Download HANA SP12 Platform Edition:

 ![SAP Service Installation and Upgrade window for downloading HANA SP12 Platform Edition](./media/hana-get-started/image002.jpg)

