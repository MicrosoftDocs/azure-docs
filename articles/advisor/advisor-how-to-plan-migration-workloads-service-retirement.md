---
title: Prepare migration of the workloads impacted by service retirements.
description: Use Azure Advisor to plan the migration of the workloads impacted by service retirements.
ms.topic: article
ms.date: 05/19/2023

---

# Prepare migration of the workloads impacted by service retirement

Azure Advisor helps you ensure and improve the continuity of your business-critical applications. It is important to be aware of upcoming Azure products and feature retirements to assess the impact on their workloads and plan for migration to replacement products and features. 

## Service Retirement workbook

The Service Retirement workbook provides a single centralized resource level view of product retirements. It helps you assess impact, evaluate options, and plan for migration from retiring products and features. The workbook template is available in Azure Advisor gallery.
Here is how to get started:

1.	Sign-in to the Azure portal and navigate to [**Azure Advisor**](https://portal.azure.com).
1.	Select **Workbooks** from the left menu.
1.	Open **Service Retirement (Preview)** workbook template.
1.	Select a service from the list to display a detailed view of impacted resources.

The wokbooks shows a list and a map of service retirements that impact your resources. For each of the services, there is a planned retirement date, number of impacted resources and migration instructions including recommended alternative service.

*	Use subscription, resource group and location filters to focus on a specific workload.
*	Use sorting to find services, which are retiring soon and have the biggest impact on your workloads. 
*	Share the report with your team to help them plan migration using export function.

:::image type="content" source="media/advisor-service-retirement-workbook-overview.png#lightbox" alt-text="Screenshot of the Azure Advisor service retirement workbook template.":::

:::image type="content" source="media/advisor-service-retirement-workbook-details.png#lightbox" alt-text="Screenshot of the Azure Advisor service retirement workbook template, detailed view.":::

 
For more information about Advisor recommendations, see:
* [Reliability recommendations](advisor-reference-reliability-recommendations.md)
* [Introduction to Advisor](advisor-overview.md)
* [Get started with Advisor](advisor-get-started.md)
