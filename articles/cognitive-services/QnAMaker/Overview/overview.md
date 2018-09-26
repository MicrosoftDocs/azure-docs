---
title: What is QnA Maker?
titleSuffix: Azure Cognitive Services
description: QnA Maker enables you to power a question and answer service from your semi-structured content like FAQ documents or URLs and product manuals.
services: cognitive-services
author: tulasim88
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: overview
ms.date: 09/12/2018
ms.author: tulasim
#customer intent: As a developer, I want to know how to use QnA Maker for my FAQs and product manuals so that I can enable conversational question and answer sessions for my customers.
---

# What is QnA Maker?

[QnA Maker](https://qnamaker.ai) enables you to power a question and answer service from your semi-structured content like FAQ (Frequently Asked Questions) documents or URLs and product manuals. You can build a model of questions and answers that is flexible to user queries, providing responses that you'll train a bot to use in a natural, conversational way.

An easy-to-use graphical user interface enables you to create, manage, train and get your service up and running without any developer experience.

![Overview](../media/qnamaker-overview-learnabout/overview.png)

## Highlights

- A complete **no-code** experience to [create a FAQ bot](https://aka.ms/qnamaker-docs-create-faqbot).
- **No more network throttling**. Pay for hosting the service and not for the number of transactions. See the [pricing page](https://aka.ms/qnamaker-docs-pricing) for more details.
- **Scale as per your needs**. Choose the appropriate SKUs of the individual components that suit your scenario. See how to [choose capacity](https://aka.ms/qnamaker-docs-capacity) for your QnA Maker service.
- **Full data compliance**. The data and runtime components are deployed in the user's Azure subscription and within their compliance boundary. Read below for more details.

## Key QnA Maker processes

A QnA Maker provides two key services for your data:

* **Extraction**: Structured question-answer data is extracted from semi-structured data sources like FAQs and product manuals. This extraction is done when creating the knowledge base. Create your knowledge base [here](https://aka.ms/qnamaker-docs-createkb).

* **Matching**: Once your knowledge base has been [trained and tested](https://aka.ms/qnamaker-docs-trainkb), you [publish](https://aka.ms/qnamaker-docs-publishkb) it. This enables an endpoint to your QnA Maker knowledge base, which you can then use in your bot or app. This endpoint accepts a user question and responds with the best question/answer match in the knowledge base, along with a confidence score for the match.

## QnA Maker architecture

The QnA Maker stack consists of the following parts:

1. **QnA Maker management services (control plane)**: The management experience for a QnA Maker knowledge base, which includes the initial creation, updating, training, and publishing. These activities can be done through the [portal](https://qnamaker.ai) or the [management APIs](https://aka.ms/qnamaker-v4-apis). The management services talk to the runtime component below.

2. **QnA Maker runtime (data plane)**: The data and runtime are deployed in the user's Azure subscription in a region of their choosing. Customer question/answer content is stored in [Azure Search](https://azure.microsoft.com/services/search/), and the runtime is deployed as an [App service](https://azure.microsoft.com/services/app-service/). Optionally, you can also choose to deploy an [Application insights](https://azure.microsoft.com/services/application-insights/) resource for analytics.

![Architecture](../media/qnamaker-overview-learnabout/architecture.png)

## Next steps

> [!div class="nextstepaction"]
> [Create a QnA Maker service](../how-to/set-up-qnamaker-service-azure.md)
