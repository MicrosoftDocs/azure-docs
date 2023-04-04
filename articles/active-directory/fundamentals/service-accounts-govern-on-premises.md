---
title: Govern on-premises service accounts 
description: Learn to create and run an account lifecycle process for on-premises service accounts
services: active-directory
author: jricketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 02/10/2023
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Govern on-premises service accounts

Active Directory offers four types of on-premises service accounts:

* Group-managed service accounts (gMSAs)
  * [Secure group managed service accounts](service-accounts-group-managed.md) 
* Standalone managed service accounts (sMSAs)
  * [Secure standalone managed service accounts](service-accounts-standalone-managed.md) 
* On-premises computer accounts
  * [Secure on-premises computer accounts with Active Directory](service-accounts-computer.md)  
* User accounts functioning as service accounts
  * [Secure user-based service accounts in Active Directory](service-accounts-user-on-premises.md)

Part of service account governance includes:

* Protecting them, based on requirements and purpose 
* Managing account lifecycle, and their credentials   
* Assessing service accounts, based on risk and permissions
* Ensuring Active Directory (AD) and Azure Active Directory (Azure AD) have no unused service accounts, with permissions

## New service account principles

When you create service accounts, consider the information in the following table.

| Principle| Consideration | 
| - |- | 
| Service account mapping| Connect the service account to a service, application, or script |
| Ownership| Ensure there's an account owner who requests and assumes responsibility |
| Scope| Define the scope, and anticipate usage duration|
| Purpose| Create service accounts for one purpose |
| Permissions | Apply the principle of least permission:</br> - Don't assign permissions to built-in groups, such as administrators</br> - Remove local machine permissions, where feasible</br> - Tailor access, and use AD delegation for directory access</br> - Use granular access permissions</br> - Set account expiration and location restrictions on user-based service accounts |
| Monitor and audit use| - Monitor sign-in data, and ensure it matches the intended usage</br> - Set alerts for anomalous usage |

### User account restrictions

For user accounts used as service accounts, apply the following settings:

* **Account expiration** - set the service account to automatically expire, after its review period, unless the account can continue
* **LogonWorkstations** - restrict service account sign-in permissions
  * If it runs locally and accesses resources on the machine, restrict it from signing in elsewhere
* **Can't change password** - set the parameter to **true** to prevent the service account from changing its own password
 
## Lifecycle management process

To help maintain service account security, manage them from inception to decommission. Use the following process:

1. Collect account usage information.
2. Move the service account and app to the configuration management database (CMDB).
3. Perform risk assessment or a formal review.
4. Create the service account and apply restrictions.
5. Schedule and perform recurring reviews. 
6. Adjust permissions and scopes as needed.
7. Deprovision the account.

### Collect service account usage information

Collect relevant information for each service account. The following table lists the minimum information to collect. Obtain what's needed to validate each account.

| Data| Description |
| - | - |
| Owner| The user or group accountable for the service account |
| Purpose| The purpose of the service account |
| Permissions (scopes)| The expected permissions |
| CMDB links| The cross-link service account with the target script or application, and owners |
| Risk| The results of a security risk assessment |
| Lifetime| The anticipated maximum lifetime to schedule account expiration or recertification |

Make the account request self-service, and require the relevant information. The owner is an application or business owner, an IT team member, or an infrastructure owner. You can use Microsoft Forms for requests and associated information. If the account is approved, use Microsoft Forms to port it to a configuration management databases (CMDB) inventory tool.

### Service accounts and CMDB

Store the collected information in a CMDB application. Include dependencies on infrastructure, apps, and processes. Use this central repository to:

* Assess risk
* Configure the service account with restrictions
* Ascertain functional and security dependencies
* Conduct regular reviews for security and continued need
* Contact the owner to review, retire, and change the service account

#### Example HR scenario
 
An example is a service account that runs a website with permissions to connect to Human Resources SQL databases. The information in the service account CMDB, including examples, is in the following table:

|Data | Example|
| - | - |
| Owner, Deputy| Name, Name |
| Purpose| Run the HR webpage and connect to HR databases. Impersonate end users when accessing databases. |
| Permissions, scopes| HR-WEBServer: sign in locally; run web page<br>HR-SQL1: sign in locally; read permissions on HR databases<br>HR-SQL2: sign in locally; read permissions on Salary database only |
| Cost center| 123456 |
| Risk assessed| Medium; Business Impact: Medium; private information; Medium |
| Account restrictions| Sign in to: only aforementioned servers; Can't change password; MBI-Password Policy; |
| Lifetime| Unrestricted |
| Review cycle| Biannually: By owner, security team, or privacy team |

### Service account risk assessments or formal reviews

If your account is compromised by an unauthorized source, assess the risks to associated applications, services, and infrastructure. Consider direct and indirect risks:

* Resources an unauthorized user can gain access to
  * Other information or systems the service account can access
* Permissions the account can grant   
  * Indications or signals when permissions change

After the risk assessment, documentation likely shows that risks affect account: 
 
* Restrictions
* Lifetime
* Review requirements
  * Cadence and reviewers

### Create a service account and apply account restrictions

> [!NOTE]
> Create a service account after the risk assessment, and document the findings in a CMDB. Align account restrictions with risk assessment findings. 
 
Consider the following restrictions, although some might not be relevant to your assessment.

* For user accounts used as service accounts, define a realistic end date 
  * Use the **Account Expires** flag to set the date
  * Learn more: [Set-ADAccountExpiration](/powershell/module/activedirectory/set-adaccountexpiration)
* See, [Set-ADUser (Active Directory)](/powershell/module/activedirectory/set-aduser)
* Password policy requirements
  * See, [Password and account lockout policies on Azure AD Domain Services managed domains](../../active-directory-domain-services/password-policy.md)
* Create accounts in an organizational unit location that ensures only some users will manage it
  *  See, [Delegating Administration of Account OUs and Resource OUs](/windows-server/identity/ad-ds/plan/delegating-administration-of-account-ous-and-resource-ous)  
* Set up and collect auditing that detects service account changes:
  * See, [Audit Directory Service Changes](/windows/security/threat-protection/auditing/audit-directory-service-changes), and
  * Go to manageengine.com for [How to audit Kerberos authentication events in AD](https://www.manageengine.com/products/active-directory-audit/how-to/audit-kerberos-authentication-events.html)
* Grant account access more securely before it goes into production

### Service account reviews
 
Schedule regular service account reviews, especially those classified Medium and High Risk. Reviews can include: 

* Owner attestation of the need for the account, with justification of permissions and scopes
* Privacy and security team reviews that include upstream and downstream dependencies
* Audit data review
 * Ensure the account is used for its stated purpose

### Deprovision service accounts

Deprovision service accounts at the following junctures:

* Retirement of the script or application for which the service account was created
* Retirement of the script or application function, for which the service account was used
* Replacement of the service account for another

To deprovision:
 
1. Remove permissions and monitoring.
2. Examine sign-ins and resource access of related service accounts to ensure no potential effect on them.
3. Prevent account sign-in.
4. Ensure the account is no longer needed (there's no complaint).
5. Create a business policy that determines the amount of time that accounts are disabled.
6. Delete the service account.

  * **MSAs** - see, [Uninstall-ADServiceAccount](/powershell/module/activedirectory/uninstall-adserviceaccount?view=winserver2012-ps&preserve-view=true)
    * Use PowerShell, or delete it manually from the managed service account container
  * **Computer or user accounts** - manually delete the account from Active Directory

## Next steps

To learn more about securing service accounts, see the following articles:

* [Securing on-premises service accounts](service-accounts-on-premises.md)  
* [Secure group managed service accounts](service-accounts-group-managed.md)  
* [Secure standalone managed service accounts](service-accounts-standalone-managed.md)  
* [Secure on-premises computer accounts with AD](service-accounts-computer.md)  
* [Secure user-based service accounts in AD](service-accounts-user-on-premises.md)
