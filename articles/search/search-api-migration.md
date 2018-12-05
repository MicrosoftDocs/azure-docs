---
title: Upgrading to the latest Azure Search Service REST API version | Microsoft Docs
description: Upgrading to the latest Azure Search Service REST API version
author: brjohnstmsft
manager: jlembicz
services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.date: 04/20/2018
ms.author: brjohnst
---
# Upgrading to the latest Azure Search Service REST API version
If you're using a previous version of the [Azure Search Service REST API](https://docs.microsoft.com/rest/api/searchservice/), this article will help you upgrade your application to use the latest generally available API version, 2017-11-11.

Version 2017-11-11 of the REST API contains some changes from earlier versions. These are mostly backward compatible, so changing your code should require only minimal effort, depending on which version you were using before. See [Steps to upgrade](#UpgradeSteps) for instructions on how to change your code to use the new API version.

> [!NOTE]
> Your Azure Search service instance supports several REST API versions, including the latest one. You can continue to use a version when it is no longer the latest one, but we recommend that you migrate your code to use the newest version.

<a name="WhatsNew"></a>

## What's new in version 2017-11-11
Version 2017-11-11 is the latest generally available release of the Azure Search Service REST API. New features in this API version include:

* [Synonyms](search-synonyms.md). The new synonyms feature allows you to define equivalent terms and expand the scope of the query.
* [Support for efficiently indexing text blobs](https://docs.microsoft.com/azure/search/search-howto-indexing-azure-blob-storage#IndexingPlainText). The new `text` parsing mode for Azure Blob indexers significantly improves indexing performance.
* [Service Statistics API](https://docs.microsoft.com/rest/api/searchservice/get-service-statistics). View the current usage and limits of resources in Azure Search with this new API.

<a name="UpgradeSteps"></a>

## Steps to upgrade
If you are upgrading from a GA version, 2015-02-28 or 2016-09-01, you probably won't have to make any changes to your code, other than to change the version number. The only situations in which you may need to change code are when:

* Your code fails when unrecognized properties are returned in an API response. By default your application should ignore properties that it does not understand.
* Your code persists API requests and tries to resend them to the new API version. For example, this might happen if your application persists continuation tokens returned from the Search API (for more information, look for `@search.nextPageParameters` in the [Search API Reference](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)).

If either of these situations apply to you, then you may need to change your code accordingly. Otherwise, no changes should be necessary unless you want to start using the [new features](#WhatsNew) of version 2017-11-11.

If you are upgrading from a preview api-version, the above also applies, but you must also be aware that some preview features are not available in version 2017-11-11:

* Azure Blob Storage indexer support for CSV files and blobs containing JSON arrays.
* "More like this" queries

If your code uses these features, you will not be able to upgrade to 2017-11-11 without removing your usage of them.

> [!IMPORTANT]
> Please remember, preview APIs are intended for testing and evaluation, and should not be used in production environments.
> 
> 

## Conclusion
If you need more details on using the Azure Search Service REST API, see the recently updated [API Reference](https://docs.microsoft.com/rest/api/searchservice/) on MSDN.

We welcome your feedback on Azure Search. If you encounter problems, feel free to ask us for help on the [Azure Search MSDN forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azuresearch) or [StackOverflow](http://stackoverflow.com/). If you're asking a question about Azure Search on StackOverflow, make sure to tag it with `azure-search`.

Thank you for using Azure Search!

