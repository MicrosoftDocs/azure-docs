---
title: List your application in the Azure Active Directory application gallery | Microsoft Docs
description: Learn how to list an application that supports single sign-on in the Azure Active Directory app gallery
services: active-directory
documentationcenter: dev-center-name
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2018
ms.author: celested
ms.reviewer: elisol, bryanla
ms.custom: aaddev
---

# How to: List your application in the Azure Active Directory application gallery

## What is the Azure AD application gallery?

- Customers find the best possible single sign-on experience.
- Configuration of the application is simple and minimal.
- A quick search finds your application in the gallery.
- Free, Basic, and Premium Azure AD customers can all use this integration.
- Mutual customers get a step-by-step configuration tutorial.
- Customers who use SCIM can use provisioning for the same app.

## Prerequisites

- For Federated applications (Open ID and SAML/WS-Fed), the application must support the SaaS model for getting listed in Azure AD gallery. The enterprise gallery applications should support multiple customer configurations and not any specific customer.

- For Open ID Connect, the application should be multi-tenanted  and [Azure AD consent framework](consent-framework.md) should be properly implemented for the application. The user can send the login request to a common endpoint so that any customer can provide consent to the application. You can control user access based on the tenant ID and the user's UPN received in the token.

- For SAML 2.0/WS-Fed, your application needs to have the capability to do the SAML/WS-Fed SSO integration in SP or IDP mode. Please ensure this is working correctly before submitting the request.

- For password SSO, please ensure that your application supports form authentication so that password vaulting can be done to get single sign-on work as expected.

- For automatic user-provisioning requests, application should be listed in the gallery with single sign-on feature enabled using any of the federation protocol described above. You can request for SSO and User provisioning together on the portal, if it's not already listed.

## Submit the request in the portal

After you've tested that your application integration works with Azure AD, submit your request for access on our [Application Network Portal](https://microsoft.sharepoint.com/teams/apponboarding/Apps). If you have an Office 365 account, use that to sign in to this portal. If not, use your Microsoft account (such as Outlook or Hotmail) to sign in.

If the following page appears after sign in, contact the [Azure AD SSO Integration Team](<mailto:SaaSApplicationIntegrations@service.microsoft.com>) and provide the email account which you want to use for submitting the request. Then Azure AD team will add the account in the Microsoft Application Network Portal.

![Access Request on SharePoint portal](./media/howto-app-gallery-listing/errorimage.png)

Once the account is added, you can sign in to the Microsoft Application Network Portal.

And if the following page appears after sign in, provide a business justification for needing access in the text box, and then select **Request Access**.

  ![Access Request on SharePoint portal](./media/howto-app-gallery-listing/accessrequest.png)

Our team reviews the details and gives you access accordingly. Once your request is approved, you can sign in to the portal and submit the request by clicking the **Submit Request (ISV)** tile form the home page.

![SharePoint portal Home page](./media/howto-app-gallery-listing/homepage.png)

> [!NOTE]
> If you have any issues regarding access, contact the [Azure AD SSO Integration Team](<mailto:SaaSApplicationIntegrations@service.microsoft.com>).

## Implementing SSO using federation protocol

To list an application in the Azure AD app gallery, you first need to implement one of the following federation protocols supported by Azure AD and agree with Azure AD application Gallery terms and conditions. Read the terms and conditions of the Azure AD application gallery from [here](https://azure.microsoft.com/support/legal/active-directory-app-gallery-terms/).

- **OpenID Connect**: To integrate your application with Azure AD using the Open ID Connect protocol, follow the [developers' instructions](authentication-scenarios.md).

    ![TimeLine of listing OpenID Connect application into the gallery](./media/howto-app-gallery-listing/openid.png)

    * If you want to add your application to list in the gallery using OpenID Connect, select **OpenID Connect & OAuth 2.0** as above.
    * If you have any issues regarding access, contact the [Azure AD SSO Integration Team](<mailto:SaaSApplicationIntegrations@service.microsoft.com>). 

*   **SAML 2.0** or **WS-Fed**: If your app supports SAML 2.0, you can integrate it directly with an Azure AD tenant by using the [instructions to add a custom application](../active-directory-saas-custom-apps.md).

    ![TimeLine of listing SAML 2.0 or WS-Fed application into the gallery](./media/howto-app-gallery-listing/saml.png)

    * If you want to add your application to list in the gallery using **SAML 2.0** or **WS-Fed**, select **SAMl 2.0/WS-Fed** as above.
    * If you have any issues regarding access, contact the [Azure AD SSO Integration Team](<mailto:SaaSApplicationIntegrations@service.microsoft.com>).

## Implementing SSO using password SSO

Create a web application that has an HTML sign-in page to configure [password-based single sign-on](../manage-apps/what-is-single-sign-on.md). Password-based SSO, also referred to as password vaulting, enables you to manage user access and passwords to web applications that don't support identity federation. It is also useful for scenarios in which several users need to share a single account, such as to your organization's social media app accounts.

![TimeLine of listing Password SSO application into the gallery](./media/howto-app-gallery-listing/passwordsso.png)

* If you want to add your application to list in the gallery using Password SSO, select **Password SSO** as above.
* If you have any issues regarding access, contact the [Azure AD SSO Integration Team](<mailto:SaaSApplicationIntegrations@service.microsoft.com>).

## Update/Remove existing listing

To update or remove an existing application in the Azure AD app gallery, you first need to submit the request in the [Application Network Portal](https://microsoft.sharepoint.com/teams/apponboarding/Apps). If you have an Office 365 account, use that to sign in to this portal. If not, use your Microsoft account (such as Outlook or Hotmail) to sign in.

- Select the appropriate option as shown in the following image:

    ![TimeLine of listing saml application into the gallery](./media/howto-app-gallery-listing/updateorremove.png)

    * If you want to update an existing application, select **Update existing application listing**.
    * If you want to remove an existing application from the Azure AD gallery, select **Remove existing application listing**.
    * If you have any issues regarding access, contact the [Azure AD SSO Integration Team](<mailto:SaaSApplicationIntegrations@service.microsoft.com>). 

## Timelines

The timeline for the process of listing a SAML 2.0 or WS-Fed application in the gallery is 7-10 business days.

   ![TimeLine of listing saml application into the gallery](./media/howto-app-gallery-listing/timeline.png)

The timeline for the process of listing an OpenID Connect application in the gallery is 2-5 business days.

   ![TimeLine of listing saml application into the gallery](./media/howto-app-gallery-listing/timeline2.png)

The timeline for the process of listing the application in the gallery with user provisioning support is 40-45 business days.

   ![TimeLine of listing saml application into the gallery](./media/howto-app-gallery-listing/provisioningtimeline.png)

## Escalations

For any escalations, send email to the [Azure AD SSO Integration Team](mailto:SaaSApplicationIntegrations@service.microsoft.com)  which is SaaSApplicationIntegrations@service.microsoft.com and we'll respond as soon as possible.