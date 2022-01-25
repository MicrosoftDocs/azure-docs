---
title: Overview of Azure Synapse database templates
description: Learn about database templates
author: gsaurer
ms.author: gesaur
ms.service: synapse-analytics
ms.subservice: database-editor
ms.topic: overview
ms.date: 11/02/2021
ms.custom: template-overview, ignite-fall-2021
---

# What is Azure Synapse database templates

Data takes many forms as it moves from source systems to data warehouses and data marts with the intent to solve business problems. Database templates can help with the transformation of data into insights. Database templates are a set of business and technical data definitions that are pre-designed to meet the needs of a particular industry. They act as blueprints that provide common elements derived from best practices, government regulations, and the complex data and analytic needs of an industry-specific organization. 

These information blueprints can be used by organizations to plan, architect, and design data solutions for data governance, reporting, business intelligence, and advanced analytics. The data models provide integrated business-wide information architectures that can help you implement, in a timely and predictable way, a proven industry data architecture. 

For example, if you're building a product recommendation solution for your retail customers, you'll need a basic blue-print to understand what the customer purchased and the transaction that led to the purchase. You may also need information about the store where the purchase was made. You also need to understand whether the customer is part of a loyalty program. Just to accomplish this use case we need the following schemas: 

 - Product 
 - Transaction 
 - TransactionLineItem 
 - Customer 
 - CustomerLoyalty 
 - Store 

You can set up this use case by selecting the six tables in the retail database template. 

![image](https://user-images.githubusercontent.com/84302758/140736847-9d93436d-47b4-4175-8b09-a33de0bcde05.png)

A typical database template addresses the core requirements of a specific industry and consists of: 

 - A supporting set of [business area templates](concepts-database-templates.md#business-area-templates).
 - One or more [enterprise templates](concepts-database-templates.md#enterprise-templates).  

## Available database templates 

Currently, you can choose from 11 database templates in Azure Synapse Studio to start creating your lake database: 

 - **Agriculture** - for companies engaged in growing crops, raising livestock, and dairy production.
 - **Banking** - for companies that analyze banking data.
 - **Consumer Goods** - for manufacturers or producers of goods bought and used by consumers.
 - **Energy & Commodity Trading** - for traders of energy, commodities, or carbon credits.
 - **Freight & Logistics** - for companies that provide freight and logistics services.
 - **Fund Management** - for companies that manage investment funds for investors.
 - **Life Insurance & Annuities** - for companies that provide life insurance, sell annuities, or both.
 - **Oil & Gas** - for companies that are involved in various phases of the Oil & Gas value chain.
 - **Property & Casualty Insurance** - for companies that provide insurance against risks to property and various forms of liability coverage.
 - **Retail** - for sellers of consumer goods or services to customers through multiple channels.
 - **Utilities** - for gas, electric, and water utilities; power generators; and water desalinators.

As emission and carbon management is an important discussion in all industries, we've included those components in all the available database templates. These components make it easy for companies who need to track and report their direct and indirect greenhouse gas emissions.

## Next steps
Continue to explore the capabilities of the database designer using the links below.
- [Database templates concept](concepts-database-templates.md)
- [Quick start](quick-start-create-lake-database.md)
