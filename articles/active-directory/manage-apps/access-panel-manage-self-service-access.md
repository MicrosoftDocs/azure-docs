---
title: How to use self-service application access in Azure AD
description: Enable self-service so users can find apps in Azure AD
services: active-directory
author: kenwith
manager: daveba
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 07/11/2017
ms.author: kenwith
ms.reviewer: japere,asteen
---

# How to use self-service application access

Before your users can self-discover applications from their My Apps page, you need to enable **Self-service application access** to any applications that you wish to allow users to self-discover and request access to.

This feature is a great way for you to save time and money as an IT group, and is highly recommended as part of a modern applications deployment with Azure Active Directory.

To learn about using My Apps from an end-user perspective, see [My Apps portal help](../user-help/my-apps-portal-end-user-access.md).

Using this feature, you can:

-   Let users self-discover applications from [My Apps](https://myapps.microsoft.com/) without bothering the IT group.
-   Add those users to a pre-configured group so you can see who has requested access, remove access, and manage the roles assigned to them.
-   Optionally allow someone to approve app access requests so the IT group doesn’t have to.
-   Optionally configure up to 10 individuals who may approve access to this application.
-   Optionally allow someone to set the passwords those users can use to sign in to the application.
-   Optionally automatically assign self-service assigned users to an application role directly.

## Enable self-service application access to allow users to find their own applications

Self-service application access is a great way to allow users to self-discover applications, optionally allow the business group to approve access to those applications. You can allow the business group to manage the credentials assigned to those users for Password Single-Sign On Applications right from their My Apps page.

To enable self-service application access to an application, follow the steps below:
1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**
2. Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.
3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.
4. Select **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.
5. Select **All Applications** to view a list of all your applications.
   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**
6. Select the application you want to enable Self-service access to from the list.
7. Once the application loads, select **Self-service** from the application’s left-hand navigation menu.
8. To enable Self-service application access for this application, turn the **Allow users to request access to this application?** toggle to **Yes.**
9. Next, to select the group to which users who request access to this application should be added, select the selector next to the label **To which group should assigned users be added?** and select a group.
10. **Optional:** If you wish to require a business approval before users are allowed access, set the **Require approval before granting access to this application?** toggle to **Yes**.
11. **Optional: For applications using password single-sign on only,** if you wish to allow those business approvers to specify the passwords that are sent to this application for approved users, set the **Allow approvers to set user’s passwords for this application?** toggle to **Yes**.
12. **Optional:** Specify the business approvers who are allowed to approve access to this app. Select **Who is allowed to approve access to this application?** Then select up to 10 individual business approvers.
    * Groups are not supported.
13. **Optional:** **For applications which expose roles**, if you wish to assign self-service approved users to a role, select the selector next to the **To which role should users be assigned in this application?** to select the role to which these users should be assigned.
14. Select the **Save** button at the top to finish.

Once you complete Self-service application configuration, users can navigate to [My Apps](https://myapps.microsoft.com/) and select the **+Add** button to find the apps to which you have enabled Self-service access. Business approvers also see a notification in their [My Apps](https://myapps.microsoft.com/) page. You can enable an email notifying them when a user has requested access to an application that requires their approval. 

These approvals support single approval workflows only, meaning that if you specify multiple approvers, any single approver may approve access to the application.

## Things to check if self-service isn't working
-   Make sure the user or group has been enabled to request self-service application access.
-   Make sure the user is visiting the correct place for self-service application access. users can navigate to their [My Apps](https://myapps.microsoft.com/) page and select the **+Add** button to find the apps to which you have enabled self-service access.
-   If self-service application access was recently configured, try to sign in and out again into the user’s My Apps after a few minutes to see if the self-service access changes have appeared.

## Next steps
[Setting up Azure Active Directory for self-service group management](../enterprise-users/groups-self-service-management.md)
