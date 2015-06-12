<properties
	pageTitle="What is application access and single sign-on with Azure Active Directory?"
	description="Use Azure Active Directory to enable single sign-on to all of the SaaS and web applications that you need for business."
	services="active-directory"
	documentationCenter=""
	authors="asmalser-msft"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/15/2015"
	ms.author="asmalser-msft"/>


# What is application access and single sign-on with Azure Active Directory?


###Other articles on this topic
[How does single sign-on with Azure Active Directory work?](active-directory-appssoaccess-works.md)<br>
[Get started with the Azure AD application gallery](active-directory-appssoaccess-get-started.md)<br>
[Deploying applications to users](active-directory-appssoaccess-deployapps.md)<br>

Single sign-on means being able to access all of the applications and resources that you need to do business, by signing in only once using a single user account. Once signed in, you can access all of the applications you need without being required to authenticate (e.g. type a password) a second time.

Many organizations rely upon software as a service (SaaS) applications such as Office 365, Box and Salesforce for end user productivity. Historically, IT staff needs to individually create and update user accounts in each SaaS application, and users have to remember a password for each SaaS application.

Azure Active Directory extends on-premises Active Directory into the cloud, enabling users to use their primary organizational account to not only sign in to their domain-joined devices and company resources, but also all of the web and SaaS applications needed for their job.

So not only do users not have to manage multiple sets of usernames and passwords, their applications access can be automatically provisioned or de-provisioned based on their organization group members, and also their status as an employees. Azure Active Directory introduces security and access governance controls that enable you to centrally manage users' access across SaaS applications.

Azure AD enables easy integration to many of today’s popular SaaS applications; it provides identity and access management, and enables users to single sign-on to applications directly, or discover and launch them from a portal such as Office 365 or the Azure AD access panel.

The architecture of the integration consists of the following four main building blocks:

* Single sign-on enables users to access their SaaS applications based on their organizational account in Azure AD. Single sign-on is what enables users to authenticate to an application using their single organizational account.
* User provisioning enables user provisioning and de-provisioning into target SaaS based on changes made in Windows Server Active Directory and/or Azure AD. A provisioned account is what enables a user to be authorized to use an application, after they have authenticated through single sign-on.
* Centralized application access management in the Azure Management Portal enables single point of SaaS application access and management, with the ability to delegate application access decision making and approvals to anyone in the organization
* Unified reporting and monitoring of user activity in Azure AD

[Next: How does single sign-on with Azure Active Directory work?](active-directory-appssoaccess-works.md)
