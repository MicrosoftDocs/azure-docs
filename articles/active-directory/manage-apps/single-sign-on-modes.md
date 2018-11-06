---
title: How to determine what single-sign on method to use | Microsoft Docs
description: Understand the single sign-on modes supported by Azure AD and how to pick which one to choose for the application you are interested in.
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/09/2018
ms.author: barbkess

---

# How to determine what single-sign on method to use

This article help you to understand the single sign-on modes supported by Azure AD and how to pick which one to choose for the application you are interested in.

## Single sign-on and provisioning modes supported by specific application types

The following table describes the different single sign-on and provisioning modes supported by each of the preceding application types. You can use this table to help you to understand which application you need to add to support a specific goal.

  ![App types table](./media/single-sign-on-modes/table1.png)

## How to choose a single sign-on mode

Following are the supported **single sign-on** modes for Azure AD applications.

-   **Azure AD single sign-on disabled** – choose Azure AD single sign-on disabled **single sign-on mode** if you are not yet ready to integrate this application with single sign-on with Azure AD, or are simply testing it out

-   **Linked Sign-on** – choose the [Linked Sign-on](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis#how-does-single-sign-on-with-azure-active-directory-work) **single sign-on mode** if you have an application that is already connected with an existing single sign-on solution, or if you just want to publish a simple link for your users in their [Application Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction) or [Office 365 application launcher](https://login.microsoftonline.com/common/oauth2/authorize?response_mode=form_post&response_type=id_token&scope=openid&nonce=d508a995-f6d6-4b8a-81b8-825c71f1be46.636253878097046923&state=https%3a%2f%2fsupport.office.com%2farticle%2fMeet-the-Office-365-app-launcher-79f12104-6fed-442f-96a0-eb089a3f476a%3fui%3den-US%26rs%3den-US%26ad%3dUS&client_id=4b233688-031c-404b-9a80-a4f3f2351f90&redirect_uri=https%3a%2f%2fsupport.office.com%2fauth%2fsignin&login_hint=asteen%40microsoft.com&prompt=none)

-   **Password-based Sign-on** – choose the [Password-based Sign-on](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis#how-does-single-sign-on-with-azure-active-directory-work) **single sign-on mode** if your application renders an HTML username and password field and you want to store that username and password securely to be replayed to the application later

-   **SAML-based Sign-on** – choose the [SAML-based Sign-on](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis#how-does-single-sign-on-with-azure-active-directory-work) single-sign on mode if your application supports the SAML or OpenID Connect protocols, or you want to be able to map users to specific application roles based on rules you define in your SAML claims *(**Note:** this option is not available when the application proxy is configured for an application)*

-   **Header-based Sign-on** – choose this [Header-based Sign-on](https://docs.microsoft.com/azure/active-directory/application-proxy-ping-access#what-is-pingaccess-for-azure-ad) single sign-on mode if you have an application using PingAccess that supports HTTP-header-based authentication that you wish to perform single-sign on to *(**Note:** this option is only available when the application proxy and PingAccess are configured for an application)*

-   **Integrated Windows Authentication** – choose the [Integrated Windows Authentication](https://docs.microsoft.com/azure/active-directory/active-directory-application-proxy-sso-using-kcd) single-sign on mode when exposing an on-premises WIA application that you wish to perform single-sign on to *(**Note:** this option is only available when the application proxy is configured for an application)*

## Single sign-on modes for custom-developed applications

Applications you have custom developed through the [Custom-developed application](#_Custom-Developed_Applications) experience also support additional single sign-on modes not previously listed, which include:

-   [OAuth 2.0](https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-oauth-code) based sign-on

-   [OpenID Connect 1.0](https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-openid-connect-code) based sign-on

-   [WS-Federation 1.2](http://docs.oasis-open.org/wsfed/federation/v1.2/os/ws-federation-1.2-spec-os.html) based sign-on

-   [SAML 2.0](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-protocol-reference) based sign-on

Read the [Azure Active Directory developer’s guide](https://docs.microsoft.com/azure/active-directory/develop/active-directory-developers-guide) to learn more about how to create a custom-developed application which supports these single sign-on modes.

## How to set an application’s single sign-on mode

To set an application’s **single sign-on** mode, follow these instructions:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to configure single sign-on

7.  Once the application loads, click **Single sign-on** from the application’s left-hand navigation menu.

## Next steps
[Provide single sign-on to your apps with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md)

