---
title: SAML single sign-on for on-premises applications with Application Proxy
description: Learn how to provide single sign-on for on-premises applications published through Application Proxy that are secured with SAML authentication.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman

ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/09/2019
ms.author: celested
ms.reviewer: japere
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# SAML single sign-on for on-premises applications with Application Proxy

You can provide single sign-on (SSO) for on-premises applications published through Application Proxy that are secured with SAML authentication. These applications must be able to consume SAML tokens issued by Azure Active Directory (Azure AD). The Application Proxy service will cache the SAML token and pass this to the backend application for validation.

SAML SSO with Application Proxy also works with the new SAML token encryption feature in public preview. For more info, see [Configure Azure AD SAML token encryption](howto-saml-token-encryption.md).

## Prerequisites

Before you can provide SSO for on-premises applications, make sure you have enabled Application Proxy and you have a connector installed. Follow the instructions in [Add an on-premises application for remote access through Application Proxy in Azure AD](application-proxy-add-on-premises-application.md) to learn how to do this and keep the following in mind when you're going through the tutorial:

* Publish your application according to the instructions in the tutorial. Make sure to select **Azure Active Directory** as the **Pre Authentication** method for your application (step 4 in [Add an on-premises app to Azure AD](application-proxy-add-on-premises-application.md#add-an-on-premises-app-to-azure-ad
)).
* Copy the **External URL** for the application.
* Add at least one user to the application and make sure the test account has access to the on-premises application.

## Set up SAML SSO

1. In the Azure portal, select **Azure Active Directory > Enterprise applications** and select the application from the list.
1. From the app's **Overview** page, select **Single sign-on**.
1. Select **SAML** as the single sign-on method.
1. In the **Set up Single Sign-On with SAML** page, edit the **Basic SAML Configuration** data and follow the steps in [Enter basic SAML configuration](configure-single-sign-on-non-gallery-applications.md#saml-based-single-sign-on) to configure SAML-based authentication for the application.
    * Make sure the **Reply URL** root matches, or is a path under the **External URL** for the on-premises application that you added for remote access through Application Proxy in Azure AD.

    ![Enter basic SAML configuration data](./media/application-proxy-configure-single-sign-on-onprem-apps/enter-basic-saml-configuration.png)

> [!NOTE]
> If the backend application expects the **Reply URL** to be the internal URL, you'll need to install the My Apps secure sign-in extension on users' devices. This extension will automatically redirect to the appropriate Application Proxy Service. To install the extension, see [My Apps secure sign-in extension](./user-help/active-directory-saas-access-panel-introduction.md#my-apps-secure-sign-in-extension).

## Test your app

When you've completed all these steps, your app should be up and running. To test the app:

1. Open a browser and navigate to the external URL that you created when you published the app. 
1. Sign in with the test account that you assigned to the app.

## Next steps

- [How does Azure AD Application Proxy provide single sign-on?](application-proxy-single-sign-on.md)
- [Troubleshoot Application Proxy](application-proxy-troubleshoot.md)
