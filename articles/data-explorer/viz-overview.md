---
title: 'Azure Data Explorer data visualization'
description: 'Learn about the different ways you can visualize your Azure Data Explorer data'
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 06/30/2019
---

# Data visualization with Azure Data Explorer 

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data that is used to build complex analytics solutions for vast amounts of data. Azure Data Explorer integrates with various visualization tools, so you can visualize your data and share the results across your organization. This data can be transformed into actionable insights to make an impact on your business.

Data visualization and reporting is a critical step in the data analytics process. Azure Data Explorer supports many BI services so you can use the one that best fits your scenario and budget.

## Kusto query language visualizations

The Kusto query language [`render operator`](/azure/kusto/query/renderoperator) offers various visualizations such as tables, pie charts, and bar charts to depict query results. Query visualizations are helpful in anomaly detection and forecasting, machine learning, and more.

## Power BI

Azure Data Explorer provides the capability to connect to [Power BI](https://powerbi.microsoft.com) using various methods: 

  * [Built-in native Power BI connector](/azure/data-explorer/power-bi-connector)

  * [Query import from Azure Data Explorer into Power BI](/azure/data-explorer/power-bi-imported-query)
 
  * [SQL query](/azure/data-explorer/power-bi-sql-query)

## Microsoft Excel

Azure Data Explorer provides the capability to connect to [Microsoft Excel](https://products.office.com/excel) using the built-in native Excel connector, or import a query from Azure Data Explorer into Excel.

## Grafana

[Grafana](https://grafana.com) provides an Azure Data Explorer plugin that enables you to visualize data from Azure Data Explorer. You [set up Azure Data Explorer as a data source for Grafana, and then visualize the data](/azure/data-explorer/grafana). 

## ODBC connector

Azure Data Explorer provides an [Open Database Connectivity (ODBC) connector](connect-odbc.md) so any application that supports ODBC can connect to Azure Data Explorer.

## Tableau

Azure Data Explorer provides the capability to connect to [Tableau](https://www.tableau.com)
 using the [ODBC connector](/azure/data-explorer/connect-odbc) and then [visualize the data in Tableau](tableau.md).

## Qlik

Azure Data Explorer provides the capability to connect to [Qlik](https://www.qlik.com) using the [ODBC connector](/azure/data-explorer/connect-odbc) and then create Qlik Sense dashboards and visualize the data. Using the following video, you can learn to visualize Azure Data Explorer data with Qlik. 

> [!VIDEO https://www.youtube.com/embed/nhWIiBwxjjU]  

## Sisense

Azure Data Explorer provides the capability to connect to [Sisense](https://www.sisense.com) using the JDBC connector. You [set up Azure Data Explorer as a data source for Sisense, and then visualize the data](/azure/data-explorer/sisense).