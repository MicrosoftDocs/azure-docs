---
title: Azure AI Vision multimodal embeddings skill
titleSuffix: Azure AI Search
description: Vectorize images or text using the Azure AI Vision multimodal embeddings API.
author: careyjmac
ms.author: chalton
ms.service: cognitive-search
ms.custom:
  - build-2024
  - references_regions
ms.topic: reference
ms.date: 05/28/2024
---

#	Azure AI Vision multimodal embeddings skill

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2024-05-01-Preview REST API](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2024-05-01-Preview&preserve-view=true) supports this feature.

The **Azure AI Vision multimodal embeddings** skill uses Azure AI Vision's [multimodal embeddings API](../ai-services/computer-vision/concept-image-retrieval.md) to generate embeddings for image or text input.

The skill is only supported in search services located in a region that supports the [Azure AI Vision Multimodal embeddings API](../ai-services/computer-vision/how-to/image-retrieval.md). Currently this is East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, and West US. Your data is processed in the [Geo](https://azure.microsoft.com/explore/global-infrastructure/data-residency/) where your model is deployed. 

> [!NOTE]
> This skill is bound to Azure AI services and requires [a billable resource](cognitive-search-attach-cognitive-services.md) for transactions that exceed 20 documents per indexer per day. Execution of built-in skills is charged at the existing [Azure AI services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/).
>
> In addition, image extraction is [billable by Azure AI Search](https://azure.microsoft.com/pricing/details/search/).
>

## @odata.type  

Microsoft.Skills.Vision.VectorizeSkill

## Data limits

The input limits for the skill can be found in [the Azure AI Vision documentation](../ai-services/computer-vision/concept-image-retrieval.md#input-requirements) for images and text respectively. Consider using the [Text Split skill](cognitive-search-skill-textsplit.md) if you need data chunking for text inputs.

## Skill parameters

Parameters are case-sensitive.

| Inputs | Description |
|---------------------|-------------|
| `modelVersion` | (Required) The model version to be passed to the Azure AI Vision multimodal embeddings API for generating embeddings. It is important that all embeddings stored in a given index field are generated using the same `modelVersion`. |

## Skill inputs

| Input	 | Description |
|--------------------|-------------|
| `text` | The input text to be vectorized. If you're using data chunking, the source might be `/document/pages/*`. |
| `image` | Complex Type. Currently only works with "/document/normalized_images" field, produced by the Azure blob indexer when ```imageAction``` is set to a value other than ```none```. |
| `url` | The URL to download the image to be vectorized. |
| `queryString` | The query string of the URL to download the image to be vectorized. Useful if you store the URL and SAS token in separate paths. |

Only one of `text`, `image` or `url`/`queryString` can be configured for a single instance of the skill. If you want to vectorize both images and text within the same skillset, include two instances of this skill in the skillset definition, one for each input type you would like to use.

## Skill outputs

| Output	 | Description |
|--------------------|-------------|
| `vector` | Output embedding array of floats for the input text or image. |

## Sample definition

For text input, consider a record that has the following fields:

```json
{
    "content": "Microsoft released Windows 10."
}
```

Then your skill definition might look like this:

```json
{ 
    "@odata.type": "#Microsoft.Skills.Vision.VectorizeSkill", 
    "context": "/document", 
    "modelVersion": "2023-04-15", 
    "inputs": [ 
        { 
            "name": "text", 
            "source": "/document/content" 
        } 
    ], 
    "outputs": [ 
        { 
            "name": "vector"
        } 
    ] 
} 

```

For image input, your skill definition might look like this:

```json
{
    "@odata.type": "#Microsoft.Skills.Vision.VectorizeSkill",
    "context": "/document/normalized_images/*",
    "modelVersion": "2023-04-15", 
    "inputs": [
        {
            "name": "image",
            "source": "/document/normalized_images/*"
        }
    ],
    "outputs": [
        {
            "name": "vector"
        }
    ]
}
```

If you want to vectorize images directly from your blob storage datasource, your skill definition might look like this:

```json
{
    "@odata.type": "#Microsoft.Skills.Vision.VectorizeSkill",
    "context": "/document",
    "modelVersion": "2023-04-15", 
    "inputs": [
        {
            "name": "url",
            "source": "/document/metadata_storage_path"
        },
        {
            "name": "queryString",
            "source": "/document/metadata_storage_sas_token"
        }
    ],
    "outputs": [
        {
            "name": "vector"
        }
    ]
}
```

## Sample output

For the given input text, a vectorized embedding output is produced.

```json
{
  "vector": [
        0.018990106880664825,
        -0.0073809814639389515,
        .... 
        0.021276434883475304,
      ]
}
```

The output resides in memory. To send this output to a field in the search index, you must define an [outputFieldMapping](cognitive-search-output-field-mapping.md) that maps the vectorized embedding output (which is an array) to a [vector field](vector-search-how-to-create-index.md). Assuming the skill output resides in the document's **vector** node, and **content_vector** is the field in the search index, the outputFieldMapping in indexer should look like:

```json
  "outputFieldMappings": [
    {
      "sourceFieldName": "/document/vector/*",
      "targetFieldName": "content_vector"
    }
  ]
```

For mapping image embeddings to the index, you will need to use the [Index Projections](index-projections-concept-intro.md) feature. The payload for `indexProjections` might look something like this:

```json
"indexProjections": {
    "selectors": [
        {
            "targetIndexName": "myTargetIndex",
            "parentKeyFieldName": "ParentKey",
            "sourceContext": "/document/normalized_images/*",
            "mappings": [
                {
                    "name": "content_vector",
                    "source": "/document/normalized_images/*/vector"
                }
            ]
        }
    ]
}
```

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Extract text and information from images](cognitive-search-concept-image-scenarios.md)
+ [How to define output fields mappings](cognitive-search-output-field-mapping.md)
+ [Index Projections](index-projections-concept-intro.md)
+ [Azure AI Vision multi-model embeddings API](../ai-services/computer-vision/concept-image-retrieval.md)
