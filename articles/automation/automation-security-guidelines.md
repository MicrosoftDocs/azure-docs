---
title: Azure Automation security guidelines, security best practices Automation jobs.
description: This article helps you with the guidelines that Azure Automation offers to ensure a secured configuration of Automation account, Hybrid Runbook worker role, authentication certificate and identities, network isolation and policies.
services: automation
ms.subservice: shared-capabilities
ms.date: 10/03/2023
ms.topic: conceptual 
---

# Security best practices in Azure Automation

> [!IMPORTANT]
> Azure Automation Run as accounts, including  Classic Run as accounts have retired on **30 September 2023** and replaced with [Managed Identities](automation-security-overview.md#managed-identities). You would no longer be able to create or renew Run as accounts through the Azure portal. For more information, see [migrating from an existing Run As accounts to managed identity](migrate-run-as-accounts-managed-identity.md?tabs=run-as-account#sample-scripts).

This article details the best practices to securely execute the automation jobs.
[Azure Automation](./overview.md) provides you the platform to orchestrate frequent, time consuming, error-prone infrastructure management and operational tasks, as well as mission-critical operations. This service allows you to execute scripts, known as automation runbooks seamlessly across cloud and hybrid environments. 

The platform components of Azure Automation Service are actively secured and hardened. The service goes through robust security and compliance checks. the [Microsoft cloud security benchmark](/security/benchmark/azure/overview) details the best practices and recommendations to help improve the security of workloads, data, and services on Azure. Also see [Azure security baseline for Azure Automation](/security/benchmark/azure/baselines/automation-security-baseline?toc=/azure/automation/TOC.json).

## Secure configuration of Automation account

This section guides you in configuring your Automation account securely.

### Permissions

1. Follow the principle of least privilege to get the work done when granting access to Automation resources. Implement [Automation granular RBAC roles](./automation-role-based-access-control.md) and avoid assigning broader roles or scopes such as subscription level. When creating the custom roles, only include the permissions users need. By limiting roles and scopes, you limit the resources that are at risk if the security principal is ever compromised. For detailed information on role-based access control concepts, see [Azure role-based access control best practices](../role-based-access-control/best-practices.md).

1. Avoid roles that include Actions having a wildcard (_*_) as it implies full access to the Automation resource or a sub-resource, for example _automationaccounts/*/read_. Instead, use specific actions only for the required permission.

1. Configure [Role based access at a runbook level](./automation-role-based-access-control.md) if the user doesn't require access to all the runbooks in the Automation account.

1. Limit the number of highly privileged roles such as Automation Contributor to reduce the potential for breach by a compromised owner.

1. Use [Microsoft Entra Privileged Identity Management](../active-directory/roles/security-planning.md#use-azure-ad-privileged-identity-management) to protect the privileged accounts from malicious cyber-attacks to increase your visibility into their use through reports and alerts.

### Securing Hybrid Runbook worker role

1. Install Hybrid workers using the [Hybrid Runbook Worker VM extension](./extension-based-hybrid-runbook-worker-install.md?tabs=windows), that doesn't have any dependency on the Log Analytics agent. We recommend this platform as it leverages Microsoft Entra ID based authentication. 
   [Hybrid Runbook Worker](./automation-hrw-run-runbooks.md) feature of Azure Automation allows you to execute runbooks directly on the machine hosting the role in Azure or non-Azure machine to execute Automation jobs in the local environment. 
    - Use only high privilege users or [Hybrid worker custom roles](./extension-based-hybrid-runbook-worker-install.md?tabs=windows) for users responsible for managing operations such as registering or unregistering Hybrid workers and hybrid groups and executing runbooks against Hybrid runbook worker groups. 
    - The same user would also require VM contributor access on the machine hosting Hybrid worker role. Since the VM contributor is a high privilege role, ensure only a limited right set of users have access to manage Hybrid works, thereby reducing the potential for breach by a compromised owner.

   Follow the [Azure RBAC best practices](../role-based-access-control/best-practices.md).

1. Follow the principle of least privilege and grant only the required permissions to users for runbook execution against a Hybrid worker. Don't provide unrestricted permissions to the machine hosting the hybrid runbook worker role. In case of unrestricted access, a user with VM Contributor rights or having permissions to run commands against the hybrid worker machine can use the Automation Account Run As certificate from the hybrid worker machine and could potentially allow a malicious user access as a subscription contributor. This could jeopardize the security of your Azure environment.
   Use [Hybrid worker custom roles](./extension-based-hybrid-runbook-worker-install.md?tabs=windows) for users responsible to manage Automation runbooks against Hybrid runbook workers and Hybrid runbook worker groups.

1. [Unregister](./extension-based-hybrid-runbook-worker-install.md?tabs=windows#delete-a-hybrid-runbook-worker) any unused or non-responsive hybrid workers.

### Authentication certificate and identities

1. For runbook authentication, we recommend that you use [Managed identities](./automation-security-overview.md#managed-identities) instead of Run As accounts. The Run As accounts are an administrative overhead and we plan to deprecate them. A managed identity from Microsoft Entra ID allows your runbook to easily access other Microsoft Entra protected resources such as Azure Key Vault. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. For more information about managed identities in Azure Automation, see [Managed identities for Azure Automation](./automation-security-overview.md#managed-identities)

   You can authenticate an Automation account using two types of managed identities:
   - **System-assigned identity** is tied to your application and is deleted if your app is deleted. An app can only have one system-assigned identity.
   - **User-assigned identity** is a standalone Azure resource that can be assigned to your app. An app can have multiple user-assigned identities. 

   Follow the [Managed identity best practice recommendations](../active-directory/managed-identities-azure-resources/managed-identity-best-practice-recommendations.md#choosing-system-or-user-assigned-managed-identities) for more details. 

1. Rotate the [Azure Automation keys](./automation-create-standalone-account.md?tabs=azureportal#manage-automation-account-keys) periodically. The key regeneration prevents future DSC or hybrid worker node registrations from using previous keys. We recommend to use the [Extension based hybrid workers](./automation-hybrid-runbook-worker.md) that use Microsoft Entra authentication instead of Automation keys. Microsoft Entra ID centralizes the control and management of identities and resource credentials.

### Data security
1. Secure the assets in Azure Automation including credentials, certificates, connections and encrypted variables. These assets are protected in Azure Automation using multiple levels of encryption. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys to use for encryption of Automation assets. These keys must be present in Azure Key Vault for Automation service to be able to access the keys. See [Encryption of secure assets using customer-managed keys](./automation-secure-asset-encryption.md).

1. Don't print any credentials or certificate details in the job output. An Automation job operator who is the low privilege user can view the sensitive information.

1. Maintain a valid [backup of Automation](./automation-managing-data.md#data-backup) configuration like runbooks and assets ensuring backups are validated and protected to maintain business continuity after an unexpected event. 

### Network isolation

1. Use [Azure Private Link](./how-to/private-link-security.md) to securely connect Hybrid runbook workers to Azure Automation. Azure Private Endpoint is a network interface that connects you privately and securely to a an Azure Automation service powered by Azure Private Link. Private Endpoint uses a private IP address from your Virtual Network (VNet), to effectively bring the Automation service into your VNet. 

If you want to access and manage other services privately through runbooks from Azure VNet without the need to open an outbound connection to the internet, you can execute runbooks on a Hybrid Worker that is connected to the Azure VNet.

### Policies for Azure Automation

Review the Azure Policy recommendations for Azure Automation and act as appropriate. See [Azure Automation policies](./policy-reference.md).
 
## Next steps

* To learn how to use Azure role-based access control (Azure RBAC), see [Manage role permissions and security in Azure Automation](./automation-role-based-access-control.md).
* For information on how Azure protects your privacy and secures your data, see [Azure Automation data security](./automation-managing-data.md).
* To learn about configuring the Automation account to use encryption, see [Encryption of secure assets in Azure Automation](./automation-secure-asset-encryption.md).
