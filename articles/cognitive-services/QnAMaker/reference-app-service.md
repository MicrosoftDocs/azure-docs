---
title: Service configuration - QnA Maker
description: Understand how and where to configure resources.
ms.topic: reference
ms.date: 02/21/2020
---

# Service configuration

QnA Maker uses several Azure resources (services) including Cognitive Search, App Service, App Service Plan, and Application Insights.

All customizations to these settings supported by QnA Maker are listed below.

## App Service

QnA Maker uses the App Service to provide the query runtime used by the [generateAnswer API](https://docs.microsoft.com/rest/api/cognitiveservices/qnamakerruntime/runtime/generateanswer).


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

Learn [how to add change your Cognitive Search service](./how-to/set-up-qnamaker-service-azure.md#configure-qna-maker-to-use-different-cognitive-search-resource) to your service.

You need to **restart** the service from the **Overview** page of the Azure portal, once you are done making changes.

## QnA Maker Service

The QnA Maker service provides configuration for the following users to collaborate on a single QnA Maker service, and all its knowledge bases.

Learn [how to add collaborators](./how-to/collaborate-knowledge-base.md) to your service.

## Application Insights

Application Insights has no configuration settings specific to QnA Maker.

## App Service Plan

App Service Plan has no configuration settings specific to QnA Maker.

## Next steps

Learn more about [formats](reference-document-format-guidelines.md) for documents and URLs you want to import into a knowledge base.