---
title: Microsoft Entra certificate-based authentication on Android devices
description: Learn about Microsoft Entra certificate-based authentication on Android devices

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 06/02/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Microsoft Entra certificate-based authentication on Android devices

Android devices can use a client certificate on their device for certificate-based authentication (CBA) to Microsoft Entra ID. CBA can be used to connect to:

- Office mobile applications such as Microsoft Outlook and Microsoft Word
- Exchange ActiveSync (EAS) clients

Microsoft Entra CBA is supported for certificates on-device on native browsers, and on Microsoft first-party applications on Android devices. 

## Prerequisites

- Android version must be Android 5.0 (Lollipop) or later.

## Support for on-device certificates

On-device certificates are provisioned on the device. Customers can use Mobile Device Management (MDM) to provision the certificates on the device. 

## Supported platforms

- Applications using latest MSAL libraries or Microsoft Authenticator can do CBA
- Edge with profile, when users add account and sign in with a profile, will support CBA
- Microsoft first-party apps with latest MSAL libraries or Microsoft Authenticator can do CBA

## Microsoft mobile applications support

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

## Support for Exchange ActiveSync clients

Certain Exchange ActiveSync applications on Android 5.0 (Lollipop) or later are supported. 

To determine if your email application supports Microsoft Entra CBA, contact your application developer.

## Support for certificates on hardware security key

Certificates can be provisioned in external devices like hardware security keys along with a PIN to protect private key access. Microsoft Entra ID supports CBA with YubiKey.  

### Advantages of certificates on hardware security key 

Security keys with certificates:  

- Has the roaming nature of security key, which allows users to use the same certificate on different devices 
- Are hardware-secured with a PIN, which makes them phishing-resistant 
- Provide multifactor authentication with a PIN as second factor to access the private key of the certificate 
- Satisfy the industry requirement to have MFA on separate device 
- Help in future proofing where multiple credentials can be stored including Fast Identity Online 2 (FIDO2) keys. 

<a name='azure-ad-cba-on-android-mobile-'></a>

### Microsoft Entra CBA on Android mobile 

Android needs a middleware application to be able to support smartcard or security keys with certificates. To support YubiKeys with Microsoft Entra CBA, YubiKey Android SDK has been integrated into the Microsoft broker code which can be leveraged through the latest Microsoft Authentication Library (MSAL). 

<a name='azure-ad-cba-on-android-mobile-with-yubikey-'></a>

### Microsoft Entra CBA on Android mobile with YubiKey 

Because Microsoft Entra CBA with YubiKey on Android mobile is enabled by using the latest MSAL, YubiKey Authenticator app isn't required for Android support. 

Steps to test YubiKey on Microsoft apps on Android: 

1. Install the latest Microsoft Authenticator app.
1. Open Outlook and plug in your YubiKey. 
1. Select **Add account** and enter your user principal name (UPN).
1. Click **Continue**. A dialog should immediately pop up asking for permission to access your YubiKey. Click **OK**. 
1. Select **Use Certificate or smart card**. A custom certificate picker will appear. 
1. Select the certificate associated with the user’s account. Click **Continue**. 
1. Enter the PIN to access YubiKey and select **Unlock**. 

The user should be successfully logged in and redirected to the Outlook homepage. 

>[!NOTE]
>For a smooth CBA flow, plug in YubiKey as soon as the application is opened and accept the consent dialog from YubiKey before selecting the link **Use Certificate or smart card**. 

### Troubleshoot certificates on hardware security key

#### What will happen if the user has certificates both on the Android device and YubiKey? 

- If the user has certificates both on the android device and YubiKey, then if the YubiKey is plugged in before user clicks **Use Certificate or smart card**, the user will be shown the certificates in the YubiKey.  
- If the YubiKey is not plugged in before user clicks **Use Certificate or smart card**, the user will be shown all the certificates on the device. The user can **Cancel** the certificate picker, plug in the YubiKey, and restart the CBA process with YubiKey. 

#### My YubiKey is locked after incorrectly typing PIN three times. How do I fix it? 

- Users should see a dialog informing you that too many PIN attempts have been made. This dialog also pops up during subsequent attempts to select **Use Certificate or smart card**.
- [YubiKey Manager](https://www.yubico.com/support/download/yubikey-manager/) can reset a YubiKey’s PIN. 

#### I have installed Microsoft authenticator but still do not see an option to do Certificate based authentication with YubiKey 

Before installing Microsoft Authenticator, uninstall Company Portal and install it after Microsoft Authenticator installation. 

<a name='does-azure-ad-cba-support-yubikey-via-nfc-'></a>

#### Does Microsoft Entra CBA support YubiKey via NFC? 

This feature supports using YubiKey with USB and NFC.

#### Once CBA fails, clicking on the CBA option again in the ‘Other ways to signin’ link on the error page fails. 

This issue happens because of certificate caching. We are working to add a fix to clear the cache. As a workaround, clicking cancel and restarting the login flow will let the user choose a new certificate and successfully login. 

<a name='azure-ad-cba-with-yubikey-is-failing-what-information-would-help-debug-the-issue-'></a>

#### Microsoft Entra CBA with YubiKey is failing. What information would help debug the issue? 

1. Open Microsoft Authenticator app, click the three dots icon in the top right corner and select **Send Feedback**.
1. Click **Having Trouble?**.
1. For **Select an option**, select **Add or sign into an account**. 
1. Describe any details you want to add. 
1. Click the send arrow in the top right corner. Note the code provided in the dialog that appears. 

### Known Issues 

- Sometimes, plugging in the YubiKey and providing permission via the permission dialog and clicking **Use Certificate or smart card** will still take the user to on-device CBA picker pop up (instead of the smart card CBA picker). The user will need to cancel out of the picker, unplug their key, and re-plugin their key before attempting to sign in again.  
- With the Most Recently Used (MRU) feature, once a user uses CBA for authentication, MRU auth method will be set to CBA. Since the user will be directly taken into CBA flow, there may not be enough time for the user to accept the Android USB consent dialog. As a workaround user needs to remove and re-plugin the YubiKey, accept the consent dialog from YubiKey then click the back button and try again to complete CBA authentication flow.  
- Microsoft Entra CBA with YubiKey on latest Outlook and Teams fail at times. This could be due to a keyboard configuration change when the YubiKey is plugged in. This can be solved by:
  - Plug in YubiKey as soon as the application is opened.  
  - Accept the consent dialog from YubiKey before selecting the link **Use Certificate or smart card**. 

### Supported platforms

- Applications using the latest Microsoft Authentication Library (MSAL) or Microsoft Authenticator can do CBA 
- Microsoft first-party apps with latest MSAL libraries or Microsoft Authenticator can do CBA 

#### Supported operating systems

|Operating system | Certificate on-device/Derived PIV |    Smart cards        |
|:----------------|:---------------------------------:|:---------------------:|
| Android         | &#x2705;                          | Supported vendors only|

#### Supported browsers

|Operating system | Chrome certificate on-device | Chrome smart card | Safari certificate on-device | Safari smart card | Edge certificate on-device | Edge smart card |
|:----------------|:---------------------------------:|:---------------------:|:---------------------------------:|:---------------------:|:---------------------------------:|:---------------------:|
| Android             |  &#x2705;                          | &#10060;|N/A                          | N/A |  &#10060;                          | &#10060;|

>[!NOTE]
>Although Edge as a browser is not supported, Edge as a profile (for account login) is an MSAL app that supports CBA on Android.

### Security key providers

|Provider            |                  Android           |
|:-------------------|:------------------------------:|
| YubiKey            |              &#x2705;          | 


## Next steps

- [Overview of Microsoft Entra CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Microsoft Entra CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [How to configure Microsoft Entra CBA](how-to-certificate-based-authentication.md)
- [Microsoft Entra CBA on iOS devices](concept-certificate-based-authentication-mobile-ios.md)
- [Windows SmartCard logon using Microsoft Entra CBA](concept-certificate-based-authentication-smartcard.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [FAQ](certificate-based-authentication-faq.yml)
