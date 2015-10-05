<properties
   pageTitle="Integrate Azure Active Directory SSO with existing apps | Microsoft Azure"
   description="Manage the SaaS apps you already use by enabling single sign-on authentication and user provisioning in Azure Active Directory."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="10/05/2015"
   ms.author="kgremban; liviodlc"/>

# Integrate Azure Active Directory SSO with existing apps

## Overview

Organizations are using more Software as a Service (SaaS) applications for productivity since cloud technology and tools are becoming more readily available. As the number of SaaS apps grows, it becomes challenging for the administrators to manage accounts and access rights, and for the users to remember their different passwords. Managing these applications individually creates extra work and is less secure. Employees who have to keep track of many passwords tend to use unsecure methods to remember them, either writing down passwords or using the same passwords across many accounts. And when a new employee arrives or one leaves, all their accounts must be individually provisioned or deprovisioned. Additionally, employees may start using SaaS apps for their work without going through IT, which means they are creating their own accounts on systems that the IT administrators haven't approved and aren't monitoring.

A solution for all of these challenges is single sign-on (SSO). It’s the simplest way to manage multiple apps and provide users with a consistent sign-on experience. Azure Active Directory (AD) provides a robust SSO solution and has many pre-integrated applications with tutorials for admins to quickly set up a new app and start provisioning users. For information about setting up new applications, take a look at [Deploying single sign-on using Azure Active Directory for newly added SaaS apps](https://acom-sandbox.azurewebsites.net/en-us/documentation/articles/active-directory-single-sign-on-newly-acquired-saas-apps/).   

When you first initiate SSO, however, you want to make sure that the SaaS apps that are already in use in your organization can be managed through the same portal. This unified management experience is not just for new apps, but should include all apps.

## How does Azure Active Directory integrate existing apps?

Azure AD allows for the integration of your existing apps and provisioned accounts. This can be done through two approaches. If the app is pre-integrated in the app gallery, you can go through that portal to set up apps and configure the settings to allow SSO. If the app is not in the gallery, you can still set up most apps in Azure AD as a custom app.  

In the case where users have created their own accounts for SaaS apps that aren’t managed by IT, the [Cloud App Discovery](active-directory-cloudappdiscovery-whatis.md) tool provides a solution. This tool monitors the web traffic to identify which apps are being used throughout the organization, and the number of people using each of them. IT can use this information to learn what apps the users prefer and decide which to integrate into Azure AD for SSO.

When you integrate an existing app into Azure AD, you’ll be able to map the users’ established application identities to their respective Azure AD identities.

## Other considerations

Setting up SSO for apps you already use is a different process than creating new accounts in new apps. Both admins and users will experience a change when the app is integrated into Azure AD.

### What will administrators have to know to set up single sign-on for apps already in use?

To set up SSO for an existing app, you need to have global administrator rights in both Azure AD and the SaaS application.

Since the application is already in use, you will need to link the user's established app identities to their respective Azure AD identities. It's important to know what this app uses for the unique identifier for sign-on, whether it's an email address, universal personal name (UPN), or username. This will be linked to the user's unique identifier in Azure AD. For more information about linking app identities with Azure AD identities, see [Customizing claims issued in the SAML token](http://social.technet.microsoft.com/wiki/contents/articles/31257.azure-active-directory-customizing-claims-issued-in-the-saml-token-for-pre-integrated-apps.aspx) and [Customizing attribute mappings for provisioning](active-directory-saas-customizing-attribute-mappings.md).

### How does this affect end users?

When you integrate SSO for an application that’s already in use, it’s important to realize that the user experience will be affected. For all apps, users will start using their Azure AD credentials to sign in. Additionally, they may need to use a different portal to access the applications. SSO for some applications can be done on the app’s own website, but for other apps user will have to go through a central app portal ([My Apps](myapps.microsoft.com) or [Office365](portal.office.com/myapps)) to sign in. Learn more about the different types of SSO and their user experiences in [What is application access and single sign-on with Azure Active Directoy](active-directory-appssoaccess-whatis.md).

## Next steps
- Learn more about [application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md)
- Find [tutorials on how to integrate SaaS apps](active-directory-saas-tutorial-list.md)
-	Add a custom app with [Azure AD Self-Service SAML configuration](http://blogs.technet.com/b/ad/archive/2015/06/17/bring-your-own-app-with-azure-ad-self-service-saml-configuration-gt-now-in-preview.aspx)
