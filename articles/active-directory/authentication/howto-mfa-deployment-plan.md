---
title: Plan and execute an Azure Multi-Factor Authentication deployment - Azure Active Directory
description: Microsoft Azure Multi-Factor Authentication deployment planning

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 09/01/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Planning a cloud-based Azure Multi-Factor Authentication

Users are connecting to organizational resources in increasingly complicated scenarios. They connect to resources from organization-owned, personal, and public devices on and off the corporate network by using smart phones, tablets, PCs, and laptops, often on multiple platforms. In this always-connected, multi-device and multi-platform world, the security of user accounts is more important than ever. A password no matter the complexity used across devices, networks, and platforms is no longer sufficient to ensure the security of the user account, especially when users tend to reuse passwords across accounts. Sophisticated phishing and other social engineering attacks can result in usernames and passwords being posted and sold across the dark web in minutes to hours.

[Azure Multi-Factor Authentication (MFA)](concept-mfa-howitworks.md) helps safeguard access to data and applications. It provides an additional layer of security using a second form of authentication. Organizations can use [Conditional Access](../conditional-access/overview.md) to make the solution fit their specific needs.

## Prerequisites to deployment

Before starting a deployment of Azure Multi-Factor Authentication there are prerequisite items that should be considered.

Certain MFA scenarios require that corresponding prerequisites be met.

| Scenario | Prerequisite |
| --- | --- |
| Cloud-only identity environment with modern authentication | No prerequisite tasks |
| Hybrid identity scenarios | [Azure AD Connect](../hybrid/whatis-hybrid-identity.md) is deployed and user identities are synchronized or federated with the on-premises Active Directory Domain Services with Azure Active Directory. |
| On-premises legacy applications published for cloud access | Azure AD [Application Proxy](../manage-apps/application-proxy.md) is deployed. |
| Using Azure MFA with RADIUS Authentication | "What doc should we point to here" A Network Policy Server is deployed. |
| Users have Microsoft Office 2010 or earlier, or Apple Mail for iOS 11 or earlier | Users must upgrade to Microsoft Office 2013 or later and Apple mail for iOS 12 or later as Conditional Access is not supported by legacy authentication protocols. |

## MFA Deployment Considerations

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

Some of the risk events detected by Azure Active Directory Identity Protection occur in real-time and some require offline processing. Administrators can choose to block users who exhibit risky behavior and remediate manually, require a password change, or require a multi-factor authentication "proof up" as part of their conditional access policies.

## Plan authentication methods

Administrators can choose the [authentication methods](../authentication/concept-authentication-methods.md) that they want to make available for users. It is important to allow more than a single authentication method so that users have a backup method available in case their primary method is unavailable. The following methods are available for administrators to enable:

### Notification through mobile app

A push notification is sent to the Microsoft Authenticator app on your mobile device. The user views the notification and selects **Approve** to complete verification. Push notifications through a mobile app provide the least intrusive option for users. They are also the most reliable and secure option because they use a data connection rather than telephony.

### Verification code from mobile app

A mobile app like the Microsoft Authenticator app generates a new OATH verification code every 30 seconds. The user enters the verification code into the sign-in interface. The mobile app option can be used whether or not the phone has a data or cellular signal.

### Call to phone

An automated voice call is placed to the user. The user answers the call and presses # in the phone keypad to authenticate. The phone number is not synchronized to on-premises Active Directory. The call option persists through a phone handset upgrade, allowing the user to register the mobile app on the new device.

### Text message to phone

A text message that contains a verification code is sent to the user, the user is prompted to enter the verification code into the sign-in interface.

## Define network locations

We recommended that organizations use Conditional Access to define their network using named locations. If your organization is using Identity Protection, consider using risk-based policies instead of named locations.

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

## Plan MFA registration policy

Administrators must determine how users will register for their methods. Organizations should enable the new registration experience for Azure MFA and self-service password reset (SSPR). SSPR allows users to reset their password in a secure way using the same methods they use for multi-factor authentication. We recommend this combined registration, currently in public preview, because it’s a great experience for users, with the ability to register once for both services.

### Registration with Identity Protection

If your organization is using Azure Active Directory Identity Protection, configure the MFA registration policy to prompt your users to register the next time they sign in interactively.

### Registration without identity Protection

If your organization does not have licenses that enable Identity Protection, users are prompted to register the next time that MFA is required at sign-in. This means that users may not have registered for MFA if they don't use applications protected with MFA. It's important to get all users registered so that bad actors cannot guess the password of a user and register for MFA on their behalf, effectively taking control of the account.

#### Enforcing registration

Using the following steps a conditional access policy can force users to register for Multi-Factor Authentication

1. Create a group, add all users not currently registered.
2. Using Azure Conditional Access, enforce MFA for this group for access to all resources. This will block access until the user registers (except from apps using legacy authentication).
3. Periodically, re-evaluate the group membership, and remove users who have registered from the group.

You may identify registered and non-registered Azure MFA users with PowerShell commands that rely on the MSOnline PowerShell module.

#### Identify registered users

```PowerShell
Get-MsolUser -All | where {$_.StrongAuthenticationMethods -ne $null} | Select-Object -Property UserPrincipalName | Sort-Object userprincipalname 
```

#### Identify non-registered users

```PowerShell
Get-MsolUser -All | where {$_.StrongAuthenticationMethods.Count -eq 0} | Select-Object -Property UserPrincipalName | Sort-Object userprincipalname 
```

## Plan Conditional Access policies

To plan your conditional access policy strategy, which will determine when MFA and other controls are required, refer to Deploy cloud-based Azure Multi-Factor Authentication.

It is important that you prevent being inadvertently locked out of your Azure Active Directory (Azure AD) tenant. You can mitigate the impact of this inadvertent lack of administrative access by creating two or more emergency access accounts in your tenant.

## Plan rollout to users

Your MFA rollout plan should include a pilot deployment followed by deployment waves that are within your support capacity. The best way to do this is to begin by applying your conditional access policies to one or a small number of groups. Once you’ve evaluated the effect on the users and progress in use and registration, you can either add more groups to the policy or add more users to the existing groups. 

### User Communications

Be sure to inform users in planned communications about the upcoming changes, Azure MFA registration requirements, and any necessary user actions. Microsoft provides communication templates and end-user documentation to assist your communications. You can also send users to https://myprofile.microsoft.com to register directly by selecting the Security Info links on that page. 

## Plan integration with on-premises systems

This section applies only to applications that do not authenticate directly against Azure Active Directory. Applications that authenticate directly with Azure Active Directory and have modern authentication (WS-Fed, SAML, OAuth, OpenID Connect) are covered in the above instructions.

Some legacy and on-premises applications require additional steps to use MFA. These include:

* Legacy on-premises applications, which will need to use Application proxy.
* On-premises RADIUS applications, which will need to use MFA adapter with NPS server.
* On-premises AD FS applications, which will need to use MFA adapter with AD FS 2016.

### Use Azure MFA with Azure Active Directory Application Proxy

Applications residing on-premises that are published to your Azure Active Directory tenant via Azure Active Directory Application Proxy may take advantage of Azure Multi-Factor Authentication if they are configured to use Azure Active Directory pre-authentication.

These applications may be subject to Azure Conditional Access policies that enforce Azure Multi-Factor Authentication, just like any other Azure Active Directory integrated application.

Likewise, if Azure Multi-Factor Authentication is enforced for all user sign-ins, on-premises applications published with Azure Active Directory Application Proxy will be protected.

### Integrating Azure Multi-Factor Authentication with Network Policy Server

The Network Policy Server (NPS) extension for Azure MFA adds cloud-based MFA capabilities to your authentication infrastructure using your existing servers. With the NPS extension, you can add phone call, text message, or phone app verification to your existing authentication flow without having to install, configure, and maintain new servers. This integration has the following limitations:

* With the CHAPv2 protocol, only authenticator app push notifications and voice call are supported.
* Conditional Access policies cannot be applied.

The NPS extension acts as an adapter between RADIUS and cloud-based Azure MFA to provide a second factor of authentication to protect VPN or Remote Desktop Gateway connections for federated or synced users. Users that register for Azure MFA in this environment will be challenged for all authentication attempts; the lack of conditional access policies mean MFA is “always on.”

#### Implementing Your NPS Server

If you have an NPS instance deployed and in use already, reference Integrate your existing NPS Infrastructure with Azure Multi-Factor Authentication.  If you are setting up the entire NPS instance, refer to Network Policy Server (NPS) for instructions and this troubleshooting guide for resolving error messages.

#### Prepare NPS for users that aren't enrolled for MFA

You should determine what happens when users that aren’t enrolled with MFA try to authenticate. Use the registry setting REQUIRE_USER_MATCH in the registry path HKLM\Software\Microsoft\AzureMFA to control the feature behavior. This setting has a single configuration option.

| Key | Value | Default |
| --- | --- | --- |
| REQUIRE_USER_MATCH | TRUE/FALSE | Not set (equivalent to TRUE) |

The purpose of this setting is to determine what to do when a user is not enrolled for MFA. The effects of changing this setting are listed in the table below.

| Settings | User MFA Status | Effects |
| --- | --- | --- |
| Key does not exist | Not enrolled | MFA challenge is unsuccessful |
| Value set to True / not set | Not enrolled | MFA challenge is unsuccessful |
| Key set to False | Not enrolled | Authentication without MFA |
| Key set to False or True | Enrolled | Must authenticate with MFA |

### Integrate Azure Multi-Factor Authentication with Active Directory Federation Services

If your organization is federated with Azure AD, you can use Azure Multi-Factor Authentication to secure AD FS resources, both on-premises and in the cloud. Azure MFA enables you to reduce passwords and provide a more secure way to authenticate. Starting with Windows Server 2016, you can now configure Azure MFA for primary authentication.

Unlike with AD FS in Windows Server 2012 R2, the AD FS 2016 Azure MFA adapter integrates directly with Azure AD and does not require an on-premises Azure MFA server. The Azure MFA adapter is built into Windows Server 2016, and there is no need for additional installation.

When using Azure MFA with AD FS 2016 and the target application is subject to Azure Conditional Access Policy, there are additional considerations:

* Conditional Access is available when the application is a relying party to Azure AD, federated with AD FS 2016.
* Conditional Access is not available when the application is a relying party to AD FS 2016 and is managed or federated with AD FS 2016.
* Conditional Access is also not available when AD FS 2016 is configured to use Azure MFA as the primary authentication method.

### Information Logged in AD FS when Azure MFA is Used

Standard AD FS 2016 logging in both the Windows Security Log and the AD FS Admin log, contains information about authentication requests and their success or failure. Event log data within these events will indicate whether Azure MFA was used. For example, an AD FS Auditing Event ID 1200 may contain:

```
<MfaPerformed>true</MfaPerformed>
<MfaMethod>MFA</MfaMethod>
```

### Renew and Manage AD FS Azure MFA Certificates

The following guidance details how to manage the Azure MFA certificates on your AD FS servers. When you configure AD FS with Azure MFA, the certificates generated via the `New-AdfsAzureMfaTenantCertificate` PowerShell cmdlet are valid for 2 years. You must renew and install the renewed certificates prior to expiration to ovoid disruptions in MFA service.

### Assess AD FS Azure MFA certificate expiration date

On each AD FS server, in the local computer My Store, there will be a self-signed Azure MFA certificate titled OU=Microsoft AD FS Azure MFA which contains the certificate expiration date. Check the validity period of this certificate on each AD FS server to determine the expiration date.

### Create new AD FS Azure MFA Certificate on each AD FS server

If the validity period of your certificates are nearing expiration, generate and verify a new MFA certificate on each server.

## Implement your Plan

Now that you have planned your solution, you can implement by following the steps below:

1. Meet any necessary prerequisites
   1. Deploy Azure AD Connect for any hybrid scenarios
   1. Deploy Azure AD Application Proxy for on any on-premises apps published for cloud access.
   1. Deploy Active Directory Federation Services If tenant is federated with ADFS
   1. Deploy NPS for any RADIUS authentication
   1. Ensure users have upgraded to supported versions of Microsoft Office
2. Configure chosen authentication methods with Conditional Access
3. Define your network.
4. Configure your Conditional Access policies
5. Select one or a few groups to begin rolling out MFA.
6. Configure your MFA registration policy
   1. Combined MFA and SSPR
   1. With Identity Protection
   1. Without Identity Protection – use the Powershell commands
7. Send user communications and get users to enroll.
8. Keep track of who’s enrolled

## Manage your solution

Reports for Azure MFA

Azure Multi-Factor Authentication provides reports through the Azure portal:

| Report | Location | Description |
| Usage and fraud alerts | Azure AD > Sign-ins | Provides information on overall usage, user summary, and user details; as well as a history of fraud alerts submitted during the date range specified. |

## Troubleshoot MFA Issues

Find solutions for common issues with Azure MFA at the Troubleshooting Azure Multi-Factor Authentication article on the Microsoft Support Center.

## Next steps