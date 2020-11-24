---
# Mandatory fields.
title: Query Units in Azure Digital Twins
titleSuffix: Azure Digital Twins
description: Understand the billing concept of Query Units in Azure Digital Twins
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 8/14/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Query Units in Azure Digital Twins 

An Azure Digital Twins **Query Unit (QU)** is a unit of on-demand computation that's used to execute your [Azure Digital Twins queries](how-to-query-graph.md) using the [Query API](/rest/api/digital-twins/dataplane/query). 

It abstracts away the system resources like CPU, IOPS and memory that are required to perform query operations supported by Azure Digital Twins, allowing you to track usage in Query Units instead.

The amount of Query Units consumed to execute a query is affected by...

* the complexity of the query
* the size of the result set (so a query returning 10 results will consume more QUs than a query of similar complexity that returns just one result)

This article explains how to understand Query Units and track Query Unit consumption.

## Find the Query Unit consumption in Azure Digital Twins

When you run a query using the Azure Digital Twins [Query API](/rest/api/digital-twins/dataplane/query), you can examine the response header to track the number of QUs that the query consumed. Look for "query-charge" in the response sent back from Azure Digital Twins.

The Azure Digital Twins [SDKs](how-to-use-apis-sdks.md) allow you to extract the query-charge header from the pageable response. This section shows how to query for digital twins and how to iterate over the pageable response to extract the query-charge header. 

The following code snippet demonstrates how you can extract the query charges incurred when calling the query API. It iterates over the response pages first to access the query-charge header, and then iterates over the digital twin results within each page. 

```csharp
AsyncPageable<string> asyncPageableResponseWithCharge = client.QueryAsync("SELECT * FROM digitaltwins");
int pageNum = 0;

// The "await" keyword here is required, as a call is made when fetching a new page.

await foreach (Page<string> page in asyncPageableResponseWithCharge.AsPages())
{
    Console.WriteLine($"Page {++pageNum} results:");

    // Extract the query-charge header from the page

    if (QueryChargeHelper.TryGetQueryCharge(page, out float queryCharge))
    {
        Console.WriteLine($"Query charge was: {queryCharge}");
    }

    // Iterate over the twin instances.

    // The "await" keyword is not required here, as the paged response is local.

    foreach (string response in page.Values)
    {
        BasicDigitalTwin twin = JsonSerializer.Deserialize<BasicDigitalTwin>(response);
        Console.WriteLine($"Found digital twin '{twin.Id}'");
    }
}
```

## Next steps

To learn more about querying Azure Digital Twins, visit:

* [*Concepts: Query language*](concepts-query-language.md)
* [*How-to: Query the twin graph*](how-to-query-graph.md)
* [Query API reference documentation](/rest/api/digital-twins/dataplane/query/querytwins)

You can find Azure Digital Twins query-related limits in [*Reference: Service limits*](reference-service-limits.md).