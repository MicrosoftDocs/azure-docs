<properties
   pageTitle="Integrate Azure Active Directory single sign-on with newly acquired apps |  Microsoft Azure"
   description="Azure Active Directory supports single-sign for newly acquired SaaS apps to enable centralized access management in the Azure portal"
   services="active-directory"
   documentationCenter=""
   authors="curtand"
   manager="stevenpo"
   editor=""/>

   <tags
      ms.service="active-directory"
      ms.devlang="na"
      ms.topic="article"
      ms.tgt_pltfrm="na"
      ms.workload="identity"
      ms.date="10/09/2015"
      ms.author="curtand"/>

# Integrate Azure Active Directory single sign-on with newly acquired apps  

[AZURE.INCLUDE [active-directory-sso-use-case-intro](../../includes/active-directory-sso-use-case-intro.md)]

To get started setting up single sign-on for an app that you’re bringing into your organization, you will be using an existing directory in Azure Active Directory. You can use an Azure AD directory that you obtain through Microsoft Azure, Office 365, or Windows Intune. If you have two or more of these, see [Administer your Azure AD directory](active-directory-administer.md) to determine which one to use.

## Other considerations

### Authentication

For applications that support the SAML 2.0, WS-Federation, or OpenID Connect protocols, Azure Active Directory uses signing certificates to establish trust relationships. For more information about this, see [Managing certificates for federated single sign-on](active-directory-sso-certs.md).

For applications that support only HTML forms-based sign-in, Azure Active Directory uses ‘password vaulting’ to establish trust relationships. This enables the users in your organization to be automatically signed in to a SaaS application by Azure AD using the user account information from the SaaS application. Azure AD collects and securely stores the user account information and the related password. For more information, see [Password-based single sign-on\](active-directory-appssoaccess-whatis.md\#password-based-single-sign-on).

### Authorization

A provisioned account enables a user to be authorized to use an application after they have authenticated through single sign-on. User provisioning can be done manually, or in some cases you can add and remove user information from the SaaS app based on changes made in Azure Active Directory. For more information on using existing Azure AD connectors for automated provisioning, see  [Automated user provisioning and deprovisioning for SaaS applications](active-directory-saas-app-provisioning.md)

Otherwise, you can manually add user information to an app, or use other provisioning solutions that are available in the marketplace.

### Access

Azure AD provides several customizable ways to deploy applications to end-users in your organization. You are not locked into any particular deployment or access solution. You can use [the solution that best suits your needs](active-directory-appssoaccess-whatis.md#deploying-azure-ad-integrated-applications-to-users).

## Next steps

For SaaS apps already in your organization that you'd like to enable for single-sign-on, see [Integrate Azure Active Directory SSO with existing apps ](active-directory-sso-integrate-existing-apps.md)

For SaaS apps that you find in the App Gallery, Azure Active Directory provides a number of [tutorials on how to integrate SaaS apps](active-directory-saas-tutorial-list.md).

If app is not in App Gallery, you can [add it to the Azure Active Directory App Gallery as a custom
application](http://blogs.technet.com/b/ad/archive/2015/06/17/bring-your-own-app-with-azure-ad-self-service-saml-configuration-gt-now-in-preview.aspx).

There is much more detail on all of these issues in the Azure.com library,
beginning with [What is application access and single sign-on with Azure Active Directory.](active-directory-appssoaccess-whatis.md).
