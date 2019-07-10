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
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 07/10/2019
ms.author: juergent
ms.custom: H1Hack27Feb2017

---


# Use Azure to host and run SAP workload scenarios

When you use Microsoft Azure, you can reliably run your mission-critical SAP workloads and scenarios on a scalable, compliant, and enterprise-proven platform. You get the scalability, flexibility, and cost savings of Azure. With the expanded partnership between Microsoft and SAP, you can run SAP applications across development and test and production scenarios in Azure and be fully supported. From SAP NetWeaver to SAP S/4HANA, SAP BI on Linux to Windows, and SAP HANA to SQL, we've got you covered.

Besides hosting SAP NetWeaver scenarios with the different DBMS on Azure, you can host other SAP workload scenarios, like SAP BI on Azure. 

The uniqueness of Azure for SAP HANA is an offer that sets Azure apart. To enable hosting more memory and CPU resource-demanding SAP scenarios that involve SAP HANA, Azure offers the use of customer-dedicated bare-metal hardware. Use this solution to run SAP HANA deployments that require up to 24 TB (120-TB scale-out) of memory for S/4HANA or other SAP HANA workload. 

Hosting SAP workload scenarios in Azure also can create requirements of identity integration and single sign-on. This situation can occur when you use Azure Active Directory (Azure AD) to connect different SAP components and SAP software-as-a-service (SaaS) or platform-as-a-service (PaaS) offers. A list of such integration and single sign-on scenarios with Azure AD and SAP entities is described and documented in the section "AAD SAP identity integration and single sign-on."

## Latest changes

- Release of new guide for [IBM Db2 HADR in Red Hat Enterprise Server](high-availability-guide-rhel-ibm-db2-luw.md)
- Release of [High availability for SAP NetWeaver on Red Hat Enterprise Linux with Azure NetApp Files for SAP applications](high-availability-guide-rhel-netapp-files.md)
- Introduction of ExpressRoute Fast Path and Global Reach for HANA Large Instances in [SAP HANA (Large Instances) network architecture](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-network-architecture) and related documents
- Release of [Azure HANA Large Instances control through the Azure portal](hana-li-portal.md)
- Release of [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server with Azure NetApp Files for SAP Applications](high-availability-guide-suse-netapp-files.md)







## SAP HANA on Azure (Large Instances)

A series of documents leads you through SAP HANA on Azure (Large Instances), or for short, HANA Large Instances. For information on the following areas of HANA Large Instances, see:

- [Overview of SAP HANA on Azure (Large Instances)](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-architecture)
- [Architecture of SAP HANA on Azure (Large Instances)](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-architecture)
- [Infrastructure and connectivity to SAP HANA on Azure (Large Instances)](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-infrastructure-connectivity)
- [Install SAP HANA on Azure (Large Instances)](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-installation)
- [High availability and disaster recovery of SAP HANA on Azure (Large Instances)](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-high-availability-disaster-recovery)
- [Troubleshoot and monitor SAP HANA on Azure (Large Instances)](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/troubleshooting-monitoring)

Next steps:

- Read [Overview and architecture of SAP HANA on Azure (Large Instances)](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-architecture)



## SAP HANA on Azure virtual machines
This section of the documentation covers different aspects of SAP HANA. As a prerequisite, you should be familiar with the principal services of Azure that provide elementary services of Azure IaaS. So, you need knowledge of Azure compute, storage, and networking. Many of these subjects are handled in the SAP NetWeaver-related [Azure planning guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide). 

For information on HANA on Azure, see the following articles and their subarticles:

- [Quickstart: Manual installation of single-instance SAP HANA on Azure VMs](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-get-started)
- [Deploy SAP S/4HANA or BW/4HANA on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/cal-s4h)
- [SAP HANA infrastructure configurations and operations on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations)
- [SAP HANA high availability for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-availability-overview)
- [SAP HANA availability within one Azure region](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-availability-one-region)
- [SAP HANA availability across Azure regions](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-availability-across-regions)
- [High availability of SAP HANA on Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-high-availability)
- [Backup guide for SAP HANA on Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-guide)
- [SAP HANA Azure Backup on file level](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-file-level)
- [SAP HANA backup based on storage snapshots](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-storage-snapshots)

 

## SAP NetWeaver deployed on Azure virtual machines
This section lists planning and deployment documentation for SAP NetWeaver and Business One on Azure. The documentation focuses on the basics and the use of non-HANA databases with an SAP workload on Azure. The documents and articles for high availability are also the foundation for HANA high availability in Azure, such as:

- [SAP Business One on Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/business-one-azure)
- [Deploy SAP IDES EHP7 SP3 for SAP ERP 6.0 on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/cal-ides-erp6-erp7-sp3-sql)
- [Run SAP NetWeaver on Microsoft Azure SUSE Linux VMs](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/suse-quickstart)
- [Azure Virtual Machines planning and implementation for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide)
- [Azure Virtual Machines deployment for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/deployment-guide)
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




