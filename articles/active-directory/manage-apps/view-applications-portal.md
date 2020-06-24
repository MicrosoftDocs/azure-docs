---
title: Quickstart - View tenant applications using Azure Active Directory
description: In this Quickstart, use the Azure portal to view the applications in your Azure Active Directory (Azure AD) tenant.
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 04/09/2019
ms.author: kenwith
ms.reviewer: arvinh
ms.custom: it-pro
ms.collection: M365-identity-device-management

---

# Quickstart: View your Azure Active Directory tenant applications

This quickstart uses the Azure portal to view the applications in your Azure Active Directory (Azure AD) tenant.

## Before you begin

To see results, you need to have at least one application in your Azure AD tenant. To add an application, see the [Add an application](add-application-portal.md) quickstart.

Sign in to the [Azure portal](https://portal.azure.com) as a global admin for your Azure AD tenant, a cloud application admin, or an application admin.

## Find the list of tenant applications

Your Azure AD tenant applications are viewable in the **Enterprise apps** section of the Azure portal.

To find your tenant applications:

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, select **Azure Active Directory**.
1. In the **Azure Active Directory** pane, select **Enterprise applications**.
1. From the **Application Type** drop-down menu, select **All Applications**, and choose **Apply**. A random sample of your tenant applications appears.
1. To view more applications, select **Load more** at the bottom of the list. Depending on the number of applications in your tenant, it might be easier to [search for a particular application](#search-for-a-tenant-application), instead of scrolling through the list.

## Select viewing options

Select options according to what you're looking for.

1. You can view the applications by **Application Type**, **Application Status**, and **Application visibility**.
1. Under **Application Type**, choose one of these options:

    - **Enterprise Applications** shows non-Microsoft applications.
    - **Microsoft Applications** shows Microsoft applications.
    - **All Applications** shows both non-Microsoft and Microsoft applications.

1. Under **Application Status**, choose **Any**, **Disabled**, or **Enabled**. The **Any** option includes both disabled and enabled applications.
1. Under **Application Visibility**, choose **Any**, or **Hidden**. The **Hidden** option shows applications that are in the tenant, but aren't visible to users.
1. After choosing the options you want, select **Apply**.

## Search for a tenant application

To search for a particular application:

1. In the **Application Type** menu, select **All applications**, and choose **Apply**.
1. Enter the name of the application you want to find. If the application has been added to your Azure AD tenant, it appears in the search results. This example shows that GitHub hasn't been added to the tenant applications.

    ![Example shows an app hasn't been added to the tenant](media/view-applications-portal/search-for-tenant-application.png)

1. Try entering the first few letters of an application name. This example shows all the applications that start with **Sales**.

    ![Example shows all apps that start with Sales](media/view-applications-portal/search-by-prefix.png)

## Next steps

In this quickstart, you learned how to view the applications in your Azure AD tenant. You learned how to filter the list of applications by application type, status, and visibility. You also learned how to search for a particular application.

Now that you've found the application you were looking for, you can continue to [Add more applications to your tenant](add-application-portal.md). Or, you can select the application to view or edit properties and configuration options. For example, you could configure single sign-on.

> [!div class="nextstepaction"]
> [Configure single sign-on](configure-single-sign-on-non-gallery-applications.md)
