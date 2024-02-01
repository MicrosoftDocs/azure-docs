---
title: Manage QnA Maker App - QnA Maker
description: QnA Maker allows multiple people to collaborate on a knowledge base. QnA Maker offers a capability to improve the quality of your knowledge base with active learning. One can review, accept or reject, and add without removing or changing existing questions.
ms.service: azure-ai-language
manager: nitinme
ms.author: jboback
author: jboback
ms.subservice: azure-ai-qna-maker
ms.topic: how-to
ms.date: 12/19/2023
ms.custom: ignite-fall-2021
---

# Manage QnA Maker app

QnA Maker allows you to collaborate with different authors and content editors by offering a capability to restrict collaborator access based on the collaborator's role.
Learn more about [QnA Maker collaborator authentication concepts](../concepts/role-based-access-control.md).

[!INCLUDE [Custom question answering](../includes/new-version.md)]

## Add Azure role-based access control (Azure RBAC)

QnA Maker allows multiple people to collaborate on all knowledge bases in the same QnA Maker resource. This feature is provided with [Azure role-based access control (Azure RBAC)](../../../role-based-access-control/role-assignments-portal.md).

## Access at the cognitive resource level

You cannot share a particular knowledge base in a QnA Maker service. If you want more granular access control, consider distributing your knowledge bases across different QnA Maker resources, then add roles to each resource.

## Add a role to a resource

### Add a user account to the cognitive resource

You should apply RBAC controls to the QnA Maker resource.

The following steps use the collaborator role but any of the roles can be added using these steps

1. Sign in to the [Azure](https://portal.azure.com/) portal, and go to your cognitive resource.

    ![QnA Maker resource list](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-resource-list.png)

1. Go to the **Access Control (IAM)** tab.

    ![QnA Maker IAM](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam.png)

1. Select **Add**.

    ![QnA Maker IAM add](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam-add.png)

1. Select a role from the following list:

    |Role|
    |--|
    |Owner|
    |Contributor|
    |Cognitive Services QnA Maker Reader|
    |Cognitive Services QnA Maker Editor|
    |Cognitive Services User|

    :::image type="content" source="../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-add-role-iam.png" alt-text="QnA Maker IAM add role.":::

1. Enter the user's email address and press **Save**.

    ![QnA Maker IAM add email](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam-add-email.png)

### View QnA Maker knowledge bases

When the person you shared your QnA Maker service with logs into the [QnA Maker portal](https://qnamaker.ai), they can see all the knowledge bases in that service based on their role.

When they select a knowledge base, their current role on that QnA Maker resource is visible next to the knowledge base name.

:::image type="content" source="../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-knowledge-base-role-name.png" alt-text="Screenshot of knowledge base in Edit mode with role name in parentheses next to knowledge base name in top-left corner of web page.":::

## Next steps

> [!div class="nextstepaction"]
> [Create a knowledge base](./manage-knowledge-bases.md)
