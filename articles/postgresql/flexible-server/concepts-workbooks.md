---
title: Monitor Azure Database for PostgreSQL Flexible Server by using Azure Monitor workbooks
description: This article describes how you can monitor Azure Database for PostgreSQL Flexible Server by using Azure Monitor workbooks.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
author: pradeepkintali
ms.author: prkint
ms.date: 02/15/2023
---
# Monitor Azure Database for PostgreSQL Flexible Server by using Azure Monitor workbooks

[!INCLUDE[applies-to-postgresql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Azure Database for PostgreSQL Flexible Server is now integrated with Azure Monitor workbooks. With workbooks, you get a flexible canvas for analyzing data and creating rich visual reports within the Azure portal. Workbooks allow you to tap into multiple data sources across Azure and combine them into unified interactive experiences. Workbook templates serve as curated reports that are designed for flexible reuse by multiple users and teams. 

When you open a template, you create a transient workbook that's populated with the contents of the template. With this integration, the server links to workbooks and a few sample templates, which can help you monitor the service at scale. You can edit these templates, customize them to your requirements, and pin them to the dashboard to create a focused and organized view of Azure resources.
 
In this article, you'll learn about the various workbook templates that are available for your flexible server.

Azure Database for PostgreSQL Flexible Server has three available templates:
 
- **Overview**: Displays an instance summary and top-level metrics to help you visualize and understand the resource utilization on your server. This template displays the following views:

    * Server Summary 
    * Database Summary
    * Connection Metrics 
    * Performance Metrics 
    * Storage Metrics 

* **Enhanced Metrics**: Displays a summary of Enhanced Metrics for Azure Database for PostgreSQL Flexible Server with more fine grained monitoring on databases. To enable these metrics, please turn ON the server 'parameter metrics.collector_database_activity' and 'metrics.autovacuum_diagnostics'. These parameters are dynamic, and will not require server restart. For more information see [Enhanced Metrics](./concepts-monitoring.md#enhanced-metrics)
This template displays the following views:

    * Activity Metrics
    * Database Metrics
    * Autovacuum Metrics
    * Replication Metrics


You can also edit and customize these templates according to your requirements. For more information, see [Azure Workbooks](../../azure-monitor/visualize/workbooks-overview.md).

 ## Access the workbook templates

To view the templates in the Azure portal, go to the **Monitoring** pane for Azure Database for PostgreSQL Flexible Server, and then select **Workbooks**.

:::image type="content" source="./media/concept-workbooks/monitor-workbooks-all.png" alt-text="Screenshot showing the 'Overview', 'Enhanced Metrics' templates on the Workbooks pane.":::


## Next steps
- Learn about [Azure workbooks access control](../../azure-monitor/visualize/workbooks-overview.md#access-control).
- Learn more about [Azure workbooks visualization options](../../azure-monitor/visualize/workbooks-visualizations.md). 
