---
title: FAQ - QnA Maker
titleSuffix: Azure Cognitive Services
description: List of frequently asked questions for QnA Maker service
services: cognitive-services
author: tulasim88
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/12/2018
ms.author: tulasim
---
# Frequently Asked Questions

## Why is my URL(s)/file(s) is not extracting question-answer pairs?

It's possible that QnA Maker can't auto-extract some question-and-answer (QnA) content from valid FAQ URLs. In such cases, you can paste the QnA content in a .txt file and see if the tool can ingest it. Alternately, you can editorially add content to your knowledge base.

## How large a knowledge base can I create?

The size of the knowledge base depends on the SKU of Azure search you choose when creating the QnA Maker service. Read [here](./Tutorials/choosing-capacity-qnamaker-deployment.md) for more details.

## Why do I not see anything in the drop-down for when I try to create a new knowledge base?

You haven't created any QnA Maker services in Azure yet. Read [here](./How-To/set-up-qnamaker-service-azure.md) how to do that.

## How do I share a knowledge base with other?

Sharing works at the level of a QnA Maker service, i.e. all knowledge bases in the services will be shared. Read [here](./How-To/collaborate-knowledge-base.md) how to collaborate on a knowledge base.

## How can I change the default message when no good match is found?

The default message is part of the settings in your App service.
- Go to the your App service resource in the Azure portal

![qnamaker appservice](./media/qnamaker-faq/qnamaker-resource-list-appservice.png)
- Click on the **Settings** option

![qnamaker appservice settings](./media/qnamaker-faq/qnamaker-appservice-settings.png)
- Change the value of the **DefaultAnswer** setting
- Restart your App service

![qnamaker appservice restart](./media/qnamaker-faq/qnamaker-appservice-restart.png)

## Why is my SharePoint link not getting extracted?

The tool parses only public URLs and does not support authenticated data sources at this time. Alternately, you can download the file and use the file-upload option to extract questions and answers.


## The updates that I made to my knowledge base are not reflected on publish. Why not?

Every edit operation, whether in a table update, test, or settings, needs to be saved before it can be published. Be sure to click the Save and train button after every edit operation.

## When should I refresh my endpoint keys?

You should refresh your endpoint keys if you suspect that they have been compromised.

## Does the knowledge base support rich data or multimedia?

The knowledge base supports Markdown. However, the auto-extraction from URLs has limited HTML-to-Markdown conversion capability. If you want to use full-fledged Markdown, you can modify your content directly in the table, or upload a knowledge base with the rich content.

Multimedia, such as images and videos, is not supported at this time.

## Does QnA Maker support non-English languages?

See more details about [supported languages](./Overview/languages-supported.md).

If you have content from multiple languages, be sure to create a separate service for each language.

## Do I need to use Bot Framework in order to use QnA Maker?

No, you do not need to use the Bot Framework with QnA Maker. However, QnA Maker is offered as one of several templates in Azure Bot Service. Bot Service enables rapid intelligent bot development through Microsoft Bot Framework, and it runs in a server less environment.

## How can I create a bot with QnA Maker?

Follow the instructions in [this](./Tutorials/create-qna-bot.md) documentation to create your Bot with Azure Bot.

## How do I embed the QnA Maker service in my website?

Follow these steps to embed the QnA Maker service as a web-chat control in your website:

1. Create your FAQ bot by following the instructions [here](./Tutorials/create-qna-bot.md).
2. Enable the web chat by following the steps [here](https://docs.microsoft.com/azure/bot-service/bot-service-channel-connect-webchat)


