---
title: Overview of Azure Synapse database templates
description: Learn about database templates
author: gsaurer
ms.author: gesaur
ms.reviewer: wiassaf
ms.service: synapse-analytics
ms.subservice: database-editor
ms.topic: overview
ms.date: 05/17/2023
ms.custom: template-overview, ignite-fall-2021
---

# What are Azure Synapse database templates?

Data takes many forms as it moves from source systems to data warehouses and data marts with the intent to solve business problems. Database templates can help with the transformation of data into insights. 

Database templates are a set of business and technical data definitions that are pre-designed to meet the needs of a particular industry. They act as blueprints that provide common elements derived from best practices, government regulations, and the complex data and analytic needs of an industry-specific organization. 

These schema blueprints can be used by organizations to plan, architect, and design data solutions for data governance, reporting, business intelligence, and advanced analytics. The data models provide integrated business-wide information architectures that can help you implement, in a timely and predictable way, a proven industry data architecture. 

For example, if you're building a product recommendation solution for your retail customers, you'll need to understand what the customer purchased and the transaction that led to the purchase. You may also need information about the store where the purchase was made, and whether the customer is part of a loyalty program. Just to accomplish this use case, consider the following schemas: 

* Product 
* Transaction 
* TransactionLineItem 
* Customer 
* CustomerLoyalty 
* Store 

You can set up this use case by selecting the six tables in the **Retail** database template. 

![image](https://user-images.githubusercontent.com/84302758/140736847-9d93436d-47b4-4175-8b09-a33de0bcde05.png)

A typical database template addresses the core requirements of a specific industry and consists of: 

* One or more [enterprise templates](concepts-database-templates.md#enterprise-templates).
* Tables grouped by **business areas**.   

## Available database templates 

Currently, you can choose from the following database templates in Azure Synapse Studio to start creating your lake database: 

* **Airlines** - For companies operating passenger or cargo airline services.
* **Agriculture** - For companies engaged in growing crops, raising livestock, and dairy production.
* **Automotive** - For companies manufacturing automobiles, heavy vehicles, tires, and other automotive components.
* **Banking** - For companies providing a wide range of banking and related financial services.
* **Consumer Goods** - For manufacturers or producers of goods bought and used by consumers.
* **Energy & Commodity Trading** - For traders of energy, commodities, or carbon credits.
* **Freight & Logistics** - For companies that provide freight and logistics services.
* **Fund Management** - For companies that manage investment funds for investors.
* **Genomics** - For companies acquiring and analyzing genomic data about human beings or other species.
* **Government** - For organizations controlling, regulating or providing services to a country/region, state or province, or community.
* **Healthcare Insurance** - For organizations providing insurance to cover healthcare needs (sometimes known as Payors).
* **Healthcare Provider** - For organizations providing healthcare services.
* **Life Insurance & Annuities** - For companies that provide life insurance, sell annuities, or both.
* **Manufacturing** - For companies engaged in discrete manufacturing of a wide range of products.
* **Mining** - For companies extracting and processing minerals.
* **Oil & Gas** - For companies that are involved in various phases of the Oil & Gas value chain.
* **Pharmaceuticals** - For companies engaged in creating, manufacturing, and marketing pharmaceutical and bio-pharmaceutical products and medical devices.
* **Property & Casualty Insurance** - For companies that provide insurance against risks to property and various forms of liability coverage.
* **R&D and Clinical Trials** - For companies involved in research and development and clinical trials of pharmaceutical products or devices.
* **Retail** - For sellers of consumer goods or services to customers through multiple channels.
* **Travel Services** - For companies providing booking services for airlines, hotels, car rentals, cruises, and vacation packages.
* **Utilities** - For gas, electric, and water utilities; power generators; and water desalinators.
 
As emission and carbon management is an important discussion in all industries, so we've included those components in all the available database templates. These components make it easy for companies who need to track and report their direct and indirect greenhouse gas emissions.

## Next steps

Continue to explore the capabilities of the database designer using the links below.
* [Database templates concept](concepts-database-templates.md)
* [Quick start](quick-start-create-lake-database.md)
