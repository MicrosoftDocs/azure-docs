---
title: How to deploy open models with Azure AI Studio
titleSuffix: AI Studio
description: Learn how to deploy open models with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: fasantia
ms.author: mopeakande
author: msakande
---

# How to deploy large language models with Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

Deployment of a large language model (LLM) makes it available for use in a website, an application, or other production environment. Deployment typically involves hosting the model on a server or in the cloud and creating an API or other interface for users to interact with the model. You can invoke the deployment for real-time inference of generative AI applications such as chat and copilot.

In this article, you learn how to deploy large language models in Azure AI Studio. You can deploy models from the model catalog or from your project. You can also deploy models using the Azure Machine Learning SDK. The article also covers how to perform inference on the deployed model.

## Deploy and inference a Serverless API model with code

### Deploying a model

Serverless API models are the models you can deploy with pay-as-you-go billing. Examples include Phi-3, Llama-2, Command R, Mistral Large, and more. For serverless API models, you're only charged for inferencing, unless you choose to fine-tune the model. 

#### Get the model ID

You can deploy Serverless API models using the Azure Machine Learning SDK, but first, let's browse the model catalog and get the model ID you need for deployment.

1. Sign in to [AI Studio](https://ai.azure.com) and go to the **Home** page.
1. Select **Model catalog** from the left sidebar.
1. In the **Deployment options** filter, select **Serverless API**.

    :::image type="content" source="../media/deploy-monitor/catalog-filter-serverless-api.png" alt-text="A screenshot showing how to filter by serverless API models in the catalog." lightbox="../media/deploy-monitor/catalog-filter-serverless-api.png"::: 

1. Select a model.
1. Copy the model ID from the details page of the model you selected. It looks something like this: `azureml://registries/azureml-cohere/models/Cohere-command-r-plus/versions/3`


#### Install the Azure Machine Learning SDK

Next, you need to install the Azure Machine Learning SDK. Run the following commands in your terminal:

```python
pip install azure-ai-ml
pip install azure-identity
```

#### Deploy the serverless API model

First, you need to authenticate into Azure AI.

```python
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential
from azure.ai.ml.entities import MarketplaceSubscription, ServerlessEndpoint

# You can find your credential information in project settings.
client = MLClient(
    credential=DefaultAzureCredential(),
    subscription_id="your subscription name goes here",
    resource_group_name="your resource group name goes here",
    workspace_name="your project name goes here",
)
```
Second, let's reference the model ID you found earlier.

```python
# You can find the model ID on the model catalog.
model_id="azureml://registries/azureml-meta/models/Llama-2-70b-chat/versions/18" 
```
Serverless API models from third party model providers require an Azure Marketplace subscription in order to use the model. Let's create a marketplace subscription. 

> [!NOTE] 
> You can skip the part if you are deploying a Serverless API model from Microsoft, such as Phi-3.

```python
# You can customize the subscription name.
subscription_name="Meta-Llama-2-70b-chat" 

marketplace_subscription = MarketplaceSubscription(
    model_id=model_id,
    name=subscription_name,
)

marketplace_subscription = client.marketplace_subscriptions.begin_create_or_update(
    marketplace_subscription
).result()
```
Finally, let's create a serverless endpoint.

```python

endpoint_name="Meta-Llama-2-70b-chat-qwerty" # Your endpoint name must be unique

serverless_endpoint = ServerlessEndpoint(
    name=endpoint_name,
    model_id=model_id
)

created_endpoint = client.serverless_endpoints.begin_create_or_update(
    serverless_endpoint
).result()
```

#### Get the Serverless API endpoint and keys

```python
endpoint_keys = client.serverless_endpoints.get_keys(endpoint_name)
print(endpoint_keys.primary_key)
print(endpoint_keys.secondary_key)
```

#### Inference the deployment

To inference, you want to use the code specifically catering to different model types and SDK you're using. You can find code samples at the [Azure/azureml-examples sample repository](https://github.com/Azure/azureml-examples/tree/main/sdk/python/foundation-models).

## Deploy and inference a managed compute deployment with code

### Deploying a model

The AI Studio [model catalog](../how-to/model-catalog-overview.md) offers over 1,600 models, and the most common way to deploy these models is to use the managed compute deployment option, which is also sometimes referred to as a managed online deployment. 

#### Get the model ID

You can deploy managed compute models using the Azure Machine Learning SDK, but first, let's browse the model catalog and get the model ID you need for deployment.

1. Sign in to [AI Studio](https://ai.azure.com) and go to the **Home** page.
1. Select **Model catalog** from the left sidebar.
1. In the **Deployment options** filter, select **Managed compute**.

    :::image type="content" source="../media/deploy-monitor/catalog-filter-managed-compute.png" alt-text="A screenshot showing how to filter by managed compute models in the catalog." lightbox="../media/deploy-monitor/catalog-filter-managed-compute.png"::: 

1. Select a model.
1. Copy the model ID from the details page of the model you selected. It looks something like this: `azureml://registries/azureml/models/deepset-roberta-base-squad2/versions/16`

#### Install the Azure Machine Learning SDK

For this step, you need to install the Azure Machine Learning SDK.

```python
pip install azure-ai-ml
pip install azure-identity
```

#### Deploy the model

First, you need to authenticate into Azure AI.

```python
from azure.ai.ml import MLClient
from azure.identity import InteractiveBrowserCredential

client = MLClient(
    credential=InteractiveBrowserCredential,
    subscription_id="your subscription name goes here",
    resource_group_name="your resource group name goes here",
    workspace_name="your project name goes here",
)
```

Let's deploy the model.

For Managed compute deployment option, you need to create an endpoint before a model deployment. Think of endpoint as a container that can house multiple model deployments. The endpoint names need to be unique in a region, so in this example we're using the timestamp to create a unique endpoint name.

```python
import time, sys
from azure.ai.ml.entities import (
    ManagedOnlineEndpoint,
    ManagedOnlineDeployment,
    ProbeSettings,
)

# Make the endpoint name unique
timestamp = int(time.time())
online_endpoint_name = "customize your endpoint name here" + str(timestamp)

# Create an online endpoint
endpoint = ManagedOnlineEndpoint(
    name=online_endpoint_name,
    auth_mode="key",
)
workspace_ml_client.begin_create_or_update(endpoint).wait()
```


Create a deployment. You can find the model ID in the model catalog.

```python
model_name = "azureml://registries/azureml/models/deepset-roberta-base-squad2/versions/16" 

demo_deployment = ManagedOnlineDeployment(
    name="demo",
    endpoint_name=online_endpoint_name,
    model=model_name,
    instance_type="Standard_DS3_v2",
    instance_count=2,
    liveness_probe=ProbeSettings(
        failure_threshold=30,
        success_threshold=1,
        timeout=2,
        period=10,
        initial_delay=1000,
    ),
    readiness_probe=ProbeSettings(
        failure_threshold=10,
        success_threshold=1,
        timeout=10,
        period=10,
        initial_delay=1000,
    ),
)
workspace_ml_client.online_deployments.begin_create_or_update(demo_deployment).wait()
endpoint.traffic = {"demo": 100}
workspace_ml_client.begin_create_or_update(endpoint).result()
```

#### Inference the deployment
You need a sample json data to test inferencing. Create `sample_score.json` with the following example. 

```python
{
  "inputs": {
    "question": [
      "Where do I live?",
      "Where do I live?",
      "What's my name?",
      "Which name is also used to describe the Amazon rainforest in English?"
    ],
    "context": [
      "My name is Wolfgang and I live in Berlin",
      "My name is Sarah and I live in London",
      "My name is Clara and I live in Berkeley.",
      "The Amazon rainforest (Portuguese: Floresta Amaz\u00f4nica or Amaz\u00f4nia; Spanish: Selva Amaz\u00f3nica, Amazon\u00eda or usually Amazonia; French: For\u00eat amazonienne; Dutch: Amazoneregenwoud), also known in English as Amazonia or the Amazon Jungle, is a moist broadleaf forest that covers most of the Amazon basin of South America. This basin encompasses 7,000,000 square kilometres (2,700,000 sq mi), of which 5,500,000 square kilometres (2,100,000 sq mi) are covered by the rainforest. This region includes territory belonging to nine nations. The majority of the forest is contained within Brazil, with 60% of the rainforest, followed by Peru with 13%, Colombia with 10%, and with minor amounts in Venezuela, Ecuador, Bolivia, Guyana, Suriname and French Guiana. States or departments in four nations contain \"Amazonas\" in their names. The Amazon represents over half of the planet's remaining rainforests, and comprises the largest and most biodiverse tract of tropical rainforest in the world, with an estimated 390 billion individual trees divided into 16,000 species."
    ]
  }
}
```

Let's inference with `sample_score.json`. Change the location based on where you saved your sample json file.

```python
scoring_file = "./sample_score.json" 
response = workspace_ml_client.online_endpoints.invoke(
    endpoint_name=online_endpoint_name,
    deployment_name="demo",
    request_file=scoring_file,
)
response_json = json.loads(response)
print(json.dumps(response_json, indent=2))
```

## Delete the deployment endpoint

To delete deployments in AI Studio, select the **Delete** button on the top panel of the deployment details page.

## Quota considerations

To deploy and perform inferencing with real-time endpoints, you consume Virtual Machine (VM) core quota that is assigned to your subscription on a per-region basis. When you sign up for AI Studio, you receive a default VM quota for several VM families available in the region. You can continue to create deployments until you reach your quota limit. Once that happens, you can request for a quota increase.  

## Next steps

- Learn more about what you can do in [AI Studio](../what-is-ai-studio.md)
- Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml)
