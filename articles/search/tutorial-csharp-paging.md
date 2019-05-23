---
title: Tutorial on paging the results of an Azure Search
description: This tutorial builds on the Create your first app in Azure Search tutorial with the choice of two types of paging. The first paging system uses a range of page numbers as well as next and previous options. The second paging system uses infinite paging, triggered by vertical scrolling.
services: search
ms.service: search
ms.topic: tutorial
ms.author: v-pettur
author: PeterTurcan
ms.date: 05/01/2019
---

# C# Tutorial: Page the results of an Azure Search

Learn how to implement two different systems of paging, the first based on page numbers and the second on infinite scrolling. This tutorial builds on the Create your first app in Azure Search tutorial. Both systems of paging are popular across the internet and selecting the right one can depend on the type of search that is being carried out and the user experience you would like with the results.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Page results with first/previous/next/last options in addition to a range of page numbers
> * Page results based on a vertical scroll, often called "infinite paging"

## Prerequisites

To complete this tutorial, you need to:

Have the [C# Tutorial: Create your first app in Azure Search](tutorial-csharp-create-first-app.md) project up and running.

## Install and run the projects from GitHub



## Extend your app to add numbered paging

## Extend your app to add infinite paging

## Takeaways

Good job on finishing this tutorial.

You should consider the following takeaways from this project:

* Numbered paging is perhaps the most robust for searches where the order of the results is somewhat arbitrary, meaning there may well be something of interest to your users on the later pages.
* Infinite paging is perhaps most robust when the order of results is particularly important. For example, the distance from the center of a destination city. 
* Numbered paging allows for some better navigation, for example, a user can remember that an interesting result was on page 6, whereas no such easy navigation exists in infinite paging.
* Infinite paging has an easy appeal, just scrolling down with no fussy page numbers to click on.
* A key feature of infinite paging is that you are appending to an existing page, not replacing that page. This keeps it efficient.


## Next steps

The next two tutorials use numbered paging. The later tutorial on geospatial searching uses infinite paging.

> [!div class="nextstepaction"]
> [C# Tutorial: Add autocompletion and suggestions to an Azure Search](tutorial-csharp-type-ahead-and-suggestions.md)
