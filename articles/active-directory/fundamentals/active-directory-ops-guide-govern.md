---
title: Azure Active Directory governance operations reference guide
description: This operations reference guide describes the checks and actions you should take to secure governance management
services: active-directory
author: martincoetzer
manager: daveba
tags: azuread
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: fundamentals
ms.date: 10/31/2019
ms.author: martinco
---

# Azure Active Directory governance operations reference guide

This section of the [Azure AD operations reference guide](active-directory-ops-guide-intro.md) describes the checks and actions you should take to assess and attest the access granted non-privileged and privileged identities, audit, and control changes to the environment.

> [!NOTE]
> These recommendations are current as of the date of publishing but can change over time. Organizations should continuously evaluate their governance practices as Microsoft products and services evolve over time.

## Key operational processes

### Assign owners to key tasks

Managing Azure Active Directory requires the continuous execution of key operational tasks and processes, which may not be part of a rollout project. It is still important you set up these tasks to optimize your environment. The key tasks and their recommended owners include:

| Task | Owner |
| :- | :- |
| Archive Azure AD audit logs in SIEM system | InfoSec Operations Team |
| Discover applications that are managed out of compliance | IAM Operations Team |
| Regularly review access to applications | InfoSec Architecture Team |
| Regularly review access to external identities | InfoSec Architecture Team |
| Regularly review who has privileged roles | InfoSec Architecture Team |
| Define security gates to activate privileged roles | InfoSec Architecture Team |
| Regularly review consent grants | InfoSec Architecture Team |
| Design Catalogs and Access Packages for applications and resources based for employees in the organization | App Owners |
| Define Security Policies to assign users to access packages | InfoSec team + App Owners |
| If policies include approval workflows, regularly review workflow approvals | App Owners |
| Review exceptions in security policies, such as conditional access policies, using access reviews | InfoSec Operations Team |

As you review your list, you may find you need to either assign an owner for tasks that are missing an owner or adjust ownership for tasks with owners that aren’t aligned with the recommendations above.

#### Owner recommended reading

- [Assigning administrator roles in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-assign-admin-roles-azure-portal)
- [Governance in Azure](https://docs.microsoft.com/azure/security/governance-in-azure)

### Configuration changes testing

There are changes that require special considerations when testing, from simple techniques such as rolling out a target subset of users to deploying a change in a parallel test tenant. If you haven’t implemented a testing strategy, you should define a test approach based on the guidelines in the table below:

| Scenario| Recommendation |
|-|-|
|Changing the authentication type from federated to PHS/PTA or vice-versa| Use [staged rollout](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-staged-rollout) to test the impact of changing the authentication type.|
|Rolling out a new conditional access (CA) policy or Identity Protection Policy|Create a new CA Policy and assign to test users.|
|Onboarding a test environment of an application|Add the application to a production environment, hide it from the MyApps panel, and assign it to test users during the quality assurance (QA) phase.|
|Changing of sync rules|Perform the changes in a test Azure AD Connect with the same configuration that is currently in production, also known as staging mode, and analyze CSExport Results. If satisfied, swap to production when ready.|
|Changing of branding|Test in a separate test tenant.|
|Rolling out a new feature|If the feature supports roll out to a target set of users, identify pilot users and build out. For example, self-service password reset and multi-factor authentication can target specific users or groups.|
|Cutover an application from an on-premises Identity provider (IdP), for example, Active Directory, to Azure AD|If the application supports multiple IdP configurations, for example, Salesforce, configure both and test Azure AD during a change window (in case the application introduces HRD page). If the application does not support multiple IdPs, schedule the testing during a change control window and program downtime.|
|Update dynamic group rules|Create a parallel dynamic group with the new rule. Compare against the calculated outcome, for example, run PowerShell with the same condition.<br>If test pass, swap the places where the old group was used (if feasible).|
|Migrate product licenses|Refer to [Change the license for a single user in a licensed group in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/users-groups-roles/licensing-groups-change-licenses).|
|Change AD FS rules such as Authorization, Issuance, MFA|Use group claim to target subset of users.|
|Change AD FS authentication experience or similar farm-wide changes|Create a parallel farm with same host name, implement config changes, test from clients using HOSTS file, NLB routing rules, or similar routing.<br>If the target platform does not support HOSTS files (for example mobile devices), control change.|

## Access reviews

### Access reviews to applications

Over time, users may accumulate access to resources as they move throughout different teams and positions. It is important that resource owners review the access to applications on a regular basis and remove privileges that are no longer needed throughout the lifecycle of users. Azure AD [access reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview) enable organizations to efficiently manage group memberships, access to enterprise applications, and role assignments. Resource owners should review users’ access on a regular basis to make sure only the right people have continued access. Ideally, you should consider using Azure AD access reviews for this task.

![Access reviews start page](./media/active-directory-ops-guide/active-directory-ops-img15.png)

> [!NOTE]
> Each user who interacts with access reviews must have a paid Azure AD Premium P2 license.

### Access reviews to external identities

It is crucial to keep access to external identities constrained only to resources that are needed, during the time that is needed. Establish a regular automated access review process for all external identities and application access using Azure AD [access reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview). If a process already exists on-premises, consider using Azure AD access reviews. Once an application is retired or no longer used, remove all the external identities that had access to the application.

> [!NOTE]
> Each user who interacts with access reviews must have a paid Azure AD Premium P2 license.

## Privileged account management

### Privileged account usage

Hackers often target admin accounts and other elements of privileged access to rapidly gain access to sensitive data and systems. Since users with privileged roles tend to accumulate over time, it is important to review and manage admin access on a regular basis and provide just-in-time privileged access to Azure AD and Azure resources.

If no process exists in your organization to manage privileged accounts, or you currently have admins who use their regular user accounts to manage services and resources, you should immediately begin using separate accounts, for example one for regular day-to-day activities; the other for privileged access and configured with MFA. Better yet, if your organization has an Azure AD Premium P2 subscription, then you should immediately deploy [Azure AD Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-configure#license-requirements) (PIM). In the same token, you should also review those privileged accounts and [assign less privileged roles](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-admin-roles-secure) if applicable.

Another aspect of privileged account management that should be implemented is in defining [access reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview) for those accounts, either manually or [automated through PIM](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-how-to-perform-security-review).

#### Privileged account management recommended reading

- [Roles in Azure AD Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-roles)

### Emergency access accounts

Organizations must create [emergency accounts](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-emergency-access) to be prepared to manage Azure AD for cases such as authentication outages like:

- Outage components of authentication infrastructures (AD FS, On-premises AD, MFA service)
- Administrative staff turnover

To prevent being inadvertently locked out of your tenant because you can't sign in or activate an existing individual user's account as an administrator, you should create two or more emergency accounts and ensure they are implemented and aligned with [Microsoft’s best practices](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-admin-roles-secure) and [break glass procedures](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-admin-roles-secure#break-glass-what-to-do-in-an-emergency).

### Privileged access to Azure EA portal

The [Azure Enterprise Agreement (Azure EA) portal](https://azure.microsoft.com/blog/create-enterprise-subscription-experience-in-azure-portal-public-preview/) enables you to create Azure subscriptions against a master Enterprise Agreement, which is a powerful role within the enterprise. It is common to bootstrap the creation of this portal before even getting Azure AD in place, so it is necessary to use Azure AD identities to lock it down, remove personal accounts from the portal, ensure that proper delegation is in place, and mitigate the risk of lockout.

To be clear, if the EA portal authorization level is currently set to "mixed mode", you must remove any [Microsoft accounts](https://support.skype.com/en/faq/FA12059/what-is-a-microsoft-account) from all privileged access in the EA portal and configure the EA portal to use Azure AD accounts only. If the EA portal delegated roles aren’t configured, you should also find and implement delegated roles for departments and accounts.

#### Privileged access recommended reading

- [Administrator role permissions in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles)

## Entitlement management

[Entitlement management (EM)](https://docs.microsoft.com/azure/active-directory/governance/entitlement-management-overview) allows app owners to bundle resources and assign them to specific personas in the organization (both internal and external). EM allows self-service sign up and delegation to business owners while keeping governance policies to grant access, set access durations, and allow approval workflows. 

> [!NOTE]
> Azure AD Entitlement Management requires Azure AD Premium P2 licenses.

## Summary

There are eight aspects to a secure Identity governance. This list will help you identify the actions you should take to assess and attest the access granted to non-privileged and privileged identities, audit, and control changes to the environment.

- Assign owners to key tasks.
- Implement a testing strategy.
- Use Azure AD Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments.
- Establish a regular, automated access review process for all types of external identities and application access.
- Establish an access review process to review and manage admin access on a regular basis and provide just-in-time privileged access to Azure AD and Azure resources.
- Provision emergency accounts to be prepared to manage Azure AD for unexpected outages.
- Lock down access to the Azure EA portal.
- Implement Entitlement Management to provide governed access to a collection of resources.

## Next steps

Get started with the [Azure AD operational checks and actions](active-directory-ops-guide-ops.md).
