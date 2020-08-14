---
# Mandatory fields.
title: Query units in Azure Digital Twins
titleSuffix: Azure Digital Twins
description: Understand the billing concept of query units in Azure Digital Twins
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

# Query units in Azure Digital Twins 

A Query Unit (QU) unit in Azure Digital Twins is a unit of on-demand computation made available to execute your Azure Digital Twins queries using the Query API. It abstracts the system resources such as CPU, IOPS and memory that are required to perform query operation supported by Azure Digital Twins. The complexity of the query affects how many QUs are consumed to execute that query. Query Unit is a Pay-As-You-Go dimension. You pay for number of Query Units consumed to execute your Azure Digital Twins queries. 

## Find the Query Unit charge in Azure Digital Twins 

You can examine the response header to track the number of QUs that are consumed by any Azure Digital Twins query by inspecting “query-charge” in the response sent back from Azure Digital Twins. The SDKs allow you to extract the query-charge header from the pageable response. Here's an example of how to query for digital twins and how to iterate over the pageable response to extract the query-charge header. 


The following code snippet demonstrates how you could extract the query charges incurred when calling the query API. It iterates over the response pages first to access to the query-charge header, and then the digital twin results within each page. 
 
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
 
## Query Unit considerations 

<!-- Need inputs from John and Dan for things that affect the # of query units consumed. -->

## Next steps

For Azure Digital Twins query and Query Unit related limits, see [*Reference: Service limits in public preview*](reference-service-limits.md).

[Query API](https://docs.microsoft.com/rest/api/digital-twins/dataplane/query/querytwins).