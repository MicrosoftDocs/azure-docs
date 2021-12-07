---
title: Azure AD feature availability in Azure Government
description: Learn which Azure AD features are available in Azure Government. 

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/25/2021

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: michmcla
ms.collection: M365-identity-device-management
---

# Cloud feature availability

<!---Jeremy said there are additional features that don't fit nicely in this list that we need to add later--->

This topic covers Azure AD feature availability in Azure Government.

## Feature availability

| Feature | Availability |
|---------|:------------:|
| **Authentication, single sign-on and multifactor authentication (MFA)** |   | 
| - Cloud authentication (Pass-through authentication, password hash synchronization) | ● |
| - Federated authentication (Active Directory Federation Services or federation with other identity providers) | ● |
| - Single sign-on (SSO) unlimited |  | 
| - Multifactor authentication (MFA) | Hardware OATH tokens are not available. Instead, use Conditional Access policies with named locations to establish when multifactor authentication should and should not be required based off the user's current IP address. Authenticator app only shows GUID and not UPN for compliance reasons. | 
| - Passwordless (Windows Hello for Business, Microsoft Authenticator, FIDO2 security key integrations) | ● | 
| - Service-level agreement | ● | 
| **Applications Access** |   |
| - SaaS apps with modern authentication (Azure AD application gallery apps, SAML, and OAUTH 2.0) | ● | 
| - Group assignment to applications | ● | 
| - Cloud app discovery (Microsoft Cloud App Security) | ● | 
| - Application Proxy for on-premises, header-based, and Integrated Windows Authentication | ● | 
| - Secure hybrid access partnerships (Kerberos, NTLM, LDAP, RDP, and SSH authentication) | ● | 
| **Authorization and Conditional Access)** |   |
| - Role-based access control (RBAC) | ● | 
| - Conditional Access  | ● | 
| - SharePoint limited access | ● | 
| - Session lifetime management | ● | 
| - Identity Protection (Risky sign-ins, risky users, risk-based conditional access) | See [Identity protection](#identity-protection). | 
| **Administration and hybrid identity** |   |
| - User and group management | ● | 
| - Advanced group management (Dynamic groups, naming policies, expiration, default classification) | ● | 
| - Directory synchronization—Azure AD Connect (sync and cloud sync) | ● | 
| - Azure AD Connect Health reporting | ● | 
| - Delegated administration—built-in roles  | ● | 
| - Global password protection and management – cloud-only users | ● | 
| - Global password protection and management – custom banned passwords, users synchronized from on-premises Active Directory | ● | 
| - Microsoft Identity Manager user client access license (CAL) | ● | 
| **End-user self-service** |  |
| - Application launch portal (My Apps) | ● | 
| - User application collections in My Apps | ● |
| - Self-service account management portal (My Account) | ● |
| - Self-service password change for cloud users | ● |
| - Self-service password reset/change/unlock with on-premises write-back | ● |
| - Self-service sign-in activity search and reporting |  ● |
| - Self-service group management (My Groups) | ● |
| - Self-service entitlement management (My Access) | ● |
| **Identity Governance** |  |
| - Automated user provisioning to apps | ● |
| - Automated group provisioning to apps | ● |
| - HR-driven provisioning | Partial. See [HR-provisioning apps](#hr-provisioning-apps). |
| - Terms of use attestation | ● |
| - Access certifications and reviews | ● |
| - Entitlements management | ● |
| - Privileged Identity Management (PIM), just-in-time access |  ● |
| **Event logging and reporting**|   |
| - Basic security and usage reports | ● |
| - Advanced security and usage reports | ● |
| - Identity Protection: vulnerabilities and risky accounts | ● |
| - Identity Protection: risk events investigation, SIEM connectivity | ● |
| **Frontline workers** |  |
| - SMS sign-in | ● |
| - Shared device sign-out | Enterprise state roaming for Windows 10 devices is not available. |
| - Delegated user management portal (My Staff) | ● |




## Identity protection

The following table shows the available risk detections.

| Risk Detection | Availability |
|----------------|:--------------------:|
|Leaked credentials (MACE) | ● |
|Azure AD threat intelligence |  |
|Anonymous IP address | ● | 
|Atypical travel | ● |
|Anomalous Token | Pending Deployment |
|Token Issuer Anomaly| Pending Deployment |
|Malware linked IP address | ● |
|Suspicious browser | ● |
|Unfamiliar sign-in properties | ● |
|Admin confirmed user compromised | ● |
|Malicious IP address | ● |
|Suspicious inbox manipulation rules | ● |
|Password spray | ● |
|Impossible travel | ● |
|New country | ● |
|Activity from anonymous IP address | ● |
|Suspicious inbox forwarding | ● |
|Azure AD threat intelligence |  |
|Additional risk detected | ● |


## HR-provisioning apps

The following table shows the available HR-provisioning apps.

| HR-provisioning app | Availability |
|----------------|:--------------------:|
|Workday to Azure AD User Provisioning | Available and provisioning works. |
|Workday Writeback | Available and provisioning works. |
|SuccessFactors to Azure AD User Provisioning | Available and provisioning works. | 
|SuccessFactors to Writeback | Available and provisioning works. |
|Provisioning agent configuration and registration with Gov cloud tenant| Works with special undocumented command-line invocation:<br>
`AADConnectProvisioningAgent.Installer.exe`<br>`ENVIRONMENTNAME=AzureUSGovernment` |


