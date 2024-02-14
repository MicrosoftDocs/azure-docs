---
title: Azure OpenAI on your Azure Search data Python & REST API reference
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

# Azure Search Data Source

A specific representation of configurable options for Azure Search when using it as an Azure OpenAI chat extension.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
|`parameters`| [Parameters](#parameters)| True| The parameters to use when configuring Azure Search.|
| `type`| string| True | Must be `azure_search`. |

# Parameters

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `endpoint` | string | True | The absolute endpoint path for the Azure Search resource to use.|
| `index_name` | string | True | The name of the index to use in the referenced Azure Search resource.|
| `authentication`| One of [ApiKeyAuthenticationOptions](#api-key-authentication-options), [SystemAssignedManagedIdentityAuthenticationOptions](#system-assigned-managed-identity-authentication-options), [UserAssignedManagedIdentityAuthenticationOptions](#user-assigned-managed-identity-authentication-options) | True | The authentication method to use when accessing the defined data source. |
| `embedding_dependency` | One of [DeploymentNameVectorizationSource](#deployment-name-vectorization-source), [EndpointVectorizationSource](#endpoint-vectorization-source) | False | The embedding dependency for vector search. |
| `fields_mapping` | [FieldMappingOptions](#fields-mapping) | False | Customized field mapping behavior to use when interacting with the search index.|
| `filter`| string | False | Search filter. |
| `in_scope` | boolean | False | Whether queries should be restricted to use of indexed data. Default is `True`.| 
| `query_type` | [AzureSearchQueryType](#query-type) | False | The query type to use with Azure Search. Default is `simple` |
| `role_information`| string | False | Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality and tell it how to format responses. There's a 100 token limit for it, and it counts against the overall token limit.|
| `semantic_configuration` | string | False | The additional semantic configuration for the query. | 
| `strictness` | integer | False | The configured strictness of the search relevance filtering. The higher of strictness, the higher of the precision but lower recall of the answer. Default is `3`.| 
| `top_n_documents` | integer | False | The configured top number of documents to feature for the configured query. Default is `5`. |

