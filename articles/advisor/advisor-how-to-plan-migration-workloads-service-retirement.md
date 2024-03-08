---
title: Prepare migration of your workloads impacted by service retirements.
description: Use Azure Advisor to plan the migration of the workloads impacted by service retirements.
ms.topic: article
ms.date: 05/19/2023

---

# Prepare migration of your workloads impacted by service retirement

Azure Advisor helps you assess and improve the continuity of your business-critical applications. It's important to be aware of upcoming Azure services and feature retirements to understand their impact on your workloads and plan migration.

## Service Retirement workbook

The Service Retirement workbook provides a single centralized resource level view of service retirements. It helps you assess impact, evaluate options, and plan for migration from retiring services and features. The workbook template is available in Azure Advisor gallery.
Here's how to get started:

1.	Navigate to [Workbooks gallery](https://aka.ms/advisorworkbooks) in Azure Advisor 
1.	Open **Service Retirement (Preview)** workbook template.
1.	Select a service from the list to display a detailed view of impacted resources.

The workbook shows a list and a map view of service retirements that impact your resources. For each of the services, there's a planned retirement date, number of impacted resources and migration instructions including recommended alternative service.

*	Use subscription, resource group and location filters to focus on a specific workload.
*	Use sorting to find services, which are retiring soon and have the biggest impact on your workloads. 
*	Share the report with your team to help them plan migration using export function.

:::image type="content" source="media/advisor-service-retirement-workbook-overview.png" alt-text="Screenshot of the Azure Advisor service retirement workbook template." lightbox="media/advisor-service-retirement-workbook-overview.png":::

:::image type="content" source="media/advisor-service-retirement-workbook-details.png" alt-text="Screenshot of the Azure Advisor service retirement workbook template, detailed view." lightbox="media/advisor-service-retirement-workbook-details.png":::

> [!NOTE]
> The workbook contains information about a subset of services and features that are in the retirement lifecycle. While we continue to add more services to this workbook, you can view the lifecycle status of all Azure services by visiting [Azure updates](https://azure.microsoft.com/updates/?updateType=retirements).
 
For more information, see:
* [Azure Service Health](../service-health/overview.md)
* [Azure updates](https://azure.microsoft.com/updates/?updateType=retirements)
* [Introduction to Advisor](advisor-overview.md)
