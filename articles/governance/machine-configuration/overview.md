---
title: Understand Azure Automanage Machine Configuration
description: Learn how Azure Policy uses the machine configuration feature to audit or configure settings inside virtual machines.
ms.date: 05/16/2023
ms.topic: conceptual
---
# Understand the machine configuration feature of Azure Automanage

[!INCLUDE [Machine configuration rename banner](../includes/banner.md)]

Azure Policy's machine configuration feature provides native capability to audit or configure
operating system settings as code for machines running in Azure and hybrid
[Arc-enabled machines][01]. You can use the feature directly per-machine, or orchestrate it at
scale by using Azure Policy.

Configuration resources in Azure are designed as an [extension resource][02]. You can imagine each
configuration as an extra set of properties for the machine. Configurations can include settings
such as:

- Operating system settings
- Application configuration or presence
- Environment settings

Configurations are distinct from policy definitions. Machine configuration uses Azure Policy to
dynamically assign configurations to machines. You can also assign configurations to machines
[manually][03], or by using other Azure services such as [Automanage][04].

Examples of each scenario are provided in the following table.

|              Type              |                                                                                                        Description                                                                                                         |                                                                                            Example story                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Configuration management][05] | You want a complete representation of a server, as code in source control. The deployment should include properties of the server (size, network, storage) and configuration of operating system and application settings. | "This machine should be a web server configured to host my website."                                                                                                                                |
| [Compliance][06]               | You want to audit or deploy settings to all machines in scope either reactively to existing machines or proactively to new machines as they're deployed.                                                                  | "All machines should use TLS 1.2. Audit existing machines so I can release change where it's needed, in a controlled way, at scale. For new machines, enforce the setting when they're deployed." |

You can view the per-setting results from configurations in the [Guest assignments page][07]. If an
Azure Policy assignment orchestrated the configuration is orchestrated, you can select the "Last
evaluated resource" link on the ["Compliance details" page][07].

[A video walk-through of this document is available][08]. (Update coming soon)

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

If you prefer to deploy the extension and managed identity to a single machine, follow the guidance
for each:

- [Overview of the Azure Policy Guest Configuration extension][13]
- [Configure managed identities for Azure resources on a VM using the Azure portal][14]

To use machine configuration packages that apply configurations, Azure VM guest configuration
extension version 1.26.24 or later is required.

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
| Windows          | [PowerShell Desired State Configuration][15] v3 | Side-loaded to a folder only used by Azure Policy. Doesn't conflict with Windows PowerShell DSC. PowerShell isn't added to system path.                |
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

## Supported client types

Machine configuration policy definitions are inclusive of new versions. Older versions of operating
systems available in Azure Marketplace are excluded if the Guest Configuration client isn't
compatible. The following table shows a list of supported operating systems on Azure images. The
`.x` text is symbolic to represent new minor versions of Linux distributions.

| Publisher | Name                       | Versions         |
| --------- | -------------------------- | ---------------- |
| Alma      | AlmaLinux                  | 9                |
| Amazon    | Linux                      | 2                |
| Canonical | Ubuntu Server              | 14.04 - 22.x     |
| Credativ  | Debian                     | 8 - 10.x         |
| Microsoft | CBL-Mariner                | 1 - 2            |
| Microsoft | Windows Client             | Windows 10       |
| Microsoft | Windows Server             | 2012 - 2022      |
| Oracle    | Oracle-Linux               | 7.x - 8.x        |
| OpenLogic | CentOS                     | 7.3 - 8.x        |
| Red Hat   | Red Hat Enterprise Linux\* | 7.4 - 9.x        |
| Rocky     | Rocky Linux                | 9                |
| SUSE      | SLES                       | 12 SP3-SP5, 15.x |

\* Red Hat CoreOS isn't supported.

Machine configuration policy definitions support custom virtual machine images as long as they're
one of the operating systems in the previous table.

## Network requirements

Azure virtual machines can use either their local virtual network adapter (vNIC) or Azure Private
Link to communicate with the machine configuration service.

Azure Arc-enabled machines connect using the on-premises network infrastructure to reach Azure
services and report compliance status.

Following is a list of the Azure Storage endpoints required for Azure and Azure Arc-enabled virtual
machines to communicate with the machine configuration resource provider in Azure:

- `oaasguestconfigac2s1.blob.core.windows.net`
- `oaasguestconfigacs1.blob.core.windows.net`
- `oaasguestconfigaes1.blob.core.windows.net`
- `oaasguestconfigases1.blob.core.windows.net`
- `oaasguestconfigbrses1.blob.core.windows.net`
- `oaasguestconfigbrss1.blob.core.windows.net`
- `oaasguestconfigccs1.blob.core.windows.net`
- `oaasguestconfigces1.blob.core.windows.net`
- `oaasguestconfigcids1.blob.core.windows.net`
- `oaasguestconfigcuss1.blob.core.windows.net`
- `oaasguestconfigeaps1.blob.core.windows.net`
- `oaasguestconfigeas1.blob.core.windows.net`
- `oaasguestconfigeus2s1.blob.core.windows.net`
- `oaasguestconfigeuss1.blob.core.windows.net`
- `oaasguestconfigfcs1.blob.core.windows.net`
- `oaasguestconfigfss1.blob.core.windows.net`
- `oaasguestconfiggewcs1.blob.core.windows.net`
- `oaasguestconfiggns1.blob.core.windows.net`
- `oaasguestconfiggwcs1.blob.core.windows.net`
- `oaasguestconfigjiws1.blob.core.windows.net`
- `oaasguestconfigjpes1.blob.core.windows.net`
- `oaasguestconfigjpws1.blob.core.windows.net`
- `oaasguestconfigkcs1.blob.core.windows.net`
- `oaasguestconfigkss1.blob.core.windows.net`
- `oaasguestconfigncuss1.blob.core.windows.net`
- `oaasguestconfignes1.blob.core.windows.net`
- `oaasguestconfignres1.blob.core.windows.net`
- `oaasguestconfignrws1.blob.core.windows.net`
- `oaasguestconfigqacs1.blob.core.windows.net`
- `oaasguestconfigsans1.blob.core.windows.net`
- `oaasguestconfigscuss1.blob.core.windows.net`
- `oaasguestconfigseas1.blob.core.windows.net`
- `oaasguestconfigsecs1.blob.core.windows.net`
- `oaasguestconfigsfns1.blob.core.windows.net`
- `oaasguestconfigsfws1.blob.core.windows.net`
- `oaasguestconfigsids1.blob.core.windows.net`
- `oaasguestconfigstzns1.blob.core.windows.net`
- `oaasguestconfigswcs1.blob.core.windows.net`
- `oaasguestconfigswns1.blob.core.windows.net`
- `oaasguestconfigswss1.blob.core.windows.net`
- `oaasguestconfigswws1.blob.core.windows.net`
- `oaasguestconfiguaecs1.blob.core.windows.net`
- `oaasguestconfiguaens1.blob.core.windows.net`
- `oaasguestconfigukss1.blob.core.windows.net`
- `oaasguestconfigukws1.blob.core.windows.net`
- `oaasguestconfigwcuss1.blob.core.windows.net`
- `oaasguestconfigwes1.blob.core.windows.net`
- `oaasguestconfigwids1.blob.core.windows.net`
- `oaasguestconfigwus2s1.blob.core.windows.net`
- `oaasguestconfigwus3s1.blob.core.windows.net`
- `oaasguestconfigwuss1.blob.core.windows.net`

### Communicate over virtual networks in Azure

To communicate with the machine configuration resource provider in Azure, machines require outbound
access to Azure datacenters on port `443`*. If a network in Azure doesn't allow outbound traffic,
configure exceptions with [Network Security Group][18] rules. The [service tags][19]
`AzureArcInfrastructure` and `Storage` can be used to reference the guest configuration and Storage
services rather than manually maintaining the [list of IP ranges][20] for Azure datacenters. Both
tags are required because Azure Storage hosts the machine configuration content packages.

### Communicate over Private Link in Azure

Virtual machines can use [private link][21] for communication to the machine configuration service.
Apply tag with the name `EnablePrivateNetworkGC` and value `TRUE` to enable this feature. The tag
can be applied before or after machine configuration policy definitions are applied to the machine.

> [!IMPORTANT]
> To communicate over private link for custom packages, the link to the location of the
> package must be added to the list of allowed URLs.

Traffic is routed using the Azure [virtual public IP address][22] to establish a secure,
authenticated channel with Azure platform resources.

### Communicate over public endpoints outside of Azure

Servers located on-premises or in other clouds can be managed with machine configuration
by connecting them to [Azure Arc][01].

For Azure Arc-enabled servers, allow traffic using the following patterns:

- Port: Only TCP 443 required for outbound internet access
- Global URL: `*.guestconfiguration.azure.com`

See the [Azure Arc-enabled servers network requirements][23] for a full list of all network
endpoints required by the Azure Connected Machine Agent for core Azure Arc and machine
configuration scenarios.

### Communicate over Private Link outside of Azure

When you use [private link with Arc-enabled servers][24], built-in policy packages are
automatically downloaded over the private link. You don't need to set any tags on the Arc-enabled
server to enable this feature.

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

## Availability

Customers designing a highly available solution should consider the redundancy planning
requirements for [virtual machines][28] because guest assignments are extensions of machine
resources in Azure. When guest assignment resources are provisioned into an Azure region that's
[paired][29], you can view guest assignment reports if at least one region in the pair is
available. When the Azure region isn't paired and it becomes unavailable, you can't access reports
for a guest assignment. When the region is restored, you can access the reports again.

It's best practice to assign the same policy definitions with the same parameters to all machines
in the solution for highly available applications. This is especially true for scenarios where
virtual machines are provisioned in [Availability Sets][30] behind a load balancer solution. A
single policy assignment spanning all machines has the least administrative overhead.

For machines protected by [Azure Site Recovery][31], ensure that the machines in the primary and
secondary site are within scope of Azure Policy assignments for the same definitions. Use the same
parameter values for both sites.

## Data residency

Machine configuration stores and processes customer data. By default, customer data is replicated
to the [paired region.][29] For the regions Singapore, Brazil South, and East Asia, all customer
data is stored and processed in the region.

## Troubleshooting machine configuration

For more information about troubleshooting machine configuration, see
[Azure Policy troubleshooting][32].

### Multiple assignments

At this time, only some built-in machine configuration policy definitions support multiple
assignments. However, all custom policies support multiple assignments by default if you used the
latest version of [the GuestConfiguration PowerShell module][33] to create machine configuration
packages and policies.

Following is the list of built-in machine configuration policy definitions that support multiple
assignments:

| ID                                                                                        | DisplayName                                                                                                 |
|--------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| /providers/Microsoft.Authorization/policyDefinitions/5fe81c49-16b6-4870-9cee-45d13bf902ce | Local authentication methods should be disabled on Windows Servers                                          |
| /providers/Microsoft.Authorization/policyDefinitions/fad40cac-a972-4db0-b204-f1b15cced89a | Local authentication methods should be disabled on Linux machines                                           |
| /providers/Microsoft.Authorization/policyDefinitions/f40c7c00-b4e3-4068-a315-5fe81347a904 | [Preview]: Add user-assigned managed identity to enable Guest Configuration assignments on virtual machines |
| /providers/Microsoft.Authorization/policyDefinitions/63594bb8-43bb-4bf0-bbf8-c67e5c28cb65 | [Preview]: Linux machines should meet STIG compliance requirement for Azure compute                         |
| /providers/Microsoft.Authorization/policyDefinitions/50c52fc9-cb21-4d99-9031-d6a0c613361c | [Preview]: Windows machines should meet STIG compliance requirements for Azure compute                      |
| /providers/Microsoft.Authorization/policyDefinitions/e79ffbda-ff85-465d-ab8e-7e58a557660f | [Preview]: Linux machines with OMI installed should have version 1.6.8-1 or later                           |
| /providers/Microsoft.Authorization/policyDefinitions/934345e1-4dfb-4c70-90d7-41990dc9608b | Audit Windows machines that do not contain the specified certificates in Trusted Root                       |
| /providers/Microsoft.Authorization/policyDefinitions/08a2f2d2-94b2-4a7b-aa3b-bb3f523ee6fd | Audit Windows machines on which the DSC configuration is not compliant                                      |
| /providers/Microsoft.Authorization/policyDefinitions/c648fbbb-591c-4acd-b465-ce9b176ca173 | Audit Windows machines that do not have the specified Windows PowerShell execution policy                   |
| /providers/Microsoft.Authorization/policyDefinitions/3e4e2bd5-15a2-4628-b3e1-58977e9793f3 | Audit Windows machines that do not have the specified Windows PowerShell modules installed                  |
| /providers/Microsoft.Authorization/policyDefinitions/58c460e9-7573-4bb2-9676-339c2f2486bb | Audit Windows machines on which Windows Serial Console is not enabled                                       |
| /providers/Microsoft.Authorization/policyDefinitions/e6ebf138-3d71-4935-a13b-9c7fdddd94df | Audit Windows machines on which the specified services are not installed and 'Running'                      |
| /providers/Microsoft.Authorization/policyDefinitions/c633f6a2-7f8b-4d9e-9456-02f0f04f5505 | Audit Windows machines that are not set to the specified time zone                                          |

> [!NOTE]
> Please check this page periodically for updates to the list of built-in machine configuration
> policy definitions that support multiple assignments.

### Assignments to Azure management groups

Azure Policy definitions in the category `Guest Configuration` can be assigned to management groups
when the effect is `AuditIfNotExists` or `DeployIfNotExists`.

### Client log files

The machine configuration extension writes log files to the following locations:

Windows

- Azure VM: `C:\ProgramData\GuestConfig\gc_agent_logs\gc_agent.log`
- Arc-enabled server: `C:\ProgramData\GuestConfig\arc_policy_logs\gc_agent.log`

Linux

- Azure VM: `/var/lib/GuestConfig/gc_agent_logs/gc_agent.log`
- Arc-enabled server: `/var/lib/GuestConfig/arc_policy_logs/gc_agent.log`

### Collecting logs remotely

The first step in troubleshooting machine configurations or modules should be to use the cmdlets
following the steps in [How to test machine configuration package artifacts][34]. If that isn't
successful, collecting client logs can help diagnose issues.

#### Windows

Capture information from log files using [Azure VM Run Command][35], the following example
PowerShell script can be helpful.

```powershell
$linesToIncludeBeforeMatch = 0
$linesToIncludeAfterMatch  = 10
$params = @{
    Path = 'C:\ProgramData\GuestConfig\gc_agent_logs\gc_agent.log'
    Pattern = @(
        'DSCEngine'
        'DSCManagedEngine'
    )
    CaseSensitive = $true
    Context = @(
        $linesToIncludeBeforeMatch
        $linesToIncludeAfterMatch
    )
}
Select-String @params | Select-Object -Last 10
```

#### Linux

Capture information from log files using [Azure VM Run Command][36], the following example Bash
script can be helpful.

```bash
LINES_TO_INCLUDE_BEFORE_MATCH=0
LINES_TO_INCLUDE_AFTER_MATCH=10
LOGPATH=/var/lib/GuestConfig/gc_agent_logs/gc_agent.log
egrep -B $LINES_TO_INCLUDE_BEFORE_MATCH -A $LINES_TO_INCLUDE_AFTER_MATCH 'DSCEngine|DSCManagedEngine' $LOGPATH | tail
```

### Agent files

The machine configuration agent downloads content packages to a machine and extracts the contents.
To verify what content has been downloaded and stored, view the folder locations in the following
list.

- Windows: `C:\ProgramData\guestconfig\configuration`
- Linux: `/var/lib/GuestConfig/Configuration`


### Open-source nxtools module functionality

A new open-source [nxtools module][37] has been released to help make managing Linux systems easier
for PowerShell users.

The module helps in managing common tasks such as:

- Managing users and groups
- Performing file system operations
- Managing services
- Performing archive operations
- Managing packages

The module includes class-based DSC resources for Linux and built-in machine configuration
packages.

To provide feedback about this functionality, open an issue on the documentation. We currently
_don't_ accept PRs for this project, and support is best effort.

## Machine configuration samples

Machine configuration built-in policy samples are available in the following locations:

- [Built-in policy definitions - Guest Configuration][38]
- [Built-in initiatives - Guest Configuration][39]
- [Azure Policy samples GitHub repository][40]
- [Sample DSC resource modules][41]

## Next steps

- Set up a custom machine configuration package [development environment][33].
- [Create a package artifact][42] for machine configuration.
- [Test the package artifact][34] from your development environment.
- Use the **GuestConfiguration** module to [create an Azure Policy definition][43] for at-scale
  management of your environment.
- [Assign your custom policy definition][06] using Azure portal.
- Learn how to view [compliance details for machine configuration][07] policy assignments.

<!-- Link reference definitions -->
[01]: ../../azure-arc/servers/overview.md
[02]: ../../azure-resource-manager/management/extension-resource-types.md
[03]: assignments.md#manually-creating-machine-configuration-assignments
[04]: ../../automanage/index.yml
[05]: assignments.md
[06]: ../policy/assign-policy-portal.md
[07]: ../policy/how-to/determine-non-compliance.md
[08]: https://youtu.be/t9L8COY-BkM
[09]: ../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal
[10]: ../../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell
[11]: ../../azure-resource-manager/management/resource-providers-and-types.md#azure-cli
[12]: ../../virtual-machines/extensions/overview.md
[13]: ./overview.md
[14]: ../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md
[15]: /powershell/dsc/overview
[16]: https://www.chef.io/inspec/
[17]: ../policy/how-to/get-compliance-data.md#evaluation-triggers
[18]: ../../virtual-network/manage-network-security-group.md#create-a-security-rule
[19]: ../../virtual-network/service-tags-overview.md
[20]: https://www.microsoft.com/download/details.aspx?id=56519
[21]: ../../private-link/private-link-overview.md
[22]: ../../virtual-network/what-is-ip-address-168-63-129-16.md
[23]: ../../azure-arc/servers/network-requirements.md
[24]: ../../azure-arc/servers/private-link-security.md
[25]: ../../active-directory/managed-identities-azure-resources/managed-identities-faq.md#what-identity-will-imds-default-to-if-dont-specify-the-identity-in-the-request
[26]: https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3cf2ab00-13f1-4d0c-8971-2ac904541a7e
[27]: https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F497dff13-db2a-4c0f-8603-28fa3b331ab6
[28]: ../../virtual-machines/availability.md
[29]: ../../availability-zones/cross-region-replication-azure.md
[30]: ../../virtual-machines/availability.md#availability-sets
[31]: ../../site-recovery/site-recovery-overview.md
[32]: ../policy/troubleshoot/general.md
[33]: ./how-to-set-up-authoring-environment.md
[34]: ./how-to-test-package.md
[35]: ../../virtual-machines/windows/run-command.md
[36]: ../../virtual-machines/linux/run-command.md
[37]: https://github.com/azure/nxtools#getting-started
[38]: ../policy/samples/built-in-policies.md
[39]: ../policy/samples/built-in-initiatives.md
[40]: https://github.com/Azure/azure-policy/tree/master/built-in-policies/policySetDefinitions/Guest%20Configuration
[41]: https://github.com/Azure/azure-policy/tree/master/samples/GuestConfiguration/package-samples/resource-modules
[42]: ./how-to-create-package.md
[43]: ./how-to-create-policy-definition.md
