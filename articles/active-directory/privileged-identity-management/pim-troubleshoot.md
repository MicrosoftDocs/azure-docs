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

Are you having a problem with Privileged Identity Management in Azure Active Directory (Azure AD)? The information that follows can help you to get things working again.

## Access to Azure resources denied

### Problem

You get an authorization error when you try to make a user eligible for an Azure AD admin role and you are unable to access Azure resources under Privileged Identity Management, You are unable to access Azure resources under Privileged Identity Management even if you are a Global admin and the owner of the subscription.

### Cause

This can happen when the User Access Administrator role for the MS-PIM service principal name was accidentally removed from the subscription. To assign roles, the MS-PIM service principal must be assigned the [User Access Administrator role](../../role-based-access-control/built-in-roles.md#user-access-administrator) in Azure role-based access control for Azure resource access (Azure RBAC). For the Privileged Identity Management service to be able to access Azure resources,the MS-PIM service principal should always have a User Access Administrator role assigned on an Azure subscription.

### Resolution

Assign the User Access Administrator role to the Privileged identity Management service principal name (MS–PIM) at the subscription level, which should allow the Privileged identity Management service to access the Azure resources. Be aware that the role can be assigned on a management group level or at the subscription level, based on the requirements and setup of your Azure AD organization. For more information service principals, see [Assign an application to a role](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#assign-the-application-to-a-role).

## Team announcement channel

Privileged Identity Management has a [TEAMS Announcement Channel](https://teams.microsoft.com/l/channel/19%3ae1bc90552baf4400a1c396482c8a89cd%40thread.skype/Announcements?groupId=56c43627-9135-4509-bfe0-50ebd0e47960&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47) where upcoming features or any changes done to the features are announced. This channel is where the Privileged Identity Management team shares information about fixes, on-going issues, and new features that you can expect in the future.

## Next steps

- [License requirements to use Privileged Identity Management](subscription-requirements.md)
- [Securing privileged access for hybrid and cloud deployments in Azure AD](../users-groups-roles/directory-admin-roles-secure.md?toc=%2fazure%2factive-directory%2fprivileged-identity-management%2ftoc.json)
- [Deploy Privileged Identity Management](pim-deployment-plan.md)
