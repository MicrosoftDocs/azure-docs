---
title: Service configuration - QnA Maker
description: Understand how and where to configure resources.
ms.service: azure-ai-language
manager: nitinme
ms.author: jboback
author: jboback
ms.subservice: azure-ai-qna-maker
ms.topic: reference
ms.date: 11/02/2021
ms.custom: ignite-fall-2021
---

# Service configuration

Each version of QnA Maker uses a different set of Azure resources (services). This article describes the supported customizations for these services. 

## App Service

QnA Maker uses the App Service to provide the query runtime used by the [generateAnswer API](/rest/api/cognitiveservices/qnamaker4.0/runtime/generateanswer).

These settings are available in the Azure portal, for the App Service. The settings are available by selecting **Settings**, then **Configuration**.

You can set an individual setting either through the Application Settings list, or modify several settings by selecting **Advanced edit**.

|Resource|Setting|
|--|--|
|AzureSearchAdminKey|Cognitive Search - used for QnA pair storage and Ranker #1|
|AzureSearchName|Cognitive Search - used for QnA pair storage and Ranker #1|
|DefaultAnswer|Text of answer when no match is found|
|UserAppInsightsAppId|Chat log and telemetry|
|UserAppInsightsKey|Chat log and telemetry|
|UserAppInsightsName|Chat log and telemetry|
|QNAMAKER_EXTENSION_VERSION|Always set to _latest_. This setting will initialize the QnAMaker Site Extension in the App Service.|

You need to **restart** the service from the **Overview** page of the Azure portal, once you are done making changes.

## QnA Maker Service

The QnA Maker service provides configuration for the following users to collaborate on a single QnA Maker service, and all its knowledge bases.

Learn [how to add collaborators](./index.yml) to your service.

## Change Azure Cognitive Search

Learn [how to change the Cognitive Search service](./how-to/configure-QnA-Maker-resources.md#configure-qna-maker-to-use-different-cognitive-search-resource) linked to your QnA Maker service.

## Change default answer

Learn [how to change the text of your default answers](How-To/change-default-answer.md). 

## Telemetry

Application Insights is used for monitoring telemetry with QnA Maker GA. There are no configuration settings specific to QnA Maker.

## App Service Plan

App Service Plan has no configuration settings specific to QnA Maker.

## Next steps

Learn more about [formats](reference-document-format-guidelines.md) for documents and URLs you want to import into a knowledge base.
