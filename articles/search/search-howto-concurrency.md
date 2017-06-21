---
title: How to manage concurrent writes to an index in Azure Search
description: Optimistic write locks on indexes to avoid collisions on indexing updates
services: search
documentationcenter: ''
author: HeidiSteen
manager: jhubbard
editor: ''
tags: azure-portal

ms.assetid: 
ms.service: search
ms.devlang: 
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 06/20/2017
ms.author: heidist

---
# How to manage concurrent writes to an index in Azure Search

In a multi-user development environment, you can avoid overwriting changes to an Azure Search index by implementing optimistic concurrency in API calls that write to an index.

The XXX is exposed in both the REST API and .NET SDK. 

Typically, index creation occurs infrequently, but updates occur all the time. Common cases for writing to an index include:

+ Add, remove, delete or update documents in an index.
+ Add, remove, delete or change Fields collection of an index (changing a field attribute).
+ Add, remove, delete or change other constructs associated with an index: Analyzers, Indexers, DataSources, Suggesters, ScoringProfiles.

Concurrency management is of particular concern for the last two use cases, when the risk involves structural changes to the index.

Question: why wouldn't a developer be worried about document overwrites?

Question: are there any protections against overwriting service level changes? For example, adjust scale, key generation, or are etags index-down only.

## Approach

Include eTags in REST API calls or XXXX in .NET SDK calls to check for pre-existing changes to the object.

## Example: before and after 

adding a suggester --- base code looks like this

After code.



## Next steps


## See also



