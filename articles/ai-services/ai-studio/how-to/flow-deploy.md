---
title: How to deploy flows from an Azure AI Studio project
titleSuffix: Azure AI services
description: This article provides instructions on how to deploy flows from an Azure AI Studio project.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to deploy flows from an Azure AI Studio project

> [!IMPORTANT]
> TODO_PUBLIC_PREVIEW
> Porting from private preview insiders documentation
> PG POC: TBD

## Prompt flows

In order to make the chat playground to respond to your query, you must grant permissions to the endpoint entity after the promptflow deployment is created. This is a subscription owner level action, so if needed, ask your subscription owner to do it for you. [Learn more about promptflow deployment](https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/how-to-deploy-for-real-time-inference?view=azureml-api-2#endpoint). 

### If you are using AI Studio UI:
1. Follow [the promptflow instruction](https://github.com/Azure/azureai-insiders/blob/aistudio-preview/previews/aistudio/how-to/build_with_promptflow.md) to create a promptflow.
2. Select **Deploy** on the flow editor.
3. Once you are redirected to the deployment details page, **look for the endpoint name** in URL (`EndpointName.region.inference.ml.azure.com/score`). You'll need this for step 9 (enabling access to secrets).
4. Go to Project details page (`Projects` > `Details`).
5. Select the **YourResourceGroupName** link on the Details page.
6. Once you are redirected to the Azure Resource Group page, Select **Access control (IAM)** on the left navigation menu.
7. Select **Add role assignment**.
8. Select **Azure ML Data Scientist** and select **Next**.
9. Select **+ select members** and search for your endpoint name. Tip: use your project name as a search keyword to find the endpoint quickly. 
10. Select **Select**.
11. Select **Review + Assign**.
12. Return to AI Studio and go to the deployment details page (`Deployments` > `YourDeploymentName`).
13. Test the promptflow deployment (`YourDeploymentName` > `Test`)


## Langchain and Custom Python

This option is only offered in Azure AI SDK. After developing and debugging your Langchain using [example notebook](https://github.com/Azure/aistudio-chat-demo/blob/main/src/langchain/langchain_qna.ipynb), you can use the following code to deploy it.

**Deploy Langchain QA Function**  

Download MLIndex files so they can be packaged with deployment code. MLIndex files describe an index of data + embeddings and the embeddings model used in yaml.

```python
client.mlindexes.download(name="product-info-cog-search-index", download_path="./qna_simple/mlindex", label="latest")
```

```python
from azure.ai.generative.entities.deployment import Deployment
from azure.ai.generative.entities.models import LocalModel

deployment_name = "dan-contoso-test"

deployment = Deployment(
    name=deployment_name,
    model=LocalModel(
        path="./qna_simple",
        conda_file="conda.yaml",
        loader_module="model_loader.py",
    ),
)

deployment = client.deployments.create_or_update(deployment)
```
**Invoke the deployment**

```python
response = client.deployments.invoke(deployment_name, "./request_file_qna_simple.json")
print(response)
```



## SDK

Azure AI SDK is not supporting open source model deployment at this time. 

If you want to deploy using SDK, there are two options that are currently supported:

| Use Case                    |                 Instruction                                                                                                                                          |
|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Download a promptflow from AI Studio UI, and deploy via SDK | Follow [the promptflow deployment instruction](https://github.com/Azure/aistudio-chat-demo/blob/main/docs/qna_with_promptflow.md)    |  
| Create a LangChain and deploy via SDK | Follow [the Langchain deployment notebook](https://github.com/Azure/aistudio-chat-demo/blob/main/src/langchain/langchain_qna.ipynb)   

