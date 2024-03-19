---
title: Azure OpenAI on your Azure Machine Learning index data Python & REST API reference
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI on your Azure Machine Learning index data Python & REST API.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 03/14/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom: devx-track-python
---

# Data source - Azure Machine Learning index (preview)

The configurable options of Azure Machine Learning index when using Azure OpenAI On Your Data. This data source is supported in API version `2024-02-15-preview`.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
|`parameters`| [Parameters](#parameters)| True| The parameters to use when configuring Azure Machine Learning index.|
| `type`| string| True | Must be `azure_ml_index`. |

## Parameters

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `project_resource_id` | string | True | The resource ID of the Azure Machine Learning project.|
| `name` | string | True | The Azure Machine Learning index name.|
| `version` | string | True | The version of the Azure Machine Learning index.|
| `authentication`| One of [AccessTokenAuthenticationOptions](#access-token-authentication-options), [SystemAssignedManagedIdentityAuthenticationOptions](#system-assigned-managed-identity-authentication-options), [UserAssignedManagedIdentityAuthenticationOptions](#user-assigned-managed-identity-authentication-options) | True | The authentication method to use when accessing the defined data source. |
| `in_scope` | boolean | False | Whether queries should be restricted to use of indexed data. Default is `True`.| 
| `role_information`| string | False | Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality and tell it how to format responses.|
| `strictness` | integer | False | The configured strictness of the search relevance filtering. The higher of strictness, the higher of the precision but lower recall of the answer. Default is `3`.| 
| `top_n_documents` | integer | False | The configured top number of documents to feature for the configured query. Default is `5`. |
| `filter`| string | False | Search filter. Only supported if the Azure Machine Learning index is of type Azure Search.|


## Access token authentication options

The authentication options for Azure OpenAI On Your Data when using access token.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `access_token`|string|True|The access token to use for authentication.|
| `type`|string|True| Must be `access_token`.|

## System assigned managed identity authentication options

The authentication options for Azure OpenAI On Your Data when using a system-assigned managed identity.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `type`|string|True| Must be `system_assigned_managed_identity`.|

## User assigned managed identity authentication options

The authentication options for Azure OpenAI On Your Data when using a user-assigned managed identity.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `managed_identity_resource_id`|string|True|The resource ID of the user-assigned managed identity to use for authentication.|
| `type`|string|True| Must be `user_assigned_managed_identity`.|

## Examples

Prerequisites:
* Configure the role assignments from Azure OpenAI system assigned managed identity to Azure Machine Learning workspace resource. Required role: `AzureML Data Scientist`.
* Configure the role assignments from the user to the Azure OpenAI resource. Required role: `Cognitive Services OpenAI User`.
* Install [Az CLI](/cli/azure/install-azure-cli) and run `az login`.
* Define the following environment variables: `AzureOpenAIEndpoint`, `ChatCompletionsDeploymentName`, `ProjectResourceId`, `IndexName`, `IndexVersion`.
* Run `export MSYS_NO_PATHCONV=1` if you're using MINGW.
```bash
export AzureOpenAIEndpoint=https://example.openai.azure.com/
export ChatCompletionsDeploymentName=turbo
export ProjectResourceId='/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.MachineLearningServices/workspaces/{workspace-id}'
export IndexName=testamlindex
export IndexVersion=2
```

# [Python 1.x](#tab/python)

Install the latest pip packages `openai`, `azure-identity`.

```python
import os
from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

endpoint = os.environ.get("AzureOpenAIEndpoint")
deployment = os.environ.get("ChatCompletionsDeploymentName")
project_resource_id = os.environ.get("ProjectResourceId")
index_name = os.environ.get("IndexName")
index_version = os.environ.get("IndexVersion")

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default")

client = AzureOpenAI(
    azure_endpoint=endpoint,
    azure_ad_token_provider=token_provider,
    api_version="2024-02-15-preview",
)

completion = client.chat.completions.create(
    model=deployment,
    messages=[
        {
            "role": "user",
            "content": "Who is DRI?",
        },
    ],
    extra_body={
        "data_sources": [
            {
                "type": "azure_ml_index",
                "parameters": {
                    "project_resource_id": project_resource_id,
                    "name": index_name,
                    "version": index_version,
                    "authentication": {
                        "type": "system_assigned_managed_identity"
                    },
                }
            }
        ]
    }
)

print(completion.model_dump_json(indent=2))

```

# [REST](#tab/rest)

```bash

az rest --method POST \
 --uri $AzureOpenAIEndpoint/openai/deployments/$ChatCompletionsDeploymentName/chat/completions?api-version=2024-02-15-preview \
 --resource https://cognitiveservices.azure.com/ \
 --body \
'
{
    "data_sources": [
      {
        "type": "azure_ml_index",
        "parameters": {
          "project_resource_id": "'$ProjectResourceId'",
          "name": "'$IndexName'",
          "version": "'$IndexVersion'",
          "authentication": {
            "type": "system_assigned_managed_identity"
          },
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Who is DRI?"
      }
    ]
}
'
```

---
