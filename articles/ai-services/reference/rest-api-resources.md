---
title: Azure AI REST API reference
titleSuffix: Azure AI services
description: Provides an overview of available Azure AI REST APIs with links to reference documentation.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: reference
ms.date: 03/07/2024
ms.author: lajanuar
---

# Azure AI REST API reference


This article provides an overview of available Azure AI REST APIs with links to service and feature level reference documentation.

## Available Azure AI services

Select a service from the table to learn how it can help you meet your development goals.

## Supported services

| Service documentation | Description | Reference documentation |
| :--- | :--- | :--- |
| ![Azure AI Search icon](../../ai-services/media/service-icons/search.svg) [Azure AI Search](../../search/index.yml) | Bring AI-powered cloud search to your mobile and web apps | [Azure AI Search API](/rest/api/searchservice) |
| ![Azure OpenAI Service icon](../../ai-services/media/service-icons/azure.svg) [Azure OpenAI](../../ai-services/openai/index.yml) | Perform a wide variety of natural language tasks | **Azure OpenAI APIs**<br>&bullet; [resource creation & deployment](/rest/api/cognitiveservices/accountmanagement/deployments/create-or-update) </br>&bullet; [completions & embeddings](../../ai-services/openai/reference.md)</br>&bullet; [fine-tuning](/rest/api/azureopenai/fine-tuning) |
| ![Bot service icon](../../ai-services/media/service-icons/bot-services.svg) [Bot Service](/composer/) | Create bots and connect them across channels | [Bot Service API](/azure/bot-service/rest-api/bot-framework-rest-connector-api-reference?view=azure-bot-service-4.0&preserve-view=true) |
| ![Content Safety icon](../../ai-services/media/service-icons/content-safety.svg) [Content Safety](../../ai-services/content-safety/index.yml) | An AI service that detects unwanted contents | [Content Safety API](https://westus.dev.cognitive.microsoft.com/docs/services/content-safety-service-2023-10-15-preview/operations/TextBlocklists_AddOrUpdateBlocklistItems) |
| ![Custom Vision icon](../../ai-services/media/service-icons/custom-vision.svg) [Custom Vision](../../ai-services/custom-vision-service/index.yml) | Customize image recognition for your business applications. |**Custom Vision APIs**<br>&bullet; [prediction](https://westus2.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Prediction_3.1/operations/5eb37d24548b571998fde5f3)<br>&bullet; [training](https://westus2.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Training_3.3/operations/5eb0bcc6548b571998fddebd)|
| ![Document Intelligence icon](../../ai-services/media/service-icons/document-intelligence.svg) [Document Intelligence](../../ai-services/document-intelligence/index.yml) | Turn documents into intelligent data-driven solutions | [Document Intelligence API](/rest/api/aiservices/document-models?view=rest-aiservices-2023-07-31&preserve-view=true) |
| ![Face icon](../../ai-services/media/service-icons/face.svg) [Face](../../ai-services/computer-vision/overview-identity.md) | Detect and identify people and emotions in images | [Face API](../../ai-services/computer-vision/identity-api-reference.md) |
| ![Language icon](../../ai-services/media/service-icons/language.svg) [Language](../../ai-services/language-service/index.yml) | Build apps with industry-leading natural language understanding capabilities | [REST API](/rest/api/language/) |
| ![Speech icon](../../ai-services/media/service-icons/speech.svg) [Speech](../../ai-services/speech-service/index.yml) | Speech to text, text to speech, translation, and speaker recognition | **Speech APIs**<br>&bullet; [speech to text](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-2-preview1/operations/Datasets_CommitBlocks)<br>&bullet; [text to speech](../../ai-services/speech-service/rest-text-to-speech.md) |
| ![Translator icon](../../ai-services/media/service-icons/translator.svg) [Translator](../../ai-services/translator/index.yml) | Translate more than 100 in-use, at-risk, and endangered languages and dialects | **Translator APIs**<br>&bullet; [text translation](../../ai-services/translator/reference/rest-api-guide.md) <br>&bullet; [batch translation](../../ai-services/translator/document-translation/reference/rest-api-guide.md) <br>&bullet; [synchronous translation](../../ai-services/translator/document-translation/reference/synchronous-rest-api-guide.md)|
| ![Video Indexer icon](../../ai-services/media/service-icons/video-indexer.svg) [Video Indexer](/azure/azure-video-indexer) | Extract actionable insights from your videos | [Video Indexer API](/rest/api/videoindexer/accounts?view=rest-videoindexer-2024-01-01&preserve-view=true) |
| ![Vision icon](../../ai-services/media/service-icons/vision.svg) [Vision](../../ai-services/computer-vision/index.yml) | Analyze content in images and videos | [Vision API](https://eastus.dev.cognitive.microsoft.com/docs/services/Cognitive_Services_Unified_Vision_API_2024-02-01/operations/61d65934cd35050c20f73ab6) |

## Deprecated services

| Service documentation | Description | Reference documentation |
| --- | --- | --- |
| ![Anomaly Detector icon](../../ai-services/media/service-icons/anomaly-detector.svg) [Anomaly Detector](../../ai-services/Anomaly-Detector/index.yml) <br>(deprecated 2023) | Identify potential problems early on | [Anomaly Detector API](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector-v1-1/operations/CreateMultivariateModel) |
| ![Content Moderator icon](../../ai-services/media/service-icons/content-moderator.svg) [Content Moderator](../../ai-services/content-moderator/index.yml) <br>(deprecated 2024) | Detect potentially offensive or unwanted content | [Content Moderator API](../../ai-services/content-moderator/api-reference.md) |
| ![Language Understanding icon](../../ai-services/media/service-icons/luis.svg) [Language understanding (LUIS)](../../ai-services/luis/index.yml) <br>(deprecated 2023) | Understand natural language in your apps | [LUIS API](https://westus.dev.cognitive.microsoft.com/docs/services/luis-endpoint-api-v3-0/operations/5cb0a9459a1fe8fa44c28dd8) |
| ![Metrics Advisor icon](../../ai-services/media/service-icons/metrics-advisor.svg) [Metrics Advisor](../../ai-services/metrics-advisor/index.yml) <br>(deprecated 2023) | An AI service that detects unwanted contents | [Metrics Advisor API](https://westus.dev.cognitive.microsoft.com/docs/services/MetricsAdvisor/operations/createDataFeed) |
| ![Personalizer icon](../../ai-services/media/service-icons/personalizer.svg) [Personalizer](../../ai-services/personalizer/index.yml) <br>(deprecated 2023) | Create rich, personalized experiences for each user | [Personalizer API](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Rank) |
| ![QnA Maker icon](../../ai-services/media/service-icons/luis.svg) [QnA maker](../../ai-services/qnamaker/index.yml) <br>(deprecated 2022) | Distill information into easy-to-navigate questions and answers | [QnA Maker API](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff) |

## Next steps

- [View Azure AI SDK reference](sdk-package-resources.md)
