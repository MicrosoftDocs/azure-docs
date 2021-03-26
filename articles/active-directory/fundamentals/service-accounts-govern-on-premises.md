---
title: Governing on-premises service accounts  | Azure Active Directory
description: A guide to creating and running an account lifecycle process for service accounts
services: active-directory
author: BarbaraSelden
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 2/15/2021
ms.author: baselden
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Governing on-premises service accounts

There are four types of on-premises service accounts in Windows Active Directory:

* [Group managed service accounts](service-accounts-group-managed.md) (gMSAs)

* [standalone managed service accounts](service-accounts-standalone-managed.md) (sMSAs)

* [Computer accounts](service-accounts-computer.md)

* [User accounts functioning as service accounts](service-accounts-user-on-premises.md)


It is critical to govern service accounts closely to: 

* Protect service accounts based on their use-case requirements and purpose.

* Manage the lifecycle of service accounts and their credentials.

* Assess service accounts based on the risk they'll be exposed to and the permissions they carry, 

* Ensure that Active Directory and Azure Active Directory have no stale service accounts with potentially far-reaching permissions.

## Principles for creating a new service account

Use the following criteria when creating a new service account.

| Principles| Considerations | 
| - |- | 
| Service account mapping| Tie the service account to a single service, application, or script. |
| Ownership| Ensure that there's an owner who requests and assumes responsibility for the account. |
| Scope| Define the scope clearly and anticipate usage duration for the service account. |
| Purpose| Create service accounts for a single specific purpose. |
| Privilege| Apply the principle of least privilege by: <br>Never assigning them to built-in groups like administrators.<br> Removing local machine privileges where appropriate.<br>Tailoring access and using Active Directory delegation for directory access.<br>Using granular access permissions.<br>Setting account expirations and location-based restrictions on user-based service accounts |
| Monitor and audit use| Monitor sign-in data and ensure it matches the intended usage. Set alerts for anomalous usage. |

### Enforce least privilege for user accounts and limit account overuse

Use the following settings with user accounts used as service accounts:

* [**Account Expiry**](/powershell/module/activedirectory/set-adaccountexpiration?view=winserver2012-ps): set the service account to automatically expire a set time after its review period unless it's determined that it should continue

*  **LogonWorkstations**: restrict permissions for where the service account can sign in. If it runs locally on a machine and accesses only resources on that machine, restrict it from logging on anywhere else.

* [**Cannot change password**](/powershell/module/addsadministration/set-aduser): prevent the service account from changing its own password by setting the parameter to false.

 
## Build a lifecycle management process

To maintain security of your service accounts, you must manage them from the time you identify the need until they're decommissioned. 

Use the following process for lifecycle management of service accounts:

1. Collect usage information for the account
1. Onboard the service account and app to configuration management database (CMDB)
1. Perform risk assessment or formal review
1. Create the service account and apply restrictions.
1. Schedule and perform recurring reviews. Adjust permissions and scopes as necessary.
1. Deprovision account when appropriate.

### Collect usage information for the service account

Collect the relevant business information for each service account. The below table shows minimum information to be collected, but you should collect everything necessary to make the business case for the accounts’ existence.

| Data| Details |
| - | - |
| Owner| User or group that is accountable for the service account |
| Purpose| Purpose of the service account |
| Permissions (Scopes)| Expected set of permissions |
| Configuration management database (CMDB) links| Cross-link service account with target script/application and owner(s) |
| Risk| Risk and business impact scoring based on security risk assessment |
| Lifetime| Anticipated maximum lifetime to enable scheduling of account expiration or recertification |


 

Ideally, make the request for an account self-service, and require the relevant information. The owner, who can be an application or business owner, an IT member, or an infrastructure owner. Using a tool such as Microsoft forms for this request and associated information will make it easy to port it to your CMDB inventory tool if the account is approved.

### Onboard service account to CMDB

Store the collected information in a CMDB-type application. In addition to the business information, include all dependencies to other infrastructure, apps, and processes.  This central repository will make it easier to:

* Assess risk.

* Configure the service account with required restrictions.

* Understand relevant functional and security dependencies.

* Conduct regular reviews for security and continued need.

* Contact the owner(s) for reviewing, retiring, and changing the service account.

Consider a service account that is used to run a web site and has privileges to connect to one or more SQL databases. Information stored in your CMDB for this service account could be:

|Data | Details|
| - | - |
| Owner, Deputy| John Bloom, Anna Mayers |
| Purpose| Run the HR webpage and connect to HR-databases. Can impersonate end user when accessing databases. |
| Permissions, Scopes| HR-WEBServer: log on locally, run web page<br>HR-SQL1: log on locally, Read on all HR* database<br>HR-SQL2: log on locally, READ on SALARY* database |
| Cost Center| 883944 |
| Risk Assessed| Medium; Business Impact: Medium; private information; Medium |
| Account Restrictions| Log on to: only aforementioned servers; Cannot change password; MBI-Password Policy; |
| Lifetime| unrestricted |
| Review Cycle| Bi-annually (by owner, by security team, by privacy) |

### Perform risk assessment or formal review of service account usage

Given its permissions and purpose, assess the risk the account may pose to its associated application or service and to your infrastructure if it is compromised. Consider both direct and indirect risk. 

* What would an adversary gain direct access to?

* What other information or systems can the service account access?

* Can the account be used to grant additional permissions?

* How will you know when permissions change?

The risk assessment, once conducted and documented, may have impact on:

* Account restrictions

* Account lifetime

* Account review requirements (cadence and reviewers)

### Create a service account and apply account restrictions

Create service account only after relevant information is documented in your CMDB and you perform a risk assessment. Account restrictions should be aligned to risk assessment. Consider the following restrictions when relevant to you assessment.:

* [Account Expiry](/powershell/module/activedirectory/set-adaccountexpiration?view=winserver2012-ps)

   * For all user accounts used as service accounts, define a realistic and definite end-date for use. Set this using the “Account Expires” flag. For more details, refer to[ Set-ADAccountExpiration](/powershell/module/addsadministration/set-adaccountexpiration). 

* Log On To ([LogonWorkstation](/powershell/module/addsadministration/set-aduser))

* [Password Policy](../../active-directory-domain-services/password-policy.md) requirements

* Creation in an [OU location](/windows-server/identity/ad-ds/plan/delegating-administration-of-account-ous-and-resource-ous) that ensures management only for privileged users

* Set up and collect auditing [that detects changes](/windows/security/threat-protection/auditing/audit-directory-service-changes) to the service account – and [service account use](https://www.manageengine.com/products/active-directory-audit/how-to/audit-kerberos-authentication-events.html).

When ready to put into production, grant access to the service account securely. 

### Schedule regular reviews of service accounts

Set up regular reviews of service accounts classified as medium and high risk. Reviews should include: 

* Owner attestation to the continued need for the account, and justification of privileges and scopes.

* Review by privacy and security teams, including evaluation of upstream and downstream connections.

* Data from audits ensuring it is being used only for intended purposes

### Deprovision service accounts

In your deprovisioning process, first remove permissions and monitor, then remove the account if appropriate.

Deprovision service accounts when:

* The script or application the service account was created for is retired.

* The function within the script or application, which the service account is used for (for example, access to a specific resource) is retired.

* The service account has been replaced with a different service account.

After removing all permissions, use this process for removing the account.

1. Once the associated application or script is deprovisioned, monitor sign-ins and resource access for the associated service account(s) to be sure it is not used in another process. If you are sure it is no longer needed, go to next step.

2. Disable the service account from signing in and be sure it is no longer needed. Create a business policy for the time accounts should remain disabled.

3. Delete the service account after the remain disabled policy is fulfilled. 

   * For MSAs, you can [uninstall it](/powershell/module/activedirectory/uninstall-adserviceaccount?view=winserver2012-ps) using PowerShell or delete manually from the managed service account container.

   * For computer or user accounts, you can manually delete the account from in Active Directory.

## Next steps
See the following articles on securing service accounts

* [Introduction to on-premises service accounts](service-accounts-on-premises.md)

* [Secure group managed service accounts](service-accounts-group-managed.md)

* [Secure standalone managed service accounts](service-accounts-standalone-managed.md)

* [Secure computer accounts](service-accounts-computer.md)

* [Secure user accounts](service-accounts-user-on-premises.md)

* [Govern on-premises service accounts](service-accounts-govern-on-premises.md)