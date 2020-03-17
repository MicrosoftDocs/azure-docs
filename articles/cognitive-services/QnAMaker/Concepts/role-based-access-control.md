---
title: Collaborate with others - QnA Maker
description:
ms.topic: conceptual
ms.date: 03/17/2020
---

# Collaborate with other authors and editors

Collaborate with other authors and editors using role-based access control (RBAC) placed on your QnA Maker resource.

## Access is provided on the QnA Maker resource

All permissions are controlled by the permissions placed on the QnA Maker resource. These permissions align to read, write, publish, and full access.

This RBAC feature includes:
* AAD is 100% backward compatible with key-based authentication for owners and contributors. Customers can use either key or RBAC-based authentication in their requests.
* Quickly add authors and editors to all knowledge bases in the resource because control is at the resource level, not at the knowledge base level.

## Access is provided by a defined role

[!INCLUDE [RBAC permissions table](../includes/role-based-access-control.md)]

## Authentication flow

The following diagram shows the flow, from the author's perspective, for signing into the QnA Maker portal and using the authoring APIs.

> [!div class="mx-imgBorder"]
> ![The following diagram shows the flow, from the author's perspective, for signing into the QnA Maker portal and using the authoring APIs.](../media/qnamaker-how-to-collborate-knowledge-base/rbac-flow-from-portal-to-service.png)

|Steps|Description|
|--|--|
|1|Portal Acquires token for cognitive services resource.|
|2|Portal Calls the appropriate API passing the tokens instead of keys.|
|3|APIM validated the tokens.|
|4 |APIM calls QnAMaker Service like any regular service.|

Learn more about how to [set up authentication if you intend to call the authoring APIs](../How-To/collaborate-knowledge-base.md).

## Next step

* Design a knowledge base for [languages](design-language-culture.md) and for [client applications](integration-with-other-applications.md)