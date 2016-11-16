---
title: Azure Active Directory conditional access | Microsoft Docs
description: Use conditional access control in Azure Active Directory to check for specific conditions when authenticating for access to applications.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 8c1d978f-e80b-420e-853a-8bbddc4bcdad
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/15/2016
ms.author: markvi

---
# Conditional access in Azure Active Directory - Preview

In a mobile first, cloud first world, Azure Active Directory enables your users to access your apps and services from everywhere using a variety of devices with a single sign-on operation. With the proliferation of devices and trends like bring your own device, as well as bring your own application or SaaS applications into the enterprise, perhaps the toughest challenge for the IT professional is to accomplish two major goals at the same time: 

- Empower the end users to be able to do what they want to do
- Protect the corporate assets at any time

While providing your users with a broad range of options to access your corporate assets helps to improve productivity, it can become a nightmare to IT admins that are in charge of protecting your assets. Azure Active Directory enables you to configure who can access your resources; however, what if you have good reasons to limit the access options under certain conditions? What if you even have conditions under which you want to block access to certain resources?  

Conditional access is a capability of Azure Active Directory that enables you to address these questions using a policy-based approach. A policy-based approach simplifies your configuration experience because it follows the way you think about your access requirements.  
Typically, you define your access requirements using statements that are based on the following pattern:

When *this* happens, then do *this*.

When you replace the two occurrences of “*this*” with real-world information, you have an example for a policy statement that probably looks familiar to you:

*When contractors are trying to access our cloud apps from networks that are not trusted, then block access.*

The policy statement above highlights the power of conditional access. While you can enable contractors to basically access your cloud apps, you can define conditions under which the access is possible. 

In the context of Azure Active Directory conditional access, 

- "**When this happens**" is called **condition statement**
- "**Then do this**" is called **controls**

The combination of a condition statement with your controls represents a conditional access policy.

## Controls

In a conditional access policy, controls define what it is that should happen when a condition statement has been satisfied.  
With controls, you can either block access or allow access with additional requirements.
When you configure a policy that allows access, you need to select at least one requirement.   

The current implementation of Azure Active Directory, enables you to configure the following requirements: 

![Control](./media/active-directory-conditional-access-azure-portal/05.png)

- **Multi-factor Authentication** - You can require strong authentication through multi-factor authentication. You can use multi-factor authentication with Azure Multi-Factor Authentication or by using an on-premises multi-factor authentication provider, combined with Active Directory Federation Services (AD FS). Using multi-factor authentication helps protect resources from being accessed by an unauthorized user who might have gained access to the credentials of a valid user.

- **Compliant device** - You can set conditional access policies at the device level. You might set up a policy to only enable computers that are domain-joined, or mobile devices that are enrolled in a mobile device management application, can access your organization's resources. For example, you can use Intune to check device compliance, and then report it to Azure AD for enforcement when the user attempts to access an application. For detailed guidance about how to use Intune to protect apps and data, see Protect apps and data with Microsoft Intune. You also can use Intune to enforce data protection for lost or stolen devices. For more information, see Help protect your data with full or selective wipe using Microsoft Intune.

- **Domain joined device** – You can require the device you have used to connect to Azure Active Directory to be a domain joined device.

If you have more than one requirement selected in a conditional access policy, you can also configure your requirements for applying them.

![Control](./media/active-directory-conditional-access-azure-portal/06.png)


## Condition Statement

The previous section has introduced you to supported options to block or fine-tune access to your resources in form of controls. In a conditional access policy, you define the criteria that need to be met for your controls to be applied in form of a condition statement.  

You can include the following assignments into your condition statement:
    
![Control](./media/active-directory-conditional-access-azure-portal/07.png)


- **Who** - In many cases, you want your controls to be applied to a specific set of users. In a condition statement, you can define this set by selecting the users and groups your policy applies to. If necessary, you can also explicitly exclude a set of users from your policy to avoid that the wrong people are affected by a policy.  
By selecting users and groups, you define the scope of users your policy applies to.    

	![Control](./media/active-directory-conditional-access-azure-portal/08.png)



- **What** - Typically, there are certain apps that are running in your environment requiring, from a protection perspective, more attention than others. This affects, for example, apps that have access to sensitive data. By selecting cloud apps, you can narrow down the scope of apps by selecting them. If necessary, you can also explicitly exclude a set of apps from your policy.  
By selecting cloud apps, you define the scope of cloud apps your policy applies to. 

	![Control](./media/active-directory-conditional-access-azure-portal/09.png)


- **How** - As long as access to your apps is performed under conditions you can control, there might be no need for imposing additional controls on how your cloud apps are accessed by your users. However, things might look different if access to your cloud apps is performed, for example, from networks that are not trusted or devices that are not compliant. In a condition statement, you can define certain access conditions that have additional requirements for how access to your apps is performed.

	![Conditions](./media/active-directory-conditional-access-azure-portal/01.png)


## Access Conditions

With access conditions, you cover how access to your cloud apps is performed.  
In the current implementation of Azure Active Directory, you can define conditions for the following areas:


- **Device platforms** – The device platform is characterized by the operating system that is running on your device (Android, iOS, Windows Phone, Windows). You can define the device platforms that are included as well as device platforms that are exempted from a policy.

	![Conditions](./media/active-directory-conditional-access-azure-portal/02.png)

- **Locations** -  The location is identified by the IP address of the client you have used to connect to Azure Active Directory. Azure Active Directory provides you with a method to define trusted IP address ranges. You can define the locations that are included as well as locations that are exempted from a policy.    

	![Conditions](./media/active-directory-conditional-access-azure-portal/03.png)


- **Client app** - The client app can be either on a generic level the app (web browser, mobile app, desktop client) you have used to connect to Azure Active Directory or you can specifically select Exchange Active Sync.

	![Conditions](./media/active-directory-conditional-access-azure-portal/04.png)














## Next steps
See the following resource categories and articles to learn more about setting conditional access for your organization.

### Multi-factor authentication and location policies
* [Getting started with conditional access to Azure AD-connected apps based on group, location, and multi-factor authentication policies](active-directory-conditional-access-azuread-connected-apps.md)
* [Applications that are supported](active-directory-conditional-access-supported-apps.md)

### Device-based conditional access
* [Set device-based conditional access policy for access control to Azure Active Directory-connected applications](active-directory-conditional-access-policy-connected-applications.md)
* [Set up automatic registration of Windows domain-joined devices with Azure Active Directory](active-directory-conditional-access-automatic-device-registration-setup.md)
* [Troubleshooting for Azure Active Directory access issues](active-directory-conditional-access-device-remediation.md)
* [Help protect data on lost or stolen devices by using Microsoft Intune](https://docs.microsoft.com/intune/deploy-use/use-remote-wipe-to-help-protect-data-using-microsoft-intune)

### Protect resources based on sign-in risk
* [Azure AD identity protection](active-directory-identityprotection.md)

### Next steps
* [Conditional access FAQs](active-directory-conditional-faqs.md)
* [Technical reference](active-directory-conditional-access-technical-reference.md)

