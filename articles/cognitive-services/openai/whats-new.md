---
title: What's new in Azure OpenAI Service?
titleSuffix: Azure Cognitive Services
description: Learn about the latest news and features updates for Azure OpenAI
manager: nitinme
author: mrbullwinkle
ms.author: mbullwin
ms.service: cognitive-services
ms.subservice: openai
ms.topic: overview
ms.date: 03/27/2023
recommendations: false
keywords:  
---

# What's new in Azure OpenAI Service

## March 2023

### Fine-tuned model change

Deployed customized models (fine-tuned models) that are inactive for greater than 90 days will now automatically have their deployments deleted. **The underlying fine-tuned model is retained and can be redeployed at any time**. Once a fine-tuned model is deployed, it will continue to incur an hourly hosting cost regardless of whether you're actively using the model. To learn more about planning and managing costs with Azure OpenAI, refer to our [cost management guide](/azure/cognitive-services/openai/how-to/manage-costs#base-series-and-codex-series-fine-tuned-models).

### New Features

- **GPT-4 series models are now available in preview on Azure OpenAI**. To request access, existing Azure OpenAI customers can [apply by filling out this form](https://aka.ms/oai/get-gpt4). These models are currently available in the East US and South Central US regions.

- **New Chat Completion API for ChatGPT and GPT-4 models released in preview on 3/21**. To learn more checkout the [updated quickstarts](./quickstart.md) and [how-to article](./how-to/chatgpt.md).

- **ChatGPT (gpt-35-turbo) preview**. To learn more checkout the [how-to article](./how-to/chatgpt.md).

- Increased training limits for fine-tuning: The max training job size (tokens in training file) x (# of epochs) is 2 Billion tokens for all models. We have also increased the max training job from 120 to 720 hours. 
- Adding additional use cases to your existing access.  Previously, the process for adding new use cases required customers to reapply to the service. Now, we're releasing a new process that allows you to quickly add new use cases to your use of the service. This process follows the established Limited Access process within Azure Cognitive Services. [Existing customers can attest to any and all new use cases here](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUM003VEJPRjRSOTZBRVZBV1E5N1lWMk1XUyQlQCN0PWcu). Please note that this is required anytime you would like to use the service for a new use case you did not originally apply for.

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

* **Process for requesting modifications to the abuse & miss-use data logging & human review.** Today, the service logs request/response data for the purposes of abuse and misuse detection to ensure that these powerful models aren't abused. However, many customers have strict data privacy and security requirements that require greater control over their data. To support these use cases, we're releasing a new process for customers to modify the content filtering policies or turn off the abuse logging for low-risk use cases. This process follows the established Limited Access process within Azure Cognitive Services and [existing OpenAI customers can apply here](https://aka.ms/oai/modifiedaccess).​

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

**Content filtering is temporarily off** by default. Azure content moderation works differently than OpenAI. Azure OpenAI runs content filters during the generation call to detect harmful or abusive content and filters them from the response. [Learn More​](./concepts/content-filter.md)

​These models will be re-enabled in Q1 2023 and be on by default. ​

​**Customer actions**​

* [Contact Azure Support](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) if you would like these turned on for your subscription​.
* [Apply for filtering modifications](https://aka.ms/oai/modifiedaccess), if you would like to have them remain off. (This option will be for low-risk use cases only.)​

## Next steps

Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).