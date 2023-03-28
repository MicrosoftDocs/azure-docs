---
title: Manage costs for Azure Spring Apps
description: Learn about how to manage costs in Azure Spring Apps.
author: karlerickson
ms.service: spring-apps
ms.topic: overview
ms.date: 03/28/2023
ms.author: hangwan
ms.custom: devx-track-java, contperf-fy21q2, event-tier1-build-2022
---

# Manage costs for Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption (Preview) ✔️ Basic/Standard  ✔️ Enterprise

This article describes the cost-saving options and capabilities in Azure Spring Apps, including monthly free grants, starting and stopping Spring App instances, the Standard consumption plan, and setting up autoscaling rules.

## Monthly free grants

The first 50 vCPU hours and 100-GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

## Start and stop instances

If you have Azure Spring Apps instances that don't need to run continuously, you can save costs by reducing the number of running instances. For more information, see [Start or stop your Azure Spring Apps service instance](how-to-start-stop-service.md).

## Standard consumption plan

Unlike other pricing plans, the Standard consumption plan offers a pure consumption-based pricing model. You can dynamically add and remove resources based on the resource utilization, number of incoming HTTP requests, or by events. When running apps in a consumption plan, you're charged for active and idle usage of resources, and the number of requests. For more information, see the [Standard consumption plan](overview.md#standard-consumption-plan) section of [What is Azure Spring Apps?](overview.md)

## Autoscale

Autoscale refers to setting up rules to increase or decrease computing capacities according to the changing environment. Autoscale reduces operating costs by terminating redundant resources when they're no longer needed. For more information, see [Set up autoscale for applications](how-to-setup-autoscale.md).

## Next steps

[Quickstart: Provision an Azure Spring Apps Standard consumption plan service instance](quickstart-provision-standard-consumption-service-instance.md)
