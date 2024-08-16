---
title: Explore the model catalog in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces foundation model capabilities and the model catalog in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: jcioffi
ms.author: ssalgado
author: ssalgadodev
---

# Model catalog and collections in Azure AI Studio

[!INCLUDE [Feature preview](~/reusable-content/ce-skilling/azure/includes/ai-studio/includes/feature-preview.md)]

The model catalog in Azure AI Studio is the hub to discover and use a wide range of models for building generative AI applications. The model catalog features hundreds of models across model providers such as Azure OpenAI Service, Mistral, Meta, Cohere, NVIDIA, and Hugging Face, including models that Microsoft trained. Models from providers other than Microsoft are Non-Microsoft Products as defined in [Microsoft Product Terms](https://www.microsoft.com/licensing/terms/welcome/welcomepage) and are subject to the terms provided with the models.

## Model collections

The model catalog organizes models into three types collections:

* **Curated by Azure AI**: The most popular non-Microsoft open-weight and proprietary models packaged and optimized to work seamlessly on the Azure AI platform. Use of these models is subject to the model providers' license terms. When you deploy these models in Azure AI Studio, their availability is subject to the applicable [Azure service-level agreement (SLA)](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services), and Microsoft provides support for deployment problems.

  Models from partners such as Meta, NVIDIA, and Mistral AI are examples of models available in this collection on the catalog. You can identify these models by looking for a green checkmark on the model tiles in the catalog. Or you can filter by the **Curated by Azure AI** collection.

* **Azure OpenAI models exclusively available on Azure**: Flagship Azure OpenAI models available through an integration with Azure OpenAI Service. Microsoft supports these models and their use according to the product terms and [SLA for Azure OpenAI Service](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

* **Open models from the Hugging Face hub**: Hundreds of models from the Hugging Face hub for real-time inference with managed compute. Hugging Face creates and maintains models listed in this collection. For help, use the [Hugging Face forum](https://discuss.huggingface.co) or [Hugging Face support](https://huggingface.co/support). Learn more in [Deploy open models with Azure AI Studio](deploy-models-open.md).

You can submit a request to add a model to the model catalog by using [this form](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR_frVPkg_MhOoQxyrjmm7ZJUM09WNktBMURLSktOWEdDODBDRjg2NExKUy4u).

## Overview of model catalog capabilities

You can deploy some models in the **Curated by Azure AI** and **Open models from the Hugging Face hub** collections with a managed compute option. Some models are available to be deployed through serverless APIs with pay-as-you-go billing.

You can discover, compare, evaluate, fine-tune (when supported), and deploy these models at scale. You can then integrate the models into your generative AI applications with enterprise-grade security and data governance. The following list describes the activities in detail:

* **Discover**: Review model cards, try sample inference, and browse code samples to evaluate, fine-tune, or deploy the model.
* **Compare**: Compare benchmarks across models and datasets available in the industry to assess which one meets your business scenario.
* **Evaluate**: Evaluate if the model is suited for your specific workload by providing your own test data. Use evaluation metrics to visualize how well the selected model performs in your scenario.
* **Fine-tune**: Customize fine-tunable models by using your own training data, and choose the best model by comparing metrics across all your fine-tuning jobs. Built-in optimizations speed up fine-tuning and reduce the required memory and compute.
* **Deploy**: Deploy pretrained models or fine-tuned models seamlessly for inference. You can also download models that can be deployed to managed compute.

For more information on Azure OpenAI models, see [What is Azure OpenAI Service?](../../ai-services/openai/overview.md).

## Model deployment: Managed compute and serverless API (pay-as-you-go)  

The model catalog offers two distinct ways to deploy models for your use: managed compute and serverless APIs.

The deployment options and features available for each model vary, as described in the following tables. [Learn more about data processing with the deployment options]( concept-data-privacy.md).
<!-- docutune:disable -->

Features | Managed compute | Serverless API (pay-as-you-go)
--|--|--
Deployment experience and billing | Model weights are deployed to dedicated virtual machines with managed online endpoints. A managed online endpoint, which can have one or more deployments, makes available a REST API for inference. You're billed for the virtual machine core hours that the deployments use. | Access to models is through a deployment that provisions an API to access the model. The API provides access to the model that Microsoft hosts and manages, for inference. You're billed for inputs and outputs to the APIs, typically in tokens. Pricing information is provided before you deploy.
API authentication | Keys and Microsoft Entra authentication. | Keys only.  
Content safety | Use Azure AI Content Safety service APIs. | Azure AI Content Safety filters are available integrated with inference APIs. Azure AI Content Safety filters are billed separately.
Network isolation | [Configure managed networks for Azure AI Studio hubs](configure-managed-network.md).  | Endpoints follow your hub's public network access (PNA) flag setting. For more information, see the [Network isolation for models deployed via Serverless APIs](#network-isolation-for-models-deployed-via-serverless-apis) section later in this article.

Model | Managed compute | Serverless API (pay-as-you-go)
--|--|--
Llama family models | Llama-2-7b <br> Llama-2-7b-chat <br> Llama-2-13b <br> Llama-2-13b-chat <br> Llama-2-70b <br> Llama-2-70b-chat <br> Llama-3-8B-Instruct <br> Llama-3-70B-Instruct <br> Llama-3-8B <br> Llama-3-70B | Llama-3-70B-Instruct <br> Llama-3-8B-Instruct <br> Llama-2-7b <br> Llama-2-7b-chat <br> Llama-2-13b <br> Llama-2-13b-chat <br> Llama-2-70b <br> Llama-2-70b-chat
Mistral family models | mistralai-Mixtral-8x22B-v0-1 <br> mistralai-Mixtral-8x22B-Instruct-v0-1 <br> mistral-community-Mixtral-8x22B-v0-1 <br> mistralai-Mixtral-8x7B-v01 <br> mistralai-Mistral-7B-Instruct-v0-2 <br> mistralai-Mistral-7B-v01 <br> mistralai-Mixtral-8x7B-Instruct-v01 <br> mistralai-Mistral-7B-Instruct-v01 | Mistral-large (2402) <br> Mistral-large (2407) <br> Mistral-small <br> Mistral-NeMo
Cohere family models | Not available | Cohere-command-r-plus <br> Cohere-command-r <br> Cohere-embed-v3-english <br> Cohere-embed-v3-multilingual <br> Cohere-rerank-v3-english <br> Cohere-rerank-v3-multilingual
JAIS | Not available | jais-30b-chat
Phi-3 family models | Phi-3-mini-4k-Instruct <br> Phi-3-mini-128k-Instruct <br> Phi-3-small-8k-Instruct <br> Phi-3-small-128k-Instruct <br> Phi-3-medium-4k-instruct <br> Phi-3-medium-128k-instruct <br> Phi-3-vision-128k-Instruct <br> Phi-3.5-mini-Instruct <br> Phi-3.5-vision-Instruct <br> Phi-3.5-MOE-Instruct | Phi-3-mini-4k-Instruct <br> Phi-3-mini-128k-Instruct <br> Phi-3-small-8k-Instruct <br> Phi-3-small-128k-Instruct <br> Phi-3-medium-4k-instruct <br> Phi-3-medium-128k-instruct <br> <br> Phi-3.5-mini-Instruct
Nixtla | Not available | TimeGEN-1
Other models | Available | Not available

<!-- docutune:enable -->

:::image type="content" source="../media/explore/platform-service-cycle.png" alt-text="Diagram that shows models as a service and the service cycle of real-time endpoints." lightbox="../media/explore/platform-service-cycle.png":::

## Managed compute

The capability to deploy models as managed compute builds on platform capabilities of Azure Machine Learning to enable seamless integration of the wide collection of models in the model catalog across the entire life cycle of large language model (LLM) operations.

:::image type="content" source="../media/explore/llmops-life-cycle.png" alt-text="Diagram that shows the life cycle of large language model operations." lightbox="../media/explore/llmops-life-cycle.png":::

### Availability of models for deployment as managed compute  

The models are made available through [Azure Machine Learning registries](../../machine-learning/concept-machine-learning-registries-mlops.md). These registries enable a machine-learning-first approach to [hosting and distributing Azure Machine Learning assets](../../machine-learning/how-to-share-models-pipelines-across-workspaces-with-registries.md). These assets include model weights, container runtimes for running the models, pipelines for evaluating and fine-tuning the models, and datasets for benchmarks and samples.

The registries build on top of a highly scalable and enterprise-ready infrastructure that:

* Delivers low-latency access model artifacts to all Azure regions with built-in geo-replication.

* Supports enterprise security requirements such as limiting access to models by using Azure Policy and secure deployment by using managed virtual networks.

### Deployment of models for inference with managed compute

Models available for deployment to managed compute can be deployed to Azure Machine Learning online endpoints for real-time inference. Deploying to managed compute requires you to have a virtual machine quota in your Azure subscription for the specific products that you need to optimally run the model. Some models allow you to deploy to a [temporarily shared quota for model testing](deploy-models-open.md).

Learn more about deploying models:

* [Deploy Meta Llama models](deploy-models-llama.md)
* [Deploy Azure AI Studio open models](deploy-models-open.md)

### Building generative AI apps with managed compute

The *prompt flow* feature in Azure Machine Learning offers a great experience for prototyping. You can use models deployed with managed compute in prompt flow with the [Open Model LLM tool](../../machine-learning/prompt-flow/tools-reference/open-model-llm-tool.md). You can also use the REST API exposed by managed compute in popular LLM tools like LangChain with the [Azure Machine Learning extension](https://python.langchain.com/docs/integrations/chat/azureml_chat_endpoint/).  

### Content safety for models deployed as managed compute

The [Azure AI Content Safety](../../ai-services/content-safety/overview.md) service is available for use with managed compute to screen for various categories of harmful content, such as sexual content, violence, hate, and self-harm. You can also use the service to screen for advanced threats such as jailbreak risk detection and protected material text detection.

You can refer to [this notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/system/inference/text-generation/llama-safe-online-deployment.ipynb) for reference integration with Azure AI Content Safety for Llama 2. Or you can use the Content Safety (Text) tool in prompt flow to pass responses from the model to Azure AI Content Safety for screening. You're billed separately for such use, as described in [Azure AI Content Safety pricing](https://azure.microsoft.com/pricing/details/cognitive-services/content-safety/).

## Serverless APIs with pay-as-you-go billing

You can deploy certain models in the model catalog as serverless APIs with pay-as-you-go billing. This deployment method, sometimes called *model as a service* (MaaS), provides a way to consume the models as APIs without hosting them on your subscription. Models are hosted in a Microsoft-managed infrastructure, which enables API-based access to the model provider's model. API-based access can dramatically reduce the cost of accessing a model and simplify the provisioning experience.

Models that are available for deployment as serverless APIs with pay-as-you-go billing are offered by the model provider, but they're hosted in a Microsoft-managed Azure infrastructure and accessed via API. Model providers define the license terms and set the price for use of their models. The Azure Machine Learning service:

* Manages the hosting infrastructure.
* Makes the inference APIs available.
* Acts as the data processor for prompts submitted and content output by models deployed via MaaS.

Learn more about data processing for MaaS in the [article about data privacy](concept-data-privacy.md).

:::image type="content" source="../media/explore/model-publisher-cycle.png" alt-text="Diagram that shows the model publisher service cycle." lightbox="../media/explore/model-publisher-cycle.png":::

### Billing

The discovery, subscription, and consumption experience for models deployed via MaaS is in Azure AI Studio and Azure Machine Learning studio. Users accept license terms for use of the models. Pricing information for consumption is provided during deployment.

Models from non-Microsoft providers are billed through Azure Marketplace, in accordance with the [Microsoft Commercial Marketplace Terms of Use](/legal/marketplace/marketplace-terms).

Models from Microsoft are billed via Azure meters as First Party Consumption Services. As described in the [Product Terms](https://www.microsoft.com/licensing/terms/welcome/welcomepage), you purchase First Party Consumption Services by using Azure meters, but they aren't subject to Azure service terms. Use of these models is subject to the provided license terms.  

### Fine-tuning models

Certain models support also serverless fine-tuning. For these models, you can take advantage of hosted fine-tuning with pay-as-you-go billing to tailor the models by using data that you provide. For more information, see the [fine-tuning overview](../concepts/fine-tuning-overview.md).

### RAG with models deployed as serverless APIs

In Azure AI Studio, you can use vector indexes and retrieval-augmented generation (RAG). You can use models that can be deployed via serverless APIs to generate embeddings and inferencing based on custom data. These embeddings and inferencing can then generate answers specific to your use case. For more information, see [Build and consume vector indexes in Azure AI Studio](index-add.md).

### Regional availability of offers and models

Pay-as-you-go billing is available only to users whose Azure subscription belongs to a billing account in a country where the model provider has made the offer available. If the offer is available in the relevant region, the user then must have a Hub/Project in the Azure region where the model is available for deployment or fine-tuning, as applicable. See [Region availability for models in serverless API endpoints | Azure AI Studio](deploy-models-serverless-availability.md) for detailed information.

### Content safety for models deployed via serverless APIs

[!INCLUDE [content-safety-serverless-models](../includes/content-safety-serverless-models.md)]

### Network isolation for models deployed via serverless APIs

Endpoints for models deployed as serverless APIs follow the PNA flag setting of the AI Studio hub that has the project in which the deployment exists. To help secure your MaaS endpoint, disable the PNA flag on your AI Studio hub. You can help secure inbound communication from a client to your endpoint by using a private endpoint for the hub.

To set the PNA flag for the AI Studio hub:

* Go to the [Azure portal](https://ms.portal.azure.com/).
* Search for the resource group to which the hub belongs, and select your AI Studio hub from the resources listed for this resource group.
* On the hub overview page, on the left pane, go to **Settings** > **Networking**.
* On the **Public access** tab, you can configure settings for the PNA flag.
* Save your changes. Your changes might take up to five minutes to propagate.

#### Limitations

* If you have an AI Studio hub with a private endpoint created before July 11, 2024, new MaaS endpoints added to projects in this hub won't follow the networking configuration of the hub. Instead, you need to create a new private endpoint for the hub and create new serverless API deployments in the project so that the new deployments can follow the hub's networking configuration.

* If you have an AI Studio hub with MaaS deployments created before July 11, 2024, and you enable a private endpoint on this hub, the existing MaaS deployments won't follow the hub's networking configuration. For serverless API deployments in the hub to follow the hub's networking configuration, you need to create the deployments again.

* Currently, [Azure OpenAI On Your Data](/azure/ai-services/openai/concepts/use-your-data) support isn't available for MaaS deployments in private hubs, because private hubs have the PNA flag disabled.

* Any network configuration change (for example, enabling or disabling the PNA flag) might take up to five minutes to propagate.

## Related content

* [Explore foundation models in Azure AI Studio](models-foundation-azure-ai.md)
