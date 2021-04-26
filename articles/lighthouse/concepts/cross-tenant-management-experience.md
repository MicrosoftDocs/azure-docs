---
title: Cross-tenant management experiences
description: Azure delegated resource management enables a cross-tenant management experience.
ms.date: 03/29/2021
ms.topic: conceptual
---

# Cross-tenant management experiences

As a service provider, you can use [Azure Lighthouse](../overview.md) to manage resources for multiple customers from within your own Azure Active Directory (Azure AD) tenant. Many tasks and services can be performed across managed tenants by using [Azure delegated resource management](../concepts/azure-delegated-resource-management.md).

> [!TIP]
> Azure delegated resource management can also be used [within an enterprise which has multiple Azure AD tenants of its own](enterprise.md) to simplify cross-tenant administration.

## Understanding tenants and delegation

An Azure AD tenant is a representation of an organization. It's a dedicated instance of Azure AD that an organization receives when they create a relationship with Microsoft by signing up for Azure, Microsoft 365, or other services. Each Azure AD tenant is distinct and separate from other Azure AD tenants, and has its own tenant ID (a GUID). For more info, see [What is Azure Active Directory?](../../active-directory/fundamentals/active-directory-whatis.md)

Typically, in order to manage Azure resources for a customer, service providers would have to sign in to the Azure portal using an account associated with that customer's tenant, requiring an administrator in the customer's tenant to create and manage user accounts for the service provider.

With Azure Lighthouse, the onboarding process specifies users within the service provider's tenant who will be able to work on delegated subscriptions and resource groups in the customer's tenant. These users can then sign in to the Azure portal using their own credentials. Within the Azure portal, they can manage resources belonging to all customers to which they have access. This can be done by visiting the [My customers](../how-to/view-manage-customers.md) page in the Azure portal, or by working directly within the context of that customer's subscription, either in the Azure portal or via APIs.

Azure Lighthouse allows greater flexibility to manage resources for multiple customers without having to sign in to different accounts in different tenants. For example, a service provider may have two customers with different responsibilities and access levels. Using Azure Lighthouse, authorized users can sign in to the service provider's tenant to access these resources.

![Diagram showing customer resources managed through one service provider tenant.](../media/azure-delegated-resource-management-service-provider-tenant.jpg)

## APIs and management tool support

You can perform management tasks on delegated resources either directly in the portal or by using APIs and management tools (such as Azure CLI and Azure PowerShell). All existing APIs can be used when working with delegated resources, as long as the functionality is supported for cross-tenant management and the user has the appropriate permissions.

The Azure PowerShell [Get-AzSubscription cmdlet](/powershell/module/Az.Accounts/Get-AzSubscription) will show the `TenantId` for the managing tenant by default. You can use the `HomeTenantId` and `ManagedByTenantIds` attributes for each subscription, allowing you to identify whether a returned subscription belongs to a managed tenant or to your managing tenant.

Similarly, Azure CLI commands such as [az account list](/cli/azure/account#az_account_list) show the `homeTenantId` and `managedByTenants` attributes. If you don't see these values when using Azure CLI, try clearing your cache by running `az account clear` followed by `az login --identity`.

In the Azure REST API, the [Subscriptions - Get](/rest/api/resources/subscriptions/get) and [Subscriptions - List](/rest/api/resources/subscriptions/list) commands include `ManagedByTenant`.

> [!NOTE]
> In addition to tenant information related to Azure Lighthouse, tenants shown by these APIs may also reflect partner tenants for Azure Databricks or Azure managed applications.

We also provide APIs that are specific to performing Azure Lighthouse tasks. For more info, see the **Reference** section.

## Enhanced services and scenarios

Most tasks and services can be performed on delegated resources across managed tenants. Below are some of the key scenarios where cross-tenant management can be especially effective.

[Azure Arc](../../azure-arc/index.yml):

- Manage hybrid servers at scale - [Azure Arc enabled servers](../../azure-arc/servers/overview.md):
  - [Manage Windows Server or Linux machines outside Azure that are connected](../../azure-arc/servers/onboard-portal.md) to delegated subscriptions and/or resource groups in Azure
  - Manage connected machines using Azure constructs, such as Azure Policy and tagging
  - Ensure the same set of policies are applied across customers' hybrid environments
  - Use Azure Security Center to monitor compliance across customers' hybrid environments
- Manage hybrid Kubernetes clusters at scale - [Azure Arc enabled Kubernetes (preview)](../../azure-arc/kubernetes/overview.md):
  - [Manage Kubernetes clusters that are connected](../../azure-arc/kubernetes/quickstart-connect-cluster.md) to delegated subscriptions and/or resource groups in Azure
  - [Use GitOps](../../azure-arc/kubernetes/tutorial-use-gitops-connected-cluster.md) for connected clusters
  - Enforce policies across connected clusters

[Azure Automation](../../automation/index.yml):

- Use Automation accounts to access and work with delegated resources

[Azure Backup](../../backup/index.yml):

- Back up and restore customer data [from on-premises workloads, Azure VMs, Azure file shares, and more](../..//backup/backup-overview.md#what-can-i-back-up)
- View data for all delegated customer resources in [Backup Center](../../backup/backup-center-overview.md)
- Use the [Backup Explorer](../../backup/monitor-azure-backup-with-backup-explorer.md) to help view operational information of backup items (including Azure resources not yet configured for backup) and monitoring information (jobs and alerts) for delegated subscriptions. The Backup Explorer is currently available only for Azure VM data.
- Use [Backup Reports](../../backup/configure-reports.md) across delegated subscriptions to track historical trends, analyze backup storage consumption, and audit backups and restores.

[Azure Blueprints](../../governance/blueprints/index.yml):

- Use Azure Blueprints to orchestrate the deployment of resource templates and other artifacts (requires [additional access](https://www.wesleyhaakman.org/preparing-azure-lighthouse-customer-subscriptions-for-azure-blueprints/) to prepare the customer subscription)

[Azure Cost Management + Billing](../../cost-management-billing/index.yml):

- From the managing tenant, CSP partners can view, manage, and analyze pre-tax consumption costs (not inclusive of purchases) for customers who are under the Azure plan. The cost will be based on retail rates and the Azure role-based access control (Azure RBAC) access that the partner has for the customer's subscription. Currently, you can view consumption costs at retail rates for each individual customer subscription based on Azure RBAC access.

[Azure Key Vault](../../key-vault/general/index.yml):

- Create Key Vaults in customer tenants
- Use a managed identity to create Key Vaults in customer tenants

[Azure Kubernetes Service (AKS)](../../aks/index.yml):

- Manage hosted Kubernetes environments and deploy and manage containerized applications within customer tenants
- Deploy and manage clusters in customer tenants
-	Use Azure Monitor for containers to monitor performance across customer tenants

[Azure Migrate](../../migrate/index.yml):

- Create migration projects in the customer tenant and migrate VMs

[Azure Monitor](../../azure-monitor/index.yml):

- View alerts for delegated subscriptions, with the ability to view and refresh alerts across all subscriptions
- View activity log details for delegated subscriptions
- [Log analytics](../../azure-monitor/logs/service-providers.md): Query data from remote workspaces in multiple tenants (note that automation accounts used to access data from workspaces in customer tenants must be created in the same tenant)
- [Create, view, and manage activity log alerts](../../azure-monitor/alerts/alerts-activity-log.md) in customer tenants
- Create alerts in customer tenants that trigger automation, such as Azure Automation runbooks or Azure Functions, in the managing tenant through webhooks
- Create [diagnostic settings](../..//azure-monitor/essentials/diagnostic-settings.md) in customer tenants to send resource logs to workspaces in the managing tenant
- For SAP workloads, [monitor SAP Solutions metrics with an aggregated view across customer tenants](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/using-azure-lighthouse-and-azure-monitor-for-sap-solutions-to/ba-p/1537293)

[Azure Networking](../../networking/networking-overview.md):

- Deploy and manage [Azure Virtual Network](../../virtual-network/index.yml) and virtual network interface cards (vNICs) within managed tenants
- Deploy and configure [Azure Firewall](../../firewall/overview.md) to protect customers’ Virtual Network resources
- Manage connectivity services such as [Azure Virtual WAN](../../virtual-wan/virtual-wan-about.md), [ExpressRoute](../../expressroute/expressroute-introduction.md), and [VPN Gateways](../../vpn-gateway/vpn-gateway-about-vpngateways.md)
- Use Azure Lighthouse to support key scenarios for the [Azure Networking MSP Program](../../networking/networking-partners-msp.md)

[Azure Policy](../../governance/policy/index.yml):

- Create and edit policy definitions within delegated subscriptions
- Deploy policy definitions and policy assignments across multiple tenants
- Assign customer-defined policy definitions within delegated subscriptions
- Customers see policies authored by the service provider alongside any policies they've authored themselves
- Can [remediate deployIfNotExists or modify assignments within the managed tenant](../how-to/deploy-policy-remediation.md)
- Note that viewing compliance details for non-compliant resources in customer tenants is not currently supported

[Azure Resource Graph](../../governance/resource-graph/index.yml):

- Now includes the tenant ID in returned query results, allowing you to identify whether a subscription belongs to a managed tenant

[Azure Security Center](../../security-center/index.yml):

- Cross-tenant visibility
  - Monitor compliance to security policies and ensure security coverage across all tenants' resources
  - Continuous regulatory compliance monitoring across multiple tenants in a single view
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
- Note that the entire subscription must be delegated to the managing tenant; Azure Security Center scenarios are not supported with delegated resource groups

[Azure Sentinel](../../sentinel/multiple-tenants-service-providers.md):

- Manage Azure Sentinel resources [in customer tenants](../../sentinel/multiple-tenants-service-providers.md)
- [Track attacks and view security alerts across multiple tenants](https://techcommunity.microsoft.com/t5/azure-sentinel/using-azure-lighthouse-and-azure-sentinel-to-monitor-across/ba-p/1043899)
- [View incidents](../../sentinel/multiple-workspace-view.md) across multiple Azure Sentinel workspaces spread across tenants

[Azure Service Health](../../service-health/index.yml):

- Monitor the health of customer resources with Azure Resource Health
- Track the health of the Azure services used by your customers

[Azure Site Recovery](../../site-recovery/index.yml):

- Manage disaster recovery options for Azure virtual machines in customer tenants (note that you can't use `RunAs` accounts to copy VM extensions)

[Azure Virtual Machines](../../virtual-machines/index.yml):

- Use virtual machine extensions to provide post-deployment configuration and automation tasks on Azure VMs
- Use boot diagnostics to troubleshoot Azure VMs
- Access VMs with serial console
- Integrate VMs with Azure Key Vault for passwords, secrets, or cryptographic keys for disk encryption by using [managed identity through policy](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/create-keyvault-secret), ensuring that secrets are stored in a Key Vault in the managed tenants
- Note that you can't use Azure Active Directory for remote login to VMs

Support requests:

- [Open support requests from **Help + support**](../../azure-portal/supportability/how-to-create-azure-support-request.md#getting-started) in the Azure portal for delegated resources (selecting the support plan available to the delegated scope)
- Use the [Azure Quota API](/rest/api/reserved-vm-instances/quotaapi) to view and manage Azure service quotas for delegated customer resources

## Current limitations

With all scenarios, please be aware of the following current limitations:

- Requests handled by Azure Resource Manager can be performed using Azure Lighthouse. The operation URIs for these requests start with `https://management.azure.com`. However, requests that are handled by an instance of a resource type (such as Key Vault secrets access or storage data access) aren't supported with Azure Lighthouse. The operation URIs for these requests typically start with an address that is unique to your instance, such as `https://myaccount.blob.core.windows.net` or `https://mykeyvault.vault.azure.net/`. The latter also are typically data operations rather than management operations.
- Role assignments must use [Azure built-in roles](../../role-based-access-control/built-in-roles.md). All built-in roles are currently supported with Azure delegated resource management except for Owner or any built-in roles with [`DataActions`](../../role-based-access-control/role-definitions.md#dataactions) permission. The User Access Administrator role is supported only for limited use in [assigning roles to managed identities](../how-to/deploy-policy-remediation.md#create-a-user-who-can-assign-roles-to-a-managed-identity-in-the-customer-tenant).  Custom roles and [classic subscription administrator roles](../../role-based-access-control/classic-administrators.md) are not supported.
- While you can onboard subscriptions that use Azure Databricks, users in the managing tenant can't launch Azure Databricks workspaces on a delegated subscription at this time.
- While you can onboard subscriptions and resource groups that have resource locks, those locks will not prevent actions from being performed by users in the managing tenant. [Deny assignments](../../role-based-access-control/deny-assignments.md) that protect system-managed resources, such as those created by Azure managed applications or Azure Blueprints (system-assigned deny assignments), do prevent users in the managing tenant from acting on those resources; however, at this time users in the customer tenant can't create their own deny assignments (user-assigned deny assignments).
- Delegation of subscriptions across a [national cloud](../../active-directory/develop/authentication-national-cloud.md) and the Azure public cloud, or across two separate national clouds, is not supported.

## Next steps

- Onboard your customers to Azure Lighthouse, either by [using Azure Resource Manager templates](../how-to/onboard-customer.md) or by [publishing a private or public managed services offer to Azure Marketplace](../how-to/publish-managed-services-offers.md).
- [View and manage customers](../how-to/view-manage-customers.md) by going to **My customers** in the Azure portal.