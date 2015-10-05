<properties 
	pageTitle="Usage scenarios and deployment considerations for Azure AD Join| Microsoft Azure" 
	description="Lists and explains the differnt deployment scenarios available for Azure AD Join." 
	services="active-directory" 
	documentationCenter="" 
	authors="femila" 
	manager="stevenpo" 
	editor=""/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/21/2015" 
	ms.author="femila"/>

# Usage scenarios and deployment considerations for Azure AD Join 

## Usage scenarios for Azure AD Join
Scenario 1: Businesses largely in the cloud
--------------------------------------------------------
Azure AD join can benefit you if you currently operate and manage identities for your business in the cloud or moving to the cloud soon. You can use an account that you have created in Azure AD to sign in to Windows 10. Through either [the first run experience (FRX) process]((active-directory-azureadjoin-user-frx.md)) or joining Azure AD through [the Settings experience](active-directory-azureadjoin-user-upgrade.md), your users can join their machines to Azure AD.  Your users now enjoy SSO access to their cloud resources like Office 365 either in the browser or in the Office applications. 

Scenario 2: Educational institutions 
----------------------------------------------------------------------------------
Education institutions usually have two user types: faculty and students. Faculty members are considered longer term members of the organization and creating on-premises accounts for them is desired. But students are shorter term members of the organization and thus can be managed in Azure AD so directory scale can be pushed to the cloud instead of on-premises. These students can now sign in to Windows with their Azure AD account and get access to the Office 365 resources in the Office applications. 

Scenario 3: Retail businesses
---------------------------------------------------------------------------------------
Retail business have seasonal workers and long-term employees. Longer term full time employees can be created as on-premises accounts and would typically use domain joined machines. But seasonal workers are shorter term members of the organization and thus are desired to managed where user licenses can be more easily moved around. Creating these users in the cloud with Office 365 licenses allows these users to get the benefits of signing in to Windows and Office applications with an Azure AD account while maintaining more mobility of their licenses once they leave. 

Scenario 4: Additional scenarios
------------------------------------------------------------------------------------------
Other than the scenarios discussed above, you can benefit with having your users  join their devices joined to Azure AD because of a simplified joining experience, device management in Azure AD, automatic MDM enrollment, and single sign-on to Azure AD and on-premises resources.  


##Deployment Considerations for Azure AD Join

Enabling your users to join a company-owned device directly to Azure AD
-----------------------------------------------------------------------------------------

Enterprises can provide cloud-only accounts to partner companies and organizations. These partners are then provided easy access and single-sign on to their company apps and resources. This scenario is applicable to users who use their devices to primarily access resources in the cloud such as Office 365 or SaaS apps that rely on Azure AD for authentication.

### Prerequisites
**At the enterprise level (administrator)**

*	Azure subscription with Azure Active Directory  

**At the user level**

*	Windows 10 (Professional and Enterprise SKUs)

### Administrator Tasks
* [Set up device registration and MFA](active-directory-azureadjoin-setup.md)

### User Tasks
* [Setting up a new Windows 10 device with Azure AD during Setup](active-directory-azureadjoin-user-frx.md)
* [Set up a Windows 10 device with Azure AD from Settings](active-directory-azureadjoin-user-upgrade.md)
* [Join a personal Windows 10 device to your organization](active-directory-azureadjoin-personal-device.md)
  


## Enabling BYOD in your organization for Windows 10
You can set up your users and employees to user their personal Windows devices to access company apps and resources. Your users can add their Azure AD accounts (work accounts) to a personal Windows device through to access work resources in a secure and compliant fashion. 

### Prerequisites
**At the enterprise level (administrator)**

*	Azure AD Subscription

**At the user level**

*	Windows 10 (Professional and Enterprise SKUs)


### Administrator Tasks

* [Set up device registration and MFA](active-directory-azureadjoin-setup.md)

### User Tasks
* [Join a personal Windows 10 device to your organization](active-directory-azureadjoin-personal-device.md)


## Additional Information
* [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-overview.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)
