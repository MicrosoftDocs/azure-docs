---
title: Import Cassandra data into Azure Cosmos DB | Microsoft Docs
description: Learn how to use the CQL Copy command to copy Cassandra data into Azure Cosmos DB.
services: cosmos-db
author: govindk
manager: jhubbard
documentationcenter: ''

ms.assetid: eced5f6a-3f56-417a-b544-18cf000af33a
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/15/2017
ms.author: govindk
ms.custom: mvc
---
# Azure Cosmos DB: Import Cassandra data

This tutorial provides instructions on importing Cassandra data into Azure Cosmos DB using the CQL COPY command. 

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Importing data using CQL

## Prerequisites

Data copied from Cassandra should be placed in tables in an Azure Cosmos DB Cassandra API account. To create an Azure Cosmos DB account, see [Create a database account](create-cassandra-java.md#create-a-database-account).

## Import data

To import data Cassandra data into Azure Cosmos DB, use the CQL COPY command.

1. Export data from Cassandra to a csv file using the [COPY TO](http://cassandra.apache.org/doc/latest/tools/cqlsh.html) command.
2. Import to Azure Cosmos DB from the csv file using the [COPY FROM](http://cassandra.apache.org/doc/latest/tools/cqlsh.html) command. 

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Imported data using CQL

You can now proceed to the Concepts section for more information about Azure Cosmos DB. 

> [!div class="nextstepaction"]
>[Tunable data consistency levels in Azure Cosmos DB](../cosmos-db/consistency-levels.md)
