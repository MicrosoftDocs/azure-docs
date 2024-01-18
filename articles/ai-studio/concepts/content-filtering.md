---
title: Azure AI Studio content filtering
titleSuffix: Azure AI Studio
description: Learn about the content filtering capabilities of Azure OpenAI in Azure AI Studio.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
ms.reviewer: eur
ms.author: eur
author: eric-urban
---

# Content filtering in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Azure AI Studio includes a content filtering system that works alongside core models. 

> [!IMPORTANT]
> The content filtering system isn't applied to prompts and completions processed by the Whisper model in Azure OpenAI Service. Learn more about the [Whisper model in Azure OpenAI](../../ai-services/openai/concepts/models.md#whisper-preview).

This system is powered by Azure AI Content Safety, and now works by running both the prompt and completion through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions. Variations in API configurations and application design might affect completions and thus filtering behavior.

The content filtering models have been trained and tested on the following languages: English, German, Japanese, Spanish, French, Italian, Portuguese, and Chinese. However, the service can work in many other languages, but the quality can vary. In all cases, you should do your own testing to ensure that it works for your application.

You can create a content filter or use the default content filter for Azure OpenAI model deployment, and can also use a default content filter for other text models curated by Azure AI in the [model catalog](../how-to/model-catalog.md). The custom content filters for those models aren't yet available. Models available through Models as a Service have content filtering enabled by default and can't be configured.

## How to create a content filter? 
For any model deployment in Azure AI Studio, you could directly use the default content filter, but when you want to have more customized setting on content filter, for example set a stricter or looser filter, or enable more advanced capabilities, like jailbreak risk detection and protected material detection.  To create a content filter, you could go to **Build**, choose one of your projects, then select **Content filters** in the left navigation bar, and create a content filter. 

:::image type="content" source="../media/content-safety/content-filter/create-content-filter.png" alt-text="Screenshot of create content filter." lightbox="../media/content-safety/content-filter/create-content-filter.png":::

### Content filtering categories and configurability

The content filtering system integrated in Azure AI Studio contains neural multi-class classification models aimed at detecting and filtering harmful content; the models cover four categories (hate, sexual, violence, and self-harm) across four severity levels (safe, low, medium, and high). Content detected at the 'safe' severity level is labeled in annotations but isn't subject to filtering and isn't configurable.

:::image type="content" source="../media/content-safety/content-filter/configure-threshold.png" alt-text="Screenshot of configuring the threshold." lightbox="../media/content-safety/content-filter/configure-threshold.png":::

#### Categories

|Category|Description|
|--------|-----------|
| Hate   |The hate category describes language attacks or uses that include pejorative or discriminatory language with reference to a person or identity group based on certain differentiating attributes of these groups including but not limited to race, ethnicity, nationality, gender identity and expression, sexual orientation, religion, immigration status, ability status, personal appearance, and body size. |
| Sexual | The sexual category describes language related to anatomical organs and genitals, romantic relationships, acts portrayed in erotic or affectionate terms, physical sexual acts, including those portrayed as an assault or a forced sexual violent act against one’s will, prostitution, pornography, and abuse. |
| Violence | The violence category describes language related to physical actions intended to hurt, injure, damage, or kill someone or something; describes weapons, etc.   |
| Self-Harm | The self-harm category describes language related to physical actions intended to purposely hurt, injure, or damage one’s body, or kill oneself.|

#### Severity levels

|Category|Description|
|--------|-----------|
|Safe    | Content might be related to violence, self-harm, sexual, or hate categories but the terms are used in general, journalistic, scientific, medical, and similar professional contexts, which are appropriate for most audiences. |
|Low | Content that expresses prejudiced, judgmental, or opinionated views, includes offensive use of language, stereotyping, use cases exploring a fictional world (for example, gaming, literature) and depictions at low intensity.|
| Medium | Content that uses offensive, insulting, mocking, intimidating, or demeaning language towards specific identity groups, includes depictions of seeking and executing harmful instructions, fantasies, glorification, promotion of harm at medium intensity. |
|High | Content that displays explicit and severe harmful instructions, actions, damage, or abuse; includes endorsement, glorification, or promotion of severe harmful acts, extreme or illegal forms of harm, radicalization, or nonconsensual power exchange or abuse.|

## Configurability (preview)

The default content filtering configuration is set to filter at the medium severity threshold for all four content harm categories for both prompts and completions. That means that content that is detected at severity level medium or high is filtered, while content detected at severity level low isn't filtered by the content filters. The configurability feature is available in preview and allows customers to adjust the settings, separately for prompts and completions, to filter content for each content category at different severity levels as described in the table below:

| Severity filtered | Configurable for prompts | Configurable for completions | Descriptions |
|-------------------|--------------------------|------------------------------|--------------|
| Low, medium, high | Yes | Yes | Strictest filtering configuration. Content detected at severity levels low, medium and high is filtered.|
| Medium, high      | Yes | Yes | Default setting. Content detected at severity level low isn't filtered, content at medium and high is filtered.|
| High              | If approved<sup>1</sup>| If approved<sup>1</sup> | Content detected at severity levels low and medium isn't filtered. Only content at severity level high is filtered. Requires approval<sup>1</sup>.|
| No filters | If approved<sup>1</sup>| If approved<sup>1</sup>| No content is filtered regardless of severity level detected. Requires approval<sup>1</sup>.|

<sup>1</sup> For Azure Open AI models, only customers who have been approved for modified content filtering  have full content filtering control, including configuring content filters at severity level high only or turning off content filters. Apply for modified content filters via this form: [Azure OpenAI Limited Access Review: Modified Content Filters and Abuse Monitoring (microsoft.com)](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xURE01NDY1OUhBRzQ3MkQxMUhZSE1ZUlJKTiQlQCN0PWcu)

### More filters for Gen-AI scenarios
You could also enable filters for Gen-AI scenarios: jailbreak risk detection and protected material detection. 

:::image type="content" source="../media/content-safety/content-filter/additional-models.png" alt-text="Screenshot of additional models." lightbox="../media/content-safety/content-filter/additional-models.png":::

## How to apply a content filter?

A default content filter is set when you create a deployment. You can also apply your custom content filter to your deployment. Select **Deployments** and choose one of your deployments, then select **Edit**, a window of updating deployment will open up. Then you can update the deployment by selecting one of your created content filters.

:::image type="content" source="../media/content-safety/content-filter/apply-content-filter.png" alt-text="Screenshot of apply content filter." lightbox="../media/content-safety/content-filter/apply-content-filter.png":::

Now, you can go to the playground to test whether the content filter works as expected!

## Next steps

- Learn more about the [underlying models that power Azure OpenAI](../../ai-services/openai/concepts/models.md).
- Azure AI Studio content filtering is powered by [Azure AI Content Safety](/azure/ai-services/content-safety/overview).
- Learn more about understanding and mitigating risks associated with your application: [Overview of Responsible AI practices for Azure OpenAI models](/legal/cognitive-services/openai/overview?context=/azure/ai-services/context/context).