---
title: Managing Azure AD roles in Privileged Identity Management (PIM) | Microsoft Docs
description: How to manage Azure AD roles for assignment Privileged Identity Management (PIM)
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/06/2019
ms.author: curtand
ms.custom: pim 
ms.collection: M365-identity-device-management


#Customer intent: As a dev, devops, or it admin, I want to learn how to manage Azure AD roles, so that I can grant access to resources using new capabilities.
---

# Management capabilities for Azure AD roles in Privileged Identity Management

The Azure AD Privileged Identity Management team has been hard at work over the past few months looking to provide customers enhanced management experience for Azure AD roles. If you have been using Privileged Identity Management for both Azure AD roles and Azure Resource roles, you may have recognized the slight discrepancy between the two where Privileged Identity Management for Azure resource roles have a couple of key features that are not available for Azure AD roles.

With the upcoming refresh, we are looking to merge the two so that Azure AD Privileged Identity Management for Azure AD Roles customers can get all the additional benefits available inside the Azure AD Privileged Identity Management for Azure Resources. This will also  create an extensible model that can eventually be used to manage role assignments beyond the roles that are available today. Learn more about the main features below: 

## Timebound Assignments

Previously in Privileged Identity Management for Azure AD roles, you were familiar of role assignments with two states – *eligible* and *permanent*. Now you have the power to set a start and end time for each type of assignments. This gives you four possible states in which you can place an assignment:

- Eligible, with specified start/end dates for assignment
- Eligible permanently
- Active, with specified start/end dates for assignment
- Active permanently (was called permanent)

In many cases, even if you don’t want users to have eligible assignment and activate roles every time, you might still want to protect your system by setting an expiration time for assignments. On the other hand, if you have some temporary users who are eligible, you should also consider setting an expiration time so that they get removed automatically from their role once their work is complete.

## New role settings

We are also adding new settings for Azure AD roles. Previously, you could only configure activation settings per role: the multi-factor authentication requirement for activation or and incident/request ticket requirement could be applied only to all users eligible for specific role. Now, you can configure whether a specific user needs to perform multi-factor authentication before they can make an activate role. Also, you can have advanced control over your Privileged Identity Management emails related to specific roles.

## Extend and renew assignments

As soon as you figure out timebound assignment, the first question you might ask is what happens if a role is expired? In this new version, we provide two options for this scenario:

- Extend – When a role assignment is nearing expiration, user can go to Azure AD Privileged Identity Management and request an extension for that role assignment
- Renew – When a role assignment has expired, user can go to Azure AD Privileged Identity Management and request a renewal for that role assignment

Both user-initiated actions require an approval from a Global administrator or Privileged role administrator. Admins will no longer need to be in the business of managing these expirations. They just need to wait for these extension/renewal requests and approve them if the request is valid.

## API changes

When customers have the updated version rolled out to their Azure AD organization, existing graph API will stop working. Customers must then transition to use the Graph API for Azure resource roles. To manage Azure AD roles using that API, simply swap “/azureResources” with “/aadroles” in the signature and use the Directory ID for the <resourceId>.

We have tried our best to reach out to all customers who are using the previous API to let them know about this change ahead of time. If your Azure AD organization was moved on to the new version and still depend on the old API, please reach out to the team at pim_preview@microsoft.com. IS THIS STILL RELEVANT?

## PowerShell change

For customers who are using the Privileged Identity Management PowerShell module for Azure AD roles, the PowerShell would stop working. In place of that commandlet, you will need to start using the Privileged Identity Management commands inside the Azure AD Preview PowerShell module. The commands are built on top of the graph API. Please refer to the previous section regarding documentation for graph API.

## Next steps

- [Assign an Azure AD custom role](azure-ad-custom-roles-assign.md)
- [Remove or update an Azure AD custom role assignment](azure-ad-custom-roles-update-remove.md)
- [Configure an Azure AD custom role assignment](azure-ad-custom-roles-configure.md)
- [Role definitions in Azure AD](../users-groups-roles/directory-assign-admin-roles.md)
