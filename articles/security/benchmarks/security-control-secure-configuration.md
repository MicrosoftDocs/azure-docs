---
title: Azure Security Control - Secure Configuration
description: Azure Security Control Secure Configuration
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 04/14/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control: Secure Configuration

Establish, implement, and actively manage (track, report on, correct) the security configuration of Azure resources in order to prevent attackers from exploiting vulnerable services and settings.

## 7.1: Establish secure configurations for all Azure resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.1 | 5.1 | Customer |

Use Azure Policy aliases to create custom policies to audit or enforce the configuration of your Azure resources. You may also use built-in Azure Policy definitions.

Also, Azure Resource Manager has the ability to export the template in JavaScript Object Notation (JSON), which should be reviewed to ensure that the configurations meet / exceed the security requirements for your organization.

You may also use recommendations from Azure Security Center as a secure configuration baseline for your Azure resources.

- [How to view available Azure Policy aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

- [Tutorial: Create and manage policies to enforce compliance](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Single and multi-resource export to a template in Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/templates/export-template-portal)

- [Security recommendations - a reference guide](https://docs.microsoft.com/azure/security-center/recommendations-reference)

## 7.2: Establish secure operating system configurations

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.2 | 5.1 | Customer |

Use Azure Security Center recommendations to maintain security configurations on all compute resources.  Additionally, you may use custom operating system images or Azure Automation State configuration to establish the security configuration of the operating system required by your organization.

- [How to monitor Azure Security Center recommendations](https://docs.microsoft.com/azure/security-center/security-center-recommendations)

- [Security recommendations - a reference guide](https://docs.microsoft.com/azure/security-center/recommendations-reference)

- [Azure Automation State Configuration Overview](https://docs.microsoft.com/azure/automation/automation-dsc-overview)

- [Upload a VHD and use it to create new Windows VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/upload-generalized-managed)

- [Create a Linux VM from a custom disk with the Azure CLI](https://docs.microsoft.com/azure/virtual-machines/linux/upload-vhd)

## 7.3: Maintain secure Azure resource configurations

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.3 | 5.2 | Customer |

Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.  In addition, you may use Azure Resource Manager templates to maintain the security configuration of your Azure resources required by your organization. 

- [Understand Azure Policy effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

- [Create and manage policies to enforce compliance](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Azure Resource Manager templates overview](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview)

## 7.4: Maintain secure operating system configurations

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.4 | 5.2 | Shared |

Follow recommendations from Azure Security Center on performing vulnerability assessments on your Azure compute resources.  In addition, you may use Azure Resource Manager templates, custom operating system images or Azure Automation State configuration to maintain the security configuration of the operating system required by your organization.   The Microsoft virtual machine templates combined with the Azure Automation Desired State Configuration may assist in meeting and maintaining the security requirements. 

Also, note that Azure Marketplace Virtual Machine Images published by Microsoft are managed and maintained by Microsoft. 

- [How to implement Azure Security Center vulnerability assessment recommendations](https://docs.microsoft.com/azure/security-center/security-center-vulnerability-assessment-recommendations)

- [How to create an Azure Virtual Machine from an Azure Resource Manager template](https://docs.microsoft.com/azure/virtual-machines/windows/ps-template)

- [Azure Automation State Configuration Overview](https://docs.microsoft.com/azure/automation/automation-dsc-overview)

- [Create a Windows virtual machine in the Azure portal](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal)

- [Information on how to download the VM template](https://docs.microsoft.com/azure/virtual-machines/windows/download-template)

- [Sample script to upload a VHD to Azure and create a new VM](https://docs.microsoft.com/azure/virtual-machines/scripts/virtual-machines-windows-powershell-upload-generalized-script)

## 7.5: Securely store configuration of Azure resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.5 | 5.3 | Customer |

Use Azure DevOps to securely store and manage your code like custom Azure policies, Azure Resource Manager templates and Desired State Configuration scripts. To access the resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

- [About permissions and groups in Azure DevOps](https://docs.microsoft.com/azure/devops/organizations/security/about-permissions)

## 7.6: Securely store custom operating system images

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.6 | 5.3 | Customer |

If using custom images, use role-based access control (RBAC) to ensure only authorized users may access the images. Using a Shared Image Gallery you can share your images to different users, service principals, or AD groups within your organization.  For container images, store them in Azure Container Registry and leverage RBAC to ensure only authorized users may access the images.  

- [Understand RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles)

- [Understand RBAC for Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-roles)

- [How to configure RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/quickstart-assign-role-user-portal)

- [Shared Image Gallery overview](https://docs.microsoft.com/azure/virtual-machines/windows/shared-image-galleries)

## 7.7: Deploy configuration management tools for Azure resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.7 | 5.4 | Customer |

Define and implement standard security configurations for Azure resources using Azure Policy. Use Azure Policy aliases to create custom policies to audit or enforce the network configuration of your Azure resources. You may also make use of built-in policy definitions related to your specific resources.  Additionally, you may use Azure Automation to deploy configuration changes.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to use Aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases)

## 7.8: Deploy configuration management tools for operating systems

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.8 | 5.4 | Customer |

Azure Automation State Configuration is a configuration management service for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine's compliance to the desired state you specified. 

- [Onboarding machines for management by Azure Automation State Configuration](https://docs.microsoft.com/azure/automation/automation-dsc-onboarding)

## 7.9: Implement automated configuration monitoring for Azure resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.9 | 5.5 | Customer |

Use Azure Security Center to perform baseline scans for your Azure Resources.  Additionally, use Azure Policy to alert and audit Azure resource configurations.

- [How to remediate recommendations in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations)

## 7.10: Implement automated configuration monitoring for operating systems

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.10 | 5.5 | Customer |

Use Azure Security Center to perform baseline scans for OS and Docker Settings for containers.

- [Understand Azure Security Center container recommendations](https://docs.microsoft.com/azure/security-center/security-center-container-recommendations)

## 7.11: Manage Azure secrets securely

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.11 | 13.1 | Customer |

Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications.

- [How to integrate with Azure Managed Identities](https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity)

- [How to create a Key Vault](https://docs.microsoft.com/azure/key-vault/quick-create-portal)

- [How to provide Key Vault authentication with a managed identity](https://docs.microsoft.com/azure/key-vault/managed-identity)

## 7.12: Manage identities securely and automatically

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.12 | 4.1 | Customer |

Use Managed Identities to provide Azure services with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [How to configure Managed Identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm)

## 7.13: Eliminate unintended credential exposure

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 7.13 | 18.1, 18.7 | Customer |

Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)


## Next steps

- See the next Security Control:  [Malware Defense](security-control-malware-defense.md)