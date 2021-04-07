---
title: "Tutorial: Create a FAQ bot for multiple domains with Azure Bot Service"
description: In this tutorial, create a no code FAQ Bot for production use cases with QnA Maker and Azure Bot Service.
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: tutorial
ms.author: diagarw
ms.date: 03/31/2021
---

# Create a FAQ Bot for multiple domains 

When building a FAQ bot, you may encounter use cases that require you to address queries across multiple domains. Take for example, the following scenarios:

* FAQ bot for employees across multiple departments such as HR, Marketing, Engineering, Sales, etc.
* FAQ bot for customers that are looking for information across multiple product categories.

You can design your bot to handle queries across multiple domains with QnA Maker in the following ways:

* Create a single knowledge base and tag QnA pairs into distinct domains with metadata.
* Create a separate knowledge base for each domain.

### Create a single knowledge base and tag QnA pairs into distinct domains with metadata.

The content authors can use documents/URLs to extract QnAs or add custom QnAs to the knowledgebase. In order to group these QnAs into specific domains or categories, you can add [metadata](../How-To/query-knowledge-base-with-metadata.md) to the QnA pairs.

Let's say the marketing team at Microsoft wants to build a FAQ bot that answers common user queries on all Surface Products. For the sake of simplicity here, we will be using a document each on [Surface Pen](https://support.microsoft.com/surface/how-to-use-your-surface-pen-8a403519-cd1f-15b2-c9df-faa5aa924e98) and [Surface Earbuds](https://support.microsoft.com/surface/use-surface-earbuds-aea108c3-9344-0f11-e5f5-6fc9f57b21f9) to create the Knowledge Base. You add both of these URLs in the STEP 3 of the Create KB page and click on 'Create your KB'. A new knowledgebase is created after extracting QnA Pairs from these sources. After having created the KB we can go to **View Options** and click on **Show metadata**.

Adding metadata to the knowlegdebase helps you define distinct domains for the QnA pairs. However, to restrict the system to search for a response across a particluar domain you would need to pass that domain as a strict filter in the generate Answer API. 

The GenerateAnswer URL has the following format:

```
https://{QnA-Maker-endpoint}/knowledgebases/{knowledge-base-ID}/generateAnswer
```

Remember to set the HTTP header property of `Authorization` with a value of the string `EndpointKey` with a trailing space then the endpoint key found on the **Settings** page.

An example JSON body looks like:

```json
{
    "question": "qna maker and luis",
    "top": 6,
    "isTest": true,
    "scoreThreshold": 30,
    "rankerType": ""  // values: QuestionOnly
    "strictFilters": [
    {
        "name": "category",
        "value": ""
    }],
    "userId": "sd53lsY="
}
```

You can obtain metadata to be passed based on user input in the following ways: 

* Explicitly take the domain as input from the user through the bot interface. For instance, you can take as input from the user a product category they are interested in before they ask questions. We use [Bot Framework](https://dev.botframework.com/) samples to create a bot for you from the portal. You can edit the Bot code to pass on metadata filter. You can refer the [bot sample](https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/49.qnamaker-all-features) to understand the underlying bot structure.
* Identify domain based on any other input. For instance, in case of an empoloyee FAQ bot, you can identify department from employee id which can then be set as filter for metadata.
* Extract entity from user query to identify domain to be used for metadata filter. You can use other cognitive services such as [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/how-tos/text-analytics-how-to-entity-linking?tabs=version-3-preview) and [LUIS](https://docs.microsoft.com/azure/cognitive-services/luis/what-is-luis) for entity extraction.

#### How large can our knowledgebases be? 

You add upto 50000 QnA pairs to a single knowledgebase. If your data exceeds 50,000 QnA pairs, you should consider splitting the knowledgebase.

### Create a separate knowledge base for each domain

You can also create a separate knowledge base for each domain, however you will then have to write some logic to decide which KB answers the user query. [All APIs](https://docs.microsoft.com/rest/api/cognitiveservices-qnamaker/QnAMaker4.0/Alterations) require for the user to pass on the Knowledgebase ID. As you can see in the Generate Answer API above, the KB id is passed on in the endpoint, and the user will have to pass that on along with the user query. Hence, we advise you to instead add all content in the same knowledgebase using metadata, instead of creating multiple knowledgebases.
