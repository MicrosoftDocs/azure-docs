---
title: Collaborate with others - QnA Maker
description: Learn how to collaborate with other authors and editors using Azure role-based access control.
ms.service: azure-ai-language
ms.subservice: azure-ai-qna-maker
ms.topic: conceptual
manager: nitinme
ms.author: jboback
author: jboback
ms.date: 05/15/2020
---

# Collaborate with other authors and editors

Collaborate with other authors and editors using Azure role-based access control (Azure RBAC) placed on your QnA Maker resource.

[!INCLUDE [Custom question answering](../includes/new-version.md)]

## Access is provided on the QnA Maker resource

All permissions are controlled by the permissions placed on the QnA Maker resource. These permissions align to read, write, publish, and full access. You can allow collaboration among multiple users by [updating RBAC access](../how-to/manage-qna-maker-app.md) for QnA Maker resource.

This Azure RBAC feature includes:
* Azure Active Directory (AAD) is 100% backward compatible with key-based authentication for owners and contributors. Customers can use either key-based authentication or Azure RBAC-based authentication in their requests.
* Quickly add authors and editors to all knowledge bases in the resource because control is at the resource level, not at the knowledge base level.

> [!NOTE]
> Make sure to add a custom subdomain for the resource. [Custom Subdomain](../../cognitive-services-custom-subdomains.md) should be present by default, but if not, please add it

## Access is provided by a defined role

[!INCLUDE [Azure RBAC permissions table](../includes/role-based-access-control.md)]

## Authentication flow

The following diagram shows the flow, from the author's perspective, for signing into the QnA Maker portal and using the authoring APIs.

> [!div class="mx-imgBorder"]
> ![The following diagram shows the flow, from the author's perspective, for signing into the QnA Maker portal and using the authoring APIs.](../media/qnamaker-how-to-collaborate-knowledge-base/rbac-flow-from-portal-to-service.png)

|Steps|Description|
|--|--|
|1|Portal Acquires token for QnA Maker resource.|
|2|Portal Calls the appropriate QnA Maker authoring API (APIM) passing the token instead of keys.|
|3|QnA Maker API validates the token.|
|4 |QnA Maker API calls QnAMaker Service.|

If you intend to call the [authoring APIs](../index.yml), learn more about how to set up authentication.

## Authenticate by QnA Maker portal

If you author and collaborate using the QnA Maker portal, after you add the appropriate role to the resource for a collaborator, the QnA Maker portal manages all the access permissions.

## Authenticate by QnA Maker APIs and SDKs

If you author and collaborate using the APIs, either through REST or the SDKs, you need to [create a service principal](../../authentication.md#assign-a-role-to-a-service-principal) to manage the authentication.

## Next step

* Design a knowledge base for languages and for client applications
