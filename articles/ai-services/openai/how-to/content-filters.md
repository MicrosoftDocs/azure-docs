---
title: 'How to use content filters (preview) with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Learn how to use content filters (preview) with Azure OpenAI Service
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 6/5/2023
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
keywords: 
---

# How to configure content filters with Azure OpenAI Service

> [!NOTE]
> All customers have the ability to modify the content filters to be stricter (for example, to filter content at lower severity levels than the default). Approval is required for turning the content filters partially or fully off. Managed customers only may apply for full content filtering control via this form: [Azure OpenAI Limited Access Review: Modified Content Filters and Abuse Monitoring (microsoft.com)](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xURE01NDY1OUhBRzQ3MkQxMUhZSE1ZUlJKTiQlQCN0PWcu).

The content filtering system integrated into Azure OpenAI Service runs alongside the core models and uses an ensemble of multi-class classification models to detect four categories of harmful content (violence, hate, sexual, and self-harm) at four severity levels respectively (safe, low, medium, and high), and optional binary classifiers for detecting jailbreak risk, existing text, and code in public repositories. The default content filtering configuration is set to filter at the medium severity threshold for all four content harms categories for both prompts and completions. That means that content that is detected at severity level medium or high is filtered, while content detected at severity level low or safe  is not filtered by the content filters. Learn more about content categories, severity levels, and the behavior of the content filtering system [here](../concepts/content-filter.md). Jailbreak risk detection and protected text and code models are optional and off by default. For jailbreak and protected material text and code models, the configurability feature allows all customers to turn the models on and off. The models are by default off and can be turned on per your scenario. Note that some models are required to be on for certain scenarios to retain coverage under the [Customer Copyright Commitment](https://www.microsoft.com/licensing/news/Microsoft-Copilot-Copyright-Commitment).

Content filters can be configured at resource level. Once a new configuration is created, it can be associated with one or more deployments. For more information about model deployment, see the [resource deployment guide](create-resource.md).

The configurability feature is available in preview and allows customers to adjust the settings, separately for prompts and completions, to filter content for each content category at different severity levels as described in the table below. Content detected at the 'safe' severity level is labeled in annotations but is not subject to filtering and is not configurable.

| Severity filtered | Configurable for prompts | Configurable for completions | Descriptions |
|-------------------|--------------------------|------------------------------|--------------|
| Low, medium, high | Yes | Yes | Strictest filtering configuration. Content detected at severity levels low, medium and high is filtered.|
| Medium, high      | Yes | Yes | Default setting. Content detected at severity level low is not filtered, content at medium and high is filtered.|
| High              | Yes| Yes | Content detected at severity levels low and medium is not filtered. Only content at severity level high is filtered. |
| No filters | If approved<sup>\*</sup>| If approved<sup>\*</sup>| No content is filtered regardless of severity level detected. Requires approval<sup>\*</sup>.|

<sup>\*</sup> Only approved customers have full content filtering control and can turn the content filters partially or fully off. Managed customers only can apply for full content filtering control via this form: [Azure OpenAI Limited Access Review: Modified Content Filters and Abuse Monitoring (microsoft.com)](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xURE01NDY1OUhBRzQ3MkQxMUhZSE1ZUlJKTiQlQCN0PWcu)

Customers are responsible for ensuring that applications integrating Azure OpenAI comply with the [Code of Conduct](/legal/cognitive-services/openai/code-of-conduct?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext). 


|Filter category  |Default setting  |Applied to prompt or completion?  |Description  |
|---------|---------|---------|---------|
|Jailbreak risk detection     |    Off     |   Prompt      |   Can be turned on to filter or annotate user prompts that may present a Jailbreak Risk. For more information about consuming annotations visit [Azure OpenAI Service content filtering](/azure/ai-services/openai/concepts/content-filter?tabs=python#annotations-preview) |
| Protected material - code | off | Completion | Can be turned on to get the example citation and license information in annotations for code snippets that match any public code sources. For more information about consuming annotations, see the [content filtering concepts guide](/azure/ai-services/openai/concepts/content-filter#annotations-preview) |
| Protected material - text | off | Completion | Can be turned on to identify and block known text content from being displayed in the model output (for example, song lyrics, recipes, and selected web content).  |


## Configuring content filters via Azure OpenAI Studio (preview)

The following steps show how to set up a customized content filtering configuration for your resource.

1. Go to Azure OpenAI Studio and navigate to the Content Filters tab (in the bottom left navigation, as designated by the red box below).

    :::image type="content" source="../media/content-filters/studio.png" alt-text="Screenshot of the AI Studio UI with Content Filters highlighted" lightbox="../media/content-filters/studio.png":::

1. Create a new customized content filtering configuration.

   :::image type="content" source="../media/content-filters/create-filter.jpg" alt-text="Screenshot of the content filtering configuration UI with create selected" lightbox="../media/content-filters/create-filter.jpg":::

    This leads to the following configuration view, where you can choose a name for the custom content filtering configuration.

    :::image type="content" source="../media/content-filters/filter-view.jpg" alt-text="Screenshot of the content filtering configuration UI" lightbox="../media/content-filters/filter-view.jpg":::

1. This is the view of the default content filtering configuration, where content is filtered at medium and high severity levels for all categories. You can modify the content filtering severity level for both user prompts and model completions separately (configuration for prompts is in the left column and configuration for completions is in the right column, as designated with the blue boxes below) for each of the four content categories (content categories are listed on the left side of the screen, as designated with the green box below). There are three severity levels for each category that are configurable: Low, medium, and high. You can use the slider to set the severity threshold.

    :::image type="content" source="../media/content-filters/severity-level.jpg" alt-text="Screenshot of the content filtering configuration UI with user prompts and model completions highlighted" lightbox="../media/content-filters/severity-level.jpg":::

1. If you determine that your application or usage scenario requires  stricter filtering for some or all content categories, you can configure the settings, separately for prompts and completions, to filter at more severity levels than the default setting. An example is shown in the image below, where the filtering level for user prompts is set to the strictest configuration for hate and sexual, with low severity content filtered along with content classified as medium and high severity (outlined in the red box below). In the example, the filtering levels for model completions are set at the strictest configuration for all content categories (blue box below). With this modified filtering configuration in place, low, medium, and high severity content will be filtered for the hate and sexual categories in user prompts; medium and high severity content will be filtered for the self-harm and violence categories in user prompts; and low, medium, and high severity content will be filtered for all content categories in model completions.

    :::image type="content" source="../media/content-filters/settings.jpg" alt-text="Screenshot of the content filtering configuration with low, medium, high, highlighted." lightbox="../media/content-filters/settings.jpg":::

1. If your use case was approved for modified content filters as outlined above, you will receive full control over content filtering configurations and can can choose to turn filtering partially or fully off. In the image below, filtering is turned off for violence (green box below), while default configurations are retained for other categories. While this disabled the filter functionality for violence, content will still be annotated. To turn all filters and annotations off, toggle off Filters and annotations (red box below).

    :::image type="content" source="../media/content-filters/off.jpg" alt-text="Screenshot of the content filtering configuration with self harm and violence set to off." lightbox="../media/content-filters/off.jpg":::

    You can create multiple content filtering configurations as per your requirements.

1. To turn the optional models on, you can select any of the checkboxes at the left hand side. When each of the optional models is turned on, you can indicate whether the model should Annotate or Filter.

1. Selecting Annotate will run the respective model and return annotations via API response, but it will not filter content. In addition to annotations, you can also choose to filter content by switching the Filter toggle to on. 

1. You can create multiple content filtering configurations as per your requirements.

    :::image type="content" source="../media/content-filters/multiple.png" alt-text="Screenshot of multiple content configurations in the Azure portal." lightbox="../media/content-filters/multiple.png":::

1. Next, to make a custom content filtering configuration operational, assign a configuration to one or more deployments in your resource. To do this, go to the **Deployments** tab and select **Edit deployment** (outlined near the top of the screen in a red box below).

    :::image type="content" source="../media/content-filters/edit-deployment.png" alt-text="Screenshot of the content filtering configuration with edit deployment highlighted." lightbox="../media/content-filters/edit-deployment.png":::

1. Go to advanced options (outlined in the blue box below) select the content filter configuration suitable for that deployment from the **Content Filter** dropdown (outlined near the bottom of the dialog box in the red box below).

    :::image type="content" source="../media/content-filters/advanced.png" alt-text="Screenshot of edit deployment configuration with advanced options selected." lightbox="../media/content-filters/advanced.png":::

1. Select **Save and close** to apply the selected configuration to the deployment.

    :::image type="content" source="../media/content-filters/select-filter.png" alt-text="Screenshot of edit deployment configuration with content filter selected." lightbox="../media/content-filters/select-filter.png":::

1. You can also edit and delete a content filter configuration if required. To do this, navigate to the content filters tab and select the desired action (options outlined near the top of the screen in the red box below). You can edit/delete only one filtering configuration at a time.  

    :::image type="content" source="../media/content-filters/delete.png" alt-text="Screenshot of content filter configuration with edit and delete highlighted." lightbox="../media/content-filters/delete.png":::

    > [!NOTE]
    > Before deleting a content filtering configuration, you will need to unassign it from any deployment in the Deployments tab.

## Best practices

We recommend informing your content filtering configuration decisions through an iterative identification (for example, red team testing, stress-testing, and analysis) and measurement process to address the potential harms that are relevant for a specific model, application, and deployment scenario. After implementing mitigations such as content filtering, repeat measurement to test effectiveness. Recommendations and best practices for Responsible AI for Azure OpenAI, grounded in the [Microsoft Responsible AI Standard](https://aka.ms/RAI) can be found in the [Responsible AI Overview for Azure OpenAI](/legal/cognitive-services/openai/overview?context=/azure/ai-services/openai/context/context).

## Next steps

- Learn more about Responsible AI practices for Azure OpenAI: [Overview of Responsible AI practices for Azure OpenAI models](/legal/cognitive-services/openai/overview?context=/azure/ai-services/openai/context/context).
- Read more about [content filtering categories and severity levels](../concepts/content-filter.md) with Azure OpenAI Service.
- Learn more about red teaming from our: [Introduction to red teaming large language models (LLMs) article](../concepts/red-teaming.md).
