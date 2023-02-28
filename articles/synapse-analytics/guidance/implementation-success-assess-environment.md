---
title: "Synapse implementation success methodology: Assess environment"
description: "Learn how to assess your environment to help evaluate the solution design and make informed technology decisions to implement Azure Synapse Analytics."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/31/2022
---

# Synapse implementation success methodology: Assess environment

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

The first step when implementing Azure Synapse Analytics is to conduct an assessment of your environment. An assessment provides you with the opportunity to gather all the available information about your existing environment, environmental requirements, project requirements, constraints, timelines, and pain points. This information will form the basis of later evaluations and checkpoint activities. It will prove invaluable when it comes time to validate and compare against the project solution as it's planned, designed, and developed. We recommend that you dedicate a good amount of time to gather all the information and be sure to have necessary discussions with relevant groups. Relevant groups can include project stakeholders, business users, solution designers, and subject matter experts (SMEs) of the existing solution and environment.

The assessment will become a guide to help you evaluate the solution design and make informed technology recommendations to implement Azure Synapse.

## Workload assessment

The workload assessment is concerned with the environment, analytical workload roles, ETL/ELT, networking and security, the Azure environment, and data consumption.

### Environment

For the environment, evaluate the following points.

- Describe your existing analytical workload:
    - What are the workloads (like data warehouse or big data)?
    - How is this workload helping the business? What are the use case scenarios?
    - What is the business driver for this analytical platform and for potential migration?
    - Gather details about the existing architecture, design, and implementation choices.
    - Gather details about all existing upstream and downstream dependent components and consumers.
- Are you migrating an existing data warehouse (like Microsoft SQL Server, Microsoft Analytics Platform System (APS), Netezza, Snowflake, or Teradata)?
- Are you migrating a big data platform (like Cloudera or Hortonworks)?
- Gather the architecture and dataflow diagrams for the current analytical environment.
- Where are the data sources for your planned analytical workloads located (Azure, other cloud providers, or on-premises)?
- What is the total size of existing datasets (historical and incremental)? What is the current rate of growth of your dataset(s)? What is the projected rate of growth of your datasets for the next 2-5 years?
- Do you have an existing data lake? Gather as much detail as possible about file types (like Parquet or CSV), file sizes, and security configuration.
- Do you have semi-structured or unstructured data to process and analyze?
- Describe the nature of the data processing (batch or real-time processing).
- Do you need interactive data exploration from relational data, data lake, or other sources?
- Do you need real-time data analysis and exploration from operational data sources?
- What are the pain points and limitations in the current environment?
- What source control and DevOps tools are you using today?
- Do you have a use case to build a hybrid (cloud and on-premises) analytical solution, cloud only, or multi-cloud?
- Gather information on the existing cloud environment. Is it a single-cloud provider or a multi-cloud provider?
- Gather plans about the future cloud environment. Will it be a single-cloud provider or a multi-cloud provider?
- What are the RPO/RTO/HA/SLA requirements in the existing environment?
- What are the RPO/RTO/HA/SLA requirements in the planned environment?

### Analytical workload roles

For the analytical workload roles, evaluate the following points.

- Describe the different roles (data scientist, data engineer, data analyst, and others).
- Describe the analytical platform access control requirement for these roles.
- Identify the platform owner who's responsible to provision compute resources and grant access.
- Describe how different data roles currently collaborate.
- Are there multiple teams collaborating on the same analytical platform? If so, what's the access control and isolation requirements for each of these teams?
- What are the client tools that end users use to interact with the analytical platform?

### ETL/ELT, transformation, and orchestration

For ETL/ELT, transformation, and orchestration, evaluate the following points.

- What tools are you using today for data ingestion (ETL or ELT)?
- Where do these tools exist in the existing environment (on-premises or the cloud)?
- What are your current data load and update requirements (real-time, micro batch, hourly, daily, weekly, or monthly)?
- Describe the transformation requirements for each layer (big data, data lake, data warehouse).
- What is the current programming approach for transforming the data (no-code, low-code, programming like SQL, Python, Scala, C#, or other)?
- What is the preferred planned programming approach to transform the data (no-code, low-code, programming like SQL, Python, Scala, C#, or other)?
- What tools are currently in use for data orchestration to automate the data-driven process?
- Where are the data sources for your existing ETL located (Azure, other cloud provider, or on-premises)?
- What are the existing data consumptions tools (reporting, BI tools, open-source tools) that require integration with the analytical platform?
- What are the planned data consumptions tools (reporting, BI tools, open-source tools) that will require integration with the analytical platform?

### Networking and security

For networking and security, evaluate the following points.

- What regulatory requirements do you have for your data?
- If your data contains customer content, payment card industry (PCI), or Health Insurance Portability and Accountability Act of 1996 (HIPAA) data, has your security group certified Azure for this data? If so, for which Azure services?
- Describe your user authorization and authentication requirements.
- Are there security issues that could limit access to data during implementation?
- Is there test data available to use during development and testing?
- Describe the organizational network security requirements on the analytical compute and storage (private network, public network, or firewall restrictions).
- Describe the network security requirements for client tools to access analytical compute and storage (peered network, private endpoint, or other).
- Describe the current network setup between on-premises and Azure (Azure ExpressRoute, site-to-site, or other).

Use the following checklists of possible requirements to guide your assessment.

- Data protection:
    - In-transit encryption
    - Encryption at rest (default keys or customer-managed keys)
    - Data discovery and classification
- Access control:
    - Object-level security
    - Row-level security
    - Column-level security
    - Dynamic data masking
- Authentication:
    - SQL login
    - Azure Active Directory (Azure AD)
    - Multi-factor authentication (MFA)
- Network security:
    - Virtual networks
    - Firewall
    - Azure ExpressRoute
- Threat protection:
    - Threat detection
    - Auditing
    - Vulnerability assessment

For more information, see the [Azure Synapse Analytics security white paper](security-white-paper-introduction.md).

### Azure environment

For the Azure environment, evaluate the following points.

- Are you currently using Azure? Is it used for production workloads?
- If you're using Azure, which services are you using? Which regions are you using?
- Do you use Azure ExpressRoute? What's its bandwidth?
- Do you have budget approval to provision the required Azure services?
- How do you currently provision and manage resources (Azure Resource Manager (ARM) or Terraform)?
- Is your key team familiar with Synapse Analytics? Is any training required?

### Data consumption

For data consumption, evaluate the following points.

- Describe how and what tools you currently use to perform activities like ingest, explore, prepare, and data visualization.
- Identify what tools you plan to use to perform activities like ingest, explore, prepare, and data visualization.
- What applications are planned to interact with the analytical platform (Microsoft Power BI, Microsoft Excel, Microsoft SQL Server Reporting Services, Tableau, or others)?
- Identify all data consumers.
- Identify data export and data sharing requirements.

## Azure Synapse services assessment

The Azure Synapse services assessment is concerned with the services within Azure Synapse. Azure Synapse has the following components for compute and data movement:

- **Synapse SQL:** A distributed query system for Transact-SQL (T-SQL) that enables data warehousing and data virtualization scenarios. It also extends T-SQL to address streaming and machine learning (ML) scenarios. Synapse SQL offers both *serverless* and *dedicated* resource models.
- **Serverless SQL pool:** A distributed data processing system, built for large-scale data and computational functions. There's no infrastructure to set up or clusters to maintain. This service is suited for unplanned or burst workloads. Recommended scenarios include quick data exploration on files directly on the data lake, logical data warehouse, and data transformation of raw data.
- **Dedicated SQL pool:** Represents a collection of analytic resources that are provisioned when using Synapse SQL. The size of a dedicated SQL pool (formerly SQL DW) is determined by Data Warehousing Units (DWU). This service is suited for a data warehouse with predictable, high performance continuous workloads over data stored in SQL tables. 
- **Apache Spark pool:** Deeply and seamlessly integrates Apache Spark, which is the most popular open source big data engine used for data preparation, data engineering, ETL, and ML.
- **Data integration pipelines:** Azure Synapse contains the same data integration engine and experiences as Azure Data Factory (ADF). They allow you to create rich at-scale ETL pipelines without leaving Azure Synapse.

To help determine the best SQL pool type (dedicated or serverless), evaluate the following points.

- Do you want to build a traditional relational data warehouse by reserving processing power for data stored in SQL tables?
- Do your use cases demand predictable performance?
- Do you want to a build a logical data warehouse on top of a data lake?
- Do you want to query data directly from a data lake?
- Do you want to explore data from a data lake?

The following table compares the two Synapse SQL pool types.

| **Comparison** | **Dedicated SQL pool** | **Serverless SQL pool** |
|:-|:-|:-|
| Value propositions | Fully managed capabilities of a data warehouse. Predictable and high performance for continuous workloads. Optimized for managed (loaded) data. | Easy to get started and explore data lake data. Better total cost of ownership (TCO) for ad hoc and intermittent workloads. Optimized for querying data in a data lake. |
| Workloads | *Ideal for continuous workloads.* Loading boosts performance, with more complexity. Charging per DWU (when sized well) will be cost-beneficial. | *Ideal for ad hoc or intermittent workloads.* There's no need to load data, so it's easier to start and run. Charging per usage will be cost-beneficial. |
| Query performance | *Delivers high concurrency and low latency.* Supports rich caching options, including materialized views. There's the ability to choose trade-offs with workload management (WLM). | *Not suited for dashboarding queries.* Millisecond response times aren't expected. It works only on external data. |

### Dedicated SQL pool assessment

For the dedicated SQL pool assessment, evaluate the following platform points.

- What is the current data warehouse platform (Microsoft SQL Server, Netezza, Teradata, Greenplum, or other)?
- For a migration workload, determine the make and model of your appliance for each environment. Include details of CPUs, GPUs, and memory.
- For an appliance migration, when was the hardware purchased? Has the appliance been fully depreciated? If not, when will depreciation end? And, how much capital expenditure is left?
- Are there any hardware and network architecture diagrams?
- Where are the data sources for your planned data warehouse located (Azure, other cloud provider, or on-premises)?
- What are the data hosting platforms of the data sources for your data warehouse (Microsoft SQL Server, Azure SQL Database, DB2, Oracle, Azure Blob Storage, AWS, Hadoop, or other)?
- Are any of the data sources data warehouses? If so, which ones?
- Identify all ETL, ELT, and data loading scenarios (batch windows, streaming, near real-time). Identify existing service level agreements (SLAs) for each scenario and document the expected SLAs in the new environment.
- What is the current data warehouse size?
- What rate of dataset growth is being targeted for the dedicated SQL pool?
- Describe the environments you're using today (development, test, or production).
- Which tools are currently in place for data movement (ADF, Microsoft SQL Server Integration Services (SSIS), robocopy, Informatica, SFTP, or others)?
- Are you planning to load real-time or near real-time data?

Evaluate the following database points.

- What is the number of objects in each data warehouse (schemas, tables, views, stored procedures, functions)?
- Is it a star schema, snowflake schema or other design?
- What are the largest tables in terms of size and number of records?
- What are the widest tables in terms of the number of columns?
- Is there already a data model designed for your data warehouse? Is it a Kimball, Inmon, or star schema design?
- Are Slowly Changing Dimensions (SCDs) in use? If so, which types?
- Will a semantic layer be implemented by using relational data marts or Analysis Services (tabular or multidimensional), or another product?
- What are the HA/RPO/RTO/data archiving requirements?
- What are the region replication requirements?

Evaluate the following workload characteristics.

- What is the estimated number of concurrent users or jobs accessing the data warehouse during *peak hours*?
- What is the estimated number of concurrent users or jobs accessing the data warehouse during *off peak hours*?
- Is there a period of time when there will be no users or jobs?
- What are your query execution performance expectations for interactive queries?
- What are your data load performance expectations for daily/weekly/monthly data loads or updates?
- What are your query execution expectations for reporting and analytical queries?
- How complex will the most commonly executed queries be?
- What percentage of your total dataset size is your active dataset?
- Approximately what percentage of the workload is anticipated for loading or updating, batch processing or reporting, interactive query, and analytical processing?
- Identify the data consuming patterns and platforms:
    - Current and planned reporting method and tools.
    - Which application or analytical tools will access the data warehouse?
    - Number of concurrent queries?
    - Average number of active queries at any point in time?
    - What is the nature of data access (interactive, ad hoc, export, or others)?
    - Data roles and complete description of their data requirements.
    - Maximum number of concurrent connections.
- Query performance SLA pattern by:
    - Dashboard users.
    - Batch reporting.
    - ML users.
    - ETL process.
- What are the security requirements for the existing environment and for the new environment (row-level security, column-level security, access control, encryption, and others)?
- Do you have requirements to integrate ML model scoring with T-SQL?

### Serverless SQL pool assessment

Synapse Serverless SQL pool supports three major use cases.

- **Basic discovery and exploration:** Quickly reason about the data in various formats (Parquet, CSV, JSON) in your data lake, so you can plan how to extract insights from it.
- **Logical data warehouse:** Provide a relational abstraction on top of raw or disparate data without relocating and transforming data, allowing an always-current view of your data.
- **Data transformation:** Simple, scalable, and performant way to transform data in the lake by using T-SQL, so it can be fed to BI and other tools or loaded into a relational data store (Synapse SQL databases, Azure SQL Database, or others).

Different data roles can benefit from serverless SQL pool:

- **Data engineers** can explore the data lake, transform and prepare data by using this service, and simplify their data transformation pipelines.
- **Data scientists** can quickly reason about the contents and structure of the data in the data lake, thanks to features such as OPENROWSET and automatic schema inference.
- **Data analysts** can [explore data and Spark external tables](../sql/develop-storage-files-spark-tables.md) created by data scientists or data engineers by using familiar T-SQL statements or their favorite query tools.
- **BI professionals** can quickly [create Power BI reports on top of data in the data lake](../sql/tutorial-connect-power-bi-desktop.md) and Spark tables.

> [!NOTE]
> The T-SQL language is used in both dedicated SQL pool and the serverless SQL pool, however there are some differences in the set of supported features. For more information about T-SQL features supported in Synapse SQL (dedicated and serverless), see [Transact-SQL features supported in Azure Synapse SQL](../sql/overview-features.md).

For the serverless SQL pool assessment, evaluate the following points.

- Do you have use cases to discover and explore data from a data lake by using relational queries (T-SQL)?
- Do you have use cases to build a logical data warehouse on top of a data lake?
- Identify whether there are use cases to transform data in the data lake without first moving data from the data lake.
- Is your data already in Azure Data Lake Storage (ADLS) or Azure Blob Storage?
- If your data is already in ADLS, do you have a good partition strategy in the data lake?
- Do you have operational data in Azure Cosmos DB? Do you have use cases for real-time analytics on Azure Cosmos DB without impacting transactions?
- Identify the file types in the data lake.
- Identify the query performance SLA. Does your use case demand predictable performance and cost?
- Do you have unplanned or bursty SQL analytical workloads?
- Identify the data consuming pattern and platforms:
    - Current and planned reporting method and tools.
    - Which application or analytical tools will access the serverless SQL pool?
    - Average number of active queries at any point in time.
    - What is the nature of data access (interactive, ad hoc, export, or others)?
    - Data roles and complete description of their data requirements.
    - Maximum number of concurrent connections.
    - Query complexity?
- What are the security requirements (access control, encryption, and others)?
- What is the required T-SQL functionality (stored procedures or functions)?
- Identify the number of queries that will be sent to the serverless SQL pool and the result set size of each query.

> [!TIP]
> If you're new to serverless SQL pools, we recommend you work through the [Build data analytics solutions using Azure Synapse serverless SQL pools](/training/paths/build-data-analytics-solutions-using-azure-synapse-serverless-sql-pools/) learning path.

### Spark pool assessment

Spark pools in Azure Synapse enable the following key scenarios.

- **Data engineering/Data preparation:** Apache Spark includes many language features to support preparation and processing of large volumes of data. Preparation and processing can make the data more valuable and allow it to be consumed by other Azure Synapse services. It's enabled through multiple languages (C#, Scala, PySpark, Spark SQL) and by using supplied libraries for processing and connectivity.
- **Machine learning:** Apache Spark comes with [MLlib](https://spark.apache.org/mllib/), which is an ML library built on top of Spark that you can use from a Spark pool. Spark pools also include Anaconda, which is a Python distribution that comprises various packages for data science including ML. In addition, Apache Spark on Synapse provides pre-installed libraries for [Microsoft Machine Learning](https://mmlspark.blob.core.windows.net/website/index.html), which is a fault-tolerant, elastic, and RESTful ML framework. When combined with built-in support for notebooks, you have a rich environment for creating ML applications.

> [!NOTE]
> For more information, see [Apache Spark in Azure Synapse Analytics](../spark/apache-spark-overview.md).
>
> Also, Azure Synapse is compatible with Linux Foundation Delta Lake. Delta Lake is an open-source storage layer that brings ACID (atomicity, consistency, isolation, and durability) transactions to Apache Spark and big data workloads. For more information, see [What is Delta Lake](../spark/apache-spark-what-is-delta-lake.md).

For the Spark pool assessment, evaluate the following points.

- Identify the workloads that require data engineering or data preparation.
- Clearly define the types of transformations.
- Identify whether you have unstructured data to process.
- When you're migrating from an existing Spark/Hadoop workload:
    - What is the existing big data platform (Cloudera, Hortonworks, cloud services, or other)?
    - If it's a migration from on-premises, has hardware depreciated or licenses expired? If not, when will depreciation or expiry happen?
    - What is the existing cluster type?
    - What are the required libraries and Spark versions?
    - Is it a Hadoop migration to Spark?
    - What are the current or preferred programming languages?
    - What is the type of workload (big data, ML, or other)?
    - What are the existing and planned client tools and reporting platforms?
    - What are the security requirements?
    - Are there any current pain points and limitations?
- Do you plan to use, or are currently using, Delta Lake?
- How do you manage packages today?
- Identify the required compute cluster types.
- Identify whether cluster customization is required.

> [!TIP]
> If you're new to Spark pools, we recommend you work through the [Perform data engineering with Azure Synapse Apache Spark Pools](/training/paths/perform-data-engineering-with-azure-synapse-apache-spark-pools/) learning path.

## Next steps

In the [next article](implementation-success-evaluate-workspace-design.md) in the *Azure Synapse success by design* series, learn how to evaluate the Synapse workspace design and validate that it meets guidelines and requirements.
