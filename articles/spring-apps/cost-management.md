---
title: Manage costs for Azure Spring Apps
description: Describes overall cost saving plan of Azure Spring Apps.
author: hangwan97
ms.service: spring-apps
ms.topic: overview
ms.date: 01/28/2023
ms.author: hangwan
ms.custom: devx-track-java, contperf-fy21q2, event-tier1-build-2022
---

# Manage costs for Azure Spring Apps
> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article introduced 4 different ways to save your cost on azure spring apps. At the end of this overview, you will have a clear understanding on how to save your cost.

Azure Spring Apps offers various cost-saving options, including monthly free grants, the ability to start and stop instances, a consumption-based pricing model with the Standard Consumption Plan, and the ability to set up autoscaling rules.

### Monthly Free grants
The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058)

### Start and stop instance
Your applications running in Azure Spring Apps may not need to run continuously, you can save the cost by reducing the running instances, see [Start or stop your Azure Spring Apps service instance](/azure/spring-apps/how-to-start-stop-service).

### Standard Consumption Plan
Unlike other plans, Standard Consumption offers a pure consumption-based pricing model. Resources can be dynamically added and removed based on the resource utilization, number of incoming Http requests or events. When running apps in a consumption plan, you're charged for active and idle usage of resources, as well as number of requests. 

### Autoscale
Autoscale refers to setting up rules to increase or decrease computing capacities according to the changing environment. It reduces operating costs by terminating redundant resources once no longer needed. See [Set up autoscale for applications](/azure/spring-apps/how-to-setup-autoscale).
