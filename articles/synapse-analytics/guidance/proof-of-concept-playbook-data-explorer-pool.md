---
title: "Synapse POC playbook: Big data analytics with Data Explorer pool in Azure Synapse Analytics"
description: "A high-level methodology for preparing and running an effective Azure Synapse Analytics proof of concept (POC) project for Data Explorer pool."
author: shsagir
ms.author: shsagir
ms.reviewer: devsha
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 09/28/2022
---

# Synapse POC playbook: Big data analytics with Data Explorer pool in Azure Synapse Analytics

This article presents a high-level methodology for preparing and running an effective Azure Synapse Analytics proof of concept (POC) project for Data Explorer pool.

[!INCLUDE [proof-of-concept-playbook-context](includes/proof-of-concept-playbook-context.md)]

## Before you begin

The playbook helps you to evaluate the use of Data Explorer for Azure Synapse and is designed for scenarios that are most suitable for Data Explore pools. Use the following scenarios to determine if a Data Explorer pool is the right solution for you before you start your POC.

### General architecture patterns scenarios

- Any data that fits one or more of the following characteristics should be a good candidate for a Data Explorer pool:
    - High volume and speed
    - Append only and immutable data
    - Data Quiescence: Data that doesn't change. For example, an order placed in an online store is a good example of quiesced data.
- [Command Query Responsibility Segregation (CQRS) pattern](/azure/architecture/patterns/cqrs) is suited to the Data Explorer pool's append only architecture.
- [Event sourcing pattern](/azure/architecture/patterns/event-sourcing)

### Other scenarios

The following scenarios are also good candidates for a Data Explorer pool:

- Low latency data store for real-time telemetry-based alerts
- [IoT telemetry data storage and analytics](/azure/architecture/solution-ideas/articles/iot-azure-data-explorer)
- [High speed interactive analytics layer](/azure/architecture/solution-ideas/articles/interactive-azure-data-explorer). Particularly when used with Apache Spark engines such as Synapse Spark, DataBricks, or traditional data warehouses such as Synapse SQL pools.
- [Log and observability analytics](/azure/architecture/solution-ideas/articles/monitor-azure-data-explorer)

## Prepare for the POC

A POC project can help you make an informed business decision about implementing a big data and advanced analytics environment on a cloud-based platform that uses Azure Data a pool in Azure Synapse.

A POC project will identify your key goals and business drivers that cloud-based big data and advanced analytics platform must support. It will test key metrics and prove key behaviors that are critical to the success of your data engineering, machine learning model building, and training requirements. A POC isn't designed to be deployed to a production environment. Rather, it's a short-term project that focuses on key questions, and its result can be discarded.

Before you begin planning your Data Explorer POC project:

> [!div class="checklist"]
>
> - Identify any restrictions or guidelines your organization has about moving data to the cloud.
> - Identify executive or business sponsors for a big data and advanced analytics platform project. Secure their support for migration to the cloud.
> - Identify availability of technical experts and business users to support you during the POC execution.

Before you start preparing for the POC project, we recommend you first read the [Azure Data Explorer documentation](/azure/data-explorer?context=/azure/synapse-analytics/context/context).

By now you should have determined that there are no immediate blockers and then you can start preparing for your POC. If you are new to Data Explorer, you can refer to [this documentation](../data-explorer/data-explorer-overview.md) where you can get an overview of the Data Explorer architecture.

Develop an understanding of these key concepts:

- Data Explorer and its architecture.
- Support data formats and data sources.
- Databases, tables, materialized views, functions as Data Explorer artifacts.
- Supported ingestion methods for ingestion wizard and continuous ingestion.
- Authentication and authorization in Data Explorer.
- Native connectors that integrate with visualization solutions such as Power BI, Grafana, Kibana, and more.
- Creating external tables to read data from Azure SQL/SQL Server, Azure Cosmos DB, Azure Monitor, Azure Digital Twin.

Data Explorer decouples compute resources from storage so that you can better manage your data processing needs and control costs. You only pay for compute when it's in use. When it's not in use, you only pay for storage. You can [scale up and down](../data-explorer/data-explorer-overview.md#data-explorer-pool-architecture) (vertical), as well as scale in and out (horizontal). You can also manually stop, or autostop, your workspace without losing your data. For example, you can scale up your workspace  for heavy data processing needs or large loads, and then scale it back down during less intense processing times, or shut it down completely. Similarly, you can effectively scale and stop a workspace during the weekends to reduce costs.

### Set the goals

A successful POC project requires planning. Start by identify why you're doing a POC to fully understand the real motivations. Motivations could include modernization, cost saving, performance improvement, or integrated experience. Be sure to document clear goals for your POC and the criteria that will define its success. Ask yourself:

> [!div class="checklist"]
>
> - What do you want as the outputs of your POC?
> - What will you do with those outputs?
> - Who will use the outputs?
> - What will define a successful POC?

Keep in mind that a POC should be a short and focused effort to quickly prove a limited set of concepts and capabilities. These concepts and capabilities should be representative of the overall workload. If you have a long list of items to prove, you may want to plan more than one POC. In that case, define gates between the POCs to determine whether you need to continue with the next one. For example, one POC could focus on requirements for the data engineering role, such as ingestion and processing. Another POC could focus on machine learning (ML) model development.

As you consider your POC goals, ask yourself the following questions to help you shape the goals:

> [!div class="checklist"]
>
> - Are you migrating from an existing big data and advanced analytics platform (on-premises or cloud)?
> - Are you migrating and want to do some extensive improvements along the way? For example, migrating from Elastic Search to Data Explorer for log analysis, migrating from InfluxDB or Timescale DB to Data Explorer.
> - Are you building an entirely new big data and advanced analytics platform (greenfield project)?
> - What are your current pain points? For example, scalability, performance, or flexibility.
> - What new business requirements do you need to support?
> - What are the SLAs that you're required to meet?
> - What will the workloads be? For example, ETL, batch processing, stream processing, machine learning model training, analytics, reporting queries, or interactive queries?
> - What are the skills of the users who will own the project (should the POC be implemented)? For example, SQL, Python, PowerBI, or other skills.

Here are some examples of POC goal setting:

- Why are we doing a POC?
    - We need to know that the data ingestion and processing performance for our big data workload will meet our new SLAs.
    - We need to know whether near real-time stream processing is possible and how much throughput it can support. (Will it support our business requirements?)
    - We need to know if our existing data ingestion and transformation processes are a good fit and where improvements will need to be made.
    - We need to know if we can shorten our data integration run times and by how much.
    - We need to know if our data scientists can build and train machine learning models and use AI/ML libraries as needed in Data Explorer.
    - Will the move to cloud-based Data Explorer meet our cost goals?
- At the conclusion of this POC:
    - We'll have the data to determine if our data processing performance requirements can be met for both batch and real-time streaming.
    - We'll have tested ingestion and processing of all our different data types (structured, semi-structured, and unstructured) that support our use cases.
    - We'll have tested some of our existing data processing needs and can identify the work that can be completed with update policies in Data Explorer.
    - We'll have tested data ingestion and processing and will have the data points to estimate the effort required for the initial migration and load of historical data.
    - We'll have tested data ingestion and processing and can determine if our ETL/ELT processing requirements can be met.
    - We'll have gained insight to better estimate the effort required to complete the implementation project.
    - We'll have tested scale and scaling options and will have the data points to better configure our platform for better price-performance settings.
    - We'll have a list of items that may need more testing.

### Plan the project

Use your goals to identify specific tests and to provide the outputs you identified. It's important to make sure that you have at least one test to support each goal and expected output. Also, identify specific data ingestion, batch or stream processing, and all other processes that will be executed so you can identify a specific dataset and codebase. This specific dataset and codebase will define the scope of the POC.

Here are the typical subject areas that are evaluated with Data Explorer:

- **Data Ingestion and processing**: Data sources, data formats, ingestion methods, connectors, tools, ingestion policies, streaming vs batch ingestion
- **Data Storage**: schema, storage artifacts such as tables and materialized views
- **Policies**: Such as partitioning, update, merge
- **Querying and visualization**
- **Performance**: Such as query response times, ingestion latencies, weak consistency, query cache results
- **Cost**: Total Cost of Ownership (TCO)
- **Security**: Such as authentication, authorization, data access, row level security

> [!NOTE]
> Use the following frequently asked questions to help you plan your POC.
>
> - **How do I choose the caching period when creating my Data Explorer pool?**  
>     To provide best query performance, ingested data is cached on the local SSD disk. This level of performance is not always required and less frequently queried data can often be stored on cheaper blob storage. Queries on data in blob storage run slower, but this acceptable in many scenarios. Knowing this can help you identify the number of compute nodes you need to hold your data in local SSD and continue to meet your query performance requirements. For example, if you want to query *x* days worth of data (based on ingestion age) more frequently and retain data for *y* days and query it less frequently, in your cache retention policy, specify *x* as the value for hot cache retention and *y* as the value for the total retention. For more information, see [Cache policy](/azure/data-explorer/kusto/management/cachepolicy?context=/azure/synapse-analytics/context/context).
> - **How do I choose the retention period when creating my Data Explorer pool?**  
>     The retention period is a combination of hot and cold cache data that is available for querying. You choose data retention based on how long you need to retain the data based on compliance or other regulatory requirements. You can use the hot window capability, to warm data stored in the cold cache, for faster queries for any auditing purpose. For more information, see [Query cold data with hot windows](/azure/data-explorer/hot-windows?context=/azure/synapse-analytics/context/context).

Here's an example of the needed level of specificity in planning:

- **Goal A**: We need to know whether our requirement for data ingestion and processing of batch data can be met under our defined SLA.
- **Output A**: We'll have the data to determine whether our batch data ingestion and processing can meet the data processing requirement and SLA.
    - **Test A1**: Processing queries A, B, and C are identified as good performance tests as they're commonly executed by the data engineering team. Also, they represent overall data processing needs.
    - **Test A2**: Processing queries X, Y, and Z are identified as good performance tests as they contain near real-time stream processing requirements. Also, they represent overall event-based stream processing needs.
    - **Test A3**: Compare the performance of these queries at different scale of our workspace (number of instances) with the benchmark obtained from the existing system.
- **Goal B**: We need to know if our business users can build their dashboards on this platform.
- **Output B**: We'll have tested some of our existing dashboards and visuals on data in our workspace, using different visualization options, connectors and Kusto queries. These tests will help to determine which dashboards can be migrated to the new environment.
    - **Test B1**: Specific visuals will be created with Data Explorer data and will be tested.
    - **Test B2**: Test out of the box KQL functions and operators to meet the requirement.
- **Goal C**: We'll have tested data ingestion and will have the data points to:
    - Estimate the effort for our initial historical data migration to our Data Explorer pool.
    - Plan an approach to migrate historical data.
- **Output C**: We'll have tested and determined the data ingestion rate achievable in our environment and can determine whether our data ingestion rate is sufficient to migrate historical data during the available time window.
    - **Test C1**: Test different approaches of historical data migration. For more information, see [Comparing ingestion methods and tools](../data-explorer/ingest-data/data-explorer-ingest-data-overview.md#ingestion-methods-and-tools).
    - **Test C2**: Test data transfer from the data source to our workspace by using either LightIngest, Continuous ingestion from blob storage or data lake store. For more information, see [Use wizard for one-time ingestion of historical data with LightIngest](/azure/data-explorer/generate-lightingest-command?context=/azure/synapse-analytics/context/context).
- **Goal D**: We'll have tested the data ingestion rate of incremental data loading and will have the data points to estimate the data ingestion and processing time window.
- **Output D**: We'll have tested the data ingestion rate and can determine whether our data ingestion and processing requirements can be met with the identified approach.
    - **Test D1**: Test daily, hourly, and near-real time data ingestion and processing.
    - **Test D2**: Execute the continuous (batch or streaming) data ingestion and processing while running end-user queries.

Be sure to refine your tests by adding multiple testing scenarios.

Here are some testing scenarios:

- **Data Explorer test A**: We'll execute data ingestion, processing, and querying across multiple workspace sizes and different numbers of pool instances.
- **Data Explorer test B**: We'll query processed data from our workspace using dashboards and querying tools such as the Data Explorer KQL script.

The following is a high level example of tasks that you can use to help you plan your POC:

| Sprint | Task |
|--|--|
| 0 | Develop an understanding of Data Explorer using online resources or with the help of Microsoft account team |
| 0 | Define business scenarios that you want to achieve with Data Explorer |
| 0 | Define technical requirements in terms of data sources, ingestion methods, data retention, data caching, SLAs, security, networking, IAM |
| 0 | Define key performance measures, such as query performance expectation, latency, concurrent requests, ingestion throughput, data freshness |
| 0 | Define high level architecture with Data Explorer and its data ingesters and consumers |
| 0 | Define POC Scope |
| 0 | Define POC planning and timelines |
| 0 | Define, prioritize and weigh POC evaluation criteria |
| 1 | Define and prioritize queries to be tested |
| 1 | Define data access rules for each group of users |
| 1 | Estimate one-time (historical) data ingestion volume and daily data ingestion volume |
| 1 | Define data retention, caching, and purge strategy |
| 1 | Define configuration elements needed when creating workspaces, such as streaming, Python/R plugins, purge |
| 1 | Review source data format, structure, schema |
| 1 | Review, refine, revise evaluation criteria |
| 2 | Create workspace, Data Explorer pool, and the required databases, tables, and materialized views per the architecture design |
| 2 | Assign permissions to the relevant users for data plane access |
| 2 | Implement partitioning and merge policies (if required) |
| 2 | Implement one-time ingestion of data, typically historical or migration data |
| 2 | Install and configure query tool (if required) |
| 2 | Test queries on the ingested data using Data Explorer web UI |
| 2 | Test update and delete scenarios |
| 2 | Test connection to your chosen visualization and querying tools (such as Power BI, Grafana, etc.) |
| 2 | Configure data access management rules |
| 2 | Implement continuous ingestion |
| 2 | Create data connections with Event Hubs/Iot Hub/Event Grid |
| 3 | Implement autorefreshing dashboard for near real-time monitoring in Azure Data Explorer Dashboards or Grafana |
| 3 | Define how to perform load testing |
| 3 | Optimize ingestion methods and processes based on learnings from previous sprints and completed backlog items |
| 3 | Performance assessment on Grafana or your chosen dashboarding tool |
| 3 | Perform load testing in line with concurrency and expected load requirements |
| 3 | Validate success criteria |
| 3 | Review scoring |
| 3 | Test ability to ingest data with different formats |
| 3 | Validate POC result |

### Evaluate the POC dataset

Using the specific tests you identified, select a dataset to support the tests. Take time to review this dataset. You should verify that the dataset will adequately represent your future processing in terms of content, complexity, and scale. Don't use a dataset that's too small (less than 1 GB) because it won't deliver representative performance. Conversely, don't use a dataset that's too large because the POC shouldn't become a full data migration. Be sure to obtain the appropriate benchmarks from existing systems so you can use them for performance comparisons. Check if your dataset aligns with the supported data formats. Then, depending on the ingestion method (batch or streaming), your dataset can be ingested in batches of appropriate sizes.

> [!IMPORTANT]
> Make sure you check with business owners for any blockers before moving any data to the cloud. Identify any security or privacy concerns or any data obfuscation needs that should be done before moving data to the cloud.

### Create a high-level architecture

Based upon the high-level architecture of your proposed future state architecture, identify the components that will form part of your POC. Your high-level future state architecture likely contains many data sources, numerous data consumers, big data components, and possibly machine learning and artificial intelligence (AI) data consumers. Your POC architecture should specifically identify components that will be part of the POC. Importantly, it should identify any components that won't form part of the POC testing.

If you're already using Azure, identify any resources you already have in place (Microsoft Entra ID, ExpressRoute, and others) that you can use during the POC. Also identify the Azure regions your organization uses. Now is a great time to identify the throughput of your ExpressRoute connection and to check with other business users that your POC can consume some of that throughput without adverse impact on production systems.

For more information, see [Big data architectures](/azure/architecture/data-guide/big-data/).

### Identify POC resources

Specifically identify the technical resources and time commitments required to support your POC. Your POC will need:

- A business representative to oversee requirements and results.
- An application data expert, to source the data for the POC and provide knowledge of the existing processes and logic.
- A Data Explorer expert. You can request your Microsoft contacts to arrange, if necessary.
- An expert advisor, to optimize the POC tests. You can request your Microsoft contacts to arrange, if necessary.
- Resources that will be required for specific components of your POC project, but not necessarily required during the POC. These resources could include network admins, Azure admins, Active Directory admins, Azure portal admins, and others.
- Ensure all the required Azure services resources are provisioned and the required level of access is granted, including access to storage accounts.
- Ensure you have an account that has required data access permissions to retrieve data from all data sources in the POC scope.

> [!TIP]
> We recommend engaging an expert advisor to assist with your POC. Contact your Microsoft account team or reach out to the global availability of expert consultants who can help you assess, evaluate, or implement a Data Explorer pool. You can also post questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-data-explorer) with Data Explorer tag.

### Set the timeline

Review your POC planning details and business needs to identify a time frame for your POC. Make realistic estimates of the time that will be required to complete the POC goals. The time to complete your POC will be influenced by the size of your POC dataset, the number and complexity of tests, and the number of interfaces to test. If you estimate that your POC will run longer than four weeks, consider reducing the POC scope to focus on the highest priority goals. Be sure to obtain approval and commitment from all the lead resources and sponsors before continuing.

## Put the POC into practice

We recommend you execute your POC project with the discipline and rigor of any production project. Run the project according to plan and manage a change request process to prevent uncontrolled growth of the POC's scope.

Here are some examples of high-level tasks:

1. Create a Data Explorer pool, and all Azure resources identified in the POC plan.
1. Load POC dataset:
    - Make data available in Azure by extracting from the source or by creating sample data in Azure. For an initial test on ingesting data in your Data Explorer pool, use the [ingestion wizard](../data-explorer/ingest-data/data-explorer-ingest-data-one-click.md).
    - Test the connector/integration methods you've planned to use to ingest data into your workspace.
1. Write Kusto Queries to query data:
1. Execute the tests:
    - Many tests can be executed in parallel on your workspaces using different client interfaces such as dashboards, PowerBIm and a Data Explorer KQL script.
    - Record your results in a consumable and readily understandable format.
1. Optimize the queries and workspace:
    - Whether you're writing new KQL queries or converting existing queries from other languages, we recommend checking that your queries follow [Query best practices](/azure/data-explorer/kusto/query/best-practices?context=/azure/synapse-analytics/context/context).
    - Depending on the test results, you may need to fine-tune your workspace with a caching policy, partitioning policy, workspace sizing, or other optimizations. For recommendations, see [Optimize for high concurrency](/azure/data-explorer/high-concurrency?context=/azure/synapse-analytics/context/context).
1. Monitor for troubleshooting and performance:
    - For more information, see [Monitor Data Explorer performance, health, and usage with metrics](../data-explorer/data-explorer-monitor-pools.md).
    - For technical issues, please [create a support ticket](https://portal.azure.com/#create/Microsoft.Support).
1. Estimating the pricing:
    - At the end of the POC, you should use what you learned in the POC to [estimate the cost](https://azure.microsoft.com/pricing/calculator/?service=synapse-analytics) of a workspace that meets your requirements.
1. Close the POC:
    - Record the results, lessons learned and the outcome of the POC phase including the benchmarks, configuration, optimization that you applied during the POC.
    - Clean up any Azure resources that you created during the POC that you no longer need.

    > [!TIP]
    > If you have decided to proceed with Data Explorer in Azure Synapse and intend on [migrating it to a production environment](#migrating-from-poc-to-production), we recommend keeping the POC workspace running. This will help you set up your production workspace ensuring that you don't lose the configurations and optimizations that you may have applied during the POC.

## Interpret the POC results

When you complete all the POC tests, you evaluate the results. Begin by evaluating whether the POC goals were met and the desired outputs were collected. Determine whether more testing is necessary or any questions need addressing.

## Migrating from POC to production

If you've decided to proceed with your Data Explorer pool in Azure Synapse and intend to migrate your POC pool to production, we strongly recommend that you keep the Data Explorer pool in the POC workspace running, and use it to set up your production workspace. This will help you ensure that you don't lose the configurations and optimizations that you may have applied during the POC.

Before you migrate your Data Explorer pool in the POC workspace to production, we highly recommend that you consider, design, and decide on the following factors:

- Functional and non-functional requirements
- Disaster Recovery and High Availability requirements
- Security requirements
- Networking requirements
- Continuous Integration/Continuous Deployment requirements
- Monitoring and Support requirements
- Training of key personnel in Data Explorer
- Control and data plane access control requirements
- Schema, data model and data flow requirements
- Ingestion requirements
- Visualization requirements
- Data and insights consumption requirements
- Testing requirements

## Next steps

> [!div class="nextstepaction"]
> [Common questions about Data Explorer ingestion](/azure/data-explorer/kusto/management/ingestion-faq?context=/azure/synapse-analytics/context/context)

> [!div class="nextstepaction"]
> [Best practices for schema management](/azure/data-explorer/kusto/management/management-best-practices?context=/azure/synapse-analytics/context/context)
