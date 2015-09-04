<properties
   pageTitle="Integrate Azure Active Directory SSO with existing apps | Microsoft Azure"
   description="Manage the SaaS apps you already use by enabling single sign-on authentication and user provisioning in Azure Active Directory."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="msStevenPo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="08/20/2015"
   ms.author="kgremban; liviodlc"/>

# Integrate Azure Active Directory single sign-on with existing apps

Microsoft Azure Active Directory (Azure AD) creates a unified access management experience for Software-as-a-Service (SaaS) applications. This article focuses on taking SaaS apps that are already in use in your organization and integrating them with Azure AD single sign-on (SSO). The article contains an introduction to SSO in Azure AD, and an overview of what you need to know about your existing SaaS app before you integrate it. For information about setting up new applications, take a look at [Deploying single sign-on using Azure Active Directory for newly added SaaS apps](active-directory-single-sign-on-newly-added-saas-app.md).

## How single sign-on works in Azure Active Directory

There are four topics you should know about when setting up SSO for applications in Azure AD:

### 1. Which apps work with Azure Active Directory

The [Active Directory Marketplace] contains all the applications that are pre-integrated for single sign-on and tutorials to set each of them up. If the app you're looking for isn't in that list, you can [add it to your app directory as a custom application](http://blogs.technet.com/b/ad/archive/2015/06/17/bring-your-own-app-with-azure-ad-self-service-saml-configuration-gt-now-in-preview.aspx). This works for any SaaS app that supports SAML 2.0 or has an HTML-based sign-in page.  

### 2. How users access the applications

With single sign-on, there are two basic methods for users to sign-in to the app.

1. **Service Provider (SP) initiated sign-in**: Users go directly to the app's website and sign in with their company credentials. The website sends an authentication request back to Azure AD.

2. **Identity Provider (IdP) initiated sign-in**: Users sign in to a central app portal ([My Apps](myapps.microsoft.com) or [Office365](portal.office.com/myapps)) with their company credentials, then launch apps from there.  

Some apps only work with one or the other method of sign-in, and this will be explained further in the next section.

### 3. How applications authenticate users

With single sign-on, users don't have to remember different credentials for each app they use because Azure AD provides their authentication. This can be done in a few different ways. Azure AD supports the following authentication methods:

1. **Federated single sign-on**

 Federated SSO works because Azure AD establishes a relationship of trust between the application and your directory. When users attempt to sign into the app, they are directed through their organization's sign-in page, hosted by Azure AD.

 This method can be implemented with applications that support protocols such as SAML 2.0, WS-Federation, or OpenID Connect, and is the richest mode of single sign-on. See our [list of gallery apps that are already enabled for federated SSO](http://social.technet.microsoft.com/wiki/contents/articles/20235.azure-active-directory-application-gallery-federated-saas-apps.aspx).

 Apps that support federated SSO can be accessed with either SP-initiated sign-in or IdP-initiated sign-in. It depends on what the app will allow.

2. **Password-based single sign-on**

 With password SSO, Azure AD acts as a password vault that securely stores users' credentials for various SaaS applications. Admins can assign passwords to individual users or have the users enter their existing credentials. When users need to access the app, users can use a [browser extension or the My Apps](active-directory-saas-access-panel-introduction.md#authentication) mobile app to automatically sign in. This method also supports shared access to apps which is important if multiple people need to use the same account.

 Password SSO works with almost all apps, as long as they support HTML forms-based sign in.  

 This method only supports IdP-initiated sign-in, so users will access the apps through an app portal.

If you already have a single sign-on solution, you can still integrate your apps with Azure AD. Instead of choosing one of the above SSO methods, set up your app with **Existing SSO**, and it will be available to the end user on the central app portal.

Learn more about these SSO solutions in [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

### 4. How application accounts are provisioned

Provisioning is the process of creating accounts for your users in the SaaS application. Accounts should also be deprovisioned after an employee leaves the company or changes positions. This is usually done manually, but for select apps, this process can be done automatically with [Azure AD's automated provisioning and deprovisioning](active-directory-saas-app-provisioning.md).

## What you need to know to enable single sign-on for your SaaS application

> [Azure.TIP]
You can create an inventory of all the apps your organization uses, including those that IT is not monitoring, with [Cloud App Discovery](active-directory-cloudappdiscovery-whatis.md).

Before you integrate a SaaS app into Azure AD, it's important to be familiar with how the app is currently configured, as that may affect how you set up SSO. You should be able to answer these questions:

### Do you have administrator rights for the application?

To set up SSO, you need to have global administrator rights in both Azure AD and the SaaS application. You will need to change the configuration of the app to accept SSO. The process for this varies among applications. Take a look at our [list of tutorials](active-directory-saas-tutorial-list.md) to learn how to configure different apps.

### How are the users currently provisioned?

Since the application is already in use, you will need to link the users' established application identities to their respective Azure AD identities. Apps can use different attributes for the unique identifier, like email addresses, Universal Personal Names (UPNs), or usernames.  It's important to know what the current unique identifier is so that you can line it up with that user's unique identifier in Azure AD.  

To learn more about the steps involved in linking app identities with Azure AD identities, see [Customizing claims issued in the SAML token](http://go.microsoft.com/fwlink/?LinkId=615928&clcid=0x409) and [Customizing Attribute Mappings for Provisioning](active-directory-saas-customizing-attribute-mappings.md).

### How do users currently access the application?

When you integrate SSO for an application that's already in use, it's important to understand how the users are accustomed to signing in. Depending on how you set up SSO, it may cause changes to the sign-in process. If the changes are significant, like switching from SP-initiated to IdP-initiated sign-in, you may need to train the users in the new method.  

## Next steps
See the [List of tutorials on how to integrate SaaS apps with Azure Active Directory](active-directory-saas-tutorial-list.md).
