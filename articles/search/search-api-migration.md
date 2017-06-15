---
title: Upgrading to the Azure Search Service REST API version 2016-09-01 | Microsoft Docs
description: Upgrading to the Azure Search Service REST API version 2016-09-01
services: search
documentationcenter: ''
author: brjohnstmsft
manager: pablocas
editor: ''

ms.assetid: 6183fa6c-48bb-4af7-adae-4be3bc43c3ed
ms.service: search
ms.devlang: rest-api
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 10/27/2016
ms.author: brjohnst
---
# Upgrading to the Azure Search Service REST API version 2016-09-01
If you're using version 2015-02-28 or 2015-02-28-Preview of the [Azure Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx), this article will help you upgrade your application to use the next generally available API version, 2016-09-01.

Version 2016-09-01 of the REST API contains some changes from earlier versions. These are mostly backward compatible, so changing your code should require only minimal effort, depending on which version you were using before. See [Steps to upgrade](#UpgradeSteps) for instructions on how to change your code to use the new API version.

> [!NOTE]
> Your Azure Search service instance supports several REST API versions, including the latest one. You can continue to use a version when it is no longer the latest one, but we recommend that you migrate your code to use the newest version.

<a name="WhatsNew"></a>

## What's new in version 2016-09-01
Version 2016-09-01 is the second generally available release of the Azure Search Service REST API. New features in this API version include:

* [Custom analyzers](https://aka.ms/customanalyzers), which allow you to take control over the process of converting text into indexable and searchable tokens.
* [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md) and [Azure Table Storage](search-howto-indexing-azure-tables.md) indexers, which allow you to easily import data from Azure storage into Azure Search on a schedule or on-demand.
* [Field mappings](search-indexer-field-mappings.md), which allow you to customize how indexers import data into Azure Search.
* ETags, which allow you to update the definitions of indexes, indexers, and data sources in a concurrency-safe manner. 

<a name="UpgradeSteps"></a>

## Steps to upgrade
If you are upgrading from version 2015-02-28, you probably won't have to make any changes to your code, other than to change the version number. The only situations in which you may need to change code are when:

* Your code fails when unrecognized properties are returned in an API response. By default your application should ignore properties that it does not understand.
* Your code persists API requests and tries to resend them to the new API version. For example, this might happen if your application persists continuation tokens returned from the Search API (for more information, look for `@search.nextPageParameters` in the [Search API Reference](https://msdn.microsoft.com/library/azure/dn798927.aspx#Anchor_1)).

If either of these situations apply to you, then you may need to change your code accordingly. Otherwise, no changes should be necessary unless you want to start using the [new features](#WhatsNew) of version 2016-09-01.

If you are upgrading from version 2015-02-28-Preview, the above also applies, but you must also be aware that some preview features are not available in version 2016-09-01:

* Azure Blob Storage indexer support for CSV files and blobs containing JSON arrays.
* Synonyms
* "More like this" queries

If your code uses these features, you will not be able to upgrade to 2016-09-01 without removing your usage of them.

> [!IMPORTANT]
> Please remember, preview APIs are intended for testing and evaluation, and should not be used in production environments.
> 
> 

## Conclusion
If you need more details on using the Azure Search Service REST API, see the recently updated [API Reference](https://msdn.microsoft.com/library/azure/dn798935.aspx) on MSDN.

We welcome your feedback on Azure Search. If you encounter problems, feel free to ask us for help on the [Azure Search MSDN forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azuresearch) or [StackOverflow](http://stackoverflow.com/). If you're asking a question about Azure Search on StackOverflow, make sure to tag it with `azure-search`.

Thank you for using Azure Search!

