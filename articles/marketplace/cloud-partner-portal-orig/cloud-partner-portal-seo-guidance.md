---
title: Azure Marketplace SEO guidance 
description: Provides guidance on maximizing search engine optimization (SEO).
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/09/2019
ms.author: dsindona
---

# Azure Marketplace SEO guidance

This article explains how to maximize your offer's discoverability through the search functionality in the [Azure Marketplace](https://azuremarketplace.microsoft.com) and [AppSource](https://appsource.microsoft.com). 


## General explanation of algorithm

Microsoft marketplaces utilize Azure Cognitive Search for powering the site's search capabilities. The algorithm is based on term frequency–inverse document frequency ([TF-IDF](https://en.wikipedia.org/wiki/Tf–idf)). The standard [Lucene Analyzer](https://lucene.apache.org/core/) is used.

In general, all text fields, categories, and industries and included
into the weightage of the relevance. Specialized terms that are used
infrequently by apps but frequently in your app will generate a higher
match score with search. So including terms like "VM" would offer 
little benefit whereas "Azure search" would be much more specialized.
Below are the most relevant fields to consider.

 
|  Field                   | Importance | Guidance                                                                                            |
|  --------------------    | ----------                   | ---------------                                                                   |
| Offer Name               |  High      | Exact or close to a complete match with search query will yield high ranking.                       |
| Publisher Name           |  High      | Exact or close to a complete match with search query will yield high ranking.                       |
| Short Description        |  Medium    | Given naming of apps and publisher names will almost guarantee a high ranking, it may not be the most relevant. In this case,a short description is critical. Keep the text concise and to the point. Keywords and expected search terms should be included for best result.  For example "This is the best Retail POS built fully on top of Dynamics 365" is less effective than "Retail POS (point of sale) for Dynamics 365".  | 
| Long Description         |  Low       | Description offers a way to go into more depth. The most effective descriptions are of reasonable length and keywords are used.  A to-the-point descriptions using keywords will benefit more than long, lengthy text. Make sure key terms, such as "IoT", are present in description.  |
| Product Categories       | Medium     |  Product categories are determined by a combination of publisher choices and Microsoft. Select these categories appropriately so that users can easily find the apps in the correct category. |
|  |  |  |


## Other Tips

-   Search suggests gets heavy user activity. It prioritizes matches
    against app name/publisher. Short description becomes the key field
    for when the search term is not an exact match with publisher/app
    name.
-   Documents for download are not included in search weightage.
-   Your apps actual acquisition and usage will impact search ranking as
    well. For example, two equivalent apps where one has vastly more users
    will get a higher ranking.
