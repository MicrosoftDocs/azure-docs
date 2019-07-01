---
title: Synonyms for query expansion over a search index - Azure Search
description: Create a synonym map to expand the scope of a search query on an Azure Search index. Scope is broadened to include equivalent terms you provide in a list.
author: brjohnstmsft
services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.date: 05/02/2019
manager: jlembicz
ms.author: brjohnst
ms.custom: seodec2018
---
# Synonyms in Azure Search

Synonyms in search engines associate equivalent terms that implicitly expand the scope of a query, without the user having to actually provide the term. For example, given the term "dog" and synonym associations of "canine" and "puppy", any documents containing "dog", "canine" or "puppy" will fall within the scope of the query.

In Azure Search, synonym expansion is done at query time. You can add synonym maps to a service with no disruption to existing operations. You can add a  **synonymMaps** property to a field definition without having to rebuild the index.

## Create synonyms

There is no portal support for creating synonyms but you can use the REST API or .NET SDK. To get started with REST, we recommend [using Postman](search-get-started-postman.md) and formulation of requests using this API: [Create Synonym Maps](https://docs.microsoft.com/rest/api/searchservice/create-synonym-map). For C# developers, you can get started with [Add Synonyms in Azure Searching using C#](search-synonyms-tutorial-sdk.md).

Optionally, if you are using [customer-managed keys](search-security-manage-encryption-keys.md) for service-side encryption-at-rest, you can apply that protection to the contents of your synonym map.

## Use synonyms

In Azure Search, synonym support is based on synonym maps that you define and upload to your service. These maps constitute an independent resource (like indexes or data sources), and can be used by any searchable field in any index in your search service.

Synonym maps and indexes are maintained independently. Once you define a synonym map and upload it to your service, you can enable the synonym feature on a field by adding a new property called **synonymMaps** in the field definition. Creating, updating, and deleting a synonym map is always a whole-document operation, meaning that you cannot create, update or delete parts of the synonym map incrementally. Updating even a single entry requires a reload.

Incorporating synonyms into your search application is a two-step process:

1.	Add a synonym map to your search service through the APIs below.  

2.	Configure a searchable field to use the synonym map in the index definition.

### SynonymMaps Resource APIs

#### Add or update a synonym map under your service, using POST or PUT.

Synonym maps are uploaded to the service via POST or PUT. Each rule must be delimited by the new line character ('\n'). You can define up to 5,000 rules per synonym map in a free service and 10,000 rules in all other SKUs. Each rule can have up to 20 expansions.

Synonym maps must be in the Apache Solr format which is explained below. If you have an existing synonym dictionary in a different format and want to use it directly, please let us know on [UserVoice](https://feedback.azure.com/forums/263029-azure-search).

You can create a new synonym map using HTTP POST, as in the following example:

	POST https://[servicename].search.windows.net/synonymmaps?api-version=2019-05-06
	api-key: [admin key]

	{
	   "name":"mysynonymmap",
	   "format":"solr",
	   "synonyms": "
	      USA, United States, United States of America\n
	      Washington, Wash., WA => WA\n"
	}

Alternatively, you can use PUT and specify the synonym map name on the URI. If the synonym map does not exist, it will be created.

	PUT https://[servicename].search.windows.net/synonymmaps/mysynonymmap?api-version=2019-05-06
	api-key: [admin key]

    {
       "format":"solr",
       "synonyms": "
	      USA, United States, United States of America\n
	      Washington, Wash., WA => WA\n"
    }

##### Apache Solr synonym format

The Solr format supports equivalent and explicit synonym mappings. Mapping rules adhere to the open-source synonym filter specification of Apache Solr, described in this document: [SynonymFilter](https://cwiki.apache.org/confluence/display/solr/Filter+Descriptions#FilterDescriptions-SynonymFilter). Below is a sample rule for equivalent synonyms.
```
USA, United States, United States of America
```

With the rule above, a search query "USA" will expand to "USA" OR "United States" OR "United States of America".

Explicit mapping is denoted by an arrow "=>". When specified, a term sequence of a search query that matches the left-hand side of "=>" will be replaced with the alternatives on the right-hand side. Given the rule below, search queries "Washington", "Wash." or "WA" will all be rewritten to "WA". Explicit mapping only applies in the direction specified and does not rewrite the query "WA" to "Washington" in this case.
```
Washington, Wash., WA => WA
```

#### List synonym maps under your service.

	GET https://[servicename].search.windows.net/synonymmaps?api-version=2019-05-06
	api-key: [admin key]

#### Get a synonym map under your service.

	GET https://[servicename].search.windows.net/synonymmaps/mysynonymmap?api-version=2019-05-06
	api-key: [admin key]

#### Delete a synonyms map under your service.

	DELETE https://[servicename].search.windows.net/synonymmaps/mysynonymmap?api-version=2019-05-06
	api-key: [admin key]

### Configure a searchable field to use the synonym map in the index definition.

A new field property **synonymMaps** can be used to specify a synonym map to use for a searchable field. Synonym maps are service level resources and can be referenced by any field of an index under the service.

	POST https://[servicename].search.windows.net/indexes?api-version=2019-05-06
	api-key: [admin key]

	{
	   "name":"myindex",
	   "fields":[
	      {
	         "name":"id",
	         "type":"Edm.String",
	         "key":true
	      },
	      {
	         "name":"name",
	         "type":"Edm.String",
	         "searchable":true,
	         "analyzer":"en.lucene",
	         "synonymMaps":[
	            "mysynonymmap"
	         ]
	      },
	      {
	         "name":"name_jp",
	         "type":"Edm.String",
	         "searchable":true,
	         "analyzer":"ja.microsoft",
	         "synonymMaps":[
	            "japanesesynonymmap"
	         ]
	      }
	   ]
	}

**synonymMaps** can be specified for searchable fields of the type 'Edm.String' or 'Collection(Edm.String)'.

> [!NOTE]
> You can only have one synonym map per field. If you want to use multiple synonym maps, please let us know on [UserVoice](https://feedback.azure.com/forums/263029-azure-search).

## Impact of synonyms on other search features

The synonyms feature rewrites the original query with synonyms with the OR operator. For this reason, hit highlighting and scoring profiles treat the original term and synonyms as equivalent.

Synonym feature applies to search queries and does not apply to filters or facets. Similarly, suggestions are based only on the original term; synonym matches do not appear in the response.

Synonym expansions do not apply to wildcard search terms; prefix, fuzzy, and regex terms aren't expanded.

If you need to do a single query that applies synonym expansion and wildcard, regex, or fuzzy searches, you can combine the queries using the OR syntax. For example, to combine synonyms with wildcards for simple query syntax, the term would be `<query> | <query>*`.

## Tips for building a synonym map

- A concise, well-designed synonym map is more efficient than an exhaustive list of possible matches. Excessively large or complex dictionaries take longer to parse and affect the query latency if the query expands to many synonyms. Rather than guess at which terms might be used, you can get the actual terms via a [search traffic analysis report](search-traffic-analytics.md).

- As both a preliminary and validation exercise, enable and then use this report to precisely determine which terms will benefit from a synonym match, and then continue to use it as validation that your synonym map is producing a better outcome. In the predefined report, the tiles "Most common search queries" and "Zero-result search queries" will give you the necessary information.

- You can create multiple synonym maps for your search application (for example, by language if your application supports a multi-lingual customer base). Currently, a field can only use one of them. You can update a field's synonymMaps property at any time.

## Next steps

- If you have an existing index in a development (non-production) environment, experiment with a small dictionary to see how the addition of synonyms changes the search experience, including impact on scoring profiles, hit highlighting, and suggestions.

- [Enable search traffic analytics](search-traffic-analytics.md) and use the predefined Power BI report to learn which terms are used the most, and which ones return zero documents. Armed with these insights, revise the dictionary to include synonyms for unproductive queries that should be resolving to documents in your index.
