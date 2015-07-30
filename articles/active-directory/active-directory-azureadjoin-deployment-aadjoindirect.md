<properties 
	pageTitle="Setting up Azure AD Join for your users| Microsoft Azure" 
	description="A topic that explains how administrators can set up Azure AD Join for their end users (employees, students, other users)." 
	services="active-directory" 
	documentationCenter="" 
	authors="femila" 
	manager="swadhwa" 
	editor=""
	tags="azure-classic-portal"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/22/2015" 
	ms.author="femila"/>

# Usage scenarios for Azure AD Join 

##Join a company-owned device directly to Azure AD

Enterprises can provide cloud-only accounts to partner companies and organizations. These partners are then provided easy access and single-sign on to their company apps and resources. This scenario is applicable to users who use their devices to primarily access resources in the cloud such as Office 365 or SaaS apps that rely on Azure AD for authentication

**Example scenario:**
A company like Contoso, which is a 10.000+ employee company works with another consulting company, Fabrikam that provides specific services to Contoso.
Wendy is an employee of Fabrikam and working with Contoso on a project. Contoso provides cloud-only accounts (Azure AD) to its partners when necessary. Wendy is in a long term engagement which requires her to have an Azure AD Contoso account.
In this scenario, Wendy can join a Contoso-owned device directly to Azure AD. After signing-in to Windows with her Contoso Azure AD account, she can enjoy single-sign on to Office 365 and all the SaaS apps that Contoso has deployed.

### Prerequisites
**At the enterprise level (administrator)**

*	Azure subscription with Azure Active Directory  

**At the user level**

*	Windows 10 (Professional and Enterprise SKUs)

### Administrator Tasks
* [Set up device registration and MFA](active-directory-azureadjoin-setup.md)

### User Tasks
* [Setting up a new Windows 10 device with Azure AD via FRX](active-directory-azureadjoin-user-frx.md)
* [Set up a Windows 10 device with Azure AD from Settings](active-directory-azureadjoin-user-upgrade.md)
* [Join a personal Windows 10 device to your organization](active-directory-azureadjoin-personal-device.md)



## Domain Join a company-owned device to on-premises Active Directory and extend to Azure AD

In this scenario, a user receives a company-owned device joined to on-premises Active Directory. In a hybrid environment where Active Directory and Azure AD are connected, domain joined devices are automatically represented in the company cloud directory. Users enjoy the best of both worlds.
For example, Martin is an employee at Contoso. Contoso is an enterprise organization that has both Active Directory Domain Services on-premises and in the cloud (Azure AD). Martin’s primary device is a domain joined Surface Pro running Windows 8.1. His device has finished upgrading to Windows 10 and excited he’s ready to use it.

### Prerequisites
**At the enterprise level (administrator)**

*	Windows Server 2012 R2 with AD DS and AD FS
*	Azure AD Subscription

**At the user level**

*	Windows 10 (Professional and Enterprise SKUs)
-or-
*	Windows 8.1 upgraded to Windows 10

### Administrator Tasks
* [Set up device registration and MFA](active-directory-azureadjoin-setup.md)
* [Configure Group Policy for registering Windows 10 domain joined computers as devices](active-directory-azureadjoin-devices-group-policy.md)


### User Tasks
Next time the user signs-in to Windows, the device will auto-register with Azure AD. The user needs to take no additional steps. The user now will enjoy SSO to the cloud from everywhere and enjoy experiences in Windows like roaming of settings, access to store, Windows notifications and live tiles.

## Join a personal device to Azure AD
In this scenario a user can add his or her Azure AD accounts to a personal Windows device to access work resources in a secure and compliant fashion. 

### Prerequisites
**At the enterprise level (administrator)**

*	Windows Server 2012 R2 with AD DS and AD FS
*	Azure AD Subscription

**At the user level**

*	Windows 10 (Professional and Enterprise SKUs)
-or-
*	Windows 8.1 upgraded to Windows 10

### Administrator Tasks

* [Set up device registration and MFA](active-directory-azureadjoin-setup.md)

### User Tasks
* [Join a personal Windows 10 device to your organization](active-directory-azureadjoin-personal-device.md)


## Additional Information
* [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-user-upgrade.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)
