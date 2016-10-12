<properties
	pageTitle="Azure Multi-Factor Authentication - What is It? | Microsoft Azure"
	description="This topic explains what is Multi-factor Authentication (mfa), why someone would use MFA, more information about the Multi-factor Authentication client and the different methods and versions available. Azure Multi-factor authentication is a method of verifying who you are that requires the use of more than just a username and password. It provides an extra layer of security to user sign-ins and transactions."
	keywords="introduction to MFA, mfa overview, what is mfa"
	services="multi-factor-authentication"
	documentationCenter=""
	authors="kgremban"
	manager="femila"
	editor="yossib"/>

<tags
	ms.service="multi-factor-authentication"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/29/2016"
	ms.author="kgremban"/>

# What is Azure Multi-Factor Authentication?
Multi-factor authentication (MFA) is a method of authentication that requires more than one verification method and adds a critical second layer of security to user sign-ins and transactions. It works by requiring any two or more of the following verification methods:

- Something you know (typically a password)
- Something you have (a trusted device that is not easily duplicated, like a phone)
- Something you are (biometrics)

<center>![Username and Password](./media/multi-factor-authentication/pword.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Certificates](./media/multi-factor-authentication/phone.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Smart Phone](./media/multi-factor-authentication/hware.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Smart Card](./media/multi-factor-authentication/smart.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Virtual Smart Card](./media/multi-factor-authentication/vsmart.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Username and Password](./media/multi-factor-authentication/cert.png)</center>


Azure Multi-Factor Authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication via a range of easy verification options—phone call, text message, or mobile app verification.

>[AZURE.VIDEO multi-factor-authentication-overview]

## Why use Azure Multi-Factor Authentication?

Today, now more than ever, people are increasingly connected. With smart phones, tablets, laptops, and PCs, people have several different options on how they are going to connect and stay connected at any time. People can access their accounts and applications from anywhere, which means that they can get more work done and serve their customers better.

Azure Multi-Factor Authentication is an easy to use, scalable, and reliable solution that provides a second method of authentication so your users are always protected.

![Easy to Use](./media/multi-factor-authentication/simple.png)| ![Scalable](./media/multi-factor-authentication/scalable.png)| ![Always Protected](./media/multi-factor-authentication/protected.png)|![Reliable](./media/multi-factor-authentication/reliable.png)
:-------------: | :-------------: | :-------------: | :-------------: |
**Easy to use**|**Scalable**|**Always Protected**|**Reliable**

- **Easy to Use** - Azure Multi-Factor Authentication is simple to set up and use. The extra protection that comes with Azure Multi-Factor Authentication allows users to manage their own devices. Best of all, in many instances it can be set up with just a few simple clicks.
- **Scalable** - Azure Multi-Factor Authentication uses the power of the cloud and integrates with your on-premises AD and custom apps. This protection is even extended to your high-volume, mission-critical scenarios.
- **Always Protected** - Azure Multi-Factor Authentication provides strong authentication using the highest industry standards.
- **Reliable** - We guarantee 99.9% availability of Azure Multi-Factor Authentication. The service is considered unavailable when it is unable to receive or process authentication requests for the multi-factor authentication.

>[AZURE.VIDEO windows-azure-multi-factor-authentication]


## How Azure Multi-Factor Authentication works

The security of multi-factor authentication lies in its layered approach. Compromising multiple authentication factors presents a significant challenge for attackers. Even if an attacker manages to learn your password, it is useless without also having possession of the trusted device. Should you lose the device, the person who finds it won't be able to use it unless he or she also knows your password.

![Proofup](./media/multi-factor-authentication-how-it-works/howitworks.png)



Azure Multi-Factor Authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It provides additional security by requiring a second form of authentication and delivers strong authentication via a range of easy verification options:

- phone call
- text message
- mobile app notification—allowing users to choose the method they prefer
- mobile app verification code
- third-party OATH tokens

>[AZURE.VIDEO multi-factor-authentication-deep-dive-securing-access-on-premises]

## Methods available for multi-factor authentication
When a user signs in, an additional verification is sent to the user. The following are a list of methods that can be used for this second verification.

Verification method | Description
------------- | ------------- |
Phone call | A call is placed to a user’s phone asking them to verify that they are signing. Press the # key to complete the verification process. This option is configurable and can be changed to a code that you specify.
Text message | A text message is sent to a user’s smart phone with a 6-digit code. Enter this code in to complete the verification process.
Mobile app notification | A verification request is sent to a user’s smart phone asking them complete the verification by selecting **Verify** from the mobile app. This occurs if app notification is the primary verification method. If they receive this notification when they are not signing in, they can report it as fraud.</li><br><p> The Microsoft Authenticator app is available for [Windows Phone](http://go.microsoft.com/fwlink/?Linkid=825071), [Android](http://go.microsoft.com/fwlink/?Linkid=825072), and [IOS](http://go.microsoft.com/fwlink/?Linkid=825073).
Verification code with Mobile App | A verification code is sent to the mobile app that is running on a user’s smart phone. This occurs if you selected a verification code as your primary verification method.</li><br><p> The Microsoft Authenticator app is available for [Windows Phone](http://go.microsoft.com/fwlink/?Linkid=825071), [Android](http://go.microsoft.com/fwlink/?Linkid=825072), and [IOS](http://go.microsoft.com/fwlink/?Linkid=825073).


## Available versions of Azure Multi-Factor Authentication
Azure Multi-Factor Authentication is available in three different versions. The table below describes each of these in more detail.

Version | Description
------------- | ------------- |
Multi-Factor Authentication for Office 365 | This version works exclusively with Office 365 applications and is managed from the Office 365 portal. So administrators can now help secure their Office 365 resources by using multi-factor authentication. This version comes with an Office 365 subscription.
Multi-Factor Authentication for Azure Administrators | The same subset of Multi-Factor Authentication capabilities for Office 365 is available at no cost to all Azure administrators. Every administrative account of an Azure subscription can now get additional protection by enabling this core multi-factor authentication functionality. An administrator that wants to access Azure portal to create a VM or web site, manage storage, or use any other Azure service can add MFA to his administrator account.
Azure Multi-Factor Authentication | Azure Multi-Factor Authentication offers the richest set of capabilities. It provides additional configuration options via the [Azure classic portal](http://manage.windowsazure.com), advanced reporting, and support for a range of on-premises and cloud applications. Azure Multi-Factor Authentication comes as part of Azure Active Directory Premium and Enterprise Mobility Suite.

## Feature comparison of versions
The following table provides a list of the features that are available in the various versions of Azure Multi-Factor Authentication.

>[AZURE.NOTE] This comparison table discusses the features that are part of each subscription. If you have Azure AD Premium or Enterprise Mobility Suite, some features may not be available depending on whether you use [MFA in the cloud or MFA on-premises](multi-factor-authentication-get-started.md).

Feature | Multi-Factor Authentication for Office 365 (included in Office 365 SKUs)|Multi-Factor Authentication for Azure Administrators (included with Azure subscription) | Azure Multi-Factor Authentication (included in Azure AD Premium and Enterprise Mobility Suite)
------------- | :-------------: |:-------------: |:-------------: |
Administrators can protect accounts with MFA| ● | ● (Available only for Azure Administrator accounts)|●
Mobile app as a second factor|● | ● | ●
Phone call as a second factor|● | ● | ●
SMS as a second factor|● | ● | ●
App passwords for clients that don't support MFA|● | ● | ●
Admin control over authentication methods| ● | ● | ●
PIN mode| | | ●
Fraud alert| | | ●
MFA Reports| | | ●
One-Time Bypass| | | ●
Custom greetings for phone calls| | | ●
Customization of caller ID for phone calls| | | ●
Event Confirmation| | | ●
Trusted IPs| | | ●
Remember MFA for trusted devices |● | ● | ●
MFA SDK | | | ● requires Multi-Factor Auth provider and full Azure subscription
MFA for on-premises applications using MFA server| | | ●

## How to get Azure Multi-Factor Authentication

If you would like the full functionality offered by Azure Multi-Factor Authentication in addition to the features for Office 365 users and Azure administrators, there are several options:

1.	Purchase Azure Multi-Factor Authentication licenses and assign them to your users.
2.	Purchase licenses that have Azure Multi-Factor Authentication bundled within them such as Azure Active Directory Premium, Enterprise Mobility Suite, or Enterprise Cloud Suite and assign them to your users.
3.	Create an Azure Multi-Factor Authentication Provider within an Azure subscription. If you don’t already have an Azure subscription, you can sign up for an Azure trial subscription. Trial subscriptions need to be converted to regular subscriptions before the trial expires.

When using an Azure Multi-Factor Authentication Provider, there are two usage models available that are billed through your Azure subscription:


- **Per User**. For enterprises that want to enable multi-factor authentication for a fixed number of employees who regularly need authentication.
- **Per Authentication**. For enterprises that want to enable multi-factor authentication for a large group of external users who infrequently need authentication.

Azure Multi-Factor Authentication provides selectable verification methods for both cloud and server. This means that you can choose which methods are available for your users to use with multi-factor authentication. This feature is currently in public preview for the cloud version of multi-factor authentication. For more information, see [selectable verification methods](multi-factor-authentication-whats-next.md#selectable-verification-methods).

For pricing details, see [Azure MFA Pricing.](https://azure.microsoft.com/pricing/details/multi-factor-authentication/)

Choose the per-seat or consumption-based model that works best for your organization. Then to get started see [Getting Started.](multi-factor-authentication-get-started.md)

## Next steps

To get started with Azure Multi-Factor Authentication, your first step is to [choose between MFA in the cloud or on-premises](multi-factor-authentication-get-started.md)
