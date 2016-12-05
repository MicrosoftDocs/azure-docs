---
title: Azure MFA Overview | Microsoft Docs
description: 'What is Azure Multi-factor Authentication, why use MFA, more information about the Multi-factor Authentication client and the different methods and versions available. '
keywords: introduction to MFA, mfa overview, what is mfa
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: yossib

ms.assetid: c40d7a34-1274-4496-96b0-784850c06e9b
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/13/2016
ms.author: kgremban

---
# What is Azure Multi-Factor Authentication?
Two-step verification is a method of authentication that requires more than one verification method and adds a critical second layer of security to user sign-ins and transactions. It works by requiring any two or more of the following verification methods:

* Something you know (typically a password)
* Something you have (a trusted device that is not easily duplicated, like a phone)
* Something you are (biometrics)

<center>![Username and Password](./media/multi-factor-authentication/pword.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Certificates](./media/multi-factor-authentication/phone.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Smart Phone](./media/multi-factor-authentication/hware.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Smart Card](./media/multi-factor-authentication/smart.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Virtual Smart Card](./media/multi-factor-authentication/vsmart.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Username and Password](./media/multi-factor-authentication/cert.png)</center>

Azure Multi-Factor Authentication (MFA) is Microsoft's two-step verification solution. Azure MFA helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication via a range of verification methods, including phone call, text message, or mobile app verification.

> [!VIDEO https://channel9.msdn.com/Blogs/Windows-Azure/WA-MFA-Overview/player]
> 
> 

## Why use Azure Multi-Factor Authentication?
Today, more than ever, people are increasingly connected. With smart phones, tablets, laptops, and PCs, people have several different options on how they are going to connect and stay connected at any time. People can access their accounts and applications from anywhere, which means that they can get more work done and serve their customers better.

Azure Multi-Factor Authentication is an easy to use, scalable, and reliable solution that provides a second method of authentication so your users are always protected.

| ![Easy to Use](./media/multi-factor-authentication/simple.png) | ![Scalable](./media/multi-factor-authentication/scalable.png) | ![Always Protected](./media/multi-factor-authentication/protected.png) | ![Reliable](./media/multi-factor-authentication/reliable.png) |
|:---:|:---:|:---:|:---:|
| **Easy to use** |**Scalable** |**Always Protected** |**Reliable** |

* **Easy to Use** - Azure Multi-Factor Authentication is simple to set up and use. The extra protection that comes with Azure Multi-Factor Authentication allows users to manage their own devices. Best of all, in many instances it can be set up with just a few simple clicks.
* **Scalable** - Azure Multi-Factor Authentication uses the power of the cloud and integrates with your on-premises AD and custom apps. This protection is even extended to your high-volume, mission-critical scenarios.
* **Always Protected** - Azure Multi-Factor Authentication provides strong authentication using the highest industry standards.
* **Reliable** - We guarantee 99.9% availability of Azure Multi-Factor Authentication. The service is considered unavailable when it is unable to receive or process verification requests for the two-step verification.

> [!VIDEO https://channel9.msdn.com/Blogs/Windows-Azure/Windows-Azure-Multi-Factor-Authentication/player]
> 
> 

## How Azure Multi-Factor Authentication works
The security of two-step verification lies in its layered approach. Compromising multiple verification methods presents a significant challenge for attackers. Even if an attacker manages to learn your password, it is useless without also having possession of the trusted device. Should you lose the device, the person who finds it can't use it unless he or she also knows your password.

> [!VIDEO https://channel9.msdn.com/Events/TechEd/Europe/2014/EM-B313/player]
> 
> 

## Methods available for Multi-Factor Authentication
When a user signs in, an additional verification request is sent to the user. The following are a list of methods that can be used for this second verification.

| Verification method | Description |
| --- | --- |
| Phone call |A call is placed to a user’s phone asking them to verify that they are signing. Press the # key to complete the verification process. This option is configurable and can be changed to a code that you specify. |
| Text message |A text message is sent to a user’s smart phone with a 6-digit code. Enter this code in to complete the verification process. |
| Mobile app notification |A verification request is sent to a user’s smart phone asking them complete the verification by selecting **Verify** from the mobile app. This occurs if app notification is the primary verification method. If they receive this notification when they are not signing in, they can report it as fraud. |
| Verification code with mobile app |The mobile app on a user’s device generates a verification code. This occurs if you selected a verification code as your primary verification method. |

For the mobile app verification methods, Azure Multi-Factor Authentication works with third-party authentication apps for smart phones. However, we recommend the Microsoft Authenticator app, which is available for [Windows Phone](http://go.microsoft.com/fwlink/?Linkid=825071), [Android](http://go.microsoft.com/fwlink/?Linkid=825072), and [IOS](http://go.microsoft.com/fwlink/?Linkid=825073).

## Available versions of Azure Multi-Factor Authentication
Azure Multi-Factor Authentication is available in three different versions. 

| Version | Description |
| --- | --- |
| Multi-Factor Authentication for Office 365 |This version works exclusively with Office 365 applications and is managed from the Office 365 portal. So administrators can now help secure their Office 365 resources with two-step verification. This version comes with an Office 365 subscription. |
| Multi-Factor Authentication for Azure Administrators |The same subset of two-step verification capabilities for Office 365 is available at no cost to all Azure administrators. Every administrative account of an Azure subscription can enable this functionality for additional protection. An administrator that wants to access Azure portal to create a VM or web site, manage storage, or use any other Azure service can add MFA to his administrator account. |
| Azure Multi-Factor Authentication |Azure Multi-Factor Authentication offers the richest set of capabilities. It provides additional configuration options via the [Azure classic portal](http://manage.windowsazure.com), advanced reporting, and support for a range of on-premises and cloud applications. Azure Multi-Factor Authentication comes as part of Azure Active Directory Premium and Enterprise Mobility Suite, and can be deployed either in the cloud or on premises. |

## Feature comparison of versions
The following table provides a list of the features that are available in the various versions of Azure Multi-Factor Authentication.

> [!NOTE]
> This comparison table discusses the features that are part of each subscription. If you have Azure AD Premium or Enterprise Mobility Suite, some features may not be available depending on whether you use [MFA in the cloud or MFA on-premises](multi-factor-authentication-get-started.md).
> 
> 

| Feature | Multi-Factor Authentication for Office 365 (included in Office 365 SKUs) | Multi-Factor Authentication for Azure Administrators (included with Azure subscription) | Azure Multi-Factor Authentication (included in Azure AD Premium and Enterprise Mobility Suite) |
| --- |:---:|:---:|:---:|
| Administrators can protect accounts with MFA |● |● (Available only for Azure Administrator accounts) |● |
| Mobile app as a second factor |● |● |● |
| Phone call as a second factor |● |● |● |
| SMS as a second factor |● |● |● |
| App passwords for clients that don't support MFA |● |● |● |
| Admin control over authentication methods |● |● |● |
| PIN mode | | |● |
| Fraud alert | | |● |
| MFA Reports | | |● |
| One-Time Bypass | | |● |
| Custom greetings for phone calls | | |● |
| Customization of caller ID for phone calls | | |● |
| Event Confirmation | | |● |
| Trusted IPs | | |● |
| Remember MFA for trusted devices |● |● |● |
| MFA SDK | | |● requires Multi-Factor Auth provider and full Azure subscription |
| MFA for on-premises applications using MFA server | | |● |

## How to get Azure Multi-Factor Authentication
If you would like the full functionality offered by Azure Multi-Factor Authentication, there are several options:

1. Purchase Azure Multi-Factor Authentication licenses and assign them to your users.
2. Purchase licenses that have Azure Multi-Factor Authentication bundled within them such as Azure Active Directory Premium, Enterprise Mobility Suite, or Enterprise Cloud Suite and assign them to your users.
3. Create an Azure Multi-Factor Authentication Provider within an Azure subscription. When using an Azure Multi-Factor Authentication Provider, there are two usage models available that are billed through your Azure subscription:  
   * **Per User**. For enterprises that want to enable two-step verification for a fixed number of employees who regularly need authentication.  
   * **Per Authentication**. For enterprises that want to enable two-step verification for a large group of external users who infrequently need authentication.  

Azure Multi-Factor Authentication provides selectable verification methods for both cloud and server. This means that you can choose which methods are available for your users. This feature is currently in public preview for the cloud version of multi-factor authentication. For more information, see [selectable verification methods](multi-factor-authentication-whats-next.md#selectable-verification-methods).

For pricing details, see [Azure MFA Pricing.](https://azure.microsoft.com/pricing/details/multi-factor-authentication/)

## Next steps
To get started with Azure Multi-Factor Authentication, your first step is to [choose between MFA in the cloud or on-premises](multi-factor-authentication-get-started.md)

