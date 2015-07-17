<properties 
	pageTitle="Integrating your on-premises identities with Azure Active Directory." 
	description="This is the Azure AD Connect that describes what it is and why you would use it." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="swadhwa" 
	editor="curtand"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/13/2015" 
	ms.author="billmath"/>

# Building Multi-Factor Authentication into Custom Apps (SDK)

If you have applications that you or your organization are developing, you can add the additional security of Azure Multi-Factor Authentication to them.  This can be done using the Azure Multi-Factor Authentication SDK. 

You can build Multi-Factor Authentication phone call and text message verifications directly into your application sign-in or transaction processes. Developers can use the Multi-Factor Authentication SDK to customize these basic verification options. 

- **Automated telephone calls**. Azure Multi-Factor Authentication can call any landline or mobile telephone. To complete the sign-in process, the user answers the call and presses the # key, or enters a pre-defined Personal Identification Number (PIN), and then presses the # key.
- **Text messages**. Azure Multi-Factor Authentication can send an SMS text message with a one-time passcode to any mobile phone. To complete the sign-in process, the user is prompted to reply with the passcode or passcode and PIN, or to enter the passcode on an application sign-in screen.

The SDK does not support mobile app verification.

The Multi-Factor Authentication SDK is available for C#, Visual Basic (.NET), Java, Perl, PHP, and Ruby. The SDK includes everything you need to write your code, including commented source code files, a certificate and private key for encrypting transactions, example files, and a detailed ReadMe file. If you’re new to multi-factor authentication, take a few minutes to work through the examples and to review the conceptual topics in Azure Multi-Factor Authentication.

The structure of the APIs in the Multi-Factor Authentication SDK is quite simple. You make a single function call to an API with the multi-factor option parameters, such as the verification mode, and user data, such as the telephone number to call or the PIN number to validate. The APIs translate the function call into web services requests to the cloud-based Azure Multi-Factor Authentication Service. All calls must include a reference to the private certificate that is included in every SDK.

The APIs in the Multi-Factor SDK support verification by telephone call and SMS text messages, but they do not support the Multi-Factor Authentication mobile apps.

Because the APIs do not have access to users registered in Azure Active Directory, you must provide user information, such as phone numbers and PIN codes, in a file or database. Also, the APIs do not provide enrollment or user management features, so you need to build these processes into your application.

## Download the Azure Multi-Factor Authentication SDK 

To download the Multi-Factor Authentication SDK, you must have a Azure subscription and a Azure AD tenant. Then, you must create a Azure Multi-Factor Authentication Provider, which allows you to use and be charged for the service.







