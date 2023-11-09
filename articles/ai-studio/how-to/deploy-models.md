---
title: How to deploy large language models with Azure AI Studio 
titleSuffix: Azure AI Studio
description: Learn how to deploy large language models with Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
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


## Deploying foundation models

# [Studio](#tab/azure-studio)

Follow the steps below to deploy a foundation model such as `distilbert-base-cased` to an online endpoint in Azure AI Studio.

1. Choose a model you want to deploy from AI Studio model catalog. Alternatively, you can initiate deployment by selecting **Create** from `your project`>`deployments` 

2. Select **Deploy** to project on the model card details page. 

3. Choose the project you want to deploy the model to. 

4. Select **Deploy**. 

5. You land on the deployment details page. Select **Consume** to obtain code samples that can be used to consume the deployed model in your application. 


# [Python SDK](#tab/python)

You can use the Azure AI Generative SDK to deploy a prompt flow as an online endpoint. In this example, you deploy a `distilbert-base-cased` model.

```python
# Import required dependencies
from azure.ai.generative import AIClient
from azure.ai.generative.entities.deployment import Deployment
from azure.identity import InteractiveBrowserCredential as Credential

# Credential info can be found under your project settings on Azure AI Studio. You can go to Settings by selecting the gear icon on the bottom of the left navigation UI.
credential = Credential()

client = AIClient(
    credential=credential,
    subscription_id="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    resource_group_name="INSERT_YOUR_RESOURCE_GROUP_NAME",
    project_name="INSERT_YOUR_PROJECT_NAME",
)

# The model_id can be found on the model card on Azure AI Studio model catalog 
model_id = "azureml://registries/azureml/distilbert-base-cased/versions/10"

# Name your deployment
deployment_name = "distilbert-base-cased-10"

# Define your deployment
deployment = Deployment(
    name=deployment_name,
    model=model_id,
)

# Deploy the model
deployment = client.deployments.create_or_update(deployment)

# Test with a sample json file
print(client.deployments.invoke(deployment_name, "./request_file_azureml_curated.json"))
```

---

## Deploying a prompt flow

> [!TIP]
> For a guide about how to deploy a base model, see [Deploy a flow as a managed online endpoint for real-time inference](flow-deploy.md).

## Next steps

- Learn more about what you can do in [Azure AI Studio](../what-is-ai-studio.md)
- Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml)
