---
title: Get started with SAP on Azure VMs | Microsoft Docs
description: Learn about SAP solutions that run on virtual machines (VMs) in Microsoft Azure
services: virtual-machines-sap
ms.service: virtual-machines-sap
documentationcenter: ''
author: msjuergent
manager: bburns
editor: ''
tags: azure-resource-manager
keywords: ''
ms.assetid: ad8e5c75-0cf6-4564-ae62-ea1246b4e5f2
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 04/21/2021
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
- Is the Red Hat kernel in Oracle Enterprise Linux supported by SAP? Read SAP [SAP support note #1565179](https://launchpad.support.sap.com/#/notes/1565179)
- Why are the Azure [Da(s)v4](../../dav4-dasv4-series.md)/[Ea(s)](../../eav4-easv4-series.md) VM families not certified for SAP HANA? The Azure Das/Eas VM families are based on AMD processor driven hardware. SAP HANA does not support AMD processors, not even in virtualized scenarios
- Why am I still getting the message: 'The cpu flags for the RDTSCP instruction or the cpu flags for constant_tsc or nonstop_tsc are not set or current_clocksource and available_clocksource are not correctly configured' with SAP HANA, despite the fact that I am running the most recent Linux kernels. For the answer, check [SAP support note #2791572](https://launchpad.support.sap.com/#/notes/2791572)
- Where can I find architectures for deploying SAP Fiori on Azure? Check out the blog [SAP on Azure: Application Gateway Web Application Firewall (WAF) v2 Setup for Internet facing SAP Fiori Apps](https://blogs.sap.com/2020/12/03/sap-on-azure-application-gateway-web-application-firewall-waf-v2-setup-for-internet-facing-sap-fiori-apps/) 

 
## SAP HANA on Azure (Large Instances)

A series of documents leads you through SAP HANA on Azure (Large Instances), or for short, HANA Large Instances. For information on HANA Large Instances, start with the document [Overview and architecture of SAP HANA on Azure (Large Instances)](./hana-overview-architecture.md) and go through the related documentation in the HANA Large Instance section



## SAP HANA on Azure virtual machines
This section of the documentation covers different aspects of SAP HANA. As a prerequisite, you should be familiar with the principal services of Azure that provide elementary services of Azure IaaS. So, you need knowledge of Azure compute, storage, and networking. Many of these subjects are handled in the SAP NetWeaver-related [Azure planning guide](./planning-guide.md). 

 

## SAP NetWeaver deployed on Azure virtual machines
This section lists planning and deployment documentation for SAP NetWeaver, SAP LaMa and Business One on Azure. The documentation focuses on the basics and the use of non-HANA databases with an SAP workload on Azure. The documents and articles for high availability are also the foundation for SAP HANA high availability in Azure

## SAP NetWeaver and S/4HANA high availability
High Availability of SAP application layer and DBMS is documented into the details starting with the document [Azure Virtual Machines high availability for SAP NetWeaver](./sap-high-availability-guide-start.md)



## Integrate Azure AD with SAP Services
In this section, you can find information in how to configure SSO with most of the SAP SaaS and PaaS services, NetWeaver, and Fiori 



## Documentation on integration of Azure services into SAP components
In this section, you find documents about Microsoft Power BI integration into SAP data sources as well as Azure Data Factory integration into SAP BW.



## Change Log
- 04/21/2021: Add explanation why HCMT/HWCCT storage tests on M32ts and M32ls might fall short of HANA KPIs when enabling read cache for the Premium storage disks in article [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md)
- 04/20/2021: Clarify storage block sizes for IBM Db2 with different Azure block storage in article [IBM Db2 Azure Virtual Machines DBMS deployment for SAP workload](./dbms_guide_ibm.md)
- 04/12/2021: Change in [HA for SAP HANA on Azure VMs on SLES](./sap-hana-high-availability.md), [HA for SAP HANA on Azure VMs on RHEL](./sap-hana-high-availability-rhel.md) and [HA for SAP HANA scale-up with ANF on RHEL](./sap-hana-high-availability-netapp-files-red-hat.md) to add configuration instructions for SAP HANA system replication Python hook  
- 04/12/2021: Replaced backup documentation for SAP HANA by documents of [SAP HANA backup/restore with Azure Backup service](../../../backup/sap-hana-db-about.md) 
- 04/12/2021: Release of [SAP HANA scale-out HSR with Pacemaker on Azure VMs on SLES](./sap-hana-high-availability-scale-out-hsr-suse.md) configuration guide
- 04/07/2021: Clarified support for SQL Server multi-instance and multi-database support in [SQL Server Azure Virtual Machines DBMS deployment for SAP NetWeaver](./dbms_guide_sqlserver.md)
- 04/07/2021: Added information related to secondary IP addresses in [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md)
- 04/07/2021: added support for Oracle DBMS support on ANF in [Azure Storage types for SAP workload](./planning-guide-storage.md)
- 03/17/2021: Change in [HA for SAP HANA on Azure VMs on SLES](./sap-hana-high-availability.md), [HA for SAP HANA on Azure VMs on RHEL](./sap-hana-high-availability-rhel.md) and [HA for SAP HANA scale-up with ANF on RHEL](./sap-hana-high-availability-netapp-files-red-hat.md) to add instructions for HANA Active/Read-enabled system replication in Pacemaker cluster
- 03/15/2021: Change in [SAP ASCS/SCS instance with WSFC and file share](./sap-high-availability-guide-wsfc-file-share.md),[Install SAP ASCS/SCS instance with WSFC and file share](./sap-high-availability-installation-wsfc-file-share.md) and [SAP ASCS/SCS multi-SID with WSFC and file share](./sap-ascs-ha-multi-sid-wsfc-file-share.md) to clarify that the SAP ASCS/SCS instances and the SOFS share must be deployed in separate clusters
- 03/03/2021: Change in [HA guide for SAP ASCS/SCS with WSFC and Azure NetApp Files(SMB)](./high-availability-guide-windows-netapp-files-smb.md) to add a cautionary statement that elevated privileges are required for the user running SWPM, during the installation of the SAP system
- 02/11/2021: Changes in [High availability of IBM Db2 LUW on Azure VMs on Red Hat Enterprise Linux Server](./high-availability-guide-rhel-ibm-db2-luw.md) to amend pacemaker cluster commands for RHEL 8.x
- 02/03/2021: Change in [Setting up Pacemaker on RHEL in Azure](./high-availability-guide-rhel-pacemaker.md) to update  pcmk_host_map in the stonith create command
- 02/03/2021: Change in [Setting up Pacemaker on SLES in Azure](./high-availability-guide-suse-pacemaker.md) to add pcmk_host_map in the stonith create command 
- 02/03/2021: More details on I/O scheduler settings for SUSE in article [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md)
- 02/01/2021: Change in [HA for SAP HANA scale-up with ANF on RHEL](./sap-hana-high-availability-netapp-files-red-hat.md), [SAP HANA scale-out HSR with Pacemaker on Azure VMs on RHEL](./sap-hana-high-availability-scale-out-hsr-rhel.md), [SAP HANA scale-out with standby node on Azure VMs with ANF on SLES](./sap-hana-scale-out-standby-netapp-files-suse.md) and [SAP HANA scale-out with standby node on Azure VMs with ANF on RHEL](./sap-hana-scale-out-standby-netapp-files-rhel.md) to add a link to [NFS v4.1 volumes on Azure NetApp Files for SAP HANA](./hana-vm-operations-netapp.md)
- 01/23/2021: Introduce the functionality of HANA data volume partitioning as functionality to stripe I/O operations against HANA data files across different Azure disks or NFS shares without using a disk volume manager in articles [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md) and [NFS v4.1 volumes on Azure NetApp Files for SAP HANA](./hana-vm-operations-netapp.md)
- 01/18/2021: Added support of Azure net Apps Files based NFS for Oracle in [Azure Virtual Machines Oracle DBMS deployment for SAP workload](./dbms_guide_oracle.md) and adjusting decimals in table in document [NFS v4.1 volumes on Azure NetApp Files for SAP HANA](./hana-vm-operations-netapp.md)
- 01/11/2021: Minor changes in [HA for SAP NW on Azure VMs on RHEL for SAP applications](./high-availability-guide-rhel.md), [HA for SAP NW on Azure VMs on RHEL with ANF](./high-availability-guide-rhel-netapp-files.md) and [HA for SAP NW on Azure VMs on RHEL multi-SID guide](./high-availability-guide-rhel-multi-sid.md) to adjust commands to work for both RHEL8 and RHEL7, and ENSA1 and ENSA2
- 01/05/2021: Changes in [SAP HANA scale-out with standby node on Azure VMs with ANF on SLES](./sap-hana-scale-out-standby-netapp-files-suse.md) and [SAP HANA scale-out with standby node on Azure VMs with ANF on RHEL](./sap-hana-scale-out-standby-netapp-files-rhel.md), revising the recommended configuration to allow SAP Host Agent to manage the local port range  
- 01/04/2021: Add new Azure regions supported by HLI into [What is SAP HANA on Azure (Large Instances)](./hana-overview-architecture.md)
- 12/29/2020: Add architecture recommendations for specific Azure regions in [SAP workload configurations with Azure Availability Zones](./sap-ha-availability-zones.md)
- 12/21/2020: Add new certifications to SKUs of HANA Large Instances in [Available SKUs for HLI](./hana-available-skus.md)
- 12/12/2020: Added pointer to SAP note clarifying details on Oracle Enterprise Linux support by SAP to [What SAP software is supported for Azure deployments](./sap-supported-product-on-azure.md#oracle-dbms-support)
- 11/26/2020: Adapt [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md) and [Azure Storage types for SAP workload](./planning-guide-storage.md) to changed single [VM SLAs](https://azure.microsoft.com/support/legal/sla/virtual-machines)
- 11/05/2020: Changing link to new SAP note about HANA supported file system types in [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md) 
- October 26, 2020: Changing some tables for Azure premium storage configuration to clarify provisioned versus burst throughput in [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md)
- October 22, 2020: Change in [HA for SAP NW on Azure VMs on SLES for SAP applications](./high-availability-guide-suse.md), [HA for SAP NW on Azure VMs on SLES with ANF](./high-availability-guide-suse-netapp-files.md), [HA for SAP NW on Azure VMs on RHEL for SAP applications](./high-availability-guide-rhel.md) and [HA for SAP NW on Azure VMs on RHEL with ANF](./high-availability-guide-rhel-netapp-files.md) to adjust the recommendation for net.ipv4.tcp_keepalive_time  
- October 16, 2020: Change in [HA of IBM Db2 LUW on Azure VMs on SLES with Pacemaker](./dbms-guide-ha-ibm.md), [HA for SAP NW on Azure VMs on RHEL for SAP applications](./high-availability-guide-rhel.md), [HA of IBM Db2 LUW on Azure VMs on RHEL](./high-availability-guide-rhel-ibm-db2-luw.md), [HA for SAP NW on Azure VMs on RHEL multi-SID guide](./high-availability-guide-rhel-multi-sid.md), [HA for SAP NW on Azure VMs on RHEL with ANF](./high-availability-guide-rhel-netapp-files.md), [HA for SAP NW on Azure VMs on SLES for SAP applications](./high-availability-guide-suse.md), [HA for SAP NNW on Azure VMs on SLES multi-SID guide](./high-availability-guide-suse-multi-sid.md), [HA for SAP NW on Azure VMs on SLES with ANF for SAP applications](./high-availability-guide-suse-netapp-files.md), [HA for NFS on Azure VMs on SLES](./high-availability-guide-suse-nfs.md), [HA of SAP HANA on Azure VMs on SLES](./sap-hana-high-availability.md), [HA for SAP HANA scale-up with ANF on RHEL](./sap-hana-high-availability-netapp-files-red-hat.md), [HA of SAP HANA on Azure VMs on RHEL](./sap-hana-high-availability-rhel.md), [SAP HANA scale-out HSR with Pacemaker on Azure VMs on RHEL](./sap-hana-high-availability-scale-out-hsr-rhel.md), [Prepare Azure infrastructure for SAP ASCS/SCS with WSFC and shared disk](./sap-high-availability-infrastructure-wsfc-shared-disk.md), [multi-SID HA guide for SAP ASCS/SCS with WSFC and Azure shared disk](./sap-ascs-ha-multi-sid-wsfc-azure-shared-disk.md) and [multi-SID HA guide for SAP ASCS/SCS with WSFC and shared disk](./sap-ascs-ha-multi-sid-wsfc-shared-disk.md) to add a statement that floating IP is not supported in load-balancing scenarios on secondary IPs 
- October 16, 2020: Adding documentation to control storage snapshots of HANA Large Instances in [Backup and restore of SAP HANA on HANA Large Instances](./hana-backup-restore.md)
- October 15, 2020: Release of SAP BusinessObjects BI Platform on Azure documentation, [SAP BusinessObjects BI platform planning and implementation guide on Azure](businessobjects-deployment-guide.md) and [SAP BusinessObjects BI platform deployment guide for linux on Azure](businessobjects-deployment-guide-linux.md)
- October 05, 2020: Release of [SAP HANA scale-out HSR with Pacemaker on Azure VMs on RHEL](./sap-hana-high-availability-scale-out-hsr-rhel.md) configuration guide
- September 30, 2020: Change in [High availability of SAP HANA on Azure VMs on RHEL](./sap-hana-high-availability-rhel.md), [HA for SAP HANA scale-up with ANF on RHEL](./sap-hana-high-availability-netapp-files-red-hat.md) and [Setting up Pacemaker on RHEL in Azure](./high-availability-guide-rhel-pacemaker.md) to adapt the instructions for RHEL 8.1
- September 29, 2020: Making restrictions and recommendations around usage of PPG more obvious in the article [Azure proximity placement groups for optimal network latency with SAP applications](./sap-proximity-placement-scenarios.md) 
- September 28, 2020: Adding a new storage operation guide for SAP HANA using Azure NetApp Files with the document [NFS v4.1 volumes on Azure NetApp Files for SAP HANA](./hana-vm-operations-netapp.md)
- September 23, 2020: Add new certified SKUs for HLI in [Available SKUs for HLI](./hana-available-skus.md) 
- September 20, 2020: Changes in documents [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](./dbms_guide_general.md), [SQL Server Azure Virtual Machines DBMS deployment for SAP NetWeaver](./dbms_guide_sqlserver.md), [Azure Virtual Machines Oracle DBMS deployment for SAP workload](./dbms_guide_oracle.md), [IBM Db2 Azure Virtual Machines DBMS deployment for SAP workload](./dbms_guide_ibm.md) to adapt to new configuration suggestion that recommends separation of DBMS binaries and SAP binaries into different Azure disks. Also adding Ultra disk recommendations to the different guides.
- September 08, 2020: Change in [High availability of SAP HANA on Azure VMs on SLES](./sap-hana-high-availability.md) to clarify stonith definitions
- September 03, 2020: Change in [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md) to adapt to minimal 2 IOPS per 1 GB capacity with Ultra disk
- September 02, 2020: Change in [Available SKUs for HLI](./hana-available-skus.md) to get more transparent in what SKUs are HANA certified
- August 25, 2020: Change in [HA for SAP NW on Azure VMs on SLES with ANF](./high-availability-guide-suse-netapp-files.md) to fix typo
- August 25, 2020: Change in [HA guide for SAP ASCS/SCS with WSFC and shared disk](./sap-high-availability-guide-wsfc-shared-disk.md), [Prepare Azure infrastructure for SAP ASCS/SCS with WSFC and shared disk](./sap-high-availability-infrastructure-wsfc-shared-disk.md) and [Install SAP NW HA with WSFC and shared disk](./sap-high-availability-guide-wsfc-shared-disk.md) to introduce the option of using Azure shared disk and document SAP ERS2 architecture
- August 25, 2020: Release of [multi-SID HA guide for SAP ASCS/SCS with WSFC and Azure shared disk](./sap-ascs-ha-multi-sid-wsfc-azure-shared-disk.md)
- August 25, 2020: Change in [HA guide for SAP ASCS/SCS with WSFC and Azure NetApp Files(SMB)](./high-availability-guide-windows-netapp-files-smb.md), [Prepare Azure infrastructure for SAP ASCS/SCS with WSFC and file share](./sap-high-availability-infrastructure-wsfc-file-share.md), [multi-SID HA guide for SAP ASCS/SCS with WSFC and shared disk](./sap-ascs-ha-multi-sid-wsfc-shared-disk.md) and [multi-SID HA guide for SAP ASCS/SCS with WSFC and SOFS file share](./sap-ascs-ha-multi-sid-wsfc-file-share.md) as a result of the content updates and restructuring in the HA guides for SAP ASCS/SCS with WFC and shared disk 
- August 21, 2020: Adding new OS release into [Compatible Operating Systems for HANA Large Instances](./os-compatibility-matrix-hana-large-instance.md) as available operating system for HLI units of type I and II
- August 18, 2020: Release of [HA for SAP HANA scale-up with ANF on RHEL](./sap-hana-high-availability-netapp-files-red-hat.md)
- August 17, 2020: Add information about using Azure Site Recovery for moving SAP NetWeaver systems from on-premises to Azure in article [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md)
- 08/14/2020: Adding disk configuration advice for Db2 in article [IBM Db2 Azure Virtual Machines DBMS deployment for SAP workload](./dbms_guide_ibm.md)
- August 11, 2020: Adding RHEL 7.6 into [Compatible Operating Systems for HANA Large Instances](./os-compatibility-matrix-hana-large-instance.md) as available operating system for HLI units of type I
- August 10, 2020: Introducing cost conscious SAP HANA storage configuration in [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md) and making some updates to [SAP workloads on Azure: planning and deployment checklist](./sap-deployment-checklist.md)
- August 04, 2020: Change in [Setting up Pacemaker on SLES in Azure](./high-availability-guide-suse-pacemaker.md) and [Setting up Pacemaker on RHEL in Azure](./high-availability-guide-rhel-pacemaker.md) to emphasize the importance of reliable name resolution for Pacemaker clusters
- August 04, 2020: Change in [SAP NW HA on WFCS with file share](./sap-high-availability-installation-wsfc-file-share.md), [SAP NW HA on WFCS with shared disk](./sap-high-availability-installation-wsfc-shared-disk.md), [HA for SAP NW on Azure VMs](./high-availability-guide.md), [HA for SAP NW on Azure VMs on SLES](./high-availability-guide-suse.md), [HA for SAP NW on Azure VMs on SLES with ANF](./high-availability-guide-suse-netapp-files.md), [HA for SAP NW on Azure VMs on SLES multi-SID guide](./high-availability-guide-suse-multi-sid.md), [High availability for SAP NetWeaver on Azure VMs on RHEL](./high-availability-guide-rhel.md), [HA for SAP NW on Azure VMs on RHEL with ANF](./high-availability-guide-rhel-netapp-files.md) and [HA for SAP NW on Azure VMs on RHEL multi-SID guide](./high-availability-guide-rhel-multi-sid.md) to clarify the use of parameter `enque/encni/set_so_keepalive`
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
- May 11, 2020: Change in [High availability of SAP HANA on Azure VMs on SLES](./sap-hana-high-availability.md) to set resource stickiness to 0 for the `netcat` resource, as that leads to more streamlined failover 
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
