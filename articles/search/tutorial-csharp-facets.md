---
title: Tutorial on using facets to improve the efficiency of an Azure Search
description: This tutorial builds on the paging Azure Search tutorial, to add a search of the facets of a given database. Searching on facets is done just once when the app is initiated, so can improve the efficiency of a search app by avoided repeated search calls.
services: search
ms.service: search
ms.topic: tutorial
ms.author: v-pettur
author: PeterTurcan
ms.date: 05/01/2019
---

# C# Tutorial: Use facets to improve the efficiency of an Azure Search

Learn how to implement an efficient search for facets, greatly reducing the number of calls to a server for type-ahead or other suggestions. Learn that a facet search is carried out just once when a user first runs the app and that the results stay active for the duration of their session. A facet can be considered to be an attribute of the data (such as a pool in our hotels data) and a facet search collects all these attributes up when the app is initiated and presents them to the user whenever their typing matches throughout their session with the app.

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

We will use the numbered paging app you might have completed in the second tutorial as a basis for this sample.

To implement facets we do not need to change any of the models (data classes). We just need to add some script to the view and an action to the controller.

### Start with the numbered paging Azure Search app

1. If you created it yourself and have the project handy, start from there. Alternatively download the numbered paging app from here.
xxxx

2. Run the project to make sure it works!
1. 
### Examine the model fields marked as Facetable

### Add an autocomplete script to the view

### Add a facet action to the controller




### Compile and run your project

## Takeaways

Another tutorial completed, great work again.

You should consider the following takeaways from this project:

* Facets are an efficient way of getting a helpful user experience without the repeated search calls.
* Facets work well if a manageable (to the user) number of results are displayed when they are typing.
* Facets do not work as well if too many results need to be displayed (or end up being hidden).
* It is imperative to mark each field as Facetable if they are to be included in a facet search.
* Facets are an alternative to autocomplete/suggestions, not an addition.

## Next steps

So far we have limited ourselves to text based searches. In the next tutorial we look at providing additional numerical data in the form of latitude, longitude and radius. And we look at ordering results (up to this point, results are ordered simply in the order that they are located in the database).

> [!div class="nextstepaction"]
> [C# Tutorial: Add geospatial filters to an Azure Search](tutorial-csharp-geospatial-searches.md)