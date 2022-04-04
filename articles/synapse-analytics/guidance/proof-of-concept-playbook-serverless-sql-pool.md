---
title: Data lake exploration with serverless SQL pool
description: TODO
author: peter-myers
ms.author: v-petermyers
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 04/30/2022
---

# Data lake exploration with serverless SQL pool

## Prepare for your proof of concept

A proof of concept (PoC) project can help you make an informed business decision about implementing a big data and advanced analytics environment on a cloud-based platform, leveraging the serverless SQL pool functionality in Azure Synapse.

If you need to explore data in the data lake, gain insights from it or optimize your existing data transformation pipeline, you can benefit from using the serverless SQL pool resource. It is suitable for the following scenarios:

- **Basic discovery and exploration** - Quickly reason about the data in various formats (Parquet, CSV, JSON) in your data lake, so you can plan how to extract insights from it.
- **Logical data warehouse** – Provide a relational abstraction on top of raw or disparate data without relocating and transforming data, allowing always up-to-date view of your data.
- **Data transformation(()) - Simple, scalable, and performant way to transform data in the lake using T-SQL, so it can be fed to BI and other tools, or loaded into a relational data store (dedicated SQL pools in Azure Synapse, Azure SQL Database, etc.).

Different professional roles can benefit from serverless SQL pool:

- **Data Engineers** can explore the lake, transform and prepare data using this service, and simplify their data transformation pipelines.
- **Data Scientists** can quickly reason about the contents and structure of the data in the lake, thanks to features such as OPENROWSET and automatic schema inference.
- **Data Analysts** can explore data and Spark external tables created by Data Scientists or Data Engineers using familiar T-SQL language or their favorite tools, which can connect to serverless SQL pool.
- **BI Professionals** can quickly create Power BI reports on top of data in the lake and Spark tables.

In support of your business scenarios a serverless SQL pool POC project will identify your key goals and business drivers that a serverless SQL Pool is aligned to support and will test key features and gather metrics to support your implementation decisions.

A proof of concept is a quickly executed project that focuses on key questions and is not designed to be deployed to a production environment but is designed to execute quick tests and then be discarded.

Before you begin planning your serverless SQL Pool POC project do the following:

- Identify any restrictions or guidelines your organization has about moving data to the cloud.
- Identify executive/business sponsorship for a big data and advance analytics platform project and secure support from them for migration to cloud.
- Identify availability of technical SME and business users to support you and provide details during POC execution.

By now you should have determined that there are no immediate blockers, and you can start preparing for your POC. If you are new to Azure Synapse Analytics serverless SQL pool you can refer to the [serverless SQL pool documentation](../sql/on-demand-workspace-overview.md) where you can get an overview of the features and benefits.

If you are new to serverless SQL Pools in Azure Synapse you should compete the following learning materials:

[Build data analytics solutions using Azure Synapse serverless SQL pools](https://docs.microsoft.com/learn/paths/build-data-analytics-solutions-using-azure-synapse-serverless-sql-pools/)

## Set the goals for your POC

A successful POC project requires planning. Identify why you are doing a POC, the real motivations for the POC (like modernization, cost saving, performance improvement, integrated experience etc.) Write down clear goals for your POC and what criteria will define the success of the POC. What do you want as the outputs of your POC and what will you do with those outputs? Who will utilize the outputs? What will define a successful PoC?

Keep in mind that a POC should be a short and focused effort to quickly prove or test a limited set of concepts and capabilities – which is representative of the overall workload. If you have a long list of items to proof, you may want more than one POC with gates between them where you determine if you need the next POC. Given the different professional roles that can make use of a serverless SQL pool and the various scenarios where serverless SQL pool can be used, you may choose to plan and execute multiple POCs including serverless SQL pool; one focused on Data Scientist’s scenarios such as discovery and exploration of data in various formats, another focused on Data Engineering needs such as data transformation and another that explores creation of a Logical Data Warehouse.

As you consider your POC keep some of the following questions in mind to help you shape your goals:

- Are you migrating from an existing big data and advanced analytics platform (whether on- premises or cloud)?
- Are you migrating and want to make as few changes to existing ingestion and data processing as possible?
- Are you migrating but want to do some extensive improvements along the way?
- Are you building entirely new big data and advanced analytics platform (greenfield opportunity)?
- What are your current pain points, if any – like scalability, performance, flexibility etc.?
- What new business needs are you being asked to support?
- What are the SLAs you will be required to meet?
- What will be the workloads – Data Exploration over various data formats, Basic exploration, a logical data warehouse, Data prep and/or transformation, T-SQL interactive analysis, TSQL query of Spark Tables, reporting queries over the data lake?
- What are the skills of the users who will own the project after the POC becomes real?

Some examples of POC goal setting:

- Why are we doing a POC?
    - We need to know if all of the raw file formats we will be receiving can be explored using serverless SQL pool
    - We need to know if our Data Engineers can quickly evaluate new data feeds
    - We need to know if the performance of querying data from the data lake using serverless SQL pool will need our data exploration needs
    - We need to know if serverless SQL pool is a good choice for some of our visualizations and reports
    - We need to know if serverless SQL pool is a good choice for some of our data ingestion and processing needs
    - Will more move to Azure Synapse meet our cost goals
- At the conclusion of this PoC:
    - We will have the data to identify the data transformations that are well suited to serverless SQL Pool
    - We will have the data to identify where serverless can be best used during data visualization
    - We will have the data to know the ease with which our Data Engineers and Data Scientists will be able to adopt the new platform
    - We will have gained insight to better estimate the effort required to complete the implementation project for complete migration project
    - We will have a list of items that may need more testing

Our POC will be successful if we have the data needed and have completed the testing identified to determine how serverless SQL pool in Azure Synapse will support our cloud-based big data and advance analytics platform. We will have determined if we can move to the next phase or if additional POC testing is needed to finalize our decision. We will be able to make a sound business decision backed up by the datapoints.

## Plan your POC project

Using your goals, identify specific tests to execute to support those goals and to provide the outputs you identified, it is important to make sure that you have at least one test to support each goal and expected output. Identify specific data exploration and analysis tasks, specific transformations, specific existing processing you wish to test during your so that a very specific dataset and codebase can be identified.

Example of the needed level of specificity in planning:

- (Goal) We need to know if the Data Engineering Team can execute the equivalent processing from the existing ETL process “Daily Batch Raw File Validation” within the required SLA.
- (Output) We will have the data to determine if serverless TSQL can be used to execute the “Daily Batch Raw File Validation” requirements of our existing processing and meet its SLA.
    - (Test) Validation queries A, B and C are identified by data engineering team and represents overall data processing needs. Compare the performance of these queries with the benchmark obtained from the existing system.

## Evaluate your POC dataset

From the specific tests that you have identified, you can now identify the dataset required to support these tests. Take some time to review this dataset. You now need to verify that the dataset will adequately represent your future processing in content, complexity, and scale. Do not use a dataset that is too small - you will not see representative performance. Do not use a dataset that is too big - the POC is not the time to complete the full data migration. Also obtain the appropriate benchmarks from existing systems, which you will use for performance comparisons.

Make sure you have checked with business owners for any blockers for moving this data to the cloud. Identify any security or privacy concerns or any data obfuscation needs to be done before moving data to the cloud.

## Create high-level architecture for your POC

Based upon the high-level architecture of your proposed future state architecture, identify the components that will be a part of your POC. Your high-level future state architecture likely contains many data sources, numerous data consumers, big data components and possibly Machine Learning and AI data consumers. Create an architecture for your POC that specifically identifies the components that will be part of the POC and clearly identifies which components will not be part of the POC testing.

If you are already using Azure, identify any resources you already have in place (Azure Active Directory, ExpressRoute, etc.) that can be used during the POC. Also identify what Azure Regions your organization uses. Now is a great time to identify the throughput of your ExpressRoute connection and check with other business users that your POC can consume some of that throughput without adverse effect on production solutions.

## Identify POC resources

Specifically identify the technical resources and time commitments that will be required to support your POC.

- A business representative to oversee requirements and results
- An application data expert, to source the data for the POC and provide knowledge of the existing process/logic
- An Azure Synapse serverless SQL pool expert
- An expert advisor, to optimize the POC tests
- Resources that will be required for specific components of your POC project, but not necessarily required for the duration of the POC. These resources could include network admin resources, Azure Admin Resources, Active Directory Admins, Azure Portal Admins, etc
- Ensure all the required Azure services resources have been provisioned and the required level of access has been provided to these services, including access to storage accounts
- Ensure you have an account which has required data access permission to pull data from all the data sources in the scope of the POC

Since you are evaluating a new platform, we recommend engaging an expert advisor to assist with your POC. Microsoft’s partner community has global availability of expert consultants, able to demonstrate the features and performance of Azure Synapse. You can find local partners at [Solution Providers Home](https://www.microsoft.com/solution-providers/home).

## Set POC timeline

Review the details of your POC planning and business needs to identify a time constraint for your POC. Make realistic estimates of the time that will be required to complete the tasks in your plan. The time to complete your POC will be influenced by the size of your POC dataset, the number of tests, complexity, and the number of interfaces you are testing, etc. If you find your POC is estimated to run longer than 4 weeks, consider reducing the POC scope to keep focus on the highest priority goals. Get buy-in from all the lead resources and sponsors for the timeline before continuing.

## Run your POC project

Execute your POC project with the discipline and rigor of any production project. Execute according to the plan and have a change request process in place to prevent your POC from growing and getting out of control.

Examples of high-level tasks:

- Provision Synapse workspace, Storage Accounts, and all Azure resources identified in the POC plan
- Configure Networking and security according to your requirements
- Provide the required access to environment to POC team members
- Load POC dataset
- Implement and configure identified tests and/or migrate existing code to serverless SQL pool scripts and views
- Execute tests
    - Many tests can be executed in parallel
    - Record your results in a consumable and readily understandable format
- Monitor for troubleshooting and performance
- Evaluate Results and Present findings
- Plan Next Steps

## Evaluate and present results

When all the POC tests are completed you can evaluate the results. Begin by evaluating if the POC goals have been met and the desired outputs collected. Note where additional testing is warranted or where additional questions were raised.

## Next steps

Work with technical stakeholders and business to plan for the next phase of the project whether it is going to be a follow up POC or production implementation.

References:

- [Serverless SQL Pool in Azure Synapse Analytics](../sql/on-demand-workspace-overview.md)
- [Build data analytics solutions using Azure Synapse serverless SQL pools](https://docs.microsoft.com/learn/paths/build-data-analytics-solutions-using-azure-synapse-serverless-sql-pools/)
- [Solution Providers Home](https://www.microsoft.com/solution-providers/home)
