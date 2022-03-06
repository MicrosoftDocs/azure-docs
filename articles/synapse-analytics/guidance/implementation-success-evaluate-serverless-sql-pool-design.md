---
title: Evaluate serverless SQL pool design
description: TODO (solution-evaluation)
author: peter-myers
ms.author: v-petermyers
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 02/28/2022
---

# Evaluate serverless SQL pool design

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

Separation of storage and compute as a design principle for modern data and analytical platforms and services has been a trend and frequently used pattern, it provides cost savings and more flexibility in on-demand scaling of your storage and compute independently. Synapse SQL Serverless further extends this pattern and adds an important capability to query your data directly from your data lake storage and not to worry about compute management while leveraging self-service types of workloads.

The purpose of this evaluation is to provide guidance for architectures that include Synapse SQL Serverless pools and to try to reduce blockers frequently found during the course of the implementation of modern data architectures based on Azure Synapse or later in the production stages.

## Fit gap analysis

When planning to implement SQL Serverless pools within Azure Synapse Analytics, you first need to ensure Serverless Pools are the best fit for your workloads. These are the items to consider for utilizing Apache Spark in Synapse:

### Operational excellence

- **Solution development environment:** Within this method there is a review of the solution development environment. Identify how the environments are designed to support solution development (dev/test/prod). Most commonly you will find a prod and non-prod environment with Production being placed in the prod environment and     Dev and Test placed in a non-prod environment. You should find the Synapse Workspaces in the solution to exist in all of the environments (dev/test/prod). In most cases, you are obliged to segregate your production and dev/test users and workloads.
- **Synapse workspace design:** Within this method there is a review of the Synapse Workspace design. Identify how the Workspace(s) have been designed for your solution. Become familiar with the design and know if the solution will utilize a single workspace or if multiple workspaces are part of the solution. Know why a single or multiple workspace design was chosen. A multi-workspace design is usually chosen to support strict security boundaries.
- **Deployment:** SQL Serverless per se does not require any special deployment actions and you will have that service available on-demand with every Synapse workspace. Check regional proximity of the service and that of the Data Lake Storage Gen2 you access with SQL Serverless.
- **Monitoring:** Check if built-in monitoring is sufficient and if any external services need to put in place to store historical log data, in order to be able to analyze changes in performance or allow you to define alerting or triggered actions for specific situations.

### Performance Efficiency

Unlike traditional database engines, SQL Serverless does not rely on its own optimized storage layer and for that reason its performance is strongly dependent on how data is organized in Azure Data Lake Storage.

- **Data ingestion:** Review how data is stored in Data Lake Storage - the file sizes, number of files, and folder structure all have an impact on performance. Keep in mind that while some file sizes might work for SQL Serverless they may impose issues for efficient processing or consumption by other engines and applications. You     will need to evaluate the data storage design and validate it against all of the data consumers plus SQL Serverless and any other data tools that are part of your solution.
- **Data placement:** Evaluate if your design has unified and defined common patterns for data placement. Make sure that directory branching can support your security requirements. There are a few common patterns that help you keep your time series data organized. Whichever your choice is, make sure that it also works with other     engines and workloads, validate if it can help partition auto-discovery for Spark applications and external tables.
- **Data formats:** SQL Serverless in most cases will offer the best performance and better compatibility feature-wise using a Parquet format. Verify your performance and compatibility requirements, because while Parquet improves performance through better compression and reduction of IO by reading only required columns needed for the analysis, it requires additional compute and some source systems do not natively support Parquet for export output format which would lead for additional transformation steps in your pipelines and/or dependencies in your overall architecture.
- **Exploration:** Every industry is different, but in many cases, there are certain data access patterns that will be common and found in the most frequent queries in your workloads - filtering and aggregations by dates, categories, or geographies -- these are core, common patterns across many businesses. Identify from your     assessment your most common filtering criteria, relate these to how much data is being read/discarded by top used queries and validate if the information on Data Lake is organized to favor your exploration performance expectations.
- From the queries identified in your design and in your assessment see if you effectively eliminate unnecessary partitions in your OPENROWSET path parameter or, in case of external tables, if additional indexing is required.

### Reliability

- **Availability:** Validate the requirements for availability that may have been identified during the assessment. While there are no specific SLAs for serverless and resources for query execution are being acquired on-demand, currently there is 30 min timeout for query execution. Identify the longest expected running queries from your assessment and validate against your serverless SQL design. Be aware that a 30 min timeout may break the expectations for your workload and appear to be a service problem.
- **Consistency:** SQL Serverless is primarily for read workloads, validate if all consistency checks have been performed during the Data Lake data provisioning and formation process. Keep on your radar new capabilities like recent addition of Delta Lake open-source storage layer which provides support for ACID (Atomicity, Consistency, Isolation and Durability) guarantees for transactions and it allows you to implement effective lambda/kappa architectures to support both streaming and batch use cases. Evaluate your design for opportunities to apply new capabilities but not at the expense of your project's timeline or cost.
- **Backup:** Review from your assessment your disaster recovery requirements. Validate against your serverless SQL design for recovery. SQL Serverless itself does not have its own storage layer and that would require handling snapshots and backup copies of your data. The data store accessed by serverless SQL is external (ADLS     storage) review the recovery design in your project for these datasets.

### Security

Organization of your data is also important for building flexible security foundations: in most cases different processes and users will require different permissions and access to specific sub-areas of your Data Lake or logical Data Warehouse.

- **Data storage:** Using the information gathered during the assessment identify if typical Raw, Stage and Curated data lake areas need to be placed on the same Storage Account vs independent Storage Accounts. The latter might result in more flexibility in terms of roles and permissions and also add additional IOPS capacity that might be needed if your architecture must support heavy and simultaneous read/write workloads (potentially that could be a case of real time or IoT scenarios). Validate if you need to further segregate and keep your Sandboxed areas and Master Data areas on separate Accounts as well. Most users will not need to update and     delete data and therefore do not need write permissions to your Data Lake, except Sandboxed and private areas. Evaluate what you have identified from the assessment against the design.
- From your assessment information identify if any requirements point to features like *Always Encrypted*, *Dynamic Data Masking* or *Row Level Security.* Validate the availability of these features in specific scenarios - like with OPENROWSET -- Review against your design and anticipate potential workarounds that may be required.
- From your assessment information identify what would be the best authentication methods, i.e. AAD Service Principals, SAS, when and how Authentication pass-through can be leveraged and integrated in the exploration tool of choice of the customer. Evaluate the design and validate that the best authentication method is part of the design.

### Other considerations

Review your design and check if you have put in place our best practices and recommendations ([Best practices for serverless SQL pool](../sql/best-practices-serverless-sql-pool.md)). Give special attention to filter optimization and proper collation to assure that predicate push-down works properly.

## Conclusion

Taking the time to evaluate your serverless SQL design against the information you gathered from the assessment will help ensure your SQL Serverless in Azure Synapse architecture is sound and meets your needs.

## Next steps

TODO
