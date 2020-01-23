---
title: Azure Security Control - Secure Configuration
description: Security Control Secure Configuration
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/30/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security Control: Secure Configuration

Establish, implement, and actively manage (track, report on, correct) the security configuration of Azure resources in order to prevent attackers from exploiting vulnerable services and settings.

## 7.1: Establish secure configurations for all Azure resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.1 | 5.1 | Customer |

Use Azure Policy or Azure Security Center to maintain security configurations for all Azure Resources.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

## 7.2: Establish secure operating system configurations

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.2 | 5.1 | Customer |

Use Azure Security Center recommendation &quot;Remediate Vulnerabilities in Security Configurations on your Virtual Machines&quot; to maintain security configurations on all compute resources.

How to monitor Azure Security Center recommendations:

https://docs.microsoft.com/azure/security-center/security-center-recommendations

How to remediate Azure Security Center recommendations:

https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations

## 7.3: Maintain secure Azure resource configurations

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.3 | 5.2 | Customer |

Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Understand Azure Policy Effects:

https://docs.microsoft.com/azure/governance/policy/concepts/effects

## 7.4: Maintain secure operating system configurations

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.4 | 5.2 | Shared |

Base operating system images are managed and maintained by Microsoft.

However, you can apply security settings required by your organization using Azure Resource Manager templates and/or Desired State Configuration.

How to create an Azure Virtual Machine from an Azure Resource Manager template:

https://docs.microsoft.com/azure/virtual-machines/windows/ps-template

Understand Desired State Configuration for Azure Virtual Machines:

https://docs.microsoft.com/azure/virtual-machines/extensions/dsc-overview

## 7.5: Securely store configuration of Azure resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.5 | 5.3 | Customer |

If using custom Azure policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

How to store code in Azure DevOps:

https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

Azure Repos Documentation:

https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops

## 7.6: Securely store custom operating system images

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

## 7.7: Deploy system configuration management tools

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.7 | 5.4 | Customer |

Use Azure Policy to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

## 7.8: Deploy system configuration management tools for operating systems

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.8 | 5.4 | Customer |

Use Azure compute extensions such as PowerShell Desired State Configuration for Windows compute or Linux Chef Extension for Linux.

How to install Virtual Machine Extensions in Azure:

https://docs.microsoft.com/azure/virtual-machines/extensions/overview#how-can-i-install-an-extension

## 7.9: Implement automated configuration monitoring for Azure services

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.9 | 5.5 | Customer |

Use Azure Security Center to perform baseline scans for your Azure Resources

How to remediate recommendations in Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations

## 7.10: Implement automated configuration monitoring for operating systems

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.1 | 5.5 | Customer |

Use Azure Security Center to perform baseline scans for OS and Docker Settings for containers.

Understand Azure Security Center container recommendations:

https://docs.microsoft.com/azure/security-center/security-center-container-recommendations

## 7.11: Manage Azure secrets securely 

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

## 7.12: Manage identities securely and automatically

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

## Next steps

See the next security control: [Malware Defense](security-control-malware-defense.md)
