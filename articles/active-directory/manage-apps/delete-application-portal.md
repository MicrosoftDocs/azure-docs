---
title: 'Quickstart: Delete an application from your Azure Active Directory (Azure AD) tenant'
description: This quickstart uses the Azure portal to delete an application from your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 07/01/2020
ms.author: kenwith
---

# Quickstart: Delete an application from your Azure Active Directory (Azure AD) tenant

This quickstart uses the Azure portal to delete an application that was added to your Azure Active Directory (Azure AD) tenant.

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

## Delete an application from your Azure AD tenant

To delete an application from your Azure AD tenant:

1. In the Azure AD portal, select **Enterprise applications**. Then find and select the application you want to delete. In this case, we deleted the **GitHub_test** application that we added in the previous quickstart.
1. In the **Manage** section in the left pane, select **Properties**.
1. Select **Delete**, and then select **Yes** to confirm you want to delete the app from your Azure AD tenant.

> [!TIP]
> You can automate app management using the Graph API, see [Automate app management with Microsoft Graph API](https://docs.microsoft.com/graph/application-saml-sso-configure-api).

## Clean up resources

When your done with this quickstart series, consider deleting the app to clean up your test tenant. Deleting the app was covered in this quickstart.

## Next steps

You have completed the quickstart series! As a next step, read about best practices in app management.
> [!div class="nextstepaction"]
> [Application management best practices](application-management-fundamentals.md)
