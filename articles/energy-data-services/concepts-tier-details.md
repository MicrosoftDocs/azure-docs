---
title: Microsoft Azure Data Manager for Energy tier concepts
description: This article describes tier concepts
author: tiannaward
ms.author: tiannaward
ms.service: energy-data-services
ms.topic: conceptual
ms.date: 07/11/2023
ms.custom: template-concept
---

# Azure Data Manager for Energy Tiers
Azure Data Manager for Energy is available in two tiers; Standard and Developer. 


## Developer Tier 
The Developer tier of Azure Data Manager is designed for software vendors and end user operators looking for more flexibility and speed in building out new applications and testing their [OSDU&trade;](https://osduforum.org) Data Platform backed solutions. The Developer tier provides users with the same high bar of security features, and application integration services as the Standard tier at a lower cost and with reduced resource capacity. Organizations can isolate and manage their test and production environments more cost-effectively. Use cases for the Developer tier of Azure Data Manager for Energy include:

* Evaluating and creating data migration strategy
* Building proof of concents and business case demonstrations
* Defining deployment pipeline
* Validating application compatibility
* Validating security features such as Customer Managed Encryption Keys (CMEK)
* Implementing sensitive data classification
* Testing new [OSDU&trade;](https://osduforum.org) Data Platform releases
* Validating data by ingesting in a safe pre-production environment
* Testing new 3rd party or in-house applications 
* Validating service updates
* Testing API functionality

Customers can isolate their test and production environments in a safe and effective way.


## Standard Tier 
The Standard tier of Azure Data Manager for energy is ideal for customers' production ready scenarios. These include:

* Operationalizing domain workflows (such as siesmic or well log)
* Deploying and testing predictive reservoir models to a production environment on the cloud
* Running subsurface models
* Migrating siesmic data across applications

The standard tier is designed for production scenarios as it provdides high availability, reliabiity and scale. The Standard tier includes the following:

* Availability Zones
* Disaster Recovery
* Financial Backed Service Level Agreement
* Higher Database Throughput
* Higher data partition maximum
* Higher support prioritization



## Tier Details
| Features | Developer Tier | Standard Tier |
| ------------ | ------- |  ------- |
Recommended Use Cases | Non Production scenario such as [OSDU&trade;](https://osduforum.org) testing, data validation, feature testing, troubleshooting, training, and proof of concepts. | Production data availability and business workflows
[OSDU&trade;](https://osduforum.org) Compatibility| Yes | Yes
Pre Integration w/ Leading Industry Apps | Yes | Yes
Support | Yes | Yes
Azure Customer Managed Encryption Keys|Yes| Yes
Azure Private Links|Yes| Yes
Financial Backed Service Level Agreement (SLA) Credits | No | Yes
Disaster Recovery |No| Yes
Availability Zones |No| Yes
Database Throughput |Low| High
Included Data Partition | 1| 1
Maximum Data Partition |5 | 10

## How to participate
You can easily create a Developer tier resource by going to Azure Marketplace, [create portal](https://portal.azure.com/#create/Microsoft.AzureDataManagerforEnergy), and select your desired tier. 