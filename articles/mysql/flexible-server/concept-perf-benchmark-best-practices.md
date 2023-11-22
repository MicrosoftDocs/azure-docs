---
title: Performance benchmarking considerations and best practices - Azure Database for MySQL flexible server
description: This article describes some considerations and best practices to apply when conducting performance benchmarks on Azure Database for MySQL flexible server.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: code-sidd 
ms.author: sisawant
ms.date: 01/27/2023
---

# Best practices for benchmarking the performance of Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Performance is a hallmark of any application, and it's vital to define a clear strategy for analyzing and assessing how a database performs when handling an application's variable workload requirements.

This article provides considerations and best practices for running performance benchmarks against Azure Database for MySQL flexible server.

## Performance testing

Benchmarking the performance of relational database systems synthetically may at first seem like a trivial task. After all, it’s relatively easy to assess the performance of individual queries manually and even to launch simple synthetic tests using one of the available benchmarking tools. These types of tests take little time and quickly produce easy to understand results.

However, benchmarking the performance of real-world production systems requires a lot of additional effort. It’s not easy to design, implement, and run tests that are truly representative of production workloads. It’s even more difficult to make decisions about production data stacks based on the results of a series of benchmarks that are performed in an isolated environment.

## Performance testing methodologies

### Synthetic benchmarks

Synthetic testing is designed to put stress on a database system using artificial workload samples that simulate repeatable results in a database environment. This allows customers to perform comparisons between multiple environments to gauge the right database resource for their production deployments.

There are several benefits associated with using synthetic benchmarks. For example, they:

- Are predictable, repeatable, and allow for selective testing (e.g., write-only tests, read-only tests, a mix of write and read tests, and targeted tests against a table).
- Provide overall results that can be represented using simple metrics (e.g., “queries per second”, “transactions per second” etc.).
- Don’t require application or environment-specific knowledge to build and run.
- Can be performed quickly and with little to no preparation.
However, there are also associated drawbacks, in that:
- Artificial workload samples aren't representative of real-world application traffic.
- Results can't be used to accurately predict the performance of production workloads.
- They may not expose product-specific performance characteristics when used to test different database products.
- It’s easy to perform the tests incorrectly and produce results that are even less representative.

Synthetic tests are handy for quick comparisons between products. You can also use them to implement continuous performance monitoring mechanisms. For example, you may run a test suite every weekend to validate the baseline performance of your database system, detect anomalies, and predict long-term performance patterns (e.g., query latency degradation as a result of data growth).

### Real-world benchmarks

With real-world testing, the database is presented with workload samples that closely resemble production traffic. You can achieve this directly, by replaying a log of production queries and measuring database performance. You can also achieve this indirectly, by running the test at the application level and measuring application performance on a given database server.

There are several benefits associated with using real-world benchmarks, in that they:

- Provide an accurate view of system performance in real production conditions.
- May reveal application or database-specific characteristics that simplified synthetic tests wouldn't.
- Help with capacity planning related to application growth.

There are also certain disadvantages: Real-world benchmarks:

- Are difficult to design and run.
- Must be maintained to ensure relevancy as the application evolves.
- Provide results that are meaningful only in the context of a given application.

When you're preparing for a major change to your environment, e.g., when deploying a new database product, it's strongly recommended to use real-world tests. In such a situation, a comprehensive benchmark run using actual production workload will be of significant help. It will not only provide accurate results you can trust, but also remove or at least greatly reduce the number of “unknowns” about your system.

## Choosing the “right” test methodology

The “right” test methodology for your purposes depends entirely on the objective of your testing.

If you’re looking to quickly compare different database products using artificial data and workload samples, you can safely use an existing benchmark program that will generate data and run the test for you.

To accurately assess the performance of an actual application that you intend to run on a new database product, you should perform real-world benchmark tests. Each application has a unique set of requirements and performance characteristics, and it's strongly suggested that you include real-world benchmark testing in all performance evaluations.

For guidelines on preparing and running synthetic and real-world benchmarks, see the following sections later in this post:

- Preparing and running synthetic tests
- Preparing and run real-world tests

## Performance testing best practices

### Server-specific recommendations

#### Server sizing

When launching Azure Database for MySQL flexible server instances to perform benchmarking, use an Azure Database for MySQL flexible server instance tier, SKU, and instance count that matches your current database environment.

For example:

- If your current server has eight CPU cores and 64 GB of memory, it’s best to choose an instance  based on the Standard_E8ds_v4 SKU.
- If your current database environment uses Read Replicas, use Azure Database for MySQL flexible server read replicas.

Depending on the results of your benchmark testing, you may decide to use different instance sizes and counts in production. However, it’s still a good practice to ensure that the initial specifications of test instances are close to your current server specifications to provide a more accurate, “apples-to-apples” comparison.

#### Server configuration

If the application/benchmark requires that certain database features be enabled, then prior to running the benchmark test, adjust the server parameters accordingly. For example, you may need to:

- Set a non-default server time zone.
- Set a custom “max_connections” parameter if the default value isn't sufficient.
- Configure the thread pool if your Azure Database for MySQL flexible server instance is running version 8.0.
- Enable Slow Query Logs if you expect to use them in production so you can analyze any bottleneck queries.

Other parameters, such as those related to the size of various database buffers and caches, are already pre-tuned in Azure Database for MySQL flexible server, and you can initially leave them set at their default values. While you can modify them, it’s best to avoid making server parameter changes unless your performance benchmarks show that a given change does in fact improve performance.

When performing tests comparing Azure Database for MySQL flexible server to other database products, be sure to enable all features that you expect to use in production on your test databases. For example, if you don’t enable zone redundant HA, backups, and Read Replicas in your test environment, then your results may not accurately reflect real-world performance.

### Client-specific recommendations

All performance benchmarks involve the use of a client, so regardless of your chosen benchmarking methodology, be sure to consider the following client-side recommendations.

- Make sure client instances exist in the same Azure Virtual Network (VNet) as the Azure Database for MySQL flexible server instance you're testing. For latency-sensitive applications, it’s a good practice to place client instances in the same Availability Zone (AZ) as the database server.
- If a production application is expected to run on multiple instances (e.g., an app server fleet behind a Load Balancer), it’s a good practice to use multiple client instances when performing the benchmark.
- Ensure that all client instances have adequate compute, memory, I/O, and network capacity to handle the benchmark. In other words, the clients must be able to produce requests faster than the database engine can handle them. All operating systems provide diagnostic tools (such as “top”, “htop”, “dstat” or “iostat” on Linux) that can help you diagnose resource utilization on client instances. It's strongly recommended that you leverage these tools and ensure that all client instances always have spare CPU, memory, network, and IO capacity while the benchmark is running.

Note that even with a very large SKU, a single client instance may not always be able to generate requests quickly enough to saturate the database. Depending on the test configuration, Azure Database for MySQL flexible server can be capable of handling hundreds of thousands of read/write requests per second, which may be more than a single client can accommodate. To avoid client-side contention during heavy performance tests, it’s therefore a common practice to run a benchmark from multiple client instances in parallel.

> [!IMPORTANT]
> If you’re benchmarking your application using a traffic generator script or third-party tool (such as Apache Benchmark, Apache JMeter, or Siege), you should also evaluate the instance on which the tool is running using the recommendations called out previously.

## Preparing and running synthetic tests

Synthetic benchmarking tools such as sysbench are easy to install and run, but they typically require a certain degree of configuration and tuning before any given benchmark can achieve optimal results.

### Table count and size

The number and size of tables generated prior to benchmarking should be realistically large. For example, tests conducted on a single table with 100,000 rows are unlikely to yield useful results because such data set is likely smaller than virtually any real-world database. For comparison, a benchmark using several tables (e.g., 10-25) with 5 million rows each might be a more realistic representation of real time workload.

### Test mode

With most benchmark tools (including the popular sysbench), you can define the type of workload that you want to run against the server. For example, the tool can generate:

- Read-only queries with identical syntax but different parameters.
- Read-only queries of different types (point selects, range selects, selects with sorts, etc.).
- Write-only statements that modify individual rows or ranges of rows.
- A mix of read/write statements.

You can use read-only or write-only workloads if you’d like to test database performance and scalability in these specific scenarios. However, a representative benchmark should typically include a good mix of read/write statements, because this is the type of workload most OLTP databases have to handle.

### Concurrency level

Concurrency level is the number of threads simultaneously executing operations against the database. Most benchmark tools use a single thread by default, which isn't representative of real-world database environments, as databases are rarely used by a single client at a time.

To test the theoretical peak performance of a database, use the following process: 

1. Run multiple tests using a different thread count for each test. For example, start with 32 threads, and then increase the thread count for each subsequent test (64, 128, 256, and so on).
2. Continue to increase the thread count until database performance stabilizes - this is your peak theoretical performance.
3. When you determine that database performance stops increasing at a given concurrency level, you can still attempt to increase the thread count a couple more times, which will show whether performance remains stable or begins to degrade.
For more information, see the blog post [Benchmarking Azure Database for MySQL – Flexible Server using Sysbench](https://techcommunity.microsoft.com/t5/azure-database-for-mysql-blog/benchmarking-azure-database-for-mysql-flexible-server-using/ba-p/3108799).

## Preparing and running real-world tests

Every application is unique in terms of data characteristics and performance requirements. As a result, it’s somewhat difficult to come up with a single, universal list of steps that would be sufficient to prepare and run a representative, real-world benchmark in an arbitrary database environment.

The ideas presented in this section are intended to make performance testing projects a little easier.

### Preparing test data

Before conducting performance benchmarks against Azure Database for MySQL server, be sure that the server is populated with a representative sample of your production data set.

Whenever possible, use a full copy of the production set. When this isn’t possible, use the following suggestions to help you determine which portions of data you should always include and which data you can leave out.

- The test server needs to include all objects (i.e., schemas, tables, functions, and procedures) that are directly used by the benchmark. Each table should be fully populated, i.e., it should contain all the rows it contains in production. If tables aren't fully populated (e.g., they only contain a small sample of the row set), benchmark results won't be representative.
- Exclude tables that are used by production applications but that aren’t part of continuous operational traffic. For example, if a database contains a live, operational data set as well as historical data used for analytics, the historical data may not be required to run benchmarks.
- Populate all tables that you copy to the test server with real production data rather than artificial, programmatically generated samples.

### Designing application benchmarks

The high-level process for performing application benchmarks is as follows:

1. Create an Azure Database for MySQL flexible server instance and populate it with a copy of your production data.
2. Deploy a copy of the application in Azure.
3. Configure the application to use the Azure Database for MySQL flexible server instance.
4. Run load tests against the application and assess the results.

This approach is primarily useful when you can easily deploy a copy of your application in Azure. It allows you to conduct performance assessment in the most thorough and accurate way, but there are still certain recommendations to keep in mind.

- The tool used to generate application traffic must be able to generate a mix of requests representative of your production workload. For example, don't test by repeatedly accessing the same application URL, as this likely isn't representative of how your clients will use the application in the real world.
- The pool of client and application instances must be powerful enough to generate requests, handle them, and receive responses from the database without introducing any bottlenecks.
- Concurrency level (the number of parallel requests generated by the benchmark tool) should match or slightly exceed the expected peak concurrency level observed in your application.

### Designing database benchmarks

If you can’t easily deploy a copy of your application in Azure, you'll need to perform the benchmark by running SQL statements directly against the database. To accomplish this, use the following high-level procedure:

1. Identify the SQL statements that most commonly appear in your production workload.
2. Based on the information gathered in the first step, prepare a large sample of SQL statements to test.
3. Create an Azure Database for MySQL node and populate it with a copy of your production data.
4. Launch Azure virtual machine (VM) client instance(s) in Azure.
5. From the VMs, run the SQL workload sample against yourAzure Database for MySQL flexible server instance and assess the results.

There are two main approaches to generating the test payload (SQL statement samples):

- Observe/record the SQL traffic occurring in your current database, then generate SQL samples based on those observations. For details on how to record query traffic by leveraging a combination of audit logs and slow query logging in Azure Database for MySQL flexible server.
- Use actual query logs as the payload. Third party tools such as “Percona Playback” can generate multi-threaded workloads based on MySQL Slow Query Logs.

If you decide to generate SQL sample manually, be sure that the sample contains:

- **A large enough number of unique statements**.

    Example: if you determine that the production workload uses 15 main types of statements, it isn't enough for the sample to contain a total of 15 statements (one per type). For such a small sample, the database would easily cache the required data in memory, making the benchmark non-representative. Instead, provide a large query sample for each statement type and the use the following additional recommendations.

- **Statements of different types in the right proportions.**

    Example: if you determine that your production workload uses 12 types of statements, it is likely that some types of statements appear more often than others. Your sample should reflect these proportions: if query A appears 10 times more often than query B in production workload, it should also appear 10 times more often in your sample.

- **Query parameters that are realistically randomized.**

    If you followed earlier recommendations and your query sample contains groups of queries of the same type/syntax, parameters of such queries should be randomized. If the sample contains one million queries of the same type and they're all identical (including parameters in WHERE conditions), the required data will easily be cached in database memory, making the benchmark non-representative.

- **A statement execution order that is realistically randomized.**

    If you follow the previous recommendations and your test payload contains many queries of different types, you should execute these queries in a realistic order. For example, the sample may contain 10 million SELECTs and 1 million UPDATES. In such a case, executing all SELECTs before all UPDATEs may not be the best choice as this is likely not how your application executes queries in real world. More likely, the application interleaves SELECTs and UPDATEs and your test should try to simulate that.

When the query sample is ready, run it against the server by using a command line MySQL client or a tool such as mysqlslapv.

## Running tests

Regardless of whether you’re running a synthetic benchmark or a real-world application performance test, there are several rules of thumb to follow to help ensure that you achieve more representative results.

### Run tests against multiple instance types

Assume that you decide to run benchmarks against a db.r3.2xlarge server and find that the application/query performance already meets your requirements. It's recommended also to run tests both against smaller and larger instance types, which provides two benefits:

- Testing with smaller instance types may still yield good performance results and reveal potential cost saving opportunities.
- Testing with larger instance types may provide ideas or insight about future scalability options.

### Measure both sustained and peak performance

The test strategy you choose should provide you with answers to whether the database will provide adequate:

- Sustained performance - Will it perform as expected under the normal workload, when user traffic is smooth and well within expected levels?
- Peak performance - Will it ensure application responsiveness during traffic spikes?

Consider the following guidelines:

- Ensure that test runs are long enough to assess database performance in a stable state. For example, a complex test that only lasts for 10 minutes will likely produce inaccurate results, as the database caches and buffers may not be able to warm up in such a short time.
- Benchmarks can be a lot more meaningful and informative if the workload levels vary throughout the test. For example, if your application typically receives traffic from 64 simultaneous clients, start the benchmark with 64 clients. Then, while the test is still running, add 64 additional clients to determine how the server behaves during a simulated traffic spike.

### Include blackout/brownout tests in the benchmark procedure

Sustained server performance is a particularly important metric, likely to become the main point of focus during your tests. For mission-critical applications however, performance testing shouldn't stop at measuring server behavior in steady state.

Consider including the following scenarios in your tests.

- “Blackout” tests, which are designed to determine how the database behaves during a reboot or a crash. Azure Database for MySQL flexible server introduces significant improvements around crash recovery times, and reboot/crash tests are instrumental in understanding how Azure Database for MySQL flexible server contributes to reducing your application downtime in such scenarios.
- “Brownout” tests, which are designed to gauge how quickly a database achieves nominal performance levels after a reboot or crash. Databases often need time to achieve optimal performance, and Azure Database for MySQL flexible server introduces improvements in this area as well.

In the event of stability issues affecting your database, any information gathered during the performance benchmarks will help identify bottlenecks or further tune the application to cater to the workload needs.

## Next steps

- [Best practices for optimal performance of Azure Database for servers](concept-performance-best-practices.md)
- [Best practices for server operations using Azure Database for MySQL flexible server](concept-operation-excellence-best-practices.md)
- [Best practices for monitoring Azure Database for MySQL flexible server](concept-monitoring-best-practices.md)
- [Get started with Azure Database for MySQL flexible server](../single-server/quickstart-create-mysql-server-database-using-azure-portal.md)
