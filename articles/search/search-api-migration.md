---
title: Upgrade to the latest Azure Search Service REST API version - Azure Search
description: Review differences in API versions and learn which actions are required to migrate existing code to the newest Azure Search Service REST API version.
author: brjohnstmsft
manager: jlembicz
services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: brjohnst

---
# Upgrade to the latest Azure Search Service REST API version
If you're using a previous version of the [Azure Search Service REST API](https://docs.microsoft.com/rest/api/searchservice/), this article will help you upgrade your application to use the newest generally available API version, 2019-05-06.

Version 2019-05-06 of the REST API contains some changes from earlier versions. These are mostly backward compatible, so changing your code should require only minimal effort, depending on which version you were using before. [Steps to upgrade](#UpgradeSteps) outlines the code changes required for using new features.

> [!NOTE]
> An Azure Search service instance supports a range of REST API versions, including earlier ones. You can continue to use those API versions, but you should migrate your code for access to new features as well as more robust versions of current functionality.

<a name="WhatsNew"></a>

## What's new in version 2019-05-06
Version 2019-05-06 is the newest generally available release of the Azure Search Service REST API. New features in this API version include:

* [Complex types](search-howto-complex-data-types.md). Native supported for nested data structures in an Azure Search index. This feature was tested extensively in private preview so it is bypassing public preview and moving straight into general availability.

* [Cognitive Search with AI-enriched indexing](cognitive-search-concept-intro.md). Indexing that leverages the AI enrichment engines of Cognitive Services is now generally available.

* [Autocomplete](index-add-suggesters.md) is a typeahead feature that completes a partially specified term input. For a walkthrough, see [Add Suggestions or Autocomplete to your Azure Search application](search-autocomplete-tutorial.md).

* [JsonArray and JsonLines parsing modes](search-howto-index-json-blobs.md) specified in Azure Blob indexing are now generally available.

Several preview feature releases coincide with this generally available update. To review the list, see [Search REST api-version 2019-05-06-Preview](search-api-preview.md).

<a name="UpgradeSteps"></a>

## Steps to upgrade
If you are upgrading from a previous GA version, 2017-11-11 or 2016-09-01, you probably won't have to make any changes to your code, other than to change the version number. The only situations in which you may need to change code are when:

* Your code fails when unrecognized properties are returned in an API response. By default your application should ignore properties that it does not understand.

* Your code persists API requests and tries to resend them to the new API version. For example, this might happen if your application persists continuation tokens returned from the Search API (for more information, look for `@search.nextPageParameters` in the [Search API Reference](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)).

If either of these situations apply to you, then you may need to change your code accordingly. Otherwise, no changes should be necessary unless you want to start using the [new features](#WhatsNew) of version 2019-05-06.

If you are upgrading from a preview api-version, the above also applies, but you must also be aware that some preview features remain in preview for 2019-05-06:

* Azure Blob Storage indexer [support for CSV files](search-howto-index-csv-blobs.md) is still in preview.

* ["More like this" queries](search-more-like-this.md) continue to be a preview-only feature.

If your code uses these features, you will not be able to upgrade to generally available 2019-05-06 without removing your usage of them.

> [!IMPORTANT]
> Preview APIs are intended for testing and evaluation, and should not be used in production environments.
> 

## Next steps

Review the Azure Search Service REST API reference documentation. If you encounter problems, ask us for help on [StackOverflow](https://stackoverflow.com/) or [contact support](https://azure.microsoft.com/support/community/?product=search).

> [!div class="nextstepaction"]
> [Search service REST API Reference](https://docs.microsoft.com/rest/api/searchservice/).

