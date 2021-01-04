---
title: Solorigate indicators of compromise (IOCs) | Microsoft Docs
description: Learn about the IOC found by Microsoft in the Solorigate attack, and how to mitigate any found in your system.
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


# Solorigate indicators of compromise (IOCs)

This section provides details about anomalies found by Microsoft in tenants affected by Solorigate that may indicate attacker activity. Use these anomalies as indicators of what to look for in your tenants, and how to mitigate the risks exposed by these anomalies.

> [!IMPORTANT]
> Although the steps taken by Microsoft detailed above have neutralized and killed the Solorigate malware wherever found, if you've been affected by the SolarWinds attack, we recommend that you perform your own checks for added security.
>
> We also recommend also reviewing the relevant IOCs listed by FireEye on the [FireEye Threat Research blog](https://www.fireeye.com/blog/threat-research/2020/12/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor.html).
> 

## Overivew: System anomalies found in Solorigate

System anomalies found in Solorigate included the following types:

- [Anomalies in Microsoft 365 API access patterns](#anomalies-in-microsoft-365-api-access-patterns)
- [Anomalies in SAML tokens being presented for access](#anomalies-in-saml-tokens-being-presented-for-access)

The following sections detail how specific attack patterns that might use these anomalies, and what to verify in your tenants to ensure your organization's security. 

- [Forged SAML tokens](#forged-saml-tokens)
- [Illegitimate SAML trust relationship registrations](#illegitimate-saml-trust-relationship-registrations)
- [Added credentials to existing applications](#added-credentials-to-existing-applications)

For more information, see:

- [Solorigate attacker behaviors](#solorigate-attacker-behaviors)
- [MITRE ATT&CK techniques observed in Solorigate](#mitre-attck-techniques-observed-in-solorigate)

### Anomalies in SAML tokens being presented for access

In some tenants impacted by Solorigate, Microsoft detected anomalous SAML tokens presented for access to the Microsoft Cloud, which were signed by customer certificates. 

The anomalies indicate tha the customer SAML token-signing certificates may have been compromised, and that an attacker could be forging SAML tokens to access any resources that trust those certificates.

Compromising a SAML token-signing certificate usually requires admin access, and the presence of a forged SAML token usually indicates that the customer's on-premises infrastructure may be compromised. 

> [!NOTE]
> Since the signing certificate is the *root* of trust for the federated trust relationship, service principals would not easily detect these forgeries.         
> 

### Anomalies in Microsoft 365 API access patterns

In some tenants impacted by Solorigate, Microsoft detected anomalous API access patters, originating from existing applications and service principals. 

Anomalous API access patterns indicate that attackers with administrative credentials have added their own credentials to existing applications and service principals. 

Microsoft 365 APIs can be used to access email, documents, chats, configuration settings (such as email forwarding), and more.  

Since you must have a highly privileged Azure Active Directory (AAD) administrative account to add credentials to service principals, changes at this level can imply that one or more such privileged accounts have been compromised. There may be other significant changes made in any impacted tenant.       


## Forged SAML tokens

- [Anomalies found that indicate forged SAML tokens](#anomalies-found-that-indicate-forged-saml-tokens)
- [How these anomalies indicate forged SAML tokens](#how-these-anomalies-indicate-forged-saml-tokens)
- [How to look for forged SAML tokens in your system](#how-to-look-for-forged-saml-tokens-in-your-system)
- [What to do if you've found forged SAML tokens](#what-to-do-if-youve-found-forged-saml-tokens)

### Anomalies found that indicate forged SAML tokens

Anomalous tokens found in tenants affected by Solorigate included the following types:

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

### How these anomalies indicate forged SAML tokens

The token anomalies found in in tenants affected by Solorigate may indicate any of the following scenarios:

- **The SAML token-signing certificate was exfiltrated** from the customer environment, and used to forge tokens by the actor.

- **Administrative access to the SAML Token Signing Certificate storage had been compromised**, either via a service administrative access, or by direct device storage / memory inspection.

- **The customer environment was deeply penetrated**, with administrative access to identity infrastructure, or the hardware environment running the identity infrastructure.

###  How to look for forged SAML tokens in your system

To search for forged SAML tokens in your system, look for the following indications:

- SAML tokens received by the service principal with configurations that deviate from the IDP’s configured behavior.

- SAML tokens received by the service principal without corresponding issuing logs at the IDP.

- SAML tokens received by the service principal with MFA claims,  but without corresponding MFA activity logs at the IDP.

- SAML tokens that are received from IP addresses, agents, times, or for services that are anomalous for the requesting identity represented in the token.

- Other evidence of unauthorized administrative activity.

### What to do if you've found forged SAML tokens

If you think that you've found forged SAML tokens, perform the following steps:

- Determine how the certificates were exfiltrated, and remediate as needed.

- Roll all SAML token signing certificates.

- Where possible, consider reducing your reliance on on-premises SAML trust relationships.

- Consider using a Hardware Security Model (HSM) to manage your SAML Token Signing Certificates.

## Illegitimate SAML trust relationship registrations

In some cases, the SAML token forgeries correspond to service principal configuration changes. 

Actors can change SAML service principal configurations, such as Azure AD, telling the service principal to trust their certificate. In effect, in our case, the actor has told Azure AD, "Here is another SAML IDP that you should trust. Validate it with this public key." This extra trust is illegitimate.

For more information, see:

- [Types of illegitimate SAML trust relationship registrations found](#types-of-illegitimate-saml-trust-relationship-registrations-found)
- [Implications of illegitimate SAML trust relationship registrations](#implications-of-illegitimate-saml-trust-relationship-registrations)
- [How to look for illegitimate SAML trust relationship registrations in your system](#how-to-look-for-illegitimate-saml-trust-relationship-registrations-in-your-system)
- [What to do if you've found illegitimate SAML trust relationship registrations](#what-to-do-if-youve-found-illegitimate-saml-trust-relationship-registrations)

### Types of illegitimate SAML trust relationship registrations found

Microsoft found the following types of illegitimate SAML trust relationship registrations in tenants affected by Solorigate:

- **The addition of federation trust relationships at the service principal**, which later resulted in SAML authentications of users with administrative privileges. 

    The actor took care to follow existing naming conventions for server names, or copy existing server names. For example, if a server named **GOV_SERVER01** already existed, they created a new one named **GOV_SERVERO1**.

    The impersonated users later took actions consistent with detected attacker patterns.

- **Token forgeries** consistent with the [patterns described above](#forged-saml-tokens). 

Calls generally came from different IP addresses for each call and impersonated user, but generally tracked back to anonymous VPN servers.

### Implications of illegitimate SAML trust relationship registrations 

Registering illegitimate SAML trust relationships can provide administrative access to Azure AD. 

Evidence of illegitimate SAML trust relationships registered may mean that the actors had been unable to gain access to on-premises resources, or was experimenting with other persistence mechanisms.

Additionally, illegitimately registered relationships may mean that the actor may have been unable to exfiltrate tokens, possibly due to use of HSM.

### How to look for illegitimate SAML trust relationship registrations in your system

Look for any anomalous administrative sessions that are associated with modifications to federation trust relationships.

### What to do if you've found illegitimate SAML trust relationship registrations

If you think you've found an illegitimate SAML trust relationship registration, we recommend that you perform the following steps to secure your environment:

- Review all federation trust relationships to ensure that they are all valid.
- Determine how the administrative account was impersonated. For more information, see [below](#queries-that-impersonate-existing-applications).
- Roll back any illegitimate administrative account credentials.

## Added credentials to existing applications

Once an actor has been able to impersonate a privileged Azure AD administrator, they can add credentials to existing applications or service principals, usually with the permissions that they wanted already associated and high traffic patterns, such as for mail archive applications.

In some tenants affected by Solorigate, Microsoft found that the actor had added permissions for a new application or service principal for a short while, and used those permissions as another layer of indirection.

For more information, see:

- [Types of added credentials found](#types-of-added-credentials-found)
- [Implications of added credentials to existing applications](#implications-of-added-credentials-to-existing-applications)
- [How to find added credentials in your system](#how-to-find-added-credentials-in-your-system)
- [What to do if you've found added credentials in your system](#what-to-do-if-youve-found-added-credentials-in-your-system)

### Types of added credentials found

Microsoft found the following types of added credentials in tenants affected by Solorigate:

- The addition of federation trust relationships at the service principal, resulting in SAML user authentications with administrative privileges. 

    The impersonated users later took actions consistent with attacker patterns described below.

- Service principals added into well-known administrative roles, such as **Tenant Admin** or **Cloud Application Admin**.

- Reconnaissance to identify existing applications that have application roles with permissions to call Microsoft Graph.

- Token forgeries consistent with the patterns described [above](#forged-saml-tokens)

The impersonated applications or service principals were different across different customers, and the actor did not have a default type of target. Impersonated applications and service principals included both customer-developed and vendor-developed software. 

Additionally, no Microsoft 365 applications or service principals were used when impersonated. Customer credentials cannot be added to these applications and service principals.

### Implications of added credentials to existing applications

The addition of credentials to existing applications can enable an attacker to gain access to Azure AD. 

The attacker can then perform extensive reconnaissance to find unique applications that could be used to obfuscate their activity.

### How to find added credentials in your system

Search for the following indications:

- Anomalous administrative sessions associated with modified  federation trust relationships.

- Unexpected service principals added to privileged roles in cloud environments.

### What to do if you've found added credentials in your system

If you think you've found added credentials the applications in your system, we recommend that you perform the following steps:

- Review all applications and service principals for credential modification activity.

- Review all applications and service principals for excess permissions.

- Remove all inactive service principals from your environment.

- Regularly roll credentials for all applications and service principals.

## Queries that impersonate existing applications

Once credentials were added to existing applications or service principals, the actor proceeded to acquire an OAUTH access token for the application using the forged credentials, and call APIs with the assigned permissions.

Most of the relevant API calls found on affected tenants were focused on email and document extraction, although some API calls also added users, or added permissions for other applications or service principals. 

Calls were generally very targeted, synchronizing, and then monitoring emails for specific users.

For more information, see:

- [Types of impersonating queries found](#types-of-impersonating-queries-found)
- [Implications of impersonating queries](#implications-of-impersonating-queries)
- [How to look for impersonating queries in your system](#how-to-look-for-impersonating-queries-in-your-system)
- [What to do if you find impersonating queries in your system](#what-to-do-if-you-find-impersonating-queries-in-your-system)

### Types of impersonating queries found

The following types of impersonating queries were found on affected tenants:

- Application calls attempting to authenticate to Microsoft Graph resources with the following **applicationID**: `00000003-0000-0000-c000-000000000000`

- Impersonated calls to the Microsoft Graph **Mail.Read** and **Mail.ReadWrite** endpoints.

- Impersonating calls from anomalous endpoints. These endpoints were not repeated from customer to customer, and were usually Virtual Private Server (VPS) vendors.

### Implications of impersonating queries

The actor used impersonating queries primarily to obfuscate their persistence and reconnaissance activities.

### How to look for impersonating queries in your system

Search for the following in your systems:

- Anomalous requests to your resources from trusted applications or service principals.

- Requests from service principals that added or modified groups, users, applications, service principals, or trust relationships.

### What to do if you find impersonating queries in your system

If you think you've found impersonating queries in your environment, we recommend taking the following steps:

- Review all federation trust relationships, ensure all are valid.

- Determine how the administrative account was impersonated. For more information, see [below](#queries-that-impersonate-existing-applications).

- Roll administrative account credentials.

## Solorigate attacker behaviors

Microsoft also found the following types of attacker behaviors in tenants affected by Solorigate:

|Behavior  |Details  |
|---------|---------|
|**Attacker access to on premises resources**     | While Microsoft has a limited ability to view on-premises behavior, we have the following indications as to how on-premises access was gained. <br><br> - **Compromised network management software** was used as command and control software, and placed malicious binaries that exfiltrated SAML token-signing certificates.<br><br>- **Vendor networks were compromised**, including vendor credentials with existing administrative access.<br><br>- **Service account credentials, associated with compromised vendor software**, were also compromised.<br><br>- **Non-MFA service accounts** were used.  <br><br>**Important**: We recommend using on-premises tools, such as [Microsoft Defender for Identity](#use-microsoft-defender-to-respond-to-supply-chain-attacks-and-systemic-identity-threats), to detect other anomalies.     |
|**Attacker access to cloud resources**     |   For administrative access to the Microsoft 365 cloud, Microsoft found evidence of the following indicators: <br><br>    - **Forged SAML tokens**, which impersonated accounts with cloud administrative privileges. <br><br>- **Accounts with no MFA required**. Such accounts [easily compromised](https://aka.ms/yourpassworddoesntmatter).     <br><br>- Access allowed from **trusted, but compromised vendor accounts**.      |
|   |         |

## MITRE ATT&CK techniques observed in Solorigate

The following table lists the attacker techniques found in the Solorigate attack, which are documented in the [MITRE ATT&CK framework](https://attack.mitre.org/).

|Technique  |Reference  |
|---------|---------|
|**Initial Access**     |  [T1195.001 Supply Chain Compromise](https://attack.mitre.org/techniques/T1195/001/)      |
|**Execution**     |  [T1072 Software Deployment Tools](https://attack.mitre.org/techniques/T1072/)       |
|**Command and Control**     |  [T1071.004 Application Layer Protocol: DNS](https://attack.mitre.org/techniques/T1071/004/) <br><br>[T1017.001 Application Layer Protocol: Web Protocols](https://attack.mitre.org/techniques/T1071/001/) <br><br>[T1568.002 Dynamic Resolution: Domain Generation Algorithms](https://attack.mitre.org/techniques/T1568/002/) <br><br>[T1132 Data Encoding](https://attack.mitre.org/techniques/T1132/)       |
|**Persistence**     |    [T1078 Valid Accounts](https://attack.mitre.org/techniques/T1071/001/)     |
|**Defense Evasion**     |   [T1480.001 Execution Guardrails: Environmental Keying](https://attack.mitre.org/techniques/T1480/001/) <br><br>[T1562.001 Impair Defenses: Disable or Modify Tools](https://attack.mitre.org/techniques/T1562/001/)      |
|**Collection**     |  [T1005 Data From Local System](https://attack.mitre.org/techniques/T1005/)        |
|     |         |


## Next steps

If you think that your organization has been affected by a supply chain attack and/or systemic identity compromise, make sure to use Microsoft solutions to mitigate the risk.

**Azure Sentinel** users have the advantage of connectors that enable you to view all related alerts in a single place. You can also view alerts separately, in **Azure Defender for Endpoint** and **Azure Active Directory**.  

For more information, see:

- [Using Azure Sentinel to respond to supply chain attacks and systemic identity compromise](identity-compromise-azure-sentinel.md).

- [Using Azure Defender to respond to supply chain attacks and systemic identity compromise](identity-compromise-defender.md) 

- [Using Azure Active Directory to respond to supply chain attacks and systemic identity compromise](identity-compromise-aad.md)
