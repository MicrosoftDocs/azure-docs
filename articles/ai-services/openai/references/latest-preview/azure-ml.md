---
title: Azure OpenAI on your Azure Machine Learning index data Python & REST API reference
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI on your data Python & REST API.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 02/14/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom:
---

#  Azure Machine Learning Index Data Source

A specific representation of configurable options for Azure Machine Learning index when using Azure OpenAI on your data.

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
| `role_information`| string | False | Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality and tell it how to format responses. There's a 100 token limit for it, and it counts against the overall token limit.|
| `strictness` | integer | False | The configured strictness of the search relevance filtering. The higher of strictness, the higher of the precision but lower recall of the answer. Default is `3`.| 
| `top_n_documents` | integer | False | The configured top number of documents to feature for the configured query. Default is `5`. |
| `filter`| string | False | Search filter. Only supported if the Azure Machine Learning index is of type azure search.|


## Access Token Authentication Options

The authentication options for Azure OpenAI on your data when using access token.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `access_token`|string|True|The access token to use for authentication.|
| `type`|string|True| Must be `access_token`.|

## System Assigned Managed Identity Authentication Options

The authentication options for Azure OpenAI On Your Data when using a system-assigned managed identity.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `type`|string|True| Must be `system_assigned_managed_identity`.|

## User Assigned Managed Identity Authentication Options

The authentication options for Azure OpenAI On Your Data when using a user-assigned managed identity.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `managed_identity_resource_id`|string|True|The resource ID of the user-assigned managed identity to use for authentication.|
| `type`|string|True| Must be `user_assigned_managed_identity`.|

## Examples
Before run this example, make sure to:
* Define the following environment variables: `AOAIEndpoint`, `ChatCompletionsDeploymentName`, 

# [Python](#tab/python)

```python

```

# [REST](#tab/rest)

```bash

az rest --method POST \
 --uri $AOAIEndpoint/openai/deployments/$ChatCompletionsDeploymentName/chat/completions?api-version=2024-02-15-preview \
 --resource https://cognitiveservices.azure.com/ \
 --body \
'
{
    "data_sources": [
      {
        "type": "azure_ml_index",
        "parameters": {
          "project_resource_id": "'$ProjectResourceId'",
          "name": "'$Name'",
          "version": "'$Version'",
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