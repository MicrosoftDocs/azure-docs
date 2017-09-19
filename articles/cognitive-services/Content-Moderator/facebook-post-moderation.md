---
title: Moderate Facebook posts with Azure Content Moderator | Microsoft Docs
description: Use Content Moderator with sample Facebook page
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 09/18/2017
ms.author: sajagtap
---

# Moderate images and text on a Facebook page

In this tutorial, we will learn how to use Content Moderator with a sample Facebook page to either take down or allow publishing of images and text by users browsing the Facebook page.

The tutorial will guide you through these steps:

1. Create a Content Moderator team.
2. Create Azure Functions that listen for HTTP events from Content Moderator and Facebook.
3. Create a Facebook Page and App, and connect it to Content Moderator

After we are done, Facebook will send the content posted by the visitors to Content Moderator. Based on the match thresholds, your Content Moderator workflows will either allow publishing the content or block and create reviews within the review tool for for human moderation.

## 1. Create a Content Moderator team

Refer to the [Quickstart](quick-start.md) page to sign up for Content Moderator and create a team.

## 2. Configure image thresholds (workflow)

Refer to the [Workflows](review-tool-user-guide/workflows) page to configure a custom image threshold and workflow. Note the workflow name.

## 3. Configure text thresholds (workflow)

Use steps similar to the [Workflows](review-tool-user-guide/workflows) page to configure a custom text threshold and workflow. Note the workflow name.

![Configure Text Workflow](images/text-workflow-configure.PNG)

You test the workflow by using the "Execute Workflow" button.

![Test Text Workflow](images/text-workflow-test.PNG)

## 4. Create Azure Functions

Sign in to the [Azure Management Portal](https://portal.azure.com/) to create your Azure Functions.

1. Create a Azure Function App as shown on the [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal) page.
2. Open the newly created Function App.
3. Within the App, navigate to **Platform features -> Application Settings**
4. Define the following [application settings](https://docs.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings#settings).

| Auto-detected | Profanity   | OCR    |
| -------------------- |-------------|--------|
| Arabic (Romanized)   | Afrikaans   | Arabic
| Balinese | Albanian | Chinese (Simplified)
