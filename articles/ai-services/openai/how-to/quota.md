---
title: Manage Azure OpenAI Service quota
titleSuffix: Azure AI services
description: Learn how to use Azure OpenAI to control your deployments rate limits.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: how-to
ms.date: 08/01/2023
ms.author: mbullwin
---

# Manage Azure OpenAI Service quota

Quota provides the flexibility to actively manage the allocation of rate limits across the deployments within your subscription. This article walks through the process of managing your Azure OpenAI quota.

## Prerequisites

> [!IMPORTANT]
> Viewing quota and deploying models requires the **Cognitive Services Usages Reader** role. This role provides the minimal access necessary to view quota usage across an Azure subscription. To learn more about this role and the other roles you will need to access Azure OpenAI, consult our [Azure role-based access (Azure RBAC) guide](./role-based-access-control.md).
>
> This role can be found in the Azure portal under **Subscriptions** > **Access control (IAM)** > **Add role assignment** > search for **Cognitive Services Usages Reader**.This role **must be applied at the subscription level**, it does not exist at the resource level.
>
> If you do not wish to use this role, the subscription **Reader** role will provide equivalent access, but it will also grant read access beyond the scope of what is needed for viewing quota and model deployment.

## Introduction to quota

Azure OpenAI's quota feature enables assignment of rate limits to your deployments, up-to a global limit called your “quota.”  Quota is assigned to your subscription on a per-region, per-model basis in units of **Tokens-per-Minute (TPM)**. When you onboard a subscription to Azure OpenAI, you'll receive default quota for most available models. Then, you'll assign TPM to each deployment as it is created, and the available quota for that model will be reduced by that amount. You can continue to create deployments and assign them TPM until you reach your quota limit. Once that happens, you can only create new deployments of that model by reducing the TPM assigned to other deployments of the same model (thus freeing TPM for use), or by requesting and being approved for a model quota increase in the desired region.

> [!NOTE]
> With a quota of 240,000 TPM for GPT-35-Turbo in East US, a customer can create a single deployment of 240K TPM, 2 deployments of 120K TPM each, or any number of deployments in one or multiple Azure OpenAI resources as long as their TPM adds up to less than 240K total in that region.

When a deployment is created, the assigned TPM will directly map to the tokens-per-minute rate limit enforced on its inferencing requests. A **Requests-Per-Minute (RPM)** rate limit will also be enforced whose value is set proportionally to the TPM assignment using the following ratio:

6 RPM per 1000 TPM.

The flexibility to distribute TPM globally within a subscription and region has allowed Azure OpenAI Service to loosen other restrictions:

- The maximum resources per region are increased to 30.
- The limit on creating no more than one deployment of the same model in a resource has been removed.

## Assign quota

When you create a model deployment, you have the option to assign Tokens-Per-Minute (TPM) to that deployment. TPM can be modified in increments of 1,000, and will map to the TPM and RPM rate limits enforced on your deployment, as discussed above.

To create a new deployment from within the Azure AI Studio under **Management** select **Deployments** > **Create new deployment**.

The option to set the TPM is under the **Advanced options** drop-down:

:::image type="content" source="../media/quota/deployment.png" alt-text="Screenshot of the deployment UI of Azure AI Studio" lightbox="../media/quota/deployment.png":::

Post deployment you can adjust your TPM allocation by selecting **Edit deployment** under **Management** > **Deployments** in Azure AI Studio. You can also modify this selection within the new quota management experience under **Management** > **Quotas**.

> [!IMPORTANT]
> Quotas and limits are subject to change, for the most up-date-information consult our [quotas and limits article](../quotas-limits.md).

## Model specific settings

Different model deployments, also called model classes have unique max TPM values that you're now able to control. **This represents the maximum amount of TPM that can be allocated to that type of model deployment in a given region.** While each model type represents its own unique model class, the max TPM value is currently only different for certain model classes:

- GPT-4
- GPT-4-32K
- Text-Davinci-003

All other model classes have a common max TPM value.

> [!NOTE]
> Quota Tokens-Per-Minute (TPM) allocation is not related to the max input token limit of a model. Model input token limits are defined in the [models table](../concepts/models.md) and are not impacted by changes made to TPM.  

## View and request quota

For an all up view of your quota allocations across deployments in a given region, select **Management** > **Quota** in Azure AI Studio:

:::image type="content" source="../media/quota/quota.png" alt-text="Screenshot of the quota UI of Azure AI Studio" lightbox="../media/quota/quota.png":::

- **Quota Name**: There's one quota value per region for each model type. The quota covers all versions of that model.  The quota name can be expanded in the UI to show the deployments that are using the quota.
- **Deployment**: Model deployments divided by model class.
- **Usage/Limit**: For the quota name, this shows how much quota is used by deployments and the total quota approved for this subscription and region. This amount of quota used is also represented in the bar graph.
- **Request Quota**: The icon in this field navigates to a form where requests to increase quota can be submitted.

## Migrating existing deployments

As part of the transition to the new quota system and TPM based allocation, all existing Azure OpenAI model deployments have been automatically migrated to use quota. In cases where the existing TPM/RPM allocation exceeds the default values due to previous custom rate-limit increases, equivalent TPM were assigned to the impacted deployments.

## Understanding rate limits

Assigning TPM to a deployment sets the Tokens-Per-Minute (TPM) and Requests-Per-Minute (RPM) rate limits for the deployment, as described above. TPM rate limits are based on the maximum number of tokens that are estimated to be processed by a request at the time the request is received. It isn't the same as the token count used for billing, which is computed after all processing is completed.  

As each request is received, Azure OpenAI computes an estimated max processed-token count that includes the following:

- Prompt text and count
- The max_tokens parameter setting
- The best_of parameter setting

As requests come into the deployment endpoint, the estimated max-processed-token count is added to a running token count of all requests that is reset each minute. If at any time during that minute, the TPM rate limit value is reached, then further requests will receive a 429 response code until the counter resets.

RPM rate limits are based on the number of requests received over time. The rate limit expects that requests be evenly distributed over a one-minute period. If this average flow isn't maintained, then requests may receive a 429 response even though the limit isn't met when measured over the course of a minute. To implement this behavior, Azure OpenAI Service evaluates the rate of incoming requests over a small period of time, typically 1 or 10 seconds. If the number of requests received during that time exceeds what would be expected at the set RPM limit, then new requests will receive a 429 response code until the next evaluation period. For example, if Azure OpenAI is monitoring request rate on 1-second intervals, then rate limiting will occur for a 600-RPM deployment if more than 10 requests are received during each 1-second period (600 requests per minute = 10 requests per second).

### Rate limit best practices

To minimize issues related to rate limits, it's a good idea to use the following techniques:

- Set max_tokens and best_of to the minimum values that serve the needs of your scenario. For example, don’t set a large max-tokens value if you expect your responses to be small.
- Use quota management to increase TPM on deployments with high traffic, and to reduce TPM on deployments with limited needs.
- Implement retry logic in your application.
- Avoid sharp changes in the workload. Increase the workload gradually.
- Test different load increase patterns.

## Automate deployment

This section contains brief example templates to help get you started programmatically creating deployments that use quota to set TPM rate limits. With the introduction of quota you must use API version `2023-05-01` for resource management related activities. This API version is only for managing your resources, and does not impact the API version used for inferencing calls like completions, chat completions, embedding, image generation etc.

# [REST](#tab/rest)

### Deployment

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CognitiveServices/accounts/{accountName}/deployments/{deploymentName}?api-version=2023-05-01
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```accountName``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deploymentName``` | string | Required | The deployment name you chose when you deployed an existing model or the name you would like a new model deployment to have.   |
| ```resourceGroupName``` | string |  Required | The name of the associated resource group for this model deployment. |
| ```subscriptionId``` | string |  Required | Subscription ID for the associated subscription. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD format. |

**Supported versions**

- `2023-05-01` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/1e71ad94aeb8843559d59d863c895770560d7c93/specification/cognitiveservices/resource-manager/Microsoft.CognitiveServices/stable/2023-05-01/cognitiveservices.json)

**Request body**

This is only a subset of the available request body parameters. For the full list of the parameters, you can refer to the [REST API reference documentation](/rest/api/cognitiveservices/accountmanagement/deployments/create-or-update?tabs=HTTP).

|Parameter|Type| Description |
|--|--|--|
|sku | Sku | The resource model definition representing SKU.|
|capacity|integer|This represents the amount of [quota](../how-to/quota.md) you are assigning to this deployment. A value of 1 equals 1,000 Tokens per Minute (TPM). A value of 10 equals 10k Tokens per Minute (TPM).|

#### Example request

```Bash
curl -X PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-temp/providers/Microsoft.CognitiveServices/accounts/docs-openai-test-001/deployments/gpt-35-turbo-test-deployment?api-version=2023-05-01 \
  -H "Content-Type: application/json" \
  -H 'Authorization: Bearer YOUR_AUTH_TOKEN' \
  -d '{"sku":{"name":"Standard","capacity":10},"properties": {"model": {"format": "OpenAI","name": "gpt-35-turbo","version": "0613"}}}'
```

> [!NOTE]
> There are multiple ways to generate an authorization token. The easiest method for initial testing is to launch the Cloud Shell from the [Azure portal](https://portal.azure.com). Then run [`az account get-access-token`](/cli/azure/account?view=azure-cli-latest#az-account-get-access-token&preserve-view=true). You can use this token as your temporary authorization token for API testing.

For more information, refer to the REST API reference documentation for [usages](/rest/api/cognitiveservices/accountmanagement/usages/list?branch=main&tabs=HTTP) and [deployment](/rest/api/cognitiveservices/accountmanagement/deployments/create-or-update).

### Usage

To query your quota usage in a given region, for a specific subscription

```html
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.CognitiveServices/locations/{location}/usages?api-version=2023-05-01
```
**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```subscriptionId``` | string |  Required | Subscription ID for the associated subscription. |
|```location```        | string | Required | Location to view usage for ex: `eastus` |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD format. |

**Supported versions**

- `2023-05-01` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/1e71ad94aeb8843559d59d863c895770560d7c93/specification/cognitiveservices/resource-manager/Microsoft.CognitiveServices/stable/2023-05-01/cognitiveservices.json)

#### Example request

```Bash
curl -X GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.CognitiveServices/locations/eastus/usages?api-version=2023-05-01 \
  -H "Content-Type: application/json" \
  -H 'Authorization: Bearer YOUR_AUTH_TOKEN' 
```

# [Azure CLI](#tab/cli)

Install the [Azure CLI](/cli/azure/install-azure-cli). Quota requires `Azure CLI version 2.51.0`. If you already have Azure CLI installed locally run `az upgrade` to update to the latest version.

To check which version of Azure CLI you are running use `az version`. Azure Cloud Shell is currently still running 2.50.0 so in the interim local installation of Azure CLI is required to take advantage of the latest Azure OpenAI features.

### Deployment

```azurecli
az cognitiveservices account deployment create --model-format
                                               --model-name
                                               --model-version
                                               --name
                                               --resource-group
                                               [--capacity]
                                               [--deployment-name]
                                               [--scale-capacity]
                                               [--scale-settings-scale-type {Manual, Standard}]
                                               [--sku]
```

To sign into your local installation of the CLI, run the [az login](/cli/azure/reference-index#az-login) command:

```azurecli
az login
```

<!--TODO:You can also use the green **Try It** button to run these commands in your browser in the Azure Cloud Shell.-->

By setting sku-capacity to 10 in the command below this deployment will be set with a 10K TPM limit.

```azurecli
az cognitiveservices account deployment create -g test-resource-group -n test-resource-name --deployment-name test-deployment-name --model-name gpt-35-turbo --model-version "0613" --model-format OpenAI --sku-capacity 10 --sku-name "Standard"
```

### Usage

To [query your quota usage](/cli/azure/cognitiveservices/usage?view=azure-cli-latest&preserve-view=true) in a given region, for a specific subscription

```azurecli
az cognitiveservices usage list --location
```

### Example

```azurecli
az cognitiveservices usage list -l eastus
```

This command runs in the context of the currently active subscription for Azure CLI. Use `az-account-set --subscription` to [modify the active subscription](/cli/azure/manage-azure-subscriptions-azure-cli#change-the-active-subscription).

For more details on `az cognitiveservices account` and `az cognitivesservices usage` consult the [Azure CLI reference documentation](/cli/azure/cognitiveservices/account/deployment?view=azure-cli-latest&preserve-view=true)

# [Azure Resource Manager](#tab/arm)

```json
//
// This Azure Resource Manager template shows how to use the new schema introduced in the 2023-05-01 API version to 
// create deployments that set the model version and the TPM limits for standard deployments.
//
{
    "type": "Microsoft.CognitiveServices/accounts/deployments",
    "apiVersion": "2023-05-01",
    "name": "arm-je-aoai-test-resource/arm-je-std-deployment",    // Update reference to parent Azure OpenAI resource
    "dependsOn": [
        "[resourceId('Microsoft.CognitiveServices/accounts', 'arm-je-aoai-test-resource')]"  // Update reference to parent Azure OpenAI resource
    ],
    "sku": {
        "name": "Standard",      
        "capacity": 10            // The deployment will be created with a 10K TPM limit
    },
    "properties": {
        "model": {
            "format": "OpenAI",
            "name": "gpt-35-turbo",
            "version": "0613"        // Version 0613 of gpt-35-turbo will be used
        }
    }
}
```

For more details, consult the [full Azure Resource Manager reference documentation](/azure/templates/microsoft.cognitiveservices/accounts/deployments?pivots=deployment-language-arm-template).

# [Bicep](#tab/bicep)

```bicep
//
// This Bicep template shows how to use the new schema introduced in the 2023-05-01 API version to 
// create deployments that set the model version and the TPM limits for standard deployments.
//
resource arm_je_std_deployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: arm_je_aoai_resource   // Replace this with a reference to the parent Azure OpenAI resource
  name: 'arm-je-std-deployment'
  sku: {
    name: 'Standard'            
    capacity: 10                 // The deployment will be created with a 10K TPM limit
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-35-turbo'
      version: '0613'           // gpt-35-turbo version 0613 will be used
    }
  }
}
```

For more details consult the [full Bicep reference documentation](/azure/templates/microsoft.cognitiveservices/accounts/deployments?pivots=deployment-language-bicep).

# [Terraform](#tab/terraform)

```terraform
# This Terraform template shows how to use the new schema introduced in the 2023-05-01 API version to 
# create deployments that set the model version and the TPM limits for standard deployments.
# 
# The new schema is not yet available in the AzureRM provider (target v4.0), so this template uses the AzAPI
# provider, which provides a Terraform-compatible interface to the underlying ARM structures.
# 
# For more details on these providers:
#     AzureRM: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs
#     AzAPI: https://registry.terraform.io/providers/azure/azapi/latest/docs
#

# 
terraform {
  required_providers {
    azapi   = { source  = "Azure/azapi" }
    azurerm = { source  = "hashicorp/azurerm" }
  }
}

provider "azapi" {
  # Insert auth info here as necessary
}

provider "azurerm" {
    # Insert auth info here as necessary  
    features {
    }
}

# 
# To create a complete example, AzureRM is used to create a new resource group and Azure OpenAI Resource
# 
resource "azurerm_resource_group" "TERRAFORM-AOAI-TEST-GROUP" {
  name     = "TERRAFORM-AOAI-TEST-GROUP"
  location = "canadaeast"
}

resource "azurerm_cognitive_account" "TERRAFORM-AOAI-TEST-ACCOUNT" {
  name                  = "terraform-aoai-test-account"
  location              = "canadaeast"
  resource_group_name   = azurerm_resource_group.TERRAFORM-AOAI-TEST-GROUP.name
  kind                  = "OpenAI"
  sku_name              = "S0"
  custom_subdomain_name = "terraform-test-account-"
  }


# 
# AzAPI is used to create the deployment so that the TPM limit and model versions can be set
#
resource "azapi_resource" "TERRAFORM-AOAI-STD-DEPLOYMENT" {
  type      = "Microsoft.CognitiveServices/accounts/deployments@2023-05-01"
  name      = "TERRAFORM-AOAI-STD-DEPLOYMENT"
  parent_id = azurerm_cognitive_account.TERRAFORM-AOAI-TEST-ACCOUNT.id

  body = jsonencode({
    sku = {                            # The sku object specifies the deployment type and limit in 2023-05-01
        name = "Standard",             
        capacity = 10                  # This deployment will be set with a 10K TPM limit
    },
    properties = {
        model = {
            format = "OpenAI",
            name = "gpt-35-turbo",
            version = "0613"           # Deploy gpt-35-turbo version 0613
        }
    }
  })
}
```

For more details consult the [full Terraform reference documentation](/azure/templates/microsoft.cognitiveservices/accounts/deployments?pivots=deployment-language-terraform).

---

## Resource deletion

When an attempt to delete an Azure OpenAI resource is made from the Azure portal if any deployments are still present deletion is blocked until the associated deployments are deleted. Deleting the deployments first allows quota allocations to be properly freed up so they can be used on new deployments.

However, if you delete a resource using the REST API or some other programmatic method, this bypasses the need to delete deployments first. When this occurs, the associated quota allocation will remain unavailable to assign to a new deployment for 48 hours until the resource is purged. To trigger an immediate purge for a deleted resource to free up quota, follow the [purge a deleted resource instructions](/azure/ai-services/manage-resources?tabs=azure-portal#purge-a-deleted-resource).

## Next steps

- To review quota defaults for Azure OpenAI, consult the [quotas & limits article](../quotas-limits.md)
