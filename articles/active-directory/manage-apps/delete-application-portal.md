---
title: 'Quickstart: Delete an application from your tenant'
titleSuffix: Azure AD
description: This quickstart uses the Azure portal to delete an application from your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: davidmu
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 07/23/2021
ms.author: davidmu
ms.reviewer: alamaral
---

# Quickstart: Delete an application from your tenant

This quickstart uses the Azure portal to delete an application that was added to your Azure Active Directory (Azure AD) tenant.

Learn more about SSO and Azure, see [What is Single Sign-On (SSO)](what-is-single-sign-on.md).

## Prerequisites

To delete an application from your Azure AD tenant, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- Optional: Completion of [View your apps](view-applications-portal.md).
- Optional: Completion of [Add an app](add-application-portal.md).
- Optional: Completion of [Configure an app](add-application-portal-configure.md).
- Optional: Completion of [Assign users to an app](add-application-portal-assign-users.md).
- Optional: Completion of [Set up single sign-on](add-application-portal-setup-sso.md).

>[!IMPORTANT]
>Use a non-production environment to test the steps in this quickstart.

> [!NOTE]
>To delete an application from Azure AD, a user must be assigned one of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.

## Delete an application from your Azure AD tenant

To delete an application from your Azure AD tenant:

1. In the Azure AD portal, select **Enterprise applications**. Then find and select the application you want to delete. In this case, we want to delete the **360 Online**.
1. In the **Manage** section in the left pane, select **Properties**.
1. Select **Delete**, and then select **Yes** to confirm you want to delete the app from your Azure AD tenant.

:::image type="content" source="media/add-application-portal/delete-application.png" alt-text="Screenshot of the Properties screen that shows how to change the logo.":::

> [!TIP]
> You can automate app management using the Graph API, see [Automate app management with Microsoft Graph API](/graph/application-saml-sso-configure-api).

## Clean up resources

When you are done with this quickstart series, consider deleting the app to clean up your test tenant. Deleting the app was covered in this quickstart.

## Next steps

You have completed the quickstart series! Next, learn about Single Sign-On (SSO), see [What is SSO?](what-is-single-sign-on.md) Or read about best practices in app management.
> [!div class="nextstepaction"]
> [Application management best practices](application-management-fundamentals.md)
