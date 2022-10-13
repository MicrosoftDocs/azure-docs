---
title: Understand the machine configuration feature of Azure Policy
description: Learn how Azure Policy uses the machine configuration feature to audit or configure settings inside virtual machines.
author: timwarner-msft
ms.date: 07/25/2022
ms.topic: conceptual
ms.author: timwarner
ms.service: machine-configuration
---
# Understand the machine configuration feature of Azure Automanage

[!INCLUDE [Machine config rename banner](../includes/banner.md)]

Azure Policy's machine configuration feature provides native capability
to audit or configure operating system settings as code,
both for machines running in Azure and hybrid
[Arc-enabled machines](../../azure-arc/servers/overview.md).
The feature can be used directly per-machine,
or at-scale orchestrated by Azure Policy.

Configuration resources in Azure are designed as an
[extension resource](../../azure-resource-manager/management/extension-resource-types.md).
You can imagine each configuration as an additional set of properties
for the machine. Configurations can include settings such as:

- Operating system settings
- Application configuration or presence
- Environment settings

Configurations are distinct from policy definitions. Machine configuration
utilizes Azure Policy to dynamically assign configurations
to machines. You can also assign configurations to machines
[manually](machine-configuration-assignments.md#manually-creating-machine-configuration-assignments),
or by using other Azure services such as
[Automanage](../../automanage/index.yml).

Examples of each scenario are provided in the following table.

| Type                                                             | Description                                                                                                                                                                                                                | Example story                                                                                                                                                                                       |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Configuration management](machine-configuration-assignments.md) | You want a complete representation of a server, as code in source control. The deployment should include properties of the server (size, network, storage) and configuration of operating system and application settings. | "This machine should be a web server configured to host my website."                                                                                                                                |
| [Compliance](../policy/assign-policy-portal.md)                  | You want to audit or deploy settings to all machines in scope either reactively to existing machines or proactively to new machines as they are deployed.                                                                  | "All machines should use TLS 1.2. Audit existing machines so I can release change where it is needed, in a controlled way, at scale. For new machines, enforce the setting when they are deployed." |

The per-setting results from configurations can be viewed either in the
[Guest assignments page](../policy/how-to/determine-non-compliance.md)
or if the configuration is orchestrated by an Azure Policy assignment,
by clicking on the "Last evaluated resource" link on the
["Compliance details" page](../policy/how-to/determine-non-compliance.md).

[A video walk-through of this document is available](https://youtu.be/t9L8COY-BkM). (update coming soon)

## Enable machine configuration

To manage the state of machines in your environment, including machines in Azure
and Arc-enabled servers, review the following details.

## Resource provider

Before you can use the machine configuration feature of Azure Policy, you must
register the `Microsoft.GuestConfiguration` resource provider. If assignment of
a machine configuration policy is done through the portal, or if the subscription
is enrolled in Microsoft Defender for Cloud, the resource provider is registered
automatically. You can manually register through the
[portal](../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal),
[Azure PowerShell](../../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell),
or
[Azure CLI](../../azure-resource-manager/management/resource-providers-and-types.md#azure-cli).

## Deploy requirements for Azure virtual machines

To manage settings inside a machine, a
[virtual machine extension](../../virtual-machines/extensions/overview.md) is
enabled and the machine must have a system-managed identity. The extension
downloads applicable machine configuration assignment and the corresponding
dependencies. The identity is used to authenticate the machine as it reads and
writes to the machine configuration service. The extension isn't required for Arc-enabled
servers because it's included in the Arc Connected Machine agent.

> [!IMPORTANT]
> The machine configuration extension and a managed identity are required to
> manage Azure virtual machines.

To deploy the extension at scale across many machines, assign the policy initiative
`Deploy prerequisites to enable machine configuration policies on virtual machines`
to a management group, subscription, or resource group containing the machines
that you plan to manage.

If you prefer to deploy the extension and managed identity to a single machine,
follow the guidance for each:

- [Overview of the Azure Policy Guest Configuration extension](./overview.md)
- [Configure managed identities for Azure resources on a VM using the Azure portal](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)

To use machine configuration packages that apply configurations, Azure VM guest
configuration extension version **1.29.24** or later is required.

### Limits set on the extension

To limit the extension from impacting applications running inside the machine,
the machine configuration agent isn't allowed to exceed more than 5% of CPU. This
limitation exists for both built-in and custom definitions. The same is true for
the machine configuration service in Arc Connected Machine agent.

### Validation tools

Inside the machine, the machine configuration agent uses local tools to perform
tasks.

The following table shows a list of the local tools used on each supported
operating system. For built-in content, machine configuration handles loading
these tools automatically.

| Operating system | Validation tool                                                       | Notes                                                                                                                                                                  |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Windows          | [PowerShell Desired State Configuration](/powershell/dsc/overview) v3 | Side-loaded to a folder only used by Azure Policy. Won't conflict with Windows PowerShell DSC. PowerShell Core isn't added to system path.                             |
| Linux            | [PowerShell Desired State Configuration](/powershell/dsc/overview) v3 | Side-loaded to a folder only used by Azure Policy. PowerShell Core isn't added to system path.                                                                         |
| Linux            | [Chef InSpec](https://www.chef.io/inspec/)                            | Installs Chef InSpec version 2.2.61 in default location and added to system path. Dependencies for the InSpec package including Ruby and Python are installed as well. |

### Validation frequency

The machine configuration agent checks for new or changed guest assignments every
5 minutes. Once a guest assignment is received, the settings for that
configuration are rechecked on a 15-minute interval. If multiple configurations
are assigned, each is evaluated sequentially. Long-running configurations impact
the interval for all configurations, because the next will not run until the
prior configuration has finished.

Results are sent to the machine configuration service when the audit completes.
When a policy
[evaluation trigger](../policy/how-to/get-compliance-data.md#evaluation-triggers)
occurs, the state of the machine is written to the machine configuration resource
provider. This update causes Azure Policy to evaluate the Azure Resource Manager
properties. An on-demand Azure Policy evaluation retrieves the latest value from
the machine configuration resource provider. However, it doesn't trigger a new
activity within the machine. The status is then written to Azure
Resource Graph.

## Supported client types

Machine configuration policy definitions are inclusive of new versions. Older versions of operating
systems available in Azure Marketplace are excluded if the Guest Configuration client isn't
compatible. The following table shows a list of supported operating systems on Azure images.
The ".x" text is symbolic to represent new minor versions of Linux distributions.

| Publisher | Name                       | Versions         |
| --------- | -------------------------- | ---------------- |
| Amazon    | Linux                      | 2                |
| Canonical | Ubuntu Server              | 14.04 - 20.x     |
| Credativ  | Debian                     | 8 - 10.x         |
| Microsoft | Windows Server             | 2012 - 2022      |
| Microsoft | Windows Client             | Windows 10       |
| Oracle    | Oracle-Linux               | 7.x-8.x          |
| OpenLogic | CentOS                     | 7.3 -8.x         |
| Red Hat   | Red Hat Enterprise Linux\* | 7.4 - 8.x        |
| SUSE      | SLES                       | 12 SP3-SP5, 15.x |

\* Red Hat CoreOS isn't supported.

Custom virtual machine images are supported by machine configuration policy
definitions as long as they're one of the operating systems in the table above.

## Network requirements

Virtual machines in Azure can use either their local network adapter or a
private link to communicate with the machine configuration service.

Azure Arc machines connect using the on-premises network infrastructure to reach
Azure services and report compliance status.

### Communicate over virtual networks in Azure

To communicate with the machine configuration resource provider in Azure, machines
require outbound access to Azure datacenters on port **443**. If a network in
Azure doesn't allow outbound traffic, configure exceptions with
[Network Security Group](../../virtual-network/manage-network-security-group.md#create-a-security-rule)
rules. The
[service tags](../../virtual-network/service-tags-overview.md)
"AzureArcInfrastructure" and "Storage" can be used to reference the guest
configuration and Storage services rather than manually maintaining the
[list of IP ranges](https://www.microsoft.com/download/details.aspx?id=56519)
for Azure datacenters. Both tags are required because machine configuration
content packages are hosted by Azure Storage.

### Communicate over Private Link in Azure

Virtual machines can use
[private link](../../private-link/private-link-overview.md)
for communication to the machine configuration service. Apply tag with the name
`EnablePrivateNetworkGC` and value `TRUE` to enable this feature. The tag can be
applied before or after machine configuration policy definitions are applied to
the machine.

Traffic is routed using the Azure
[virtual public IP address](../../virtual-network/what-is-ip-address-168-63-129-16.md)
to establish a secure, authenticated channel with Azure platform resources.

### Azure Arc-enabled servers

Nodes located outside Azure that are connected by Azure Arc require connectivity
to the machine configuration service. Details about network and proxy requirements
provided in the
[Azure Arc documentation](../../azure-arc/servers/overview.md).

For Arc-enabled servers in private datacenters, allow traffic using the
following patterns:

- Port: Only TCP 443 required for outbound internet access
- Global URL: `*.guestconfiguration.azure.com`

## Assigning policies to machines outside of Azure

The Audit policy definitions available for machine configuration include the
**Microsoft.HybridCompute/machines** resource type. Any machines onboarded to
[Azure Arc for servers](../../azure-arc/servers/overview.md) that are in the
scope of the policy assignment are automatically included.

## Managed identity requirements

Policy definitions in the initiative _Deploy prerequisites to enable guest
configuration policies on virtual machines_ enable a system-assigned managed
identity, if one doesn't exist. There are two policy definitions in the
initiative that manage identity creation. The IF conditions in the policy
definitions ensure the correct behavior based on the current state of the
machine resource in Azure.

> [!IMPORTANT]
> These definitions create a System-Assigned managed identity on the target resources, in addition to existing User-Assigned Identities (if any). For existing applications unless they specify the User-Assigned identity in the request, the machine will default to using System-Assigned Identity instead. [Learn More](../../active-directory/managed-identities-azure-resources/managed-identities-faq.md#what-identity-will-imds-default-to-if-dont-specify-the-identity-in-the-request)

If the machine doesn't currently have any managed identities, the effective
policy is:
[Add system-assigned managed identity to enable machine configuration assignments on virtual machines with no identities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3cf2ab00-13f1-4d0c-8971-2ac904541a7e)

If the machine currently has a user-assigned system identity, the effective
policy is:
[Add system-assigned managed identity to enable machine configuration assignments on VMs with a user-assigned identity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F497dff13-db2a-4c0f-8603-28fa3b331ab6)

## Availability

Customers designing a highly available solution should consider the redundancy planning requirements for
[virtual machines](../../virtual-machines/availability.md) because guest assignments are extensions of
machine resources in Azure. When guest assignment resources are provisioned in to an Azure region that is
[paired](../../availability-zones/cross-region-replication-azure.md), as long as at least one region in the pair
is available, then guest assignment reports are available. If the Azure region isn't paired and
it becomes unavailable, then it isn't possible to access reports for a guest assignment until
the region is restored.

When you considering an architecture for highly available applications,
especially where virtual machines are provisioned in
[Availability Sets](../../virtual-machines/availability.md#availability-sets)
behind a load balancer solution to provide high availability,
it's best practice to assign the same policy definitions with the same parameters to all machines
in the solution. If possible, a single policy assignment spanning all
machines would offer the least administrative overhead.

For machines protected by
[Azure Site Recovery](../../site-recovery/site-recovery-overview.md),
ensure that machines in a secondary site are within scope of Azure Policy assignments
for the same definitions using the same parameter values as machines in the primary site.

## Data residency

Machine configuration stores/processes customer data. By default, customer data is replicated to the
[paired region.](../../availability-zones/cross-region-replication-azure.md)
For the regions: Singapore, Brazil South, and East Asia all customer data is stored and processed in the region.

## Troubleshooting machine configuration

For more information about troubleshooting machine configuration, see
[Azure Policy troubleshooting](../policy/troubleshoot/general.md).

### Multiple assignments

Guest Configuration policy definitions now support assigning the same
guest assignment to more than once per machine when the policy assignment uses different
parameters. 

### Assignments to Azure Management Groups

Azure Policy definitions in the category 'Guest Configuration' can be assigned
to Management Groups only when the effect is 'AuditIfNotExists'. Policy
definitions with effect 'DeployIfNotExists' aren't supported as assignments to
Management Groups.

### Client log files

The machine configuration extension writes log files to the following locations:

Windows

- Azure VM: `C:\ProgramData\GuestConfig\gc_agent_logs\gc_agent.log`
- Arc-enabled server: `C:\ProgramData\GuestConfig\arc_policy_logs\gc_agent.log`

Linux

- Azure VM: `/var/lib/GuestConfig/gc_agent_logs/gc_agent.log`
- Arc-enabled server: `/var/lib/GuestConfig/arc_policy_logs/gc_agent.log`

### Collecting logs remotely

The first step in troubleshooting machine configurations or modules
should be to use the cmdlets following the steps in
[How to test machine configuration package artifacts](./machine-configuration-create-test.md).
If that isn't successful, collecting client logs can help diagnose issues.

#### Windows

Capture information from log files using
[Azure VM Run Command](../../virtual-machines/windows/run-command.md), the
following example PowerShell script can be helpful.

```powershell
$linesToIncludeBeforeMatch = 0
$linesToIncludeAfterMatch = 10
$logPath = 'C:\ProgramData\GuestConfig\gc_agent_logs\gc_agent.log'
Select-String -Path $logPath -pattern 'DSCEngine','DSCManagedEngine' -CaseSensitive -Context $linesToIncludeBeforeMatch,$linesToIncludeAfterMatch | Select-Object -Last 10
```

#### Linux

Capture information from log files using
[Azure VM Run Command](../../virtual-machines/linux/run-command.md), the
following example Bash script can be helpful.

```bash
linesToIncludeBeforeMatch=0
linesToIncludeAfterMatch=10
logPath=/var/lib/GuestConfig/gc_agent_logs/gc_agent.log
egrep -B $linesToIncludeBeforeMatch -A $linesToIncludeAfterMatch 'DSCEngine|DSCManagedEngine' $logPath | tail
```

### Agent files

The machine configuration agent downloads content packages to a machine and
extracts the contents. To verify what content has been downloaded and stored,
view the folder locations given below.

Windows: `c:\programdata\guestconfig\configuration`

Linux: `/var/lib/GuestConfig/Configuration`

## Machine configuration samples

Machine configuration built-in policy samples are available in the following
locations:

- [Built-in policy definitions - Guest Configuration](../policy/samples/built-in-policies.md)
- [Built-in initiatives - Guest Configuration](../policy/samples/built-in-initiatives.md)
- [Azure Policy samples GitHub repo](https://github.com/Azure/azure-policy/tree/master/built-in-policies/policySetDefinitions/Guest%20Configuration)
- [Sample DSC resource modules](https://github.com/Azure/azure-policy/tree/master/samples/GuestConfiguration/package-samples/resource-modules)

## Next steps

- Set up a custom machine configuration package [development environment](./machine-configuration-create-setup.md).
- [Create a package artifact](./machine-configuration-create.md)
  for machine configuration.
- [Test the package artifact](./machine-configuration-create-test.md)
  from your development environment.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./machine-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../policy/assign-policy-portal.md) using
  Azure portal.
- Learn how to view
  [compliance details for machine configuration](../policy/how-to/determine-non-compliance.md) policy assignments.
