---
title: Collaborating on your knowledge base - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: How to collaborate on your QnAMaker knowledge base
services: cognitive-services
author: nstulasi
manager: sangitap
ms.service: cognitive-services
ms.component: QnAMaker
ms.topic: article
ms.date: 04/21/2018
ms.author: saneppal
---

# Collaborate on your knowledge base

QnA Maker allows multiple people to collaborate on a knowledge base. This feature is provided with the Azure [Role-Based Access Control](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-configure). 

To share your QnAMaker service with someone:
1. Log in to the Azure portal, and go to your QnAMaker resource.

    ![QnAMaker resource list](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-resource-list.PNG)

2. Go to the **Access Control (IAM)** tab.

    ![QnAMaker IAM](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam.PNG)

3. Click on **Add**

    ![QnAMaker IAM add](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam-add.PNG)

4. Select the **Owner** or the **Contributor** role.

    ![QnAMaker IAM add role](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam-add-role.PNG)

5. Enter the email you want to share with, and press save.

    ![QnAMaker IAM add email](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam-add-email.PNG)

Now when the person you shared your QnAMaker service with, logs into the [QnAMaker portal](https://qnamaker.ai) they can see all the knowledge bases in that service.

Remember, you cannot share a particular knowledge base in a QnAMaker service. If you want more granular access control, consider distributing your knowledge bases across different QnAMaker services.

## Next steps

> [!div class="nextstepaction"]
> [Test a knowledge base](./test-knowledge-base.md)
