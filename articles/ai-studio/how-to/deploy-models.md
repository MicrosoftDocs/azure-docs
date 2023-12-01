---
title: How to deploy large language models with Azure AI Studio 
titleSuffix: Azure AI Studio
description: Learn how to deploy large language models with Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# How to deploy large language models with Azure AI Studio 

Deploying a large language model (LLM) makes it available for use in a website, an application, or other production environments. This typically involves hosting the model on a server or in the cloud, and creating an API or other interface for users to interact with the model. You can invoke the endpoint for real-time inference for chat, copilot, or another generative AI application.


## Deploying an Azure OpenAI model from the model catalog

To modify and interact with an Azure OpenAI model in the Playground, you need to deploy a base Azure OpenAI model to your project first. Once the model is deployed and available in your project, you can consume its Rest API endpoint as-is or customize further with your own data and other components (embeddings, indexes, etcetera).  

 
1. Choose a model you want to deploy from Azure AI Studio model catalog. Alternatively, you can initiate deployment by selecting **Create** from `your project`>`deployments` 

2. Select **Deploy** to project on the model card details page. 

3. Choose the project you want to deploy the model to. For Azure OpenAI models, the Azure AI Content Safety filter is automatically turned on.   

4. Select **Deploy**.

5. You land in the playground. Select **View Code** to obtain code samples that can be used to consume the deployed model in your application. 


## Deploying open models

# [Studio](#tab/azure-studio)

Follow the steps below to deploy an open model such as `distilbert-base-cased` to an online endpoint in Azure AI Studio.

1. Choose a model you want to deploy from AI Studio model catalog. Alternatively, you can initiate deployment by selecting **Create** from `your project`>`deployments` 

2. Select **Deploy** to project on the model card details page. 

3. Choose the project you want to deploy the model to. 

4. Select **Deploy**. 

5. You land on the deployment details page. Select **Consume** to obtain code samples that can be used to consume the deployed model in your application. 


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

Define the model and the deployment. `The model_id` can be found on the model card on Azure AI Studio model catalog.

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

## Deploying a prompt flow

> [!TIP]
> For a guide about how to deploy a prompt flow, see [Deploy a flow as a managed online endpoint for real-time inference](flow-deploy.md).

## Deleting the deployment endpoint

Deleting deployments and its associated endpoint isn't supported via the Azure AI SDK. To delete deployments in Azure AI Studio, select the **Delete** button on the top panel of the deployment details page.

## Next steps

- Learn more about what you can do in [Azure AI Studio](../what-is-ai-studio.md)
- Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml)
