---
title: About disaster recovery for on-premises apps with Azure Site Recovery
description: Describes the workloads that can be protected using disaster recovery with the Azure Site Recovery service.
ms.topic: conceptual
ms.date: 03/18/2020
---

# About disaster recovery for on-premises apps

This article describes on-premises workloads and apps you can protect for disaster recovery with the [Azure Site Recovery](site-recovery-overview.md) service.

## Overview

Organizations need a business continuity and disaster recovery (BCDR) strategy to keep workloads and data safe and available during planned and unplanned downtime. And, recover to regular working conditions.

Site Recovery is an Azure service that contributes to your BCDR strategy. Using Site Recovery, you can deploy application-aware replication to the cloud, or to a secondary site. You can use Site Recovery to manage replication, perform disaster recovery testing, and run failovers and failback. Your apps can run on Windows or Linux-based computers, physical servers, VMware, or Hyper-V.

Site Recovery integrates with Microsoft applications such as SharePoint, Exchange, Dynamics, SQL Server, and Active Directory. Microsoft works closely with leading vendors including Oracle, SAP, and Red Hat. You can customize replication solutions on an app-by-app basis.

## Why use Site Recovery for application replication?

Site Recovery contributes to application-level protection and recovery as follows:

- App-agnostic and provides replication for any workloads running on a supported machine.
- Near-synchronous replication, with recovery point objectives (RPO) as low as 30 seconds to meet the needs of most critical business apps.
- App-consistent snapshots, for single or multi-tier applications.
- Integration with SQL Server AlwaysOn, and partnership with other application-level replication technologies. For example, Active Directory replication, SQL AlwaysOn, and Exchange Database Availability Groups (DAGs).
- Flexible recovery plans that enable you to recover an entire application stack with a single click, and to include external scripts and manual actions in the plan.
- Advanced network management in Site Recovery and Azure to simplify app network requirements. Network management such as the ability to reserve IP addresses, configure load-balancing, and integration with Azure Traffic Manager for low recovery time objectives (RTO) network switchovers.
- A rich automation library that provides production-ready, application-specific scripts that can be downloaded and integrated with recovery plans.

## Workload summary

Site Recovery can replicate any app running on a supported machine. We've partnered with product teams to do additional testing for the apps specified in the following table.

| **Workload** |**Replicate Azure VMs to Azure** |**Replicate Hyper-V VMs to a secondary site** | **Replicate Hyper-V VMs to Azure** | **Replicate VMware VMs to a secondary site** | **Replicate VMware VMs to Azure** |
| --- | --- | --- | --- | --- |---|
| Active Directory, DNS |Yes |Yes |Yes |Yes |Yes|
| Web apps (IIS, SQL) |Yes |Yes |Yes |Yes |Yes|
| System Center Operations Manager |Yes |Yes |Yes |Yes |Yes|
| SharePoint |Yes |Yes |Yes |Yes |Yes|
| SAP<br/><br/>Replicate SAP site to Azure for non-cluster |Yes (tested by Microsoft) |Yes (tested by Microsoft) |Yes (tested by Microsoft) |Yes (tested by Microsoft) |Yes (tested by Microsoft)|
| Exchange (non-DAG) |Yes |Yes |Yes |Yes |Yes|
| Remote Desktop/VDI |Yes |Yes |Yes |Yes |Yes|
| Linux (operating system and apps) |Yes (tested by Microsoft) |Yes (tested by Microsoft) |Yes (tested by Microsoft) |Yes (tested by Microsoft) |Yes (tested by Microsoft)|
| Dynamics AX |Yes |Yes |Yes |Yes |Yes|
| Windows File Server |Yes |Yes |Yes |Yes |Yes|
| Citrix XenApp and XenDesktop |Yes|N/A |Yes |N/A |Yes |

## Replicate Active Directory and DNS

An Active Directory and DNS infrastructure are essential to most enterprise apps. During disaster recovery, you'll need to protect and recover these infrastructure components, before you recover workloads and apps.

You can use Site Recovery to create a complete automated disaster recovery plan for Active Directory and DNS. For example, to fail over SharePoint and SAP from a primary to a secondary site, you can set up a recovery plan that first fails over Active Directory. Then use an additional app-specific recovery plan to fail over the other apps that rely on Active Directory.

[Learn more](site-recovery-active-directory.md) about disaster recovery for Active Directory and DNS.

## Protect SQL Server

SQL Server provides a data services foundation for many business apps in an on-premises datacenter. Site Recovery can be used with SQL Server HA/DR technologies, to protect multi-tiered enterprise apps that use SQL Server.

Site Recovery provides:

- A simple and cost-effective disaster recovery solution for SQL Server. Replicate multiple versions and editions of SQL Server standalone servers and clusters, to Azure or to a secondary site.
- Integration with SQL AlwaysOn Availability Groups, to manage failover and failback with Azure Site Recovery recovery plans.
- End-to-end recovery plans for the all tiers in an application, including the SQL Server databases.
- Scaling of SQL Server for peak loads with Site Recovery, by _bursting_ them into larger IaaS virtual machine sizes in Azure.
- Easy testing of SQL Server disaster recovery. You can run test failovers to analyze data and run compliance checks, without impacting your production environment.

[Learn more](site-recovery-sql.md) about disaster recovery for SQL server.

## Protect SharePoint

Azure Site Recovery helps protect SharePoint deployments, as follows:

- Eliminates the need and associated infrastructure costs for a stand-by farm for disaster recovery. Use Site Recovery to replicate an entire farm (web, app, and database tiers) to Azure or to a secondary site.
- Simplifies application deployment and management. Updates deployed to the primary site are automatically replicated. The updates are available after failover and recovery of a farm in a secondary site. Lowers the management complexity and costs associated with keeping a stand-by farm up to date.
- Simplifies SharePoint application development and testing by creating a production-like copy on-demand replica environment for testing and debugging.
- Simplifies transition to the cloud by using Site Recovery to migrate SharePoint deployments to Azure.

[Learn more](site-recovery-sharepoint.md) about disaster recovery for SharePoint.

## Protect Dynamics AX

Azure Site Recovery helps protect your Dynamics AX ERP solution, by:

- Managing replication of your entire Dynamics AX environment (Web and AOS tiers, database tiers, SharePoint) to Azure, or to a secondary site.
- Simplifying migration of Dynamics AX deployments to the cloud (Azure).
- Simplifying Dynamics AX application development and testing by creating a production-like copy on-demand, for testing and debugging.

[Learn more](site-recovery-dynamicsax.md) about disaster recovery for Dynamic AX.

## Protect Remote Desktop Services

Remote Desktop Services (RDS) enables virtual desktop infrastructure (VDI), session-based desktops, and applications, that allow users to work anywhere.

With Azure Site Recovery you can replicate the following services:

- Replicate managed or unmanaged pooled virtual desktops to a secondary site.
- Replicate remote applications and sessions to a secondary site or Azure.

The following table shows the replication options:

| **RDS** |**Replicate Azure VMs to Azure** | **Replicate Hyper-V VMs to a secondary site** | **Replicate Hyper-V VMs to Azure** | **Replicate VMware VMs to a secondary site** | **Replicate VMware VMs to Azure** | **Replicate physical servers to a secondary site** | **Replicate physical servers to Azure** |
|---| --- | --- | --- | --- | --- | --- | --- |
| **Pooled Virtual Desktop (unmanaged)** |No|Yes |No |Yes |No |Yes |No |
| **Pooled Virtual Desktop (managed and without UPD)** |No|Yes |No |Yes |No |Yes |No |
| **Remote applications and Desktop sessions (without UPD)** |Yes|Yes |Yes |Yes |Yes |Yes |Yes |

[Learn more](/windows-server/remote/remote-desktop-services/rds-disaster-recovery-with-azure) about disaster recovery for RDS.

## Protect Exchange

Site Recovery helps protect Exchange, as follows:

- For small Exchange deployments, such as a single or standalone server, Site Recovery can replicate and fail over to Azure or to a secondary site.
- For larger deployments, Site Recovery integrates with Exchange DAGS.
- Exchange DAGs are the recommended solution for Exchange disaster recovery in an enterprise.  Site Recovery recovery plans can include DAGs, to orchestrate DAG failover across sites.

To learn more about disaster recovery for Exchange, see [Exchange DAGs](/Exchange/high-availability/database-availability-groups/database-availability-groups) and [Exchange disaster recovery](/Exchange/high-availability/disaster-recovery/disaster-recovery).

## Protect SAP

Use Site Recovery to protect your SAP deployment, as follows:

- Enable protection of SAP NetWeaver and non-NetWeaver Production applications running on-premises, by replicating components to Azure.
- Enable protection of SAP NetWeaver and non-NetWeaver Production applications running Azure, by replicating components to another Azure datacenter.
- Simplify cloud migration, by using Site Recovery to migrate your SAP deployment to Azure.
- Simplify SAP project upgrades, testing, and prototyping, by creating a production clone on-demand for testing SAP applications.

[Learn more](site-recovery-sap.md) about disaster recovery for SAP.

## Protect Internet Information Services

Use Site Recovery to protect your Internet Information Services (IIS) deployment, as follows:

Azure Site Recovery provides disaster recovery by replicating the critical components in your environment to a cold remote site or a public cloud like Microsoft Azure. Since the virtual machines with the web server and the database are replicated to the recovery site, there's no requirement for a separate backup for configuration files or certificates. The application mappings and bindings dependent on environment variables that are changed post failover can be updated through scripts integrated into the disaster recovery plans. Virtual machines are brought up on the recovery site only during a failover. Azure Site Recovery also helps you orchestrate the end-to-end failover by providing you the following capabilities:

- Sequencing the shutdown and startup of virtual machines in the various tiers.
- Adding scripts to allow updates of application dependencies and bindings on the virtual machines after they've started. The scripts can also be used to update the DNS server to point to the recovery site.
- Allocate IP addresses to virtual machines pre-failover by mapping the primary and recovery networks and use scripts that don't need to be updated post failover.
- Ability for a one-click failover for multiple web applications that eliminates the scope for confusion during a disaster.
- Ability to test the recovery plans in an isolated environment for DR drills.

[Learn more](site-recovery-iis.md) about disaster recovery for IIS.

## Protect Citrix XenApp and XenDesktop

Use Site Recovery to protect your Citrix XenApp and XenDesktop deployments, as follows:

- Enable protection of the Citrix XenApp and XenDesktop deployment. Replicate the different deployment layers to Azure: Active Directory, DNS server, SQL database server, Citrix Delivery Controller, StoreFront server, XenApp Master (VDA), Citrix XenApp License Server.
- Simplify cloud migration, by using Site Recovery to migrate your Citrix XenApp and XenDesktop deployment to Azure.
- Simplify Citrix XenApp/XenDesktop testing, by creating a production-like copy on-demand for testing and debugging.
- This solution only applies to Windows Server virtual desktops and not client virtual desktops. Client virtual desktops aren't yet supported for licensing in Azure. [Learn More](https://azure.microsoft.com/pricing/licensing-faq/) about licensing for client/server desktops in Azure.

[Learn more](site-recovery-citrix-xenapp-and-xendesktop.md) about disaster recovery for Citrix XenApp and XenDesktop deployments. Or, you can refer to the [Citrix whitepaper](https://aka.ms/citrix-xenapp-xendesktop-with-asr).

## Next steps

[Learn more](azure-to-azure-quickstart.md) about disaster recovery for an Azure VM.
