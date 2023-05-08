---
title: "Synapse POC playbook: Data lake exploration with serverless SQL pool in Azure Synapse Analytics"
description: "A high-level methodology for preparing and running an effective Azure Synapse Analytics proof of concept (POC) project for serverless SQL pool."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/23/2022
---

# Synapse POC playbook: Data lake exploration with serverless SQL pool in Azure Synapse Analytics

This article presents a high-level methodology for preparing and running an effective Azure Synapse Analytics proof of concept (POC) project for serverless SQL pool.

[!INCLUDE [proof-of-concept-playbook-context](includes/proof-of-concept-playbook-context.md)]

## Prepare for the POC

A POC project can help you make an informed business decision about implementing a big data and advanced analytics environment on a cloud-based platform that leverages serverless SQL pool in Azure Synapse. If you need to explore or gain insights from data in the data lake, or optimize your existing data transformation pipeline, you can benefit from using the serverless SQL pool. It's suitable for the following scenarios:

- **Basic discovery and exploration:** Quickly reason about data stored in various formats (Parquet, CSV, JSON) in your data lake, so you can plan how to unlock insights from it.
- **Logical data warehouse:** Produce a relational abstraction on top of raw or disparate data without relocating or transforming it, providing an always up-to-date view of your data.
- **Data transformation:** Run simple, scalable, and highly performant data lake queries by using T-SQL. You can feed query results to business intelligence (BI) tools, or load them into a relational database. Target systems can include Azure Synapse dedicated SQL pools or Azure SQL Database.

Different professional roles can benefit from serverless SQL pool:

- **Data engineers** can explore the data lake, transform and prepare data by using serverless SQL pool, and simplify their data transformation pipelines.
- **Data scientists** can quickly reason about the contents and structure of the data stored in the data lake by using the [OPENROWSET](/sql/t-sql/functions/openrowset-transact-sql?view=sql-server-ver15&viewFallbackFrom=azure-sqldw-latest&preserve-view=true) T-SQL function and its automatic schema inference.
- **Data analysts** can write T-SQL queries in their preferred query tools, which can connect to serverless SQL pool. They can explore data in Spark external tables that were created by data scientists or data engineers.
- **BI professionals** can quickly create Power BI reports that connect to data lake or Spark tables.

A serverless SQL pool POC project will identify your key goals and business drivers that serverless SQL pool is designed to support. It will also test key features and gather metrics to support your implementation decisions. A POC isn't designed to be deployed to a production environment. Rather, it's a short-term project that focuses on key questions, and its result can be discarded.

Before you begin planning your serverless SQL Pool POC project:

> [!div class="checklist"]
> - Identify any restrictions or guidelines your organization has about moving data to the cloud.
> - Identify executive or business sponsors for a big data and advanced analytics platform project. Secure their support for migration to the cloud.
> - Identify availability of technical experts and business users to support you during the POC execution.

Before you start preparing for the POC project, we recommend you first read the [serverless SQL pool documentation](../sql/on-demand-workspace-overview.md).

> [!TIP]
> If you're new to serverless SQL pools, we recommend you work through the [Build data analytics solutions using Azure Synapse serverless SQL pools](/training/paths/build-data-analytics-solutions-using-azure-synapse-serverless-sql-pools/) learning path.

### Set the goals

A successful POC project requires planning. Start by identify why you're doing a POC to fully understand the real motivations. Motivations could include modernization, cost saving, performance improvement, or integrated experience. Be sure to document clear goals for your POC and the criteria that will define its success. Ask yourself:

> [!div class="checklist"]
> - What do you want as the outputs of your POC?
> - What will you do with those outputs?
> - Who will use the outputs?
> - What will define a successful POC?

Keep in mind that a POC should be a short and focused effort to quickly prove a limited set of concepts and capabilities. These concepts and capabilities should be representative of the overall workload. If you have a long list of items to prove, you may want to plan more than one POC. In that case, define gates between the POCs to determine whether you need to continue with the next one. Given the different professional roles that can use a serverless SQL pool (and the different scenarios that serverless SQL pool supports), you may choose to execute multiple POCs. For example, one POC could focus on requirements for the data scientist role, such as discovery and exploration of data in different formats. Another could focus on requirements for the data engineering role, such as data transformation and the creation of a logical data warehouse.

As you consider your POC goals, ask yourself the following questions to help you shape the goals:

> [!div class="checklist"]
> - Are you migrating from an existing big data and advanced analytics platform (on-premises or cloud)?
> - Are you migrating but want to make as few changes as possible to existing ingestion and data processing?
> - Are you migrating but want to do some extensive improvements along the way?
> - Are you building an entirely new big data and advanced analytics platform (greenfield project)?
> - What are your current pain points? For example, scalability, performance, or flexibility.
> - What new business requirements do you need to support?
> - What are the SLAs that you're required to meet?
> - What will be the workloads? For example, data exploration over different data formats, basic exploration, a logical data warehouse, data preparation and/or transformation, T-SQL interactive analysis, T-SQL querying of Spark tables, or reporting queries over the data lake.
> - What are the skills of the users who will own the project (should the POC be implemented)?

Here are some examples of POC goal setting:

- Why are we doing a POC?
    - We need to know if we can explore all of the raw file formats we store by using serverless SQL pool.
    - We need to know if our data engineers can quickly evaluate new data feeds.
    - We need to know if data lake query performance by using serverless SQL pool will meet our data exploration requirements.
    - We need to know if serverless SQL pool is a good choice for some of our visualizations and reporting requirements.
    - We need to know if serverless SQL pool is a good choice for some of our data ingestion and processing requirements.
    - We need to know if our move to Azure Synapse will meet our budget.
- At the conclusion of this PoC:
    - We will have the data to identify the data transformations that are well suited to serverless SQL pool.
    - We will have the data to identify when serverless SQL pool can be best used during data visualization.
    - We will have the data to know the ease with which our data engineers and data scientists can adopt the new platform.
    - We will have gained insight to better estimate the effort required to complete the implementation or migration project.
    - We will have a list of items that may need more testing.
    - Our POC will be successful if we have the data needed and have completed the testing identified to determine how serverless SQL pool will support our cloud-based big data and advance analytics platform.
    - We will have determined whether we can move to the next phase or whether more POC testing is needed to finalize our decision.
    - We will be able to make a sound business decision supported by specific data points.

### Plan the project

Use your goals to identify specific tests and to provide the outputs you identified. It's important to make sure that you have at least one test to support each goal and expected output. Also, identify specific data exploration and analysis tasks, specific transformations, and specific existing processing you want to test. Identify a specific dataset and codebase that you can use.

Here's an example of the needed level of specificity in planning:

- **Goal:** We need to know whether data engineers can achieve the equivalent processing of the existing ETL process named "Daily Batch Raw File Validation" within the required SLA.
- **Output:** We will have the data to determine whether we can use T-SQL queries to execute the "Daily Batch Raw File Validation" ETL process within the required SLA.
- **Test:** Validation queries A, B, and C are identified by data engineering, and they represent overall data processing needs. Compare the performance of these queries with the benchmark obtained from the existing system.

### Evaluate the POC dataset

Using the specific tests you identified, select a dataset to support the tests. Take time to review this dataset. You should verify that the dataset will adequately represent your future processing in terms of content, complexity, and scale. Don't use a dataset that's too small because it won't deliver representative performance. Conversely, don't use a dataset that's too large because the POC shouldn't become a full data migration. Be sure to obtain the appropriate benchmarks from existing systems so you can use them for performance comparisons.

> [!IMPORTANT]
> Make sure you check with business owners for any blockers before moving any data to the cloud. Identify any security or privacy concerns or any data obfuscation needs that should be done before moving data to the cloud.

### Create a high-level architecture

Based upon the high-level architecture of your proposed future state architecture, identify the components that will form part of your POC. Your high-level future state architecture likely contains many data sources, numerous data consumers, big data components, and possibly machine learning and artificial intelligence (AI) data consumers. Your POC architecture should specifically identify components that will be part of the POC. Importantly, it should identify any components that won't form part of the POC testing.

If you're already using Azure, identify any resources you already have in place (Azure Active Directory, ExpressRoute, and others) that you can use during the POC. Also identify the Azure regions your organization uses. Now is a great time to identify the throughput of your ExpressRoute connection and to check with other business users that your POC can consume some of that throughput without adverse impact on production systems.

### Identify POC resources

Specifically identify the technical resources and time commitments required to support your POC. Your POC will need:

- A business representative to oversee requirements and results.
- An application data expert, to source the data for the POC and provide knowledge of the existing processes and logic.
- A serverless SQL pool expert.
- An expert advisor, to optimize the POC tests.
- Resources that will be required for specific components of your POC project, but not necessarily required for the duration of the POC. These resources could include network admins, Azure admins, Active Directory admins, Azure portal admins, and others.
- Ensure all the required Azure services resources are provisioned and the required level of access is granted, including access to storage accounts.
- Ensure you have an account that has required data access permissions to retrieve data from all data sources in the POC scope.

> [!TIP]
> We recommend engaging an expert advisor to assist with your POC. [Microsoft's partner community](https://appsource.microsoft.com/marketplace/partner-dir) has global availability of expert consultants who can help you assess, evaluate, or implement Azure Synapse.

### Set the timeline

Review your POC planning details and business needs to identify a time frame for your POC. Make realistic estimates of the time that will be required to complete the POC goals. The time to complete your POC will be influenced by the size of your POC dataset, the number and complexity of tests, and the number of interfaces to test. If you estimate that your POC will run longer than four weeks, consider reducing the POC scope to focus on the highest priority goals. Be sure to obtain approval and commitment from all the lead resources and sponsors before continuing.

## Put the POC into practice

We recommend you execute your POC project with the discipline and rigor of any production project. Run the project according to plan and manage a change request process to prevent uncontrolled growth of the POC's scope.

Here are some examples of high-level tasks:

1. [Create a Synapse workspace](../quickstart-create-workspace.md), storage accounts, and the Azure resources identified in the POC plan.
1. Set up [networking and security](security-white-paper-introduction.md) according to your requirements.
1. Grant appropriate access to POC team members. See [this article](../sql/develop-storage-files-storage-access-control.md) about permissions for accessing files directly from Azure Storage.
1. Load the POC dataset.
1. Implement and configure the tests and/or migrate existing code to serverless SQL pool scripts and views.
1. Execute the tests:
    - Many tests can be executed in parallel.
    - Record your results in a consumable and readily understandable format.
1. Monitor for troubleshooting and performance.
1. Evaluate your results and present findings.
1. Work with technical stakeholders and the business to plan for the next stage of the project. The next stage could be a follow-up POC or a production implementation.

## Interpret the POC results

When you complete all the POC tests, you evaluate the results. Begin by evaluating whether the POC goals were met and the desired outputs were collected. Determine whether more testing is necessary or any questions need addressing.

## Next steps

> [!div class="nextstepaction"]
> [Data lake exploration with dedicated SQL pool in Azure Synapse Analytics](proof-of-concept-playbook-dedicated-sql-pool.md)

> [!div class="nextstepaction"]
> [Big data analytics with Apache Spark pool in Azure Synapse Analytics](proof-of-concept-playbook-spark-pool.md)

> [!div class="nextstepaction"]
> [Build data analytics solutions using Azure Synapse serverless SQL pools](/training/paths/build-data-analytics-solutions-using-azure-synapse-serverless-sql-pools/)

> [!div class="nextstepaction"]
> [Azure Synapse Analytics frequently asked questions](../overview-faq.yml)
