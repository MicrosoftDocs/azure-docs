---
title: Publish a custom model
titleSuffix: Azure Cognitive Services
description: This article explains how to publish a custom model using the Azure Cognitive Services Custom Translator v2.0.  
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 01/13/2022
ms.author: lajanuar
ms.topic: conceptual
#Customer intent: As a Custom Translator user, I want to understand how to publish models, so that I translate with my custom systems.
---
# Publish a custom model | Preview

> [!IMPORTANT]
> Custom Translator v2.0 is currently in public preview. Some features may not be supported or have constrained capabilities.

A project might have one or many successfully trained models. However, you can publish only one model per project to one or many regions: North America, Europe, and Asia Pacific. You incur `$10 monthly hosting charge per region`.

## Publish trained model

1. Select **Publish model** blade.
2. Select "en-de with sample data" and select **Publish**
3. Check desired region(s) 
4. Select **Publish** (Status should transition from Deploying to Deployed)

![Deploy a trained model](../media/quickstart/publish-model.png)

## Next steps

- Learn [how to translate documents with custom models](translate-with-custom-model.md).
