---
title: Overivew of Azure Synapse database templates
description: Learn about database templates 
author: gesaur
ms.author: gesaur
ms.topic: overview #Required; leave this attribute/value as-is.
ms.date: 13/10/2021
ms.custom: template-overview #Required; leave this attribute/value as-is.
---

# Azure Synapse database templates


The journey of data from source systems to data warehouses and data marts to solve business problems starts with data and how they are shaped. Database templates are a set of business and technical data definitions that are pre-designed to meet the needs of a particular industry. They act as blueprints that provide common elements derived from best practices, government regulations and the complex data and analytic needs of an industry-specific organization. 

These 'information blueprints' can be used by organizations for planning, architecting, designing, governing, reporting, business intelligence and advanced analytics. The data models provide a complete integrated business-wide information architecture and can help you with a timely and predictable way to implement a proven industry best-of-breed data architecture. 

For example, if you are building a product recommendation solution for your retail customers, you will require a basic blue-print to understand the customer purchased what product and the transaction that led to the purchase. Also, maybe we need to understand the store where the item from picked from. You also need to understand whether the customer is part of the loyalty program. Just to accomplish this use case we need the following schema: 

 - Product 
 - Transaction 
 - TransactionLineItem 
 - Customer 
 - CustomerLoyalty 
 - Store 

You can accomplish this use case by simply selecting the 6 tables in the retail database template. 

[[retail-database-template-example.png|alt=Retail database template example]]

A typical database template addresses the core requirements of a specific industry and consists of a bundle of: 

 - supporting set of [business area templates](concepts-database-templates.md#business-area-templates)
 - one or more [enterprise templates](concepts-database-templates.md#enterprise-templates)   



## Available database templates 

Currently there are 6 database templates available that customers can leverage to start creating their lake database. 

 - **Banking** - For companies who are analyzing banking data.
 - **Consumer Goods** - for manufacturers or producers of goods bought and used by consumers.
 - **Fund Management** - for companies managing investment funds on behalf of investors.
 - **Life Insurance & Annuities** - For companies who provide life insurance, sell annuities, or both.
 - **Property & Casualty Insurance** - For companies who provide insurance against risks to property and various forms of liability coverage.
 - **Retail** - for sellers of consumer goods or services to customers through multiple channels.

As emission and carbon management has become a very important topic in all industires we have included those components in all the available database templates to make it easy for companies who need to track and report their direct and indirect greenhouse gas emissions.

## Next steps
- [Learn more about database templates](concepts-database-templates.md)
- [Quick start](quick-start-create-lake-database.md)
