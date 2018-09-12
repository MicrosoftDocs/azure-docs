---
title: Operations model of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Operations model of SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: jeconnoc
editor: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/04/2018
ms.author: saghorpa
ms.custom: H1Hack27Feb2017

---
# Operations model and responsibilities

The service provided with SAP HANA on Azure (Large Instances) is aligned with Azure IaaS services. You get an instance of a HANA Large Instance with an installed operating system that is optimized for SAP HANA. As with Azure IaaS VMs, most of the tasks of hardening the OS, installing additional software, installing HANA, operating the OS and HANA, and updating the OS and HANA is your responsibility. Microsoft doesn't force OS updates or HANA updates on you.

![Responsibilities of SAP HANA on Azure (Large Instances)](./media/hana-overview-architecture/image2-responsibilities.png)

As shown in the diagram, SAP HANA on Azure (Large Instances) is a multi-tenant IaaS offer. For the most part, the division of responsibility is at the OS-infrastructure boundary. Microsoft is responsible for all aspects of the service below the line of the operating system. You are responsible for all aspects of the service above the line. The OS is your responsibility. You can continue to use most current on-premises methods you might employ for compliance, security, application management, basis, and OS management. The systems appear as if they are in your network in all regards.

This service is optimized for SAP HANA, so there are areas where you need to work with Microsoft to use the underlying infrastructure capabilities for best results.

The following list provides more detail on each of the layers and your responsibilities:

**Networking**: All the internal networks for the Large Instance stamp running SAP HANA. Your responsibility includes access to storage, connectivity between the instances (for scale-out and other functions), connectivity to the landscape, and connectivity to Azure where the SAP application layer is hosted in VMs. It also includes WAN connectivity between Azure Data Centers for disaster recovery purposes replication. All networks are partitioned by the tenant and have quality of service applied.

**Storage**: The virtualized partitioned storage for all volumes needed by the SAP HANA servers, as well as for snapshots. 

**Servers**: The dedicated physical servers to run the SAP HANA DBs assigned to tenants. The servers of the Type I class of SKUs are hardware abstracted. With these types of servers, the server configuration is collected and maintained in profiles, which can be moved from one physical hardware to another physical hardware. Such a (manual) move of a profile by operations can be compared a bit to Azure service healing. The servers of the Type II class SKUs don't offer such a capability.

**SDDC**: The management software that is used to manage data centers as software-defined entities. It allows Microsoft to pool resources for scale, availability, and performance reasons.

**O/S**: The OS you choose (SUSE Linux or Red Hat Linux) that is running on the servers. The OS images you are supplied with were provided by the individual Linux vendor to Microsoft for running SAP HANA. You must have a subscription with the Linux vendor for the specific SAP HANA-optimized image. You are responsible for registering the images with the OS vendor. 

From the point of handover by Microsoft, you are responsible for any further patching of the Linux operating system. This patching includes additional packages that might be necessary for a successful SAP HANA installation and that weren't included by the specific Linux vendor in their SAP HANA optimized OS images. (For more information, see SAP's HANA installation documentation and SAP Notes.) 

You are responsible for OS patching owing to malfunction or optimization of the OS and its drivers relative to the specific server hardware. You also are responsible for security or functional patching of the OS. 

Your responsibility also includes monitoring and capacity planning of:

- CPU resource consumption.
- Memory consumption.
- Disk volumes related to free space, IOPS, and latency.
- Network volume traffic between HANA Large Instance and the SAP application layer.

The underlying infrastructure of HANA Large Instance provides functionality for backup and restore of the OS volume. Using this functionality is also your responsibility.

**Middleware**: The SAP HANA Instance, primarily. Administration, operations, and monitoring are your responsibility. You can use the provided functionality to use storage snapshots for backup and restore and disaster recovery purposes. These capabilities are provided by the infrastructure. Your responsibilities also include designing high availability or disaster recovery with these capabilities, leveraging them, and monitoring to determine whether storage snapshots executed successfully.

**Data**: Your data managed by SAP HANA, and other data such as backups files located on volumes or file shares. Your responsibilities include monitoring disk free space and managing the content on the volumes. You also are responsible for monitoring the successful execution of backups of disk volumes and storage snapshots. Successful execution of data replication to disaster recovery sites is the responsibility of Microsoft.

**Applications:** The SAP application instances or, in the case of non-SAP applications, the application layer of those applications. Your responsibilities include deployment, administration, operations, and monitoring of those applications. You are responsible for capacity planning of CPU resource consumption, memory consumption, Azure Storage consumption, and network bandwidth consumption within virtual networks. You also are responsible for capacity planning for resource consumption from virtual networks to SAP HANA on Azure (Large Instances).

**WANs**: The connections you establish from on-premises to Azure deployments for workloads. All customers with HANA Large Instance use Azure ExpressRoute for connectivity. This connection isn't part of the SAP HANA on Azure (Large Instances) solution. You are responsible for the setup of this connection.

**Archive**: You might prefer to archive copies of data by using your own methods in storage accounts. Archiving requires management, compliance, costs, and operations. You are responsible for generating archive copies and backups on Azure and storing them in a compliant way.

See the [SLA for SAP HANA on Azure (Large Instances)](https://azure.microsoft.com/support/legal/sla/sap-hana-large/v1_0/).

**Next steps**
- Refer [SAP HANA (Large Instances) architecture on Azure](hana-architecture.md)