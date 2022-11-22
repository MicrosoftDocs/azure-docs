---
title: Azure Active Directory (Azure AD) feature availability in Azure Government
description: Learn which Azure AD features are available in Azure Government. 

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 09/15/2022

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: michmcla
ms.collection: M365-identity-device-management
---

# Azure Active Directory feature availability

<!---Jeremy said there are additional features that don't fit nicely in this list that we need to add later--->

This following tables list Azure AD feature availability in Azure Government.

## Azure Active Directory

|Service     | Feature | Availability |
|:------|---------|:------------:|
|**Authentication, single sign-on, and MFA**|Cloud authentication (Pass-through authentication, password hash synchronization) | &#x2705; |
|| Federated authentication (Active Directory Federation Services or federation with other identity providers) | &#x2705; |
|| Single sign-on (SSO) unlimited | &#x2705; | 
|| Multifactor authentication (MFA) <sup>1</sup>| &#x2705; | 
|| Passwordless (Windows Hello for Business, Microsoft Authenticator, FIDO2 security key integrations) | &#x2705; | 
|| Service-level agreement | &#x2705; | 
|**Applications access**|SaaS apps with modern authentication (Azure AD application gallery apps, SAML, and OAUTH 2.0) | &#x2705; | 
|| Group assignment to applications | &#x2705; | 
|| Cloud app discovery (Microsoft Defender for Cloud Apps) | &#x2705; | 
|| Application Proxy for on-premises, header-based, and Integrated Windows Authentication | &#x2705; | 
|| Secure hybrid access partnerships (Kerberos, NTLM, LDAP, RDP, and SSH authentication) | &#x2705; | 
|**Authorization and Conditional Access**|Role-based access control (RBAC) | &#x2705; | 
|| Conditional Access  | &#x2705; | 
|| SharePoint limited access | &#x2705; | 
|| Session lifetime management | &#x2705; | 
|| Identity Protection (vulnerabilities and risky accounts) | See [Identity protection](#identity-protection) below. | 
|| Identity Protection (risk events investigation, SIEM connectivity) | See [Identity protection](#identity-protection) below. | 
|**Administration and hybrid identity**|User and group management | &#x2705; | 
|| Advanced group management (Dynamic groups, naming policies, expiration, default classification) | &#x2705; | 
|| Directory synchronization—Azure AD Connect (sync and cloud sync) | &#x2705; | 
|| Azure AD Connect Health reporting | &#x2705; | 
|| Delegated administration—built-in roles  | &#x2705; | 
|| Global password protection and management – cloud-only users | &#x2705; | 
|| Global password protection and management – custom banned passwords, users synchronized from on-premises Active Directory | &#x2705; | 
|| Microsoft Identity Manager user client access license (CAL) | &#x2705; | 
|**End-user self-service**|Application launch portal (My Apps) | &#x2705; | 
|| User application collections in My Apps | &#x2705; |
|| Self-service account management portal (My Account) | &#x2705; |
|| Self-service password change for cloud users | &#x2705; |
|| Self-service password reset/change/unlock with on-premises write-back | &#x2705; |
|| Self-service sign-in activity search and reporting | &#x2705; |
|| Self-service group management (My Groups) | &#x2705; |
|| Self-service entitlement management (My Access) | &#x2705; |
|**Identity governance**|Automated user provisioning to apps | &#x2705; |
|| Automated group provisioning to apps | &#x2705; |
|| HR-driven provisioning | Partial. See [HR-provisioning apps](#hr-provisioning-apps). |
|| Terms of use attestation | &#x2705; |
|| Access certifications and reviews | &#x2705; |
|| Entitlement management | &#x2705; |
|| Privileged Identity Management (PIM), just-in-time access |  &#x2705; |
|**Event logging and reporting**|Basic security and usage reports | &#x2705; |
|| Advanced security and usage reports | &#x2705; |
|| Identity Protection: vulnerabilities and risky accounts | &#x2705; |
|| Identity Protection: risk events investigation, SIEM connectivity | &#x2705; |
|**Frontline workers**|SMS sign-in | Feature not available. |
|| Shared device sign-out | Enterprise state roaming for Windows 10 devices isn't available. |
|| Delegated user management portal (My Staff) | Feature not available. |

<sup>1</sup>Microsoft Authenticator only shows GUID and not UPN for compliance reasons.

## Identity protection

| Risk Detection | Availability |
|----------------|:--------------------:|
|Leaked credentials (MACE) | &#x2705; |
|Azure AD threat intelligence | Feature not available. |
|Anonymous IP address | &#x2705; | 
|Atypical travel | &#x2705; |
|Anomalous Token | Feature not available. |
|Token Issuer Anomaly| Feature not available. |
|Malware linked IP address | &#x2705; |
|Suspicious browser | &#x2705; |
|Unfamiliar sign-in properties | &#x2705; |
|Admin confirmed user compromised | &#x2705; |
|Malicious IP address | &#x2705; |
|Suspicious inbox manipulation rules | &#x2705; |
|Password spray | &#x2705; |
|Impossible travel | &#x2705; |
|New country | &#x2705; |
|Activity from anonymous IP address | &#x2705; |
|Suspicious inbox forwarding | &#x2705; |
|Azure AD threat intelligence | Feature not available. |
|Additional risk detected | &#x2705; |


## HR provisioning apps

| HR-provisioning app | Availability |
|----------------|:--------------------:|
|Workday to Azure AD User Provisioning | &#x2705; |
|Workday Writeback | &#x2705; |
|SuccessFactors to Azure AD User Provisioning | &#x2705; | 
|SuccessFactors to Writeback | &#x2705; |
|Provisioning agent configuration and registration with Gov cloud tenant| Works with special undocumented command-line invocation:<br> AADConnectProvisioningAgent.Installer.exe ENVIRONMENTNAME=AzureUSGovernment |





