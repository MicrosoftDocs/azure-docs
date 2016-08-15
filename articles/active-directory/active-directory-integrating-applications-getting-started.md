<properties
   pageTitle="Integrating Azure Active Directory with applications getting started guide |  Microsoft Azure"
   description="This article is a getting started guide for integrating Azure Active Directory (AD) with on-premises applications, and cloud applications."
   services="active-directory"
   documentationCenter=""
   authors="ihenkel"
   manager="stevenpo"
   editor=""/>

   <tags
      ms.service="active-directory"
      ms.devlang="na"
      ms.topic="article"
      ms.tgt_pltfrm="na"
      ms.workload="identity"
      ms.date="02/09/2016"
      ms.author="inhenk"/>

# Integrating Azure Active Directory with applications getting started guide
## Overview
This topic is intended to give you a roadmap for integrating applications with Azure Active Directory (AD). Each of the sections below contain a brief summary of a more detailed topic so you can identify which parts of this getting started guide are relevant to you.  Follow the links for a deeper dive on each subject.

## Before you begin, take inventory
Before you jump in to integrating applications with Azure AD, it is important to know where you are and where you want to go.  The following questions are intended to help you think about your Azure AD application integration project.

### Application inventory
- Where are all of your applications? Who owns them?
- What kind of authentication do your applications require?
- Who needs access to which applications?
- Do you want to deploy a new application?
  - Will you build it in-house and deploy it on an Azure compute instance?
  - Will you use one that is available in the Azure Application Gallery?

### User and group inventory
- Where do your user accounts reside?
 - On-premises Active Directory
 - Azure AD
 - Within a separate application database that you own
 - In unsanctioned applications
 - All of the above
- What permissions and role assignments do individual users currently have? Do you need to review their access or are you sure that your user access and role assignments are appropriate now?
- Are groups already established in your on-premises Active Directory?
 - How are your groups organized?
 - Who are the group members?
 - What permissions/role assignments do the groups currently have?
- Will you need to clean up user/group databases before integrating?  (This is a pretty important question. Garbage in, garbage out.)

### Access management inventory
- How do you currently manage user access to applications? Does that need to change?  Have you considered other ways to manage access, such as with [RBAC](role-based-access-control-configure.md) for example?
- Who needs access to what?

Maybe you don't have the answers to all of these questions up front but that's okay.  This guide can help you answer some of those questions and make some informed decisions.

## Prerequisites
- An Azure subscription and an Azure Active Directory directory.  If you don't already have an Azure subscription, you can try out Azure for free for 30 days. [Try it out!](https://azure.microsoft.com/trial/get-started-active-directory/)

## Application integration with Azure AD
### Finding unsanctioned cloud applications with Cloud App Discovery
As mentioned above, there may be applications that haven't been managed by your organization until now.  As part of the inventory process, it is possible to find unsanctioned cloud applications. See
[Finding unsanctioned cloud applications with Cloud App Discovery](active-directory-cloudappdiscovery-whatis.md).

### Authentication Types
Each of your applications may have different authentication requirements. With Azure AD, signing certificates can be used with applications that use SAML 2.0, WS-Federation, or OpenID Connect Protocols as well as Password Single Sign On. For more information about application authentication types for use with Azure AD see [Managing Certificates for Federated Single Sign-On in Azure Active Directory](active-directory-sso-certs.md) and [Password based single sign on](active-directory-appssoaccess-whatis.md).

### Enabling SSO with Azure AD App Proxy
With Microsoft Azure AD Application Proxy, you can provide access to applications located inside your private network securely, from anywhere and on any device. After you have installed an application proxy connector within your environment, it can be easily configured with Azure AD.

### Integrating applications with Azure AD
The following articles discuss the different ways applications integrate with Azure AD, and provide some guidance.

- [Determining which Active Directory to use](active-directory-administer.md)
- [Using applications in the Azure application gallery](active-directory-appssoaccess-whatis.md)
- [Integrating SaaS applications tutorials list](active-directory-saas-tutorial-list.md)

## Managing access to applications
The following articles describe ways you can manage access to applications once they have been integrated with Azure AD using Azure AD Connectors and Azure AD.

- [Managing access to apps using Azure AD](active-directory-managing-access-to-apps.md)
- [Automating with Azure AD Connectors](active-directory-saas-app-provisioning.md)
- [Assigning users to an application](active-directory-applications-guiding-developers-assigning-users.md)
- [Assigning groups to an application](active-directory-applications-guiding-developers-assigning-groups.md)
- [Sharing accounts](active-directory-sharing-accounts.md)

## Integrating custom applications
If you are writing a new application and want to assist developers in leveraging the power Azure AD, see [Guiding developers](active-directory-applications-guiding-developers-for-lob-applications.md).

If you want to add your custom application to the Azure Application Gallery, see [“Bring your own app” with Azure AD Self-Service SAML configuration](http://blogs.technet.com/b/ad/archive/2015/06/17/bring-your-own-app-with-azure-ad-self-service-saml-configuration-gt-now-in-preview.aspx).

## See also

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
