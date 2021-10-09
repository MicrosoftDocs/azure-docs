---
title: Monitoring Azure Database for MySQL - Flexible Server with Azure Monitor Workbooks
description: Describes how we can monitor Azure Database for MySQL - Flexible Server with Azure Monitor Workbooks.
author: SudheeshGH
ms.author: sunaray
ms.service: mysql
ms.topic: conceptual
ms.date: 10/01/2021
---
# Monitoring Azure Database for MySQL - Flexible Server with Azure Monitor Workbooks

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Azure Database for MySQL - Flexible Server is now integrated with Azure Monitor Workbooks. Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. They allow you to tap into multiple data sources from across Azure and combine them into unified interactive experiences. Workbooks templates serve as curated reports that are designed for flexible reuse by multiple users and teams. Opening a template creates a transient workbook populated with the content of the template. With this integration, the server has link to workbooks and few sample template, which help to monitor the service at scale.These templates can be edited, customized to customer requirements and pinned to dashboard to create a focused and organized view of Azure resources.
 
In this article, you will learn about the various workbooks template available for your flexible server

We have three default templates available for Azure Database for MySQL - Flexible Server
 
- **Overview:** Gives the Instance Summary and  top-level metrics to help understand the resource utilization on your server. You will be able to see the below details for the Azure Database for MySQL – Flexible Server

    * Server Summary 
    * Database Summary
    * Connection Metrics 
    * Performance Metrics 
    * Storage Metrics 

* **Auditing:** Summary and details of the Auditing events collected for the server. The following views are available with this template for the Azure Database for MySQL – Flexible Server

    * Administrative Actions on the service
    * Audit Summary
    * Audit Connection Events Summary
    * Audit Connection Events
    * Table Access Summary
    * Errors Identified

* **Query Performance Insights:** Summary and details of query workload on the instance, long running query, slow query analysis and connection metrics. The following view is available with this template for the Azure Database for MySQL – Flexible Server.

    * Query Load
    * Total Active Connections
    * Slow Query Trend (>10 seconds Query Time)
    * Slow Query Details
    * List top five longest queries
    * Summarize slow queries by minimum, maximum, average, and standard deviation query time

You can also edit these templates and customize as per your requirement. For more information, see, [Azure Monitor Workbooks Overview - Azure Monitor](../../azure-monitor/visualize/workbooks-overview.md#editing-mode)

 ## How to access Workbook templates

For viewing the templates, on the Azure portal, Navigate to **Monitoring** blade for Azure Database for MySQL – Flexible Server and select **Workbooks**.

:::image type="content" source="./media/concept-workbook/monitor-workbooks-all.png" alt-text="Diagram that shows the workbooks.":::

You can also see the list of templates navigating to **Public Templates**.

:::image type="content" source="./media/concept-workbook/monitor-workbooks-public.png" alt-text="Diagram that shows templates of workbooks":::


## Next steps
- [Azure Monitor Workbooks](../../azure-monitor/visualize/workbooks-access-control.md) and learning more about workbooks many rich visualizations options.
- [Get started Azure Monitor Workbooks](../../azure-monitor/visualize/workbooks-overview.md#visualizations) and learning more about workbooks many rich visualizations options.
