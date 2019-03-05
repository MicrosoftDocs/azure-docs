---
title: Python quickstart
description: Learn how to build and query your first index in Azure Search using built-in sample data and the Import Data wizard in the Azure portal. 
author: HeidiSteen
manager: cgronlun
tags: azure-portal
services: search
ms.service: search
ms.topic: tutorial
ms.date: 02/13/2019
ms.author: heidist
ms.custom: seodec2018
#Customer intent: As a developer, I want a low-impact introduction to index design.
---
# Quickstart: Index, load, and query in Azure Search using Python

Intro

## Create an index

## Load data

## Query data

## Takeaways

This tutorial provided a quick introduction to Azure Search using the Azure portal.

You learned how to create a search index using the **Import data** wizard. You learned about [indexers](search-indexer-overview.md), as well as the basic workflow for index design, including [supported modifications to a published index](https://docs.microsoft.com/rest/api/searchservice/update-index).

Using the **Search explorer** in the Azure portal, you learned some basic query syntax through hands-on examples that demonstrated key capabilities such as filters, hit highlighting, fuzzy search, and geo-search.

You also learned how to find indexes, indexers, and data sources in the portal. Given any new data source in the future, you can use the portal to quickly check its definitions or field collections with minimal effort.

## Clean up

If this tutorial was your first use of the Azure Search service, delete the resource group containing the Azure Search service. If not, look up the correct resource group name from the list of services and delete the appropriate one.

## Next steps

You can explore more of Azure Search using the programmatic tools:

* [Create an index using .NET SDK](https://docs.microsoft.com/azure/search/search-create-index-dotnet)
* [Create an index using REST APIs](https://docs.microsoft.com/azure/search/search-create-index-rest-api)
* [Create an index using Postman or Fiddler and the Azure Search REST APIs](search-fiddler.md)