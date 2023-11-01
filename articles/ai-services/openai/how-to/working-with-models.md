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

You can check what model upgrade options are set for previously deployed models in [Azure OpenAI Studio](https://oai.azure.com). Select **Deployments** > Under the deployment name column select one of the deployment names that are highlighted in blue.

:::image type="content" source="../media/how-to/working-with-models/deployments.png" alt-text="Screenshot of the deployments pane with a deployment name highlighted." lightbox="../media/how-to/working-with-models/deployments.png":::

This will open the **Properties** for the model deployment. You can view what upgrade options are set for your deployment under **Version update policy**:

:::image type="content" source="../media/how-to/working-with-models/update-policy.png" alt-text="Screenshot of the model deployments property UI." lightbox="../media/how-to/working-with-models/update-policy.png":::

The corresponding property can also be accessed via [REST](../how-to/working-with-models.md#model-deployment-upgrade-configuration), [Azure PowerShell](/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccountdeployment), and [Azure CLI](/cli/azure/cognitiveservices/account/deployment#az-cognitiveservices-account-deployment-show).

|Option| Read | Update |
|---|---|---|
| [REST](../how-to/working-with-models.md#model-deployment-upgrade-configuration) | Yes. If `versionUpgradeOption` is not returned it means it is `null` |Yes |
| [Azure PowerShell](/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccountdeployment) | Yes.`VersionUpgradeOption` can be checked for `$null`| Yes |
| [Azure CLI](/cli/azure/cognitiveservices/account/deployment#az-cognitiveservices-account-deployment-show) | Yes. It shows `null` if `versionUpgradeOption` is not set.| *No.* It is currently not possible to update the version upgrade option.|

There are three distinct model deployment upgrade options:

| Name | Description |
|------|--------|
| `OnceNewDefaultVersionAvailable` | Once a new version is designated as the default, the model deployment will automatically upgrade to the default version within two weeks of that designation change being made. |
|`OnceCurrentVersionExpired` | Once the retirement date is reached the model deployment will automatically upgrade to the current default version. |
|`NoAutoUpgrade` | The model deployment will never automatically upgrade. Once the retirement date is reached the model deployment will stop working. You will need to update your code referencing that deployment to point to a nonexpired model deployment. |

> [!NOTE]
> `null` is equivalent to `AutoUpgradeWhenExpired`. If the **Version update policy** option is not present in the properties for a model that supports model upgrades this indicates the value is currently `null`. Once you explicitly modify this value the property will be visible in the studio properties page as well as via the REST API.

### Examples

# [PowerShell](#tab/powershell)

Review the Azure PowerShell [getting started guide](/powershell/azure/get-started-azureps) to install Azure PowerShell locally or you can use the [Azure Cloud Shell](/azure/cloud-shell/overview).

The steps below demonstrate checking the `VersionUpgradeOption` option property as well as updating it:

```powershell
// Step 1: Get Deployment
$deployment = Get-AzCognitiveServicesAccountDeployment -ResourceGroupName {ResourceGroupName} -AccountName {AccountName} -Name {DeploymentName}
 
// Step 2: Show Deployment VersionUpgradeOption
$deployment.Properties.VersionUpgradeOption
 
// VersionUpgradeOption can be null - one way to check is
$null -eq $deployment.Properties.VersionUpgradeOption
 
// Step 3: Update Deployment VersionUpgradeOption
$deployment.Properties.VersionUpgradeOption = "NoAutoUpgrade"
New-AzCognitiveServicesAccountDeployment -ResourceGroupName {ResourceGroupName} -AccountName {AccountName} -Name {DeploymentName} -Properties $deployment.Properties -Sku $deployment.Sku
 
// repeat step 1 and 2 to confirm the change.
// If not sure about deployment name, use this command to show all deployments under an account
Get-AzCognitiveServicesAccountDeployment -ResourceGroupName {ResourceGroupName} -AccountName {AccountName}
```

```powershell
// To update to a new model version

// Step 1: Get Deployment
$deployment = Get-AzCognitiveServicesAccountDeployment -ResourceGroupName {ResourceGroupName} -AccountName {AccountName} -Name {DeploymentName}

// Step 2: Show Deployment Model properties
$deployment.Properties.Model.Version

// Step 3: Update Deployed Model Version
$deployment.Properties.Model.Version = "0613"
New-AzCognitiveServicesAccountDeployment -ResourceGroupName {ResourceGroupName} -AccountName {AccountName} -Name {DeploymentName} -Properties $deployment.Properties -Sku $deployment.Sku

// repeat step 1 and 2 to confirm the change.
```

# [REST](#tab/rest)

To query the current model deployment settings including the deployment upgrade configuration for a given resource use [`Deployments List`](/rest/api/cognitiveservices/accountmanagement/deployments/list?tabs=HTTP#code-try-0). If the value is null you won't see a `versionUpgradeOption` property.

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
  "value": [
    {
      "id": "/subscriptions/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeeb/resourceGroups/az-test-openai/providers/Microsoft.CognitiveServices/accounts/aztestopenai001/deployments/gpt-35-turbo",
      "type": "Microsoft.CognitiveServices/accounts/deployments",
      "name": "gpt-35-turbo",
      "sku": {
        "name": "Standard",
        "capacity": 80
      },
      "properties": {
        "model": {
          "format": "OpenAI",
          "name": "gpt-35-turbo",
          "version": "0301"
        },
        "versionUpgradeOption": "OnceNewDefaultVersionAvailable",
        "capabilities": {
          "completion": "true",
          "chatCompletion": "true"
        },
        "raiPolicyName": "Microsoft.Default",
        "provisioningState": "Succeeded",
        "rateLimits": [
          {
            "key": "request",
            "renewalPeriod": 10,
            "count": 80
          },
          {
            "key": "token",
            "renewalPeriod": 60,
            "count": 80000
          }
        ]
      },
      "systemData": {
        "createdBy": "docs@contoso.com",
        "createdByType": "User",
        "createdAt": "2023-07-31T16:45:32.622404Z",
        "lastModifiedBy": "docs@contoso.com",
        "lastModifiedByType": "User",
        "lastModifiedAt": "2023-10-31T13:59:34.4978286Z"
      },
      "etag": "\"aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee\""
    }
  ]
}
```

You can then take the settings from this list to construct an update model REST API call as described below if you want to modify the deployment upgrade configuration.

---

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
curl -X PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-temp/providers/Microsoft.CognitiveServices/accounts/docs-openai-test-001/deployments/gpt-35-turbo?api-version=2023-05-01 \
  -H "Content-Type: application/json" \
  -H 'Authorization: Bearer YOUR_AUTH_TOKEN' \
  -d '{"sku":{"name":"Standard","capacity":120},"properties": {"model": {"format": "OpenAI","name": "gpt-35-turbo","version": "0613"},"versionUpgradeOption":"OnceCurrentVersionExpired"}}'
```

> [!NOTE]
> There are multiple ways to generate an authorization token. The easiest method for initial testing is to launch the Cloud Shell from the [Azure portal](https://portal.azure.com). Then run [`az account get-access-token`](/cli/azure/account?view=azure-cli-latest#az-account-get-access-token&preserve-view=true). You can use this token as your temporary authorization token for API testing.

#### Example response

```json
 {
  "id": "/subscriptions/{subscription-id}/resourceGroups/resource-group-temp/providers/Microsoft.CognitiveServices/accounts/docs-openai-test-001/deployments/gpt-35-turbo",
  "type": "Microsoft.CognitiveServices/accounts/deployments",
  "name": "gpt-35-turbo",
  "sku": {
    "name": "Standard",
    "capacity": 120
  },
  "properties": {
    "model": {
      "format": "OpenAI",
      "name": "gpt-35-turbo",
      "version": "0613"
    },
    "versionUpgradeOption": "OnceCurrentVersionExpired",
    "capabilities": {
      "chatCompletion": "true"
    },
    "provisioningState": "Succeeded",
    "rateLimits": [
      {
        "key": "request",
        "renewalPeriod": 10,
        "count": 120
      },
      {
        "key": "token",
        "renewalPeriod": 60,
        "count": 120000
      }
    ]
  },
  "systemData": {
    "createdBy": "docs@contoso.com",
    "createdByType": "User",
    "createdAt": "2023-02-28T02:57:15.8951706Z",
    "lastModifiedBy": "docs@contoso.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-10-31T15:35:53.082912Z"
  },
  "etag": "\"GUID\""
}
```

## Next steps

- [Learn more about Azure OpenAI model regional availability](../concepts/models.md)
- [Learn more about Azure OpenAI](../overview.md)
