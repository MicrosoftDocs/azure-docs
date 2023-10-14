---
title: Azure OpenAI Service working with models
titleSuffix: Azure OpenAI
description: Learn about managing model deployment life cycle, updates, & retirement. 
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 10/04/2023
ms.custom: event-tier1-build-2022, references_regions, build-2023, build-2023-dataai
manager: nitinme
author: mrbullwinkle #ChrisHMSFT
ms.author: mbullwin #chrhoder
recommendations: false
keywords: 
---

# Working with Azure OpenAI models

Azure OpenAI Service is powered by a diverse set of models with different capabilities and price points. [Model availability varies by region](../concepts/models.md).

You can get a list of models that are available for both inference and fine-tuning by your Azure OpenAI resource by using the [Models List API](/rest/api/cognitiveservices/azureopenaistable/models/list).

## Model updates

Azure OpenAI now supports automatic updates for select model deployments. On models where automatic update support is available, a model version drop-down will be visible in Azure OpenAI Studio under **Create new deployment** and **Edit deployment**:

:::image type="content" source="../media/models/auto-update.png" alt-text="Screenshot of the deploy model UI of Azure OpenAI Studio." lightbox="../media/models/auto-update.png":::

You can learn more about Azure OpenAI model versions and how they work in the [Azure OpenAI model versions](../concepts/model-versions.md) article.

### Auto update to default

When **Auto-update to default** is selected your model deployment will be automatically updated within two weeks of a change in the default version.

If you're still in the early testing phases for inference models, we recommend deploying models with **auto-update to default** set whenever it's available.

### Specific model version

As your use of Azure OpenAI evolves, and you start to build and integrate with applications you might want to manually control model updates so that you can first test and validate that model performance is remaining consistent for your use case prior to upgrade.

When you select a specific model version for a deployment this version will remain selected until you either choose to manually update yourself, or once you reach the retirement date for the model. When the retirement date is reached the model will automatically upgrade to the default version at the time of retirement.

## Viewing deprecation dates

For currently deployed models, from Azure OpenAI Studio select **Deployments**:

:::image type="content" source="../media/models/deployments.png" alt-text="Screenshot of the deployment UI of Azure OpenAI Studio." lightbox="../media/models/deployments.png":::

To view deprecation/expiration dates for all available models in a given region from Azure OpenAI Studio select **Models** > **Column options** > Select **Deprecation fine tune** and **Deprecation inference**:

:::image type="content" source="../media/models/column-options.png" alt-text="Screenshot of the models UI of Azure OpenAI Studio." lightbox="../media/models/column-options.png":::

## Model deployment upgrade configuration

There are three distinct model deployment upgrade options which are configurable via REST API:

| Name | Description |
|------|--------|
| `OnceNewDefaultVersionAvailable` | Once a new version is designated as the default, the model deployment will automatically upgrade to the default version within two weeks of that designation change being made. |
|`OnceCurrentVersionExpired` | Once the retirement date is reached the model deployment will automatically upgrade to the current default version. |
|`NoAutoUpgrade` | The model deployment will never automatically upgrade. Once the retirement date is reached the model deployment will stop working. You will need to update your code referencing that deployment to point to a non-expired model deployment. |

To query the current model deployment settings including the deployment upgrade configuration for a given resource use [`Deployments List`](/rest/api/cognitiveservices/accountmanagement/deployments/list?tabs=HTTP#code-try-0)  

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CognitiveServices/accounts/{accountName}/deployments?api-version=2023-05-01
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```acountname``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```resourceGroupName``` | string |  Required | The name of the associated resource group for this model deployment. |
| ```subscriptionId``` | string |  Required | Subscription ID for the associated subscription. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD format. |

**Supported versions**

- `2023-05-01` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/1e71ad94aeb8843559d59d863c895770560d7c93/specification/cognitiveservices/resource-manager/Microsoft.CognitiveServices/stable/2023-05-01/cognitiveservices.json)

### Example response

```json
{
      "id": "/subscriptions/{Subcription-GUID}/resourceGroups/{Resource-Group-Name}/providers/Microsoft.CognitiveServices/accounts/{Resource-Name}/deployments/text-davinci-003",
      "type": "Microsoft.CognitiveServices/accounts/deployments",
      "name": "text-davinci-003",
      "sku": {
        "name": "Standard",
        "capacity": 60
      },
      "properties": {
        "model": {
          "format": "OpenAI",
          "name": "text-davinci-003",
          "version": "1"
        },
        "versionUpgradeOption": "OnceNewDefaultVersionAvailable",
        "capabilities": {
          "completion": "true",
          "search": "true"
        },
        "raiPolicyName": "Microsoft.Default",
        "provisioningState": "Succeeded",
        "rateLimits": [
          {
            "key": "request",
            "renewalPeriod": 10,
            "count": 60
          },
          {
            "key": "token",
            "renewalPeriod": 60,
            "count": 60000
          }
        ]
      }
```

You can then take the settings from this list to construct an update model REST API call as described below if you want to modify the deployment upgrade configuration.

## Update & deploy models via the API

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CognitiveServices/accounts/{accountName}/deployments/{deploymentName}?api-version=2023-05-01
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```acountname``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deploymentName``` | string | Required | The deployment name you chose when you deployed an existing model or the name you would like a new model deployment to have.   |
| ```resourceGroupName``` | string |  Required | The name of the associated resource group for this model deployment. |
| ```subscriptionId``` | string |  Required | Subscription ID for the associated subscription. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD format. |

**Supported versions**

- `2023-05-01` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/1e71ad94aeb8843559d59d863c895770560d7c93/specification/cognitiveservices/resource-manager/Microsoft.CognitiveServices/stable/2023-05-01/cognitiveservices.json)

**Request body**

This is only a subset of the available request body parameters. For the full list of the parameters, you can refer to the [REST API reference documentation](/rest/api/cognitiveservices/accountmanagement/deployments/create-or-update).

|Parameter|Type| Description |
|--|--|--|
|versionUpgradeOption | String | Deployment model version upgrade options:<br>`OnceNewDefaultVersionAvailable`<br>`OnceCurrentVersionExpired`<br>`NoAutoUpgrade`|
|capacity|integer|This represents the amount of [quota](../how-to/quota.md) you are assigning to this deployment. A value of 1 equals 1,000 Tokens per Minute (TPM)|

#### Example request

```Bash
curl -X PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-temp/providers/Microsoft.CognitiveServices/accounts/docs-openai-test-001/deployments/text-embedding-ada-002-test-1?api-version=2023-05-01 \
  -H "Content-Type: application/json" \
  -H 'Authorization: Bearer YOUR_AUTH_TOKEN' \
  -d '{"sku":{"name":"Standard","capacity":1},"properties": {"model": {"format": "OpenAI","name": "text-embedding-ada-002","version": "2"},"versionUpgradeOption":"OnceCurrentVersionExpired"}}'
```

> [!NOTE]
> There are multiple ways to generate an authorization token. The easiest method for initial testing is to launch the Cloud Shell from the [Azure portal](https://portal.azure.com). Then run [`az account get-access-token`](/cli/azure/account?view=azure-cli-latest#az-account-get-access-token&preserve-view=true). You can use this token as your temporary authorization token for API testing.

#### Example response

```json
{
  "id": "/subscriptions/{subscription-id}/resourceGroups/resource-group-temp/providers/Microsoft.CognitiveServices/accounts/docs-openai-test-001/deployments/text-embedding-ada-002-test-1",
  "type": "Microsoft.CognitiveServices/accounts/deployments",
  "name": "text-embedding-ada-002-test-1",
  "sku": {
    "name": "Standard",
    "capacity": 1
  },
  "properties": {
    "model": {
      "format": "OpenAI",
      "name": "text-embedding-ada-002",
      "version": "2"
    },
    "versionUpgradeOption": "OnceCurrentVersionExpired",
    "capabilities": {
      "embeddings": "true",
      "embeddingsMaxInputs": "1"
    },
    "provisioningState": "Succeeded",
    "ratelimits": [
      {
        "key": "request",
        "renewalPeriod": 10,
        "count": 2
      },
      {
        "key": "token",
        "renewalPeriod": 60,
        "count": 1000
      }
    ]
  },
  "systemData": {
    "createdBy": "docs@contoso.com",
    "createdByType": "User",
    "createdAt": "2023-06-13T00:12:38.885937Z",
    "lastModifiedBy": "docs@contoso.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-06-13T02:41:04.8410965Z"
  },
  "etag": "\"{GUID}\""
}
```

## Next steps

- [Learn more about Azure OpenAI model regional availability](../concepts/models.md)
- [Learn more about Azure OpenAI](../overview.md)
