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

# Model Catalog and Collections in Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

The model catalog in Azure AI studio is the hub to discover and use a wide range of models that enable you to build Generative AI applications. The model catalog features hundreds of models across model providers such as Azure OpenAI service, Mistral, Meta, Cohere, Nvidia, Hugging Face, including models trained by Microsoft. Models from providers other than Microsoft are Non-Microsoft Products, as defined in [Microsoft's Product Terms](https://www.microsoft.com/licensing/terms/welcome/welcomepage), and subject to the terms provided with the model.   

## Model Collections 

The model catalog  organizes models into Collections. There are three types of collections in the model catalog: 

* **Models curated by Azure AI:** The most popular third-party open weight and propriety models packaged and optimized to work seamlessly on the Azure AI platform. Use of these models is subject to the model provider's license terms provided with the model. When deployed in Azure AI Studio, availability of the model is subject to the applicable [Azure SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services), and Microsoft provides support for deployment issues. Models from partners such as Meta, NVIDIA, Mistral AI are examples of models available in the "Curated by Azure AI" collection on the catalog. These models can be identified by a green checkmark on the model tiles in the catalog or you can filter by the "Curated by Azure AI" collection. 
* **Azure OpenAI models, exclusively available on Azure:** Flagship Azure OpenAI models via the 'Azure OpenAI' collection through an integration with the Azure OpenAI Service. Microsoft  supports these models  and their use subject to the product terms and [SLA for Azure OpenAI Service](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).
* **Open models from the Hugging Face hub:** Hundreds of models from the HuggingFace hub are accessible via the 'Hugging Face' collection for real time inference with managed compute. Hugging face creates and maintains models listed in HuggingFace collection. Use [HuggingFace forum](https://discuss.huggingface.co) or [HuggingFace support](https://huggingface.co/support) for help. Learn more in [Deploy open models](deploy-models-open.md) .

**Suggesting additions to the Model Catalog**: You can submit a request to add a model to the model catalog using [this form](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR_frVPkg_MhOoQxyrjmm7ZJUM09WNktBMURLSktOWEdDODBDRjg2NExKUy4u). 

## Model Catalog capabilities overview 

For information on Azure OpenAI models,  refer to [Azure OpenAI Service](../../ai-services/openai/overview.md) .

Some models in the **Curated by Azure AI** and **Open models from the Hugging Face hub** collections can be deployed with a managed compute option, and some models are available to be deployed using serverless APIs with pay-as-you-go billing. These models can be discovered, compared, evaluated, fine-tuned (when supported) and deployed at scale and integrated into your Generative AI applications with enterprise-grade security and data governance.  

* **Discover:** Review model cards, try sample inference and browse code samples to evaluate, fine-tune, or deploy the model. 
* **Compare:** Compare benchmarks across models and datasets available in the industry to assess which one meets your business scenario. 
* **Evaluate:** Evaluate if the model is suited for your specific workload by providing your own test data. Evaluation metrics make it easy to visualize how well the selected model performed in your scenario. 
* **Fine-tune:** Customize fine-tunable models using your own training data and pick the best model by comparing metrics across all your fine-tuning jobs. Built-in optimizations speedup fine-tuning and reduce the memory and compute needed for fine-tuning. 
* **Deploy:** Deploy pretrained models or fine-tuned models seamlessly for inference. Models that can be deployed to managed compute can also be downloaded.  

## Model deployment: Managed compute and serverless API (pay-as-you-go)  

Model Catalog offers two distinct ways to deploy models from the catalog for your use: managed compute and serverless APIs. The deployment options available for each model vary; learn more about the features of the deployment options, and the options available for specific models, in the following tables. Learn more about [data processing]( concept-data-privacy.md) with the deployment options. 

Features | Managed compute | serverless API (pay-as-you-go) 
--|--|-- 
Deployment experience and billing |  Model weights are deployed to dedicated Virtual Machines with Managed Online Endpoints. The managed online endpoint, which can have one or more deployments, makes available a REST API for inference. You're billed for the Virtual Machine core hours used by the deployments.  | Access to models is through a deployment that provisions an API to access the model. The API provides access to the model hosted and managed by Microsoft, for inference. This mode of access is referred to as "Models as a Service".   You're billed for inputs and outputs to the APIs, typically in tokens; pricing information is provided before you deploy.  
| API authentication   | Keys and Microsoft Entra ID authentication.| Keys only.  
Content safety | Use Azure Content Safety service APIs.  | Azure AI Content Safety filters are available integrated with inference APIs. Azure AI Content Safety filters may be billed separately.  
Network isolation | Configure Managed Network. [Learn more.]( configure-managed-network.md)  | 

Model | Managed compute | Serverless API (pay-as-you-go) 
--|--|--
Llama family models  | Llama-2-7b <br> Llama-2-7b-chat <br> Llama-2-13b <br> Llama-2-13b-chat <br> Llama-2-70b <br> Llama-2-70b-chat <br> Llama-3-8B-Instruct <br> Llama-3-70B-Instruct <br> Llama-3-8B <br> Llama-3-70B | Llama-3-70B-Instruct <br> Llama-3-8B-Instruct <br> Llama-2-7b <br> Llama-2-7b-chat <br> Llama-2-13b <br> Llama-2-13b-chat <br> Llama-2-70b <br> Llama-2-70b-chat 
Mistral family models | mistralai-Mixtral-8x22B-v0-1 <br> mistralai-Mixtral-8x22B-Instruct-v0-1 <br> mistral-community-Mixtral-8x22B-v0-1 <br> mistralai-Mixtral-8x7B-v01 <br> mistralai-Mistral-7B-Instruct-v0-2 <br> mistralai-Mistral-7B-v01 <br> mistralai-Mixtral-8x7B-Instruct-v01 <br> mistralai-Mistral-7B-Instruct-v01 | Mistral-large <br> Mistral-small
Cohere family models | Not available | Cohere-command-r-plus <br> Cohere-command-r <br> Cohere-embed-v3-english <br> Cohere-embed-v3-multilingual
JAIS | Not available | jais-30b-chat
Phi3 family models | Phi-3-small-128k-Instruct <br> Phi-3-small-8k-Instruct <br> Phi-3-mini-4k-Instruct <br> Phi-3-mini-128k-Instruct <br> Phi3-medium-128k-instruct <br> Phi3-medium-4k-instruct | Phi-3-mini-4k-Instruct <br> Phi-3-mini-128k-Instruct <br> Phi3-medium-128k-instruct <br> Phi3-medium-4k-instruct <br> Phi-3-vision-128k-instruct 
Nixtla | Not available | TimeGEN-1
Other models | Available | Not available


:::image type="content" source="../media/explore/platform-service-cycle.png" alt-text="A diagram showing models as a service and Real time end points service cycle." lightbox="../media/explore/platform-service-cycle.png":::

## Managed compute

The capability to deploy models as a Managed compute builds on platform capabilities of Azure Machine Learning to enable seamless integration, across the entire LLMOps lifecycle, of the wide collection of models in the Model Catalog. 

:::image type="content" source="../media/explore/llmops-life-cycle.png" alt-text="A diagram showing the LLMops life cycle." lightbox="../media/explore/llmops-life-cycle.png":::

### How are models made available for deployment as Managed compute?  

The models are made available through [Azure Machine Learning registries](../../machine-learning/concept-machine-learning-registries-mlops.md) that enable ML first approach to [hosting and distributing Machine Learning assets](../../machine-learning/how-to-share-models-pipelines-across-workspaces-with-registries.md) such as model weights, container runtimes for running the models, pipelines for evaluating and fine-tuning the models and datasets for benchmarks and samples. These ML Registries build on top of highly scalable and enterprise ready infrastructure that: 

* Delivers low latency access model artifacts to all Azure regions with built-in geo-replication. 

* Supports enterprise security requirements as limiting access to models with Azure Policy and secure deployment with managed virtual networks. 

### Deploy models for inference with managed compute 

Models available for deployment to a Managed compute can be deployed to Azure Machine Learning Online Endpoints for real-time inference. Deploying to managed compute requires you to have Virtual Machine quota in your Azure Subscription for the specific SKUs needed to optimally run the model.  Some models allow you to deploy to [temporarily shared quota for testing the model](deploy-models-open.md). Learn more about deploying models: 

* [Deploy Meta Llama models](deploy-models-llama.md) 
* [Deploy Open models Created by Azure AI](deploy-models-open.md)

### Build Generative AI Apps with Managed computes

Prompt flow offers a great experience for prototyping. You can use models deployed with Managed computes in Prompt Flow with the [Open Model LLM tool](../../machine-learning/prompt-flow/tools-reference/open-model-llm-tool.md).  You can also use the REST API exposed by managed compute in popular LLM tools like LangChain with the [Azure Machine Learning extension](https://python.langchain.com/docs/integrations/chat/azureml_chat_endpoint/).  


### Content safety for models deployed as Managed Computes 

[Azure AI Content Safety (AACS)](../../ai-services/content-safety/overview.md) service is available for use with Managed computes to screen for various categories of harmful content such as sexual content, violence, hate, and self-harm and advanced threats such as Jailbreak risk detection and Protected material text detection. You can refer to this notebook for reference integration with AACS for [Llama 2](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/system/inference/text-generation/llama-safe-online-deployment.ipynb) or use the Content Safety (Text) tool in Prompt Flow to pass responses from the model to AACS for screening. You are billed separately as per [AACS pricing](https://azure.microsoft.com/pricing/details/cognitive-services/content-safety/) for such use. 

### Serverless APIs with Pay-as-you-go billing

Certain models in the Model Catalog can be deployed as serverless APIs with pay-as-you-go billing; this method of deployment is called Models-as-a Service (MaaS), providing a way to consume them as an API without hosting them on your subscription. Models available through MaaS are hosted in infrastructure managed by Microsoft, which enables API-based access to the model provider's model. API based access can dramatically reduce the cost of accessing a model and significantly simplify the provisioning experience. Most MaaS models come with token-based pricing.   

### How are third-party models made available in MaaS?

:::image type="content" source="../media/explore/model-publisher-cycle.png" alt-text="A diagram showing model publisher service cycle." lightbox="../media/explore/model-publisher-cycle.png":::

Models that are available for deployment as serverless APIs with pay-as-you-go billing are offered by the model provider but hosted in Microsoft-managed Azure infrastructure and accessed via API. Model providers define the license terms and set the price for use of their models, while Azure Machine Learning service manages the hosting infrastructure, makes the inference APIs available, and acts as the data processor for prompts submitted and content output by models deployed via MaaS. Learn more about data processing for MaaS at the [data privacy](concept-data-privacy.md) article. 

### Pay for model usage in MaaS    

The discovery, subscription, and consumption experience for models deployed via MaaS is in the Azure AI Studio and Azure Machine Learning studio. Users accept license terms for use of the models, and pricing information for consumption is provided during deployment. Models from third party providers are billed through Azure Marketplace, in accordance with the [Commercial Marketplace Terms of Use](/legal/marketplace/marketplace-terms); models from Microsoft are billed using Azure meters as First Party Consumption Services. As described in the [Product Terms](https://www.microsoft.com/licensing/terms/welcome/welcomepage), First Party Consumption Services are purchased using Azure meters but aren't subject to Azure service terms; use of these models is subject to the license terms provided.  

### Deploy models for inference through MaaS 

Deploying a model through MaaS allows users to get access to ready to use inference APIs without the need to configure infrastructure or provision GPUs, saving engineering time and resources. These APIs can be integrated with several LLM tools and usage is billed as described in the previous section. 

### Fine-tune models through MaaS with Pay-as-you-go 

For models that are available through MaaS and support fine-tuning, users can take advantage of hosted fine-tuning with pay-as-you-go billing to tailor the models using data they provide. For more information, see the [fine-tuning overview](../concepts/fine-tuning-overview.md).

### RAG with models deployed as serverless APIs 

Azure AI Studio enables users to make use of Vector Indexes and Retrieval Augmented Generation. Models that can be deployed via serverless API can be used to generate embeddings and inferencing based on custom data to generate answers specific to their use case. For more information, see  [How to create a vector index](index-add.md). 

### Regional availability of offers and models 

Pay-as-you-go billing is available only to users whose Azure subscription belongs to a billing account in a country where the model provider has made the offer available (see "offer availability region" in the table in the next section). If the offer is available in the relevant region, the user then must have a Hub/Project in the Azure region where the model is available for deployment or fine-tuning, as applicable (see "hub/project region" columns in the table below). 

Model | Offer availability region  | Hub/Project Region for Deployment | Hub/Project Region for Fine-tuning
--|--|--|--
Llama-3-70B-Instruct <br> Llama-3-8B-Instruct | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions) | East US 2, Sweden Central | Not available
Llama-2-7b <br> Llama-2-13b <br> Llama-2-70b | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions) | East US 2, West US 3 | West US 3
Llama-2-7b-chat <br> Llama-2-13b-chat <br> Llama-2-70b-chat | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions) | East US 2, West US 3 | Not available
Mistral-Large <br> Mistral Small | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions) | East US 2, Sweden Central | Not available
Cohere-command-r-plus <br> Cohere-command-r <br> Cohere-embed-v3-english <br> Cohere-embed-v3-multilingual | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions) <br> Japan | East US 2, Sweden Central | Not available


### Content safety for models deployed via Serverless API

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

Azure AI Studio implements a default configuration of [Azure AI Content Safety](../../ai-services/content-safety/overview.md) text moderation filters for harmful content (hate, self-harm, sexual, and violence) in language models deployed with MaaS. To learn more about content filtering (preview), see [harm categories in Azure AI Content Safety](../../ai-services/content-safety/concepts/harm-categories.md). Content filtering (preview) occurs synchronously as the service processes prompts to generate content, and you may be billed separately as per [AACS pricing](https://azure.microsoft.com/pricing/details/cognitive-services/content-safety/) for such use. You can disable content filtering for individual serverless endpoints when you first deploy a language model or in the deployment details page by clicking the content filtering toggle. You may be at higher risk of exposing users to harmful content if you turn off content filters. 



## Next steps

- [Explore Azure AI foundation models in Azure AI Studio](models-foundation-azure-ai.md)
