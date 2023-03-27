---
title: Manage costs for Azure Spring Apps
description: Learn about how to manage costs in Azure Spring Apps.
author: karlerickson
ms.service: spring-apps
ms.topic: overview
ms.date: 03/27/2023
ms.author: hangwan
ms.custom: devx-track-java, contperf-fy21q2, event-tier1-build-2022
---

# Manage costs for Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article describes four different ways to save your cost on Azure Spring Apps. At the end of this overview, you should have a clear understanding on how to save on your cost. Azure Spring Apps offers the following cost-saving options:

- Save on memory with Monthly Free grants
- Ability to start and stop instances
- Consumption-based pricing model with the Standard Consumption Plan
- Ability to set up autoscaling rules

## Monthly Free grants

The first 50 vCPU hours and 100-GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058).

## Start and stop instance

If your Azure Spring Apps don't need to run continuously, you can save costs by reducing the number of running instances. For more information, see [Start or stop your Azure Spring Apps service instance](/azure/spring-apps/how-to-start-stop-service).

## Standard Consumption Plan

Unlike other plans, the Standard Consumption plan offers a pure consumption-based pricing model. Resources can be dynamically added and removed based on the resource utilization, number of incoming HTTP requests, or by events. When running apps in a consumption plan, you're charged for active and idle usage of resources, and number of requests. For more information, see the [Standard consumption plan](/azure/spring-apps/overview#standard-consumption-plan) section of [What is Azure Spring Apps](/azure/spring-apps/overview).

## Autoscale

Autoscale refers to setting up rules to increase or decrease computing capacities according to the changing environment. It reduces operating costs by terminating redundant resources once no longer needed. For more information, see [Set up autoscale for applications](/azure/spring-apps/how-to-setup-autoscale).

## Next steps
