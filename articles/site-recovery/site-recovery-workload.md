<properties
	pageTitle="Site Recovery Workload Guidance | Microsoft Azure" 
	description="Azure Site Recovery coordinates the replication, failover and recovery of virtual machines and physical servers located on on-premises to Azure or to a secondary on-premises site." 
	services="site-recovery" 
	documentationCenter="" 
	authors="prateek9us" 
	manager="abhiag" 
	editor=""/>

<tags 
	ms.service="site-recovery" 
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery" 
	ms.date="09/21/2015" 
	ms.author="pratshar"/>

# Site Recovery Workload Guidance

Azure Site Recovery enables customers to deploy application-aware availability solutions. Be it Windows Server or Linux based applications, Microsoft first party enterprise applications or offerings from other Vendors, you can use Azure Site Recovery to enable disaster recovery, on-demand Dev/Test environments or cloud migrations.

Microsoft has deep expertise and experience in developing best in class enterprise applications such as SharePoint, Exchange, Dynamics, SQL Server and Active Directory. Microsoft also works closely with leading vendors including Oracle, SAP, IBM and Red Hat to ensure their applications and services work well on Microsoft platforms including Azure and Hyper-V. We have leveraged these unique strengths to gain deep understanding of the availability requirements of each application to enable you to deploy best-in-class disaster recovery and availability solutions that can be customized for each application.


##Key Features
Azure Site Recovery features have been designed with Application level protection/recovery in mind:

- Near-Synchronous replication with RPOs as low as 30 seconds that meet the needs of most critical applications.
- Application consistent snapshots for single or N-tier applications
- Integrate with application level replication. Leverage best in class application level offerings including AD replication, SQL Always On, Exchange Database Availability Groups and Oracle Data Guard
- Flexible Recovery Plans enable recovering the entire application stack with a single click, including executing external scripts or even manual actions. 
- Advanced network management in ASR and Azure automates all networking configurations specific to you application: reserve IP addresses, configure load-balancers, or use Microsoft’s Traffic Manager for low RTO network switch-overs.
- Rich Automation Library that provide production-ready, application specific scripts. Download them and integrate into your ASR based solutions.


##Workload Guidance Summary

ASR replication technologies are compatible with any application running in a virtual machine. We have conducted additional testing in partnership with application product teams to further support each application.

**Workload** | <p>**Replicate Hyper-V virtual machines**</p> <p>**(to secondary site)**</p> | <p>**Replicate Hyper-V virtual machines**</p> <p>**(to Azure)**</p> | <p>**Replicate VMware virtual machines**</p> <p>**(to secondary site)**</p> | <p>**Replicate VMware virtual machines**</p><p>**(to Azure)**</p>
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

##Active Directory and DNS

All the enterprise applications such as SharePoint, Dynamics AX and SAP depend on AD and DNS infrastructure to function correctly. While creating a disaster recovery (DR) solution for any such application, it is important to protect and recover AD before the other components of the application come up in the event of a disruption.

Using Azure Site Recovery, you can create a complete automated disaster recovery plan for your AD. In case you have an AD for multiple applications such as SharePoint and SAP in your primary site and you decide to failover the complete site, you can failover AD first using AD recovery plan and then failover the other applications using application specific recovery plans.

Refer the linked document for detailed guidance about [deploying Azure Site Recovery for AD](http://aka.ms/asr-ad) 

##SQL Server
Microsoft SQL Server is the foundation for many enterprise-grade first party, third party and custom line of business applications that run inside a customer’s on-premises datacenter. Applications such as SharePoint, Dynamics, and SAP use SQL Server to provide data services. Azure Site Recovery and SQL Server HA/DR technologies are complementary and can be used to provide end to end protection for multi-tiered enterprise applications.
Azure Site Recovery offers following benefits for SQL Server environments:

- Easily protect stand-alone or clustered SQL servers to Azure or a secondary site. Extend a simple, cost-effective DR solution for any version and edition of SQL Server.
- Integrate with SQL Always On Availability Groups, a best in class disaster recovery solution,   and manage the failover/failback operation with ASR Recovery Plans.
- Create end-to-end Recovery Plans for the entire application stack including the SQL databases.
- Use Azure Site Recovery to scale up SQL Server during peak loads by “bursting” them into larger IaaS VM sizes in Azure.
- Use Azure Site Recovery to create test copies of SQL Server in Azure or at a secondary site. Use this copy for analytics and data compliance checks without impacting the production environment.

Refer the linked document for detailed guidance about [deploying Azure Site Recovery for SQL](http://aka.ms/asr-sql)

##SharePoint
SharePoint is a popular application that enables organizations to collaborate by providing intranet portals, document and file management, social networks, websites and enterprise search capabilities. It is also an application platform for easily deploying custom applications and workflows.
By using Azure Site Recovery for SharePoint you can:

- Eliminate the need and associated infrastructure cost for a stand-by farm for disaster recovery. With ASR, you can enable protection of the entire farm (Web, app and database tiers) to Azure or to a secondary site.
- Simplify application deployment and manageability. Updates deployed to the primary site are automatically replicated and available when the farm is recovered on the secondary site. This eliminates the management complexity of keeping a stand-by farm up to date, and lowers the TCO.
- Ease SharePoint application development and testing by creating a production-like copy on-demand for testing and debugging.
- Simplify your path to the cloud by using ASR to migrate SharePoint deployments to Azure.

Refer the linked document for detailed guidance about [deploying Azure Site Recovery for Sharepoint](http://aka.ms/asr-sharepoint)


##Dynamics AX
Microsoft Dynamics AX is a leading enterprise resource planning (ERP) solution that is simple to learn and use so you can deliver value faster, take advantage of business opportunities, and drive user involvement and innovation across the organization.

- With ASR, you can enable protection of the entire Dynamics Ax (Web and AOS tier, database tiers, SharePoint) to Azure or to a secondary site.
- Simplify your path to the cloud by using ASR to migrate Dynamics Ax deployments to Azure.
- Ease Dynamics application development and testing by creating a production-like copy on-demand for testing and debugging.

Refer the linked document for detailed guidance about [deploying Azure Site Recovery for Dynamics AX](http://aka.ms/asr-dynamics)

## RDS 
Windows Server Remote Desktop Services (RDS) accelerates and extends desktop and application deployments to any device, improving remote worker efficiency, while helping to keep critical intellectual property secure and simplify regulatory compliance. Remote Desktop Services enables virtual desktop infrastructure (VDI), session-based desktops, and applications, allowing users to work anywhere. 

With ASR, you can enable protection of managed or unmanaged pooled virtual desktops to a secondary site and remote applications and sessions to a secondary site or Azure.

Refer the linked document for detailed guidance about [deploying Azure Site Recovery for RDS/VDI](http://aka.ms/asr-rds)


## Exchange
Microsoft Exchange is the preferred software used by enterprises to host their messaging and email services. Exchange ensures access to communication across PC, phone or browser, while providing unparalleled reliability, manageability and data protection.

Microsoft Exchange natively supports enterprise class high availability and disaster recovery solutions. Exchange Database Availability Groups and Azure Site Recovery technologies are complementary. 

- Exchange DAGs are the recommended deployment option to enable best in class disaster recovery for Exchange deployments. ASR Recovery Plans can include DAGs to orchestrate DAG failovers across sites.
- For small deployments, such as a single server or non-clustered servers, Azure Site Recovery can protect and failover individual servers to Azure or to a secondary site.

Refer the linked document for detailed guidance about [deploying Azure Site Recovery for Exchange](http://aka.ms/asr-exchange)

## SAP

SAP is a leading enterprise resource planning (ERP) software that is used by a lot of organizations around the world. SAP is often seen as one of the most mission-critical applications within enterprises. The architecture and operations of these applications is mostly very complex and ensuring that you meet requirements on BCDR is very important.

- With ASR, you can enable protection of the entire SAP deployment with different layers to Azure or to a secondary site.
- Simplify your path to the cloud by using ASR to migrate SAP deployments to Azure.
- Ease SAP application development and testing by creating a production-like copy on-demand for testing and debugging.

Refer the linked document for detailed guidance about [deploying Azure Site Recovery for SAP NetWeaver](http://aka.ms/asr-sap)

