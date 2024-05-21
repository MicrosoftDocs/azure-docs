---
title: Deploy models as serverless APIs
titleSuffix: Azure Machine Learning
description: Learn to deploy models as serverless APIs, using Azure Machine Learning.
manager: scottpolly
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
ms.date: 05/09/2024
ms.reviewer: mopeakande
reviewer: msakande
ms.author: fasantia
author: santiagxf
ms.custom: 
 - build-2024
 - serverless
---

# Deploy models as serverless API endpoints

In this article, you learn how to deploy a model from the model catalog as a serverless API with pay-as-you-go token-based billing.

Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

## Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.

- An [Azure Machine Learning workspace](quickstart-create-resources.md).

- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the resource group. For more information on permissions, see [Role-based access control in Azure Machine Learning](how-to-assign-roles.md).

- You need to install the following software to work with Azure Machine Learning:

    # [Studio](#tab/azure-studio)

    You can use any compatible web browser to navigate [Azure Machine Learning](https://ml.azure.com).

    # [Azure CLI](#tab/cli)

    The [Azure CLI](/cli/azure/) and the [ml extension for Azure Machine Learning](how-to-configure-cli.md).

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
    az configure --defaults workspace=<workspace-name> group=<resource-group> location=<location>
    ```

    # [Python SDK](#tab/python)

    Install the [Azure Machine Learning SDK for Python](https://aka.ms/sdk-v2-install).

    ```python
    pip install -U azure-ai-ml
    ```

    Once installed, import necessary namespaces and create a client connected to your workspace:

    ```python
    from azure.ai.ml import MLClient
    from azure.identity import InteractiveBrowserCredential
    from azure.ai.ml.entities import MarketplaceSubscription, ServerlessEndpoint

    client = MLClient(
        credential=InteractiveBrowserCredential(tenant_id="<tenant-id>"),
        subscription_id="<subscription-id>",
        resource_group_name="<resource-group>",
        workspace_name="<workspace-name>",
    )
    ```

    # [ARM](#tab/arm)

    You can use any compatible web browser to [deploy ARM templates](../azure-resource-manager/templates/deploy-portal.md) in the Microsoft Azure portal or using any of the deployment tools. This tutorial uses the [Azure CLI](/cli/azure/).


## Subscribe your workspace to the model offering

For models offered through the Azure Marketplace, you can deploy them to serverless API endpoints to consume their predictions. If it's your first time deploying the model in the workspace, you have to subscribe your workspace for the particular model offering from the Azure Marketplace. Each workspace has its own subscription to the particular Azure Marketplace offering of the model, which allows you to control and monitor spending.

> [!NOTE]
> Models offered through the Azure Marketplace are available for deployment to serverless API endpoints in specific regions. Check [Region availability for models in Serverless API endpoints](concept-endpoint-serverless-availability.md) to verify which regions are available. If the one you need is not listed, you can deploy to a workspace in a supported region and then [consume serverless API endpoints from a different workspace](how-to-connect-models-serverless.md).

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com)

1. Ensure your account has the **Azure AI Developer** role permissions on the resource group, or that you meet the [permissions required to subscribe to model offerings](#permissions-required-to-subscribe-to-model-offerings).

1. Go to your workspace.

1. Select **Model catalog** from the left sidebar and find the model card of the model you want to deploy. In this article, you select a **Meta-Llama-3-8B-Instruct** model. 
    
    1. If you're deploying the model using Azure CLI, Python SDK, or ARM, copy the **Model ID**.

    > [!IMPORTANT]
    > Do not include the version when copying the **Model ID**. Serverless API endpoints always deploy the model's latest version available. For example, for the model ID `azureml://registries/azureml-meta/models/Meta-Llama-3-8B-Instruct/versions/3`, copy `azureml://registries/azureml-meta/models/Meta-Llama-3-8B-Instruct`.

    :::image type="content" source="media/how-to-deploy-models-serverless/model-card.png" alt-text="A screenshot showing a model's details page." lightbox="media/how-to-deploy-models-serverless/model-card.png":::


1. Create the model's marketplace subscription. When you create a subscription, you accept the terms and conditions associated with the model offer.

    # [Studio](#tab/azure-studio)

    1. On the model's **Details** page, select **Deploy** and then select **Serverless API** to open the deployment wizard.

    1. Select the checkbox to acknowledge the Microsoft purchase policy.    

        :::image type="content" source="media/how-to-deploy-models-serverless/deploy-pay-as-you-go.png" alt-text="A screenshot showing how to deploy a model with the serverless API option." lightbox="media/how-to-deploy-models-serverless/deploy-pay-as-you-go.png":::

    1. If you see the note *You already have an Azure Marketplace subscription for this workspace*, you don't need to create the subscription since you already have one. You can proceed to [Deploy the model to a serverless API endpoint](#deploy-the-model-to-a-serverless-api-endpoint).
    
    1. In the deployment wizard, select the link to **Azure Marketplace Terms** to learn more about the terms of use. You can also select the **Pricing and terms** tab to learn about pricing for the selected model.

     4. On the deployment wizard, select the link to Azure Marketplace Terms to learn more about the terms of use. You can also select the Marketplace offer details tab to learn about pricing for the selected model.

    1. Select **Subscribe and Deploy**.


    # [Azure CLI](#tab/cli)

    __subscription.yml__

    ```yml
    name: meta-llama3-8b-qwerty
    model_id: azureml://registries/azureml-meta/models/Meta-Llama-3-8B-Instruct
    ```
    
    Use the _subscription.yml_ file to create the subscription:    

    ```azurecli
    az ml marketplace-subscription create -f subscription.yml
    ```

    # [Python SDK](#tab/python)

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
            "workspace_name": {
                "defaultValue": "my-workspace",
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
                "name": "[concat(parameters('workspace_name'), '/', parameters('subscription_name'))]",
                "location": "[parameters('location')]",
                "properties": {
                    "modelId": "[parameters('model_id')]"
                }
            }
        ]
    }
    ```

1. Once you sign up the workspace for the particular Azure Marketplace offering, subsequent deployments of the same offering in the same workspace don't require subscribing again.

1. At any point, you can see the model offers to which your workspace is currently subscribed:

    # [Studio](#tab/azure-studio)

    1. Go to the [Azure portal](https://portal.azure.com)

    1. Navigate to the resource group where the workspace belongs.

    1. On the **Type** filter, select **SaaS**.

    1. You see all the offerings to which you're currently subscribed.

    1. Select any resource to see the details.

    # [Azure CLI](#tab/cli)

    ```azurecli
    az ml marketplace-subscription list
    ```

    # [Python SDK](#tab/python)

    ```python
    marketplace_sub_list = client.marketplace_subscriptions.list()

    for sub in marketplace_sub_list:
        print(sub.as_dict())
    ```

    # [ARM](#tab/arm)

    You can use the resource management tools to query the resources. The following code uses Azure CLI:

    ```azurecli
    az resource list \
        --query "[?type=='Microsoft.SaaS']"
    ```

## Deploy the model to a serverless API endpoint

Once you've created a model's subscription, you can deploy the associated model to a serverless API endpoint. The serverless API endpoint provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance organizations need. This deployment option doesn't require quota from your subscription.

In this article, you create an endpoint with name **meta-llama3-8b-qwerty**.

1. Create the serverless endpoint

    # [Studio](#tab/azure-studio)

    1. From the previous wizard, select **Deploy** (if you've just subscribed the workspace to the model offer in the previous section), or select **Continue to deploy** (if your deployment wizard had the note *You already have an Azure Marketplace subscription for this workspace*). 

        :::image type="content" source="media/how-to-deploy-models-serverless/deploy-pay-as-you-go-subscribed-workspace.png" alt-text="A screenshot showing a workspace that is already subscribed to the offering." lightbox="media/how-to-deploy-models-serverless/deploy-pay-as-you-go-subscribed-workspace.png":::

    1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region.

        :::image type="content" source="media/how-to-deploy-models-serverless/deployment-name.png" alt-text="A screenshot showing how to specify the name of the deployment you want to create." lightbox="media/how-to-deploy-models-serverless/deployment-name.png":::

    1. Select **Deploy**. Wait until the deployment is ready and you're redirected to the Deployments page.

    # [Azure CLI](#tab/cli)

    __endpoint.yml__

    ```yml
    name: meta-llama3-8b-qwerty
    model_id: azureml://registries/azureml-meta/models/Meta-Llama-3-8B-Instruct
    ```

    Use the _endpoint.yml_ file to create the endpoint:

    ```azurecli
    az ml serverless-endpoint create -f endpoint.yml
    ```

    # [Python SDK](#tab/python)

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
            "workspace_name": {
                "defaultValue": "my-workspace",
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
                "name": "[concat(parameters('workspace_name'), '/', parameters('endpoint_name'))]",
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

1. At any point, you can see the endpoints deployed to your workspace:

    # [Studio](#tab/azure-studio)

    1. Go to your workspace.

    1. Select **Endpoints**.

    1. Select the **Serverless endpoints** tab to display the serverless API endpoints.

    # [Azure CLI](#tab/cli)

    ```azurecli
    az ml serverless-endpoint list
    ```

    # [Python SDK](#tab/python)

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

    You can use the resource management tools to query the resources. The following code uses Azure CLI:

    ```azurecli
    az resource list \
        --query "[?type=='Microsoft.MachineLearningServices/workspaces/serverlessEndpoints']"
    ```

1. The created endpoint uses key authentication for authorization. Use the following steps to get the keys associated with a given endpoint.

    # [Studio](#tab/azure-studio)

    1. To return to the deployment's page, select the endpoint's name from the list of serverless endpoints. 
    1. Note the endpoint's _Target URI_ and _Key_. Use them to call the deployment and generate predictions.

    > [!NOTE]
    > When using the [Azure portal](https://portal.azure.com), serverless API endpoints aren't displayed by default on the resource group. Use the **Show hidden types** option to display them on the resource group.

    # [Azure CLI](#tab/cli)

    ```azurecli
    az ml serverless-endpoint get-credentials -n meta-llama3-8b-qwerty
    ```

    # [Python SDK](#tab/python)

    ```python
    endpoint_keys = client.serverless_endpoints.get_keys(endpoint_name)
    print(endpoint_keys.primary_key)
    print(endpoint_keys.secondary_key)
    ```

    # [ARM](#tab/arm)

    Use REST APIs to query this information.

1. At this point, your endpoint is ready to be used.

1. If you need to consume this deployment from a different workspace, or you plan to use prompt flow to build intelligent applications, you need to create a connection to the serverless API deployment. To learn how to configure an existing serverless API endpoint on a new project or hub, see [Consume deployed serverless API endpoints from a different workspace or from Prompt flow](how-to-connect-models-serverless.md).

    > [!TIP]
    > If you're using prompt flow in the same workspace where the deployment was deployed, you still need to create the connection.

## Using the serverless API endpoint

Models deployed in Azure Machine Learning and Azure AI studio in Serverless API endpoints support the [Azure AI Model Inference API](reference-model-inference-api.md) that exposes a common set of capabilities for foundational models and that can be used by developers to consume predictions from a diverse set of models in a uniform and consistent way. 

Read more about the [capabilities of this API](reference-model-inference-api.md#capabilities) and how [you can leverage it when building applications](reference-model-inference-api.md#getting-started). 

## Delete endpoints and subscriptions

You can delete model subscriptions and endpoints. Deleting a model subscription makes any associated endpoint to become *Unhealthy* and unusable.

# [Studio](#tab/azure-studio)

To delete a serverless API endpoint:

1. Go to [Azure Machine Learning studio](https://ml.azure.com).

1. Select **Endpoints** from the left sidebar.

1. Select the **Serverless endpoints** tab to display the serverless API endpoints.

1. Open the endpoint you want to delete.

1. Select **Delete**.


To delete the associated model subscription:

1. Go to the [Azure portal](https://portal.azure.com)

1. Navigate to the resource group where the workspace belongs.

1. On the **Type** filter, select **SaaS**.

1. Select the subscription you want to delete.

1. Select **Delete**.

# [Azure CLI](#tab/cli)

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

# [Python SDK](#tab/python)

To delete a serverless API endpoint:

```python
client.serverless_endpoints.begin_delete(endpoint_name).wait()
```

To delete the associated model subscription:

```python
client.marketplace_subscriptions.begin_delete(subscription_name).wait()
```

# [ARM](#tab/arm)

You can use the resource management tools to manage the resources. The following code uses Azure CLI:

```azurecli
az resource delete --name <resource-name>
```

---

## Cost and quota considerations for models deployed as serverless API endpoints

Models deployed as a serverless API endpoint are offered through the Azure Marketplace and integrated with Azure Machine Learning for use. You can find the Azure Marketplace pricing when deploying or fine-tuning the models.

Each time a workspace subscribes to a given offer from the Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference and fine-tuning; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see [Monitor costs for models offered through the Azure Marketplace](../ai-studio/how-to/costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace).

:::image type="content" source="media/how-to-deploy-models-serverless/costs-model-as-service-cost-details.png" alt-text="A screenshot showing different resources corresponding to different model offers and their associated meters." lightbox="media/how-to-deploy-models-serverless/costs-model-as-service-cost-details.png":::

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per workspace. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios.

## Permissions required to subscribe to model offerings

Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __Owner__, __Contributor__, or __Azure AI Developer__ role for the Azure subscription. Alternatively, your account can be assigned a custom role that has the following permissions:

- On the Azure subscription—to subscribe the workspace to the Azure Marketplace offering, once for each workspace, per offering:
  - `Microsoft.MarketplaceOrdering/agreements/offers/plans/read`
  - `Microsoft.MarketplaceOrdering/agreements/offers/plans/sign/action`
  - `Microsoft.MarketplaceOrdering/offerTypes/publishers/offers/plans/agreements/read`
  - `Microsoft.Marketplace/offerTypes/publishers/offers/plans/agreements/read`
  - `Microsoft.SaaS/register/action`

- On the resource group—to create and use the SaaS resource:
  - `Microsoft.SaaS/resources/read`
  - `Microsoft.SaaS/resources/write`

- On the workspace—to deploy endpoints (the Azure Machine Learning data scientist role contains these permissions already):
  - `Microsoft.MachineLearningServices/workspaces/marketplaceModelSubscriptions/*`  
  - `Microsoft.MachineLearningServices/workspaces/serverlessEndpoints/*`

For more information on permissions, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

## Related content

- [Model Catalog and Collections](concept-model-catalog.md)
- [Consume deployed serverless API endpoints from a different workspace](how-to-connect-models-serverless.md)