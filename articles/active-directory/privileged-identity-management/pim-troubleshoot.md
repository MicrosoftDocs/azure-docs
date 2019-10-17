---
title: Troubleshoot a problem with Privileged Identity Management - Azure Active Directory | Microsoft Docs
description: Learn how to troubleshoot system errors with roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: pim
ms.date: 04/09/2019
ms.author: curtand
ms.collection: M365-identity-device-management
---

# Troubleshoot a problem with Privileged Identity Management

Are you having a problem with Privileged Identity Management (PIM) in Azure Active Directory (Azure AD)? The information that follows can help you to get things working again.

## Access to Azure resources denied

### Problem

You get an authorization error when you try to make a user eligible for an Azure AD admin role and you are unable to access Azure resources under Privileged Identity Management. You are unable to access Azure resources under Privileged Identity Management even if you are a Global admin and the owner of the subscription.

### Cause

This problem can happen when the User Access Administrator role for the PIM service principal (service principal name MS-PIM) was accidentally removed from the subscription. For the Privileged Identity Management service to be able to access Azure resources, the MS-PIM service principal should always have be assigned the [User Access Administrator role](../../role-based-access-control/built-in-roles.md#user-access-administrator) over the Azure subscription.

### Resolution

Assign the User Access Administrator role to the Privileged identity Management service principal name (MS–PIM) at the subscription level. This assignment should allow the Privileged identity Management service to access the Azure resources. The role can be assigned on a management group level or at the subscription level, depending on your requirements. For more information service principals, see [Assign an application to a role](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#assign-the-application-to-a-role).

## Next steps

- [License requirements to use Privileged Identity Management](subscription-requirements.md)
- [Securing privileged access for hybrid and cloud deployments in Azure AD](../users-groups-roles/directory-admin-roles-secure.md?toc=%2fazure%2factive-directory%2fprivileged-identity-management%2ftoc.json)
- [Deploy Privileged Identity Management](pim-deployment-plan.md)
