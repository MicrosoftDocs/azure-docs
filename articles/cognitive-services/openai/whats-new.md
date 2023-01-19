---
title: What's new in Azure OpenAI?
titleSuffix: Azure Cognitive Services
description: Learn about the latest news and features updates for Azure OpenAI
manager: nitinme
author: mrbullwinkle
ms.author: mbullwin
ms.service: cognitive-services
ms.subservice: openai
ms.topic: overview
ms.date: 12/14/2022
recommendations: false
keywords:  
---

# What's new in Azure OpenAI

## December 2022 - Azure OpenAI General Availability (GA)

### New features

* **The latest models from OpenAI.** Azure OpenAI provides access to all the latest models including the GPT-3.5 series​.

* **New API version (2022-12-01).** This update includes several requested enhancements including token usage information in the API response, improved error messages for files, alignment with OpenAI on fine-tuning creation data structure, and support for the suffix parameter to allow custom naming of fine-tuned jobs.  ​

* **Higher request per second limits.** 50 for non-Davinci models. 20 for Davinci models.​

* **Faster fine-tune deployments.** Deploy an Ada and Curie fine-tuned models in under 10 minutes.​

* **Higher training limits:** 40M training tokens for Ada, Babbage, and Curie. 10M for Davinci.​

* **Process for requesting modifications to the abuse & miss-use data logging & human review.** Today, the service logs request/response data for the purposes of abuse and misuse detection to ensure that these powerful models aren't abused. However, many customers have strict data privacy and security requirements that require greater control over their data. To support these use cases, we're releasing a new process for customers to modify the content filtering policies or turn off the abuse logging for low-risk use cases. This process follows the established Limited Access process within Azure Cognitive Services and [existing OpenAI customers can apply here](https://aka.ms/oai/modifiedaccess).​

* **Customer managed key (CMK) encryption.** CMK provides customers greater control over managing their data in the Azure OpenAI Service by providing their own encryption keys used for storing training data and customized models. Customer-managed keys (CMK), also known as bring your own key (BYOK), offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data. [Learn more from our encryption at rest documentation](encrypt-data-at-rest.md).

* **Lockbox support**​

* **SOC-2 compliance**​

* **Logging and diagnostics** through Azure Resource Health, Cost Analysis, and Metrics & Diagnostic settings​.

* **Studio improvements.** Numerous usability improvements to the Studio workflow including Azure AD role support to control who in the team has access to create fine-tuned models and deploy.

### Changes (breaking)

**Fine-tuning** create API request has been updated to match OpenAI’s schema.

**Preview API versions:**

```json
{​
"training_file": "file-XGinujblHPwGLSztz8cPS8XY" ,​
"hyperparams": { ​
              "batch_size": 4,​
              "learning_rate_multiplier": 0.1,​
              "n_epochs": 4,​
              "prompt_loss_weight": 0.1, ​
              }​
}
```

**GA API 2022-12-01:**

```json
{​
"training_file": "file-XGinujblHPwGLSztz8cPS8XY" ,​
"batch_size": 4,​
“learning_rate_multiplier": 0.1,​
"n_epochs": 4,​
"prompt_loss_weight": 0.1, ​
}
```

**Content filtering is temporarily off** by default. Azure content moderation works differently than OpenAI. Azure OpenAI runs content filters during the generation call to detect harmful or abusive content and filters them from the response. [Learn More​](./concepts/content-filter.md)

​These models will be re-enabled in Q1 2023 and be on by default. ​

​**Customer actions**​

* [Contact Azure Support](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) if you would like these turned on for your subscription​.
* [Apply for filtering modifications](https://aka.ms/oai/modifiedaccess), if you would like to have them remain off. (This option will be for low-risk use cases only.)​

## Next steps

Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).