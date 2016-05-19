<properties
	pageTitle="Azure Active Directory FAQ | Microsoft Azure"
	description="Azure Active Directory FAQ that provides answers to questions in conjunction with accessing Azure and Azure Active Directory, password management and application access."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="05/20/2016"
	ms.author="markusvi"/>

# Azure Active Directory FAQ

Azure Active Directory is a comprehensive Identity as a Service (IDaaS) solution that spans all aspects of identity, access management, and security.


For more details, see [What is Azure Active Directory?](active-directory-whatis.md).



## Accessing Azure and Azure Active Directory


**Q: Why do I get “No subscriptions found” when I try to access Azure AD in the Azure classic portal (https://manage.windowsazure.com)?**

**A:** Accessing the Azure classic portal requires each user to have permissions on an Azure subscription. If you have a paid Office 365 or Azure AD navigate to  [http://aka.ms/accessAAD](http://aka.ms/accessAAD) for a one-time activation step, otherwise you will need to activate a full [Azure trial](https://azure.microsoft.com/pricing/free-trial/) or a paid subscription. 

For more details, see:

- [How Azure subscriptions are associated with Azure Active Directory](active-directory-how-subscriptions-associated-directory.md)

- [Manage the directory for your Office 365 subscription in Azure](active-directory-manage-o365-subscription.md)

---

**Q: What’s the relationship between Azure AD, Office 365, and Azure?**

**A:** Azure Active Directory provides you with common identity and access capabilities to all Microsoft online services. Whether you are using Office 365, Microsoft Azure, Intune or others, you are already using an Azure AD to enable sign-on and access management for all of these services. 

In fact, all the users you have enabled for Microsoft Online services are defined as user accounts in one or more Azure AD instances. You can enable these accounts for free Azure AD capabilities such as cloud application access.
 
Additionally, Azure AD paid services (e.g.: Azure AD basic, Premium, EMS, etc.) complement other Online services such as Office 365 and Microsoft Azure with comprehensive enterprise scale management and security solutions.


---



## Getting started with Hybrid Azure AD


**Q: How can I connect my on-premises directory to Azure AD?**

**A:** You can connect your on-premises directory to Azure AD using **Azure AD Connect**. 

For more details, see [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).


---

**Q: How do I set up SSO between my on-premises directory and my cloud applications?**

**A:** You only need to set up SSO between your on-premises directory and Azure AD. As long as you access your cloud applications through Azure AD, the service automatically drives your users to correctly authenticate with their on-premises credentials.

Implementing SSO from on-premises can be easily achieved with federation solutions such as ADFS or by configuring password hash sync. You can easily deploy both options using the Azure AD Connect configuration wizard.
  

For more details, see [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
  

---

**Q: Does Azure Active Directory provide a self-service portal for users in my organization?**

**A:** Yes, Azure Active Directory provides you with the [Azure AD Access Panel](http://myapps.microsoft.com) for user self-service and application access. IF you are an Office 365 customer, you can find many of the same capabilities in the Office 365 portal. 

For more information, see the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md). 



---

**Q: Does Azure AD help me manage my on-premises infrastructure?**

**A:** Yes, it does. The Azure AD Premium edition provides you with **Connect Health**. Azure AD Connect Health helps you monitor and gain insight into your on-premises identity infrastructure and the synchronization services.  

For more details, see [Monitor your on-premises identity infrastructure and synchronization services in the cloud](active-directory-aadconnect-health.md).  

---

## Password management

**Q: Can I use Azure AD password write-back without password sync? (AKA, I would like to use Azure AD SSPR with password write-back but I don’t want my passwords stored in the cloud?)**

**A:** You do not need to synchronize your AD passwords to Azure AD in order to enable write-back. In a federated environment, Azure AD SSO relies on the on-premises directory to authenticate the user. This scenario does not require the on-premises password to be tracked in Azure AD.

---

**Q: How long does it take for a password to be written back to AD on-premises?**

**A:** Password write-back operates in real-time. 

For more details, see [Getting started with Password Management](active-directory-passwords-getting-started.md) 


---

**Q: Can I use password write-back with passwords that are managed by an administrator?**

**A:** Yes, if you have password write-back enabled, the password operations performed by an administrator are written back to your on-premises environment.  

For more answers to password related questions, see [Password Management Frequently Asked Questions](active-directory-passwords-faq.md).

---

## Application access


**Q: Where can I find a list of applications that are pre-integrated with Azure AD and their capabilities?**

**A:** Azure AD has over 2600 pre-integrated applications from Microsoft, application service providers, or partners. All pre-integrated applications support SSO. SSO enables you to use your organizational credentials to access your apps. Some of the applications also support automated provisioning and de-provisioning

For a complete list of the pre-integrated applications, see the [Active Directory Marketplace](https://azure.microsoft.com/marketplace/active-directory/).


---

**Q: What if the application I need is not in the Azure AD marketplace?**

**A:** With Azure AD Premium, you can add and configure any application you want. Depending on your application’s capabilities and your preferences, you can configure SSO and automated provisioning.  

For more details, see:

- [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery](active-directory-saas-custom-apps.md)
- [Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications](active-directory-scim-provisioning.md) 


---

**Q: How do users sign into applications using Azure Active Directory?**
 
**A:** Azure Active directory provides several ways for users to view and access their applications such as:

- The Azure AD access panel

- The Office 365 application launcher

- Direct sign-on to federated apps

- Deep links to federated, password-based, or existing apps

For more information, see [Deploying Azure AD integrated applications to users](active-directory-appssoaccess-whatis.md#deploying-azure-ad-integrated-applications-to-users).


---

**Q: What are the different ways Azure Active Directory enables authentication and single sign-on to applications?**
 
**A:** Azure Active Directory supports many standardized protocols for authentication and authorization such as SAML 2.0, OpenID Connect, OAuth 2.0, and WS-Federation. Azure AD also supports password vaulting and automated sign-in capabilities for apps that only support forms-based authentication.  

For more information, see:

- [Authentication Scenarios for Azure AD](active-directory-authentication-scenarios.md)

- [Active Directory Authentication Protocols](https://msdn.microsoft.com/library/azure/dn151124.aspx)

- [How does single sign-on with Azure Active Directory work?](active-directory-appssoaccess-whatis.md#how-does-single-sign-on-with-azure-active-directory-work)


---

**Q: Can I add applications I’m running on-premises?**

**A:** Azure AD Application Proxy provides you with easy and secure access to on-premises web applications that you choose. You can access these applications in the same way you are accessing your SaaS apps in Azure Active Directory. There is no need for a VPN or changing your network infrastructure.  

For more details, see [How to provide secure remote access to on-premises applications](active-directory-application-proxy-get-started.md).


--- 

**Q: How do I require MFA for users accessing a particular application?**

**A:** With Azure AD conditional access, you can assign a unique access policy for each application. In your policy, you can require MFA at all times, or when users are not connected to the local network.  

For more details, see [Securing access to Office 365 and other apps connected to Azure Active Directory](active-directory-conditional-access.md).


---

**Q: What is Automated User Provisioning for SaaS Apps?**

**A:** Azure Active Directory allows you to automate the creation, maintenance, and removal of user identities in many popular cloud (SaaS) applications. 

For more information, see [Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory](active-directory-saas-app-provisioning.md)

---



