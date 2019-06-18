---
title: 'Azure Data Explorer data visualization'
description: 'Learn about the different ways you can visualize your Azure Data Explorer data'
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 06/03/2019
---

# Data visualization with Azure Data Explorer 

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data that is used to build complex analytics solutions for vast amounts of data. Azure Data Explorer integrates with various visualization tools, so you can visualize your data and share the results across your organization. This data can be transformed into actionable insights to make an impact on your business.

Data visualization and reporting is a critical step in the data analytics process. Azure Data Explorer supports many BI services so you can use the one that best fits your scenario and budget.

* Azure Data Explorer visualizations:
Using Kusto query language the [`render operator`](/azure/kusto/query/renderoperator) offers various visualization types to depict query results. Query visualizations are helpful in anomaly detection and forecasting, machine learning, and more.

* [Power BI](https://powerbi.microsoft.com):
Azure Data Explorer provides the capability to connect to Power BI using various methods: 

  * [Built-in native Power BI connector](/azure/data-explorer/power-bi-connector)

  * [Query import from Azure Data Explorer into Power BI](/azure/data-explorer/power-bi-imported-query)
 
  * [SQL query](/azure/data-explorer/power-bi-sql-query).

* [Microsoft Excel](https://products.office.com/excel):
Azure Data Explorer provides the capability to connect to Excel using the built-in native Excel connector, or import a query from Azure Data Explorer into Excel.

* [Grafana](https://grafana.com):
Grafana provides an Azure Data Explorer plugin that enables you to visualize data from Azure Data Explorer. You [set up Azure Data Explorer as a data source for Grafana, and then visualize the data](/azure/data-explorer/grafana)

* [Sisense](https://www.sisense.com):
Azure Data Explorer provides the capability to connect to Sisense using the JDBC connector. You [set up Azure Data Explorer as a data source for Sisense, and then visualize the data](/azure/data-explorer/sisense).

* [Tableau](https://www.tableau.com):
Azure Data Explorer provides the capability to connect to Tableau using the [ODBC connector and visualize the data in Tableau](/azure/data-explorer/connect-odbc).

* [Qlik](https://www.qlik.com):
Azure Data Explorer provides the capability to connect to Qlik using the [ODBC connector](/azure/data-explorer/connect-odbc).