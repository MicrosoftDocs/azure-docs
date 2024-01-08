---
title: How to deploy open models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy open models with Azure AI Studio.
manager: nitinme
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 12/11/2023
ms.reviewer: eur
ms.author: mopeakande
author: msakande
---

# How to deploy large language models with Azure AI Studio 

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Deploying a large language model (LLM) makes it available for use in a website, an application, or other production environments. This typically involves hosting the model on a server or in the cloud, and creating an API or other interface for users to interact with the model. You can invoke the deployment for real-time inference for chat, copilot, or another generative AI application.

## Deploy open models

# [Studio](#tab/azure-studio)

Follow the steps below to deploy an open model such as `distilbert-base-cased` to a real-time endpoint in Azure AI Studio.

1. Choose a model you want to deploy from the Azure AI Studio [model catalog](../how-to/model-catalog.md). Alternatively, you can initiate deployment by selecting **+ Create** from `your project`>`deployments` 

1. Select **Deploy** to project on the model card details page. 

1. Choose the project you want to deploy the model to. 

1. Select **Deploy**. 

1. You land on the deployment details page. Select **Consume** to obtain code samples that can be used to consume the deployed model in your application. 


# [Python SDK](#tab/python)

You can use the Azure AI Generative SDK to deploy an open model. In this example, you deploy a `distilbert-base-cased` model.

```python
# Import the libraries
from azure.ai.resources.client import AIClient
from azure.ai.resources.entities.deployment import Deployment
from azure.ai.resources.entities.models import PromptflowModel
from azure.identity import DefaultAzureCredential
```


Credential info can be found under your project settings on Azure AI Studio. You can go to Settings by selecting the gear icon on the bottom of the left navigation UI.

```python
credential = DefaultAzureCredential()
client = AIClient(
    credential=credential,
    subscription_id="<xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx>",
    resource_group_name="<YOUR_RESOURCE_GROUP_NAME>",
    project_name="<YOUR_PROJECT_NAME>",
)
```

Define the model and the deployment. `The model_id` can be found on the model card on Azure AI Studio [model catalog](../how-to/model-catalog.md).

```python
model_id = "azureml://registries/azureml/models/distilbert-base-cased/versions/10"
deployment_name = "my-distilbert-deployment"

deployment = Deployment(
    name=deployment_name,
    model=model_id,
)
```

Deploy the model.

```python
client.deployments.create_or_update(deployment)
```
---


## Delete the deployment endpoint

Deleting deployments and its associated endpoint isn't supported via the Azure AI SDK. To delete deployments in Azure AI Studio, select the **Delete** button on the top panel of the deployment details page.

## Quota considerations

Deploying and inferencing with real-time endpoints can be done by consuming Virtual Machine (VM) core quota that is assigned to your subscription a per-region basis. When you sign up for Azure AI Studio, you receive a default VM quota for several VM families available in the region. You can continue to create deployments until you reach your quota limit. Once that happens, you can request for quota increase.  

## Next steps

- Learn more about what you can do in [Azure AI Studio](../what-is-ai-studio.md)
- Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml)
