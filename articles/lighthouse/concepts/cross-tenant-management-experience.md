---
title: Cross-tenant management experiences
description: Azure delegated resource management enables a cross-tenant management experience.
ms.date: 05/12/2020
ms.topic: conceptual
---

# Cross-tenant management experiences

As a service provider, you can use [Azure delegated resource management](../concepts/azure-delegated-resource-management.md) to manage Azure resources for multiple customers from within your own tenant in the [Azure portal](https://portal.azure.com). Most tasks and services can be performed on delegated Azure resources across managed tenants. This article describes some of the enhanced scenarios where Azure delegated resource management can be effective.

> [!NOTE]
> Azure delegated resource management can also be used [within an enterprise which has multiple Azure AD tenants of its own](enterprise.md) to simplify cross-tenant administration.

## Understanding customer tenants

An Azure Active Directory (Azure AD) tenant is a representation of an organization. It's a dedicated instance of Azure AD that an organization receives when they create a relationship with Microsoft by signing up for Azure, Microsoft 365, or other services. Each Azure AD tenant is distinct and separate from other Azure AD tenants, and has its own tenant ID (a GUID). For more info, see [What is Azure Active Directory?](../../active-directory/fundamentals/active-directory-whatis.md)

Typically, in order to manage Azure resources for a customer, service providers would have to sign in to the Azure portal using an account associated with that customer's tenant, requiring an administrator in the customer's tenant to create and manage user accounts for the service provider.

With Azure delegated resource management, the onboarding process specifies users within the service provider's tenant who will be able to access and manage subscriptions, resource groups, and resources in the customer's tenant. These users can then sign in to the Azure portal using their own credentials. Within the Azure portal, they can manage resources belonging to all customers to which they have access. This can be done by visiting the [My customers](../how-to/view-manage-customers.md) page in the Azure portal, or by working directly within the context of that customer's subscription, either in the Azure portal or via APIs.

Azure delegated resource management allows greater flexibility to manage resources for multiple customers without having to sign in to different accounts in different tenants. For example, a service provider may have two customers with different responsibilities and access levels. Using Azure delegated resource management, authorized users can sign in to the service provider's tenant to access these resources.

![Customer resources managed through one service provider tenant](../media/azure-delegated-resource-management-service-provider-tenant.jpg)

## APIs and management tool support

You can perform management tasks on delegated resources either directly in the portal or by using APIs and management tools (such as Azure CLI and Azure PowerShell). All existing APIs can be used when working with delegated resources, as long as the functionality is supported for cross-tenant management and the user has the appropriate permissions.

The Azure PowerShell [Get-AzSubscription cmdlet](https://docs.microsoft.com/powershell/module/Az.Accounts/Get-AzSubscription?view=azps-3.5.0) show the **tenantID** for each subscription, allowing you to identify whether a returned subscription belongs to your service provider tenant or to a managed customer tenant.

Similarly, Azure CLI commands such as [az account list](https://docs.microsoft.com/cli/azure/account?view=azure-cli-latest#az-account-list) show the **homeTenantId** and **managedByTenants** attributes.

> [!TIP]
> If you don't see these values when using Azure CLI, try clearing your cache by running `az account clear` followed by `az login --identity`.

We also provide APIs that are specific to performing Azure delegated resource management tasks. For more info, see the **Reference** section.

## Enhanced services and scenarios

Most tasks and services can be performed on delegated resources across managed tenants. Below are some of the key scenarios where cross-tenant management can be effective.

[Azure Arc for servers (preview)](../../azure-arc/servers/overview.md):

- [Connect Windows Server or Linux machines outside Azure](../../azure-arc/servers/quickstart-onboard-portal.md) to delegated subscriptions and/or resource groups in Azure
- Manage connected machines using Azure constructs, such as Azure Policy and tagging

[Azure Automation](../../automation/index.yml):

- Use automation accounts to access and work with delegated customer resources

[Azure Backup](../../backup/index.yml):

- Back up and restore customer data in customer tenants
- Use the [Backup Explorer](../../backup/monitor-azure-backup-with-backup-explorer.md) to help view operational information of backup items (including Azure resources not yet configured for backup) and monitoring information (jobs and alerts) for delegated subscriptions. The Backup Explorer is currently available only for Azure VM data.
- Use [Backup Reports](../../backup/configure-reports.md) across delegated subscriptions to track historical trends, analyze backup storage consumption, and audit backups and restores.

[Azure Kubernetes Service (AKS)](../../aks/index.yml):

- Manage hosted Kubernetes environments and deploy and manage containerized applications within customer tenants

[Azure Monitor](../../azure-monitor/index.yml):

- View alerts for delegated subscriptions, with the ability to view alerts across all subscriptions
- View activity log details for delegated subscriptions
- Log analytics: Query data from remote customer workspaces in multiple tenants
- Create alerts in customer tenants that trigger automation, such as Azure Automation runbooks or Azure Functions, in the service provider tenant through webhooks

[Azure Networking](../../networking/networking-overview.md):

- Deploy and manage [Azure Virtual Network (VNet)](../../virtual-network/index.yml) and virtual network interface cards (vNICs) within customer tenants
- Deploy and configure [Azure Firewall](../../firewall/overview.md) to protect customers’ Virtual Network resources
- Manage connectivity services such as [Azure Virtual WAN](../../virtual-wan/virtual-wan-about.md), [ExpressRoute](../../expressroute/expressroute-introduction.md), and [VPN Gateways](../../vpn-gateway/vpn-gateway-about-vpngateways.md) for customers
- Use Azure Lighthouse to support key scenarios for the [Azure Networking MSP Program](../../networking/networking-partners-msp.md)


[Azure Policy](../../governance/policy/index.yml):

- Compliance snapshots show details for assigned policies within delegated subscriptions
- Create and edit policy definitions within a delegated subscription
- Assign customer-defined policy definitions within the delegated subscription
- Customers see policies authored by the service provider alongside any policies they've authored themselves
- Can [remediate deployIfNotExists or modify assignments within the customer tenant](../how-to/deploy-policy-remediation.md)

[Azure Resource Graph](../../governance/resource-graph/index.yml):

- Now includes the tenant ID in returned query results, allowing you to identify whether a subscription belongs to the customer tenant or service provider tenant

[Azure Security Center](../../security-center/index.yml):

- Cross-tenant visibility
  - Monitor compliance to security policies and ensure security coverage across all tenants' resources
  - Continuous regulatory compliance monitoring across multiple customers in a single view
  - Monitor, triage, and prioritize actionable security recommendations with secure score calculation
- Cross-tenant security posture management
  - Manage security policies
  - Take action on resources that are out of compliance with actionable security recommendations
  - Collect and store security-related data
- Cross-tenant threat detection and protection
  - Detect threats across tenants' resources
  - Apply advanced threat protection controls such as just-in-time (JIT) VM access
  - Harden network security group configuration with Adaptive Network Hardening
  - Ensure servers are running only the applications and processes they should be with adaptive application controls
  - Monitor changes to important files and registry entries with File Integrity Monitoring (FIM)

[Azure Sentinel](../../sentinel/multiple-tenants-service-providers.md):

- Manage Azure Sentinel resources [in customer tenants](../../sentinel/multiple-tenants-service-providers.md)
- [Track attacks and view security alerts across multiple customer tenants](https://techcommunity.microsoft.com/t5/azure-sentinel/using-azure-lighthouse-and-azure-sentinel-to-monitor-across/ba-p/1043899)
- [View incidents](../../sentinel/multiple-workspace-view.md) across multiple Sentinel workspaces spread across customer tenants

[Azure Service Health](../../service-health/index.yml):

- Monitor the health of customer resources with Azure Resource Health
- Track the health of the Azure services used by your customers

[Azure Site Recovery](../../site-recovery/index.yml):

- Manage disaster recovery options for Azure virtual machines in customer tenants (note that you can't use RunAs accounts to copy VM extensions)

[Azure Virtual Machines](../../virtual-machines/index.yml):

- Use virtual machine extensions to provide post-deployment configuration and automation tasks on Azure VMs in customer tenants
- Use boot diagnostics to troubleshoot Azure VMs in customer tenants
- Access VMs with serial console in customer tenants
- Integrate VMs with Azure KeyVault for passwords, secrets, or cryptographic keys for disk encryption by using [managed identity through policy](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/create-keyvault-secret), ensuring that secrets are stored in a Key Vault in customer tenants
- Note that you can't use Azure Active Directory for remote login to VMs in customer tenants

Support requests:

- Open support requests for delegated resources from the **Help + support** blade in the Azure portal (selecting the support plan available to the delegated scope)

## Current limitations
With all scenarios, please be aware of the following current limitations:

- Requests handled by Azure Resource Manager can be performed using Azure delegated resource management. The operation URIs for these requests start with `https://management.azure.com`. However, requests that are handled by an instance of a resource type (such as KeyVault secrets access or storage data access) aren't supported with Azure delegated resource management. The operation URIs for these requests typically start with an address that is unique to your instance, such as `https://myaccount.blob.core.windows.net` or `https://mykeyvault.vault.azure.net/`. The latter also are typically data operations rather than management operations. 
- Role assignments must use role-based access control (RBAC) [built-in roles](../../role-based-access-control/built-in-roles.md). All built-in roles are currently supported with Azure delegated resource management except for Owner or any built-in roles with [DataActions](../../role-based-access-control/role-definitions.md#dataactions) permission. The User Access Administrator role is supported only for limited use in [assigning roles to managed identities](../how-to/deploy-policy-remediation.md#create-a-user-who-can-assign-roles-to-a-managed-identity-in-the-customer-tenant).  Custom roles and [classic subscription administrator roles](../../role-based-access-control/classic-administrators.md) are not supported.
- While you can onboard subscriptions that use Azure Databricks, users in the managing tenant can't launch Azure Databricks workspaces on a delegated subscription at this time.
- While you can onboard subscriptions and resource groups for Azure delegated resource management which have resource locks, those locks will not prevent actions from being performed by users in the managing tenant. [Deny assignments](../../role-based-access-control/deny-assignments.md) that protect system-managed resources, such as those created by Azure managed applications or Azure Blueprints (system-assigned deny assignments), do prevent users in the managing tenant from acting on those resources; however, at this time users in the customer tenant can't create their own deny assignments (user-assigned deny assignments).
- Users in the managing tenant will not have access to view billing info for a delegated customer subscription, even if they have a built-in role that would typically allow access. This is because access to billing information requires additional steps that are currently only supported for users within the same tenant.

## Next steps

- Onboard your customers to Azure delegated resource management, either by [using Azure Resource Manager templates](../how-to/onboard-customer.md) or by [publishing a private or public managed services offer to Azure Marketplace](../how-to/publish-managed-services-offers.md).
- [View and manage customers](../how-to/view-manage-customers.md) by going to **My customers** in the Azure portal.
