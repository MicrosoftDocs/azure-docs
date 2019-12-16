---
title: Security Control - Secure Configuration
description: Security Control Secure Configuration
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/16/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security Control: Secure Configuration

## Establish Secure Configurations for all Azure Resources

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.1 | 5.1 | Customer |

**Guidance**: Utilize Azure Policy or Azure Security Center to maintain security configurations for all Azure Resources.<br><br>How to configure and manage Azure Policy:<br>https://docs.microsoft.com/en-us/azure/governance/policy/tutorials/create-and-manage

## Establish Secure Configurations for your Operating System

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.2 | 5.1 | Customer |

**Guidance**: Utilize Azure Security Center recommendation [Remediate Vulnerabilities in Security Configurations on your Virtual Machines] to maintain security configurations on all compute resources.<br><br>How to monitor Azure Security Center recommendations:<br><br>https://docs.microsoft.com/en-us/azure/security-center/security-center-recommendations<br><br><br><br>How to remediate Azure Security Center recommendations:<br><br>https://docs.microsoft.com/en-us/azure/security-center/security-center-remediate-recommendations

## Maintain Secure Configurations for all Azure Resources

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.3 | 5.2 | Customer |

**Guidance**: Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.<br><br>How to configure and manage Azure Policy:<br><br>https://docs.microsoft.com/en-us/azure/governance/policy/tutorials/create-and-manage<br><br><br><br>Understanding Azure Policy Effects:<br><br>https://docs.microsoft.com/en-us/azure/governance/policy/concepts/effects

## Maintain Secure Configurations for Operating Systems

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.4 | 5.2 | Shared |

**Guidance**: Base Operating System Images managed and maintained by Microsoft.<br><br><br><br>However, customers can apply security settings required by their organization using ARM templates and/or Desired State Configuration.<br><br><br><br>How to create an Azure Virtual Machine from an ARM template:<br><br>https://docs.microsoft.com/en-us/azure/virtual-machines/windows/ps-template<br><br><br><br>Understand Desired State Configuration for Azure Virtual Machines:<br><br>https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/dsc-overview

## Securely Store Configuration of Azure Resources

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.5 | 5.3 | Customer |

**Guidance**: If using custom Azure policy definitions, utilize Azure DevOps/Repos to securely store and manage your code.<br><br>How to store code in Azure DevOps:<br><br>https://docs.microsoft.com/en-us/azure/devops/repos/git/gitworkflow?view=azure-devops<br><br><br><br>Azure Repos Documentation:<br><br>https://docs.microsoft.com/en-us/azure/devops/repos/index?view=azure-devops

## Securely Store Custom Operating System Images

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.6 | 5.3 | Customer |

**Guidance**: If using custom images, utilize RBAC to ensure only authorized users may access the images. For container images, store them in Azure Container Registry and leverage RBAC to ensure only authorized users may access the images.<br><br>Understand RBAC in Azure:<br><br>https://docs.microsoft.com/en-us/azure/role-based-access-control/rbac-and-directory-admin-roles<br><br><br><br>Understand RBAC for Container Registry:<br><br>https://docs.microsoft.com/en-us/azure/container-registry/container-registry-roles<br><br><br><br>How to configure RBAC in Azure:<br><br>https://docs.microsoft.com/en-us/azure/role-based-access-control/quickstart-assign-role-user-portal

## Deploy System Configuration Management Tools

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.7 | 5.4 | Customer |

**Guidance**: Leverage Azure Policy to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.<br><br>How to configure and manage Azure Policy:<br><br>https://docs.microsoft.com/en-us/azure/governance/policy/tutorials/create-and-manage

## Deploy System Configuration Management Tools for Operating Systems

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.8 | 5.4 | Customer |

**Guidance**: Utilize Azure compute extensions such as [PowerShell Desired State Configuration] for Windows compute or [Linux Chef Extension] for Linux.<br><br>How to install Virtual Machine Extensions in Azure:<br><br>https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/overview#how-can-i-install-an-extension

## Implement Automated Configuration Monitoring for Azure Services

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.9 | 5.5 | Customer |

**Guidance**: Leverage Azure Security Center to perform baseline scans for your Azure Resources<br><br>How to remediate recommendations in Azure Security Center:<br><br>https://docs.microsoft.com/en-us/azure/security-center/security-center-remediate-recommendations

## Implement Automated Configuration Monitoring for Operating Systems

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.1 | 5.5 | Customer |

**Guidance**: Leverage Azure Security Center to perform baseline scans for OS and Docker Settings for Containers.<br><br>Understanding Azure Security Center container recommendations:<br><br>https://docs.microsoft.com/en-us/azure/security-center/security-center-container-recommendations

## Securely manage Azure secrets

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.11 | 13.1 | Customer |

**Guidance**: Utilize Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications.<br><br>How to integrate with Azure Managed Identities:<br>https://docs.microsoft.com/en-us/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity<br><br>How to create a Key Vault:<br>https://docs.microsoft.com/en-us/azure/key-vault/quick-create-portal<br><br>How to provide Key Vault authentication with a managed identity:<br>https://docs.microsoft.com/en-us/azure/key-vault/managed-identity

## Securely and automatically manage identities

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.12 | 4.1 | Customer |

**Guidance**: Utilize Managed Identities to provide Azure services with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.<br><br>How to configure Managed Identities:<br>https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm

## Eliminate unintended credential exposure

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 7.13 | 13.3 | Customer |

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. <br><br>How to setup Credential Scanner:<br>https://secdevtools.azurewebsites.net/helpcredscan.html

