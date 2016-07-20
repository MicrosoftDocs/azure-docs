<properties
    pageTitle="Integrate Azure Active Directory single sign-on with SaaS apps |  Microsoft Azure"
    description="Enable single sign-on authentication and user provisioning centralized access management of SaaS apps in Azure Active Directory. An overview of how to integrate Azure Active Directory to SaaS apps."
    services="active-directory"
	  keywords="integrate Azure AD with SaaS apps"
    documentationCenter=""
    authors="curtand"
    manager="femila"
    editor=""/>

<tags
    ms.service="active-directory"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity"
    ms.date="07/20/2016"
    ms.author="curtand"/>

# Integrate Azure Active Directory single sign-on with SaaS apps  

[AZURE.INCLUDE [active-directory-sso-use-case-intro](../../includes/active-directory-sso-use-case-intro.md)]

To get started setting up single sign-on for an app that you’re bringing into your organization, you will be using an existing directory in Azure Active Directory (Azure AD). You can use an Azure AD directory that you obtain through Microsoft Azure, Office 365, or Windows Intune. If you have two or more of these, see [Administer your Azure AD directory](active-directory-administer.md) to determine which one to use.

## Authentication

For applications that support the SAML 2.0, WS-Federation, or OpenID Connect protocols, Azure Active Directory uses signing certificates to establish trust relationships. For more information about this, see [Managing certificates for federated single sign-on](active-directory-sso-certs.md).

For applications that support only HTML forms-based sign-in, Azure Active Directory uses ‘password vaulting’ to establish trust relationships. This enables the users in your organization to be automatically signed in to a SaaS application by Azure AD using the user account information from the SaaS application. Azure AD collects and securely stores the user account information and the related password. For more information, see [Password-based single sign-on](active-directory-appssoaccess-whatis.md\#password-based-single-sign-on).

## Authorization

A provisioned account enables a user to be authorized to use an application after they have authenticated through single sign-on. User provisioning can be done manually, or in some cases you can add and remove user information from the SaaS app based on changes made in Azure Active Directory. For more information on using existing Azure AD connectors for automated provisioning, see  [Automated user provisioning and de-provisioning for SaaS applications](active-directory-saas-app-provisioning.md)

Otherwise, you can manually add user information to an app, or use other provisioning solutions that are available in the marketplace.

## Access

Azure AD provides several customizable ways to deploy applications to end users in your organization. You are not locked into any particular deployment or access solution. You can use [the solution that best suits your needs](active-directory-appssoaccess-whatis.md#deploying-azure-ad-integrated-applications-to-users).

## Additional considerations for applications already in use

Setting up single sign on for an application that your organization already uses is a different process from the process of creating new accounts for a new application. There are a couple of preliminary steps including: mapping user identities in the application to Azure AD identities, and understanding how users will experience logging in to an application after it is integrated.

> [AZURE.NOTE] To set up SSO for an existing application, you need to have global administrator rights in both Azure AD and the SaaS application.

### Mapping user accounts

A user's identity typically has a unique identifier that could be an email address, or user principal name (UPN). You will need to link (map) each user's application identity to their respective Azure AD identity. There are a couple of ways to accomplish this depending on how the requirement of your application authentication.

For more information about mapping application identities with Azure AD identities, see [Customizing claims issued in the SAML token](http://social.technet.microsoft.com/wiki/contents/articles/31257.azure-active-directory-customizing-claims-issued-in-the-saml-token-for-pre-integrated-apps.aspx) and [Customizing attribute mappings for provisioning](active-directory-saas-customizing-attribute-mappings.md).

### Understanding the user's log in experience

When you integrate SSO for an application that’s already in use, it’s important to realize that the user experience will be affected. For all applications, users will start using their Azure AD credentials to sign in. It could also be that they must use a different portal to access the applications.

SSO for some applications can be done on the application's sign in interface, but for other applications, the user will have to go through a central portal such as ([My Apps](http://myapps.microsoft.com) or [Office365](http://portal.office.com/myapps)) to sign in. Learn more about the different types of SSO and their user experiences in [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

Another valuable resource is *Suppressing user consent* in the [Guiding developers](active-directory-applications-guiding-developers-for-lob-applications.md) article.

## Next steps


For SaaS apps that you find in the App Gallery, Azure AD provides a number of [tutorials on how to integrate SaaS apps](active-directory-saas-tutorial-list.md).

If app is not in App Gallery, you can [add it to the Azure AD App Gallery as a custom
application](http://blogs.technet.com/b/ad/archive/2015/06/17/bring-your-own-app-with-azure-ad-self-service-saml-configuration-gt-now-in-preview.aspx).

There is much more detail on all of these issues in the Azure.com library,
beginning with [What is application access and single sign-on with Azure Active Directory.](active-directory-appssoaccess-whatis.md).

## See also

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
