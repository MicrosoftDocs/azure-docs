---
title: "Groundedness detection in Azure AI Studio(preview)"
titleSuffix: Azure AI services
description: Use Azure AI Studio to detect whether the text responses of large language models (LLMs) are grounded in the source materials provided by the users.
services: ai-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.topic: quickstart
ms.date: 03/18/2024
ms.author: pafarley
---

# Groundedness detection (preview)

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

Learn how to use Azure AI Content Safety Groundedness detection to check whether the text responses of large language models (LLMs) are grounded in the source materials provided by the users.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, supported region (East US2, West US, Sweden Central), and supported pricing tier. Then select **Create**.
* (Optional) If you want to use the _reasoning_ feature, create an Azure OpenAI Service resource with a GPT model deployed.
* An [AI Studio hub](../how-to/create-azure-ai-resource.md) in Azure AI Studio. 


## Setting up

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Select the hub you'd like to work in.
1. On the left nav menu, select **AI Services**. Select the **Content Safety** panel.
   :::image type="content" source="../media/content-safety/select-panel.png" alt-text="Screenshot of the Azure AI Studio Content Safety panel selected." lightbox="../media/content-safety/select-panel.png":::
1. Then, select **Groundedness detection**.
1. On the next page, in the drop-down menu under **Try it out**, select the **Azure AI Services** connection you want to use.
    
## Check groundedness without reasoning

In the simple case without the _reasoning_ feature, the Groundedness detection API classifies the ungroundedness of the submitted content as `true` or `false`.

Choose the task type you'd like to do. Then, either select a sample scenario or write your own inputs in the text boxes provided.

Select **Run test** to get the result.

## Check groundedness with reasoning

The Groundedness detection API provides the option to include _reasoning_ in the API response. With reasoning enabled, the response includes a `"reasoning"` field that details specific instances and explanations for any detected ungroundedness. Be careful: using reasoning increases the processing time and incurs extra fees.

Enable the **Enable reasoning** switch on the page.

### Bring your own GPT deployment

Enter your Azure OpenAI endpoint and deployment name in the text fields.

:::image type="content" source="../media/content-safety/groundedness-reasoning.png" alt-text="Screenshot of the Enable reasoning switch and Azure OpenAI resource input fields.":::

> [!TIP]
> At the moment, we only support **Azure OpenAI GPT-4 Turbo** resources and do not support other GPT types. Your GPT-4 Turbo resources can be deployed in any region; however, we recommend that they be located in the same region as the content safety resources to minimize potential latency.

In order to use your Azure OpenAI GPT4-Turbo resource to enable the reasoning feature, use Managed Identity to allow your Content Safety resource to access the Azure OpenAI resource:

[!INCLUDE [openai-account-access](~/reusable-content/ce-skilling/azure/includes/ai-services/content-safety/includes/openai-account-access.md)]

### Get reasoning results

When you've granted access, return to the AI Studio page and select **Run test** again.

You'll receive a JSON response reflecting the Groundedness analysis performed. Here’s what a typical output looks like: 

```json
{
    "ungroundedDetected": true,
    "ungroundedPercentage": 1,
    "ungroundedDetails": [
        {
            "text": "12/hour.",
            "offset": {
                "utf8": 0,
                "utf16": 0,
                "codePoint": 0
            },
            "length": {
                "utf8": 8,
                "utf16": 8,
                "codePoint": 8
            },
            "reason": "None. The premise mentions a pay of \"10/hour\" but does not mention \"12/hour.\" It's neutral. "
        }
    ]
}
```

The JSON objects in the output are defined here:

| Name  | Description    | Type    |
| :------------------ | :----------- | ------- |
| **ungroundedDetected** | Indicates whether the text exhibits ungroundedness.  | Boolean    |
| **ungroundedPercentage** | Specifies the proportion of the text identified as ungrounded, expressed as a number between 0 and 1, where 0 indicates no ungrounded content and 1 indicates entirely ungrounded content.| Float	 |
| **ungroundedDetails** | Provides insights into ungrounded content with specific examples and percentages.| Array |
| -**`text`**   |  The specific text that is ungrounded.  | String   |
| -**`offset`**   |  An object describing the position of the ungrounded text in various encoding.  | String   |
| - `offset > utf8`       | The offset position of the ungrounded text in UTF-8 encoding.      | Integer   |
| - `offset > utf16`      | The offset position of the ungrounded text in UTF-16 encoding.       | Integer |
| - `offset > codePoint`  | The offset position of the ungrounded text in terms of Unicode code points. |Integer    |
| -**`length`**   |  An object describing the length of the ungrounded text in various encoding. (utf8, utf16, codePoint), similar to the offset. | Object   |
| - `length > utf8`       | The length of the ungrounded text in UTF-8 encoding.      | Integer   |
| - `length > utf16`      | The length of the ungrounded text in UTF-16 encoding.       | Integer |
| - `length > codePoint`  | The length of the ungrounded text in terms of Unicode code points. |Integer    |
| -**`reason`** |  Offers explanations for detected ungroundedness. | String  |


## Next steps

Configure content filters for each provided category to match your use case.

> [!div class="nextstepaction"]
> [Content filters](../concepts/content-filtering.md)
