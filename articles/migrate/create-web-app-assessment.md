---
title: Tutorial to assess web apps for migration
description: Learn how to create assessment for web apps in Azure Migrate
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: tutorial
ms.date: 11/12/2024
ms.service: azure-migrate
ms.custom: engagement-fy24
---
# Create a web app assessment for modernization 

This article shows you how to create a web app assessment for modernization to [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) or Azure App Service using Azure Migrate. Creating an assessment for your web apps provides the recommended targets for them and key insights such as app-readiness, target right-sizing and cost to host and run these apps month over month. 

In this article, you’ll learn how to: 

- Set up your Azure Migrate environment to assess web apps. 
- Choose a set of related web applications discovered using the Azure Migrate appliance. 
- Provide assessment configurations such as preferred Azure targets, target region, Azure reserved Instances. 
- Create web app assessment with a recommended modernization path. 

## Prerequisites 

- Deploy and configure the Azure Migrate appliance in your [VMware](./vmware/tutorial-discover-vmware.md), [Hyper-V](tutorial-discover-hyper-v.md), or [physical](tutorial-discover-physical.md) environments. 
- Check the [appliance requirements](migrate-appliance.md#appliance---vmware) and [URL access](migrate-appliance.md#url-access) to be provided. 

Follow these steps to discover web apps running on your environment. 

Create a workload assessment for web apps 

On the Azure Migrate project overview page, under Decide and Plan, select Assessments. 
 

On this page, select Create assessment. 
 

Provide a suitable name for the assessment and select Add workloads. 
 

Use appropriate filters, select web apps and select Add. 
 

After reviewing selected workloads, select Next. 
 

On the General settings tab, modify assessment settings that are applicable across all Azure targets. 
 
 

Setting 

Possible Values 

Comments 

Default target location 

All locations supported by Azure targets 

Used to generate regional cost for Azure targets. 

Default Environment 

Production 
Dev/Test 

Allows you to toggle between pay-as-you-go and pay-as-you-go Dev/Test offers. 

Currency 

All common currencies such as USD, INR, GBP, Euro 

We generate the cost in the currency selected here. 

Program/offer 

Pay-as-you-go 
Enterprise Agreement 

Allows you to toggle between pay-as-you-go and Enterprise Agreement offers. 

Default savings option 

1 year reserved 
3 years reserved 
1 year savings plan 
3 years savings plan 
None 

Select a savings option if you've opted for Reserved Instances or Savings Plan. 

Discount Percentage 

Numeric decimal value 

Use this to factor in any custom discount agreements with Microsoft. This is disabled if Savings options are selected. 

EA subscription 

Subscription ID 

Select the subscription ID for which you have an Enterprise Agreement. 

Default savings options 

1 year reserved 
3 years reserved 
1 year savings plan 
3 years savings plan 
None 

Select a savings option if you've opted for Reserved Instances or Savings Plan. 

Microsoft Defender for Cloud 

- 

Includes Microsoft Defender for App Service cost in the month over month cost estimate. 

On the Advanced settings tab, select Edit defaults to choose the preferred Azure targets and target specific settings. 
AKS Settings 

Setting 

Possible Values 

Comments 

Category 

All 
Compute optimized 
General purpose 
GPU 
High performance compute 
Isolated 
Memory optimized 
Storage optimized 

Selecting a particular SKU category ensures we recommend the best AKS Node SKUs from that category. 

AKS pricing tier 

Standard 

Pricing tier for AKS 

Consolidation 

Full Consolidation 

Maximize the number of web apps to be packed per node. 

App Service Settings 

Setting 

Possible Values 

Comments 

Isolation required 

No 
Yes 

The Isolated plan allows customers to run their apps in a private, dedicated environment in an Azure datacenter using Dv2-series VMs with faster processors, SSD storage, and double the memory-to-core ratio compared to Standard. 

Finally, review and create the assessment. 
 

Next steps 

Understand the assessment insights to make data-driven decisions for web app modernization. 

Optimize Windows Dockerfiles. 

Review and implement best practices to build and manage apps on AKS. 

 