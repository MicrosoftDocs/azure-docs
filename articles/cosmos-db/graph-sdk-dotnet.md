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
ms.date: 10/17/2017
ms.author: mimig

---
# Azure Cosmos DB Graph .NET API: Download and release notes

|   |   |
|---|---|
|**SDK download**|[NuGet](https://aka.ms/acdbgraphnuget)|
|**API documentation**|[.NET API reference documentation](https://aka.ms/acdbgraphapiref)|
|**Quickstart**|[Azure Cosmos DB: Create a graph app using .NET and the Graph API](create-graph-dotnet.md)|
|**Tutorial**|[Azure CosmosDB: Create a container with the Graph API](tutorial-develop-graph-dotnet.md)|
|**Current supported framework**| [Microsoft .NET Framework 4.6.1](https://www.microsoft.com/en-us/download/details.aspx?id=49981)</br> [Microsoft .NET Core](https://www.microsoft.com/net/download/core) |


## Release notes

### <a name="0.3.1-preview"/>0.3.1-preview

#### Bug fixes
* Fix to optionally load `appsettings.json` (`netstandard1.6`)

#### What's new
* Switch Microsoft.Azure.Graphs to target platform AnyCPU.
* Remove Mono assembly from `net461` package manifest.

### <a name="0.3.0-preview"/>0.3.0-preview

#### What's new
* Added support for `.netstandard 1.6`
  * Requires `Microsoft.Azure.DocumentDB.Core >= 1.5.1`
* Added a new `gremlin-groovy` parser to replace existing parser. This parser supports a subset of Tinkerpop's `gremlin-groovy` syntax and includes:
  * Improved parsing performance by 2x.
  * Resolved a number of issues related to character escaping in strings, incorrectly handled literal values, and other irregularities in the old parser.
* Added optimizations for traversals with edge predicates.
  *  Traversal hops with filters should see this improvement, for example: `g.V('1').outE().has('name', 'marko').inV()`.
* Added optimizations for traversals with `limit()` step.

#### Breaking Changes
* Removed support for .NET Framework 4.5.1

* The new parser aligns with `gremlin-groovy` grammar. As a result, some expressions that worked previously are ambiguous for the new parser. One case of note:
  * `in` and `as` are reserved keywords in `gremlin-groovy`, so these steps must be qualified with `.in()` or `.as()` to avoid syntax errors. For example:
 `g.V().repeat(in()).times(2)` -> _throws a syntax error_  
 `g.V().repeat(__.in()).times(2)` -> _succeeds_

### <a name="0.2.4-preview"/>0.2.4-preview

### <a name="0.2.2-preview"/>0.2.2-preview

### <a name="0.2.1-preview"/>0.2.1-preview

### <a name="0.2.0-preview"/>0.2.0-preview

### <a name="0.1.0-preview"/>0.1.0-preview
* Initial preview release.

## Release & Retirement dates
Microsoft will provide notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is recommended that you always upgrade to the latest SDK version as early as possible. 

Any request to Azure Cosmos DB using a retired SDK will be rejected by the service.

<br/>

| Version | Release Date | Retirement Date |
| --- | --- | --- |
| [0.3.1-preview](#0.3.1-preview) |October 17, 2017 |--- |
| [0.3.0-preview](#0.3.0-preview) |October 2, 2017 |--- |
| [0.2.4-preview](#0.2.4-preview) |August 4, 2017 |--- |
| [0.2.2-preview](#0.2.2-preview) |June 23, 2017 |--- |
| [0.2.1-preview](#0.2.2-preview) |June 8, 2017 |--- |
| [0.2.0-preview](#0.2.2-preview) |May 10, 2017 |--- |
| [0.1.0-preview](#0.1.0-preview) |May 8, 2017 |--- |

## See also
To learn more about the Azure Cosmos DB Graph API, see [Introduction to Azure Cosmos DB: Graph API](graph-introduction.md). 
