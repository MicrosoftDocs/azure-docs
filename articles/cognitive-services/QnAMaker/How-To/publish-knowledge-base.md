---
title: How to publish a knowledge base - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: How to publish a knowledge base 
services: cognitive-services
author: nstulasi
manager: sangitap
ms.service: cognitive-services
ms.component: QnAMaker
ms.topic: article
ms.date: 04/21/2018
ms.author: saneppal
---
# Publish a knowledge base

Publishing your knowledge base is the final step in making your knowledge base available as a question-answering endpoint. 

When you publish a knowledge base, the QnA contents of your knowledge base moves from the test index to a production index in Azure search.

![Publish prod test index](../media/qnamaker-how-to-publish-kb/publish-prod-test.png)

1. Once done with the changes in your KB, click on **Publish** in the top navigation bar. You can publish up to the allotted number of knowledge bases for the Azure Search. 

![Publish knowledge base](../media/qnamaker-how-to-publish-kb/publish.png)


2. Click **Publish** to see the endpoint details that can be used in your application or bot code.

![Publish knowledge base](../media/qnamaker-how-to-publish-kb/publish-success.png)
	
## Next steps

> [!div class="nextstepaction"]
> [Get analytics on your knowledge base](./get-analytics-knowledge-base.md)
