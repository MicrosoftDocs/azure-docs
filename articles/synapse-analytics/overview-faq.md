---
title: FAQ #Required; update as needed page title displayed in search results. Include the brand.
description: #Required; Add article description that is displayed in search results.
services: azure-synapse-analytics #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: ArnoMicrosoft #Required; update with your GitHub user alias, with correct capitalization.
ms.service: sql-data-warehouse #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/09/2019 #Update with current date; mm/dd/yyyy format.
ms.author: acomet #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

<!---Recommended: Removal all the comments in this template before you sign-off or merge to master.--->

<!---overview articles are for new customers and explain the service from a technical point of view.
They are not intended to define benefits or value prop; that would be in marketing content.
--->

# FAQ 
<!---Required: 
For the H1 - that's the primary heading at the top of the article - use the format "What is <service>?"
You can also use this in the TOC if your service name doesn’t cause the phrase to wrap.
--->

## General
### Q: What is Azure Synapse Analytics
A: Azure Synapse is an integrated data platform for BI, AI and continuous intelligence. It connects various Analytics runtimes such as SQL and Spark through a single platform that provides a unified way to:
- Secure your analytics resources: network, managing single sign-on  access to pool, data and development artifacts.
- Easily Monitor and quickly optimize, react and debug  events happening in your workspace activities at any layer
- Manage your metadata across engines. Create a Spark table and it will be automatically available in your SQL Analytics databases
- Interact with the data through a unified user experience. Arcadia Studio brings Big Data Developers, Data Engineers, DBAs, Data Analysts and Data Scientists into the same platform with Synapse Studio.

### Q: How do I get started with Azure Synapse Analytics?
A: To start using Azure Synapse Analytics, simply create a Synapse workspace (it is free!) and create the resources that you want under that workspace. You can follow one of our quick start tutorials that will walk you through simple use case. You can also find sample notebooks and SQL scripts into our repository. If you need to connect to public dataset, create a new linked service with the following attributes:
- azure_storage_account_name = "azureopendatastorage"
- azure_storage_sas_token = "" (simply right **""**)

### Q: What are the main components of Azure Synapse Analytics?
A: Azure Synapse has the following capabilities:
- SQL Analytics to do SQL Analytics with pools and with on-demand (Serverless). 
- Spark with full support for Scala, Python, SparkSQL and C#
- Data Flow offering a code-free big data transformation experience
- Data Integration & Orchestration to bring your data and operationalize all of your code development
- Studio to access all of these capabilities through a single Web UI

### Q: How does Azure Synapse Analytics relate to Azure SQL Data Warehouse?
A: Azure Synapse Analytics is an evolution of Azure SQL Data Warehouse into an analytics platform that combines data exploration, ingestion, transformation, preparation and serving analytics layer. Azure Synapse enables enterprises to bring for the first time various siloed organization 

## Use cases
### Q: What is a good use case for SQL Analytics Pool in Synapse

A: SQL Analytics Pool is the heart of your data warehouse needs. It is the leading data warehouse solution in [price/performance](https://azure.microsoft.com/en-us/services/sql-data-warehouse/compare/). SQL Analytics Pool is the industry leading cloud data warehouse solution because you can:
- serve a large and mixed varieties of workloads without impact in performance thanks to high concurrency and workload isolation
- secure your data easily through advanced features ranging from network security to fine-grain access
- benefit from a wide range of eco-system 

### Q: What is a good use case for Spark in Synapse

A: Our first goal is to provide a great Data Engineering experience for transforming data over the lake in batch or stream. Its tight and simple integration to our data orchestration makes the operationalization of your development work straightforward.

Another use case for Spark is for a Data Scientist to:
- extract a feature
- explore data
- train a model

### Q: What is a good use case for SQL Analytics On-Demand in Synapse

A: SQL Analytics Pool, previously called SQL Data Warehouse,  is a great tool for exploring the data with T-SQL. It is also a great tool for running Business Intelligence at a low cost if data is accessed infrequently. Another sue case is to provide a low-cost BI interface into the lake. With a relatively small dataset that needs to be cached, you can combine Power BI and SQL Analytics On-Demand to cache data that are accessed frequently and use a serverless SQL query engine to access the lake infrequently.

### Q: What is a good use case for data flow in Synapse

A: Data flow allows data engineers to develop graphical data transformation logic without writing code. The resulting data flows are executed as activities within Data Integration & Orchestration. Data flow activities can be operationalized via existing scheduling, control, flow and monitoring capabilities.

## Security and Access
### Q: What is the primary way to authenticate and give access to users 

A: End to end single sign-on experience is very important in Azure Synapse Analytics. Therefore, managing and passing through the identity through a full AAD integration is a must. 

### Q: How do I get access to files and folders in the ADLSg2?

A: Access to files and folders is currently managed through ADLSg2. An interface in the Synapse Studio will be soon available. For more information, visit the page [here](https://docs.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-access-control).

### Q: Can I use third party business intelligence tools to access Azure Synapse Analytics?

A: Yes, you can use your third-party business applications, like Tableau and Power BI, to connect to SQL Analytics pool and SQL Analytics On-Demand. Spark supports IntelliJ.

### Q: Does Azure Synapse Analytics provide APIs?

A: Yes, we provide an SDK to programmatically interact to Azure Synapse Analytics. More information is available [here] on which operations are supported by Synapse.