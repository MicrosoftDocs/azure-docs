---
title: Microsoft resources for verifying your security against the SolarWinds attack | Microsoft Docs
description: Learn about how to use resources created by Microsoft specifically to battle against the SolarWinds attack.
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2020
ms.author: bagol

---

# After SolarWinds: Apply Microsoft resources to verify your security

This article describes how to use the Microsoft resources created specifically to counteract the SolarWinds attack (Soliargate), with clear action items for you to perform to help ensure your organization's security.

## About the SolarWinds attack and Microsoft's response

In December 2020, [FireEye discovered a nation-state cyber attack on SolarWinds software]((https://www.fireeye.com/blog/threat-research/2020/12/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor.html).

Following this discovery, Microsoft swiftly took the following steps against the attack:

1. **Disclosed a set of complex techniques** used by an advanced actor in the attack, affecting several key customers. 

1. **Removed the digital certificates used by the Trojaned files,** effectively telling all Windows systems overnight to stop trusting those compromised files. 

1. **Updated Microsoft Windows Defender** to detect and alert if it found a Trojaned file on the system.

1. **Sinkholed one of the domains used by the malware** to command and control affected systems.

1. **Changed Windows Defender's default action for Solarigate from *Alert* to *Quarantine***, effectively killing the malware when found at the risk of crashing the system.

These steps helped to neutralize and then kill the malware and then taking control over the malware infrastructure from the attackers. 

The following sections provide additional instructions for customers to perform system checks using Microsoft software and help ensure continued security.

## Azure Active Directory

## Microsoft 365 Defender

## Azure Defender for IoT

## Azure Sentinel

## Microsoft 365

## Solarigate indicators of compromise (IOCs)

This section provides details about anomalies found by Microsoft in affected tenants that may indicate attacker activity, what to look for in your tenants, and how to mitigate the risks exposed by these anomalies.

> [!IMPORTANT]
> Although the steps taken by Microsoft detailed above have neutralized and killed the malware wherever found, we recommend that you perform your own checks for added security.
>
> We also recommend also reviewing the relevant IOCs listed by FireEye on the [FireEye Threat Research blog](https://www.fireeye.com/blog/threat-research/2020/12/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor.html).
> 

Anomalies found generally included the following types:

- [Anomalies in Microsoft 365 API access patterns](#anomalies-in-microsoft-365-api-access-patterns)
- [Anomalies in SAML tokens being presented for access](#anomalies-in-saml-tokens-being-presented-for-access)

The following sections detail how specific attack patterns that might use these anomalies, and what to verify in your tenants to ensure your organization's security. 

- [Forged SAML tokens](#forged-saml-tokens)
- [Illegitimate SAML trust relationship registrations](#illegitimate-saml-trust-relationship-registrations)
- [Added credentials to existing applications](#added-credentials-to-existing-applications)

### Anomalies in SAML tokens being presented for access

In some impacted tenants, Microsoft detected anomalous SAML tokens presented for access to the Microsoft Cloud, which were signed by customer certificates. 

The anomalies indicate tha the customer SAML token-signing certificates may have been compromised, and that an attacker could be forging SAML tokens to access any resources that trust those certificates.

Compromising a SAML token-signing certificate usually requires admin access, and the presence of a forged SAML token usually indicates that the customer's on-premises infrastructure may be compromised. 

> [!NOTE]
> Since the signing certificate is the *root* of trust for the federated trust relationship, service principals would not easily detect these forgeries.         
> 

### Anomalies in Microsoft 365 API access patterns

In some impacted tenants, Microsoft detected anomalous API access patters, originating from existing applications and service principals. 

Anomalous API access patterns indicate that attackers with administrative credentials have added their own credentials to existing applications and service principals. 

Microsoft 365 APIs can be used to access email, documents, chats, configuration settings (such as email forwarding), and more.  

Since you must have a highly privileged Azure Active Directory (AAD) administrative account to add credentials to service principals, changes at this level can imply that one or more such privileged accounts have been compromised. There may be additional significant changes made in any impacted tenant.       


### Forged SAML tokens

- [Anomalies found that indicate forged SAML tokens](#anomalies-found-that-indicate-forged-saml-tokens)
- [How these anomalies indicate forged SAML tokens](#how-these-anomalies-indicate-forged-saml-tokens)
- [How to look for forged SAML tokens in your system](#how-to-look-for-forged-saml-tokens-in-your-system)
- [What to do if you've found forged SAML tokens](#what-to-do-if-youve-found-forged-saml-tokens)

#### Anomalies found that indicate forged SAML tokens

Anomalous tokens found included the following types:

- Tokens with an expiration of *exactly* **3600 seconds** or **144000 seconds**, with no millisecond values. 

    **144000** = **40 hours,** and is considered to be exceptionally long for a token expiration.
- Tokens that were received at the same time as the issuance time, without any delay between creation and usage
- Tokens that were received *before* the time they were issued. These tokens indicate a falsified issuance time after the token was received.
- Tokens that were used from outside typical user locations.
- Tokens that contained claims not previously seen by the tenant’s federation server.
- Tokens that indicated that MFA was used when the token claimed to authenticate from within the corporate estate, where MFA is not required.

> [!NOTE]
> Microsoft generally retains token logs only for 30 days, and never logs complete token. For this reason, Microsoft cannot see every aspect of an SAML  token. Customers who want longer retention can configure additional storage in Azure monitor or other systems. 
>
> The token anomalies detected were anomalous in lifetime, usage location, or claims (particularly MFA claims). The anomalies were sufficiently convincing as forgeries. These patterns were not found in all cases.

#### How these anomalies indicate forged SAML tokens

The token anomalies found in these cases may indicate any of the following scenarios:

- **The SAML token-signing certificate was exfiltrated** from the customer environment, and used to forge tokens by the actor.

- **Administrative access to the SAML Token Signing Certificate storage had been compromised**, either via a service administrative access, or by direct device storage / memory inspection.

- **The customer environment was deeply penetrated**, with administrative access to identity infrastructure, or the hardware environment running the identity infrastructure.

####  How to look for forged SAML tokens in your system

To search for forged SAML tokens in your system, look for the following indications:

- SAML tokens received by the service principal with configurations that deviate from the IDP’s configured behavior.

- SAML tokens received by the service principal without corresponding issuing logs at the IDP.

- SAML tokens received by the service principal with MFA claims,  but without corresponding MFA activity logs at the IDP.

- SAML tokens that are received from IP addresses, agents, times, or for services that are anomalous for the requesting identity represented in the token.

- Other evidence of unauthorized administrative activity.

#### What to do if you've found forged SAML tokens

If you think that you've found forged SAML tokens, perform the following steps:

- Determine how the certificates were exfiltrated, and remediate as needed.

- Roll all SAML token signing certificates.

- Where possible, consider reducing your reliance on on-premises SAML trust relationships.

- Consider using a Hardware Security Model (HSM) to manage your SAML Token Signing Certificates.

### Illegitimate SAML trust relationship registrations

In some cases, the SAML token forgeries correspond to service principal configuration changes. 

Actors can change SAML service principal configurations, such as Azure AD, telling the service principal to trust their certificate. In effect, in our case, the actor has told Azure AD, "Here is another SAML IDP that you should trust. Validate it with this public key." This additional trust is illegitimate.

For more information, see:

- [Types of illegitimate SAML trust relationship registrations found](#types-of-illegitimate-saml-trust-relationship-registrations-found)
- [Implications of illegitimate SAML trust relationship registrations](#implications-of-illegitimate-saml-trust-relationship-registrations)
- [How to look for illegitimate SAML trust relationship registrations in your system](#how-to-look-for-illegitimate-saml-trust-relationship-registrations-in-your-system)
- [What to do if you've found illegitimate SAML trust relationship registrations](#what-to-do-if-youve-found-illegitimate-saml-trust-relationship-registrations)

#### Types of illegitimate SAML trust relationship registrations found

Microsoft found the following types of illegitimate SAML trust relationship registrations on affected tenants:

- **The addition of federation trust relationships at the service principal**, which later resulted in SAML authentications of users with administrative privileges. 

    The actor took care to follow existing naming conventions for server names, or copy existing server names. For example, if a server named **GOV_SERVER01** already existed, they created a new one named **GOV_SERVERO1**.

    The impersonated users later took actions consistent with attacker patterns described below. see <x>.

- **Token forgeries** consistent with the [patterns described above](#forged-saml-tokens). 

Calls generally came from different IP addresses for each call and impersonated user, but generally tracked back to anonymous VPN servers.

#### Implications of illegitimate SAML trust relationship registrations 

Registering illegitimate SAML trust relationships provided administrative access to Azure AD. 

This may mean that the actors had been unable to gain access to on-premises resources, or was experimenting with other persistence mechanisms.

Additionally, this may mean that the actor may have been unable to exfiltrate tokens, possibly due to use of HSM.

#### How to look for illegitimate SAML trust relationship registrations in your system

Look for any anomalous administrative sessions that are associated with modifications to federation trust relationships.

#### What to do if you've found illegitimate SAML trust relationship registrations

If you think you've found an illegitimate SAML trust relationship registration, we recommend that you perform the following steps to secure your environment:

- Review all federation trust relationships to ensure that they are all valid.
- Determine how the administrative account was impersonated. For more information, see [below](queries-that-impersonate-existing-applications).
- Roll back any illegitimate administrative account credentials.

### Added credentials to existing applications

Once an actor has been able to impersonate a privileged Azure AD administrator, they added credentials to existing applications or service principals, usually with the permissions that they wanted already associated and high traffic patterns, such as for mail archive applications.

In some cases, Microsoft found that the actor had added permissions for a new application or service principal for a short while, and used those permissions as another layer of indirection.

For more information, see:

- [Types of added credentials found](#types-of-added-credentials-found)
- [Implications of added credentials to existing applications](#implications-of-added-credentials-to-existing-applications)
- [How to find added credentials in your system](#how-to-find-added-credentials-in-your-system)
- [What to do if you've found added credentials in your system](#what-to-do-if-youve-found-added-credentials-in-your-system)

#### Types of added credentials found

Microsoft found the following types of added credentials in affected tenants:

- The addition of federation trust relationships at the service principal, resulting in SAML user authentications with administrative privileges. 

    The impersonated users later took actions consistent with attacker patterns described below.

- Service principals added into well-known administrative roles, such as **Tenant Admin** or **Cloud Application Admin**.

- Reconnaissance to identify existing applications that have application roles with permissions to call Microsoft Graph.

- Token forgeries consistent with the patterns described [above](#forged-saml-tokens)

The impersonated applications or service principals were different across different customers, and the actor did not have a default type of target. Impersonated applications and service principals included both customer-developed and vendor-developed software. 

Additionally, no Microsoft 365 applications or service principals were used when impersonated. Customer credentials cannot be added to these applications and service principals.

#### Implications of added credentials to existing applications

The addition of credentials to existing applications enabled the actor gain access to Azure AD. 

The actor performed extensive reconnaissance to find unique applications that could be used to obfuscate their activity.

#### How to find added credentials in your system

Search for the following indications:

- Anomalous administrative sessions associated with modified  federation trust relationships.

- Unexpected service principals added to privileged roles in cloud environments.

#### What to do if you've found added credentials in your system

If you think you've found added credentials the applications in your system, we recommend that you perform the following steps:

- Review all applications and service principals for credential modification activity.

- Review all applications and service principals for excess permissions.

- Remove all inactive service principals from your environment.

- Regularly roll credentials for all applications and service principals.

### Queries that impersonate existing applications

Once credentials were added to existing applications or service principals, the actor proceeded to acquire an OAUTH access token for the application using the forged credentials, and call APIs with the assigned permissions.

Most of the relevant API calls found on affected tenants were focused on email and document extraction, although some API calls also added users, or added permissions for other applications or service principals. 

Calls were generally very targeted, synchronizing, and then monitoring emails for specific users.

For more information, see:

- [Types of impersonating queries found](#types-of-impersonating-queries-found)
- [Implications of impersonating queries](#implications-of-impersonating-queries)
- [How to look for impersonating queries in your system](#how-to-look-for-impersonating-queries-in-your-system)
- [What to do if you find impersonating queries in your system](#what-to-do-if-you-find-impersonating-queries-in-your-system)

#### Types of impersonating queries found

The following types of impersonating queries were found on affected tenants:

- Application calls attempting to authenticate to Microsoft Graph resources with the following **applicationID**: `00000003-0000-0000-c000-000000000000`

- Impersonated calls to the Microsoft Graph **Mail.Read** and **Mail.ReadWrite** endpoints.

- Impersonating calls from anomalous endpoints. These endpoints were not repeated from customer to customer, and were usually Virtual Private Server (VPS) vendors.

#### Implications of impersonating queries

The actor used impersonating queries primarily to obfuscate their persistence and reconnaissance activities.

#### How to look for impersonating queries in your system

Search for the following in your systems:

- Anomalous requests to your resources from trusted applications or service principals.

- Requests from service principals that added or modified groups, users, applications, service principals, or trust relationships.

#### What to do if you find impersonating queries in your system

If you think you've found impersonating queries in your environment, we recommend taking the following steps:

- Review all federation trust relationships, ensure all are valid.

- Determine how the administrative account was impersonated.

- Roll administrative account credentials.

### Other attacker behaviors

Microsoft also found the following types of attacker behaviors in affected tenants:

|Behavior  |Details  |
|---------|---------|
|**Attacker access to on premises resources**     | While Microsoft has a limited ability to view on-premises behavior, we have the following indications as to how on-premises access was gained. <br><br> - **Compromised network management software** was used as command and control software, and placed malicious binaries that exfiltrated SAML token-signing certificates.<br><br>- **Vendor networks were compromised**, including vendor credentials with existing administrative access.<br><br>- **Service account credentials, associated with compromised vendor software**, were also compromised.<br><br>- **Non-MFA service accounts** were used.  <br><br>**Important**: We recommend using on-premises tools, such as [Microsoft Defender for Identity](#microsoft-365-defender), to detect other anomalies.     |
|**Attacker access to cloud resources**     |   For administrative access to the Microsoft 365 cloud, Microsoft found evidence of the following indicators: <br><br>    - **Forged SAML tokens**, which impersonated accounts with cloud administrative privileges. <br><br>- **Accounts with no MFA required**. Such accounts [easily compromised](https://aka.ms/yourpassworddoesntmatter).     <br><br>- Access allowed from **trusted, but compromised vendor accounts**.      |
|   |         |


## References

For more information, see:


- **Microsoft On The Issues**: [Important steps for customers to protect themselves from recent nation-state cyberattacks](https://blogs.microsoft.com/on-the-issues/2020/12/13/customers-protect-nation-state-cyberattacks/)

- **Microsoft Security Response Center**: 

    - [Solorigate Resource Center: https://aka.ms/solorigate](https://aka.ms/solorigate)
    
    - [Customer guidance on recent nation-state cyber attack](https://msrc-blog.microsoft.com/2020/12/13/customer-guidance-on-recent-nation-state-cyber-attacks/)

- **Azure Active Directory Identity blog**: [Understanding "Solorigate"'s Identity IOCs - for Identity Vendors and their customers](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/understanding-quot-solorigate-quot-s-identity-iocs-for-identity/ba-p/2007610)

- **TechCommunity**: 

    - [Azure AD workbook to help you assess Solarigate risk](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/azure-ad-workbook-to-help-you-assess-solorigate-risk/ba-p/2010718)
    
    - [Solarwinds: Post compromise hunting with Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/solarwinds-post-compromise-hunting-with-azure-sentinel/ba-p/1995095)

- **Microsoft Security Intelligence**: [Malware encyclopedia definition: Solarigate](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:MSIL/Solorigate.B!dha)

- **Microsoft Security blog**: 

    - [Analyzing Solarigate: The compromised DLL file that started a sophisticated cyberattack and how Microsoft Defender helps protect](https://www.microsoft.com/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/)
    
    - [Advice for incident responders on recovery from system identity compromises](https://www.microsoft.com/security/blog/2020/12/21/advice-for-incident-responders-on-recovery-from-systemic-identity-compromises/) from the Detection and Response Team (DART)
    
    - [Using Microsoft 365 Defender to coordinate protection against Solorigate](https://www.microsoft.com/security/blog/2020/12/28/using-microsoft-365-defender-to-coordinate-protection-against-solorigate/)

- **GitHub resources**: [Azure Sentinel workbook for SolarWinds post-compromise hunting](https://github.com/Azure/Azure-Sentinel/blob/master/Workbooks/SolarWindsPostCompromiseHunting.json)