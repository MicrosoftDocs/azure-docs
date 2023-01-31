---
title: Pricing
description: Describes the pricing plan of Azure Spring Apps.
author: hangwan97
ms.service: spring-apps
ms.topic: overview
ms.date: 01/28/2023
ms.author: hangwan
ms.custom: devx-track-java, contperf-fy21q2, event-tier1-build-2022
---

# Overview: Azure Spring Apps pricing
> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This overview explains the pricing model of azure spring apps. At the end of this overview, you will have a clear understanding of the pricing and how to save your cost.

## Pricing
Azure Spring Apps offers four pricing plans: Basic, Standard, Standard Consumption and Enterprise. Basic targets dev/test and trials. Standard and Standard Consumption is optimized for running general-purpose production traffic. Enterprise provides on-demand VMware Tanzu components and commercial Spring Runtime support. To estimate the cost on Azure Spring Apps, you can try the [Pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator/?service=spring-apps).
</br>
To know more about the pricing model, [See pricing details](https://azure.microsoft.com/en-us/products/spring-apps/#pricing).

## Cost saving
Azure Spring Apps provides varies ways to save your cost.

### Monthly Free grants
The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058)

### Start and stop instance
Your applications running in Azure Spring Apps may not need to run continuously, you can save the cost by reducing the running instances, see [Start or stop your Azure Spring Apps service instance](/azure/spring-apps/how-to-start-stop-service).

### Standard Consumption Plan
Unlike other plans, Standard Consumption offers a pure consumption-based pricing model. Resources can be dynamically added and removed based on the resource utilization, number of incoming Http requests or events. When running apps in a consumption plan, you're charged for active and idle usage of resources, as well as number of requests. 

### Autoscale
Autoscale refers to setting up rules to increase or decrease computing capacities according to the changing environment. It reduces operating costs by terminating redundant resources once no longer needed. See [Set up autoscale for applications](/azure/spring-apps/how-to-setup-autoscale).
