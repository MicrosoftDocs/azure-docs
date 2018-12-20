---
title: SAP workload planning and deployment checklist | Microsoft Docs
description: checklist for planning and deployments of SAP workload on Azure
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: msjuergent
manager: patfilot
editor: ''
tags: azure-resource-manager
keywords: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 12/31/2018
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

#SAP workload on Azure planning and deployment checklist 

This checklist is designed for customers moving their to SAP NetWeaver, S/4HANA and Hybris applications to Azure Infrastructure as a Service.  This checklist should be reviewed together with a customer and SAP partner during the duration of of the project. it is important that a lot of the checks are conducted at the beginning of the project and in the planning phase. Once the deployment is done, elementary changes on deployed Azure infrastructure or SAP software releases can become complex. Review this checklist at key waypoints throughout a project.  Small problems can be detected before they become large problems and sufficient time is exists to re-engineer and test any necessary changes. The checklist in no ways claims to be complete. Dependent on your individual situation, there might be many more checks that need to be conducted. 

The checklist assembled does not include tasks that are independent of Azure.  Example: SAP application Interfaces change during a move to Azure Public Cloud or to a hosting provider.  Nothing specific to Azure will normally change and the SAP partner should normally handle validation of tasks that not Azure specific.  

This checklist can also be used for deployed customers. New features such as Write Accelerator, Availability Zones and new VM types may have been added since a customer deployed.  It is therefore useful to review the checklist periodically with large customers to ensure they are aware of new features in the platform. 

##Project preparation and planning phase
In this phase a migration of workload to Azure is planned. The minimum set of entities and items discussed and defined list like:

1. High Level Design Document – this document should contain: should contain:
	1. The current inventory of SAP components and applications and target application inventory on Azure
	2. A high level solution architecture
	3. Decision on Azure regions to deploy into. For a list of Azure regions, check the [Azure Regions](https://azure.microsoft.com/global-infrastructure/regions/). For services available in each of the Azure regions  check the article [products available per region](https://azure.microsoft.com/global-infrastructure/services/)
	4. Networking architecture to connect from on-premise into Azure. As a start make yourself familiar with the [Virtual Datacenter blueprint for Azure](https://docs.microsoft.com/azure/architecture/vdc/)
	5. Security principles for running high business impact data in Azure. For reading material start with [Azure Security Documentation](https://docs.microsoft.com/azure/security/)
2.	Technical Design Document – that contains:
	1.	A solution block diagram 
	2.	Sizing of compute, storage and networking components in Azure. For SAP sizing of Azure VMs consult SAP support note [#1928533](https://launchpad.support.sap.com/#/notes/1928533) 
	3.	Business Continuity and Disaster Recovery architecture
	4.	Detailed OS, DB, Kernel and SAP support pack versions. it is not a given that any OS release that is supported by SAP NetWeaver or  S/4HANA is supported on Azure VMs. Same is true for DBMS releases. It is mandatory that the following sources get checked in order to align and if necessary upgrade SAP releases, DBMS releases or OS releases in order to be in a SAP and Azure supported window. It is mandatory that you are within SAP and Azure supported release combinations to get full support by SAP and Microsoft. If necessary you need to plan for upgrading some of the software components. More details on supported SAP, OS and DBMS software is documented in these locations:
		1.	SAP support note [#1928533](https://launchpad.support.sap.com/#/notes/1928533). This note defines the minimum OS releases supported on Azure VMs. It also defines minimum database releases required for most non-HANA database. The note also presents the SAP sizing of the different SAP supported Azure VMs.
		2.	SAP support note [#2039619](https://launchpad.support.sap.com/#/notes/2039619). The note defines the Oracle support matrix on Azure
		3.	SAP support note [#2235581](https://launchpad.support.sap.com/#/notes/2235581) to get the support matrix for SAP HANA on the different OS releases
		4.	SAP HANA supported Azure VMs and [HANA Large Instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-architecture) are listed [here](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure)
		5.	[SAP Product Availability Matrix](https://support.sap.com/en/)
		6.	Other SAP notes for other SAP specific products	 
	5.	We recommend strict 3-Tier designs for SAP production systems. Combining ASCS + APP servers on the same VM is generally not recommended.  Servers hosting /sapmnt resources not to be used as File Servers for Interfaces or other purposes.    
3.	Customer/Partner should create an inventory of all SAP interfaces (SAP and non-SAP). 
4.	Design of Foundation Services Design - these would include items like
	1.	Active Directory and DSN design
	2.	Network topology within Azure and assignment of different SAP systems
	3.	[Role based access](https://docs.microsoft.com/azure/role-based-access-control/overview) structure for different teams in Azure
	3.	Resource Group topology 
	4.	Tagging strategy
	5.	Naming Convention for VMs and other infrastructure components and/or logical names
5.	Microsoft Premier Support Contract – identify MS Technical Account Manager (TAM). for support requirements by SAP read SAP support note [#2015553](https://launchpad.support.sap.com/#/notes/2015553) 
6.	Define number of Azure subscriptions and core quota for the different subscriptions. [Open support requests to increase quotas of Azure subscriptions](https://docs.microsoft.com/azure/azure-supportability/resource-manager-core-quotas-request) as necessary 
7.	Data Reduction and data migration plan for migrating SAP data into Azure. For SAP NetWeaver systems, SAP has guidelines on how to keep the volume of a large number of data limited. SAP published [this profound guide](https://help.sap.com/http.svc/rc/2eb2fba8f8b1421c9a37a8d7233da545/7.0/en-US/Data_Management_Guide_Version_70E.PDF)
8.	Define and decide automated deployment approach. Goal of automation behind infrastructure deployments on Azure is to deploy in a deterministic manner and get deterministic results. A lot of customers use Power Shell or CLI based scripts. But there are various open source technologies that can be used to deploy Azure infrastructure for SAP and even install SAP software. Examples can be found in github:
	1.	[Automated SAP Deployments in Azure Cloud](https://github.com/Azure/sap-hana)
	2.	[SAP HANA ARM Installation](https://github.com/AzureCAT-GSI/SAP-HANA-ARM)
9.	Define a regular design and deployment review cadence between you as customer, system integrator, Microsoft and other involved parties 
 
##Pilot Phase (Optional) 
The pilot can run before or in parallel to project planning and preparation. The phase can also be used to test approaches and design made in the planning and preparation phase. The pilot phase can be stretched to a real proof of concepts. It is recommended to setup and validate a full HA/DR solution as well as security design during a pilot deployment. In some customer cases, scalability tests also can be conducted in this phase. Other customers use deployment of SAP sandbox systems as pilot phase. So we assume you identified a system that you want to migrate into Azure

1.	Optimize data transfer into Azure. Highly dependent on customer cases transfer through [Azure ExpressRoute](https://azure.microsoft.com/en-us/services/expressroute/) from on-premise was fastest if the Express Circuit had enough bandwidth. With other customers, going through internet figured out to be faster
2.	Test and define whether you want to create own OS images for your VMs in Azure or whether you want to use an image out of the Azure Image gallery. If you are using an image out of the Azure gallery make sure that you take the correct image that reflect the support contract with your OS vendor. For some OS vendors Azure galleries offer bring your own license images. for others OS support is includes in the price
	1.	You can build a generalized image of a Windows VM deployed in Azure based on [this documentation](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource)
	2.	You can build a generalized image of a Linux VM deployed in Azure based on [this documentation](https://docs.microsoft.com/azure/virtual-machines/linux/capture-image)
3.	In case of a SAP heterogeneous platform migration that involves an export and import of the database data test and optimize export and import phases. For large migrations involving SQL Server as the destination platform recommendations can be found [here](https://blogs.msdn.microsoft.com/saponsqlserver/2017/05/08/sap-osdb-migration-to-sql-server-faq-v6-2-april-2017/). You can take the approach of Migration Monitor in case you don't need a combined release upgrade or SAP DMO process when you combine the migration with a SAP release upgrade
	1.  Export Export, Export file upload to Azure and Import performance.  Maximize overlap between export and import
	2.  Evaluate volume of database between target and destination platform in order to reflect in the infrastructure sizing	
	3.  Validate and optimize timing 
4.	Technical Validation 
	1.	VM Types
		1.	Validate the resources on SAP support notes, SAP HANA hardware directory and SAP PAM again to make sure that there were no changes in supported VMs for Azure, supported OS releases in those VMs and supported SAP and DBMS releases
		2.	Validate again the sizing of your application and the infrastructure you deploy on Azure. In case of moving existing applications you often can derive the necessary SAPS from the infrastructure you use and the [SAP benchmark webpage](https://www.sap.com/dmc/exp/2018-benchmark-directory/#/sd) and compare it to the SAPS numbers listed in SAP support note [#1928533](https://launchpad.support.sap.com/#/notes/1928533). Also keep [this article](https://blogs.msdn.microsoft.com/saponsqlserver/2018/11/04/saps-ratings-on-azure-vms-where-to-look-and-where-you-can-get-confused/) in mind
		3.	Evaluate and test the sizing of your Azure VMs in regards to maximum storage throughput and network throughput of the different VM types you chose in the planning phase. The data can be found in:
			1.	[Sizes for Windows virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json). It is important to consider the **max uncached disk throughput** for sizing
			2.	[Sizes for Linux virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json) It is important to consider the **max uncached disk throughput** for sizing
	2.	Storage
		1.	Use Azure Premium Storage for Database VMs
		2.	Use [Azure managed disks](https://azure.microsoft.com/services/managed-disks/)
		3.	Use Azure Write Accelerator for DBMS log drives with M-Series. Be aware of Write accelerator limits and usage as documented in [Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/linux/how-to-enable-write-accelerator)
		4.	For the different DBMS types check the [generic SAP releated DBMS documentation](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general) and the 
a.	VM Types are certified as per Note 1928533 - SAP Applications on Azure - Supported Products and Azure VM types
b.	DB & APP VMs are on the same vNet and no traffic redirection or inspection between DB & APP VMs
c.	Run /SSA/CAT in SE38 and record results – target range for DB Acc and E DB Acc = 50-60 for VMs
d.	Accelerated Networking enabled 
e.	Write Accelerator enabled (Hana DB /log only) 
f.	Validate Linux Kernel and package updates against “Known good” configurations. Update Windows OS to latest available patch 
g.	Ensure DB version is up to date and supported in SAP PAM 
h.	ASC or NSG protect DB & APP server – NFS, Netbios and DBMS blocked. OS level firewall enabled 
i.	Confirm disk configuration – Premium Storage should always be used for DBMS servers.  Managed Disks used.  File System type and block size correct.  For Hana follow template #8
3.	Azure platform availability check 
a.	Open Support Request to Microsoft support
i.	List all VMs & RG 
ii.	Ask Support to check for unplanned reboots in Azure Support Center -> Health 
iii.	Analyze any unplanned reboots – determine if root cause is Azure Platform or Guest OS 
iv.	Ensure Guest Agents are up to date – Win & Linux – check monitoring in Azure Portal is working  
b.	VM Pinning based on /SSA/CAT results (if required) 
4.	Security Check 
a.	RBAC concept implemented.  Super users protected.  2FA for admins
b.	Lock Resources to prevent accidental deletion of SAP objects 
c.	Verify NSG and ASC 
d.	DB encryption, DBMS TDE and Keyvault configuration (for SQL Server see here) 
e.	ADE for boot disks and/or disks containing SSFS to prevent cloning 
f.	Check that too many layers of encryption have not been used (SSE, ADE & DBMS layer in combination not recommended)
5.	Network 
a.	NVA / Firewall – Checkpoint, Fortigate, Palo Alto HA test completed 
b.	Hub & Spoke Peer vNet topology recommended 
c.	Basic vs. Standard ILB – recommend Standard AZ aware 
d.	Load balancer config – Backend/Frontend pools, probe ports and timeouts set correctly
e.	Network Placement Groups 
6.	Backup/Restore & DBA Tasks 
a.	Backup throughput adequate 
b.	Restore throughput adequate
c.	Confirm Backup Storage Georedundancy requirements  
d.	Check DB integrity runtime 
7.	HA/DR Testing 
a.	Guest OS clustering (Windows or Linux) 
b.	DBMS failover tests pass
c.	ASCS failover tests pass
d.	ASR – Test Recovery Plans (no more than 10 VMs per Recovery Plan) 
e.	AZ vs. AS concepts explained to customer & partner 
f.	Customers relying on Single VM SLA – ensure SAP and DBMS set to Autostart and other mitigations  
g.	Check cluster timeout values (Win & Linux) and brief customer on OS Cluster + VM-PHU conflicts 
8.	Performance Testing 
a.	Compare top 10 online reports to current on-prem 
b.	Compare top 10 batch jobs to current on-prem 
c.	Compare top 10 BDC or interface to current on-prem 
 
Non-Production Phase 
Migrate Development, QAS and PreProd to Azure.  It is recommended that PreProd should have HA  
1.	OS/DB Migration or DMO Throughput & Sizing Validation 
a.	Confirm Export, Dump file upload to Azure and Import performance.  Ensure file upload is fast
b.	Confirm Source -> Target DB compression ratio 
c.	Validate sizing for Migration or DMO vs. normal “run” sizing – huge sizing to be used for migration 
2.	Technical Validation 
a.	VM Types are certified as per Note 1928533 - SAP Applications on Azure - Supported Products and Azure VM types
b.	DB & APP VMs are on the same vNet and no traffic redirection or inspection between DB & APP VMs
c.	Run /SSA/CAT in SE38 and record results – target range for DB Acc and E DB Acc = 50-60 for VMs
d.	Accelerated Networking enabled 
e.	Write Accelerator enabled (Hana DB /log only) 
f.	Validate Linux Kernel and package updates against “Known good” configurations. Update Windows OS to latest available patch 
g.	Ensure DB version is up to date and supported in SAP PAM 
h.	ASC or NSG protect DB & APP server – NFS, Netbios and DBMS blocked. OS level firewall enabled 
i.	Confirm disk configuration – Premium Storage should always be used for DBMS servers.  Managed Disks used.  File System type and block size correct.  For Hana follow template #8
3.	Azure platform availability check 
a.	Open Support Request to Microsoft support
i.	List all VMs & RG 
ii.	Ask Support to check for unplanned reboots in Azure Support Center -> Health 
iii.	Analyze any unplanned reboots – determine if root cause is Azure Platform or Guest OS 
iv.	Ensure Guest Agents are up to date – Win & Linux – check monitoring in Azure Portal is working  
b.	VM network affinity based on /SSA/CAT results (if required) 
4.	Security Check 
a.	RBAC concept implemented.  Super users protected.  2FA for admins
b.	Lock Resources to prevent accidental deletion of SAP objects 
c.	Verify NSG and ASC 
d.	DB encryption, DBMS TDE and Keyvault configuration (for SQL Server see here) 
e.	ADE for boot disks and/or disks containing SSFS to prevent cloning 
f.	Check that too many layers of encryption have not been used (SSE, ADE & DBMS layer in combination not recommended)
5.	Network 
a.	NVA / Firewall – Checkpoint, Fortigate, Palo Alto HA test completed 
b.	Hub & Spoke Peer vNet topology recommended 
c.	Basic vs. Standard ILB – recommend Standard AZ aware 
d.	Load balancer config – Backend/Frontend pools, probe ports and timeouts set correctly
e.	Network Placement Groups 
6.	Backup/Restore & DBA Tasks 
a.	Backup throughput adequate 
b.	Restore throughput adequate
c.	Confirm Backup Storage Georedundancy requirements  
d.	Check DB integrity runtime 
7.	HA/DR Testing 
a.	Guest OS clustering (Windows or Linux) 
b.	DBMS failover tests pass
c.	ASCS failover tests pass
d.	ASR – Test Recovery Plans (no more than 10 VMs per Recovery Plan) 
e.	AZ vs. AS concepts explained to customer & partner 
f.	Customers relying on Single VM SLA – ensure SAP and DBMS set to Autostart and other mitigations  
g.	Check cluster timeout values (Win & Linux) and brief customer on OS Cluster + VM-PHU conflicts 
8.	Performance Testing 
a.	Compare top 10 online reports to current on-prem 
b.	Compare top 10 batch jobs to current on-prem 
c.	Compare top 10 BDC or interface to current on-prem 
d.	Technical testing of interfaces
e.	Optional: Run load generation tools, simulating concurrent users executing a selection of the top transactions

 
Production Preparation Phase 
Confirm Production Migration Sequencing (Phased Go Live or Big Bang) 
Prior to Production go live a “Dry run” test cycle should be completed to optimize timing and sequencing 
1.	OS/DB Migration or DMO Throughput & Sizing Validation 
a.	Confirm Export, Dump file upload to Azure and Import performance.  Ensure file upload is fast
b.	Confirm Source -> Target DB compression ratio 
c.	Validate sizing for Migration or DMO vs. normal “run” sizing – huge sizing to be used for migration 
2.	Technical Validation 
a.	VM Types are certified as per Note 1928533 - SAP Applications on Azure - Supported Products and Azure VM types
b.	DB & APP VMs are on the same vNet and no traffic redirection or inspection between DB & APP VMs
c.	Run /SSA/CAT in SE38 and record results – target range for DB Acc and E DB Acc = 50-60 for VMs
d.	Accelerated Networking enabled 
e.	Write Accelerator enabled (Hana DB /log only) 
f.	Validate Linux Kernel and package updates against “Known good” configurations. Update Windows OS to latest available patch 
g.	Ensure DB version is up to date and supported in SAP PAM 
h.	ASC or NSG protect DB & APP server – NFS, Netbios and DBMS blocked. OS level firewall enabled 
i.	Confirm disk configuration – Premium Storage should always be used for DBMS servers.  Managed Disks used.  File System type and block size correct.  For Hana follow template #8
3.	Azure platform availability check 
a.	Open Support Request to Microsoft support
i.	List all VMs & RG 
ii.	Ask Support to check for unplanned reboots in Azure Support Center -> Health 
iii.	Analyze any unplanned reboots – determine if root cause is Azure Platform or Guest OS 
iv.	Ensure Guest Agents are up to date – Win & Linux – check monitoring in Azure Portal is working  
b.	VM network affinity based on /SSA/CAT results (if required) 
4.	Security Check 
a.	RBAC concept implemented.  Super users protected.  2FA for admins
b.	Lock Resources to prevent accidental deletion of SAP objects 
c.	Verify NSG and ASC 
d.	DB encryption, DBMS TDE and Keyvault configuration (for SQL Server see here) 
e.	ADE for boot disks and/or disks containing SSFS to prevent cloning 
f.	Check that too many layers of encryption have not been used (SSE, ADE & DBMS layer in combination not recommended)
5.	Network 
a.	NVA / Firewall – Checkpoint, Fortigate, Palo Alto HA test completed 
b.	Hub & Spoke Peer vNet topology recommended 
c.	Basic vs. Standard ILB – recommend Standard AZ aware 
d.	Load balancer config – Backend/Frontend pools, probe ports and timeouts set correctly
e.	Network Placement Groups 
6.	Backup/Restore & DBA Tasks 
a.	Backup throughput adequate 
b.	Restore throughput adequate
c.	Confirm Backup Storage Georedundancy requirements  
d.	Check DB integrity runtime 
7.	HA/DR Testing 
a.	Guest OS clustering (Windows or Linux) 
b.	DBMS failover tests pass
c.	ASCS failover tests pass
d.	ASR – Test Recovery Plans (no more than 10 VMs per Recovery Plan) 
e.	AZ vs. AS concepts explained to customer & partner 
f.	Customers relying on Single VM SLA – ensure SAP and DBMS set to Autostart and other mitigations  
g.	Check cluster timeout values (Win & Linux) and brief customer on OS Cluster + VM-PHU conflicts 
8.	Performance Testing 
a.	Compare top 10 online reports to current on-prem 
b.	Compare top 10 batch jobs to current on-prem 
c.	Compare top 10 BDC or interface to current on-prem 
d.	Technical testing of interfaces
e.	Optional: Run load generation tools, simulating concurrent users executing a selection of the top transactions

 
Go Live Phase 

A.R.R https://azure.microsoft.com/en-gb/support/plans/premier/ 
Azure High Priority http://aka.ms/hiprevents  Program Overview 
Azure CAT on-call for large customer go live
Verify that Azure Portal Monitoring and other monitoring tools are working.  Recommend Perfmon or SAR: 
1.	CPU Counters 
a.	Average CPU time – Total (all CPU)
b.	Average CPU time – each individual processor (so 128 processors on m128 VM)
c.	CPU time kernel – each individual processor
d.	CPU time user – each individual processor
2.	Memory
a.	Free memory
b.	Memory Page in/sec
c.	Memory Page out/sec 
3.	Disk 
a.	Disk read kb/sec – per individual disk 
b.	Disk reads/sec  – per individual disk
c.	Disk read ms/read – per individual disk
d.	Disk write kb/sec – per individual disk 
e.	Disk write/sec  – per individual disk
f.	Disk write ms/read – per individual disk
4.	Network 
a.	Network packets in/sec
b.	Network packets out/sec
c.	Network kb in/sec
d.	Network kb out/sec 

Very large customers might need to use Azure Databox or other data transfer tools.  This is case by case basis 
 
Operations & Maintenance Phase 

Monitoring and Operations tools and processes – customer should have at least one enterprise monitoring tool in addition to Solution Manager 
Billing / Resource Tagging 
Planned maintenance / reboot processes and procedures 
Customer Capacity monitoring & management 
Ongoing review and optimization – Premier Support, ATS and CSA 




Appendix I
Hana Large Instances Customers should review this Checklist 
