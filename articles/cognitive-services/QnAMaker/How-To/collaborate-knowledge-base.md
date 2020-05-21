---
title: Collaborating on knowledge base - QnA Maker
description: QnA Maker allows multiple people to collaborate on a knowledge base. This feature is provided with the Azure Role-Based Access Control.
ms.topic: conceptual
ms.date: 03/17/2020
---

# Collaboration with authors and editors

Collaboration is provided at the QnA Maker resource level to allow you to restrict collaborator access based on the collaborator's role. Learn more about QnA Maker collaborator authentication [concepts](../Concepts/role-based-access-control.md).

## Add role-based access (RBAC) to your QnA Maker resource

QnA Maker allows multiple people to collaborate on all knowledge bases in the same QnA Maker resource. This feature is provided with the Azure [Role-Based Access Control](../../../active-directory/role-based-access-control-configure.md).

## Access at the QnA Maker resource level

You cannot share a particular knowledge base in a QnA Maker service. If you want more granular access control, consider distributing your knowledge bases across different QnA Maker resources, then add roles to each resource.

## Add role to resource

### Add a user account to the QnA Maker resource

The following steps use the collaborator role but any of the [roles](../reference-role-based-access-control.md) can be added using these steps

1. Sign in to the [Azure](https://portal.azure.com/) portal, and go to your QnA Maker resource.

    ![QnA Maker resource list](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-resource-list.PNG)

1. Go to the **Access Control (IAM)** tab.

    ![QnA Maker IAM](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam.PNG)

1. Select **Add**.

    ![QnA Maker IAM add](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam-add.PNG)

1. Select a role from the following list:

    |Role|
    |--|
    |Owner|
    |Contributor|
    |QnA Maker Reader|
    |QnA Maker Editor|
    |Cognitive Services User|

    ![QnA Maker IAM add role](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam-add-role.PNG)

1. Enter the user's email address and press **Save**.

    ![QnA Maker IAM add email](../media/qnamaker-how-to-collaborate-knowledge-base/qnamaker-iam-add-email.PNG)

When the person you shared your QnA Maker service with logs into the [QnA Maker portal](https://qnamaker.ai), they can see all the knowledge bases in that service based on their role.

## Next steps

> [!div class="nextstepaction"]
> [Test a knowledge base](./test-knowledge-base.md)

Learn more about collaboration:
* [Azure](../../../active-directory/role-based-access-control-configure.md) role-based access control
* QnA Maker role-based access control [concepts](../Concepts/role-based-access-control.md)
