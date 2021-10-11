---
title: Monitor Azure Database for MySQL Flexible Server by using Azure Monitor workbooks
description: This article describes how you can monitor Azure Database for MySQL Flexible Server by using Azure Monitor workbooks.
author: SudheeshGH
ms.author: sunaray
ms.service: mysql
ms.topic: conceptual
ms.date: 10/01/2021
---
# Monitor Azure Database for MySQL Flexible Server by using Azure Monitor workbooks

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Azure Database for MySQL Flexible Server is now integrated with Azure Monitor workbooks. With workbooks, you get a flexible canvas for analyzing data and creating rich visual reports within the Azure portal. Workbooks allow you to tap into multiple data sources across Azure and combine them into unified interactive experiences. Workbook templates serve as curated reports that are designed for flexible reuse by multiple users and teams. 

When you open a template, you create a transient workbook that's populated with the contents of the template. With this integration, the server links to workbooks and a few sample templates, which can help you monitor the service at scale. You can edit these templates, customize them to your requirements, and pin them to the dashboard to create a focused and organized view of Azure resources.
 
In this article, you will learn about the various workbook templates that are available for your flexible server.

Azure Database for MySQL Flexible Server has three available templates:
 
- **Overview**: Displays an instance summary and top-level metrics to help you visualize and understand the resource utilization on your server. This template displays the following views:

    * Server summary 
    * Database summary
    * Connection metrics 
    * Performance metrics 
    * Storage metrics 

* **Auditing**: Displays a summary and details of the auditing events that are collected for the server. This template displays the following views:

    * Administrative sections on the service
    * Audit summary
    * Audit connection events summary
    * Audit connection events
    * Table access summary
    * Errors identified

* **Query Performance Insight**: Displays a summary and details of query workload on the instance, long running query, slow query analysis, and connection metrics. This template displays the following views:

    * Query load
    * Total active connections
    * Slow query trend (>10 seconds of query time)
    * Slow query details
    * A list of the top five longest queries
    * A summary of slow queries by minimum, maximum, average, and standard deviation query time

You can also edit and customize these templates according to your requirements. For more information, see [Azure Monitor workbooks overview](../../azure-monitor/visualize/workbooks-overview.md#editing-mode).

 ## How to access workbook templates

To view the templates in the Azure portal, go to the **Monitoring** pane for Azure Database for MySQL Flexible Server, and then select **Workbooks**.

:::image type="content" source="./media/concept-workbook/monitor-workbooks-all.png" alt-text="Screenshot showing the 'Overview', 'Auditing', and 'Query Performance Insight' templates on the Workbooks pane.":::

You can also display the list of templates by going to the **Public Templates** pane.

:::image type="content" source="./media/concept-workbook/monitor-workbooks-public.png" alt-text="Diagram that shows the 'Overview', 'Auditing', and 'Query Performance Insight' templates on the 'Public Templates' pane.":::


## Next steps
- Learn about [access control](../../azure-monitor/visualize/workbooks-access-control.md) in Azure Monitor workbooks.
- Learn more about [visualization options](../../azure-monitor/visualize/workbooks-overview.md#visualizations) in Azure Monitor workbooks.
