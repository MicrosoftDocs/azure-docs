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

# Latest updates to Azure Search Preview

This page describes recent changes introduced in Azure Search. This list is updated whenever there is a feature change. Older posts will be retired after 6 months to keep the page length manageable, but you can always refer to the feature list in [Azure Search Overview](https://msdn.microsoft.com/en-us/library/azure/dn798933.aspx) for the status of existing functionality.

Azure Search has been in public preview since August 2014, with a corresponding API version of `2014-07-31-Preview`. This version has remained largely unchanged throughout the preview.

Newer features have been introduced throughout the preview in a follow-up API version (`2014-10-20-Preview`). [Versioning](https://msdn.microsoft.com/en-us/library/azure/dn864560.aspx) the API allows us to isolate changes that could potentially break existing applications. Branching the API for significant feature changes gives you control over API rollouts and lets you determine when and if you use the newer features.

The following features are all part of the `2014-10-20-Preview` API.

##Notes for January 12, 2015##

+ Infix matching and fuzzy matching on suggestions via the new Suggesters API in [2014-10-20-Preview](http://azure.microsoft.com/en-us/documentation/articles/search-api-2014-10-20-preview/).
+ Tag scoring function that enables personalized scoring of search results. This function is in [2014-10-20-Preview](http://azure.microsoft.com/en-us/documentation/articles/search-api-2014-10-20-preview/).

##Notes for December 2, 2014##

+ Edm.Int64 data type for indexes. See [Supported data types](https://msdn.microsoft.com/en-us/library/azure/dn798938.aspx) for the full list.

##Notes for October 27, 2014##

+ Language support via the `analyzer` property. See [Language Support](https://msdn.microsoft.com/en-us/library/azure/dn879793.aspx) for details.