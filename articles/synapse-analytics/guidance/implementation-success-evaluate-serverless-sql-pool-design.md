---
title: "Synapse implementation success methodology: Evaluate serverless SQL pool design"
description: "Learn how to evaluate your serverless SQL pool design to identify issues and validate that it meets guidelines and requirements."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/31/2022
---

# Synapse implementation success methodology: Evaluate serverless SQL pool design

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

You should evaluate your [serverless SQL pool](../sql/on-demand-workspace-overview.md) design to identify issues and validate that it meets guidelines and requirements. By evaluating the design *before solution development begins*, you can avoid blockers and unexpected design changes. That way, you protect the project's timeline and budget.

The architectural separation of storage and compute for modern data, analytical platforms and services has been a trend and frequently used pattern. It provides cost savings and more flexibility allowing independent on-demand scaling of your storage and compute. Synapse SQL serverless extends this pattern by adding the capability to query your data lake data directly. There's no need to worry about compute management when using self-service types of workloads.

## Fit gap analysis

When planning to implement SQL serverless pools within Azure Synapse, you first need to ensure serverless pools are the right fit for your workloads. You should consider operational excellence, performance efficiency, reliability, and security.

### Operational excellence

For operational excellence, evaluate the following points.

- **Solution development environment:** Within this methodology, there's an evaluation of the [solution development environment](implementation-success-evaluate-solution-development-environment-design.md). Identify how the environments (development, test, and production) are designed to support solution development. Commonly, you'll find a production and non-production environments (for development and test). You should find Synapse workspaces in all of the environments. In most cases, you'll be obliged to segregate your production and development/test users and workloads.
- **Synapse workspace design:** Within this methodology, there's an evaluation of the [Synapse workspace design](implementation-success-evaluate-workspace-design.md). Identify how the workspaces have been designed for your solution. Become familiar with the design and know whether the solution will use a single workspace or whether multiple workspaces form part of the solution. Know why a single or multiple workspace design was chosen. A multi-workspace design is often chosen to enforce strict security boundaries.
- **Deployment:** SQL serverless is available on-demand with every Synapse workspace, so it doesn't require any special deployment actions. Check regional proximity of the service and that of the Azure Data Lake Storage Gen2 (ADLS Gen2) account that it's connected to.
- **Monitoring:** Check whether built-in monitoring is sufficient and whether any external services need to be put in place to store historical log data. Log data allows analyzing changes in performance and allows you to define alerting or triggered actions for specific circumstances.

### Performance efficiency

Unlike traditional database engines, SQL serverless doesn't rely on its own optimized storage layer. For that reason, its performance is heavily dependent on how data is organized in ADLS Gen2. For performance efficiency, evaluate the following points.

- **Data ingestion:** Review how data is stored in the data lake. File sizes, the number of files, and folder structure all have an impact on performance. Keep in mind that while some file sizes might work for SQL serverless, they may impose issues for efficient processing or consumption by other engines or applications. You'll need to evaluate the data storage design and validate it against all of the data consumers, including SQL serverless and any other data tools that form part of your solution.
- **Data placement:** Evaluate whether your design has unified and defined common patterns for data placement. Ensure that directory branching can support your security requirements. There are a few common patterns that can help you keep your time series data organized. Whatever your choice, ensure that it also works with other engines and workloads. Also, validate whether it can help partition auto-discovery for Spark applications and external tables.
- **Data formats:** In most cases, SQL serverless will offer the best performance and better compatibility feature-wise by using a Parquet format. Verify your performance and compatibility requirements, because while Parquet improves performance - thanks to better compression and reduction of IO (by reading only required columns needed for analysis) - it requires more compute resources. Also, because some source systems don't natively support Parquet as an export format, it could lead to more transformation steps in your pipelines and/or dependencies in your overall architecture.
- **Exploration:** Every industry is different. In many cases, however, there are common data access patterns found in the most frequent-run queries. Patterns typically involve filtering, and aggregations by dates, categories, or geographic regions. Identify your most common filtering criteria, and relate them to how much data is read/discarded by the most frequent-run queries. Validate whether the information on the data lake is organized to favor your exploration requirements and expectations. For the queries identified in your design and in your assessment, see whether you can eliminate unnecessary partitions in your OPENROWSET path parameter, or - if there are external tables - whether creating more indexes can help.

### Reliability

For reliability, evaluate the following points.

- **Availability:** Validate any availability requirements that were identified during the [assessment stage](implementation-success-assess-environment.md). While there aren't any specific SLAs for SQL serverless, there's a 30-minute timeout for query execution. Identify the longest running queries from your assessment and validate them against your serverless SQL design. A 30-minute timeout could break the expectations for your workload and appear as a service problem.
- **Consistency:** SQL serverless is designed primarily for read workloads. So, validate whether all consistency checks have been performed during the data lake data provisioning and formation process. Keep abreast of new capabilities, like [Delta Lake](../spark/apache-spark-what-is-delta-lake.md) open-source storage layer, which provides support for ACID (atomicity, consistency, isolation, and durability) guarantees for transactions. This capability allows you to implement effective [lambda or kappa architectures](/azure/architecture/data-guide/big-data/) to support both streaming and batch use cases. Be sure to evaluate your design for opportunities to apply new capabilities but not at the expense of your project's timeline or cost.
- **Backup:** Review any disaster recovery requirements that were identified during the assessment. Validate them against your SQL serverless design for recovery. SQL serverless itself doesn't have its own storage layer and that would require handling snapshots and backup copies of your data. The data store accessed by serverless SQL is external (ADLS Gen2). Review the recovery design in your project for these datasets.

### Security

Organization of your data is important for building flexible security foundations. In most cases, different processes and users will require different permissions and access to specific sub areas of your data lake or logical data warehouse.

For security, evaluate the following points.

- **Data storage:** Using the information gathered during the [assessment stage](implementation-success-assess-environment.md), identify whether typical *Raw*, *Stage*, and *Curated* data lake areas need to be placed on the same storage account instead of independent storage accounts. The latter might result in more flexibility in terms of roles and permissions. It can also add more input/output operations per second (IOPS) capacity that might be needed if your architecture must support heavy and simultaneous read/write workloads (like real-time or IoT scenarios). Validate whether you need to segregate further by keeping your sandboxed and master data areas on separate storage accounts. Most users won't need to update or delete data, so they don't need write permissions to the data lake, except for sandboxed and private areas.
- From your assessment information, identify whether any requirements rely on security features like [Always Encrypted](/sql/relational-databases/security/encryption/always-encrypted-database-engine?view=sql-server-ver15&viewFallbackFrom=azure-sqldw-latest&preserve-view=true), [Dynamic data masking](/azure/azure-sql/database/dynamic-data-masking-overview?view=azuresql&preserve-view=true) or [Row-level security](/sql/relational-databases/security/row-level-security?view=azure-sqldw-latest&preserve-view=true). Validate the availability of these features in specific scenarios, like when used with the OPENROWSET function. Anticipate potential workarounds that may be required.
- From your assessment information, identify what would be the best authentication methods. Consider Microsoft Entra service principals, shared access signature (SAS), and when and how authentication pass-through can be used and integrated in the exploration tool of choice of the customer. Evaluate the design and validate that the best authentication method as part of the design.

### Other considerations

Review your design and check whether you have put in place [best practices and recommendations](../sql/best-practices-serverless-sql-pool.md). Give special attention to filter optimization and collation to ensure that predicate pushdown works properly.

## Next steps

In the [next article](implementation-success-evaluate-spark-pool-design.md) in the *Azure Synapse success by design* series, learn how to evaluate your Spark pool design to identify issues and validate that it meets guidelines and requirements.
