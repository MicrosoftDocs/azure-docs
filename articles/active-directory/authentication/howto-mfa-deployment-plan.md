---
title: Plan and execute an Azure Multi-Factor Authentication deployment - Azure Active Directory
description: Microsoft Azure Multi-Factor Authentication deployment planning

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 03/29/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Planning a cloud-based Azure Multi-Factor Authentication

Users are connecting to organizational resources in increasingly complicated scenarios. They connect to resources from organization-owned, personal, and public devices on and off the corporate network by using smart phones, tablets, PCs, and laptops, often on multiple platforms. In this always-connected, multi-device and multi-platform world, the security of user accounts is more important than ever. A password no matter the complexity used across devices, networks, and platforms is no longer sufficient to ensure the security of the user account, especially when users tend to reuse passwords across accounts. Sophisticated phishing and other social engineering attacks can result in usernames and passwords being posted and sold across the dark web in minutes to hours.

[Azure Multi-Factor Authentication (MFA)](concept-mfa-howitworks.md) helps safeguard access to data and applications. It provides an additional layer of security using a second form of authentication. Organizations can use [Conditional Access](../conditional-access/overview.md) to make the solution fit their specific needs.

## Prerequisites

Before starting a deployment of Azure Multi-Factor Authentication there are prerequisite items that should be considered.

Certain MFA scenarios require that corresponding prerequisites be met.

| Scenario | Prerequisite |
| --- | --- |
| End-user communication of changes | Develop a communication plan with stakeholders from your organization to drive success |
| Cloud-only identity environment with modern authentication | No prerequisite tasks |
| Hybrid identity scenarios | [Azure AD Connect](../hybrid/whatis-hybrid-identity.md) is deployed and user identities are synchronized or federated with the on-premises Active Directory Domain Services with Azure Active Directory. |
| On-premises legacy applications published for cloud access | Azure AD [Application Proxy](../manage-apps/application-proxy.md) is deployed. |
| Using Azure MFA with RADIUS Authentication | A [Network Policy Server](howto-mfa-nps-extension.md) is deployed. |
| Users have Microsoft Office 2010 or earlier, or Apple Mail for iOS 11 or earlier | Users must upgrade to [Microsoft Office 2013 or later](https://support.microsoft.com/help/4041439/modern-authentication-configuration-requirements-for-transition-from-o) and Apple mail for iOS 12 or later as Conditional Access is not supported by legacy authentication protocols. |

## Plan user rollout

Your MFA rollout plan should include a pilot deployment followed by deployment waves that are within your support capacity. The best way to do this is to begin by applying your conditional access policies to one or a small number of groups. Once you’ve evaluated the effect on the users, process in use, and registration, you can either add more groups to the policy or add more users to the existing groups.

### User Communications

It is critical to inform users, in planned communications, about upcoming changes, Azure MFA registration requirements, and any necessary user actions. Microsoft provides [communication templates](https://aka.ms/mfatemplates) and [end-user documentation](../user-help/security-info-setup-signin.md) to assist your communications. You can also send users to [https://myprofile.microsoft.com](https://myprofile.microsoft.com) to register directly by selecting the Security Info links on that page.

## Deployment Considerations

Azure Multi-factor Authentication is deployed by enforcing policies with Conditional Access and or Identity Protection. A [Conditional Access policy](../conditional-access/overview.md) can require users to perform multi-factor authentication when certain criteria are met or are not such as:

* All users, a specific user, member of a group, or assigned role
* Specific cloud application being accessed
* Device platform
* State of device
* Network location or geo-located IP address
* Client applications
* Sign-in risk (Requires Identity Protection)
* Compliant device
* Hybrid Azure AD joined device
* Approved client application

Conditional access policies enforce registration, requiring unregistered users to complete registration at first sign-in, an important security consideration.

[Azure AD Identity Protection](../identity-protection/howto-configure-risk-policies.md) contributes both a registration policy for and automated risk detection and remediation policies to the Azure Multi-Factor Authentication story. Policies can be created to force password changes when there is a threat of compromised identity or when a sign-in is deemed risky by the following [events](../reports-monitoring/concept-risk-events.md):

* Leaked credentials
* Sign-ins from anonymous IP addresses
* Impossible travel to atypical locations
* Sign-in from unfamiliar locations
* Sign-ins from infected devices
* Sign-ins from IP addresses with suspicious activities

Some of the risk events detected by Azure Active Directory Identity Protection occur in real-time and some require offline processing. Administrators can choose to block users who exhibit risky behaviors and remediate manually, require a password change, or require a multi-factor authentication as part of their conditional access policies.

## Define network locations

We recommended that organizations use Conditional Access to define their network using [named locations](location-condition.md#named-locations). If your organization is using Identity Protection, consider using risk-based policies instead of named locations.

### Configuring a named location

1. Open the Azure Active Directory blade in the Azure portal
2. Click Conditional Access
3. Click Named Locations
4. Click New Location
5. In the Name field, provide a meaningful name
6. Select whether you are defining the location using IP ranges or Countries/Regions
   1. If using IP Ranges
      1. Decide whether to mark the location as Trusted. Signing in from a trusted location lowers a user's sign-in risk. Only mark this location as trusted if you know the IP ranges entered are established and credible in your organization.
      2. Specify the IP Ranges
   2. If using Countries/Regions
      1. Expand the drop-down menu and select the countries or regions you wish to define for this named location
      2. Decide whether to Include unknown areas. Unknown areas are IP addresses that can't be mapped to a country/region
7. Click Create

## Choose authentication methods

Administrators can choose the [authentication methods](../authentication/concept-authentication-methods.md) that they want to make available for users. It is important to allow more than a single authentication method so that users have a backup method available in case their primary method is unavailable. The following methods are available for administrators to enable:

### Notification through mobile app

A push notification is sent to the Microsoft Authenticator app on your mobile device. The user views the notification and selects **Approve** to complete verification. Push notifications through a mobile app provide the least intrusive option for users. They are also the most reliable and secure option because they use a data connection rather than telephony.

### Verification code from mobile app

A mobile app like the Microsoft Authenticator app generates a new OATH verification code every 30 seconds. The user enters the verification code into the sign-in interface. The mobile app option can be used whether or not the phone has a data or cellular signal.

### Call to phone

An automated voice call is placed to the user. The user answers the call and presses **#** on the phone keypad to approve their authentication. Call to phone is a great backup method for notification or verification code from a mobile app.

### Text message to phone

A text message that contains a verification code is sent to the user, the user is prompted to enter the verification code into the sign-in interface.

## Plan registration policy

Administrators must determine how users will register their methods. Organizations should [enable the new combined registration experience](howto-registration-mfa-sspr-combined.md) for Azure MFA and self-service password reset (SSPR). SSPR allows users to reset their password in a secure way using the same methods they use for multi-factor authentication. We recommend this combined registration, currently in public preview, because it’s a great experience for users, with the ability to register once for both services. Enabling the same methods for SSPR and Azure MFA will allow your users to be registered to use both features.

### Registration with Identity Protection

If your organization is using Azure Active Directory Identity Protection, [configure the MFA registration policy](../identity-protection/howto-mfa-policy.md) to prompt your users to register the next time they sign in interactively.

### Registration without identity Protection

If your organization does not have licenses that enable Identity Protection, users are prompted to register the next time that MFA is required at sign-in. This means that users may not have registered for MFA if they don't use applications protected with MFA. It's important to get all users registered so that bad actors cannot guess the password of a user and register for MFA on their behalf, effectively taking control of the account.

#### Enforcing registration

Using the following steps a conditional access policy can force users to register for Multi-Factor Authentication

1. Create a group, add all users not currently registered.
2. Using Azure Conditional Access, enforce MFA for this group for access to all resources. This will block access until the user registers (except from apps using legacy authentication).
3. Periodically, re-evaluate the group membership, and remove users who have registered from the group.

You may identify registered and non-registered Azure MFA users with PowerShell commands that rely on the [MSOnline PowerShell module](https://docs.microsoft.com/powershell/azure/active-directory/install-msonlinev1?view=azureadps-1.0).

#### Identify registered users

```PowerShell
Get-MsolUser -All | where {$_.StrongAuthenticationMethods -ne $null} | Select-Object -Property UserPrincipalName | Sort-Object userprincipalname 
```

#### Identify non-registered users

```PowerShell
Get-MsolUser -All | where {$_.StrongAuthenticationMethods.Count -eq 0} | Select-Object -Property UserPrincipalName | Sort-Object userprincipalname 
```

## Plan Conditional Access policies

To plan your conditional access policy strategy, which will determine when MFA and other controls are required, refer to [Deploy cloud-based Azure Multi-Factor Authentication](howto-mfa-getstarted.md#create-conditional-access-policy).

It is important that you prevent being inadvertently locked out of your Azure AD tenant. You can mitigate the impact of this inadvertent lack of administrative access by [creating two or more emergency access accounts in your tenant](../users-groups-roles/directory-emergency-access.md).

## Plan integration with on-premises systems

Some legacy and on-premises applications that do not authenticate directly against Azure AD require additional steps to use MFA including:

* Legacy on-premises applications, which will need to use Application proxy.
* On-premises RADIUS applications, which will need to use MFA adapter with NPS server.
* On-premises AD FS applications, which will need to use MFA adapter with AD FS 2016.

Applications that authenticate directly with Azure AD and have modern authentication (WS-Fed, SAML, OAuth, OpenID Connect) can make use of conditional access policies directly.

### Use Azure MFA with Azure AD Application Proxy

Applications residing on-premises can be published to your Azure AD tenant via [Azure AD Application Proxy](../manage-apps/application-proxy.md) and can take advantage of Azure Multi-Factor Authentication if they are configured to use Azure AD pre-authentication.

These applications are subject to Azure Conditional Access policies that enforce Azure Multi-Factor Authentication, just like any other Azure AD integrated application.

Likewise, if Azure Multi-Factor Authentication is enforced for all user sign-ins, on-premises applications published with Azure AD Application Proxy will be protected.

### Integrating Azure Multi-Factor Authentication with Network Policy Server

The Network Policy Server (NPS) extension for Azure MFA adds cloud-based MFA capabilities to your authentication infrastructure using your existing servers. With the NPS extension, you can add phone call, text message, or phone app verification to your existing authentication flow. This integration has the following limitations:

* With the CHAPv2 protocol, only authenticator app push notifications and voice call are supported.
* Conditional Access policies cannot be applied.

The NPS extension acts as an adapter between RADIUS and cloud-based Azure MFA to provide a second factor of authentication to protect [VPN](howto-mfa-nps-extension-vpn.md), [Remote Desktop Gateway connections](howto-mfa-nps-extension-rdg.md), or other RADIUS capable applications. Users that register for Azure MFA in this environment will be challenged for all authentication attempts, the lack of conditional access policies mean MFA is always required.

#### Implementing Your NPS Server

If you have an NPS instance deployed and in use already, reference [Integrate your existing NPS Infrastructure with Azure Multi-Factor Authentication]((howto-mfa-nps-extension.md)). If you are setting up NPS for the first time, refer to [Network Policy Server (NPS)](https://docs.microsoft.com/windows-server/networking/technologies/nps/nps-top) for instructions. Troubleshooting guidance can be found in the article [Resolve error messages from the NPS extension for Azure Multi-Factor Authentication](howto-mfa-nps-extension-errors.md).

#### Prepare NPS for users that aren't enrolled for MFA

You should determine what happens when users that aren’t enrolled with MFA try to authenticate. Use the registry setting `REQUIRE_USER_MATCH` in the registry path `HKLM\Software\Microsoft\AzureMFA` to control the feature behavior. This setting has a single configuration option.

| Key | Value | Default |
| --- | --- | --- |
| `REQUIRE_USER_MATCH` | TRUE / FALSE | Not set (equivalent to TRUE) |

The purpose of this setting is to determine what to do when a user is not enrolled for MFA. The effects of changing this setting are listed in the table below.

| Settings | User MFA Status | Effects |
| --- | --- | --- |
| Key does not exist | Not enrolled | MFA challenge is unsuccessful |
| Value set to True / not set | Not enrolled | MFA challenge is unsuccessful |
| Key set to False | Not enrolled | Authentication without MFA |
| Key set to False or True | Enrolled | Must authenticate with MFA |

### Integrate with Active Directory Federation Services

If your organization is federated with Azure AD, you can use [Azure Multi-Factor Authentication to secure AD FS resources](multi-factor-authentication-get-started-adfs.md), both on-premises and in the cloud. Azure MFA enables you to reduce passwords and provide a more secure way to authenticate. Starting with Windows Server 2016, you can now configure Azure MFA for primary authentication.

Unlike with AD FS in Windows Server 2012 R2, the AD FS 2016 Azure MFA adapter integrates directly with Azure AD and does not require an on-premises Azure MFA server. The Azure MFA adapter is built into Windows Server 2016, and there is no need for an additional installation.

When using Azure MFA with AD FS 2016 and the target application is subject to Azure Conditional Access Policy, there are additional considerations:

* Conditional Access is available when the application is a relying party to Azure AD, federated with AD FS 2016.
* Conditional Access is not available when the application is a relying party to AD FS 2016 and is managed or federated with AD FS 2016.
* Conditional Access is also not available when AD FS 2016 is configured to use Azure MFA as the primary authentication method.

#### AD FS Logging

Standard AD FS 2016 logging in both the Windows Security Log and the AD FS Admin log, contains information about authentication requests and their success or failure. Event log data within these events will indicate whether Azure MFA was used. For example, an AD FS Auditing Event ID 1200 may contain:

```
<MfaPerformed>true</MfaPerformed>
<MfaMethod>MFA</MfaMethod>
```

#### Renew and manage Certificates

On each AD FS server, in the local computer My Store, there will be a self-signed Azure MFA certificate titled OU=Microsoft AD FS Azure MFA which contains the certificate expiration date. Check the validity period of this certificate on each AD FS server to determine the expiration date.

If the validity period of your certificates are nearing expiration, [generate and verify a new MFA certificate on each AD FS server](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/configure-ad-fs-and-azure-mfa#configure-the-ad-fs-servers).

The following guidance details how to manage the Azure MFA certificates on your AD FS servers. When you configure AD FS with Azure MFA, the certificates generated via the `New-AdfsAzureMfaTenantCertificate` PowerShell cmdlet are valid for 2 years. You must renew and install the renewed certificates prior to expiration to ovoid disruptions in MFA service.

## Implement your Plan

Now that you have planned your solution, you can implement by following the steps below:

1. Meet any necessary prerequisites
   1. Deploy [Azure AD Connect](../hybrid/whatis-hybrid-identity.md) for any hybrid scenarios
   1. Deploy [Azure AD Application Proxy](../manage-apps/application-proxy.md) for on any on-premises apps published for cloud access
   1. Deploy [NPS](https://docs.microsoft.com/windows-server/networking/technologies/nps/nps-top) for any RADIUS authentication
   1. Ensure users have upgraded to supported versions of Microsoft Office with modern authentication enabled
1. Configure chosen [authentication methods](howto-mfa-getstarted.md#choose-verification-options)
1. Define your [named network locations](location-condition.md#named-locations)
1. Select groups to begin rolling out MFA.
1. Configure your [conditional access policies](howto-mfa-getstarted.md#create-conditional-access-policy)
1. Configure your MFA registration policy
   1. [Combined MFA and SSPR](howto-registration-mfa-sspr-combined.md)
   1. With [Identity Protection](../identity-protection/howto-mfa-policy.md)
   1. Without Identity Protection – use the Powershell commands
1. Send user communications and get users to enroll at [https://aka.ms/mfasetup](https://aka.ms/mfasetup)
1. [Keep track of who’s enrolled](#identify-non-registered-users)

## Manage your solution

Reports for Azure MFA

Azure Multi-Factor Authentication provides reports through the Azure portal:

| Report | Location | Description |
| Usage and fraud alerts | Azure AD > Sign-ins | Provides information on overall usage, user summary, and user details; as well as a history of fraud alerts submitted during the date range specified. |

## Troubleshoot MFA Issues

Find solutions for common issues with Azure MFA at the [Troubleshooting Azure Multi-Factor Authentication article](https://support.microsoft.com/help/2937344/troubleshooting-azure-multi-factor-authentication-issues) on the Microsoft Support Center.

## Next steps
