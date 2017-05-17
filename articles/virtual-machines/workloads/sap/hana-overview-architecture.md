---
title: Overview and Architecture of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Architectural Overview of how to Deploy SAP HANA on Azure (Large Instances).
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
ms.date: 12/01/2016
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---
# SAP HANA (large instances) overview and architecture on Azure 
This is a five-part architecture and technical deployment guide that provides information to help you deploy SAP on the new SAP HANA on Azure (Large Instances) in Azure. It is not comprehensive, and does not cover specific details involving setup of SAP solutions. Instead, gives valuable information to help with your initial deployment and ongoing operations. Do not use it to replace SAP documentation related to the installation of SAP HANA (or the many SAP Support Notes that cover the topic). It also provides detail on installing SAP HANA on Azure (Large Instances).


The five parts of this guide cover the following topics:

- [SAP HANA (large Instance) Overview and Architecture on Azure](hana-overview-architecture.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [SAP HANA (large instances) Infrastructure and connectivity on Azure](hana-overview-infrastructure-connectivity.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [How to install and configure SAP HANA (large instances) on Azure](hana-installation.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [SAP HANA (large instances) High Availability and Disaster Recovery on Azure](hana-overview-high-availability-disaster-recovery.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [SAP HANA (large instances) Troubleshooting and monitoring on Azure](troubleshooting-monitoring.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Definitions

Several common definitions are widely used in the Architecture and Technical Deployment Guide. Please note the following terms and their meanings:

- **IaaS:** Infrastructure as a Service
- **PaaS:** Platform as a Service
- **SaaS:** Software as a Service
- **SAP Component:** An individual SAP application, such as ECC, BW, Solution Manager or EP. SAP components can be based on traditional ABAP or Java technologies or a non-NetWeaver based application such as Business Objects.
- **SAP Environment:** One or more SAP components logically grouped to perform a business function, such as Development, QAS, Training, DR or Production.
- **SAP Landscape:** This refers to the entire SAP assets in your IT landscape. The SAP landscape includes all production and non-production environments.
- **SAP System:** The combination of DBMS layer and application layer of an SAP ERP development system, SAP BW test system, SAP CRM production system, etc. Azure deployments do not support dividing these two layers between on-premises and Azure. This means an SAP system is either deployed on-premises, or it is deployed in Azure. However, you can deploy the different systems of an SAP landscape into either Azure or on-premises. For example, you could deploy the SAP CRM development and test systems in Azure, while deploying the SAP CRM production system on-premises. In the case of SAP HANA on Azure (Large Instances), it is supported to run the SAP application layer of SAP systems in Azure VMs and the HANA instance on a unit in the Large Instance stamp.
- **Large Instance stamp:** A hardware infrastructure stack that is SAP HANA TDI certified and dedicated to run SAP HANA instances within Azure.
- **SAP HANA on Azure (Large Instances):** Official name for the offer in Azure to run HANA instances in on SAP HANA TDI certified hardware that is deployed in Large Instance stamps in different Azure regions. The related term **HANA Large Instances** is short for SAP HANA on Azure (Large Instances) and is widely used this technical deployment guide.
- **Cross-Premises:** Describes a scenario where VMs are deployed to an Azure subscription that has site-to-site, multi-site or ExpressRoute connectivity between the on-premises datacenter(s) and Azure. In common Azure documentation, these kinds of deployments are also described as Cross-Premises scenarios. The reason for the connection is to extend on-premises domains, on-premises Active Directory/OpenLDAP, and on-premises DNS into Azure. The on-premises landscape is extended to the Azure assets of the subscription. Having this extension, the VMs can be part of the on-premises domain. Domain users of the on-premises domain can access the servers and can run services on those VMs (like DBMS services). Communication and name resolution between VMs deployed on-premises and Azure deployed VMs is possible. This is the typical scenario in which most SAP assets will be deployed. See [Planning and design for VPN Gateway](../../../vpn-gateway/vpn-gateway-plan-design.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) and [Create a VNet with a Site-to-Site connection using the Azure portal](../../../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for more information.

There are a variety of additional resources that have been published on the topic of deploying SAP workload on Microsoft Azure public cloud. It is highly recommended that anyone planning a deployment of SAP HANA in Azure be experienced and aware of the principals of Azure IaaS, and the deployment of SAP workloads on Azure IaaS. The following resources provide more information and should be referenced before continuing:


- [Using SAP solutions on Microsoft Azure virtual machines](get-started.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Certification

Besides the NetWeaver certification, SAP requires a special certification for SAP HANA to support SAP HANA on certain infrastructures, such as Azure IaaS.

The core SAP Note on NetWeaver, and to a degree SAP HANA certification, is [SAP Note #1928533 – SAP Applications on Azure: Supported Products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533).

This [SAP Note #2316233 - SAP HANA on Microsoft Azure (Large Instances)](https://launchpad.support.sap.com/#/notes/2316233/E) is also significant. It covers the solution described in this guide. Additionally, you are supported to run SAP HANA in the GS5 VM type of Azure. [Information for this case is published on the SAP website](http://global.sap.com/community/ebook/2014-09-02-hana-hardware/enEN/iaas.html).

The SAP HANA on Azure (Large Instances) solution referred to in SAP Note #2316233 provides Microsoft and SAP customers the ability to deploy large SAP Business Suite, SAP Business Warehouse (BW), S/4 HANA, BW/4HANA, or other SAP HANA workloads in Azure. This is based on the SAP-HANA certified dedicated hardware stamp ([SAP HANA Tailored Datacenter Integration – TDI](https://scn.sap.com/docs/DOC-63140)). Running as an SAP TDI configured solution provides you with the confidence of knowing that all SAP HANA-based applications (including SAP Business Suite on SAP HANA, SAP Business Warehouse (BW) on SAP HANA, S4/HANA and BW4/HANA) will work.

Compared to running SAP HANA in Azure Virtual Machines this solution has a benefit—it provides for much larger memory volumes. If you want to enable this solution, there are some key aspects to understand:

- The SAP application layer and non-SAP applications run in Azure Virtual Machines (VMs) that are hosted in the usual Azure hardware stamps.
- Customer on-premises infrastructure, datacenters and application deployments are connected to the Microsoft Azure cloud platform through Azure ExpressRoute (recommended) or Virtual Private Network (VPN). Active Directory (AD) and DNS are also extended into Azure.
- The SAP HANA database instance for HANA workload runs on SAP HANA on Azure (Large Instances). The Large Instance stamp is connected into Azure networking, so software running in Azure VMs can interact with the HANA instance running in HANA Large Instances.
- Hardware of SAP HANA on Azure (Large Instances) is dedicated hardware provided in an Infrastructure as a Service (IaaS) with SUSE Linux Enterprise Server, or Red Hat Enterprise Linux, pre-installed. As with Azure Virtual Machines, further updates and maintenance to the operating system is your responsibility.
- Installation of HANA or any additional components necessary to run SAP HANA on units of HANA Large instances is your responsibility, as is all respective ongoing operations and administrations of SAP HANA on Azure.
- In addition to the solutions described here, you can install other components in your Azure subscription that connects to SAP HANA on Azure (Large Instances).  For example, components that enable communication with and/or directly to the SAP HANA database (jump servers, RDP servers, SAP HANA Studio, SAP Data Services for SAP BI scenarios, or network monitoring solutions).
- As in Azure, HANA Large Instances offer supporting High Availability and Disaster Recovery enabling functionalities.

## Architecture

At a high-level, the SAP HANA on Azure (Large Instances) solution has the SAP application layer residing in Azure VMs and the database layer residing on SAP TDI configured hardware located in a Large Instance stamp in the same Azure Region that is connected to Azure IaaS.

> [!NOTE]
> The SAP application layer needs to be deployed in the same Azure Region with the SAP DBMS layer. This is well-documented in published information about SAP workload on Azure.

The overall architecture of SAP HANA on Azure (Large Instances) provides an SAP TDI certified hardware configuration (non-virtualized, bare metal, high-performance server for the SAP HANA database), and the ability and flexibility of Azure to scale resources for the SAP application layer to meet your needs.

![Architectural overview of SAP HANA on Azure (Large Instances)](./media/hana-overview-architecture/image1-architecture.png)

The above architecture is divided into three sections:

- **Right:** An on-premises infrastructure running different applications in datacenters with end users accessing LOB applications (like SAP). Ideally, this on-premises infrastructure is then connected to Azure with Azure [ExpressRoute](https://azure.microsoft.com/services/expressroute/).

- **Center:** Shows Azure IaaS and, in this case, use of Azure VMs to host SAP or other applications that leverage SAP HANA as a DBMS system. Smaller HANA instances that function with the memory Azure VMs provide are deployed in Azure VMs together with their application layer. Find out more about [Virtual Machines](https://azure.microsoft.com/services/virtual-machines/).
<br />Azure Networking is used to group SAP systems together with other applications into Azure Virtual Networks (VNets). These VNets connect to on-premises systems as well as to SAP HANA on Azure (Large Instances).
<br />For SAP NetWeaver applications and databases that are supported to run in Microsoft Azure, see [SAP Support Note #1928533 – SAP Applications on Azure: Supported Products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533). For documentation on deploying SAP solutions on Azure please review:

  -  [Using SAP on Windows virtual machines (VMs)](../../virtual-machines-windows-sap-get-started.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
  -  [Using SAP solutions on Microsoft Azure virtual machines](get-started.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

- **Left:** Shows the SAP HANA TDI certified hardware in the Azure Large Instance stamp. The HANA Large Instance units are connected to the Azure VNets of your subscription using the same technology as the connectivity from on-premises into Azure.

The Azure Large Instance stamp itself combines the following components:

- **Computing:**  Servers that are based on Intel Xeon E7-8890v3 processors that provide the necessary computing capability and are SAP HANA certified.
- **Network:**  A unified high-speed network fabric that interconnects the computing, storage, and LAN components.
- **Storage:**  A storage infrastructure that is accessed through a unified network fabric. Specific storage capacity is provided depending on the specific SAP HANA on Azure (Large Instances) configuration being deployed (more storage capacity is available at an additional monthly cost).

Within the multi-tenant infrastructure of the Large Instance stamp, customers are deployed as isolated tenants. These tenants have a 1:1 relationship to the Azure subscription. This means you can&#39;t access the same instance of SAP HANA on Azure (Large Instances) that runs in an Azure Large Instance stamp out of two different Azure subscriptions.

As with Azure VMs, SAP HANA on Azure (Large Instances) is offered in multiple Azure regions. In order to offer Disaster Recovery capabilities, you can choose to opt in. Different Large Instance stamps in the various Azure regions are connected to each other.

Just as you can choose between different VM types with Azure Virtual Machines, you can choose from different SKUs of HANA Large Instances that are tailored for different workload types of SAP HANA. SAP applies memory to processor socket ratios for varying workloads based on the Intel processor generations—there are four different SKU types offered:

As of December 2016, SAP HANA on Azure (Large Instances) is available in six configurations in the Azure Regions of US West and US East:

| SAP Solution | CPU | RAM | Storage |
| --- | --- | --- | --- |
| Optimized for OLAP: SAP BW, BW/4HANA<br /> or SAP HANA for generic OLAP workload | SAP HANA on Azure S72<br /> – 2 x Intel® Xeon® Processor E7-8890 v3 |  768 GB |  3 TB |
| --- | SAP HANA on Azure S144<br /> – 4 x Intel® Xeon® Processor E7-8890 v3 |  1.5 TB |  6 TB |
| --- | SAP HANA on Azure S192<br /> – 4 x Intel® Xeon® Processor E7-8890 v4 |  2.0 TB |  8 TB |
| Optimized for OLTP: SAP Business Suite<br /> on SAP HANA or S/4HANA (OLTP),<br /> generic OLTP | SAP HANA on Azure S72m<br /> – 2 x Intel® Xeon® Processor E7-8890 v3 |  1.5 TB |  6 TB |
|---| SAP HANA on Azure S144m<br /> – 4 x Intel® Xeon® Processor E7-8890 v3 |  3.0 TB |  12 TB |
|---| SAP HANA on Azure S192m<br /> – 4 x Intel® Xeon® Processor E7-8890 v4 |  4.0 TB |  16 TB |

The different configurations above are referenced in [SAP Support Note #2316233 – SAP HANA on Microsoft Azure (Large Instances)](https://launchpad.support.sap.com/#/notes/2316233/E).

The specific configurations chosen are dependent on workload, CPU resources, and desired memory. It is possible for OLTP workload to leverage the SKUs that are optimized for OLAP workload. Likewise, you can leverage OLTP SKUs for OLAP HANA workload. Though you may need to restrict the memory leveraged by HANA to the memory certified with the Intel E7 processor generation as [listed on the SAP website](http://global12.sap.com/community/ebook/2014-09-02-hana-hardware/enEN/appliances.html) for the _Scale up BW on HANA_ appliance type

It is important to note that the complete infrastructure of the Large Instance stamp is not exclusively allocated for a single customer&#39;s use. This applies to SAP HANA on Azure (Large Instances), just as it does with racks of compute and storage resources connected through a network fabric deployed in Azure. HANA Large Instances infrastructure, like Azure, deploys different customer &quot;tenants&quot; that are isolated from one another through network isolation. As such, these deployments of HANA Large Instances do not interfere with, nor are visible to, each other. A deployed tenant in the Large Instance stamp is assigned to one Azure subscription. If you have a second Azure subscription that also requires HANA Large Instances, it would be deployed in a separate tenant in a Large Instance stamp with all of the isolation in the networking that prevents direct communication between these instances.

However, there are significant differences between running SAP HANA on HANA Large Instances and SAP HANA running on Azure VMs deployed in Azure:

- There is no virtualization layer for SAP HANA on Azure (Large Instances). You get the performance of the underlying bare metal hardware.
- Unlike Azure, the SAP HANA on Azure (Large Instances) server is dedicated to a specific customer. A reboot or shutdown of the server does not lead to the operating system and SAP HANA being deployed on another server. (The only exception to this is when a server might encounter issues and redeployment needs to be performed on another blade.)
- Unlike Azure, where host processor types are selected for the best price/performance ratio, the processor types chosen for SAP HANA on Azure (Large Instances) are the highest performing of the Intel E7v3 processor line.

There will be multiple customers deploying on SAP HANA on Azure (Large Instances) hardware, and each is shielded from one another by deploying in their own VLANs. In order to connect HANA Large Instances into an Azure Virtual Network (VNet), the networking components in place connect the tenants HANA Large Instance units in an isolated manner into the Azure VNets of the tenants Azure subscription. 

## Operations model and responsibilities

The service provided with SAP HANA on Azure (Large Instances) is aligned with Azure IaaS services. You get an HANA Large Instances instance with an installed operating system that is optimized for SAP HANA. As with Azure IaaS VMs, most of the tasks of hardening the OS, installing additional software you need, installing HANA, operating the OS and HANA, and updating the OS and HANA is your responsibility. Microsoft will not force OS updates or HANA updates on you.

![Responsibilities of SAP HANA on Azure (Large Instances)](./media/hana-overview-architecture/image2-responsibilities.png)

As you can see in the diagram above, SAP HANA on Azure (Large Instances) is a multi-tenant Infrastructure as a Service offer. And as a result, the division of responsibility is at the OS-Infrastructure boundary, for the most part. Microsoft is responsible for all aspects of the service below the line of the operating system and you are responsible above the line, including the operating system. So most current on-premises methods you may be employing for compliance, security, application management, basis and OS management can continue to be used. The systems appear as if they are in your network in all regards.

However, this service is optimized for SAP HANA, so there are areas where you and Microsoft need to work together to use the underlying infrastructure capabilities for best results.

The following list provides more detail on each of the layers and your responsibilities:

**Networking:** All the internal networks for the Large Instance stamp running SAP HANA, its access to the storage, connectivity between the instances (for scale-out and other functions), connectivity to the landscape, and connectivity to Azure where the SAP application layer is hosted in Azure Virtual Machines. It also includes WAN connectivity between Azure Data Centers for Disaster Recovery purposes replication. All networks are partitioned by the tenant and have QOS applied.

**Storage:** The virtualized partitioned storage for all volumes needed by the SAP HANA servers, as well as for snapshots.

**Servers:** The dedicated physical servers to run the SAP HANA DBs assigned to tenants. They are hardware virtualized.

**SDDC:** The management software that is used to manage the data centers as a software defined entity. It allows Microsoft to pool resources for scale, availability and performance reasons.

**O/S:** The OS you choose (SUSE Linux or Red Hat Linux) that is running on the servers. The OS images you are provided will be the images provided by the individual Linux vendor to Microsoft for the purpose of running SAP HANA. You are required to have a subscription with the Linux vendor for the specific SAP HANA-optimized image. Your responsibilities include registering the images with the OS vendor. From the point of handover by Microsoft, you are also responsible for any further patching of the Linux operating system. This relates to additional packages that might be necessary for a successful SAP HANA installation (please refer to SAP's HANA installation documentation and SAP Notes) and which have not been included by the specific Linux vendor in their SAP HANA optimized OS images. The responsibility of the customer also includes patching of the OS that is related to malfunction/optimization of the OS and its drivers related to the specific server hardware. Or any security or functional patching of the OS. Customer's responsibility is as well monitoring and capacity-planning of:

- CPU resource consumption
- Memory consumption
- Disk volumes related to free space, IOPS and latency
- Network volume traffic between HANA Large Instance and SAP application layer

The underlying infrastructure of HANA Large Instances provides functionality for backup and restore of the OS volume. Leveraging this functionality is also your responsibility.

**Middleware:** The SAP HANA Instance, primarily. Administration, operations and monitoring are your responsibility. There is functionality provided that enables you to use storage snapshots for backup/restore and Disaster Recovery purposes. These functionalities are provided by the infrastructure. However, your responsibilities also include architecting High Availability or Disaster Recovery with these functionalities, leveraging them, and monitoring that storage snapshots have been executed successfully.

**Data:** Your data managed by SAP HANA, and other data such as backups files located on volumes or file shares. Your responsibilities include monitoring disk free space and managing the content on the volumes, and monitoring the successful execution of backups of disk volumes and storage snapshots. However, successful execution of data replication to DR sites is the responsibility of Microsoft.

**Applications:** The SAP application instances or, in case of non-SAP applications, the application layer of those applications. Your responsibilities include deployment, administration, operations and monitoring of those applications related to capacity planning of CPU resource consumption, memory consumption, Azure Storage consumption and network bandwidth consumption within Azure VNets, and from Azure VNets to SAP HANA on Azure (Large Instances).

**WANs:** The connections you establish from premises to Azure deployments for workloads. If the workloads are mission critical, use the Azure ExpressRoute. This connection is not part of the SAP HANA on Azure (Large Instances) solution, so you are responsible for the setup of this connection.

**Archive:** You might prefer to archive copies of data using your own methods in storage accounts. This requires management, compliance, costs and operations. You are responsible for generating archive copies and backups on Azure, and storing them in a compliant way.

See the [SLA for SAP HANA on Azure (Large Instances)](https://azure.microsoft.com/support/legal/sla/sap-hana-large/v1_0/).

## Sizing

Sizing for HANA Large Instances is no different than sizing for HANA in general. For existing and deployed systems, you want to move from other RDBMS to HANA, SAP provides a number of reports that run on your existing SAP systems. They check the data and calculate table memory requirements if the database is moved to HANA. Read the following SAP Notes to get more information on how to run these reports, and how to obtain their most recent patches/versions:

- [SAP Note #1793345 - Sizing for SAP Suite on HANA](https://launchpad.support.sap.com/#/notes/1793345)
- [SAP Note #1872170 - Suite on HANA and S/4 HANA sizing report](https://launchpad.support.sap.com/#/notes/1872170)
- [SAP Note #2121330 - FAQ: SAP BW on HANA Sizing Report](https://launchpad.support.sap.com/#/notes/2121330)
- [SAP Note #1736976 - Sizing Report for BW on HANA](https://launchpad.support.sap.com/#/notes/1736976)
- [SAP Note #2296290 - New Sizing Report for BW on HANA](https://launchpad.support.sap.com/#/notes/2296290)

For green field implementations, SAP Quick Sizer is available to calculate memory requirements of the implementation of SAP software on top of HANA.

Memory requirements for HANA will increase as data volume grows, so you will want to be aware of the memory consumption now and be able to predict what it will be in the future. Based on the memory requirements, you can then map your demand into one of the HANA Large Instance SKUs.

## Requirements

These are the requirements for running SAP HANA on Azure (Larger Instances).

**Microsoft Azure:**

- An Azure subscription that can be linked to SAP HANA on Azure (Large Instances).
- Microsoft Premier Support Contract. See [SAP Support Note #2015553 – SAP on Microsoft Azure: Support Prerequisites](https://launchpad.support.sap.com/#/notes/2015553) for specific information related to running SAP in Azure.
- Awareness of the HANA large instances SKUs you need after performing a sizing exercise with SAP.

**Network Connectivity:**

- Azure ExpressRoute between on-premises to Azure: Make sure to order at least a 1 Gbps connection from your ISP to connect your on-premises datacenter to Azure

**Operating System:**

- Licenses for SUSE Linux Enterprise Server 12 for SAP Applications.

> [!NOTE] 
> The Operating System delivered by Microsoft is not registered with SUSE, nor is it connected with an SMT instance.

- SUSE Linux Subscription Management Tool (SMT) deployed in Azure on an Azure VM. This
provides the ability for SAP HANA on Azure (Large Instances) to be registered and respectively updated by SUSE (as there is no internet access within HANA Large Instances data center). 
- Licenses for Red Hat Enterprise Linux 6.7 or 7.2 for SAP HANA.

> [!NOTE]
> The Operating System delivered by Microsoft is not registered with Red Hat, nor is it connected to a Red Hat Subscription Manager Instance.

- Red Hat Subscription Manager deployed in Azure on an Azure VM. This provides the ability for SAP HANA on Azure (Large Instances) to be registered and respectively updated by Red Hat (as there is no direct internet access from within the tenant deployed on the Azure Large Instance stamp).
- SAP requires you to have a support contract with your Linux provider as well. This requirement is not erased by the solution of HANA Large Instances or the fact that your run Linux in Azure. Unlike with some of the Linux Azure gallery images, the service fee is NOT included in the solution offer of HANA Large Instances. It is on you as a customer to fulfill the requirements of SAP in regards to support contracts with the Linux distributor.   
   - For SUSE Linux please look up the requirements of support contract in [SAP Note #1984787 - SUSE LINUX Enterprise Server 12: Installation notes](https://launchpad.support.sap.com/#/notes/1984787) and [SAP Note #1056161 - SUSE Priority Support for SAP applications](https://launchpad.support.sap.com/#/notes/1056161).
   - For Red Hat Linux you need to have the correct subscription levels that include support and service (updates to the operating systems of HANA Large Instances. Red Hat recommends to get a "RHEL for SAP Business Applications" subscription in regards to support and services. Please check [SAP Note #2002167 - Red Hat Enterprise Linux 7.x: Installation and Upgrade](https://launchpad.support.sap.com/#/notes/2002167) and [SAP Note #1496410 - Red Hat Enterprise Linux 6.x: Installation and Upgrade](https://launchpad.support.sap.com/#/notes/1496410) for details.

**Database:**

- Licenses and software installation components for SAP HANA (platform or enterprise edition).

**Applications:**

- Licenses and software installation components for any SAP applications connecting to SAP HANA and related SAP support contracts.
- Licenses and software installation components for any non-SAP applications used in relation to SAP HANA on Azure (Large Instances) environment and related support contracts.

**Skills:**

- Experience and knowledge on Azure IaaS and its components.
- Experience and knowledge on deploying SAP workload in Azure.
- SAP HANA Installation certified personal.
- SAP architect skills to design High Availability and Disaster Recovery around SAP HANA.


## Storage

The storage layout for SAP HANA on Azure (Large Instances) is configured by SAP HANA on Azure Service Management through SAP recommended best practices, see the [SAP HANA Storage Requirements](http://go.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html) white paper.

The HANA Large Instances usually come with 4 times the memory volume as storage volume. The units come with a volume which is intended for storing HANA log backups. Find more details in [How to install and configure SAP HANA (large instances) on Azure](hana-installation.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

You as a customer can choose to leverage storage snapshots for backup/restore and disaster recovery purposes. More details on this topic are detailed in [SAP HANA (large instances) High Availability and Disaster Recovery on Azure](hana-overview-high-availability-disaster-recovery.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

### Encryption of data at rest
The storage used for HANA Large Instances allows a transparent encryption of the data as it is stored on the disks. At deployment time of a HANA Large Instance Unit you have the option to have this kind of encryption enabled. You also can choose to change to encrypted volumes after the deployment already. The move from non-encrypted to encrypted volumes is transparent and does not require a downtime. 


## Networking

The architecture of Azure Networking is a key component to successful deployment of SAP applications. Typically, SAP HANA on Azure (Large Instances) deployments have a larger SAP landscape with several different SAP solutions with varying sizes of databases, CPU resource consumption, and memory utilization. Very likely only one or two of those SAP systems are based on SAP HANA, so your SAP landscape would probably be a hybrid that leverages:

- Deployed SAP systems on-premises. Due to their sizes these cannot currently be hosted in Azure; a classic example would be a production SAP ERP system running on Microsoft SQL Server (as the database) with &gt;100 CPUs and 1 TB of memory.
- Deployed SAP HANA-based SAP systems on-premises (for instance, an SAP ERP system that requires 6 TB or more of memory for its SAP HANA database).
- Deployed SAP systems in Azure VMs. These systems could be development, testing, sandbox or production instances for any of the SAP NetWeaver-based applications that can successfully deploy in Azure (on VMs), based on resource consumption and memory demand. These also could be based on databases like SQL Server (see [SAP Support Note #1928533 – SAP Applications on Azure: Supported Products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533/E)) or SAP HANA (see [SAP HANA Certified IaaS Platforms](http://global.sap.com/community/ebook/2014-09-02-hana-hardware/enEN/iaas.html)).
- Deployed SAP application servers in Azure (on VMs) that leverage SAP HANA on Azure (Large Instance) in Azure Large Instance stamps.

While a hybrid SAP landscape (with four or more different deployment scenarios) is typical, there are instances of a complete SAP landscape in Azure, and as Microsoft Azure VMs become ever more powerful, the number of SAP solutions deploying on Azure VMs will grow.

Azure networking in the context of SAP systems deployed in Azure is not complicated. It is based on the following principles:

- Azure Virtual Networks (VNets) need to be connected to the Azure ExpressRoute circuit that connects to on-premises network.
- An ExpressRoute circuit usually should have a bandwidth of 1 Gbps or higher. This allows adequate bandwidth for transferring data between on-premises systems and systems running on Azure VMs (as well as connection to Azure systems from end users on-premises).
- All SAP systems in Azure need to be set up in Azure VNets to communicate with each other.
- Active Directory and DNS hosted on-premises are extended into Azure through ExpressRoute from on-premise.


> [!NOTE] 
> A single Azure subscription can be linked only to one single tenant in a Large Instance stamp in a specific Azure region, and conversely a single Large Instance stamp tenant can be linked only to one Azure subscription.

Deploying SAP HANA on Azure (Large Instances) in two different Azure regions, will cause a separate tenant to be deployed in the Large Instance stamp. However, you can run both under the same Azure subscription as long as these instances are part of the same SAP landscape. 

> [!IMPORTANT] 
> Only Azure Resource Management deployment is supported with SAP HANA on Azure (Large Instances).

### Internet connectivity of HANA Large Instances
HANA Large Instances do NOT have direct internet connectivity. This is restricting your abilities to e.g. register the OS image directly with the OS vendor. Hence you might need to work with local SLES SMT server or RHEL Subscription Manager

### Data encryption between Azure VMs and HANA Large Instances
Data transferred between HANA Large Instances and Azure VMs is not encrypted. However, purely for the exchange between the HANA DBMS side and JDBC/ODBC based applications you can enable encryption of traffic. Please reference [this documentation by SAP](http://help-legacy.sap.com/saphelp_hanaplatform/helpdata/en/db/d3d887bb571014bf05ca887f897b99/content.htm?frameset=/en/dd/a2ae94bb571014a48fc3b22f8e919e/frameset.htm&current_toc=/en/de/ec02ebbb57101483bdf3194c301d2e/plain.htm&node_id=20&show_children=false)  

### Additional Azure VNet information

In order to connect an Azure VNet to ExpressRoute, an Azure gateway must be created (see [About virtual network gateways for ExpressRoute](../../../expressroute/expressroute-about-virtual-network-gateways.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)). An Azure gateway can be used either with ExpressRoute to an infrastructure outside of Azure (or to an Azure Large instance stamp), or to connect between Azure VNets (see [Configure a VNet-to-VNet connection for Resource Manager using PowerShell](../../../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)). You can connect the Azure gateway to a maximum of four different ExpressRoute connections as long as those are coming from different MS Enterprise Edges (MSEE).  Please see [SAP HANA (large instances) Infrastructure and connectivity on Azure](hana-overview-infrastructure-connectivity.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for further details. 

> [!NOTE] 
> The throughput an Azure gateway provides is different for both use cases (see [About VPN Gateway](../../../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)). The maximum throughput we can achieve with a VNet gateway is 10 Gbps, using an ExpressRoute connection. Keep in mind that copying files between an Azure VM residing in an Azure VNet and a system on-premises (as a single copy stream) will not achieve the full throughput of the different gateway SKUs. To leverage the complete bandwidth of the VNet gateway, you must use multiple streams, or copy different files in parallel streams of a single file.

As you read the above articles, please carefully note the information on UltraPerformance gateway SKU availability in different Azure regions.

### Networking for SAP HANA on Azure

For connection to SAP HANA on Azure (Large Instances), an Azure VNet must be connected through its VNet gateway using ExpressRoute to a customer&#39;s on-premises network. Also, it needs to be connected through a second ExpressRoute circuit to the HANA Large Instances located in an Azure Large Instance stamp. The VNet gateway will have at least two ExpressRoute connections, and both connections will share the maximum bandwidth of the VNet gateway.

> [!IMPORTANT] 
> Given the overall network traffic between the SAP application and database layers, only the HighPerformance or UltraPerformance gateway SKUs for VNets is supported for connecting to SAP HANA on Azure (Large Instances).

![Azure VNet connected to SAP HANA on Azure (Large Instances) and on-premises](./media/hana-overview-architecture/image3-on-premises-infrastructure.png)

### Single SAP system

The on-premises infrastructure shown above is connected through ExpressRoute into Azure, and the ExpressRoute circuit connects into a Microsoft Enterprise Edge Router (MSEE) (see [ExpressRoute technical overview](../../../expressroute/expressroute-introduction.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)). Once established, that route connects into the Microsoft Azure backbone, and all Azure regions are accessible.

> [!NOTE] 
> For running SAP landscapes in Azure, connect to the MSEE closest to the Azure region in the SAP landscape. Azure Large Instance stamps are connected through dedicated MSEE devices to minimize network latency between Azure VMs in Azure IaaS and Large Instance stamps.

The VNet gateway for the Azure VMs, hosting SAP application instances, is connected to that ExpressRoute circuit, and the same VNet is connected to a separate MSEE Router dedicated to connecting to Large Instance stamps.

This is a straightforward example of a single SAP system, where the SAP application layer is hosted in Azure and the SAP HANA database runs on SAP HANA on Azure (Large Instances). The assumption is that the VNet gateway bandwidth of 2 Gbps or 10 Gbps does not represent a bottleneck.

### Multiple SAP systems or large SAP systems

If multiple SAP systems or large SAP systems are deployed connecting to SAP HANA on Azure (Large Instances), it&#39;s reasonable to assume the throughput of the HighPerformance VNet gateway SKU may become a bottleneck. In which case chose the UltraPerformance SKU, if it is available. However, if there is only the HighPerformance SKU (up to 2 Gbps) available, or there is a potential that the UltraPerformance SKU (up to 10 Gbps) will not be enough, you will need to split the application layers into multiple Azure VNets. It also might be recommendable to create special VNets that connect to HANA Large Instances for cases like:

- Performing backups directly from the HANA Instances in HANA Large Instances to a VM in Azure that hosts NFS shares
- Copying large backups or other files from HANA Large Instance units to disk space managed in Azure.

Using separate VNets that host VMs that manage the storage will avoid impact by large file or data transfer from HANA Large Instances to Azure on the VNet Gateway that serves the VMs running the SAP application layer. 

For a more scalable network architecture:

- Leverage multiple Azure VNets for a single, larger SAP application layer.
- Deploy one separate Azure VNet for each SAP system deployed, compared to combining these SAP systems in separate subnets under the same VNet.

 A more scalable networking architecture for SAP HANA on Azure (Large Instances):

![Deploying SAP application layer over multiple Azure VNets](./media/hana-overview-architecture/image4-networking-architecture.png)

Deploying the SAP application layer, or components, over multiple Azure VNets as shown above, introduced unavoidable latency overhead that occurred during communication between the applications hosted in those Azure VNets. By default, the network traffic between Azure VMs located in different VNets will occur through the MSEE Routers in this configuration. However, since September 2016 this can be avoided and optimized. The way to optimize and cut down the latency in communication between two VNets is by peering Azure VNets within the same region. Even if those are in different subscriptions. Using Azure VNet peering, the communication between VMs in two different Azure VNets can use the Azure network backbone to directly communicate with each other. Thereby showing similar latency as if the VMs would be in the same VNet. Whereas traffic addressing IP address ranges that are connected through the Azure VNet gateway is routed through the individual VNet gateway of the VNet. You can get details about Azure VNet peering in the article [VNet peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview).


### Routing in Azure

There are two important network routing considerations for SAP HANA on Azure (Large Instances):

1. SAP HANA on Azure (Large Instances) can only be accessed by Azure VMs in the dedicated ExpressRoute connection; not directly from on-premises. Some administration clients and any applications needing direct access, such as SAP Solution Manager running on-premises, cannot connect to the SAP HANA database.

2. SAP HANA on Azure (Large Instances) units have an assigned IP address from the Server IP Pool address range you as the customer submitted (see [SAP HANA (large instances) Infrastructure and connectivity on Azure](hana-overview-infrastructure-connectivity.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for details).  This IP address is accessible through the Azure subscription and ExpressRoute that connects Azure VNets to HANA on Azure (Large Instances). The IP address assigned out of that Server IP Pool address range is directly assigned to the hardware unit and is NOT NAT'ed anymore as this was the case in the first deployments of this solution. 

> [!NOTE] 
> If you need to connect to SAP HANA on Azure (Large Instances) in a _data warehouse_ scenario, where applications and/or end users need to connect to the SAP HANA database (running directly), another networking component must be used: a reverse-proxy to route data, to and from. For example, F5 BIG-IP, NGINX with Traffic Manager deployed in Azure as a virtual firewall/traffic routing solution.

### Leveraging in multiple regions

You might have other reasons to deploy SAP HANA on Azure (Large Instances) in multiple Azure regions, besides disaster recovery. Perhaps you want to access HANA Large Instances from each of the VMs deployed in the different VNets in the regions. Since the IP addresses assigned to the different HANA Large Instances units are not propagated beyond the Azure VNets (that are directly connected through their gateway to the instances), there is a slight change to the VNet design introduced above: an Azure VNet gateway can handle four different ExpressRoute circuits out of different MSEEs, and each VNet that is connected to one of the Large Instance stamps can be connected to the Large Instance stamp in another Azure region.

![Azure VNets connected to Azure Large Instance stamps in different Azure regions](./media/hana-overview-architecture/image8-multiple-regions.png)

The above figure shows how the different Azure VNets in both regions are connected to two different ExpressRoute circuits that are used to connect to SAP HANA on Azure (Large Instances) in both Azure regions. The newly introduced connections are the rectangular red lines. With these connections, out of the Azure VNets, the VMs running in one of those VNets can access each of the different HANA Large Instances units deployed in the two regions (assuming you use the same subscription). As you see in the graphics above, it is assumed that you have two ExpressRoute connections from on-premises to the two Azure regions; recommended for Disaster Recovery reasons.

> [!IMPORTANT] 
> If multiple ExpressRoute circuits are used, AS Path prepending and Local Preference BGP settings should be used to ensure proper routing of traffic.


