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
ms.date: 01/16/2020
ms.author: juergent
ms.custom: H1Hack27Feb2017

---


# Use Azure to host and run SAP workload scenarios

When you use Microsoft Azure, you can reliably run your mission-critical SAP workloads and scenarios on a scalable, compliant, and enterprise-proven platform. You get the scalability, flexibility, and cost savings of Azure. With the expanded partnership between Microsoft and SAP, you can run SAP applications across development and test and production scenarios in Azure and be fully supported. From SAP NetWeaver to SAP S/4HANA, SAP BI on Linux to Windows, and SAP HANA to SQL, we've got you covered.

Besides hosting SAP NetWeaver scenarios with the different DBMS on Azure, you can host other SAP workload scenarios, like SAP BI on Azure. 

The uniqueness of Azure for SAP HANA is an offer that sets Azure apart. To enable hosting more memory and CPU resource-demanding SAP scenarios that involve SAP HANA, Azure offers the use of customer-dedicated bare-metal hardware. Use this solution to run SAP HANA deployments that require up to 24 TB (120-TB scale-out) of memory for S/4HANA or other SAP HANA workload. 

Hosting SAP workload scenarios in Azure also can create requirements of identity integration and single sign-on. This situation can occur when you use Azure Active Directory (Azure AD) to connect different SAP components and SAP software-as-a-service (SaaS) or platform-as-a-service (PaaS) offers. A list of such integration and single sign-on scenarios with Azure AD and SAP entities is described and documented in the section "AAD SAP identity integration and single sign-on."

## Changes to the SAP workload section
Changes to documents in the SAP on Azure workload section are listed at the end of this article.


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


## Change Log
- 01/16/2020: Change in [How to install and configure SAP HANA (Large Instances) on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-installation) to adapt OS releases to HANA IaaS hardware directory
- 01/16/2020: Changes in [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-multi-sid) to add instructions for SAP systems, using enqueue server 2 architecture (ENSA2)
- 01/10/2020: Changes in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SLES](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse) and in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on RHEL](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-rhel) to add instructions on how to make `nfs4_disable_idmapping` changes permanent.
- 01/10/2020: Changes in [High availability for SAP NetWeaver on Azure VMs on SLES with Azure NetApp Files for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files) and in [Azure Virtual Machines high availability for SAP NetWeaver on RHEL with Azure NetApp Files for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-netapp-files) to add instructions how to mount Azure NetApp Files NFSv4 volumes.
- 12/23/2019: Release of [High availability for SAP NetWeaver on Azure VMs on SLES multi-SID guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-multi-sid)
- 12/18/2019: Release of [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on RHEL](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-rhel)
- 11/21/2019: Changes in [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SUSE Linux Enterprise Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse) to simplify the configuration for NFS ID mapping and change the recommended primary network interface to simplify routing.
- 11/15/2019: Minor changes in [High availability for SAP NetWeaver on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications](high-availability-guide-suse-netapp-files.md) and [High availability for SAP NetWeaver on Red Hat Enterprise Linux with Azure NetApp Files for SAP applications](high-availability-guide-rhel-netapp-files.md) to clarify capacity pool size restrictions and remove statement that only NFSv3 version is supported.
- 11/12/2019: Release of [High availability for SAP NetWeaver on Windows with Azure NetApp Files (SMB)](high-availability-guide-windows-netapp-files-smb.md)
- 11/08/2019: Changes in [High availability of SAP HANA on Azure VMs on SUSE Linux Enterprise Server](sap-hana-high-availability.md), [Set up SAP HANA System Replication on Azure virtual machines (VMs)](sap-hana-high-availability-rhel.md), [Azure Virtual Machines high availability for SAP NetWeaver on SUSE Linux Enterprise Server for SAP applications](high-availability-guide-suse.md), [Azure Virtual Machines high availability for SAP NetWeaver on SUSE Linux Enterprise Server with Azure NetApp Files](high-availability-guide-suse-netapp-files.md), [Azure Virtual Machines high availability for SAP NetWeaver on Red Hat Enterprise Linux](high-availability-guide-rhel.md), [Azure Virtual Machines high availability for SAP NetWeaver on Red Hat Enterprise Linux  with Azure NetApp Files](high-availability-guide-rhel-netapp-files.md), [High availability for NFS on Azure VMs on SUSE Linux Enterprise Server](high-availability-guide-suse-nfs.md), [GlusterFS on Azure VMs on Red Hat Enterprise Linux for SAP NetWeaver](high-availability-guide-rhel-glusterfs.md) to recommend Azure standard load balancer  
- 11/08/2019: Changes in [SAP workload planning and deployment checklist](sap-deployment-checklist.md) to clarify encryption recommendation  
- 11/04/2019: Changes in [Setting up Pacemaker on SUSE Linux Enterprise Server in Azure](high-availability-guide-suse-pacemaker.md) to create the cluster directly with unicast configuration  
- 10/29/2019: Release of [Public endpoint connectivity for Virtual Machines using Azure Standard Load Balancer in SAP high-availability scenarios](high-availability-guide-standard-load-balancer-outbound-connections.md)
- 10/25/2019: Changes in [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage) and [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SUSE Linux Enterprise Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse) to clarify NFS protocol for /hana/shared volume
- 10/22/2019: Change in [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse), [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files), [High availability for NFS on Azure VMs on SUSE Linux Enterprise Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-nfs), [Setting up Pacemaker on SUSE Linux Enterprise Server in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker), [High availability of IBM Db2 LUW on Azure VMs on SUSE Linux Enterprise Server with Pacemaker](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms-guide-ha-ibm), and [High availability of SAP HANA on Azure VMs on SUSE Linux Enterprise Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-high-availability) for Azure Load-Balancer Detection Hardening
- Changes ANF section and header section in [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage)
- 10/21/2019: Release of [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SLES](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse)
- 10/16/2019: Fix broken links in [Backup and restore](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-backup-restore)
- 10/16/2019: Change the minimum recommended OS from SLES 12 SP3 to SLES 12 SP4 in [High availability of IBM Db2 LUW on Azure VMs on SUSE Linux Enterprise Server with Pacemaker](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms-guide-ha-ibm)
- 10/11/2019: Changes to Ultra disk storage configurations and introduction of ANF in [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage)
- 10/01/2019: Change in graphics of [Azure proximity placement groups for optimal network latency with SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-proximity-placement-scenarios) to get more clarity
- 10/01/2019: Change in [SAP HANA infrastructure configurations and operations on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations) to correct statements around highly available NFS share for /hana/shared. 
- 09/28/2019: Change in [Setting up Pacemaker on Red Hat Enterprise Linux in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-pacemaker) to clarify SBD as a fencing mechanism is not supported on RHEL clusters  
- 09/17/2019: Change in NetWeaver Planning and Deployment Guide to unify terms around VM Extension for SAP  
- 08/22/2019: Changes in [Setting up Pacemaker on SUSE Linux Enterprise Server in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker) to update the URLs for custom role creation  
- 08/16/2019: Changes in [Setting up Pacemaker on Red Hat Enterprise Linux in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-pacemaker) to remind customers to update the actions in the custom role, if updating to the new version of the Azure fence agent  
- 08/15/2019: Changes in [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage) to reflect General Availability of Ultra disk (formerly Ultra SSD)
- 08/01/2019: Changes to [Setting up Pacemaker on SUSE Linux Enterprise Server in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker) to integrate changes specifically for SLES 15 
- 07/23/2019: Changes in [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a file share in Azure](sap-high-availability-guide-wsfc-file-share.md) to reflect support of Storage Space Direct by Azure Site Recovery Services
- 07/14/2019: Release of [Azure Proximity Placement Groups for optimal network latency with SAP applications](sap-proximity-placement-scenarios.md)
- 07/11/2019: Changes in various documents covering HANA Large Instances to cover Revision 4 of HANA Large Instances
- 07/09/2019: Release of new guide for [IBM Db2 HADR in Red Hat Enterprise Server](high-availability-guide-rhel-ibm-db2-luw.md)
- 06/13/2019: Release of [High availability for SAP NetWeaver on Red Hat Enterprise Linux with Azure NetApp Files for SAP applications](high-availability-guide-rhel-netapp-files.md)


