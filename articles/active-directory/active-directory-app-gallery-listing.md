<properties
   pageTitle="Listing your application in the Azure Active Directory application gallery"
   description="How to list an application that supports single sign-on in the Azure Active Directory gallery | Microsoft Azure"
   services="active-directory"
   documentationCenter="dev-center-name"
   authors="msmbaldwin"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="05/31/2016"
   ms.author="mbaldwin"/>


# Listing your application in the Azure Active Directory application gallery

To list an application that supports single sign-on with Azure Active Directory in the [Azure AD gallery](https://azure.microsoft.com/marketplace/active-directory/all/), the application first needs to implement one of the following integration modes:

* **OpenID Connect** - Direct integration with Azure AD using OpenID Connect for authentication and the Azure AD consent API for configuration. If you are just starting an integration and your application does not support SAML, then this is the recommend mode.

* **SAML** – Your application already has the ability to configure third-party identity providers using the SAML protocol.

Listing requirements for each mode are below.

##OpenID Connect Integration

To integrate your application with Azure AD, following the [developer instructions](active-directory-authentication-scenarios.md). Then complete the questions below and send to waadpartners@microsoft.com.

* Provide credentials for a test tenant or account with your application that can be used by the Azure AD team to test the integration.  

* Provide instructions on how the Azure AD team can sign in and connect an instance of Azure AD to your application using the [Azure AD consent framework](active-directory-integrating-applications.md#overview-of-the-consent-framework). 

* Provide any further instructions required for the Azure AD team to test single sign-on with your application. 

* Provide the info below:

> Company Name:
> 
> Company Website:
> 
> Application Name:
> 
> Application Description (256 character limit):
> 
> Application Website (informational):
> 
> Application Technical Support Website or Contact Info:
> 
> Client ID of the application, as shown in the application details at https://manage.windowsazure.com:
> 
> Application Sign-Up URL where customers go to sign up for and /or purchase the application:
> 
> Choose up to three categories for your application to be listed under (for available categories see the Azure Active Directory Marketplace):
> 
> Attach Application Small Icon (PNG file, 45px by 45px, solid background color):
> 
> Attach Application Large Icon (PNG file, 215px by 215px, solid background color):
> 
> Attach Application Logo (PNG file, 150px by 122px, transparent background color):

##SAML Integration

Any app that supports SAML 2.0 can be integrated directly with an Azure AD tenant using [these instructions to add a custom application](active-directory-saas-custom-apps.md). Once you have tested that your application integration works with Azure AD, send the following information to <waadpartners@microsoft.com>.

* Provide credentials for a test tenant or account with your application that can be used by the Azure AD team to test the integration.  

* Provide the SAML Sign-On URL, Issuer URL (entity ID), and Reply URL (assertion consumer service) values for your application, as described [here](active-directory-saas-custom-apps.md). If you typically provide these values as part of a SAML metadata file, then please send that as well.

* Provide a brief description of how to configure Azure AD as an identity provider in your application using SAML 2.0. If your application supports configuring Azure AD as an identity provider through a self-service administrative portal, then please ensure the credentials provided above include the ability to set this up.

* Provide the info below:

> Company Name:
> 
> Company Website:
> 
> Application Name:
> 
> Application Description (256 character limit):
> 
> Application Website (informational):
> 
> Application Technical Support Website or Contact Info:
> 
> Application Sign-Up URL where customers go to sign up for and /or purchase the application:
> 
> Choose up to three categories for your application to be listed under (for available categories see the [Azure Active Directory Marketplace](https://azure.microsoft.com/marketplace/active-directory/))):
> 
> Attach Application Small Icon (PNG file, 45px by 45px, solid background color):
> 
> Attach Application Large Icon (PNG file, 215px by 215px, solid background color):
> 
> Attach Application Logo (PNG file, 150px by 122px, transparent background color):
