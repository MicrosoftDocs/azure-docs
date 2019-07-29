---
title: What workloads can you protect with Azure Site Recovery? | Microsoft Docs
description: Describes the workloads that can be protected using disaster recovery with the Azure Site Recovery service. 
author: rayne-wiselman
ms.service: site-recovery
services: site-recovery
ms.topic: conceptual
ms.date: 6/27/2019
ms.author: raynew

---
# What workloads can you protect with Azure Site Recovery?

This article describes workloads and applications you can protect for disaster recovery with the [Azure Site Recovery](site-recovery-overview.md) service.



## Overview

Organizations need a business continuity and disaster recovery (BCDR) strategy to keep workloads and data safe and available during planned and unplanned downtime, and recover to regular working conditions as soon as possible.

Site Recovery is an Azure service that contributes to your BCDR strategy. Using Site Recovery, you can deploy application-aware replication to the cloud, or to a secondary site. Whether your apps are Windows or Linux-based, running on physical servers, VMware or Hyper-V, you can use Site Recovery to orchestrate replication, perform disaster recovery testing, and run failovers and failback.

Site Recovery integrates with Microsoft applications, including SharePoint, Exchange, Dynamics, SQL Server, and Active Directory. Microsoft also works closely with leading vendors including Oracle, SAP, and Red Hat. You can customize replication solutions on an app-by-app basis.

## Why use Site Recovery for application replication?

Site Recovery contributes to application-level protection and recovery as follows:

* App-agnostic, providing replication for any workloads running on a supported machine.
* Near-synchronous replication, with RPOs as low as 30 seconds to meet the needs of most critical business apps.
* App-consistent snapshots, for single or multi-tier applications.
* Integration with SQL Server AlwaysOn, and partnership with other application-level replication technologies, including AD replication, SQL AlwaysOn, Exchange Database Availability Groups (DAGs).
* Flexible recovery plans, that enable you to recover an entire application stack with a single click, and to include external scripts and manual actions in the plan.
* Advanced network management in Site Recovery and Azure to simplify app network requirements, including the ability to reserve IP addresses, configure load-balancing, and integration with Azure Traffic Manager, for low RTO network switchovers.
* A rich automation library that provides production-ready, application-specific scripts that can be downloaded and integrated with recovery plans.

## Workload summary
Site Recovery can replicate any app running on a supported machine. In addition, we've partnered with product teams to carry out additional app-specific testing.

| **Workload** |**Replicate Azure VMs to Azure** |**Replicate Hyper-V VMs to a secondary site** | **Replicate Hyper-V VMs to Azure** | **Replicate VMware VMs to a secondary site** | **Replicate VMware VMs to Azure** |
| --- | --- | --- | --- | --- |---|
| Active Directory, DNS |Y |Y |Y |Y |Y|
| Web apps (IIS, SQL) |Y |Y |Y |Y |Y|
| System Center Operations Manager |Y |Y |Y |Y |Y|
| SharePoint |Y |Y |Y |Y |Y|
| SAP<br/><br/>Replicate SAP site to Azure for non-cluster |Y (tested by Microsoft) |Y (tested by Microsoft) |Y (tested by Microsoft) |Y (tested by Microsoft) |Y (tested by Microsoft)|
| Exchange (non-DAG) |Y |Y |Y |Y |Y|
| Remote Desktop/VDI |Y |Y |Y |Y |Y|
| Linux (operating system and apps) |Y (tested by Microsoft) |Y (tested by Microsoft) |Y (tested by Microsoft) |Y (tested by Microsoft) |Y (tested by Microsoft)|
| Dynamics AX |Y |Y |Y |Y |Y|
| Windows File Server |Y |Y |Y |Y |Y|
| Citrix XenApp and XenDesktop |Y|N/A |Y |N/A |Y |

## Replicate Active Directory and DNS
An Active Directory and DNS infrastructure are essential to most enterprise apps. During disaster recovery, you'll need to protect and recover these infrastructure components, before recovering your workloads and apps.

You can use Site Recovery to create a complete automated disaster recovery plan for Active Directory and DNS. For example, if you want to fail over SharePoint and SAP from a primary to a secondary site, you can set up a recovery plan that fails over Active Directory first, and then an additional app-specific recovery plan to fail over the other apps that rely on Active Directory.

[Learn more](site-recovery-active-directory.md) about protecting Active Directory and DNS.

## Protect SQL Server
SQL Server provides a data services foundation for data services for many business apps in an on-premises data center.  Site Recovery can be used together with SQL Server HA/DR technologies, to protect multi-tiered enterprise apps that use SQL Server. Site Recovery provides:

* A simple and cost-effective disaster recovery solution for SQL Server. Replicate multiple versions and editions of SQL Server standalone servers and clusters, to Azure or to a secondary site.  
* Integration with SQL AlwaysOn Availability Groups, to manage failover and failback with Azure Site Recovery recovery plans.
* End-to-end recovery plans for the all tiers in an application, including the SQL Server databases.
* Scaling of SQL Server for peak loads with Site Recovery, by “bursting” them into larger IaaS virtual machine sizes in Azure.
* Easy testing of SQL Server disaster recovery. You can run test failovers to analyze data and run compliance checks, without impacting your production environment.

[Learn more](site-recovery-sql.md) about protecting SQL server.

## Protect SharePoint
Azure Site Recovery helps protect SharePoint deployments, as follows:

* Eliminates the need and associated infrastructure costs for a stand-by farm for disaster recovery. Use Site Recovery to replicate an entire farm (Web, app and database tiers) to Azure or to a secondary site.
* Simplifies application deployment and management. Updates deployed to the primary site are automatically replicated, and are thus available after failover and recovery of a farm in a secondary site. Also lowers the management complexity and costs associated with keeping a stand-by farm up-to-date.
* Simplifies SharePoint application development and testing by creating a production-like copy on-demand replica environment for testing and debugging.
* Simplifies transition to the cloud by using Site Recovery to migrate SharePoint deployments to Azure.

[Learn more](site-recovery-sharepoint.md) about protecting SharePoint.

## Protect Dynamics AX
Azure Site Recovery helps protect your Dynamics AX ERP solution, by:

* Orchestrating replication of your entire Dynamics AX environment (Web and AOS tiers, database tiers, SharePoint) to Azure, or to a secondary site.
* Simplifying migration of Dynamics AX deployments to the cloud (Azure).
* Simplifying Dynamics AX application development and testing by creating a production-like copy on-demand, for testing and debugging.

[Learn more](site-recovery-dynamicsax.md) about protecting Dynamic AX.

## Protect RDS
Remote Desktop Services (RDS) enables virtual desktop infrastructure (VDI), session-based desktops, and applications, allowing users to work anywhere. With Azure Site Recovery you can:

* Replicate managed or unmanaged pooled virtual desktops to a secondary site, and remote applications and sessions to a secondary site or Azure.

* Here's what you can replicate:

| **RDS** |**Replicate Azure VMs to Azure** | **Replicate Hyper-V VMs to a secondary site** | **Replicate Hyper-V VMs to Azure** | **Replicate VMware VMs to a secondary site** | **Replicate VMware VMs to Azure** | **Replicate physical servers to a secondary site** | **Replicate physical servers to Azure** |
|---| --- | --- | --- | --- | --- | --- | --- |
| **Pooled Virtual Desktop (unmanaged)** |No|Yes |No |Yes |No |Yes |No |
| **Pooled Virtual Desktop (managed and without UPD)** |No|Yes |No |Yes |No |Yes |No |
| **Remote applications and Desktop sessions (without UPD)** |Yes|Yes |Yes |Yes |Yes |Yes |Yes |

[Set up disaster recovery for RDS using Azure Site Recovery](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/rds-disaster-recovery-with-azure).

[Learn more](https://gallery.technet.microsoft.com/Remote-Desktop-DR-Solution-bdf6ddcb) about protecting RDS.

## Protect Exchange
Site Recovery helps protect Exchange, as follows:

* For small Exchange deployments, such as a single or standalone server, Site Recovery can replicate and fail over to Azure or to a secondary site.
* For larger deployments, Site Recovery integrates with Exchange DAGS.
* Exchange DAGs are the recommended solution for Exchange disaster recovery in an enterprise.  Site Recovery recovery plans can include DAGs, to orchestrate DAG failover across sites.

[Learn more](https://gallery.technet.microsoft.com/Exchange-DR-Solution-using-11a7dcb6) about protecting Exchange.

## Protect SAP
Use Site Recovery to protect your SAP deployment, as follows:

* Enable protection of SAP NetWeaver and non-NetWeaver Production applications running on-premises, by replicating components to Azure.
* Enable protection of SAP NetWeaver and non-NetWeaver Production applications running Azure, by replicating components to another Azure datacenter.
* Simplify cloud migration, by using Site Recovery to migrate your SAP deployment to Azure.
* Simplify SAP project upgrades, testing, and prototyping, by creating a production clone on-demand for testing SAP applications.

[Learn more](site-recovery-sap.md) about protecting SAP.

## Protect IIS
Use Site Recovery to protect your IIS deployment, as follows:

Azure Site Recovery provides disaster recovery by replicating the critical components in your environment to a cold remote site or a public cloud like Microsoft Azure. Since the virtual machines with the web server and the database are being replicated to the recovery site, there is no requirement to backup configuration files or certificates separately. The application mappings and bindings dependent on environment variables that are changed post failover can be updated through scripts integrated into the disaster recovery plans. Virtual machines are brought up on the recovery site only in the event of a failover. Not only this, Azure Site Recovery also helps you orchestrate the end to end failover by providing you the following capabilities:

-	Sequencing the shutdown and startup of virtual machines in the various tiers.
-	Adding scripts to allow update of application dependencies and bindings on the virtual machines after they have been started up. The scripts can also be used to update the DNS server to point to the recovery site.
-	Allocate IP addresses to virtual machines pre-failover by mapping the primary and recovery networks and hence use scripts that do not need to be updated post failover.
-	Ability for a one-click failover for multiple web applications on the web servers, thus eliminating the scope for confusion in the event of a disaster.
-	Ability to test the recovery plans in an isolated environment for DR drills.

[Learn more](https://aka.ms/asr-iis) about protecting IIS web farm.

## Protect Citrix XenApp and XenDesktop
Use Site Recovery to protect your Citrix XenApp and XenDesktop deployments, as follows:

* Enable protection of the Citrix XenApp and XenDesktop deployment, by replicating different deployment layers including (AD DNS server, SQL database server, Citrix Delivery Controller, StoreFront server, XenApp Master (VDA), Citrix XenApp License Server) to Azure.
* Simplify cloud migration, by using Site Recovery to migrate your Citrix XenApp and XenDesktop deployment to Azure.
* Simplify Citrix XenApp/XenDesktop testing, by creating a production-like copy on-demand for testing and debugging.
* This solution is only applicable for Windows Server operating system virtual desktops and not client virtual desktops as client virtual desktops are not yet supported for licensing in Azure.
[Learn More](https://azure.microsoft.com/pricing/licensing-faq/) about licensing for client/server desktops in Azure.

[Learn more](site-recovery-citrix-xenapp-and-xendesktop.md) about protecting Citrix XenApp and XenDesktop deployments. Alternatively, you can refer the [whitepaper from Citrix](https://aka.ms/citrix-xenapp-xendesktop-with-asr) detailing the same.

## Next steps

[Get started](azure-to-azure-quickstart.md) with Azure VM replication.
