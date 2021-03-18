---
title: Performance benchmarks
titleSuffix: Azure Cognitive Search
description: Learn about the performance of Azure Cognitive Search through various performance benchmarks
author: dereklegenzoff
manager: luisca
ms.author: delegenz
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/18/2021
---


# Azure Cognitive Search performance benchmarks

Azure Cognitive Search's performance depends on a variety of factors including the size of your search service and the types of queries you're sending. In order to help estimate the size of search service needed for your workload, we've run several benchmarks to document the performance for different search services and configurations. These benchmarks in no way guarantee a certain level of performance from your service but can give you an idea of the level of performance you can expect.

To cover a range of different use cases we ran benchmarks for three main scenarios:

* **E-commerce search** - This benchmark emulates a real e-commerce scenario and is based on the Nordic e-commerce company [CDON](https://cdon.com).
* **Document search** - This scenario is comprised of keyword search over full text documents representing typical document search.
* **Application search** - Simpler than the e-commerce scenario, this benchmark emulates searching over SQL or Cosmos DB data from within an application.


While these scenarios reflect different use cases, every scenario is different so we always recommend performance testing your individual workload. We've published a [performance testing solution using JMeter](https://github.com/Azure-Samples/azure-search-performance-testing) so you can run similar tests against your own service. You can follow this tutorial

## Testing methodology

To benchmark Azure Cognitive Search's performance, we ran tests for three different scenarios at different SKUs and replica/partition combinations.

To create these benchmarks, the following methodology was used:

1. The test begins at `X` QPS (usually 5 or 10 QPS) for 180 seconds 
2. QPS then increased by `X` and ran for another 180 seconds
3. Every 180 seconds, the test increased by `X` QPS until average latency increased above 1000 ms or less than 99% of queries succeeded.

The graph below gives a visual example of what the test's query load looks like:

![Example test](./media/performance-benchmarks/example-test.png)

Each scenario used at least 10,000 unique queries to avoid tests being overly skewed by caching.

> These tests only include query workloads so when planning you'll also need to consider how high your indexing load will be. 

### Definitions

- **Maximum QPS** -  the maximum QPS numbers below are based on the highest QPS achieved in a test where 99% of queries completed successfully without throttling and average latency stayed under 1000 ms.

- **Percentage of max QPS** - A percentage of the maximum QPS achieved for a particular test. For example, if a given test reached a maximum of 100 QPS, 20% of max QPS would be 20 QPS.

- **Latency** - The server's latency for a query; these numbers do not include [RTT](https://en.wikipedia.org/wiki/Round-trip_delay). Values below are in milliseconds (ms). 

### Disclaimer

The code we used to run these benchmarks is available [here]() (*link not yet available*). It's worth noting that we observed slightly lower QPS levels with the [JMeter performance testing solution](https://github.com/Azure-Samples/azure-search-performance-testing) than in the benchmarks below. The differences can be attributed to differences in the style of the tests. This speaks to the importance of making your performance tests as similar to your production workload as possible.

These benchmarks in no way guarantee a certain level of performance from your service but can give you an idea of the level of performance you can expect based on your scenario.

If you have any questions or concerns, please reach out to us at azuresearch_contact@microsoft.com.

## Benchmark 1: E-commerce search

:::row:::
   :::column span="":::
     <img src="./media/performance-benchmarks/cdon-logo-320x100.png" alt="CDON Logo" width="150"/>
   :::column-end:::
   :::column span="":::
      This benchmark was created in partnership with the e-commerce company, [CDON](https://cdon.com), the Nordic region's largest online marketplace with operations in Sweden, Finland, Norway and Denmark. Through its 1,500 merchants, CDON offers a wide range assortment that includes over 8 million products. In 2020, CDON had over 120 million visitors and 2 million active customers.
   :::column-end:::
:::row-end:::

To run these tests, we used a snapshot of CDON's production search index and thousands of unique queries from their [website](https://cdon.com).

### Scenario Details

- **Document Count**: 6,000,000 
- **Index Size**: 20 GB
- **Index Schema**: a wide index with 250 fields total, 25 searchable fields, and 200 facetable/filterable fields
- **Query Types**: full text search queries including facets, filters, ordering, and scoring profiles

### S1 Performance

#### Queries per second

The chart below shows the highest query load a service could handle for an extended period of time in terms of queries per second (QPS).

![Highest maintainable QPS](./media/performance-benchmarks/s1-ecom-qps.png)

#### Query latency

Query latency varies based on the load of the service and services under higher stress will have a higher average query latency. The table below show the 25th, 50th, 75th, 90th, 95th, and 99th percentiles of query latency for three different usage levels.

| Percentage of max QPS  | Average latency | 25% | 75% | 90% | 95% | 99%|
|---|---|---|---| --- | --- | --- | 
| 20%  | 104 ms  | 35 ms  | 115 ms   | 177 ms | 257 ms | 738 ms |
| 50%  | 140 ms  | 47 ms  | 144 ms   | 241 ms | 400 ms | 1175 ms |
| 80%  | 239 ms  | 77 ms  | 248 ms   | 466 ms | 763 ms | 1752 ms | 


### S2 Performance

#### Queries per second

The chart below shows the highest query load a service could handle for an extended period of time in terms of queries per second (QPS).

![Highest maintainable QPS](./media/performance-benchmarks/s2-ecom-qps.png)

#### Query latency

Query latency varies based on the load of the service and services under higher stress will have a higher average query latency. The table below show the 25th, 50th, 75th, 90th, 95th, and 99th percentiles of query latency for three different usage levels.

| Percentage of max QPS  | Average latency | 25% | 75% | 90% | 95% | 99%|
|---|---|---|---| --- | --- | --- | 
| 20%  | 56 ms | 21 ms | 68 ms  | 106 ms  | 132 ms | 210 ms | 
| 50%  | 71 ms  | 26 ms  | 83 ms   | 132 ms | 177 ms | 329 ms |
| 80%  | 140 ms  | 47 ms  | 153 ms   | 293 ms | 452 ms | 924 ms | 

### S3 Performance

#### Queries per second

The chart below shows the highest query load a service could handle for an extended period of time in terms of queries per second (QPS).

![Highest maintainable QPS](./media/performance-benchmarks/s3-ecom-qps.png)

In this case, we see that adding a second partition significantly increases the maximum QPS but adding a third partition provides diminishing marginal returns. The smaller improvement is likely because all of the data is already being pulled into the S3's active memory with just two partitions.

#### Query latency

Query latency varies based on the load of the service and services under higher stress will have a higher average query latency. The table below show the 25th, 50th, 75th, 90th, 95th, and 99th percentiles of query latency for three different usage levels.

| Percentage of max QPS  | Average latency | 25% | 75% | 90% | 95% | 99%|
|---|---|---|---| --- | --- | --- | 
| 20%  | 50 ms  | 20 ms  | 64 ms   | 83 ms | 98 ms | 160 ms |
| 50%  | 62 ms  | 24 ms  | 80 ms   | 107 ms | 130 ms | 253 ms |
| 80%  | 115 ms  | 38 ms  | 121 ms   | 218 ms | 352 ms | 828 ms | 

## Benchmark 2: Document search


### Scenario Details

- **Document Count**: 7.5 million
- **Index Size**: 22 GB
- **Index Schema**: 23 fields; 8 searchable, 10 filterable/facetable
- **Query Types**: key word searches with facets and hit highlighting

### S2 Performance

#### Queries per second

The chart below shows the highest query load a service could handle for an extended period of time in terms of queries per second (QPS).

![Highest maintainable QPS](./media/performance-benchmarks/s2-docsearch-qps.png)

#### Query latency

Query latency varies based on the load of the service and services under higher stress will have a higher average query latency. The table below show the 25th, 50th, 75th, 90th, 95th, and 99th percentiles of query latency for three different usage levels.

| Percentage of max QPS  | Average latency | 25% | 75% | 90% | 95% | 99%|
|---|---|---|---| --- | --- | --- | 
| 20%  | 44 ms  | 31 ms  | 54 ms   | 73 ms | 83 ms | 108 ms |
| 50%  | 63 ms  | 39 ms  | 81 ms   | 105 ms | 122 ms | 163 ms |
| 80%  | 115 ms  | 73 ms  | 144 ms   | 190 ms | 222 ms | 289 ms | 
## Benchmark 3: Application search


### Scenario Details

- **Document Count**: 
- **Index Size**: 
- **Index Schema**: 
- **Query Types**: 