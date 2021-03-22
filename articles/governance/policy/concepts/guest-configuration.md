---
title: Learn to audit the contents of virtual machines
description: Learn how Azure Policy uses the Guest Configuration client to audit settings inside virtual machines.
ms.date: 01/14/2021
ms.topic: conceptual
---
# Understand Azure Policy's Guest Configuration


Azure Policy can audit settings inside a machine, both for machines running in Azure and
[Arc Connected Machines](../../../azure-arc/servers/overview.md). The validation is performed by the
Guest Configuration extension and client. The extension, through the client, validates settings such
as:

- The configuration of the operating system
- Application configuration or presence
- Environment settings

At this time, most Azure Policy Guest Configuration policy definitions only audit settings inside
the machine. They don't apply configurations. The exception is one built-in policy
[referenced below](#applying-configurations-using-guest-configuration).

[A video walk-through of this document is available](https://youtu.be/Y6ryD3gTHOs).

## Enable Guest Configuration

To audit the state of machines in your environment, including machines in Azure and Arc Connected
Machines, review the following details.

## Resource provider

Before you can use Guest Configuration, you must register the resource provider. If assignment of a Guest Configuration policy is done through
the portal, or if the subscription is enrolled in Azure Security Center, the resource
provider is registered automatically. You can manually register through the
[portal](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal),
[Azure PowerShell](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell),
or
[Azure CLI](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-cli).

## Deploy requirements for Azure virtual machines

To audit settings inside a machine, a
[virtual machine extension](../../../virtual-machines/extensions/overview.md) is enabled and the
machine must have a system-managed identity. The extension downloads applicable policy assignment
and the corresponding configuration definition. The identity is used to authenticate the machine as
it reads and writes to the Guest Configuration service. The extension isn't required for Arc
Connected Machines because it's included in the Arc Connected Machine agent.

> [!IMPORTANT]
> The Guest Configuration extension and a managed identity is required to audit Azure virtual
> machines. To deploy the extension at scale, assign the following policy initiative:
> 
> `Deploy prerequisites to enable Guest Configuration policies on virtual machines`

### Limits set on the extension

To limit the extension from impacting applications running inside the machine, the Guest
Configuration isn't allowed to exceed more than 5% of CPU. This limitation exists for both built-in
and custom definitions. The same is true for the Guest Configuration service in Arc Connected
Machine agent.

### Validation tools

Inside the machine, the Guest Configuration client uses local tools to run the audit.

The following table shows a list of the local tools used on each supported operating system. For
built-in content, Guest Configuration handles loading these tools automatically.

|Operating system|Validation tool|Notes|
|-|-|-|
|Windows|[PowerShell Desired State Configuration](/powershell/scripting/dsc/overview/overview) v2| Side-loaded to a folder only used by Azure Policy. Won't conflict with Windows PowerShell DSC. PowerShell Core isn't added to system path.|
|Linux|[Chef InSpec](https://www.chef.io/inspec/)| Installs Chef InSpec version 2.2.61 in default location and added to system path. Dependencies for the InSpec package including Ruby and Python are installed as well. |

### Validation frequency

The Guest Configuration client checks for new or changed guest assignments every 5 minutes. Once a guest assignment is
received, the settings for that configuration are rechecked on a 15-minute interval. Results are
sent to the Guest Configuration resource provider when the audit completes. When a policy
[evaluation trigger](../how-to/get-compliance-data.md#evaluation-triggers) occurs, the state of the
machine is written to the Guest Configuration resource provider. This update causes Azure Policy to
evaluate the Azure Resource Manager properties. An on-demand Azure Policy evaluation retrieves the
latest value from the Guest Configuration resource provider. However, it doesn't trigger a new audit
of the configuration within the machine. The status is simultaneously written to Azure Resource Graph.

## Supported client types

Guest Configuration policy definitions are inclusive of new versions. Older versions of operating
systems available in Azure Marketplace are excluded if the Guest Configuration client isn't
compatible. The following table shows a list of supported operating systems on Azure images:

|Publisher|Name|Versions|
|-|-|-|
|Canonical|Ubuntu Server|14.04 - 20.04|
|Credativ|Debian|8 - 10|
|Microsoft|Windows Server|2012 - 2019|
|Microsoft|Windows Client|Windows 10|
|OpenLogic|CentOS|7.3 -8|
|Red Hat|Red Hat Enterprise Linux|7.4 - 8|
|Suse|SLES|12 SP3-SP5, 15|

Custom virtual machine images are supported by Guest Configuration policy definitions as long as
they're one of the operating systems in the table above.

## Network requirements

Virtual machines in Azure can use either their local network adapter or a private link to
communicate with the Guest Configuration service.

Azure Arc machines connect using the on-premises network infrastructure to reach Azure services and
report compliance status.

### Communicate over virtual networks in Azure

Virtual machines using virtual networks for communication will require outbound access to Azure
datacenters on port `443`. If you're using a private virtual network in Azure that doesn't allow
outbound traffic, configure exceptions with Network Security Group rules. The service tag
"GuestAndHybridManagement" can be used to reference the Guest Configuration service.

### Communicate over private link in Azure

Virtual machines can use [private link](../../../private-link/private-link-overview.md) for
communication to the Guest Configuration service. Apply tag with the name `EnablePrivateNeworkGC`
(with no "t" in Network) and value `TRUE` to enable this feature. The tag can be applied before
or after Guest Configuration policy definitions are applied to the machine.

Traffic is routed using the Azure
[virtual public IP address](../../../virtual-network/what-is-ip-address-168-63-129-16.md) to
establish a secure, authenticated channel with Azure platform resources.

### Azure Arc connected machines

Nodes located outside Azure that are connected by Azure Arc require connectivity to the Guest
Configuration service. Details about network and proxy requirements provided in the
[Azure Arc documentation](../../../azure-arc/servers/overview.md).

To communicate with the Guest Configuration resource provider in Azure, machines require outbound
access to Azure datacenters on port **443**. If a network in Azure doesn't allow outbound traffic,
configure exceptions with [Network Security
Group](../../../virtual-network/manage-network-security-group.md#create-a-security-rule) rules. The
[service tag](../../../virtual-network/service-tags-overview.md) "GuestAndHybridManagement" can be
used to reference the Guest Configuration service.

For Arc connected servers in private datacenters, allow traffic using the following patterns:

- Port: Only TCP 443 required for outbound internet access
- Global URL: `*.guestconfiguration.azure.com`

## Managed identity requirements

Policy definitions in the initiative _Deploy prerequisites to enable Guest Configuration policies on
virtual machines_ enable a system-assigned managed identity, if one doesn't exist. There are two
policy definitions in the initiative that manage identity creation. The IF conditions in the policy
definitions ensure the correct behavior based on the current state of the machine resource in Azure.

If the machine doesn't currently have any managed identities, the effective policy will be:
[Add system-assigned managed identity to enable Guest Configuration assignments on virtual machines with no identities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3cf2ab00-13f1-4d0c-8971-2ac904541a7e)

If the machine currently has a user-assigned system identity, the effective policy will be:
[Add system-assigned managed identity to enable Guest Configuration assignments on VMs with a user-assigned identity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F497dff13-db2a-4c0f-8603-28fa3b331ab6)

## Guest Configuration definition requirements

Guest Configuration policy definitions use the **AuditIfNotExists** effect. When the definition is
assigned, a back-end service automatically handles the lifecycle of all requirements in the
`Microsoft.GuestConfiguration` Azure resource provider.

The **AuditIfNotExists** policy definitions won't return compliance results until all requirements
are met on the machine. The requirements are described in section
[Deploy requirements for Azure virtual machines](#deploy-requirements-for-azure-virtual-machines)

> [!IMPORTANT]
> In a prior release of Guest Configuration, an initiative was required to combine
> **DeployIfNoteExists** and **AuditIfNotExists** definitions. **DeployIfNotExists** definitions are
> no longer required. The definitions and initiatives are labeled `[Deprecated]` but existing
> assignments will continue to function. For information see the blog post:
> [Important change released for Guest Configuration audit policies](https://techcommunity.microsoft.com/t5/azure-governance-and-management/important-change-released-for-guest-configuration-audit-policies/ba-p/1655316)

### What is a Guest Assignment?

When an Azure Policy is assigned, if it's in the category "Guest Configuration"
there's metadata included to describe a Guest Assignment.
You can think of a Guest Assignment as a link between a machine and an Azure Policy scenario.
For example, the snippet below associates the Azure Windows Baseline configuration
with minimum version `1.0.0` to any machines in scope of the policy. By default,
the Guest Assignment will only perform an audit of the machine.

```json
"metadata": {
    "category": "Guest Configuration",
    "guestConfiguration": {
        "name": "AzureWindowsBaseline",
        "version": "1.*"
    }
//additional metadata properties exist
```

Guest Assignments are created automatically per machine by the Guest Configuration
service. The resource type is `Microsoft.GuestConfiguration/guestConfigurationAssignments`.
Azure Policy uses the **complianceStatus** property of the Guest Assignment resource
to report compliance status. For more information, see [getting compliance
data](../how-to/get-compliance-data.md).

#### Auditing operating system settings following industry baselines

One initiative in Azure Policy audits operating system settings following a "baseline". The
definition, _\[Preview\]: Windows machines should meet requirements for the Azure security baseline_
includes a set of rules based on Active Directory Group Policy.

Most of the settings are available as parameters. Parameters allow you to customize what is audited.
Align the policy with your requirements or map the policy to third-party information such as
industry regulatory standards.

Some parameters support an integer value range. For example, the Maximum Password Age setting could
audit the effective Group Policy setting. A "1,70" range would confirm that users are required to
change their passwords at least every 70 days, but no less than one day.

If you assign the policy using an Azure Resource Manager template (ARM template), use a parameters
file to manage exceptions. Check in the files to a version control system such as Git. Comments
about file changes provide evidence why an assignment is an exception to the expected value.

#### Applying configurations using Guest Configuration

Only the definition _Configure the time zone on Windows machines_ makes changes to the machine by
configuring the time zone. Custom policy definitions for configuring settings inside machines aren't
supported.

When assigning definitions that begin with _Configure_, you must also assign the definition _Deploy
prerequisites to enable Guest Configuration Policy on Windows VMs_. You can combine these
definitions in an initiative if you choose.

> [!NOTE]
> The built-in time zone policy is the only definition that supports configuring settings inside
> machines and custom policy definitions that configure settings inside machines aren't supported.

#### Assigning policies to machines outside of Azure

The Audit policy definitions available for Guest Configuration include the
**Microsoft.HybridCompute/machines** resource type. Any machines onboarded to
[Azure Arc for servers](../../../azure-arc/servers/overview.md) that are in the scope of the policy
assignment are automatically included.

## Troubleshooting guest configuration

For more information about troubleshooting Guest Configuration, see
[Azure Policy troubleshooting](../troubleshoot/general.md).

### Multiple assignments

Guest Configuration policy definitions currently only support assigning the same Guest Assignment
once per machine, even if the Policy assignment uses different parameters.

### Client log files

The Guest Configuration extension writes log files to the following locations:

Windows: `C:\ProgramData\GuestConfig\gc_agent_logs\gc_agent.log`

Linux: `/var/lib/GuestConfig/gc_agent_logs/gc_agent.log`

### Collecting logs remotely

The first step in troubleshooting Guest Configuration configurations or modules should be to use the
`Test-GuestConfigurationPackage` cmdlet following the steps how to
[create a custom Guest Configuration audit policy for Windows](../how-to/guest-configuration-create.md#step-by-step-creating-a-custom-guest-configuration-audit-policy-for-windows).
If that isn't successful, collecting client logs can help diagnose issues.

#### Windows

Capture information from log files using
[Azure VM Run Command](../../../virtual-machines/windows/run-command.md), the following example
PowerShell script can be helpful.

```powershell
$linesToIncludeBeforeMatch = 0
$linesToIncludeAfterMatch = 10
$logPath = 'C:\ProgramData\GuestConfig\gc_agent_logs\gc_agent.log'
Select-String -Path $logPath -pattern 'DSCEngine','DSCManagedEngine' -CaseSensitive -Context $linesToIncludeBeforeMatch,$linesToIncludeAfterMatch | Select-Object -Last 10
```

#### Linux

Capture information from log files using
[Azure VM Run Command](../../../virtual-machines/linux/run-command.md), the following example Bash
script can be helpful.

```Bash
linesToIncludeBeforeMatch=0
linesToIncludeAfterMatch=10
logPath=/var/lib/GuestConfig/gc_agent_logs/gc_agent.log
egrep -B $linesToIncludeBeforeMatch -A $linesToIncludeAfterMatch 'DSCEngine|DSCManagedEngine' $logPath | tail
```

### Client files

The Guest Configuration client downloads content packages to a machine and extracts the contents.
To verify what content has been downloaded and stored, view the folder locations given below.

Windows: `c:\programdata\guestconfig\configurations`

Linux: `/var/lib/guestconfig/configurations`

## Guest Configuration samples

Guest Configuration built-in policy samples are available in the following locations:

- [Built-in policy definitions - Guest Configuration](../samples/built-in-policies.md#guest-configuration)
- [Built-in initiatives - Guest Configuration](../samples/built-in-initiatives.md#guest-configuration)
- [Azure Policy samples GitHub repo](https://github.com/Azure/azure-policy/tree/master/built-in-policies/policySetDefinitions/Guest%20Configuration)

### Video overview

The following overview of Azure Policy Guest Configuration is from ITOps Talks 2021.

[Governing baselines in hybrid server environments using Azure Policy Guest Configuration](https://techcommunity.microsoft.com/t5/itops-talk-blog/ops114-governing-baselines-in-hybrid-server-environments-using/ba-p/2109245)

## Next steps

- Learn how to view the details each setting from the
  [Guest Configuration compliance view](../how-to/determine-non-compliance.md#compliance-details-for-guest-configuration)
- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](./definition-structure.md).
- Review [Understanding policy effects](./effects.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with
  [Organize your resources with Azure management groups](../../management-groups/overview.md).
