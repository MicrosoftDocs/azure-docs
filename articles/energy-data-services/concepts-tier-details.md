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

# Azure Data Manager for Energy tiers
Azure Data Manager for Energy is available in two tiers; Standard and Developer. 


## Developer tier 
The Developer tier of Azure Data Manager for Energy is designed for users who want more flexibility and speed in building out new applications and testing their [OSDU&trade;](https://osduforum.org) Data Platform backed solutions. The Developer tier provides users with the same high bar of security features, and application integration services as the Standard tier at a lower cost and with reduced resource capacity. Organizations can isolate and manage their test and production environments more cost-effectively. Use cases for the Developer tier of Azure Data Manager for Energy includes the following:

* Evaluating and creating data migration strategy
* Building proof of concepts and business case demonstrations
* Defining deployment pipeline
* Validating application compatibility
* Validating security features such as Customer Managed Encryption Keys (CMEK)
* Implementing sensitive data classification
* Testing new [OSDU&trade;](https://osduforum.org) Data Platform releases
* Validating data by ingesting in a safe pre production environment
* Testing new third party or in-house applications 
* Validating service updates
* Testing API functionality

Customers can isolate their test and production environments in a safe and effective way.


## Standard tier 
The Standard tier of Azure Data Manager for energy is ideal for customers' production ready scenarios. These include the following:

* Operationalizing domain workflows (such as seismic or well log)
* Deploying and testing predictive reservoir models to a production environment on the cloud
* Running subsurface models
* Migrating seismic data across applications

The standard tier is designed for production scenarios as it provides high availability, reliability and scale. The Standard tier includes the following:

* Availability Zones
* Disaster Recovery\*
* Financial Backed Service Level Agreement
* Higher Database Throughput
* Higher data partition maximum
* Higher support prioritization

(\*) Certain regions are restricted in supporting customer scenarios for disaster recovery. Please check the [Reliability in Azure Data Manager for Energy](reliability-energy-data-services.md) for more details on the regions which support disaster recovery.

## Tier details
| Features | Developer Tier | Standard Tier |
| ------------ | ------- |  ------- |
Recommended Use Cases | Non-Production scenario such as [OSDU&trade;](https://osduforum.org) Data Platform testing, data validation, feature testing, troubleshooting, training, and proof of concepts. | Production data availability and business workflows
[OSDU&trade;](https://osduforum.org) Data Platform Compatibility| Yes | Yes
Pre Integration w/ Leading Industry Apps | Yes | Yes
Support | Yes | Yes
Azure Customer Managed Encryption Keys|Yes| Yes
Azure Private Links|Yes| Yes
Financial Backed Service Level Agreement (SLA) Credits | No | Yes
Disaster Recovery |No| Yes\*
Availability Zones |No| Yes
Database Throughput |Low| High
Included Data Partition | 1| 1
Maximum Data Partition |5 | 10

(\*) Certain regions are restricted in supporting customer scenarios for disaster recovery. Please check the [Reliability in Azure Data Manager for Energy](reliability-energy-data-services.md) for more details on the regions which support disaster recovery.

> [!IMPORTANT]
> Disaster recovery is currently not available in Brazil South region. For more information please contact your Microsoft sales or customer representative.

## How to participate
You can easily create a Developer tier resource by going to Azure Marketplace, [create portal](https://portal.azure.com/#create/Microsoft.AzureDataManagerforEnergy), and select your desired tier. 
