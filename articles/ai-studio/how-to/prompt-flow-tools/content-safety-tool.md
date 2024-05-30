---
title: Content Safety tool for flows in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces you to the Content Safety tool for flows in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: keli19
ms.author: lagayhar
author: lgayhardt
---

# Content safety tool for flows in Azure AI Studio

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

The prompt flow Content Safety tool enables you to use Azure AI Content Safety in Azure AI Studio.

Azure AI Content Safety is a content moderation service that helps detect harmful content from different modalities and languages. For more information, see [Azure AI Content Safety](/azure/ai-services/content-safety/).

## Prerequisites

To create an Azure Content Safety connection:

1. Sign in to [Azure AI Studio](https://studio.azureml.net/).
1. Go to **Project settings** > **Connections**.
1. Select **+ New connection**.
1. Complete all steps in the **Create a new connection** dialog. You can use an Azure AI Studio hub or Azure AI Content Safety resource. We recommend that you use a hub that supports multiple Azure AI services.

## Build with the Content Safety tool

1. Create or open a flow in [Azure AI Studio](https://ai.azure.com). For more information, see [Create a flow](../flow-develop.md).
1. Select **+ More tools** > **Content Safety (Text)** to add the Content Safety tool to your flow.

    :::image type="content" source="../../media/prompt-flow/content-safety-tool.png" alt-text="Screenshot that shows the Content Safety tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/content-safety-tool.png":::

1. Select the connection to one of your provisioned resources. For example, select **AzureAIContentSafetyConnection** if you created a connection with that name. For more information, see [Prerequisites](#prerequisites).
1. Enter values for the Content Safety tool input parameters described in the [Inputs table](#inputs).
1. Add more tools to your flow, as needed. Or select **Run** to run the flow.
1. The outputs are described in the [Outputs table](#outputs).

## Inputs

The following input parameters are available.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| text | string | The text that needs to be moderated. | Yes |
| hate_category | string | The moderation sensitivity for the Hate category. You can choose from four options: `disable`, `low_sensitivity`, `medium_sensitivity`, or `high_sensitivity`. The `disable` option means no moderation for the Hate category. The other three options mean different degrees of strictness in filtering out hate content. The default option is `medium_sensitivity`. | Yes |
| sexual_category | string | The moderation sensitivity for the Sexual category. You can choose from four options: `disable`, `low_sensitivity`, `medium_sensitivity`, or `high_sensitivity`. The `disable` option means no moderation for the Sexual category. The other three options mean different degrees of strictness in filtering out sexual content. The default option is `medium_sensitivity`. | Yes |
| self_harm_category | string | The moderation sensitivity for the Self-harm category. You can choose from four options: `disable`, `low_sensitivity`, `medium_sensitivity`, or `high_sensitivity`. The `disable` option means no moderation for the Self-harm category. The other three options mean different degrees of strictness in filtering out self-harm content. The default option is `medium_sensitivity`. | Yes |
| violence_category | string | The moderation sensitivity for the Violence category. You can choose from four options: `disable`, `low_sensitivity`, `medium_sensitivity`, or `high_sensitivity`. The `disable` option means no moderation for the Violence category. The other three options mean different degrees of strictness in filtering out violence content. The default option is `medium_sensitivity`. | Yes |

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

You can use the following parameters as inputs for this tool.

| Name | Type | Description | 
| ---- | ---- | ----------- | 
| action_by_category | string | A binary value for each category: `Accept` or `Reject`. This value shows if the text meets the sensitivity level that you set in the request parameters for that category. | 
| suggested_action | string | An overall recommendation based on the four categories. If any category has a `Reject` value, `suggested_action` is also `Reject`. |

## Next steps

- [Learn more about how to create a flow](../flow-develop.md)
