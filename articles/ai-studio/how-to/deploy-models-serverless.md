---
title: Deploy models as serverless APIs
titleSuffix: Azure AI Studio
description: Learn about to deploy models as serverless API.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: conceptual
ms.date: 05/03/2024
ms.reviewer: msakande 
reviewer: msakande
ms.author: fasantia
author: santiagxf
---

# Deploy models as serverless APIs

Certain models in the model catalog can be deployed as a serverless API endpoint with pay-as-you-go, providing a way to consume them as an API without hosting them on your subscription, while keeping the enterprise security and compliance organizations need. This deployment option doesn't require quota from your subscription.

In this example, you will learn how to deploy a **Meta-Llama-3-8B-Instruct** model as a serverless API endpoint.

## Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.

- An [Azure AI Studio hub](create-azure-ai-resource.md).

- An [Azure AI Studio project](create-projects.md).

- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure AI Studio. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the resource group. For more information on permissions, see [Role-based access control in Azure AI Studio](../concepts/rbac-ai-studio.md).

- You need to install the following software to work with Azure AI Studio:

    # [Portal](#tab/portal)

    You can use any compatible web browser to navigate [Azure AI Studio](https://ai.azure.com).

    # [CLI](#tab/cli)

    The [Azure CLI](https://learn.microsoft.com/cli/azure/) and the [ml extension for Azure Machine Learning](../../machine-learning/how-to-configure-cli.md).

    ```azurecli
    az extension add -n ml
    ```

    If you already have the extension installed, ensure the latest version is installed.

    ```azurecli
    az extension update -n ml
    ```

    Once the extension is installed, configure it:

    ```azurecli
    az account set --subscription <subscription>
    az configure --defaults workspace=<project-name> group=<resource-group> location=<location>
    ```

    [!INCLUDE [Feature preview](../includes/feature-preview.md)]

    # [Python](#tab/sdk)

    Install the [Azure Machine Learning SDK for Python](https://aka.ms/sdk-v2-install).

    ```python
    pip install -U azure-ai-ml
    ```

    Once installed, import necessary namespaces and create a client connected to your project:

    ```python
    from azure.ai.ml import MLClient
    from azure.identity import InteractiveBrowserCredential
    from azure.ai.ml.entities import MarketplaceSubscription, ServerlessEndpoint

    client = MLClient(
        credential=InteractiveBrowserCredential(tenant_id="<tenant-id>"),
        subscription_id="<subscription-id>",
        resource_group_name="<resource-group>",
        workspace_name="<project-name>",
    )
    ```

    [!INCLUDE [Feature preview](../includes/feature-preview.md)]

    # [ARM](#tab/arm)

    You can use any compatible web browser to [deploy ARM templates](../../azure-resource-manager/templates/deploy-portal.md) in Azure portal or using any of the deployment tools. This tutorial uses the [Azure CLI](https://learn.microsoft.com/cli/azure/).


## Model marketplace subscriptions

Models offered through the Azure Marketplace can be deployed to serverless API endpoints to consume their predictions. If this is your first time deploying the model in the project, you have to subscribe your project for the particular offering from the Azure Marketplace. Each project has its own subscription to the particular Azure Marketplace offering of the model, which allows you to control and monitor spending.

1. Ensure your account has the **Azure AI Developer** role permissions on the Resource Group.

1. Navigate to the model catalog, find the model card of the model you want to deploy, and copy the **Model ID**. If you are deploying the model using Azure AI portal, you don't need to copy the **Model ID**.

1. Create the model marketplace subscription

    # [Portal](#tab/portal)

    1. On the model's **Details** page, select **Deploy** and then select **Pay-as-you-go**.

        :::image type="content" source="../media/deploy-monitor/llama/deploy-pay-as-you-go.png" alt-text="A screenshot showing how to deploy a model with the pay-as-you-go option." lightbox="../media/deploy-monitor/llama/deploy-pay-as-you-go.png":::

    2. Select the project in which you want to deploy your models. Notice that not all the regions are supported.

    3. On the deployment wizard, select the link to Azure Marketplace Terms to learn more about the terms of use. You can also select the Marketplace offer details tab to learn about pricing for the selected model.

    4. Select Subscribe and Deploy.

        :::image type="content" source="../media/deploy-monitor/llama/deploy-marketplace-terms.png" alt-text="A screenshot showing the terms and conditions of a given model." lightbox="../media/deploy-monitor/llama/deploy-marketplace-terms.png":::

    # [CLI](#tab/cli)

    ```azurecli
    az ml marketplace-subscription create \
        --name "Meta-Llama-3-8B-Instruct" \
        --model_id "azureml://registries/azureml-meta/models/Meta-Llama-3-8B-Instruct"
    ```

    # [Python](#tab/sdk)

    ```python
    model_id="azureml://registries/azureml-meta/models/Meta-Llama-3-8B-Instruct"
    subscription_name="Meta-Llama-3-8B-Instruct"

    marketplace_subscription = MarketplaceSubscription(
        model_id=model_id,
        name=subscription_name,
    )

    marketplace_subscription = client.marketplace_subscriptions.begin_create_or_update(
        marketplace_subscription
    ).result()
    ```

    # [ARM](#tab/arm)

    Use the following template to create a model subscription:

    __template.json__

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "project_name": {
                "defaultValue": "my-project",
                "type": "String"
            },
            "subscription_name": {
                "defaultValue": "Meta-Llama-3-8B-Instruct",
                "type": "String"
            },
            "model_id": {
                "defaultValue": "azureml://registries/azureml-meta/models/Meta-Llama-3-8B-Instruct",
                "type": "String"
            }
        },
        "variables": {},
        "resources": [
            {
                "type": "Microsoft.MachineLearningServices/workspaces/marketplaceSubscriptions",
                "apiVersion": "2024-04-01",
                "name": "[concat(parameters('project_name'), '/', parameters('subscription_name'))]",
                "location": "[parameters('location')]",
                "properties": {
                    "modelId": "[parameters('model_id')]"
                }
            }
        ]
    }
    ```

    Then create the deployment:

    ```azurecli
    az deployment group create \
        --name model-subscription-deployment \
        --resource-group <resource-group> \
        --template-file template.json
    ```

    The Azure deployment template can take a few minutes to complete. When it finishes, you see a message that includes the result:

    ```output
    "provisioningState": "Succeeded",
    ```

1. Creating a subscription will accept the terms and conditions associated with the model offer.

1. Once you sign up the project for the particular Azure Marketplace offering, subsequent deployments of the same offering in the same project don't require subscribing again.

1. At any point, you can see the models your project is currently subscribed:

    # [Portal](#tab/portal)

    1. Go to [Azure Portal](https://portal.azure.com)

    1. Navigate to the resource group where the project is deployed.

    1. On the **Type** filter, select **SaaS**.

    1. You see all the offerings you are currently subscripted to.

    1. Select any resource to see the details.

    # [CLI](#tab/cli)

    ```azurecli
    az ml marketplace-subscription list
    ```

    # [Python](#tab/sdk)

    ```python
    marketplace_sub_list = client.marketplace_subscriptions.list()

    for sub in marketplace_sub_list:
        print(sub.as_dict())
    ```

    # [ARM](#tab/arm)

    You can use the Resource Management tools to query the resources. In the following example, we use Azure CLI:

    ```azurecli
    az resource list \
        --query "[?type=='Microsoft.SaaS']"
    ```

## Serverless API endpoints

Once you have a model subscription created, you can deploy the associated models to a serverless API endpoint. They provide a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance organizations need. This deployment option doesn't require quota from your subscription.

In this example, we create an endpoint with name **meta-llama3-8b-qwerty**.

1. Create the serverless endpoint

    # [Portal](#tab/portal)

    1. From the previous wizard, select **Continue to deploy**.

        :::image type="content" source="../media/deploy-monitor/llama/deploy-pay-as-you-go-project.png" alt-text="A screenshot showing a project that is already subscribed to the offering." lightbox="../media/deploy-monitor/llama/deploy-pay-as-you-go-project.png":::

    1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region.

        :::image type="content" source="../media/deploy-monitor/llama/deployment-name.png" alt-text="A screenshot showing how to indicate the name of the deployment you want to create." lightbox="../media/deploy-monitor/llama/deployment-name.png":::

    1. Select Deploy. Wait until the deployment is ready and you're redirected to the Deployments page.

    # [CLI](#tab/cli)

    Use the previous file to create the endpoint:

    ```azurecli
    az ml serverless-endpoint create \
        --name "meta-llama3-8b-qwerty" \
        --model_id "azureml://registries/azureml-meta/models/Meta-Llama-3-8B-Instruct"
    ```

    # [Python](#tab/sdk)

    ```python
    endpoint_name="meta-llama3-8b-qwerty"
    
    serverless_endpoint = ServerlessEndpoint(
        name=endpoint_name,
        model_id=model_id
    )

    created_endpoint = client.serverless_endpoints.begin_create_or_update(
        serverless_endpoint
    ).result()
    ```

    # [ARM](#tab/arm)

    Use the following template to create an endpoint:

    __template.json__

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "project_name": {
                "defaultValue": "my-project",
                "type": "String"
            },
            "endpoint_name": {
                "defaultValue": "meta-llama3-8b-qwerty",
                "type": "String"
            },
            "location": {
                "defaultValue": "eastus2",
                "type": "String"
            },
            "model_id": {
                "defaultValue": "azureml://registries/azureml-meta/models/Meta-Llama-3-8B-Instruct",
                "type": "String"
            }
        },
        "variables": {},
        "resources": [
            {
                "type": "Microsoft.MachineLearningServices/workspaces/serverlessEndpoints",
                "apiVersion": "2024-04-01",
                "name": "[concat(parameters('project_name'), '/', parameters('endpoint_name'))]",
                "location": "[parameters('location')]",
                "sku": {
                    "name": "Consumption"
                },
                "properties": {
                    "modelSettings": {
                        "modelId": "[parameters('model_id')]"
                    }
                }
            }
        ]
    }
    ```

    Then create the deployment:

    ```azurecli
    az deployment group create \
        --name model-subscription-deployment \
        --resource-group <resource-group> \
        --template-file template.json
    ```

    The Azure deployment template can take a few minutes to complete. When it finishes, you see a message that includes the result:

    ```output
    "provisioningState": "Succeeded",
    ```

1. At any point, you can see the endpoints deployed to your project:

    # [Portal](#tab/portal)

    1. Go to your project.

    1. Select the section **Deployments**

    1. Serverless API endpoints is displayed.

    # [CLI](#tab/cli)

    ```azurecli
    az ml serverless-endpoint list
    ```

    # [Python](#tab/sdk)

    ```python
    endpoint_name="meta-llama3-8b-qwerty"
    
    serverless_endpoint = ServerlessEndpoint(
        name=endpoint_name,
        model_id=model_id
    )

    created_endpoint = client.serverless_endpoints.begin_create_or_update(
        serverless_endpoint
    ).result()
    ```

    # [ARM](#tab/arm)

    You can use the Resource Management tools to query the resources. In the following example, we use Azure CLI:

    ```azurecli
    az resource list \
        --query "[?type=='Microsoft.MachineLearningServices/workspaces/serverlessEndpoints']"
    ```

1. The created endpoint uses key authentication for authorization. Use the following steps to get the keys associated with a given endpoint.

    # [Portal](#tab/portal)

    You can return to the Deployments page, select the deployment, and note the endpoint's Target URL and the Secret Key. Use them to call the deployment and generate predictions.

    > [!NOTE]
    > When using [Azure Portal](https://portal.azure.com), serverless API endpoints aren't displayed by default on the resource group. Use **Show hidden types** option to display them on the resource group.

    # [CLI](#tab/cli)

    ```azurecli
    az ml serverless-endpoint get-credentials -n meta-llama3-8b-qwerty
    ```

    # [Python](#tab/sdk)

    ```python
    endpoint_keys = client.serverless_endpoints.get_keys(endpoint_name)
    print(endpoint_keys.primary_key)
    print(endpoint_keys.secondary_key)
    ```

    # [ARM](#tab/arm)

    Use REST APIs to query this information.

## Delete endpoints and subscriptions

You can delete model subscriptions and endpoints. Deleting a model subscription makes any associated endpoint to become *Unhealthy* and unusable.

# [Portal](#tab/portal)

To delete a serverless API endpoint:

1. Go to [Azure AI Studio](https://ai.azure.com).

1. Go to **Components** section, and then select **Deployments**.

1. Open the deployment you want to delete.

1. Select **Delete**.


To delete the associated model subscription:

1. Go to [Azure Portal](https://portal.azure.com)

1. Navigate to the resource group where the project is deployed.

1. On the **Type** filter, select **SaaS**.

1. Select the subscription you want to delete.

1. Select **Delete**.

# [CLI](#tab/cli)

To delete a serverless API endpoint:

```azurecli
az ml serverless-endpoint delete \
    --name "meta-llama3-8b-qwerty"
```

To delete the associated model subscription:

```azurecli
az ml marketplace-subscription delete \
    --name "Meta-Llama-3-8B-Instruct"
```

# [Python](#tab/sdk)

To delete a serverless API endpoint:

```python
client.serverless_endpoints.begin_delete(endpoint_name).wait()
```

To delete the associated model subscription:

```python
client.marketplace_subscriptions.begin_delete(subscription_name).wait()
```

# [ARM](#tab/arm)

You can use the Resource Management tools to manage the resources. In the following example, we use Azure CLI:

```azurecli
az resource delete --name <resource-name>
```

---

## Cost and quota considerations for models deployed as serverless API endpoints

Models deployed as a serverless API endpoint are offered through the Azure Marketplace and integrated with Azure AI Studio for use. You can find the Azure Marketplace pricing when deploying or fine-tuning the models.

Each time a project subscribes to a given offer from the Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference and fine-tuning; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see monitor costs for models offered throughout the Azure Marketplace.

:::image type="content" source="../media/cost-management/marketplace/costs-model-as-service-cost-details.png" alt-text="A screenshot showing different resources corresponding to different model offers and their associated meters." lightbox="../media/cost-management/marketplace/costs-model-as-service-cost-details.png":::

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios.

## Next steps

* [Fine-tune a Meta Llama 2 model in Azure AI Studio](fine-tune-model-llama.md)