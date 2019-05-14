---
title: Map cognitive search enriched input fields to output fields - Azure Search
description: Extract and enrich source data fields, and map to output fields in an Azure Search index.
manager: pablocas
author: luiscabrer
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: luisca
ms.custom: seodec2018
---

# How to map enriched fields to a searchable index

In this article, you learn how to map enriched input fields to output fields in a searchable index. Once you have [defined a skillset](cognitive-search-defining-skillset.md), you must map the output fields of any skill that directly contributes values to a given field in your search index. Field mappings are required for moving content from enriched documents into the index.


## Use outputFieldMappings
To map fields, add `outputFieldMappings` to your indexer definition as shown below:

```http
PUT https://[servicename].search.windows.net/indexers/[indexer name]?api-version=2019-05-06
api-key: [admin key]
Content-Type: application/json
```

The body of the request is structured as follows:

```json
{
    "name": "myIndexer",
    "dataSourceName": "myDataSource",
    "targetIndexName": "myIndex",
    "skillsetName": "myFirstSkillSet",
    "fieldMappings": [
        {
            "sourceFieldName": "metadata_storage_path",
            "targetFieldName": "id",
            "mappingFunction": {
                "name": "base64Encode"
            }
        }
    ],
    "outputFieldMappings": [
        {
            "sourceFieldName": "/document/content/organizations/*/description",
            "targetFieldName": "descriptions"
        },
        {
            "sourceFieldName": "/document/content/organizations",
            "targetFieldName": "orgNames"
        },
        {
            "sourceFieldName": "/document/content/sentiment",
            "targetFieldName": "sentiment"
        }
    ]
}
```
For each output field mapping, set the name of the enriched field (sourceFieldName), and the name of the field as referenced in the index (targetFieldName).

The path in a sourceFieldName can represent one element or multiple elements. In the example above, ```/document/content/sentiment``` represents a single numeric value, while ```/document/content/organizations/*/description``` represents several organization descriptions. In cases where there are several elements, they are "flattened" into an array that contains each of the elements. More concretely, for the ```/document/content/organizations/*/description``` example, the data in the *descriptions* field would look like a flat array of descriptions before it gets indexed:

```
 ["Microsoft is a company in Seattle","LinkedIn's office is in San Francisco"]
```
## Next steps
Once you have mapped your enriched fields to searchable fields, you can set the field attributes for each of the searchable fields [as part of the index definition](search-what-is-an-index.md).

For more information about field mapping, see [Field mappings in Azure Search indexers](search-indexer-field-mappings.md).
