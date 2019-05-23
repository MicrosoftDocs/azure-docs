---
title: Tutorial on autocompletion and suggestions in an Azure Search
description: This tutorial builds on the Create your first app in Azure Search tutorial and the paging tutorial, to add autocompletion and suggestions.
services: search
ms.service: search
ms.topic: tutorial
ms.author: v-pettur
author: PeterTurcan
ms.date: 05/01/2019
---

# C# Tutorial: Add autocompletion and suggestions to an Azure Search

Learn how to implement autocompletion (type-ahead and suggestions) when a user starts typing into your search box. In this tutorial we will show type-ahead results and suggestion results separately, then show a method of combining them to create a richer user experience. A user may only have to type two or three keys to locate all the results that are available.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Add a drop down list of suggestions for your user in an Azure Search
> * Add a drop down list of autocompleted words in an Azure Search
> * Combine suggestions and autocompletion to further improve the user experience

## Prerequisites

To complete this tutorial, you need to:

Have the [C# Tutorial: Page the results of an Azure Search](tutorial-csharp-paging.md) project up and running.

## Install and run the project from GitHub

## Add suggestions to an Azure Search

## Add autocompletion to an Azure Search

## Combine autocompletion and suggestions in an Azure Search

## Takeaways

A third tutorial completed, great work!

You should consider the following takeaways from this project:

* Autocompletion (also known as "type ahead") and suggestions enable the user to just type a few keys to locate exactly what they want.
* Working with the UI can test your limits and patience with javascript/HTML/JQuery and other UI technologies.
* Autocompletion and suggestions working together can provide a rich user experience.


## Next steps

One of the issues with autocompletion and suggestions is that they involve repeated calls to the server. If this results in slower than expected responses then the user experience diminishes. Facets are an interesting alternative to avoid these repeated calls.

> [!div class="nextstepaction"]
> [C# Tutorial: Use facets to improve the efficiency of an Azure Search](tutorial-csharp-facets.md)