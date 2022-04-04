---
title: Big data analytics with Apache Spark pool
description: TODO
author: peter-myers
ms.author: v-petermyers
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 04/30/2022
---

# Big data analytics with Apache Spark pool

## Prepare for your proof of concept

A proof of concept (PoC) project can help you make an informed business decision about migrating your on-premises big data and advanced analytics platform to a cloud-based big data and advanced analytics service, leveraging Azure Synapse Analytics for Apache Spark workloads.

A Spark POC project will identify your key goals and business drivers that cloud-based big data and advance analytics platform must support and will test key metrics and prove key behaviors that are critical to the success of your data engineering, machine learning model building and training etc. needs. A proof of concept is a quickly executed project that focuses on key questions and is not designed to be deployed to a production environment but is designed to execute quick tests and then be discarded.

Before you begin planning your Spark POC project do the following:

- Identify any restrictions or guidelines your organization has about moving data to the cloud.
- Identify executive/business sponsorship for a big data and advance analytics platform project and secure support from them for migration to cloud.
- Identify availability of technical SMEs or business users to support you and provide details during POC execution.

By now you should have determined that there are no immediate blockers and then you can start preparing for your Spark POC. If you are new to Apache Spark Pools in Azure Synapse Analytics you can refer to [this documentation](../spark/apache-spark-overview.md) where you can get an overview of the Spark architecture and learn how it works in Azure Synapse.

Develop an understanding of these key concepts:

- Apache Spark and its distributed architecture
- Concepts of RDD and partitions (in-memory and physical) in Spark
- Azure Synapse workspace, different compute engines, pipeline, and monitoring
- Separation of compute and storage in Spark pool
- Authentication and Authorization in Azure Synapse
- Native connectors to integrate with dedicated SQL pool in Azure Synapse, Azure Cosmos DB etc.

Azure Synapse decouples compute resources from storage so that you can better manage your data processing needs and control costs. With the serverless architecture of Spark pool, you can spin up and down as well as grow and shrink your Spark cluster independent of your storage. You can pause (or setup auto-pause) a Spark cluster entirely so that you pay for compute only when in use and when not in use you only pay for the storage. You can scale up your Spark cluster for heady data processing needs or large loads and then scale it down during less intense processing times or shut it down completely when not needed. Scaling and pausing can be used effectively to reduce costs. Your Spark POC tests should include data ingestion and data processing at different scales (small, medium, and large) to compare price and performance at a variety of scale. Read about how to [automatically scale Azure Synapse Analytics Apache Spark pools](../spark/apache-spark-autoscale.md) to learn more.

Understanding the difference between different sets of Spark APIs will help to decide what works best for your scenario and you can choose one over other for better performance or ease of use or to take advantage of your teams already existing skill sets. Please read [A Tale of Three Apache Spark APIs: RDDs vs DataFrames and Datasets](https://databricks.com/blog/2016/07/14/a-tale-of-three-apache-spark-apis-rdds-dataframes-and-datasets.html).

Data and file partitioning work slightly differently in Spark and understanding the differences will help to optimize the performance. Read [Partition Discovery](https://spark.apache.org/docs/latest/sql-data-sources-parquet.html#partition-discovery) and [Partition Configuration Options](https://spark.apache.org/docs/latest/sql-performance-tuning.html#other-configuration-options) to learn more.

## Set the goals for your POC

A successful POC project requires planning. Identify why you are doing a POC, the real motivations for the POC (like modernization, cost saving, performance improvement, integrated experience, etc.) Write down clear goals for your POC and what criteria will define the success of the POC. What do you want as the outputs of your POC and what will you do with those outputs? Who will utilize the outputs? What will define a successful PoC?

Keep in mind that a POC should be a short and focused effort to quickly prove or test a limited set of concepts and capabilities – which is representative of the overall workload. If you have a long list of items to proof, you may want more than one POC with gates between them where you determine if you need the next POC. For Spark POC example, you might have two POCs, first one focused on data engineering (ingestion and processing) while the second one focused on machine learning model development.

As you consider your POC keep some of the following questions in mind to help you shape your goals:

- Are you migrating from an existing big data and advance analytics platform (whether on- premises or cloud)?
- Are you migrating and want to make as few changes to existing ingestion and data processing as possible, for example if it is Spark to Spark migration or if it is Hadoop/Hive to Spark migration?
- Are you migrating but want to do some extensive improvements along the way, for example re-writing MapReduce jobs to Spark jobs, or converting legacy RDD based code to Dataframe/Dataset based code etc.?
- Are you building an entirely new big data and advanced analytics platform (greenfield opportunity)?
- What are your current pain points, if any – like scalability, performance, flexibility etc.?
- What new business needs are you being asked to support?
- What are the SLAs you are required to meet?
- What will be the workloads - ETL, batch processing, stream processing, machine learning model training, analytics, reporting queries, interactive queries?
- What are the skills of the users who will own the project after the PoC becomes real (PySpark vs Scala skills, notebook vs IDE experience etc.)?

Some example POC goal setting:

- Why are we doing a POC?
    - We need to know that the data ingestion and processing performance for our big data workload will meet our new SLAs.
    - We need to know whether near real time stream processing is possible and how much throughput it can support. Will it support our business requirements?
    - We need to know if our existing data ingestion and transformation processes are a good fit and where improvements will need to be made.
    - We need to know if we can shorten our data integration run times and by how much.
    - We need to know if our data scientists can build and train machine learning models and leverage AI/ML libraries as needed in Spark pool and use pool, AML, or Azure SQL Kubernetes for deployment of trained models to do scoring.
    - Will the move to cloud-based Synapse meet our cost goals?
- At the conclusion of this PoC:
    - We will have the data to determine if our data processing (for both batch and real-time stream) performance requirements can be met.
    - We will have tested ingestion and processing of all our different data types (structured, semi and unstructured) that support our use cases.
    - We will have tested some of our existing complex data processing and can identify the work that will need to be completed to migrate our portfolio of data integration to the new environment.
    - We will have tested data ingestion and processing and will have the datapoints to estimate the effort required for the initial migration and load of historical data as well as estimate the effort required to migrate our data ingestion (ADF, Distcp, Databox etc.).
    - We will have tested data ingestion and processing and can determine if our ETL/ELT processing requirements can be met.
    - We will have gained insight to better estimate the effort required to complete the implementation project.
    - We will have tested scale and scaling options and will have the datapoints to better configure our platform for better price-performance settings.
    - We will have a list of items that may need more testing.

Our POC will be successful if we have the data needed and have completed the testing identified to determine if Azure Synapse Analytics will support our cloud-based big data and advance analytics platform. We will have determined if we can move to the next phase or if additional POC testing is needed to finalize our decision. We will be able to make a sound business decision backed up by the datapoints.

## Plan your POC project

Using your goals, identify specific tests to execute to support those goals and provide the outputs you identified as required to make data based decisions. It is important to make sure that you have at least one test to support each goal and expected output. Identify specific data ingestion, batch or stream processing, and all other processes that will be executed so that a very specific dataset and codebase can be identified. This specific dataset and codebase will define the scope of the POC.

Examples of the needed level of specificity in planning:

- (Goal) We need to know if our requirement for data ingestion and processing of batch of data can be met under our defined SLA.
- (Output) We will have the data to determine if our batch data ingestion and processing can meet the data processing requirement and SLA.
    - (Test) Processing queries A, B and C are identified as good performance tests as they are commonly executed by data engineering team and represents overall data
processing needs.
    - (Test) Processing Queries X, Y and Z are identified as good performance tests as they contain near real time stream processing requirement and represent overall event-based stream processing needs.
    - (Test) Compare the performance of these queries on different scale of the Spark cluster (varying number of worker nodes, size of the worker nodes like small, medium, and large, number and size of executors) with the benchmark obtained from the existing system. Keep the "law of diminishing return" in mind – adding more resources (either by scaling up or scaling out) can help to achieve parallelism however there is certain limit, unique to each scenario, to achieve the parallelism. Find out the sweet spot for each identified use case in your testing. You can consider referring to Appendix section which provides guidelines in identifying that sweet spot.
- (Goal) We need to know if our existing data scientists can build and train machine learning models on this platform
- (Output) We will have tested some of our machine learning models by training on data in Spark or SQL pool and leveraging different machine learning libraries. This will help to determine what machine learning models can be migrated to the new environment
    - (Test) These 2-3 machine learning models (….) will be tested as part of the POC
    - (Test) Test base machine learning libraries which comes with Spark (Spark MLLib) along with additional library which can be installed on Spark (like scikit) to meet
the requirement.
- (Goal) We will have tested data ingestion and will have the datapoints to 1) estimate the effort for our initial historical data migration to data lake and/or dedicated pool as well as 2) plan an approach to migrate historical data.
- (Output) We will have tested and determined the data ingestion rate achievable in our environment and can determine if our data ingestion rate is sufficient to migrate historical data during the available time window.
    - (Test) Test different approaches of historical data migration [Transferring data to and from Azure Use cases - Azure Data Box](../../architecture/data-guide/scenarios/data-transfer.md)
    - (Test) Identify allocated bandwidth of ExpressRoute and if there is any throttling setup by the infra team [What is Azure ExpressRoute - Bandwidth options](../../expressroute/expressroute-introduction#bandwidth-options.md)
    - (Test) Test data transfer rate for both online and offline data migration [Copy performance and scalability achievable using ADF](../../data-factory/copy-activity-performance#copy-performance-and-scalability-achievable-using-adf.md)
    - (Test) Test data transfer from data lake to SQL pool using either ADF, Polybase or Copy command [Data loading strategies for Synapse SQL pool Bulk load data using the COPY statement](../sql-data-warehouse/design-elt-data-loading.md)
- (Goal) We will have tested the data ingestion rate of incremental data loading and will have the datapoints to estimate the data ingestion and processing time window to data lake and/ or SQL pool.
- (Output) We will have tested data ingestion rate and can determine if our data ingestion and processing requirements can be met with the identified approach
    - (Test) Test the daily update data ingestion and processing
    - (Test) Test the processed data load to SQL pool table from Spark pool [Import and Export data with Apache Spark](../spark/synapse-spark-sql-pool-import-export.md)
    - (Test) Execute daily load update process concurrently with end user queries.

Refine your tests by adding multiple testing scenarios - The flexibility of Azure Synapse makes it easy to test different scale (varying number of worker nodes, size of the worker nodes like small, medium and large) to compare performance and behavior.

- (Spark pool test) We will execute data processing across multiple node types (small, medium, large) as well as varied number of worker nodes.
- (Spark pool test) We will load/retrieve processed data from Spark pool to SQL dedicated pool with fast SQL pool connector.
- (Spark pool test) We will load/retrieve processed data from Spark pool to Cosmos DB with Azure Synapse Link.
- (SQL pool test) We will execute tests n, m, and p using scale of 500DWU, 1000DWU, 2000DWU.
- (SQL pool test) Test load scenarios A and B using different dynamic and static resource groups.

## Evaluate your POC dataset

From the specific data ingestion and processing pipeline that you have identified, you will now identify the dataset required to support these tests. Now take some time to review this dataset. You now need to verify that the dataset will adequately represent your future processing on Spark pool in content, complexity, and scale. Do not use a dataset that is too small (< 1TB) - you will not see representative performance. Do not use a dataset that is too big - the POC is not the time to complete the full data migration. Also ask the customer to share benchmarks from existing systems, which you will use for performance comparison.

Make sure you have checked with business owners for any blockers for moving this data to the cloud. Identify any security or privacy concerns or any data obfuscation needs to be done before moving data to the cloud.

## Create a high-level architecture for your POC

Based upon the high-level architecture of your future state architecture identify the components that will be a part of your POC. Your high-level future state architecture likely contains many data sources, numerous data consumers, big data components and possibly Machine Learning and AI data consumers. Create an architecture for your POC that specifically identifies the components that will be part of the POC and clearly identifies which components will not be part of the POC testing.

If you are already using Azure, identify any resources you already have in Azure (AAD, ExpressRoute, etc.) that can be used during the POC. Also identify what Azure Regions your organization prefers. Now is a great time to identify the throughput of your ExpressRoute connection and check with other business users and verify that your POC can consume some of that throughput without adverse effect on production solutions.

Learn more about [Big data architectures](../../architecture/data-guide/big-data.md).

## Identify POC resources

Specifically identify the technical resources or SME and time commitment that will be required to support your POC.

- A business representative to oversee requirements and results
- An application data expert, to source the data for the POC and provide knowledge of the existing process/logic
- An Apace Spark and Spark pool expert
- An expert advisor, to optimize the POC tests
- Resources that will be required for specific components of your POC project, but not necessarily required for the duration of the POC. These resources could include network admin resources, Azure Admin Resources, Active Directory Admins, etc.
- Ensure all the required Azure services resources have been provisioned and the required level of access has been provided to these services, including access to storage accounts (Storage Contributor and Storage Blob Data Contributor).
- Ensure you have an account which has required data access permission to pull data from all the data sources in the scope of the POC.

Since you are evaluating a new platform, we recommend engaging an expert advisor to assist with your POC. Microsoft’s partner community has global availability of expert consultants, able to demonstrate the features and performance of Azure Synapse. You can find local partners at [Solution Providers Home](https://www.microsoft.com/solution-providers/home).

## Set your POC timeline

Review the details of your POC planning and business needs to identify a time constraint for your POC. Make realistic estimates of the time that will be required to complete the tasks in your plan. The time to complete your POC will be influenced by the size of your POC dataset, the number data processing jobs, complexity, and the number of interfaces you are testing, etc. If you find your POC is estimated to run longer than 4 weeks, consider reducing the POC scope to keep focus on the highest priority goals. Get buy in from all the lead resources and sponsors for the timeline before continuing.

You can consider checking out "Scoping the Spark POC" section under Appendix for more tips and tricks to better scope, estimate and define timeline for your Spark ???

## Run your POC project

Execute your POC project with the discipline and rigor of any production project. Execute according to the plan and have a change request process in place to prevent your POC growing and getting out of control.

Example high-level tasks:

- Provision a Synapse workspace, Spark and pools, Storage Accounts, and all SQL resources identified in the POC plan.
- Load POC dataset
    - Make data available from source or creating sample data in Azure in Azure by from source or creating sample data in extracting as needed. [Transferring data to and from Azure  Use cases - Azure Data Box](../../databox/data-box-overview.md#use-cases) - [Copy performance and scalability achievable using ADF](../../data-factory/copy-activity-performance.md#copy-performance-and-scalability-achievable-using-adf) - [Data loading strategies for Synapse SQL pool](../sql-data-warehouse/design-elt-data-loading.md) - [Bulk load data using the COPY statement](../sql-data-warehouse/quickstart-bulk-load-copy-tsql.md?view=azure-sqldw-latest)
    - Test the dedicated connector for Spark and SQL dedicated pool.
- Migrate existing code to Spark
    - If you are migrating from Spark, your migration effort is likely to be straightforward given that Spark pool leverages open-source Spark distribution. However, if you are using vendor specific features on top of core Spark features, you will need to map these features correctly to Spark pool features.
    - If you are migrating from a non-Spark system, your migration effort will vary based on complexity involved.
    - In either case, you can consider checking out "Executing the Spark POC" section under Appendix for more best practices, guidelines, tips and tricks to successfully execute your Spark POC.
- Execute tests
    - Many tests can be executed in parallel (i.e., multiple data ingestion and processing jobs can be run in parallel across multiple Spark pool clusters)
    - Record your results in a consumable and readily understandable format
    - You can consider checking out "Testing Strategy" and "Result Analysis and Read-out" sections under Appendix for more details
- Monitor for troubleshooting and performance
    - [Monitor - Apache Spark Activities](../get-started-monitor.md#apache-spark-activities)
    - [Monitor - Spark UI or Spark History Server](https://spark.apache.org/docs/3.0.0-preview/web-ui.html)
    - [Monitoring resource utilization and query activity in Azure Synapse Analytics](../../sql-data-warehouse/sql-data-warehouse-concept-resource-utilization-query-activity.md)
- Monitor data skewness, time skewness and executor usage percentage under Diagnostic tab of Spark History Server:

TODO: Image

## Evaluate and present results

When all the POC tests are completed you can evaluate the results. Begin by evaluating if the POC goals have been met and the desired outputs collected. Note where additional testing is warranted or where additional questions were raised.

## Next steps

Work with technical stakeholders and business interests to plan for the next phase of the project whether it’s going to be another follow up POC or production migration.
