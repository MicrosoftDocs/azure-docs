---
title: Performance fundamentals
titleSuffix: Azure Cognitive Search
description: TBD

author: LiamCavanagh
ms.author: liamca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 04/06/2021
---

# Performance fundamentals in Azure Cognitive Search

TBD

## Performance benchmarks

In any large implementation, it is critical to do a performance benchmarking test of your Cognitive Search service before you roll it into production. As mentioned earlier, it is important to not only test the search query load that you expect, but also the data ingestion that is expected.  Having benchmark numbers helps to validate the proper search tier, configuration (replicas and partitions) as well as the search query latency that you will see.

To perform this benchmarking, we recommend the "azure-search-performance-testing" tool.

## Standard S1 vs Standard S2

The Standard S1 search tier is one of the most popular tiers for customers to use.  Over time, the size of indexes in this service will often grow as more data is added leading to the usage of additional partitions.  As more data is added, it will also impact how fast the search service can return search results as well as how many QPS it can handle.  This results in the need to add additional replicas to handle the query load and as a result increased service cost.

One question that is important to ask is whether it would be beneficial to consider leveraging a higher tier SKU as opposed to increasing the number of partitions or replicas.  

Let’s look at an example. Let’s say that there is a search service with the current topology:

+ Standard S1 SKU
+ Index Size: 190 GB
+ Partition Count: 8 (since S1’s handle 25 GB / partition)
+ Replica Count: 2
+ Total Search Units: 16 (8 partitions x 2 replicas)
+ Total Retail Price: ~$4,000 USD / month ($250 USD x 12 search units)

Let’s imagine that this service administrator is seeing higher latency rates and is considering adding another replica.  This would change the replica count from 2 to 3 and as a result change the Search Unit count to 24 and a resulting price of $6,000 USD/month.

However, if the administrator chose to move to a Standard S2 tier the topology would look like:

+ Standard S2 SKU
+ Index Size: 190 GB
+ Partition Count: 2 (since S2’s handle 100 GB / partition)
+ Replica Count: 2
+ Total Search Units: 4 (2 partitions x 2 replicas)
+ Total Retail Price: ~$4,000 USD / month ($1000 USD x 4 search units)

Notice that it is the same price between the original S1 vs the S2. Even though the S2 search service is 4 times the price, it is also in most cases more than 4 times as capable of the S1. For example, the S2 is backed by premium storage which makes indexing of content faster, and it has much more compute as well as extra memory.  An important benefit of extra memory is that more of the index can be cached, resulting in lower search latency, and a greater number of QPS.  With this extra power, the administrator may not need to even need to increase the replica count and so may end up paying less than if they stayed with the S1.

## Analyze performance of individual queries

In some cases, it can be useful to test individual queries to see how they are performing. To do this, it is important to be able to see how long the search service takes to complete the work, as well as how long it takes to make the round-trip request from the client and back to the client.  The diagnostics logs could be used to look up individual operations, but it might be easier to do this all from a client tool, such as Postman.

In the example below, a REST-based search query was executed. Cognitive Search includes in every response the number of milliseconds it takes to complete the query, visible in the Headers tab, in "elapsed-time".  Next to Status at the top of the response, you'll find the round-trip duration. in this case, 418 milliseconds. In the results section, the “Headers” tab was chosen. Using these two values highlighted with a Red box in the image below, we see the search service took 21 ms to complete the search query and the entire client round trip request took 125 ms.  By subtracting these two numbers we can determine that it took 104 ms additional time to transmit the search query to the search service and to transfer the search results back to the client.

This can be extremely helpful to determine if there might be network latencies or other factors impacting query performance.

:::image type="content" source="media/search-performance/perf-elapsed-time.png" alt-text="Query duration metrics" border="true":::

## Optimize index schema through selective attribution

An extremely common mistake that administrators make when creating a search index is selecting all available properties for the fields, as opposed to only selecting just the properties that are needed. For example, if a field doesn't need to be full text searchable, skip that field when setting the searchable attribute.
  
Ramifications for selecting unnecessary properties for fields include:

+ Degradation of indexing performance due to the extra work required to process the content in the field and then store this within the search inverted index.
+ Causes more storage than is required to be used, creating a larger surface that each query has to cover.
+ Increases the amount of storage the search index uses and as a result the cost of the search service due to the extra information needed to support the selected property.
+ In many cases limits the capabilities of the field. For example, if a field is facetable, filterable, and searchable, you can only store 16K of text within a field, whereas if it is only searchable you can store up to 16MB of text in the field. 

:::image type="content" source="media/search-performance/perf-selective-field-attributes.png" alt-text="Selective attribution" border="true":::

## Impact of complex types

Complex data types are useful when data has a complicated nested structure, such as the parent-child elements found in JSON documents. The downside of complex types is the extra storage requirements and additional resources required to index the content, in comparison to non-complex data types. 

In some cases, you can avoid these tradeoffs by mapping a complex data structure to a simpler field type, such as a Collection.Alternatively, you might opt for flattening a field hierarchy into individual root-level fields.

:::image type="content" source="media/search-performance/perf-flattened-field-hierarchy.png" alt-text="flattened field structure" border="true":::

### Filters vs Search.in

As a query uses more filters values, the performance of the search query will degrade. 

Consider the following example:

```json
$filter= userid eq 123 or userid eq 234 or userid eq 345 or userid eq 456 or userid eq 567
```

In this case, the filter expressions are used to check whether a single field in each document is equal to one of many possible values. You might find this pattern in applications that implement security trimming (checking a field containing one or more principal IDs against a list of principal IDs representing the user issuing the query). 

A more efficient way to execute filters that contain a large number of values is to use `search.in`, as shown in this example:

```json
search.in(userid, '123,234,345,456,567', ',')
```

## Next steps

TBD