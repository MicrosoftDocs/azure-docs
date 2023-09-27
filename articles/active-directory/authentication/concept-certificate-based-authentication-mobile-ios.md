---
title: Microsoft Entra certificate-based authentication on Apple devices
description: Learn about Microsoft Entra certificate-based authentication on Apple devices that run macOS or iOS

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 02/09/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Microsoft Entra certificate-based authentication on iOS and macOS

This topic covers Microsoft Entra certificate-based authentication (CBA) support for macOS and iOS devices.

<a name='azure-active-directory-certificate-based-authentication-on-macos-devices'></a>

## Microsoft Entra certificate-based authentication on macOS devices

Devices that run macOS can use CBA to authenticate against Microsoft Entra ID by using their X.509 client certificate. Microsoft Entra CBA is supported with certificates on-device and external hardware protected security keys. On macOS, Microsoft Entra CBA is supported on all browsers and on Microsoft first-party applications.

### Browsers supported on macOS

|Edge | Chrome | Safari | Firefox |
|--------|---------|------|-------|
|&#x2705; |&#x2705; | &#x2705; |&#x2705; |

<a name='macos-device-sign-in-with-azure-ad-cba'></a>

### macOS device sign-in with Microsoft Entra CBA

Microsoft Entra CBA today isn't supported for device-based sign-in to macOS machines. The certificate used to sign in to the device can be the same certificate used to authenticate to Microsoft Entra ID from a browser or desktop application, but the device sign-in itself isn't supported against Microsoft Entra ID yet. 

<a name='azure-active-directory-certificate-based-authentication-on-ios-devices'></a>

## Microsoft Entra certificate-based authentication on iOS devices
Devices that run iOS can use certificate-based authentication (CBA) to authenticate to Microsoft Entra ID using a client certificate on their device when connecting to:

- Office mobile applications such as Microsoft Outlook and Microsoft Word
- Exchange ActiveSync (EAS) clients

Microsoft Entra CBA is supported for certificates on-device on native browsers and on Microsoft first-party applications on iOS devices. 

### Prerequisites

- iOS version must be iOS 9 or later.
- Microsoft Authenticator is required for Office applications and Outlook on iOS.

### Support for on-device certificates and external storage

On-device certificates are provisioned on the device. Customers can use Mobile Device Management (MDM) to provision the certificates on the device. Since iOS doesn't support hardware protected keys out of the box, customers can use external storage devices for certificates.

### Supported platforms

- Only native browsers are supported 
- Applications using latest MSAL libraries or Microsoft Authenticator can do CBA
- Edge with profile, when users add account and logged in a profile support CBA
- Microsoft first party apps with latest MSAL libraries or Microsoft Authenticator can do CBA

### Browsers

|Edge | Chrome | Safari | Firefox |
|--------|---------|------|-------|
|&#10060; | &#10060; | &#x2705; |&#10060; |

### Microsoft mobile applications support

| Applications | Support | 
|:---------|:------------:|
|Azure Information Protection app|  &#x2705; |
|Company Portal	 |  &#x2705; |
|Microsoft Teams |  &#x2705; |
|Office (mobile) |  &#x2705; |
|OneNote |  &#x2705; |
|OneDrive |  &#x2705; |
|Outlook |  &#x2705; |
|Power BI |  &#x2705; |
|Skype for Business	 |  &#x2705; |
|Word / Excel / PowerPoint	 |  &#x2705; |
|Yammer	 |  &#x2705; |

### Support for Exchange ActiveSync clients

On iOS 9 or later, the native iOS mail client is supported. 

To determine if your email application supports Microsoft Entra CBA, contact your application developer.

## Support for certificates on hardware security key

Certificates can be provisioned in external devices like hardware security keys along with a PIN to protect private key access. 
Microsoft's mobile certificate-based solution coupled with the hardware security keys is a simple, convenient, FIPS (Federal Information Processing Standards) certified phishing-resistant MFA method. 

As for iOS 16/iPadOS 16.1, Apple devices provide native driver support for USB-C or Lightning connected CCID-compliant smart cards. This means Apple devices on iOS 16/iPadOS 16.1 see a USB-C or Lightning connected CCID-compliant device as a smart card without the use of additional drivers or third-party apps. Microsoft Entra CBA works on these USB-A, USB-C, or Lightning connected CCID-compliant smart cards. 


### Advantages of certificates on hardware security key 

Security keys with certificates:  

- Can be used on any device, and don't need a certificate to be provisioned on every device the user has 
- Are hardware-secured with a PIN, which makes them phishing-resistant 
- Provide multifactor authentication with a PIN as second factor to access the private key of the certificate 
- Satisfy the industry requirement to have MFA on separate device 
- Help in future proofing where multiple credentials can be stored including Fast Identity Online 2 (FIDO2) keys 

<a name='azure-ad-cba-on-ios-mobile-with-yubikey-'></a>

### Microsoft Entra CBA on iOS mobile with YubiKey 

Even though the native Smartcard/CCID driver is available on iOS/iPadOS for Lightning connected CCID-compliant smart cards, the YubiKey 5Ci Lightning connector isn't seen as a connected smart card on these devices without the use of PIV (Personal Identity Verification) middleware like the Yubico Authenticator.  

### One-time registration prerequisite

- Have a PIV-enabled YubiKey with a smartcard certificate provisioned on it
- Download the [Yubico Authenticator for iOS app](https://apps.apple.com/app/yubico-authenticator/id1476679808) on your iPhone with v14.2 or later
- Open the app, insert the YubiKey or tap over near field communication (NFC) and follow steps to upload the certificate to iOS keychain 

### Steps to test YubiKey on Microsoft apps on iOS mobile 

1. Install the latest Microsoft Authenticator app.
1. Open Outlook and plug in your YubiKey. 
1. Select **Add account** and enter your user principal name (UPN).
1. Click **Continue** and the iOS certificate picker appears. 
1. Select the public certificate copied from YubiKey that is associated with the user’s account.  
1. Click **YubiKey required** to open the YubiKey authenticator app. 
1. Enter the PIN to access YubiKey and select the back button at the top left corner. 

The user should be successfully logged in and redirected to the Outlook homepage. 

### Troubleshoot certificates on hardware security key

#### What happens if the user has certificates both on the iOS device and YubiKey? 

The iOS certificate picker shows all the certificates on both iOS device and the ones copied from YubiKey into iOS device. Depending on the certificate user picks, they may be taken to YubiKey authenticator to enter a PIN, or directly authenticated. 

#### My YubiKey is locked after incorrectly typing PIN 3 times. How do I fix it? 

- Users should see a dialog informing you that too many PIN attempts have been made. This dialog also pops up during subsequent attempts to select **Use Certificate or smart card**.
- [YubiKey Manager](https://www.yubico.com/support/download/yubikey-manager/) can reset a YubiKey’s PIN. 

#### After CBA fails, the CBA option in the ‘Other ways to sign in’ link also fails. Is there a workaround? 

This issue happens because of certificate caching. We're working on an update to clear the cache. As a workaround, click **Cancel**, retry sign-in, and choose a new certificate. 

<a name='azure-ad-cba-with-yubikey-is-failing-what-information-would-help-debug-the-issue-'></a>

#### Microsoft Entra CBA with YubiKey is failing. What information would help debug the issue? 

1. Open Microsoft Authenticator app, click the three dots icon in the top right corner and select **Send Feedback**.
1. Click **Having Trouble?**.
1. For **Select an option**, select **Add or sign into an account**. 
1. Describe any details you want to add. 
1. Click the send arrow in the top right corner. Note the code provided in the dialog that appears. 

#### How can I enforce phishing-resistant MFA using a hardware security key on browser-based applications on mobile? 

Certificate-based authentication and Conditional Access authentication strength capability makes it powerful for customers to enforce authentication needs. Edge as a profile (add an account) works with a hardware security key like YubiKey and a Conditional Access policy with authentication strength capability can enforce phishing-resistant authentication with CBA.

CBA support for YubiKey is available in the latest Microsoft Authentication Library (MSAL) libraries, and any third-party application that integrates the latest MSAL. All Microsoft first-party applications can use CBA and Conditional Access authentication strength. 

### Supported operating systems

|Operating system | Certificate on-device/Derived PIV |    Smart cards        |
|:----------------|:---------------------------------:|:---------------------:|
| iOS             | &#x2705;                          | Supported vendors only|

### Supported browsers

|Operating system | Chrome certificate on-device | Chrome smart card | Safari certificate on-device | Safari smart card | Edge certificate on-device | Edge smart card |
|:----------------|:---------------------------------:|:---------------------:|:---------------------------------:|:---------------------:|:---------------------------------:|:---------------------:|
| iOS             |  &#10060;                          | &#10060;|&#x2705;                          | &#x2705; |  &#10060;                          | &#10060;|

### Security key providers

|Provider            |                  iOS           |
|:-------------------|:------------------------------:|
| YubiKey            |              &#x2705;          | 

## Known issue

On iOS, users see a "double prompt", where they must click the option to use certificate-based authentication twice. We're working to create a seamless user experience.

## Next steps

- [Overview of Microsoft Entra CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Microsoft Entra CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [How to configure Microsoft Entra CBA](how-to-certificate-based-authentication.md)
- [Microsoft Entra CBA on Android devices](concept-certificate-based-authentication-mobile-android.md)
- [Windows smart card logon using Microsoft Entra CBA](concept-certificate-based-authentication-smartcard.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [FAQ](certificate-based-authentication-faq.yml)
