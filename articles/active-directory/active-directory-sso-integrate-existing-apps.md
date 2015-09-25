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
   ms.date="08/20/2015"
   ms.author="kgremban; liviodlc"/>

# Integrate Azure Active Directory SSO with existing apps

## Overview

With cloud technology and tools becoming more readily available, organizations are using more Software as a Service (SaaS) applications for productivity. As the number of SaaS apps grows, it becomes challenging for the administrators to manage accounts and access rights, and for the users to remember their different passwords. Managing these applications individually creates extra work and is less secure. Employees who have to keep track of many passwords tend to use unsecure methods to remember them—either keeping records or using similar passwords across many accounts. And when a new employee arrives or one leaves, all their accounts must be individually provisioned or deprovisioned. Additionally, employees may start using SaaS apps for their work without going through IT.

A solution for this is a single sign-on (SSO) system. It’s the simplest way to manage multiple apps and provide users with a consistent sign-on experience. Azure Active Directory (AD) provides a robust SSO solution and has many pre-integrated applications with tutorials for how to quickly set up a new app and start provisioning users. For information about setting up new applications, take a look at [Deploying single sign-on using Azure Active Directory for newly added SaaS apps](https://acom-sandbox.azurewebsites.net/en-us/documentation/articles/active-directory-single-sign-on-newly-acquired-saas-apps/).   

When you first initiate SSO, however, you want to make sure that the SaaS apps that are already in use in your organization can be managed through the same portal. This unified management experience is not just for new apps, but should include all apps.

## How does Azure Active Directory integrate existing apps?

Azure AD allows for the integration of your existing apps and provisioned accounts. This can be done through two approaches. If the app is one of those pre-integrated in the app gallery, you can go through that portal to set up apps and configure the settings to allow SSO. If the app is not in the gallery, you can still set up most apps in Azure AD as a custom app.  

In the case where users have created their own accounts for SaaS apps that aren’t managed by IT, the [Cloud App Discovery](active-directory-cloudappdiscovery-whatis.md) tool provides a solution. This tool monitors the web traffic to identify which apps are being used throughout the organization, and the number of people using each of them. IT can use this information to learn what apps the users prefer and decide which to integrate into Azure AD for SSO.

When you integrate an existing app into Azure AD, you’ll be able to map the users’ established application identities to their respective Azure AD identities.

## Other considerations

When you integrate SSO for an application that’s already in use, it’s important to realize that the user experience will be affected. For all apps, users will start using their Azure AD credentials to sign in. Additionally, they may need to use a different portal to access the applications. SSO for some applications can be done on the app’s own website, but for other apps user will have to go through their app portal to sign in.

## Next steps
- Learn more about [application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md)
- Find [tutorials on how to integrate SaaS apps](active-directory-saas-tutorial-list.md)
-	Add a custom app with [Azure AD Self-Service SAML configuration](http://blogs.technet.com/b/ad/archive/2015/06/17/bring-your-own-app-with-azure-ad-self-service-saml-configuration-gt-now-in-preview.aspx)
