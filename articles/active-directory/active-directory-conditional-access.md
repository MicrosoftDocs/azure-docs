<properties
	pageTitle="Securing access to Office 365 and other apps connected to Azure Active Directory | Microsoft Azure"  
    description="With conditional access control, Azure Active Directory checks the specific conditions you pick when authenticating the user and before allowing access to the application. Once those conditions are met, the user is authenticated and allowed access to the application."  
    services="active-directory" 
	keywords="conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies" 
	documentationCenter=""
	authors="femila"
	manager="swadhwa"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity" 
	ms.date="06/23/2016"
	ms.author="femila"/>


# Securing access to Office 365 and other apps connected to Azure Active Directory  
  
Securing access to company resources is important to every organization. With the advent of cloud services and mobile devices, the ways in which users access company resources has significantly changed. This calls for requiring changes to strategy on how to secure corporate resources.  
  
## Why conditional access?  
 The conditional access control capabilities in Azure Active Directory offers simple ways for companies to secure their resources both in the cloud and on-premises. Whether you need something like "prevent access to my resources using a stolen password" or “require a healthy, managed device for accessing my enterprise content", Azure Active Directory meets your needs.  

## How is conditional access control enforced?  
 With conditional access control, Azure Active Directory checks the specific conditions you choose when authenticating a user, before allowing access to an application. Once these access requirements  are met, the user is authenticated and allowed access to the application.  
   
![](./media/active-directory-conditional-access/conditionalaccess-overview.png) 

## User-based access to resources
  
- **User attributes**: At the user attributes level, you can apply policies to ensure that only authorized users can access company resources.   
- **Group membership of a user**: You can also control the level of access provided to a user based on their membership to a group or groups.   
- **Multi factor authentication (MFA)**: You can also enforce policies where a user has to authenticate his/her identify by using a multi factor authentication system. For example, you can force a user to confirm a PIN on a personal mobile phone to ensure an extra layer of security. The MFA authentication protects your resources from being accessed by an unauthorized user who has gained access to the username and password of a valid user. 
- **Sign-in and user risk**: Conditional Access risk policies are available with Azure AD Identity Protection and provide advance protection based on risk events and unusual sign-in activities. 
 

## Device-based conditional access 

**Enrolled devices**: At the device level, you can set policies that enforce that only  Mobile Device Management (MDM) enrolled devices are allowed access. Microsoft Intune is used to validate the device is enrolled and compliant. The device level conditional access then ensures that only devices that are compliant with your policies such as enforcing file encryption on a device are allowed access. In addition, by using MDM solutions you can ensure that corporate data on a lost/stolen device can we wiped remotely.   
  

The level of access that you can set using these policies can be applied to resources in the cloud or on-premises. The resources in the cloud could be apps such as Office 365 and 3rd party SaaS apps. In addition, these could also be Line of Business apps that you have hosted on the cloud.  
  
## Conditional access - a content map  
The following content map lists documents that you need to refer to learn more about enabling conditional access in your current deployment


| Scenario                                             | Articles |
|------------------------------------------------------|----------|
| Protecting resources based on authentication strength or user |[Getting started with conditional access to Azure AD connected apps based on group, location, and application sensitivity](active-directory-conditional-access-azuread-connected-apps.md)<br><br>[What kind of applications are supported](active-directory-conditional-access-supported-apps.md)|
| Protecting corporate data on lost/stolen devices     |[Help protect your data with full or selective wipe using Microsoft Intune](https://docs.microsoft.com/intune/deploy-use/use-remote-wipe-to-help-protect-data-using-microsoft-intune)|
|Protecting resources based on sign-in risk            |[Azure AD Identity Protection](active-directory-identityprotection.md)         |
| Additional Info                                      |[Conditional Access FAQs](active-directory-conditional-faqs.md)<br><br>[Technical reference](active-directory-conditional-access-technical-reference.md) |


