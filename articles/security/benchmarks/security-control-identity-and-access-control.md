---
title: Security Control - Identity and Access Control
description: Security Control Identity and Access Control
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/17/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security Control: Identity and Access Control

## 3.1: Maintain Inventory of Administrative Accounts

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.1 | 4.1 | Customer |

Azure AD has built-in roles that must be explicitly assigned and are therefore queryable. Utilize the Azure AD PowerShell module to perform adhoc queries to discover accounts that are members of administrative groups.<br><br>How to query Azure AD Roles and Role membership with PowerShell:<br>https://docs.microsoft.com/en-us/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0<br>https://docs.microsoft.com/en-us/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0

## 3.2: Change Default Passwords where Applicable

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.2 | 4.2 | Customer |

Azure AD does not have the concept of default passwords. Other Azure resources requiring a password forces a password to be created with complexity requirements and a minimum password length, which differs depending on the service. Customer responsible for third party applications and marketplace services that may utilize default passwords.

## 3.3: Ensure the Use of Dedicated Administrative Accounts

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.3 | 4.3 | Customer |

Customer to create standard operating procedures around the use of dedicated administrative accounts. Utilize Azure Security Center Identity and Access Management to monitor the number of administrative accounts.<br><br>Customers can also enable a Just-In-Time / Just-Enough-Access by using Azure AD Privileged Identity Management Privileged Roles for Microsoft Services, and Azure ARM. <br><br>Learn more: https://docs.microsoft.com/en-us/azure/active-directory/privileged-identity-management/

## 3.4: Utilize Single Sign-On (SSO) with Azure Active Directory

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.4 | 4.4 | Customer |

Wherever possible, customer to utilize SSO with Azure Active Directory rather than configuring individual stand-alone credentials per-service. Utilize Azure Security Center Identity and Access Management recommendations.<br><br>Understanding SSO with Azure AD:<br>https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/what-is-single-sign-on

## 3.5: Use Multifactor Authentication for all Azure Active Directory based access.

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.5 | 4.5, 11.5, 12.11, 16.3 | Customer |

Enable Azure AD MFA and follow Azure Security Center Identity and Access Management recommendations.<br><br><br><br>How to enable MFA in Azure:<br><br>https://docs.microsoft.com/en-us/azure/active-directory/authentication/howto-mfa-getstarted<br><br><br><br>How to monitor identity and access within Azure Security Center:<br><br>https://docs.microsoft.com/en-us/azure/security-center/security-center-identity-access

## 3.6: Use of Dedicated Machines (Privileged Access Workstations) for all Administrative Tasks

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.6 | 4.6, 11.6, 12.12 | Customer |

Utilize PAWs (privileged access workstations) with MFA configured to log into and configure Azure resources.<br><br>Learn about Privileged Access Workstations:<br>https://docs.microsoft.com/en-us/windows-server/identity/securing-privileged-access/privileged-access-workstations<br><br>How to enable MFA in Azure:<br>https://docs.microsoft.com/en-us/azure/active-directory/authentication/howto-mfa-getstarted

## 3.7: Limit users' ability to interact with ARM via scripting tools.

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.7 | 4.7 | Customer |

Utilize Azure Conditional Access to limit users' ability to interact with ARM by configuring &quot;Block access&quot; for the &quot;Microsoft Azure Management&quot; App.<br><br>How to configure Conditional Access to block access to ARM:<br>https://docs.microsoft.com/en-us/azure/role-based-access-control/conditional-access-azure-management

## 3.8: Log and Alert on Suspicious Activity on Administrative Accounts

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.8 | 4.8, 4.9 | Customer |

Utilize Azure Active Directory security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Utilize Azure Security Center to monitor identity and access activity<br><br>How to identify Azure AD users flagged for risky activity:<br>https://docs.microsoft.com/en-us/azure/active-directory/reports-monitoring/concept-user-at-risk<br><br>How to monitor users identity and access activity in Azure Security Center:<br>https://docs.microsoft.com/en-us/azure/security-center/security-center-identity-access

## 3.9: Manage Azure Resource from only Approved Locations

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.9 | 11.7 | Customer |

Customer to utilize Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.<br><br><br><br>How to configure Named Locations in Azure:<br><br>https://docs.microsoft.com/en-us/azure/active-directory/reports-monitoring/quickstart-configure-named-locations

## 3.1: Utilize Azure Active Directory

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.1 | 16.1, 16.2, 16.4, 16.5, 16.6 | Customer |

Utilizes Azure Active Directory (AAD) as the central authentication and authorization system. AAD protects data by using strong encryption for data at rest and in transit. AAD also salts, hashes, and securely stores user credentials.<br><br>How to create and configure an AAD instance:<br>https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-access-create-new-tenant

## 3.11: Regularly Review and Reconcile User Access

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.11 | 16.9, 16.10 | Customer |

Azure AD provides logs to help discover stale accounts. In addition, customer to utilize Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed on a regular basis to make sure only the right Users have continued access. <br><br>Azure AD Reporting <br>https://docs.microsoft.com/en-us/azure/active-directory/reports-monitoring/<br><br>How to use Azure Identity Access Reviews:<br>https://docs.microsoft.com/en-us/azure/active-directory/governance/access-reviews-overview

## 3.12: Monitor Attempts to Access Deactivated Accounts

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.12 | 16.12 | Customer |

Customers have Azure AD Sign in Activity, Audit and Risk Event log sources to monitoring whcih allows customers to integrate with any SIEM / Monitoring tool.<br><br> Customers can streamline this process by creating Diagnostic Settings for Azure Active Directory user accounts, sending the audit logs and sign-in logs to a Log Analytics Workspace. Customer to configure desired Alerts within Log Analytics Workspace.<br><br>How to integrate Azure Activity Logs into Azure Monitor:<br>https://docs.microsoft.com/en-us/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

## 3.13: Alert on Account Login Behavior Deviation

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.13 | 16.13 | Customer |

Utilize Azure AD Risk Detections and Identity Protection feature to configure automated responses to detected suspicious actions related to user identities. Additionally, customer can ingest data into Azure Sentinel for further investigation.<br><br>How to view Azure AD risky sign-ins:<br>https://docs.microsoft.com/en-us/azure/active-directory/reports-monitoring/concept-risky-sign-ins<br><br>How to configure and enable Identity Protection risk policies:<br>https://docs.microsoft.com/en-us/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies

## 3.14: Regulate third-party access to company data

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 3.14 | 16 | Customer |

In cases where a third party needs to access customer data (such as during a support request), utilize Customer Lockbox for Azure to review and approve or reject customer data access requests.<br><br>Understanding Customer Lockbox:<br>https://docs.microsoft.com/en-us/azure/security/fundamentals/customer-lockbox-overview#next-steps

