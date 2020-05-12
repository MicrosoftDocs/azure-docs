---
title: What's changed with the Azure SQL Managed Instance rebrand? 
description: This article explains the changes associated with the rebrand of Azure SQL Managed Instance.
services: sql-database
ms.service: sql-database
ms.subservice: scale-out
ms.custom: sqldbrb=4
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author: joke
ms.reviewer: 
ms.date: 05/27/2020
---
# What's changed with the Azure SQL Managed Instance rebrand?

Instead of being treated as a deployment option of Azure SQL Database, [Azure SQL Managed Instance](sql-database-managed-instance.md) has been split off and rebranded as its own independent service within the [Azure SQL service family](what-is-azure-sql-iaas-vs-paas.md). 

This article explains the rebrand, as well as what's different and what's the same with Azure SQL Managed Instance, previously known as _Azure SQL Database_managed instance_. 


## Why?

When Azure SQL Managed Instance was originally developed, it was seen as just a deployment variation option of Azure SQL Database - you could deploy a database in Azure SQL Database either as a single database, or to a managed instance. However, as the service matured, it became evident that treating it in as an option of Azure SQL Database not only detracts from effectively showcasing its functionality, but constantly grouping the two causes confusion for customers trying to use either service. 

In the content, we would have to constantly differentiate between the different deployment options:
Azure SQL Database single database
Azure SQL Database elastic pool
Azure SQL Database managed instance 

Since some features and functionality vary greatly between a single database and managed instance, it became increasingly more of a challenge trying to explain complex nuances between the different "deployment options" of Azure SQL Database. 

Treating a managed instance as an option of Azure SQL Database made it unclear that it's a service powerhouse of its own, diminishing its capabilities and strengths. As such, we are splitting the conceptual understanding of what a managed instance is. Instead of it just being a deployment option of Azure SQL Database, it is now considered its own fully independent service within the Azure SQL family of services, known as the "Azure SQL Managed Instance". 

This change simplifies and streamlines the process when working with SQL in Azure, whether that be a single managed database in Azure SQL Database, a fully-fledged managed instance hosting multiple databases in Azure SQL Managed Instance, or the familiar on-premises SQL Server product but hosted on a virtual machine in Azure. 


## What's changed? 

Most of the associated changes with the Azure SQL Managed Instance rebrand are superficial, such as the name itself. Azure SQL Managed Instance has a new [service page????](https://azure.microsoft.com/services/sql-managed-instance/), and a new [pricing page???????](https://azure.microsoft.com/pricing/details/sql-managed-instance) - though the billing structure hasn't changed. 

( the question marks are to indicate the links don't exist yet and serve to remind me to update these - pls ignore for now)


This table provides a quick comparison for the change in terminology: 

|Previous term  |New term  |Explanation |
|---------|---------|---------|
|Azure SQL Database managed instance | Azure SQL Managed Instance | Azure SQL Managed Instance is now its own service, and not an option within Azure SQL Database. | 
|Azure SQL Database single database| Azure SQL Database| Unless explicitly specified otherwise, the product name Azure SQL Database includes both single database and databases deployed to an elastic pool. |
|Azure SQL Database elastic pool| Azure SQL Database| Unless explicitly specified otherwise, the product name Azure SQL Database includes both single database and databases deployed to an elastic pool.  |
|Azure SQL Database | Azure SQL Database | Though the term stays the same, it now only applies to single database and elastic pool deployments, and does not include managed instance. |
| N/A | Azure SQL | This refers to the family of SQL Server database engine services that are available in Azure: Azure SQL Database, Azure SQL Managed Instance, and SQL Server on Azure VMs. | 


## What's the same?

The features, functionalities, and capabilities of the product are entirely unchanged. You are still able to deploy the same SQL Managed Instance from the same [Azure portal](https://portal.azure.com), and you can still leverage all of the features and functionalities that were previously available prior to the name change.  


## Residual inconsistencies

Although most of the changes associated with the rebrand are superficial, there are still places within the code where a managed instance is treated as an option of Azure SQL Database. In the interest of transparency, and addressing confusion, these residual inconsistencies are documented below. However, this should not imply that there are plans to address these inconsistencies in the future, they are provided solely as informational. 

### Billing

Currently, when you deploy an Azure SQL Managed Instance, the billing statement will still reflect Azure SQL Database managed instance. 

### Azure Portal 

There are places in the Azure portal where the name is still inconsistent. 

#### Cost analysis 

When reviewing costs associated with Azure SQL Managed Instance on the **Cost Analysis** page, the service name is still `sql database`, even though the meter subcategories are managed instance specific. 

![Cost analysis blade](./media/sql-database-automated-backup/check-backup-storage-cost-sql-mi.png)

#### Support tickets

When you create a support ticket, the name of the service is still listed as `SQL Database Managed Instance`. 


![Support topic product](./media/quota-increase-request/select-quota-type.png)

#### Reservations

[Reserved capacity](sql-database-reserved-capacity.md) for an Azure SQL Managed Instance is still listed under the  **SQL Database** product. 

![Reservations](./media/azure-sql-managed-instance-rebrand/reservations.png)


## Next steps

Now that you're familiar with the Azure SQL Managed Instance rebrand, you can learn more about each service from the overview pages:

[What is Azure SQL?](what-is-azure-sql-iaas-vs-paas.md)   
[What is Azure SQL Database?](sql-database-technical-overview.md)   
[What is Azure SQL Managed Instance?](sql-database-managed-instance.md)   
[What is SQL Server on Azure VM](../virtual-machines/windows/sql/virtual-machines-windows-sql-server-iaas-overview.md)   