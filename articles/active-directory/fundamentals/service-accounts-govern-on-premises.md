---
title: Govern on-premises service accounts  | Azure Active Directory
description: Use this guide to create and run an account lifecycle process for service accounts.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 08/19/2022
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Govern on-premises service accounts

Active Directory offers four types of on-premises service accounts:

* [Group managed service accounts (gMSAs)](service-accounts-group-managed.md)  
* [Standalone managed service accounts (sMSAs)](service-accounts-standalone-managed.md)  
* [Computer accounts](service-accounts-computer.md)  
* [User accounts that function as service accounts](service-accounts-user-on-premises.md)


It is critical to govern service accounts closely so that you can: 

* Protect them based on their use-case requirements and purpose.  
* Manage the lifecycle of the accounts and their credentials.  
* Assess them based on the risk they'll be exposed to and the permissions they carry.  
* Ensure that Active Directory and Azure Active Directory have no stale service accounts with potentially far-reaching permissions.

## Principles for creating a new service account

When you create a service account, understand the considerations listed in the following table:

| Principle| Consideration | 
| - |- | 
| Service account mapping| Tie the service account to a single service, application, or script. |
| Ownership| Ensure that there's an owner who requests and assumes responsibility for the account. |
| Scope| Define the scope clearly, and anticipate usage duration for the service account. |
| Purpose| Create service accounts for a single, specific purpose. |
| Permissions | Apply the principle of *least permission*. To do so:<li>Never assign permissions to built-in groups, such as administrators.<li>Remove local machine permissions, where appropriate.<li>Tailor access, and use Active Directory delegation for directory access.<li>Use granular access permissions.<li>Set account expirations and location-based restrictions on user-based service accounts. |
| Monitor and audit use| Monitor sign-in data, and ensure that it matches the intended usage. Set alerts for anomalous usage. |
| | |

### Set restrictions for user accounts

For user accounts that are used as service accounts, apply the following settings:

* [**Account expiration**](/powershell/module/activedirectory/set-adaccountexpiration?view=winserver2012-ps&preserve-view=true): Set the service account to automatically expire at a set time after its review period, unless you've determined that the account should continue.

*  **LogonWorkstations**: Restrict permissions where the service account can sign in. If it runs locally on a machine and accesses only resources on that machine, restrict it from signing in anywhere else.

* [**Cannot change password**](/powershell/module/activedirectory/set-aduser): Prevent the service account from changing its own password by setting the parameter to true.
 
## Build a lifecycle management process

To help maintain the security of your service accounts, you must manage them from the time you identify the need until they're decommissioned. 

For lifecycle management of service accounts, use the following process:

1. Collect usage information for the account.
1. Move the service account and app to the configuration management database (CMDB).
1. Perform risk assessment or a formal review.
1. Create the service account and apply restrictions.
1. Schedule and perform recurring reviews. Adjust permissions and scopes as necessary.
1. Deprovision the account when appropriate.

### Collect usage information for the service account

Collect relevant business information for each service account. The following table lists the minimum amount of information to collect, but you should collect everything that's necessary to make the business case for each account's existence.

| Data| Description |
| - | - |
| Owner| The user or group that's accountable for the service account |
| Purpose| The purpose of the service account |
| Permissions (scopes)| The expected set of permissions |
| CMDB links| The cross-link service account with the target script or application and owners |
| Risk| The risk and business impact scoring, based on the security risk assessment |
| Lifetime| The anticipated maximum lifetime for enabling the scheduling of account expiration or recertification |
| | |

Ideally, you want to make the request for an account self-service, and require the relevant information. The owner can be an application or business owner, an IT member, or an infrastructure owner. By using a tool such as Microsoft Forms for this request and associated information, you'll make it easier to port it to your CMDB inventory tool if the account is approved.

### Onboard service account to CMDB

Store the collected information in a CMDB-type application. In addition to the business information, include all dependencies on other infrastructure, apps, and processes.  This central repository makes it easier to:

* Assess risk.  
* Configure the service account with the required restrictions.  
* Understand any relevant functional and security dependencies.  
* Conduct regular reviews for security and continued need.  
* Contact the owners for reviewing, retiring, and changing the service account.

Consider a service account that's used to run a website and has permissions to connect to one or more Human Resources (HR) SQL databases. The information stored in your CMDB for the service account, including example descriptions, is listed in the following table:

|Data | Example description|
| - | - |
| Owner, Deputy| John Bloom, Anna Mayers |
| Purpose| Run the HR webpage and connect to HR databases. Can impersonate end users when accessing databases. |
| Permissions, scopes| HR-WEBServer: sign in locally; run web page<br>HR-SQL1: sign in locally; read permissions on all HR databases<br>HR-SQL2: sign in locally; read permissions on Salary database only |
| Cost Center| 883944 |
| Risk Assessed| Medium; Business Impact: Medium; private information; Medium |
| Account Restrictions| Log on to: only aforementioned servers; Cannot change password; MBI-Password Policy; |
| Lifetime| Unrestricted |
| Review Cycle| Biannually (by owner, by security team, by privacy) |
| | |

### Perform a risk assessment or formal review of service account usage

Suppose your account is compromised by an unauthorized source. Assess the risks the account might pose to its associated application or service and to your infrastructure. Consider both direct and indirect risks. 

* What would an unauthorized user gain direct access to?  
* What other information or systems can the service account access?  
* Can the account be used to grant additional permissions?  
* How will you know when the permissions change?

After you've conducted and documented the risk assessment, you might find that the risks have an impact on:

* Account restrictions.  
* Account lifetime.  
* Account review requirements (cadence and reviewers).

### Create a service account and apply account restrictions

Create a service account only after you've completed the risk assessment and documented the relevant information in your CMDB. Align the account restrictions with the risk assessment. Consider the following restrictions when they're relevant to your assessment:

* For all user accounts that you use as service accounts, define a realistic, definite end date. Set the date by using the **Account Expires** flag. For more information, see [Set-ADAccountExpiration](/powershell/module/activedirectory/set-adaccountexpiration). 

* Login to the [LogonWorkstation](/powershell/module/activedirectory/set-aduser).

* [Password Policy](../../active-directory-domain-services/password-policy.md) requirements.

* Account creation in an [organizational unit location](/windows-server/identity/ad-ds/plan/delegating-administration-of-account-ous-and-resource-ous) that ensures management only for allowed users.

* Setting up and collecting auditing [that detects changes](/windows/security/threat-protection/auditing/audit-directory-service-changes) to the service account, and [service account use](https://www.manageengine.com/products/active-directory-audit/how-to/audit-kerberos-authentication-events.html).

When you're ready to put the service account into production, grant access to it more securely. 

### Schedule regular reviews of service accounts

Set up regular reviews of service accounts that are classified as medium and high risk. Reviews should include: 

* Owner attestation to the continued need for the account, and a justification of permissions and scopes.

* Review by privacy and security teams, including an evaluation of upstream and downstream connections.

* Data from audits, ensuring that it's being used only for its intended purposes.

### Deprovision service accounts

In your deprovisioning process, first remove permissions and monitoring, and then remove the account, if appropriate.

You deprovision service accounts when:

* The script or application that the service account was created for is retired.

* The function within the script or application, which the service account is used for (for example, access to a specific resource), is retired.

* The service account has been replaced with a different service account.

After you've removed all permissions, remove the account by doing the following:

1. When the associated application or script is deprovisioned, monitor the sign-ins and resource access for the associated service accounts to be sure that they're not being used in another process. If you're sure it's no longer needed, go to next step.

1. Disable the service account to prevent sign-in, and ensure that it's no longer needed. Create a business policy for the time during which accounts should remain disabled.

1. After the remain-disabled policy is fulfilled, delete the service account. 

   * **For MSAs**: [Uninstall the account](/powershell/module/activedirectory/uninstall-adserviceaccount?view=winserver2012-ps&preserve-view=true) by using PowerShell, or delete it manually from the managed service account container.

   * **For computer or user accounts**: Manually delete the account from within Active Directory.

## Next steps

To learn more about securing service accounts, see the following articles:

* [Introduction to on-premises service accounts](service-accounts-on-premises.md)  
* [Secure group managed service accounts](service-accounts-group-managed.md)  
* [Secure standalone managed service accounts](service-accounts-standalone-managed.md)  
* [Secure computer accounts](service-accounts-computer.md)  
* [Secure user accounts](service-accounts-user-on-premises.md)
