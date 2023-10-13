---
title: Azure OpenAI Service model versions
titleSuffix: Azure OpenAI
description: Learn about model versions in Azure OpenAI. 
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 10/13/2023
ms.custom:
manager: nitinme
author: mrbullwinkle #ChrisHMSFT
ms.author: mbullwin #chrhoder
recommendations: false
keywords: 
---

# Azure OpenAI Service model versions

Azure OpenAI Service is committed to providing the best generative AI models for customers. As part of this commitment, Azure OpenAI Service regularly releases new model versions to incorporate the latest features and improvements from OpenAI.

In particular, the GPT-3.5 Turbo and GPT-4 models see regular updates with new features.  For example, versions 0613 of GPT-3.5 Turbo and GPT-4 introduced function calling.  Function calling is a popular feature that allows the model to create structured outputs that can be used to call external tools.  We'll continue to see increasing capabilities with these models in the future.

## How model versions work

We want to make it easy for customers to stay up to date as models improve.  Customers can choose to start with a particular version and to automatically update as new versions are released.

When a customer deploys GPT-3.5-Turbo and GPT-4 on Azure OpenAI Service, the standard behavior is to deploy the current default version – for example, GPT-4 version 0314.  When the default version changes to say GPT-4 version 0613, the deployment is automatically updated to version 0613 so that customer deployments feature the latest capabilities of the model.

Customers can also deploy a specific version like GPT-4 0314 or GPT-4 0613 and choose an update policy, which can include the following options:

* Deployments set to **Auto-update to default** will be automatically updated to use the new default version. 
* Deployments set to **Upgrade when expired** will be automatically updated when its current version is retired. 
* Deployments that are set to **No Auto Upgrade** will stop working when the model is retired.

## How Azure updates OpenAI models

Azure works closely with OpenAI to release new model versions.  When a new version of a model is released, a customer can immediately test it in new deployments.  Azure publishes when new versions of models are released, and notifies customers at least two weeks before a new version becomes the default version of the model.   Azure also maintains the previous major version of the model until its retirement date, so customers can switch back to it if desired.

## What you need to nnow about Azure OpenAI model version upgrades

As a customer of Azure OpenAI models, you might notice some changes in the model behavior and compatibility after a version upgrade.  These changes might affect your applications and workflows that rely on the models.  Here are some tips to help you prepare for version upgrades and minimize the impact:

* Read [what’s new](../whats-new.md) and [models](../concepts/models.md) to understand the changes and new features.
* Read the documentation on [model deployments](../how-to/create-resource.md) and [version upgrades](../concepts/model-versions.md) to understand how to work with model versions.
* Test your applications and workflows with the new model version after release.
* Update your code and configuration to use the new features and capabilities of the new model version.

## Next Steps

- [Learn more about working with Azure OpenAI models](../how-to/working-with-models.md)
- [Learn more about Azure OpenAI model regional availability](../concepts/models.md)
- [Learn more about Azure OpenAI](../overview.md)
