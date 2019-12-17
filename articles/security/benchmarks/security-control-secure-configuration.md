---
title: Security Control - Secure Configuration
description: Security Control Secure Configuration
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/17/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security Control: Secure Configuration

## 7.1: Establish Secure Configurations for all Azure Resources

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.1 | 5.1 | Customer |

Utilize Azure Policy or Azure Security Center to maintain security configurations for all Azure Resources.<br><br>How to configure and manage Azure Policy:<br>https://docs.microsoft.com/en-us/azure/governance/policy/tutorials/create-and-manage

## 7.2: Establish Secure Configurations for your Operating System

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.2 | 5.1 | Customer |

Utilize Azure Security Center recommendation [Remediate Vulnerabilities in Security Configurations on your Virtual Machines] to maintain security configurations on all compute resources.<br><br>How to monitor Azure Security Center recommendations:<br><br>https://docs.microsoft.com/en-us/azure/security-center/security-center-recommendations<br><br><br><br>How to remediate Azure Security Center recommendations:<br><br>https://docs.microsoft.com/en-us/azure/security-center/security-center-remediate-recommendations

## 7.3: Maintain Secure Configurations for all Azure Resources

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.3 | 5.2 | Customer |

Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.<br><br>How to configure and manage Azure Policy:<br><br>https://docs.microsoft.com/en-us/azure/governance/policy/tutorials/create-and-manage<br><br><br><br>Understanding Azure Policy Effects:<br><br>https://docs.microsoft.com/en-us/azure/governance/policy/concepts/effects

## 7.4: Maintain Secure Configurations for Operating Systems

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.4 | 5.2 | Shared |

Base Operating System Images managed and maintained by Microsoft.<br><br><br><br>However, customers can apply security settings required by their organization using ARM templates and/or Desired State Configuration.<br><br><br><br>How to create an Azure Virtual Machine from an ARM template:<br><br>https://docs.microsoft.com/en-us/azure/virtual-machines/windows/ps-template<br><br><br><br>Understand Desired State Configuration for Azure Virtual Machines:<br><br>https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/dsc-overview

## 7.5: Securely Store Configuration of Azure Resources

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.5 | 5.3 | Customer |

If using custom Azure policy definitions, utilize Azure DevOps/Repos to securely store and manage your code.<br><br>How to store code in Azure DevOps:<br><br>https://docs.microsoft.com/en-us/azure/devops/repos/git/gitworkflow?view=azure-devops<br><br><br><br>Azure Repos Documentation:<br><br>https://docs.microsoft.com/en-us/azure/devops/repos/index?view=azure-devops

## 7.6: Securely Store Custom Operating System Images

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.6 | 5.3 | Customer |

If using custom images, utilize RBAC to ensure only authorized users may access the images. For container images, store them in Azure Container Registry and leverage RBAC to ensure only authorized users may access the images.<br><br>Understand RBAC in Azure:<br><br>https://docs.microsoft.com/en-us/azure/role-based-access-control/rbac-and-directory-admin-roles<br><br><br><br>Understand RBAC for Container Registry:<br><br>https://docs.microsoft.com/en-us/azure/container-registry/container-registry-roles<br><br><br><br>How to configure RBAC in Azure:<br><br>https://docs.microsoft.com/en-us/azure/role-based-access-control/quickstart-assign-role-user-portal

## 7.7: Deploy System Configuration Management Tools

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.7 | 5.4 | Customer |

Leverage Azure Policy to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.<br><br>How to configure and manage Azure Policy:<br><br>https://docs.microsoft.com/en-us/azure/governance/policy/tutorials/create-and-manage

## 7.8: Deploy System Configuration Management Tools for Operating Systems

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.8 | 5.4 | Customer |

Utilize Azure compute extensions such as [PowerShell Desired State Configuration] for Windows compute or [Linux Chef Extension] for Linux.<br><br>How to install Virtual Machine Extensions in Azure:<br><br>https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/overview#how-can-i-install-an-extension

## 7.9: Implement Automated Configuration Monitoring for Azure Services

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.9 | 5.5 | Customer |

Leverage Azure Security Center to perform baseline scans for your Azure Resources<br><br>How to remediate recommendations in Azure Security Center:<br><br>https://docs.microsoft.com/en-us/azure/security-center/security-center-remediate-recommendations

## 7.1: Implement Automated Configuration Monitoring for Operating Systems

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.1 | 5.5 | Customer |

Leverage Azure Security Center to perform baseline scans for OS and Docker Settings for Containers.<br><br>Understanding Azure Security Center container recommendations:<br><br>https://docs.microsoft.com/en-us/azure/security-center/security-center-container-recommendations

## 7.11: Securely manage Azure secrets

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.11 | 13.1 | Customer |

Utilize Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications.<br><br>How to integrate with Azure Managed Identities:<br>https://docs.microsoft.com/en-us/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity<br><br>How to create a Key Vault:<br>https://docs.microsoft.com/en-us/azure/key-vault/quick-create-portal<br><br>How to provide Key Vault authentication with a managed identity:<br>https://docs.microsoft.com/en-us/azure/key-vault/managed-identity

## 7.12: Securely and automatically manage identities

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.12 | 4.1 | Customer |

Utilize Managed Identities to provide Azure services with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.<br><br>How to configure Managed Identities:<br>https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm

## 7.13: Eliminate unintended credential exposure

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.13 | 13.3 | Customer |

Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. <br><br>How to setup Credential Scanner:<br>https://secdevtools.azurewebsites.net/helpcredscan.html

