---
title: Listing your application in the Azure Active Directory application gallery
description: How to list an application that supports single sign-on in the Azure Active Directory gallery | Microsoft Azure
services: active-directory
documentationcenter: dev-center-name
author: bryanla
manager: mbaldwin
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/09/2018
ms.author: bryanla
ms.custom: aaddev

---
# Listing your application in the Azure Active Directory application gallery


##	What is Azure AD app gallery?

Azure AD is a cloud-based Identity service. [Azure AD app gallery](https://azure.microsoft.com/marketplace/active-directory/all/) is a common store where all the application connectors are published for single sign-on and user provisioning. Our mutual customers who are using Azure AD as Identity provider look for different SaaS application connectors, which are published here. IT administrator adds connector from the app gallery and configures and use it for Single sign-on and provisioning. Azure AD supports all major federation protocols like SAML 2.0, OpenID Connect, OAuth and WS-Fed for single sign-on. 

> [!NOTE]
> For provisioning, Azure AD support [Graph APIs](active-directory-graph-api.md) and [SCIM 1.0, 1.1 and 2.0](active-directory-scim-provisioning.md) protocol. 

## What are the benefits of listing the application in the gallery?

*  Provide best possible single sign-on experience to the customers.

*  Simple and minimum configuration of the application.

*  Customers can search the application and find it in the gallery. 

*  Any customer can use this integration irrespective of Azure AD SKU Free, Basic or Premium.

*  Step by step configuration tutorial for the mutual customers.

*  Enable the user provisioning for the same app if you are using SCIM.


##	What are the pre-requisites?

To list an application in the Azure AD gallery, the application first needs to implement one of the federation protocols supported by Azure AD. Read the terms and conditions of the Azure AD application gallery from here. If you are using: 

*   **OpenID Connect** - Create the multi-tenant application in Azure AD and implement [Azure AD consent framework](active-directory-integrating-applications.md#overview-of-the-consent-framework) for your application. Send the login request to common endpoint so that any customer can provide consent to the application. You can control the customer user access based on the tenant ID and user's UPN received in the token. To integrate your application with Azure AD, following the [developer instructions](active-directory-authentication-scenarios.md).

*   **SAML 2.0 or WS-Fed** – Your application should have a capability to do the SAML/WS-Fed SSO integration in SP or IDP mode. Any app that supports SAML 2.0 can be integrated directly with an Azure AD tenant using [these instructions to add a custom application](../active-directory-saas-custom-apps.md).

##	What about user-provisioning with SCIM?

Azure AD supports SCIM provisioning. We’re still working on our ability to publish “pre-integrated” SCIM connectors to our gallery, and haven’t yet announced or documented any path for app developers to get apps listed as “SCIM-compliant”. Unlike publishing apps that support SAML to the gallery, which is entirely file driven, our engineering team has to spend a couple weeks building & testing the authentication and setup experiences in portal.azure.com for each app-specific provisioning connector. We’re in the process of making SCIM app onboarding file driven like SAML, and once this is done we have a public process for onboarding.

## Submitting the request in the portal?

Once you have tested that your application integration works with Azure AD, you need to submit your request for access on our [Sharepoint Portal](https://microsoft.sharepoint.com/teams/apponboarding/apps/SitePages/Default.aspx).

Our team reviews all the details and will give you the access accordingly. After that you can log on to the portal and submit your detailed request for the application.


## Timelines
    
*   Process of listing SAML 2.0 or WS-Fed application into the gallery-

   ![TimeLine of listing saml application into the gallery](./media/active-directory-app-gallery-listing/timeline.png)

*   Process of listing OpenID Connect application into the gallery-

   ![TimeLine of listing saml application into the gallery](./media/active-directory-app-gallery-listing/timeline2.png)

## Escalations

For any escalations drop a mail to [SaaSApplicationIntegrations@service.microsoft.com](<mailto:SaaSApplicationIntegrations@service.microsoft.com>) and we get back to you ASAP.

