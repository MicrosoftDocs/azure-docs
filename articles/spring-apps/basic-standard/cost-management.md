---
title: Manage Costs for Azure Spring Apps
description: Learn about how to manage costs in Azure Spring Apps.
author: KarlErickson
ms.service: azure-spring-apps
ms.topic: overview
ms.date: 08/28/2024
ms.author: hangwan
ms.custom: devx-track-java
---

# Manage costs for Azure Spring Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Standard consumption and dedicated (Preview) ✅ Basic/Standard ✅ Enterprise

This article describes the cost-saving options and capabilities that Azure Spring Apps provides.

## Save more on the Enterprise plan

For the Enterprise plan, we now offer further discounts for longer commitments on both the Microsoft and VMware (by Broadcom) parts of the pricing. For more information, see [Azure Spring Apps pricing](https://azure.microsoft.com/pricing/details/spring-apps/).

For the Microsoft part of the pricing, the Enterprise plan currently has yearly discounted pricing options available. For more information, see [Maximizing Value: Streamlined Cloud Solutions with Prime Cost Savings for Spring Apps](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/maximizing-value-streamlined-cloud-solutions-with-prime-cost/ba-p/3904599).

For the VMware (by Broadcom) part of the pricing, the negotiable discount varies based on the number of years you sign up for. For more information, reach out to your sales representative.

## Monthly free grants

The first 50 vCPU hours and 100-GB hours of memory are free each month per subscription. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

## Start and stop instances

If you have Azure Spring Apps instances that don't need to run continuously, you can save costs by reducing the number of running instances. For more information, see [Start or stop your Azure Spring Apps service instance](how-to-start-stop-service.md).

## Scale and autoscale

You can manually scale computing capacities to accommodate a changing environment. For more information, see [Scale an application in Azure Spring Apps](how-to-scale-manual.md).

Autoscale reduces operating costs by terminating redundant resources when they're no longer needed. For more information, see [Set up autoscale for applications](how-to-setup-autoscale.md).

You can also set up autoscale rules for your applications in the Azure Spring Apps Standard consumption and dedicated plan. For more information, see [Quickstart: Set up autoscale for applications in the Azure Spring Apps Standard consumption and dedicated plan](../consumption-dedicated/quickstart-apps-autoscale-standard-consumption.md).

## Stop maintaining unused environments

If you set up several environments while developing a product, it's important to remove the environments that are no longer in use once the product is live.

## Remove unnecessary deployments

If you use strategies like blue-green deployment to reduce downtime, it can result in many idle deployments on staging slots, especially multiple app instances that aren't needed once newer versions are deployed to production.

## Avoid over allocating resources

Java users often reserve more processing power and memory than they really need. While it's fine to use large app instances during the initial months in production, you should adjust resource allocation based on usage data.

## Avoid unnecessary scaling

If you use more app instances than you need, you should adjust the number of instances based on real usage data.

## Streamline monitoring data collection

If you collect more logs, metrics, and traces than you can use or afford, you must determine what's necessary for troubleshooting, capacity planning, and monitoring production. For example, you can reduce the frequency of application performance monitoring or be more selective about which logs, metrics, and traces you send to data aggregation tools.

## Deactivate debug mode

If you forget to switch off debug mode for apps, a large amount of data is collected and sent to monitoring platforms. Forgetting to deactivate debug mode could be unnecessary and costly.
