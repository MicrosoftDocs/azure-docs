---
title: Projections introduction and overview - Azure Search
description: Use projections to create contextual views of data forms in an Azure Search knowledge store.
manager: eladz
author: vkurpad
services: search
ms.service: search
ms.devlang: NA
ms.topic: overview
ms.date: 05/02/2019
ms.author: vikurpad

---
# Working with projections in a knowledge store (Azure Search)

Projections are views of enriched documents that can be saved to storage. A knowledge store allows you to "project" your data into a shape that aligns with your needs and preserves the relationships so tools like Power BI can read the data with no additional effort. Projections can be tabular, with data stored in rows and columns or objects, or objects with data stored in JSON blobs.  

You can define multiple projections of your data as it is being enriched. This is useful when you want the same data shaped differently for individual use cases. For an example of how to define projections in a skillset, see [How to create a knowledge store](knowledge-store-howto.md). 
 
Azure Search enables you to enrich your content with AI skills before you insert them into the index. These enrichments add structure to your documents and make your search service more effective. In many instances, the enriched documents are useful for scenarios other than search as well. Projections are a feature in the knowledge store that allows you to save your enriched document in the shape that best enables these other applications. 

[Knowledge Store](knowledge-store-concept-intro.md) is a preview feature that supports two types of projections: 

+ **Tables**: For scenarios where you have data that is best represented as rows and columns, table projections allow you to define a schematized shape or projection in table storage. 

+ **Objects**: When you need a JSON representation of your data and enrichments, object projections you define are saved as blobs. 

As a next step, create your first knowledge store using sample data and instructions. For more information, see [How to create a knowlege store](knowledge-store-howto.md).
