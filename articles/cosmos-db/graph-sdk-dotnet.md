---
title: Azure CosmosDB Graph API .NET SDK & Resources | Microsoft Docs
description: Learn all about the Azure CosmosDB Graph API including release dates, retirement dates, and changes made between each version.
services: cosmos-db
documentationcenter: .net
author: rnagpal
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 05/10/2017
ms.author: mimig

---
# Azure Cosmos DB Graph .NET API: Download and release notes

|   |   |
|---|---|
|**SDK download**|[NuGet](https://aka.ms/acdbgraphnuget)|
|**API documentation**|[.NET API reference documentation](https://aka.ms/acdbgraphapiref)|
|**Quickstart**|[Azure Cosmos DB: Create a graph app using .NET and the Graph API](create-graph-dotnet.md)|
|**Tutorial**|[Azure CosmosDB: Create a container with the Graph API](tutorial-develop-graph-dotnet.md)|
|**Current supported framework**|[Microsoft .NET Framework 4.6.1](https://www.microsoft.com/en-us/download/details.aspx?id=49981)|


## Release notes

### 0.3.0-preview
* Support for `.netstandard 1.6`
  - Removed support for .NET Framework 4.5.1
* New `gremlin-groovy` parser. This complete parser replacement and aims at matchign `gremlin-groovy` syntax.
  * Improves parsing performance x2 
  * Fixes a number of issues related to unescaped characters in queries.
* Optimizations for traversals with edge predicates.
  Traversals similar to `g.V().outE().has('name', 'marko').inV()` should see this improvement.
* Optimizations for `limit()` step.


## Release & Retirement dates
Microsoft will provide notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is recommended that you always upgrade to the latest SDK version as early as possible. 

Any request to Azure Cosmos DB using a retired SDK will be rejected by the service.

## See also
To learn more about the Azure Cosmos DB Graph API, see [Introduction to Azure Cosmos DB: Graph API](graph-introduction.md). 
