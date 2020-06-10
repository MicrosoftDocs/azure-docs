---
title: Learn to audit the contents of virtual machines
description: Learn how Azure Policy uses the Guest Configuration agent to audit settings inside virtual machines.
ms.date: 05/20/2020
ms.topic: conceptual
---
# Understand Azure Policy's Guest Configuration

Azure Policy can audit settings inside a machine. The validation is performed by the Guest Configuration
extension and client. The extension, through the client, validates settings such as:

- The configuration of the operating system
- Application configuration or presence
- Environment settings

At this time, most Azure Policy Guest Configuration policies only audit settings inside the machine.
They don't apply configurations. The exception is one built-in policy
[referenced below](#applying-configurations-using-guest-configuration).

## Resource provider

Before you can use Guest Configuration, you must register the resource provider. The resource
provider is registered automatically if assignment of a Guest Configuration policy is done through
the portal. You can manually register through the
[portal](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal),
[Azure PowerShell](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell),
or
[Azure CLI](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-cli).

## Extension and client

To audit settings inside a machine, a
[virtual machine extension](../../../virtual-machines/extensions/overview.md) is enabled. The
extension downloads applicable policy assignment and the corresponding configuration definition.

> [!IMPORTANT]
> The Guest Configuration extension is required to perform audits in Azure virtual machines. To
> deploy the extension at scale, assign the following policy definitions: 
>  - [Deploy prerequisites to enable Guest Configuration Policy on Windows VMs.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0ecd903d-91e7-4726-83d3-a229d7f2e293)
>  - [Deploy prerequisites to enable Guest Configuration Policy on Linux VMs.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffb27e9e0-526e-4ae1-89f2-a2a0bf0f8a50)

### Limits set on the extension

To limit the extension from impacting applications running inside the machine, the Guest
Configuration isn't allowed to exceed more than 5% of CPU. This limitation exists for both built-in
and custom definitions.

### Validation tools

Inside the machine, the Guest Configuration client uses local tools to run the audit.

The following table shows a list of the local tools used on each supported operating system:

|Operating system|Validation tool|Notes|
|-|-|-|
|Windows|[PowerShell Desired State Configuration](/powershell/scripting/dsc/overview/overview) v2| Side-loaded to a folder only used by Azure Policy. Won't conflict with Windows PowerShell DSC. PowerShell Core isn't added to system path.|
|Linux|[Chef InSpec](https://www.chef.io/inspec/)| Installs Chef InSpec version 2.2.61 in default location and added to system path. Dependenices for the InSpec package including Ruby and Python are installed as well. |

### Validation frequency

The Guest Configuration client checks for new content every 5 minutes. Once a guest assignment is
received, the settings for that configuration are rechecked on a 15-minute interval. Results are
sent to the Guest Configuration resource provider when the audit completes. When a policy
[evaluation trigger](../how-to/get-compliance-data.md#evaluation-triggers) occurs, the state of the
machine is written to the Guest Configuration resource provider. This update causes Azure Policy to
evaluate the Azure Resource Manager properties. An on-demand Azure Policy evaluation retrieves the
latest value from the Guest Configuration resource provider. However, it doesn't trigger a new audit
of the configuration within the machine.

## Supported client types

Guest Configuration policies are inclusive of new versions. Older versions of operating systems
available in the Azure Marketplace are excluded if the Guest Configuration agent isn't compatible.
The following table shows a list of supported operating systems on Azure images:

|Publisher|Name|Versions|
|-|-|-|
|Canonical|Ubuntu Server|14.04 and later|
|Credativ|Debian|8 and later|
|Microsoft|Windows Server|2012 and later|
|Microsoft|Windows Client|Windows 10|
|OpenLogic|CentOS|7.3 and later|
|Red Hat|Red Hat Enterprise Linux|7.4 and later|
|Suse|SLES|12 SP3 and later|

Custom virtual machine images are supported by Guest Configuration policies as long as they're one
of the operating systems in the table above.

### Unsupported client types

Windows Server Nano Server isn't supported in any version.

## Guest Configuration Extension network requirements

To communicate with the Guest Configuration resource provider in Azure, machines require outbound
access to Azure datacenters on port **443**. If a network in Azure doesn't allow outbound traffic,
configure exceptions with [Network Security
Group](../../../virtual-network/manage-network-security-group.md#create-a-security-rule) rules. The
[service tag](../../../virtual-network/service-tags-overview.md) "GuestAndHybridManagement" can be
used to reference the Guest Configuration service.

## Managed identity requirements

The **DeployIfNotExists** policies that add the extension to virtual machines also enable a system
assigned managed identity, if one doesn't exist.

> [!WARNING]
> Avoid enabling user assigned managed identity to virtual machines in scope
> for policies that enable system assigned managed identity. The user assigned
> identity is replaced and could machine become unresponsive.

## Guest Configuration definition requirements

Each audit run by Guest Configuration requires two policy definitions, a **DeployIfNotExists**
definition and an **AuditIfNotExists** definition. The **DeployIfNotExists** policy definitions manage dependencies
for performing audits on each machine.

The **DeployIfNotExists** policy definition validates and corrects the following items:

- Validate the machine has been assigned a configuration to evaluate. If no assignment is currently
  present, get the assignment and prepare the machine by:
  - Authenticating to the machine using a
    [managed identity](../../../active-directory/managed-identities-azure-resources/overview.md)
  - Installing the latest version of the **Microsoft.GuestConfiguration** extension
  - Installing [validation tools](#validation-tools) and dependencies, if needed

If the **DeployIfNotExists** assignment is Non-compliant, a [remediation
task](../how-to/remediate-resources.md#create-a-remediation-task) can be used.

Once the **DeployIfNotExists** assignment is Compliant, the **AuditIfNotExists** policy assignment
determines if the guest assignment is Compliant or Non-compliant. The validation tool provides the
results to the Guest Configuration client. The client forwards the results to the Guest Extension,
which makes them available through the Guest Configuration resource provider.

Azure Policy uses the Guest Configuration resource providers **complianceStatus** property to report
compliance in the **Compliance** node. For more information, see [getting compliance
data](../how-to/get-compliance-data.md).

> [!NOTE]
> The **DeployIfNotExists** policy is required for the **AuditIfNotExists** policy to return
> results. Without the **DeployIfNotExists**, the **AuditIfNotExists** policy shows "0 of 0"
> resources as status.

All built-in policies for Guest Configuration are included in an initiative to group the definitions
for use in assignments. The built-in initiative named _\[Preview\]: Audit Password security inside
Linux and Windows machines_ contains 18 policies. There are six **DeployIfNotExists** and
**AuditIfNotExists** pairs for Windows and three pairs for Linux. The
[policy definition](definition-structure.md#policy-rule) logic validates that only the target
operating system is evaluated.

#### Auditing operating system settings following industry baselines

One initiative in Azure Policy provides the ability to audit operating system settings following a
"baseline". The definition, _\[Preview\]: Audit Windows VMs that do not match Azure security
baseline settings_ includes a set of rules based on Active Directory Group Policy.

Most of the settings are available as parameters. Parameters allow you to customize what is audited.
Align the policy with your requirements or map the policy to third-party information such as
industry regulatory standards.

Some parameters support an integer value range. For example, the Maximum Password Age setting could
audit the effective Group Policy setting. A "1,70" range would confirm that users are required to
change their passwords at least every 70 days, but no less than one day.

If you assign the policy using an Azure Resource Manager deployment template, use a parameters file
to manage exceptions. Check in the files to a version control system such as Git. Comments about
file changes provide evidence why an assignment is an exception to the expected value.

#### Applying configurations using Guest Configuration

The latest feature of Azure Policy configures settings inside machines. The definition _Configure
the time zone on Windows machines_ makes changes to the machine by configuring the time zone.

When assigning definitions that begin with _Configure_, you must also assign the definition _Deploy
prerequisites to enable Guest Configuration Policy on Windows VMs_. You can combine these
definitions in an initiative if you choose.

#### Assigning policies to machines outside of Azure

The Audit policies available for Guest Configuration include the
**Microsoft.HybridCompute/machines** resource type. Any machines onboarded to
[Azure Arc for servers](../../../azure-arc/servers/overview.md) that are in the scope of the policy
assignment are automatically included.

### Multiple assignments

Guest Configuration policies currently only support assigning the same Guest Assignment once per
machine, even if the Policy assignment uses different parameters.

## Client log files

The Guest Configuration extension writes log files to the following locations:

Windows: `C:\ProgramData\GuestConfig\gc_agent_logs\gc_agent.log`

Linux: `/var/lib/GuestConfig/gc_agent_logs/gc_agent.log`

Where `<version>` refers to the current version number.

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

## Guest Configuration samples

Guest Configuration built-in policy samples are available in the following locations:

- [Built-in policy definitions - Guest Configuration](../samples/built-in-policies.md#guest-configuration)
- [Built-in initiatives - Guest Configuration](../samples/built-in-initiatives.md#guest-configuration)
- [Azure Policy samples GitHub repo](https://github.com/Azure/azure-policy/tree/master/built-in-policies/policySetDefinitions/Guest%20Configuration)

## Next steps

- Learn how to view the details each setting from the [Guest Configuration compliance view](../how-to/determine-non-compliance.md#compliance-details-for-guest-configuration)
- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](definition-structure.md).
- Review [Understanding policy effects](effects.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
