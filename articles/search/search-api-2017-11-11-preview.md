---
title: Azure Search Service REST API Version 2017-11-11-Preview | Microsoft Docs
description: Azure Search Service REST API Version 2017-11-11-Preview includes experimental features such as Synonyms and moreLikeThis searches.
services: search
author: HeidiSteen
manager: cgronlun

ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: search
ms.date: 05/01/2018
ms.author: HeidiSteen

---
# Azure Search Service REST API: Version 2017-11-11-Preview
This article describes the `api-version=2017-11-11-Preview` version of Azure Search service REST API, providing the following experimental features:

+ [Cognitive search](cognitive-search-intro.md), a new enrichment capability in Azure Search indexing that finds latent information in non-text sources and undifferentiated text, transforming it into full text searchable content in Azure Search.

The preview API is equivalent to the generally available API with the exception of the following two operations:

+ [Create Skillset (api-version=2017-11-11-Preview)](ref-create-skillset.md)
+ [Create Indexer (api-version=2017-11-11-Preview)](ref-create-indexer.md)

Be sure to target the preview API version `api-version=2017-11-11-Preview` when evaluating pre-release features. The following example syntax illustrates a call to the preview API version.

    GET https://[service name].search.windows.net/indexes/[index name]/docs?search=*&api-version=2017-11-11-Preview

> [!NOTE]
> Preview features are available for testing and experimentation with the goal of gathering feedback and are subject to change. **We strongly advise against using preview APIs in production applications.**

Azure Search service is available in multiple versions. Please refer to [API versions](search-api-versions.md) for details.
