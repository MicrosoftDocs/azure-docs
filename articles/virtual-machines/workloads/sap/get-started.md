---
title: Get started with SAP on Azure VMs | Microsoft Docs
description: Learn about SAP solutions that run on virtual machines (VMs) in Microsoft Azure
services: virtual-machines-linux
documentationcenter: ''
author: msjuergent
manager: bburns
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: ad8e5c75-0cf6-4564-ae62-ea1246b4e5f2
ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 10/19/2020
ms.author: juergent
ms.custom: H1Hack27Feb2017

---


# Use Azure to host and run SAP workload scenarios

When you use Microsoft Azure, you can reliably run your mission-critical SAP workloads and scenarios on a scalable, compliant, and enterprise-proven platform. You get the scalability, flexibility, and cost savings of Azure. With the expanded partnership between Microsoft and SAP, you can run SAP applications across development and test and production scenarios in Azure and be fully supported. From SAP NetWeaver to SAP S/4HANA, SAP BI on Linux to Windows, and SAP HANA to SQL, we've got you covered.

Besides hosting SAP NetWeaver scenarios with the different DBMS on Azure, you can host other SAP workload scenarios, like SAP BI on Azure. 

The uniqueness of Azure for SAP HANA is an offer that sets Azure apart. To enable hosting more memory and CPU resource-demanding SAP scenarios that involve SAP HANA, Azure offers the use of customer-dedicated bare-metal hardware. Use this solution to run SAP HANA deployments that require up to 24 TB (120 TB scale-out) of memory for S/4HANA or other SAP HANA workload. 

Hosting SAP workload scenarios in Azure also can create requirements of identity integration and single sign-on. This situation can occur when you use Azure Active Directory (Azure AD) to connect different SAP components and SAP software-as-a-service (SaaS) or platform-as-a-service (PaaS) offers. A list of such integration and single sign-on scenarios with Azure AD and SAP entities is described and documented in the section "Azure AD SAP identity integration and single sign-on."

## Changes to the SAP workload section
Changes to documents in the SAP on Azure workload section are listed at the end of this article. The entries in the change log are kept for around 180 days.

## You want to know
If you have specific questions, we are going to point you to specific documents or flows in this section of the start page. You want to know:

- What Azure VMs and HANA Large Instance units are supported for which SAP software releases and which operating system versions. Read the document [What SAP software is supported for Azure deployment](./sap-supported-product-on-azure.md) for answers and the process to find the information
- What SAP deployment scenarios are supported with Azure VMs and HANA Large Instances. Information about the supported scenarios can be found in the documents:
	- [SAP workload on Azure virtual machine supported scenarios](./sap-planning-supported-configurations.md)
	- [Supported scenarios for HANA Large Instance](./hana-supported-scenario.md)
- What Azure Services, Azure VM types and Azure storage services are available in the different Azure regions, check the site [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) 
- Are third party HA frame works, besides Windows and Pacemaker supported? Check bottom part of [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533)
- What Azure storage is best for my scenario? Read [Azure Storage types for SAP workload](./planning-guide-storage.md)

 
## SAP HANA on Azure (Large Instances)

A series of documents leads you through SAP HANA on Azure (Large Instances), or for short, HANA Large Instances. For information on HANA Large Instances, start with the document [Overview and architecture of SAP HANA on Azure (Large Instances)](./hana-overview-architecture.md) and go through the related documentation in the HANA Large Instance section



## SAP HANA on Azure virtual machines
This section of the documentation covers different aspects of SAP HANA. As a prerequisite, you should be familiar with the principal services of Azure that provide elementary services of Azure IaaS. So, you need knowledge of Azure compute, storage, and networking. Many of these subjects are handled in the SAP NetWeaver-related [Azure planning guide](./planning-guide.md). 

 

## SAP NetWeaver deployed on Azure virtual machines
This section lists planning and deployment documentation for SAP NetWeaver, SAP LaMa and Business One on Azure. The documentation focuses on the basics and the use of non-HANA databases with an SAP workload on Azure. The documents and articles for high availability are also the foundation for SAP HANA high availability in Azure

## SAP NetWeaver and S/4HANA high availability
High Availability of SAP application layer and DBMS is documented into the details starting with the document [Azure Virtual Machines high availability for SAP NetWeaver](./sap-high-availability-guide-start.md)



## Integrate Azure AD with SAP Services
In this section you can find information in how to configure SSO with most of the SAP SaaS and PaaS services, NetWeaver and Fiori 



## Documentation on integration of Azure services into SAP components

- [Use SAP HANA in Power BI Desktop](/power-bi/desktop-sap-hana)
- [DirectQuery and SAP HANA](/power-bi/desktop-directquery-sap-hana)
- [Use the SAP BW Connector in Power BI Desktop](/power-bi/desktop-sap-bw-connector) 
- [Azure Data Factory offers SAP HANA and Business Warehouse data integration](https://azure.microsoft.com/blog/azure-data-factory-offer-sap-hana-and-business-warehouse-data-integration)


## Change Log

- 10/16/2020: Change in [HA of IBM Db2 LUW on Azure VMs on SLES with Pacemaker](./dbms-guide-ha-ibm.md), [HA for SAP NW on Azure VMs on RHEL for SAP applications](./high-availability-guide-rhel.md), [HA of IBM Db2 LUW on Azure VMs on RHEL](./high-availability-guide-rhel-ibm-db2-luw.md), [HA for SAP NW on Azure VMs on RHEL multi-SID guide](./high-availability-guide-rhel-multi-sid.md), [HA for SAP NW on Azure VMs on RHEL with ANF](./high-availability-guide-rhel-netapp-files.md), [HA for SAP NW on Azure VMs on SLES for SAP applications](./high-availability-guide-suse.md), [HA for SAP NNW on Azure VMs on SLES multi-SID guide](./high-availability-guide-suse-multi-sid.md), [HA for SAP NW on Azure VMs on SLES with ANF for SAP applications](./high-availability-guide-suse-netapp-files.md), [HA for NFS on Azure VMs on SLES](./high-availability-guide-suse-nfs.md), [HA of SAP HANA on Azure VMs on SLES](./sap-hana-high-availability.md), [HA for SAP HANA scale-up with ANF on RHEL](./sap-hana-high-availability-netapp-files-red-hat.md), [HA of SAP HANA on Azure VMs on RHEL](./sap-hana-high-availability-rhel.md), [SAP HANA scale-out HSR with Pacemaker on Azure VMs on RHEL](./sap-hana-high-availability-scale-out-hsr-rhel.md), [Prepare Azure infrastructure for SAP ASCS/SCS with WSFC and shared disk](./sap-high-availability-infrastructure-wsfc-shared-disk.md), [multi-SID HA guide for SAP ASCS/SCS with WSFC and Azure shared disk](./sap-ascs-ha-multi-sid-wsfc-azure-shared-disk.md) and [multi-SID HA guide for SAP ASCS/SCS with WSFC and shared disk](./sap-ascs-ha-multi-sid-wsfc-shared-disk.md) to add a statement that floating IP is not supported in load-balancing scenarios on secondary IPs  
- 10/15/2020: Release of SAP BusinessObjects BI Platform on Azure documentation, [SAP BusinessObjects BI platform planning and implementation guide on Azure](businessobjects-deployment-guide.md) and [SAP BusinessObjects BI platform deployment guide for linux on Azure](businessobjects-deployment-guide-linux.md)
- 10/05/2020: Release of [SAP HANA scale-out HSR with Pacemaker on Azure VMs on RHEL](./sap-hana-high-availability-scale-out-hsr-rhel.md) configuration guide
- 09/30/2020: Change in [High availability of SAP HANA on Azure VMs on RHEL](./sap-hana-high-availability-rhel.md), [HA for SAP HANA scale-up with ANF on RHEL](./sap-hana-high-availability-netapp-files-red-hat.md) and [Setting up Pacemaker on RHEL in Azure](./high-availability-guide-rhel-pacemaker.md) to adapt the instructions for RHEL 8.1
- 09/29/2020: Making restrictions and recommendations around usage of PPG more obvious in the article [Azure proximity placement groups for optimal network latency with SAP applications](./sap-proximity-placement-scenarios.md) 
- 09/28/2020: Adding a new storage operation guide for SAP HANA using Azure NetApp Files with the document [NFS v4.1 volumes on Azure NetApp Files for SAP HANA](./hana-vm-operations-netapp.md)
- 09/23/2020: Add new certified SKUs for HLI in [Available SKUs for HLI](./hana-available-skus.md) 
- 09/20/2020: Changes in documents [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](./dbms_guide_general.md), [SQL Server Azure Virtual Machines DBMS deployment for SAP NetWeaver](./dbms_guide_sqlserver.md), [Azure Virtual Machines Oracle DBMS deployment for SAP workload](./dbms_guide_oracle.md), [IBM Db2 Azure Virtual Machines DBMS deployment for SAP workload](./dbms_guide_ibm.md) to adapt to new configuration suggestion that recommend separation of DBMS binaries and SAP binaries into different Azure disks. Also adding Ultra disk recommendations to the different guides.
- 09/08/2020: Change in [High availability of SAP HANA on Azure VMs on SLES](./sap-hana-high-availability.md) to clarify stonith definitions
- 09/03/2020: Change in [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md) to adapt to minimal 2 IOPS per 1 GB capacity with Ultra disk
- 09/02/2020: Change in [Available SKUs for HLI](./hana-available-skus.md) to get more transparent in what SKUs are HANA certified
- 08/28/2020: Change in [HA for SAP NW on Azure VMs on SLES with ANF](./high-availability-guide-suse-netapp-files.md) to fix typo
- 08/25/2020: Change in [HA guide for SAP ASCS/SCS with WSFC and shared disk](./sap-high-availability-guide-wsfc-shared-disk.md), [Prepare Azure infrastructure for SAP ASCS/SCS with WSFC and shared disk](./sap-high-availability-infrastructure-wsfc-shared-disk.md) and [Install SAP NW HA with WSFC and shared disk](./sap-high-availability-guide-wsfc-shared-disk.md) to introduce the option of using Azure shared disk and document SAP ERS2 architecture
- 08/25/2020: Release of [multi-SID HA guide for SAP ASCS/SCS with WSFC and Azure shared disk](./sap-ascs-ha-multi-sid-wsfc-azure-shared-disk.md)
- 08/25/2020: Change in [HA guide for SAP ASCS/SCS with WSFC and Azure NetApp Files(SMB)](./high-availability-guide-windows-netapp-files-smb.md), [Prepare Azure infrastructure for SAP ASCS/SCS with WSFC and file share](./sap-high-availability-infrastructure-wsfc-file-share.md), [multi-SID HA guide for SAP ASCS/SCS with WSFC and shared disk](./sap-ascs-ha-multi-sid-wsfc-shared-disk.md) and [multi-SID HA guide for SAP ASCS/SCS with WSFC and SOFS file share](./sap-ascs-ha-multi-sid-wsfc-file-share.md) as a result of the content updates and restructuring in the HA guides for SAP ASCS/SCS with WFC and shared disk 
- 08/21/2020: Adding new OS release into [Compatible Operating Systems for HANA Large Instances](./os-compatibility-matrix-hana-large-instance.md) as available operating system for HLI units of type I and II
- 08/18/2020: Release of [HA for SAP HANA scale-up with ANF on RHEL](./sap-hana-high-availability-netapp-files-red-hat.md)
- 08/17/2020: Add information about using Azure Site Recovery for moving SAP NetWeaver systems from on-premises to Azure in article [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md)
- 08/14/2020: Adding disk configuration advice for Db2 in article [IBM Db2 Azure Virtual Machines DBMS deployment for SAP workload](./dbms_guide_ibm.md)
- 08/11/2020: Adding RHEL 7.6 into [Compatible Operating Systems for HANA Large Instances](./os-compatibility-matrix-hana-large-instance.md) as available operating system for HLI units of type I
- 08/10/2020: Introducing cost conscious SAP HANA storage configuration in [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md) and making some updates to [SAP workloads on Azure: planning and deployment checklist](./sap-deployment-checklist.md)
- 08/04/2020: Change in [Setting up Pacemaker on SLES in Azure](./high-availability-guide-suse-pacemaker.md) and [Setting up Pacemaker on RHEL in Azure](./high-availability-guide-rhel-pacemaker.md) to emphasize the importance of reliable name resolution for Pacemaker clusters
- 08/04/2020: Change in [SAP NW HA on WFCS with file share](./sap-high-availability-installation-wsfc-file-share.md), [SAP NW HA on WFCS with shared disk](./sap-high-availability-installation-wsfc-shared-disk.md), [HA for SAP NW on Azure VMs](./high-availability-guide.md), [HA for SAP NW on Azure VMs on SLES](./high-availability-guide-suse.md), [HA for SAP NW on Azure VMs on SLES with ANF](./high-availability-guide-suse-netapp-files.md), [HA for SAP NW on Azure VMs on SLES multi-SID guide](./high-availability-guide-suse-multi-sid.md), [High availability for SAP NetWeaver on Azure VMs on RHEL](./high-availability-guide-rhel.md), [HA for SAP NW on Azure VMs on RHEL with ANF](./high-availability-guide-rhel-netapp-files.md) and [HA for SAP NW on Azure VMs on RHEL multi-SID guide](./high-availability-guide-rhel-multi-sid.md) to clarify the use of parameter `enque/encni/set_so_keepalive`
- July 23, 2020: Added the [Save on SAP HANA Large Instances with an Azure reservation](../../../cost-management-billing/reservations/prepay-hana-large-instances-reserved-capacity.md) article explaining what you need to know before you buy an SAP HANA Large Instances reservation and how to make the purchase
- July 16, 2020: Describe how to use Azure PowerShell to install new VM Extension for SAP in the [Deployment Guide](deployment-guide.md)
- July 04,2020: Release of  [Azure monitor for SAP solutions(preview)](./azure-monitor-overview.md)
- July 01, 2020: Suggesting less expensive storage configuration based on Azure premium storage burst functionality in document [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md) 
- June 24, 2020: Change in [Setting up Pacemaker on SLES in Azure](./high-availability-guide-suse-pacemaker.md) to release new improved Azure Fence Agent and more resilient STONITH configuration for devices, based on Azure Fence Agent 
- June 24, 2020: Change in [Setting up Pacemaker on RHEL in Azure](./high-availability-guide-rhel-pacemaker.md) to release more resilient STONITH configuration
- June 23, 2020: Changes to [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md) guide and introduction of [Azure Storage types for SAP workload](./planning-guide-storage.md) guide
- 06/22/2020: Add installation steps for new VM Extension for SAP to the [Deployment Guide](deployment-guide.md)
- June 16, 2020: Change in [Public endpoint connectivity for VMs using Azure Standard ILB in SAP HA scenarios](./high-availability-guide-standard-load-balancer-outbound-connections.md) to add a link to SUSE Public Cloud Infrastructure 101 documentation 
- June 10, 2020: Adding new HLI SKUs into [Available SKUs for HLI](./hana-available-skus.md) and [SAP HANA (Large Instances) storage architecture](./hana-storage-architecture.md)
- May 21, 2020: Change in [Setting up Pacemaker on SLES in Azure](./high-availability-guide-suse-pacemaker.md) and [Setting up Pacemaker on RHEL in Azure](./high-availability-guide-rhel-pacemaker.md) to add a link to [Public endpoint connectivity for VMs using Azure Standard ILB in SAP HA scenarios](./high-availability-guide-standard-load-balancer-outbound-connections.md)  
- May 19, 2020: Add important message not to use root volume group when using LVM for HANA related volumes in [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md)
- May 19, 2020: Add new supported OS for HANA Large Instance Type II in [Compatible Operating Systems for HANA Large Instances](/- azure/virtual-machines/workloads/sap/os-compatibility-matrix-hana-large-instance)
- May 12, 2020: Change in [Public endpoint connectivity for VMs using Azure Standard ILB in SAP HA scenarios](./high-availability-guide-standard-load-balancer-outbound-connections.md) to update links and add information for 3rd party firewall configuration
- May 11, 2020: Change in [High availability of SAP HANA on Azure VMs on SLES](./sap-hana-high-availability.md) to set resource stickiness to 0 for the netcat resource, as that leads to more streamlined failover 
- May 05, 2020: Changes in [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md) to express that Gen2 deployments are available for Mv1 VM family
- April 24, 2020: Changes in [SAP HANA scale-out with standby node on Azure VMs with ANF on SLES](./sap-hana-scale-out-standby-netapp-files-suse.md), in [SAP HANA scale-out with standby node on Azure VMs with ANF on RHEL](./sap-hana-scale-out-standby-netapp-files-rhel.md), [High availability for SAP NetWeaver on Azure VMs on SLES with ANF](./high-availability-guide-suse-netapp-files.md) and [High availability for SAP NetWeaver on Azure VMs on RHEL with ANF](./high-availability-guide-rhel-netapp-files.md) to add clarification that the IP addresses for ANF volumes are automatically assigned
- April 22, 2020: Change in [High availability of SAP HANA on Azure VMs on SLES](./sap-hana-high-availability.md) to remove meta attribute `is-managed` from the instructions, as it conflicts with placing the cluster in or out of maintenance mode
- April 21, 2020: Added SQL Azure DB as supported DBMS for SAP (Hybris) Commerce Platform 1811 and later in articles [What SAP software is supported for Azure deployments](./sap-supported-product-on-azure.md) and [SAP certifications and configurations running on Microsoft Azure](./sap-certifications.md)
- April 16, 2020: Added SAP HANA as supported DBMS for SAP (Hybris) Commerce Platform in articles [What SAP software is supported for Azure deployments](./sap-supported-product-on-azure.md) and [SAP certifications and configurations running on Microsoft Azure](./sap-certifications.md)
- April 13, 2020: Correct to exact SAP ASE release numbers in [SAP ASE Azure Virtual Machines DBMS deployment for SAP workload](./dbms_guide_sapase.md)
- April 07, 2020: Change in [Setting up Pacemaker on SLES in Azure](./high-availability-guide-suse-pacemaker.md) to clarify cloud-netconfig-azure instructions
- April 06, 2020: Changes in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SLES](./sap-hana-scale-out-standby-netapp-files-suse.md) and in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on RHEL](./sap-hana-scale-out-standby-netapp-files-rhel.md) to remove references to NetApp [TR-4435](https://www.netapp.com/us/media/tr-4746.pdf) (replaced by [TR-4746](https://www.netapp.com/us/media/tr-4746.pdf))
- March 31, 2020: Change in [High availability of SAP HANA on Azure VMs on SLES](./sap-hana-high-availability.md) and [High availability of SAP HANA on Azure VMs on RHEL](./sap-hana-high-availability-rhel.md) to add instructions how to specify stripe size when creating striped volumes
- March 27, 2020: Change in [High availability for SAP NW on Azure VMs on SLES with ANF for SAP applications](./high-availability-guide-suse-netapp-files.md) to align the file system mount options to NetApp TR-4746 (remove the sync mount option)
- March 26, 2020: Change in [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](./high-availability-guide-suse-multi-sid.md) to add reference to NetApp TR-4746
- March 26, 2020: Change in [High availability for SAP NetWeaver on Azure VMs on SLES for SAP applications](./high-availability-guide-suse.md), [High availability for SAP NetWeaver on Azure VMs on SLES with Azure NetApp Files for SAP applications](./high-availability-guide-suse-netapp-files.md), [High availability for NFS on Azure VMs on SLES](./high-availability-guide-suse-nfs.md), [High availability for SAP NetWeaver on Azure VMs on RHEL multi-SID guide](./high-availability-guide-suse-multi-sid.md), [High availability for SAP NetWeaver on Azure VMs on RHEL for SAP applications](./high-availability-guide-rhel.md) and [High availability for SAP NetWeaver on Azure VMs on RHEL with Azure NetApp Files for SAP applications](./high-availability-guide-rhel-netapp-files.md) to update diagrams and clarify instructions for Azure Load Balancer backend pool creation
- March 19, 2020: Major revision of document [Quickstart: Manual installation of single-instance SAP HANA on Azure Virtual Machines](./hana-get-started.md) to [Installation of SAP HANA on Azure Virtual Machines](./hana-get-started.md)
- March 17, 2020: Change in [Setting up Pacemaker on SUSE Linux Enterprise Server in Azure](./high-availability-guide-suse-pacemaker.md) to remove SBD configuration setting that is no longer necessary
- March 16 2020: Clarification of column certification scenario in SAP HANA IaaS certified platform in [What SAP software is supported for Azure deployments](./sap-supported-product-on-azure.md)
- 03/11/2020: Change in [SAP workload on Azure virtual machine supported scenarios](./sap-planning-supported-configurations.md) to clarify multiple databases per DBMS instance support
- March 11, 2020: Change in [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md) explaining Generation 1 and Generation 2 VMs
- March 10, 2020: Change in [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md) to clarify real existing throughput limits of ANF
- March 09, 2020: Change in [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server for SAP applications](./high-availability-guide-suse.md), [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications](./high-availability-guide-suse-netapp-files.md), [High availability for NFS on Azure VMs on SUSE Linux Enterprise Server](./high-availability-guide-suse-nfs.md), [Setting up Pacemaker on SUSE Linux Enterprise Server in Azure](./high-availability-guide-suse-pacemaker.md), [High availability of IBM Db2 LUW on Azure VMs on SUSE Linux Enterprise Server with Pacemaker](./dbms-guide-ha-ibm.md), [High availability of SAP HANA on Azure VMs on SUSE Linux Enterprise Server](./sap-hana-high-availability.md) and [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](./high-availability-guide-suse-multi-sid.md) to update cluster resources with resource agent azure-lb 
- March 05, 2020: Structure changes and content changes for Azure Regions and Azure Virtual machines in [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md)
- 03/03/2020: Change in [High availability for SAP NW on Azure VMs on SLES with ANF for SAP applications](./high-availability-guide-suse-netapp-files.md) to change to more efficient ANF volume layout
- March 01, 2020: Reworked [Backup guide for SAP HANA on Azure Virtual Machines](./sap-hana-backup-guide.md) to include Azure Backup service. Reduced and condensed content in [SAP HANA Azure Backup on file level](./sap-hana-backup-file-level.md) and deleted a third document dealing with backup through disk snapshot. Content gets handled in Backup guide for SAP HANA on Azure Virtual Machines 
- February 27, 2020: Change in [High availability for SAP NW on Azure VMs on SLES for SAP applications](./high-availability-guide-suse.md), [High availability for SAP NW on Azure VMs on SLES with ANF for SAP applications](./high-availability-guide-suse-netapp-files.md) and [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](./high-availability-guide-suse-multi-sid.md) to adjust "on fail" cluster parameter
- February 26, 2020: Change in [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md) to clarify file system choice for HANA on Azure
- February 26, 2020: Change in [High availability architecture and scenarios for SAP](./sap-high-availability-architecture-scenarios.md) to include the link to the HA for SAP NetWeaver on Azure VMs on RHEL multi-SID guide
- February 26, 2020: Change in [High availability for SAP NW on Azure VMs on SLES for SAP applications](./high-availability-guide-suse.md), [High availability for SAP NW on Azure VMs on SLES with ANF for SAP applications](./high-availability-guide-suse-netapp-files.md), [Azure VMs high availability for SAP NetWeaver on RHEL](./high-availability-guide-rhel.md) and [Azure VMs high availability for SAP NetWeaver on RHEL with Azure NetApp Files](./high-availability-guide-rhel-netapp-files.md) to remove the statement that multi-SID ASCS/ERS cluster is not supported
- February 26, 2020: Release of  [High availability for SAP NetWeaver on Azure VMs on RHEL multi-SID guide](./high-availability-guide-rhel-multi-sid.md) to add a link to the SUSE multi-SID cluster guide
- 02/25/2020: Change in [High availability architecture and scenarios for SAP](./sap-high-availability-architecture-scenarios.md) to add links to newer HA articles
- February 25, 2020: Change in [High availability of IBM Db2 LUW on Azure VMs on SUSE Linux Enterprise Server with Pacemaker](./dbms-guide-ha-ibm.md) to point to document that describes access to public endpoint with Standard Azure Load balancer
- February 21, 2020: Complete revision of the article [SAP ASE Azure Virtual Machines DBMS deployment for SAP workload](./dbms_guide_sapase.md)
- February 21, 2020: Change in [SAP HANA Azure virtual machine storage configuration](./hana-vm-operations-storage.md) to represent new recommendation in stripe size for /hana/data and adding setting of I/O scheduler
- February 21, 2020: Changes in HANA Large Instance documents to represent newly certified SKUs of S224 and S224m
- February 21, 2020: Change in [Azure VMs high availability for SAP NetWeaver on RHEL](./high-availability-guide-rhel.md) and [Azure VMs high availability for SAP NetWeaver on RHEL with Azure NetApp Files](./high-availability-guide-rhel-netapp-files.md) to adjust the cluster constraints for enqueue server replication 2 architecture (ENSA2)
- February 20, 2020: Change in [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](./high-availability-guide-suse-multi-sid.md) to add a link to the SUSE multi-SID cluster guide
- February 13, 2020: Changes to [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md) to implement links to new documents
- February 13, 2020: Added new document [SAP workload on Azure virtual machine supported scenario](./sap-planning-supported-configurations.md)
- February 13, 2020: Added new document [What SAP software is supported for Azure deployment](./sap-supported-product-on-azure.md)
- February 13, 2020: Change in [High availability of IBM Db2 LUW on Azure VMs on Red Hat Enterprise Linux Server](./high-availability-guide-rhel-ibm-db2-luw.md) to point to document that describes access to public endpoint with Standard Azure Load balancer
- February 13, 2020: Add the new VM types to [SAP certifications and configurations running on Microsoft Azure](./sap-certifications.md)
- February 13, 2020: Add new SAP support notes [SAP workloads on Azure: planning and deployment checklist](./sap-deployment-checklist.md)
- February 13, 2020: Change in [Azure VMs high availability for SAP NetWeaver on RHEL](./high-availability-guide-rhel.md) and [Azure VMs high availability for SAP NetWeaver on RHEL with Azure NetApp Files](./high-availability-guide-rhel-netapp-files.md) to align the cluster resources timeouts to the Red Hat timeout recommendations
- February 11, 2020: Release of [SAP HANA on Azure Large Instance migration to Azure Virtual Machines](./hana-large-instance-virtual-machine-migration.md)
- February 07, 2020: Change in [Public endpoint connectivity for VMs using Azure Standard ILB in SAP HA scenarios](./high-availability-guide-standard-load-balancer-outbound-connections.md) to update sample NSG screenshot
- February 03, 2020: Change in [High availability for SAP NW on Azure VMs on SLES for SAP applications](./high-availability-guide-suse.md) and [High availability for SAP NW on Azure VMs on SLES with ANF for SAP applications](./high-availability-guide-suse-netapp-files.md) to remove the warning about using dash in the host names of cluster nodes on SLES
- January 28, 2020: Change in [High availability of SAP HANA on Azure VMs on RHEL](./sap-hana-high-availability-rhel.md) to align the SAP HANA cluster resources timeouts to the Red Hat timeout recommendations
- January 17, 2020: Change in [Azure proximity placement groups for optimal network latency with SAP applications](./sap-proximity-placement-scenarios.md) to change the section of moving existing VMs into a proximity placement group
- January 17, 2020: Change in [SAP workload configurations with Azure Availability Zones](./sap-ha-availability-zones.md) to point to procedure that automates measurements of latency between Availability Zones
- January 16, 2020: Change in [How to install and configure SAP HANA (Large Instances) on Azure](./hana-installation.md) to adapt OS releases to HANA IaaS hardware directory
- January 16, 2020: Changes in [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](./high-availability-guide-suse-multi-sid.md) to add instructions for SAP systems, using enqueue server 2 architecture (ENSA2)
- January 10, 2020: Changes in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SLES](./sap-hana-scale-out-standby-netapp-files-suse.md) and in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on RHEL](./sap-hana-scale-out-standby-netapp-files-rhel.md) to add instructions on how to make `nfs4_disable_idmapping` changes permanent.
- January 10, 2020: Changes in [High availability for SAP NetWeaver on Azure VMs on SLES with Azure NetApp Files for SAP applications](./high-availability-guide-suse-netapp-files.md) and in [Azure Virtual Machines high availability for SAP NetWeaver on RHEL with Azure NetApp Files for SAP applications](./high-availability-guide-rhel-netapp-files.md) to add instructions how to mount Azure NetApp Files NFSv4 volumes.
- December 23, 2019: Release of [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](./high-availability-guide-suse-multi-sid.md)
- December 18, 2019: Release of [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on RHEL](./sap-hana-scale-out-standby-netapp-files-rhel.md)
- November 21, 2019: Changes in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SUSE Linux Enterprise Server](./sap-hana-scale-out-standby-netapp-files-suse.md) to simplify the configuration for NFS ID mapping and change the recommended primary network interface to simplify routing.
- November 15, 2019: Minor changes in [High availability for SAP NetWeaver on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications](high-availability-guide-suse-netapp-files.md) and [High availability for SAP NetWeaver on Red Hat Enterprise Linux with Azure NetApp Files for SAP applications](high-availability-guide-rhel-netapp-files.md) to clarify capacity pool size restrictions and remove statement that only NFSv3 version is supported.
- November 12, 2019: Release of [High availability for SAP NetWeaver on Windows with Azure NetApp Files (SMB)](high-availability-guide-windows-netapp-files-smb.md)
- November 8, 2019: Changes in [High availability of SAP HANA on Azure VMs on SUSE Linux Enterprise Server](sap-hana-high-availability.md), [Set up SAP HANA System Replication on Azure virtual machines (VMs)](sap-hana-high-availability-rhel.md), [Azure Virtual Machines high availability for SAP NetWeaver on SUSE Linux Enterprise Server for SAP applications](high-availability-guide-suse.md), [Azure Virtual Machines high availability for SAP NetWeaver on SUSE Linux Enterprise Server with Azure NetApp Files](high-availability-guide-suse-netapp-files.md), [Azure Virtual Machines high availability for SAP NetWeaver on Red Hat Enterprise Linux](high-availability-guide-rhel.md), [Azure Virtual Machines high availability for SAP NetWeaver on Red Hat Enterprise Linux  with Azure NetApp Files](high-availability-guide-rhel-netapp-files.md), [High availability for NFS on Azure VMs on SUSE Linux Enterprise Server](high-availability-guide-suse-nfs.md), [GlusterFS on Azure VMs on Red Hat Enterprise Linux for SAP NetWeaver](high-availability-guide-rhel-glusterfs.md) to recommend Azure standard load balancer  
- November 8, 2019: Changes in [SAP workload planning and deployment checklist](sap-deployment-checklist.md) to clarify encryption recommendation  
- November 4, 2019: Changes in [Setting up Pacemaker on SUSE Linux Enterprise Server in Azure](high-availability-guide-suse-pacemaker.md) to create the cluster directly with unicast configuration