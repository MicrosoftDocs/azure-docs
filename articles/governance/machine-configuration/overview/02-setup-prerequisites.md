---
description: Configure the required components, extensions, and identities needed to enable Azure Machine Configuration on your virtual machines.
ms.date: 11/07/2025
ms.topic: how-to
title: Azure Machine Configuration prerequisites
ms.custom: references_regions
---

# Azure Machine Configuration prerequisites

Azure Machine Configuration provides native capability to audit or configure operating system settings as code, both for machines running in Azure and hybrid Arc-enabled machines. Before you can use machine configuration to manage your environment, you must enable the prerequisites for the service.

## Enable machine configuration

To manage the state of machines in your environment, including machines in Azure
and Arc-enabled servers, review the following details.

## Resource provider

Before you can use the machine configuration feature of Azure Policy, you must register the
`Microsoft.GuestConfiguration` resource provider. If assignment of a machine configuration policy
is done through the portal, or if the subscription is enrolled in Microsoft Defender for Cloud, the
resource provider is registered automatically. You can manually register through the [portal][09],
[Azure PowerShell][10], or [Azure CLI][11].

## Deploy requirements for Azure virtual machines

To manage settings inside a machine, a [virtual machine extension][12] is enabled and the machine
must have a system-managed identity. The extension downloads applicable machine configuration
assignments and the corresponding dependencies. The identity is used to authenticate the machine as
it reads and writes to the machine configuration service. The extension isn't required for
Arc-enabled servers because it's included in the Arc Connected Machine agent.

> [!IMPORTANT]
> The machine configuration extension and a managed identity are required to manage Azure virtual
> machines.

To deploy the extension at scale across many machines, assign the policy initiative
`Deploy prerequisites to enable Guest Configuration policies on virtual machines`
to a management group, subscription, or resource group containing the machines that you plan to
manage.

If you prefer to deploy the extension and managed identity to a single machine, see
[Configure managed identities for Azure resources on a VM using the Azure portal][14].

To use machine configuration packages that apply configurations, Azure VM guest configuration
extension version 1.26.24 or later is required.

> [!IMPORTANT]
> The creation of a managed identity or assignment of a policy with "Guest Configuration 
> Resource Contributor" role are actions that require appropriate Azure RBAC permissions to perform.
> To learn more about Azure Policy and Azure RBAC, see [role-based access control in Azure Policy][45].

## Assigning policies to machines outside of Azure

The Audit policy definitions available for machine configuration include the
**Microsoft.HybridCompute/machines** resource type. Any machines onboarded to
[Azure Arc-enabled servers][01] that are in the scope of the policy assignment are automatically
included.

## Managed identity requirements

Policy definitions in the initiative
`Deploy prerequisites to enable guest configuration policies on virtual machines` enable a
system-assigned managed identity, if one doesn't exist. There are two policy definitions in the
initiative that manage identity creation. The `if` conditions in the policy definitions ensure the
correct behavior based on the current state of the machine resource in Azure.

> [!IMPORTANT]
> These definitions create a System-Assigned managed identity on the target resources, in addition
> to existing User-Assigned Identities (if any). For existing applications unless they specify the
> User-Assigned identity in the request, the machine will default to using System-Assigned Identity
> instead. [Learn More][25]

If the machine doesn't currently have any managed identities, the effective policy is:
[Add system-assigned managed identity to enable Guest Configuration assignments on virtual machines with no identities][26]

If the machine currently has a user-assigned system identity, the effective policy is:
[Add system-assigned managed identity to enable Guest Configuration assignments on VMs with a user-assigned identity][27]

### Limits set on the extension

To limit the extension from impacting applications running inside the machine, the machine
configuration agent isn't allowed to exceed more than 5% of CPU. This limitation exists for both
built-in and custom definitions. The same is true for the machine configuration service in Arc
Connected Machine agent.

### Validation tools

Inside the machine, the machine configuration agent uses local tools to perform tasks.

The following table shows a list of the local tools used on each supported operating system. For
built-in content, machine configuration handles loading these tools automatically.

| Operating system |                 Validation tool                 |                                                                         Notes                                                                          |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Windows          | [PowerShell Desired State Configuration][15] v2 | Side-loaded to a folder only used by Azure Policy. Doesn't conflict with Windows PowerShell DSC. PowerShell isn't added to system path.                |
| Linux            | [PowerShell Desired State Configuration][15] v3 | Side-loaded to a folder only used by Azure Policy. PowerShell isn't added to system path.                                                              |
| Linux            | [Chef InSpec][16]                               | Installs Chef InSpec version 2.2.61 in default location and adds it to system path. It installs InSpec's dependencies, including Ruby and Python, too. |

### Validation frequency

The machine configuration agent checks for new or changed guest assignments every 5 minutes. Once a
guest assignment is received, the settings for that configuration are rechecked on a 15-minute
interval. If multiple configurations are assigned, each is evaluated sequentially. Long-running
configurations affect the interval for all configurations, because the next can't run until the
prior configuration has finished.

Results are sent to the machine configuration service when the audit completes. When a policy
[evaluation trigger][17] occurs, the state of the machine is written to the machine configuration
resource provider. This update causes Azure Policy to evaluate the Azure Resource Manager
properties. An on-demand Azure Policy evaluation retrieves the latest value from the machine
configuration resource provider. However, it doesn't trigger a new activity within the machine. The
status is then written to Azure Resource Graph.

## Next steps

Now that you understand the setup prerequisites, continue to the next article to learn about network requirements:

> [Network requirements][28]


<!-- Link reference definitions -->
[09]: /azure/azure-resource-manager/management/resource-providers-and-types#azure-portal
[10]: /azure/azure-resource-manager/management/resource-providers-and-types#azure-powershell
[11]: /azure/azure-resource-manager/management/resource-providers-and-types#azure-cli
[12]: /azure/virtual-machines/extensions/overview
[14]: /entra/identity/managed-identities-azure-resources/qs-configure-portal-windows-vm
[15]: /powershell/dsc/overview
[16]: https://www.chef.io/inspec/
[17]: ../../policy/how-to/get-compliance-data.md#evaluation-triggers
[45]: ../../policy/overview.md
[01]: /azure/azure-arc/servers/overview
[25]: /azure/active-directory/managed-identities-azure-resources/managed-identities-faq#what-identity-will-imds-default-to-if-dont-specify-the-identity-in-the-request
[26]: https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3cf2ab00-13f1-4d0c-8971-2ac904541a7e
[27]: https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F497dff13-db2a-4c0f-8603-28fa3b331ab6
[28]: ./03-network-requirements.md