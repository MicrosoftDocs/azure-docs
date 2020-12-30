---
title: Microsoft resources for verifying your security against the SolarWinds attack | Microsoft Docs
description: Learn about how to use resources created by Microsoft specifically to battle against the SolarWinds attack.
services: securitydocs
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

# After SolarWinds: Leverage Microsoft resources to verify your security

This article describes how to use the Microsoft resources created specifically to counteract the SolarWinds attack (Soliargate), with clear action items for you to perform to help ensure your organization's security.

## About the SolarWinds attack and Microsoft's response

## Azure Active Directory

## Microsoft 365 Defender

## Azure Defender for IoT

## Azure Sentinel

## Microsoft 365

## Understanding Solarigate's indicators of compromise (IOCs)

This section provides details about anomalies found by Microsoft in affected tenants that may indicate attacker activity, what to look for in your tenants, and how to mitigate the risks exposed by these anomalies. 

These anomalies generally include the following types:

|Anomaly  |Description  |
|---------|---------|
|**Anomalies in SAML tokens being presented for access**     | In some impacted tenants, Microsoft detected anomalous SAML tokens presented for access to the Microsoft Cloud, which were signed by customer certificates. <br><br> The anomalies indicate tha tthe customer SAML token-signing certificates may have been compromised, and that an attacker could be forging SAML tokens to access any resources that trust those certificates. <br><br>Compromising a SAML token-signing certificate usually requires admin access, and the presence of a forged SAML token usually indicates that the customer's on-premises infrastructure may be compromised. <br><br>**Note**: Since the signing certificate is the *root* of trust for the federated trust relationship, Service Providers would not easily detect the forgeries.         |
|**Anomalies in Microsoft 365 API access patterns**     | In some impacted tenants, Microsoft detected anomalous API access patters, originating from existing applications and service principals. <br><br> Anomalous API access patterns indicate that attackers with administrative credentials have added their own credentials to existing applications and service principals. <br><br>Microsoft 365 APIs can be used to access email, documents, chats, configuration settings (such as email forwarding), and more.  <br><br>Since you must have a highly-privileged Azure Active Directory (AAD) administrative account to add credentials to service principals, changes at this level can imply that one or more such privileged accounts have been compromised. There may be additional significant changes made in any impacted tenant.       |
| | |

The following sections detail how specific attack patterns that might use these anomalies, and what to verify in your tenants to ensure your organization's security. 

- [Forged SAML tokens](#forged-saml-tokens)
- [Illegitimate SAML trust relationship registrations](#illegitimate-saml-trust-relationship-registrations)
- [Added credentials to existing applications](#added-credentials-to-existing-applications)

> [!IMPORTANT]
> We recommend also reviewing the relevant IOCs listed by FireEye on the [FireEye Threat Research blog](https://www.fireeye.com/blog/threat-research/2020/12/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor.html).
>

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
- Tokens that were received *before* the time they were issued. This indicates a falsified issuance time after the token was received.
- Tokens that were used from outside typical user locations.
- Tokens that contained claims not previously seen by the tenant’s federation server.
- Tokens that indicated that MFA was used when the token claimed to authenticate from within the corporate estate, where MFA is not required.

> [!NOTE]
> Microsoft generally retains token logs only for 30 days, and never logs complete token. For this reason, Microsoft cannot see every aspect of an SAML  token. Customers who want longer retention can configure additional storage in Azure monitor or other systems. 
>
> The token anomalies detected were anomalous in lifetime, usage location, or claims (particularly MFA claims). The anomalies were sufficiently convincing as forgeries. These patterns were not found in all cases.

#### How these anomalies indicate forged SAML tokens

The token anomalies found in these cases an indicate any of the  following scenarios:

- **The SAML token-signing certificate was exfiltrated** from the customer environment, and used to forge tokens by the actor.

- **Administrative access to the SAML Token Signing Certificate storage had been compromised**, either via a service administrative access, or by direct device storage / memory inspection.

- **The customer environment was deeply penetrated**, with administrative access to identity infrastructure or the hardware environment running the identity infrastructure.

####  How to look for forged SAML tokens in your system

To search for forged SAML tokens in your system, look for the following types of tokens:

- SAML tokens received by the service provider with configurations that deviate from the IDP’s configured behavior.
- SAML tokens received by the service provider without corresponding issuing logs at the IDP.
- SAML tokens received by the service provider with MFA claims,  but without corresponding MFA activity logs at the IDP.
- SAML tokens that are received from IP addresses, agents, times, or for services which are anomalous for the requesting identity represented in the token.
- Evidence of unauthorized administrative activity.

#### What to do if you've found forged SAML tokens

If you think that you've found forged SAML tokens, perform the following steps:

- Determine how the certificates were exfiltrated, and remediate as needed. For more information, see <x>.
- Roll all SAML token signing certificates.
- Where possible, consider reducing your reliance on on-premises SAML trust relationships.
- Consider using an HSM to manage your SAML Token Signing Certificates. 

### Illegitimate SAML trust relationship registrations

In some cases, the SAML token forgeries described above correspond to configuration changes in the Service Provider. By impersonating a user with valid administrative credentials, the actor can change the configuration of the SAML Service Provider (in our case, Azure AD). In this case, the actor tells Azure AD to trust their certificate by, in effect, saying to the SP “There’s another SAML IDP you should trust, validate it with this public key.”

- [Anomalies found that indicate forged SAML tokens](#anomalies-found-that-indicate-forged-saml-tokens)
- [How these anomalies indicate forged SAML tokens](#how-these-anomalies-indicate-forged-saml-tokens)
- [How to look for forged SAML tokens in your system](#how-to-look-for-forged-saml-tokens-in-your-system)
- [What to do if you've found forged SAML tokens](#what-to-do-if-youve-found-forged-saml-tokens)

#### Types of illegitimate SAML trust relationship registrations found

Addition of federation trust relationships at the SP done which later resulted in SAML authentications of users with administrative privileges. The attacker took care to follow naming conventions of or impersonate existing federation server names (e.g. FED_SERVER01 exists, and they add FED_SERVERO1). The impersonated users later took actions consistent with attacker patterns described below.
Token forgeries consistent with pattern 1, above.
These calls came from different IP addresses for each call and user, but generally tracked back to anonymizing VPN servers.

#### Implications of illegitimate SAML trust relationship registrations 

Administrative access to the Azure AD was gained.
Attacker may have been unable to gain a toe-hold on premises, or was experimenting with other persistence mechanisms.
Attacker may have been unable to exfiltrate tokens, possibly due to use of HSM.

#### How to look for illegitimate SAML trust relationship registrations in your system

Anomalous administrative session associated with modification of federation trust relationships.

#### What to do if you've found illegitimate SAML trust relationship registrations

Review all federation trust relationships, ensure all are valid.
Determine mechanism of administrative account impersonation (see below).
Roll administrative account credentials.

### Added credentials to existing applications

Once the attacker was able to impersonate a privileged Azure AD admin account, they added credentials to existing applications or service principals, usually with the permissions they wanted already associated and high traffic patterns (e.g. mail archival applications). There are some cases in which we see the attacker add permissions to existing applications or service principals. We also see cases in which a new application or service principal was set up for a short while and used to add the permissions to the existing applications or service principals, possibly to add a layer of indirection (e.g. using it to add a credential to another service principal, then deleting it).

#### Types of added credentials found

Addition of federation trust relationships at the SP done which later resulted in SAML authentications of users with administrative privileges. The impersonated users later took actions consistent with attacker patterns described below.
Service Principals added into well known administrative roles such as Tenant Admin or Cloud Application Admin.
Reconnaissance to identify existing applications with application roles that have permissions to call Microsoft Graph.
The applications or service principals impersonated were different from customer to customer – the actor did not have a “go to” target.
The applications or service principals included both customer developer and vendor developed software.
No Microsoft 365 applications or service principals were used impersonated (customer credentials cannot be added to these applications and service principals).
Token forgeries consistent with pattern 1, above.

#### Implications of added credentials to existing applications
Administrative access to the Azure AD was gained.
Attacker did extensive recon to find unique applications which could be used to obfuscate their activity.

#### How to find added credentials in your system

Anomalous administrative session associated with modification of federation trust relationships.
Unexpected service principals added to privileged roles in cloud environments.

#### What to do if you've found added credentials in your system

Review all applications and service principals for credential modification activity.
Review all applications and service principals for excess permissions.
Remove all inactive service principals from your environment.
Regularly roll creds for all applications and service principals.

### Queries that impersonate existing applications
With credentials added to an existing application or service principal, the actor proceeded to acquire an OAUTH access token for the application using the forged credentials, and call APIs with the permissions which had been assigned to that applications. Most of the API calls we detected were focused on email and document extraction, but in some cases API calls added users, or added permissions to other applications or service principals. Calls were generally very targeted, synchronizing then monitoring email for specific users.

#### Types of impersonating queries found

Application calls attempting to authenticated to Microsoft Graph resource with applicationID: "00000003-0000-0000-c000-000000000000"
Impersonated calls to the Microsoft Graph Mail.Read and Mail.ReadWrite endpoints.
Impersonating calls came from anomalous endpoints. These endpoints were not repeated from customer to customer. The endpoints were usually Virtual Private Server (VPS) vendors.

#### Implications of impersonating queries

Attacker was primarily interested in persistence and reconnaissance.
Attacker was attempting to obfuscate their activity.

#### How to look for impersonating queries in your system

Anomalous requests to your resources from trusted applications or service principals.
Requests from service principals that added or modified groups, users, applications, service principals, or trust relationships.

#### What to do if you find impersonating queries in your system

Review all federation trust relationships, ensure all are valid.
Determine mechanism of administrative account impersonation (see below).
Roll administrative account credentials.

### Other attacker behaviors

This section relates other observations of attacker behavior.

Attacker access to on premises resources
Our optics into on premises behavior are limited, but here are the indicators we have as to how on premises access was gained. We recommend using on premises tools like Microsoft Defender for Identity (formerly Azure ATP) to detect other anomalies:

Compromised network management software used as command and control to place malicious binaries which exfiltrated SAML token signing certificate.
Compromised vendor credentials with existing administrative access (vendor network compromised).
Compromised service account credentials associated with compromised vendor software.
Use of non-MFA service account.
Attacker access to cloud resources
For administrative access to the Microsoft 365 cloud, we observed:

Forged SAML tokens impersonating accounts with cloud administrative privileges.
Accounts without MFA required – these are easily compromised (see https://aka.ms/yourpassworddoesntmatter)
Access from trusted vendor accounts where the attacker had compromised the vendor environment.
This graph summarizes the vectors and combinations tracked in this document.

 