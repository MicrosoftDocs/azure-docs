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
ms.date: 06/10/2020
ms.author: juergent
ms.custom: H1Hack27Feb2017

---


# Use Azure to host and run SAP workload scenarios

When you use Microsoft Azure, you can reliably run your mission-critical SAP workloads and scenarios on a scalable, compliant, and enterprise-proven platform. You get the scalability, flexibility, and cost savings of Azure. With the expanded partnership between Microsoft and SAP, you can run SAP applications across development and test and production scenarios in Azure and be fully supported. From SAP NetWeaver to SAP S/4HANA, SAP BI on Linux to Windows, and SAP HANA to SQL, we've got you covered.

Besides hosting SAP NetWeaver scenarios with the different DBMS on Azure, you can host other SAP workload scenarios, like SAP BI on Azure. 

The uniqueness of Azure for SAP HANA is an offer that sets Azure apart. To enable hosting more memory and CPU resource-demanding SAP scenarios that involve SAP HANA, Azure offers the use of customer-dedicated bare-metal hardware. Use this solution to run SAP HANA deployments that require up to 24 TB (120 TB scale-out) of memory for S/4HANA or other SAP HANA workload. 

Hosting SAP workload scenarios in Azure also can create requirements of identity integration and single sign-on. This situation can occur when you use Azure Active Directory (Azure AD) to connect different SAP components and SAP software-as-a-service (SaaS) or platform-as-a-service (PaaS) offers. A list of such integration and single sign-on scenarios with Azure AD and SAP entities is described and documented in the section "AAD SAP identity integration and single sign-on."

## Changes to the SAP workload section
Changes to documents in the SAP on Azure workload section are listed at the end of this article. The entries in the change log are kept for around 180 days.

## You want to know
If you have specific questions, we are going to point you to specific documents or flows in this section of the start page. You want to know:

- What Azure VMs and HANA Large Instance units are supported for which SAP software releases and which operating system versions. Read the document [What SAP software is supported for Azure deployment](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-supported-product-on-azure) for answers and the process to find the information
- What SAP deployment scenarios are supported with Azure VMs and HANA Large Instances. Information about the supported scenarios can be found in the documents:
	- [SAP workload on Azure virtual machine supported scenarios](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-planning-supported-configurations)
	- [Supported scenarios for HANA Large Instance](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario)
- What Azure Services, Azure VM types and Azure storage services are available in the different Azure regions, check the site [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) 
- Are third party HA frame works, besides Windows and Pacemaker supported? Check bottom part of [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533)

 
## SAP HANA on Azure (Large Instances)

A series of documents leads you through SAP HANA on Azure (Large Instances), or for short, HANA Large Instances. For information on HANA Large Instances, start with the document [Overview and architecture of SAP HANA on Azure (Large Instances)](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-architecture) and go through the related documentation in the HANA Large Instance section



## SAP HANA on Azure virtual machines
This section of the documentation covers different aspects of SAP HANA. As a prerequisite, you should be familiar with the principal services of Azure that provide elementary services of Azure IaaS. So, you need knowledge of Azure compute, storage, and networking. Many of these subjects are handled in the SAP NetWeaver-related [Azure planning guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide). 

For information on HANA on Azure, see the following articles and their subarticles:

- [SAP HANA infrastructure configurations and operations on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations)
- [SAP HANA high availability for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-availability-overview)
- [High availability of SAP HANA on Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-high-availability)
- [Backup guide for SAP HANA on Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-guide)


 

## SAP NetWeaver deployed on Azure virtual machines
This section lists planning and deployment documentation for SAP NetWeaver and Business One on Azure. The documentation focuses on the basics and the use of non-HANA databases with an SAP workload on Azure. The documents and articles for high availability are also the foundation for HANA high availability in Azure, such as:

- [Azure planning guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide). 
- [SAP Business One on Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/business-one-azure)
- [Protect a multitier SAP NetWeaver application deployment by using Site Recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-sap)
- [SAP LaMa connector for Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/lama-installation)

For information on non-HANA databases under an SAP workload on Azure, see:

- [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general)
- [SQL Server Azure Virtual Machines DBMS deployment for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_sqlserver)
- [Oracle Azure Virtual Machines DBMS deployment for SAP workload](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_oracle)
- [IBM DB2 Azure Virtual Machines DBMS deployment for SAP workload](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_ibm)
- [SAP ASE Azure Virtual Machines DBMS deployment for SAP workload](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_sapase)
- [SAP MaxDB, Live Cache, and Content Server deployment on Azure VMs](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_maxdb)

For information on SAP HANA databases on Azure, see the section "SAP HANA on Azure virtual machines."

For information on high availability of an SAP workload on Azure, see:

- [Azure Virtual Machines high availability for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-guide-start)

This document points to various other architecture and scenario documents. In later scenario documents, links to detailed technical documents that explain the deployment and configuration of the different high-availability methods are provided. The different documents that show how to establish and configure high availability for an SAP NetWeaver workload cover Linux and Windows operating systems.


For information on integration between Azure Active Directory (Azure AD) and SAP services and single sign-on, see:

- [Tutorial: Azure Active Directory integration with SAP Cloud for Customer](https://docs.microsoft.com/azure/active-directory/saas-apps/sap-customer-cloud-tutorial?toc=%2fazure%2fvirtual-machines%2fworkloads%2fsap%2ftoc.json)
- [Tutorial: Azure Active Directory integration with SAP Cloud Platform Identity Authentication](https://docs.microsoft.com/azure/active-directory/saas-apps/sap-hana-cloud-platform-identity-authentication-tutorial?toc=%2fazure%2fvirtual-machines%2fworkloads%2fsap%2ftoc.json)
- [Tutorial: Azure Active Directory integration with SAP Cloud Platform](https://docs.microsoft.com/azure/active-directory/saas-apps/sap-hana-cloud-platform-tutorial?toc=%2fazure%2fvirtual-machines%2fworkloads%2fsap%2ftoc.json)
- [Tutorial: Azure Active Directory integration with SAP NetWeaver](https://docs.microsoft.com/azure/active-directory/saas-apps/sap-netweaver-tutorial?toc=%2fazure%2fvirtual-machines%2fworkloads%2fsap%2ftoc.json)
- [Tutorial: Azure Active Directory integration with SAP Business ByDesign](https://docs.microsoft.com/azure/active-directory/saas-apps/sapbusinessbydesign-tutorial?toc=%2fazure%2fvirtual-machines%2fworkloads%2fsap%2ftoc.json)
- [Tutorial: Azure Active Directory integration with SAP HANA](https://docs.microsoft.com/azure/active-directory/saas-apps/saphana-tutorial?toc=%2fazure%2fvirtual-machines%2fworkloads%2fsap%2ftoc.json)
- [Your S/4HANA environment: Fiori Launchpad SAML single sign-on with Azure AD](https://blogs.sap.com/2017/02/20/your-s4hana-environment-part-7-fiori-launchpad-saml-single-sing-on-with-azure-ad/)

For information on integration of Azure services into SAP components, see:

- [Use SAP HANA in Power BI Desktop](https://docs.microsoft.com/power-bi/desktop-sap-hana)
- [DirectQuery and SAP HANA](https://docs.microsoft.com/power-bi/desktop-directquery-sap-hana)
- [Use the SAP BW Connector in Power BI Desktop](https://docs.microsoft.com/power-bi/desktop-sap-bw-connector) 
- [Azure Data Factory offers SAP HANA and Business Warehouse data integration](https://azure.microsoft.com/blog/azure-data-factory-offer-sap-hana-and-business-warehouse-data-integration)


## Change Log

- 06/10/2020: Adding new HLI SKUs into [Available SKUs for HLI](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-available-skus) and [SAP HANA (Large Instances) storage architecture](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-storage-architecture)
- 05/21/2020: Change in [Setting up Pacemaker on SLES in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker) and [Setting up Pacemaker on RHEL in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-pacemaker) to add a link to [Public endpoint connectivity for VMs using Azure Standard ILB in SAP HA scenarios](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-standard-load-balancer-outbound-connections)  
- 05/19/2020: Add important message not to use root volume group when using LVM for HANA related volumes in [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage)
- 05/19/2020: Add new supported OS for HANA Large Instance Type II in [Compatible Operating Systems for HANA Large Instances](https://docs.microsoft.com/
- azure/virtual-machines/workloads/sap/os-compatibility-matrix-hana-large-instance)
- 05/12/2020: Change in [Public endpoint connectivity for VMs using Azure Standard ILB in SAP HA scenarios](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-standard-load-balancer-outbound-connections) to update links and add information for 3rd party firewall configuration
- 05/11/2020: Change in [High availability of SAP HANA on Azure VMs on SLES](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-high-availability) to set resource stickiness to 0 for the netcat resource, as that leads to more streamlined failover 
- 05/05/2020: Changes in [Azure Virtual Machines planning and implementation for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide) to express that Gen2 deployments are available for Mv1 VM family
- 04/24/2020: Changes in [SAP HANA scale-out with standby node on Azure VMs with ANF on SLES](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse), in [SAP HANA scale-out with standby node on Azure VMs with ANF on RHEL](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-rhel), [High availability for SAP NetWeaver on Azure VMs on SLES with ANF](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files) and [High availability for SAP NetWeaver on Azure VMs on RHEL with ANF](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-netapp-files) to add clarification that the IP addresses for ANF volumes are automatically assigned
- 04/22/2020: Change in [High availability of SAP HANA on Azure VMs on SLES](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-high-availability) to remove meta attribute `is-managed` from the instructions, as it conflicts with placing the cluster in or out of maintenance mode
- 04/21/2020: Added SQL Azure DB as supported DBMS for SAP (Hybris) Commerce Platform 1811 and later in articles [What SAP software is supported for Azure deployments](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-supported-product-on-azure) and [SAP certifications and configurations running on Microsoft Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-certifications)
- 04/16/2020: Added SAP HANA as supported DBMS for SAP (Hybris) Commerce Platform in articles [What SAP software is supported for Azure deployments](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-supported-product-on-azure) and [SAP certifications and configurations running on Microsoft Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-certifications)
- 04/13/2020: Correct to exact SAP ASE release numbers in [SAP ASE Azure Virtual Machines DBMS deployment for SAP workload](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_sapase)
- 04/07/2020: Change in [Setting up Pacemaker on SLES in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker) to clarify cloud-netconfig-azure instructions
- 04/06/2020: Changes in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SLES](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse) and in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on RHEL](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-rhel) to remove references to NetApp [TR-4435](https://www.netapp.com/us/media/tr-4746.pdf) (replaced by [TR-4746](https://www.netapp.com/us/media/tr-4746.pdf))
- 03/31/2020: Change in [High availability of SAP HANA on Azure VMs on SLES](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-high-availability) and [High availability of SAP HANA on Azure VMs on RHEL](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel) to add instructions how to specify stripe size when creating striped volumes
- 03/27/2020: Change in [High availability for SAP NW on Azure VMs on SLES with ANF for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files) to align the file system mount options to NetApp TR-4746 (remove the sync mount option)
- 03/26/2020: Change in [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-multi-sid) to add reference to NetApp TR-4746
- 03/26/2020: Change in [High availability for SAP NetWeaver on Azure VMs on SLES for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse), [High availability for SAP NetWeaver on Azure VMs on SLES with Azure NetApp Files for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files), [High availability for NFS on Azure VMs on SLES](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-nfs), [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-multi-sid), [High availability for SAP NetWeaver on Azure VMs on RHEL for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel) and [High availability for SAP NetWeaver on Azure VMs on RHEL with Azure NetApp Files for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-netapp-files) to update diagrams and clarify instructions for Azure Load Balancer backend pool creation
- 03/19/2020: Major revision of document [Quickstart: Manual installation of single-instance SAP HANA on Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-get-started) to [Installation of SAP HANA on Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-get-started)
- 03/17/2020: Change in [Setting up Pacemaker on SUSE Linux Enterprise Server in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker) to remove SBD configuration setting that is no longer necessary
- 03/16/2020: Clarification of column certification scenario in SAP HANA IaaS certified platform in [What SAP software is supported for Azure deployments](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-supported-product-on-azure)
- 03/11/2020: Change in [SAP workload on Azure virtual machine supported scenarios](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-planning-supported-configurations) to clarify multiple databases per DBMS instance support
- 03/11/2020: Change in [Azure Virtual Machines planning and implementation for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide) explaining Generation 1 and Generation 2 VMs
- 03/10/2020: Change in [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage) to clarify real existing throughput limits of ANF
- 03/09/2020: Change in [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse), [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files), [High availability for NFS on Azure VMs on SUSE Linux Enterprise Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-nfs), [Setting up Pacemaker on SUSE Linux Enterprise Server in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker), [High availability of IBM Db2 LUW on Azure VMs on SUSE Linux Enterprise Server with Pacemaker](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms-guide-ha-ibm), [High availability of SAP HANA on Azure VMs on SUSE Linux Enterprise Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-high-availability) and [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-multi-sid) to update cluster resources with resource agent azure-lb 
- 03/05/2020: Structure changes and content changes for Azure Regions and Azure Virtual machines in [Azure Virtual Machines planning and implementation for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide)
- 03/03/2020: Change in [High availability for SAP NW on Azure VMs on SLES with ANF for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files) to change to more efficient ANF volume layout
- 03/01/2020: Reworked [Backup guide for SAP HANA on Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-guide) to include Azure Backup service. Reduced and condensed content in [SAP HANA Azure Backup on file level](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-file-level) and deleted a third document dealing with backup through disk snapshot. Content gets handled in Backup guide for SAP HANA on Azure Virtual Machines 
- 02/27/2020: Change in [High availability for SAP NW on Azure VMs on SLES for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse), [High availability for SAP NW on Azure VMs on SLES with ANF for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files) and [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-multi-sid) to adjust "on fail" cluster parameter
- 02/26/2020: Change in [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage) to clarify file system choice for HANA on Azure
- 02/26/2020: Change in [High availability architecture and scenarios for SAP](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-architecture-scenarios) to include the link to the HA for SAP NetWeaver on Azure VMs on RHEL multi-SID guide
- 02/26/2020: Change in [High availability for SAP NW on Azure VMs on SLES for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse), [High availability for SAP NW on Azure VMs on SLES with ANF for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files), [Azure VMs high availability for SAP NetWeaver on RHEL](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel) and [Azure VMs high availability for SAP NetWeaver on RHEL with Azure NetApp Files](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-netapp-files) to remove the statement that multi-SID ASCS/ERS cluster is not supported
- 02/26/2020: Release of  [High availability for SAP NetWeaver on Azure VMs on RHEL multi-SID guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-multi-sid) to add a link to the SUSE multi-SID cluster guide
- 02/25/2020: Change in [High availability architecture and scenarios for SAP](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-architecture-scenarios) to add links to newer HA articles
- 02/25/2020: Change in [High availability of IBM Db2 LUW on Azure VMs on SUSE Linux Enterprise Server with Pacemaker](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms-guide-ha-ibm) to point to document that describes access to public endpoint with Standard Azure Load balancer
- 02/21/2020: Complete revision of the article [SAP ASE Azure Virtual Machines DBMS deployment for SAP workload](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_sapase)
- 02/21/2020: Change in [SAP HANA Azure virtual machine storage configuration](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage) to represent new recommendation in stripe size for /hana/data and adding setting of I/O scheduler
- 02/21/2020: Changes in HANA Large Instance documents to represent newly certified SKUs of S224 and S224m
- 02/21/2020: Change in [Azure VMs high availability for SAP NetWeaver on RHEL](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel) and [Azure VMs high availability for SAP NetWeaver on RHEL with Azure NetApp Files](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-netapp-files) to adjust the cluster constraints for enqueue server replication 2 architecture (ENSA2)
- 02/20/2020: Change in [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-multi-sid) to add a link to the SUSE multi-SID cluster guide
- 02/13/2020: Changes to [Azure Virtual Machines planning and implementation for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide) to implement links to new documents
- 02/13/2020: Added new document [SAP workload on Azure virtual machine supported scenario](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-planning-supported-configurations)
- 02/13/2020: Added new document [What SAP software is supported for Azure deployment](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-supported-product-on-azure)
- 02/13/2020: Change in [High availability of IBM Db2 LUW on Azure VMs on Red Hat Enterprise Linux Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-ibm-db2-luw) to point to document that describes access to public endpoint with Standard Azure Load balancer
- 02/13/2020: Add the new VM types to [SAP certifications and configurations running on Microsoft Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-certifications)
- 02/13/2020: Add new SAP support notes [SAP workloads on Azure: planning and deployment checklist](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-deployment-checklist)
- 02/13/2020: Change in [Azure VMs high availability for SAP NetWeaver on RHEL](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel) and [Azure VMs high availability for SAP NetWeaver on RHEL with Azure NetApp Files](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-netapp-files) to align the cluster resources timeouts to the Red Hat timeout recommendations
- 02/11/2020: Release of [SAP HANA on Azure Large Instance migration to Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-large-instance-virtual-machine-migration)
- 02/07/2020: Change in [Public endpoint connectivity for VMs using Azure Standard ILB in SAP HA scenarios](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-standard-load-balancer-outbound-connections) to update sample NSG screenshot
- 02/03/2020: Change in [High availability for SAP NW on Azure VMs on SLES for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse) and [High availability for SAP NW on Azure VMs on SLES with ANF for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files) to remove the warning about using dash in the host names of cluster nodes on SLES
- January 28, 2020: Change in [High availability of SAP HANA on Azure VMs on RHEL](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel) to align the SAP HANA cluster resources timeouts to the Red Hat timeout recommendations
- January 17, 2020: Change in [Azure proximity placement groups for optimal network latency with SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-proximity-placement-scenarios) to change the section of moving existing VMs into a proximity placement group
- January 17, 2020: Change in [SAP workload configurations with Azure Availability Zones](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-ha-availability-zones) to point to procedure that automates measurements of latency between Availability Zones
- January 16, 2020: Change in [How to install and configure SAP HANA (Large Instances) on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-installation) to adapt OS releases to HANA IaaS hardware directory
- January 16, 2020: Changes in [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-multi-sid) to add instructions for SAP systems, using enqueue server 2 architecture (ENSA2)
- January 10, 2020: Changes in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SLES](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse) and in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on RHEL](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-rhel) to add instructions on how to make `nfs4_disable_idmapping` changes permanent.
- January 10, 2020: Changes in [High availability for SAP NetWeaver on Azure VMs on SLES with Azure NetApp Files for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files) and in [Azure Virtual Machines high availability for SAP NetWeaver on RHEL with Azure NetApp Files for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-netapp-files) to add instructions how to mount Azure NetApp Files NFSv4 volumes.
- December 23, 2019: Release of [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-multi-sid)
- December 18, 2019: Release of [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on RHEL](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-rhel)
- November 21, 2019: Changes in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SUSE Linux Enterprise Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse) to simplify the configuration for NFS ID mapping and change the recommended primary network interface to simplify routing.
- November 15, 2019: Minor changes in [High availability for SAP NetWeaver on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications](high-availability-guide-suse-netapp-files.md) and [High availability for SAP NetWeaver on Red Hat Enterprise Linux with Azure NetApp Files for SAP applications](high-availability-guide-rhel-netapp-files.md) to clarify capacity pool size restrictions and remove statement that only NFSv3 version is supported.
- November 12, 2019: Release of [High availability for SAP NetWeaver on Windows with Azure NetApp Files (SMB)](high-availability-guide-windows-netapp-files-smb.md)
- November 8, 2019: Changes in [High availability of SAP HANA on Azure VMs on SUSE Linux Enterprise Server](sap-hana-high-availability.md), [Set up SAP HANA System Replication on Azure virtual machines (VMs)](sap-hana-high-availability-rhel.md), [Azure Virtual Machines high availability for SAP NetWeaver on SUSE Linux Enterprise Server for SAP applications](high-availability-guide-suse.md), [Azure Virtual Machines high availability for SAP NetWeaver on SUSE Linux Enterprise Server with Azure NetApp Files](high-availability-guide-suse-netapp-files.md), [Azure Virtual Machines high availability for SAP NetWeaver on Red Hat Enterprise Linux](high-availability-guide-rhel.md), [Azure Virtual Machines high availability for SAP NetWeaver on Red Hat Enterprise Linux  with Azure NetApp Files](high-availability-guide-rhel-netapp-files.md), [High availability for NFS on Azure VMs on SUSE Linux Enterprise Server](high-availability-guide-suse-nfs.md), [GlusterFS on Azure VMs on Red Hat Enterprise Linux for SAP NetWeaver](high-availability-guide-rhel-glusterfs.md) to recommend Azure standard load balancer  
- November 8, 2019: Changes in [SAP workload planning and deployment checklist](sap-deployment-checklist.md) to clarify encryption recommendation  
- November 4, 2019: Changes in [Setting up Pacemaker on SUSE Linux Enterprise Server in Azure](high-availability-guide-suse-pacemaker.md) to create the cluster directly with unicast configuration  


