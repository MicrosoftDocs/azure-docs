---
title: Collaborating on knowledge base - QnA Maker
titleSuffix: Azure Cognitive Services
description: QnA Maker allows multiple people to collaborate on a knowledge base. This feature is provided with the Azure Role-Based Access Control.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: conceptual
ms.date: 01/03/2020
ms.author: diberry
---

# Collaborate on your knowledge base

QnA Maker allows multiple people to collaborate on all knowledge bases in the same QnA Maker resource. This feature is provided with the Azure [Role-Based Access Control](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure).

Perform the following steps to share your QnA Maker service with someone:

1. Sign in to the Azure portal, and go to your QnA Maker resource.

    ![QnA Maker resource list](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-resource-list.PNG)

1. Go to the **Access Control (IAM)** tab.

    ![QnA Maker IAM](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam.PNG)

1. Select **Add**.

    ![QnA Maker IAM add](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam-add.PNG)

1. Select the **Owner** or the **Contributor** role. You cannot grant read-only access through Role-Based Access Control. Owner and Contributor roles have read-write access permissions to the QnA Maker service.

    ![QnA Maker IAM add role](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam-add-role.PNG)

1. Enter the user's email address and press **Save**.

    ![QnA Maker IAM add email](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam-add-email.PNG)

When the person, you shared your QnA Maker service with, logs into the [QnA Maker portal](https://qnamaker.ai) they can see all the knowledge bases in that service.

Remember, you cannot share a particular knowledge base in a QnA Maker service. If you want more granular access control, consider distributing your knowledge bases across different QnA Maker services.

## Next steps

> [!div class="nextstepaction"]
> [Test a knowledge base](./test-knowledge-base.md)
