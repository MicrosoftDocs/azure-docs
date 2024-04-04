---
title: Managing anomalies
description: This article helps you understand the managing anomalies capability within the FinOps Framework and how to implement that in the Microsoft Cloud.
author: bandersmsft
ms.author: banders
ms.date: 03/21/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: finops
ms.reviewer: micflan
---

# Managing anomalies

This article helps you understand the managing anomalies capability within the FinOps Framework and how to implement that in the Microsoft Cloud.

## Definition

**Managing anomalies refers to the practice of detecting and addressing abnormal or unexpected cost and usage patterns in a timely manner.**

Use automated tools to detect anomalies and notify stakeholders. Review usage trends periodically to reveal anomalies automated tools may have missed.

Investigate changes in application behaviors, resource utilization, and resource configuration to uncover the root cause of the anomaly.

With a systematic approach to anomaly detection, analysis, and resolution, organizations can minimize unexpected costs that impact budgets and business operations. And, they can even identify and prevent security and reliability incidents that can surface in cost data.

## Getting started

When you first start managing cost in the cloud, you use the native tools available in the portal.

- Start with proactive alerts.
  - [Subscribe to anomaly alerts](../understand/analyze-unexpected-charges.md#create-an-anomaly-alert) for each subscription in your environment to receive email alerts when an unusual spike or drop has been detected in your normalized usage based on historical usage.
  - Consider [subscribing to scheduled alerts](../costs/save-share-views.md#subscribe-to-scheduled-alerts) to share a chart of the recent cost trends with stakeholders. It can help you drive awareness as costs change over time and potentially catch changes the anomaly model may have missed.
  - Consider [creating a budget in Cost Management](../costs/tutorial-acm-create-budgets.md) to track that specific scope or workload. Specify filters and set alerts for both actual and forecast costs for finer-grained targeting.
- Review costs periodically, using detailed cost breakdowns, usage analytics, and visualizations to identify potential anomalies that may have been missed.
  - Use smart views in Cost analysis to [review anomaly insights](../understand/analyze-unexpected-charges.md#identify-cost-anomalies) that were automatically detected for each subscription.
  - Use customizable views in Cost analysis to [manually find unexpected changes](../understand/analyze-unexpected-charges.md#manually-find-unexpected-cost-changes).
  - Consider [saving custom views](../costs/save-share-views.md) that show cost over time for specific workloads to save time.
  - Consider creating more detailed usage reports using [Power BI](/power-bi/connect-data/desktop-connect-azure-cost-management).
- Once an anomaly is identified, take appropriate actions to address it.
  - Review the anomaly details with the engineers who manage the related cloud resources. Some autodetected "anomalies" are planned or at least known resource configuration changes as part of building and managing cloud services.
  - If you need lower-level usage details, review resource utilization in [Azure Monitor metrics](../../azure-monitor/essentials/metrics-getting-started.md).
  - If you need resource details, review [resource configuration changes in Azure Resource Graph](../../governance/resource-graph/how-to/get-resource-changes.md).

## Building on the basics

At this point, you have automated alerts configured and ideally views and reports saved to streamline periodic checks.

- Establish and automate KPIs, such as:
  - Number of anomalies each month or quarter.
  - Total cost impact of anomalies each month or quarter
  - Response time to detect and resolve anomalies.
  - Number of false positives and false negatives.
- Expand coverage of your anomaly detection and response process to include all costs.
- Define, document, and automate workflows to guide the response process when anomalies are detected.
- Foster a culture of continuous learning, innovation, and collaboration.
  - Regularly review and refine anomaly management processes based on feedback, industry best practices, and emerging technologies.
  - Promote knowledge sharing and cross-functional collaboration to drive continuous improvement in anomaly detection and response capabilities.

## Learn more at the FinOps Foundation

This capability is a part of the FinOps Framework by the FinOps Foundation, a non-profit organization dedicated to advancing cloud cost management and optimization. For more information about FinOps, including useful playbooks, training and certification programs, and more, see the [Managing anomalies capability](https://www.finops.org/framework/capabilities/manage-anomalies/) article in the FinOps Framework documentation.

## Next steps

- [Budget management](capabilities-budgets.md)