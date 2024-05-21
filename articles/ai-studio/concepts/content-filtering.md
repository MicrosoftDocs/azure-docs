---
title: Azure AI Studio content filtering
titleSuffix: Azure AI Studio
description: Learn about the content filtering capabilities of Azure OpenAI in Azure AI Studio.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: conceptual
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: pafarley
author: PatrickFarley
---

# Content filtering in Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

Azure AI Studio includes a content filtering system that works alongside core models and DALL-E image generation models.

> [!IMPORTANT]
> The content filtering system isn't applied to prompts and completions processed by the Whisper model in Azure OpenAI Service. Learn more about the [Whisper model in Azure OpenAI](../../ai-services/openai/concepts/models.md).

## How it works 

This content filtering system is powered by [Azure AI Content Safety](../../ai-services/content-safety/overview.md), and it works by running both the prompt input and completion output through an ensemble of classification models aimed at detecting and preventing the output of harmful content. Variations in API configurations and application design might affect completions and thus filtering behavior.

With Azure OpenAI model deployments, you can use the default content filter or create your own content filter (described later on). The default content filter is also available for other text models curated by Azure AI in the [model catalog](../how-to/model-catalog.md), but custom content filters aren't yet available for those models. Models available through **Models as a Service** have content filtering enabled by default and can't be configured.

## Language support

The content filtering models have been trained and tested on the following languages: English, German, Japanese, Spanish, French, Italian, Portuguese, and Chinese. However, the service can work in many other languages, but the quality can vary. In all cases, you should do your own testing to ensure that it works for your application.

## Create a content filter

## How to create a content filter? 
For any model deployment in [Azure AI Studio](https://ai.azure.com), you could directly use the default content filter, but when you want to have more customized setting on content filter, for example set a stricter or looser filter, or enable more advanced capabilities, like jailbreak risk detection and protected material detection.  

Follow these steps to create a content filter:

1. Go to [AI Studio](https://ai.azure.com) and select a project.
1. Select **Content filters** from the left pane and then select **+ New content filter**.

    :::image type="content" source="../media/content-safety/content-filter/create-content-filter.png" alt-text="Screenshot of the button to create a new content filter." lightbox="../media/content-safety/content-filter/create-content-filter.png":::

1. On the **Basic information** page, enter a name for your content filter. Select a connection to associate with the content filter. Then select **Next**.

    :::image type="content" source="../media/content-safety/content-filter/create-content-filter-basic.png" alt-text="Screenshot of the option to select or enter basic information such as the filter name when creating a content filter." lightbox="../media/content-safety/content-filter/create-content-filter-basic.png":::

1. On the **Input filters** page, you can set the filter for the input prompt. For example, you can enable prompt shields for jailbreak attacks. Then select **Next**.

    :::image type="content" source="../media/content-safety/content-filter/configure-threshold.png" alt-text="Screenshot of the option to select input filters when creating a content filter." lightbox="../media/content-safety/content-filter/configure-threshold.png":::

    Content will be annotated by category and blocked according to the threshold you set. For the violence, hate, sexual, and self-harm categories, adjust the slider to block content of high, medium, or low severity.

1. On the **Output filters** page, you can set the filter for the output completion. For example, you can enable filters for protected material detection. Then select **Next**. 
    
    Content will be annotated by each category and blocked according to the threshold. For violent content, hate content, sexual content, and self-harm content category, adjust the threshold to block harmful content with equal or higher severity levels.

1. Optionally, on the **Deployment** page, you can associate the content filter with a deployment. You can also associate the content filter with a deployment later. Then select **Create**.

    :::image type="content" source="../media/content-safety/content-filter/create-content-filter-deployment.png" alt-text="Screenshot of the option to select a deployment when creating a content filter." lightbox="../media/content-safety/content-filter/create-content-filter-deployment.png":::

    Content filtering configurations are created at the hub level in AI Studio. Learn more about configurability in the [Azure OpenAI docs](/azure/ai-services/openai/how-to/content-filters).

1. On the **Review** page, review the settings and then select **Create filter**.


## How to apply a content filter?

A default content filter is set when you create a deployment. You can also apply your custom content filter to your deployment. 

Follow these steps to apply a content filter to a deployment:

1. Go to [AI Studio](https://ai.azure.com) and select a project.
1. Select **Deployments** and choose one of your deployments, then select **Edit**.

    :::image type="content" source="../media/content-safety/content-filter/deployment-edit.png" alt-text="Screenshot of the button to edit a deployment." lightbox="../media/content-safety/content-filter/deployment-edit.png":::

1. In the **Update deployment** window, select the content filter you want to apply to the deployment.

    :::image type="content" source="../media/content-safety/content-filter/apply-content-filter.png" alt-text="Screenshot of apply content filter." lightbox="../media/content-safety/content-filter/apply-content-filter.png":::

Now, you can go to the playground to test whether the content filter works as expected!

## Content filtering categories and configurability

The content filtering system integrated in Azure AI Studio contains neural multi-class classification models aimed at detecting and filtering harmful content; the models cover four categories (hate, sexual, violence, and self-harm) across four severity levels (safe, low, medium, and high). Content detected at the 'safe' severity level is labeled in annotations but isn't subject to filtering and isn't configurable.

### Categories

|Category|Description|
|--------|-----------|
| Hate   |The hate category describes language attacks or uses that include pejorative or discriminatory language with reference to a person or identity group based on certain differentiating attributes of these groups including but not limited to race, ethnicity, nationality, gender identity and expression, sexual orientation, religion, immigration status, ability status, personal appearance, and body size. |
| Sexual | The sexual category describes language related to anatomical organs and genitals, romantic relationships, acts portrayed in erotic or affectionate terms, physical sexual acts, including those portrayed as an assault or a forced sexual violent act against one's will, prostitution, pornography, and abuse. |
| Violence | The violence category describes language related to physical actions intended to hurt, injure, damage, or kill someone or something; describes weapons, etc.   |
| Self-Harm | The self-harm category describes language related to physical actions intended to purposely hurt, injure, or damage one's body, or kill oneself.|

### Severity levels

|Category|Description|
|--------|-----------|
|Safe    | Content might be related to violence, self-harm, sexual, or hate categories but the terms are used in general, journalistic, scientific, medical, and similar professional contexts, which are appropriate for most audiences. |
|Low | Content that expresses prejudiced, judgmental, or opinionated views, includes offensive use of language, stereotyping, use cases exploring a fictional world (for example, gaming, literature) and depictions at low intensity.|
| Medium | Content that uses offensive, insulting, mocking, intimidating, or demeaning language towards specific identity groups, includes depictions of seeking and executing harmful instructions, fantasies, glorification, promotion of harm at medium intensity. |
|High | Content that displays explicit and severe harmful instructions, actions, damage, or abuse; includes endorsement, glorification, or promotion of severe harmful acts, extreme or illegal forms of harm, radicalization, or nonconsensual power exchange or abuse.|

### Configurability (preview)

The default content filtering configuration for the GPT model series is set to filter at the medium severity threshold for all four content harm categories (hate, violence, sexual, and self-harm) and applies to both prompts (text, multi-modal text/image) and completions (text). This means that content that is detected at severity level medium or high is filtered, while content detected at severity level low isn't filtered by the content filters. For DALL-E, the default severity threshold is set to low for both prompts (text) and completions (images), so content detected at severity levels low, medium, or high is filtered. The configurability feature is available in preview and allows customers to adjust the settings, separately for prompts and completions, to filter content for each content category at different severity levels as described in the table below:

| Severity filtered | Configurable for prompts | Configurable for completions | Descriptions |
|-------------------|--------------------------|------------------------------|--------------|
| Low, medium, high | Yes | Yes | Strictest filtering configuration. Content detected at severity levels low, medium and high is filtered.|
| Medium, high      | Yes | Yes | Content detected at severity level low isn't filtered, content at medium and high is filtered.|
| High              | Yes| Yes | Content detected at severity levels low and medium isn't filtered. Only content at severity level high is filtered. Requires approval<sup>1</sup>.|
| No filters | If approved<sup>1</sup>| If approved<sup>1</sup>| No content is filtered regardless of severity level detected. Requires approval<sup>1</sup>.|

<sup>1</sup> For Azure OpenAI models, only customers who have been approved for modified content filtering have full content filtering control, including configuring content filters at severity level high only or turning off content filters. Apply for modified content filters via this form: [Azure OpenAI Limited Access Review: Modified Content Filters and Abuse Monitoring (microsoft.com)](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xURE01NDY1OUhBRzQ3MkQxMUhZSE1ZUlJKTiQlQCN0PWcu)

Customers are responsible for ensuring that applications integrating Azure OpenAI comply with the [Code of Conduct](/legal/cognitive-services/openai/code-of-conduct?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext). 


### Other input filters

You can also enable special filters for generative AI scenarios: 
- Jailbreak attacks: Jailbreak Attacks are User Prompts designed to provoke the Generative AI model into exhibiting behaviors it was trained to avoid or to break the rules set in the System Message.
- Indirect attacks: Indirect Attacks, also referred to as Indirect Prompt Attacks or Cross-Domain Prompt Injection Attacks, are a potential vulnerability where third parties place malicious instructions inside of documents that the Generative AI system can access and process.

### Other output filters

You can also enable the following special output filters:
- Protected material for text: Protected material text describes known text content (for example, song lyrics, articles, recipes, and selected web content) that can be outputted by large language models.
- Protected material for code: Protected material code describes source code that matches a set of source code from public repositories, which can be outputted by large language models without proper citation of source repositories.
- Groundedness: The groundedness detection filter detects whether the text responses of large language models (LLMs) are grounded in the source materials provided by the users.

## Next steps

- Learn more about the [underlying models that power Azure OpenAI](../../ai-services/openai/concepts/models.md).
- Azure AI Studio content filtering is powered by [Azure AI Content Safety](../../ai-services/content-safety/overview.md).
- Learn more about understanding and mitigating risks associated with your application: [Overview of Responsible AI practices for Azure OpenAI models](/legal/cognitive-services/openai/overview?context=/azure/ai-services/context/context).
