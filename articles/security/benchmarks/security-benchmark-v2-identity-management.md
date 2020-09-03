---
title: Azure Security Control - Identity Management
description: Azure Security Control Identity Management
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 09/01/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control: Identity Management

Identity and access management recommendations focus on addressing issues related to identity-based access control, locking down administrative access, alerting on identity-related events, abnormal account behavior, and role-based access control.

## 3.1: Standardize Azure Active Directory as the central identity and authentication system

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 3.1 | 16.1, 16.2, 16.4, 16.5, 16.6 | AC-3, IA-7, IA-8 |

Azure Active Directory (Azure AD) is Azure's default identity and access management service. Standardize Azure AD to govern your organization’s identity and access management in:

- Microsoft Cloud resources, such as the Azure portal, Azure Storage, Azure Virtual Machine (Linux and Windows), Azure Key Vault, PaaS, and SaaS applications.

- Your organization's resources, such as applications on Azure or your corporate network resources.

Azure AD supports external identity providers that allow users without a Microsoft account to sign in to their applications and resources with their external identity.

Azure AD provides an identity secure score to help you assess your identity security posture relative to Microsoft’s best practice recommendations. Use the score to gauge how closely your configuration matches best practice recommendations, and to make improvements in your security posture.

- [Tenancy in Azure Active Directory](../../active-directory/develop/single-and-multi-tenant-apps.md)

- [How to create and configure an Azure AD instance](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

- [Define Azure AD tenants](/azure/cloud-adoption-framework/ready/enterprise-scale/enterprise-enrollment-and-azure-ad-tenants#define-azure-ad-tenants)

- [Use external identity providers for application](/azure/active-directory/b2b/identity-providers)

- [Sign into Windows virtual machines in Azure using Azure Active Directory authentication](../../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md)

- [Log in to a Linux virtual machine in Azure using Azure Active Directory authentication](../../virtual-machines/linux/login-using-aad.md)

- [What is the identity secure score in Azure Active Directory](../../active-directory/fundamentals/identity-secure-score.md)

- [Azure AD by design protects data by using strong encryption for data at rest and in transit](https://download.microsoft.com/download/A/A/4/AA48DC38-DBC8-4C5E-AF07-D1433B55363D/Azure-AD-Data-Security-Considerations.pdf)

**Responsibility**: Customer

**Customer Security Functions**:

- [Identity and keys](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys) 

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)

## 3.2: Manage application identities securely and automatically

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 3.2 | N/A | AC-2, AC-3, IA-2, IA-4 |

For application identities such as service accounts used by applications or automation tools, use Azure AD to create a service principal type identity that can set with restricted permissions at the resource level instead of using a more powerful human account to access or execute your resources. You can use Azure Key Vault to manage service principal secrets to avoid hard coding credentials in source or configuration file. 

In addition, Azure AD also supports a managed identity feature that can be enabled for certain Azure services. The managed identity can natively authenticate to the Azure services/resources that supports Azure AD authentication through pre-defined access grant rule without using credential hard coded in source code or configuration file. Unlike service principal, managed identity does not require registration in Azure Key Vault for secrets management.

- [Azure service principal](/powershell/azure/create-azure-service-principal-azureps)

- [Azure managed identities](../../active-directory/managed-identities-azure-resources/overview.md)

- [Services that support managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/services-support-managed-identities.md)

- [Use Azure Key Vault for security principal registration](../../key-vault/general/authentication.md#security-principal-registration)

**Responsibility**: Customer

**Customer Security Functions**:

- [Identity and keys](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

## 3.3: Use Azure AD single sign-on (SSO) for application access

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 3.3 | 4.4 | IA-2, IA-4 |

Azure AD Business-to-Business (B2B): 
Wherever possible, use Azure Active Directory SSO instead of configuring individual stand-alone credentials per-service. Azure AD supports cloud and on-premises applications using Azure AD for authentication. Azure AD B2B allows guest users without a Microsoft account to sign in to Azure or non-Azure applications and resources with users’ external identities for cross-organization collaboration.

Azure AD Business-to-Customer (B2C): 

Azure AD B2C is a customer identity access management service. It supports local account identities or customer’s social, enterprise identities to get single sign-on access to the applications and APIs.

- [Understand Application SSO with Azure AD](../../active-directory/manage-apps/what-is-single-sign-on.md)

- [Use external identity providers for application in B2B access](/azure/active-directory/b2b/identity-providers)

- [Overview of Azure Active Directory B2C](../../active-directory-b2c/technical-overview.md)

**Responsibility**: Customer

**Customer Security Functions**:

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

- [Identity and keys](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

## 3.4: Use strong authentication controls for all Azure Active Directory based access

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 3.4 | 4.5, 11.5, 12.11, 16.3 | AC-2, AC-3, IA-2, IA-4 |

Azure AD supports multi-factor authentication (MFA) or passwordlesss authentication as the strong authentication mechanism. 
a) Multi-factor authentication - Enable Azure AD MFA and follow Azure Security Center Identity and Access Management recommendations for some best practices in your MFA setup. MFA can be enforced on all, select users or at the per-user level based on sign-in conditions and risk factors. 

b) Passwordless authentication – Three passwordless authentication options are available: a) Windows Hello for Business, b) Microsoft Authenticator app, c) FIDO2 security keys 

For administrator and privileged users, ensure the highest level of the strong authentication method are used, followed by rolling out the appropriate strong authentication policy to other users.

For password-based authentication, Azure AD does not have the concept of default passwords. Other Azure resources that do require a password force it to be created with complexity requirements and a minimum password length. The requirements differ depending on the service. You are also responsible for third-party applications and marketplace services that may use default passwords. Azure AD comes with a default password policy that cannot be modified. You can use Azure AD custom banned passwords to prevent certain known bad passwords being used or enforce a password change when a known bad pair of user credentials from data breach are input by the user. 

For managing on-premises/non-Azure password policy through Azure AD, there are multiple options available depending on your deployment model:

- Implement password hash synchronization with Azure AD Connect sync

- Enforce Azure AD weak password check for on-premises Windows Server Active Directory

- [Azure AD default password policy](../../active-directory/authentication/concept-sspr-policy.md#password-policies-that-only-apply-to-cloud-user-accounts)

- [Configure custom banned passwords for Azure AD password protection](../../active-directory/authentication/tutorial-configure-custom-password-protection.md)

- [Use risk detection for user sign-ins to trigger password changes](../../active-directory/authentication/tutorial-risk-based-sspr-mfa.md)

- [Implement password hash synchronization with Azure AD Connect sync](../../active-directory/hybrid/how-to-connect-password-hash-synchronization.md)

- [Enforce Azure AD weak password check for on-premises Windows Server Active Directory](../../active-directory/authentication/concept-password-ban-bad-on-premises.md)

- [How to enable MFA in Azure](../../active-directory/authentication/howto-mfa-getstarted.md)

- [Use Azure Privileged Identity Management security alerts](../../security-center/security-center-identity-access.md)

- [Use risk detections for user sign-ins to trigger Azure Multi-Factor Authentication](../../active-directory/authentication/tutorial-risk-based-sspr-mfa.md)

- [Introduction to passwordless authentication options for Azure Active Directory](../../active-directory/authentication/concept-authentication-passwordless.md)

- [How to setup a passwordless authentication deployment in Azure Active Directory](../../active-directory/authentication/howto-authentication-passwordless-deployment.md)

**Responsibility**: Customer

**Customer Security Functions**:

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

- [Identity and keys](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

## 3.5: Monitor and alert on account anomalies

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 3.5 | 4.8, 4.9, 16.12, 16.13 | AC-2, AC-3, AC-7, AC-9, AU-6 |

Azure AD Identity Protection provides the following user logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel or other SIEM/monitoring tools for more sophisticated monitoring and analytics use cases:
Sign-ins – The sign-ins report provides information about the usage of managed applications and user sign-in activities.Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

Azure Security Center can also alert on certain suspicious activities such as excessive number of failed authentication attempts, deprecated accounts in the subscription.

Note: Azure Advanced Threat Protection (ATP) is a security solution that can use Active Directory signals to identify, detect, and investigate advanced threats, compromised identities, and malicious insider actions.

Refer to ASB 2. Logging and Monitoring for more details about details in this area.

- [Audit activity reports in the Azure Active Directory](../../active-directory/reports-monitoring/concept-audit-logs.md)

- [How to view Azure AD risky sign-ins](/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to identify Azure AD users flagged for risky activity](/azure/active-directory/reports-monitoring/concept-user-at-risk)

- [How to monitor users' identity and access activity in Azure Security Center](../../security-center/security-center-identity-access.md)

- [Alerts in Azure Security Center's threat intelligence protection module](//azure/security-center/alerts-reference)

- [How to integrate Azure Activity Logs into Azure Monitor](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [Connect data from Azure Active Directory (Azure AD) Identity Protection](../../sentinel/connect-azure-ad-identity-protection.md)

- [Azure Advanced Threat Protection](/azure-advanced-threat-protection/what-is-atp)

**Responsibility**: Customer

**Customer Security Functions**:

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)

## 3.6: Restrict Azure resource access based on conditions

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 3.6 | 11.7 | AC-2 |

Use Azure AD conditional access for a more granular access control based on user-defined conditions, such as users logins from certain IP ranges will need to use MFA for login. Granular authentication session management policy can also be used for different use cases. 

Intune and Cloud App Security can also be used for more complicated conditional access controlling the device end and application end respectively. 

- [Azure conditional access Overview](../../active-directory/conditional-access/overview.md)

- [Common Conditional Access policies](../../active-directory/conditional-access/concept-conditional-access-policy-common.md)

- [How to configure Named Locations (specific logical groupings of IP address ranges or countries/regions) as a condition](../../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

- [How to configure Named Locations (specific logical groupings of IP address ranges or countries/regions) as a condition](../../active-directory/conditional-access/howto-conditional-access-policy-location.md)

- [How to configure devices of specific platforms or marked with a specific state as a condition](../../active-directory/conditional-access/howto-conditional-access-policy-compliant-device.md)

- [Conditional Access and Intune](/mem/intune/protect/conditional-access/)

- [Configure authentication session management with Conditional Access](../../active-directory/conditional-access/howto-conditional-access-session-lifetime.md)

- [Use risk detections for user sign-ins to trigger Azure Multi-Factor Authentication](../../active-directory/authentication/tutorial-risk-based-sspr-mfa.md)

- [Microsoft Cloud App Security best practices](//cloud-app-security/best-practices)

**Responsibility**: Customer

**Customer Security Functions**:

- [Identity and keys](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)

- [Threat intelligence](/azure/cloud-adoption-framework/organize/cloud-security-threat-intelligence)

## 3.7: Mitigate token theft and re-use

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| 3.7 | N/A | AC-11, AC-12 |

Reducing the Access Token Lifetime property mitigates the risk of an access token or ID token being used by a malicious actor for an extended period of time. You can specify the lifetime of a token issued by Azure AD. You can also set token lifetimes for all apps in your organization, for a multi-tenant (multi-organization) application, or for a specific service principal in your organization. 

- [Configurable token lifetimes in Azure AD](../../active-directory/develop/active-directory-configurable-token-lifetimes.md)

**Responsibility**: Customer

**Customer Security Functions**:

- [Identity and keys](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)

- [Threat intelligence](/azure/cloud-adoption-framework/organize/cloud-security-threat-intelligence)

