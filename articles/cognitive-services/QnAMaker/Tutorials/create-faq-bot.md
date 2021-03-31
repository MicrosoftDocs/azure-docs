---
title: "Tutorial: Customize a FAQ bot with Azure Bot Service"
description: In this tutorial, create a no code FAQ Bot for production use cases with QnA Maker and Azure Bot Service.
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: tutorial
ms.author: diagarw
ms.date: 03/31/2021
---

## Managing data from multiple domains

You may encounter scenarios, when a bot is used by end users for answers across multiple domains. Take for example, an employee information bot, that has to cater to employees across multiple departments. At times, they might have the same questions but with different answers based on their department. 

You can design your bot to cater to the above scenario in the following ways:

1) Create a single knowledge base with defined scope for QnA pairs.
2) Creating a separate knowledge base for each domain.

### Create a single knowledge base with defined scope for QnA pairs.

In such scenarois, the ideal way to fetch an answer would be to scope QnAs by a domain and then pass on the domain as input when fetching the answer. In QnA Maker, we accomplish this, by defining metadata for QnA Pairs.

Take for example, the document. It was used to create the following knowledgebase. As you may see in the diagram below, 

### Creating a separate knowledge base for each domain.

