<properties
	pageTitle="Azure AD terminology | Microsoft Azure"
	description="Terms and definitions related to Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/20/2016"
	ms.author="curtand"/>

# Azure AD terminology

Microsoft Azure Active Directory (Azure AD) has a unique set of terminology that relate to cloud, hybrid, and on-premises scenarios. The following table defines these terms to provide you with a basic understanding for how they are used.

 Term  | Definition
------------- | -------------
Additional security verification | A security setting that a global admin can set on a user account in an organization’s directory to require that both a user’s password and a response from their phone must be used to verify that identity to the Azure Active Directory authentication system.
Azure Active Directory | The identity service in Azure that provides identity management and access control capabilities through a REST-based API.
Azure Active Directory Access Control | The Azure service that provides federated authentication and rules-driven, claims-based authorization for REST Web services.
Azure Active Directory authentication system | Microsoft’s identity service in the cloud used to authenticate and authorize work or school accounts.
Azure Active Directory Graph | A capability of Azure Active Directory that accesses user, group, and role objects within a social enterprise graph to easily surface user information and relationships.
Azure Active Directory Module for Windows PowerShell | A group of cmdlets used to administer Azure Active Directory. You can use these cmdlets to manage users, groups, domains, cloud service subscriptions, licenses, directory sync, single sign-on, and more.
Azure Active Directory Connect | The Azure Active Directory Connect wizard is the single tool and guided experience for connecting your on-premises directories with Azure Active Directory. The wizard deploys and configures all components required to get your directory integration up and running including sync services, password sync or Active Directory Federation Services (AD FS), and prerequisites such as the Azure AD PowerShell module.
Azure Active Directory Connect | The application that provides one-way synchronization of directory objects from a company's on-premises Active Directory service to Azure Active Directory.
Directory integration | A feature of Azure Active Directory that you can set up to improve the administrative experience associated with maintaining identities in both your on-premises directory and your cloud directory. Directory integration scenarios include directory synchronization, and directory synchronization with single sign on.
Directory synchronization | Used to synchronize on-premises directory objects (users, groups, contacts) to the cloud to help reduce administrative overhead. Directory synchronization is also referred to as directory sync in the Azure portal and Azure classic portal. Once directory synchronization has been set up, administrators can provision directory objects in an Active Directory on-premises to an Azure AD instance.
Microsoft Online Services Sign-In Assistant | The Sign In Assistant is an application installed on a client computer that makes it possible for a user to sign in once on that computer and then access services any number of times during the sign-in session. Without the Sign In Assistant, end users must provide a name and password each time they attempt to access a service. The Sign In Assistant should not be confused with single sign on which is a directory integration feature of Azure Active Directory that can be deployed to leverage a user’s existing on-premises corporate credentials to seamlessly access Microsoft cloud services.
Multi-factor authentication (also known as two-factor authentication or 2FA) | Multi-factor authentication adds a critical second layer of security to user sign-ins and transactions. When you enable multi-factor authentication for a user account in Azure AD, that user must then use their phone, in addition to their standard password credentials as their additional security verification method each time they need to sign in and use any of the Microsoft cloud services that your organization subscribes to.
Single sign-on | Used to provide users with a more seamless authentication experience as they access Microsoft cloud services while logged on to the corporate network. In order to set up single sign-on, organizations need to deploy a security token service on premises. Once single sign-on has been set up, users can use their Active Directory corporate credentials (user name and password) to access the services in the cloud and their existing on-premises resources.
User ID | A user ID is a unique identifier that a user provides on the Sign In page to access the Microsoft cloud services that your organization has subscribed to.
Work or school account | A user account assigned by an organization (work, school, non-profit) to one of their constituents (an employee, student, customer) that provides sign in access to one or more of the organization’s Microsoft cloud service subscriptions, such as Office 365 or Azure. These accounts are stored in an organization’s Azure AD directory, and are typically deleted when the user leaves the organization. Work or school accounts differ from Microsoft accounts in that they are created and managed by admins in the organization, not by the user.

## What's next
- [Sign up for Azure as an organization](sign-up-organization.md)
- [How Azure subscriptions are associated with Azure AD](active-directory-how-subscriptions-associated-directory.md)
- [Azure AD service limits and restrictions](active-directory-service-limits-restrictions.md)
