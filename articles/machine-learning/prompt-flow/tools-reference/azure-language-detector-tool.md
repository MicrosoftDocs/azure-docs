---
title: Azure Language Detector tool in Azure Machine Learning prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Azure Language Detector is a cloud-based service, which you can use to identify the language of a piece of text.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 06/30/2023
---

# Azure Language Detector tool (preview)

Azure Language Detector is a cloud-based service, which you can use to identify the language of a piece of text. For more information, see the [Azure Language Detector API](../../../cognitive-services/translator/reference/v3-0-detect.md) for more information.

## Requirements

- requests

## Prerequisites

- [Create a Translator resource](../../../cognitive-services/translator/create-translator-resource.md).

## Inputs

The following are available input parameters:

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| input_text | string | Identify the language of the input text. | Yes |

For more information, see to [Translator 3.0: Detect](../../../cognitive-services/translator/reference/v3-0-detect.md)


## Outputs

The following is an example output returned by the tool:

input_text = "Is this a leap year?"

```
en
```
