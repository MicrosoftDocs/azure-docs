---
title: What's new in Azure OpenAI Service?
titleSuffix: Azure AI services
description: Learn about the latest news and features updates for Azure OpenAI.
manager: nitinme
author: mrbullwinkle
ms.author: mbullwin
ms.service: azure-ai-openai
ms.custom:
  - ignite-2023
  - references_regions
ms.topic: whats-new
ms.date: 05/31/2024
recommendations: false
---

# What's new in Azure OpenAI Service

This article provides a summary of the latest releases and major documentation updates for Azure OpenAI.

## May 2024

### GPT-4o provisioned deployments

`gpt-4o` Version: `2024-05-13` is available for both standard and provisioned deployments. Provisioned and standard model deployments accept both text and image/vision inference requests.
For information on model regional availability consult the model matrix for [provisioned deployments](./concepts/models.md#provisioned-deployment-model-availability).

### Assistants v2 (preview)

A refresh of the Assistants API is now publicly available. It contains the following updates:

* [File search tool and vector storage](https://go.microsoft.com/fwlink/?linkid=2272425)
* [Max completion and max prompt token support](./concepts/assistants.md) for managing token usage.
* `tool_choice` [parameter](./assistants-reference-runs.md#run-object) for forcing the Assistant to use a specified tool. 
You can now create messages with the [assistant](.//assistants-reference-messages.md#create-message) role to create custom conversation histories in Threads.
* Support for `temperature`, `top_p`, `response_format` [parameters](./assistants-reference.md#create-an-assistant).
* Streaming and polling support. You can use the helper functions in our Python SDK to create runs and stream responses. We have also added polling SDK helpers to share object status updates without the need for polling. 
* Experiment with [Logic Apps and Function Calling using Azure OpenAI Studio](./how-to/assistants-logic-apps.md). Import your REST APIs implemented in Logic Apps as functions and the studio invokes the function (as a Logic Apps workflow) automatically based on the user prompt.
* AutoGen by Microsoft Research provides a multi-agent conversation framework to enable convenient building of Large Language Model (LLM) workflows across a wide range of applications. Azure OpenAI assistants are now integrated into AutoGen via `GPTAssistantAgent`, a new experimental agent that lets you seamlessly add Assistants into AutoGen-based multi-agent workflows. This enables multiple Azure OpenAI assistants that could be task or domain specialized to collaborate and tackle complex tasks.
* Support for fine-tuned `gpt-3.5-turbo-0125` [models](./concepts/models.md#assistants-preview) in the following regions:
    * East US 2
    * Sweden Central
* Expanded [regional support](./concepts/models.md#assistants-preview) for:
    * Japan East
    * UK South
    * West US
    * West US 3
    * Norway east

For more information, see the [blog post](https://techcommunity.microsoft.com/t5/ai-azure-ai-services-blog/announcing-azure-openai-service-assistants-preview-refresh/ba-p/4143217) about assistants.

### GPT-4o model general availability (GA)

GPT-4o ("o is for "omni") is the latest model from OpenAI launched on May 13, 2024.

- GPT-4o integrates text, and images in a single model, enabling it to handle multiple data types simultaneously. This multimodal approach enhances accuracy and responsiveness in human-computer interactions.
- GPT-4o matches GPT-4 Turbo in English text and coding tasks while offering superior performance in non-English languages and in vision tasks, setting new benchmarks for AI capabilities.

For information on model regional availability, see the [models page](./concepts/models.md).

### Global standard deployment type (preview)

Global deployments are available in the same Azure OpenAI resources as non-global offers but allow you to leverage Azure's global infrastructure to dynamically route traffic to the data center with best availability for each request. Global standard will provide the highest default quota for new models and eliminates the need to load balance across multiple resources.

For more information, see the [deployment types guide](https://aka.ms/aoai/docs/deployment-types).

### Fine-tuning updates

- GPT-4 fine-tuning is [now available in public preview](./concepts/models.md#fine-tuning-models).
- Added support for [seed](/azure/ai-services/openai/tutorials/fine-tune?tabs=python-new%2Ccommand-line#begin-fine-tuning), [events](/azure/ai-services/openai/tutorials/fine-tune?tabs=python-new%2Ccommand-line#list-fine-tuning-events), [full validation statistics](/azure/ai-services/openai/how-to/fine-tuning?tabs=turbo%2Cpython-new&pivots=programming-language-python#analyze-your-customized-model), and [checkpoints](/azure/ai-services/openai/tutorials/fine-tune?tabs=python-new%2Ccommand-line#list-checkpoints) as part of the `2024-05-01-preview` API release.

### DALL-E and GPT-4 Turbo Vision GA configurable content filters

Create custom content filters for your DALL-E 2 and 3 and GPT-4 Turbo with Vision GA (gpt-4-turbo-2024-04-09) deployments. [Content filtering](/azure/ai-services/openai/concepts/content-filter?tabs=warning%2Cpython-new#configurability-preview)

### Asynchronous Filter available for all Azure OpenAI customers

Running filters asynchronously for improved latency in streaming scenarios is now available for all Azure OpenAI customers. [Content filtering](/azure/ai-services/openai/concepts/content-filter?tabs=warning%2Cpython-new#content-streaming)

### Prompt Shields

Prompt Shields protect applications powered by Azure OpenAI models from two types of attacks: direct (jailbreak) and indirect attacks. Indirect Attacks (also known as Indirect Prompt Attacks or Cross-Domain Prompt Injection Attacks) are a type of attack on systems powered by Generative AI models that may occur when an application processes information that wasn’t directly authored by either the developer of the application or the user. [Content filtering](/azure/ai-services/openai/concepts/content-filter?tabs=warning%2Cpython-new#prompt-shields)

### 2024-05-01-preview API release

- For more information, see the [API version lifecycle](./api-version-deprecation.md).

### GPT-4 Turbo model general availability (GA)

[!INCLUDE [GPT-4 Turbo](./includes/gpt-4-turbo.md)]

## April 2024

### Fine-tuning is now supported in two new regions East US 2 and Switzerland West

Fine-tuning is now available with support for:

### East US 2

- `gpt-35-turbo` (0613)
- `gpt-35-turbo` (1106)
- `gpt-35-turbo` (0125)

### Switzerland West

- `babbage-002`
- `davinci-002`
- `gpt-35-turbo` (0613)
- `gpt-35-turbo` (1106)
- `gpt-35-turbo` (0125)

Check the [models page](concepts/models.md#fine-tuning-models), for the latest information on model availability and fine-tuning support in each region.  

### Multi-turn chat training examples

Fine-tuning now supports [multi-turn chat training examples](./how-to/fine-tuning.md#multi-turn-chat-file-format).

### GPT-4 (0125) is available for Azure OpenAI On Your Data

You can now use the GPT-4 (0125) model in [available regions](./concepts/models.md#public-cloud-regions) with Azure OpenAI On Your Data.

## March 2024

### Risks & Safety monitoring in Azure OpenAI Studio

Azure OpenAI Studio now provides a Risks & Safety dashboard for each of your deployments that uses a content filter configuration. Use it to check the results of the filtering activity. Then you can adjust your filter configuration to better serve your business needs and meet Responsible AI principles.

[Use Risks & Safety monitoring](./how-to/risks-safety-monitor.md)

### Azure OpenAI On Your Data updates

- You can now connect to an Elasticsearch vector database to be used with [Azure OpenAI On Your Data](./concepts/use-your-data.md?tabs=elasticsearch#supported-data-sources).
- You can use the [chunk size parameter](./concepts/use-your-data.md#chunk-size-preview) during data ingestion to set the maximum number of tokens of any given chunk of data in your index.

### 2024-02-01 general availability (GA) API released

This is the latest GA API release and is the replacement for the previous `2023-05-15` GA release. This release adds support for the latest Azure OpenAI GA features like Whisper, DALLE-3, fine-tuning, on your data, etc.

Features that are still in preview such as Assistants, text to speech (TTS), certain on your data datasources, still require a preview API version. For more information check out our [API version lifecycle guide](./api-version-deprecation.md).

### Whisper general availability (GA)

The Whisper speech to text model is now GA for both REST and Python. Client library SDKs are currently still in public preview.

Try out Whisper by following a [quickstart](./whisper-quickstart.md).

### DALL-E 3 general availability (GA)

DALL-E 3 image generation model is now GA for both REST and Python. Client library SDKs are currently still in public preview.

Try out DALL-E 3 by following a [quickstart](./dall-e-quickstart.md).

### New regional support for DALL-E 3

You can now access DALL-E 3 with an Azure OpenAI resource in the `East US` or `AustraliaEast` Azure region, in addition to `SwedenCentral`.

### Model deprecations and retirements

We have added a page to track [model deprecations and retirements](./concepts/model-retirements.md) in Azure OpenAI Service. This page provides information about the models that are currently available, deprecated, and retired.

### 2024-03-01-preview API released

`2024-03-01-preview` has all the same functionality as `2024-02-15-preview` and adds two new parameters for embeddings:

- `encoding_format` allows you to specify the format to generate embeddings in `float`, or `base64`. The default is `float`.
- `dimensions` allows you set the number of output embeddings. This parameter is only supported with the new third generation embeddings models: `text-embedding-3-large`, `text-embedding-3-small`. Typically larger embeddings are more expensive from a compute, memory, and storage perspective. Being able to adjust the number of dimensions allows more control over overall cost and performance. The `dimensions` parameter is not supported in all versions of the OpenAI 1.x Python library, to take advantage of this parameter  we recommend upgrading to the latest version: `pip install openai --upgrade`.

If you are currently using a preview API version to take advantage of the latest features, we recommend consulting the [API version lifecycle](./api-version-deprecation.md) article to track how long your current API version will be supported.

### Update to GPT-4-1106-Preview upgrade plans

The deployment upgrade of `gpt-4` 1106-Preview to `gpt-4` 0125-Preview scheduled for March 8, 2024 is no longer taking place. Deployments of `gpt-4` versions 1106-Preview and 0125-Preview set to "Auto-update to default" and "Upgrade when expired" will start to be upgraded after a stable version of the model is released.  

For more information on the upgrade process refer to the [models page](./concepts/models.md).

## February 2024

### GPT-3.5-turbo-0125 model available

This model has various improvements, including higher accuracy at responding in requested formats and a fix for a bug which caused a text encoding issue for non-English language function calls.

For information on model regional availability and upgrades refer to the [models page](./concepts/models.md).

### Third generation embeddings models available

- `text-embedding-3-large`
- `text-embedding-3-small`

In testing, OpenAI reports both the large and small third generation embeddings models offer better average multi-language retrieval performance with the [MIRACL](https://github.com/project-miracl/miracl) benchmark while still maintaining better performance for English tasks with the [MTEB](https://github.com/embeddings-benchmark/mteb) benchmark than the second generation text-embedding-ada-002 model.

For information on model regional availability and upgrades refer to the [models page](./concepts/models.md).

### GPT-3.5 Turbo quota consolidation

To simplify migration between different versions of the GPT-3.5-Turbo models (including 16k), we will be consolidating all GPT-3.5-Turbo quota into a single quota value.

- Any customers who have increased quota approved will have combined total quota that reflects the previous increases.

- Any customer whose current total usage across model versions is less than the default will get a new combined total quota by default.

### GPT-4-0125-preview model available

The `gpt-4` model version `0125-preview` is now available on Azure OpenAI Service in the East US, North Central US, and South Central US regions.  Customers with deployments of `gpt-4` version `1106-preview` will be automatically upgraded to `0125-preview` in the coming weeks.  

For information on model regional availability and upgrades refer to the [models page](./concepts/models.md).

### Assistants API public preview

Azure OpenAI now supports the API that powers OpenAI's GPTs. Azure OpenAI Assistants (Preview) allows you to create AI assistants tailored to your needs through custom instructions and advanced tools like code interpreter, and custom functions. To learn more, see:

- [Quickstart](./assistants-quickstart.md)
- [Concepts](./concepts/assistants.md)
- [In-depth Python how-to](./how-to/assistant.md)
- [Code Interpreter](./how-to/code-interpreter.md)
- [Function calling](./how-to/assistant-functions.md)
- [Assistants model & region availability](./concepts/models.md#assistants-preview)
- [Assistants Python & REST reference](./assistants-reference.md)
- [Assistants Samples](https://github.com/Azure-Samples/azureai-samples/tree/main/scenarios/Assistants)

### OpenAI text to speech voices public preview

Azure OpenAI Service now supports text to speech APIs with OpenAI's voices. Get AI-generated speech from the text you provide. To learn more, see the [overview guide](../speech-service/openai-voices.md) and try the [quickstart](./text-to-speech-quickstart.md).

> [!NOTE]
> Azure AI Speech also supports OpenAI text to speech voices. To learn more, see [OpenAI text to speech voices via Azure OpenAI Service or via Azure AI Speech](../speech-service/openai-voices.md#openai-text-to-speech-voices-via-azure-openai-service-or-via-azure-ai-speech) guide.

### New Fine-tuning capabilities and model support

- [Continuous fine-tuning](https://aka.ms/oai/fine-tuning-continuous)
- [Fine-tuning & function calling](./how-to/fine-tuning-functions.md)
- [`gpt-35-turbo 1106` support](./concepts/models.md#fine-tuning-models)

### New regional support for Azure OpenAI On Your Data

You can now use Azure OpenAI On Your Data in the following Azure region:
* South Africa North

### Azure OpenAI On Your Data general availability

- [Azure OpenAI On Your Data](./concepts/use-your-data.md) is now generally available.

## December 2023

### Azure OpenAI On Your Data

- Full VPN and private endpoint support for Azure OpenAI On Your Data, including security support for: storage accounts, Azure OpenAI resources, and Azure AI Search service resources.   
- New article for using [Azure OpenAI On Your Data securely](./how-to/use-your-data-securely.md) by protecting data with virtual networks and private endpoints.

### GPT-4 Turbo with Vision now available

GPT-4 Turbo with Vision on Azure OpenAI service is now in public preview. GPT-4 Turbo with Vision is a large multimodal model (LMM) developed by OpenAI that can analyze images and provide textual responses to questions about them. It incorporates both natural language processing and visual understanding. With enhanced mode, you can use the [Azure AI Vision](/azure/ai-services/computer-vision/overview) features to generate additional insights from the images.

- Explore the capabilities of GPT-4 Turbo with Vision in a no-code experience using the [Azure OpenAI Playground](https://oai.azure.com/). Learn more in the [Quickstart guide](./gpt-v-quickstart.md).
- Vision enhancement using GPT-4 Turbo with Vision is now available in the [Azure OpenAI Playground](https://oai.azure.com/) and includes support for Optical Character Recognition, object grounding, image support for "add your data," and support for video prompt.
- Make calls to the chat API directly using the [REST API](https://aka.ms/gpt-v-api-ref).
- Region availability is currently limited to `SwitzerlandNorth`, `SwedenCentral`, `WestUS`, and `AustraliaEast`  
- Learn more about the known limitations of GPT-4 Turbo with Vision and other [frequently asked questions](/azure/ai-services/openai/faq#gpt-4-with-vision).

## November 2023

### New data source support in Azure OpenAI On Your Data

- You can now use [Azure Cosmos DB for MongoDB vCore](./concepts/use-your-data.md#supported-data-sources) as well as URLs/web addresses as data sources to ingest your data and chat with a supported Azure OpenAI model.

### GPT-4 Turbo Preview & GPT-3.5-Turbo-1106 released

Both models are the latest release from OpenAI with improved instruction following, [JSON mode](./how-to/json-mode.md), [reproducible output](./how-to/reproducible-output.md), and parallel function calling.

- **GPT-4 Turbo Preview** has a max context window of 128,000 tokens and can generate 4,096 output tokens. It has the latest training data with knowledge up to April 2023. This model is in preview and is not recommended for production use. All deployments of this preview model will be automatically updated in place once the stable release becomes available.

- **GPT-3.5-Turbo-1106** has a max context window of 16,385 tokens and can generate 4,096 output tokens.

For information on model regional availability consult the [models page](./concepts/models.md).

The models have their own unique per region [quota allocations](./quotas-limits.md).

### DALL-E 3 public preview

DALL-E 3 is the latest image generation model from OpenAI. It features enhanced image quality, more complex scenes, and improved performance when rendering text in images. It also comes with more aspect ratio options. DALL-E 3 is available through OpenAI Studio and through the REST API. Your OpenAI resource must be in the `SwedenCentral` Azure region.

DALL-E 3 includes built-in prompt rewriting to enhance images, reduce bias, and increase natural variation.

Try out DALL-E 3 by following a [quickstart](./dall-e-quickstart.md).

### Responsible AI

- **Expanded customer configurability**: All Azure OpenAI customers can now configure all severity levels (low, medium, high) for the categories hate, violence, sexual and self-harm, including filtering only high severity content. [Configure content filters](./how-to/content-filters.md)

- **Content Credentials in all DALL-E models**: AI-generated images from all DALL-E models now include a digital credential that discloses the content as AI-generated. Applications that display image assets can leverage the open source [Content Authenticity Initiative SDK](https://opensource.contentauthenticity.org/docs/js-sdk/getting-started/quick-start/) to display credentials in their AI generated images. [Content Credentials in Azure OpenAI](/azure/ai-services/openai/concepts/content-credentials)

- **New RAI models**
    
    - **Jailbreak risk detection**: Jailbreak attacks are user prompts designed to provoke the Generative AI model into exhibiting behaviors it was trained to avoid or to break the rules set in the System Message. The jailbreak risk detection model is optional (default off), and available in annotate and filter model. It runs on user prompts.
    - **Protected material text**: Protected material text describes known text content (for example, song lyrics, articles, recipes, and selected web content) that can be outputted by large language models. The protected material text model is optional (default off), and available in annotate and filter model. It runs on LLM completions.
    - **Protected material code**: Protected material code describes source code that matches a set of source code from public repositories, which can be outputted by large language models without proper citation of source repositories. The protected material code model is optional (default off), and available in annotate and filter model. It runs on LLM completions.

    [Configure content filters](./how-to/content-filters.md)

- **Blocklists**: Customers can now quickly customize content filter behavior for prompts and completions further by creating a custom blocklist in their filters. The custom blocklist allows the filter to take action on a customized list of patterns, such as specific terms or regex patterns. In addition to custom blocklists, we provide a Microsoft profanity blocklist (English). [Use blocklists](./how-to/use-blocklists.md)
## October 2023

### New fine-tuning models (preview)

- `gpt-35-turbo-0613` is [now available for fine-tuning](./how-to/fine-tuning.md).

- `babbage-002` and `davinci-002` are [now available for fine-tuning](./how-to/fine-tuning.md). These models replace the legacy ada, babbage, curie, and davinci base models that were previously available for fine-tuning.

- Fine-tuning availability is limited to certain regions. Check the [models page](concepts/models.md#fine-tuning-models), for the latest information on model availability in each region.

- Fine-tuned models have different [quota limits](quotas-limits.md) than regular models.

- [Tutorial: fine-tuning GPT-3.5-Turbo](./tutorials/fine-tune.md)

### Azure OpenAI On Your Data

- New [custom parameters](./concepts/use-your-data.md#runtime-parameters) for determining the number of retrieved documents and strictness.
    - The strictness setting sets the threshold to categorize documents as relevant to your queries.
    - The retrieved documents setting specifies the number of top-scoring documents from your data index used to generate responses.
- You can see data ingestion/upload status in the Azure OpenAI Studio.
- Support for private endpoints & VPNs for blob containers.

## September 2023

### GPT-4
GPT-4 and GPT-4-32k are now available to all Azure OpenAI Service customers. Customers no longer need to apply for the waitlist to use GPT-4 and GPT-4-32k (the Limited Access registration requirements continue to apply for all Azure OpenAI models). Availability might vary by region. Check the [models page](concepts/models.md), for the latest information on model availability in each region.

### GPT-3.5 Turbo Instruct

Azure OpenAI Service now supports the GPT-3.5 Turbo Instruct model. This model has performance comparable to `text-davinci-003` and is available to use with the Completions API. Check the [models page](concepts/models.md), for the latest information on model availability in each region.

### Whisper public preview

Azure OpenAI Service now supports speech to text APIs powered by OpenAI's Whisper model. Get AI-generated text based on the speech audio you provide. To learn more, check out the [quickstart](./whisper-quickstart.md).

> [!NOTE]
> Azure AI Speech also supports OpenAI's Whisper model via the batch transcription API. To learn more, check out the [Create a batch transcription](../speech-service/batch-transcription-create.md#use-a-whisper-model) guide. Check out [What is the Whisper model?](../speech-service/whisper-overview.md) to learn more about when to use Azure AI Speech vs. Azure OpenAI Service.

### New Regions

- Azure OpenAI is now also available in the Sweden Central, and Switzerland North regions. Check the [models page](concepts/models.md), for the latest information on model availability in each region.

### Regional quota limits increases

- Increases to the max default quota limits for certain models and regions. Migrating workloads to [these models and regions](./quotas-limits.md#regional-quota-limits) will allow you to take advantage of higher Tokens per minute (TPM).  

## August 2023

### Azure OpenAI on your own data (preview) updates

- You can now deploy Azure OpenAI On Your Data to [Power Virtual Agents](/azure/ai-services/openai/concepts/use-your-data#deploying-the-model).
- Azure OpenAI On Your Data now supports private endpoints.
- Ability to [filter access to sensitive documents](./concepts/use-your-data.md#document-level-access-control).
- [Automatically refresh your index on a schedule](./concepts/use-your-data.md#schedule-automatic-index-refreshes).
- [Vector search and semantic search options](./concepts/use-your-data.md#search-types). 
- [View your chat history in the deployed web app](./how-to/use-web-app.md#chat-history)

## July 2023

### Support for function calling

- [Azure OpenAI now supports function calling](./how-to/function-calling.md) to enable you to work with functions in the chat completions API.

### Embedding input array increase

- Azure OpenAI now [supports arrays with up to 16 inputs](./how-to/switching-endpoints.yml#azure-openai-embeddings-multiple-input-support) per API request with text-embedding-ada-002 Version 2.

### New Regions

- Azure OpenAI is now also available in the Canada East, East US 2, Japan East, and North Central US regions. Check the [models page](concepts/models.md), for the latest information on model availability in each region.  

## June 2023

### Use Azure OpenAI on your own data (preview)

- [Azure OpenAI On Your Data](./concepts/use-your-data.md) is now available in preview, enabling you to chat with OpenAI models such as GPT-35-Turbo and GPT-4 and receive responses based on your data. 

### New versions of gpt-35-turbo and gpt-4 models

- gpt-35-turbo (version 0613)
- gpt-35-turbo-16k (version 0613)
- gpt-4 (version 0613)
- gpt-4-32k (version 0613)

### UK South

- Azure OpenAI is now available in the UK South region. Check the [models page](concepts/models.md), for the latest information on model availability in each region.  

### Content filtering & annotations (Preview)

- How to [configure content filters](how-to/content-filters.md) with Azure OpenAI Service.
- [Enable annotations](concepts/content-filter.md) to view content filtering category and severity information as part of your GPT based Completion and Chat Completion calls.

### Quota

- Quota provides the flexibility to actively [manage the allocation of rate limits across the deployments](how-to/quota.md) within your subscription.

## May 2023

### Java & JavaScript SDK support

- NEW Azure OpenAI preview SDKs offering support for [JavaScript](quickstart.md?tabs=command-line&pivots=programming-language-javascript) and [Java](quickstart.md?tabs=command-line&pivots=programming-language-java).

### Azure OpenAI Chat Completion General Availability (GA)

- General availability support for:
  - Chat Completion API version `2023-05-15`.
  - GPT-35-Turbo models.
  - GPT-4 model series. 
  
If you are currently using the `2023-03-15-preview` API, we recommend migrating to the GA `2023-05-15` API. If you are currently using API version `2022-12-01` this API remains GA, but does not include the latest Chat Completion capabilities.

> [!IMPORTANT]
> Using the current versions of the GPT-35-Turbo models with the completion endpoint remains in preview.
  
### France Central

- Azure OpenAI is now available in the France Central region. Check the [models page](concepts/models.md), for the latest information on model availability in each region.  

## April 2023

- **DALL-E 2 public preview**. Azure OpenAI Service now supports image generation APIs powered by OpenAI's DALL-E 2 model. Get AI-generated images based on the descriptive text you provide. To learn more, check out the [quickstart](./dall-e-quickstart.md). To request access, existing Azure OpenAI customers can [apply by filling out this form](https://aka.ms/oai/access).

- **Inactive deployments of customized models will now be deleted after 15 days; models will remain available for redeployment.** If a customized (fine-tuned) model is deployed for more than fifteen (15) days during which no completions or chat completions calls are made to it, the deployment will automatically be deleted (and no further hosting charges will be incurred for that deployment). The underlying customized model will remain available and can be redeployed at any time. To learn more check out the [how-to-article](/azure/ai-services/openai/how-to/fine-tuning?tabs=turbo%2Cpython-new&pivots=programming-language-studio#deploy-a-custom-model).


## March 2023

- **GPT-4 series models are now available in preview on Azure OpenAI**. To request access, existing Azure OpenAI customers can [apply by filling out this form](https://aka.ms/oai/get-gpt4). These models are currently available in the East US and South Central US regions.

- **New Chat Completion API for GPT-35-Turbo and GPT-4 models released in preview on 3/21**. To learn more checkout the [updated quickstarts](./quickstart.md) and [how-to article](./how-to/chatgpt.md).

- **GPT-35-Turbo preview**. To learn more checkout the [how-to article](./how-to/chatgpt.md).

- Increased training limits for fine-tuning: The max training job size (tokens in training file) x (# of epochs) is 2 Billion tokens for all models. We have also increased the max training job from 120 to 720 hours. 
- Adding additional use cases to your existing access.  Previously, the process for adding new use cases required customers to reapply to the service. Now, we're releasing a new process that allows you to quickly add new use cases to your use of the service. This process follows the established Limited Access process within Azure AI services. [Existing customers can attest to any and all new use cases here](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUM003VEJPRjRSOTZBRVZBV1E5N1lWMk1XUyQlQCN0PWcu). Please note that this is required anytime you would like to use the service for a new use case you did not originally apply for.

## February 2023

### New Features

- .NET SDK(inference) [preview release](https://www.nuget.org/packages/Azure.AI.OpenAI/1.0.0-beta.3) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/openai/Azure.AI.OpenAI/tests/Samples)
- [Terraform SDK update](https://registry.terraform.io/providers/hashicorp/azurerm/3.37.0/docs/resources/cognitive_deployment) to support Azure OpenAI management operations.
- Inserting text at the end of a completion is now supported with the `suffix` parameter.

### Updates

- Content filtering is on by default.

New articles on:

- [Monitoring an Azure OpenAI Service](./how-to/monitoring.md)
- [Plan and manage costs for Azure OpenAI](./how-to/manage-costs.md)

New training course:

- [Intro to Azure OpenAI](/training/modules/explore-azure-openai/)


## January 2023

### New Features

* **Service GA**. Azure OpenAI Service is now generally available.​

* **New models**: Addition of the latest text model, text-davinci-003 (East US, West Europe), text-ada-embeddings-002 (East US, South Central US, West Europe)


## December 2022

### New features

* **The latest models from OpenAI.** Azure OpenAI provides access to all the latest models including the GPT-3.5 series​.

* **New API version (2022-12-01).** This update includes several requested enhancements including token usage information in the API response, improved error messages for files, alignment with OpenAI on fine-tuning creation data structure, and support for the suffix parameter to allow custom naming of fine-tuned jobs.  ​

* **Higher request per second limits.** 50 for non-Davinci models. 20 for Davinci models.​

* **Faster fine-tune deployments.** Deploy an Ada and Curie fine-tuned models in under 10 minutes.​

* **Higher training limits:** 40M training tokens for Ada, Babbage, and Curie. 10M for Davinci.​

* **Process for requesting modifications to the abuse & miss-use data logging & human review.** Today, the service logs request/response data for the purposes of abuse and misuse detection to ensure that these powerful models aren't abused. However, many customers have strict data privacy and security requirements that require greater control over their data. To support these use cases, we're releasing a new process for customers to modify the content filtering policies or turn off the abuse logging for low-risk use cases. This process follows the established Limited Access process within Azure AI services and [existing OpenAI customers can apply here](https://aka.ms/oai/modifiedaccess).​

* **Customer managed key (CMK) encryption.** CMK provides customers greater control over managing their data in Azure OpenAI by providing their own encryption keys used for storing training data and customized models. Customer-managed keys (CMK), also known as bring your own key (BYOK), offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data. [Learn more from our encryption at rest documentation](encrypt-data-at-rest.md).

* **Lockbox support**​

* **SOC-2 compliance**​

* **Logging and diagnostics** through Azure Resource Health, Cost Analysis, and Metrics & Diagnostic settings​.

* **Studio improvements.** Numerous usability improvements to the Studio workflow including Azure AD role support to control who in the team has access to create fine-tuned models and deploy.

### Changes (breaking)

**Fine-tuning** create API request has been updated to match OpenAI’s schema.

**Preview API versions:**

```json
{​
    "training_file": "file-XGinujblHPwGLSztz8cPS8XY",​
    "hyperparams": { ​
        "batch_size": 4,​
        "learning_rate_multiplier": 0.1,​
        "n_epochs": 4,​
        "prompt_loss_weight": 0.1,​
    }​
}
```

**API version 2022-12-01:**

```json
{​
    "training_file": "file-XGinujblHPwGLSztz8cPS8XY",​
    "batch_size": 4,​
    "learning_rate_multiplier": 0.1,​
    "n_epochs": 4,​
    "prompt_loss_weight": 0.1,​
}
```

**Content filtering is temporarily off** by default. Azure content moderation works differently than Azure OpenAI. Azure OpenAI runs content filters during the generation call to detect harmful or abusive content and filters them from the response. [Learn More​](./concepts/content-filter.md)

​These models will be re-enabled in Q1 2023 and be on by default. ​

​**Customer actions**​

* [Contact Azure Support](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) if you would like these turned on for your subscription​.
* [Apply for filtering modifications](https://aka.ms/oai/modifiedaccess), if you would like to have them remain off. (This option will be for low-risk use cases only.)​

## Next steps

Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).
