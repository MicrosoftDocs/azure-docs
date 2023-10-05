---
title: Reprocess requests for an access package in entitlement management
description: Learn how to reprocess a request for an access package in entitlement management.
services: active-directory
documentationCenter: ''
author: owinfreyatl
manager: amycolannino
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 08/24/2023
ms.author: owinfrey
ms.reviewer: 
ms.collection: M365-identity-device-management

#Customer intent: As a global administrator or access package manager, I want detailed information about how I can repreocess a request for an access package if a request failed so that requestors have the resources in the access package they need to perform their job.

---
# Reprocess requests for an access package in entitlement management

As an access package manager, you can automatically retry a user’s request for access to an access package at any time by using the reprocess functionality. Reprocessing eliminates the need for users to repeat the access package request process if their access to resources is not successfully provisioned.

> [!NOTE]
> You can reprocess a request for up to 14 days from the time that the original request is completed. For requests that were completed more than 14 days ago, users will need to cancel and make new requests in MyAccess.

This article describes how to reprocess requests for an existing access package.

## Prerequisites

To use entitlement management and assign users to access packages, you must have one of the following licenses:

- Microsoft Entra ID P2 or Microsoft Entra ID Governance
- Enterprise Mobility + Security (EMS) E5 license

## Open an existing access package and reprocess user requests

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

**Prerequisite role**: Global Administrator, Identity Governance Administrator, Catalog owner, Access package manager or Access package assignment manager

If you have a set of users whose requests are in the "Partially Delivered" or "Failed" state, you might need to reprocess some of those requests. Follow these steps to reprocess requests for an existing access package:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Identity Governance Administrator](../roles/permissions-reference.md#identity-governance-administrator).

1. Browse to **Identity governance** > **Entitlement management** > **Access package**.

1. On the **Access packages** open the access package.

1. Underneath **Manage** on the left side, select **Requests**.

1. Select all users whose requests you wish to reprocess.

1. Select **Reprocess**.

## Next steps

- [View requests for an access package](entitlement-management-access-package-requests.md)
- [Approve or deny access requests](entitlement-management-request-approve.md)
