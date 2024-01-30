---
title: Content Safety tool for flows in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces the Content Safety tool for flows in Azure AI Studio.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.reviewer: keli19
ms.author: lagayhar
author: lgayhardt
---

# Content safety tool for flows in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

The prompt flow *Content Safety* tool enables you to use Azure AI Content Safety in Azure AI Studio.

Azure AI Content Safety is a content moderation service that helps detect harmful content from different modalities and languages. For more information, see [Azure AI Content Safety](/azure/ai-services/content-safety/).

## Prerequisites

Create an Azure Content Safety connection:
1. Sign in to [Azure AI Studio](https://studio.azureml.net/).
1. Go to **Settings** > **Connections**.
1. Select **+ New connection**.
1. Complete all steps in the **Create a new connection** dialog box. You can use an Azure AI resource or Azure AI Content Safety resource. An Azure AI resource that supports multiple Azure AI services is recommended. 

## Build with the Content Safety tool

1. Create or open a flow in Azure AI Studio. For more information, see [Create a flow](../flow-develop.md).
1. Select **+ More tools** > **Content Safety (Text)** to add the Content Safety tool to your flow.

    :::image type="content" source="../../media/prompt-flow/content-safety-tool.png" alt-text="Screenshot of the Content Safety tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/content-safety-tool.png":::

1. Select the connection to one of your provisioned resources. For example, select **AzureAIContentSafetyConnection** if you created a connection with that name. For more information, see [Prerequisites](#prerequisites).
1. Enter values for the Content Safety tool input parameters described [here](#inputs).
1. Add more tools to your flow as needed, or select **Run** to run the flow.
1. The outputs are described [here](#outputs).

## Inputs

The following are available input parameters:

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| text | string | The text that needs to be moderated. | Yes |
| hate_category | string | The moderation sensitivity for Hate category. You can choose from four options: *disable*, *low_sensitivity*, *medium_sensitivity*, or *high_sensitivity*. The *disable* option means no moderation for hate category. The other three options mean different degrees of strictness in filtering out hate content. The default option is *medium_sensitivity*. | Yes |
| sexual_category | string | The moderation sensitivity for Sexual category. You can choose from four options: *disable*, *low_sensitivity*, *medium_sensitivity*, or *high_sensitivity*. The *disable* option means no moderation for sexual category. The other three options mean different degrees of strictness in filtering out sexual content. The default option is *medium_sensitivity*. | Yes |
| self_harm_category | string | The moderation sensitivity for Self-harm category. You can choose from four options: *disable*, *low_sensitivity*, *medium_sensitivity*, or *high_sensitivity*. The *disable* option means no moderation for self-harm category. The other three options mean different degrees of strictness in filtering out self_harm content. The default option is *medium_sensitivity*. | Yes |
| violence_category | string | The moderation sensitivity for Violence category. You can choose from four options: *disable*, *low_sensitivity*, *medium_sensitivity*, or *high_sensitivity*. The *disable* option means no moderation for violence category. The other three options mean different degrees of strictness in filtering out violence content. The default option is *medium_sensitivity*. | Yes |

## Outputs

The following JSON format response is an example returned by the tool:

```json
{
    "action_by_category": {
      "Hate": "Accept",
      "SelfHarm": "Accept",
      "Sexual": "Accept",
      "Violence": "Accept"
    },
    "suggested_action": "Accept"
  }
```

You can use the following parameters as inputs for this tool:

| Name | Type | Description | 
| ---- | ---- | ----------- | 
| action_by_category | string | A binary value for each category: *Accept* or *Reject*. This value shows if the text meets the sensitivity level that you set in the request parameters for that category. | 
| suggested_action | string | An overall recommendation based on the four categories. If any category has a *Reject* value, the `suggested_action` is *Reject* as well. |



## Next steps

- [Learn more about how to create a flow](../flow-develop.md)

