---
title: What are conditions in Azure Active Directory conditional access? | Microsoft Docs
description: Learn how conditions are used in Azure Active Directory conditional access to trigger a policy.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.assetid: 8c1d978f-e80b-420e-853a-8bbddc4bcdad
ms.service: active-directory
ms.component: conditional-access
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/13/2018
ms.author: markvi
ms.reviewer: calebb

#Customer intent: As a IT admin, I need to understand the conditions in conditional access so that I can set them according to my business needs

---

# What are conditions in Azure Active Directory conditional access? 

You can control how authorized users access your cloud apps by using [Azure Active Directory (Azure AD) conditional access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-azure-portal). In a conditional access policy, you define the response ("Then do this") to the reason for triggering your policy ("When this happens"). 

![Reason and response](./media/conditions/10.png)


In the context of conditional access, **When this happens** is called a **condition**. **Then do this** is called an **access control**. The combination of your conditions and your access controls represents a conditional access policy.

![Conditional access policy](./media/conditions/61.png)


Conditions you haven't configured in a conditional access policy aren't applied. Some conditions are [mandatory](best-practices.md) to apply a conditional access policy to an environment. 

This article is an overview of the conditions and how they're used in a conditional access policy. 

## Users and groups

The users and groups condition is mandatory in a conditional access policy. In your policy, you can either select **All users** or select specific users and groups.

![Users and groups](./media/conditions/111.png)

When you select **All users**, your policy is applied to all users in the directory, including guest users.

When you **Select users and groups**, you can set the following options:

* **All guest users** targets a policy to B2B guest users. This condition matches any user account that has the **userType** attribute set to **guest**. You can use this setting when a policy needs to be applied as soon as the account is created in an invite flow in Azure AD.

* **Directory roles** targets a policy based on a user’s role assignment. This condition supports directory roles like **Global administrator** or **Password administrator**.

* **Users and groups** targets specific sets of users. For example, you can select a group that contains all members of the HR department when an HR app is selected as the cloud app. A group can be any type of group in Azure AD, including dynamic or assigned security and distribution groups.

You can also exclude specific users or groups from a policy. One common use case is service accounts if your policy enforces multifactor authentication (MFA). 

Targeting specific sets of users is useful for the deployment of a new policy. In a new policy, you should target only an initial set of users to validate the policy behavior. 



## Cloud apps 

A cloud app is a website or service. Websites protected by the Azure AD Application Proxy are also cloud apps. For a detailed description of supported cloud apps, see [cloud apps assignments](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-technical-reference#cloud-apps-assignments). 

The **cloud apps** condition is mandatory in a conditional access policy. In your policy, you can either select **All cloud apps** or select specific apps.

![Include cloud apps](./media/conditions/03.png)

Select:

- **All cloud apps** to baseline policies to apply to the entire organization. Use this selection for policies that require multifactor authentication when sign-in risk is detected for any cloud app. A policy applied to **All cloud apps** applies to access to all websites and services. This setting isn't limited to the cloud apps that appear on the **Select apps** list. 

- Individual cloud apps to target specific services by policy. For example, you can require users to have a [compliant device](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-mam#app-based-or-compliant-device-policy-for-exchange-online-and-sharepoint-online) to access SharePoint Online. This policy is also applied to other services when they access SharePoint content. An example is Microsoft Teams. 

You can exclude specific apps from a policy. However, these apps are still subject to the policies applied to the services they access. 



## Sign-in risk

A sign-in risk is an indicator of the likelihood (high, medium, or low) that a sign-in attempt wasn't made by the legitimate owner of a user account. Azure AD calculates the sign-in risk level during a user's sign-in. 
You can use the calculated sign-in risk level as condition in a conditional access policy.

![Sign-in risk levels](./media/conditions/22.png)

To use this condition, you need to have [Azure Active Directory Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection-enable) enabled.
 
Common use cases for this condition are policies that have the following protections: 

- Block users with a high sign-in risk. This protection prevents potentially non-legitimate users from accessing your cloud apps. 
- Require multifactor authentication for users with a medium sign-in risk. By enforcing multifactor authentication, you can provide additional confidence that the sign-in is done by the legitimate owner of an account.

For more information, see [Risky sign-ins](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-security-risky-sign-ins).  

## Device platforms

The device platform is characterized by the operating system that runs on your device. Azure AD identifies the platform by using information provided by the device, such as user agent. This information is unverified. We recommend that all platforms have a policy applied to them. The policy should either block access, require compliance with Microsoft Intune policies, or require the device be domain joined. The default is to apply a policy to all device platforms. 


![Configure device platforms](./media/conditions/24.png)

For a list of the supported device platforms, see [device platform condition](technical-reference.md#device-platform-condition).


A common use case for this condition is a policy that restricts access to your cloud apps to [managed devices](require-managed-devices.md). For more scenarios including the device platform condition, see [Azure Active Directory app-based conditional access](app-based-conditional-access.md).



## Device state

The device state condition excludes hybrid Azure AD joined devices and devices marked as compliant from a conditional access policy. This condition is useful when a policy should apply only to an unmanaged device to provide additional session security. For example, only enforce the Microsoft Cloud App Security session control when a device is unmanaged. 


![Configure device state](./media/conditions/112.png)

If you want to block access for unmanaged devices, implement [device-based conditional access](https://docs.microsoft.com/azure/active-directory/conditional-access/app-based-conditional-access#app-based-or-compliant-device-policy-for-exchange-online-and-sharepoint-online).


## Locations

By using locations, you can define conditions based on where a connection was attempted. 

![Configure locations](./media/conditions/25.png)

Common use cases for this condition are policies with the following protections:

- Require multifactor authentication for users accessing a service when they're off the corporate network.  

- Block access for users accessing a service from specific countries or regions. 

For more information, see [What is the location condition in Azure Active Directory conditional access?](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-locations).


## Client apps

By using the client apps condition, you can apply a policy to different types of applications. Examples are websites,services, mobile apps, and desktop applications. 



An application is classified as follows:

- A website or service if it uses web SSO protocols, SAML, WS-Fed, or OpenID Connect for a confidential client.

- A mobile app or desktop application if it uses the mobile app OpenID Connect for a native client.

For a list of the client apps you can use in your conditional access policy, see [Client apps condition](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-technical-reference#client-apps-condition) in the Azure Active Directory Conditional Access technical reference.

Common use cases for this condition are policies with the following protections: 

- Require a [compliant device](https://docs.microsoft.com/azure/active-directory/conditional-access/app-based-conditional-access#app-based-or-compliant-device-policy-for-exchange-online-and-sharepoint-online) for mobile and desktop applications that download large amounts of data to the device. At the same time, allow browser access from any device.

- Block access from web applications but allow access from mobile and desktop applications.

You can apply this condition to web SSO and modern authentication protocols. You can also apply it to mail applications that use Microsoft Exchange ActiveSync. Examples are the native mail apps on most smartphones. 

You can only select the client apps condition if Microsoft Office 365 Exchange Online is the only cloud app you've selected.

![Cloud apps](./media/conditions/32.png)

Selecting **Exchange ActiveSync** as a client apps condition is supported only if you don't have other conditions  configured in a policy. However, you can narrow down the scope of this condition to apply only to supported platforms.

 
![Apply policy only to supported platforms](./media/conditions/33.png)

Applying this condition only to supported platforms is equal to all device platforms in a [device platform condition](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-mam#app-based-or-compliant-device-policy-for-exchange-online-and-sharepoint-online).

![Configure device platforms](./media/conditions/34.png)


 For more information, see these articles:

- [Set up SharePoint Online and Exchange Online for Azure Active Directory conditional access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-no-modern-authentication).
 
- [Azure Active Directory app-based conditional access](https://docs.microsoft.com/azure/active-directory/conditional-access/app-based-conditional-access). 


### Legacy authentication  

Conditional access now applies to older Microsoft Office clients that don't support modern authentication. It also applies to clients that use mail protocols like POP, IMAP, and SMTP. By using legacy authentication, you can configure policies like **block access from other clients**.


![Configure client apps](./media/conditions/160.png)  


#### Known issues

- Configuring a policy for **Other clients** blocks the entire organization from certain clients like SPConnect. This block happens because older clients authenticate in unexpected ways. The issue doesn't apply to major Office applications like the older Office clients. 

- It can take up to 24 hours for the policy to go into effect. 


#### Frequently asked questions

**Q:** Will this authentication block Microsoft Exchange Web Services?

It depends on the authentication protocol that Exchange Web Services uses. If the Exchange Web Services application uses modern authentication, it's covered by the **Mobile apps and desktop clients** client app. Basic authentication is covered by the **Other clients** client app.


**Q:** What controls can I use for **Other clients**?

Any control can be configured for **Other clients**. However, the end-user experience will be blocked access for all cases. **Other clients** don't support controls like MFA, compliant device, and domain join. 
 
**Q:** What conditions can I use for **Other clients**?

Any condition can be configured for **Other clients**.

**Q:** Does Exchange ActiveSync support all conditions and controls?

No. The following list summarizes Exchange ActiveSync support: 

- Exchange ActiveSync supports only user and group targeting. It doesn’t support guests or roles. If a guest or role condition is configured, all users are blocked. Exchange ActiveSync blocks all users because it can't determine if the policy should apply to the user or not.

- Exchange ActiveSync works only with Microsoft Exchange Online as the cloud app. 

- Exchange ActiveSync doesn't support any condition except the client app itself. 

- Exchange ActiveSync can be configured with any control. All controls except device compliance lead to a block.

**Q:** Do the policies apply to all client apps by default going forward?

No. There's no change in the default policy behavior. The policies continue to apply to browser and mobile applications and desktop clients by default.



## Next steps

- To find out how to configure a conditional access policy, see [Quickstart: Require MFA for specific apps with Azure Active Directory conditional access](app-based-mfa.md).

- To configure conditional access policies for your environment, see the [Best practices for conditional access in Azure Active Directory](best-practices.md). 

