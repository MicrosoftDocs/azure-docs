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

[AZURE.INCLUDE [active-directory-sso-use-case-intro](../../includes/active-directory-sso-use-case-intro.md)]

## Other considerations

Setting up SSO for apps you already use is a different process than creating new accounts in new apps. Both admins and users will experience a change when the app is integrated into Azure AD.

### What will administrators have to know to set up single sign-on for apps already in use?

To set up SSO for an existing app, you need to have global administrator rights in both Azure AD and the SaaS application.

Since the application is already in use, you will need to link the user's established app identities to their respective Azure AD identities. It's important to know what this app uses for the unique identifier for sign-on, whether it's an email address, universal personal name (UPN), or username. This will be linked to the user's unique identifier in Azure AD. For more information about linking app identities with Azure AD identities, see [Customizing claims issued in the SAML token](http://social.technet.microsoft.com/wiki/contents/articles/31257.azure-active-directory-customizing-claims-issued-in-the-saml-token-for-pre-integrated-apps.aspx) and [Customizing attribute mappings for provisioning](active-directory-saas-customizing-attribute-mappings.md).

### How does this affect end users?

When you integrate SSO for an application that’s already in use, it’s important to realize that the user experience will be affected. For all apps, users will start using their Azure AD credentials to sign in. Additionally, they may need to use a different portal to access the applications. SSO for some applications can be done on the app’s own website, but for other apps user will have to go through a central app portal ([My Apps](myapps.microsoft.com) or [Office365](portal.office.com/myapps)) to sign in. Learn more about the different types of SSO and their user experiences in [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Next steps
- See how to [integrate Azure Active Directory single sign-on with newly acquired apps](active-directory-sso-newly-acquired-saas-apps.md)
- Learn more about [application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md)
- Find [tutorials on how to integrate SaaS apps](active-directory-saas-tutorial-list.md)
-	Add a custom app with [Azure AD Self-Service SAML configuration](http://blogs.technet.com/b/ad/archive/2015/06/17/bring-your-own-app-with-azure-ad-self-service-saml-configuration-gt-now-in-preview.aspx)
