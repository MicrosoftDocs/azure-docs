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
	ms.date="12/01/2015" 
	ms.author="raynew"/>

# What workloads can you protect with Azure Site Recovery?

Azure Site Recovery enables customers to deploy application-aware availability solutions that contribute to your organization's business continuity and disaster recovery (BCDR) strategy. Whether it's Windows Server or Linux-based apps, Microsoft enterprise applications or offerings from other vendors, you can use Azure Site Recovery to enable disaster recovery, on-demand development and testing environments, and cloud migration.

Site Recovery integrates with Microsoft applications, including SharePoint, Exchange, Dynamics, SQL Server and Active Directory. Microsoft also works closely with leading vendors including Oracle, SAP, IBM and Red Hat to ensure their applications and services work well on Microsoft platforms such as Azure and Hyper-V. You can customize your disaster recovery solution for each specific application.


##Key Features
Azure Site Recovery features that contribute to your application-level protection and recovery strategy include: 

- Near-synchronous replication with RPOs as low as 30 seconds to meet the needs of most critical applications.
- App-consistent snapshots for single or N-tier applications.
- Integration with SQL Server AlwaysOn, and partnership with other application-level replication technologies, including AD replication, SQL AlwaysOn, Exchange Database Availability Groups (DAGs) and Oracle Data Guard.
- Flexible recovery plans that enable you to recover an entire application stack with a single click, and include external scripts or manual actions. 
- Advanced network management in Site Recovery and Azure simplifies network requirements for an app, including reserving IP addresses, configuring load-balancers, or integration of Azure Traffic Manager for low RTO network switchovers.
-  rich automation library that provides production-ready, application specific scripts that can be downloaded and integrated with Site Recovery.



##Workload summary

Site Recovery replication technologies are compatible with any application running in a virtual machine. In addition we've done additional testing in partnership with application product teams to further support each app.

**Workload** | <p>**Replicate Hyper-V VMs**</p> <p>**(to a secondary site)**</p> | <p>**Replicate Hyper-V VMs**</p> <p>**(to Azure)**</p> | <p>**Replicate VMware VMs**</p> <p>**(to a secondary site)**</p> | <p>**Replicate VMware VMs**</p><p>**(to Azure)**</p>
---|---|---|---|---
Active Directory, DNS | Y | Y | Y | Y 
Web apps (IIS, SQL) | Y | Y | Y | Y
SCOM | Y | Y | Y | Y
Sharepoint | Y | Y | Y | Y
<p>SAP</p><p>Replicate SAP site to Azure for non cluster</p> | Y (tested by Microsoft) | Y (tested by Microsoft) | Y (tested by Microsoft) | Y (tested by Microsoft)
Exchange (non-DAG) | Y | Coming soon | Y | Y
Remote Desktop/VDI | Y | Y | Y | N/A 
<p>Linux</p> <p>(operating system and apps)</p> | Y (tested by Microsoft) | Y (tested by Microsoft) | Y (tested by Microsoft) | Y (tested by Microsoft) 
Dynamics AX | Y | Y | Y | Y
Dynamics CRM | Y | Coming soon | Y | Coming soon
Oracle | Y (tested by Microsoft) | Y (tested by Microsoft) | Y (tested by Microsoft) | Y (tested by Microsoft)
Windows File Server | Y | Y | Y | Y

##Protect Active Directory and DNS

All enterprise applications such as SharePoint, Dynamics AX and SAP depend on an Active Directory and DNS infrastructure. As part of your BCDR solution you'll need to protect and recover these infrastructure components before recovering your workloads and apps.

Using Site Recovery you can create a complete automated disaster recovery plan for Active Directory and DNS. For example if you're using Active Directory for multiple applications such as SharePoint and SAP in your primary site and you want to fail over the complete site, you can fail Active Directory over first using a recovery plan, and then fail over the applications that rely on Active Directory using application-specific recovery plans.

[Learn more ](http://aka.ms/asr-ad) 

##Protect SQL Server

SQL Server provides a foundation for data services for many business applications in an on-premises datacenter.  Site Recovery and SQL Server HA/DR technologies are complementary and can be used together to provide end-to-end protection for multi-tiered enterprise applications. Site Recovery offers the following benefits for SQL Server environments:

- Easy protection and replication of standalone or clustered SQL servers to Azure or a secondary site. Provides a simple and cost-effective disaster recovery solution for many SQL Server versions and editions.
- Integration with SQL AlwaysOn Availability Groups, managing failover and failback processes with recovery plans in Azure Site Recovery.
- End-to-end recovery plans for the entire application stack, including the SQL Server databases.
- Scaling up of SQL Server for peak loads using Azure Site Recovery by “bursting” them into larger IaaS virtual machine sizes in Azure.
- Testing of SQL Server in Azure or a secondary site using Azure Site Recovery. Test failovers can be used for analytics data compliance checks without impacting your production environment.

[Learn more](http://aka.ms/asr-sql)

##Protect SharePoint

Azure Site Recovery helps you to protect your SharePoint deployment. With Site Recovery you can:

- Eliminate the need and associated infrastructure cost for a stand-by farm for disaster recovery. With Site Recovery, you can enable protection of the entire farm (Web, app and database tiers) to Azure or to a secondary site.
- Simplify application deployment and manageability. Updates deployed to the primary site are automatically replicated, and will be available when the farm is recovered on the secondary site. This eliminates the management complexity of keeping a stand-by farm up-to-date, lowering costs.
- Simplify SharePoint application development and testing by creating a production-like copy on-demand replica environment for testing and debugging.
- Simplify transition to the cloud by using Site Recovery to migrate SharePoint deployments to Azure.

[Learn more](http://aka.ms/asr-sharepoint)


## Protect Dynamics AX

Azure Site Recovery helps you protect your Dynamics AX ERP solution: 

- Enable protection of your entire Dynamics AX environment (Web and AOS tiers, database tiers, SharePoint) to Azure or to a secondary site using Site Recovery.
- Simplify migration to the cloud by using Site Recovery to migrate Dynamics AX deployments to Azure.
- Simplify Dynamics AX application development and testing by creating a production-like copy on-demand for testing and debugging.

[Read more](http://aka.ms/asr-dynamics)

## Protect RDS 
Remote Desktop Services enables virtual desktop infrastructure (VDI), session-based desktops, and applications, allowing users to work anywhere. With Site Recovery you can enable protection of managed or unmanaged pooled virtual desktops to a secondary site, and remote applications and sessions to a secondary site or Azure.

[Learn more](http://aka.ms/asr-rds)


## Protect Exchange

Microsoft Exchange includes in-built support for high availability and disaster recovery. Exchange DAGs and Azure Site Recovery can work together.

- Exchange DAGs are the recommended solution for Exchange disaster recovery in an enterprise.  Recovery plans in Site Recovery can include DAGs to orchestrate DAG failover across sites.
- For small deployments, such as a single or non-clustered servers, Site Recovery can protect and fail over  to Azure or to a secondary site.

[earn more](http://aka.ms/asr-exchange)

## Protect SAP

Use Site Recovery to protect your SAP deployment: 

- Enable protection of the entire SAP deployment with different layers to Azure or to a secondary site.
- Simplify cloud migration by using Site Recovery to migrate your SAP deployment to Azure.
- Simply SAP development and testing by creating a production-like copy on-demand for testing and debugging applications.

[Learn more](http://aka.ms/asr-sap)

