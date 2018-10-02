---
title: Azure Active Directory - FAQ | Microsoft Docs
description: Learn common questions and answers about Azure and Azure Active Directory, password management, and application access.
services: active-directory
author: eross-msft
manager: mtillman

ms.assetid: b8207760-9714-4871-93d5-f9893de31c8f
ms.service: active-directory
ms.component: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 12/14/2017
ms.author: lizross
---

# Azure Active Directory FAQ
Azure Active Directory (Azure AD) is a comprehensive identity as a service (IDaaS) solution that spans all aspects of identity, access management, and security.

For more information, see [What is Azure Active Directory?](active-directory-whatis.md).


## Access Azure and Azure Active Directory
**Q: Why do I get “No subscriptions found” when I try to access Azure AD in the Azure portal?**

**A:** To access the Azure portal, each user needs permissions with an Azure subscription. If you have a paid Office 365 or Azure AD subscription, go to [https://aka.ms/accessAAD](https://aka.ms/accessAAD) for a one-time activation step. Otherwise, you will need to activate a free [Azure account](https://azure.microsoft.com/pricing/free-trial/) or a paid subscription.

For more information, see:

* [How Azure subscriptions are associated with Azure Active Directory](active-directory-how-subscriptions-associated-directory.md)

- - -
**Q: What’s the relationship between Azure AD, Office 365, and Azure?**

**A:** Azure AD provides you with common identity and access capabilities to all web services. Whether you are using Office 365, Microsoft Azure, Intune, or others, you're already using Azure AD to help turn on sign-on and access management for all these services.

All users who are set up to use web services are defined as user accounts in one or more Azure AD instances. You can set up these accounts for free Azure AD capabilities like cloud application access.

Azure AD paid services like Enterprise Mobility + Security complement other web services like Office 365 and Microsoft Azure with comprehensive enterprise-scale management and security solutions.

- - -

**Q:  What are the differences between Owner and Global Administrator?**

**A:** By default, the person who signs up for an Azure subscription is assigned the Owner role for Azure resources. An Owner can use either a Microsoft account or a work or school account from the directory that the Azure subscription is associated with.  This role is authorized to manage services in the Azure portal.

If others need to sign in and access services by using the same subscription, you can assign them the appropriate [built-in role](../../role-based-access-control/built-in-roles.md). For additional information, see [Manage access using RBAC and the Azure portal](../../role-based-access-control/role-assignments-portal.md).

By default, the person who signs up for an Azure subscription is assigned the Global Administrator role for the directory. The Global Administrator has access to all Azure AD directory features. Azure AD has a different set of administrator roles to manage the directory and identity-related features. These administrators will have access to various features in the Azure portal. The administrator's role determines what they can do, like create or edit users, assign administrative roles to others, reset user passwords, manage user licenses, or manage domains.  For additional information on Azure AD directory admins and their roles, see [Assign a user to administrator roles in Azure Active Directory](active-directory-users-assign-role-azure-portal.md) and [Assigning administrator roles in Azure Active Directory](../users-groups-roles/directory-assign-admin-roles.md).

Additionally, Azure AD paid services like Enterprise Mobility + Security complement other web services, such as Office 365 and Microsoft Azure, with comprehensive enterprise-scale management and security solutions.

- - -
**Q: Is there a report that shows when my Azure AD user licenses will expire?**

**A:** No.  This is not currently available.

- - -

## Get started with Hybrid Azure AD


**Q: How do I leave a tenant when I am added as a collaborator?**

**A:** When you are added to another organization's tenant as a collaborator, you can use the "tenant switcher" in the upper right to switch between tenants.  Currently, there is no way to leave the inviting organization, and Microsoft is working on providing this functionality.  Until this feature is available, you can ask the inviting organization to remove you from their tenant.
- - -
**Q: How can I connect my on-premises directory to Azure AD?**

**A:** You can connect your on-premises directory to Azure AD by using Azure AD Connect.

For more information, see [Integrating your on-premises identities with Azure Active Directory](../hybrid/whatis-hybrid-identity.md).

- - -
**Q: How do I set up SSO between my on-premises directory and my cloud applications?**

**A:** You only need to set up single sign-on (SSO) between your on-premises directory and Azure AD. As long as you access your cloud applications through Azure AD, the service automatically drives your users to correctly authenticate with their on-premises credentials.

Implementing SSO from on-premises can be easily achieved with federation solutions such as Active Directory Federation Services (AD FS), or by configuring password hash sync. You can easily deploy both options by using the Azure AD Connect configuration wizard.

For more information, see [Integrating your on-premises identities with Azure Active Directory](../hybrid/whatis-hybrid-identity.md).

- - -
**Q: Does Azure AD provide a self-service portal for users in my organization?**

**A:** Yes, Azure AD provides you with the [Azure AD Access Panel](http://myapps.microsoft.com) for user self-service and application access. If you are an Office 365 customer, you can find many of the same capabilities in the Office 365 portal.

For more information, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

- - -
**Q: Does Azure AD help me manage my on-premises infrastructure?**

**A:** Yes. The Azure AD Premium edition provides you with Azure AD Connect Health. Azure AD Connect Health helps you monitor and gain insight into your on-premises identity infrastructure and the synchronization services.  

For more information, see [Monitor your on-premises identity infrastructure and synchronization services in the cloud](../hybrid/whatis-hybrid-identity-health.md).  

- - -
## Password management
**Q: Can I use Azure AD password write-back without password sync? (In this scenario, is it possible to use Azure AD self-service password reset (SSPR) with password write-back and not store passwords in the cloud?)**

**A:** You do not need to synchronize your Active Directory passwords to Azure AD to enable write-back. In a federated environment, Azure AD single sign-on (SSO) relies on the on-premises directory to authenticate the user. This scenario does not require the on-premises password to be tracked in Azure AD.

- - -
**Q: How long does it take for a password to be written back to Active Directory on-premises?**

**A:** Password write-back operates in real time.

For more information, see [Getting started with password management](../authentication/quickstart-sspr.md).

- - -
**Q: Can I use password write-back with passwords that are managed by an admin?**

**A:** Yes, if you have password write-back enabled, the password operations performed by an admin are written back to your on-premises environment.  

For more answers to password-related questions, see [Password management frequently asked questions](../authentication/active-directory-passwords-faq.md).
- - -
**Q:  What can I do if I can't remember my existing Office 365/Azure AD password while trying to change my password?**

**A:** For this type of situation, there are a couple of options.  Use self-service password reset (SSPR) if it's available.  Whether SSPR works depends on how it's configured.  For more information, see [How does the password reset portal work](../authentication/howto-sspr-deployment.md).

For Office 365 users, your admin can reset the password by using the steps outlined in [Reset user passwords](https://support.office.com/en-us/article/Admins-Reset-user-passwords-7A5D073B-7FAE-4AA5-8F96-9ECD041ABA9C?ui=en-US&rs=en-US&ad=US).

For Azure AD accounts, admins can reset passwords by using one of the following:

- [Reset accounts in the Azure portal](active-directory-users-reset-password-azure-portal.md)
- [Using PowerShell](/powershell/module/msonline/set-msoluserpassword?view=azureadps-1.0)


- - -
## Security
**Q: Are accounts locked after a specific number of failed attempts or is there a more sophisticated strategy used?**

We use a more sophisticated strategy to lock accounts.  This is based on the IP of the request and the passwords entered. The duration of the lockout also increases based on the likelihood that it is an attack.  

**Q:  Certain (common) passwords get rejected with the messages ‘this password has been used to many times’, does this refer to passwords used in the current active directory?**

This refers to passwords that are globally common, such as any variants of “Password” and “123456”.

**Q: Will a sign-in request from dubious sources (botnets, tor endpoint) be blocked in a B2C tenant or does this require a Basic or Premium edition tenant?**

We do have a gateway that filters requests and provides some protection from botnets, and is applied for all B2C tenants.

## Application access

**Q: Where can I find a list of applications that are pre-integrated with Azure AD and their capabilities?**

**A:** Azure AD has more than 2,600 pre-integrated applications from Microsoft, application service providers, and partners. All pre-integrated applications support single sign-on (SSO). SSO lets you use your organizational credentials to access your apps. Some of the applications also support automated provisioning and de-provisioning.

For a complete list of the pre-integrated applications, see the [Active Directory Marketplace](https://azure.microsoft.com/marketplace/active-directory/).

- - -
**Q: What if the application I need is not in the Azure AD marketplace?**

**A:** With Azure AD Premium, you can add and configure any application that you want. Depending on your application’s capabilities and your preferences, you can configure SSO and automated provisioning.  

For more information, see:

* [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery](../manage-apps/configure-federated-single-sign-on-non-gallery-applications.md)
* [Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications](../manage-apps/use-scim-to-provision-users-and-groups.md)

- - -
**Q: How do users sign in to applications by using Azure AD?**

**A:** Azure AD provides several ways for users to view and access their applications, such as:

* The Azure AD access panel
* The Office 365 application launcher
* Direct sign-in to federated apps
* Deep links to federated, password-based, or existing apps

For more information, see [Deploying Azure AD integrated applications to users](../manage-apps/what-is-single-sign-on.md#deploying-azure-ad-integrated-applications-to-users).

- - -
**Q: What are the different ways Azure AD enables authentication and single sign-on to applications?**

**A:** Azure AD supports many standardized protocols for authentication and authorization, such as SAML 2.0, OpenID Connect, OAuth 2.0, and WS-Federation. Azure AD also supports password vaulting and automated sign-in capabilities for apps that only support forms-based authentication.  

For more information, see:

* [Authentication Scenarios for Azure AD](../develop/authentication-scenarios.md)
* [Active Directory authentication protocols](https://msdn.microsoft.com/library/azure/dn151124.aspx)
* [How does single sign-on with Azure Active Directory work?](../manage-apps/what-is-single-sign-on.md#how-does-single-sign-on-with-azure-active-directory-work)

- - -
**Q: Can I add applications I’m running on-premises?**

**A:** Azure AD Application Proxy provides you with easy and secure access to on-premises web applications that you choose. You can access these applications in the same way that you access your software as a service (SaaS) apps in Azure AD. There is no need for a VPN or to change your network infrastructure.  

For more information, see [How to provide secure remote access to on-premises applications](../manage-apps/application-proxy.md).

- - -
**Q: How do I require multi-factor authentication for users who access a particular application?**

**A:** With Azure AD conditional access, you can assign a unique access policy for each application. In your policy, you can require multi-factor authentication always, or when users are not connected to the local network.  

For more information, see [Securing access to Office 365 and other apps connected to Azure Active Directory](../active-directory-conditional-access-azure-portal.md).

- - -
**Q: What is automated user provisioning for SaaS apps?**

**A:** Use Azure AD to automate the creation, maintenance, and removal of user identities in many popular cloud SaaS apps.

For more information, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md).

- - -
**Q:  Can I set up a secure LDAP connection with Azure AD?**

**A:**  No. Azure AD does not support the LDAP protocol. However, you can configure secure LDAP with Azure AD Domain Services.
