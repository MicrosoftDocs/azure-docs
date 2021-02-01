---
title: 'Quickstart: Assign users to an app that uses Azure Active Directory as an identity provider'
description: This quickstart walks through the process of allowing users to use an app that you have setup to use Azure AD as an identity provider.
services: active-directory
author: kenwith
manager: daveba
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 09/01/2020
ms.author: kenwith
---

# Quickstart: Assign users to an app that is using Azure AD as an identity provider

In the previous quickstart, you configured the properties for an app. When you set the properties you configured the experience for both assigned and unassigned users. This quickstart walks through the process of assigning users to the app.

## Prerequisites

To assign users to an app that you added to your Azure AD tenant, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- Optional: Completion of [View your apps](view-applications-portal.md).
- Optional: Completion of [Add an app](add-application-portal.md).
- Optional: Completion of [Configure an app](add-application-portal-configure.md).

>[!IMPORTANT]
>Use a non-production environment to test the steps in this quickstart.

## Assign users to an app
1. In the Azure AD portal, select **Enterprise applications**. Then find and select the application you want to configure.
2. In the left navigation menu, select **Users and groups**.
   > [!NOTE]
   > Some of the Microsoft 365 apps require the use of PowerShell. 
3. Select the **Add user** button.
4. On the **Add Assignment** pane, select **Users and groups**.
5. Select the user or group you want to assign to the application. You can also start typing the name of the user or group in the search box. You can choose multiple users and groups, and your selections will appear under **Selected items**.
    > [!IMPORTANT]
    > When you assign a group to an application, only users in the group will have access. The assignment does not cascade to nested groups.

    > [!NOTE]
    > Group-based assignment requires Azure Active Directory Premium P1 or P2 edition. Group-based assignment is supported for Security groups only. Nested group memberships and Microsoft 365 groups are not currently supported. For more licensing requirements for the features discussed in this article, see the [Azure Active Directory pricing page](https://azure.microsoft.com/pricing/details/active-directory). 
6. When finished, choose **Select**.
   ![Assign a user or group to the app](./media/assign-user-or-group-access-portal/assign-users.png)
7. On the **Users and groups** pane, select one or more users or groups from the list and then choose the **Select** button at the bottom of the pane.
8. If the application supports it, you can assign a role to the user or group. On the **Add Assignment** pane, choose **Select Role**. Then, on the **Select Role** pane, choose a role to apply to the selected users or groups, then select **OK** at the bottom of the pane. 
    > [!NOTE]
    > If the application doesn't support role selection, the default access role is assigned. In this case, the application manages the level of access users have.
9. On the **Add Assignment** pane, select the **Assign** button at the bottom of the pane.

You can unassign users or groups using the same procedure. Select the user or group you want to unassign and then select **Remove**. Some of the Microsoft 365 and Office 365 apps require the use of PowerShell. 

## Clean up resources

After you're done with the quickstart, consider deleting the app. That way you can keep your test tenant clean. Deleting the app is covered in the last quickstart in this series, see [Delete an app](delete-application-portal.md).

## Next steps

Advance to the next article to learn how to set up single sign-on for an app.
> [!div class="nextstepaction"]
> [Set up SAML-based single sign-on](add-application-portal-setup-sso.md)

OR

> [!div class="nextstepaction"]
> [Set up OIDC-based single sign-on](add-application-portal-setup-oidc-sso.md)
