<properties 
	pageTitle="Understanding Azure SQL Database and SQL Server in Azure VMs" 
	description="Learn Azure SQL Database and SQL Server in Azure Virtual Machines. Review common business motivators for determining which SQL technology works best for your application." 
	services="sql-database, virtual-machines" 
	documentationCenter="" 
	authors="Selcin" 
	manager="jeffreyg" 
	editor="tysonn"/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/23/2015" 
	ms.author="selcint"/>

# Understanding Azure SQL Database and SQL Server in Azure VMs

Microsoft Azure provides you two options when hosting your SQL Server-based data: **Azure SQL Database** and **SQL Server in Azure Virtual Machine**. In this article, we start by looking at how each option fits into the big picture in Microsoft’s Data Platform, and then move on to deeper discussions based on the business requirements that motivate your choice. Whether you prioritize cost savings, or minimal administration ahead of everything else, this article can help you decide which approach is right, based on how each one delivers against the business requirements that you care about the most.

- [Microsoft’s Data Platform](#platform)
- [A Closer Look at Azure SQL Database and SQL Server in Azure VM](#close)	
- [Business motivations when choosing Azure SQL Database or SQL Server in Azure VM](#business)	
	- [Cost](#cost)
		- [Billing and licensing basics](#billing)	
		- [Calculating the total application cost](#appcost)	
	- [Administration](#admin)	
	- [Service level agreement (SLA)](#sla)	
	- [Time to market](#market)	
- [Summary](#summary)	
- [Acknowledgements](#ack)	
- [Additional Resources](#resources)	


##<a name="platform"></a>Microsoft's Data Platform

One of the first things to understand in any discussion of Azure versus on-premises SQL Server databases is that you can use it all. Microsoft’s Data Platform leverages SQL Server technology and makes it available across physical on-premises machines, private cloud environments, third party hosted private cloud environments, and public cloud. This enables you to meet unique and diverse business needs through a combination of on-premises and cloud-hosted deployments, while using the same set of server products, development tools, and expertise across these environments.

   ![][1]

As seen in the diagram, each offering can be characterized by the level of administration you have over the infrastructure (on the X axis), and by the degree of cost efficiency achieved by database level consolidation and automation (on the Y axis).

When designing an application, four basic options are available for hosting the SQL Server part of the application: 

- SQL Server on nonvirtualized physical machines 
- SQL Server in on-premises virtualized machines (private cloud)
- SQL Server in Azure Virtual Machine (public cloud)
- Azure SQL Database (public cloud)

In the following sections, we will learn about the last two: Azure SQL Database and SQL Server in Azure VMs. In addition, we will explore common business motivators for determining which option works best for your application.

##<a name="close"></a>A Closer Look at Azure SQL Database and SQL Server in Azure VM

**Microsoft Azure SQL Database (Azure SQL Database)** is a relational database-as-a-service, which falls into the industry category *Platform as a Service (PaaS)*. Azure SQL Database is built on standardized hardware and software that is owned, hosted, and maintained by Microsoft. With SQL Database, you can develop directly on the service using built-in features and functionality. When using SQL Database, you pay-as-you-go with options to scale up or out for greater power.

**SQL Server in Azure Virtual Machine (VM)** falls into the industry category *Infrastructure as a Service (IaaS)* and allows you to run SQL Server inside a virtual machine in the cloud. Similar to Azure SQL Database, it is built on standardized hardware that is owned, hosted, and maintained by Microsoft. When using SQL Server in a VM, you can either bring your own SQL Server license to Azure or use one of the preconfigured SQL Server images in the Azure portal.

In general, these two SQL options are optimized for different purposes:

- **Azure SQL Database** is optimized to reduce overall costs to the minimum for provisioning and managing many databases. It minimizes ongoing administration costs because you do not have to manage any virtual machines, operating system or database software including upgrades, high availability, and backups. In general, SQL Database can dramatically increase the number of databases managed by a single IT or development resource.
- **SQL Server running in Azure VM** is optimized for extending existing on-premises SQL Server applications to Azure in a hybrid scenario or deploying an existing application to Azure in a migration scenario or dev/test scenario. An example of the hybrid scenario is keeping secondary database replicas in Azure via [Azure Virtual Network](http://msdn.microsoft.com/library/azure/jj156007.aspx). With SQL Server in Azure VMs, you have the full administrative rights over a dedicated SQL Server instance and a cloud-based VM. It is a perfect choice when an organization already has IT resources available to maintain the virtual machines. With SQL Server in VM, you can build a highly customized system to address your application’s specific performance and availability requirements.

The following table summarizes the main characteristics of Azure SQL Database and SQL Server in Azure VM:

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle"></th>
   <th align="left" valign="middle">Azure SQL Database</th>
   <th align="left" valign="middle">SQL Server in Azure VM</th>
   
</tr>
<tr>
   <td valign="middle"><p><b>Best for</b></p></td>
   <td valign="middle">
          <ul>
          <li type=round>New cloud-designed applications that have time constraints in development and marketing. 
          <li type=round>Applications that need built-in automatic high-availability, disaster recovery solution, and upgrade mechanisms.
          <li type=round>If you have hundreds or thousands of databases but you do not want to manage the underlying operating system, hardware, and configuration settings. 
         <li type=round>Applications using scale-out patterns.
         <li type=round>Databases of up to 500 GB in size.
         <li type=round>Building Software-as-a-Service applications.
         
  </ul>
</td>
   <td valign="middle">
      <ul>
      <li type=round>Existing applications that require fast migration to the cloud with minimal changes.
      <li type=round>SQL Server applications that require accessing on-premises resources (such as, Active Directory) from Azure via a secure tunnel. 
      <li type=round>If you need a customized IT environment with full administrative rights.
      <li type=round>Rapid development and test scenarios when you do not want to buy on-premises nonproduction SQL Server hardware.
      <li type=round>Disaster recovery for on-premises SQL Server applications using <a href="http://msdn.microsoft.com/library/jj919148.aspx">backup on Azure Storage</a> or <a href="http://msdn.microsoft.com/library/azure/jj870962.aspx">AlwaysOn replicas in Azure VMs</a>.
      <li type=round>Large databases that are bigger than 1 TB in size.
      </ul></td>
   
</tr>
<tr>
   <td valign="middle"><p><b>Resources</b></p></td>
   <td valign="middle">
       <ul>
       <li type=round>You do not want to employ IT resources for support and maintenance of the underlying infrastructure.
       <li type=round>You want to focus on the application layer.
       </ul></td>
   <td valign="middle"><ul><li type=round>You have IT resources for support and maintenance.</ul></td>
   
</tr>
<tr>
   <td valign="middle"><p><b>Total cost of ownership</b></p></td>
   <td valign="middle"><ul><li type=round>Eliminates hardware costs. Reduces administrative costs.</ul></td>
   <td valign="middle"><ul><li type=round>Eliminates hardware costs. </ul></td>
   
</tr>
<tr>
   <td valign="middle"><p><b>Business continuity</b></p></td>
   <td valign="middle"><ul><li type=round>In addition to built-in fault tolerance infrastructure capabilities, Azure SQL Database provides features, such as Point in Time Restore, Geo-Restore, and Geo-Replication to increase business continuity. For more information, see <a href="http://msdn.microsoft.com/library/azure/hh852669.aspx">Azure SQL Database Business Continuity</a>.</ul></td>
   <td valign="middle"><ul><li type=round>SQL Server in Azure VM lets you to set up a high availability and disaster recovery solution for your database’s specific needs. Therefore, you can have a system that is highly optimized for your application. You can test and run failovers by yourself when needed. For more information, see <a href="http://msdn.microsoft.com/library/azure/jj870962.aspx">High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines</a>.</ul></td>
   
</tr>
<tr>
   <td valign="middle"><p><b>Hybrid cloud</b></p></td>
   <td valign="middle"><ul><li type=round>Your on-premises application can access data in Azure SQL Database.</ul></td>
   <td valign="middle"><ul>
      <li type=round>With SQL Server in Azure VMs, you can have applications that run partly in the cloud and partly on-premises. For example, you can extend the on-premises network and Active Domain Directory to the cloud via <a href="http://msdn.microsoft.com/library/azure/gg433091.aspx">Azure Network Services</a>. In addition, you can store on-premises data files in Azure Storage using the <a href="http://msdn.microsoft.com/library/dn385720.aspx">SQL Server Data Files in Azure feature</a>. For more information, see <a href="http://msdn.microsoft.com/library/dn606154.aspx">Introduction to SQL Server 2014 Hybrid Cloud</a>.
      <li type=round>Supports disaster recovery for on-premises SQL Server applications  using  <a href="http://msdn.microsoft.com/library/jj919148.aspx">backup on Azure Storage</a> or <a href="http://msdn.microsoft.com/library/azure/jj870962.aspx">AlwaysOn replicas in Azure VMs</a>.
      </ul></td>
   
</tr>
</table>

##<a name="business"></a>Business motivations when choosing Azure SQL Database or SQL Server in Azure VM

###<a name="cost"></a>Cost

Whether you’re a startup that is strapped for cash, or a team in an established company that operates under tight budget constraints, limited funding is often the primary driver when deciding how to host your databases. In this section, we’ll first learn about the billing and licensing basics in Azure with regards to these two relational database options: Azure SQL Database and SQL Server in Azure VM. Then, we’ll see how we should calculate the total application cost.

####<a name="billing"></a>Billing and licensing basics

**Azure SQL Database** is sold to customers as a service not with a license whereas SQL Server in Azure VM requires traditional SQL Server licensing. 

Currently, **Azure SQL Database** is available in several service tiers. For Basic, Standard, and Premium service tiers, you are billed hourly at a fixed rate based on the service tier and performance level you choose. The Basic, Standard, and Premium service tiers are designed to deliver predictable performance with multiple performance levels to match your application’s peak requirements. You can change between service tiers and performance levels to match your application’s varied throughput needs. For the latest information on the current supported service tiers, see [Azure SQL Database Service Tiers (Editions)](http://msdn.microsoft.com/library/azure/dn741340.aspx).

With **Azure SQL Database**, the database software is automatically configured, patched, and upgraded by Microsoft Azure in data centers all over the world. Therefore, you gain reduced administration costs. In addition, its [built-in backup](http://msdn.microsoft.com/library/azure/jj650016.aspx) capabilities help you achieve significant cost savings, especially, when you have large number of databases. When using Azure SQL Database, you are not billed for individual queries running against Azure SQL Database or incoming/outgoing internet traffic. If your database has high transactional volume and need to support many concurrent users, we recommend that you use Premium rather than Basic or Standard service tiers. 

With **SQL Server in Azure VM**, you utilize traditional SQL Server licensing. You can either use the platform-provided SQL Server image or bring your SQL Server license to Azure. When using the SQL Server platform provided images, the cost depends on the VM size as well as the version of SQL Server you choose. Basically, you pay per minute licensing cost of SQL Server, the per-minute licensing of Windows Server, and the Azure storage cost. The per-minute billing option allows you to use SQL Server for as long as you need it without buying full SQL Server license. If you bring your own SQL Server license to Azure, you are charged for Azure compute and storage costs only. For more information, see [License Mobility through Software Assurance on Azure](http://azure.microsoft.com/pricing/license-mobility/).

####<a name="appcost"></a>Calculating the total application cost

When you start using a cloud platform, the cost of running your application mainly includes the development and administration costs; and also the service costs that the public cloud platform requires.

Here is the detailed cost calculation for your application running in Azure SQL Database and SQL Server in Azure VM:

**When using Azure SQL Database:**

*Total cost of application = Highly minimized administration costs + software development costs + Azure SQL Database service costs*

**When using SQL Server in Azure VM:**

*Total cost of application = Minimized software development/modification costs + administration costs +  SQL Server & Windows Server licensing costs + Azure Storage costs* 

**Important note:** Currently, Azure SQL Database does not support all the features of SQL Server. For a detailed comparison information, see [Azure SQL Database Guidelines and Limitations](http://msdn.microsoft.com/library/azure/ff394102.aspx). Be aware of this when you want to move an existing database to Azure SQL Database as you might need some additional budget on database redesign. Azure SQL Database is Microsoft’s platform as-a-service offering. When you migrate an existing on-premises SQL Server application to Azure SQL Database, we recommend that you update the application to take all advantages of the platform-as-a-service offering. For example, start using [Azure Web Sites](http://azure.microsoft.com/documentation/services/websites/) or [Azure Cloud Services](http://azure.microsoft.com/services/cloud-services/) on the application layer to increase cost benefits. In addition, validate your application against different Azure SQL Database service tiers and check which one fits best to your application’s needs. This process helps you achieve better performance results and minimized costs. For more information, see [Azure SQL Database Service Tiers and Performance Levels](http://msdn.microsoft.com/library/azure/dn741336.aspx).

For a detailed cost estimate, use the [Azure Pricing Calculator](http://azure.microsoft.com/pricing/calculator/). 

For more information on pricing, see the following resources:

- [Azure SQL Database Pricing Details](http://azure.microsoft.com/pricing/details/sql-database/) 
- [Virtual Machine Pricing Details](http://azure.microsoft.com/pricing/details/virtual-machines/)
- [SQL Server in Azure VMs - Pricing Details](http://azure.microsoft.com/pricing/details/virtual-machines/#sql-server)
- [Windows Server in Azure VMs - Pricing Details](http://azure.microsoft.com/pricing/details/virtual-machines/#windows) 

###<a name="admin"></a>Administration

If your hands are already full of so many tasks, perhaps taking on server and database administration is not something you’re looking forward to. For many businesses, the decision to go with a cloud service is all about the ability to offload the complexity of administration. With **Azure SQL Database**, Microsoft administers the physical hardware such as hard drives, servers, and storage; automatically replicates all data to provide high availability; configures and upgrades the database software; manages load balancing; and does transparent failover if there is a server failure. You can continue to administer your Azure SQL Database instances but without controlling the physical resources of the underlying SQL Server instance and of the Azure platform.  For example, you can administer databases and logins, do index tuning, and optimize queries, but cannot administer system tables and filegroup management. For more information, see [Azure SQL Database Guidelines and Limitations](http://msdn.microsoft.com/library/ff394102.aspx). 

On the other hand, you might have in-house expertise and a desire to keep control over database location down to the machine itself. With **SQL Server running in Azure VM**, you have full control over the operating system and SQL Server instance configuration. With a VM, it’s up to you to decide when to update/upgrade the operating system and database software, and when to install any additional software such as anti-virus and backup tools. In addition, you can control the size of the VM, the number of disks, and their storage configurations.  For example, Azure allows you to change the size of a running VM as needed. For information, see [Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/azure/dn197896.aspx).

###<a name="sla"></a>Service level agreement (SLA)

For some of us, meeting the up-time obligations of a Service Level Agreement (SLA) is the top priority. In this section, we look at what SLA means for each database hosting option.

For **Azure SQL Database**, given the Basic, Standard, and Premium service tiers, Microsoft provides an availability SLA of 99.99%.  Notice that the availability SLA addresses the ability to connect to the database. In other words, it is a database-level SLA. For the latest information on SLAs, see [Service Level Agreement](http://azure.microsoft.com/support/legal/sla/). For the latest information on Azure SQL Database Service Tiers (Editions) and the supported business continuity plans, see [Azure SQL Database Service Tiers](http://msdn.microsoft.com/library/dn741340.aspx).

For **Virtual Machines hosted in Azure**, Microsoft provides an availability SLA of 99.95% and this availability is for the VM, not for the processes running inside the VM (such as, SQL Server). The [VM SLA](http://www.microsoft.com/download/details.aspx?id=38427) requires that you host at least two VMs in an availability set. With such configuration, Azure guarantees that at least one of the VMs will be available 99.95% of the time.  For database high availability (HA) within VMs, you should configure one of the supported high availability options in SQL Server, such as AlwaysOn Availability Groups. Note that setting up AlwaysOn in Azure requires some manual configuration and management, and you pay extra for each secondary you operate.


###<a name="market"></a>Time to market

**Azure SQL Database** is the right solution for cloud-designed applications when developer productivity and fast time-to-market are critical. With programmatic DBA-like functionality, it is perfect for cloud architects and developers as it lowers the need for managing the underlying operating system and database. It helps developers understand and configure database-related tasks. For example, you can use the [REST API](http://msdn.microsoft.com/library/azure/dn505719.aspx) and [PowerShell cmdlets](http://msdn.microsoft.com/library/azure/dn546726.aspx) to automate and manage administrative operations for thousands of databases. With elastic scale in the cloud, you can easily focus on the application layer and deliver your application to the market faster. 

**SQL Server running in Azure VM** is perfect if your existing and new applications require access and control to all features of a SQL Server instance, and when you want to migrate existing on-premises applications and databases to the cloud as-is. Since you do not need to change the presentation, application, and data layers, you save time and budget on rearchitecting your existing solution. Instead, you can focus on migrating all your solution packages to the VMs and doing some performance optimizations required by the Azure platform. For information, see [Performance Best Practices for SQL Server in Azure Virtual Machines](http://msdn.microsoft.com/library/azure/dn133149.aspx).

##<a name="summary"></a>Summary

In this article, we explored: Azure SQL Database and SQL Server in Azure VM. In addition, we discussed common business motivators that might affect decision making on which one to choose.  

The following is a summary of suggestions for you to consider when to use one or the other:

Choose **Azure SQL Database**, if:

- You are building brand new, cloud-based applications; or you want to migrate your existing SQL Server database to Azure and your database is not using one of the unsupported functionalities in Azure SQL Database. For more information, see [Azure SQL Database Transact-SQL Reference](http://msdn.microsoft.com/library/azure/ee336281.aspx). This approach provides the benefits of a fully managed cloud service and ensures the fast time-to-market.

- You want to have Microsoft perform common management operations on your databases and require stronger availability SLAs for databases. This approach can minimize the administration costs and at the same time provides a guaranteed availability for the database. 

Choose **SQL Server in Azure VM**, if:

- You have existing on-premises applications and wish to stop maintaining your own hardware or you consider hybrid solutions. This approach lets you get access to high database capacity faster and also connects your on-premises applications to the cloud via a secure tunnel.

- You have existing IT resources, need full administrative rights over SQL Server, and require the full compatibility with on-premises SQL Server (for example, some features do not exist in Azure SQL Database). This approach lets you minimize costs for development or modifications of existing applications with the flexibility to run most applications. In addition, it provides full control on the VM, operating system, and database configuration.

##<a name="ack"></a>Acknowledgements

This article from the Microsoft Cloud and Enterprise Content Services group was produced with the help of many people within the Microsoft community.

**Author:** Selcin Turkarslan

**Technical Contributors:** Conor Cunningham

**Technical Reviewers:** Joanne Marone (Hodgins), Karthika Raman, Lindsey Allen, Lori Clark, Luis Carlos Vargas Herring, Nosheen Syed Wajahatulla Hussain, Pravin Mittal, Shawn Bice, Silvano Coriani, Tony Petrossian, Tracy Daugherty.

**Editorial Reviewers:** Heidi Steen, Maggie Sparkman.

Thank you all for bringing this article to life!

##<a name="resources"></a>Additional Resources 

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle">Resource</th>
   <th align="left" valign="middle">Description</th>
</tr>
<tr>
   <td valign="middle"><p><a href="http://msdn.microsoft.com/library/azure/ee336279.aspx">MSDN: Azure SQL Database</a></p>
<p><a href="http://msdn.microsoft.com/library/azure/jj823132.aspx">MSDN: SQL Server in Azure Virtual Machines</a></p>

<p><a href="http://azure.microsoft.com/services/sql-database/">Azure.com: Azure SQL Database</a></p></td>
   <td valign="middle">Links to the library documentation.</td>   
</tr>
<tr>
   <td valign="middle"><p><a href="http://msdn.microsoft.com/library/azure/jj879332.aspx">Azure SQL Database and SQL Server -- Performance and Scalability Compared and Contrasted</p></td>
   <td valign="middle">This article explains performance differences and troubleshooting techniques when using Azure SQL Database and SQL Server running on-premises or in a VM. </td>   
</tr>
<tr>
   <td valign="middle"><p><a href="http://msdn.microsoft.com/library/dn574746.aspx">Application Patterns and Development Strategies for SQL Server in Azure Virtual Machines</p></td>
   <td valign="middle">This article discusses the most common application patterns that apply to SQL Server in Azure VMs and also hybrid scenarios including Azure SQL Database. </td>   
</tr>
<tr>
   <td valign="middle"><p><a href="http://msdn.microsoft.com/library/hh680934(v=PandP.50).aspx">Microsoft Enterprise Library Transient Fault Handling Application Block</p></td>
   <td valign="middle">This library lets developers make their applications running on Azure SQL Database more resilient by adding robust transient fault handling logic. Transient faults are errors that occur because of some temporary condition such as network connectivity issues or service unavailability. Since Azure SQL Database is a multitenant service, it is important to handle such errors to minimize any application downtime. </td>   
</tr>
</table>

<!--Image references-->
[1]: ./media/data-management-azure-sql-database-and-sql-server-iaas/SQLIAAS_SQL_Server_Cloud_Continuum.png
