---
title: Transparency Note for auto-generate prompt variants in prompt flow
titleSuffix: Azure Machine Learning
description: Learn about the feature in prompt flow that automatically generates variations of a base prompt with the help of language models.
author: prakharg-msft
ms.author: prakharg
manager: omkarm
ms.service: machine-learning
ms.subservice: prompt-flow
ms.date: 10/20/2023
ms.topic: article
---

# Transparency Note for auto-generate prompt variants in prompt flow

## What is a Transparency Note?

An AI system includes not only technology but also the people who use it, the people it affects, and the environment in which it's deployed. Creating a system that's fit for its intended purpose requires an understanding of how the technology works, what its capabilities and limitations are, and how to achieve the best performance.

Microsoft Transparency Notes help you understand:

- How our AI technology works.
- The choices that system owners can make that influence system performance and behavior.
- The importance of thinking about the whole system, including the technology, the people, and the environment.

You can use Transparency Notes when you're developing or deploying your own system. Or you can share them with the people who use (or are affected by) your system.

Transparency Notes are part of a broader effort at Microsoft to put AI principles into practice. To find out more, see the [Microsoft AI principles](https://www.microsoft.com/ai/responsible-ai).

> [!IMPORTANT]
> Auto-generate prompt variants is currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
## The basics of auto-generate prompt variants in prompt flow

Prompt engineering is at the center of building applications by using language models. Microsoft's prompt flow offers rich capabilities to interactively edit, bulk test, and evaluate prompts with built-in flows to choose the best prompt.

The auto-generate prompt variants feature in prompt flow can automatically generate variations of your base prompt with the help of language models. You can test those variations in prompt flow to reach the optimal solution for your model and use case.

This Transparency Note uses the following key terms:

| **Term** | **Definition** |
| --- | --- |
| Prompt flow | A development tool that streamlines the development cycle of AI applications that use language models. For more information, see [What is Azure Machine Learning prompt flow](./overview-what-is-prompt-flow.md). |
| Prompt engineering | The practice of crafting and refining input prompts to elicit more desirable responses from a language model. |
| Prompt variants | Different versions or modifications of an input prompt that are designed to test or achieve varied responses from a language model. |
| Base prompt | The initial or primary prompt that serves as a starting point for eliciting responses from language models. In this case, you provide the base prompt and modify it to create prompt variants. |
| System prompt | A predefined prompt that a system generates, typically to start a task or seek specific information. A system prompt isn't visible but is used internally to generate prompt variants. |

## Capabilities

### System behavior

You use the auto-generate prompt variants feature to automatically generate and then assess prompt variations, so you can quickly find the best prompt for your use case. This feature enhances the capabilities in prompt flow to interactively edit and evaluate prompts, with the goal of simplifying prompt engineering.

When you provide a base prompt, the auto-generate prompt variants feature generates several variations by using the generative power of Azure OpenAI Service models and an internal system prompt. Although Azure OpenAI Service provides content management filters, we recommend that you verify any generated prompts before you use them in production scenarios.

### Use cases

The intended use of auto-generate prompt variants is to *generate new prompts from a provided base prompt with the help of language models*. Don't use auto-generate prompt variants for decisions that might have serious adverse impacts.

Auto-generate prompt variants wasn't designed or tested to recommend items that require more considerations related to accuracy, governance, policy, legal, or expert knowledge. These considerations often exist outside the scope of the usage patterns that regular (non-expert) users carry out. Examples of such use cases include medical diagnostics, banking, or financial recommendations, hiring or job placement recommendations, or recommendations related to housing.

## Limitations

In the generation of prompt variants, it's important to understand that although AI systems are valuable tools, they're *nondeterministic*. That is, perfect *accuracy* (the measure of how well the system-generated events correspond to real events that happen in a space) of predictions is not possible. A good model has high accuracy, but it occasionally makes incorrect predictions. Failure to understand this limitation can lead to overreliance on the system and unmerited decisions that can affect stakeholders.  

The prompt variants that the feature generates by using language models appear to you as is. We encourage you to evaluate and compare these variants to determine the best prompt for a scenario.

Many of the evaluations offered in the prompt flow ecosystems also depend on language models. This dependency can potentially decrease the utility of any prompt. We strongly recommend a manual review.

### Technical limitations, operational factors, and ranges

The auto-generate prompt variants feature doesn't provide a measurement or evaluation of the prompt variants that it provides. We strongly recommend that you evaluate the suggested prompts in the way that best aligns with your specific use case and requirements.

The auto-generate prompt variants feature is limited to generating a maximum of five variations from a base prompt. If you need more variations, modify your base prompt to generate them.

Auto-generate prompt variants supports only Azure OpenAI Service models at this time. It also limits content to what's acceptable in terms of the content management policy in Azure OpenAI Service. The feature doesn't support uses outside this policy.

## System performance

Your use case in each scenario determines the performance of the auto-generate prompt variants feature. The feature doesn't evaluate prompts or generate metrics.

Operating in the prompt flow ecosystem, which focuses on prompt engineering, provides a strong story for error handling. Retrying the operation often resolves an error.

One error that might arise specific to this feature is response filtering from the Azure OpenAI Service resource for content or harm detection. This error happens when content in the base prompt is against the content management policy in Azure OpenAI Service. To resolve this error, update the base prompt in accordance with the guidance in [Azure OpenAI Service content filtering](/azure/ai-services/openai/concepts/content-filter).

### Best practices for improving system performance  

To improve performance, you can modify the following parameters, depending on the use case and the prompt requirements:

- **Model**: The choice of models that you use with this feature affects the performance. As general guidance, the GPT-4 model is more powerful than the GPT-3.5 model, so you can expect it to generate prompt variants that are more performant.
- **Number of Variants**: This parameter specifies how many variants to generate. A larger number of variants produces more prompts and increases the likelihood of finding the best prompt for the use case.
- **Base Prompt**: Because this tool generates variants of the provided base prompt, a strong base prompt can set up the tool to provide the maximum value for your case. Review the guidelines in [Prompt engineering techniques](/azure/ai-services/openai/concepts/advanced-prompt-engineering).

## Evaluation of auto-generate prompt variants

The Microsoft development team tested the auto-generate prompt variants feature to evaluate harm mitigation and fitness for purpose.

The testing for harm mitigation showed support for the combination of system prompts and Azure Open AI content management policies in actively safeguarding responses. You can find more opportunities to minimize the risk of harms in [Azure OpenAI Service abuse monitoring](/azure/ai-services/openai/concepts/abuse-monitoring) and [Azure OpenAI Service content filtering](/azure/ai-services/openai/concepts/content-filter).

Fitness-for-purpose testing supported the quality of generated prompts from creative purposes (poetry) and chat-bot agents. We caution you against drawing sweeping conclusions, given the breadth of possible base prompts and potential use cases. For your environment, use evaluations that are appropriate to the required use cases, and ensure that a human reviewer is part of the process.

## Evaluating and integrating auto-generate prompt variants for your use

The performance of the auto-generate prompt variants feature varies, depending on the base prompt and use case. True usage of the generated prompts will depend on a combination of the many elements of the system in which you use the prompts.

To ensure optimal performance in your scenarios, you should conduct your own evaluations of the solutions that you implement by using auto-generate prompt variants. In general, follow an evaluation process that:

- Uses internal stakeholders to evaluate any generated prompt.
- Uses internal stakeholders to evaluate results of any system that uses a generated prompt.
- Incorporates key performance indicators (KPIs) and metrics monitoring when deploying the service by using generated prompts meets evaluation targets.

## Learn more about responsible AI

- [Microsoft AI principles](https://www.microsoft.com/ai/responsible-ai)
- [Microsoft responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources)
- [Microsoft Azure training courses on responsible AI](/training/paths/responsible-ai-business-principles/)

## Learn more about auto-generate prompt variants

- [What is Azure Machine Learning prompt flow](./overview-what-is-prompt-flow.md)
