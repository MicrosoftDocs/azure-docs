<properties 
	pageTitle="Latest updates to Azure Search" 
	description="Release notes for Azure Search describing the latest updates to the service" 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe" 
	editor=""/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="02/11/2015" 
	ms.author="heidist"/>

#Latest updates to Azure Search Preview#

This page announces new features recently added to Azure Search. Older posts will be retired after 6 months to keep the page length manageable, but you can always refer to the feature list in [Azure Search Overview](https://msdn.microsoft.com/en-us/library/azure/dn798933.aspx) to see what the service provides.

Azure Search has been in public preview since August 2014, with a corresponding API version of `2014-07-31-Preview`. This version has remained largely unchanged throughout the preview.

However, over the last several months, we've continued to add new features via  a follow-up API version (`2014-10-20-Preview`). [Versioning](https://msdn.microsoft.com/en-us/library/azure/dn864560.aspx) the API allows us to isolate changes that could potentially break existing applications. By branching the API, you can control the API rollout in your solution. It's up to you to determine when and if you use the newest features.

The following features are all part of the [2014-10-20-Preview API](http://azure.microsoft.com/documentation/articles/search-api-2014-10-20-preview/).

##Notes for January 12, 2015##

+ Infix matching and fuzzy matching on suggestions via the new Suggesters API. This feature was announced in this [Azure blog post](http://azure.microsoft.com/blog/2015/01/20/azure-search-how-to-add-suggestions-auto-complete-to-your-search-applications/), and is further explains in [this video](http://channel9.msdn.com/Shows/Data-Exposed/DataExposedAzureSearchSuggestions). You can download [this code sample]() to try it out.
+ Tag scoring function that enables personalized scoring of search results, enabling an entirely new scenario for scoring profiles. See [this blog post](http://azure.microsoft.com/blog/2015/02/05/personalizing-search-results-announcing-tag-boosting-in-azure-search/) for details.

##Notes for December 2, 2014##

+ Edm.Int64 data type for index fields. See [Supported data types](https://msdn.microsoft.com/en-us/library/azure/dn798938.aspx) for the full list.

##Notes for October 27, 2014##

+ Language support via the `analyzer` property added support for multiple languages. See [Language Support](https://msdn.microsoft.com/en-us/library/azure/dn879793.aspx) for more information.