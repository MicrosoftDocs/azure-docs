---
title: Get default answer - QnA Maker
description: The default answer is returned when there is no match to the question. You may want to change the default answer from the standard default answer.
ms.topic: conceptual
ms.date: 01/10/2020
---

# Set default answer for a knowledge base

The default answer is returned when there is no match to the question. You may want to change the default answer from the standard default answer.

## Change Default Answer

1. Go to the [Azure portal](https://portal.azure.com) and navigate to the resource group that represents the QnA Maker service you created.

2. Click to open the **App Service**.

    ![In the Azure portal, access App service for QnA Maker](../media/qnamaker-concepts-confidencescore/set-default-response.png)

3. Click on **Application Settings** and edit the **DefaultAnswer** field to the desired default response. Click **Save**.

    ![Select Application Settings and then edit DefaultAnswer for QnA Maker](../media/qnamaker-concepts-confidencescore/change-response.png)

4. Restart your App service

    ![After you change the DefaultAnswer, restart the QnA Maker appservice](../media/qnamaker-faq/qnamaker-appservice-restart.png)

## Next steps

* [Create a bot with QnA Maker and LUIS](../tutorials/integrate-qnamaker-luis.md)