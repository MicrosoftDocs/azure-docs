---
title: How to deploy Meta Llama 3.1 models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy Meta Llama 3.1 models with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 7/21/2024
ms.reviewer: shubhiraj
reviewer: shubhirajMsft
ms.author: ssalgado
author: ssalgadodev
ms.custom: references_regions, build-2024
---

# How to deploy Meta Llama 3.1 models with Azure AI Studio

In this guide, you learn about Meta Llama and how to use them with Azure AI studio.
Meta Llama 2 and 3 models and tools are a collection of pretrained and fine-tuned generative text models ranging in scale from 7 billion to 70 billion parameters. The model family also includes fine-tuned versions optimized for dialogue use cases with reinforcement learning from human feedback (RLHF).

<<<<<<< HEAD




::: zone pivot="programming-language-python"

## Meta Llama family of models
=======
In this article, you learn about the Meta Llama model family. You also learn how to use Azure AI Studio to deploy models from this set either to serverless APIs with pay-as you go billing or to managed compute.

  > [!IMPORTANT]
  > Read more about the announcement of Meta Llama 3.1 405B Instruct and other Llama 3.1 models available now on Azure AI Model Catalog: [Microsoft Tech Community Blog](https://aka.ms/meta-llama-3.1-release-on-azure) and from [Meta Announcement Blog](https://aka.ms/meta-llama-3.1-release-announcement).

Now available on Azure AI Models-as-a-Service:
- `Meta-Llama-3.1-405B-Instruct`
- `Meta-Llama-3.1-70B-Instruct`
- `Meta-Llama-3.1-8B-Instruct`

The Meta Llama 3.1 family of multilingual large language models (LLMs) is a collection of pretrained and instruction tuned generative models in 8B, 70B and 405B sizes (text in/text out). All models support long context length (128k) and are optimized for inference with support for grouped query attention (GQA). The Llama 3.1 instruction tuned text only models (8B, 70B, 405B) are optimized for multilingual dialogue use cases and outperform many of the available open source chat models on common industry benchmarks.

See the following GitHub samples to explore integrations with [LangChain](https://aka.ms/meta-llama-3.1-405B-instruct-langchain), [LiteLLM](https://aka.ms/meta-llama-3.1-405B-instruct-litellm), [OpenAI](https://aka.ms/meta-llama-3.1-405B-instruct-openai) and the [Azure API](https://aka.ms/meta-llama-3.1-405B-instruct-webrequests).

## Deploy Meta Llama 3.1 405B Instruct as a serverless API

Meta Llama 3.1 models - like `Meta Llama 3.1 405B Instruct` - can be deployed as a serverless API with pay-as-you-go, providing a way to consume them as an API without hosting them on your subscription while keeping the enterprise security and compliance organizations need. This deployment option doesn't require quota from your subscription. Meta Llama 3.1 models are deployed as a serverless API with pay-as-you-go billing through Microsoft Azure Marketplace, and they might add more terms of use and pricing.
>>>>>>> cc2f91e73e4c8944f9a3486bcab5904bda17de50

The Meta Llama family of models includes the following models:

<<<<<<< HEAD


# [Meta Llama-3](#tab/meta-llama-3)
=======
# [Meta Llama 3.1](#tab/llama-three)

The following models are available in Azure Marketplace for Llama 3.1 and Llama 3 when deployed as a service with pay-as-you-go:

* [Meta-Llama-3.1-405B-Instruct (preview)](https://aka.ms/aistudio/landing/meta-llama-3-405B-base)
* [Meta-Llama-3.1-70B-Instruct (preview)](https://aka.ms/aistudio/landing/meta-llama-3-8B-refresh)
* [Meta Llama-3.1-8B-Instruct (preview)](https://aka.ms/aistudio/landing/meta-llama-3-70B-refresh)
* [Meta-Llama-3-70B-Instruct (preview)](https://aka.ms/aistudio/landing/meta-llama-3-70b-chat)
* [Meta-Llama-3-8B-Instruct (preview)](https://aka.ms/aistudio/landing/meta-llama-3-8b-chat)
>>>>>>> cc2f91e73e4c8944f9a3486bcab5904bda17de50

Meta developed and released the Meta Llama 3 family of large language models (LLMs), a collection of pretrained and instruction tuned generative text models in 8 and 70B sizes. The Llama 3 instruction tuned models are optimized for dialogue use cases and outperform many of the available open source chat models on common industry benchmarks. Further, in developing these models, we took great care to optimize helpfulness and safety.


The following models are available:

- Meta-Llama-3-8B-Instruct
- Meta-Llama-3-70B-Instruct



# [Meta Llama-2](#tab/meta-llama-2)

Meta has developed and publicly released the Llama 2 family of large language models (LLMs), a collection of pretrained and fine-tuned generative text models ranging in scale from 7 billion to 70 billion parameters. Our fine-tuned LLMs, called Llama-2-Chat, are optimized for dialogue use cases. Llama-2-Chat models outperform open-source chat models on most benchmarks we tested, and in our human evaluations for helpfulness and safety, are on par with some popular closed-source models like ChatGPT and PaLM. We provide a detailed description of our approach to fine-tuning and safety improvements of Llama-2-Chat in order to enable the community to build on our work and contribute to the responsible development of LLMs.


The following models are available:

- Llama-2-7b-chat
- Llama-2-13b-chat
- Llama-2-70b-chat



---



## Prerequisites

To use Meta Llama models with Azure AI studio, you need the following prerequisites:



### A deployed Meta Llama model

Meta Llama can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).

> [!div class="nextstepaction"]
> [Deploy the model to serverless API endpoints](deploy-models-serverless.md)



Meta Llama can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)

> [!TIP]
> Notice when deploying Meta Llama to self-hosted managed compute you need to ensure you must have enough quota in your subscription. If you don't have enough quota available in the selected project, you can use the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours**



### The inference package installed

You can consume predictions from this model by using the `azure-ai-inference` package with Python. To install this package, you need the following prerequisites:

* Python 3.8 or later installed, including pip.
* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.
  
Once you have these prerequisites, install the Azure AI inference package with the following command:

<<<<<<< HEAD
```bash
pip install azure-ai-inference
=======
If you need to deploy a different model, [deploy it to managed compute](#deploy-meta-llama-models-to-managed-compute) instead.

### Prerequisites

# [Meta Llama 3](#tab/llama-three)

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An [AI Studio hub](../how-to/create-azure-ai-resource.md). The serverless API model deployment offering for Meta Llama 3.1 and Llama 3 is only available with hubs created in these regions:

     * East US
     * East US 2
     * North Central US
     * South Central US
     * West US
     * West US 3
     * Sweden Central
  
    For a list of  regions that are available for each of the models supporting serverless API endpoint deployments, see [Region availability for models in serverless API endpoints](deploy-models-serverless-availability.md).
- An [AI Studio project](../how-to/create-projects.md) in Azure AI Studio.
- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure AI Studio. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure subscription. Alternatively, your account can be assigned a custom role that has the following permissions:

    - On the Azure subscription—to subscribe the AI Studio project to the Azure Marketplace offering, once for each project, per offering:
      - `Microsoft.MarketplaceOrdering/agreements/offers/plans/read`
      - `Microsoft.MarketplaceOrdering/agreements/offers/plans/sign/action`
      - `Microsoft.MarketplaceOrdering/offerTypes/publishers/offers/plans/agreements/read`
      - `Microsoft.Marketplace/offerTypes/publishers/offers/plans/agreements/read`
      - `Microsoft.SaaS/register/action`
 
    - On the resource group—to create and use the SaaS resource:
      - `Microsoft.SaaS/resources/read`
      - `Microsoft.SaaS/resources/write`
 
    - On the AI Studio project—to deploy endpoints (the Azure AI Developer role contains these permissions already):
      - `Microsoft.MachineLearningServices/workspaces/marketplaceModelSubscriptions/*`  
      - `Microsoft.MachineLearningServices/workspaces/serverlessEndpoints/*`

    For more information on permissions, see [Role-based access control in Azure AI Studio](../concepts/rbac-ai-studio.md).
  
# [Meta Llama 2](#tab/llama-two)

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An [AI Studio hub](../how-to/create-azure-ai-resource.md). The serverless API model deployment offering for Meta Llama 2 is only available with hubs created in these regions:

     * East US
     * East US 2
     * North Central US
     * South Central US
     * West US
     * West US 3
  
    For a list of  regions that are available for each of the models supporting serverless API endpoint deployments, see [Region availability for models in serverless API endpoints](deploy-models-serverless-availability.md).
- An [AI Studio project](../how-to/create-projects.md) in Azure AI Studio.
- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure AI Studio. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure subscription. Alternatively, your account can be assigned a custom role that has the following permissions:

    - On the Azure subscription—to subscribe the AI Studio project to the Azure Marketplace offering, once for each project, per offering:
      - `Microsoft.MarketplaceOrdering/agreements/offers/plans/read`
      - `Microsoft.MarketplaceOrdering/agreements/offers/plans/sign/action`
      - `Microsoft.MarketplaceOrdering/offerTypes/publishers/offers/plans/agreements/read`
      - `Microsoft.Marketplace/offerTypes/publishers/offers/plans/agreements/read`
      - `Microsoft.SaaS/register/action`
 
    - On the resource group—to create and use the SaaS resource:
      - `Microsoft.SaaS/resources/read`
      - `Microsoft.SaaS/resources/write`
 
    - On the AI Studio project—to deploy endpoints (the Azure AI Developer role contains these permissions already):
      - `Microsoft.MachineLearningServices/workspaces/marketplaceModelSubscriptions/*`  
      - `Microsoft.MachineLearningServices/workspaces/serverlessEndpoints/*`

    For more information on permissions, see [Role-based access control in Azure AI Studio](../concepts/rbac-ai-studio.md).

---

### Create a new deployment

# [Meta Llama 3](#tab/llama-three)

To create a deployment:

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Choose `Meta-Llama-3.1-405B-Instruct` deploy from the Azure AI Studio [model catalog](https://ai.azure.com/explore/models). 

    Alternatively, you can initiate deployment by starting from your project in AI Studio. Select a project and then select **Deployments** > **+ Create**.

1. On the **Details** page for `Meta-Llama-3.1-405B-Instruct`, select **Deploy** and then select **Serverless API with Azure AI Content Safety**.

1. Select the project in which you want to deploy your models. To use the pay-as-you-go model deployment offering, your workspace must belong to the **East US 2** or **Sweden Central** region.
1. On the deployment wizard, select the link to **Azure Marketplace Terms** to learn more about the terms of use. You can also select the **Marketplace offer details** tab to learn about pricing for the selected model.
1. If this is your first time deploying the model in the project, you have to subscribe your project for the particular offering (for example, `Meta-Llama-3.1-405B-Instruct`) from Azure Marketplace. This step requires that your account has the Azure subscription permissions and resource group permissions listed in the prerequisites. Each project has its own subscription to the particular Azure Marketplace offering, which allows you to control and monitor spending. Select **Subscribe and Deploy**.

    > [!NOTE]
    > Subscribing a project to a particular Azure Marketplace offering (in this case, Meta-Llama-3-70B) requires that your account has **Contributor** or **Owner** access at the subscription level where the project is created. Alternatively, your user account can be assigned a custom role that has the Azure subscription permissions and resource group permissions listed in the [prerequisites](#prerequisites).

1. Once you sign up the project for the particular Azure Marketplace offering, subsequent deployments of the _same_ offering in the _same_ project don't require subscribing again. Therefore, you don't need to have the subscription-level permissions for subsequent deployments. If this scenario applies to you, select **Continue to deploy**.

1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region.

1. Select **Deploy**. Wait until the deployment is ready and you're redirected to the Deployments page.

1. Select **Open in playground** to start interacting with the model.

1. You can return to the Deployments page, select the deployment, and note the endpoint's **Target** URL and the Secret **Key**, which you can use to call the deployment and generate completions.

1. You can always find the endpoint's details, URL, and access keys by navigating to the project page and selecting **Deployments** from the left menu.

To learn about billing for Meta Llama models deployed with pay-as-you-go, see [Cost and quota considerations for Llama 3 models deployed as a service](#cost-and-quota-considerations-for-meta-llama-31-models-deployed-as-a-service).

# [Meta Llama 2](#tab/llama-two)

To create a deployment:

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Choose the model you want to deploy from the Azure AI Studio [model catalog](https://ai.azure.com/explore/models). 

    Alternatively, you can initiate deployment by starting from your project in AI Studio. Select a project and then select **Deployments** > **+ Create**.

1. On the model's **Details** page, select **Deploy** and then select **Serverless API with Azure AI Content Safety**.

    :::image type="content" source="../media/deploy-monitor/llama/deploy-pay-as-you-go.png" alt-text="A screenshot showing how to deploy a model with the pay-as-you-go option." lightbox="../media/deploy-monitor/llama/deploy-pay-as-you-go.png":::

1. Select the project in which you want to deploy your models. To use the pay-as-you-go model deployment offering, your workspace must belong to the **East US 2** or **West US 3** region.
1. On the deployment wizard, select the link to **Azure Marketplace Terms** to learn more about the terms of use. You can also select the **Marketplace offer details** tab to learn about pricing for the selected model.
1. If this is your first time deploying the model in the project, you have to subscribe your project for the particular offering (for example, Meta-Llama-2-7B) from Azure Marketplace. This step requires that your account has the Azure subscription permissions and resource group permissions listed in the prerequisites. Each project has its own subscription to the particular Azure Marketplace offering, which allows you to control and monitor spending. Select **Subscribe and Deploy**.

    > [!NOTE]
    > Subscribing a project to a particular Azure Marketplace offering (in this case, Meta-Llama-2-7B) requires that your account has **Contributor** or **Owner** access at the subscription level where the project is created. Alternatively, your user account can be assigned a custom role that has the Azure subscription permissions and resource group permissions listed in the [prerequisites](#prerequisites).

    :::image type="content" source="../media/deploy-monitor/llama/deploy-marketplace-terms.png" alt-text="A screenshot showing the terms and conditions of a given model." lightbox="../media/deploy-monitor/llama/deploy-marketplace-terms.png":::

1. Once you sign up the project for the particular Azure Marketplace offering, subsequent deployments of the _same_ offering in the _same_ project don't require subscribing again. Therefore, you don't need to have the subscription-level permissions for subsequent deployments. If this scenario applies to you, select **Continue to deploy**.

    :::image type="content" source="../media/deploy-monitor/llama/deploy-pay-as-you-go-project.png" alt-text="A screenshot showing a project that is already subscribed to the offering." lightbox="../media/deploy-monitor/llama/deploy-pay-as-you-go-project.png":::

1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region.

    :::image type="content" source="../media/deploy-monitor/llama/deployment-name.png" alt-text="A screenshot showing how to indicate the name of the deployment you want to create." lightbox="../media/deploy-monitor/llama/deployment-name.png":::

1. Select **Deploy**. Wait until the deployment is ready and you're redirected to the Deployments page.
1. Select **Open in playground** to start interacting with the model.
1. You can return to the Deployments page, select the deployment, and note the endpoint's **Target** URL and the Secret **Key**, which you can use to call the deployment and generate completions.
1. You can always find the endpoint's details, URL, and access keys by navigating to your project and selecting **Deployments** from the left menu.

To learn about billing for Llama models deployed with pay-as-you-go, see [Cost and quota considerations for Llama 3 models deployed as a service](#cost-and-quota-considerations-for-meta-llama-31-models-deployed-as-a-service).

---

### Consume Meta Llama models as a service

# [Meta Llama 3](#tab/llama-three)

Models deployed as a service can be consumed using either the chat or the completions API, depending on the type of model you deployed.

1. Select your project or hub and then select **Deployments** from the left menu.

1. Find and select the `Meta-Llama-3.1-405B-Instruct` deployment you created.

1. Select **Open in playground**.

1. Select **View code** and copy the **Endpoint** URL and the **Key** value.

1. Make an API request based on the type of model you deployed. 

    - For completions models, such as `Meta-Llama-3-8B`, use the [`/completions`](#completions-api) API.
    - For chat models, such as `Meta-Llama-3.1-405B-Instruct`, use the [`/chat/completions`](#chat-api) API.

    For more information on using the APIs, see the [reference](#reference-for-meta-llama-31-models-deployed-as-a-service) section.

# [Meta Llama 2](#tab/llama-two)


Models deployed as a service can be consumed using either the chat or the completions API, depending on the type of model you deployed.

1. Select your project or hub and then select **Deployments** from the left menu.

1. Find and select the deployment you created.

1. Select **Open in playground**.

1. Select **View code** and copy the **Endpoint** URL and the **Key** value.

1. Make an API request based on the type of model you deployed. 

    - For completions models, such as `Meta-Llama-2-7B`, use the [`/v1/completions`](#completions-api) API or the [Azure AI Model Inference API](../reference/reference-model-inference-api.md) on the route `/completions`.
    - For chat models, such as `Meta-Llama-2-7B-Chat`, use the [`/v1/chat/completions`](#chat-api) API or the [Azure AI Model Inference API](../reference/reference-model-inference-api.md) on the route `/chat/completions`.

    For more information on using the APIs, see the [reference](#reference-for-meta-llama-31-models-deployed-as-a-service) section.

---

### Reference for Meta Llama 3.1 models deployed as a service

Llama models accept both the [Azure AI Model Inference API](../reference/reference-model-inference-api.md) on the route `/chat/completions` or a [Llama Chat API](#chat-api) on `/v1/chat/completions`. In the same way, text completions can be generated using the [Azure AI Model Inference API](../reference/reference-model-inference-api.md) on the route `/completions` or a [Llama Completions API](#completions-api) on `/v1/completions`

The [Azure AI Model Inference API](../reference/reference-model-inference-api.md) schema can be found in the [reference for Chat Completions](../reference/reference-model-inference-chat-completions.md) article and an [OpenAPI specification can be obtained from the endpoint itself](../reference/reference-model-inference-api.md?tabs=rest#getting-started).

#### Completions API

Use the method `POST` to send the request to the `/v1/completions` route:

__Request__

```rest
POST /v1/completions HTTP/1.1
Host: <DEPLOYMENT_URI>
Authorization: Bearer <TOKEN>
Content-type: application/json
>>>>>>> cc2f91e73e4c8944f9a3486bcab5904bda17de50
```



## Work with chat completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

First, let's create a client to consume the model. In this example, we assume the endpoint URL and key are stored in environment variables.



```#
import os
from azure.ai.inference import ChatCompletionsClient
from azure.core.credentials import AzureKeyCredential

model = ChatCompletionsClient(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=AzureKeyCredential(os.environ["AZURE_INFERENCE_CREDENTIAL"]),
)
```

When you deploy the model to a self-hosted online endpoint with **Microsoft Entra ID** support, you can use the following code snippet to create a client.



```#
import os
from azure.ai.inference import ChatCompletionsClient
from azure.identity import DefaultAzureCredential

model = ChatCompletionsClient(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=DefaultAzureCredential(),
)
```

> [!NOTE]
> Currently, serverless API endpoints do not support using Microsoft Entra ID for authentication.



### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



```#
model.get_model_info()
```

The response is as follows:



```console
{
    "model_name": "Meta-Llama-3-8B-Instruct",
    "model_type": "chat-completions",
    "model_provider_name": "Meta"
}
```

### Create a chat completion request

Create a chat completion request to see the output of the model.


```#
from azure.ai.inference.models import SystemMessage, UserMessage

response = model.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
)
```

The response is as follows, where you can see the model's usage statistics:



```#
print("Response:", response.choices[0].message.content)
print("Model:", response.model)
print("Usage:", response.usage)
```

#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. To stream completions, set `stream=True` when you call the model. This setting returns an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field, rather than the message field.



```#
result = model.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
    temperature=0,
    top_p=1,
    max_tokens=2048,
)
```

To visualize the output, define a helper function to print the stream.


```#
def print_stream(result):
    """
    Prints the chat completion with streaming. Some delay is added to simulate 
    a real-time conversation.
    """
    import time
    for update in result:
        print(update.choices[0].delta.content, end="")
        time.sleep(0.05)
```

When you use streaming, responses look as follows:



```#
print_stream(result)
```

#### Explore more parameters

Explore other parameters that you can specify in the inference client. For a full list of all the supported parameters and their corresponding documentation, see [Azure AI Model Inference API reference](https://aka.ms/azureai/modelinference).


```#
from azure.ai.inference.models import ChatCompletionsResponseFormat

response = model.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
    presence_penalty=0.1,
    frequency_penalty=0.8,
    max_tokens=2048,
    stop=["<|endoftext|>"],
    temperature=0,
    top_p=1,
    response_format={ "type": ChatCompletionsResponseFormat.TEXT },
)
```

> [!WARNING]
> Notice that Meta Llama doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters.



```#
response = model.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
    model_extras={
        "logprobs": True
    }
)
```

### Content safety

The Azure AI model inference API supports [Azure AI content safety](https://aka.ms/azureaicontentsafety). Inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content when you use deployments with Azure AI content safety turned on. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



The following example shows how to handle events when the model detects harmful content in the input prompt and content safety is enabled.



```#
from azure.ai.inference.models import AssistantMessage, UserMessage, SystemMessage

try:
    response = model.complete(
        messages=[
            SystemMessage(content="You are an AI assistant that helps people find information."),
            UserMessage(content="Chopping tomatoes and cutting them into cubes or wedges are great ways to practice your knife skills."),
        ]
    )

    print(response.choices[0].message.content)

except HttpResponseError as ex:
    if ex.status_code == 400:
        response = json.loads(ex.response._content.decode('utf-8'))
        if isinstance(response, dict) and "error" in response:
            print(f"Your request triggered an {response['error']['code']} error:\n\t {response['error']['message']}")
        else:
            raise ex
    else:
        raise ex
```

> [!TIP]
> To learn more about how you can configure and control Azure AI content safety settings, check the [Azure AI content safety documentation](https://aka.ms/azureaicontentsafety).



> [!NOTE]
> Azure AI content safety is only available for models deployed as serverless API endpoints.



::: zone-end


::: zone pivot="programming-language-javascript"

## Meta Llama family of models

The Meta Llama family of models includes the following models:



# [Meta Llama-3](#tab/meta-llama-3)

Meta developed and released the Meta Llama 3 family of large language models (LLMs), a collection of pretrained and instruction tuned generative text models in 8 and 70B sizes. The Llama 3 instruction tuned models are optimized for dialogue use cases and outperform many of the available open source chat models on common industry benchmarks. Further, in developing these models, we took great care to optimize helpfulness and safety.


The following models are available:

- Meta-Llama-3-8B-Instruct
- Meta-Llama-3-70B-Instruct



# [Meta Llama-2](#tab/meta-llama-2)

Meta has developed and publicly released the Llama 2 family of large language models (LLMs), a collection of pretrained and fine-tuned generative text models ranging in scale from 7 billion to 70 billion parameters. Our fine-tuned LLMs, called Llama-2-Chat, are optimized for dialogue use cases. Llama-2-Chat models outperform open-source chat models on most benchmarks we tested, and in our human evaluations for helpfulness and safety, are on par with some popular closed-source models like ChatGPT and PaLM. We provide a detailed description of our approach to fine-tuning and safety improvements of Llama-2-Chat in order to enable the community to build on our work and contribute to the responsible development of LLMs.


The following models are available:

- Llama-2-7b-chat
- Llama-2-13b-chat
- Llama-2-70b-chat



---



## Prerequisites

To use Meta Llama models with Azure AI studio, you need the following prerequisites:



### A deployed Meta Llama model

Meta Llama can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).

> [!div class="nextstepaction"]
> [Deploy the model to serverless API endpoints](deploy-models-serverless.md)



Meta Llama can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)

> [!TIP]
> Notice when deploying Meta Llama to self-hosted managed compute you need to ensure you must have enough quota in your subscription. If you don't have enough quota available in the selected project, you can use the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours**



### The inference package installed

You can consume predictions from this model by using the `@azure-rest/ai-inference` package from `npm`. To install this package, you need the following prerequisites:

* LTS versions of `Node.js` with `npm`.
* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.

Once you have these prerequisites, install the Azure ModelClient REST client REST client library for JavaScript with the following command:

```bash
npm install @azure-rest/ai-inference
```



## Work with chat completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

First, let's create a client to consume the model. In this example, we assume the endpoint URL and key are stored in environment variables.



```//
import ModelClient from "@azure-rest/ai-inference";
import { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const client = new ModelClient(
    process.env.AZURE_INFERENCE_ENDPOINT, 
    new AzureKeyCredential(process.env.AZURE_INFERENCE_CREDENTIAL)
);
```

When you deploy the model to a self-hosted online endpoint with **Microsoft Entra ID** support, you can use the following code snippet to create a client.



```//
import ModelClient from "@azure-rest/ai-inference";
import { isUnexpected } from "@azure-rest/ai-inference";
import { DefaultAzureCredential }  from "@azure/identity";

const client = new ModelClient(
    process.env.AZURE_INFERENCE_ENDPOINT, 
    new DefaultAzureCredential()
);
```

> [!NOTE]
> Currently, serverless API endpoints do not support using Microsoft Entra ID for authentication.



### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



```//
await client.path("info").get()
```

The response is as follows:



```console
{
    "model_name": "Meta-Llama-3-8B-Instruct",
    "model_type": "chat-completions",
    "model_provider_name": "Meta"
}
```

### Create a chat completion request

Create a chat completion request to see the output of the model.


```//
var messages = [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "How many languages are in the world?" },
];

var response = await client.path("/chat/completions").post({
    body: {
        messages: messages,
    }
});
```

The response is as follows, where you can see the model's usage statistics:



```//
if (isUnexpected(response)) {
    throw response.body.error;
}

console.log(response.body.choices[0].message.content);
console.log(response.body.model);
console.log(response.body.usage);
```

#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. To stream completions, set `stream=True` when you call the model. This setting returns an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field, rather than the message field.



```//
var messages = [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "How many languages are in the world?" },
];

var response = await client.path("/chat/completions").post({
    body: {
        messages: messages,
    }
}).asNodeStream();
```

When you use streaming, responses look as follows:



```//
var stream = response.body;
if (!stream) {
    throw new Error("The response stream is undefined");
}

if (response.status !== "200") {
    throw new Error(`Failed to get chat completions: ${response.body.error}`);
}

var sses = createSseStream(stream);

for await (const event of sses) {
    if (event.data === "[DONE]") {
        return;
    }
    for (const choice of (JSON.parse(event.data)).choices) {
        console.log(choice.delta?.content ?? "");
    }
}
```

#### Explore more parameters

Explore other parameters that you can specify in the inference client. For a full list of all the supported parameters and their corresponding documentation, see [Azure AI Model Inference API reference](https://aka.ms/azureai/modelinference).


```//
var messages = [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "How many languages are in the world?" },
];

var response = await client.path("/chat/completions").post({
    body: {
        messages: messages,
        presence_penalty = "0.1",
        frequency_penalty = "0.8",
        max_tokens = 2048,
        stop =["<|endoftext|>"],
        temperature = 0,
        top_p = 1,
        response_format = { "type": "text" },
    }
});
```

> [!WARNING]
> Notice that Meta Llama doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters.



```//
var messages = [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "How many languages are in the world?" },
];

var response = await client.path("/chat/completions").post({
    headers: {
        "extra-params": "passthrough"
    },
    body: {
        messages: messages,
        logprobs: true
    }
});
```

### Content safety

The Azure AI model inference API supports [Azure AI content safety](https://aka.ms/azureaicontentsafety). Inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content when you use deployments with Azure AI content safety turned on. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



The following example shows how to handle events when the model detects harmful content in the input prompt and content safety is enabled.



```//
try {
    var messages = [
        { role: "system", content: "You are an AI assistant that helps people find information." },
        { role: "user", content: "Chopping tomatoes and cutting them into cubes or wedges are great ways to practice your knife skills." },
    ]

    var response = await client.path("/chat/completions").post({
        body: {
            messages: messages,
        }
    });
    
    console.log(response.body.choices[0].message.content)
}
catch (error) {
    if (error.status_code == 400) {
        var response = JSON.parse(error.response._content)
        if (response.error) {
            console.log(`Your request triggered an ${response.error.code} error:\n\t ${response.error.message}`)
        }
        else
        {
            throw error
        }
    }
}
```

> [!TIP]
> To learn more about how you can configure and control Azure AI content safety settings, check the [Azure AI content safety documentation](https://aka.ms/azureaicontentsafety).



> [!NOTE]
> Azure AI content safety is only available for models deployed as serverless API endpoints.



::: zone-end


::: zone pivot="programming-language-dotnet"

## Meta Llama family of models

The Meta Llama family of models includes the following models:



# [Meta Llama-3](#tab/meta-llama-3)

Meta developed and released the Meta Llama 3 family of large language models (LLMs), a collection of pretrained and instruction tuned generative text models in 8 and 70B sizes. The Llama 3 instruction tuned models are optimized for dialogue use cases and outperform many of the available open source chat models on common industry benchmarks. Further, in developing these models, we took great care to optimize helpfulness and safety.


The following models are available:

- Meta-Llama-3-8B-Instruct
- Meta-Llama-3-70B-Instruct



# [Meta Llama-2](#tab/meta-llama-2)

Meta has developed and publicly released the Llama 2 family of large language models (LLMs), a collection of pretrained and fine-tuned generative text models ranging in scale from 7 billion to 70 billion parameters. Our fine-tuned LLMs, called Llama-2-Chat, are optimized for dialogue use cases. Llama-2-Chat models outperform open-source chat models on most benchmarks we tested, and in our human evaluations for helpfulness and safety, are on par with some popular closed-source models like ChatGPT and PaLM. We provide a detailed description of our approach to fine-tuning and safety improvements of Llama-2-Chat in order to enable the community to build on our work and contribute to the responsible development of LLMs.


The following models are available:

- Llama-2-7b-chat
- Llama-2-13b-chat
- Llama-2-70b-chat



---



## Prerequisites

To use Meta Llama models with Azure AI studio, you need the following prerequisites:



### A deployed Meta Llama model

Meta Llama can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).

> [!div class="nextstepaction"]
> [Deploy the model to serverless API endpoints](deploy-models-serverless.md)



Meta Llama can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)

> [!TIP]
> Notice when deploying Meta Llama to self-hosted managed compute you need to ensure you must have enough quota in your subscription. If you don't have enough quota available in the selected project, you can use the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours**



### The inference package installed

You can consume predictions from this model by using the `Azure.AI.Inference` package from [Nuget](https://www.nuget.org/). To install this package, you need the following prerequisites:

* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.

Once you have these prerequisites, install the Azure AI inference library with the following command:

```dotnetcli
dotnet add package Azure.AI.Inference --prerelease
```

You can also authenticate with Microsoft Entra ID (formerly Azure Active Directory). To use credential providers provided with the Azure SDK, please install the `Azure.Identity` package:

```dotnetcli
dotnet add package Azure.Identity
```



## Work with chat completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

First, let's create a client to consume the model. In this example, we assume the endpoint URL and key are stored in environment variables.



```//
ChatCompletionsClient client = null;

        client = new ChatCompletionsClient(
            new Uri(Environment.GetEnvironmentVariable("AZURE_INFERENCE_ENDPOINT")),
            new AzureKeyCredential(Environment.GetEnvironmentVariable("AZURE_INFERENCE_CREDENTIAL"))
        );
```

When you deploy the model to a self-hosted online endpoint with **Microsoft Entra ID** support, you can use the following code snippet to create a client.



```//
client = new ChatCompletionsClient(
            new Uri(Environment.GetEnvironmentVariable("AZURE_INFERENCE_ENDPOINT")),
            new DefaultAzureCredential(includeInteractiveCredentials: true)
        );
```

> [!NOTE]
> Currently, serverless API endpoints do not support using Microsoft Entra ID for authentication.



### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



```//
Response<ModelInfo> modelInfo = client.GetModelInfo();
```

The response is as follows:



```console
Console.WriteLine($"Model name: {modelInfo.Value.ModelName}");
        Console.WriteLine($"Model type: {modelInfo.Value.ModelType}");
        Console.WriteLine($"Model provider name: {modelInfo.Value.ModelProviderName}");
```

### Create a chat completion request

Create a chat completion request to see the output of the model.


```//
ChatCompletionsOptions requestOptions = null;
        Response<ChatCompletions> response = null;

        requestOptions = new ChatCompletionsOptions()
        {
            Messages = {
                new ChatRequestSystemMessage("You are a helpful assistant."),
                new ChatRequestUserMessage("How many languages are in the world?")
            },
        };

        response = client.Complete(requestOptions);
```

The response is as follows, where you can see the model's usage statistics:



```//
Console.WriteLine($"Response: {response.Value.Choices[0].Message.Content}");
        Console.WriteLine($"Model: {response.Value.Model}");
        Console.WriteLine($"Usage: {response.Value.Usage.TotalTokens}");
```

#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. To stream completions, set `stream=True` when you call the model. This setting returns an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field, rather than the message field.



```//
static async Task RunAsync(ChatCompletionsClient client)
    {
        ChatCompletionsOptions requestOptions = null;
        Response<ChatCompletions> response = null;

        requestOptions = new ChatCompletionsOptions()
        {
            Messages = {
                new ChatRequestSystemMessage("You are a helpful assistant."),
                new ChatRequestUserMessage("How many languages are in the world?")
            },
        };

        StreamingResponse<StreamingChatCompletionsUpdate> streamResponse = await client.CompleteStreamingAsync(requestOptions);
        
        printStream(streamResponse);
    }
```

When you use streaming, responses look as follows:



```//
static async Task RunWithAsyncContext(ChatCompletionsClient client)
    {
        // In this case we are using Nito.AsyncEx package
        AsyncContext.Run(() => RunAsync(client));
    }
```

#### Explore more parameters

Explore other parameters that you can specify in the inference client. For a full list of all the supported parameters and their corresponding documentation, see [Azure AI Model Inference API reference](https://aka.ms/azureai/modelinference).


```//
requestOptions = new ChatCompletionsOptions()
        {
            Messages = {
                new ChatRequestSystemMessage("You are a helpful assistant."),
                new ChatRequestUserMessage("How many languages are in the world?")
            },
            //PresencePenalty = 0.1f,
            //FrequencyPenalty = 0.8f,
            MaxTokens = 2048,
            StopSequences = { "<|endoftext|>" },
            Temperature = 0,
            NucleusSamplingFactor = 1,
            //ResponseFormat = ChatCompletionsResponseFormat.Text
        };

        response = client.Complete(requestOptions);
        Console.WriteLine($"Response: {response.Value.Choices[0].Message.Content}");
```

> [!WARNING]
> Notice that Meta Llama doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters.



```//
requestOptions = new ChatCompletionsOptions()
        {
            Messages = {
                new ChatRequestSystemMessage("You are a helpful assistant."),
                new ChatRequestUserMessage("How many languages are in the world?")
            },
            // AdditionalProperties = { { "logprobs", BinaryData.FromString("true") } },
        };

        response = client.Complete(requestOptions, extraParams: ExtraParameters.PassThrough);
        Console.WriteLine($"Response: {response.Value.Choices[0].Message.Content}");
```

### Content safety

The Azure AI model inference API supports [Azure AI content safety](https://aka.ms/azureaicontentsafety). Inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content when you use deployments with Azure AI content safety turned on. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



The following example shows how to handle events when the model detects harmful content in the input prompt and content safety is enabled.



```//
try
        {
            requestOptions = new ChatCompletionsOptions()
            {
                Messages = {
                    new ChatRequestSystemMessage("You are an AI assistant that helps people find information."),
                    new ChatRequestUserMessage("Chopping tomatoes and cutting them into cubes or wedges are great ways to practice your knife skills."),
                },
            };

            response = client.Complete(requestOptions);
            Console.WriteLine(response.Value.Choices[0].Message.Content);
        }
        catch (RequestFailedException ex)
        {
            if (ex.ErrorCode == "content_filter")
            {
                Console.WriteLine($"Your query has trigger Azure Content Safeaty: {ex.Message}");
            }
            else
            {
                throw;
            }
        }
```

<<<<<<< HEAD
> [!TIP]
> To learn more about how you can configure and control Azure AI content safety settings, check the [Azure AI content safety documentation](https://aka.ms/azureaicontentsafety).

=======
Apart from deploying with the pay-as-you-go managed service, you can also deploy Meta Llama 3.1 models to managed compute in AI Studio. When deployed to managed compute, you can select all the details about the infrastructure running the model, including the virtual machines to use and the number of instances to handle the load you're expecting. Models deployed to managed compute consume quota from your subscription. The following models from the 3.1 release wave are available on managed compute:
- `Meta-Llama-3.1-8B-Instruct` (FT supported)
- `Meta-Llama-3.1-70B-Instruct` (FT supported)
- `Meta-Llama-3.1-8B` (FT supported)
- `Meta-Llama-3.1-70B` (FT supported)
- `Llama Guard 3 8B`
- `Prompt Guard`

Follow these steps to deploy a model such as `Meta-Llama-3.1-70B-Instruct ` to a managed compute in [Azure AI Studio](https://ai.azure.com).
>>>>>>> cc2f91e73e4c8944f9a3486bcab5904bda17de50


> [!NOTE]
> Azure AI content safety is only available for models deployed as serverless API endpoints.


<<<<<<< HEAD
=======
    :::image type="content" source="../media/deploy-monitor/llama/deploy-real-time-endpoint.png" alt-text="A screenshot showing how to deploy a model with the managed compute option." lightbox="../media/deploy-monitor/llama/deploy-real-time-endpoint.png":::
>>>>>>> cc2f91e73e4c8944f9a3486bcab5904bda17de50

::: zone-end


::: zone pivot="programming-language-rest"

## Meta Llama family of models

The Meta Llama family of models includes the following models:



# [Meta Llama-3](#tab/meta-llama-3)

Meta developed and released the Meta Llama 3 family of large language models (LLMs), a collection of pretrained and instruction tuned generative text models in 8 and 70B sizes. The Llama 3 instruction tuned models are optimized for dialogue use cases and outperform many of the available open source chat models on common industry benchmarks. Further, in developing these models, we took great care to optimize helpfulness and safety.


The following models are available:

<<<<<<< HEAD
- Meta-Llama-3-8B-Instruct
- Meta-Llama-3-70B-Instruct



# [Meta Llama-2](#tab/meta-llama-2)

Meta has developed and publicly released the Llama 2 family of large language models (LLMs), a collection of pretrained and fine-tuned generative text models ranging in scale from 7 billion to 70 billion parameters. Our fine-tuned LLMs, called Llama-2-Chat, are optimized for dialogue use cases. Llama-2-Chat models outperform open-source chat models on most benchmarks we tested, and in our human evaluations for helpfulness and safety, are on par with some popular closed-source models like ChatGPT and PaLM. We provide a detailed description of our approach to fine-tuning and safety improvements of Llama-2-Chat in order to enable the community to build on our work and contribute to the responsible development of LLMs.


The following models are available:

- Llama-2-7b-chat
- Llama-2-13b-chat
- Llama-2-70b-chat



---
=======
| **Package**       | **Sample Notebook**                             |
|----------------|----------------------------------------|
| CLI using CURL and Python web requests | [webrequests.ipynb](https://aka.ms/meta-llama-3.1-405B-instruct-webrequests)|
| OpenAI SDK (experimental)    | [openaisdk.ipynb](https://aka.ms/meta-llama-3.1-405B-instruct-openai)|
| LangChain      | [langchain.ipynb](https://aka.ms/meta-llama-3.1-405B-instruct-langchain)|
| LiteLLM SDK    | [litellm.ipynb](https://aka.ms/meta-llama-3.1-405B-instruct-litellm) |
>>>>>>> cc2f91e73e4c8944f9a3486bcab5904bda17de50



## Prerequisites

To use Meta Llama models with Azure AI studio, you need the following prerequisites:



### A deployed Meta Llama model

Meta Llama can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).

> [!div class="nextstepaction"]
> [Deploy the model to serverless API endpoints](deploy-models-serverless.md)



Meta Llama can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)

> [!TIP]
> Notice when deploying Meta Llama to self-hosted managed compute you need to ensure you must have enough quota in your subscription. If you don't have enough quota available in the selected project, you can use the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours**



### A REST client

Models deployed with the [Azure AI model inference API](https://aka.ms/azureai/modelinference) can be consumed using any REST client. To use the REST client, you need the following prerequisites:

* To construct the requests, you will need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where your-host-name is your unique model deployment host name and your-azure-region is the Azure region where the model is deployed (e.g. eastus2).
* Depending on your model deployment and authentication preference, you either need a key to authenticate against the service, or Entra ID credentials. The key is a 32-character string.



## Work with chat completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

First, let's create a client to consume the model. In this example, we assume the endpoint URL and key are stored in environment variables.



When you deploy the model to a self-hosted online endpoint with **Microsoft Entra ID** support, you can use the following code snippet to create a client.



> [!NOTE]
> Currently, serverless API endpoints do not support using Microsoft Entra ID for authentication.



### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



The response is as follows:



### Create a chat completion request

Create a chat completion request to see the output of the model.


The response is as follows, where you can see the model's usage statistics:



#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. To stream completions, set `stream=True` when you call the model. This setting returns an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field, rather than the message field.



When you use streaming, responses look as follows:



The last message in the stream will have `finish_reason` set indicating the reason for the generation process to stop.



#### Explore more parameters

Explore other parameters that you can specify in the inference client. For a full list of all the supported parameters and their corresponding documentation, see [Azure AI Model Inference API reference](https://aka.ms/azureai/modelinference).


> [!WARNING]
> Notice that Meta Llama doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters.



### Content safety

The Azure AI model inference API supports [Azure AI content safety](https://aka.ms/azureaicontentsafety). Inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content when you use deployments with Azure AI content safety turned on. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



The following example shows how to handle events when the model detects harmful content in the input prompt and content safety is enabled.



> [!TIP]
> To learn more about how you can configure and control Azure AI content safety settings, check the [Azure AI content safety documentation](https://aka.ms/azureaicontentsafety).



> [!NOTE]
> Azure AI content safety is only available for models deployed as serverless API endpoints.



::: zone-end

## Cost and quotas

<<<<<<< HEAD
### Cost and quota considerations for Meta Llama family of models deployed as serverless API endpoints

Meta Llama models deployed as a serverless API are offered by Meta through the Azure Marketplace and integrated with Azure AI studio for use. You can find the Azure Marketplace pricing when deploying the model.
=======
### Cost and quota considerations for Meta Llama 3.1 models deployed as a service

Meta Llama 3.1 models deployed as a service are offered by Meta through the Azure Marketplace and integrated with Azure AI Studio for use. You can find the Azure Marketplace pricing when deploying or [fine-tuning the models](./fine-tune-model-llama.md). 
>>>>>>> cc2f91e73e4c8944f9a3486bcab5904bda17de50

Each time a project subscribes to a given offer from the Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see monitor costs for models offered throughout the Azure Marketplace.


<<<<<<< HEAD

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios. 

=======
Quota is managed per deployment. Each deployment has a rate limit of 400,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios.

### Cost and quota considerations for Meta Llama 3.1 models deployed as managed compute

For deployment and inferencing of Meta Llama 3.1 models with managed compute, you consume virtual machine (VM) core quota that is assigned to your subscription on a per-region basis. When you sign up for Azure AI Studio, you receive a default VM quota for several VM families available in the region. You can continue to create deployments until you reach your quota limit. Once you reach this limit, you can request a quota increase.  
>>>>>>> cc2f91e73e4c8944f9a3486bcab5904bda17de50


### Cost and quota considerations for Meta Llama family of models deployed to managed compute

Meta Llama models deployed to managed compute are billed based on core hours of the associated compute instance. The cost of the compute instance is determined by the size of the instance, the number of instances running, and the duration it is running.

We recommend starting with a low number of instances and scaling up as needed. You can monitor the cost of the compute instance in the Azure portal.



## Additional resources

Here are some additional reference: 

* [Azure AI Model Inference API](../reference/reference-model-inference-api.md)
* [Deploy models as serverless APIs](deploy-models-serverless.md)
* [Consume serverless API endpoints from a different Azure AI Studio project or hub](deploy-models-serverless-connect.md)
* [Region availability for models in serverless API endpoints](deploy-models-serverless-availability.md)
* [Plan and manage costs (marketplace)](costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace)

<<<<<<< HEAD
=======
- [What is Azure AI Studio?](../what-is-ai-studio.md)
- [Fine-tune a Meta Llama 3.1 models in Azure AI Studio](fine-tune-model-llama.md)
- [Azure AI FAQ article](../faq.yml)
- [Region availability for models in serverless API endpoints](deploy-models-serverless-availability.md)
>>>>>>> cc2f91e73e4c8944f9a3486bcab5904bda17de50
