<properties
	pageTitle="Azure Active Directory FAQ | Microsoft Azure"
	description="Azure Active Directory FAQ"
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
	ms.date="04/20/2016"
	ms.author="markusvi"/>

# Azure Active Directory FAQ

Azure Active Directory (Azure AD) is a comprehensive cloud-based set of identity and access management capabilities that provides you with Identity as a Service (IDaaS).
As an IDaaS provider, Azure AD enables you control "*who is allowed to do what*" in your computer network.  
Additionally, Azure AD provides you with Single Sign-On (SSO) to your applications. With SSO, you can significantly improve the sign-on experience of your users.  
For more details, [What is Azure Active Directory?](active-directory-whatis.md).



## Accessing Azure and Azure Active Directory

**Q: Why can't I find Azure AD in the Azure portal (http://portal.azure.com)?**

**A:** The Azure AD administration experience is still available in the Azure classic portal (`http://manage.windowsazure.com`). A public preview of the new administration experiences that is integrated into the Azure portal is planned to be released by September.  
For the latest information about releases, see the [Active Directory Team Blog](https://blogs.technet.microsoft.com/ad/) .


---

**Q: Why do I get “No subscriptions found” when I try to access Azure AD in the Azure classic portal (http://manage.windowsazure.com)?**

**A:** You will need permissions on an Azure subscription, if you have a paid Office 365 or Azure AD navigate to  [http://aka.ms/accessAAD](http://aka.ms/accessAAD) for a one-time activation step, otherwise you will need to activate a full [Azure trial](https://azure.microsoft.com/pricing/free-trial/) or a paid subscription. 

---

**Q: What’s the relationship between Azure AD, Office 365, and Azure?**

**A:** Microsoft Azure is an open, flexible, enterprise-grade cloud computing platform and infrastructure for building, deploying, and managing applications and services through a global network of Microsoft-managed data centers.  
Azure provides you with, for example, Software as a Service (SaaS) solutions such as Office 365. Office 365 is a group of software plus services subscriptions that provides productivity software and related online services to you.  
Azure AD complements Office 365 with a comprehensive cloud-based set of identity and access management capabilities that provides you with Identity as a Service (IDaaS).  
If you have an Office 365 subscription, you also already have an Azure AD running on Azure. 


---

**Q: Which Azure AD features are available for free?**

**A:** All common features in an Azure subscription are available for free. For a complete list of these features, see [Common Features](active-directory-editions.md/#common-features).



---

Q: **How can I connect my on-premises directory to Azure AD?**

A: You can connect your on-premises directory to Azure AD using **Azure AD Connect**. For more details, see [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).


---

**Q: How do I set up SSO between my on-premises directory and my cloud applications?**

**A:** You only need to set up SSO between your on-premises directory and Azure AD. As long as your cloud applications are managed by Azure AD, you can extend the SSO reach to your on-premises environment by implementing federation with ADFS or password synchronization. Both options are included in **Azure AD Connect**.  
For more details, see [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
  


---

**Q: Does Azure AD help me manage my on-premises infrastructure?**

**A:** Yes, it does. The Azure AD Premium edition provides you with **Connect Health**. Azure AD Connect Health helps you monitor and gain insight into your on-premises identity infrastructure and the synchronization services.  
For more details, see [Monitor your on-premises identity infrastructure and synchronization services in the cloud](active-directory-aadconnect-health.md).  



## Password management

**Q: Can I use Azure AD password write-back without password sync? (AKA, I would like to use Azure AD SSPR with password writeback but I don’t want my passwords stored in the cloud?)**

**A:** You do not need to synchronize your AD passwords to Azure AD in order to enable write-back. In a federated environment, Azure AD SSO relies on the on-premises directory to authenticate the user. This scenario does not require the on-premises password to be tracked in Azure AD.

---

**Q: How long does it take for a password to be written back to AD on-premises?**

**A:** Password write-back operates in real-time. For more details, see [Getting started with Password Management](active-directory-passwords-getting-started.md) 


---

**Q: Can I use password write-back with passwords that are managed by an administrator?**

**A:** Yes, if you have password write-back enabled, the password operations performed by an administrator are written back to your on-premises environment.  
For more answers to password related questions, see [Password Management Frequently Asked Questions](active-directory-passwords-faq.md).



## Application access


**Q: Where can I find a list of applications that are pre-integrated with Azure AD and their capabilities?**

**A:** Azure AD has over 2600 pre-integrated applications from Microsoft, application service providers, or partners. For a complete list of the pre-integrated applications, see the [Active Directory Marketplace](https://azure.microsoft.com/marketplace/active-directory/).


---

**Q: What if the application I need is not in the Azure AD marketplace?**

**A:** With Azure AD Premium, you can add and configure any application you want. Additionally, you can configure, depending on your application’s capabilities and your preferences, configure SSO and automated provisioning.  
For more details, see:

- [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery](active-directory-saas-custom-apps.md)
- [Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications](active-directory-scim-provisioning.md) 



---

**Q: Can I add applications I’m running on-premises?**

**A:** Azure AD Application Proxy enables you easily access your on-premises web applications the same way as your SaaS apps in Azure Active Directory, without the need for a VPN or changing the network infrastructure.  
For more details, see [How to provide secure remote access to on-premises applications](active-directory-application-proxy-get-started.md).


--- 

**Q: How do I require MFA for users accessing a particular application?**

**A:** With Azure AD conditional access, you can assign a unique access policy for each application. In your policy, you can require MFA at all times, or when users are not connected to the local network.  
For more details, see [Securing access to Office 365 and other apps connected to Azure Active Directory](active-directory-conditional-access.md).





