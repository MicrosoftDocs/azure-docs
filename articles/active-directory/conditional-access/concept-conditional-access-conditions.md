---
title: Conditions in Conditional Access policy - Azure Active Directory
description: What are conditions in an Azure AD Conditional Access policy

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 05/17/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
# Conditional Access: Conditions

Within a Conditional Access policy, an administrator can make use of signals from conditions like risk, device platform, or location to enhance their policy decisions. 

[![Define a Conditional Access policy and specify conditions](./media/concept-conditional-access-conditions/conditional-access-conditions.png)](./media/concept-conditional-access-conditions/conditional-access-conditions.png#lightbox)

Multiple conditions can be combined to create fine-grained and specific Conditional Access policies.

For example, when accessing a sensitive application an administrator may factor sign-in risk information from Identity Protection and location into their access decision in addition to other controls like multi-factor authentication.

## Sign-in risk

For customers with access to [Identity Protection](../identity-protection/overview-identity-protection.md), sign-in risk can be evaluated as part of a Conditional Access policy. Sign-in risk represents the probability that a given authentication request isn't authorized by the identity owner. More information about sign-in risk can be found in the articles, [What is risk](../identity-protection/concept-identity-protection-risks.md#sign-in-risk) and [How To: Configure and enable risk policies](../identity-protection/howto-identity-protection-configure-risk-policies.md).

## User risk 

For customers with access to [Identity Protection](../identity-protection/overview-identity-protection.md), user risk can be evaluated as part of a Conditional Access policy. User risk represents the probability that a given identity or account is compromised. More information about user risk can be found in the articles, [What is risk](../identity-protection/concept-identity-protection-risks.md#user-risk) and [How To: Configure and enable risk policies](../identity-protection/howto-identity-protection-configure-risk-policies.md).

## Device platforms

The device platform is characterized by the operating system that runs on a device. Azure AD identifies the platform by using information provided by the device, such as user agent strings. Since user agent strings can be modified, this information is unverified. Device platform should be used in concert with Microsoft Intune device compliance policies or as part of a block statement. The default is to apply to all device platforms.

Azure AD Conditional Access supports the following device platforms:

- Android
- iOS
- Windows Phone
- Windows
- macOS

If you block legacy authentication using the **Other clients** condition, you can also set the device platform condition.

> [!IMPORTANT]
> Microsoft recommends that you have a Conditional Access policy for unsupported device platforms. As an example, if you want to block access to your corporate resources from Linux or any other unsupported clients, you should configure a policy with a Device platforms condition that includes any device and excludes supported device platforms and Grant control set to Block access.

## Locations

When configuring location as a condition, organizations can choose to include or exclude locations. These named locations may include the public IPv4 network information, country or region, or even unknown areas that don't map to specific countries or regions. Only IP ranges can be marked as a trusted location.

When including **any location**, this option includes any IP address on the internet not just configured named locations. When selecting **any location**, administrators can choose to exclude **all trusted** or **selected locations**.

For example, some organizations may choose to not require multi-factor authentication when their users are connected to the network in a trusted location such as their physical headquarters. Administrators could create a policy that includes any location but excludes the selected locations for their headquarters networks.

More information about locations can be found in the article, [What is the location condition in Azure Active Directory Conditional Access](location-condition.md).

## Client apps

By default, all newly created Conditional Access policies will apply to all client app types even if the client apps condition is not configured. 

> [!NOTE]
> The behavior of the client apps condition was updated in August 2020. If you have existing Conditional Access policies, they will remain unchanged. However, if you click on an existing policy, the configure toggle has been removed and the client apps the policy applies to are selected.

> [!IMPORTANT]
> Sign-ins from legacy authentication clients don’t support MFA and don’t pass device state information to Azure AD, so they will be blocked by Conditional Access grant controls, like requiring MFA or compliant devices. If you have accounts which must use legacy authentication, you must either exclude those accounts from the policy, or configure the policy to only apply to modern authentication clients.

The **Configure** toggle when set to **Yes** applies to checked items, when set to **No** it applies to all client apps, including modern and legacy authentication clients. This toggle does not appear in policies created before August 2020.

- Modern authentication clients
   - Browser
      - These include web-based applications that use protocols like SAML, WS-Federation, OpenID Connect, or services registered as an OAuth confidential client.
   - Mobile apps and desktop clients
      -  This option includes applications like the Office desktop and phone applications.
- Legacy authentication clients
   - Exchange ActiveSync clients
      - This includes all use of the Exchange ActiveSync (EAS) protocol.
      - When policy blocks the use of Exchange ActiveSync the affected user will receive a single quarantine email. This email with provide information on why they are blocked and include remediation instructions if able.
      - Administrators can apply policy only to supported platforms (such as iOS, Android, and Windows) through the Conditional Access Microsoft Graph API.
   - Other clients
      - This option includes clients that use basic/legacy authentication protocols that do not support modern authentication.
         - Authenticated SMTP - Used by POP and IMAP client's to send email messages.
         - Autodiscover - Used by Outlook and EAS clients to find and connect to mailboxes in Exchange Online.
         - Exchange Online PowerShell - Used to connect to Exchange Online with remote PowerShell. If you block Basic authentication for Exchange Online PowerShell, you need to use the Exchange Online PowerShell Module to connect. For instructions, see [Connect to Exchange Online PowerShell using multi-factor authentication](/powershell/exchange/exchange-online/connect-to-exchange-online-powershell/mfa-connect-to-exchange-online-powershell).
         - Exchange Web Services (EWS) - A programming interface that's used by Outlook, Outlook for Mac, and third-party apps.
         - IMAP4 - Used by IMAP email clients.
         - MAPI over HTTP (MAPI/HTTP) - Used by Outlook 2010 and later.
         - Offline Address Book (OAB) - A copy of address list collections that are downloaded and used by Outlook.
         - Outlook Anywhere (RPC over HTTP) - Used by Outlook 2016 and earlier.
         - Outlook Service - Used by the Mail and Calendar app for Windows 10.
         - POP3 - Used by POP email clients.
         - Reporting Web Services - Used to retrieve report data in Exchange Online.

These conditions are commonly used when requiring a managed device, blocking legacy authentication, and blocking web applications but allowing mobile or desktop apps.

### Supported browsers

This setting works with all browsers. However, to satisfy a device policy, like a compliant device requirement, the following operating systems and browsers are supported:

| OS | Browsers |
| :-- | :-- |
| Windows 10 | Microsoft Edge, Internet Explorer, Chrome |
| Windows 8 / 8.1 | Internet Explorer, Chrome |
| Windows 7 | Internet Explorer, Chrome |
| iOS | Microsoft Edge, Intune Managed Browser, Safari |
| Android | Microsoft Edge, Intune Managed Browser, Chrome |
| Windows Phone | Microsoft Edge, Internet Explorer |
| Windows Server 2019 | Microsoft Edge, Internet Explorer, Chrome |
| Windows Server 2016 | Internet Explorer |
| Windows Server 2012 R2 | Internet Explorer |
| Windows Server 2008 R2 | Internet Explorer |
| macOS | Chrome, Safari |

> [!NOTE]
> Edge 85+ requires the user to be signed in to the browser to properly pass device identity. Otherwise, it behaves like Chrome without the accounts extension. This sign-in might not occur automatically in a Hybrid Azure AD Join scenario. 
> Safari is supported for device-based Conditional Access, but it can not satisfy the **Require approved client app** or **Require app protection policy** conditions. A managed browser like Microsoft Edge will satisfy approved client app and app protection policy requirements.

#### Why do I see a certificate prompt in the browser

On Windows 7, iOS, Android, and macOS Azure AD identifies the device using a client certificate that is provisioned when the device is registered with Azure AD.  When a user first signs in through the browser the user is prompted to select the certificate. The user must select this certificate before using the browser.

#### Chrome support

For Chrome support in **Windows 10 Creators Update (version 1703)** or later, install the [Windows 10 Accounts extension](https://chrome.google.com/webstore/detail/windows-10-accounts/ppnbnpeolgkicgegkbkbjmhlideopiji). This extension is required when a Conditional Access policy requires device-specific details.

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

These browsers support device authentication, allowing the device to be identified and validated against a policy. The device check fails if the browser is running in private mode.

### Supported mobile applications and desktop clients

Organizations can select **Mobile apps and desktop clients** as client app.

This setting has an impact on access attempts made from the following mobile apps and desktop clients:

| Client apps | Target Service | Platform |
| --- | --- | --- |
| Dynamics CRM app | Dynamics CRM | Windows 10, Windows 8.1, iOS, and Android |
| Mail/Calendar/People app, Outlook 2016, Outlook 2013 (with modern authentication)| Exchange Online | Windows 10 |
| MFA and location policy for apps. Device-based policies are not supported.| Any My Apps app service | Android and iOS |
| Microsoft Teams Services - this controls all services that support Microsoft Teams and all its Client Apps - Windows Desktop, iOS, Android, WP, and web client | Microsoft Teams | Windows 10, Windows 8.1, Windows 7, iOS, Android, and macOS |
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
| Visual Studio Team Services app | Visual Studio Team Services | Windows 10, Windows 8.1, Windows 7, iOS, and Android |

### Exchange ActiveSync clients

- Organizations can only select Exchange ActiveSync clients when assigning policy to users or groups. Selecting **All users**, **All guest and external users**, or **Directory roles** will cause all users to be subject of the policy.
- When creating a policy assigned to Exchange ActiveSync clients, **Exchange Online** should be the only cloud application assigned to the policy. 
- Organizations can narrow the scope of this policy to specific platforms using the **Device platforms** condition.

If the access control assigned to the policy uses **Require approved client app**, the user is directed to install and use the Outlook mobile client. In the case that **Multi-factor authentication**, **Terms of use**, or **custom controls** are required, affected users are blocked, because basic authentication does not support these controls.

For more information, see the following articles:

- [Block legacy authentication with Conditional Access](block-legacy-authentication.md)
- [Requiring approved client apps with Conditional Access](app-based-conditional-access.md)

### Other clients

By selecting **Other clients**, you can specify a condition that affects apps that use basic authentication with mail protocols like IMAP, MAPI, POP, SMTP, and older Office apps that don't use modern authentication.

## Device state (preview)

The device state condition can be used to exclude devices that are hybrid Azure AD joined and/or devices marked as compliant with a Microsoft Intune compliance policy from an organization's Conditional Access policies.

For example, *All users* accessing the *Microsoft Azure Management* cloud app including **All device state** excluding **Device Hybrid Azure AD joined** and **Device marked as compliant** and for *Access controls*, **Block**. 
   - This example would create a policy that only allows access to Microsoft Azure Management from devices that are either hybrid Azure AD joined or devices marked as compliant.

## Device filters (preview)

There is a new optional condition in Conditional Access called Device filters. When configuring device filters as a condition, organizations can choose to include or exclude devices based on filters using a rule expression on device properties. The rule expression for device filters can be authored using rule builder or rule syntax. This experience is similar to the one used for dynamic membership rules for groups.

There are many scenarios that organizations can now enable using device filters condition. Below are some core scenarios with examples on how to use this new condition.

- Restrict access to privileged resources like Microsoft Azure Management, to privileged users, accessing from [privileged or secure admin workstations](/security/compass/privileged-access-devices). For this scenario, organizations would create two Conditional Access policies:
   - Policy 1: All users with Directory roles as Global administrator, accessing the Microsoft Azure Management cloud app and for Access controls, Grant access that require multi-factor authentication and require device to be marked as compliant.
   - Policy 2: All users with Directory roles as Global administrator, accessing the Microsoft Azure Management cloud app, excluding device filters using rule expression device.extensionAttribute1 not equals SAW and for Access controls, Block.
- Block access to organization resources from devices running an unsupported Operating System version like Windows 7. For this scenario, organizations would create the following two Conditional Access policies:
   - Policy 1:  All users, accessing all cloud apps and for Access controls, Grant access that require device to be marked as compliant or require device to be hybrid Azure AD joined.
   - Policy 2: All users, accessing all cloud apps, including device filters using rule expression device.operatingSystem equals Windows and device.operatingSystemVersion startsWith "6.1" and for Access controls, Block.
- Do not require multi-factor authentication for specific accounts like service accounts when used on specific devices like Teams phones or Surface Hub devices. For this scenario, organizations would create the following two Conditional Access policies:
   - Policy 1: All users excluding service accounts, accessing all cloud apps, and for Access controls, Grant access that require multi-factor authentication.
   - Policy 2: Select users and groups and include group that contains service accounts only, accessing all cloud apps, excluding device filters using rule expression device.extensionAttribute2 not equals TeamsPhoneDevice and for Access controls, Block.

Let us look at details on how to use the user experience and API for device filters, supported operators and device properties for device filters and most importantly the policy behavior when device filters condition is configured.

### Device filters Graph API

The device filters API is currently available in Microsoft Graph beta endpoint and can be accessed using https://graph.microsoft.com/beta/identity/conditionalaccess/policies/. You can configure device filters when creating a new Conditional Access policy or you can update an existing policy to configure device filters condition. To update an existing policy you can do a patch call on the Microsoft Graph beta endpoint mentioned above by appending the policy ID of an existing policy and executing the following request body. The example here shows configuring a device filters condition excluding device that are not marked as SAW devices. The rule syntax can consist of more than one single expression. To learn more about the syntax, see rules with multiple expressions. 

```json
{
    "conditions": {
        "devices": {
            "deviceFilter": {
                "mode": "exclude",
                "rule": "device.extensionAttribute1 -ne \"SAW\""
            }
        }
    }
}
```

### Supported operators and device properties for filters

The following device attributes can be used with filters for devices condition in Conditional Access.

| Supported device attributes | Supported operators | Supported values | Example |
| --- | --- | --- | --- |
| deviceId | Equals, NotEquals, In, NotIn | A valid deviceId that is a GUID | (device.deviceid -eq “498c4de7-1aee-4ded-8d5d-000000000000”) |
| displayName | Equals, NotEquals, StartsWith, NotStartsWith, EndsWith, NotEndsWith, Contains, NotContains, In, NotIn | Any string | (device.displayName -contains “ABC”) |
| manufacturer | Equals, NotEquals, StartsWith, NotStartsWith, EndsWith, NotEndsWith, Contains, NotContains, In, NotIn | Any string | (device.manufacturer -startsWith “Microsoft”) |
| mdmAppId | Equals, NotEquals, In, NotIn | A valid MDM application id | (device.mdmAppId -in [“0000000a-0000-0000-c000-000000000000”] |
| model | Equals, NotEquals, StartsWith, NotStartsWith, EndsWith, NotEndsWith, Contains, NotContains, In, NotIn | Any string | (device.model -notContains “Surface”) |
| operatingSystem | Equals, NotEquals, StartsWith, NotStartsWith, EndsWith, NotEndsWith, Contains, NotContains, In, NotIn | A valid operating system (e.g. Windows, iOS, Android) | (device.operatingSystem -eq “Windows”) |
| operatingSystemVersion | Equals, NotEquals, StartsWith, NotStartsWith, EndsWith, NotEndsWith, Contains, NotContains, In, NotIn | A valid operating system version | (e.g. starting with 6.1 for Windows 7, 6.2 for Windows 8, 10.0 for Windows 10) | (device.operatingSystemVersion -in [“10.0. 18363”, “10.0.19041”, “10.0.19042”]) |
| pyhsicalIds | Contains, NotContains | As an example all Windows AutoPilot devices store ZTDId (a unique value assigned to all imported Windows AutoPilot devices) in device physicalIds property. | (device.devicePhysicalIDs -contains "[ZTDId]") |
| profileType | Equals, NotEquals | A valid profile type set for a device. Supported values are: RegisteredDevice (default), SecureVM (used for Windows VMs in Azure enabled with Azure AD sign in.), Printer (used for printers), Shared (used for shared devices), IoT (used for IoT devices) | (device.profileType -notIn [“Printer”, “Shared”, “IoT”] |
| systemLabels | Contains, NotContains | List of labels applied to the device by the system. Some of the supported values are: AzureResource (used for Windows VMs in Azure enabled with Azure AD sign in), M365Managed (used for devices managed using Microsoft Managed Desktop), MultiUser (used for shared devices) | (device.systemLabels -contains "M365Managed") |
| trustType | Equals, NotEquals | A valid registered state for devices. Supported values are: AzureAD (used for Azure AD joined devices), ServerAD (used for Hybrid Azure AD joined devices), Workplace (used for Azure AD registered devices) | (device.trustType -notIn ‘ServerAD, Workplace’) |
| extensionAttribute1-15 | Equals, NotEquals, StartsWith, NotStartsWith, EndsWith, NotEndsWith, Contains, NotContains, In, NotIn | These are extensionAttributes1-15 that customers can use for device objects. Customers can update any of the extensionAttributes1 through 15 with custom values and use them in Device filters condition in Conditional Access. Any string value can be used. | (device.extensionAttribute1 -eq ‘SAW’) |

### Policy behavior with filters for devices

Filters for devices (preview) condition in Conditional Access evaluates policy based on device attributes of a registered device in Azure AD and hence it is important to understand under what circumstances the policy is applied or not applied. The table below illustrates the behavior when filters for devices condition is configured. 

|  | Device filters condition | Device registration state | Device filter Applied 
| --- | --- | --- | --- |
| 1. | Include/exclude mode with positive operators (e.g. Equals, StartsWith, EndsWith, Contains, In) and use of any attributes | Unregistered device | No |
| 2. | Include/exclude mode with positive operators (e.g. Equals, StartsWith, EndsWith, Contains, In) and use of attributes excluding extensionAttributes1-15 | Registered device | Yes, if criteria are met |
| 3. | Include/exclude mode with positive operators (e.g. Equals, StartsWith, EndsWith, Contains, In) and use of attributes including extensionAttributes1-15 | Registered device managed by Intune | Yes, if criteria are met |
| 4. | Include/exclude mode with positive operators (e.g. Equals, StartsWith, EndsWith, Contains, In) and use of attributes including extensionAttributes1-15 | Registered device not managed by Intune | Yes, if criteria are met and if device is compliant or Hybrid Azure AD joined |
| 5. | Include/exclude mode with negative operators (e.g. NotEquals, NotStartsWith, NotEndsWith, NotContains, NotIn) and use of any attributes | Unregistered device | Yes |
| 6. | Include/exclude mode with negative operators (e.g. NotEquals, NotStartsWith, NotEndsWith, NotContains, NotIn) and use of any attributes excluding extensionAttributes1-15 | Registered device | Yes, if criteria are met |
| 7. | Include/exclude mode with negative operators (e.g. NotEquals, NotStartsWith, NotEndsWith, NotContains, NotIn) and use of any attributes including extensionAttributes1-15 | Registered device managed by Intune | Yes, if criteria are met |
| 8. | Include/exclude mode with negative operators (e.g. NotEquals, NotStartsWith, NotEndsWith, NotContains, NotIn) and use of any attributes including extensionAttributes1-15 | Registered device not managed by Intune | Yes, if criteria are met and if device is compliant or Hybrid Azure AD joined |

## Next steps

- [Conditional Access: Grant](concept-conditional-access-grant.md)

- [Conditional Access common policies](concept-conditional-access-policy-common.md)
