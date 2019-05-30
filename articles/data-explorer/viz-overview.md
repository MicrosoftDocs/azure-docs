---
title: 'Azure Data Explorer data visualization'
description: 'Learn about the different ways you can visualize your data in Azure Data Explorer'
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 5/30/2019
---

# Data Visualization with Azure Data Explorer 

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Use Azure Data Explorer to build complex analytics solutions for vast amounts of data. Azure Data Explorer integrates with various visualization tools, so you can visualize your data and share the results across your organization. This data can be transformed into actionable insights to make an impact on your business.

Data visualization and reporting is the final step in the data analytics process. There are many options available for visualization, so select the service that best aligns with your needs. 

* Azure Data Explorer visualizations:
Using Kusto query language the [`render operator`](https://docs.microsoft.com/en-us/azure/kusto/query/renderoperator) offers various visualization types to depict query results. Query visualizations are helpful in anomaly detection and forecasting, machine learning, and more.

* [Power BI](https://powerbi.microsoft.com):
Azure Data Explorer provides the capability to connect to Power BI using various methods: 

  * [Built-in connector in Web UI](/azure/data-explorer/power-bi-connector)

  * [Query import from Azure Data Explorer into Power BI](/azure/data-explorer/power-bi-imported-query)
 
  * [SQL query](/azure/data-explorer/power-bi-sql-query).

* [Microsoft Excel](https://products.office.com/en-us/excel):
Azure Data Explorer provides the capability to connect to Excel using the [built-in connector in Web UI](), or [import a query from Azure Data Explorer into Excel]()

* [Grafana](https://grafana.com):
//to do Grafana provides an Azure Data Explorer plugin or Azure Data Explorer provides a Grafana plugin, which enables you to connect to and visualize data from Azure Data Explorer. You [set up Azure Data Explorer as a data source for Grafana, and then visualize data from a cluster](https://docs.microsoft.com/en-us/azure/data-explorer/grafana)

* [Sisense](https://www.sisense.com):
Azure Data Explorer provides the capability to connect to Sisense using the JDBC connector. You [set up Azure Data Explorer as a data source for Sisense, and then visualize data from a cluster](/azure/data-explorer/sisense).

* [Tableau](https://www.tableau.com):
Azure Data Explorer provides the capability to connect to Tableau using the ODBC connector.

* [Qlik](https://www.qlik.com):
Azure Data Explorer provides the capability to connect to Qlik using the ODBC connector.