---
title: Controls in Azure Active Directory conditional access | Microsoft Docs
description: Learn how controls in Azure Active Directory conditional access work.
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
ms.date: 09/07/2017
ms.author: markvi
ms.reviewer: calebb

---

# Controls in Azure Active Directory conditional access 

With [Azure Active Directory (Azure AD) conditional access](active-directory-conditional-access-azure-portal.md), you can control how authorized users access your cloud apps. In a conditional access policy, you define the response ("do this") to a specific condition ("when this happens"). In the context of conditional access, 

- "**When this happens**" is called **condition statement**
- "**Then do this**" is called **controls**

![Control](./media/active-directory-conditional-access-controls/11.png)

The combination of a condition statement with your controls represents a conditional access policy.

![Control](./media/active-directory-conditional-access-controls/12.png)

Each control is either a requirement that must be fulfilled by the person or system signing in, or a restriction on what the user can do after signing in. 

There are two types of controls; 

- **Grant controls** - To gate access

- **Session controls** - To restrict access within a session

This topic explains the various controls that are available in Azure AD conditional access. 

## Grant controls

With grant controls, you can either block access altogether or allow access with additional requirements by selecting the desired controls. Those additional requirements are combined by either requiring all selected controls to be fulfilled (*AND*) or requiring one selected control to be fulfilled (*OR*).

![Control](./media/active-directory-conditional-access-controls/51.png)



### Multi-factor authentication

You can use this control to require multi-factor authentication to access the specified cloud app. This control supports the following multi-factor providers: 

- Azure Multi-Factor Authentication 

- An on-premises multi-factor authentication provider, combined with Active Directory Federation Services (AD FS).
 
Using multi-factor authentication helps protect resources from being accessed by an unauthorized user who might have gained access to the primary credentials of a valid user.



### Compliant device

You can configure conditional access policies that are device-based. The objective of a device-based conditional access policy is to grant access to the configured resources only from trusted devices. Requiring a compliant device is one option you have to define what a trusted device is. For more details, see [set up Azure Active Directory device-based conditional access policies](active-directory-conditional-access-policy-connected-applications.md).

### Domain joined device

Requiring a domain-joined device is another option you have to configure a device-based conditional access policies. This requirement refers to to Windows desktops, laptops, and enterprise tablets that are joined to an on-premises Active Directory. For more details, see [set up Azure Active Directory device-based conditional access policies](active-directory-conditional-access-policy-connected-applications.md).





### Approved client app

Because your employees use mobile devices for both personal and work tasks, you might want to have the ability to protect company data accessed using devices even in the case where they are not managed by you.
You can use [Intune app protection policies](https://docs.microsoft.com/intune/app-protection-policy) to help protect your company’s data independent of any mobile-device management (MDM) solution.


With approved client apps, you can require a client app that attempts to access your cloud apps to support [Intune app protection policies](https://docs.microsoft.com/intune/app-protection-policy). For example, you can restrict access to Exchange Online to the Outlook app. A conditional access policy that requires approved client apps is  also known as [app-based conditional access policy](active-directory-conditional-access-mam.md). For a list of supported approved client apps, see [approved client app requirement](active-directory-conditional-access-technical-reference.md#approved-client-app-requirement).



## Session controls

Session controls enable limiting experience within a cloud app. The session controls are enforced by cloud apps and rely on additional information provided by Azure AD to the app about the session.

![Control](./media/active-directory-conditional-access-controls/31.png)

#### Use app enforced restrictions

You can use this control to require Azure AD to pass the device information to the cloud app. This helps the cloud app know if the user is coming from a compliant device or domain joined device. This control is currently only supported with SharePoint as the cloud app. SharePoint uses the device information to provide users a limited or full experience depending on the device state.
To learn more about how to require limited access with SharePoint, see [control access from unmanaged devices](https://aka.ms/spolimitedaccessdocs).



## Next steps

- If you want to know how to configure a conditional access policy, see [get started with conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal-get-started.md).

- If you are ready to configure conditional access policies for your environment, see the [best practices for conditional access in Azure Active Directory](active-directory-conditional-access-best-practices.md). 
