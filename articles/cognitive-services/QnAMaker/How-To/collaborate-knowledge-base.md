---
title: Collaborating on knowledge base - QnA Maker
description: QnA Maker allows multiple people to collaborate on a knowledge base. This feature is provided with the Azure Role-Based Access Control.
ms.topic: conceptual
ms.date: 03/17/2020
---

# Collaboration with authors and editors

Collaboration is provided at the QnA Maker resource level in two different ways:

* **Authentication key** for owner and contributor roles. This is the original method of providing access. at subscription level 

* Authentication via **bearer tokens** for other roles. This is a newer method of providing access.

# Add role-based access (RBAC) to your QnA Maker resource

QnA Maker allows multiple people to collaborate on all knowledge bases in the same QnA Maker resource. This feature is provided with the Azure [Role-Based Access Control](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure).

## Access at the QnA Maker resource level

You cannot share a particular knowledge base in a QnA Maker service. If you want more granular access control, consider distributing your knowledge bases across different QnA Maker services.

## Use authentication key for owner and contributor

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

## Use bearer token for other roles

Bearer

## Next steps

> [!div class="nextstepaction"]
> [Test a knowledge base](./test-knowledge-base.md)
