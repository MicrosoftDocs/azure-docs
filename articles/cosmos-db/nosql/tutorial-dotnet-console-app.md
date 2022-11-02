---
title: |
  Tutorial: Develop a .NET console application with Azure Cosmos DB for NoSQL
description:  |
  .NET tutorial to create a console application that adds data to Azure Cosmos DB for NoSQL.
author: seesharprun
ms.author: sidandrews
ms.reviewer: esarroyo
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: tutorial
ms.date: 11/02/2022
ms.devlang: csharp
ms.custom: devx-track-dotnet, ignite-2022, cosmos-dev-refresh, cosmos-dev-dotnet-path
---

# Tutorial: Develop a .NET console application with Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Console app language selector](includes/tutorial-console-app-selector.md)]

The Azure SDK for .NET allows you to add data to an API for NoSQL container either [individually]() or by using a [transactional batch](). This tutorial will walk through the process of create a new .NET console application that adds multiple items to a container.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a database using API for NoSQL
> - Create a .NET console application and add the Azure SDK for .NET
> - Add and modify individual items in an API for NoSQL container
> - Create a transaction with batch changes for the API for NoSQL container
>

## Prerequisites

- An existing Azure Cosmos DB for NoSQL account.
  - If you have an Azure subscription, [create a new account](how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](../try-free.md) before you commit.
- [Visual Studio Code](https://code.visualstudio.com)
- [.NET 6 (LTS) or later](https://dotnet.microsoft.com/download/dotnet/6.0)
- Experience writing C# applications.

## Create API for NoSQL resources

## Create .NET console application

## Manage items in a container using the SDK

## Create a transaction using the SDK

## Clean up resources

When no longer needed, delete the database used in this tutorial. To do so, navigate to the account page, select **Data Explorer**, select the `cosmicworks` database, and then select **Delete**.

## Next steps

Now that you've created your first .NET console application using Azure Cosmos DB, try the next tutorial where you'll update an existing web application to use Azure Cosmos DB data.

> [!div class="nextstepaction"]
> [Tutorial: Develop an ASP.NET web application with Azure Cosmos DB for NoSQL](tutorial-dotnet-web-app.md)