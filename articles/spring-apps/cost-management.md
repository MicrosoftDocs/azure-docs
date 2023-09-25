---
title: Manage costs for Azure Spring Apps
description: Learn about how to manage costs in Azure Spring Apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: overview
ms.date: 03/28/2023
ms.author: hangwan
ms.custom: devx-track-java, contperf-fy21q2, event-tier1-build-2022
---

# Manage costs for Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ✔️ Enterprise

This article describes the cost-saving options and capabilities that Azure Spring Apps provides.

## Monthly free grants

The first 50 vCPU hours and 100-GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

## Start and stop instances

If you have Azure Spring Apps instances that don't need to run continuously, you can save costs by reducing the number of running instances. For more information, see [Start or stop your Azure Spring Apps service instance](how-to-start-stop-service.md).

## Standard consumption and dedicated plan

Unlike other pricing plans, the Standard consumption and dedicated plan offers a pure consumption-based pricing model. You can dynamically add and remove resources based on the resource utilization, number of incoming HTTP requests, or by events. When running apps in a consumption workload profile, you're charged for active and idle usage of resources, and the number of requests. For more information, see the [Standard consumption and dedicated plan](overview.md#standard-consumption-and-dedicated-plan) section of [What is Azure Spring Apps?](overview.md)

## Scale and autoscale

You can manually scale computing capacities to accommodate a changing environment. For more information, see [Scale an application in Azure Spring Apps](how-to-scale-manual.md).

Autoscale reduces operating costs by terminating redundant resources when they're no longer needed. For more information, see [Set up autoscale for applications](how-to-setup-autoscale.md).

You can also set up autoscale rules for your applications in the Azure Spring Apps Standard consumption and dedicated plan. For more information, see [Quickstart: Set up autoscale for applications in the Azure Spring Apps Standard consumption and dedicated plan](quickstart-apps-autoscale-standard-consumption.md).

## Next steps

[Quickstart: Provision an Azure Spring Apps Standard consumption and dedicated plan service instance](quickstart-provision-standard-consumption-service-instance.md)
