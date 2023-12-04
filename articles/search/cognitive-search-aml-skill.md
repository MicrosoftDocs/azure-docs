---
title: Custom AML skill in skillsets
titleSuffix: Azure AI Search
description: Extend capabilities of Azure AI Search skillsets with Azure Machine Learning models.

manager: liamca
author: gmndrg
ms.author: gimondra
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 12/01/2022
---

# AML skill in an Azure AI Search enrichment pipeline

> [!IMPORTANT] 
> This skill is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [preview REST API](/rest/api/searchservice/index-preview) supports this skill.

The **AML** skill allows you to extend AI enrichment with a custom [Azure Machine Learning](../machine-learning/overview-what-is-azure-machine-learning.md) (AML) model. Once an AML model is [trained and deployed](../machine-learning/concept-azure-machine-learning-architecture.md#workspace), an **AML** skill integrates it into AI enrichment.

Like built-in skills, an **AML** skill has inputs and outputs. The inputs are sent to your deployed AML online endpoint as a JSON object, which outputs a JSON payload as a response along with a success status code. The response is expected to have the outputs specified by your **AML** skill. Any other response is considered an error and no enrichments are performed.

> [!NOTE]
> The indexer will retry twice for certain standard HTTP status codes returned from the AML online endpoint. These HTTP status codes are:
> * `503 Service Unavailable`
> * `429 Too Many Requests`

## Prerequisites

* An [AML workspace](../machine-learning/concept-workspace.md)
* An [Online endpoints (real-time)](../machine-learning/concept-endpoints-online.md) in this workspace.

## @odata.type  
Microsoft.Skills.Custom.AmlSkill

## Skill parameters

Parameters are case-sensitive. Which parameters you choose to use depends on what [authentication your AML online endpoint requires, if any](#WhatSkillParametersToUse)

| Parameter name | Description |
|--------------------|-------------|
| `uri` | (Required for [key authentication](#WhatSkillParametersToUse)) The [scoring URI of the AML online endpoint](../machine-learning/how-to-authenticate-online-endpoint.md) to which the _JSON_ payload is sent. Only the **https** URI scheme is allowed. |
| `key` | (Required for [key authentication](#WhatSkillParametersToUse)) The [key for the AML online endpoint](../machine-learning/how-to-authenticate-online-endpoint.md). |
| `resourceId` | (Required for [token authentication](#WhatSkillParametersToUse)). The Azure Resource Manager resource ID of the AML online endpoint. It should be in the format subscriptions/{guid}/resourceGroups/{resource-group-name}/Microsoft.MachineLearningServices/workspaces/{workspace-name}/onlineendpoints/{endpoint_name}. |
| `region` | (Optional for [token authentication](#WhatSkillParametersToUse)). The [region](https://azure.microsoft.com/global-infrastructure/regions/) the AML online endpoint is deployed in. |
| `timeout` | (Optional) When specified, indicates the timeout for the http client making the API call. It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](https://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). For example, `PT60S` for 60 seconds. If not set, a default value of 30 seconds is chosen. The timeout can be set to a maximum of 230 seconds and a minimum of 1 second. |
| `degreeOfParallelism` | (Optional) When specified, indicates the number of calls the indexer makes in parallel to the endpoint you have provided. You can decrease this value if your endpoint is failing under too high of a request load. You can raise it if your endpoint is able to accept more requests and you would like an increase in the performance of the indexer.  If not set, a default value of 5 is used. The degreeOfParallelism can be set to a maximum of 10 and a minimum of 1.

<a name="WhatSkillParametersToUse"></a>

## What skill parameters to use

Which AML skill parameters are required depends on what authentication your AML online endpoint uses, if any. AML online endpoints provide two authentication options:

* [Key-Based Authentication](../machine-learning/how-to-authenticate-online-endpoint.md). A static key is provided to authenticate scoring requests from AML skills
  * Use the _uri_ and _key_ parameters
* [Token-Based Authentication](../machine-learning/how-to-authenticate-online-endpoint.md). The AML online endpoint is [deployed using token based authentication](../machine-learning/how-to-authenticate-online-endpoint.md). The Azure AI Search service's [managed identity](../active-directory/managed-identities-azure-resources/overview.md) must be enabled. The AML skill then uses the service's managed identity to authenticate against the AML online endpoint, with no static keys required. The identity must be assigned owner or contributor role.
  * Use the _resourceId_ parameter.
  * If the search service is in a different region from the AML workspace, use the _region_ parameter to set the region the AML online endpoint was deployed in

## Skill inputs

There are no "predefined" inputs for this skill. You can choose one or more fields that would be already available at the time of this skill's execution as inputs and the _JSON_ payload sent to the AML online endpoint will have different fields.

## Skill outputs

There are no "predefined" outputs for this skill. Depending on the response your AML online endpoint returns, add output fields so that they can be picked up from the _JSON_ response.

## Sample definition

```json
  {
    "@odata.type": "#Microsoft.Skills.Custom.AmlSkill",
    "description": "A sample model that detects the language of sentence",
    "uri": "https://contoso.count-things.com/score",
    "context": "/document",
    "inputs": [
      {
        "name": "text",
        "source": "/document/content"
      }
    ],
    "outputs": [
      {
        "name": "detected_language_code"
      }
    ]
  }
```

## Sample input JSON structure

This _JSON_ structure represents the payload that is sent to your AML online endpoint. The top-level fields of the structure correspond to the "names" specified in the `inputs` section of the skill definition. The values of those fields are from the `source` of those fields (which could be from a field in the document, or potentially from another skill)

```json
{
  "text": "Este es un contrato en Inglés"
}
```

## Sample output JSON structure

The output corresponds to the response returned from your AML online endpoint. The AML online endpoint should only return a _JSON_ payload (verified by looking at the `Content-Type` response header) and should be an object where the fields are enrichments matching the "names" in the `output` and whose value is considered the enrichment.

```json
{
    "detected_language_code": "es"
}
```

## Inline shaping sample definition

```json
  {
    "@odata.type": "#Microsoft.Skills.Custom.AmlSkill",
    "description": "A sample model that detects the language of sentence",
    "uri": "https://contoso.count-things.com/score",
    "context": "/document",
    "inputs": [
      {
        "name": "shapedText",
        "sourceContext": "/document",
        "inputs": [
            {
              "name": "content",
              "source": "/document/content"
            }
        ]
      }
    ],
    "outputs": [
      {
        "name": "detected_language_code"
      }
    ]
  }
```

## Inline shaping input JSON structure

```json
{
  "shapedText": { "content": "Este es un contrato en Inglés" }
}
```

## Inline shaping sample output JSON structure

```json
{
    "detected_language_code": "es"
}
```

## Error cases
In addition to your AML being unavailable or sending out nonsuccessful status codes, the following are considered erroneous cases:

* If the AML online endpoint returns a success status code but the response indicates that it isn't `application/json`, then the response is considered invalid and no enrichments are performed.
* If the AML online endpoint returns invalid json

For cases when the AML online endpoint is unavailable or returns an HTTP error, a friendly error with any available details about the HTTP error will be added to the indexer execution history.

## See also

+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [AML online endpoint troubleshooting](../machine-learning/how-to-troubleshoot-online-endpoints.md)
