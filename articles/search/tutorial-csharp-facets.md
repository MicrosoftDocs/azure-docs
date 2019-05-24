---
title: Tutorial on using facets to improve the efficiency of an Azure Search
description: This tutorial builds on the Create your first app in Azure Search tutorial and the paging tutorial, to add a search of the facets of a given database. Searching on facets is done just once, so can improve the efficiency of a search app. 
services: search
ms.service: search
ms.topic: tutorial
ms.author: v-pettur
author: PeterTurcan
ms.date: 05/01/2019
---

# C# Tutorial: Use facets to improve the efficiency of an Azure Search

Learn how to implement an efficient search for facets, greatly reducing the number of calls to a server for type-ahead or other suggestions. Learn that a facet search is carried out just once when a user first runs the app and that the results stay active for the duration of their session.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Specify certain fields of a data set as Facetable
> * Make the single call for an Azure Search of facets
> * Determine the conditions when a facet search makes most sense

## Prerequisites

To complete this tutorial, you need to:

Have the [C# Tutorial: Page the results of an Azure Search](tutorial-csharp-paging.md) project up and running.

## Install and run the project from GitHub


## Add code for a search of facets

## Takeaways

Another tutorial completed, great work again.

You should consider the following takeaways from this project:

* Facets are an efficient way of getting a helpful user experience without the repeated search calls.
* Facets work well if a manageable (to the user) number of results are displayed when they are typing.
* Facets do not work as well if too many results need to be displayed (or end up being hidden).
* It is imperative to mark each field as Facetable if they are to be included in a facet search.

## Next steps

So far we have limited ourselves to text based searches. In the next tutorial we look at providing additional numerical data in the form of latitude, longitude and radius. And we look at ordering results (up to this point, results are ordered simply in the order that they are located in the database).

> [!div class="nextstepaction"]
> [C# Tutorial: Add geospatial filters to an Azure Search](tutorial-csharp-geospatial-searches.md)