---
title: Content Safety (Text) tool in Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: The Content Safety (Text) tool is a wrapper for the Azure AI Content Safety Text API, which you can use to detect text content and get moderation results.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 11/02/2023
---

# Content Safety (Text) tool

Azure AI Content Safety is a content moderation service developed by Microsoft that helps you detect harmful content from different modalities and languages. The Content Safety (Text) tool is a wrapper for the Azure AI Content Safety Text API, which allows you to detect text content and get moderation results. For more information, see [Azure AI Content Safety](https://aka.ms/acs-doc).

## Prerequisites

- Create an [Azure AI Content Safety](https://aka.ms/acs-create) resource.
- Add an `Azure Content Safety` connection in prompt flow. Fill the `API key` field with `Primary key` from the `Keys and Endpoint` section of the created resource.

## Inputs

You can use the following parameters as inputs for this tool:

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| text | string | Text that needs to be moderated. | Yes |
| hate_category | string | Moderation sensitivity for the `Hate` category. Choose from four options: `disable`, `low_sensitivity`, `medium_sensitivity`, or `high_sensitivity`. The `disable` option means no moderation for the `Hate` category. The other three options mean different degrees of strictness in filtering out hate content. The default is `medium_sensitivity`. | Yes |
| sexual_category | string | Moderation sensitivity for the `Sexual` category. Choose from four options: `disable`, `low_sensitivity`, `medium_sensitivity`, or `high_sensitivity`. The `disable` option means no moderation for the `Sexual` category. The other three options mean different degrees of strictness in filtering out sexual content. The default is `medium_sensitivity`. | Yes |
| self_harm_category | string | Moderation sensitivity for the `Self-harm` category. Choose from four options: `disable`, `low_sensitivity`, `medium_sensitivity`, or `high_sensitivity`. The `disable` option means no moderation for the `Self-harm` category. The other three options mean different degrees of strictness in filtering out self-harm content. The default is `medium_sensitivity`. | Yes |
| violence_category | string | Moderation sensitivity for the `Violence` category. Choose from four options: `disable`, `low_sensitivity`, `medium_sensitivity`, or `high_sensitivity`. The `disable` option means no moderation for the `Violence` category. The other three options mean different degrees of strictness in filtering out violence content. The default is `medium_sensitivity`. | Yes |

For more information, see [Azure AI Content Safety](https://aka.ms/acs-doc).

## Outputs

The following sample is an example JSON format response returned by the tool:
  
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

The `action_by_category` field gives you a binary value for each category: `Accept` or `Reject`. This value shows if the text meets the sensitivity level that you set in the request parameters for that category.

The `suggested_action` field gives you an overall recommendation based on the four categories. If any category has a `Reject` value, `suggested_action` is also `Reject`.
