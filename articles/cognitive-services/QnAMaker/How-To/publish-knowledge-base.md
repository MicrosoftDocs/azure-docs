---
title: Publish a knowledge base - QnA Maker
titleSuffix: Azure Cognitive Services
description: Publishing your knowledge base is the final step in making your knowledge base available as a question-answering endpoint. When you publish a knowledge base, the QnA contents of your knowledge base moves from the test index to a production index in Azure search.
services: cognitive-services
author: tulasim88
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/12/2018
ms.author: tulasim
---
# Publish a knowledge base

Publishing your knowledge base is the final step in making your knowledge base available as a question-answering endpoint. 

When you publish a knowledge base, the QnA contents of your knowledge base moves from the test index to a production index in Azure search.

![Publish prod test index](../media/qnamaker-how-to-publish-kb/publish-prod-test.png)

## Publish a knowledge base

1. Once done with the changes in your KB, select **Publish** in the top navigation bar. You can publish up to the allotted number of knowledge bases for the Azure Search. 

    ![Publish knowledge base](../media/qnamaker-how-to-publish-kb/publish.png)

2. Select **Publish** again to see the endpoint details that can be used in your application or bot code.

    ![Publish knowledge base](../media/qnamaker-how-to-publish-kb/publish-success.png)
	
## Next steps

> [!div class="nextstepaction"]
> [Get analytics on your knowledge base](./get-analytics-knowledge-base.md)
