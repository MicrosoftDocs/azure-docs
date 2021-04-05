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

Take for example

are trying to create a Knowledgebase 

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

* Explicitly take the domain as input from the user through the bot interface. For instance, you can take as input from the user a product category they are interested in before they ask questions. 
If you are using Bot composer for conversation modelling, you can connect QnA Maker to your bot in composer and model it to take input from the user and 
* Identify domain based on any other input. For instance, in case of an empoloyee FAQ bot, you can identify department from employee id which can then be set as filter for metadata.
* Extract entity from user query to identify domain to be used for metadata filter. You can use other cognitive services such as Text Analytics and LUIS for entity extraction.

#### How large can our knowledgebases be? 

You add upto 50000 QnA pairs to a single knowledgebase. If your data exceeds 50,000 QnA pairs, you should consider splitting the knowledgebase.

### Create a separate knowledge base for each domain

You can also create a separate knowledge base for each domain, however you will then have to write some logic to decide which KB answers the user query. [All APIs](https://docs.microsoft.com/rest/api/cognitiveservices-qnamaker/QnAMaker4.0/Alterations) require for the user to pass on the Knowledgebase ID. As you can see in the Generate Answer API above, the KB id is passed on in the endpoint, and the user will have to pass that on along with the user query. Hence, we advise you to instead add all content in the same knowledgebase using metadata, instead of creating multiple knowledgebases.
