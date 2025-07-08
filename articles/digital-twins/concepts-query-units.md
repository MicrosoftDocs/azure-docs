---
title: Query Units in Azure Digital Twins
titleSuffix: Azure Digital Twins
description: Learn about the billing concept of Query Units in Azure Digital Twins
author: baanders
ms.author: baanders
ms.date: 04/11/2025
ms.topic: concept-article
ms.service: azure-digital-twins
---

# Query Units in Azure Digital Twins 

This article covers Query Units, how they're used by Azure Digital Twins, and how to find the Query Unit consumption in Azure Digital Twins.

An Azure Digital Twins *Query Unit (QU)* is a unit of on-demand computation that's used to execute your [Azure Digital Twins queries](how-to-query-graph.md) using the [Query API](/rest/api/digital-twins/dataplane/query). 

It abstracts away the system resources like CPU, IOPS, and memory that are required to perform query operations supported by Azure Digital Twins, allowing you to track usage in Query Units instead.

The amount of Query Units consumed to execute a query is affected by:

* The complexity of the query
* The size of the result set (so a query returning 10 results consumes more QUs than a query of similar complexity that returns just one result)

This article explains how to understand Query Units and track Query Unit consumption.

## Find the Query Unit consumption in Azure Digital Twins

When you run a query using the [Azure Digital Twins Query API](/rest/api/digital-twins/dataplane/query), you can examine the response header to track the number of QUs that the query consumed. Look for "query-charge" in the response sent back from Azure Digital Twins.

The [Azure Digital Twins SDKs](concepts-apis-sdks.md) allow you to extract the query-charge header from the pageable response. This section shows how to query for digital twins and how to iterate over the pageable response to extract the query-charge header. 

The following code snippet demonstrates how you can extract the query charges incurred when calling the Query API. It iterates over the response pages first to access the query-charge header, and then iterates over the digital twin results within each page. 

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/getQueryCharges.cs":::

## Next steps

To learn more about querying Azure Digital Twins, visit:

* [Azure Digital Twins query language](concepts-query-language.md)
* [Query the Azure Digital Twins twin graph](how-to-query-graph.md)
* [Query API reference documentation](/rest/api/digital-twins/dataplane/query/query-twins)

You can find Azure Digital Twins query-related limits in [Azure Digital Twins service limits](reference-service-limits.md).