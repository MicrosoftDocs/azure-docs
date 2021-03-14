---
title: Azure Security Benchmark V2 - Identity Management
description: Azure Security Benchmark V2 Identity Management
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 02/22/2021
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control V2: Identity Management

Identity Management covers controls to establish a secure identity and access controls using Azure Active Directory. This includes the use of single sign-on, strong authentications, managed identities (and service principles) for applications, conditional access, and account anomalies monitoring.

To see the applicable built-in Azure Policy, see [Details of the Azure Security Benchmark Regulatory Compliance built-in initiative: Identity Management](../../governance/policy/samples/azure-security-benchmark.md#identity-management)

## IM-1: Standardize Azure Active Directory as the central identity and authentication system

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| IM-1 | 16.1, 16.2, 16.4, 16.5 | IA-2, IA-8, AC-2, AC-3 |

Azure Active Directory (Azure AD) is Azure's default identity and access management service. You should standardize on Azure AD to govern your organization's identity and access management in:
- Microsoft cloud resources, such as the Azure portal, Azure Storage, Azure Virtual Machines (Linux and Windows), Azure Key Vault, PaaS, and SaaS applications.

- Your organization's resources, such as applications on Azure or your corporate network resources.

Securing Azure AD should be a high priority in your organization's cloud security practice. Azure AD provides an identity secure score to help you assess your identity security posture relative to Microsoft's best practice recommendations. Use the score to gauge how closely your configuration matches best practice recommendations, and to make improvements in your security posture.

Note: Azure AD supports external identity providers, which allow users without a Microsoft account to sign in to their applications and resources with their external identity.

- [Tenancy in Azure AD](../../active-directory/develop/single-and-multi-tenant-apps.md)

- [How to create and configure an Azure AD instance](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

- [Define Azure AD tenants](https://azure.microsoft.com/resources/securing-azure-environments-with-azure-active-directory/)

- [Use external identity providers for an application](../../active-directory/external-identities/identity-providers.md)

- [What is the identity secure score in Azure AD](../../active-directory/fundamentals/identity-secure-score.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys) 

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)

## IM-2: Manage application identities securely and automatically

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| IM-2 | N/A | AC-2, AC-3, IA-2, IA-4, IA-9 |

For non-human accounts such as services or automation, use Azure managed identities, instead of creating a more powerful human account to access resources or execute code. Azure managed identities can authenticate to Azure services and resources that support Azure AD authentication. Authentication is enabled through pre-defined access grant rules, avoiding hard-coded credentials in source code or configuration files. 

For services that do not support managed identities, use Azure AD to create a service principal with restricted permissions at the resource level instead. It is recommended to configure service principals with certificate credentials and fall back to client secrets. In both cases, Azure Key Vault can be used in conjunction with Azure managed identities, so that the runtime environment (such as an Azure function) can retrieve the credential from the key vault.

- [Azure managed identities](../../active-directory/managed-identities-azure-resources/overview.md)

- [Services that support managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/services-support-managed-identities.md)

- [Azure service principal](/powershell/azure/create-azure-service-principal-azureps)

- [Create a service principal with certificates](../../active-directory/develop/howto-authenticate-service-principal-powershell.md)

Use Azure Key Vault for security principal registration: authentication#authorize-a-security-principal-to-access-key-vault

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

## IM-3: Use Azure AD single sign-on (SSO) for application access

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| IM-3 | 4.4 | IA-2, IA-4 |

Azure AD provides identity and access management to Azure resources, cloud applications, and on-premises applications. Identity and access management applies to enterprise identities such as employees, as well as external identities such as partners, vendors, and suppliers.

Use Azure AD single sign-on (SSO) to manage and secure access to your organization's data and resources on-premises and in the cloud. Connect all your users, applications, and devices to Azure AD for seamless, secure access, and greater visibility and control. 

- [Understand application SSO with Azure AD](../../active-directory/manage-apps/what-is-single-sign-on.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

- [Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

## IM-4: Use strong authentication controls for all Azure Active Directory based access

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| IM-4 | 4.2, 4.4 4.5, 11.5, 12.11, 16.3 | AC-2, AC-3, IA-2, IA-4 |

Azure AD supports strong authentication controls through multi-factor authentication (MFA) and strong passwordless methods.

- Multi-factor authentication: Enable Azure AD MFA and follow Azure Security Center identity and access management recommendations for your MFA setup. MFA can be enforced on all users, select users, or at the per-user level based on sign-in conditions and risk factors.

- Passwordless authentication: Three passwordless authentication options are available: Windows Hello for Business, Microsoft Authenticator app, and on-premises authentication methods such as smart cards.

For administrator and privileged users, ensure the highest level of the strong authentication method is used, followed by rolling out the appropriate strong authentication policy to other users.

If legacy password-based authentication is still used for Azure AD authentication, please be aware that cloud-only accounts (user accounts created directly in Azure) have a default baseline password policy. And hybrid accounts (user accounts that come from on-premises Active Directory) follow the on-premises password policies. When using password-based authentication, Azure AD provides a password protection capability that prevents users from setting passwords that are easy to guess. Microsoft provides a global list of banned passwords that is updated based on telemetry, and customers can augment the list based on their needs (such as branding, cultural references, etc.). This password protection can be used for cloud-only and hybrid accounts.

Note: Authentication based on password credentials alone is susceptible to popular attack methods. For higher security, use strong authentication such as MFA and a strong password policy. For third-party applications and marketplace services that may have default passwords, you should change them during initial service setup.

- [How to enable MFA in Azure](../../active-directory/authentication/howto-mfa-getstarted.md)

- [Introduction to passwordless authentication options for Azure Active Directory](../../active-directory/authentication/concept-authentication-passwordless.md)

- [Azure AD default password policy](../../active-directory/authentication/concept-sspr-policy.md#password-policies-that-only-apply-to-cloud-user-accounts)

- [Eliminate bad passwords using Azure AD Password Protection](../../active-directory/authentication/concept-password-ban-bad.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

- [Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

## IM-5: Monitor and alert on account anomalies

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| IM-5 | 4.8, 4.9, 16.12, 16.13 | AC-2, AC-3, AC-7, AU-6 |

Azure AD provides the following data sources: 
-	Sign-ins – The sign-ins report provides information about the usage of managed applications and user sign-in activities.

-	Audit logs - Provides traceability through logs for all changes made through various features in Azure AD. Examples of logged changes audit logs include adding or removing users, apps, groups, roles, and policies.

-	Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.

-	Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

These data sources can be integrated with Azure Monitor, Azure Sentinel or third-party SIEM systems.

Azure Security Center can also alert on certain suspicious activities such as an excessive number of failed authentication attempts, and deprecated accounts in the subscription. 

Azure Advanced Threat Protection (ATP) is a security solution that can use on-premises Active Directory signals to identify, detect, and investigate advanced threats, compromised identities, and malicious insider actions.

- [Audit activity reports in Azure AD](../../active-directory/reports-monitoring/concept-audit-logs.md)

- [How to view Azure AD risky sign-ins](../../active-directory/identity-protection/overview-identity-protection.md)

- [How to identify Azure AD users flagged for risky activity](../../active-directory/identity-protection/overview-identity-protection.md)

- [How to monitor users' identity and access activity in Azure Security Center](../../security-center/security-center-identity-access.md)

- [Alerts in Azure Security Center's threat intelligence protection module](../../security-center/alerts-reference.md)

- [How to integrate Azure activity logs into Azure Monitor](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [Connect data from Azure AD Identity Protection](../../sentinel/connect-azure-ad-identity-protection.md)

- [Microsoft Defender for Identity](/azure-advanced-threat-protection/what-is-atp)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)

## IM-6: Restrict Azure resource access based on conditions

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| IM-6 | N/A | AC-2, AC-3 |

Use Azure AD conditional access for more granular access control based on user-defined conditions, such as requiring user logins from certain IP ranges to use MFA. A granular authentication session management can also be used through Azure AD conditional access policy for different use cases. 

- [Azure Conditional Access overview](../../active-directory/conditional-access/overview.md)

- [Common Conditional Access policies](../../active-directory/conditional-access/concept-conditional-access-policy-common.md)

- [Configure authentication session management with Conditional Access](../../active-directory/conditional-access/howto-conditional-access-session-lifetime.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)

- [Threat intelligence](/azure/cloud-adoption-framework/organize/cloud-security-threat-intelligence)

## IM-7: Eliminate unintended credential exposure

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| IM-7 | 18.1, 18.7 | IA-5 |

Implement Azure DevOps Credential Scanner to identify credentials within the code. Credential Scanner also encourages moving discovered credentials to more secure locations such as Azure Key Vault.

For GitHub, you can use the native secret scanning feature to identify credentials or other form of secrets within the code.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

- [GitHub secret scanning](https://docs.github.com/github/administering-a-repository/about-secret-scanning)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)

## IM-8: Secure user access to legacy applications

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| IM-8 | 14.6 | AC-2, AC-3, SC-11 |

Ensure you have modern access controls and session monitoring for legacy applications and the data they store and process. While VPNs are commonly used to access legacy applications, they often have only basic access control and limited session monitoring.

Azure AD Application Proxy enables you to publish legacy on-premises applications to remote users with single sign-on (SSO) while explicitly validating the trustworthiness of both remote users and devices with Azure AD Conditional Access.

Alternatively, Microsoft Cloud App Security is a cloud access security broker (CASB) service that can provide controls for monitoring a user's application sessions and blocking actions (for both legacy on-premises applications and cloud software as a service (SaaS) applications).

- [Azure AD Application Proxy](../../active-directory/manage-apps/application-proxy.md#what-is-application-proxy)

- [Microsoft Cloud App Security best practices](/cloud-app-security/best-practices)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture) 

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

- [Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)