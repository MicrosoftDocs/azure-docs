---
title: Azure Cosmos DB continuation model | Microsoft Docs
description: Azure Cosmos DB continuation model
services: documentdb
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''
tags: ''

ms.assetid: 
ms.service: documentdb
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 04/14/2017
ms.author: mimig

---

# Azure Cosmos DB continuation model

Azure Cosmos DB supports long running queries via continuation tokens. Azure Cosmos DB allocates a fixed amount of time and resources to each query, and when that is reached, returns a continuation token in the x-ms-continuation-token response header, which acts as a bookmark for resuming execution. Each batch of results is a single page, and if the query results cannot fit within a single page, then the REST API returns the x-ms-continuation-token header. Clients can paginate results by including the header in subsequent results

Azure Cosmos DB does not maintain additional state server side for a query; all of this is self-contained within the token, which means they never expire and can be cached by clients. 

```
/* Query that scans documents to build a COUNT client-side */
SELECT VALUE 1
FROM loggedMetrics
WHERE loggedMetrics.startTime >= "2015-12-12T10:00:00Z” 
```

If you have queries like the one shown above, then you may see a 2-3x reduction in RU consumption and execution time when usin the continuation token.

The number of pages can be controlled using the MaxItemCount setting. Developers can also explicitly control paging by creating an IDocumentQueryable using the IQueryable object, then by reading the ResponseContinuationToken values and passing them back as RequestContinuationToken in FeedOptions. Refer the .NET samples project for more samples on queries. 

## What is the lifespan of continuation tokens?

Azure Cosmos DB works with the tokens forever. There is no limit on the lifespan.

Azure Cosmos DB can support them forever because the continuation token is logical and our read/query APIs know how to proceed from the point at which the token was created. Since the results are returned based on an internal sort order, the readers can always make the correct forward progress. 

## Next steps

Learn more about Azure Cosmos DB in the [multi-model introduction](documentdb-multi-model-introduction.md).




