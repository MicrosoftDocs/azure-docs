---
title: Managing Azure AD roles in Privileged Identity Management (PIM) | Microsoft Docs
description: How to manage Azure AD roles for assignment Privileged Identity Management (PIM)
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.subservice: pim
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/06/2019
ms.author: curtand
ms.custom: pim 
ms.collection: M365-identity-device-management


#Customer intent: As a dev, devops, or it admin, I want to learn how to manage Azure AD roles, so that I can grant access to resources using new capabilities.
---

# Management capabilities for Azure AD roles in Privileged Identity Management

The management experience for Azure AD roles in Privileged Identity Management has been updated to unify how Azure AD roles and Azure resource roles are managed. Previously, Privileged Identity Management for Azure resource roles has had a couple of key features that were not available for Azure AD roles.

With the update being currently rolled out, we are merging the two into a single management experience, and in it you get the same functionality for Azure AD roles as for Azure resource roles. This article informs you of the updated features and any requirements.


## Time-bound assignments

Previously in Privileged Identity Management for Azure AD roles, you were familiar with role assignments with two possible states – *eligible* and *permanent*. Now you can set a start and end time for each type of assignment. This addition gives you four possible states in which you can place an assignment:

- Eligible permanently
- Active permanently
- Eligible, with specified start/end dates for assignment
- Active, with specified start/end dates for assignment

In many cases, even if you don’t want users to have eligible assignment and activate roles every time, you can still protect your Azure AD organization by setting an expiration time for assignments. For example, if you have some temporary users who are eligible, consider setting an expiration so to remove them automatically from the role assignment when their work is complete.

## New role settings

We are also adding new settings for Azure AD roles. Previously, you could only configure activation settings on a per-role basis. That is, activation settings such as multi-factor authentication requirements and incident/request ticket requirements were applied to all users eligible for a specified role. Now, you can configure whether an individual user needs to perform multi-factor authentication before they can activate a role. Also, you can have advanced control over your Privileged Identity Management emails related to specific roles.

## Extend and renew assignments

As soon as you figure out time-bound assignment, the first question you might ask is what happens if a role is expired? In this new version, we provide two options for this scenario:

- Extend – When a role assignment nears its expiration, the user can use Privileged Identity Management to request an extension for that role assignment
- Renew – When a role assignment has expired, the user can use Privileged Identity Management to request a renewal for that role assignment

Both user-initiated actions require an approval from a Global administrator or Privileged role administrator. Admins will no longer need to be in the business of managing these expirations. They just need to wait for the extension or renewal requests and approve them if the request is valid.

## API changes

When customers have the updated version rolled out to their Azure AD organization, the existing graph API will stop working. You must transition to use the [Graph API for Azure resource roles](https://docs.microsoft.com/graph/api/resources/privilegedidentitymanagement-resources?view=graph-rest-beta). To manage Azure AD roles using that API, swap `/azureResources` with `/aadroles` in the signature and use the Directory ID for the `resourceId`.

We have tried our best to reach out to all customers who are using the previous API to let them know about this change ahead of time. If your Azure AD organization was moved on to the new version and you still depend on the old API, reach out to the team at pim_preview@microsoft.com.

## PowerShell change

For customers who are using the Privileged Identity Management PowerShell module for Azure AD roles, the PowerShell will stop working with the update. In place of the previous cmdlets you must use the Privileged Identity Management cmdlets inside the Azure AD Preview PowerShell module. Install the Azure AD PowerShell module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.17). You can now [read the documentation and samples for PIM operations in this PowerShell module](powershell-for-azure-ad-roles.md).

## Next steps

- [Assign an Azure AD custom role](azure-ad-custom-roles-assign.md)
- [Remove or update an Azure AD custom role assignment](azure-ad-custom-roles-update-remove.md)
- [Configure an Azure AD custom role assignment](azure-ad-custom-roles-configure.md)
- [Role definitions in Azure AD](../users-groups-roles/directory-assign-admin-roles.md)
