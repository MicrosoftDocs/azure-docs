---
title: 'Quickstart: View the list of applications that are using your Azure Active Directory (Azure AD) tenant for identity management'
description: In this Quickstart, use the Azure portal to view the list of applications that are registered to use your Azure Active Directory (Azure AD) tenant for identity management.
services: active-directory
author: kenwith
manager: daveba
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: quickstart
ms.date: 04/09/2019
ms.author: kenwith
ms.reviewer: arvinh
ms.custom: it-pro
---

# Quickstart: View the list of applications that are using your Azure Active Directory (Azure AD) tenant for identity management

Get started using Azure AD as your Identity and Access Management (IAM) system for the applications your organization uses. In this quickstart you will view the applications, also known as apps, that are already set up to use your Azure AD tenant as their Identity Provider (IdP).

## Prerequisites

To view applications that have been registered in your Azure AD tenant, you need:

- An Azure account. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

>[!IMPORTANT]
>We recommend using a non-production environment to test the steps in this quickstart.

## Find the list of applications in your tenant

The applications that are registered with your Azure AD tenant are viewable in the **Enterprise apps** section of the Azure portal.

To view the applications registered in your tenant:

1. Sign in to your [Azure portal](https://portal.azure.com).
2. On the left navigation panel, select **Azure Active Directory**.
3. In the **Azure Active Directory** pane, select **Enterprise applications**.
4. From the **Application Type** drop-down menu, select **All Applications**, and choose **Apply**. A random sample of your tenant applications appears.
5. To view more applications, select **Load more** at the bottom of the list. If there are numerous applications in your tenant, it might be easier to search for a particular application instead of scrolling through the list. Searching for a particular application is covered later in this quickstart.

## Select viewing options

Select options according to what you're looking for.

1. You can view the applications by **Application Type**, **Application Status**, and **Application visibility**.
2. Under **Application Type**, choose one of these options:
    - **Enterprise Applications** shows non-Microsoft applications.
    - **Microsoft Applications** shows Microsoft applications.
    - **All Applications** shows both non-Microsoft and Microsoft applications.
3. Under **Application Status**, choose **Any**, **Disabled**, or **Enabled**. The **Any** option includes both disabled and enabled applications.
4. Under **Application Visibility**, choose **Any**, or **Hidden**. The **Hidden** option shows applications that are in the tenant, but aren't visible to users.
5. After choosing the options you want, select **Apply**.

## Search for an application

To search for a particular application:

1. In the **Application Type** menu, select **All applications**, and choose **Apply**.
2. Enter the name of the application you want to find. If the application has been added to your Azure AD tenant, it appears in the search results. This example shows that GitHub hasn't been added to the tenant applications.
    ![Example shows an app hasn't been added to the tenant](media/view-applications-portal/search-for-tenant-application.png)
3. Try entering the first few letters of an application name. This example shows all the applications that start with **Sales**.
    ![Example shows all apps that start with Sales](media/view-applications-portal/search-by-prefix.png)


> [!TIP]
> You can automate app management using the Graph API, see [Automate app management with Microsoft Graph API](/graph/application-saml-sso-configure-api).


## Clean up resources

You did not create any new resources in this quickstart, so there is nothing to clean up.

## Next steps

Advance to the next article to learn how to use Azure AD as the identity provider for an app.
> [!div class="nextstepaction"]
> [Add an app](add-application-portal.md)