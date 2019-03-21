---
title: 'Autocomplete example for adding typeahead to a search box - Azure Search'
description: Enable typeahead query actions in Azure Search by creating suggesters and formulating requests that invoke  suggested queries. 
manager: cgronlun
author: heidisteen
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 03/22/2019
ms.author: heidist
---

# Example: Add autosuggest for dropdown query phrases

Search term inputs can include a dropdown list of suggested query terms. You've seen this capability in commercial search engines, and you can implement a similar experience in Azure Search using a [suggester construct](index-add-suggesters.md) and a suggestions operation on a query request. This article is an example of how to formulate an autosuggest query, using a suggester that you've already defined.



