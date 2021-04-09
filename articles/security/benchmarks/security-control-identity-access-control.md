---
title: Azure Security Control - Identity and Access Control
description: Azure Security Control Identity and Access Control
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 04/14/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control: Identity and Access Control

Identity and access management recommendations focus on addressing issues related to identity-based access control, locking down administrative access, alerting on identity-related events, abnormal account behavior, and role-based access control.

## 3.1: Maintain an inventory of administrative accounts

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 3.1 | 4.1 | Customer |

Azure AD has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember)

## 3.2: Change default passwords where applicable

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 3.2 | 4.2 | Customer |

Azure AD does not have the concept of default passwords. Other Azure resources requiring a password forces a password to be created with complexity requirements and a minimum password length, which differs depending on the service. You are responsible for third-party applications and marketplace services that may use default passwords.

## 3.3: Use dedicated administrative accounts

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 3.3 | 4.3 | Customer |

Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

You can also enable a Just-In-Time / Just-Enough-Access by using Azure AD Privileged Identity Management Privileged Roles for Microsoft Services, and Azure Resource Manager. 

- [Learn more about Privileged Identity Management](../../active-directory/privileged-identity-management/index.yml)

## 3.4: Use single sign-on (SSO) with Azure Active Directory

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 3.4 | 4.4 | Customer |

Wherever possible, use Azure Active Directory SSO instead than configuring individual stand-alone credentials per-service. Use Azure Security Center Identity and Access Management recommendations.

- [Understand SSO with Azure AD](../../active-directory/manage-apps/what-is-single-sign-on.md)

## 3.5: Use multi-factor authentication for all Azure Active Directory based access

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 3.5 | 4.5, 11.5, 12.11, 16.3 | Customer |

Enable Azure AD MFA and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable MFA in Azure](../../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../../security-center/security-center-identity-access.md)

## 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 3.6 | 4.6, 11.6, 12.12 | Customer |

Use PAWs (privileged access workstations) with MFA configured to log into and configure Azure resources.

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable MFA in Azure](../../active-directory/authentication/howto-mfa-getstarted.md)

## 3.7: Log and alert on suspicious activities from administrative accounts

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 3.7 | 4.8, 4.9 | Customer |

Use Azure Active Directory security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](../../active-directory/identity-protection/overview-identity-protection.md)

- [How to monitor users' identity and access activity in Azure Security Center](../../security-center/security-center-identity-access.md)

## 3.8: Manage Azure resources from only approved locations

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 3.8 | 11.7 | Customer |

Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](../../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

## 3.9: Use Azure Active Directory

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 3.9 | 16.1, 16.2, 16.4, 16.5, 16.6 | Customer |

Use Azure Active Directory as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

- [How to create and configure an Azure AD instance](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

## 3.10: Regularly review and reconcile user access

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 3.10 | 16.9, 16.10 | Customer |

Azure AD provides logs to help discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access. 

- [Understand Azure AD reporting](../../active-directory/reports-monitoring/index.yml)

- [How to use Azure Identity Access Reviews](../../active-directory/governance/access-reviews-overview.md)

## 3.11: Monitor attempts to access deactivated credentials

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 3.11 | 16.12 | Customer |

You have access to Azure AD Sign-in Activity, Audit and Risk Event log sources, which allow you to integrate with any SIEM/Monitoring tool.

You can streamline this process by creating Diagnostic Settings for Azure Active Directory user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. You can configure desired Alerts within Log Analytics Workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

## 3.12: Alert on account login behavior deviation

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 3.12 | 16.13 | Customer |

Use Azure AD Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](../../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../../sentinel/quickstart-onboard.md)

## 3.13: Provide Microsoft with access to relevant customer data during support scenarios

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 3.13 | 16 | Customer |

In support scenarios where Microsoft needs to access customer data, Customer Lockbox provides an interface for you to review, and approve or reject customer data access requests.

- [Understand Customer Lockbox](../fundamentals/customer-lockbox-overview.md)


## Next steps

- See the next Security Control: [Data Protection](security-control-data-protection.md)