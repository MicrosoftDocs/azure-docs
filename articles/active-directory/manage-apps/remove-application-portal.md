---
title: 'Quickstart - Remove an app to your Azure Active Directory tenant'
description: This quickstart uses the Azure portal to remove an application from your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 07/01/2020
ms.author: kenwith
ms.collection: M365-identity-device-management
---

# Quickstart: Remove an application from your Azure Active Directory tenant

Azure Active Directory (Azure AD) has a gallery that contains thousands of pre-integrated applications. Some of the applications your organization uses are probably in the gallery. This quickstart uses the Azure portal to add a gallery application to your Azure Active Directory (Azure AD) tenant.

After an application is added to your Azure AD tenant, you can:

- Manage user access to the application with a Conditional Access policy.
- Configure users to single sign-on to the application with their Azure AD accounts.

>[!IMPORTANT]
>We recommend using a non-production environment to test the steps in this quickstart.

## Remove an application from your Azure AD tenant

To add a gallery application to your Azure AD tenant:

1. In the [Azure portal](https://portal.azure.com), on the left navigation panel, select **Azure Active Directory**.

1. In the **Azure Active Directory** pane, select **Enterprise applications**. The **All applications** pane opens and displays a random sample of the applications in your Azure AD tenant.

1. To add a gallery app to your tenant, select **New application**. 

    ![Select New application to add a gallery app to your tenant](media/add-application-portal/new-application.png)

1. Switch to the new gallery preview experience: In the banner at the top of the **Add an application page**, select the link that says **Click here to try out the new and improved app gallery**.

1. The **Browse Azure AD Gallery (Preview)** pane opens and displays tiles for cloud platforms, on-premises applications, and featured applications. Note that the applications listed in the **Featured applications** section have icons indicating whether they support federated single sign-on (SSO) and provisioning.

    ![Search for an app by name or category](media/add-application-portal/browse-gallery.png)

1. You can browse the gallery for the application you want to add, or search for the application by entering its name in the search box. Then select the application from the results. In the form, you can edit the name of the application to match the needs of your organization. In this example we've changed the name to **GitHub-test**.

    ![Shows how to add an application from the gallery](media/add-application-portal/create-application.png)

1. Select **Create**. A getting started page appears with the options for configuring the application for your organization.

You've finished adding your application. The next quickstart shows you how to change the logo and edit other properties for your application.

## Next steps

- [Application management best practices](application-management-fundamentals.md)
- [Application management common scenarios](common-scenarios.md)
- [Application management visibility and control](cloud-app-security.md)