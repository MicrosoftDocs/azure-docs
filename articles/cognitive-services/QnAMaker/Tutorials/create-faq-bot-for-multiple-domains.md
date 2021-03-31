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

* Create a single knowledge base and define distinct domains for QnA pairs.
* Create a separate knowledge base for each domain.

### Create a single knowledge base and define distinct domains for QnA pairs

The content authors can use documents/URLs to extract QnAs or add custom QnAs to the knowledgebase. In order to group these QnAs by domain, you can add metadata to the QnA pairs. 

### Create a separate knowledge base for each domain

You can also create a separate knowledge base for each domain, however you will then have to write a logic to decide which KB answers the user query. As you can see in the Generate Answer API below, the KB id is passed on in the endpoint, and the user will have to pass that on along with the user query. Hence, we advise you to instead add all content in the same knowledgebase using metadata, instead of creating multiple knowledgebases.


## Content Authoring flow

We currently define RBAC roles that will define permissions for all knowledgebases in the same QnA Maker resource. For instance, if the user is granted the 'Publisher' role, he will be able to 


Create a distinct QnA resource per domain

If the content developers need to have exclusive access per domain, you should create a separate QnA Maker resource for each domain that requires exclusive content authoring access. As we currently only support access control on resource level, similar permissions for a user will be applicable across all knowledge base in a single resource.

If creating multiple resources is not feasible, you can manage content via documents offline and then periodically import the updated documents 




