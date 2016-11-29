---
title: SAP HANA on Azure (Large Instances) architecture and technical deployment guide, part 3: SAP HANA installation| Microsoft Docs
description: Deploy SAP on the new SAP HANA on Azure (Large Instances) in Azure.
services: virtual-machines-linux
documentationcenter: 
author: v-derekg
manager: timlt
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 11/23/2016
ms.author: rclaus

---
# SAP HANA on Azure (Large Instances) architecture and technical deployment guide, part 3: SAP HANA installation

Installation of SAP HANA is your responsibility and you can do this immediately after handoff of a new SAP HANA on Azure (Large Instances) server. Please note, per SAP policy, installation of SAP HANA must be performed by certified SAP HANA installer—someone who has passed the Certified SAP Technology Associate – SAP HANA Installation certification exam, or by an SAP-certified system integrator (SI).

There are specific connectivity considerations related to SAP HANA (server side) and SAP HANA (client side) that need to be considered. In many cases, the SAP HANA server sends its IP address to the client where it gets cached and used for subsequent connection attempts. Since SAP HANA on Azure (Large Instances) does NAT the internal server IP address used in the tenant network to an IP address range provided for specified Azure VNets, the SAP HANA database server, by design, would send the &quot;internal&quot; IP address range. For example, for hostname resolution, instead of SAP HANA providing the NATed IP address, the cached internal IP address is used. So an application using an SAP HANA client (ODBC, JDBC, etc.) would not be able to connect with this IP address. To instruct the SAP HANA server that it should propagate the NATed IP address to the client, the SAP HANA global system configuration file (global.ini) must be edited.

Add the following to the global.ini (either directly or through SAP HANA Studio):
```
[public\_hostname\_resolution]
use\_default\_route = no
map\_<hostname of SAP HANA on Azure (Large Instances) tenant> = <NAT IP Address (IP address that can be accessed in Azure)>
```
See the section _Mapping Host Names for Database Client Access_ in the [SAP HANA Administration Guide](http://help.sap.com/hana/sap_hana_administration_guide_en.pdf) for more details and examples.

On the client side (for SAP application servers in Azure), edit the /etc/hosts file (in Linux) or /system32/drivers/etc/hosts (in Windows Server) and include an entry for the hostname of the SAP HANA on Azure (Large Instances) tenant and its respective NATed IP address.

>[!NOTE] 
>When installing the SAP HANA Database Client, if there are errors when connecting to SAP HANA on Azure (Large Instances) during the installation of the SAP HANA Database Client, use the NAT IP address of the HANA Large Instances tenant implicitly instead of the hostname.

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


