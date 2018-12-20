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

SAP workload on Azure planning and deployment checklist 

This checklist is designed for customers moving their to SAP NetWeaver, S/4HANA and Hybris applications to Azure Infrastructure as a Service.  This checklist should be reviewed together with a customer and SAP partner during the duration of of the project. it is important that a lot of the checks are conducted at the beginning of the project and in the planning phase. Once the deployment is done, elementary changes on deployed Azure infrastructure or SAP software releases can become complex. Review this checklist at key waypoints throughout a project.  Small problems can be detected before they become large problems and sufficient time is exists to re-engineer and test any necessary changes. The checklist in no ways claims to be complete. Dependent on your individual situation, there might be many more checks that need to be conducted. 

The checklist assembled does not include tasks that are independent of Azure.  Example: SAP application Interfaces change during a move to Azure Public Cloud or to a hosting provider.  Nothing specific to Azure will normally change and the SAP partner should normally handle validation of tasks that not Azure specific.  

This checklist can also be used for deployed customers. New features such as Write Accelerator, Availability Zones and new VM types may have been added since a customer deployed.  It is therefore useful to review the checklist periodically with large customers to ensure they are aware of new features in the platform. 

Project preparation and planning phase
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
	4.	Detailed OS, DB, Kernel and SAP support pack versions. it is not a given that any OS release that is supported by SAP NetWeaver or  S/4HANA is supported on Azure VMs. Same is true for DBMS releases. it is mandatory that the following sources get checked in order to align and if necessary upgrade SAP releases, DBMS releases or OS releases in order to be in a SAP and Azure supported window:
		1.	SAP support note [#1928533](https://launchpad.support.sap.com/#/notes/1928533). This note defines the minimum OS releases supported on Azure VMs. It also defines minimum database releases required for most non-HANA database. The note also presents the SAP sizing of the different SAP supported Azure VMs.
		2.	SAP support note [#2039619](https://launchpad.support.sap.com/#/notes/2039619). The note defines the Oracle support matrix on Azure
		3.	SAP support note [#2235581](https://launchpad.support.sap.com/#/notes/2235581) to get the support matrix for SAP HANA on the different OS releases
		4.	SAP HANA supported Azure VMs and [HANA Large Instances]( are listed
	 
	5.	We recommend strict 3-Tier designs for SAP production systems. Combining ASCS + APP servers on the same VM is generally not recommended.  Servers hosting /sapmnt resources not to be used as File Servers for Interfaces or other purposes.    
3.	Customer/Partner should create an inventory of all SAP interfaces (SAP and non-SAP). 
4.	Foundation Services Design (ER, Active Directory, Network Topology, Resource Groups, Tagging, Naming Convention)
5.	Microsoft Premier Support Contract – identify MS Technical Account Manager (TAM) 
6.	Plan for Azure Rapid Response (A.R.R) during Production Cutover and 1-2 months post go live 
7.	Nominate project in https://aka.ms/azureonboarding 
8.	Notify CAT Team if the customer will consume huge amounts of compute or storage  
9.	Increase quotas for customer subscription 
10.	RACI or at least basic R&R. Account Team to identify contact points at the SI(s)
11.	Agree on regular design and deployment review cadence between customer, SI and CSA, CSM and/or CAT Team 
 
Pilot Phase (Optional) 
Pilot can run before or in parallel to Project Preparation.  Pilot Phase is normally run in a separate Subscription and is deleted after completion.  It is recommended to setup and validate a full HA/DR solution during a pilot deployment
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
