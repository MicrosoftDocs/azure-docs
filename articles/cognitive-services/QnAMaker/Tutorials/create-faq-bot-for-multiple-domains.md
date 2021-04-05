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

Many a times, users would have similar questions but on a different domain. You can design your bot to handle queries across multiple domains with QnA Maker in the following ways:

* Create a single knowledge base and tag QnA pairs categorically with metadata.
* Create a separate knowledge base for each domain.

### Create a single knowledge base and tag QnA pairs categorically with metadata

The content authors can use documents/URLs to extract QnAs or add custom QnAs to the knowledgebase. In order to group these QnAs by a category, you can add metadata to the QnA pairs. 

Let's say are trying to create a Knowledgebase 


#### How large can our knowledgebases be? 

You can add upto 50k QnA pairs to a single knowledgebase for optimal performance. 

### Create a separate knowledge base for each domain

You can also create a separate knowledge base for each domain, however you will then have to write a logic to decide which KB answers the user query. All APIs require for the user to pass on the Knowledgebase ID. The content authors can update the different KBs directly from the portal. However, you will have to pass on the KB id to the generateAnswer API that returns response to the user query. As you can see in the Generate Answer API below, the KB id is passed on in the endpoint, and the user will have to pass that on along with the user query. Hence, we advise you to instead add all content in the same knowledgebase using metadata, instead of creating multiple knowledgebases.

The GenerateAnswer URL has the following format:
```
https://{QnA-Maker-endpoint}/knowledgebases/{knowledge-base-ID}/generateAnswer
```

### Content Authoring Access

If you want to grant different permissions for KB operations to content authors, you can do so by granting resource level acccess. For instance, if the user is granted the 'Publisher' role for a QnA Maker resource, he will be able to publish all knowledgebases in that resource. He will be able to update data across all domains. However, if your content authors require exlusive access for the different domains while editing knowledgebases on the portal, you should create a distinct QnA Maker resource for each domain.
