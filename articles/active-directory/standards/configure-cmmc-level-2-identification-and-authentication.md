---
title: Configure CMMC Level 2 Identification and Authentication (IA) controls
description: Learn how to configure Azure AD to meet CMMC Level 2 Identification and authorization requirements.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 12/13/2022
ms.author: jricketts
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Configure CMMC Level 2 Identification and Authentication (IA) controls 

Azure Active Directory helps you meet identity-related practice requirements in each Cybersecurity Maturity Model Certification (CMMC) level. To complete other configurations or processes to be compliant with [CMMC V2.0 level 2](https://cmmc-coe.org/maturity-level-two/)requirements, is the responsibility of companies performing work with, and on behalf of, the US Dept. of Defense (DoD).

CMMC Level 2 has 13 domains that have one or more practices related to identity. The domains are:

* Access Control (AC)
* Audit & Accountability (AU)
* Configuration Management (CM)
* Identification & Authentication (IA)
* Incident Response (IR)
* Maintenance (MA)
* Media Protection (MP)
* Personnel Security (PS)
* Physical Protection (PE)
* Risk Assessment (RA)
* Security Assessment (CA)
* System and Communications Protection (SC)
* System and Information Integrity (SI)

The remainder of this article provides guidance for the Identification and Authorization (IA) domain. There's a table with links to content that provides step-by-step guidance to accomplish the practice.

## Identification & Authentication

The following table provides a list of control IDs and associated customer responsibilities and guidance.

| *Control* | *Guidance* |
| - | - |
| IA.L2-3.5.3 | The following are definitions for the terms used for this control area:<li>**Local Access** - Access to an organizational information system by a user (or process acting on behalf of a user) communicating through a direct connection without the use of a network.<li>**Network Access** - Access to an information system by a user (or a process acting on behalf of a user) communicating through a network (for example, local area network, wide area network, Internet).<li>**Privileged User** - A user that's authorized (and therefore, trusted) to perform security-relevant functions that ordinary users aren't authorized to perform.<br><br>Breaking down the above requirement means:<li>All users are required MFA for network/remote access.<li>Only privileged users are required MFA for local access. If regular user accounts have administrative rights only on their computers, they're not a “privileged account” and don't require MFA for local access.<br><br> You're responsible for configuring Conditional Access to require multifactor authentication. Enable Azure AD Authentication methods that meet AAL2 and above.<br>[Grant controls in Conditional Access policy - Azure Active Directory](/azure/active-directory/conditional-access/concept-conditional-access-grant.md)<br>[Achieve NIST authenticator assurance levels with Azure Active Directory](/azure/active-directory/standards/nist-overview.md)<br>[Authentication methods and features - Azure Active Directory](/azure/active-directory/authentication/concept-authentication-methods.md) |
| IA.L2-3.5.4 | All Azure AD Authentication methods at AAL2 and above are replay resistant.<br>[Achieve NIST authenticator assurance levels with Azure Active Directory](/azure/active-directory/standards/nist-overview.md) |
| IA.L2-3.5.5 | All user, group, device object globally unique identifiers (GUIDs) are guaranteed unique and non-reusable for the lifetime of the Azure AD tenant.<br>[user resource type - Microsoft Graph v1.0](/graph/api/resources/user?view=graph-rest-1.0&preserve-view=true)<br>[group resource type - Microsoft Graph v1.0](/graph/api/resources/group?view=graph-rest-1.0&preserve-view=true)<br>[device resource type - Microsoft Graph v1.0](/graph/api/resources/device?view=graph-rest-1.0&preserve-view=true) |
| IA.L2-3.5.6 | Implement account management automation with Microsoft Graph and Azure AD PowerShell. Use Microsoft Graph to monitor sign-in activity and Azure AD PowerShell to take action on accounts within the required time frame.<br><br>**Determine inactivity**<br>[Manage inactive user accounts in Azure AD](/azure/active-directory/reports-monitoring/howto-manage-inactive-user-accounts.md)<br>[Manage stale devices in Azure AD](/azure/active-directory/devices/manage-stale-devices.md)<br><br>**Remove or disable accounts**<br>[Working with users in Microsoft Graph](/graph/api/resources/users.md)<br>[Get a user](/graph/api/user-get?tabs=http)<br>[Update user](/graph/api/user-update?tabs=http)<br>[Delete a user](/graph/api/user-delete?tabs=http)<br><br>**Work with devices in Microsoft Graph**<br>[Get device](/graph/api/device-get?tabs=http)<br>[Update device](/graph/api/device-update?tabs=http)<br>[Delete device](/graph/api/device-delete?tabs=http)<br><br>**[Use Azure AD PowerShell](/powershell/module/azuread/)**<br>[Get-AzureADUser](/powershell/module/azuread/get-azureaduser.md)<br>[Set-AzureADUser](/powershell/module/azuread/set-azureaduser.md)<br>[Get-AzureADDevice](/powershell/module/azuread/get-azureaddevice.md)<br>[Set-AzureADDevice](/powershell/module/azuread/set-azureaddevice.md) |
| IA.L2-3.5.7 <br><br>IA.L2-3.5.8 | We **strongly encourage** passwordless strategies. This control is only applicable to password authenticators, so removing passwords as an available authenticator renders this control not applicable.<br><br>Per NIST SP 800-63 B Section 5.1.1: Maintain a list of commonly used, expected, or compromised passwords.<br><br>With Azure AD password protection, default global banned password lists are automatically applied to all users in an Azure AD tenant. To support your business and security needs, you can define entries in a custom banned password list. When users change or reset their passwords, these banned password lists are checked to enforce the use of strong passwords.<br>For customers that require strict password character change, password reuse and complexity requirements use hybrid accounts configured with Password-Hash-Sync. This action ensures the passwords synchronized to Azure AD inherit the restrictions configured in Active Directory password policies. Further protect on-premises passwords by configuring on-premises Azure AD Password Protection for Active Directory Domain Services.<br>[NIST Special Publication 800-63 B](https://pages.nist.gov/800-63-3/sp800-63b.html)<br>[NIST Special Publication 800-53 Revision 5 (IA-5 - Control enhancement (1)](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf)<br>[Eliminate bad passwords using Azure AD password protection](../authentication/concept-password-ban-bad.md)<br>[What is password hash synchronization with Azure AD?](../hybrid/whatis-phs.md) |
| IA.L2-3.5.9 | An Azure AD user initial password is a temporary single use password that once successfully used is immediately required to be changed to a permanent password. Microsoft strongly encourages the adoption of passwordless authentication methods. Users can bootstrap Passwordless authentication methods using Temporary Access Pass (TAP). TAP is a time and use limited passcode issued by an admin that satisfies strong authentication requirements. Use of passwordless authentication along with the time and use limited TAP completely eliminates the use of passwords (and their reuse).<br>[Add or delete users - Azure Active Directory](/azure/active-directory/fundamentals/add-users-azure-active-directory.md)<br>[Configure a Temporary Access Pass in Azure AD to register Passwordless authentication methods](/azure/active-directory/authentication/howto-authentication-temporary-access-pass.md)<br>[Passwordless authentication](/security/business/solutions/passwordless-authentication?ef_id=369464fc2ba818d0bd6507de2cde3d58:G:s&OCID=AIDcmmdamuj0pc_SEM_369464fc2ba818d0bd6507de2cde3d58:G:s&msclkid=369464fc2ba818d0bd6507de2cde3d58) |
| IA.L2-3.5.10 | **Secret Encryption at Rest**:<br>In addition to disk level encryption, when at rest, secrets stored in the directory are encrypted using the Distributed Key Manager(DKM). The encryption keys are stored in Azure AD core store and in turn are encrypted with a scale unit key. The key is stored in a container that is protected with directory ACLs, for highest privileged users and specific services. The symmetric key is typically rotated every six months. Access to the environment is further protected with operational controls and physical security.<br><br>**Encryption in Transit**:<br>To assure data security, Directory Data in Azure AD is signed and encrypted while in transit between data centers within a scale unit. The data is encrypted and unencrypted by the Azure AD core store tier, which resides inside secured server hosting areas of the associated Microsoft data centers.<br><br>Customer-facing web services are secured with the Transport Layer Security (TLS) protocol.<br>For more information, [download](https://azure.microsoft.com/resources/azure-active-directory-data-security-considerations/) *Data Protection Considerations - Data Security*. On page 15, there are more details.<br>[Demystifying Password Hash Sync (microsoft.com)](https://www.microsoft.com/security/blog/2019/05/30/demystifying-password-hash-sync/)<br>[Azure Active Directory Data Security Considerations](https://aka.ms/aaddatawhitepaper) |
|IA.L2-3.5.11 | By default, Azure AD obscures all authenticator feedback. |

### Next steps

* [Configure Azure Active Directory for CMMC compliance](configure-azure-active-directory-for-cmmc-compliance.md)

* [Configure CMMC Level 1 controls](configure-cmmc-level-1-controls.md)

* [Configure CMMC Level 2 Access Control (AC) controls](configure-cmmc-level-2-access-control.md)

* [Configure CMMC Level 2 additional controls](configure-cmmc-level-2-additional-controls.md)
