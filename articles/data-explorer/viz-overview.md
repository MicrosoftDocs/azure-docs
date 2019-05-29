---
title: 'Azure Data Explorer data visualization'
description: 'Learn about the different ways you can visualize your data in Azure Data Explorer'
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 5/27/2019
---

# Data Visualization with Azure Data Explorer 

Data visualization and reporting is the final step in the data analytics process. As with other aspects of data analytics, there are numerous options available for visualization.  Select the service which best aligns with the objectives of your solution. 

ADX native visualizations.... //more info Azure Data Explorer integrates with various visualization tools to all you to...

is an analytics business intelligence platform that enables you to build analytics apps that deliver highly interactive user experiences. The business intelligence and dashboard reporting software allows you to access and combine data in a few clicks. You can connect to structured and unstructured data sources, join tables from multiple sources with minimal scripting and coding, and create interactive web dashboards and reports. enables you to query and visualize data, then create and share dashboards based on your visualizations. transform data into actionable insights. Explore with limitless visual analytics. Build dashboards and perform ad hoc analyses in just a few clicks. Share your work with anyone and make an impact on your business.
turn your unrelated sources of data into coherent, visually immersive, and interactive insights. lets you easily connect to your data sources, visualize and discover what’s important, and share that with anyone or everyone you want.
Power BI can be simple and fast – capable of creating quick insights from an Excel spreadsheet or a local database. But Power BI is also robust and enterprise-grade, ready for extensive modeling and real-time analytics, as well as custom development. So it can be your personal report and visualization tool. It can also serve as the analytics and decision engine for group projects, divisions, or entire corporations.
Power BI - Power BI Desktop is a free application you can install on your local computer that lets you connect to, transform, and visualize your data. With Power BI Desktop, you can connect to multiple different sources of data, and combine them (often called modeling) into a data model that lets you build visuals, and collections of visuals you can share as reports, with other people inside your organization. Most users who work on Business Intelligence projects use Power BI Desktop to create reports, and then use the Power BI service to share their reports with others.
Blog - Do you want to analyze vast amounts of data, create Power BI dashboards and reports to help you visualize your data, and share insights across your organization? Azure Data Explorer (ADX), a lightning-fast indexing and querying service helps you build near real-time and complex analytics solutions for vast amounts of data. ADX can connect to Power BI, a business analytics solution that lets you visualize your data and share the results across your organization. The various methods of connection to Power BI allow for interactive analysis of organizational data such as tracking and presentation of trends. Power BI is a business analytics solution that lets you visualize your data and share the results across your organization.

* Azure Data Explorer visualizations:
Using Kusto query language the [`render operator`](https://docs.microsoft.com/en-us/azure/kusto/query/renderoperator) offers various visualization types to depict query results. Query visualizations are helpful in anomaly detection and forecasting, machine learning, and more. 

* [PowerBI](https://powerbi.microsoft.com):
Azure Data Explorer provides the capability to connect to PowerBI using the [built-in connector in WebUI](https://docs.microsoft.com/en-us/azure/data-explorer/power-bi-connector), [import a query from Azure Data Explorer into PowerBI](https://docs.microsoft.com/en-us/azure/data-explorer/power-bi-imported-query), or use a [SQL query](https://docs.microsoft.com/en-us/azure/data-explorer/power-bi-sql-query).

* [Microsoft Excel](https://products.office.com/en-us/excel):
Azure Data Explorer provides the capability to connect to Excel using the [built-in connector in Web UI](), or [import a query from Azure Data Explorer into Excel]()

* [Grafana](https://grafana.com):
//to do Grafana provides an Azure Data Explorer plugin or Azure Data Explorer provides a Grafana plugin, which enables you to connect to and visualize data from Azure Data Explorer. You [set up Azure Data Explorer as a data source for Grafana, and then visualize data from a cluster](https://docs.microsoft.com/en-us/azure/data-explorer/grafana)

* [Sisense](https://www.sisense.com):
Azure Data Explorer provides the capability to connect to Sisense using the JDBC connector. You [set up Azure Data Explorer as a data source for Sisense, and then visualize data from a cluster]().

* [Tableau](https://www.tableau.com):
Azure Data Explorer provides the capability to connect to Tableau using the ODBC connector.

* [Qlik](https://www.qlik.com):
Azure Data Explorer provides the capability to connect to Qlik using the ODBC connector.