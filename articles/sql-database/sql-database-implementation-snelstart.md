---
title: Azure SQL Database Azure Case Study - Snelstart | Microsoft Docs
description: Learn about how SnelStart uses SQL Database to rapidly expanded its business services at a rate of 1,000 new Azure SQL Databases per month
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: fab506b2-439d-4f1a-bdc5-d1d25c80d267
ms.service: sql-database
ms.custom: reference
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/10/2017
ms.author: carlrab

---
# With Azure, SnelStart has rapidly expanded its business services at a rate of 1,000 new Azure SQL Databases per month
![SnelStartLogo](./media/sql-database-implementation-snelstart/snelstartlogo.png)

SnelStart makes popular financial- and business-management software for small- and medium-sized businesses (SMBs) in the Netherlands. Its 55,000 customers are serviced by a staff of 110 employees, including an IT staff of 35. By moving from desktop software to a software-as-a-service (SaaS) offering built on Azure, SnelStart made the most of built-in services, automating management using familiar environment in C#, and optimizing performance and scalability by neither over- or under-provisioning businesses using elastic pools. Using Azure provides SnelStart the fluidity of moving customers between on-premises and the cloud.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Azure-SQL-Database-Case-Study-SnelStart/player]
> 
> 

## Why SnelStart extended services from the desktop to the cloud
> “Working with Azure means we can deliver software faster, quickly react to customer demands, and scale solutions when demands increase.”
> 
> — Henry Been, Software Architect
> 
> 

SnelStart ran a successful software business for years, using a traditional development model: code, package, ship, and repeat. Over time, the pace of change grew faster and faster. Regulations changed frequently, and customers needed easier ways to process financial records and collaborate with their accountants and government to keep up with those changes.

“Shipping software to customers was costly and limiting,” according to Henry Been, software architect. “Production, packaging, and shipping costs limited how often we could release software. We had to package updates for periodic shipments, but that made it hard to meet our customers’ changing needs. We could never be assured that our customers upgraded to the latest version of the product. Therefore, we had to support multiple versions, making the support job very hard to do well.”

Been adds, “We wanted a way to program and release updates at an accelerated pace, so we could innovate faster and create new services for our customers. We also wanted a way to automate more processes in order to simplify our customers’ business-administration needs.”

For SnelStart, the solution was to extend its services by becoming a cloud-based SaaS provider. The Azure SQL Database platform helped SnelStart get there without incurring the major IT overhead that an infrastructure-as-a-service (IaaS) solution would have required.

The cloud model also enables SnelStart to fix bugs and provide new features rapidly, without customers needing to download and upgrade software. According to Been, “Using Azure cloud services enables us to quickly act upon changing requirements from third parties. Instead of having to ship a new version to thousands of customers, we can adapt information sent from our desktop application to new formats required by third parties.”

## A modern company with traditional roots
SnelStart is a modern, agile, high-tech business with humble roots dating to 1964, when the founders started the company as a manufacturer of musical instrument parts. The heart of the SnelStart software business really started beating in the 1980s, during the proliferation of the personal computer. The company needed a better alternative to the accounting software available at the time, so it took matters into its own hands. In 1982, the company created the foundation of what would eventually become SnelStart accounting software. From the start, the software was admired for its simplicity and speed—so much so that the company eventually changed focus and reinvented itself into a software company.

In 1995, SnelStart released its first bookkeeping application for Windows. The application, built on Microsoft Visual Basic 1.0 and Microsoft Access databases, helped grow the customer base to more than 5,000 users.

Today, SnelStart is a major provider of a line-of-business (LOB) and business-administration application targeted at Dutch SMBs and self-employed entrepreneurs. As Carlo Kuip, IT architect, says, “Our goal is to provide 100-percent automation of business-administration services for our customers.”

## Optimizing performance and cost with elastic pools
SnelStart was a large-scale early adopter of elastic pools. Elastic pools help the company limit costs and manage performance requirements more efficiently. According to Been, “By using elastic pools, we can optimize performance based on the needs of our customers, without over-provisioning. If we had to provision based on peak load, it would be quite costly. Instead, the option to share resources between multiple, low-usage databases allows us to create a solution that performs well and is cost effective.”

## Azure SQL Databases help containerize data for isolation and security
Azure SQL Database enables SnelStart to easily and transparently move customers’ on-premises business-administration data to Azure. The Azure SQL Database is a convenient container that provides isolation, a boundary for authentication, authorization, and easy backup and restore capabilities. Databases provide a well-suited conceptual model for business administration. According to Carlo Kuip, IT architect, “Items within this container boundary contain sensitive data that is crucial to a business, and storing those items in an isolated database keeps them well protected. We can manage authorization at the database level, and even automate the management and scale-out of these databases without requiring database administrators (DBAs) on staff.”

Azure SQL Data Warehouse also plays a role in the SnelStart security and management story by helping the company gather telemetry data, such as intrusion detection, user activity logging, and connectivity.

## Azure removes overhead so that developers can spend more time delivering value
The Azure platform model removed infrastructure overhead and enabled SnelStart to automate deployments using C# management libraries. As Kuip states, “We were able to grow our current operations with a very small staff while simultaneously increasing scalability, speed, and disaster recovery options for our clients. The shift to services development freed up resources to focus on new services and features, instead of just updating existing code to keep up with new regulations or tax codes.” He adds, “By automating management and using the SaaS offering, we are able to deliver more value for our clients without having to make large investments in operational staff.” For example, by using Azure and elastic pools, SnelStart was able to add a variety of new features, including more robust customer-data integration with banks, new billing services, small-business background checks, and email services.

> "In just the first few months of 2016, we expanded our Azure SQL Database deployments from about 5,500 to more than 12,000, and we’re currently adding about 1,000 databases per month.”
> 
> — Henry Been, Software Architect
> 
> 

Database management is further automated by using the elastic jobs feature. As Kuip states, “We highly appreciate the automatic discovery of databases on a [server] instance of SQL DB.” This allows SnelStart to execute management operations across their dynamically growing customer base without additional overhead.

SnelStart is also developing an API that acts as a broker between customer data and apps built by third-party software partners. As Kuip states, “This API will enable other vendors to add functionality to our software, such as eliminating data entry for invoices and other documents.” Customers will no longer have to manually type invoices into their small-business accounting software; the SnelStart software will exchange the necessary information directly. This allows customers to join their business-administration tasks with the ecosystem of information that is emerging from digital transformation in the industry.  

## How Azure services enable SaaS for SnelStart
By using Azure, SnelStart can serve its customers and their accountants more seamlessly in the cloud. For example, both customers and accountants can share information by directly accessing SnelStart’s client API, hosted on Azure. Kuip states, “These reusable services are available to our customer-facing web apps, and they provide common infrastructure and functions to allow access to business administration for customers and to third-party software used by our customers. Examples include providing product-configuration capabilities, managing firewall rules, and managing long-running processes like backups.”

> Our goal is to provide 100-percent automation of business-administration services for our customers.” 
> 
> — Carlo Kuip, IT Architect
> 
> 

In addition, SnelStart web services allow both customers and accountants to easily access data in Azure SQL Database elastic pools. This SaaS model, coupled with database elasticity and Azure Resource Manager, provides SnelStart with scalability features that complement every Azure deployment. The implementation is fully automated using C# management libraries.

![SnelStart architecture](./media/sql-database-implementation-snelstart/figure1.png)

Figure 1. As of June 2016, SnelStart has more than 11,000 databases and more than 50 elastic pools

## Simplicity from the cloud
Since moving to an Azure cloud-based solution, SnelStart has been able to support rapid customer growth while offering innovative features and services. According to Been, “With Azure, we can deliver near-continuous updates for our customers, without expanding our operations staff. And we get all the other great Azure features—like scalability and disaster recovery—bundled in.”

> "When we were actually over in Redmond...I received a call from a developer back in the Netherlands, phoning me about a specific problem. We were able to get Microsoft to deliver a change in their production environment within 48 hours to solve our problem."
> 
> — Henry Been, Software Architect
> 
> 

SnelStart also appreciates the strong partnership they’ve developed with the Microsoft Azure SQL DB team. As Kuip states, “we have discussions on features and how to use technology, which is something appreciated on both sides.”
The immediate goal for SnelStart is to keep growing its satisfied customer base. As Been states, “Without the technical and resource limitations that we had as an ISV, there’s no limit to how far we can grow.”

## More information
* To learn more about Azure elastic pools, see [elastic pools](sql-database-elastic-pool.md).
* To learn more about Web roles and worker roles, see [worker roles](../fundamentals-introduction-to-azure.md#compute).    
* To learn more about Azure SQL Data Warehouse,see [SQL Data Warehouse](https://azure.microsoft.com/documentation/services/sql-data-warehouse/)
* To learn more about SnelStart, see [SnelStart](http://www.snelstart.nl).

