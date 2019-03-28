---
title: Publish a knowledge base
titleSuffix: QnA Maker API - Azure Cognitive Services
description: Publishing your knowledge base with QnA Maker API service is the final step to make your knowledge base available as a question-answering endpoint. When you publish a knowledge base, the QnA contents of your knowledge base moves from the test index to a production index in Azure search.
services: cognitive-services
author: tulasim88
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: article
ms.date: 03/11/2019
ms.author: tulasim
ms.custom: seodec18
---
# Publish a knowledge base using the QnA Maker API service portal

Publishing your knowledge base with QnA Maker API service is the final step to make your knowledge base available as a question-answering endpoint. 

When you publish a knowledge base, the question and answer contents of your knowledge base moves from the test index to a production index in Azure search.

![Publish prod test index](../media/qnamaker-how-to-publish-kb/publish-prod-test.png)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Publish a knowledge base

1. Once done with the changes in your KB, select **Publish** in the top navigation bar. You can publish up to the allotted number of knowledge bases for the Azure Search. 

    ![Publish knowledge base](../media/qnamaker-how-to-publish-kb/publish.png)

2. Select **Publish** again to see the endpoint details that can be used in your application or bot code.

    ![Successfully published knowledge base](../media/qnamaker-how-to-publish-kb/publish-success.png)
	
## Clean up resources

When you are done with the knowledge base, remove it in the QnA Maker portal.

## Next steps

> [!div class="nextstepaction"]
> [Get analytics on your knowledge base](./get-analytics-knowledge-base.md)
