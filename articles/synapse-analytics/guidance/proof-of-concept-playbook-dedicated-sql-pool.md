---
title: "Synapse POC playbook: Data warehousing with dedicated SQL pool in Azure Synapse Analytics"
description: "A high-level methodology for preparing and running an effective Azure Synapse Analytics proof of concept (POC) project for dedicated SQL pool."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/23/2022
---

# Synapse POC playbook: Data warehousing with dedicated SQL pool in Azure Synapse Analytics

This article presents a high-level methodology for preparing and running an effective Azure Synapse Analytics proof of concept (POC) project for dedicated SQL pool.

[!INCLUDE [proof-of-concept-playbook-context](includes/proof-of-concept-playbook-context.md)]

> [!TIP]
> If you're new to dedicated SQL pools, we recommend you work through the [Work with Data Warehouses using Azure Synapse Analytics](/training/paths/work-with-data-warehouses-using-azure-synapse-analytics/) learning path.

## Prepare for the POC

Before deciding on your Azure Synapse POC goals, we recommend that you first read the [Azure Synapse SQL architecture](../sql/overview-architecture.md) article to familiarize yourself with how a dedicated SQL pool separates compute and storage to provide industry-leading performance.

### Identify sponsors and potential blockers

Once you're familiar with Azure Synapse, it's time to make sure that your POC has the necessary support and won't hit any roadblocks. You should:

- Identify any restrictions or policies that your organization has about moving data to, and storing data in, the cloud.
- Identify executive and business sponsorship for a cloud-based data warehouse project.
- Verify that your workload is appropriate for Azure Synapse. For more information, see [Dedicated SQL pool architecture in Azure Synapse Analytics](../sql-data-warehouse/massively-parallel-processing-mpp-architecture.md).

### Set the timeline

A POC is a scoped, time-bounded exercise with specific, measurable goals and metrics that define success. Ideally, it should have some basis in business reality so that the results are meaningful.

POCs have the best outcome when they're *timeboxed*. Timeboxing allocates a fixed and maximum unit of time to an activity. In our experience, two weeks provides enough time to complete the work without the burden of too many use cases or complex test matrices. Working within this fixed time period, we suggest that you follow this timeline:

1. **Data loading:** Three days or less
1. **Querying:** Five days or less
1. **Value added tests:** Two days or less

Here are some tips:

> [!div class="checklist"]
> - Make realistic estimates of the time that you will require to complete the tasks in your plan.
> - Recognize that the time to complete your POC will be related to the size of your dataset, the number of database objects (tables, views, and stored procedures), the complexity of the database objects, and the number of interfaces you will test.
> - If you estimate that your POC will run longer than four weeks, consider reducing the scope to focus only on the most important goals.
> - Get support from all the lead resources and sponsors for the timeline before commencing the POC.

Once you've determined that there aren't any immediate obstacles and you've set the timeline, you can scope a high-level architecture.

### Create a high-level scoped architecture

A high-level future architecture likely contains many data sources and data consumers, big data components, and possibly machine learning and AI data consumers. To keep your POC goals achievable (and within the bounds of your set timeline), decide which of these components will form part of the POC and which will be excluded.

Additionally, if you're already using Azure, identify the following:

- Any existing Azure resources that you can use during the POC. For example, resources can include Azure Active Directory (Azure AD), or Azure ExpressRoute.
- What Azure region(s) your organization prefers.
- A subscription you can use for non-production POC work.
- The throughput of your network connection to Azure.
    > [!IMPORTANT]
    > Be sure to check that your POC can consume some of that throughput without having an adverse effect on production solutions.

### Apply migration options

If you're migrating from a legacy data warehouse system to Azure Synapse, here are some questions to consider:

- Are you migrating and want to make as few changes to existing Extract, Transform, and Load (ETL) processes and data warehouse consumption as possible?
- Are you migrating but want to do some extensive improvements along the way?
- Are you building an entirely new data analytics environment (sometimes called a *greenfield project*)?

Next, you need to consider your pain points.

### Identify current pain points

Your POC should contain use cases to prove potential solutions to address your current pain points. Here are some questions to consider:

- What gaps in your current implementation do you expect Azure Synapse to fill?
- What new business needs are you required to support?
- What service level agreements (SLAs) are you required to meet?
- What will be the workloads (for example, ETL, batch queries, analytics, reporting queries, or interactive queries)?

Next, you need to set your POC success criteria.

### Set POC success criteria

Identify why you're doing a POC and be sure to define clear goals. It's also important to know what outputs you want from your POC and what you plan to do with them.

Keep in mind that a POC should be a short and focused effort to quickly prove or test a limited set of concepts. If you have a long list of items to prove, you may want to dive them into multiple POCs. POCs can have gates between them so you can determine whether to proceed to the next POC.

Here are some example POC goals:

- We need to know that the query performance for our big complex reporting queries will meet our new SLAs.
- We need to know the query performance for our interactive users.
- We need to know whether our existing ETL processes are a good fit and where improvements need to be made.
- We need to know whether we can shorten our ETL runtimes and by how much.
- We need to know that Synapse Analytics has sufficient security capabilities to adequately secure our data.

Next, you need to create a test plan.

### Create a test plan

Using your goals, identify specific tests to run in order to support those goals and provide your identified outputs. It's important to make sure that you have at least one test for each goal and the expected output. Identify specific queries, reports, ETL and other processes that you will run to provide quantifiable results.

Refine your tests by adding multiple testing scenarios to clarify any table structure questions that arise.

Good planning usually defines an effective POC execution. Make sure all stakeholders agree to a written test plan that ties each POC goal to a set of clearly stated test cases and measurements of success.

Most test plans revolve around performance and the expected user experience. What follows is an example of a test plan. It's important to customize your test plan to meet your business requirements. Clearly defining what you are testing will pay dividends later in this process.

|Goal|Test|Expected outcomes|
|---------|---------|---------|
|We need to know that the query performance for our big complex reporting queries will meet our new SLAs|- Sequential test of complex queries<br/>- Concurrency test of complex queries against stated SLAs|- Queries A, B, and C completed in 10, 13, and 21 seconds, respectively<br/>- With 10 concurrent users, queries A, B, and C completed in 11, 15, and 23 seconds, on average|
|We need to know the query performance for our interactive users|- Concurrency test of selected queries at an expected concurrency level of 50 users.<br/>- Run the preceding query with result set caching|- At 50 concurrent users, average execution time is expected to be under 10 seconds, and without result set caching<br/>- At 50 concurrent users, average execution time is expected to be under five seconds with result set caching|
|We need to know whether our existing ETL processes can run within the SLA|- Run one or two ETL processes to mimic production loads|- Loading incrementally into a core fact table must complete in less than 20 minutes (including staging and data cleansing)<br/>- Dimension processing needs to take less than five minutes|
|We need to know that the data warehouse has sufficient security capabilities to secure our data|- Review and enable [network security](security-white-paper-network-security.md) (VNet and private endpoints), [access control](security-white-paper-access-control.md) (row-level security, dynamic data masking)|- Prove that data never leaves our tenant.<br/>- Ensure that customer content is easily secured|

Next, you need to identify and validate the POC dataset.

### Identify and validate the POC dataset

Using the scoped tests, you can now identify the dataset required to execute those tests in Azure Synapse. Review your dataset by considering the following:

- Verify that the dataset adequately represents your production dataset in terms of content, complexity, and scale.
- Don't use a dataset that's too small (less than 1TB), as you might not achieve representative performance.
- Don't use a dataset that's too large, as the POC isn't intended to complete a full data migration.
- Identify the [distribution pattern](../sql-data-warehouse/sql-data-warehouse-tables-distribute.md), [indexing option](../sql-data-warehouse/sql-data-warehouse-tables-index.md), and [partitioning](../sql-data-warehouse/sql-data-warehouse-tables-partition.md) for each table. If there are any questions regarding distribution, indexing, or partitioning, add tests to your POC to answer them. Bear in mind that you may want to test more than one distribution option or indexing option for some tables.
- Check with the business owners for any blockers for moving the POC dataset to the cloud.
- Identify any security or privacy concerns.

> [!IMPORTANT]
> Make sure you check with business owners for any blockers before moving any data to the cloud. Identify any security or privacy concerns or any data obfuscation needs that should be done before moving data to the cloud.

Next, you need to assemble the team of experts.

### Assemble the team

Identify the team members and their commitment to support your POC. Team members should include:

- A project manager to run the POC project.
- A business representative to oversee requirements and results.
- An application data expert to source the data for the POC dataset.
- An Azure Synapse specialist.
- An expert advisor to optimize the POC tests.
- Any person who will be required for specific POC project tasks but who aren't required for its entire duration. These supporting resources could include network administrators, Azure administrators, or Azure AD administrators.

> [!TIP]
> We recommend engaging an expert advisor to assist with your POC. [Microsoft's partner community](https://appsource.microsoft.com/marketplace/partner-dir) has global availability of expert consultants who can help you assess, evaluate, or implement Azure Synapse.

Now that you are fully prepared, it's time to put your POC into practice.

## Put the POC into practice

It's important to keep the following in mind:

- Implement your POC project with the discipline and rigor of any production project.
- Run the POC according to plan.
- Have a change request process in place to prevent your POC scope from growing or changing.

Before tests can start, you need to set up the test environment. It involves four stages:

1. Setup
1. Data loading
1. Querying
1. Value added tests

:::image type="content" source="media/proof-of-concept-playbook-dedicated-sql-pool/proof-of-concept-playbook-dedicated-sql-pool-setup.png" alt-text="Image shows the four test environment stages: Setup, Data loading, Querying, and Value added tests.":::

### Setup

You can set up a POC on Azure Synapse by following these steps:

1.	Use [this quickstart](../sql-data-warehouse/create-data-warehouse-portal.md) to provision a Synapse workspace and set up storage and permissions according to the POC test plan.
1.	Use [this quickstart](../quickstart-create-sql-pool-portal.md) to add a dedicated SQL pool to the Synapse workspace.
1.	Set up [networking and security](security-white-paper-introduction.md) according to your requirements. 
1.	Grant appropriate access to POC team members. See [this article](/azure/azure-sql/database/logins-create-manage) about authentication and authorization for accessing dedicated SQL pools.

> [!TIP]
> We recommend that you *develop code and unit testing* by using the DW500c service level (or below). We recommend that you *run load and performance tests* by using the DW1000c service level (or above). You can [pause compute of the dedicated SQL pool](../sql-data-warehouse/pause-and-resume-compute-portal.md) at any time to cease compute billing, which will save on costs.

### Data loading

Once you've set up the dedicated SQL pool, you can follow these steps to load data:

1. Load the data into [Azure Blob Storage](../../storage/blobs/storage-blobs-overview.md). For a POC, we recommend that you use a [general-purpose V2 storage account](../../storage/common/storage-account-overview.md) with [locally-redundant storage (LRS)](../../storage/common/storage-redundancy.md#locally-redundant-storage). While there are several tools for migrating data to Azure Blob Storage, the easiest way is to use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/), which can copy files into a storage container.
2. Load the data into the dedicated SQL pool. Azure Synapse supports two T-SQL loading methods: [PolyBase](../sql-data-warehouse/design-elt-data-loading.md) and the [COPY](/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest&preserve-view=true) statement. You can use SSMS to connect to the dedicated SQL pool to use either method.

When you load data into the dedicated SQL pool for the first time, you need to consider which [distribution pattern](../sql-data-warehouse/sql-data-warehouse-tables-distribute.md) and [index option](../sql-data-warehouse/sql-data-warehouse-tables-index.md) to use. While a dedicated SQL pool supports a variety of both, it's a best practice to rely on default settings. Default settings use round-robin distribution and a clustered columnstore index. If necessary, you can adjust these settings later, which is described later in this article.

The following example shows the COPY load method:

```sql
--Note when specifying the column list, input field numbers start from 1
COPY INTO
    test_1 (Col_1 default 'myStringDefault' 1, Col_2 default 1 3)
FROM
    'https://myaccount.blob.core.windows.net/myblobcontainer/folder1/'
WITH (
    FILE_TYPE = 'CSV',
    CREDENTIAL = (IDENTITY = 'Storage Account Key' SECRET = '<Your_Account_Key>'),
    FIELDQUOTE = '"',
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '0x0A',
    ENCODING = 'UTF8',
    FIRSTROW = 2
);
```

### Querying

The primary purpose of an data warehouse is to perform analytics, which requires querying the data warehouse. Most POCs start by running a small number of representative queries against the data warehouse, at first sequentially and then concurrently. You should define both approaches in your test plan.

#### Sequential query tests

It's easy to run sequential query tests in SSMS. It's important to run these tests by using a user with a sufficiently large [resource class](../sql-data-warehouse/resource-classes-for-workload-management.md). A resource class is a pre-determined resource limit in dedicated SQL pool that governs compute resources and concurrency for query execution. For simple queries, we recommend using the pre-defined **staticrc20** resource class. For more complex queries, we recommend using the pre-defined **staticrc40** resource class.

Notice that the following first query uses a [query label](../sql/develop-label.md) to provide a mechanism to keep track of the query. The second query uses the `sys.dm_pdw_exec_requests` dynamic management view to search by the label.

```sql
/* Use the OPTION(LABEL = '') Syntax to add a query label to track the query in DMVs */
SELECT TOP (1000)
    *
FROM
    [dbo].[Date]
OPTION (LABEL = 'Test1');

/* Use sys.dm_pdw_exec_requests to determine query execution duration (ms) */
SELECT
    Total_elapsed_time AS [Elapsed_Time_ms],
    [label]
FROM
    sys.dm_pdw_exec_requests
WHERE
    [label] = 'Test1';
```

#### Concurrent query tests

After recording sequential query performance, you can then run multiple queries concurrently. That way, you can simulate a business intelligence workload running against the dedicated SQL pool. The easiest way to run this test is to download a stress testing tool. The most popular tool is [Apache JMeter](https://jmeter.apache.org/download_jmeter.cgi), which is a third-party open source tool.

The tool reports on minimum, maximum, and median query durations for a given concurrency level. For example, suppose that you want to simulate a business intelligence workload that generates 100 concurrent queries. You can setup JMeter to run those 100 concurrent queries in a loop and then review the steady state execution. It can be done with [result set caching](../sql-data-warehouse/performance-tuning-result-set-caching.md) on or off to evaluate the suitability of that feature.

Be sure to document your results. Here's an example of some results:

|Concurrency|# Queries run|DWU|Min duration(s)|Max duration(S)|Median duration(s)|
|---------|---------|---------|---------|---------|---------|
|100|1,000|5,000|3|10|5|
|50|5,000|5,000|3|6|4|

#### Mixed workload tests

Mixed workload testing is an extension of the [concurrent query tests](#concurrent-query-tests). By adding a data loading process into the workload mix, the workload will better simulate a real production workload.

#### Optimize the data

Depending on the query workload running on Azure Synapse, you may need to optimize your data warehouse's distributions and indexes and rerun the tests. For more information, see [Best practices for dedicated SQL pools in Azure Synapse Analytics](../sql-data-warehouse/sql-data-warehouse-best-practices.md).

The most common mistakes seen during setup are:

- Large queries run with a resource class that's too low.
- The dedicated SQL pool service level DWUs are too low for the workload.
- Large tables require hash distribution.

To improve query performance, you can:

- Create [materialized views](../sql-data-warehouse/performance-tuning-materialized-views.md), which can accelerate queries involving common aggregations.
- [Replicate tables](../sql-data-warehouse/design-guidance-for-replicated-tables.md), especially for small dimension tables.
- [Hash distribute](../sql-data-warehouse/sql-data-warehouse-tables-distribute.md) large fact tables that are joined or aggregated.

### Value added tests

Once query performance testing is complete, it's a good time to test specific features to verify that they satisfy your intended use cases. These features include:

- [Row-level security](/sql/relational-databases/security/row-level-security?view=azure-sqldw-latest&preserve-view=true)
- [Column-level security](../sql-data-warehouse/column-level-security.md)
- [Dynamic data masking](/azure/azure-sql/database/dynamic-data-masking-overview)
- Intra-cluster scaling via [workload isolation](../sql-data-warehouse/sql-data-warehouse-workload-isolation.md)

Finally, you need to interpret your POC results.

## Interpret the POC results

Once you have test results for your data warehouse, it's important to interpret that data. A common approach you can take is to compare the runs in terms of *price/performance*. Simply put, price/performance removes the differences in price per DWU or service hardware and provides a single comparable number for each performance test.

Here's an example:

|Test|Test duration|DWU|$/hr for DWU|Cost of test|
|---------|---------|---------|---------|---------|
|Test 1|10 min|1000|$12/hr|$2|
|Test 2|30 min|500|$6/hr|$3|

This example makes it easy to see that **Test 1** at DWU1000 is more cost effective at $2 per test run compared with $3 per test run.

> [!NOTE]
> You can also use this methodology to compare results *across vendors* in a POC.

In summary, once you complete all the POC tests, you're ready to evaluate the results. Begin by evaluating whether the POC goals have been met and the desired outputs collected. Make note of where additional testing is warranted and additional questions that were raised.

## Next steps

> [!div class="nextstepaction"]
> [Data lake exploration with serverless SQL pool in Azure Synapse Analytics](proof-of-concept-playbook-serverless-sql-pool.md)

> [!div class="nextstepaction"]
> [Big data analytics with Apache Spark pool in Azure Synapse Analytics](proof-of-concept-playbook-spark-pool.md)

> [!div class="nextstepaction"]
> [Azure Synapse Analytics frequently asked questions](../overview-faq.yml)
