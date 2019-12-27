---
title: Security Control - Secure Configuration
description: Security Control Secure Configuration
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/27/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security Control: Secure Configuration

## 7.1: Establish Secure Configurations for all Azure Resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.1 | 5.1 | Customer |

Use Azure Policy or Azure Security Center to maintain security configurations for all Azure Resources.

How to configure and manage Azure Policy:
https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

## 7.2: Establish Secure Configurations for your Operating System

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.2 | 5.1 | Customer |

Use Azure Security Center recommendation &quot;Remediate Vulnerabilities in Security Configurations on your Virtual Machines&quot; to maintain security configurations on all compute resources.

How to monitor Azure Security Center recommendations:

https://docs.microsoft.com/azure/security-center/security-center-recommendations

How to remediate Azure Security Center recommendations:

https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations

## 7.3: Maintain Secure Configurations for all Azure Resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.3 | 5.2 | Customer |

Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Understanding Azure Policy Effects:

https://docs.microsoft.com/azure/governance/policy/concepts/effects

## 7.4: Maintain Secure Configurations for Operating Systems

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.4 | 5.2 | Shared |

Base Operating System Images are managed and maintained by Microsoft.

However, you can apply security settings required by your organization using ARM templates and/or Desired State Configuration.

How to create an Azure Virtual Machine from an ARM template:

https://docs.microsoft.com/azure/virtual-machines/windows/ps-template

Understand Desired State Configuration for Azure Virtual Machines:

https://docs.microsoft.com/azure/virtual-machines/extensions/dsc-overview

## 7.5: Securely Store Configuration of Azure Resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.5 | 5.3 | Customer |

If using custom Azure policy definitions, use Azure DevOps/Repos to securely store and manage your code.

How to store code in Azure DevOps:

https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

Azure Repos Documentation:

https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops

## 7.6: Securely Store Custom Operating System Images

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.6 | 5.3 | Customer |

If using custom images, use RBAC to ensure only authorized users may access the images. For container images, store them in Azure Container Registry and leverage RBAC to ensure only authorized users may access the images.

Understand RBAC in Azure:

https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles

Understand RBAC for Container Registry:

https://docs.microsoft.com/azure/container-registry/container-registry-roles

How to configure RBAC in Azure:

https://docs.microsoft.com/azure/role-based-access-control/quickstart-assign-role-user-portal

## 7.7: Deploy System Configuration Management Tools

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.7 | 5.4 | Customer |

Leverage Azure Policy to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

## 7.8: Deploy System Configuration Management Tools for Operating Systems

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.8 | 5.4 | Customer |

Use Azure compute extensions such as PowerShell Desired State Configuration for Windows compute or Linux Chef Extension for Linux.

How to install Virtual Machine Extensions in Azure:

https://docs.microsoft.com/azure/virtual-machines/extensions/overview#how-can-i-install-an-extension

## 7.9: Implement Automated Configuration Monitoring for Azure Services

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.9 | 5.5 | Customer |

Use Azure Security Center to perform baseline scans for your Azure Resources

How to remediate recommendations in Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations

## 7.10: Implement Automated Configuration Monitoring for Operating Systems

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.1 | 5.5 | Customer |

Use Azure Security Center to perform baseline scans for OS and Docker Settings for Containers.

Understanding Azure Security Center container recommendations:

https://docs.microsoft.com/azure/security-center/security-center-container-recommendations

## 7.11: Securely manage Azure secrets

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.11 | 13.1 | Customer |

Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications.

How to integrate with Azure Managed Identities:
https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity

How to create a Key Vault:
https://docs.microsoft.com/azure/key-vault/quick-create-portal

How to provide Key Vault authentication with a managed identity:
https://docs.microsoft.com/azure/key-vault/managed-identity

## 7.12: Securely and automatically manage identities

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.12 | 4.1 | Customer |

Use Managed Identities to provide Azure services with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

How to configure Managed Identities:
https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm

## 7.13: Eliminate unintended credential exposure

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.13 | 13.3 | Customer |

Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

How to setup Credential Scanner:
https://secdevtools.azurewebsites.net/helpcredscan.html

