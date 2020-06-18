---
title: Unexpected application in my applications list | Microsoft Docs
description: How to see all applications in your tenant and understand how applications appear in your All Applications list under Enterprise Applications
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
ms.collection: M365-identity-device-management
---

# Unexpected application in my applications list

This article help you to understand how applications appear in your **All Applications** list under **Enterprise Applications**. 

## How to see all applications in your tenant

To see all the applications in your tenant, you need to use the **Filter** control to show **All Applications** under the **All Applications** list. Follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

6.  click the use the **Filter** control at the top of the **All Applications List**.

7.  On the **Filter** pane, set the **Show** option to **All Applications.**

## Why does a specific application appear in my all applications list?

When filtered to **All Applications**, the **All Applications** **List** shows every Service Principal object in your tenant. Service Principal objects can appear in this list in a various ways:

1. When you add any application from the application gallery, including:

   1. **Azure AD Gallery Applications** – An application that has been pre-integrated for single sign-on with Azure AD

   2. **Application Proxy Applications** – An application running in your on-premises environment that you want to provide secure single-sign on to externally

   3. **Custom-developed Applications** – An application that your organization wishes to develop on the Azure AD Application Development Platform, but that may not exist yet

   4. **Non-Gallery Applications** – Bring your own applications! Any web link you want, or any application that renders a username and password field, supports SAML or OpenID Connect protocols, or supports SCIM that you wish to integrate for single sign-on with Azure AD.

2. When signing up for, or signing in to, a 3<sup>rd</sup> party application integrated with Azure Active Directory. One example is [Smartsheet](https://app.smartsheet.com/b/home) or [DocuSign](https://www.docusign.net/member/MemberLogin.aspx).

3. When signing up for, or adding a license to a user or a group to a first party application, like [Microsoft Office 365](https://products.office.com/)

4. When you add a new application registration by creating a custom-developed application using the [Application Registry](https://docs.microsoft.com/azure/active-directory/active-directory-app-registration)

5. When you add a new application registration by creating a custom-developed application using the [V2.0 Application Registration portal](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-app-registration)

6. When you add an application you’re developing using Visual Studio’s [ASP.net Authentication Methods](https://www.asp.net/visual-studio/overview/2013/creating-web-projects-in-visual-studio#orgauthoptions) or [Connected Services](https://blogs.msdn.com/b/visualstudio/archive/2014/11/19/connecting-to-cloud-services.aspx)

7. When you create a service principal object using the [Azure AD PowerShell Module](/powershell/azure/install-adv2?view=azureadps-2.0)

8. When you [consent to an application](https://docs.microsoft.com/azure/active-directory/develop/active-directory-devhowto-multi-tenant-overview) as an administrator to use data in your tenant

9. When a [user consents to an application](https://docs.microsoft.com/azure/active-directory/develop/active-directory-devhowto-multi-tenant-overview) to use data in your tenant

10. When you enable certain services that store data in your tenant. One example is Password Reset, which is modeled as a service principal to store your password reset policy securely.

To get more details on how apps are added to your directory, read [How and why applications are added to Azure AD](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added).

## I want to remove a specific user’s or group’s assignment to an application

To remove a user or group assignment to an application, follow the steps listed in the [Remove a user or group assignment from an enterprise app in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-remove-assignment-azure-portal) article.

## I want to disable all access to an application for every user

To disable all user sign-ins to an application, follow the steps listed in the [Disable user sign-ins for an enterprise app in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-disable-app-azure-portal) article.

## I want to delete an application entirely

To **delete an application**, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you want to delete.

7. Once the application loads, click **Delete** icon from the top application’s **Overview** pane.

## I want to disable all future user consent operations to any application

Disabling user consent for your entire directory prevent end users from consenting to any application. Administrators can still consent on user’s behalf. To learn more about application consent, and why you may or may not want to consent, read [Understanding user and admin consent](https://docs.microsoft.com/azure/active-directory/develop/active-directory-devhowto-multi-tenant-overview).

To **disable all future user consent operations in your entire directory**, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Users and groups** in the navigation menu.

5.  click **User settings**.

6.  Disable all future user consent operations by setting the **Users can allow apps to access their data** toggle to **No** and click the **Save** button.

## Next steps
[Managing Applications with Azure Active Directory](what-is-application-management.md)
