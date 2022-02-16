---
title: Azure Automation security guidelines
description: This article helps you with the guidelines that Azure Automation offers to ensure data privacy and data security.
services: automation
ms.subservice: shared-capabilities
ms.date: 02/16/2022
ms.topic: conceptual 
---

# Best practices for security in Azure Automation

This article details the best practices to securely execute the automation jobs and ensure that you have all guardrails in place to avoid any exploitation.

[Azure Automation](/azure/automation/overview) provides you the platform to orchestrate frequent and time consuming, error-prone infrastructure management and operational tasks, as well as mission-critical operations. This service allows you to execute scripts, known as automation runbooks seamlessly across cloud and hybrid environments. The platform components of Azure Automation Service are actively secured and hardened. The service goes through robust security and compliance checks continuously to ensure that:

- Your Automation resources are secured from other customers’ Azure resources.
- [Azure security benchmark](/security/benchmark/azure/overview) details the best practices and recommendations to help improve the security of workloads, data, and services on Azure. Also see [Azure security baseline for Azure Automation](/security/benchmark/azure/baselines/automation-security-baseline?toc=/azure/automation/TOC.json)

## Secure configuration of Automation account

This section guides you in configuring your Automation account securely.

**Permissions**

1. Follow the principle of least privilege to get the work done when granting access to Automation resources. Implement [Automation granular RBAC roles](/azure/automation/automation-role-based-access-control) and avoid assigning broader roles or scopes such as subscription level. When creating the custom roles, only include the permissions users need. By limiting roles and scopes, you limit the resources that are at risk if the security principal is ever compromised. The [Azure role-based access control best practices](/azure/role-based-access-control/best-practices) provides detailed information on role-based access control concepts.

1. Avoid roles that include Actions having a wildcard _*_ as it implies full access to the Automation resource or a sub-resource, example _automationaccounts/*/read_. 

1. Configure [Role based access at a runbook level](/azure/automation/automation-role-based-access-control) if the user doesn't require access to all the runbooks in the Automation account.

1. Limit the number of highly privileged roles like Automation Contributor to reduce the potential for breach by a compromised owner.

1. Use [Azure AD Privileged Identity Management](/azure/active-directory/roles/security-planning#use-azure-ad-privileged-identity-management) to protect the privileged accounts from malicious cyber-attacks to increase your visibility into their use through reports and alerts.

**Securing Hybrid Runbook worker role**

1. [Hybrid Runbook Worker](/azure/automation/automation-hrw-run-runbooks) feature of Azure Automation allows to execute runbooks directly on the machine hosting the role in Azure or non-Azure machine to execute Automation jobs in the local environment. Use [Hybrid worker custom roles](/azure/automation/extension-based-hybrid-runbook-worker-install?tabs=windows#manage-role-permissions-for-hybrid-worker-groups) for users responsible for managing Automation runbooks against Hybrid runbook workers and Hybrid runbook worker groups.

1. Follow the principle of least privilege and grant only the required permissions to users for runbook execution against a Hybrid worker. Don't provide unrestricted permissions to the machine hosting the hybrid runbook worker role. In case of unrestricted access, a user with VM Contributor rights or having permissions to run commands against the hybrid worker machine can use the Automation Account Run As certificate from the hybrid worker machine and could potentially allow a malicious user access as a subscription contributor. This could jeopardize the security of your Azure environment. Use [Hybrid worker custom roles](/azure/automation/extension-based-hybrid-runbook-worker-install?tabs=windows#manage-role-permissions-for-hybrid-worker-groups) for users responsible to manage Automation runbooks against Hybrid runbook workers and Hybrid runbook worker groups.

**Authentication certificate and identities**

1. If you use Run As accounts as the authentication mechanism for your runbooks, ensure the following:
   - Track the service principals in your inventory. Service principals often have elevated permissions.
   - Delete any unused Run As accounts to minimize your exposed attack surface. 
   - [Renew the Run As certificate](/azure/automation/manage-runas-account#cert-renewal) periodically.
   - Follow the RBAC guidelines to limit the permissions assigned to Run As account using this [script](/azure/automation/manage-runas-account#limit-run-as-account-permissions). Do not assign high privilege permissions like Contributor, Owner and so on.

1. Use [Managed identities](/azure/automation/automation-security-overview#managed-identities) instead of Run As accounts as the recommended method of runbook authentication and also to minimize the administrative overhead of managing Run As accounts. A managed identity from Azure Active Directory (Azure AD) allows your runbook to easily access other Azure AD-protected resources such as Azure Key Vault. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. For more information about managed identities in Azure Automation, see [Managed identities for Azure Automation](/azure/automation/automation-security-overview#managed-identities)

1. You can authenticate an Automation account using two types of managed identities:
   - **A system-assigned identity** is tied to your application and is deleted if your app is deleted. An app can only have one system-assigned identity.
   - **User-assigned identity** is a standalone Azure resource that can be assigned to your app. An app can have multiple user-assigned identities.

1. Rotate the [Azure Automation keys](/azure/automation/automation-create-standalone-account?tabs=azureportal#manage-automation-account-keys) periodically. The key regeneration prevents future DSC or hybrid worker node registrations from using previous keys.

**Data Security**
1. Secure the assets in Azure Automation including credentials, certificates, connections and encrypted variables. These assets are protected in Azure Automation using multiple levels of encryption. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys to use for encryption of Automation assets. These keys must be present in Azure Key Vault for Automation service to be able to access the keys. See [Encryption of secure assets using customer-managed keys](/azure/automation/automation-secure-asset-encryption).

1. Maintain a valid [backup of Automation](/azure/automation/automation-managing-data#data-backup) configuration like runbooks and assets ensuring backups are validated and protected to maintain business continuity after an unexpected event. 

**Network isolation**

1. Use [Azure Private Link](/azure/automation/how-to/private-link-security) to securely connect Hybrid runbook workers to Azure Automation. Azure Private Endpoint is a network interface that connects you privately and securely to a an Azure Automation service powered by Azure Private Link. Private Endpoint uses a private IP address from your VNet, to effectively bring the Automation service into your VNet. 

You can execute runbooks on a Hybrid Worker connected to the Azure VNet, if you want to access & manage other services privately through runbooks from Azure Virtual Network (VNet) without the need to open an outbound connection to the internet.

**Policies for Azure Automation**

- Review the Azure Policy recommendations for Azure Automation and act as appropriate. See [Azure Automation policies](/azure/automation/policy-reference).
 


