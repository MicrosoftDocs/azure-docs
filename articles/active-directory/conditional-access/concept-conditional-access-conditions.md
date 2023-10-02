---
title: Conditions in Conditional Access policy
description: What are conditions in a Microsoft Entra Conditional Access policy

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 07/17/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: lhuangnorth, sandeo

ms.collection: M365-identity-device-management
---
# Conditional Access: Conditions

Within a Conditional Access policy, an administrator can make use of signals from conditions like risk, device platform, or location to enhance their policy decisions. 

[![Define a Conditional Access policy and specify conditions](./media/concept-conditional-access-conditions/conditional-access-conditions.png)](./media/concept-conditional-access-conditions/conditional-access-conditions.png#lightbox)

Multiple conditions can be combined to create fine-grained and specific Conditional Access policies.

When users access a sensitive application, an administrator may factor multiple conditions into their access decisions like: 

- Sign-in risk information from Identity Protection
- Network location
- Device information

## Sign-in risk

Administrators with access to [Identity Protection](../identity-protection/overview-identity-protection.md), can evaluate sign-in risk as part of a Conditional Access policy. Sign-in risk represents the probability that a given authentication request wasn't made by the identity owner. More information about sign-in risk can be found in the articles, [What is risk](../identity-protection/concept-identity-protection-risks.md) and [How To: Configure and enable risk policies](../identity-protection/howto-identity-protection-configure-risk-policies.md).

## User risk 

Administrators with access to [Identity Protection](../identity-protection/overview-identity-protection.md), can evaluate user risk as part of a Conditional Access policy. User risk represents the probability that a given identity or account is compromised. More information about user risk can be found in the articles, [What is risk](../identity-protection/concept-identity-protection-risks.md) and [How To: Configure and enable risk policies](../identity-protection/howto-identity-protection-configure-risk-policies.md).

## Device platforms

Conditional Access identifies the device platform by using information provided by the device, such as user agent strings. Since user agent strings can be modified, this information is unverified. Device platform should be used in concert with Microsoft Intune device compliance policies or as part of a block statement. The default is to apply to all device platforms.

Conditional Access supports the following device platforms:

- Android
- iOS
- Windows
- macOS
- Linux

If you block legacy authentication using the **Other clients** condition, you can also set the device platform condition.

We don't support selecting macOS or Linux device platforms when selecting **Require approved client app** or **Require app protection policy** as the only grant controls or when you choose **Require all the selected controls**.

> [!IMPORTANT]
> Microsoft recommends that you have a Conditional Access policy for unsupported device platforms. As an example, if you want to block access to your corporate resources from **Chrome OS** or any other unsupported clients, you should configure a policy with a Device platforms condition that includes any device and excludes supported device platforms and Grant control set to Block access.

## Locations

When administrators configure location as a condition, they can choose to include or exclude locations. These named locations may include the public IPv4 or IPv6 network information, country or region, unknown areas that don't map to specific countries or regions, and [Global Secure Access' compliant network](../../global-secure-access/how-to-compliant-network.md).

When including **any location**, this option includes any IP address on the internet not just configured named locations. When administrators select **any location**, they can choose to exclude **all trusted** or **selected locations**.

Administrators can create policies that target specific locations along with other conditions. More information about locations can be found in the article, [What is the location condition in Microsoft Entra Conditional Access](location-condition.md).

## Client apps

By default, all newly created Conditional Access policies apply to all client app types even if the client apps condition isn’t configured. 

> [!NOTE]
> The behavior of the client apps condition was updated in August 2020. If you have existing Conditional Access policies, they will remain unchanged. However, if you click on an existing policy, the configure toggle has been removed and the client apps the policy applies to are selected.

> [!IMPORTANT]
> Sign-ins from legacy authentication clients don’t support multifactor authentication (MFA) and don’t pass device state information, so they are blocked by Conditional Access grant controls, like requiring MFA or compliant devices. If you have accounts which must use legacy authentication, you must either exclude those accounts from the policy, or configure the policy to only apply to modern authentication clients.

The **Configure** toggle when set to **Yes** applies to checked items, when set to **No** it applies to all client apps, including modern and legacy authentication clients. This toggle doesn’t appear in policies created before August 2020.

- Modern authentication clients
   - Browser
      - These include web-based applications that use protocols like SAML, WS-Federation, OpenID Connect, or services registered as an OAuth confidential client.
   - Mobile apps and desktop clients
      -  This option includes applications like the Office desktop and phone applications.
- Legacy authentication clients
   - Exchange ActiveSync clients
      - This selection includes all use of the Exchange ActiveSync (EAS) protocol.
      - When policy blocks the use of Exchange ActiveSync the affected user receives a single quarantine email. This email with provide information on why they’re blocked and include remediation instructions if able.
      - Administrators can apply policy only to supported platforms (such as iOS, Android, and Windows) through the Conditional Access Microsoft Graph API.
   - Other clients
      - This option includes clients that use basic/legacy authentication protocols that don’t support modern authentication.
         - SMTP - Used by POP and IMAP client's to send email messages.
         - Autodiscover - Used by Outlook and EAS clients to find and connect to mailboxes in Exchange Online.
         - Exchange Online PowerShell - Used to connect to Exchange Online with remote PowerShell. If you block Basic authentication for Exchange Online PowerShell, you need to use the Exchange Online PowerShell Module to connect. For instructions, see [Connect to Exchange Online PowerShell using multifactor authentication](/powershell/exchange/exchange-online/connect-to-exchange-online-powershell/mfa-connect-to-exchange-online-powershell).
         - Exchange Web Services (EWS) - A programming interface that's used by Outlook, Outlook for Mac, and third-party apps.
         - IMAP4 - Used by IMAP email clients.
         - MAPI over HTTP (MAPI/HTTP) - Used by Outlook 2010 and later.
         - Offline Address Book (OAB) - A copy of address list collections that are downloaded and used by Outlook.
         - Outlook Anywhere (RPC over HTTP) - Used by Outlook 2016 and earlier.
         - Outlook Service - Used by the Mail and Calendar app for Windows 10.
         - POP3 - Used by POP email clients.
         - Reporting Web Services - Used to retrieve report data in Exchange Online.

These conditions are commonly used to: 

- Require a managed device
- Block legacy authentication
- Block web applications but allow mobile or desktop apps

### Supported browsers

This setting works with all browsers. However, to satisfy a device policy, like a compliant device requirement, the following operating systems and browsers are supported. Operating Systems and browsers that have fallen out of mainstream support aren’t shown on this list:

| Operating Systems | Browsers |
| :-- | :-- |
| Windows 10 + | Microsoft Edge, [Chrome](#chrome-support), [Firefox 91+](https://support.mozilla.org/kb/windows-sso) |
| Windows Server 2022 | Microsoft Edge, [Chrome](#chrome-support) |
| Windows Server 2019 | Microsoft Edge, [Chrome](#chrome-support) |
| iOS | Microsoft Edge, Safari (see the notes) |
| Android | Microsoft Edge, Chrome |
| macOS | Microsoft Edge, Chrome, Safari |
| Linux Desktop|Microsoft Edge|

These browsers support device authentication, allowing the device to be identified and validated against a policy. The device check fails if the browser is running in private mode or if cookies are disabled. 

> [!NOTE]
> Edge 85+ requires the user to be signed in to the browser to properly pass device identity. Otherwise, it behaves like Chrome without the accounts extension. This sign-in might not occur automatically in a hybrid device join scenario.
>  
> Safari is supported for device-based Conditional Access on a managed device, but it can not satisfy the **Require approved client app** or **Require app protection policy** conditions. A managed browser like Microsoft Edge will satisfy approved client app and app protection policy requirements.
> On iOS with 3rd party MDM solution only Microsoft Edge browser supports device policy.
> 
> [Firefox 91+](https://support.mozilla.org/kb/windows-sso) is supported for device-based Conditional Access, but "Allow Windows single sign-on for Microsoft, work, and school accounts" needs to be enabled. 

#### Why do I see a certificate prompt in the browser

On Windows 7, iOS, Android, and macOS devices are identified using a client certificate. This certificate is provisioned when the device is registered. When a user first signs in through the browser the user is prompted to select the certificate. The user must select this certificate before using the browser.

#### Chrome support

For Chrome support in **Windows 10 Creators Update (version 1703)** or later, install the [Windows Accounts](https://chrome.google.com/webstore/detail/windows-accounts/ppnbnpeolgkicgegkbkbjmhlideopiji) or [Office](https://chrome.google.com/webstore/detail/office/ndjpnladcallmjemlbaebfadecfhkepb) extensions. These extensions are required when a Conditional Access policy requires device-specific details.

To automatically deploy this extension to Chrome browsers, create the following registry key:

- Path HKEY_LOCAL_MACHINE\Software\Policies\Google\Chrome\ExtensionInstallForcelist
- Name 1
- Type REG_SZ (String)
- Data ppnbnpeolgkicgegkbkbjmhlideopiji;https\://clients2.google.com/service/update2/crx

For Chrome support in **Windows 8.1 and 7**, create the following registry key:

- Path HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\AutoSelectCertificateForUrls
- Name 1
- Type REG_SZ (String)
- Data {"pattern":"https://device.login.microsoftonline.com","filter":{"ISSUER":{"CN":"MS-Organization-Access"}}}

### Supported mobile applications and desktop clients

Administrators can select **Mobile apps and desktop clients** as client app.

This setting has an effect on access attempts made from the following mobile apps and desktop clients:

| Client apps | Target Service | Platform |
| --- | --- | --- |
| Dynamics CRM app | Dynamics CRM | Windows 10, Windows 8.1, iOS, and Android |
| Mail/Calendar/People app, Outlook 2016, Outlook 2013 (with modern authentication)| Exchange Online | Windows 10 |
| MFA and location policy for apps. Device-based policies aren’t supported.| Any My Apps app service | Android and iOS |
| Microsoft Teams Services - this client app controls all services that support Microsoft Teams and all its Client Apps - Windows Desktop, iOS, Android, WP, and web client | Microsoft Teams | Windows 10, Windows 8.1, Windows 7, iOS, Android, and macOS |
| Office 2016 apps, Office 2013 (with modern authentication), [OneDrive sync client](/onedrive/enable-conditional-access) | SharePoint | Windows 8.1, Windows 7 |
| Office 2016 apps, Universal Office apps, Office 2013 (with modern authentication), [OneDrive sync client](/onedrive/enable-conditional-access) | SharePoint Online | Windows 10 |
| Office 2016 (Word, Excel, PowerPoint, OneNote only). | SharePoint | macOS |
| Office 2019| SharePoint | Windows 10, macOS |
| Office mobile apps | SharePoint | Android, iOS |
| Office Yammer app | Yammer | Windows 10, iOS, Android |
| Outlook 2019 | SharePoint | Windows 10, macOS |
| Outlook 2016 (Office for macOS) | Exchange Online | macOS |
| Outlook 2016, Outlook 2013 (with modern authentication), Skype for Business (with modern authentication) | Exchange Online | Windows 8.1, Windows 7 |
| Outlook mobile app | Exchange Online | Android, iOS |
| Power BI app | Power BI service | Windows 10, Windows 8.1, Windows 7, Android, and iOS |
| Skype for Business | Exchange Online| Android, iOS |
| Azure DevOps Services (formerly Visual Studio Team Services, or VSTS) app | Azure DevOps Services (formerly Visual Studio Team Services, or VSTS) | Windows 10, Windows 8.1, Windows 7, iOS, and Android |

### Exchange ActiveSync clients

- Administrators can only select Exchange ActiveSync clients when assigning policy to users or groups. Selecting **All users**, **All guest and external users**, or **Directory roles** causes all users to be subject of the policy.
- When administrators create a policy assigned to Exchange ActiveSync clients, **Exchange Online** should be the only cloud application assigned to the policy. 
- Administrators can narrow the scope of this policy to specific platforms using the **Device platforms** condition.

If the access control assigned to the policy uses **Require approved client app**, the user is directed to install and use the Outlook mobile client. In the case that **Multifactor authentication**, **Terms of use**, or **custom controls** are required, affected users are blocked, because basic authentication doesn’t support these controls.

For more information, see the following articles:

- [Block legacy authentication with Conditional Access](block-legacy-authentication.md)
- [Requiring approved client apps with Conditional Access](./howto-policy-approved-app-or-app-protection.md)

### Other clients

By selecting **Other clients**, you can specify a condition that affects apps that use basic authentication with mail protocols like IMAP, MAPI, POP, SMTP, and older Office apps that don't use modern authentication.

## Device state (deprecated)

**This feature has been deprecated.** Customers should use the **Filter for devices** condition in the Conditional Access policy, to satisfy scenarios previously achieved using the device state condition.

> [!IMPORTANT]
> Device state and filters for devices cannot be used together in Conditional Access policy. Filters for devices provides more granular targeting including support for targeting device state information through the `trustType` and `isCompliant` property.

## Filter for devices

When administrators configure filter for devices as a condition, they can choose to include or exclude devices based on a filter using a rule expression on device properties. The rule expression for filter for devices can be authored using rule builder or rule syntax. This experience is similar to the one used for dynamic membership rules for groups. For more information, see the article [Conditional Access: Filter for devices](concept-condition-filters-for-devices.md).

## Next steps

- [Conditional Access: Grant](concept-conditional-access-grant.md)
- [Common Conditional Access policies](concept-conditional-access-policy-common.md)
