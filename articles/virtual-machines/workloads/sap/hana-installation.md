---
title: Install SAP HANA on SAP HANA on Azure (Large Instances) | Microsoft Docs
description: How to install SAP HANA on a SAP HANA on Azure (Large Instance).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: timlt
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 12/01/2016
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---
# How to install and configure SAP HANA (large instances) on Azure

The installation of SAP HANA is your responsibility and you can do this immediately after handoff of a new SAP HANA on Azure (Large Instances) server and after the connectivity between your Azure VNet(s) and the HANA Large Instance unit(s) got established. Please note, per SAP policy, installation of SAP HANA must be performed by certified SAP HANA installer — someone who has passed the Certified SAP Technology Associate – SAP HANA Installation certification exam, or by a SAP-certified system integrator (SI).

## First steps after receiving the HANA Large Instance Unit(s)

First Step after receiving the HANA Large Instance is to register the OS of the instance with your OS provider. This would include registering your SUSELinux OS in an instance of SUSE SMT that you need to have deployed. Or your RedHat OS needs to be registered with the Red Hat Subscription Manager you need to connect to. See also remarks in this [document](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/sap-hana-overview-architecture?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). This step also is necessary to be able to patch the OS going forward. A task that is in the responsibility of you as customer. 

Second Step is to check for new patches and fixes of the specific OS release/version. Check whether the patch level of the HANA Large Instance is on the latest state. Based on timing on OS patch/releases and changes to the image Microsoft can deploy there might be cases where the latest patches may not be included. Hence it is a mandatory step after taking over the unit to check whether patches relevant for security, functionality, availability and performance were released meanwhile by the particular Linux vendor and need to be applied.

Third Step is to check out the relevant SAP Notes for installing and configuring SAP HANA on the specific OS release/version. Due to changing recommendations or changes to SAP Notes or configurations that are dependent on individual installation scenarios, Microsoft will not always be able to have a HANA Large Instance unit configured perfectly. Hence it is mandatory for you as a customer, to read the SAP Notes (minimum listed below), check the configurations of the OS release/version necessary apply the configuration settings where not done already.

In specific, please check the following parameters should be checked and eventually adjusted to:
- net.core.rmem_max = 16777216
- net.core.wmem_max = 16777216
- net.core.rmem_default = 16777216
- net.core.wmem_default = 16777216
- net.core.optmem_max = 16777216
- net.ipv4.tcp_rmem = 65536 16777216 16777216
- net.ipv4.tcp_wmem = 65536 16777216 16777216

Starting with SLES12 SP1 and RHEL 7.2, these parameters must be set in a configuration file in the /etc/sysctl.d directory. For example, a configuration file with the name 91-NetApp-HANA.conf must be created. For older SLES and RHEL releases, these parameters must be set in/etc/sysctl.conf.

For all RHEL releases and starting with SLES12, the 
- sunrpc.tcp_slot_table_entries = 128

parameter must be set in/etc/modprobe.d/sunrpc-local.conf. If the file does not exist, it must first be created by adding the following entry: 
- options sunrpc tcp_max_slot_table_entries=128

Fourth Step is to check the system time of your HANA Large Instance Unit. 
The instances will be deployed with a system time zone that represent the location of the Azure region the HANA Large Instance Stamp is located in. You are free to change the system time or time zone of the instances you own. Doing so and ordering more instances into your tenant, be prepared that you need to adapt the time zone of the newly delivered instances. Microsoft operations have no insights into the system time zone you set up with the instances after the handover. Hence newly deployed instances might not be set in the same time zone as the one you changed to. As a result, it is your responsibility as customer to check and if necessary adapt the time zone of the instance handed over. Move NTP configuration to here from further down? Seems a logical place to do all the OS prerequisites at the beginning? 

Fifth Step is to check etc/hosts. As the blades get handed over, they have different IP addresses assigned for different purposes (see next section). Please check etc/hosts. In cases where units are added into an existing tenant, don't expect to have etc/hosts maintained of the newly deployed systems with the IP addresses of earlier deployed systems. Hence it is on you as customer to check the correct settings so, that a newly deployed instance can interact and resolve the names of earlier deployed units in your tenant. 

## Network preparations
Every HANA Large Instance unit comes with two or three IP addresses that are assigned to two or three NIC ports of the unit. Three IP addresses are used in HANA scale-out configurations and the HANA System Replication scenario. One of the IP addresses assigned to the NIC of the unit is out of the Server IP pool that was described in the [SAP HANA (large Instance) Overview and Architecture on Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/workloads/sap/hana-overview-architecture).

## Storage

The storage layout for SAP HANA on Azure (Large Instances) is configured by SAP HANA on Azure Service Management through SAP recommended best practices, see the [SAP HANA Storage Requirements](http://go.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html) white paper.

The exact configurations of the storage for the different HANA Large Instances looks like:

| Memory Size | HANA/data | HANA/log | HANA/shared | HANA/log/backups |
| --- | --- | --- | --- | --- |
| 768 GB | 1280 GB | 512 GB | 768 GB | 512 GB |
| 1536 GB | 3456 GB | 768 GB | 1024 GB | 768 GB |
| 3072 GB | 7680 GB | 1536 GB | 1024 GB | 1536 GB |

In addition, customers can purchase additional storage capacity in 1 TB increments. This additional storage can be added as new volumes to a HANA Large Instances.

The storage controller and nodes in the Large Instance stamps are synchronized to NTP servers. With you synchronizing the SAP HANA on Azure (Large Instances) units and Azure VMs against an NTP server, there should be no significant time drift happening between the infrastructure and the compute units in Azure or Large Instance stamps.

## Operating system

[SUSE Linux Enterprise Server 12 SP1 for SAP Applications](https://www.suse.com/products/sles-for-sap/hana) is the distribution of Linux installed for SAP HANA on Azure (Large Instances). This particular distribution provides SAP-specific capabilities &quot;out of the box&quot; (including pre-set parameters for running SAP on SLES effectively).

See [Resource Library/White Papers](https://www.suse.com/products/sles-for-sap/resource-library#white-papers) on the SUSE website and [SAP on SUSE](https://wiki.scn.sap.com/wiki/display/ATopics/SAP+on+SUSE) on the SAP Community Network (SCN) for several useful resources related to deploying SAP HANA on SLES (including the set-up of High Availability, security hardening specific to SAP operations, and more).

Additional and useful SLES-related links:

- [SAP HANA on SUSE Linux Site](https://wiki.scn.sap.com/wiki/display/ATopics/SAP+on+SUSE)
- [Best Practice for SAP: Enqueue Replication – SAP NetWeaver on SUSE Linux Enterprise 12](https://www.suse.com/docrepcontent/container.jsp?containerId=9113)
- [ClamSAP – SLES Virus Protection for SAP](http://scn.sap.com/community/linux/blog/2014/04/14/clamsap--suse-linux-enterprise-server-integrates-virus-protection-for-sap) (including SLES 12 for SAP Applications)

SAP Support Notes applicable to implementing SAP HANA on SLES 12 SP1:

- [SAP Support Note #1944799 – SAP HANA Guidelines for SLES Operating System Installation](http://go.sap.com/documents/2016/05/e8705aae-717c-0010-82c7-eda71af511fa.html)
- [SAP Support Note #2205917 – SAP HANA DB Recommended OS Settings for SLES 12 for SAP Applications](https://launchpad.support.sap.com/#/notes/2205917/E)
- [SAP Support Note #1984787 – SUSE Linux Enterprise Server 12:  Installation Notes](https://launchpad.support.sap.com/#/notes/1984787)
- [SAP Support Note #171356 – SAP Software on Linux:  General Information](https://launchpad.support.sap.com/#/notes/1984787)
- [SAP Support Note #1391070 – Linux UUID Solutions](https://launchpad.support.sap.com/#/notes/1391070)

## Time synchronization

SAP is very sensitive on time differences for the various components that comprise the SAP system. SAP ABAP short dumps with the error title of ZDATE\_LARGE\_TIME\_DIFF are likely familiar if you have been working with SAP (Basis) for a long time, as these short dumps appear when the system time of different servers or VMs is drifting too far apart.

For SAP HANA on Azure (Large Instances), time synchronization done in Azure doesn&#39;t apply to the compute units in the Large Instance stamps. This is not applicable for running SAP applications natively in Azure (on VMs), as Azure ensures a system&#39;s time is properly synchronized. As a result, a separate time server must be set up that can be used by SAP application servers running on Azure VMs and the SAP HANA database instances running on HANA Large Instances. The storage infrastructure in Large Instance stamps is time synchronized with NTP servers.


