---
title: Problem using self-service application access | Microsoft Docs 
description: Troubleshoot problems related to self-service application access
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 07/11/2017
ms.author: kenwith
ms.reviewer: japere,asteen
ms.collection: M365-identity-device-management
---

# Problem using self-service application access

Self-service application access is a great way to allow users to self-discover applications, optionally allow the business group to approve access to those applications. You can allow the business group to manage the credentials assigned to those users for Password Single-Sign On Applications right from their access panels.

Before your users can self-discover applications from their access panel, you need to enable **Self-service application access** to any applications that you wish to allow users to self-discover and request access to.

## General issues to check first

-   Make sure self-service application access is configured correctly. See “How to configure self-service application access”.

-   Make sure the user or group has been enabled to request self-service application access.

-   Make sure the user is visiting the correct place for self-service application access. users can navigate to their [Application Access Panel](https://myapps.microsoft.com/) and click the **+Add** button to find the apps to which you have enabled self-service access.

-   If self-service application access was just recently configured, try to sign in and out again into the user’s Access Panel after a few minutes to see if the self-service access changes have appeared.

## How to configure self-service application access

To enable self-service application access to an application, follow the steps below:

1. Open the [**Azure Portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you want to enable Self-service access to from the list.

7. Once the application loads, click **Self-service** from the application’s left hand navigation menu.

8. To enable Self-service application access for this application, turn the **Allow users to request access to this application?** toggle to **Yes.**

9. Next, to select the group to which users who request access to this application should be added, click the selector next to the label **To which group should assigned users be added?** and select a group.

10. **Optional:** If you wish to require a business approval before users are allowed access, set the **Require approval before granting access to this application?** toggle to **Yes**.

11. **Optional: For applications using password single-sign on only,** if you wish to allow those business approvers to specify the passwords that are sent to this application for approved users, set the **Allow approvers to set user’s passwords for this application?** toggle to **Yes**.

12. **Optional:** To specify the business approvers who are allowed to approve access to this application, click the selector next to the label **Who is allowed to approve access to this application?** to select up to 10 individual business approvers.

    >[!NOTE]
    > Groups are not supported.
    >
    >

13. **Optional:** **For applications which expose roles**, if you wish to assign self-service approved users to a role, click the selector next to the **To which role should users be assigned in this application?** to select the role to which these users should be assigned.

14. Click the **Save** button at the top of the blade to finish.

Once you complete Self-service application configuration, users can navigate to their [Application Access Panel](https://myapps.microsoft.com/) and click the **+Add** button to find the apps to which you have enabled Self-service access. Business approvers also see a notification in their [Application Access Panel](https://myapps.microsoft.com/). You can enable an email notifying them when a user has requested access to an application that requires their approval. 

These approvals support single approval workflows only, meaning that if you specify multiple approvers, any single approver may approve access to the application.

## If these troubleshooting steps do not resolve the issue 

open a support ticket with the following information if available:

-   Correlation error ID

-   UPN (user email address)

-   TenantID

-   Browser type

-   Time zone and time/timeframe during error occurs

-   Fiddler traces

## Next steps
[Setting up Azure Active Directory for self-service group management](../users-groups-roles/groups-self-service-management.md)
