---
title: Microsoft Azure Data Manager for Energy tier concepts - Developer and Standard SKU
description: This article describes tier concepts
author: marielherz
ms.author: marielherzog
ms.service: azure-data-manager-energy
ms.topic: conceptual
ms.date: 10/03/2025
ms.custom: template-concept
---

# Azure Data Manager for Energy tiers
Azure Data Manager for Energy is available in two tiers; Standard and Developer. 


## Developer tier 
The Azure Data Manager for Energy Developer Tier is designed to provide flexibility and speed for users building and testing [OSDU&reg;](https://osduforum.org) Data Platform backed solutions.  It offers the same high standard of security and integration capabilities as the Standard tier, but at a lower cost and with reduced resource capacity.

This tier is best suited for functional testing, evaluation, and early-stage development. It is not recommended for performance benchmarking or production-scale workloads, as its resource limits may lead to suboptimal results in such scenarios. Organizations can use the Developer tier to cost-effectively isolate and manage their test environments, ensuring a clear separation from production operations. Typical use cases include:

* Evaluating and creating data migration strategy
* Building proof of concepts and business case demonstrations of user scenarios
* Defining deployment pipelines
* Validating application compatibility
* Validating security features such as Customer Managed Encryption Keys (CMEK)
* Implementing sensitive data classification
* Testing new [OSDU&reg;](https://osduforum.org) Data Platform releases
* Validating a limited dataset by ingesting in a safe pre production environment
* Testing new third party or in-house applications 
* Validating service updates
* Testing API functionality

Customers can isolate their test and production environments in a safe and effective way.


## Standard tier 
The Standard tier of Azure Data Manager for energy is ideal for customers' production ready scenarios. These include the following:

* Large scale data ingestion
* Production grade performance (including testing)
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
Recommended Use Cases | Non-Production scenario such as [OSDU&reg;](https://osduforum.org) Data Platform testing, data validation, feature testing, troubleshooting, training, and proof of concepts. | Production data availability and business workflows
[OSDU&reg;](https://osduforum.org) Data Platform Compatibility| Yes | Yes
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
