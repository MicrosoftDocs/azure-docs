---
title: Azure Synapse database templates
description: Learn about database templates and what is a lake database.
author: gesaur
ms.author: gesaur
ms.topic: overview #Required; leave this attribute/value as-is.
ms.date: 11/02/2021
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

A typical database templates addresses the core requirements of a specific industry and consists of a bundle of: 

 - supporting set of business area templates 
 - one or more enterprise templates   

# Business area templates  

Business area templates provide the most comprehensive and granular view of data for a business or subject area. Business area models are also referred to as Subject Area or domain templates. Business area templates contain tables and columns relevant to a particular business within an industry. Data stewards, data governance team, business teams within an organization can use the business area templates to build business centric data schema that facilitate detailed communication of business requirements and scope. Each business area templates is constructed from a common set of entities from the corresponding industry enterprise database template the ensures that business area templates will have common keys, attributes and definitions consistent with other industry models. E.g., Accounting & Financial Reporting, Marketing, Budget & Forecasting are business area templates for many industries such as Retail, or Banking etc. 

[[business-area-template-example.png|alt=Business area template example]]


# Enterprise templates 

Enterprise database templates contain a subset of tables that are most likely to be of interest to an organization within a specific industry. It provides a high-level overview and describes the connectivity between the related business area templates. These templates serves as an accelerator for many types of large projects. For example, the Oil & Gas models has 1 enterprise template called "Banking". 

[[enterprise-template-example.png|alt=Enterprise template example]]
