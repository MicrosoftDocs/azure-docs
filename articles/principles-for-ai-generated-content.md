---
title: Principles for AI generated content
description: Describes Microsoft's approach for using AI-generated content on Microsoft Learn
author: tfitzmac
ms.author: tomfitz
ms.service: azure
ms.topic: conceptual
ms.date: 02/26/2023
---

# Our principles for using AI-generated content on Microsoft Learn

Microsoft uses [Azure OpenAI Service](/azure/cognitive-services/openai/) to generate some of the text and code examples that we publish on [Microsoft Learn](/). This article describes our approach for using Azure OpenAI to generate technical content that supports our products and services.

At Microsoft, we're working to add articles to Microsoft Learn that contain AI-generated content. Over time, more articles will feature AI-generated text and code samples.

For information about the broader effort at Microsoft to put our AI principles into practice, see [Microsoft's AI principles](https://www.microsoft.com/ai/responsible-ai).

## Our commitment

We're committed to providing you with accurate and comprehensive learning experiences for Microsoft products and services. By using AI-generated content, we can extend the content for your scenarios. We can provide more examples in more programming languages. We can cover solutions in greater detail. We can cover new scenarios more rapidly.

We understand that AI-generated content isn't always accurate. We test and review AI-generated content before we publish it.

## Transparency

We're transparent about articles that contain AI-generated content. All articles that contain any AI-generated content include text acknowledging the role of AI. You'll see this text at the top of the article.

## Augmentation

For articles that contain AI-generated content, our authors use AI to augment their content creation process. For example, an author plans what to cover in the article, and then uses Azure OpenAI to generate part of the content. Or, the author runs a process to convert an existing article from one programming language to another language. The author reviews and revises the AI-generated content. Finally, the author writes any remaining sections.

These articles contain a mix of authored content and AI-generated content and are clearly marked as containing AI-generated content.

## Validation

The author reviews all AI-generated content and revises it as needed. After the author has reviewed the content, the article goes through our standard validation process to check for formatting errors, and to make sure the terms and language are appropriate and inclusive. The article is eligible for publishing only after passing all validation tests.

The author tests all AI-generated code before publishing. The author either manually tests the code or runs it through an automated test process.

## AI models

Currently, we're using large language models from OpenAI accessed through Azure OpenAI Service to generate content. Specifically, we're using the GPT-3 and Codex language models.

We may add other AI services in the future and will update this page periodically to reflect our updated practices.
