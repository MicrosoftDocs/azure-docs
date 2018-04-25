---
title: Overview and architecture of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Architectural overview of how to deploy SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: timlt
editor: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 01/02/2018
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---
# SAP HANA (Large Instances) overview and architecture on Azure

## What is SAP HANA on Azure (Large Instances)?

SAP HANA on Azure (Large Instances) is a unique solution to Azure. In addition to providing virtual machines for deploying and running SAP HANA, Azure offers you the possibility to run and deploy SAP HANA on bare-metal servers that are dedicated to you. The SAP HANA on Azure (Large Instances) solution builds on non-shared host/server bare-metal hardware that is assigned to you. The server hardware is embedded in larger stamps that contain compute/server, networking, and storage infrastructure. As a combination, it's HANA tailored data center integration (TDI) certified. SAP HANA on Azure (Large Instances) offers different server SKUs or sizes. Units can have 72 CPUs and 768 GB of memory and go up to units that have 960 CPUs and 20 TB of memory.

The customer isolation within the infrastructure stamp is performed in tenants, which looks like:

- **Networking**: Isolation of customers within infrastructure stack through virtual networks per customer assigned tenant. A tenant is assigned to a single customer. A customer can have multiple tenants. The network isolation of tenants prohibits network communication between tenants in the infrastructure stamp level, even if the tenants belong to the same customer.
- **Storage components**: Isolation through storage virtual machines that have storage volumes assigned to them. Storage volumes can be assigned to one storage virtual machine only. A storage virtual machine is assigned exclusively to one single tenant in the SAP HANA TDI certified infrastructure stack. As a result, storage volumes assigned to a storage virtual machine can be accessed in one specific and related tenant only. They aren't visible between the different deployed tenants.
- **Server or host**: A server or host unit isn't shared between customers or tenants. A server or host deployed to a customer, is an atomic bare-metal compute unit that is assigned to one single tenant. *No* hardware partitioning or soft partitioning is used that might result in you sharing a host or a server with another customer. Storage volumes that are assigned to the storage virtual machine of the specific tenant are mounted to such a server. A tenant can have one to many server units of different SKUs exclusively assigned.
- Within an SAP HANA on Azure (Large Instances) infrastructure stamp, many different tenants are deployed and isolated against each other through the tenant concepts on networking, storage, and compute level. 


These bare-metal server units are supported to run SAP HANA only. The SAP application layer or workload middle-ware layer runs in virtual machines. The infrastructure stamps that run the SAP HANA on Azure (Large Instances) units are connected to the Azure network services backbones. In this way, low-latency connectivity between SAP HANA on Azure (Large Instances) units and virtual machines is provided.

This document is one of several documents that cover SAP HANA on Azure (Large Instances). This document introduces the basic architecture, responsibilities, and services provided by the solution. High-level capabilities of the solution are also discussed. For most other areas, such as networking and connectivity, four other documents cover details and drill-down information. The documentation of SAP HANA on Azure (Large Instances) doesn't cover aspects of the SAP NetWeaver installation or deployments of SAP NetWeaver in VMs. SAP NetWeaver on Azure is covered in separate documents found in the same Azure documentation container. 


The different documents of HANA Large Instance guidance cover the following areas:

- [SAP HANA (Large Instances) overview and architecture on Azure](hana-overview-architecture.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [SAP HANA (Large Instances) infrastructure and connectivity on Azure](hana-overview-infrastructure-connectivity.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [Install and configure SAP HANA (Large Instances) on Azure](hana-installation.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [SAP HANA (Large Instances) high availability and disaster recovery on Azure](hana-overview-high-availability-disaster-recovery.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [SAP HANA (Large Instances) troubleshooting and monitoring on Azure](troubleshooting-monitoring.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [High availability set up in SUSE by using the STONITH](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/ha-setup-with-stonith)
- [OS backup and restore for Type II SKUs](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/os-backup-type-ii-skus)

## Definitions

Several common definitions are widely used in the Architecture and Technical Deployment Guide. Note the following terms and their meanings:

- **IaaS**: Infrastructure as a service.
- **PaaS**: Platform as a service.
- **SaaS**: Software as a service.
- **SAP component**: An individual SAP application, such as ERP Central Component (ECC), Business Warehouse (BW), Solution Manager, or Enterprise Portal (EP). SAP components can be based on traditional ABAP or Java technologies or a non-NetWeaver based application such as Business Objects.
- **SAP environment**: One or more SAP components logically grouped to perform a business function, such as development, quality assurance, training, disaster recovery, or production.
- **SAP landscape**: Refers to the entire SAP assets in your IT landscape. The SAP landscape includes all production and non-production environments.
- **SAP system**: The combination of DBMS layer and application layer of, for example, an SAP ERP development system, an SAP BW test system, and an SAP CRM production system. Azure deployments don't support dividing these two layers between on-premises and Azure. An SAP system is either deployed on-premises or it's deployed in Azure. You can deploy the different systems of an SAP landscape into either Azure or on-premises. For example, you can deploy the SAP CRM development and test systems in Azure while you deploy the SAP CRM production system on-premises. For SAP HANA on Azure (Large Instances), it's intended that you host the SAP application layer of SAP systems in VMs and the related SAP HANA instance on a unit in the SAP HANA on Azure (Large Instances) stamp.
- **Large Instance stamp**: A hardware infrastructure stack that is SAP HANA TDI-certified and dedicated to run SAP HANA instances within Azure.
- **SAP HANA on Azure (Large Instances):** Official name for the offer in Azure to run HANA instances in on SAP HANA TDI-certified hardware that's deployed in Large Instance stamps in different Azure regions. The related term *HANA Large Instance* is short for *SAP HANA on Azure (Large Instances)* and is widely used in this technical deployment guide.
- **Cross-premises**: Describes a scenario where VMs are deployed to an Azure subscription that has site-to-site, multi-site, or Azure ExpressRoute connectivity between on-premises data centers and Azure. In common Azure documentation, these kinds of deployments are also described as cross-premises scenarios. The reason for the connection is to extend on-premises domains, on-premises Azure Active Directory/OpenLDAP, and on-premises DNS into Azure. The on-premises landscape is extended to the Azure assets of the Azure subscriptions. With this extension, the VMs can be part of the on-premises domain. 

   Domain users of the on-premises domain can access the servers and run services on those VMs (such as DBMS services). Communication and name resolution between VMs deployed on-premises and Azure-deployed VMs is possible. This scenario is typical of the way in which most SAP assets are deployed. For more information, see [Plan and design for Azure VPN Gateway](../../../vpn-gateway/vpn-gateway-plan-design.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) and [Create a virtual network with a site-to-site connection by using the Azure portal](../../../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
- **Tenant**: A customer deployed in HANA Large Instance stamp gets isolated into a *tenant.* A tenant is isolated in the networking, storage, and compute layer from other tenants. Storage and compute units assigned to the different tenants can't see each other or communicate with each other on the HANA Large Instance stamp level. A customer can choose to have deployments into different tenants. Even then, there is no communication between tenants on the HANA Large Instance stamp level.
- **SKU category**: For HANA Large Instance, the following two categories of SKUs are offered:
    - **Type I class**: S72, S72m, S144, S144m, S192, and S192m
    - **Type II class**: S384, S384m, S384xm, S576, S768, and S960


A variety of additional resources are available on how to deploy an SAP workload in the cloud. If you plan to execute a deployment of SAP HANA in Azure, you need to be experienced with and aware of the principles of Azure IaaS and the deployment of SAP workloads on Azure IaaS. Before you continue, see [Use SAP solutions on Azure virtual machines](get-started.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for more information. 

## Certification

Besides the NetWeaver certification, SAP requires a special certification for SAP HANA to support SAP HANA on certain infrastructures, such as Azure IaaS.

The core SAP Note on NetWeaver, and to a degree SAP HANA certification, is [SAP Note #1928533 – SAP applications on Azure: Supported products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533).

The [SAP Note #2316233 - SAP HANA on Microsoft Azure (Large Instances)](https://launchpad.support.sap.com/#/notes/2316233/E) is also significant. It covers the solution described in this guide. Additionally, you are supported to run SAP HANA in the GS5 VM type of Azure. Information for this case is published on [the SAP website](http://global.sap.com/community/ebook/2014-09-02-hana-hardware/enEN/iaas.html).

The SAP HANA on Azure (Large Instances) solution referred to in SAP Note #2316233 provides Microsoft and SAP customers the ability to deploy large SAP Business Suite, SAP BW, S/4 HANA, BW/4HANA, or other SAP HANA workloads in Azure. The solution is based on the SAP-HANA certified dedicated hardware stamp ([SAP HANA tailored data center integration – TDI](https://scn.sap.com/docs/DOC-63140)). If you run an SAP HANA TDI-configured solution, all SAP HANA-based applications (such as SAP Business Suite on SAP HANA, SAP BW on SAP HANA, S4/HANA, and BW4/HANA) works on the hardware infrastructure.

Compared to running SAP HANA in VMs, this solution has a benefit. It provides for much larger memory volumes. To enable this solution, you need to understand the following key aspects:

- The SAP application layer and non-SAP applications run in VMs that are hosted in the usual Azure hardware stamps.
- Customer on-premises infrastructure, data centers, and application deployments are connected to the cloud platform through ExpressRoute (recommended) or a virtual private network (VPN). Active Directory and DNS also are extended into Azure.
- The SAP HANA database instance for HANA workload runs on SAP HANA on Azure (Large Instances). The Large Instance stamp is connected into Azure networking, so software running in VMs can interact with the HANA instance running in HANA Large Instance.
- Hardware of SAP HANA on Azure (Large Instances) is dedicated hardware provided in an IaaS with SUSE Linux Enterprise Server or Red Hat Enterprise Linux preinstalled. As with virtual machines, further updates and maintenance to the operating system is your responsibility.
- Installation of HANA or any additional components necessary to run SAP HANA on units of HANA Large Instance is your responsibility. All respective ongoing operations and administration of SAP HANA on Azure are also your responsibility.
- In addition to the solutions described here, you can install other components in your Azure subscription that connects to SAP HANA on Azure (Large Instances). Examples are components that enable communication with or directly to the SAP HANA database, such as jump servers, RDP servers, SAP HANA Studio, SAP Data Services for SAP BI scenarios, or network monitoring solutions.
- As in Azure, HANA Large Instance offers support for high availability and disaster recovery functionality.

## Architecture

At a high level, the SAP HANA on Azure (Large Instances) solution has the SAP application layer residing in VMs. The database layer resides on SAP TDI-configured hardware located in a Large Instance stamp in the same Azure region that is connected to Azure IaaS.

> [!NOTE]
> Deploy the SAP application layer in the same Azure region as the SAP DBMS layer. This rule is well documented in published information about SAP workloads on Azure. 

The overall architecture of SAP HANA on Azure (Large Instances) provides an SAP TDI-certified hardware configuration, which is a non-virtualized, bare metal, high-performance server for the SAP HANA database. It also provides the ability and flexibility of Azure to scale resources for the SAP application layer to meet your needs.

![Architectural overview of SAP HANA on Azure (Large Instances)](./media/hana-overview-architecture/image1-architecture.png)

The architecture shown is divided into three sections:

- **Right**: Shows an on-premises infrastructure that runs different applications in data centers so that end users can access LOB applications, such as SAP. Ideally, this on-premises infrastructure is then connected to Azure with [ExpressRoute](https://azure.microsoft.com/services/expressroute/).

- **Center**: Shows Azure IaaS and, in this case, use of VMs to host SAP or other applications that use SAP HANA as a DBMS system. Smaller HANA instances that function with the memory that VMs provide are deployed in VMs together with their application layer. For more information about virtual machines, see [Virtual machines](https://azure.microsoft.com/services/virtual-machines/).

   Azure network services are used to group SAP systems together with other applications into virtual networks. These virtual networks connect to on-premises systems as well as to SAP HANA on Azure (Large Instances).

   For SAP NetWeaver applications and databases that are supported to run in Azure, see [SAP Support Note #1928533 – SAP applications on Azure: Supported products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533). For documentation on how to deploy SAP solutions on Azure, see:

  -  [Use SAP on Windows virtual machines](../../virtual-machines-windows-sap-get-started.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
  -  [Use SAP solutions on Azure virtual machines](get-started.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

- **Left**: Shows the SAP HANA TDI-certified hardware in the Azure Large Instance stamp. The HANA Large Instance units are connected to the virtual networks of your subscription by using the same technology as the connectivity from on-premises into Azure.

The Azure Large Instance stamp itself combines the following components:

- **Computing**: Servers that are based on Intel Xeon E7-8890v3 or Intel Xeon E7-8890v4 processors that provide the necessary computing capability and are SAP HANA certified.
- **Network**: A unified high-speed network fabric that interconnects the computing, storage, and LAN components.
- **Storage**: A storage infrastructure that is accessed through a unified network fabric. The specific storage capacity that is provided depends on the specific SAP HANA on Azure (Large Instances) configuration that is deployed. More storage capacity is available at an additional monthly cost.

Within the multi-tenant infrastructure of the Large Instance stamp, customers are deployed as isolated tenants. At deployment of the tenant, you name an Azure subscription within your Azure enrollment. This Azure subscription is the one that the HANA Large Instance is billed against. These tenants have a 1:1 relationship to the Azure subscription. For a network, it's possible to access a HANA Large Instance unit deployed in one tenant in one Azure region from different virtual networks that belong to different Azure subscriptions. Those Azure subscriptions must belong to the same Azure enrollment. 

As with VMs, SAP HANA on Azure (Large Instances) is offered in multiple Azure regions. To offer disaster recovery capabilities, you can choose to opt in. Different Large Instance stamps within one geo-political region are connected to each other. For example, HANA Large Instance Stamps in US West and US East are connected through a dedicated network link for disaster recovery replication. 

Just as you can choose between different VM types with Azure Virtual Machines, you can choose from different SKUs of HANA Large Instance that are tailored for different workload types of SAP HANA. SAP applies memory-to-processor-socket ratios for varying workloads based on the Intel processor generations. The following table shows the SKU types offered.

As of July 2017, SAP HANA on Azure (Large Instances) is available in several configurations in the Azure regions of US West and US East, Australia East, Australia Southeast, West Europe, and North Europe.

| SAP solution | CPU | Memory | Storage | Availability |
| --- | --- | --- | --- | --- |
| Optimized for OLAP: SAP BW, BW/4HANA<br /> or SAP HANA for generic OLAP workload | SAP HANA on Azure S72<br /> – 2 x Intel® Xeon® Processor E7-8890 v3<br /> 36 CPU cores and 72 CPU threads |  768 GB |  3 TB | Available |
| --- | SAP HANA on Azure S144<br /> – 4 x Intel® Xeon® Processor E7-8890 v3<br /> 72 CPU cores and 144 CPU threads |  1.5 TB |  6 TB | Not offered anymore |
| --- | SAP HANA on Azure S192<br /> – 4 x Intel® Xeon® Processor E7-8890 v4<br /> 96 CPU cores and 192 CPU threads |  2.0 TB |  8 TB | Available |
| --- | SAP HANA on Azure S384<br /> – 8 x Intel® Xeon® Processor E7-8890 v4<br /> 192 CPU cores and 384 CPU threads |  4.0 TB |  16 TB | Available |
| Optimized for OLTP: SAP Business Suite<br /> on SAP HANA or S/4HANA (OLTP),<br /> generic OLTP | SAP HANA on Azure S72m<br /> – 2 x Intel® Xeon® Processor E7-8890 v3<br /> 36 CPU cores and 72 CPU threads |  1.5 TB |  6 TB | Available |
|---| SAP HANA on Azure S144m<br /> – 4 x Intel® Xeon® Processor E7-8890 v3<br /> 72 CPU cores and 144 CPU threads |  3.0 TB |  12 TB | Not offered anymore |
|---| SAP HANA on Azure S192m<br /> – 4 x Intel® Xeon® Processor E7-8890 v4<br /> 96 CPU cores and 192 CPU threads  |  4.0 TB |  16 TB | Available |
|---| SAP HANA on Azure S384m<br /> – 8 x Intel® Xeon® Processor E7-8890 v4<br /> 192 CPU cores and 384 CPU threads |  6.0 TB |  18 TB | Available |
|---| SAP HANA on Azure S384xm<br /> – 8 x Intel® Xeon® Processor E7-8890 v4<br /> 192 CPU cores and 384 CPU threads |  8.0 TB |  22 TB |  Available |
|---| SAP HANA on Azure S576<br /> – 12 x Intel® Xeon® Processor E7-8890 v4<br /> 288 CPU cores and 576 CPU threads |  12.0 TB |  28 TB | Available |
|---| SAP HANA on Azure S768<br /> – 16 x Intel® Xeon® Processor E7-8890 v4<br /> 384 CPU cores and 768 CPU threads |  16.0 TB |  36 TB | Available |
|---| SAP HANA on Azure S960<br /> – 20 x Intel® Xeon® Processor E7-8890 v4<br /> 480 CPU cores and 960 CPU threads |  20.0 TB |  46 TB | Available |

- CPU cores = sum of non-hyper-threaded CPU cores of the sum of the processors of the server unit.
- CPU threads = sum of compute threads provided by hyper-threaded CPU cores of the sum of the processors of the server unit. All units are configured by default to use Hyper-Threading Technology.


The specific configurations chosen are dependent on workload, CPU resources, and desired memory. It's possible for the OLTP workload to use the SKUs that are optimized for the OLAP workload. 

The hardware base for all the offers are SAP HANA TDI-certified. Two different classes of hardware divide the SKUs into:

- S72, S72m, S144, S144m, S192, and S192m, which are referred to as the "Type I class" of SKUs.
- S384, S384m, S384xm, S576, S768, and S960, which are referred to as the "Type II class" of SKUs.

A complete HANA Large Instance stamp isn't exclusively allocated for a single customer&#39;s use. This fact applies to the racks of compute and storage resources connected through a network fabric deployed in Azure as well. HANA Large Instance infrastructure, like Azure, deploys different customer &quot;tenants&quot; that are isolated from one another in the following three levels:

- **Network**: Isolation through virtual networks within the HANA Large Instance stamp.
- **Storage**: Isolation through storage virtual machines that have storage volumes assigned and isolate storage volumes between tenants.
- **Compute**: Dedicated assignment of server units to a single tenant. No hard or soft partitioning of server units. No sharing of a single server or host unit between tenants. 

The deployments of HANA Large Instance units between different tenants aren't visible to each other. HANA Large Instance units deployed in different tenants can't communicate directly with each other on the HANA Large Instance stamp level. Only HANA Large Instance units within one tenant can communicate with each other on the HANA Large Instance stamp level.

A deployed tenant in the Large Instance stamp is assigned to one Azure subscription for billing purposes. For a network, it can be accessed from virtual networks of other Azure subscriptions within the same Azure enrollment. If you deploy with another Azure subscription in the same Azure region, you also can choose to ask for a separated HANA Large Instance tenant.

There are significant differences between running SAP HANA on HANA Large Instance and SAP HANA running on VMs deployed in Azure:

- There is no virtualization layer for SAP HANA on Azure (Large Instances). You get the performance of the underlying bare-metal hardware.
- Unlike Azure, the SAP HANA on Azure (Large Instances) server is dedicated to a specific customer. There is no possibility that a server unit or host is hard or soft partitioned. As a result, a HANA Large Instance unit is used as assigned as a whole to a tenant and with that to you. A reboot or shutdown of the server doesn't lead automatically to the operating system and SAP HANA being deployed on another server. (For Type I class SKUs, the only exception is if a server encounters issues and redeployment needs to be performed on another server.)
- Unlike Azure, where host processor types are selected for the best price/performance ratio, the processor types chosen for SAP HANA on Azure (Large Instances) are the highest performing of the Intel E7v3 and E7v4 processor line.


### Run multiple SAP HANA instances on one HANA Large Instance unit
It's possible to host more than one active SAP HANA instance on HANA Large Instance units. To provide the capabilities of storage snapshots and disaster recovery, such a configuration requires a volume set per instance. Currently, HANA Large Instance units can be subdivided as follows:

- **S72, S72m, S144, S192**: In increments of 256 GB, with 256 GB the smallest starting unit. Different increments such as 256 GB and 512 GB can be combined to the maximum of the memory of the unit.
- **S144m and S192m**: In increments of 256 GB, with 512 GB the smallest unit. Different increments such as 512 GB and 768 GB can be combined to the maximum of the memory of the unit.
- **Type II class**: In increments of 512 GB, with the smallest starting unit of 2 TB. Different increments such as 512 GB, 1 TB, and 1.5 TB can be combined to the maximum of the memory of the unit.

Some examples of running multiple SAP HANA instances might look like the following.

| SKU | Memory size | Storage size | Sizes with multiple databases |
| --- | --- | --- | --- |
| S72 | 768 GB | 3 TB | 1x768 GB HANA instance<br /> or 1x512 GB instance + 1x256 GB instance<br /> or 3x256 GB instances | 
| S72m | 1.5 TB | 6 TB | 3x512GB HANA instances<br />or 1x512 GB instance + 1x1 TB instance<br />or 6x256 GB instances<br />or 1x1.5 TB instance | 
| S192m | 4 TB | 16 TB | 8x512 GB instances<br />or 4x1 TB instances<br />or 4x512 GB instances + 2x1 TB instances<br />or 4x768 GB instances + 2x512 GB instances<br />or 1x4 TB instance |
| S384xm | 8 TB | 22 TB | 4x2 TB instances<br />or 2x4 TB instances<br />or 2x3 TB instances + 1x2 TB instances<br />or 2x2.5 TB instances + 1x3 TB instances<br />or 1x8 TB instance |


There are other variations as well. 

### Use SAP HANA data tiering and extension nodes
SAP supports a data tiering model for SAP BW of different SAP NetWeaver releases and SAP BW/4HANA. For more information about the data tiering model, see the SAP document
[SAP BW/4HANA and SAP BW on HANA with SAP HANA extension nodes](https://www.sap.com/documents/2017/05/ac051285-bc7c-0010-82c7-eda71af511fa.html#).
With HANA Large Instance, you can use option-1 configuration of SAP HANA extension nodes as explained in the FAQ and SAP blog documents. Option-2 configurations can be set up with the following HANA Large Instance SKUs: S72m, S192, S192m, S384, and S384m. 

When you look at the documentation, the advantage might not be visible immediately. But when you look at the SAP sizing guidelines, you can see an advantage by using option-1 and option-2 SAP HANA extension nodes. Here are examples:

- SAP HANA sizing guidelines usually require double the amount of data volume as memory. When you run your SAP HANA instance with the hot data, you have only 50 percent or less of the memory filled with data. The remainder of the memory is ideally held for SAP HANA doing its work.
- That means in a HANA Large Instance S192 unit with 2 TB of memory, running an SAP BW database, you only have 1 TB as data volume.
- If you use an additional SAP HANA extension node of option-1, also a S192 HANA Large Instance SKU, it gives you an additional 2-TB capacity for data volume. In the option-2 configuration, you get an additional 4 TB for warm data volume. Compared to the hot node, the full memory capacity of the "warm" extension node can be used for data storing for option-1. Double the memory can be used for data volume in option-2 SAP HANA extension node configuration.
- You end up with a capacity of 3 TB for your data and a hot-to-warm ratio of 1:2 for option-1. You have 5 TB of data and a 1:4 ratio with the option-2 extension node configuration.

The higher the data volume compared to the memory, the higher the chances are that the warm data you are asking for is stored on disk storage.


## Operations model and responsibilities

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

## Sizing

Sizing for HANA Large Instance is no different than sizing for HANA in general. For existing and deployed systems that you want to move from other RDBMS to HANA, SAP provides a number of reports that run on your existing SAP systems. If the database is moved to HANA, these reports check the data and calculate memory requirements for the HANA instance. For more information on how to run these reports and obtain their most recent patches or versions, read the following SAP Notes:

- [SAP Note #1793345 - Sizing for SAP Suite on HANA](https://launchpad.support.sap.com/#/notes/1793345)
- [SAP Note #1872170 - Suite on HANA and S/4 HANA sizing report](https://launchpad.support.sap.com/#/notes/1872170)
- [SAP Note #2121330 - FAQ: SAP BW on HANA sizing report](https://launchpad.support.sap.com/#/notes/2121330)
- [SAP Note #1736976 - Sizing report for BW on HANA](https://launchpad.support.sap.com/#/notes/1736976)
- [SAP Note #2296290 - New sizing report for BW on HANA](https://launchpad.support.sap.com/#/notes/2296290)

For green field implementations, SAP Quick Sizer is available to calculate memory requirements of the implementation of SAP software on top of HANA.

Memory requirements for HANA increase as data volume grows. Be aware of your current memory consumption to help you predict what it's going to be in the future. Based on memory requirements, you then can map your demand into one of the HANA Large Instance SKUs.

## Requirements

This list assembles requirements for running SAP HANA on Azure (Larger Instances).

**Microsoft Azure**

- An Azure subscription that can be linked to SAP HANA on Azure (Large Instances).
- Microsoft Premier support contract. For specific information related to running SAP in Azure, see [SAP Support Note #2015553 – SAP on Microsoft Azure: Support prerequisites](https://launchpad.support.sap.com/#/notes/2015553). If you use HANA Large Instance units with 384 and more CPUs, you also need to extend the Premier support contract to include Azure Rapid Response.
- Awareness of the HANA Large Instance SKUs you need after you perform a sizing exercise with SAP.

**Network connectivity**

- ExpressRoute between on-premises to Azure: To connect your on-premises data center to Azure, make sure to order at least a 1-Gbps connection from your ISP. 

**Operating system**

- Licenses for SUSE Linux Enterprise Server 12 for SAP Applications.

   > [!NOTE] 
   > The operating system delivered by Microsoft isn't registered with SUSE. It isn't connected to a Subscription Management Tool instance.

- SUSE Linux Subscription Management Tool deployed in Azure on a VM. This tool provides the capability for SAP HANA on Azure (Large Instances) to be registered and respectively updated by SUSE. (There is no internet access within the HANA Large Instance data center.) 
- Licenses for Red Hat Enterprise Linux 6.7 or 7.2 for SAP HANA.

   > [!NOTE]
   > The operating system delivered by Microsoft isn't registered with Red Hat. It isn't connected to a Red Hat Subscription Manager instance.

- Red Hat Subscription Manager deployed in Azure on a VM. The Red Hat Subscription Manager provides the capability for SAP HANA on Azure (Large Instances) to be registered and respectively updated by Red Hat. (There is no direct internet access from within the tenant deployed on the Azure Large Instance stamp.)
- SAP requires you to have a support contract with your Linux provider as well. This requirement isn't removed by the solution of HANA Large Instance or the fact that you run Linux in Azure. Unlike with some of the Linux Azure gallery images, the service fee is *not* included in the solution offer of HANA Large Instance. It's your responsibility to fulfill the requirements of SAP regarding support contracts with the Linux distributor. 
   - For SUSE Linux, look up the requirements of support contracts in [SAP Note #1984787 - SUSE Linux Enterprise Server 12: Installation notes](https://launchpad.support.sap.com/#/notes/1984787) and [SAP Note #1056161 - SUSE priority support for SAP applications](https://launchpad.support.sap.com/#/notes/1056161).
   - For Red Hat Linux, you need to have the correct subscription levels that include support and service updates to the operating systems of HANA Large Instance. Red Hat recommends the Red Hat Enterprise Linux for [SAP Solutions](https://access.redhat.com/solutions/3082481 subscription. 

For the support matrix of the different SAP HANA versions with the different Linux versions, see [SAP Note #2235581](https://launchpad.support.sap.com/#/notes/2235581).


**Database**

- Licenses and software installation components for SAP HANA (platform or enterprise edition).

**Applications**

- Licenses and software installation components for any SAP applications that connect to SAP HANA and related SAP support contracts.
- Licenses and software installation components for any non-SAP applications used in relation to SAP HANA on Azure (Large Instances) environments and related support contracts.

**Skills**

- Experience with and knowledge of Azure IaaS and its components.
- Experience with and knowledge of how to deploy an SAP workload in Azure.
- SAP HANA installation certified personnel.
- SAP architect skills to design high availability and disaster recovery around SAP HANA.

**SAP**

- Expectation is that you're an SAP customer and have a support contract with SAP.
- Especially for implementations of the Type II class of HANA Large Instance SKUs, consult with SAP on versions of SAP HANA and the eventual configurations on large-sized scale-up hardware.


## Storage

The storage layout for SAP HANA on Azure (Large Instances) is configured by SAP HANA on the classic deployment model through SAP recommended guidelines. The guidelines are documented in the [SAP HANA storage requirements](http://go.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html) white paper.

The HANA Large Instance of the Type I class comes with four times the memory volume as storage volume. For the Type II class of HANA Large Instance units, the storage isn't four times more. The units come with a volume that is intended for storing HANA transaction log backups. For more information, see [Install and configure SAP HANA (Large Instances) on Azure](hana-installation.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

See the following table in terms of storage allocation. The table lists the rough capacity for the different volumes provided with the different HANA Large Instance units.

| HANA Large Instance SKU | hana/data | hana/log | hana/shared | hana/log/backup |
| --- | --- | --- | --- | --- |
| S72 | 1,280 GB | 512 GB | 768 GB | 512 GB |
| S72m | 3,328 GB | 768 GB |1,280 GB | 768 GB |
| S192 | 4,608 GB | 1,024 GB | 1,536 GB | 1,024 GB |
| S192m | 11,520 GB | 1,536 GB | 1,792 GB | 1,536 GB |
| S384 | 11,520 GB | 1,536 GB | 1,792 GB | 1,536 GB |
| S384m | 12,000 GB | 2,050 GB | 2,050 GB | 2,040 GB |
| S384xm | 16,000 GB | 2,050 GB | 2,050 GB | 2,040 GB |
| S576 | 20,000 GB | 3,100 GB | 2,050 GB | 3,100 GB |
| S768 | 28,000 GB | 3,100 GB | 2,050 GB | 3,100 GB |
| S960 | 36,000 GB | 4,100 GB | 2,050 GB | 4,100 GB |


Actual deployed volumes might vary based on deployment and the tool that is used to show the volume sizes.

If you subdivide a HANA Large Instance SKU, a few examples of possible division pieces might look like:

| Memory partition in GB | hana/data | hana/log | hana/shared | hana/log/backup |
| --- | --- | --- | --- | --- |
| 256 | 400 GB | 160 GB | 304 GB | 160 GB |
| 512 | 768 GB | 384 GB | 512 GB | 384 GB |
| 768 | 1,280 GB | 512 GB | 768 GB | 512 GB |
| 1,024 | 1,792 GB | 640 GB | 1,024 GB | 640 GB |
| 1,536 | 3,328 GB | 768 GB | 1,280 GB | 768 GB |


These sizes are rough volume numbers that can vary slightly based on deployment and the tools used to look at the volumes. There also are other partition sizes, such as 2.5 TB. These storage sizes are calculated with a formula similar to the one used for the previous partitions. The term "partitions" doesn't mean that the operating system, memory, or CPU resources are in any way partitioned. It indicates storage partitions for the different HANA instances you might want to deploy on one single HANA Large Instance unit. 

You might need more storage. You can add storage by purchasing additional storage in 1-TB units. This additional storage can be added as additional volume. It also can be used to extend one or more of the existing volumes. It isn't possible to decrease the sizes of the volumes as originally deployed and mostly documented by the previous tables. It also isn't possible to change the names of the volumes or mount names. The storage volumes previously described are attached to the HANA Large Instance units as NFS4 volumes.

You can use storage snapshots for backup and restore and disaster recovery purposes. For more information, see [SAP HANA (Large Instances) high availability and disaster recovery on Azure](hana-overview-high-availability-disaster-recovery.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

### Encryption of data at rest
The storage used for HANA Large Instance allows a transparent encryption of the data as it's stored on the disks. When a HANA Large Instance unit is deployed, you can enable this kind of encryption. You also can change to encrypted volumes after the deployment takes place. The move from non-encrypted to encrypted volumes is transparent and doesn't require downtime. 

With the Type I class of SKUs, the volume the boot LUN is stored on is encrypted. For the Type II class of SKUs of HANA Large Instance, you need to encrypt the boot LUN with OS methods. For more information, contact the Microsoft Service Management team.


## Networking

The architecture of Azure network services is a key component of the successful deployment of SAP applications on HANA Large Instance. Typically, SAP HANA on Azure (Large Instances) deployments have a larger SAP landscape with several different SAP solutions with varying sizes of databases, CPU resource consumption, and memory utilization. It's likely that not all those SAP systems are based on SAP HANA. Your SAP landscape is probably a hybrid that uses:

- Deployed SAP systems on-premises. Due to their sizes, these systems currently can't be hosted in Azure. An example is a production SAP ERP system that runs on SQL Server (as the database) and requires more CPU or memory resources than VMs can provide.
- Deployed SAP HANA-based SAP systems on-premises.
- Deployed SAP systems in VMs. These systems can be development, testing, sandbox, or production instances for any of the SAP NetWeaver-based applications that can successfully deploy in Azure (on VMs), based on resource consumption and memory demand. These systems also can be based on databases such as SQL Server. For more information, see [SAP Support Note #1928533 – SAP applications on Azure: Supported products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533/E). And these systems can be based on databases such as SAP HANA. For more information, see [SAP HANA certified IaaS platforms](http://global.sap.com/community/ebook/2014-09-02-hana-hardware/enEN/iaas.html).
- Deployed SAP application servers in Azure (on VMs) that leverage SAP HANA on Azure (Large Instances) in Azure Large Instance stamps.

A hybrid SAP landscape with four or more different deployment scenarios is typical. There also are many customer cases of complete SAP landscapes that run in Azure. As VMs become more powerful, the number of customers that move all their SAP solutions on Azure increases.

Azure networking in the context of SAP systems deployed in Azure isn't complicated. It's based on the following principles:

- Azure virtual networks must be connected to the ExpressRoute circuit that connects to an on-premises network.
- An ExpressRoute circuit that connects on-premises to Azure usually should have a bandwidth of 1 Gbps or higher. This minimal bandwidth allows adequate bandwidth for the transfer of data between on-premises systems and systems that run on VMs. It also allows adequate bandwidth for connection to Azure systems from on-premises users.
- All SAP systems in Azure must be set up in virtual networks to communicate with each other.
- Active Directory and DNS hosted on-premises are extended into Azure through ExpressRoute from on-premises.


> [!NOTE] 
> From a billing point of view, only one Azure subscription can be linked to only one tenant in a Large Instance stamp in a specific Azure region. Conversely, a single Large Instance stamp tenant can be linked to only one Azure subscription. This requirement is consistent with other billable objects in Azure.

If SAP HANA on Azure (Large Instances) is deployed in multiple different Azure regions, a separate tenant is deployed in the Large Instance stamp. You can run both under the same Azure subscription as long as these instances are part of the same SAP landscape. 

> [!IMPORTANT] 
> Only the Azure Resource Manager deployment is supported with SAP HANA on Azure (Large Instances).

 

### Additional virtual network information

To connect a virtual network to ExpressRoute, an Azure gateway must be created. For more information, see [About virtual network gateways for ExpressRoute](../../../expressroute/expressroute-about-virtual-network-gateways.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)). 

An Azure gateway can be used with ExpressRoute to an infrastructure outside of Azure or to an Azure Large Instance stamp. An Azure gateway also can be used to connect between virtual networks. For more information, see [Configure a network-to-network connection for Resource Manager by using PowerShell](../../../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). You can connect the Azure gateway to a maximum of four different ExpressRoute connections as long as those connections come from different Microsoft enterprise edge routers. For more information, see [SAP HANA (Large Instances) infrastructure and connectivity on Azure](hana-overview-infrastructure-connectivity.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). 

> [!NOTE] 
> The throughput an Azure gateway provides is different for both use cases. For more information, see [About VPN Gateway](../../../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). The maximum throughput you can achieve with a virtual network gateway is 10 Gbps by using an ExpressRoute connection. Copying files between a VM that resides in a virtual network and a system on-premises (as a single copy stream) doesn't achieve the full throughput of the different gateway SKUs. To leverage the complete bandwidth of the virtual network gateway, use multiple streams. Or you must copy different files in parallel streams of a single file.


### Networking architecture for HANA Large Instance
The networking architecture for HANA Large Instance can be separated into four different parts:

- On-premises networking and ExpressRoute connection to Azure. This part is the customer's domain and is connected to Azure through ExpressRoute. See the lower right in the following figure.
- Azure network services, as previously discussed, with virtual networks, which again have gateways. This part is an area where you need to find the appropriate designs for your application requirements, security, and compliance requirements. Whether you use HANA Large Instance is another point to consider in terms of the number of virtual networks and Azure gateway SKUs to choose from. See the upper right in the figure.
- Connectivity of HANA Large Instance through ExpressRoute technology into Azure. This part is deployed and handled by Microsoft. All you need to do is provide some IP address ranges after the deployment of your assets in HANA Large Instance connect the ExpressRoute circuit to the virtual networks. For more information, see [SAP HANA (Large Instances) infrastructure and connectivity on Azure](hana-overview-infrastructure-connectivity.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). 
- Networking in HANA Large Instance, which is mostly transparent for you.

![Virtual network connected to SAP HANA on Azure (Large Instances) and on-premises](./media/hana-overview-architecture/image3-on-premises-infrastructure.png)

The requirement that your on-premises assets must connect through ExpressRoute to Azure doesn't change because you use HANA Large Instance. The requirement to have one or multiple virtual networks that run the VMs, which host the application layer that connects to the HANA instances hosted in HANA Large Instance units, also doesn't change. 

The differences to SAP deployments in Azure are:

- The HANA Large Instance units of your customer tenant are connected through another ExpressRoute circuit into your virtual networks. To separate load conditions, the on-premises to virtual networks ExpressRoute links and the links between virtual networks and HANA Large Instance don't share the same routers.
- The workload profile between the SAP application layer and the HANA Large Instance is of a different nature, with many small requests and bursts like data transfers (result sets) from SAP HANA into the application layer.
- The SAP application architecture is more sensitive to network latency than typical scenarios where data is exchanged between on-premises and Azure.
- The virtual network gateway has at least two ExpressRoute connections. Both connections share the maximum bandwidth for incoming data of the virtual network gateway.

The network latency experienced between VMs and HANA Large Instance units can be higher than a typical VM-to-VM network round-trip latency. Dependent on the Azure region, the values measured can exceed the 0.7-ms round-trip latency classified as below average in [SAP Note #1100926 - FAQ: Network performance](https://launchpad.support.sap.com/#/notes/1100926/E). Nevertheless, customers deploy SAP HANA-based production SAP applications successfully on SAP HANA Large Instance. The customers who deployed report great improvements by running their SAP applications on SAP HANA by using HANA Large Instance units. Make sure you test your business processes thoroughly in Azure HANA Large Instance.
 
To provide deterministic network latency between VMs and HANA Large Instance, the choice of the virtual network gateway SKU is essential. Unlike the traffic patterns between on-premises and VMs, the traffic pattern between VMs and HANA Large Instance can develop small but high bursts of requests and data volumes to be transmitted. To handle such bursts well, we highly recommend the use of the UltraPerformance gateway SKU. For the Type II class of HANA Large Instance SKUs, the use of the UltraPerformance gateway SKU as a virtual network gateway is mandatory.

> [!IMPORTANT] 
> Given the overall network traffic between the SAP application and database layers, only the HighPerformance or UltraPerformance gateway SKUs for virtual networks are supported for connecting to SAP HANA on Azure (Large Instances). For HANA Large Instance Type II SKUs, only the UltraPerformance gateway SKU is supported as a virtual network gateway.



### Single SAP system

The on-premises infrastructure previously shown is connected through ExpressRoute into Azure. The ExpressRoute circuit connects into an enterprise edge router. For more information, see [ExpressRoute technical overview](../../../expressroute/expressroute-introduction.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). After the route is established, it connects into the Azure backbone, and all Azure regions are accessible.

> [!NOTE] 
> To run SAP landscapes in Azure, connect to the enterprise edge router closest to the Azure region in the SAP landscape. Azure Large Instance stamps are connected through dedicated enterprise edge router devices to minimize network latency between VMs in Azure IaaS and Large Instance stamps.

The virtual network gateway for the VMs that host SAP application instances is connected to the ExpressRoute circuit. The same virtual network is connected to a separate enterprise edge router dedicated to connecting to Large Instance stamps.

This system is a straightforward example of a single SAP system. The SAP application layer is hosted in Azure. The SAP HANA database runs on SAP HANA on Azure (Large Instances). The assumption is that the virtual network gateway bandwidth of 2-Gbps or 10-Gbps throughput doesn't represent a bottleneck.

### Multiple SAP systems or large SAP systems

If multiple SAP systems or large SAP systems are deployed to connect to SAP HANA on Azure (Large Instances), the throughput of the virtual network gateway might become a bottleneck. In such a case, split the application layers into multiple virtual networks. You also might create a special virtual network that connects to HANA Large Instance for cases such as:

- Performing backups directly from the HANA instances in HANA Large Instance to a VM in Azure that hosts NFS shares.
- Copying large backups or other files from HANA Large Instance units to disk space managed in Azure.

Use a separate virtual network to host VMs that manage storage. This arrangement avoids the effects of large file or data transfer from HANA Large Instance to Azure on the virtual network gateway that serves the VMs that run the SAP application layer. 

For a more scalable network architecture:

- Leverage multiple virtual networks for a single, larger SAP application layer.
- Deploy one separate virtual network for each SAP system deployed, compared to combining these SAP systems in separate subnets under the same virtual network.

 A more scalable networking architecture for SAP HANA on Azure (Large Instances):

![Deploy SAP application layer over multiple virtual networks](./media/hana-overview-architecture/image4-networking-architecture.png)

The figure shows the SAP application layer, or components, deployed over multiple virtual networks. This configuration introduced unavoidable latency overhead that occurred during communication between the applications hosted in those virtual networks. By default, the network traffic between VMs located in different virtual networks route through the enterprise edge routers in this configuration. Since September 2016, this routing can be optimized. 

The way to optimize and cut down the latency in communication between two virtual networks is by peering virtual networks within the same region. This method works even if those virtual networks are in different subscriptions. With virtual network peering, the communication between VMs in two different virtual networks can use the Azure network backbone to directly communicate with each other. Latency shows as if the VMs are in the same virtual network. Traffic that addresses IP address ranges that are connected through the Azure virtual network gateway is routed through the individual virtual network gateway of the virtual network. 

For more information about virtual network peering, see [Virtual network peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview).


### Routing in Azure

Three network routing considerations are important for SAP HANA on Azure (Large Instances):

* SAP HANA on Azure (Large Instances) can be accessed only through VMs and the dedicated ExpressRoute connection, not directly from on-premises. Direct access from on-premises to the HANA Large Instance units, as delivered by Microsoft to you, isn't possible immediately. The transitive routing restrictions are due to the current Azure network architecture used for SAP HANA Large Instance. Some administration clients and any applications that need direct access, such as SAP Solution Manager running on-premises, can't connect to the SAP HANA database.

* If you have HANA Large Instance units deployed in two different Azure regions for disaster recovery, the same transient routing restrictions apply. In other words, IP addresses of a HANA Large Instance unit in one region (for example, US West) are not routed to a HANA Large Instance unit deployed in another region (for example, US East). This restriction is independent of the use of Azure network peering across regions or cross-connecting the ExpressRoute circuits that connect HANA Large Instance units to virtual networks. For a graphic representation, see the figure in the section "Use HANA Large Instance units in multiple regions." This restriction, which comes with the deployed architecture, prohibits the immediate use of HANA System Replication as disaster recovery functionality.

* SAP HANA on Azure (Large Instances) units have an assigned IP address from the server IP pool address range that you submitted. For more information, see [SAP HANA (Large Instances) infrastructure and connectivity on Azure](hana-overview-infrastructure-connectivity.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). This IP address is accessible through the Azure subscriptions and ExpressRoute that connects virtual networks to HANA on Azure (Large Instances). The IP address assigned out of that server IP pool address range is directly assigned to the hardware unit. It's *not* assigned through NAT anymore, as was the case in the first deployments of this solution. 

> [!NOTE] 
> To overcome the restriction in transient routing as explained in the first two list items, use additional components for routing. Components that can be used to overcome the restriction can be:

> * A reverse-proxy to route data, to and from. For example, F5 BIG-IP, NGINX with Traffic Manager deployed in Azure as a virtual firewall/traffic routing solution.
> * Using [IPTables rules](http://www.linuxhomenetworking.com/wiki/index.php/Quick_HOWTO_%3a_Ch14_%3a_Linux_Firewalls_Using_iptables#.Wkv6tI3rtaQ) in a Linux VM to enable routing between on-premises locations and HANA Large Instance units, or between HANA Large Instance units in different regions.

> Be aware that implementation and support for custom solutions involving third-party network appliances or IPTables isn't provided by Microsoft. Support must be provided by the vendor of the component used or the integrator. 

### Internet connectivity of HANA Large Instance
HANA Large Instance does *not* have direct internet connectivity. As an example, this limitation might restrict your ability to register the OS image directly with the OS vendor. You might need to work with your local SUSE Linux Enterprise Server Subscription Management Tool server or Red Hat Enterprise Linux Subscription Manager.

### Data encryption between VMs and HANA Large Instance
Data transferred between HANA Large Instance and VMs is not encrypted. However, purely for the exchange between the HANA DBMS side and JDBC/ODBC-based applications, you can enable encryption of traffic. For more information, see [this documentation by SAP](http://help-legacy.sap.com/saphelp_hanaplatform/helpdata/en/db/d3d887bb571014bf05ca887f897b99/content.htm?frameset=/en/dd/a2ae94bb571014a48fc3b22f8e919e/frameset.htm&current_toc=/en/de/ec02ebbb57101483bdf3194c301d2e/plain.htm&node_id=20&show_children=false).

### Use HANA Large Instance units in multiple regions

You might have reasons to deploy SAP HANA on Azure (Large Instances) in multiple Azure regions other than for disaster recovery. Perhaps you want to access HANA Large Instance from each of the VMs deployed in the different virtual networks in the regions. The IP addresses assigned to the different HANA Large Instance units aren't propagated beyond the virtual networks that are directly connected through their gateway to the instances. As a result, a slight change is introduced to the virtual network design. A virtual network gateway can handle four different ExpressRoute circuits out of different enterprise edge routers. Each virtual network that is connected to one of the Large Instance stamps can be connected to the Large Instance stamp in another Azure region.

![Virtual network connected to Azure Large Instance stamps in different Azure regions](./media/hana-overview-architecture/image8-multiple-regions.png)

The figure shows how the different virtual networks in both regions are connected to two different ExpressRoute circuits that are used to connect to SAP HANA on Azure (Large Instances) in both Azure regions. The newly introduced connections are the rectangular red lines. With these connections, out of the virtual networks, the VMs running in one of those virtual networks can access each of the different HANA Large Instance units deployed in the two regions. As the figure shows, it's assumed that you have two ExpressRoute connections from on-premises to the two Azure regions. This arrangement is recommended for disaster recovery reasons.

> [!IMPORTANT] 
> If you used multiple ExpressRoute circuits, AS Path prepending and Local Preference BGP settings should be used to ensure proper routing of traffic.


