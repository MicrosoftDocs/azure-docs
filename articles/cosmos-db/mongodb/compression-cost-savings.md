---
title: Improve performance and optimize costs when upgrading to Azure Cosmos DB API for MongoDB 4.0+
description: Learn how upgrading your API for MongoDB account to versions 4.0+ saves you money on queries and storage.
author: gahl-levy
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 09/06/2022
ms.author: gahllevy
ms.subservice: mongodb
---

# Improve performance and optimize costs when upgrading to Azure Cosmos DB API for MongoDB 4.0+
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Azure Cosmos DB API for MongoDB introduced a new data compression algorithm in versions 4.0+ that saves up to 90% on RU and storage costs. Upgrading your database account to versions 4.0+ and following this guide will help you realize the maximum performance and cost improvements. 

## How it works
The API for MongoDB charges users based on how many [request units](../request-units.md) (RUs) are consumed for each operation. With the new compression format, a reduction in storage size and query size directly results in a reduction in RU usage, saving you money. Performance and costs are coupled in Cosmos DB.

When [upgrading](upgrade-version.md) from an API for MongoDB database account versions 3.6 or 3.2 to version 4.0 or greater, all new documents (data) written to that account will be stored in the improved compression format. Older documents, written before the account was upgraded, remain fully backwards compatible, but will remain stored in the older compression format.

## Upgrading older documents
When upgrading your database account to versions 4.0+, it's good idea to consider upgrading your older documents as well. Doing so will provide you with efficiency improvements on your older data as well as new data that gets written to the account after the upgrade. The following steps upgrade your older documents to the new compression format:

1. [Upgrade](upgrade-version.md) your database account to 4.0 or higher. Any new data that's written to any collection in the account will be written in the new format. All formats are backwards compatible. 
2. Update at least one field in each old document (from before the upgrade) to a new value or change the document in a different way- such as adding a new field. Don't rewrite the exact same document since the Cosmos DB optimizer will ignore it.
3. Repeat step two for each document. When a document is updated, it will be written in the new format.


## Next steps
Learn more about upgrading and the API for MongoDB versions:
* [Introduction to the API for MongoDB](introduction.md)
* [Upgrade guide](upgrade-version.md)
* [Version 4.2](feature-support-42.md)
