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

If you get an authorization error when you try to make a user eligible for an Azure AD admin role and you are unable to access Azure resources under Privileged Identity Management, it might be that the User Access Administrator role for the MS-PIM service principal was accidentally removed from the subscription. You are unable to access Azure resources under Privileged Identity Management even if you are a Global admin and the owner of the subscription.

To assign roles, the MS-PIM service principal must be assigned the [User Access Administrator role](../../role-based-access-control/built-in-roles.md#user-access-administrator) in Azure role-based access control for Azure resource access (as opposed to Azure AD administration roles). Instead of waiting until MS-PIM is assigned the User Access Administrator role, you can assign it manually.

### Cause 

You can verify that the object ID from the above-mentioned error fbbc8e13-1019-4621-9309-a3b96552d645 is for the MS-PIM service principal in **ASC** > **Directory object** > **Object ID**.
For PIM service to be able to access Azure resources, MS-PIM SPN should always have a User Access Administrator role assigned on a subscription.

The below listed RBAC roles were missing for PIM service on a subscription.

### Resolution

Assign a User Access Administrator [Azure RBAC role](pim-configure.md) to the Privileged identity Management SPN (MS–PIM) at a subscription level. which should allow Privileged identity Management service to access the Azure resources. Note: The role can be assigned on a management group or subscription level based on the requirements and setup of the customer’s Azure AD organization.

Resolution Confirmed:

## Teams

Privileged Identity Management has a [TEAMS Announcement Channel](https://teams.microsoft.com/l/channel/19%3ae1bc90552baf4400a1c396482c8a89cd%40thread.skype/Announcements?groupId=56c43627-9135-4509-bfe0-50ebd0e47960&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47) where upcoming features or any changes done to the features are announced. This channel is where the Privileged Identity Management team shares information about fixes, on-going issues, and new features that you can expect in the future.

## Next steps

- [License requirements to use Privileged Identity Management](subscription-requirements.md)
- [Securing privileged access for hybrid and cloud deployments in Azure AD](../users-groups-roles/directory-admin-roles-secure.md?toc=%2fazure%2factive-directory%2fprivileged-identity-management%2ftoc.json)
- [Deploy Privileged Identity Management](pim-deployment-plan.md)
