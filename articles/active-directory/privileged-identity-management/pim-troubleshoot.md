---
title: Troubleshoot a problem with Privileged Identity Management - Azure Active Directory | Microsoft Docs
description: Learn how to troubleshoot system errors with roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
editor: ''
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: pim
ms.date: 10/18/2019
ms.author: curtand
ms.collection: M365-identity-device-management
---

# Troubleshoot a problem with Privileged Identity Management

Are you having a problem with Privileged Identity Management (PIM) in Azure Active Directory (Azure AD)? The information that follows can help you to get things working again.

## Access to Azure resources denied

### Problem

As an active owner or user access administrator for an Azure resource, you are able to see your resource inside Privileged Identity Management but can't perform any actions such as making an eligible assignment or viewing a list of role assignments from the resource overview page. Any of these actions results in an authorization error.

### Cause

This problem can happen when the User Access Administrator role for the PIM service principal was accidentally removed from the subscription. For the Privileged Identity Management service to be able to access Azure resources, the MS-PIM service principal should always have be assigned the [User Access Administrator role](../../role-based-access-control/built-in-roles.md#user-access-administrator) over the Azure subscription.

### Resolution

Assign the User Access Administrator role to the Privileged identity Management service principal name (MS–PIM) at the subscription level. This assignment should allow the Privileged identity Management service to access the Azure resources. The role can be assigned on a management group level or at the subscription level, depending on your requirements. For more information service principals, see [Assign an application to a role](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application).

## Next steps

- [License requirements to use Privileged Identity Management](subscription-requirements.md)
- [Securing privileged access for hybrid and cloud deployments in Azure AD](../users-groups-roles/directory-admin-roles-secure.md?toc=%2fazure%2factive-directory%2fprivileged-identity-management%2ftoc.json)
- [Deploy Privileged Identity Management](pim-deployment-plan.md)
