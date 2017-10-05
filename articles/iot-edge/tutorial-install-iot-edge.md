---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Intent and product brand in a unique string of 43-59 chars including spaces | Microsoft Docs 
description: 115-145 characters including spaces. Edit the intro para describing article intent to fit here. This abstract displays in the search result.
services: service-name-with-dashes-AZURE-ONLY 
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: github-alias
ms.author: MSFT-alias-person-or-DL
ms.date: 10/05/2017
ms.topic: article-type-from-white-list
# Use only one of the following. Use ms.service for services, ms.prod for on-prem. Remove the # before the relevant field.
# ms.service: service-name-from-white-list
# product-name-from-white-list

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
# manager: MSFT-alias-manager-or-PM-counterpart
---

﻿<!---
Purpose of an Overview article: 
1. To give a TECHNICAL overview of a service/product: What is it? Why should I use it? It's a "learn" topic that describes key benefits and our competitive advantage. It's not a "do" topic.
2. To help audiences who are new to service but who may be familiar with related concepts. 
3. To compare the service to another service/product that has some similar functionality, ex. SQL Database / SQL Data Warehouse, if appropriate. This info can be in a short list or table. 
-->

# Page heading (H1) 
<!---
Unique, complements the page title, and 100 characters or fewer including spaces.
-->

*H1 EXAMPLE*:
What is SQL Database? 

<!---
Intro paragraph: 
1. 2-4 sentences (with a few bullet points if helpful).
2. What service is, why you use it.
3. Include a simple conceptual image if it will help customers understand the service and features. 
-->

*INTRO EXAMPLE 1*:
The Azure Virtual Network service enables you to securely connect Azure resources to each other with virtual networks (VNets). A VNet is a representation of your own network in the cloud. A VNet is a logical isolation of the Azure cloud dedicated to your subscription. You can also connect VNets to your on-premises network. 

*INTRO EXAMPLE 2*:
Azure SQL Data Warehouse is a massively parallel processing (MPP) cloud-based, scale-out, relational database capable of processing massive volumes of data.

SQL Data Warehouse:

- Combines the SQL Server relational database with Azure cloud scale-out capabilities.
- Decouples storage from compute.
- Enables increasing, decreasing, pausing, or resuming compute.
- Integrates across the Azure platform.
- Utilizes SQL Server Transact-SQL (T-SQL) and tools.
- Complies with various legal and business security requirements such as SOC and ISO.

This article describes key benefits of SQL Data Warehouse.

## H2s (section headings and section text)
<!---
The H2s state the benefits.
1. Use  4-8 H2s. They are repeated in the right pane, which should not look cluttered.
2. Start with a verb. Two reasons: 1) verbs help users understand how to use the service, 2) the consistency improves scannability.
3. The section text relates benefits to supporting features with inline links to more detail. Use not just MS terms but also industry terms to improve SEO.
-->

*H2 AND SECTION TEXT EXAMPLE 1*:

## Maximize resource utilization

For many businesses and apps, being able to create single databases and dial performance up or down on demand is enough, especially if usage patterns are relatively predictable. But if you have unpredictable usage patterns, it can be hard to manage costs. [Elastic pools](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-pool) are designed to solve this problem. The concept is simple. You allocate performance resources to a pool rather than an individual database, and you pay for the collective performance resources of the pool rather than a single database performance. With elastic pools, you don’t need to focus on dialing database performance up and down as demand for resources fluctuates. The pooled databases consume the performance resources of the elastic pool as needed. 

Pooled databases consume but don’t exceed the limits of the pool, so your cost remains predictable even if individual database usage doesn’t. What’s more, you can [add and remove databases to the pool](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-pool-manage-portal), scaling your app from a handful of databases to thousands, all within a budget that you control. Finally, you can also control the minimum and maximum resources available to databases in the pool to ensure that no database in the pool uses all the pool resource and that every pooled database has a guaranteed minimum amount of resources. To learn more about design patterns for SaaS applications using elastic pools, see [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-design-patterns-multi-tenancy-saas-applications).

*H2 AND SECTION TEXT EXAMPLE 2*:

## Filter network traffic

You can filter network traffic between subnets using either or both of the following options:

- Network security groups (NSG): Each NSG can contain multiple inbound and outbound security rules that enable you to filter traffic by source and destination IP address, port, and protocol. You can apply an NSG to each NIC in a VM. You can also apply an NSG to the subnet a NIC, or other Azure resource, is connected to. To learn more about NSGs, see [Network security groups](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg).
- Network virtual appliances (NVA): An NVA is a VM running software that performs a network function, such as a firewall. View a list of [available NVAs in the Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?page=1&subcategories=appliances). NVAs are also available that provide WAN optimization and other network traffic functions. NVAs are typically used with user-defined or BGP routes. You can also use an NVA to filter traffic between VNets.

<!---
Other guidelines: 
Tip, note, important, warning: Use these extensions SPARINGLY to highlight info that broadens a user's knowledge. *Tip* is an easier way to do something, *Note* is "by the way" info, *Important* is info critical to completing a task, *Warning* is serious potential problem such as data loss.
-->

*NOTE EXAMPLE:*

> [!NOTE]
> Depending on how many of the SDK dependencies you already have on your computer, installing the SDK could take from several minutes to a half hour or more.

## Next steps

<!---
Link to 3-4 logical next steps: Ex. Quickstart, pricing info and SLA, tutorial. Don't repeat links you've already provided. 
-->
*NEXT STEPS EXAMPLE:*

Now that you have an overview of SQL Database here are suggested next steps: 

- Get started by [creating your first database](https://docs.microsoft.com/azure/sql-database/sql-database-get-started-portal).
- Build your first app in C#, Java, Node.js, PHP, Python, or Ruby: [Connection libraries for SQL Database and SQL Server](https://docs.microsoft.com/azure/sql-database/sql-database-libraries)
- See the [pricing page](https://azure.microsoft.com/en-us/pricing/details/sql-database/) and [SLA page](https://azure.microsoft.com/support/legal/sla/).