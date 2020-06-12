---
title: How to configure self-service application assignment | Microsoft Docs
description: Enable self-service application access to allow users to find their own applications
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
ms.topic: how-to
ms.date: 04/20/2020
ms.author: kenwith
ms.collection: M365-identity-device-management
---

# How to configure self-service application assignment

Before your users can self-discover applications from their My Apps access panel, you need to enable **Self-service application access** to any applications that you wish to allow users to self-discover and request access to. This functionality is available for applications that were added from the [Azure AD Gallery](https://docs.microsoft.com/azure/active-directory/manage-apps/add-gallery-app), [Azure AD Application Proxy](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy) or were added via [user or admin consent](https://docs.microsoft.com/azure/active-directory/develop/application-consent-experience). 

This feature is a great way for you to save time and money as an IT group, and is highly recommended as part of a modern applications deployment with Azure Active Directory.

Using this feature, you can:

-   Let users self-discover applications from the [My Apps access panel](https://myapps.microsoft.com/) without bothering the IT group.

-   Add those users to a pre-configured group so you can see who has requested access, remove access, and manage the roles assigned to them.

-   Optionally allow a business approver to approve application access requests so the IT group doesn’t have to.

-   Optionally configure up to 10 individuals who may approve access to this application.

-   Optionally allow a business approver to set the passwords those users can use to sign in to the application, right from the business approver’s [Application Access Panel](https://myapps.microsoft.com/).

-   Optionally automatically assign self-service assigned users to an application role directly.

> [!NOTE]
> An Azure Active Directory Premium (P1 or P2) license is required for users to request to join a self-service app and for owners to approve or deny requests. Without an Azure Active Directory Premium license, users cannot add self-service apps.

## Enable self-service application access to allow users to find their own applications

Self-service application access is a great way to allow users to self-discover applications, and optionally allow the business group to approve access to those applications. For password single-sign on applications, you can also allow the business group to manage the credentials assigned to those users from their own My Apps access panels.

To enable self-service application access to an application, follow the steps below:

1. Sign in to the [Azure portal](https://portal.azure.com) as a Global Administrator.

2. Select **Azure Active Directory**. In the left navigation menu, select **Enterprise applications**.

3. Select the application from the list. If you don't see the application, start typing its name in the search box. Or use the filter controls to select the application type, status, or visibility, and then select **Apply**.

4. In the left navigation menu, select **Self-service**.

5. To enable Self-service application access for this application, turn the **Allow users to request access to this application?** toggle to **Yes.**

6. Next to **To which group should assigned users be added?**, click **Select group**. Choose a group, and then click **Select**. When a user's request is approved, they'll be added to this group. When viewing this group's membership, you'll be able to see who has been granted access to the application through self-service access.
  
    > [!NOTE]
    > This setting doesn't support groups synchronized from on-premises.

7. **Optional:** To require business approval before users are allowed access, set the **Require approval before granting access to this application?** toggle to **Yes**.

8. **Optional: For applications using password single-sign on only,** to allow business approvers to specify the passwords that are sent to this application for approved users, set the **Allow approvers to set user’s passwords for this application?** toggle to **Yes**.

9. **Optional:** To specify the business approvers who are allowed to approve access to this application, next to **Who is allowed to approve access to this application?**, click **Select approvers**, and then select up to 10 individual business approvers. Then click **Select**.

    >[!NOTE]
    >Groups are not supported. You can select up to 10 individual business approvers. If you specify multiple approvers, any single approver can approve an access request.

10. **Optional:** **For applications that expose roles**, to assign self-service approved users to a role, next to the **To which role should users be assigned in this application?**, click **Select Role**, and then choose the role to which these users should be assigned. Then click **Select**.

11. Click the **Save** button at the top of the pane to finish.

Once you complete Self-service application configuration, users can navigate to their [My Apps access panel](https://myapps.microsoft.com/) and click the **Add self-service apps** button to find the apps that are enable with self-service access. Business approvers also see a notification in their [My Apps access panel](https://myapps.microsoft.com/). You can enable an email notifying them when a user has requested access to an application that requires their approval.

## Next steps
[Setting up Azure Active Directory for self-service group management](../users-groups-roles/groups-self-service-management.md)
