---
title: Map skill output fields
titleSuffix: Azure Cognitive Search
description: Export the enriched content created by a skillset by mapping its output fields to fields in a search index.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/13/2022
---

# Map enrichment output to fields in a search index

![Indexer Stages](./media/cognitive-search-output-field-mapping/indexer-stages-output-field-mapping.png "indexer stages")



In this article, you'll learn how to map enriched fields (created by a skillset) to output fields in a searchable index. 

This step is required if you're working with a [skillset](cognitive-search-defining-skillset.md). Having an output field mapping tells the indexer which enriched fields to send to specific fields in your search index.

In addition to routing fields, an output field mapping can be used to perform data shape transformations by flattening a nested structure.

The enriched document is really a tree of information, and even though there is support for complex types in the index, sometimes you may want to transform the information from the enriched tree into a more simple type (for instance, an array of strings). 

Output field mappings always occur after skillset execution, although it is possible for this stage to run even if no skillset is defined.

Examples of output field mapping scenarios:

* **Content consolidation.** Your skillset extracts the names of organizations mentioned in within each page of a document. Now you want to map each of those organization names into a field in your index of type Edm.Collection(Edm.String).

* **Content creation.** As part of your skillset, you produced a new node called "document/translated_text". You would like to map this new information to a specific field in your index.

* **Content extraction.** You don’t have a skillset but are indexing a complex type from a Cosmos DB database. You'd like to get to a node on that complex type and map it into a field in your index.

> [!NOTE]
> Output field mappings apply to search indexes only. For indexers that create [knowledge stores](knowledge-store-concept-intro.md), output field mappings are ignored.

## Use outputFieldMappings

To map fields, add `outputFieldMappings` to your indexer definition as shown below:

```http
PUT https://[servicename].search.windows.net/indexers/[indexer name]?api-version=2020-06-30
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
            "targetFieldName": "descriptions",
            "mappingFunction": {
                "name": "base64Decode"
            }
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

For each output field mapping, set the location of the data in the enriched document tree (sourceFieldName), and the name of the field as referenced in the index (targetFieldName). Assign any [mapping functions](search-indexer-field-mappings.md#field-mapping-functions-and-examples) that you require to transform the content of a field before it's stored in the index.

## Flattening Information from Complex Types 

The path in a sourceFieldName can represent one element or multiple elements. In the example above, ```/document/content/sentiment``` represents a single numeric value, while ```/document/content/organizations/*/description``` represents several organization descriptions. 

In cases where there are several elements, they are "flattened" into an array that contains each of the elements. 

More concretely, for the ```/document/content/organizations/*/description``` example, the data in the *descriptions* field would look like a flat array of descriptions before it gets indexed:

```
 ["Microsoft is a company in Seattle","LinkedIn's office is in San Francisco"]
```

This is an important principle, so we will provide another example. Imagine that you have an array of complex types as part of the enrichment tree. Let's say there is a member called customEntities that has an array of complex types like the one described below.

```json
"document/customEntities": 
[
    {
        "name": "heart failure",
        "matches": [
            {
                "text": "heart failure",
                "offset": 10,
                "length": 12,
                "matchDistance": 0.0
            }
        ]
    },
    {
        "name": "morquio",
        "matches": [
            {
                "text": "morquio",
                "offset": 25,
                "length": 7,
                "matchDistance": 0.0
            }
        ]
    }
    //...
]
```

Let's assume that your index has a field called 'diseases' of type Collection(Edm.String), where you would like to store each of the names of the entities. 

This can be done easily by using the "\*" symbol, as follows:

```json
    "outputFieldMappings": [
        {
            "sourceFieldName": "/document/customEntities/*/name",
            "targetFieldName": "diseases"
        }
    ]
```

This operation will simply “flatten” each of the names of the customEntities elements into a single array of strings like this:

```json
  "diseases" : ["heart failure","morquio"]
```

## See also

* [Search indexes in Azure Cognitive Search](search-what-is-an-index.md).

* [Define field mappings in a search indexer](search-indexer-field-mappings.md).