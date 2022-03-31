---
title: Data warehousing with dedicated SQL pool
description: TODO
author: peter-myers
ms.author: v-petermyers
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 04/30/2022
---

# Data warehousing with dedicated SQL pool

## Prepare for your proof of concept

Before going through the process of creating Goals for your Azure Synapse Analytics POC it is worth taking some time to understand the service capabilities and how they might apply to your POC. To make the most of your POC execution time, read about it in the Service Overview. Additionally, it is worth reading through the Azure Synapse SQL Pools Architectural Overview to familiarize yourself with how SQL pools separate compute and storage to provide industry- leading performance.

Finally, take a look at our [videos](https://azure.microsoft.com/resources/videos/index/?services=sql-data-warehouse&page=1&sort=newest&tag=data-and-analytics&service=synapse-analytics) walking through use cases and new announcements regarding Azure Synapse.

## Identify sponsors and potential blockers

Now that you are familiar with Azure Synapse. It is time to make sure that your proof of concept has the necessary backing and will not hit any roadblocks.

Now is the time to:

- Identify any restrictions or guidelines that your organization has about moving data to the cloud.
- Identify executive and business sponsorship for a cloud-based data warehouse project.
- Verify that your workload is appropriate for Azure Synapse. Read more [here](../sql-data-warehouse/massively-parallel-processing-mpp-architecture.md).

## Set your timeline

A proof of concept is a scoped, time-bounded exercise with specific, measurable goals and metrics of success. Ideally, it should have some basis in business reality so that the results are meaningful.

In our experience, proof of concepts have the best outcome when they are timeboxed to two weeks. This provides enough time for work to be completed without the burden of too many use cases and complex test matrices.

Working within this timeline, you can follow this rough agenda:

- Loading: Three days or less
- Querying: Five days or less
- Value added tests: Two days or less

This agenda is intended to be more of a guideline than a rule.

Here are some tips:

> [!div class="checklist"]
> - Make realistic estimates of the time that will be required to complete the tasks in your plan.
> - The time to complete your proof of concept will be influenced by the size of its dataset, the number of database objects (for example, tables, views, and stored procedures), the complexity of your database objects, and the number of interfaces you are testing.
> - If you find that your proof of concept is estimated to run longer than four weeks, consider reducing its scope to focus on the highest priority goals.
> - Get buy-ins from all the lead resources and sponsors for the timeline before continuing.

Now that you have determined that there are no immediate blockers and you have set your timeline, let's move on to scoping an architecture.

## Creating a high-level proof of concept scoped architecture

Your high-level future architecture will likely contain many data sources, numerous data consumers, Big Data components, and possibly machine learning and AI data consumers. In order to keep the goal of your proof of concept achievable within your set timeframe, decide which of these components will be part of the proof of concept and which ones will be excluded from it.

Additionally, if you are already using Azure, you need to identify the following:

- Any resources you already have in Azure (for example, Azure Active Directory, ExpressRoute) that can be used during the proof of concept.
- What Azure region(s) your organization prefers.
- A subscription for non-production, proof of concept work.
- The throughput of your network connection to Azure. Also, check with other business users that your proof of concept can consume some of that throughput without having an adverse effect on production solutions.

## Migration considerations

If you are migrating from a legacy data warehouse system to Azure Synapse, here are some questions to consider:

- Are you migrating and want to make as few changes to existing Extract, Transform, Load process (ETL) and data warehouse consumption as possible?
- Are you migrating but want to do some extensive improvements along the way?
- Are you building an entirely new data warehouse environment (green field)?

Next, you need to consider your pain points.

## Identify your current pain points

Your proof of concept should contain use cases to prove potential solutions to address your current pain points. Here are some questions to consider:

- What gaps in our current implementation do we expect Azure Synapse to fill?
- What new business needs are you being asked to support?
- What service level agreements (SLAs) are you required to meet?
- What will be the workloads (for example, ETL, batch queries, analytics, reporting queries, or interactive queries)?

The next step is to set your goals.

## Set goals

Identify why you are doing a proof of concept and write out clear goals. It is important to know before you start the service what outputs you want from your proof of concept and what you will do with them.

Keep in mind that a proof of concept should be a short and focused effort to quickly prove or test a limited set of concepts. If you have a long list of items to prove, you may want more than one proof of concept with gates between them where you determine whether you need the next one.

Here are some example proof of concept goals:

- We need to know that the query performance for our big complex reporting queries will meet our new SLAs.
- We need to know the query performance for our interactive users.
- We need to know whether our existing ETL processes are a good fit and where improvements need to be made.
- We need to know whether we can shorten our ETL runtimes and by how much.
- We need to know that the enterprise data warehouse (EDW) has sufficient security capabilities to secure our data.

The next step is to plan your testing.

## Create a test plan

Using your goals, identify specific tests to run in order to support those goals and provide the outputs you identified. It is important to make sure that you have at least one test to support each goal and the expected output. Identify specific queries, reports, ETL, and other processes that will be run so that a very specific dataset can be identified.

Refine your tests by adding multiple testing scenarios to clarify any table structure questions that have arisen.

Effective proof of concept execution is usually defined by good planning. Make sure all stakeholders agree to a written test plan that ties each proof of concept goal to a set of clearly stated test cases and measurements of success.

Most test plans revolve around performance and the expected user experience. What follows is an example of a test plan. It is important to customize your test plan to meet your business requirements. Clearly defining what you are testing will pay dividends later in this process.

|Goal|Test|Expected Outcomes|
|---------|---------|---------|
|We need to know that the query performance for our big complex reporting queries will meet our new SLAs|- Sequential test of "complex" queries<br/>- Concurrency test of complex queries against stated SLAs|- Queries A, B, and C finished in 10, 13, and 21 seconds, respectively<br/>- With 10 concurrent users, queries A, B, and C finished in 11, 15, and 23 seconds, on average|
|We need to know the query performance for our interactive users|- Concurrency test of selected queries at an expected concurrency level of 50 users.<br/>- Run the preceding with result-set caching|- At 50 concurrent users, average execution time is expected to be under 10 seconds, and without result-set caching<br/>- At 50 concurrent users, average execution time is expected to be under five seconds with result-set caching|
|We need to know whether our existing ETL processes can run within the SLA|- Run one or two ETL processes to mimic production loads|- Loading incrementally onto a core fact table must complete in less than 20 minutes (including staging and data cleansing)<br/>- Dimensional processing needs to take less than five minutes|
|•	We need to know that the EDW has sufficient security capabilities to secure our data|- Review and enable network security (VNET and private endpoints), data security (row-level security, Dynamic Data Masking)|- Prove that data never leaves our tenant.<br/>- Ensure that PII is easily secured|

The next step is to identify your dataset.

## Identify and validate the proof of concept dataset

From the tests scoped you can identify the data that will need in Azure Synapse to execute those tests. Now take some time to review this dataset by considering the following:

- You need to verify that the dataset will adequately represent your future processing on Azure Synapse in both content, complexity, and scale.
- Do not use a dataset that is too small (smaller than 1 TB in size) as you will not see representative performance.
- Do not use a dataset that is too large, as your proof of concept is not intended to complete your full data migration.
- Identify the distribution pattern and indexing option for each table.
- If there are any questions regarding distribution. Indexing, or partitioning, add tests to your proof of concept to answer your questions.
- Remember that you may want to test more than one distribution option or indexing option for certain tables.
- Make sure that you have checked with the business owners for any blockers for moving this data to the cloud.
- Identify any security or privacy concerns.

Next, you need to put together a team.

## Assemble your team

Specifically identify the team members needed and the commitment that will be required to support your proof of concept. The team members should include:

- A project manager to run the proof of concept project.
- A business representative to oversee requirements and results.
- An application data expert to source the data for the proof of concept.
- An Azure Synapse specialist.
- An expert advisor to optimize the proof of concept tests.
- Any resources that will be required for specific components of your proof of concept project but are not necessarily required for its entire duration. These resources could include network administrators, Azure administrators, and Active Directory administrators.

Since you are evaluating a new platform, we recommend engaging an expert advisor to assist with your proof of concept. Microsoft's partner community has global availability of expert consultants who are able to demonstrate the features and performance of Azure Synapse Analytics.

Now that you are fully prepared, it is time to put your proof of concept into practice.

## Put it into practice

It is important to keep the following in mind:

- Implement your proof of concept project with the discipline and rigor of any production project.
- Run it according to plan.
- Have a change request process in place to prevent your proof of concept from growing and changing out of control.

## Set up

Before tests can start, you need to setup the test environment and load the data:

TODO: Image

Setting up a proof of concept on Azure Synapse is as easy as clicking a few buttons.

Perform the following steps:

- From the [Azure portal](https://www.portal.azure.com/), follow [this tutorial](../sql-data-warehouse/create-data-warehouse-portal.md) to create an Azure Synapse SQL pool.
- Ensure that the SQL pool's [firewalls](../../sql-database/sql-database-firewall-configure.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) are open to your client machine.
- Download and install [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15) (SSMS).

When you set up your SQL pool, you can set the [Data Warehouse Units](../sql-data-warehouse/what-is-a-data-warehouse-unit-dwu-cdwu.md) (DWUs). DWUs range from 100 to 30,000 and define the performance characteristics of your SQL pool. This value can be changed at any point by [scaling your SQL pool](../sql-data-warehouse/quickstart-scale-compute-portal.md).

We suggest developing code and unit testing at DW500c or below and running load and performance tests at DW1000c or above. At any point, you can [pause your SQL pool](../sql-data-warehouse/pause-and-resume-compute-portal.md), which will save on costs.

## Data loading

Now that your SQL pool has been created, it is time to load some data.

Do the following:

- If you have not already done so, load some data into an Azure Storage blob. We advise using a [General-purpose V2 storage blob](../../storage/common/storage-account-overview.md) with locally redundant storage for a proof of concept. There are several tools for migrating your data to an Azure Storage blob. The easiest way is to use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) and copy files into the storage container.
- Now that you have data in your Azure storage container, you can load it into the SQL pool. Azure Synapse supports two T-SQL loading methods: [PolyBase](../sql-data-warehouse/design-elt-data-loading.md) and [COPY](https://docs.microsoft.com/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest) statement.

To load data, you need to connect to your Azure Synapse SQL pool via a tool such as [SSMS](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms?redirectedfrom=MSDN&view=sql-server-ver15). Once connected to your database, you can use [PolyBase](../sql-data-warehouse/design-elt-data-loading.md) or the [COPY INTO](https://docs.microsoft.com/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest) statement.

When loading data for the first time into Azure Synapse SQL pools, a common question is what [distribution](../sql-data-warehouse/sql-data-warehouse-tables-distribute.md) and [index](../sql-data-warehouse/sql-data-warehouse-tables-index.md) to choose. While Azure Synapse SQL pools support a variety of both, it is a best practice to use the defaults of round-robin distribution and clustered columnstore index. From here, you can fine-tune your environment, which we will discuss in a later section.

The following is a COPY INTO example:

```tsql
COPY INTO test_1 (Col_one default 'myStringDefault' 1, Col_two default 1 3) FROM 'https://myaccount.blob.core.windows.net/myblobcontainer/folder1/' WITH (
    FILE_TYPE = 'CSV',
    CREDENTIAL = (IDENTITY= 'Storage Account Key', SECRET='<Your_Account_Key>'),
    FIELDQUOTE = '"',
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '0x0A',
    ENCODING = 'UTF8',
    FIRSTROW = 2
```
Let's now move on to querying.

## Querying

Deriving analytics from your data is why you are looking at a data warehouse in the first place, so let's see how to get the most out of your database. Most proof of concepts start by running a small number of representative queries against the data warehouse, first in sequence and then concurrently. This should be defined in your test plan.

### Sequential query test

Running queries sequentially is extremely easy with SSMS. It is important to run these tests using a user with a sufficient large resource class. For simple queries, we recommend Static 20. For more complex queries, we suggest Static 40.

The following SQL query uses a query label to keep track of the first query in Dynamic Management Views (DMV). Then it uses `sys.dm_pdw_exec_requests` to determine query execution duration:

> [!TIP]
> Using a query label is a great way to keep track of your queries.

```tsql
/* Use the OPTION(LABEL = '') Syntax to add a query label to track the query in DMVs */
SELECT TOP (1000) * FROM [dbo].[Date] OPTION (LABEL = 'Test1')
/* Use sys.dm_pdw_exec_requests to determine query execution duration (ms) */
SELECT
    Total_elapsed_time AS [Elapsed_Time_ms],
    [label]
FROM
    sys.dm_pdw_exec_requests
WHERE
    [label] = 'Test1'
```

### Concurrent query test

After baselining single query performance, many customers evaluate running multiple read queries simultaneously. This is intended to mimic a business intelligence scenario running against the SQL pool. The easiest way to run this test is to download a stress testing tool. The most popular tool for this is [Apache JMeter](https://jmeter.apache.org/download_jmeter.cgi).

An expected outcome of this test is a minimum, maximum, and average execution time at a given concurrency level. For example, suppose that you want to mimic a business intelligence workload that generates 100 concurrent queries. You would setup JMeter to run those 100 concurrent queries in a loop and look at the steady state execution. This could be done with result-set caching on and off to show the benefits of that feature.

Document your results that clearly show the results.

|Concurrency|# Queries Run|DWU|Min Duration(s)|Max Duration(S)|Median Duration(s)|
|---------|---------|---------|---------|---------|---------|
|100|1,000|5,000|3|10|5|
|50|5,000|5,000|3|6|4|

### Mixed workload test

Mixed workload testing is simply an addition to the concurrent query test. By adding a data update statement, like something from the loading process, into the workload mix, the workload better simulates an actual production workload.

### Tune your query tests

Depending on the query workload running on Azure Synapse, you may need to fine-tune your data warehouse's distributions and indexes. For guidance, please refer to our [best practices guide](../sql-data-warehouse/sql-data-warehouse-best-practices.md).

The most common mistakes seen during setup are as follows:

- Large queries run with too small a [resource class](../sql-data-warehouse/resource-classes-for-workload-management.md).
- DWUs are too small for the workload.
- Large tables require [hash distribution](../sql-data-warehouse/sql-data-warehouse-tables-distribute.md).

Common tuning changes that can be applied are as follows:

- [Materialized views](../sql-data-warehouse/performance-tuning-materialized-views.md) are used to accelerate common aggregations.
- Replicate small dimension tables.
- Hash distribute large fact tables that are joined or aggregated.

Let's now look at value added tests.

## Value added tests

After core price performance testing is complete, it is a good time to test specific features to verify that they satisfy your intended use case. More often than not, these features are follows:

- [Column-level security](../sql-data-warehouse/column-level-security.md)
- [Row-level security](https://docs.microsoft.com/sql/relational-databases/security/row-level-security?toc=%2Fazure%2Fsynapse-analytics%2Fsql-data-warehouse%2Ftoc.json&bc=%2Fazure%2Fsynapse-analytics%2Fsql-data-warehouse%2Fbreadcrumb%2Ftoc.json&view=sql-server-ver15)
- [Dynamic Data Masking](https://docs.microsoft.com/azure/sql-database/sql-database-dynamic-data-masking-get-started?toc=%2Fazure%2Fsynapse-analytics%2Fsql-data-warehouse%2Ftoc.json&bc=%2Fazure%2Fsynapse-analytics%2Fsql-data-warehouse%2Fbreadcrumb%2Ftoc.json&view=sql-server-ver15)
- Intra-cluster scaling via [Workload isolation](../sql-data-warehouse/sql-data-warehouse-workload-isolation.md)

Finally, you need to interpret your results.

## Interpret results

Now that you have raw data pertaining to the performance of your data warehouse, it is important to contextualize that data. A common tactic for doing this is to compare the runs in terms of price/performance. Simply put, price/performance removes the differences in price per DWU or service hardware and gives a single comparable number for each performance test.

Let's look at an example:

|Test|Test Duration|DWU|$/hr for DWU|Cost of Test|
|---------|---------|---------|---------|---------|
|Test 1|10 min|1000|$12/hr|$2|
|Test 2|30 min|500|$6/hr|$3|

The preceding example makes it very easy to see that running Test 1 at DWU1000 is more cost effective, at $2 per test run rather than $3 per test run. This methodology can be used to compare results across vendors in a proof of concept scenario.

In summary, once all the proof of concept tests are completed, the next step is to evaluate the results:

- Begin by evaluating whether the proof of concept goals have been met and the desired outputs collected.
- Make a note of where additional testing is warranted or where additional questions were raised.

## Next steps

TODO
