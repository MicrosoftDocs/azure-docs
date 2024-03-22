---
title: Resource utilization and efficiency
description: This article helps you understand the resource utilization and efficiency capability within the FinOps Framework and how to implement that in the Microsoft Cloud.
author: bandersmsft
ms.author: banders
ms.date: 03/21/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: finops
ms.reviewer: micflan
---

# Resource utilization and efficiency

This article helps you understand the resource utilization and efficiency capability within the FinOps Framework and how to implement that in the Microsoft Cloud.

## Definition

**Resource utilization and efficiency refers to the process of ensuring cloud services are utilized and tuned to maximize business value and minimize wasteful spending.**

Review how services are being used and ensure each is maximizing return on investment. Evaluate and implement best practices and recommendations.

Every cost should have direct or indirect traceability back to business value. Eliminate fully "optimized" resources that aren't contributing to business value.

Resource utilization and efficiency maximize the business value of cloud costs by avoiding unnecessary costs that don't contribute to the mission, which in turn increases return on investment and profitability.

## Getting started

When you first start managing cost in the cloud, you use the native tools to drive efficiency and optimize costs in the portal.

- Review and implement [Azure Advisor cost recommendations](../../advisor/advisor-reference-cost-recommendations.md).
  - Azure Advisor gives you high-confidence recommendations based on your usage. Azure Advisor is always the best place to start when looking to optimize any workload.
  - Consider [subscribing to Azure Advisor alerts](../../advisor/advisor-alerts-portal.md) to get notified when there are new cost recommendations.
- Review your usage and purchase [commitment-based discounts](capabilities-commitment-discounts.md) when it makes sense.
- Take advantage of Azure Hybrid Benefit for [Windows](/windows-server/get-started/azure-hybrid-benefit), [Linux](../../virtual-machines/linux/azure-hybrid-benefit-linux.md), and [SQL Server](/azure/azure-sql/azure-hybrid-benefit).
- Review and implement [Cloud Adoption Framework costing best practices](/azure/cloud-adoption-framework/govern/cost-management/best-practices).
- Review and implement [Azure Well-Architected Framework cost optimization guidance](/azure/well-architected/cost/overview).
- Familiarize yourself with the services you use, how you're charged, and what service-specific cost optimization options you have.
  - You can discover the services you use from the Azure portal All resources page or from the [Services view in Cost analysis](../costs/cost-analysis-built-in-views.md#break-down-product-and-service-costs).
  - Explore the [Azure pricing pages](https://azure.microsoft.com/pricing) and [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator) to learn how each service charges you. Use them to identify options that might reduce costs. For example, shared infrastructure and commitment discounts.
  - Review service documentation to learn about any cost-related features that could help you optimize your environment or improve cost visibility. Some examples:
    - Choose [spot VMs](/azure/well-architected/cost/optimize-vm#spot-vms) for low priority, interruptible workloads.
    - Avoid [cross-region data transfer](/azure/well-architected/cost/design-regions#traffic-across-billing-zones-and-regions).
- Use and customize the [Cost optimization workbook](cost-optimization-workbook.md). The Cost Optimization workbook is a central point for some of the most often used tools that can help achieve utilization and efficiency goals.

## Building on the basics

At this point, you've implemented all the basic cost optimization recommendations and tuned applications to meet the most fundamental best practices. As you move beyond the basics, consider the following points:

- Automate cost recommendations using [Azure Resource Graph](../../advisor/resource-graph-samples.md).
- Implement the [Workload management and automation capability](capabilities-workloads.md) for more optimizations.
- Stay abreast of emerging technologies, tools, and industry best practices to further optimize resource utilization.

## Learn more at the FinOps Foundation

This capability is a part of the FinOps Framework by the FinOps Foundation, a non-profit organization dedicated to advancing cloud cost management and optimization. For more information about FinOps, including useful playbooks, training and certification programs, and more, see the [Resource utilization and efficiency capability](https://www.finops.org/framework/capabilities/utilization-efficiency/) article in the FinOps Framework documentation.

## Next steps

- [Managing commitment-based discounts](capabilities-commitment-discounts.md)
- [Workload management and automation](capabilities-workloads.md)
- [Measuring unit cost](capabilities-unit-costs.md)
