<properties
	pageTitle="Azure Active Directory conditional access | Microsoft Azure"  
    description="With conditional access control, Azure Active Directory checks the specific conditions you pick when authenticating the user and before allowing access to the application. Once those conditions are met, the user is authenticated and allowed access to the application."  
    services="active-directory" 
	keywords="conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies" 
	documentationCenter=""
	authors="markusvi"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity" 
	ms.date="08/08/2016"
	ms.author="markvi"/>


# Azure Active Directory conditional access   
  
Securing access to company resources is important to every organization. With the advent of cloud services and mobile devices, the way in which users access company resources has significantly changed. This requires a new approach to security.  
  
## Why conditional access?  

The conditional access control capabilities in Azure Active Directory offers simple ways for companies to secure  resources in the cloud and on-premises. Conditional access policies can be used to help protect against the risk of stolen and phished credentials, by requiring multi-factor authentication, as well as helping to keep company data safe, by requiring an Intune managed device granting access to sensitive services. 



## Licensing requirements

Conditional access is a feature of [Azure AD Premium](http://www.microsoft.com/identity).  All users who access an application with conditional access policy applied, must have an Azure AD Premium license. You can learn more about usage with the [Unlicensed User report](https://aka.ms/utc5ix).





## How is conditional access control enforced?  

With conditional access control, Azure Active Directory checks the specific conditions you choose when authenticating a user, before allowing access to an application. Once these access requirements  are met, the user is authenticated and allowed access to the application.  
   
![](./media/active-directory-conditional-access/conditionalaccess-overview.png) 

## Conditions
  
- **Group membership**: You can control the level of access to a user based on their membership to a group.

- **Location**: You can use the user location to trigger MFA and block controls when a user is not on a trusted network. 

- **Device platform**: You can use device platform type, such as iOS, Android, Windows Mobile and Windows as a conditions for applying policy.

- **Device enabled**: Device enabled / disabled state is validated during device policy evaluation. By disabling a lost or stolen device in the directory, it can no longer be used to satisfy policy requirements.

- **Sign-in and user risk**: Conditional Access risk policies are available with Azure AD Identity Protection and provide advance protection based on risk events and unusual sign-in activities. 


## Controls
   
- **Multi factor authentication (MFA)**: You can require strong authentication with MFA. MFA can be provided by Azure MFA or an on premise MFA provider, using ADFS. MFA authentication helps protect your resources from being accessed by an unauthorized user who has gain access to the username and password of a valid user. 

- **Block**: Access may be applied under conditions like user location. For example, blocking access when a user is not on a trusted network. 

- **Compliant devices**: At the device level, you can set policies that enforce that only computers that are domain joined or mobile devices that are enrolled into the Mobile Device Management (MDM) and meet compliance, are allowed access. Microsoft Intune is used to check compliance on devices and report it back to Azure Active Directory for enforcement during application access.  
 

## Applications

- The level of access that you can set using these policies can be applied to applications and services in the cloud or on-premises. Policy is directly applied to the web site or service. The policy is then enforced for browser access as well as applications accessing the service. The list of services policy can be applied to can be found here.


## Device-based conditional access

You can also restrict access to applications from devices that are registered with Azure AD that meet specific conditions. This is useful to protect organizational resources from valid users accessing these resources from:

- Unknown / unmanaged devices 
- Devices that don’t meet security policies as defined by your organization. 

Policies can be set based on the following requirements:

- **Domain joined devices** - You can set a policy to restrict access to devices that are joined to an on-premises Active Directory domain and are also registered with Azure AD. This policy applies to Windows desktops, laptops or enterprise tablets that belong to an on-premises Active Directory domain which have registered with Azure AD.
For more information on how to setup automatic registration of domain joined devices with Azure AD, see [How to setup automatic Registration of Windows domain joined devices with Azure Active Directory](active-directory-conditional-access-automatic-device-registration-setup.md).

- **Compliant devices** - You can set a policy to restrict access to devices that are marked **compliant** in the directory by the management system. This policy ensures that only devices that meet security policies such as enforcing file encryption on a device are allowed access. This policy can be used to restrict access from the following devices:

    - **Windows domain joined devices** that are managed by System Center Configuration Manager 2016 deployed in a hybrid configuration.

    - **Windows 10 mobile work or personal devices** that are managed by Microsoft Intune or a supported 3rd party Mobile Device Management (MDM) system.

    - **iOS and Android devices** that are managed by Microsoft Intune.


Users accessing applications that are protected by Device-based CA policy need to do this from devices that meet this policy. Access is denied if it is made from a device that doesn’t meet the policy.

For information on how to configure Device-based CA policy in Azure AD, see [How to configure Device-based Conditional Access policy for access control to Azure Active Directory connected applications](active-directory-conditional-access-policy-connected-applications.md).

## Article index for Azure Active Directory conditional access
  
The following content map lists documents that you need to refer to learn more about enabling conditional access in your current deployment


### MFA and location policies

- [Getting started with conditional access to Azure AD connected apps based on group, location, and MFA policies](active-directory-conditional-access-azuread-connected-apps.md)

- [What kind of applications are supported](active-directory-conditional-access-supported-apps.md)


### Device policies

- [How to set Device-based Conditional Access policy for access control to Azure Active Directory connected applications](active-directory-conditional-access-policy-connected-applications.md)

- [How to setup automatic registration of Windows domain joined devices with Azure Active Directory](active-directory-conditional-access-automatic-device-registration-setup.md)

- [Help protect your data requiring Microsoft Intune](https://docs.microsoft.com/intune/deploy-use/use-remote-wipe-to-help-protect-data-using-microsoft-intune)


### Protecting resources based on sign-in risk

[Azure AD Identity Protection](active-directory-identityprotection.md)

### Additional info

- [Conditional Access FAQs](active-directory-conditional-faqs.md)
- [Technical reference](active-directory-conditional-access-technical-reference.md)

