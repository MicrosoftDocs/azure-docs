<properties
	pageTitle="What workloads can you protect with Azure Site Recovery?" 
	description="Azure Site Recovery protects your workloads and applications by coordinating the replication, failover and recovery of on-premises virtual machines and physical servers to Azure or to a secondary on-premises site" 
	services="site-recovery" 
	documentationCenter="" 
	authors="rayne-wiselman" 
	manager="jwhit" 
	editor=""/>

<tags 
	ms.service="site-recovery" 
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery" 
	ms.date="07/06/2016" 
	ms.author="raynew"/>

# What workloads can you protect with Azure Site Recovery?


This article describes which workloads and applications you can protect with Azure Site Recovery.

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Overview

Organizations need a business continuity and disaster recovery (BCDR) strategy that a determines how apps, workloads, and data remain available during planned and unplanned downtime, and recover to regular working conditions as soon as possible.

Site Recovery is an Azure service that contributes to your BCDR strategy by enabling you to deploying application-aware resiliency solutions by orchestrating replication of on-premises physical servers and virtual machines to the cloud (Azure) or to a secondary site. Whether your apps are Windows or Linux-based, running on physical servers, VMware or Hyper-V VMs, you can use Site Recovery to orchestrate replication, perform disaster recovery testing, and run failovers and failback.


Site Recovery integrates with Microsoft applications, including SharePoint, Exchange, Dynamics, SQL Server and Active Directory. Microsoft also works closely with leading vendors including Oracle, SAP, IBM and Red Hat to ensure their applications and services work well on Microsoft platforms including Azure. You can customize a solution on a app-by-app basis.

## Why use Site Recovery for application protection?

Site Recovery contributes to application-level protection and recovery as follows: 

- Near-synchronous replication with RPOs as low as 30 seconds to meet the needs of most critical business apps.
- App-consistent snapshots for single or multi-tier applications.
- Integration with SQL Server AlwaysOn, and partnership with other application-level replication technologies, including AD replication, SQL AlwaysOn, Exchange Database Availability Groups (DAGs) and Oracle Data Guard.
- Flexible recovery plans that enable you to recover an entire application stack with a single click, and include to include external scripts and manual actions in the plan. 
- Advanced network management in Site Recovery and Azure to simplify app network requirements, including the ability to reserve IP addresses, configure load-balancing, and integrate with Azure Traffic Manager for low RTO network switchovers.
-  A rich automation library that provides production-ready, application-specific scripts that can be downloaded and integrated with recovery plans.



##Workload summary

Site Recovery can replicate any app running on a supported virtual machine. In addition we've partnered with product teams to carry out additional app-specific testing.

**Workload** | **Replicate Hyper-V VMs to a secondary site** | **Replicate Hyper-V VMs to Azure** | **Replicate VMware VMs to a secondary site** | **Replicate VMware VMs to Azure**
---|---|---|---|---
Active Directory, DNS | Y | Y | Y | Y 
Web apps (IIS, SQL) | Y | Y | Y | Y
SCOM | Y | Y | Y | Y
Sharepoint | Y | Y | Y | Y
SAP<br/><br/>Replicate SAP site to Azure for non cluster | Y (tested by Microsoft) | Y (tested by Microsoft) | Y (tested by Microsoft) | Y (tested by Microsoft)
Exchange (non-DAG) | Y | Coming soon | Y | Y
Remote Desktop/VDI | Y | Y | Y | N/A 
Linux (operating system and apps) | Y (tested by Microsoft) | Y (tested by Microsoft) | Y (tested by Microsoft) | Y (tested by Microsoft) 
Dynamics AX | Y | Y | Y | Y
Dynamics CRM | Y | Coming soon | Y | Coming soon
Oracle | Y (tested by Microsoft) | Y (tested by Microsoft) | Y (tested by Microsoft) | Y (tested by Microsoft)
Windows File Server | Y | Y | Y | Y


## Replicate Active Directory and DNS

An Active Directory and DNS infrastructure are essential to most enterprise apps. During disaster recovery you'll need to protect and recover these infrastructure components before recovering your workloads and apps.

You can use Site Recovery to create a complete automated disaster recovery plan for Active Directory and DNS. For example if you want to fail over SharePoint and SAP from a primary to a secondary site you can set up a recovery plan that fails over Active Directory first, and then an additional app-specific recovery plan to fail over the other apps that rely on Active Directory.

[Learn more](site-recovery-active-directory.md) about protecting Active Directory and DNS.

## Protect SQL Server

SQL Server provides a data services foundation for data services for many business apps in an on-premises data center.  Site Recovery can be used together with SQL Server HA/DR technologies to protect multi-tiered enterprise apps that use SQL Server. Site Recovery provides:

- A simple and cost-effective disaster recovery solution for SQL Server. Replicate multiple versions and editions of SQL Server standalone servers and clusters, to Azure or to a secondary site.  
- Integration with SQL AlwaysOn Availability Groups to manage failover and failback with Azure Site Recovery recovery plans.
- End-to-end recovery plans for the all tiers in an application, including the SQL Server databases.
- Scaling of SQL Server for peak loads with Site Recovery by “bursting” them into larger IaaS virtual machine sizes in Azure.
- Easy testing of SQL Server disaster recovery. You can run test failovers to analyze data and run compliance checks without impacting your production environment.

[Learn more](site-recovery-sql.md) about protecting SQL server.

##Protect SharePoint

Azure Site Recovery helps protect SharePoint deployments as follows:

- Eliminates the need and associated infrastructure costs for a stand-by farm for disaster recovery. Use Site Recovery to replicate an entire farm (Web, app and database tiers) to Azure or to a secondary site.
- Simplifies application deployment and management. Updates deployed to the primary site are automatically replicated, and are thus available after failover and recovery of a farm in a secondary site. Also lowers the management complexity and costs associated with keeping a stand-by farm up-to-date.
- Simplifies SharePoint application development and testing by creating a production-like copy on-demand replica environment for testing and debugging.
- Simplifies transition to the cloud by using Site Recovery to migrate SharePoint deployments to Azure.

[Learn more](https://gallery.technet.microsoft.com/SharePoint-DR-Solution-f6b4aeae) about protecting SharePoint.


## Protect Dynamics AX

Azure Site Recovery helps you protect your Dynamics AX ERP solution by:

- Orchestrating replication of your entire Dynamics AX environment (Web and AOS tiers, database tiers, SharePoint) to Azure or to a secondary site.
- Simplifying migration of Dynamics AX deployments to the cloud (Azure).
- Simplifying Dynamics AX application development and testing by creating a production-like copy on-demand for testing and debugging.

[Learn more](https://gallery.technet.microsoft.com/Dynamics-AX-DR-Solution-b2a76281) about protecting Dynamic AX.

## Protect RDS 

Remote Desktop Services (RDS) enables virtual desktop infrastructure (VDI), session-based desktops, and applications, allowing users to work anywhere. With Azure Site Recovery you can:

- Replicate managed or unmanaged pooled virtual desktops to a secondary site, and remote applications and sessions to a secondary site or Azure.
- Here's what you can replicate:

**RDS** | **Replicate Hyper-V VMs to a secondary site** | **Replicate Hyper-V VMs to Azure** | **Replicate VMware VMs to a secondary site** | **Replicate VMware VMs to Azure** | **Replicate physical servers to a secondary site** | **Replicate physical servers to Azure**
---|---|---|---|---|---|---
**Pooled Virtual Desktop (unmanaged)** | Yes | No | Yes | No | Yes | No
**Pooled Virtual Desktop (managed and without UPD)** | Yes | No | Yes | No | Yes | No
**Remote applications and Desktop sessions (without UPD)** | Yes | Yes | Yes | Yes | Yes | Yes


[Learn more](https://gallery.technet.microsoft.com/Remote-Desktop-DR-Solution-bdf6ddcb) about protecting RDS.


## Protect Exchange

Site Recovery  helps protect Exchange as follows:

- For small Exchange deployments, such as a single or non-clustered servers, Site Recovery can replicate and fail over to Azure or to a secondary site.
- For larger deployments Site Recovery integrates with Exchange DAGS.
- Exchange DAGs are the recommended solution for Exchange disaster recovery in an enterprise.  Site Recovery recovery plans can include DAGs to orchestrate DAG failover across sites.


[Learn more](https://gallery.technet.microsoft.com/Exchange-DR-Solution-using-11a7dcb6) about protecting Exchange.

## Protect SAP

Use Site Recovery to protect your SAP deployment as follows: 

- Enable protection of the entire SAP deployment by replicating different deployment layers to Azure, or to a secondary site.
- Simplify cloud migration by using Site Recovery to migrate your SAP deployment to Azure.
- Simplify SAP development and testing by creating a production-like copy on-demand for testing and debugging applications.

[Learn more](http://aka.ms/asr-sap) about protecting SAP.

## Next steps

[Prepare](site-recovery-best-practices.md) for Site Recovery deployment

