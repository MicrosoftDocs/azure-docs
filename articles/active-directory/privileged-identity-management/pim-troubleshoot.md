---
title: Troubleshoot resource access denied in Privileged Identity Management
description: Learn how to troubleshoot system errors with roles in Microsoft Entra Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: pim
ms.date: 10/07/2021
ms.author: billmath
ms.reviewer: shaunliu
ms.collection: M365-identity-device-management
---

# Troubleshoot access to Azure resources denied in Privileged Identity Management

Are you having a problem with Privileged Identity Management (PIM) in Microsoft Entra ID? The information that follows can help you to get things working again.

## Access to Azure resources denied

### Problem

As an active owner or user access administrator for an Azure resource, you are able to see your resource inside Privileged Identity Management but can't perform any actions such as making an eligible assignment or viewing a list of role assignments from the resource overview page. Any of these actions results in an authorization error.

### Cause

This problem can happen when the User Access Administrator role for the PIM service principal was accidentally removed from the subscription. For the Privileged Identity Management service to be able to access Azure resources, the MS-PIM service principal should always have the [User Access Administrator role](../../role-based-access-control/built-in-roles.md#user-access-administrator) role assigned.

### Resolution

Assign the User Access Administrator role to the Privileged identity Management service principal name (MS–PIM) at the subscription level. This assignment should allow the Privileged identity Management service to access the Azure resources. The role can be assigned on a management group level or at the subscription level, depending on your requirements. For more information service principals, see [Assign an application to a role](../develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application).

## Next steps

- [License requirements to use Privileged Identity Management](subscription-requirements.md)
- [Securing privileged access for hybrid and cloud deployments in Microsoft Entra ID](../roles/security-planning.md?toc=/azure/active-directory/privileged-identity-management/toc.json)
- [Deploy Privileged Identity Management](pim-deployment-plan.md)
